import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import axios from 'axios';
import '../css/dashboard.css'; // Import CSS file
import Header from './includes/Header.jsx';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        // Retrieve the token from local storage
        const authToken = localStorage.getItem('authToken');


        // Send the token in the Authorization header
        axios.get('http://localhost:5000/authRoutes/api/auth/user', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
        })
            .then(response => {
                setUser(response.data.user);
                setLoading(false);
            })
            .catch(error => {
                console.error("Authentication failed:", error);
                navigate('/login'); // Redirect to login if unauthorized
            });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>; // Show loading while checking authentication
    }

    return (
        <div className="dashboard-container">
            <Header />
            <h1>Welcome to the Dashboard, {user?.userName}</h1>
            <p className="dashboard-description">

            </p>
        </div>
    );
};

export default Dashboard;
