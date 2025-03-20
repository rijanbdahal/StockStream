import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "../includes/Header.jsx";
import '../../css/generalstylesheet.css';
import {useNavigate} from "react-router-dom";

const ReleasePickingTask = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
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

            if (user.userRole !== "Supervisor") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/releasepickingtask/locations`);
                setLocations(response.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setErrorMessage("Failed to load locations");
            }
        };
        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(locationId);
            const response = await axios.post(`${API_URL}/releasepickingtask`, {
                orderNumber: Number(orderNumber),
                locationId: locationId,
            });
            setSuccessMessage(response.data.message || "Order Released");
            setErrorMessage(''); // Clear previous errors
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Problem With Order Releasing");
            setSuccessMessage(''); // Clear success message if an error occurs
        }
    };

    return (
        <div className="release-task-container">
            <Header />
            <form className="form"  >
            <div className="form-container">
                {errorMessage && <p className="message error">{errorMessage}</p>}
                {successMessage && <p className="message success">{successMessage}</p>}
                <h1 style={{color:"black"}}>Release Picking Task</h1>
                <div className="form-group">
                    <label htmlFor="orderNumber">Order Number</label>
                    <input
                        type="number"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="locationId">Shipping Lane</label>
                    <select
                        id="locationId"
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}>
                        <option value="">Select a Location</option>
                        {locations.map((location) => (
                            <option key={location.locationId} value={location.locationId}>
                                {location.locationId} (Available Spot: {location.availableSpot})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <button onClick={handleSubmit}>Submit</button>
                </div>

            </div>
            </form>
        </div>
    );
};

export default ReleasePickingTask;
