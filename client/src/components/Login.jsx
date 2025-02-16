import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // Adjust the path if necessary

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            navigate('/dashboard');
            return;
        }
        
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userId === '' || userPassword === '') {
            setError('Please enter both User ID and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/loginAuth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                navigate('/dashboard');
            } else {
                setError(data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred, please try again later');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input type="number" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="userPassword">Password:</label>
                    <input type="password" id="userPassword" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/Registration">Sign Up</a></p>
        </div>
    );
};

export default Login;
