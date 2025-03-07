const PickingTask = require("../models/PickingTask");
const Location = require("../models/Location");
const PickingPallet = require("../models/PickingPallet");
const Product = require("../models/Product");

const handleSocketConnection = (socket) => {
    console.log("New client connected");

    // Handle fetching next item
    socket.on('getItem', async (taskId) => {
        try {
            const task = await PickingTask.findOne({ taskId:taskId });
            if (!task) return socket.emit("error", "Task not found");

            // Find the next item that is not picked
            const itemToPick = task.items.find(item => !item.pickedStatus);
            if (!itemToPick) {
                return socket.emit("taskComplete", "Task Completed");
            }

            const product = await Product.findOne({ productID: itemToPick.itemId });
            const location = await PickingPallet.findOne({ productId: itemToPick.itemId });

            socket.emit("itemInfo", {
                productId: itemToPick.itemId,
                pickedStatus: itemToPick.pickedStatus,
                quantityToPick: itemToPick.quantity,
                productName: product ? product.productName : "Unknown",
                locationId: location ? location.locationId : "Unknown"
            });

        } catch (err) {
            socket.emit("error", "Server Error");
        }
    });

    // Handle item verification
    socket.on('verifyUserInput', async ({ productId, taskId, inputCheckDigit, inputQuantity }) => {
        try {
            const task = await PickingTask.findOne({ taskId });
            if (!task) return socket.emit("error", "Task not found");

            const pickingPallet = await PickingPallet.findOne({ productId });
            if (!pickingPallet) return socket.emit("error", "Pallet not found");

            const location = await Location.findOne({ locationId: pickingPallet.locationId });
            if (!location) return socket.emit("error", "Location not found");

            const item = task.items.find(i => i.itemId === productId);
            if (!item) return socket.emit("error", "Item not found");

            console.log(inputCheckDigit);
            console.log(location.checkDigit);

            if (location.checkDigit !== inputCheckDigit) {
                return socket.emit("checkDigitError", "Invalid Check ID");
            }

            if (item.quantity !== inputQuantity) {
                return socket.emit("confirmShort", "Is the product short?");
            }

            // Update picked status
            pickingPallet.Quantity -= inputQuantity;
            item.pickedStatus = true;
            await pickingPallet.save();
            await task.save();

            socket.emit("itemPicked", "Item Picked");

            // Fetch next item automatically
            const nextItem = task.items.find(i => !i.pickedStatus);
            if (nextItem) {
                const nextProduct = await Product.findOne({ productID: nextItem.itemId });
                const nextLocation = await PickingPallet.findOne({ productId: nextItem.itemId });

                socket.emit("itemInfo", {
                    productId: nextItem.itemId,
                    pickedStatus: nextItem.pickedStatus,
                    quantityToPick: nextItem.quantity,
                    productName: nextProduct ? nextProduct.productName : "Unknown",
                    locationId: nextLocation ? nextLocation.locationId : "Unknown"
                });
            } else {
                socket.emit("taskComplete", "Task Completed");
            }

        } catch (err) {
            socket.emit("error", "Server Error");
        }
    });
};

module.exports = { handleSocketConnection };
