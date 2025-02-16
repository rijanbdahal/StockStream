// routes/locationAuth.js
const express = require('express');
const router = express.Router();
const Location = require("../models/Location");

router.get("/:locationId", async (req, res) => {
    const { locationId } = req.params;
    if (!locationId) {
        return res.status(400).json({ msg: "Invalid Location" });
    }

    try {
        const location = await Location.findOne({ locationId: locationId });
        if (!location) {
            return res.status(404).json({ msg: "Location not found" });
        }
        res.json(location);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.put("/:locationId/changeStatus", async (req, res) => {
    console.log(`Received request to change status for locationId: ${req.params.locationId}`);

    const { locationId } = req.params;
    try {
        const location = await Location.findOne({ locationId });

        if (!location) {
            console.log(`Location ${locationId} not found`);
            return res.status(404).json({ msg: "Location not found" });
        }

        location.status = !location.status;

        await location.save();

        console.log(`Updated status for ${locationId} to ${location.status}`);
        res.json({ msg: "Status updated", status: location.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
