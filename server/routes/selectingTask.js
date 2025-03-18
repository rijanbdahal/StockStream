const express = require("express");
const router = express.Router();
const PickingOrder = require("../models/pickingTask");
const Product = require("../models/product");
const PickingPallet = require("../models/pickingPallet");
const PickingTask = require("../models/pickingTask");



router.get("/details", async (req, res) => {
    try {
        const selectingTask = await PickingTask.findOne({ completedStatus: false, assignedStatus: false }).sort({ toBeFulfilledBy: 1 });

        if (!selectingTask) {
            return res.status(404).json({ error: "No Task Available!" });
        }

        res.json({
            taskId: selectingTask.taskId,
            storeId: selectingTask.storeNumber,
            totalCases: selectingTask.totalCases,
            totalStop: selectingTask.totalStop,
            totalPallets: selectingTask.totalPallets,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Error getting Selecting Task Details." });
    }
});



module.exports = router;
