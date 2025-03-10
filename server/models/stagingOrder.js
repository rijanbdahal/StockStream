const mongoose = require("mongoose");

const stagingOrderSchema = new mongoose.Schema({
    shippingId: { type: Number, required: true, unique: true },
    totalPallets: { type: Number, required: true },
    status: { type: Number, required: true },
    locationId: { type: String, required: true },
});

const stagingOrder = mongoose.models.stagingOrder||mongoose.model("stagingOrder", stagingOrderSchema);
module.exports = stagingOrder;
