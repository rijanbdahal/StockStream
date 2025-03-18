import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.post("http://localhost:5000/authRoutes/api/auth/logout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("authToken");

                navigate("/login");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
                navigate("/login"); // Ensure user is redirected regardless
            });
    }, [navigate]);

};

export default Logout;
