import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Clear old tokens on load to ensure clean registration
    useEffect(() => { localStorage.removeItem('token'); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            
            // Auto-login after register
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard', { replace: true });

        } catch (error) {
            console.error("Registration Failed", error);
            setMessage("Registration Failed. Username or Email may be taken.");
        }
    };

    return (
        <div className="auth-container">
            <h2>NEW USER</h2>
            <p className="subtitle">Create a new identity record.</p>

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Display Name (Username)</label>
                    <input 
                        name="username" 
                        className="input-field"
                        type="text" 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. Slayer99"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                        name="email" 
                        className="input-field"
                        type="email" 
                        onChange={handleChange} 
                        required 
                        placeholder="user@example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        name="password" 
                        className="input-field"
                        type="password" 
                        onChange={handleChange} 
                        required 
                        placeholder="••••••••"
                    />
                </div>

                <button type="submit" className="btn-primary">Create Record</button>
            </form>

            {message && <p className="error-msg">{message}</p>}

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                Already registered? <Link to="/" className="link-text">Return to Login</Link>
            </div>
        </div>
    );
};

export default Register;