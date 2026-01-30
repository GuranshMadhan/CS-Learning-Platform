import React, { useState } from 'react';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            setMessage("Success! Redirecting...");
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            console.error(error);
            setMessage("Registration Failed. Email or Username taken.");
        }
    };

    return (
        <div style={{ maxWidth: '350px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username (Display Name):</label>
                    <input name="username" type="text" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email (For Login):</label>
                    <input name="email" type="email" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Password:</label>
                    <input name="password" type="password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Register</button>
            </form>
            {message && <p>{message}</p>}
            <p style={{ marginTop: '20px', textAlign: 'center' }}><Link to="/">Back to Login</Link></p>
        </div>
    );
};

export default Register;