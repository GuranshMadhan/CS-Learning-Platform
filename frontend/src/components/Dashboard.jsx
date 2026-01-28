import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token so they are truly logged out
        localStorage.removeItem('token');
        // Send them back to the login page
        navigate('/');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Welcome to the CS Learning Platform!</p>
            
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleLogout} style={{ padding: '10px', background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;