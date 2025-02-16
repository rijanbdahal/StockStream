const mongoose = require('mongoose');

const singleOrderSchema = new Schema({
    orderNumber: { type: Number, required: true, unique: true },
    productId: { type: Number, required: true },
    productName: { type: String, required: true }
});

const Order = mongoose.models.Order || mongoose.model("SingleOrder", singleOrderSchema);
module.exports = Order;