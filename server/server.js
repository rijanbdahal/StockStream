const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const loginAuth = require("./routes/loginAuth.js");
const registrationAuth = require("./routes/registrationAuth.js");
const authRoutes = require("./routes/authUser.js");
const userAuth = require("./routes/userAuth.js");
const locationAuth = require("./routes/locationAuth.js");
const dockingEntryAuth = require("./routes/dockingEntryAuth.js");
const dockingEntryQueryAuth = require("./routes/dockingEntryQueryAuth.js");

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // or your frontend URL
    credentials: true,
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ Problem connecting to MongoDB", err);
        process.exit(1);  // Exit if the connection fails
    });

const PORT = process.env.PORT || 5000;

// Define routes properly without the "?" in the URL
app.use('/loginAuth', loginAuth);
app.use('/registrationAuth', registrationAuth);
app.use('/authRoutes', authRoutes);
app.use('/userAuth', userAuth);
app.use('/locationAuth', locationAuth);
app.use('/dockingEntryAuth' , dockingEntryAuth)
app.use('/dockingEntryQueryAuth',dockingEntryQueryAuth)
app.all('*', (req, res) => {
    res.status(404).send('Route not found');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
