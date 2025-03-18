import React, { useEffect, useState } from "react";
import Header from "../../components/includes/Header.jsx";
import axios from "axios";
import "../../css/generalstylesheet.css";
import QRScanner from "../../QRCodeReader.js";
import {useNavigate} from "react-router-dom";

const ReceivingTask = () => {
    const [consignmentID, setConsignmentID] = useState("");
    const [productID, setProductID] = useState("");
    const [palletID, setPalletID] = useState("");
    const [lotNumber, setLotNumber] = useState("");
    const [totalCases, setTotalCases] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [Ti, setTi] = useState("");
    const [Hi, setHi] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [products, setProducts] = useState([]);


    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        axios.get("http://localhost:5000/authRoutes/api/auth/user", {
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

            if (user.userRole !== "Receiver") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    const handleScan = (scannedData) => {
        setPalletID(scannedData); // Auto-fill the pallet ID field
        setScanning(false); // Stop scanning after successful scan
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!consignmentID) return; // Prevent API call if no consignment ID

            try {
                const response = await axios.get(`http://localhost:5000/receivingTaskAuth/products/${consignmentID}`);
                console.log(response);
                setProducts(response.data.products || []); // Ensure data consistency
                setError("");
            } catch (error) {
                setError("Loading products.");
                setProducts([]);
            }
        };

        fetchProducts();
    }, [consignmentID]); // Fetch when consignment ID changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!consignmentID || !productID || !palletID || !lotNumber || !totalCases || !Ti || !Hi) {
            setError("All fields are required.");
            return;
        }

        setError("");
        setSuccess("");
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
                expiryDate,
            });

            setSuccess(response.data.msg || "Receiving task successfully submitted.");
            setLoading(false);

            // Clear form fields after successful submission
            setConsignmentID("");
            setProductID("");
            setPalletID("");
            setLotNumber("");
            setTotalCases("");
            setTi("");
            setHi("");
            setExpiryDate("");
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.error || "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className={`receiving-task-container ${scanning ? "blur-background" : ""}`}>
            <Header />
            <form onSubmit={handleSubmit} className="receiving-task-form-container">
                <h2>Receiving Task</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="receiving-task-form-group">
                    <label>Consignment ID</label>
                    <input type="number" value={consignmentID} onChange={(e) => setConsignmentID(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="productID">Select Product</label>
                    <select id="productID" value={productID} onChange={(e) => setProductID(e.target.value)} required>
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.productID} value={product.productID}>
                                {product.productName} (ID: {product.productID})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="receiving-task-form-group">
                    <label>Pallet ID</label>
                    <input type="number" value={palletID} onChange={(e) => setPalletID(e.target.value)} required />
                    <br />
                    <br />

                    {!scanning ? (
                        <button type="button" onClick={() => setScanning(true)} className="receiving-task-submit-btn scan-btn">
                            Scan QR Code
                        </button>
                    ) : (
                        <QRScanner onScan={handleScan} onClose={() => setScanning(false)} />
                    )}
                </div>

                <div className="receiving-task-form-group">
                    <label>Lot Number</label>
                    <input type="number" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} required />
                </div>

                <div className="receiving-task-form-group">
                    <label>Total Cases</label>
                    <input type="number" value={totalCases} onChange={(e) => setTotalCases(e.target.value)} required />
                </div>

                <div className="receiving-task-form-group">
                    <label>Ti</label>
                    <input type="number" value={Ti} onChange={(e) => setTi(e.target.value)} required />
                </div>

                <div className="receiving-task-form-group">
                    <label>Hi</label>
                    <input type="number" value={Hi} onChange={(e) => setHi(e.target.value)} required />
                </div>

                <div className="receiving-task-form-group">
                    <label>Expiry Date</label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                </div>

                <button type="submit" disabled={loading} className="receiving-task-submit-btn">
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ReceivingTask;
