import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import '../../css/replenishtask.css';

const ReplenishTask = () => {
    const [fromLocationId, setFromLocationId] = useState('');
    const [toLocationId, setToLocationId] = useState('');
    const [palletId, setPalletId] = useState('');
    const [checkDigit, setCheckDigit] = useState('');
    const [pickingPalletData, setPickingPalletData] = useState(null);
    const [messages, setMessages] = useState('');
    const [taskUpdated, setTaskUpdated] = useState(false); // State to trigger re-fetch

    // Function to refetch task data
    const fetchTaskData = () => {
        axios.get('http://localhost:5000/replenishtask/gettask')
            .then(response => {
                setFromLocationId(response.data?.location?.locationId || '');
                setPickingPalletData(response.data?.pickingPallet || null);
            })
            .catch(error => {
                console.error("Error fetching task:", error);
                setMessages(error.msg?.message || "No Task To Display");
            });
    };

    // useEffect that depends on taskUpdated state
    useEffect(() => {
        fetchTaskData();
    }, [taskUpdated]); // Re-fetch when taskUpdated changes

    const verifyPalletId = async () => {
        if (!palletId || isNaN(palletId)) {
            console.error("Invalid palletID:", palletId);
            setMessages("Invalid Pallet ID");
            return;
        }

        if (!pickingPalletData) {
            console.error("Error: No picking pallet data available.");
            setMessages("No picking pallet data available.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/replenishtask/verifypalletid`, { palletId });
            setToLocationId(response.data.toLocationId);
        } catch (error) {
            console.error("Error verifying pallet ID:", error);
            setMessages("Error verifying pallet ID");
        }
    };

    const verifyCheckDigit = async () => {
        if (!checkDigit || isNaN(checkDigit)) {
            setMessages("Invalid Check Digit");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/replenishtask/verifycheckdigit`, {
                checkDigit,
                toLocationId,
                palletId,
            });

            setMessages(response.data.msg);
            setCheckDigit('');
            setPalletId('');


            setTaskUpdated(prevState => !prevState); // Toggle the state to trigger re-fetch

        } catch (error) {
            console.error("Error verifying check digit:", error);
            setMessages(error.response?.data?.msg || "Verification failed");
        }
    };

    // Function to handle skipping the task and loading a new one
    const handleSkip = () => {
        axios.get('http://localhost:5000/replenishtask/skip')
            .then(response => {
                setFromLocationId(response.data?.location?.locationId || '');
                setPickingPalletData(response.data?.pickingPallet || null);
            })
            .catch(error => {
                console.error("Error fetching task:", error);
                setMessages(error.response?.data?.msg || "No Task To Display");
            });
    };

    return (
        <div className="inquiry-location">
            <Header />
            <h2>Replenish Task</h2>
            <p><strong>From Location:</strong> {fromLocationId}</p>
            <div className="inquiry-location-form">
                <div className="inquiry-location-form-group">
                    <label htmlFor="palletId">Pallet ID: </label>
                    <input
                        type="number"
                        id="palletId"
                        value={palletId}
                        onChange={(e) => setPalletId(e.target.value)}
                        required
                    />
                    <button onClick={verifyPalletId}>Check</button>
                </div>
                <p><strong>To Location:</strong> {toLocationId}</p>
                <div className="inquiry-location-form-group">
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
                <button onClick={handleSkip} className="skip-button">Skip Task</button> {/* Skip button */}
                {messages && <p className="strong-message">{messages}</p>}

            </div>
        </div>
    );
};

export default ReplenishTask;
