const express = require('express');
const router = express.Router();
const PickingOrder = require("../models/pickingOrder");
const PickingTask = require("../models/pickingTask");
const LoadingTask = require("../models/loadingOrder");
const StagingOrder = require("../models/stagingOrder");

router.get('/getOrders', async (req, res) => {

    try {



        const pickingOrder = await PickingOrder.find({completedStatus: true,isShipped:false}).sort({toBeFulfilledBy: -1});
        return res.status(200).json(pickingOrder);

    }
    catch (error) {
        return res.status(500).json({message: "No Orders Available"});
    }

});

router.post('/', async (req, res) => {
    const { orderNumber, truckNumber } = req.body; // Correct destructuring
    const isComplete = false;

    try {

        const pickingOrder = await PickingOrder.findOne({ orderNumber:orderNumber });
        if (!pickingOrder) {
            return res.status(400).json({ message: "Order Not Found" });
        }
        console.log(pickingOrder);

        const pickingTask = await PickingTask.find({ orderNumber });
        if (!pickingTask || pickingTask.length === 0) {
            return res.status(400).json({ message: "Picking Task Not Found" });
        }
        console.log(pickingTask);

        const locationId = pickingTask[0].stagingLocationId;
        console.log(locationId);

        // If locationId is not found in pickingTask
        if (!locationId) {
            return res.status(400).json({ message: "Location ID not found in Picking Task" });
        }

        // Calculate total pallets by summing the pallets across all tasks
        const totalPallets = pickingTask.reduce((sum, task) => {
            return sum + (task.totalPallets || 0); // Sum the totalPallets field
        }, 0);
        console.log(totalPallets);

        // Create the loading task
        const loadingTask = new LoadingTask({
            loadingId: orderNumber,
            pallets: pickingTask.map(task => ({ palletId: task.taskId,shipped:false })), // Map taskId to palletId
            isCompleted: isComplete,
            truckNumber: truckNumber,
            totalPallets: totalPallets,
            stagingLane: locationId
        });
        console.log(loadingTask);

        await loadingTask.save();

        const taskIds = pickingTask.map(task => task.taskId);
        console.log(taskIds);
        const stagingOrder = await StagingOrder.find({ shippingId :{$in:taskIds} });
        console.log(stagingOrder);

        for(const order of stagingOrder) {
            console.log(order);

            await StagingOrder.findOneAndDelete({shippingId:order.shippingId});

            console.log("ok");
        }

        return res.status(201).json({ message: "Loading Task Created Successfully", loadingTask });

    } catch (error) {
        // Handle any error during the process
        return res.status(500).json({ message: error.message });
    }
});



module.exports = router;