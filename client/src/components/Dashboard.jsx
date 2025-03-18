import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { Line } from 'react-chartjs-2';  // Import Line chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './includes/Header.jsx';
import '../css/generalstylesheet.css'; // Import CSS file

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [user, setUser] = useState({
        userName: 'John Doe'  // Static user name, replace with actual if needed
    });

    // Static task stats data
    const taskStats = {
        docking: { received: 200, completed: 180 },
        receiving: { received: 150, completed: 140 },
        rto: { received: 100, completed: 90 },
        picking: { received: 250, completed: 230 },
        loading: { received: 120, completed: 110 }
    };

    // Prepare data for the chart
    const data = {
        labels: ['Docking', 'Receiving', 'RTO', 'Picking', 'Loading'], // Task groups
        datasets: [
            {
                label: 'Received Tasks',
                data: [
                    taskStats.docking.received,
                    taskStats.receiving.received,
                    taskStats.rto.received,
                    taskStats.picking.received,
                    taskStats.loading.received
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Completed Tasks',
                data: [
                    taskStats.docking.completed,
                    taskStats.receiving.completed,
                    taskStats.rto.completed,
                    taskStats.picking.completed,
                    taskStats.loading.completed
                ],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <Header />
            <div className="dashboard-header">
                <h1>Welcome to the Dashboard, {user?.userName}</h1>
                <p className="dashboard-description">Your personalized dashboard with task stats.</p>
            </div>

            <div className="chart-container">
                <h2>Task Completion Overview</h2>
                <Line data={data} />
            </div>
        </div>
    );
};

export default Dashboard;
