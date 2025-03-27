const express = require('express');
const router = express.Router();
const Manufacturer = require('../models/manufacturer');
const Product = require('../models/product');
const Docking = require('../models/docking');

// Fetch manufacturers
router.get('/manufacturer', async (req, res) => {
    try {
        const manufacturers = await Manufacturer.find();
        res.json(manufacturers);
    } catch (err) {
        console.error("Error fetching manufacturers:", err);
        return res.status(500).json({ error: "Failed to fetch manufacturers." });
    }
});

// Fetch products
router.get('/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Failed to fetch products." });
    }
});

// Add a new docking entry
router.post('/dockingentry', async (req, res) => {
    const dockingEntry = req.body;
    console.log("Received Docking Entry:", dockingEntry); // Debugging

    try {

        // Convert product IDs from strings to integers
        const productIds = dockingEntry.products.map(p => parseInt(p, 10));
        // Fetch product documents to ensure they exist in the database
        const productDocs = await Product.find({ productID: { $in: productIds } });

        if (productDocs.length === 0) {
            return res.status(400).json({ error: "No matching products found in the database." });
        }


        if (
            dockingEntry.products  === null||
            !dockingEntry.consignmentID ||
            !dockingEntry.manufacturerID ||
            dockingEntry.arrivalTime === undefined ||
            dockingEntry.doorNo === undefined ||
            dockingEntry.totalPallets === undefined
        ) {
            return res.status(400).json({ error: "Missing required fields. Please check your data." });
        }


        if (isNaN(new Date(dockingEntry.arrivalTime))) {
            return res.status(400).json({ error: "Invalid arrival time." });
        }

        // Create new Docking Entry
        const newDockingEntry = new Docking({
            products: productIds,
            consignmentID: parseInt(dockingEntry.consignmentID,10),
            manufacturerID: parseInt(dockingEntry.manufacturerID,10),
            arrivalTime: dockingEntry.arrivalTime,
            totalPallets: parseInt(dockingEntry.totalPallets,10),
            doorNo: parseInt(dockingEntry.doorNo,10)
        });

        console.log("BACKEND",newDockingEntry);

        await newDockingEntry.save();
        res.status(201).json({ message: "Docking entry created successfully!" });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "An error occurred while creating the docking entry." });
    }
});
module.exports = router;
