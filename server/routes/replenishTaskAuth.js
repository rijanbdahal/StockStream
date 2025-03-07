const express = require('express');
const router = express.Router();
const PickingPallet = require('../models/PickingPallet');
const Location = require('../models/Location');
const Product = require("../models/Product");
const Pallet = require("../models/Pallet");
const ReplenishPallet = require("../models/palletInfo");
const PalletInfo = require("../models/palletInfo");

router.get('/gettask', async (req, res) => {
    try {
        const pickingPallet = await PickingPallet.findOne({ Quantity: 0 });
        console.log(pickingPallet);
        if (!pickingPallet) {
            return res.status(400).json({ msg: "No task to display" });
        }

        const product = await Product.findOne({ productID: pickingPallet.productId });
        const pallet = await Pallet.findOne({ productID: pickingPallet.productId });



        if (!pallet) {
            return res.status(400).json({ msg: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: pallet.locationId });

        if (!location) {
            return res.status(400).json({ msg: "Invalid location" });
        }

        res.json({ pickingPallet, location });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ msg: 'Error Getting Task' });
    }
});

router.get('/skip', async (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * 5);

        const pickingPallet = await PickingPallet.findOne({ Quantity: 0 }).skip(randomIndex);

        if (!pickingPallet) {
            return res.status(400).json({ msg: "No task to display" });
        }

        const product = await Product.findOne({ productID: pickingPallet.productId });
        const pallet = await Pallet.findOne({ productID: pickingPallet.productId });



        if (!pallet) {
            return res.status(400).json({ msg: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: pallet.locationId });

        if (!location) {
            return res.status(400).json({ msg: "Invalid location" });
        }

        res.json({ pickingPallet, location });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ msg: 'Error Getting Task' });
    }
});

// Verify Pallet ID and find the reserve location
router.post('/verifypalletid', async (req, res) => {
    const { palletId } = req.body;


    const palletIDNumber = parseInt(palletId, 10);
    console.log(palletIDNumber)
    if (isNaN(palletIDNumber)) {
        return res.status(400).json({ msg: "Invalid pallet ID format" });
    }

    try {
        const pallet = await Pallet.findOne({ palletID: palletIDNumber });

        if (!pallet) {
            return res.status(400).json({ msg: "Pallet not found" });
        }

        const pickingPallet = await PickingPallet.findOne({ productId: pallet.productID });

        if (!pickingPallet) {
            return res.status(400).json({ msg: "Picking pallet not found" });
        }

        res.json({ toLocationId: pickingPallet.locationId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});


router.post('/verifycheckdigit', async (req, res) => {
    const { toLocationId, checkDigit, palletId } = req.body;

    console.log(req.body);
    const CheckDigit = parseInt(checkDigit, 10);
    const palletID = parseInt(palletId, 10);


    try {
        const pallet = await Pallet.findOne({ palletID: palletID });
        console.log(CheckDigit);
        if (!pallet) {
            return res.status(400).json({ msg: "Pallet not found" });
        }

        const location = await Location.findOne({ locationId: toLocationId });
        const pickingPallet = await PickingPallet.findOne({locationId: toLocationId });
        if (!pickingPallet) {
            return res.status(400).json({ msg: "Picking pallet not found" });
        }

        if (!location) {
            return res.status(400).json({ msg: "Invalid location" });
        }

        if (CheckDigit === (location.checkDigit)) {
// Create and save pallet information before deletion
            const palletInfo = new PalletInfo({
                productID: pallet.productID,
                palletID: pallet.palletID,
                lotNumber: pallet.lotNumber,
                totalCases: pallet.totalCases,
                consignmentID: pallet.consignmentID,
                Ti: pallet.Ti,
                Hi: pallet.Hi,
                createdAt: pallet.createdAt,
                locationId: pallet.locationId,
                expiryDate: pallet.expiryDate,
            });

            await palletInfo.save();


            palletInfo.locationId = location.locationId;
            await palletInfo.save();


            pickingPallet.Quantity = palletInfo.totalCases;
            location.status = false;


            await pickingPallet.save();
            await location.save();

// Delete the original pallet
            await Pallet.deleteOne({ palletID: pallet.palletID });

            return res.status(200).json({ msg: "Verified successfully!" });



        } else {
            return res.status(400).json({ msg: "Incorrect check digit" });
        }
    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});


module.exports = router;
