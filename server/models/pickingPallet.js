const mongoose =  require('mongoose');

const PickingPalletSchema = new mongoose.Schema ({
    productId:{type:Number, required:true},
    locationId:{type:String, required:true},
    Quantity:{type:Number},
})

const PickingPallet = mongoose.models.PickingPallet || mongoose.model("PickingPallet",PickingPalletSchema);
module.exports = PickingPallet;
