const mongoose =require("mongoose");

const productSchema = new Schema({
    productID: { type: Number, required: true, unique: true },
    productSKU: { type: Number, required: true },
    productName: { type: String, required: true },
    productHeight: { type: Number, required: true },
    productLength: { type: Number, required: true },
    productWidth: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    palletID: { type: Number, ref: 'Pallet', required: true }
});

const Product = mongoose.models.Product || mongoose.model("Product",productSchema);
module.exports = Product;
