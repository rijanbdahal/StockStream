import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../includes/Header.jsx";
import "../../css/dockingentry.css";

const DockingEntry = () => {
    const [manufacturer, setManufacturer] = useState([]);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [arrivalTime, setArrivalTime] = useState(null);
    const [dockingEntry, setDockingEntry] = useState({
        consignmentID: null,
        manufacturerID: null,
        products: [],
        totalPallets: null,
        doorNo: null,
        arrivalTime: '',

    });

    const navigate = useNavigate();

    // Update arrival time every second
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");

            const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            setArrivalTime(formattedTime);
            setDockingEntry(prevState => ({
                ...prevState,
                arrivalTime: formattedTime // Update arrivalTime in dockingEntry state
            }));
        };

        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Fetch manufacturers and products
    useEffect(() => {
        const authToken = localStorage.getItem("token");

        // Fetch manufacturers
        axios.get("http://localhost:5000/dockingEntryAuth/manufacturer", {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then((response) => {
                setManufacturer(response.data);


            })
            .catch((error) => {
                console.error("Error fetching manufacturers:", error);
                setError("Failed to load manufacturers.");
            });

        // Fetch products
        axios.get("http://localhost:5000/dockingEntryAuth/product", {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError("Failed to load products.");
            })
            .finally(() => {
                setLoading(false); // Set loading false after both API calls
            });

    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Arrival Time before submission:", arrivalTime);

        // Only submit if dockingEntry fields are valid
        if (dockingEntry.consignmentID && dockingEntry.manufacturerID && dockingEntry.products.length) {
            axios.post("http://localhost:5000/dockingEntryAuth/dockingentry", {
                ...dockingEntry,  // Spread the existing dockingEntry fields
                arrivalTime: arrivalTime // Add arrivalTime explicitly
            })
                .then((response) => {
                    console.log("Docking entry added successfully:", response.data);
                    setSuccess("Docking entry added successfully.");
                    setDockingEntry({
                        consignmentID: null,
                        manufacturerID: null,
                        products: [],
                        totalPallets: null,
                        doorNo: null,
                    });
                })
                .catch((error) => {
                    console.error("Error submitting docking entry:", error);
                    setError("Error submitting docking entry.");
                });
        } else {
            setError("Please fill in all fields.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDockingEntry({
            ...dockingEntry,
            [name]: value,
        });
    };

    const handleProductChange = (e) => {
        // Extract selected product IDs from the select options
        const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
        setDockingEntry({
            ...dockingEntry,
            products: selectedProducts,  // Update state with the selected products
        });
    };


    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Header />
            <div className="docking-entry">
            <h2>Docking Entry Form</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="consignmentID">Consignment ID</label>
                    <input
                        type="text"
                        id="consignmentID"
                        name="consignmentID"
                        value={dockingEntry.consignmentID}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Consignment ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="totalPallets">Total Pallets</label>
                    <input
                        type="number"
                        id="totalPallets"
                        name="totalPallets"
                        value={dockingEntry.totalPallets}
                        onChange={handleInputChange}
                        required
                        placeholder="Total Pallets "
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="doorNo">Door Number</label>
                    <input
                        type="number"
                        id="doorNo"
                        name="doorNo"
                        value={dockingEntry.doorNo}
                        onChange={handleInputChange}
                        required
                        placeholder="Door Number "
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="manufacturerID">Manufacturer</label>
                    <select
                        id="manufacturerID"
                        name="manufacturerID"
                        value={dockingEntry.manufacturerID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Manufacturer</option>
                        {manufacturer.map((manu) => (
                            <option key={manu.manufacturerID} value={manu.manufacturerID}>
                                {manu.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="products">Products</label>
                    <select
                        id="products"
                        name="products"
                        multiple
                        value={dockingEntry.products || []}  // Ensuring it's an array
                        onChange={handleProductChange}
                        required
                    >
                        {product.map((prod) => (
                            <option key={prod.productID} value={prod.productID}>
                                {prod.productName}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="arrivalTime">Arrival Time</label>
                    <input
                        type="datetime-local"
                        id="arrivalTime"
                        value={arrivalTime}
                        readOnly
                    />
                </div>

                <button type="submit">Submit</button>
                <a href="./querydockingentry"> Find Docking Entry Here! </a>
            </form>
        </div>
        </div>
    );
};

export default DockingEntry;
