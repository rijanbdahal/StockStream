const mongoose = require('mongoose');

const loadingOrderSchema = new mongoose.Schema(
    {
        loadingId: { type: Number, required: true},
        pallets: [
            {
                palletId: { type: Number, required: true },
                shipped: { type: Boolean, default: false }
            }
        ],
        isShipped:{type: Boolean, default: false},
        truckNumber:{type:Number, required: true},
        completedAt:{type:Date},
        totalPallets:{type:Number, required: true},
        stagingLane:{type:String, required: true}
    }
)

const LoadingOrder = mongoose.models.LoadingOrder|| mongoose.model("LoadingOrder",loadingOrderSchema);
module.exports = LoadingOrder;