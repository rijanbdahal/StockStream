const mongoose = require('mongoose');
require('dotenv').config();
const readline = require('readline');

// Define all models inline since this is a self-contained script
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const DockingSchema = new mongoose.Schema({
    products: [{ type: Number, ref: "Product" }],
    consignmentID: { type: Number, required: true, unique: true },
    manufacturerID: { type: Number, ref: "Manufacturer", required: true },
    arrivalTime: { type: Date, required: true },
    totalPallets: { type: Number, required: true },
    doorNo: { type: Number, required: true }
});
const Docking = mongoose.model('Docking', DockingSchema, 'dockings');

const ForkTaskSchema = new mongoose.Schema({
    taskId: { type: Number, required: true },
    productId: { type: Number, required: true },
    toLocation: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
});
const ForkTask = mongoose.model('ForkTask', ForkTaskSchema, 'forkTasks');

const LoadingOrderSchema = new mongoose.Schema({
    loadingId: { type: Number, required: true },
    pallets: [{
        palletId: { type: Number, required: true },
        shipped: { type: Boolean, default: false }
    }],
    isShipped: { type: Boolean, default: false },
    truckNumber: { type: Number, required: true },
    completedAt: { type: Date },
    totalPallets: { type: Number, required: true },
    stagingLane: { type: String, required: true }
});
const LoadingOrder = mongoose.model('LoadingOrder', LoadingOrderSchema, 'loadingOrders');

const LocationSchema = new mongoose.Schema({
    locationId: { type: String, required: true, unique: true },
    aisle: { type: String, required: true },
    rowNumber: { type: String, required: true },
    columnNumber: { type: String, required: true },
    status: { type: Boolean, required: true },
    checkDigit: { type: Number, required: true }
});
const Location = mongoose.model('Location', LocationSchema, 'locations');

const ManufacturerSchema = new mongoose.Schema({
    manufacturerID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    emailAddress: { type: String, required: true }
});
const Manufacturer = mongoose.model('Manufacturer', ManufacturerSchema, 'manufacturers');

const PalletSchema = new mongoose.Schema({
    productID: { type: Number, required: true },
    palletID: { type: Number, required: true, unique: true },
    lotNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    consignmentID: { type: Number, ref: 'ReceivingConsignment', required: true },
    Ti: { type: Number, required: true },
    Hi: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    locationId: { type: String, required: true },
    expiryDate: { type: Date, required: true }
});
const Pallet = mongoose.model('Pallet', PalletSchema, 'pallets');

const PalletInfoSchema = new mongoose.Schema({
    productID: { type: Number, required: true },
    palletID: { type: Number, required: true, unique: true },
    lotNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    consignmentID: { type: Number, ref: 'ReceivingConsignment', required: true },
    Ti: { type: Number, required: true },
    Hi: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    locationId: { type: String, required: true },
    expiryDate: { type: Date, required: true }
});
const PalletInfo = mongoose.model('PalletInfo', PalletInfoSchema, 'palletInfos');

const PickingOrderSchema = new mongoose.Schema({
    orderNumber: { type: Number, required: true, unique: true },
    storeNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    totalStop: { type: Number, required: true },
    placedAt: { type: Date, required: true },
    toBeFulfilledBy: { type: Date, required: true },
    completedStatus: { type: Boolean, required: true },
    assignedStatus: { type: Boolean, required: true },
    totalPallets: { type: Number, required: true },
    urgent: { type: Boolean, required: true },
    isShipped: { type: Boolean, default: false },
    items: [{
        itemId: { type: Number, required: true },
        quantity: { type: Number, required: true },
        pickedStatus: { type: Boolean, required: true }
    }]
});
const PickingOrder = mongoose.model('PickingOrder', PickingOrderSchema, 'pickingOrders');

const PickingPalletSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    locationId: { type: String, required: true, unique: true },
    Quantity: { type: Number },
});
const PickingPallet = mongoose.model('PickingPallet', PickingPalletSchema, 'pickingPallets');

const PickingTaskSchema = new mongoose.Schema({
    taskId: { type: Number, unique: true },
    orderNumber: { type: Number, required: true },
    storeNumber: { type: Number, required: true },
    totalCases: { type: Number, required: true },
    totalStop: { type: Number, required: true },
    placedAt: { type: Date, required: true },
    toBeFulfilledBy: { type: Date, required: true },
    completedStatus: { type: Boolean, required: true },
    assignedStatus: { type: Boolean, required: true },
    totalPallets: { type: Number, required: true },
    urgent: { type: Boolean, required: true },
    stagingLocationId: { type: String, required: true },
    items: [{
        itemId: { type: Number, required: true },
        quantity: { type: Number, required: true },
        pickedStatus: { type: Boolean, required: true }
    }]
});
PickingTaskSchema.pre('save', async function(next) {
    if (!this.taskId) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'pickingTask' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.taskId = counter.seq;
    }
    next();
});
const PickingTask = mongoose.model('PickingTask', PickingTaskSchema, 'pickingTasks');

const ProductSchema = new mongoose.Schema({
    productID: { type: Number, required: true, unique: true },
    productSKU: { type: Number, required: true },
    productName: { type: String, required: true },
    productHeight: { type: Number, required: true },
    productLength: { type: Number, required: true },
    productWidth: { type: Number, required: true },
    itemWeight: { type: Number, required: true },
});
const Product = mongoose.model('Product', ProductSchema, 'products');

const StagingLocationSchema = new mongoose.Schema({
    locationId: { type: String, required: true },
    totalSpots: { type: Number, required: true },
    availableSpot: { type: Number, required: true },
    checkDigits: { type: String, required: true },
});
const StagingLocation = mongoose.model('StagingLocation', StagingLocationSchema, 'stagingLocations');

const StagingOrderSchema = new mongoose.Schema({
    shippingId: { type: Number, required: true, unique: true },
    totalPallets: { type: Number, required: true },
    status: { type: Boolean, required: true },
    locationId: { type: String, required: true },
});
const StagingOrder = mongoose.model('StagingOrder', StagingOrderSchema, 'stagingOrders');

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    userName: { type: String, required: true },
    userEmployeeId: { type: String, required: true, unique: true },
    userRole: {
        type: String,
        required: true,
        enum: ["Admin", "Receiver", "Selector", "RTO", "Loader", "Docker"]
    },
    userPassword: { type: String, required: true }
});
UserSchema.pre('save', async function(next) {
    if (!this.userId) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.userId = counter.seq;
    }
    next();
});
const User = mongoose.model('User', UserSchema, 'users');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', main);

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Warehouse Management System Database Utility');
    console.log('1. Seed database with sample data');
    console.log('2. Reset database (delete all data)');
    console.log('3. Exit');

    rl.question('Choose an option (1-3): ', async (answer) => {
        switch (answer) {
            case '1':
                await seedDatabase();
                break;
            case '2':
                await resetDatabase();
                break;
            case '3':
                process.exit(0);
                break;
            default:
                console.log('Invalid option');
        }
        rl.close();
    });
}

