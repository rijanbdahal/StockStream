import React, { useState } from "react";
import axios from "axios";
import '../../css/UserInfo.css';  // Importing scoped CSS file
import Header from '../includes/Header.jsx';

const UserInfo = () => {
    const [userData, setUserData] = useState(null);
    const [employeeId, setEmployeeId] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            .get(`http://localhost:5000/userAuth/${employeeId}`)
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
