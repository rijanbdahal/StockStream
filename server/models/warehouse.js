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

// Receiving Consignment Schema
const receivingConsignmentSchema = new Schema({
    consignmentID: { type: Number, required: true, unique: true },
    manufacturerID: { type: Number, ref: 'Manufacturer', required: true },
    arrivalTime: { type: Date, required: true },
    totalPallets: { type: Number, required: true }
});


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

// Task Schema
const taskSchema = new Schema({
    taskId: { type: Number, required: true, unique: true },
    orderNumber: { type: Number, required: true },
    user: { type: Number, ref: 'User', required: true },
    completed: { type: Boolean, required: true },
    checkDigit: { type: Number, required: true },
    quantity: { type: Number },
    locationID: { type: Number, ref: 'Location' }
});


// Shipping Consignment Schema
const shippingConsignmentSchema = new Schema({
    shippingId: { type: Number, required: true, unique: true },
    totalPallets: { type: Number, required: true },
    truckNumber: { type: Number, required: true },
    status: { type: Number, required: true },
    userID: { type: Number, ref: 'User', required: true }
});

// Define specific roles
const receiverSchema = new Schema({
    userID: { type: Number, required: true, unique: true }
});

const shipperSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    taskId: { type: Number, ref: 'Task', required: true }
});

const pickerSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    taskId: { type: Number, ref: 'Task', required: true }
});

const forkSchema = new Schema({
    userID: { type: Number, required: true, unique: true },
    jobType: { type: String, required: true }
});

// Putaway Schema
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
