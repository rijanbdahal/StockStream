const mongoose = require("mongoose");


const locationSchema = new Schema({
    locationId: { type: String, required: true, unique: true },
    aisle: { type: String, required: true },
    rowNumber: { type: String, required: true },
    columnNumber: { type: String, required: true },
    checkDigit: { type: Number, required: true },
    status: { type: Boolean, required: true },
});

const Location = mongoose.models.Location || mongoose.model("Location",locationSchema);
module.exports = Location;