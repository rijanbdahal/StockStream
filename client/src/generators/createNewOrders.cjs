const mongoose = require('mongoose'); // Import Mongoose
const fs = require('fs'); // Import the File System module

const generateOrderData = () => {
    const orders = [];

    for (let i = 0; i < 100; i++) {
        // Random number of items (between 1 and 5 items per order)
        const numItems = Math.floor(Math.random() * 5) + 1;
        const items = [];

        for (let j = 0; j < numItems; j++) {
            items.push({
                itemId: 1000 + (Math.floor(Math.random() * 20)), // Random itemId between 1000 and 1019
                quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
                pickedStatus: false,
                isShipped: false
            });
        }

        const order = {
            _id: new mongoose.Types.ObjectId(),
            orderNumber: 45344 + i,
            storeNumber: 567 + (i % 10), // Random store number for simplicity
            totalCases: Math.floor(Math.random() * 100) + 50, // Random between 50 and 150
            totalStop: Math.floor(Math.random() * 3) + 1, // Random between 1 and 3 stops
            placedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Random placedAt time in past
            toBeFulfilledBy: new Date(Date.now() + Math.floor(Math.random() * 1000000000)), // Random toBeFulfilledBy time in future
            completedStatus: false,
            assignedStatus: false,
            totalPallets: Math.floor(Math.random() * 5) + 1, // Random pallets between 1 and 5
            urgent: Math.random() < 0.5, // Randomly make urgent (50% chance)
            items: items // Add the generated items
        };

        orders.push(order);
    }

    return orders;
};

// Generate orders
const orders = generateOrderData();

// Write the orders to a JSON file
fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
    if (err) {
        console.error('Error writing JSON file:', err);
    } else {
        console.log('Successfully wrote to orders.json');
    }
});
