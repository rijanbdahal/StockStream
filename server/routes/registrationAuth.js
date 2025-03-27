const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validateRegistration } = require("../middlewares/registrationAuthm");

const router = express.Router();

router.post("/", validateRegistration, async (req, res) => {
    const { userName, userEmployeeId, userRole, userPassword } = req.body;

    try {
        if (!userEmployeeId || userEmployeeId.trim() === '') {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        const existingUser = await User.findOne({ userEmployeeId });
        if (existingUser) {
            return res.status(400).json({ error: "User with this Employee ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // Create a new user
        const newUser = new User({
            userName,
            userEmployeeId,
            userRole,
            userPassword: hashedPassword,
        });

        await newUser.save();

        // Send success response
        res.status(201).json({ message: "Successfully registered" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
