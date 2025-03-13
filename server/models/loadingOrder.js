const mongoose = require('mongoose');

const loadingOrderSchema = new mongoose.Schema(
    {
        loadingId: { type: Number, required: true},
        pallets:[
            {
                shippingId:{
                    type: Number,
                    required: true
                }
            }
        ],
        isCompleted:{type: Boolean, default: false},
        truckNumber:{type:Number, required: true},
        completedAt:{type:Date, required: true}
    }
)

const LoadingOrder = mongoose.models.LoadingOrder|| mongoose.model("LoadingOrder",loadingOrderSchema);
module.exports = LoadingOrder;