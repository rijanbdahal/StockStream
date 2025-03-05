const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Location = require('../models/location');
const PickingPallet = require('../models/pickingPallet');

// POST request to assign product to location
router.post('/', async (req, res) => {
    const { productId, locationId } = req.body;

    if (!productId || !locationId) {
        return res.status(400).json({ msg: 'Incomplete Details' });
    }

    try {
        const pickingPallet = new PickingPallet({
            productId: productId,
            locationId: locationId,
            Quantity: 0,
        });

        await pickingPallet.save(); // Wait for the save to complete
        res.status(200).json({ msg: 'Product location assigned successfully' }); // Send success response

    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: 'Problem with data entry' });
    }
});

// GET request to retrieve all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products); // Return products in JSON format
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching products' });
    }
});

module.exports = router;
