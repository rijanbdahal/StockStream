const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get("/:employeeId", async (req, res) => {  // URL parameter used here
    const { employeeId } = req.params;
    if (!employeeId) {
        return res.status(400).json({ msg: "Invalid Employee Id" });
    }

    try {
        const user = await User.findOne({ userEmployeeId: employeeId });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
