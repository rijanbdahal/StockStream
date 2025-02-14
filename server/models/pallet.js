const mongoose =  require('mongoose');

const palletSchema = new Schema({
    palletID: { type: Number, required: true, unique: true },
    lotNo: { type: Number, required: true },
    mixedPallet: { type: Boolean, required: true },
    totalCases: { type: Number, required: true },
    consignmentID: { type: Number, ref: 'ReceivingConsignment', required: true },
    TiHi: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    locationId: { type: String }
});


const Pallet = mongoose.models.Pallet|| mongoose.model("Pallet", palletSchema);
module.exports = Pallet;
