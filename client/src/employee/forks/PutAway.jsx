import React, {useEffect, useState} from 'react';
import Header from "../../components/includes/Header.jsx";
import axios from "axios";
import "../../css/generalstylesheet.css";
import QRScanner from "../../QRCodeReader.js";
import {useNavigate} from "react-router-dom";

const PutAway = () => {
    const [palletID, setPalletID] = useState('');
    const [assignedLocation, setAssignedLocation] = useState('');
    const [locationCheckDigit, setLocationCheckDigit] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Optional loading state
    const [scanning, setScanning] = useState(false);
    const API_URL = "https://stockstream-uo87.onrender.com";
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
        setPalletID(Number(scannedData));
        setScanning(false);
    }

    const handlePalletSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            // Pass palletID via query parameters
            const response = await axios.get(`${API_URL}/putawayAuth/${palletID}`);

            if (response.status === 200) {
                setAssignedLocation(response.data.locationId);
                setMessage('Pallet location fetched successfully');
            } else {
                setAssignedLocation('');
                setMessage('Pallet is not received yet');
            }
        } catch (err) {
            setAssignedLocation('');
            setMessage('Error fetching location: ' + (err.response?.data?.msg || 'Unknown error.'));
        } finally {
            setIsLoading(false); // End loading
        }

        setPalletID(''); // Reset pallet ID input
    };

    const handleLocationVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await axios.post(`${API_URL}/putawayAuth/locationAuth`, {
                locationId: assignedLocation,
                checkDigit: locationCheckDigit
            });

            if (response.status === 200) {
                setMessage('Location verified successfully!');
                setLocationCheckDigit(null)
                setAssignedLocation('');
            } else {
                setMessage('Verification failed: ' + response.data.msg);
            }
        } catch (err) {
            setMessage('Error verifying location: ' + (err.response?.data?.msg || 'Unknown error.'));
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="putaway-page">
            <Header />
            {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
            <form onSubmit={handlePalletSubmit} className="putaway-form-container">
                <h1 style={{color:"black"}}>Putaway</h1>
                <div className="putaway-form-group">
                    <label>Pallet ID</label>
                    <input
                        type="number"
                        value={palletID}
                        onChange={(e) => setPalletID(e.target.value)}
                        required
                    />
                    <br/>
                    <br/>
                    {!scanning ? (
                        <button
                        type="button"
                        onClick={()=>setScanning(true)}
                        className="receiving-task-submit-btn scan-btn">
                            Scan Pallet
                        </button>
                    ):(
                        <QRScanner onScan={handleScan} onClose={()=>setScanning(false)} />
                        )}
                </div>
                <label></label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Get Location'}
                </button>
            </form>

            {assignedLocation && (
                <div className="putaway-location-container">
                    <h3>Assigned Location</h3>
                    <p className="success" style={{ background: "#4496ff",color:"#ffffff" }}>Location: {assignedLocation}</p>
                    <form onSubmit={handleLocationVerify} className="putaway-form-container">
                        <div className="putaway-form-group">
                            <label>Location Check Digit</label>
                            <input
                                type="number"
                                value={locationCheckDigit}
                                onChange={(e) => setLocationCheckDigit(Number(e.target.value))}
                                required
                            />
                        </div>
                        <label></label>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Location'}
                        </button>
                    </form>
                </div>
            )}


        </div>
    );
};

export default PutAway;
