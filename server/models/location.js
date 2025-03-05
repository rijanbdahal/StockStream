const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    locationId: { type: String, required: true, unique: true },
    aisle: { type: String, required: true },
    rowNumber: { type: String, required: true },
    columnNumber: { type: String, required: true },
    status: { type: Boolean, required: true },
    checkDigit: { type: Number, required: true }  // ✅ Add this field
});

const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

module.exports = Location;
