const mongoose = require('mongoose');

const PalletInfoSchema = new mongoose.Schema({
    productID: { type: Number, required: true },
    palletID: { type: Number, required: true, unique: true },
    lotNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    consignmentID: { type: Number, ref: 'ReceivingConsignment', required: true },
    Ti: { type: Number, required: true },
    Hi: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    locationId: { type: String,required: true },
    expiryDate: { type: Date, required: true }

})

const PalletInfo = mongoose.models.PalletInfo || mongoose.model("PalletInfo",PalletInfoSchema);
module.exports = PalletInfo;