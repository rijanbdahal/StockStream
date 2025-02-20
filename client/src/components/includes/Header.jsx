import React from 'react';
import logo from './logo/logo.jpg'; // Correct relative path
import '../../css/header.css';
const Header = () => {
    return (
        <header>
            <div className="header">
                <img src={logo} alt="Dashboard" />
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/userinfo">Employee Query</a></li>
                    <li><a href="/profile">My Profile</a></li>
                    <li><a href="/inquirelocation">Location</a></li>
                    <li><a href="/dockingentry">Docking</a></li>

                </ul>
            </div>
        </header>
    );
};

export default Header;
