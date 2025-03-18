import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import QRScanner from "../../QRCodeReader.js";
import Header from "../../components/includes/Header.jsx"; // Assuming you have the header component
import "../../css/generalstylesheet.css"; // Assuming the stylesheet is the same

const LoadingTask = () => {
    const navigate = useNavigate();
    const locationState = useLocation();
    const [loadingId, setLoadingId] = useState(locationState.state?.loadingId || null);
    const [palletId, setPalletId] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Optional loading state
    const [stagingLane, setStagingLane] = useState(locationState.state?.stagingLane||null);
    const handleScan = (scannedData) => {
        setPalletId(Number(scannedData));
        setScanning(false);
    }

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        axios.get("http://localhost:5000/authRoutes/api/auth/user", {
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

            if (user.userRole !== "Loader") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await axios.post("http://localhost:5000/loadingtask/handleSubmit", {
                loadingId,
                palletId,
            });
            setSuccess(response.data.message || "Pallet Loaded");

            // Check if the order is fully shipped
            if (response.data.orderShipped) {
                // Navigate to the LoadingTaskDetails page if all pallets are shipped
                navigate("/loadingtaskdetails", { state: { loadingId } });
            } else {
                navigate("/loadingtask", { state: { loadingId } });
            }
        } catch (err) {
            setError("Pallet Doesn't Exist");
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="loading-task-page">
            <Header />


            <form onSubmit={handleSubmit} className="putaway-form-container">

                <h1 style={{color: "black"}}>Loading Task</h1>
                {success && <p className="message success">{success}</p>}
                {error && <p className="message error">{error}</p>}
                <div className="putaway-form-group">
                    <label htmlFor="loadingId">Loading ID:{loadingId}</label><br/>
                    <label htmlFor="shippingLane">Shipping Lane:{stagingLane}</label><br/>
                    <label htmlFor="palletId">Pallet ID</label>
                    <input
                        type="number"
                        id="palletId"
                        value={palletId}
                        onChange={(e) => setPalletId(e.target.value)}
                        required
                    />
                    <br />
                    <br />
                    {!scanning ? (
                        <button
                            type="button"
                            onClick={() => setScanning(true)}
                            className="receiving-task-submit-btn scan-btn"
                        >
                            Scan QR Code
                        </button>
                    ) : (
                        <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />
                    )}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default LoadingTask;
