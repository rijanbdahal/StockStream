const express = require('express');
const router = express.Router();
const Pallet = require("../models/pallet");
const Location = require("../models/location");

router.get("/:palletID", async (req, res) => {
    const { palletID } = req.params;

    if (!palletID) {
        return res.status(400).json({ msg: 'Invalid request: Pallet ID is required' });
    }

    try {
        const pallet = await Pallet.findOne({ palletID });

        if (!pallet) {
            return res.status(404).json({ msg: 'Pallet ID Not Found' });
        }

        return res.status(200).json({ locationId: pallet.locationId });
    } catch (err) {
        console.error("Error fetching pallet ID:", err);
        return res.status(500).json({ error: err.message });
    }
});

router.post("/locationAuth", async (req, res) => {
    const { locationId, checkDigit } = req.body;
    console.log("🔍 Received Request Body:", req.body);

    if (!locationId || !checkDigit) {
        return res.status(400).json({ msg: 'Invalid request: Both locationId and checkDigit are required' });
    }

    try {
        const location = await Location.findOne({ locationId:locationId });

        if (!location) {
            return res.status(404).json({ msg: 'Location not found' });
        }

        if (Number(checkDigit) === Number(location.checkDigit)) {
            return res.status(200).json({ msg: 'Successfully Completed!' });
        } else {
            return res.status(400).json({ msg: 'Wrong Check Digit' });
        }
    } catch (err) {
        console.error("Error checking location auth:", err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
