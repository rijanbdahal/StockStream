const PickingTask = require("../models/pickingTask");
const Location = require("../models/location");
const PickingPallet = require("../models/pickingPallet");
const Product = require("../models/product");
const StagingOrder = require("../models/stagingOrder");
const PickingOrder = require("../models/pickingOrder");

const updatePickingOrderStatus = async (orderNumber) => {
    try {
        const tasks = await PickingTask.find({ orderNumber });
        const allTasksCompleted = tasks.every(task => task.completedStatus === true);

        if (allTasksCompleted) {
            await PickingOrder.findOneAndUpdate(
                { orderNumber },
                { completedStatus: true }
            );
        }
    } catch (error) {
        console.error("Error updating order status:", error);
    }
};

const proceedToNextItem = async (task, socket) => {
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
        task.completedStatus = true;
        await task.save();
        await updatePickingOrderStatus(task.orderNumber);
        socket.emit("taskComplete", "Task Completed");
    }
};

const handleSocketConnection = (socket) => {
    console.log("New client connected");

    socket.on('getItem', async (taskId) => {
        try {
            const task = await PickingTask.findOne({ taskId });
            if (!task) return socket.emit("error", "Task not found");

            const itemToPick = task.items.find(item => !item.pickedStatus);
            if (!itemToPick) {
                return socket.emit("taskComplete", "Task Completed");
            }

            task.assignedStatus = true;
            await task.save();

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
            console.error("Error fetching item:", err);
            socket.emit("error", "Server Error");
        }
    });

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

            if (Number(location.checkDigit) !== Number(inputCheckDigit)) {
                return socket.emit("checkDigitError", "Invalid Check ID");
            }

            if (inputQuantity < item.quantity) {
                return socket.emit("confirmShort", {
                    message: "Product is short, do you confirm?",
                    requiredQuantity: item.quantity,
                    availableQuantity: inputQuantity,
                    productId,
                    taskId
                });
            }
            if (inputQuantity > item.quantity) {
                return socket.emit("error", "Invalid Quantity");
            }

            pickingPallet.Quantity -= inputQuantity;
            await pickingPallet.save();
            item.pickedStatus = true;
            item.quantity = inputQuantity;
            await task.save();
            await proceedToNextItem(task, socket);

            try {
                const stagingOrder = new StagingOrder({
                    shippingId: taskId,
                    totalPallets: task.totalPallets,
                    status: false,
                    locationId: task.stagingLocationId,
                });

                await stagingOrder.save();
            } catch (err) {
                console.error("Error creating staging order:", err);
                return socket.emit("error", "Server Error");
            }

            socket.emit("success", "Item Picked");

        } catch (err) {
            console.error("Error verifying user input:", err);
            socket.emit("error", "Server Error");
        }
    });



    socket.on('shortProductConfirm', async ({ taskId, productId, availableQuantity }) => {
        try {
            const task = await PickingTask.findOne({ taskId });
            if (!task) return socket.emit("error", "Task not found");

            const item = task.items.find(i => i.itemId === productId);
            if (!item) return socket.emit("error", "Item not found");

            const remainingQuantity = item.quantity - availableQuantity;
            item.quantity = availableQuantity;
            item.pickedStatus = true;
            await task.save();

            if (remainingQuantity > 0) {
                const newTask = new PickingTask({
                    orderNumber: task.orderNumber,
                    storeNumber: task.storeNumber,
                    totalCases: remainingQuantity,
                    totalStop: 1,
                    placedAt: task.placedAt,
                    toBeFulfilledBy: task.toBeFulfilledBy,
                    completedStatus: false,
                    assignedStatus: false,
                    totalPallets: 1,
                    urgent: task.urgent,
                    stagingLocationId: task.stagingLocationId,
                    items: [{
                        itemId: productId,
                        quantity: remainingQuantity,
                        pickedStatus: false
                    }]
                });

                await newTask.save();
            }

            await proceedToNextItem(task, socket);

            socket.emit("success", "Item Picked");
            socket.emit("ShortProductSuccess", "Short quantity recorded, moving to next item.");

        } catch (err) {
            console.error("Error processing short product confirmation:", err);
            socket.emit("error", "Server Error");
        }
    });

};

module.exports = { handleSocketConnection };
