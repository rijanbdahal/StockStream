const mongoose = require('mongoose');
const { Schema } = mongoose;

// Manufacturer Schema
const manufacturerSchema = new Schema({
    manufacturerId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    emailAddress: { type: String, required: true }
});

const receivingConsignmentSchema = new Schema({
    consignmentID: { type: Number, required: true, unique: true },
    totalPallets: { type: Number, required: true },
    totalProductsW: { type: Number, required: true },
});

const taskSchema = new Schema({
    taskId: { type: Number, required: true, unique: true },
    orderNumber: { type: Number, required: true },
    userId: { type: Number, required: true },
    isCompleted: { type: Boolean, required: true }
});

const forkSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    jobType: { type: String, required: true }
});

const putawaySchema = new Schema({
    orderNumber: { type: Number, required: true, unique: true },
    fromLocation: { type: Number, required: true },
    toLocation: { type: Number, required: true }
});

// Replenish Schema
const replenishSchema = new Schema({
    orderNumber: { type: Number, required: true, unique: true },
    fromLocation: { type: Number, required: true },
    toLocation: { type: Number, required: true }
});

// Full Pallet Pick Schema
const fullPalletPickSchema = new Schema({
    orderNumber: { type: Number, required: true, unique: true },
    fromLocation: { type: Number, required: true },
    toLocation: { type: Number, required: true }
});

// Export Models
const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);
const ReceivingConsignment = mongoose.model('ReceivingConsignment', receivingConsignmentSchema);
const Pallet = mongoose.model('Pallet', palletSchema);
const Product = mongoose.model('Product', productSchema);
const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);
const Order = mongoose.model('Order', orderSchema);
const ShippingConsignment = mongoose.model('ShippingConsignment', shippingConsignmentSchema);
const Receiver = mongoose.model('Receiver', receiverSchema);
const Shipper = mongoose.model('Shipper', shipperSchema);
const Picker = mongoose.model('Picker', pickerSchema);
const Fork = mongoose.model('Fork', forkSchema);
const Putaway = mongoose.model('Putaway', putawaySchema);
const Replenish = mongoose.model('Replenish', replenishSchema);
const FullPalletPick = mongoose.model('FullPalletPick', fullPalletPickSchema);

module.exports = {
    Manufacturer,
    ReceivingConsignment,
    Pallet,
    Product,
    Task,
    User,
    Location,
    Order,
    ShippingConsignment,
    Receiver,
    Shipper,
    Picker,
    Fork,
    Putaway,
    Replenish,
    FullPalletPick
};
