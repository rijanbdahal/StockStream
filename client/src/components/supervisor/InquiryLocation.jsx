import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../includes/Header.jsx";
import axios from "axios";
import '../../css/inquirylocation.css'

const InquiryLocation = () => {
    const [aisle, setAisle] = useState('');
    const [columnNumber, setColumnNumber] = useState('');
    const [rowNumber, setRowNumber] = useState('');
    const [available, setAvailable] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!aisle || !columnNumber || !rowNumber) {
            setError("All fields are required.");
            return;
        }

        setError('');
        setLoading(true);

        const locationId = `${aisle.trim()}${columnNumber.trim()}${rowNumber.trim()}`;
        console.log("Generated locationId:", locationId);

        axios.get(`http://localhost:5000/locationAuth/${locationId}`)
            .then((response) => {
                setLocationData(response.data);
                setAvailable(response.data.status);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response?.data?.msg || 'Error fetching data');
                setLoading(false);
                console.error(error);
            });
    };

    const handleToggleStatus = () => {
        if (!locationData) return;
        console.log(locationData);

        axios.put(`http://localhost:5000/locationAuth/${locationData.locationId}/changeStatus`)
            .then((response) => {
                setAvailable(response.data.status);
            })
            .catch((error) => {
                setError(error.response?.data?.msg || "Error updating status");
                console.error(error);
            });
    };

    return (
        <div className="inquiry-location">
            <Header />
            <h2>Inquiry Location</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Aisle:</label>
                    <input type="text" value={aisle} onChange={(e) => setAisle(e.target.value)} required />
                </div>
                <div>
                    <label>Column Number:</label>
                    <input type="number" value={columnNumber} onChange={(e) => setColumnNumber(e.target.value)} required />
                </div>
                <div>
                    <label>Row Number:</label>
                    <input type="number" value={rowNumber} onChange={(e) => setRowNumber(e.target.value)} required />
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Checking...' : 'Inquire'}
                    </button>
                </div>
            </form>

            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {available !== null && (
                <div>
                    <p>The location is {available ? "available" : "not available"}.</p>
                    <button onClick={handleToggleStatus}>
                        {available ? "Mark as Unavailable" : "Mark as Available"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default InquiryLocation;
