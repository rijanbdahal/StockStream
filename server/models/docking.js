const mongoose = require("mongoose") ;


const DockingSchema = new mongoose.Schema({
    products: [{ type: Number, ref: "Product" }],
    consignmentID: { type: Number, required: true, unique: true },
    manufacturerID: { type: Number, ref: 'Manufacturer', required: true },
    arrivalTime: { type: Date, required: true },
    totalPallets: { type: Number, required: true },
    doorNo: { type: Number, required: true }
});

const Docking = mongoose.models.DockingSchema || mongoose.model("Docking",DockingSchema,"dockings");
module.exports= Docking;