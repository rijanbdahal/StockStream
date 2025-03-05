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
            rowNumber: { $ne: '10' }
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

        // Check if the consignment exists
        const consignment = await Docking.findOne({ consignmentID });
        if (!consignment) {
            return res.status(400).json({ msg: "No consignment ID found" });
        }

        // Check if the product exists
        const product = await Product.findOne({ productID });
        if (!product) {
            return res.status(400).json({ msg: "No product found" });
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

module.exports = router;
