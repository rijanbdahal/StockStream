const express = require('express');
const router = express.Router();

const Pallet = require("../models/pallet");
const StagingOrder = require("../models/stagingOrder");

router.get("/location/:toLocation", async (req, res) => {
    const {toLocation} = req.params;
    const trimmedLocation = toLocation.trim();
    console.log(trimmedLocation);
    const pallet = await Pallet.findOne({locationId: trimmedLocation});
    console.log(pallet);
    if (!pallet) {
        return res.status(404).json({message: "No pallet at the Location"});
    }
    console.log(pallet);
    return res.status(200).json(pallet);

});

router.get("/task/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const taskIdAsNumber = Number(taskId);
    console.log("taskId");
    console.log("Received taskId:", taskIdAsNumber);

    try {
        const stagingOrder = await StagingOrder.findOne({ shippingId: taskIdAsNumber });
        console.log("Staging Order:", stagingOrder);

        if (!stagingOrder) {
            return res.status(404).json({ message: "Task ID does not exist" });
        }
        return res.status(200).json(stagingOrder); // Return the full stagingOrder object
    } catch (error) {
        console.error("Error fetching staging order:", error);
        return res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
