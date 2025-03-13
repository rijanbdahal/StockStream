const mongoose = require('mongoose');

const StagingLocationSchema = new mongoose.Schema(
    {
       locationId: { type: String, required: true },
        totalSpots: { type: Number, required: true },
       availableSpot:{type:Number,required: true},
        checkDigits:{type: String, required: true},
    });
const StagingLocation = mongoose.models.StagingLocation||mongoose.model("StagingLocation",StagingLocationSchema);
module.exports = StagingLocation;
