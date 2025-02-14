const mongoose = require('mongoose');

const orderSchema = new Schema({
    orderNumber: { type: Number, required: true, unique: true },
    storeNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    totalStop: { type: Number, required: true },
    volume: { type: Number, required: true },
    placedAt: { type: Date, required: true },
    toBeFulfilledBy: { type: Date, required: true },
    status: { type: Number, required: true },
    urgent: { type: Boolean, required: true }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
