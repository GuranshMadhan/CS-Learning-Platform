import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/user/leaderboard');
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to load leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading Rankings...</div>;

    return (
        <div style={{ padding: '2rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                🏆 Global Rankings
            </h2>

            <div style={{ display: 'grid', gap: '10px' }}>
                {users.map((user, index) => {
                    // Styling for Top 3
                    let rankColor = '#94a3b8'; // Default Grey
                    let borderColor = '#334155';
                    let icon = `#${index + 1}`;

                    if (index === 0) { rankColor = '#fbbf24'; borderColor = '#fbbf24'; icon = '👑'; } // Gold
                    if (index === 1) { rankColor = '#94a3b8'; borderColor = '#e2e8f0'; icon = '🥈'; } // Silver
                    if (index === 2) { rankColor = '#b45309'; borderColor = '#b45309'; icon = '🥉'; } // Bronze

                    return (
                        <div 
                            key={user.id} 
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 20px',
                                background: '#0f172a',
                                border: `1px solid ${borderColor}`,
                                borderRadius: '8px',
                                color: 'white',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>
                                    {icon}
                                </span>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.username}</div>
                                    <div style={{ fontSize: '0.8rem', color: rankColor, textTransform: 'uppercase' }}>
                                        Rank {index + 1}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {user.xp.toLocaleString()} XP
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {user.totalCorrectAnswers} Solved
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;