const mongoose = require("mongoose");

const PickingOrderSchema = new mongoose.Schema({
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

const PickingOrder = mongoose.models.PickingOrder || mongoose.model("PickingOrder", PickingOrderSchema);

module.exports = PickingOrder;
