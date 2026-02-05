import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CreateClass = ({ onCreateSuccess }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState({ msg: '', type: '' });

    const handleCreate = async (e) => {
        e.preventDefault();
        setStatus({ msg: 'Initializing Portal...', type: 'info' });

        try {
            // We only send the name. The backend handles the random code.
            await api.post('/classrooms/create', { name: name });

            setStatus({ msg: 'Portal Created Successfully!', type: 'success' });
            setName('');

            // Refresh the dashboard to show the new card
            if (onCreateSuccess) onCreateSuccess();

            // Clear message after 3 seconds
            setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
        } catch (error) {
            console.error(error);
            setStatus({ msg: 'Initialization Failed. Server Error.', type: 'error' });
        }
    };

    return (
        <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '1px solid #334155',
            borderRadius: '12px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Initialize New Portal
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
                Create a restricted learning environment. You will receive a unique access code to share.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Portal Name (e.g. Java 101)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                    style={{
                        padding: '12px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        color: 'white',
                        borderRadius: '6px'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px',
                        background: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                    }}
                >
                    Create Portal
                </button>
            </form>

            {status.msg && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: status.type === 'success' ? '#34d399' : '#f87171',
                    border: `1px solid ${status.type === 'success' ? '#059669' : '#b91c1c'}`
                }}>
                    {status.msg}
                </div>
            )}
        </div>
    );
};

export default CreateClass;