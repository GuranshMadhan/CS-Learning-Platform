import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    // Initialize the hook
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous errors
        
        try {
            console.log("Attempting login...");
            const response = await api.post('/auth/authenticate', {
                email: email,
                password: password
            });

            console.log("Login success! Token received.");

            // 1. Save Token
            localStorage.setItem('token', response.data.token);
            
            // 2. IMMEDIATE Redirect (No timeout needed for login)
            // Using 'replace: true' prevents them from clicking "Back" to return to login
            navigate('/dashboard', { replace: true }); 

        } catch (error) {
            console.error("Login Error:", error);
            setMessage("Login Failed. Check credentials.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
            
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        placeholder="john@example.com"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        placeholder="Enter your password"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                    Login
                </button>
            </form>

            {message && <p style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{message}</p>}

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                <p>Don't have an account?</p>
                <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                    Create an Account
                </Link>
            </div>
        </div>
    );
};

export default Login;