import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../includes/Header.jsx";
import '../../css/generalstylesheet.css';

const AssignSingleProductLocation = () => {
    const [productId, setProductId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMessage({ text: "", type: "" }); // Reset message on mount
        axios
            .get("http://localhost:5000/assignproductlocation/products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setMessage({ text: "Failed to load products.", type: "error" });
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" }); // Clear previous messages
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/assignproductlocation", {
                productId,
                locationId,
            });

            setMessage({ text: response.data.msg || "Product location assigned successfully!", type: "success" });
            setProductId("");
            setLocationId("");
        } catch (err) {
            console.error("Error assigning product:", err);
            setMessage({
                text: err.response?.data?.msg || "Failed to assign location. Try again!",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Header />
            <h1 className="title">Assign Location for Product</h1>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="productId">Product:</label>
                    <select
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product.productID} value={product.productID}>
                                {product.productName} (ID: {product.productID})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="locationId">Location:</label>
                    <input
                        type="text"
                        id="locationId"
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {message.text && (
                <p className={`message ${message.type}`} aria-live="polite">
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default AssignSingleProductLocation;
