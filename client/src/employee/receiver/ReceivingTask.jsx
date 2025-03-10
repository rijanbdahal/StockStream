import React, { useState } from 'react';
import Header from "../../components/includes/Header.jsx";
import axios from "axios";
import "../../css/generalstylesheet.css";

const ReceivingTask = () => {
    const [consignmentID, setConsignmentID] = useState('');
    const [productID, setProductID] = useState('');
    const [palletID, setPalletID] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [totalCases, setTotalCases] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [Ti, setTi] = useState('');
    const [Hi, setHi] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!consignmentID || !productID || !palletID || !lotNumber || !totalCases || !Ti || !Hi) {
            setError("All fields are required.");
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/receivingTaskAuth", {
                consignmentID,
                productID,
                palletID,
                lotNumber,
                totalCases,
                Ti,
                Hi,
                expiryDate
            });

            setSuccess(response.data.msg || "Receiving task successfully submitted.");
            setLoading(false);

            // Clear form fields after successful submission
            setConsignmentID('');
            setProductID('');
            setPalletID('');
            setLotNumber('');
            setTotalCases('');
            setTi('');
            setHi('');
            setExpiryDate('');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || "Failed to submit data.");
            setLoading(false);
        }
    };

    return (
        <div className="receiving-task-container">
            <Header />
            <form onSubmit={handleSubmit} className="receiving-task-form-container">
                <h2>Receiving Task</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <div className="receiving-task-form-group">
                    <label>Consignment ID</label>
                    <input
                        type="number"
                        value={consignmentID}
                        onChange={(e) => setConsignmentID(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Product ID</label>
                    <input
                        type="number"
                        value={productID}
                        onChange={(e) => setProductID(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Pallet ID</label>
                    <input
                        type="number"
                        value={palletID}
                        onChange={(e) => setPalletID(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Lot Number</label>
                    <input
                        type="number"
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Total Cases</label>
                    <input
                        type="number"
                        value={totalCases}
                        onChange={(e) => setTotalCases(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Ti</label>
                    <input
                        type="number"
                        value={Ti}
                        onChange={(e) => setTi(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Hi</label>
                    <input
                        type="number"
                        value={Hi}
                        onChange={(e) => setHi(e.target.value)}
                        required
                    />
                </div>
                <div className="receiving-task-form-group">
                    <label>Expiry Date</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="receiving-task-submit-btn"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ReceivingTask;
