import React from 'react';
import logo from './logo/logo.jpg'; // Correct relative path
import '../../css/generalstylesheet.css';

const Header = () => {
    return (
        <header>
            <div className="logo-container">
                <img src={logo} alt="Dashboard" className="logo" />
            </div>
            <nav>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/userinfo">Employee Query</a></li>
                    <li><a href="/profile">My Profile</a></li>
                    <li><a href="/inquirelocation">Location</a></li>
                    <li><a href="/dockingentry">Docking</a></li>
                    <li><a href="/receivingtask">Receiving</a></li>
                    <li><a href="/putaway">Putaway</a></li>
                    <li><a href="/replenishtask">Replenish</a></li>
                    <li><a href="/selectingtaskdetails">Selection</a></li>
                    <li><a href="/assignsingleproductlocation">Assign Product Location</a></li>
                    <li><a href="/releasepickingtask">Release Picking Task</a></li>

                </ul>
            </nav>
        </header>
    );
};

export default Header;
