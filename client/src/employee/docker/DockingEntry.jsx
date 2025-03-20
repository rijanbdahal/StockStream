import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../components/includes/Header.jsx";
import "../../css/generalstylesheet.css";

const DockingEntry = () => {
    const [manufacturer, setManufacturer] = useState([]);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [arrivalTime, setArrivalTime] = useState(null);
    const [dockingEntry, setDockingEntry] = useState({
        consignmentID: "",
        manufacturerID: "",
        products: [],
        totalPallets: "",
        doorNo: "",
        arrivalTime: "",
    });

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch authenticated user
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        axios.get(`${API_URL}/authRoutes/api/auth/user`, {
            headers: { Authorization: `Bearer ${authToken}` },
            withCredentials: true,
        })
            .then((response) => setUser(response.data.user))
            .catch(() => navigate("/login"));
    }, [API_URL, navigate]);

    // Check user role and permissions
    useEffect(() => {
        if (user?.userRole) {
            setUserRole(user.userRole);
            if (user.userRole !== "Docker" && user.userRole !== "Admin") {
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    // Update arrival time dynamically
    useEffect(() => {
        const updateTime = () => {
            const now = new Date().toISOString().slice(0, 16);
            setArrivalTime(now);
            setDockingEntry((prev) => ({ ...prev, arrivalTime: now }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch manufacturers and products
    useEffect(() => {
        const authToken = localStorage.getItem("token");

        axios.all([
            axios.get(`${API_URL}/dockingEntryAuth/manufacturer`, {
                headers: { Authorization: `Bearer ${authToken}` },
            }),
            axios.get(`${API_URL}/dockingEntryAuth/product`, {
                headers: { Authorization: `Bearer ${authToken}` },
            }),
        ])
            .then(axios.spread((manufacturersRes, productsRes) => {
                setManufacturer(manufacturersRes.data);
                setProduct(productsRes.data);
            }))
            .catch(() => setError("Failed to load data."))
            .finally(() => setLoading(false));
    }, [API_URL]);

    // Generate PDF function
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Docking Entry Report", 20, 20);
        doc.save("DockingEntry.pdf");
    };

    return (
        <div>
            <Header />
            <div className="docking-entry">
                <form onSubmit={handleSubmit}>
                    <h2>Docking Entry Form</h2>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <div className="form-group">
                        <label>Consignment ID</label>
                        <input type="text" name="consignmentID" value={dockingEntry.consignmentID} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Total Pallets</label>
                        <input type="number" name="totalPallets" value={dockingEntry.totalPallets} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Door Number</label>
                        <input type="number" name="doorNo" value={dockingEntry.doorNo} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <select name="manufacturerID" value={dockingEntry.manufacturerID} onChange={handleInputChange} required>
                            <option value="">Select Manufacturer</option>
                            {manufacturer.map(m => <option key={m.manufacturerID} value={m.manufacturerID}>{m.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Products</label>
                        <select name="products" multiple value={dockingEntry.products} onChange={handleProductChange} required>
                            {product.map(p => <option key={p.productID} value={p.productID}>{p.productName}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Arrival Time</label>
                        <input type="datetime-local" value={arrivalTime} readOnly />
                    </div>
                    <button type="submit">Submit</button>
                    <a href="/client/src/employee/docker/QueryDockingEntry">Query Docking Entry</a>
                </form>

            </div>

        </div>
    );
};

export default DockingEntry;
