const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateRegistration } = require("../middlewares/registrationAuthm");

const router = express.Router();

router.post("/", validateRegistration, async (req, res) => {
    const { userName, userEmployeeId, userRole, userPassword } = req.body;

    try {
        if (!userEmployeeId || userEmployeeId.trim() === '') {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        console.log("Incoming Request Data:", req.body);

        // Check if user already exists by employee ID
        const existingUser = await User.findOne({ userEmployeeId });
        if (existingUser) {
            return res.status(400).json({ error: "User with this Employee ID already exists" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // Create a new user
        const newUser = new User({
            userName,
            userEmployeeId,  // Ensure this field is mapped correctly
            userRole,
            userPassword: hashedPassword,
        });
        console.log(newUser);

        await newUser.save();

        console.log("User Registered Successfully:", newUser); // ✅ Debugging

        // Send success response
        res.status(201).json({ message: "Successfully registered" });
    } catch (error) {
        console.error("Server Error:", error); // ✅ Debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
