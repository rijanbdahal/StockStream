const express = require("express");
const router = express.Router();
const PickingPallet = require("../models/pickingPallet");
const Location = require("../models/location");
const Product = require("../models/product");
const Pallet = require("../models/pallet");
const PalletInfo = require("../models/palletInfo");

router.get("/gettask", async (req, res) => {
    try {
        const pickingPallet = await PickingPallet.findOne({ Quantity: 0 });
        if (!pickingPallet) {
            return res.status(404).json({ error: "No task to display" });
        }

        const pallet = await Pallet.findOne({ productID: pickingPallet.productId });
        if (!pallet) {
            return res.status(404).json({ error: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: pallet.locationId });
        if (!location) {
            return res.status(400).json({ error: "Invalid location" });
        }

        return res.json({ pickingPallet, location });
    } catch (err) {
        console.error("Error Getting Task:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/skip", async (req, res) => {
    try {
        const pickingPallet = await PickingPallet.find({ Quantity: 0 }).sort({ _id: 1 }).limit(1);
        if (!pickingPallet.length) {
            return res.status(404).json({ error: "No task to display" });
        }

        const pallet = await Pallet.findOne({ productID: pickingPallet[0].productId });
        if (!pallet) {
            return res.status(404).json({ error: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: pallet.locationId });
        if (!location) {
            return res.status(400).json({ error: "Invalid location" });
        }

        return res.json({ pickingPallet: pickingPallet[0], location });
    } catch (err) {
        console.error("Error Skipping Task:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/verifypalletid", async (req, res) => {
    const { palletId } = req.body;

    const palletIDNumber = parseInt(palletId, 10);
    if (isNaN(palletIDNumber)) {
        return res.status(400).json({ error: "Invalid pallet ID format" });
    }

    try {
        const pallet = await Pallet.findOne({ palletID: palletIDNumber });
        const locationId = pallet.locationId;
        const location = await Location.findOne({locationId:locationId});
        location.status = true;
        location.save();
        if (!pallet) {
            return res.status(404).json({ error: "Pallet not found" });
        }

        const pickingPallet = await PickingPallet.findOne({ productId: pallet.productID });
        if (!pickingPallet) {
            return res.status(404).json({ error: "Picking pallet not found" });
        }


        return res.json({ toLocationId: pickingPallet.locationId });
    } catch (err) {
        console.error("Error Verifying Pallet ID:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/verifycheckdigit", async (req, res) => {
    const { toLocationId, checkDigit, palletId } = req.body;

    const CheckDigit = parseInt(checkDigit, 10);
    const palletID = parseInt(palletId, 10);

    try {
        const pallet = await Pallet.findOne({ palletID });
        if (!pallet) {
            return res.status(404).json({ error: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: toLocationId });
        if (!location) {
            return res.status(400).json({ error: "Invalid location" });
        }

        const pickingPallet = await PickingPallet.findOne({ locationId: toLocationId });
        if (!pickingPallet) {
            return res.status(404).json({ error: "Picking pallet not found" });
        }

        if (CheckDigit !== location.checkDigit) {
            return res.status(400).json({ error: "Incorrect check digit" });
        }


        const palletInfo = new PalletInfo({
            productID: pallet.productID,
            palletID: pallet.palletID,
            lotNumber: pallet.lotNumber,
            totalCases: pallet.totalCases,
            consignmentID: pallet.consignmentID,
            Ti: pallet.Ti,
            Hi: pallet.Hi,
            createdAt: pallet.createdAt,
            locationId: location.locationId,
            expiryDate: pallet.expiryDate,
        });

        await palletInfo.save();


        pickingPallet.Quantity = palletInfo.totalCases;
        location.status = false;

        await pickingPallet.save();
        await location.save();


        await Pallet.deleteOne({ palletID });

        return res.status(200).json({ success: true, message: "Verified successfully!" });
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
