const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const loginAuth = require("./routes/loginAuth.js");
const registrationAuth = require("./routes/registrationAuth.js"); // Ensure this file exists

dotenv.config();

const app = express();
app.use(cors()); // This allows all origins
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Problem connecting to MongoDB", err));

const PORT = process.env.PORT || 5000;

app.use('/loginAuth', loginAuth);
app.use('/registrationAuth', registrationAuth); // Now correctly defined

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
