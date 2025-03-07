import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import Header from "../../components/includes/Header.jsx";

const socket = io("http://localhost:5000"); // Adjust URL as needed

const SelectingTaskPick = () => {
    const locationState = useLocation();
    const [taskId] = useState(locationState.state?.taskId || "");

    const [productId, setProductId] = useState(null);
    const [quantityToPick, setQuantityToPick] = useState(null);
    const [productName, setProductName] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [inputCheckDigit, setInputCheckDigit] = useState("");
    const [inputQuantity, setInputQuantity] = useState("");

    useEffect(() => {
        // Request first item when component mounts
        socket.emit("getItem", taskId);
        console.log(taskId);
        socket.on("itemInfo", ({ productId, quantityToPick, productName, locationId }) => {
            setProductId(productId);
            setProductName(productName);
            setLocation(locationId);
            setQuantityToPick(quantityToPick);
            setError("");
        });

        socket.on("taskComplete", (message) => {
            setSuccess(message);
            setProductId(null);
            setProductName("");
            setLocation("");
            setQuantityToPick(null);
        });

        socket.on("error", (message) => {
            setError(message);
        });

        socket.on("checkDigitError", (message) => {
            setError(message);
        });

        socket.on("itemPicked", () => {
            socket.emit("getItem", taskId); // Automatically request next item
        });

    }, [taskId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("verifyUserInput", {
            productId,
            taskId,
            inputCheckDigit,
            inputQuantity
        });
        console.log(inputCheckDigit);
    };

    return (
        <div>
            <Header />
            <div className="itemDetails">
                {success ? (
                    <h2>{success}</h2>
                ) : (
                    <>
                        <label>Location: {location}</label>
                        <label>Product Name: {productName}</label>
                        <label>Quantity to Pick: {quantityToPick}</label>
                        <label>Product ID: {productId}</label>
                    </>
                )}
            </div>

            {error && <p className="error">{error}</p>}

            {!success && (
                <div className="user-input">
                    <form className="form-groups" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputCheckDigit">Check Digit:</label>
                            <input
                                id="inputCheckDigit"
                                type="number"
                                value={inputCheckDigit}
                                onChange={(e) => setInputCheckDigit(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={inputQuantity}
                                id="inputQuantity"
                                onChange={(e) => setInputQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SelectingTaskPick;
