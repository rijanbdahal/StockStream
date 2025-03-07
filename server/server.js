const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io"); // Correct way to import socket.io

const loginAuth = require("./routes/loginAuth.js");
const registrationAuth = require("./routes/registrationAuth.js");
const authRoutes = require("./routes/authUser.js");
const userAuth = require("./routes/userAuth.js");
const locationAuth = require("./routes/locationAuth.js");
const dockingEntryAuth = require("./routes/dockingEntryAuth.js");
const dockingEntryQueryAuth = require("./routes/dockingEntryQueryAuth.js");
const receivingTaskAuth = require("./routes/receivingTaskAuth.js");
const putawayAuth = require("./routes/putawayAuth.js");
const selectingTask = require("./routes/selectingTask.js");
const assignProductLocation = require("./routes/assignProductLocation.js");
const replenishTask = require("./routes/replenishTaskAuth.js");
const releasePickingTask = require("./routes/releasePickingTask.js");
const { handleSocketConnection } = require("./middlewares/socketUtils");

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, { // ✅ Correct socket.io initialization
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ Problem connecting to MongoDB", err);
        process.exit(1);
    });

// Handle socket connection
io.on("connection", handleSocketConnection);

// Define routes
app.use("/loginAuth", loginAuth);
app.use("/registrationAuth", registrationAuth);
app.use("/authRoutes", authRoutes);
app.use("/receivingTaskAuth", receivingTaskAuth);
app.use("/userAuth", userAuth);
app.use("/locationAuth", locationAuth);
app.use("/dockingEntryAuth", dockingEntryAuth);
app.use("/dockingEntryQueryAuth", dockingEntryQueryAuth);
app.use("/putawayAuth", putawayAuth);
app.use("/selectingtask", selectingTask);
app.use("/assignproductlocation", assignProductLocation);
app.use("/replenishtask", replenishTask);
app.use("/releasepickingtask", releasePickingTask);

app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// Start the server
server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
