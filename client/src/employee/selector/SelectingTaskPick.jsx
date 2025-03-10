import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/includes/Header.jsx";


const socket = io("http://localhost:5000");

const SelectingTaskPick = () => {
    const navigate = useNavigate();
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

        socket.on("ShortProductSuccess", (message) => {
            console.log("Ozzy")
        });

        socket.on("success", (message) => {
            setSuccess(message);
            socket.emit("getItem", taskId);
        });

        socket.on("checkDigitError", (message) => {
            setError(message);
        });


        socket.on("confirmShort", ({ message, requiredQuantity, availableQuantity, productId, taskId }) => {
            const shortProductConfirm = window.confirm(
                `${message}\n Required Quantity:${requiredQuantity} \n AvailableQuantity:${availableQuantity}`
            );

            if (shortProductConfirm) {
                socket.emit("shortProductConfirm", { taskId, productId, availableQuantity });
            } else {
                alert("Please Enter Correct Quantity");
                setError("Please Enter Correct Quantity");
            }
        });

        return () => {
            socket.off("itemInfo");
            socket.off("taskComplete");
            socket.off("error");
            socket.off("checkDigitError");
            socket.off("itemPicked");
            socket.off("confirmShort");
        };
    }, [taskId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("verifyUserInput", {
            productId,
            taskId,
            inputCheckDigit,
            inputQuantity,
        });
        console.log(inputCheckDigit);
    };

    return (
        <div className="container">
            <Header />
            <div className="itemDetails">
                {success ? (
                    <h2 className="success">{success}</h2>
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
                <div className="userInput">
                    <form className="form-group" onSubmit={handleSubmit}>
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
                        <button className="submit-button" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SelectingTaskPick;
