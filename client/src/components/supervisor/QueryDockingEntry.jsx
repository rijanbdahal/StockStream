import React, { useState } from "react";
import axios from "axios";
import Header from "../includes/Header.jsx";
import "../../css/dockingentryquery.css"; // Import the CSS file

const QueryDockingEntry = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dockingEntry, setDockingEntry] = useState(null);
    const [consignmentID, setConsignmentID] = useState("");

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

        axios.get(`http://localhost:5000/dockingEntryQueryAuth/${consignmentID}`, {
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
            <h2>Docking Entry</h2>

            {error && <p className="message error">{error}</p>}
            {success && <p className="message success">{success}</p>}

            <form onSubmit={handleSubmit}>
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
            <a href="./dockingentry"> Fill Docking Entry </a>
        </div>

    );
};

export default QueryDockingEntry;
