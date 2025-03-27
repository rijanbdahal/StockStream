import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../components/includes/Header.jsx";
import '../../css/generalstylesheet.css';

const DockingEntry = () => {
    const [manufacturer, setManufacturer] = useState([]);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [arrivalTime, setArrivalTime] = useState(null);
    const [dockingEntry, setDockingEntry] = useState({
        consignmentID: "",
        manufacturerID: "",
        products: [],
        totalPallets: "",
        doorNo: "",
        arrivalTime: "",
    });

    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("");

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
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date().toISOString().slice(0, 16);
            setArrivalTime(now);
            setDockingEntry(prevState => ({ ...prevState, arrivalTime: now }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {

        const authToken = localStorage.getItem("token");
        axios.all([
            axios.get(`${API_URL}/dockingEntryAuth/manufacturer`, { headers: { Authorization: `Bearer ${authToken}` } }),
            axios.get(`${API_URL}/dockingEntryAuth/product`, { headers: { Authorization: `Bearer ${authToken}` } })
        ])
            .then(axios.spread((manufacturersRes, productsRes) => {
                setManufacturer(manufacturersRes.data);
                setProduct(productsRes.data);
            }))
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add logo
        const imgData = "data:image/jpeg;base64,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"; // Replace with your base64-encoded logo
        const logoWidth = 40;
        const logoHeight = 20;
        doc.addImage(imgData, "PNG", 80, 5, logoWidth, logoHeight);

        // Title
        doc.setFontSize(16);
        doc.text("Docking Entry Details", 10, 35);

        // Docking entry details
        doc.setFontSize(12);
        const lineSpacing = 10;
        let y = 45;

        doc.text(`Consignment ID: ${dockingEntry.consignmentID}`, 10, y);
        y += lineSpacing;
        doc.text(`Total Pallets: ${dockingEntry.totalPallets}`, 10, y);
        y += lineSpacing;
        doc.text(`Door Number: ${dockingEntry.doorNo}`, 10, y);
        y += lineSpacing;
        doc.text(`Manufacturer ID: ${dockingEntry.manufacturerID}`, 10, y);
        y += lineSpacing;

        // Handling long product lists
        doc.text("Products:", 10, y);
        y += lineSpacing;
        const products = dockingEntry.products.join(", ");
        const splitProducts = doc.splitTextToSize(products, 180); // Wrap text if too long
        doc.text(splitProducts, 10, y);
        y += splitProducts.length * 6; // Adjust y based on wrapped lines

        // Arrival Time
        doc.text(`Arrival Time: ${dockingEntry.arrivalTime}`, 10, y + lineSpacing);

        // Formatting filename properly
        const formattedDate = new Date(dockingEntry.arrivalTime)
            .toISOString()
            .replace(/[:.]/g, "-"); // Ensure filename is safe

        doc.save(`DockingEntry_CID-${dockingEntry.consignmentID}_${formattedDate}.pdf`);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dockingEntry.consignmentID || !dockingEntry.manufacturerID || dockingEntry.products.length === 0) {
            setError("Please fill in all fields.");
            return;
        }
        axios.post(`${API_URL}/dockingEntryAuth/dockingentry`, dockingEntry)
            .then(() => {
                setSuccess("Docking entry added successfully.");
                generatePDF();
                setDockingEntry({ consignmentID: "", manufacturerID: "", products: [], totalPallets: "", doorNo: "", arrivalTime: arrivalTime });
            })
            .catch((error) => {
                console.error("Error submitting docking entry:", error);
                setError("Error submitting docking entry.");
            });
    };

    const handleInputChange = (e) => {
        setDockingEntry({ ...dockingEntry, [e.target.name]: e.target.value });
    };

    const handleProductChange = (e) => {
        setDockingEntry({ ...dockingEntry, products: Array.from(e.target.selectedOptions, option => option.value) });
    };

    if (loading) return <div>Loading...</div>;

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
                    <a href="/querydockingentry">Query Docking Entry</a>
                </form>

            </div>
        </div>
    );
};

export default DockingEntry;
