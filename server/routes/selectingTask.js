const express = require("express");
const router = express.Router();
const PickingOrder = require("../models/PickingOrder");
const Product = require("../models/Product");
const PickingPallet = require("../models/PickingPallet");

router.get("/details", async (req, res) => {
    try {
        const selectingTask = await PickingOrder.findOne({ assignedStatus: false, completedStatus: false });

        if (!selectingTask) {
            return res.status(200).json({ error: "No Task Available!" });
        }

        await selectingTask.save(); // Ensure the change is persisted

        res.json({
            taskId: selectingTask.orderNumber,
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

router.post("/:taskId",async (req, res) => {
    const {taskId} = req.params;

    try{
        const selectingTask = await PickingOrder.findOne({orderNumber:taskId});
        if (!selectingTask) {
            return res.status(400).json({ error: "Task Not Found" });
        }
        else{
            selectingTask.assignedStatus = true;
            await selectingTask.save();
        }
    }
    catch(err){
        console.error(err);
    }
});

router.post("/pickingproductdetails",async (req, res) => {
    try{
        const productId
    }
})

module.exports = router;
