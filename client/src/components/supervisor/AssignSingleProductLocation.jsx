import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "../includes/Header.jsx";

const AssignSingleProductLocation = () => {
    const [productId, setProductId] = useState(null);
    const [locationId, setLocationId] = useState('');
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/assignproductlocation/products`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/assignproductlocation', {
            productId: productId,
            locationId: locationId,
        }).then((response) => {
            setMessage(response.data.msg); // Set the success message
            // Reset the form fields
            setProductId(null);  // Reset selected product
            setLocationId('');   // Reset location input
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div>
            <Header />
            <h1>Assign Location For Product</h1>
            <form onSubmit={handleSubmit}>
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
                    />
                </div>

                <button type="submit">Submit</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AssignSingleProductLocation;
