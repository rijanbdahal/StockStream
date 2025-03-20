import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/includes/Header.jsx";
import '../../css/generalstylesheet.css';

const StageOrder = () => {
    const locationState = useLocation();
    const [taskId] = useState(locationState.state?.taskId || "");  // Assuming locationState is passed properly
    const [locationId, setLocationId] = useState("");
    const [checkDigit, setCheckDigit] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [userRole, setUserRole] = useState("");
    const API_URL = "https://stockstream-uo87.onrender.com";
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

            if (user.userRole !== "Selector") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    useEffect(() => {
        const fetchLocation = async () => {
            try {
                console.log(taskId);
                const response = await axios.get(`${API_URL}/stageorder/${taskId}`);
                const fetchedLocation = response.data.locationId; // Assuming this contains the location details
                setLocationId(fetchedLocation);
            }catch (error) {
                console.error("Error fetching location:", error);
                setError("Failed to retrieve location based on Task ID.");
                setSuccess("");
            }
        };

        if (taskId) {
            fetchLocation();
        }
    }, [taskId]);

    const handleVerifyCheckDigit = async (e) => {
        e.preventDefault();

        if (!checkDigit) {
            setError("Please enter a check digit.");
            setSuccess("");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/stageorder/verify`, {
                taskId,
                checkDigit
            });

            setSuccess("Check digit verified successfully!");
            setError("");

            navigate("/selectingtaskdetails");

        } catch (error) {
            setError(error.response?.data?.message || "Invalid check digit. Please try again.");
            setSuccess("");
        }
    };

    return (
        <div className="release-task-container">
            <Header />
            <div className="form-group">

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {locationId ? (
                    <div className="location-container">
                        <p>Location for Task ID {taskId}:</p>
                        <p><strong>Location ID:</strong> {locationId}</p>
                    </div>
                ) : (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading" aria-live="polite">Loading...</p>
                    </div>
                )}

                <form onSubmit={handleVerifyCheckDigit}>
                    <h2>Stage Order</h2>
                    <div className="form-group">
                        <label htmlFor="checkDigit">Enter Check Digit</label>
                        <input
                            type="text"
                            id="checkDigit"
                            value={checkDigit}
                            onChange={(e) => setCheckDigit(e.target.value)}
                            placeholder="Enter check digit"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit">Verify Check Digit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StageOrder;
