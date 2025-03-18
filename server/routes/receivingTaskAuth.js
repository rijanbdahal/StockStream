const express = require("express");
const Pallet = require("../models/pallet");
const Docking = require("../models/docking");
const Product = require("../models/product");
const Location = require("../models/location");
const router = express.Router();


const assignLocation = async () => {
    try {
        const availableLocation = await Location.findOne({
            status: true,
            columnNumber: { $nin: ['10','14',,'18', '11','15','19'] }
        });

        console.log("Available location:", availableLocation);

        if (!availableLocation) {
            throw new Error("No available locations for storage.");
        }

        availableLocation.status = false;
        await availableLocation.save();

        return availableLocation.locationId;
    } catch (error) {
        console.error("Error in assignLocation:", error.message);
        throw error;
    }
};

// Receiving Route - Assign a location to the pallet
router.post("/", async (req, res) => {
    const { consignmentID, productID, palletID, lotNumber, totalCases, Ti, Hi, expiryDate } = req.body;

    try {
        if (!consignmentID || !productID || !palletID || !lotNumber || !totalCases || !Ti || !Hi || !expiryDate) {
            return res.status(400).json({ error: "Missing Fields. Please check your data." });
        }


        const consignment = await Docking.findOne({ consignmentID });
        if (!consignment) {
            return res.status(400).json({ error: "Consignment ID Invalid" });
        }


        const product = await Product.findOne({ productID });
        if (!product) {
            return res.status(400).json({ error: "No product found with provided ID" });
        }

        // Assign a storage location
        const assignedLocation = await assignLocation();

        // Create a new pallet entry with the assigned location
        const newPalletEntry = new Pallet({
            consignmentID,
            productID,
            palletID,
            lotNumber,
            totalCases,
            Ti,
            Hi,
            expiryDate,
            locationId: assignedLocation,
            createdAt: new Date(),
        });

        await newPalletEntry.save();

        res.status(201).json({
            msg: "Pallet entry added successfully!",
            assignedLocation,
            data: newPalletEntry,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Server error. Please try again later." });
    }
});

router.get("/products/:consignmentId", async (req, res) => {
    try {

        const { consignmentId } = req.params;
        console.log(consignmentId);

        // Corrected the query to match the actual field name
        const docking = await Docking.findOne({ consignmentID: consignmentId });

        if (!docking) {
            return res.status(404).json({ error: "No docking entry found for this consignment ID" });
        }

        const products = await Product.find({productID: docking.products});

        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

module.exports = router;
