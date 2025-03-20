import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../includes/Header.jsx";
import '../../css/generalstylesheet.css';
import {useNavigate} from "react-router-dom";

const AssignSingleProductLocation = () => {
    const [productId, setProductId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("");
    const navigate = useNavigate();

    const API_URL = "https://stockstream-uo87.onrender.com";

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
            if (user.userRole !== "Supervisor" ) {
                if(user.userRole === "Admin") {
                   return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        setMessage({ text: "", type: "" });
        axios
            .get(`${API_URL}/assignproductlocation/products`)
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
            const response = await axios.post(`${API_URL}/assignproductlocation`, {
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

            <form onSubmit={handleSubmit} className="form">
                <h1 style={{color:"black"}}>Assign Location for Product</h1>
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
