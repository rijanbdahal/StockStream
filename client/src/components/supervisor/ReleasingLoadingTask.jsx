import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../includes/Header.jsx";
import '../../css/generalstylesheet.css';
import {useNavigate} from "react-router-dom";

const ReleaseLoadingTask = () => {
    const [orders, setOrders] = useState([]);
    const [orderNumber, setOrderNumber] = useState("");
    const [truckNumber, setTruckNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
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

            if (user.userRole !== "Supervisor") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/releaseloadingtask/getOrders");
                setOrders(response.data);
            } catch (error) {
                setErrorMessage("Something went wrong");
            }
        };
        fetchOrders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/releaseloadingtask`, {
                orderNumber: orderNumber,
                truckNumber: truckNumber
            });

            setSuccessMessage(response.data.message);
            setErrorMessage("");  // Clear any previous errors
            setOrderNumber("");   // Reset the form fields
            setTruckNumber("");
        } catch (error) {
            setErrorMessage(error.message || "Something went wrong");
        }
    };

    return (
        <div className="release-task-container">
            <Header />
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-container">
                    {errorMessage && <p className="message error">{errorMessage}</p>}
                    {successMessage && <p className="message success">{successMessage}</p>}
                    <h1 style={{ color: "black" }}>Release Loading Task</h1>
                    <div className="form-group">
                        <label htmlFor="orderNumber">Order Number</label>
                        <select
                            id="orderNumber"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            required
                        >
                            <option value="">Select Order Number</option>
                            {orders.map((order) => (
                                <option key={order.orderNumber} value={order.orderNumber}>
                                    {order.orderNumber}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="truckNumber">Truck Number</label>
                        <input
                            type="number"
                            id="truckNumber"
                            value={truckNumber}
                            onChange={(e) => setTruckNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReleaseLoadingTask;
