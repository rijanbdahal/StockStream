import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import "../../css/generalstylesheet.css";
import QRScanner from "../../QRCodeReader.js";
import {useNavigate} from "react-router-dom";

const ReplenishTask = () => {
    const [fromLocationId, setFromLocationId] = useState("");
    const [toLocationId, setToLocationId] = useState("");
    const [palletId, setPalletId] = useState("");
    const [checkDigit, setCheckDigit] = useState("");
    const [pickingPalletData, setPickingPalletData] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [taskUpdated, setTaskUpdated] = useState(false); // State to trigger re-fetch
    const [scanning, setScanning] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        axios.get(`${API_URL}/authRoutes/api/auth/user`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
        })
            .then(response => {
                setUser(response.data.user);

                console.log(response.data.user);
            })
            .catch(error => {
                console.error("Authentication failed:", error);
                navigate("/login");
            });
    }, [navigate]);

    useEffect(() => {
        if (user && user.userRole) {
            setUserRole(user.userRole);
            console.log("User Role:", user.userRole);
            console.log("user",user);

            if (user.userRole !== "RTO") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    const handleScan = (scannedData) => {
        setPalletId(Number(scannedData));
        setScanning(false);
    }

    const fetchTaskData = () => {
        setSuccessMessage("");
        setErrorMessage("");

        axios
            .get(`${API_URL}/replenishtask/gettask`)
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
            const response = await axios.post(`${API_URL}/replenishtask/verifypalletid`, {
                palletId,
            });

            setToLocationId(response.data.toLocationId);
            setSuccessMessage("Pallet ID verified successfully.");
        } catch (error) {
            console.error("Error verifying pallet ID:", error);
            setErrorMessage( "Error verifying pallet ID");
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
            const response = await axios.post(`${API_URL}/replenishtask/verifycheckdigit`, {
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
            setErrorMessage( "Verification failed");
        }
    };

    // Function to handle skipping the task and loading a new one
    const handleSkip = () => {
        setSuccessMessage("");
        setErrorMessage("");

        axios
            .get(`${API_URL}/replenishtask/skip`)
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

                    <br/>
                    <br/>
                    {!scanning?(
                        <button type="button" onClick={() =>setScanning(true)} className="receiving-task-submit-btn scan-btn">
                            Scan Pallet ID
                        </button>
                    ):(
                        <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />
                    )}



                </div>
                <br/>
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
                    <br/>
                    <br/>

                    <button onClick={verifyCheckDigit}>Verify</button>
                </div>
                <br/>

                <button onClick={handleSkip} className="skip-button" style={{background:"#861000"}}>Skip Task</button>
            </div>
        </div>
    );
};

export default ReplenishTask;
