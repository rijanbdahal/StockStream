const express = require("express");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/", async (req, res) => {
    const { userId, userPassword } = req.body;

    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Password" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: "JWT Secret not configured" });
        }

        const token = jwt.sign(
            {
                id: user.userId,
                userRole: user.userRole,
                userName: user.userName,
                userEmployeeId: user.userEmployeeId}, // Fixed userRole reference
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "Strict" });
        res.json({ message: "Login successful", token });



    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ msg: "Server error during logout" });
    }
});


module.exports = router;