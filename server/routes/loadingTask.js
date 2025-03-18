const express = require('express');
const router = express.Router();
const LoadingOrder = require("../models/loadingOrder");
const StagingLocation = require("../models/stagingLocation");
const PickingOrder = require("../models/pickingOrder");

router.post("/handleSubmit", async (req, res) => {
    const { loadingId, palletId } = req.body;

    console.log("Loading ID:", loadingId);
    console.log("Pallet ID:", palletId);

    try {
        // Find the loading order based on loadingId
        const loadingOrder = await LoadingOrder.findOne({ loadingId: loadingId });
        if (!loadingOrder) {
            return res.status(404).json({ message: "No order found with the given loading ID." });
        }

        // Find the pallet in the loading order
        const pallet = loadingOrder.pallets.find(pallet => Number(pallet.palletId) === Number(palletId));
        if (!pallet) {
            return res.status(404).json({ message: "Pallet ID not found in this loading order." });
        }

        // Mark the pallet as shipped
        pallet.shipped = true;

        // Check if all pallets are shipped
        const allShipped = loadingOrder.pallets.every(pallet => pallet.shipped === true);

        if (allShipped) {
            loadingOrder.isShipped = true;
        }

        // Save the updated loading order
        await loadingOrder.save();

        // Update the staging location availability
        const shippingLane = loadingOrder.stagingLane;
        const stagingLocation = await StagingLocation.findOne({ locationId: shippingLane });
        if (!stagingLocation) {
            return res.status(404).json({ message: "Staging location not found." });
        }
        stagingLocation.availableSpot += loadingOrder.totalPallets;
        await stagingLocation.save();

        // Update the picking order
        const pickingOrder = await PickingOrder.findOne({ orderNumber: loadingOrder.loadingId });
        if (!pickingOrder) {
            return res.status(404).json({ message: "Picking order not found." });
        }
        pickingOrder.shipped = true;
        await pickingOrder.save();

        // Return success message
        return res.status(200).json({
            message: "Pallet marked as shipped.",
            orderShipped: allShipped
        });
    } catch (error) {
        // Catch any unexpected errors
        console.error(error);
        return res.status(500).json({ message: "An error occurred while processing the request." });
    }
});

module.exports = router;
