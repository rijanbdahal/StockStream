import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import "../../css/generalstylesheet.css";

const LoadingTaskDetails = () => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [truckNumber, setTruckNumber] = useState(null);
    const [stagingLane, setStagingLane] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

            if (user.userRole !== "Loader") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);



    useEffect(() => {
        axios.get(`${API_URL}/loadingTaskAuth/loadingTasks`)
            .then(response => {
                const { loadingId, truckNumber, stagingLane } = response.data.loadingOrder;
                setLoadingId(loadingId);
                setTruckNumber(truckNumber);
                setStagingLane(stagingLane);
                setLoading(false);
            })
            .catch(error => {
                setError("No Task");
                setLoading(false);
            });
    }, []);

    const handleSubmit = () => {
        console.log(loadingId);
        if (loadingId) {
            navigate('/loadingtask', { state: { loadingId:loadingId,stagingLane:stagingLane } });
        } else {
            setError("Loading ID is missing. Cannot proceed.");
        }
    };

    return (
        <div className="selecting-task-container">
            <Header />
            <form className="putaway-form-container">
            <section className="task-details">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading" aria-live="polite">Loading...</p>
                    </div>
                ) : error ? (
                    <p className="error" aria-live="assertive">{error}</p>
                ) : (
                    <>
                        <h2>Loading Task Details</h2>
                        <p><strong>Loading ID:</strong> {loadingId}</p>
                        <p><strong>Truck Number:</strong> {truckNumber}</p>
                        <p><strong>Staging Lane:</strong> {stagingLane}</p>
                        <button className="start-btn" type="button" onClick={handleSubmit}>
                            Load Task
                        </button>
                    </>
                )}
            </section>
            </form>
        </div>
    );
};

export default LoadingTaskDetails;
