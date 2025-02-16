import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../includes/Header.jsx";
import '../../css/profile.css'; // Importing the CSS for styling

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the token from local storage
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            navigate('/login'); // Redirect to login if no token found
            return;
        }

        // Send the token in the Authorization header
        axios.get('http://localhost:5000/authRoutes/api/auth/user', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
        })
            .then(response => {
                setUserData(response.data.user); // Save user data in state
                setLoading(false);  // Stop loading
            })
            .catch(error => {
                setError('Failed to load user data');
                setLoading(false); // Stop loading
                console.error("Authentication failed:", error);
            });
    }, [navigate]);

    // Conditional rendering based on loading or error states
    if (loading) {
        return <div className="loading"><h1>Loading...</h1></div>;
    }

    if (error) {
        return <div className="error"><h1>{error}</h1></div>;
    }

    return (
        <div className="profile-container">
            <Header />
            <h2 className="profile-title">Profile</h2>
            {userData ? (
                <div className="profile-details">
                    <p><strong>Name:</strong> {userData.userName}</p>
                    <p><strong>Role:</strong> {userData.userRole}</p>
                    <p><strong>Employee ID:</strong> {userData.userEmployeeId}</p>
                    <p><strong>User ID:</strong> {userData.id}</p>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
};

export default Profile;
