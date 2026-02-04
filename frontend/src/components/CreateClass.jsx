import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CreateClass = ({ onCreateSuccess }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Assuming your backend endpoint is POST /classrooms
            await api.post('/classrooms', { name: name });
            setMessage("Portal Initialized Successfully.");
            setName('');
            if (onCreateSuccess) onCreateSuccess();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Initialization Failed: System Error.");
        }
    };

    return (
        <div style={{ padding: '1.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', height: '100%' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>Initialize New Portal</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
                Create a new learning environment as an Admin.
            </p>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Portal Name (e.g. Java 101)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className="btn-primary">
                    CREATE PORTAL
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: message.includes('Failed') ? 'var(--accent-red)' : 'var(--accent-green)' }}>{message}</p>}
        </div>
    );
};

export default CreateClass;