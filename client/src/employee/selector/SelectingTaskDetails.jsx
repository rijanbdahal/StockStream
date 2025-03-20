import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import "../../css/generalstylesheet.css";

const SelectingTaskDetails = () => {
    const navigate = useNavigate();
    const [taskId, setTaskId] = useState(null);
    const [storeId, setStoreId] = useState(null);
    const [totalCases, setTotalCases] = useState(0);
    const [totalStop, setTotalStop] = useState(0);
    const [totalPallets, setTotalPallets] = useState(0);
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

            if (user.userRole !== "Selector") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    useEffect(() => {
        axios.get(`${API_URL}/selectingtask/details`)
            .then(response => {
                const { totalPallets, taskId, storeId, totalCases, totalStop } = response.data;
                setTotalPallets(totalPallets);
                setTaskId(taskId);
                setStoreId(storeId);
                setTotalCases(totalCases);
                setTotalStop(totalStop);
                setLoading(false);
            })
            .catch(error => {
                if (error.response && error.response.data.error) {
                    setError(error.response.data.error); // Display error from the backend
                } else {
                    setError("Failed to fetch data. Please try again.");
                }
                setLoading(false);
            });
    }, []);

    const handleSubmit = () => {
        if (taskId) {
            navigate('/selectingtaskpick', { state: { taskId } });
        } else {
            setError("Task ID is missing. Cannot proceed.");
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
                        <h2>Task Details</h2>
                        <p><strong>Task ID:</strong> {taskId}</p>
                        <p><strong>Store ID:</strong> {storeId}</p>
                        <p><strong>Total Cases:</strong> {totalCases}</p>
                        <p><strong>Total Stops:</strong> {totalStop}</p>
                        <p><strong>Total Pallets:</strong> {totalPallets}</p>
                        <button className="start-btn" type="button" onClick={handleSubmit}>
                            Start Picking
                        </button>
                    </>
                )}
            </section>
            </form>
        </div>
    );
};

export default SelectingTaskDetails;
