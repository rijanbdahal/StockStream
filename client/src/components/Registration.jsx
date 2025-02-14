import React, { useState } from "react";
import "../css/register.css"
const Registration = () => {
    const [userName, setUserName] = useState('');
    const [userEmployeeId, setUserEmployeeId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (userName === '' || userEmployeeId === '' || userRole === '' || userPassword === '') {
            setError('Please fill all required fields');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/registrationAuth", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ userName, userEmployeeId, userRole, userPassword }),
            });


            if (!response.ok) {
                const data = await response.json();  // Parse response JSON
                if (data.error) {
                    // If there's a general error message, display it
                    setError(data.error);
                } else if (data.errors) {
                    // If validation errors exist, handle those
                    const errorMessage = data.errors.map(err => err.msg).join('\n');
                    setError(errorMessage);
                } else {
                    throw new Error('Failed to register account! Try again later.');
                }
                return;
            }


            setSuccess("Registration Successful!");
            setError("");
            setUserName("");
            setUserEmployeeId("");
            setUserRole("");
            setUserPassword("");
        } catch (error) {
            console.error("Error:", error);
            setError(error.message || "Something went wrong!");
            setSuccess(""); // Reset success message in case of an error
        }
    };

    return (
        <div className="registration-container">
            <h2>Registration</h2>


            {error && (
                <div className="error">
                    {
                        error.split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                        ))
                    }
                </div>
            )}
            {success && <p className="success">{success+'\n'}</p>} {/* Display success message */}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userName">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="userEmployeeId">Employee ID:</label>
                    <input
                        type="text"
                        id="userEmployeeId"
                        value={userEmployeeId}
                        onChange={(e) => setUserEmployeeId(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="userRole">User Role:</label>
                    <select
                        id="userRole"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        required
                    >
                        <option value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="Selector">Selector</option>
                        <option value="Receiver">Receiver</option>
                        <option value="RTO">RTO</option>
                        <option value="Loader">Loader</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="userPassword">Password:</label>
                    <input
                        type="password"
                        id="userPassword"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            <p>Already signed up? <a href="/Login">Login</a></p>
        </div>
    );
};

export default Registration;