// Sample Data (20+ entries per model)
const sampleCounters = [
    { _id: "pickingTask", seq: 1 }, { _id: "userId", seq: 1 }, { _id: "dockingId", seq: 100 }, { _id: "forkTaskId", seq: 200 },
    { _id: "loadingId", seq: 300 }, { _id: "palletId", seq: 400 }, { _id: "orderNumber", seq: 500 }, { _id: "taskId", seq: 600 },
    { _id: "shippingId", seq: 700 }, { _id: "consignmentId", seq: 800 }, { _id: "manufacturerId", seq: 900 }, { _id: "productId", seq: 1000 },
    { _id: "locationId", seq: 1100 }, { _id: "stagingId", seq: 1200 }, { _id: "palletInfoId", seq: 1300 }, { _id: "pickingPalletId", seq: 1400 },
    { _id: "stagingLocationId", seq: 1500 }, { _id: "truckNumber", seq: 1600 }, { _id: "doorNo", seq: 1700 }, { _id: "miscCounter", seq: 1800 },
];

const sampleManufacturers = [
    { manufacturerID: 901, name: "Acme Corp", address: "123 Main St", phone: 1234567890, emailAddress: "contact@acme.com" },
    { manufacturerID: 902, name: "Beta Inc", address: "456 Oak Ave", phone: 2345678901, emailAddress: "info@beta.com" },
    { manufacturerID: 903, name: "Gamma Ltd", address: "789 Pine Rd", phone: 3456789012, emailAddress: "support@gamma.com" },
    { manufacturerID: 904, name: "Delta Co", address: "101 Elm St", phone: 4567890123, emailAddress: "sales@delta.com" },
    { manufacturerID: 905, name: "Epsilon LLC", address: "202 Birch Ln", phone: 5678901234, emailAddress: "hello@epsilon.com" },
    { manufacturerID: 906, name: "Zeta Industries", address: "303 Cedar Dr", phone: 6789012345, emailAddress: "contact@zeta.com" },
    { manufacturerID: 907, name: "Eta Solutions", address: "404 Maple Ave", phone: 7890123456, emailAddress: "info@eta.com" },
    { manufacturerID: 908, name: "Theta Corp", address: "505 Spruce St", phone: 8901234567, emailAddress: "support@theta.com" },
    { manufacturerID: 909, name: "Iota Inc", address: "606 Willow Rd", phone: 9012345678, emailAddress: "sales@iota.com" },
    { manufacturerID: 910, name: "Kappa Ltd", address: "707 Ash Ln", phone: 1234567891, emailAddress: "hello@kappa.com" },
    { manufacturerID: 911, name: "Lambda Co", address: "808 Poplar Dr", phone: 2345678902, emailAddress: "contact@lambda.com" },
    { manufacturerID: 912, name: "Mu LLC", address: "909 Sycamore St", phone: 3456789013, emailAddress: "info@mu.com" },
    { manufacturerID: 913, name: "Nu Industries", address: "1010 Chestnut Ave", phone: 4567890124, emailAddress: "support@nu.com" },
    { manufacturerID: 914, name: "Xi Solutions", address: "1111 Hazel Rd", phone: 5678901235, emailAddress: "sales@xi.com" },
    { manufacturerID: 915, name: "Omicron Corp", address: "1212 Laurel Ln", phone: 6789012346, emailAddress: "hello@omicron.com" },
    { manufacturerID: 916, name: "Pi Inc", address: "1313 Magnolia Dr", phone: 7890123457, emailAddress: "contact@pi.com" },
    { manufacturerID: 917, name: "Rho Ltd", address: "1414 Olive St", phone: 8901234568, emailAddress: "info@rho.com" },
    { manufacturerID: 918, name: "Sigma Co", address: "1515 Palm Ave", phone: 9012345679, emailAddress: "support@sigma.com" },
    { manufacturerID: 919, name: "Tau LLC", address: "1616 Redwood Rd", phone: 1234567892, emailAddress: "sales@tau.com" },
    { manufacturerID: 920, name: "Upsilon Industries", address: "1717 Walnut Ln", phone: 2345678903, emailAddress: "hello@upsilon.com" },
];

const sampleProducts = [
    { productID: 1001, productSKU: 2001, productName: "Widget A", productHeight: 10, productLength: 20, productWidth: 15, itemWeight: 5 },
    { productID: 1002, productSKU: 2002, productName: "Widget B", productHeight: 12, productLength: 22, productWidth: 16, itemWeight: 6 },
    { productID: 1003, productSKU: 2003, productName: "Widget C", productHeight: 15, productLength: 25, productWidth: 18, itemWeight: 7 },
    { productID: 1004, productSKU: 2004, productName: "Widget D", productHeight: 8, productLength: 18, productWidth: 14, itemWeight: 4 },
    { productID: 1005, productSKU: 2005, productName: "Widget E", productHeight: 20, productLength: 30, productWidth: 20, itemWeight: 10 },
    { productID: 1006, productSKU: 2006, productName: "Gadget A", productHeight: 11, productLength: 21, productWidth: 17, itemWeight: 5.5 },
    { productID: 1007, productSKU: 2007, productName: "Gadget B", productHeight: 13, productLength: 23, productWidth: 19, itemWeight: 6.5 },
    { productID: 1008, productSKU: 2008, productName: "Gadget C", productHeight: 9, productLength: 19, productWidth: 15, itemWeight: 4.5 },
    { productID: 1009, productSKU: 2009, productName: "Gadget D", productHeight: 16, productLength: 26, productWidth: 21, itemWeight: 8 },
    { productID: 1010, productSKU: 2010, productName: "Gadget E", productHeight: 7, productLength: 17, productWidth: 13, itemWeight: 3.5 },
    { productID: 1011, productSKU: 2011, productName: "Tool A", productHeight: 14, productLength: 24, productWidth: 18, itemWeight: 7.5 },
    { productID: 1012, productSKU: 2012, productName: "Tool B", productHeight: 10, productLength: 20, productWidth: 16, itemWeight: 5 },
    { productID: 1013, productSKU: 2013, productName: "Tool C", productHeight: 12, productLength: 22, productWidth: 17, itemWeight: 6 },
    { productID: 1014, productSKU: 2014, productName: "Tool D", productHeight: 15, productLength: 25, productWidth: 19, itemWeight: 7 },
    { productID: 1015, productSKU: 2015, productName: "Tool E", productHeight: 8, productLength: 18, productWidth: 14, itemWeight: 4 },
    { productID: 1016, productSKU: 2016, productName: "Part A", productHeight: 20, productLength: 30, productWidth: 20, itemWeight: 10 },
    { productID: 1017, productSKU: 2017, productName: "Part B", productHeight: 11, productLength: 21, productWidth: 17, itemWeight: 5.5 },
    { productID: 1018, productSKU: 2018, productName: "Part C", productHeight: 13, productLength: 23, productWidth: 19, itemWeight: 6.5 },
    { productID: 1019, productSKU: 2019, productName: "Part D", productHeight: 9, productLength: 19, productWidth: 15, itemWeight: 4.5 },
    { productID: 1020, productSKU: 2020, productName: "Part E", productHeight: 16, productLength: 26, productWidth: 21, itemWeight: 8 },
];

