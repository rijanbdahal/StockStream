const mongoose = require('mongoose');

const forkTaskSchema = new mongoose.Schema(
    {
        taskId: {type: Number, required: true},
        productId: {type: Number, required: true},
        toLocation: {type: String, required: true},
        isCompleted: {type: Boolean, default: false},

    }
);
const ForkTask  = mongoose.models.Fork||mongoose.model("ForkTask",forkTaskSchema);
module.exports = ForkTask;