const express = require('express');
const router = express.Router();
const StagingOrder = require('../models/stagingOrder');
const StagingLocation = require('../models/stagingLocation');
const PickingTask = require('../models/pickingTask');

// Route to fetch staging order by taskId
router.get("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log(taskId);

        const stagingOrder = await StagingOrder.findOne({ shippingId:taskId });
        if (!stagingOrder) {
            return res.status(404).json({ message: "No such task found" });
        }

        res.status(200).json(stagingOrder);
    } catch (error) {
        console.error("Error fetching staging order:", error);
        return res.status(500).json({ message: "An error occurred while fetching the staging order" });
    }
});

// Route to verify check digit and update location's available spot
router.post("/verify", async (req, res) => {
    try {
        const { taskId, checkDigit } = req.body;

        // Find the StagingOrder by taskId
        const stagingOrder = await StagingOrder.findOne({shippingId: taskId });
        if (!stagingOrder) {
            return res.status(404).json({ message: "Staging Order not found for this task ID" });
        }

        const realLocationId = stagingOrder.locationId;

        // Find the StagingLocation using the realLocationId
        const location = await StagingLocation.findOne({ locationId: realLocationId });
        if (!location) {
            return res.status(404).json({ message: "Location not found for this location ID" });
        }

        // Check if the checkDigit matches
        const realCheckDigit = location.checkDigits;
        if (realCheckDigit !== checkDigit) {
            return res.status(400).json({ message: "Wrong Check Digit, Try Again!" });
        }

        // Find the PickingTask using taskId
        const pickingTask = await PickingTask.findOne({ taskId:taskId });
        if (!pickingTask) {
            return res.status(404).json({ message: "Picking Task not found for this task ID" });
        }

        // Get the totalPallets from the pickingTask
        const totalPallets = pickingTask.totalPallets;

        // Update availableSpot in the location by decreasing totalPallets
        location.availableSpot = location.availableSpot - totalPallets;

        // Save the updated location
        await location.save();

        // Update the status of StagingOrder to complete
        stagingOrder.status = true;
        await stagingOrder.save();

        return res.status(200).json({ message: "Check digit verified and location updated successfully!" });
    } catch (error) {
        console.error("Error occurred during check digit verification:", error);
        return res.status(500).json({ message: "An error occurred during check digit verification" });
    }
});

module.exports = router;