const sampleDockings = [
    { products: [1001, 1002], consignmentID: 801, manufacturerID: 901, arrivalTime: new Date("2025-04-01T08:00:00Z"), totalPallets: 10, doorNo: 1 },
    { products: [1003], consignmentID: 802, manufacturerID: 902, arrivalTime: new Date("2025-04-01T09:00:00Z"), totalPallets: 15, doorNo: 2 },
    { products: [1004, 1005], consignmentID: 803, manufacturerID: 903, arrivalTime: new Date("2025-04-01T10:00:00Z"), totalPallets: 8, doorNo: 3 },
    { products: [1006], consignmentID: 804, manufacturerID: 904, arrivalTime: new Date("2025-04-01T11:00:00Z"), totalPallets: 12, doorNo: 4 },
    { products: [1007], consignmentID: 805, manufacturerID: 905, arrivalTime: new Date("2025-04-01T12:00:00Z"), totalPallets: 20, doorNo: 5 },
    { products: [1008, 1009], consignmentID: 806, manufacturerID: 906, arrivalTime: new Date("2025-04-02T08:00:00Z"), totalPallets: 18, doorNo: 6 },
    { products: [1010], consignmentID: 807, manufacturerID: 907, arrivalTime: new Date("2025-04-02T09:00:00Z"), totalPallets: 9, doorNo: 7 },
    { products: [1011], consignmentID: 808, manufacturerID: 908, arrivalTime: new Date("2025-04-02T10:00:00Z"), totalPallets: 14, doorNo: 8 },
    { products: [1012, 1013], consignmentID: 809, manufacturerID: 909, arrivalTime: new Date("2025-04-02T11:00:00Z"), totalPallets: 16, doorNo: 9 },
    { products: [1014], consignmentID: 810, manufacturerID: 910, arrivalTime: new Date("2025-04-02T12:00:00Z"), totalPallets: 11, doorNo: 10 },
    { products: [1015], consignmentID: 811, manufacturerID: 911, arrivalTime: new Date("2025-04-03T08:00:00Z"), totalPallets: 13, doorNo: 11 },
    { products: [1016, 1017], consignmentID: 812, manufacturerID: 912, arrivalTime: new Date("2025-04-03T09:00:00Z"), totalPallets: 17, doorNo: 12 },
    { products: [1018], consignmentID: 813, manufacturerID: 913, arrivalTime: new Date("2025-04-03T10:00:00Z"), totalPallets: 19, doorNo: 13 },
    { products: [1019], consignmentID: 814, manufacturerID: 914, arrivalTime: new Date("2025-04-03T11:00:00Z"), totalPallets: 10, doorNo: 14 },
    { products: [1020, 1021], consignmentID: 815, manufacturerID: 915, arrivalTime: new Date("2025-04-03T12:00:00Z"), totalPallets: 15, doorNo: 15 },
    { products: [1022], consignmentID: 816, manufacturerID: 916, arrivalTime: new Date("2025-04-04T08:00:00Z"), totalPallets: 12, doorNo: 16 },
    { products: [1023], consignmentID: 817, manufacturerID: 917, arrivalTime: new Date("2025-04-04T09:00:00Z"), totalPallets: 18, doorNo: 17 },
    { products: [1024, 1025], consignmentID: 818, manufacturerID: 918, arrivalTime: new Date("2025-04-04T10:00:00Z"), totalPallets: 14, doorNo: 18 },
    { products: [1026], consignmentID: 819, manufacturerID: 919, arrivalTime: new Date("2025-04-04T11:00:00Z"), totalPallets: 16, doorNo: 19 },
    { products: [1027], consignmentID: 820, manufacturerID: 920, arrivalTime: new Date("2025-04-04T12:00:00Z"), totalPallets: 20, doorNo: 20 },
];

const sampleLocations = [
    { locationId: "A1-R1-C1", aisle: "A1", rowNumber: "R1", columnNumber: "C1", status: true, checkDigit: 101 },
    { locationId: "A1-R1-C2", aisle: "A1", rowNumber: "R1", columnNumber: "C2", status: false, checkDigit: 102 },
    { locationId: "A2-R2-C1", aisle: "A2", rowNumber: "R2", columnNumber: "C1", status: true, checkDigit: 103 },
    { locationId: "A2-R2-C2", aisle: "A2", rowNumber: "R2", columnNumber: "C2", status: false, checkDigit: 104 },
    { locationId: "A3-R3-C1", aisle: "A3", rowNumber: "R3", columnNumber: "C1", status: true, checkDigit: 105 },
    { locationId: "A3-R3-C2", aisle: "A3", rowNumber: "R3", columnNumber: "C2", status: false, checkDigit: 106 },
    { locationId: "A4-R4-C1", aisle: "A4", rowNumber: "R4", columnNumber: "C1", status: true, checkDigit: 107 },
    { locationId: "A4-R4-C2", aisle: "A4", rowNumber: "R4", columnNumber: "C2", status: false, checkDigit: 108 },
    { locationId: "A5-R5-C1", aisle: "A5", rowNumber: "R5", columnNumber: "C1", status: true, checkDigit: 109 },
    { locationId: "A5-R5-C2", aisle: "A5", rowNumber: "R5", columnNumber: "C2", status: false, checkDigit: 110 },
    { locationId: "A6-R6-C1", aisle: "A6", rowNumber: "R6", columnNumber: "C1", status: true, checkDigit: 111 },
    { locationId: "A6-R6-C2", aisle: "A6", rowNumber: "R6", columnNumber: "C2", status: false, checkDigit: 112 },
    { locationId: "A7-R7-C1", aisle: "A7", rowNumber: "R7", columnNumber: "C1", status: true, checkDigit: 113 },
    { locationId: "A7-R7-C2", aisle: "A7", rowNumber: "R7", columnNumber: "C2", status: false, checkDigit: 114 },
    { locationId: "A8-R8-C1", aisle: "A8", rowNumber: "R8", columnNumber: "C1", status: true, checkDigit: 115 },
    { locationId: "A8-R8-C2", aisle: "A8", rowNumber: "R8", columnNumber: "C2", status: false, checkDigit: 116 },
    { locationId: "A9-R9-C1", aisle: "A9", rowNumber: "R9", columnNumber: "C1", status: true, checkDigit: 117 },
    { locationId: "A9-R9-C2", aisle: "A9", rowNumber: "R9", columnNumber: "C2", status: false, checkDigit: 118 },
    { locationId: "A10-R10-C1", aisle: "A10", rowNumber: "R10", columnNumber: "C1", status: true, checkDigit: 119 },
    { locationId: "A10-R10-C2", aisle: "A10", rowNumber: "R10", columnNumber: "C2", status: false, checkDigit: 120 },
];

