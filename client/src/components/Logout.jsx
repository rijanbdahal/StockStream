import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.post(`${API_URL}/loginAuth/logOut`, {}, { withCredentials: true })
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
