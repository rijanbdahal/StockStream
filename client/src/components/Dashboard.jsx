import React from 'react';
import '../css/dashboard.css'; // Import the CSS file for styling
import Header from './includes/Header.jsx';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Header/>
            <h1>Welcome to the Dashboard, </h1>
            <p className="dashboard-description">Here you can manage your account, track your progress, and access important resources.</p>



        </div>
    );
};

export default Dashboard;
