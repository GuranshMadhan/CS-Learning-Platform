import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch the list of top users
                const response = await api.get('/user/leaderboard');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
                setError("Unable to load rankings at this time.");
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // --- RENDER HELPERS ---
    const getRankIcon = (index) => {
        if (index === 0) return <span style={{ fontSize: '1.5rem' }}>🥇</span>;
        if (index === 1) return <span style={{ fontSize: '1.5rem' }}>🥈</span>;
        if (index === 2) return <span style={{ fontSize: '1.5rem' }}>🥉</span>;
        return <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>#{index + 1}</span>;
    };

    const getRowStyle = (index) => {
        // Highlight top 3 rows slightly
        if (index < 3) {
            return {
                background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0%, rgba(30, 41, 59, 0) 100%)',
                borderBottom: '1px solid #334155'
            };
        }
        return { borderBottom: '1px solid #334155' };
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            
            {/* BACK BUTTON */}
            <button 
                onClick={() => navigate('/dashboard')} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#94a3b8', 
                    cursor: 'pointer', 
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '1rem'
                }}
            >
                &larr; Back to Dashboard
            </button>
            
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'white', marginBottom: '10px', fontSize: '2.5rem' }}>Global Leaderboard</h1>
                <p style={{ color: '#64748b' }}>Top students by Total Experience Points</p>
            </div>

            {/* TABLE CONTAINER */}
            <div style={{ 
                background: '#1e293b', 
                borderRadius: '12px', 
                border: '1px solid #334155', 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '20px', textAlign: 'center', width: '80px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Rank</th>
                            <th style={{ padding: '20px', textAlign: 'left', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Student</th>
                            <th style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Questions Solved</th>
                            <th style={{ padding: '20px', textAlign: 'right', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Total XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                    Loading rankings...
                                </td>
                            </tr>
                        )}

                        {error && (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>
                                    {error}
                                </td>
                            </tr>
                        )}

                        {!loading && !error && users.map((user, index) => (
                            <tr key={user.id || index} style={getRowStyle(index)}>
                                {/* RANK */}
                                <td style={{ padding: '20px', textAlign: 'center' }}>
                                    {getRankIcon(index)}
                                </td>
                                
                                {/* USERNAME */}
                                <td style={{ padding: '20px' }}>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        color: index < 3 ? 'white' : '#cbd5e1',
                                        fontSize: '1.1rem'
                                    }}>
                                        {user.username || "Unknown Student"}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                                        Level {Math.floor((user.xp || 0) / 1000) + 1}
                                    </div>
                                </td>

                                {/* STATS */}
                                <td style={{ padding: '20px', textAlign: 'center' }}>
                                    <span style={{ 
                                        background: 'rgba(52, 211, 153, 0.1)', 
                                        color: '#34d399', 
                                        padding: '5px 10px', 
                                        borderRadius: '6px', 
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {user.totalCorrectAnswers || 0}
                                    </span>
                                </td>

                                {/* XP */}
                                <td style={{ padding: '20px', textAlign: 'right', color: '#facc15', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' }}>
                                    {user.xp || 0} XP
                                </td>
                            </tr>
                        ))}
                        
                        {!loading && !error && users.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                    No students found yet. Be the first!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;