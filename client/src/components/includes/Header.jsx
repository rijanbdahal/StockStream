import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './logo/logo.jpg';
import '../../css/generalstylesheet.css';

const Header = () => {
    const [userRole, setUserRole] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
            return;
        }

        axios.get(`${API_URL}/authRoutes/api/auth/user`, {
            headers: { Authorization: `Bearer ${authToken}` },
            withCredentials: true,
        })
            .then(response => {
                setUserRole(response.data.user.userRole);
            })
            .catch(error => {
                console.error("Failed to fetch user role:", error);
            });
    }, []);

    const navLinks = [
        { path: "/dashboard", label: "Dashboard", roles: ["Admin", "Loader","Supervisor","Receiver","Selector","Docker","RTO"] },
        { path: "/userinfo", label: "Employee Query", roles: ["Admin", "Supervisor"] },
        { path: "/profile", label: "My Profile", roles: ["Admin", "Loader","Supervisor","Receiver","Selector","Docker","RTO"] },
        { path: "/inquirelocation", label: "Location", roles: ["Admin", "Supervisor"] },
        { path: "/dockingentry", label: "Docking", roles: ["Admin", "Docker"] },
        { path: "/querydockingentry", label: "Query Docking Entry", roles: ["Admin", "Docker","Supervisor"] },
        { path: "/receivingtask", label: "Receiving", roles: ["Admin", "Receiver"] },
        { path: "/putaway", label: "Putaway", roles: ["Admin", "RTO"] },
        { path: "/replenishtask", label: "Replenish", roles: ["RTO"] },
        { path: "/selectingtaskdetails", label: "Selection", roles: ["Admin", "Selector"] },
        { path: "/assignsingleproductlocation", label: "Assign Location", roles: ["Admin", "Supervisor"] },
        { path: "/releasepickingtask", label: "Release Picking Task", roles: ["Admin", "Supervisor"] },
        { path: "/printpalletlabel", label: "Print Pallet Label", roles: ["Admin", "Supervisor"] },
        { path: "/printshippinglabel", label: "Print Shipping Label", roles: ["Admin", "Supervisor"] },
        { path: "/releaseloadingtask", label: "Release Loading Task", roles: ["Admin", "Supervisor"] },
        { path: "/loadingtaskdetails", label: "Loading", roles: ["Admin", "Loader"] },
        { path: "/logout", label: "Logout", roles: ["Admin", "Loader","Supervisor","Receiver","Selector","Docker","RTO"] },
    ];

    return (
        <>
            <button className="hamburger-button" onClick={() => setMenuOpen(true)}>☰</button>
            <br/>
            <header className={menuOpen ? "open" : ""}>
                <button className="close-sidebar-button" onClick={() => setMenuOpen(false)}>✖</button>

                <div className="logo-container">
                    <img src={logo} alt="Dashboard" className="logo" />
                </div>

                <nav>
                    <ul>
                        {navLinks.map(link =>
                            userRole && link.roles.includes(userRole) ? (
                                <li key={link.path}>
                                    <Link to={link.path} onClick={() => setMenuOpen(false)}>
                                        {link.label}
                                    </Link>
                                </li>
                            ) : null
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Header;
