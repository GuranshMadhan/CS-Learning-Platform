import React, { useState } from 'react';
import api from '../api/axiosConfig';

const JoinClass = ({ onJoinSuccess }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classrooms/join', { code: code });
            setMessage("Access Granted: Portal Unlocked");
            setCode('');
            if (onJoinSuccess) onJoinSuccess();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Access Denied: Invalid Portal Code");
        }
    };

    return (
        <div style={{ padding: '1.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', height: '100%' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>Join Existing Portal</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Enter a code to access a restricted environment.
            </p>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Enter Portal Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className="btn-primary" style={{ background: '#334155' }}>
                    JOIN PORTAL
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: message.includes('Denied') ? 'var(--accent-red)' : 'var(--accent-green)' }}>{message}</p>}
        </div>
    );
};

export default JoinClass;