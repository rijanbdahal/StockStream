import React, {useEffect, useState} from 'react';
import axios from "axios";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import Header from "../includes/Header.jsx";
import "../../css/generalstylesheet.css";
import {useNavigate} from "react-router-dom";

const PrintPalletLabel = () => {
    const [toLocation, setToLocation] = useState("");
    const [palletId, setPalletId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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

            if (user.userRole !== "Supervisor") {
                if(user.userRole === "Admin") {
                    return;
                }
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);


    const checkLocation = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!toLocation) {
            setErrorMessage("Please enter a location.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/printLabelAuth/location/${toLocation}`);
            console.log(response);
            setPalletId(response.data.palletID);
            setSuccessMessage("Pallet found! Ready to generate label.");
        } catch (error) {
            console.error("Error fetching pallet:", error);
            setErrorMessage(error.response?.data?.error || "Location has no pallet.");
            setPalletId("");
        }
    };

    const generateQRCode = async (palletId) => {
        try {
            const qrCodeDataUrl = QRCode.toDataURL(palletId);
            return qrCodeDataUrl;
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    const printLabel = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!palletId) {
            setErrorMessage("No pallet found to print.");
            return;
        }

        try {
            const qrCodeDataUrl = await generateQRCode(String(palletId));

            const doc = new jsPDF();
            doc.text(`Label ID: ${palletId}`, 10, 10);
            doc.addImage(qrCodeDataUrl, 'PNG', 10, 20, 100, 100);
            doc.save(`${palletId}_label.pdf`);

            setSuccessMessage("Label PDF generated successfully!");
        } catch (error) {
            console.error("Error generating label:", error);
            setErrorMessage("Failed to generate label.");
        }
    };

    return (
        <div className="print-pallet-label-container">
            <Header />
            <form className="print-pallet-label-form-container">
                <h2>Print Pallet Label</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <div className="print-pallet-label-form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        id="toLocation"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        placeholder="Enter Location"
                    />
                </div>

                <button type="button" onClick={checkLocation} className="print-pallet-label-btn">
                    Check
                </button>

                {palletId && (
                    <div className="print-pallet-label-info">
                        <br/>
                        <button onClick={printLabel} className="print-pallet-label-btn">
                            Print Label
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PrintPalletLabel;
