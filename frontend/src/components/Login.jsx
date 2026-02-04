import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        
        try {
            const response = await api.post('/auth/authenticate', { email, password });
            
            // Save token and redirect
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard', { replace: true });

        } catch (error) {
            console.error("Login Failed", error);
            setMessage("Access Denied. Invalid credentials.");
        }
    };

    return (
        <div className="auth-container">
            <h2>SYSTEM LOGIN</h2>
            <p className="subtitle">Enter your credentials to access the mainframe.</p>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        className="input-field"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        placeholder="user@example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        className="input-field"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        placeholder="••••••••"
                    />
                </div>

                <button type="submit" className="btn-primary">Authenticate</button>
            </form>

            {message && <p className="error-msg">{message}</p>}

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                No account? <Link to="/register" className="link-text">Initialize Registration</Link>
            </div>
        </div>
    );
};

export default Login;