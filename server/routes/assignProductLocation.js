const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Location = require("../models/location");
const PickingPallet = require("../models/pickingPallet");

// POST request to assign product to location
router.post("/", async (req, res) => {
    const { productId, locationId } = req.body;

    if (!productId || !locationId) {
        return res.status(400).json({ msg: "Incomplete Details" });
    }

    try {
        const location = await Location.findOne({ locationId, status: true });

        if (!location) {
            return res.status(400).json({ msg: "Location is unavailable, Try a different location!" });
        }

        // Check if product is already assigned to this location
        const existingPickingPallet = await PickingPallet.findOne({ productId, locationId });
        if (existingPickingPallet) {
            return res.status(400).json({ msg: "This product is already assigned to the selected location!" });
        }

        // Create a new PickingPallet entry
        const pickingPallet = new PickingPallet({
            productId,
            locationId,
            Quantity: 0,
        });

        location.status = false;
        await location.save();

        // Save the picking pallet entry
        await pickingPallet.save();

        res.status(200).json({ msg: "Product location assigned successfully!" });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ msg: "Internal Server Error. Try again later!" });
    }
});

// GET request to retrieve all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ msg: "Error fetching products" });
    }
});

module.exports = router;
