const express = require('express');
const router = express.Router();
const Docking = require("../models/Docking");

router.get("/:consignmentID", async (req, res) => {
    const consignmentID = Number(req.params.consignmentID);
    console.log("Searching for Consignment ID:", consignmentID);
    try {
        if (!consignmentID) {
            return res.status(404).json({error: "Consignment ID is required"});
        }
        console.log("Searching for Consignment ID:", consignmentID);


        const dockingEntry = await Docking.findOne({consignmentID});
        if (!dockingEntry) {
            return res.status(404).json({error: "Consignment ID not found"});
        }
        res.json(dockingEntry);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: err});
    }
})

module.exports = router;