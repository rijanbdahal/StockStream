import React, {useEffect, useState} from "react";
import axios from "axios";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import Header from "../includes/Header.jsx";
import "../../css/generalstylesheet.css";
import {useNavigate} from "react-router-dom"; // ✅ Same stylesheet

const GenerateShippingLabel = () => {
    const [taskId, setTaskId] = useState("");
    const [taskDetails, setTaskDetails] = useState(null); // Separate state for task details
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


    const fetchTask = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!taskId) {
            setErrorMessage("Please enter a valid Task ID.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/printLabelAuth/task/${taskId}`);
            if (response.data) {
                setTaskDetails(response.data); // Set the task details here
                setSuccessMessage("Task ID found! Ready to generate label.");
            } else {
                setErrorMessage("No task found for this ID.");
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            setErrorMessage(error.response?.data?.error || "Task not found.");
        }
    };

    const generateQRCode = async (taskId) => {
        try {
            return await QRCode.toDataURL(taskId);
        } catch (error) {
            console.error("Error generating QR code:", error);
            setErrorMessage("Failed to generate QR code.");
        }
    };

    const printLabel = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!taskId || !taskDetails) {
            setErrorMessage("No Task ID found to print.");
            return;
        }

        try {
            const qrCodeDataUrl = await generateQRCode(String(taskId));

            const doc = new jsPDF();
            doc.text(`Task ID: ${taskId}`, 10, 10);
            doc.addImage(qrCodeDataUrl, "PNG", 10, 20, 100, 100);
            doc.save(`${taskId}_Shipping_label.pdf`);

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
                <h2>Generate Shipping Label</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <div className="print-pallet-label-form-group">
                    <label>Task ID</label>
                    <input
                        type="text"
                        id="taskId"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                        placeholder="Enter Task ID"
                    />
                    <br/>
                </div>

                <button
                    type="button"
                    onClick={fetchTask}
                    className="print-pallet-label-btn"
                    disabled={taskDetails !== null} // Disable button if task is already fetched
                >
                    Check
                </button>


                {taskDetails && (

                    <div className="print-pallet-label-info">
                        <br/>
                        <button onClick={printLabel} className="print-pallet-label-btn" >
                            Print Label
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default GenerateShippingLabel;
