const express = require('express');
const router = express.Router();
const PickingTask = require('../models/pickingTask');
const PickingOrder = require('../models/pickingOrder');
const StagingLocation = require('../models/stagingLocation');

router.post("/", async (req, res) => {
    const {orderNumber} = req.body;
    const {locationId} = req.body;
    console.log(locationId);
    console.log(orderNumber);
    const stagingLocation = await StagingLocation.findOne({locationId:locationId});

    if(!stagingLocation){
        return res.status(404).json({message:"The location doesn't exist"});
    }

    if(stagingLocation.availableSpot <= 0 ){
        return res.status(404).json({message:"The location has no available spot"});
    }



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
        stagingLocationId:locationId,
        items:pickingOrder.items
    });

    stagingLocation.availableSpot -= pickingOrder.totalCases;
    await stagingLocation.save();
    await pickingTask.save();
    return res.status(200).json({message: "Picking Task Created!"});

});

router.get("/locations", async (req, res) => {
    try {
        const stagingLocations = await StagingLocation.find({ availableSpot: { $gt: 1 } });

        if (!stagingLocations.length) {
            return res.status(404).json({ message: "No staging locations found with available spots greater than 1." });
        }

        return res.status(200).json(stagingLocations); // Return the array of locations
    } catch (error) {
        console.error("Error fetching locations:", error);
        return res.status(500).json({ message: "Server error while fetching locations" });
    }
});


module.exports = router;