const sampleStagingLocations = [
    { locationId: "SL1", totalSpots: 10, availableSpot: 8, checkDigits: "101" },
    { locationId: "SL2", totalSpots: 12, availableSpot: 10, checkDigits: "102" },
    { locationId: "SL3", totalSpots: 15, availableSpot: 12, checkDigits: "103" },
    { locationId: "SL4", totalSpots: 8, availableSpot: 6, checkDigits: "104" },
    { locationId: "SL5", totalSpots: 20, availableSpot: 15, checkDigits: "105" },
    { locationId: "SL6", totalSpots: 10, availableSpot: 7, checkDigits: "106" },
    { locationId: "SL7", totalSpots: 12, availableSpot: 9, checkDigits: "107" },
    { locationId: "SL8", totalSpots: 15, availableSpot: 11, checkDigits: "108" },
    { locationId: "SL9", totalSpots: 8, availableSpot: 5, checkDigits: "109" },
    { locationId: "SL10", totalSpots: 20, availableSpot: 14, checkDigits: "110" },
    { locationId: "SL11", totalSpots: 10, availableSpot: 6, checkDigits: "111" },
    { locationId: "SL12", totalSpots: 12, availableSpot: 8, checkDigits: "112" },
    { locationId: "SL13", totalSpots: 15, availableSpot: 10, checkDigits: "113" },
    { locationId: "SL14", totalSpots: 8, availableSpot: 4, checkDigits: "114" },
    { locationId: "SL15", totalSpots: 20, availableSpot: 13, checkDigits: "115" },
    { locationId: "SL16", totalSpots: 10, availableSpot: 5, checkDigits: "116" },
    { locationId: "SL17", totalSpots: 12, availableSpot: 7, checkDigits: "117" },
    { locationId: "SL18", totalSpots: 15, availableSpot: 9, checkDigits: "118" },
    { locationId: "SL19", totalSpots: 8, availableSpot: 3, checkDigits: "119" },
    { locationId: "SL20", totalSpots: 20, availableSpot: 12, checkDigits: "120" },
];

const samplePallets = [
    { productID: 1001, palletID: 401, lotNumber: 2001, totalCases: 50, consignmentID: 801, Ti: 5, Hi: 10, createdAt: new Date("2025-04-01T08:00:00Z"), locationId: "A1-R1-C1", expiryDate: new Date("2026-04-01") },
    { productID: 1002, palletID: 402, lotNumber: 2002, totalCases: 40, consignmentID: 802, Ti: 4, Hi: 10, createdAt: new Date("2025-04-01T09:00:00Z"), locationId: "A2-R2-C2", expiryDate: new Date("2026-04-02") },
    { productID: 1003, palletID: 403, lotNumber: 2003, totalCases: 60, consignmentID: 803, Ti: 6, Hi: 10, createdAt: new Date("2025-04-01T10:00:00Z"), locationId: "A3-R3-C3", expiryDate: new Date("2026-04-03") },
    { productID: 1004, palletID: 404, lotNumber: 2004, totalCases: 30, consignmentID: 804, Ti: 3, Hi: 10, createdAt: new Date("2025-04-01T11:00:00Z"), locationId: "A4-R4-C4", expiryDate: new Date("2026-04-04") },
    { productID: 1005, palletID: 405, lotNumber: 2005, totalCases: 70, consignmentID: 805, Ti: 7, Hi: 10, createdAt: new Date("2025-04-01T12:00:00Z"), locationId: "A5-R5-C5", expiryDate: new Date("2026-04-05") },
    { productID: 1006, palletID: 406, lotNumber: 2006, totalCases: 45, consignmentID: 806, Ti: 5, Hi: 9, createdAt: new Date("2025-04-02T08:00:00Z"), locationId: "A6-R6-C6", expiryDate: new Date("2026-04-06") },
    { productID: 1007, palletID: 407, lotNumber: 2007, totalCases: 55, consignmentID: 807, Ti: 5, Hi: 11, createdAt: new Date("2025-04-02T09:00:00Z"), locationId: "A7-R7-C7", expiryDate: new Date("2026-04-07") },
    { productID: 1008, palletID: 408, lotNumber: 2008, totalCases: 35, consignmentID: 808, Ti: 4, Hi: 9, createdAt: new Date("2025-04-02T10:00:00Z"), locationId: "A8-R8-C8", expiryDate: new Date("2026-04-08") },
    { productID: 1009, palletID: 409, lotNumber: 2009, totalCases: 65, consignmentID: 809, Ti: 6, Hi: 11, createdAt: new Date("2025-04-02T11:00:00Z"), locationId: "A9-R9-C9", expiryDate: new Date("2026-04-09") },
    { productID: 1010, palletID: 410, lotNumber: 2010, totalCases: 25, consignmentID: 810, Ti: 3, Hi: 8, createdAt: new Date("2025-04-02T12:00:00Z"), locationId: "A10-R10-C10", expiryDate: new Date("2026-04-10") },
    { productID: 1011, palletID: 411, lotNumber: 2011, totalCases: 75, consignmentID: 811, Ti: 7, Hi: 11, createdAt: new Date("2025-04-03T08:00:00Z"), locationId: "A11-R11-C11", expiryDate: new Date("2026-04-11") },
    { productID: 1012, palletID: 412, lotNumber: 2012, totalCases: 50, consignmentID: 812, Ti: 5, Hi: 10, createdAt: new Date("2025-04-03T09:00:00Z"), locationId: "A12-R12-C12", expiryDate: new Date("2026-04-12") },
    { productID: 1013, palletID: 413, lotNumber: 2013, totalCases: 40, consignmentID: 813, Ti: 4, Hi: 10, createdAt: new Date("2025-04-03T10:00:00Z"), locationId: "A13-R13-C13", expiryDate: new Date("2026-04-13") },
    { productID: 1014, palletID: 414, lotNumber: 2014, totalCases: 60, consignmentID: 814, Ti: 6, Hi: 10, createdAt: new Date("2025-04-03T11:00:00Z"), locationId: "A14-R14-C14", expiryDate: new Date("2026-04-14") },
    { productID: 1015, palletID: 415, lotNumber: 2015, totalCases: 30, consignmentID: 815, Ti: 3, Hi: 10, createdAt: new Date("2025-04-03T12:00:00Z"), locationId: "A15-R15-C15", expiryDate: new Date("2026-04-15") },
    { productID: 1016, palletID: 416, lotNumber: 2016, totalCases: 70, consignmentID: 816, Ti: 7, Hi: 10, createdAt: new Date("2025-04-04T08:00:00Z"), locationId: "A16-R16-C16", expiryDate: new Date("2026-04-16") },
    { productID: 1017, palletID: 417, lotNumber: 2017, totalCases: 45, consignmentID: 817, Ti: 5, Hi: 9, createdAt: new Date("2025-04-04T09:00:00Z"), locationId: "A17-R17-C17", expiryDate: new Date("2026-04-17") },
    { productID: 1018, palletID: 418, lotNumber: 2018, totalCases: 55, consignmentID: 818, Ti: 5, Hi: 11, createdAt: new Date("2025-04-04T10:00:00Z"), locationId: "A18-R18-C18", expiryDate: new Date("2026-04-18") },
    { productID: 1019, palletID: 419, lotNumber: 2019, totalCases: 35, consignmentID: 819, Ti: 4, Hi: 9, createdAt: new Date("2025-04-04T11:00:00Z"), locationId: "A19-R19-C19", expiryDate: new Date("2026-04-19") },
    { productID: 1020, palletID: 420, lotNumber: 2020, totalCases: 65, consignmentID: 820, Ti: 6, Hi: 11, createdAt: new Date("2025-04-04T12:00:00Z"), locationId: "A20-R20-C20", expiryDate: new Date("2026-04-20") },
];

