import React, { useState } from 'react';
import api from '../api/axiosConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Stop page from reloading
        try {
            const response = await api.post('/auth/authenticate', {
                email: email,
                password: password
            });

            // If successful:
            setMessage("Login Successful!");
            console.log("Token:", response.data.token);
            
            // Save the token so the browser remembers us
            localStorage.setItem('token', response.data.token);

        } catch (error) {
            setMessage("Login Failed. Check your password.");
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br/>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label><br/>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;