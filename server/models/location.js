const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    locationId: { type: String, required: true, unique: true },
    aisle: { type: String, required: true },
    rowNumber: { type: String, required: true },
    columnNumber: { type: String, required: true },
    checkDigit: { type: Number, required: true },
    status: { type: Boolean, required: true },
});

const Location = mongoose.model("Location", locationSchema, "location");
module.exports = Location;
