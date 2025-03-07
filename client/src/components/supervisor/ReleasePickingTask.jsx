import React, { useState } from 'react';
import axios from "axios";
import Header from "../includes/Header.jsx";
import "../../css/releasepickingtask.css"

const ReleasePickingTask = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:5000/releasepickingtask/${orderNumber}`);
            setSuccessMessage(response.data.message || "Order Released");
            setErrorMessage(''); // Clear previous errors
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Problem With Order Releasing");
            setSuccessMessage(''); // Clear success message if an error occurs
        }
    };

    return (
        <div className="release-task-container">
            <Header />
            <div className="form-container">
                {errorMessage && <p className="message error">{errorMessage}</p>}
                {successMessage && <p className="message success">{successMessage}</p>}

                <div className="form-group">
                    <label htmlFor="orderNumber">Order Number</label>
                    <input
                        type="number"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ReleasePickingTask;
