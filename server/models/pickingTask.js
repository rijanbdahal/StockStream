const mongoose = require("mongoose");
const Counter = require("./counter");

const PickingTaskSchema = new mongoose.Schema({
    taskId: { type: Number, unique: true },
    orderNumber: { type: Number, required: true, unique: true },
    storeNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    totalStop: { type: Number, required: true },
    placedAt: { type: Date, required: true },
    toBeFulfilledBy: { type: Date, required: true },
    completedStatus: { type: Boolean, required: true },
    assignedStatus: { type: Boolean, required: true },
    totalPallets: { type: Number, required: true },
    urgent: { type: Boolean, required: true },
    items: [
        {
            itemId: { type: Number, required: true },
            quantity: { type: Number, required: true },
            pickedStatus: { type: Boolean, required: true }
        }
    ]
});

// Auto-increment `taskId` before saving
PickingTaskSchema.pre("save", async function (next) {
    try {
        const task = this;
    if(!task.taskId)
    {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "pickingTask" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        task.taskId = counter.seq;
    }
    } catch (error) {
        next(error);
    }
    next();
});

const PickingTask = mongoose.models.PickingTask || mongoose.model("PickingTask", PickingTaskSchema);
module.exports = PickingTask;
