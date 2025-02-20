const mongoose= require('mongoose')

const ManufacturerSchema = new mongoose.Schema({
    manufacturerID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    emailAddress: { type: String, required: true }
});
const Manufacturer = mongoose.models.Manufacturer || mongoose.model('Manufacturer',ManufacturerSchema,"manufacturer");
module.exports =Manufacturer;
