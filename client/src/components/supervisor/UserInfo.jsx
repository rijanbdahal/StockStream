import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../css/generalstylesheet.css";
import Header from '../includes/Header.jsx';
import {useNavigate} from "react-router-dom";

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;


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


    const userInfoQuery = (e) => {
        e.preventDefault();
        setUserData(null);
        if (!employeeId) {
            alert('Employee ID is required');
            setError('Employee ID is required');
            return;
        }

        // Reset previous error before new request
        setError(null);
        setLoading(true);

        // Send GET request with employeeId as query parameter
        axios
            .get(`${API_URL}/userAuth/${employeeId}`)
            .then((response) => {
                setUserData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response?.data?.msg || 'Error fetching data');  // Use detailed error if available
                console.error(error); // Log the full error for debugging
            });
    };

    return (
        <div className="userInfo-container">
            <Header />

            {/* Form to input employee ID */}
            <form onSubmit={userInfoQuery}>
                <div className="form-group">
                    <label htmlFor="employeeId">Employee ID:</label>
                    <input
                        type="text"
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)} // Update employeeId state
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>Search</button> {/* Disable button when loading */}
            </form>

            {/* Display loading message */}
            {loading && <p className="loading">Loading...</p>}

            {/* Display error message */}
            {error && <p className="error">{error}</p>}  {/* Display string error message */}

            {/* Display user data if available */}
            {userData && (
                <div className="userData">
                    <h2>User Information</h2>
                    <p><strong>User Id: </strong>{userData.userId}</p>
                    <p><strong>Name:</strong> {userData.userName}</p>
                    <p><strong>Role:</strong> {userData.userRole}</p>
                    <p><strong>Employee Id: </strong>{userData.userEmployeeId}</p>
                </div>
            )}
        </div>
    );
}

export default UserInfo;