const samplePalletInfos = samplePallets;

const sampleUsers = [
    { userName: "John Doe", userEmployeeId: "EMP001", userRole: "Admin", userPassword: "pass123" },
    { userName: "Jane Smith", userEmployeeId: "EMP002", userRole: "Receiver", userPassword: "pass456" },
    { userName: "Mike Johnson", userEmployeeId: "EMP003", userRole: "Selector", userPassword: "pass789" },
    { userName: "Emily Brown", userEmployeeId: "EMP004", userRole: "RTO", userPassword: "pass101" },
    { userName: "David Lee", userEmployeeId: "EMP005", userRole: "Loader", userPassword: "pass112" },
    { userName: "Sarah Davis", userEmployeeId: "EMP006", userRole: "Docker", userPassword: "pass131" },
    { userName: "Chris Wilson", userEmployeeId: "EMP007", userRole: "Admin", userPassword: "pass415" },
    { userName: "Lisa Anderson", userEmployeeId: "EMP008", userRole: "Receiver", userPassword: "pass161" },
    { userName: "Tom Taylor", userEmployeeId: "EMP009", userRole: "Selector", userPassword: "pass718" },
    { userName: "Anna Martinez", userEmployeeId: "EMP010", userRole: "RTO", userPassword: "pass192" },
    { userName: "James White", userEmployeeId: "EMP011", userRole: "Loader", userPassword: "pass202" },
    { userName: "Kelly Green", userEmployeeId: "EMP012", userRole: "Docker", userPassword: "pass213" },
    { userName: "Robert Black", userEmployeeId: "EMP013", userRole: "Admin", userPassword: "pass224" },
    { userName: "Laura Adams", userEmployeeId: "EMP014", userRole: "Receiver", userPassword: "pass235" },
    { userName: "Peter Clark", userEmployeeId: "EMP015", userRole: "Selector", userPassword: "pass246" },
    { userName: "Megan Hall", userEmployeeId: "EMP016", userRole: "RTO", userPassword: "pass257" },
    { userName: "Brian Young", userEmployeeId: "EMP017", userRole: "Loader", userPassword: "pass268" },
    { userName: "Rachel King", userEmployeeId: "EMP018", userRole: "Docker", userPassword: "pass279" },
    { userName: "Steve Moore", userEmployeeId: "EMP019", userRole: "Admin", userPassword: "pass280" },
    { userName: "Nancy Hill", userEmployeeId: "EMP020", userRole: "Receiver", userPassword: "pass291" },
];

