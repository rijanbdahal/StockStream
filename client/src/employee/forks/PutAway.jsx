import React, { useState } from 'react';
import Header from "../../components/includes/Header.jsx";
import axios from "axios";
import "../../css/putaway.css";

const PutAway = () => {
    const [palletID, setPalletID] = useState('');
    const [assignedLocation, setAssignedLocation] = useState('');
    const [locationCheckDigit, setLocationCheckDigit] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Optional loading state

    const handlePalletSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            // Pass palletID via query parameters
            const response = await axios.get(`http://localhost:5000/putawayAuth/${palletID}`);

            if (response.status === 200) {
                setAssignedLocation(response.data.locationId);
                setMessage('Pallet location fetched successfully');
            } else {
                setAssignedLocation('');
                setMessage('Pallet is not received yet');
            }
        } catch (err) {
            setAssignedLocation('');
            setMessage('Error fetching location: ' + (err.response?.data?.msg || 'Unknown error.'));
        } finally {
            setIsLoading(false); // End loading
        }

        setPalletID(''); // Reset pallet ID input
    };

    const handleLocationVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await axios.post(`http://localhost:5000/putawayAuth/locationAuth`, {
                locationId: assignedLocation,
                checkDigit: locationCheckDigit
            });

            if (response.status === 200) {
                setMessage('Location verified successfully!');
                setLocationCheckDigit(null)
                setAssignedLocation('');
            } else {
                setMessage('Verification failed: ' + response.data.msg);
            }
        } catch (err) {
            setMessage('Error verifying location: ' + (err.response?.data?.msg || 'Unknown error.'));
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="putaway-page">
            <Header />

            <form onSubmit={handlePalletSubmit} className="putaway-form-container">
                <div className="putaway-form-group">
                    <label>Pallet ID</label>
                    <input
                        type="number"
                        value={palletID}
                        onChange={(e) => setPalletID(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Get Location'}
                </button>
            </form>

            {assignedLocation && (
                <div className="putaway-location-container">
                    <h3>Assigned Location</h3>
                    <p>Location: {assignedLocation}</p>
                    <form onSubmit={handleLocationVerify} className="putaway-form-container">
                        <div className="putaway-form-group">
                            <label>Location Check Digit</label>
                            <input
                                type="number"
                                value={locationCheckDigit}
                                onChange={(e) => setLocationCheckDigit(Number(e.target.value))}
                                required
                            />
                        </div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Location'}
                        </button>
                    </form>
                </div>
            )}

            {message && <p className={`putaway-message ${message.includes('Error') ? 'putaway-error' : 'putaway-success'}`}>{message}</p>}
        </div>
    );
};

export default PutAway;
