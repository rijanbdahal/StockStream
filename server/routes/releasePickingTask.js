const express = require('express');
const router = express.Router();
const PickingTask = require('../models/pickingTask');
const PickingOrder = require('../models/pickingOrder');

router.get("/:orderNumber", async (req, res) => {
    const {orderNumber} = req.params;
    const pickingOrder = await  PickingOrder.findOne({orderNumber:orderNumber});
    if (!pickingOrder) {
        return res.status(400).json({message: "Order with provided Order Number is not found!"});
    }

    const pickingTask =  new PickingTask({
        orderNumber:pickingOrder.orderNumber,
        storeNumber:pickingOrder.storeNumber,
        totalCases:pickingOrder.totalCases,
        totalStop: pickingOrder.totalStop,
        placedAt:pickingOrder.placedAt,
        toBeFulfilledBy:pickingOrder.toBeFulfilledBy,
        completedStatus:pickingOrder.completedStatus,
        assignedStatus:pickingOrder.assignedStatus,
        totalPallets: pickingOrder.totalPallets,
        urgent:pickingOrder.urgent,
        items:pickingOrder.items
    });
    await pickingTask.save();
    return res.status(200).json({message: "Picking Task Created!"});

});

module.exports = router;