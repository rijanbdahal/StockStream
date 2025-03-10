import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import "../../css/generalstylesheet.css";

const ReplenishTask = () => {
    const [fromLocationId, setFromLocationId] = useState("");
    const [toLocationId, setToLocationId] = useState("");
    const [palletId, setPalletId] = useState("");
    const [checkDigit, setCheckDigit] = useState("");
    const [pickingPalletData, setPickingPalletData] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [taskUpdated, setTaskUpdated] = useState(false); // State to trigger re-fetch

    // Function to refetch task data
    const fetchTaskData = () => {
        setSuccessMessage("");
        setErrorMessage("");

        axios
            .get("http://localhost:5000/replenishtask/gettask")
            .then((response) => {
                setFromLocationId(response.data?.location?.locationId || "");
                setPickingPalletData(response.data?.pickingPallet || null);
            })
            .catch((error) => {
                console.error("Error fetching task:", error);
                setErrorMessage(error.response?.data?.error || "No Task To Display");
            });
    };

    // useEffect that depends on taskUpdated state
    useEffect(() => {
        fetchTaskData();
    }, [taskUpdated]); // Re-fetch when taskUpdated changes

    const verifyPalletId = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!palletId || isNaN(palletId)) {
            setErrorMessage("Invalid Pallet ID");
            return;
        }

        if (!pickingPalletData) {
            setErrorMessage("No picking pallet data available.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/replenishtask/verifypalletid", {
                palletId,
            });

            setToLocationId(response.data.toLocationId);
            setSuccessMessage("Pallet ID verified successfully.");
        } catch (error) {
            console.error("Error verifying pallet ID:", error);
            setErrorMessage(error.response?.data?.error || "Error verifying pallet ID");
        }
    };

    const verifyCheckDigit = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!checkDigit || isNaN(checkDigit)) {
            setErrorMessage("Invalid Check Digit");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/replenishtask/verifycheckdigit", {
                checkDigit,
                toLocationId,
                palletId,
            });

            setSuccessMessage(response.data.message || "Check digit verified successfully.");
            setCheckDigit("");
            setPalletId("");

            setTaskUpdated((prevState) => !prevState); // Toggle the state to trigger re-fetch
        } catch (error) {
            console.error("Error verifying check digit:", error);
            setErrorMessage(error.response?.data?.error || "Verification failed");
        }
    };

    // Function to handle skipping the task and loading a new one
    const handleSkip = () => {
        setSuccessMessage("");
        setErrorMessage("");

        axios
            .get("http://localhost:5000/replenishtask/skip")
            .then((response) => {
                setFromLocationId(response.data?.location?.locationId || "");
                setPickingPalletData(response.data?.pickingPallet || null);
                setSuccessMessage("Skipped to the next task.");
            })
            .catch((error) => {
                console.error("Error fetching task:", error);
                setErrorMessage(error.response?.data?.error || "No Task To Display");
            });
    };

    return (
        <div className="container">
            <Header />
            <h2>Replenish Task</h2>

            {/* ✅ Success & Error Messages */}
            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}

            <p><strong>From Location:</strong> {fromLocationId}</p>

            <div className="receiving-task-form-container">
                <div className="receiving-task-form-group">
                    <label htmlFor="palletId">Pallet ID: </label>
                    <input
                        type="number"
                        id="palletId"
                        value={palletId}
                        onChange={(e) => setPalletId(e.target.value)}
                        required
                    />


                </div>
                <button onClick={verifyPalletId}>Check</button>

                <p><strong>To Location:</strong> {toLocationId}</p>
                <br/>
                <div className="receiving-task-form-group">
                    <label htmlFor="checkDigit">Check Digit: </label>
                    <input
                        type="number"
                        id="checkDigit"
                        value={checkDigit}
                        onChange={(e) => setCheckDigit(e.target.value)}
                        required
                    />

                    <button onClick={verifyCheckDigit}>Verify</button>
                </div>
                <br/>

                <button onClick={handleSkip} className="skip-button" style={{background:"#861000"}}>Skip Task</button>
            </div>
        </div>
    );
};

export default ReplenishTask;
