import React, { useState } from 'react';
import api from '../api/axiosConfig';

const JoinClass = ({ onJoinSuccess }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classrooms/join', { code: code });
            setMessage("Joined successfully!");
            if (onJoinSuccess) onJoinSuccess();
        } catch (error) {
            console.error(error);
            setMessage("Invalid Portal Code.");
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Join a Classroom</h3>
            <p>Enter the portal code provided by your teacher.</p>
            <form onSubmit={handleJoin} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Portal Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    style={{ padding: '8px', width: '200px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Join
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', color: message.includes('Invalid') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
};

export default JoinClass;