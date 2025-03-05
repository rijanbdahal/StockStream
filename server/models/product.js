const mongoose =require("mongoose");

const productSchema = new mongoose.Schema({
    productID: { type: Number, required: true, unique: true },
    productSKU: { type: Number, required: true },
    productName: { type: String, required: true },
    productHeight: { type: Number, required: true },
    productLength: { type: Number, required: true },
    productWidth: { type: Number, required: true },
    itemWeight: { type: Number, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product",productSchema);
module.exports = Product;
