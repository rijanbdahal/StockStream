const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

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
const stageOrder = require("./routes/stageOrderAuth.js");
const printLabelAuth = require("./routes/printLabelAuth.js");
const loadingTaskAuth = require("./routes/loadingTaskAuth.js");
const loadingtask = require("./routes/loadingTask");
const releaseLoadingTask = require("./routes/releaseLoadingTask.js");
const { handleSocketConnection } = require("./middlewares/socketUtils");

dotenv.config(); // ✅ Load .env before using process.env

const app = express();
const server = createServer(app);

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, { cors: corsOptions });


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file!");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ Problem connecting to MongoDB", err);
        process.exit(1);
    });

io.on("connection", (socket) => {
    console.log(" New client connected:", socket.id);
    handleSocketConnection(socket);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// ✅ Define API Routes
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
app.use("/stageOrder", stageOrder);
app.use("/printLabelAuth",printLabelAuth);
app.use("/loadingTaskAuth", loadingTaskAuth);
app.use("/releaseloadingtask",releaseLoadingTask);
app.use("/loadingtask", loadingtask);
app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