const samplePickingOrders = [
    { orderNumber: 501, storeNumber: 1, totalCases: 50, totalStop: 2, placedAt: new Date("2025-04-01T08:00:00Z"), toBeFulfilledBy: new Date("2025-04-02T08:00:00Z"), completedStatus: false, assignedStatus: true, totalPallets: 5, urgent: false, isShipped: false, items: [{ itemId: 1001, quantity: 25, pickedStatus: false }, { itemId: 1002, quantity: 25, pickedStatus: false }] },
    { orderNumber: 502, storeNumber: 2, totalCases: 40, totalStop: 1, placedAt: new Date("2025-04-01T09:00:00Z"), toBeFulfilledBy: new Date("2025-04-02T09:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 4, urgent: true, isShipped: true, items: [{ itemId: 1003, quantity: 40, pickedStatus: true }] },
    { orderNumber: 503, storeNumber: 3, totalCases: 60, totalStop: 3, placedAt: new Date("2025-04-01T10:00:00Z"), toBeFulfilledBy: new Date("2025-04-02T10:00:00Z"), completedStatus: false, assignedStatus: false, totalPallets: 6, urgent: false, isShipped: false, items: [{ itemId: 1004, quantity: 20, pickedStatus: false }, { itemId: 1005, quantity: 40, pickedStatus: false }] },
    { orderNumber: 504, storeNumber: 4, totalCases: 30, totalStop: 1, placedAt: new Date("2025-04-01T11:00:00Z"), toBeFulfilledBy: new Date("2025-04-02T11:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 3, urgent: true, isShipped: true, items: [{ itemId: 1006, quantity: 30, pickedStatus: true }] },
    { orderNumber: 505, storeNumber: 5, totalCases: 70, totalStop: 2, placedAt: new Date("2025-04-01T12:00:00Z"), toBeFulfilledBy: new Date("2025-04-02T12:00:00Z"), completedStatus: false, assignedStatus: true, totalPallets: 7, urgent: false, isShipped: false, items: [{ itemId: 1007, quantity: 35, pickedStatus: false }, { itemId: 1008, quantity: 35, pickedStatus: false }] },
    { orderNumber: 506, storeNumber: 6, totalCases: 45, totalStop: 1, placedAt: new Date("2025-04-02T08:00:00Z"), toBeFulfilledBy: new Date("2025-04-03T08:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 5, urgent: true, isShipped: true, items: [{ itemId: 1009, quantity: 45, pickedStatus: true }] },
    { orderNumber: 507, storeNumber: 7, totalCases: 55, totalStop: 2, placedAt: new Date("2025-04-02T09:00:00Z"), toBeFulfilledBy: new Date("2025-04-03T09:00:00Z"), completedStatus: false, assignedStatus: false, totalPallets: 6, urgent: false, isShipped: false, items: [{ itemId: 1010, quantity: 25, pickedStatus: false }, { itemId: 1011, quantity: 30, pickedStatus: false }] },
    { orderNumber: 508, storeNumber: 8, totalCases: 35, totalStop: 1, placedAt: new Date("2025-04-02T10:00:00Z"), toBeFulfilledBy: new Date("2025-04-03T10:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 4, urgent: true, isShipped: true, items: [{ itemId: 1012, quantity: 35, pickedStatus: true }] },
    { orderNumber: 509, storeNumber: 9, totalCases: 65, totalStop: 3, placedAt: new Date("2025-04-02T11:00:00Z"), toBeFulfilledBy: new Date("2025-04-03T11:00:00Z"), completedStatus: false, assignedStatus: true, totalPallets: 7, urgent: false, isShipped: false, items: [{ itemId: 1013, quantity: 20, pickedStatus: false }, { itemId: 1014, quantity: 45, pickedStatus: false }] },
    { orderNumber: 510, storeNumber: 10, totalCases: 25, totalStop: 1, placedAt: new Date("2025-04-02T12:00:00Z"), toBeFulfilledBy: new Date("2025-04-03T12:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 3, urgent: true, isShipped: true, items: [{ itemId: 1015, quantity: 25, pickedStatus: true }] },
    { orderNumber: 511, storeNumber: 11, totalCases: 75, totalStop: 2, placedAt: new Date("2025-04-03T08:00:00Z"), toBeFulfilledBy: new Date("2025-04-04T08:00:00Z"), completedStatus: false, assignedStatus: false, totalPallets: 8, urgent: false, isShipped: false, items: [{ itemId: 1016, quantity: 40, pickedStatus: false }, { itemId: 1017, quantity: 35, pickedStatus: false }] },
    { orderNumber: 512, storeNumber: 12, totalCases: 50, totalStop: 1, placedAt: new Date("2025-04-03T09:00:00Z"), toBeFulfilledBy: new Date("2025-04-04T09:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 5, urgent: true, isShipped: true, items: [{ itemId: 1018, quantity: 50, pickedStatus: true }] },
    { orderNumber: 513, storeNumber: 13, totalCases: 40, totalStop: 2, placedAt: new Date("2025-04-03T10:00:00Z"), toBeFulfilledBy: new Date("2025-04-04T10:00:00Z"), completedStatus: false, assignedStatus: true, totalPallets: 4, urgent: false, isShipped: false, items: [{ itemId: 1019, quantity: 20, pickedStatus: false }, { itemId: 1020, quantity: 20, pickedStatus: false }] },
    { orderNumber: 514, storeNumber: 14, totalCases: 60, totalStop: 1, placedAt: new Date("2025-04-03T11:00:00Z"), toBeFulfilledBy: new Date("2025-04-04T11:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 6, urgent: true, isShipped: true, items: [{ itemId: 1021, quantity: 60, pickedStatus: true }] },
    { orderNumber: 515, storeNumber: 15, totalCases: 30, totalStop: 2, placedAt: new Date("2025-04-03T12:00:00Z"), toBeFulfilledBy: new Date("2025-04-04T12:00:00Z"), completedStatus: false, assignedStatus: false, totalPallets: 3, urgent: false, isShipped: false, items: [{ itemId: 1022, quantity: 15, pickedStatus: false }, { itemId: 1023, quantity: 15, pickedStatus: false }] },
    { orderNumber: 516, storeNumber: 16, totalCases: 70, totalStop: 1, placedAt: new Date("2025-04-04T08:00:00Z"), toBeFulfilledBy: new Date("2025-04-05T08:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 7, urgent: true, isShipped: true, items: [{ itemId: 1024, quantity: 70, pickedStatus: true }] },
    { orderNumber: 517, storeNumber: 17, totalCases: 45, totalStop: 2, placedAt: new Date("2025-04-04T09:00:00Z"), toBeFulfilledBy: new Date("2025-04-05T09:00:00Z"), completedStatus: false, assignedStatus: true, totalPallets: 5, urgent: false, isShipped: false, items: [{ itemId: 1025, quantity: 25, pickedStatus: false }, { itemId: 1026, quantity: 20, pickedStatus: false }] },
    { orderNumber: 518, storeNumber: 18, totalCases: 55, totalStop: 1, placedAt: new Date("2025-04-04T10:00:00Z"), toBeFulfilledBy: new Date("2025-04-05T10:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 6, urgent: true, isShipped: true, items: [{ itemId: 1027, quantity: 55, pickedStatus: true }] },
    { orderNumber: 519, storeNumber: 19, totalCases: 35, totalStop: 2, placedAt: new Date("2025-04-04T11:00:00Z"), toBeFulfilledBy: new Date("2025-04-05T11:00:00Z"), completedStatus: false, assignedStatus: false, totalPallets: 4, urgent: false, isShipped: false, items: [{ itemId: 1001, quantity: 15, pickedStatus: false }, { itemId: 1002, quantity: 20, pickedStatus: false }] },
    { orderNumber: 520, storeNumber: 20, totalCases: 65, totalStop: 1, placedAt: new Date("2025-04-04T12:00:00Z"), toBeFulfilledBy: new Date("2025-04-05T12:00:00Z"), completedStatus: true, assignedStatus: true, totalPallets: 7, urgent: true, isShipped: true, items: [{ itemId: 1003, quantity: 65, pickedStatus: true }] },
];

const samplePickingTasks = samplePickingOrders.map((order, index) => ({
    ...order,
    stagingLocationId: `SL${index + 1}`,
}));

const samplePickingPallets = [
    { productId: 1001, locationId: "A1-R1-C1", Quantity: 50 },
    { productId: 1002, locationId: "A2-R2-C2", Quantity: 40 },
    { productId: 1003, locationId: "A3-R3-C3", Quantity: 60 },
    { productId: 1004, locationId: "A4-R4-C4", Quantity: 30 },
    { productId: 1005, locationId: "A5-R5-C5", Quantity: 70 },
    { productId: 1006, locationId: "A6-R6-C6", Quantity: 45 },
    { productId: 1007, locationId: "A7-R7-C7", Quantity: 55 },
    { productId: 1008, locationId: "A8-R8-C8", Quantity: 35 },
    { productId: 1009, locationId: "A9-R9-C9", Quantity: 65 },
    { productId: 1010, locationId: "A10-R10-C10", Quantity: 25 },
    { productId: 1011, locationId: "A11-R11-C11", Quantity: 75 },
    { productId: 1012, locationId: "A12-R12-C12", Quantity: 50 },
    { productId: 1013, locationId: "A13-R13-C13", Quantity: 40 },
    { productId: 1014, locationId: "A14-R14-C14", Quantity: 60 },
    { productId: 1015, locationId: "A15-R15-C15", Quantity: 30 },
    { productId: 1016, locationId: "A16-R16-C16", Quantity: 70 },
    { productId: 1017, locationId: "A17-R17-C17", Quantity: 45 },
    { productId: 1018, locationId: "A18-R18-C18", Quantity: 55 },
    { productId: 1019, locationId: "A19-R19-C19", Quantity: 35 },
    { productId: 1020, locationId: "A20-R20-C20", Quantity: 65 },
];

const sampleForkTasks = [
    { taskId: 601, productId: 1001, toLocation: "A1-R1-C1", isCompleted: false },
    { taskId: 602, productId: 1002, toLocation: "A2-R2-C2", isCompleted: true },
    { taskId: 603, productId: 1003, toLocation: "A3-R3-C3", isCompleted: false },
    { taskId: 604, productId: 1004, toLocation: "A4-R4-C4", isCompleted: true },
    { taskId: 605, productId: 1005, toLocation: "A5-R5-C5", isCompleted: false },
    { taskId: 606, productId: 1006, toLocation: "A6-R6-C6", isCompleted: true },
    { taskId: 607, productId: 1007, toLocation: "A7-R7-C7", isCompleted: false },
    { taskId: 608, productId: 1008, toLocation: "A8-R8-C8", isCompleted: true },
    { taskId: 609, productId: 1009, toLocation: "A9-R9-C9", isCompleted: false },
    { taskId: 610, productId: 1010, toLocation: "A10-R10-C10", isCompleted: true },
    { taskId: 611, productId: 1011, toLocation: "A11-R11-C11", isCompleted: false },
    { taskId: 612, productId: 1012, toLocation: "A12-R12-C12", isCompleted: true },
    { taskId: 613, productId: 1013, toLocation: "A13-R13-C13", isCompleted: false },
    { taskId: 614, productId: 1014, toLocation: "A14-R14-C14", isCompleted: true },
    { taskId: 615, productId: 1015, toLocation: "A15-R15-C15", isCompleted: false },
    { taskId: 616, productId: 1016, toLocation: "A16-R16-C16", isCompleted: true },
    { taskId: 617, productId: 1017, toLocation: "A17-R17-C17", isCompleted: false },
    { taskId: 618, productId: 1018, toLocation: "A18-R18-C18", isCompleted: true },
    { taskId: 619, productId: 1019, toLocation: "A19-R19-C19", isCompleted: false },
    { taskId: 620, productId: 1020, toLocation: "A20-R20-C20", isCompleted: true },
];

const sampleLoadingOrders = [
    { loadingId: 301, pallets: [{ palletId: 401, shipped: false }], isShipped: false, truckNumber: 1601, completedAt: null, totalPallets: 1, stagingLane: "SL1" },
    { loadingId: 302, pallets: [{ palletId: 402, shipped: true }], isShipped: true, truckNumber: 1602, completedAt: new Date("2025-04-01T12:00:00Z"), totalPallets: 1, stagingLane: "SL2" },
    { loadingId: 303, pallets: [{ palletId: 403, shipped: false }], isShipped: false, truckNumber: 1603, completedAt: null, totalPallets: 1, stagingLane: "SL3" },
    { loadingId: 304, pallets: [{ palletId: 404, shipped: true }], isShipped: true, truckNumber: 1604, completedAt: new Date("2025-04-01T13:00:00Z"), totalPallets: 1, stagingLane: "SL4" },
    { loadingId: 305, pallets: [{ palletId: 405, shipped: false }], isShipped: false, truckNumber: 1605, completedAt: null, totalPallets: 1, stagingLane: "SL5" },
    { loadingId: 306, pallets: [{ palletId: 406, shipped: true }], isShipped: true, truckNumber: 1606, completedAt: new Date("2025-04-01T14:00:00Z"), totalPallets: 1, stagingLane: "SL6" },
    { loadingId: 307, pallets: [{ palletId: 407, shipped: false }], isShipped: false, truckNumber: 1607, completedAt: null, totalPallets: 1, stagingLane: "SL7" },
    { loadingId: 308, pallets: [{ palletId: 408, shipped: true }], isShipped: true, truckNumber: 1608, completedAt: new Date("2025-04-01T15:00:00Z"), totalPallets: 1, stagingLane: "SL8" },
    { loadingId: 309, pallets: [{ palletId: 409, shipped: false }], isShipped: false, truckNumber: 1609, completedAt: null, totalPallets: 1, stagingLane: "SL9" },
    { loadingId: 310, pallets: [{ palletId: 410, shipped: true }], isShipped: true, truckNumber: 1610, completedAt: new Date("2025-04-01T16:00:00Z"), totalPallets: 1, stagingLane: "SL10" },
    { loadingId: 311, pallets: [{ palletId: 411, shipped: false }], isShipped: false, truckNumber: 1611, completedAt: null, totalPallets: 1, stagingLane: "SL11" },
    { loadingId: 312, pallets: [{ palletId: 412, shipped: true }], isShipped: true, truckNumber: 1612, completedAt: new Date("2025-04-02T12:00:00Z"), totalPallets: 1, stagingLane: "SL12" },
    { loadingId: 313, pallets: [{ palletId: 413, shipped: false }], isShipped: false, truckNumber: 1613, completedAt: null, totalPallets: 1, stagingLane: "SL13" },
    { loadingId: 314, pallets: [{ palletId: 414, shipped: true }], isShipped: true, truckNumber: 1614, completedAt: new Date("2025-04-02T13:00:00Z"), totalPallets: 1, stagingLane: "SL14" },
    { loadingId: 315, pallets: [{ palletId: 415, shipped: false }], isShipped: false, truckNumber: 1615, completedAt: null, totalPallets: 1, stagingLane: "SL15" },
    { loadingId: 316, pallets: [{ palletId: 416, shipped: true }], isShipped: true, truckNumber: 1616, completedAt: new Date("2025-04-02T14:00:00Z"), totalPallets: 1, stagingLane: "SL16" },
    { loadingId: 317, pallets: [{ palletId: 417, shipped: false }], isShipped: false, truckNumber: 1617, completedAt: null, totalPallets: 1, stagingLane: "SL17" },
    { loadingId: 318, pallets: [{ palletId: 418, shipped: true }], isShipped: true, truckNumber: 1618, completedAt: new Date("2025-04-02T15:00:00Z"), totalPallets: 1, stagingLane: "SL18" },
    { loadingId: 319, pallets: [{ palletId: 419, shipped: false }], isShipped: false, truckNumber: 1619, completedAt: null, totalPallets: 1, stagingLane: "SL19" },
    { loadingId: 320, pallets: [{ palletId: 420, shipped: true }], isShipped: true, truckNumber: 1620, completedAt: new Date("2025-04-02T16:00:00Z"), totalPallets: 1, stagingLane: "SL20" },
];

const sampleStagingOrders = [
    { shippingId: 701, totalPallets: 5, status: true, locationId: "SL1" },
    { shippingId: 702, totalPallets: 4, status: false, locationId: "SL2" },
    { shippingId: 703, totalPallets: 6, status: true, locationId: "SL3" },
    { shippingId: 704, totalPallets: 3, status: false, locationId: "SL4" },
    { shippingId: 705, totalPallets: 7, status: true, locationId: "SL5" },
    { shippingId: 706, totalPallets: 5, status: false, locationId: "SL6" },
    { shippingId: 707, totalPallets: 6, status: true, locationId: "SL7" },
    { shippingId: 708, totalPallets: 4, status: false, locationId: "SL8" },
    { shippingId: 709, totalPallets: 7, status: true, locationId: "SL9" },
    { shippingId: 710, totalPallets: 3, status: false, locationId: "SL10" },
    { shippingId: 711, totalPallets: 8, status: true, locationId: "SL11" },
    { shippingId: 712, totalPallets: 5, status: false, locationId: "SL12" },
    { shippingId: 713, totalPallets: 4, status: true, locationId: "SL13" },
    { shippingId: 714, totalPallets: 6, status: false, locationId: "SL14" },
    { shippingId: 715, totalPallets: 3, status: true, locationId: "SL15" },
    { shippingId: 716, totalPallets: 7, status: false, locationId: "SL16" },
    { shippingId: 717, totalPallets: 5, status: true, locationId: "SL17" },
    { shippingId: 718, totalPallets: 6, status: false, locationId: "SL18" },
    { shippingId: 719, totalPallets: 4, status: true, locationId: "SL19" },
    { shippingId: 720, totalPallets: 7, status: false, locationId: "SL20" },
];

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await mongoose.connection.db.dropDatabase();
        console.log('Cleared existing database');

        // Seed all collections
        await Counter.insertMany(sampleCounters);
        console.log('Counters seeded');

        await Manufacturer.insertMany(sampleManufacturers);
        console.log('Manufacturers seeded');

        await Product.insertMany(sampleProducts);
        console.log('Products seeded');

        await Docking.insertMany(sampleDockings);
        console.log('Dockings seeded');

        await Location.insertMany(sampleLocations);
        console.log('Locations seeded');

        await StagingLocation.insertMany(sampleStagingLocations);
        console.log('Staging Locations seeded');

        await Pallet.insertMany(samplePallets);
        console.log('Pallets seeded');

        await PalletInfo.insertMany(samplePalletInfos);
        console.log('Pallet Infos seeded');

        await User.insertMany(sampleUsers);
        console.log('Users seeded');

        await PickingOrder.insertMany(samplePickingOrders);
        console.log('Picking Orders seeded');

        await PickingTask.insertMany(samplePickingTasks);
        console.log('Picking Tasks seeded');

        await PickingPallet.insertMany(samplePickingPallets);
        console.log('Picking Pallets seeded');

        await ForkTask.insertMany(sampleForkTasks);
        console.log('Fork Tasks seeded');

        await LoadingOrder.insertMany(sampleLoadingOrders);
        console.log('Loading Orders seeded');

        await StagingOrder.insertMany(sampleStagingOrders);
        console.log('Staging Orders seeded');

        console.log('Database seeded successfully with:');
        console.log(`- ${sampleCounters.length} counters`);
        console.log(`- ${sampleManufacturers.length} manufacturers`);
        console.log(`- ${sampleProducts.length} products`);
        console.log(`- ${sampleDockings.length} dockings`);
        console.log(`- ${sampleLocations.length} locations`);
        console.log(`- ${sampleStagingLocations.length} staging locations`);
        console.log(`- ${samplePallets.length} pallets`);
        console.log(`- ${samplePalletInfos.length} pallet infos`);
        console.log(`- ${sampleUsers.length} users`);
        console.log(`- ${samplePickingOrders.length} picking orders`);
        console.log(`- ${samplePickingTasks.length} picking tasks`);
        console.log(`- ${samplePickingPallets.length} picking pallets`);
        console.log(`- ${sampleForkTasks.length} fork tasks`);
        console.log(`- ${sampleLoadingOrders.length} loading orders`);
        console.log(`- ${sampleStagingOrders.length} staging orders`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

async function resetDatabase() {
    try {
        console.log('Resetting database...');
        await mongoose.connection.db.dropDatabase();
        console.log('Database reset successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}