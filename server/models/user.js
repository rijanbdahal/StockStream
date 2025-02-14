const mongoose = require("mongoose");;
const Counter = require("./counter"); // Ensure this model exists

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    userName: { type: String, required: true },
    userEmployeeId: { type: String, required: true,unique: true },
    userRole: {
        type: String,
        required: true,
        enum: ["Admin", "Receiver", "Selector","RTO","Loader"]
    },
    userPassword: {type: String, required: true}
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.userId) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: "userId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            user.userId = counter.seq;
        } catch (error) {
            return next(error);
        }
    }

    next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
