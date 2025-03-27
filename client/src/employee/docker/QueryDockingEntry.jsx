import React, {useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/includes/Header.jsx";
import '../../css/generalstylesheet.css';
import {useNavigate} from "react-router-dom";

const QueryDockingEntry = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dockingEntry, setDockingEntry] = useState(null);
    const [consignmentID, setConsignmentID] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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

            if (user.userRole !== "Docker") {
                if(user.userRole === "Admin" ||"Supervisor") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!consignmentID) {
            setError("Please enter a Consignment ID.");
            return;
        }

        setError("");
        setSuccess("");
        console.log("Fetching Consignment ID:", consignmentID);

        const authToken = localStorage.getItem("token");

        axios.get(`${API_URL}/dockingEntryQueryAuth/${consignmentID}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then((response) => {
                setDockingEntry(response.data);
                setSuccess("Consignment ID Found!");
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(err.response?.data?.error || "An error occurred.");
                setDockingEntry(null);
            });
    };

    return (
        <div className="docking-entry-query">
            <Header />


            {error && <p className="message error">{error}</p>}
            {success && <p className="message success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <h2>Docking Entry Inquiry</h2>
                <div className="form-group">
                    <label htmlFor="consignmentID">Consignment ID</label>
                    <input
                        id="consignmentID"
                        name="consignmentID"
                        value={consignmentID}
                        type="number"
                        required
                        placeholder="Enter Consignment ID"
                        onChange={(e) => setConsignmentID(e.target.value)}
                    />
                    <label></label>
                    <button type="submit">Submit</button>
                </div>
            </form>


            {dockingEntry && (
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            {Object.keys(dockingEntry).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {Object.values(dockingEntry).map((value, index) => (
                                <td key={index}>{String(value)}</td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <a href="/#/dockingentry"> Fill Docking Entry </a>
        </div>

    );
};

export default QueryDockingEntry;
