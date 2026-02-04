import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

import QuizList from './QuizList';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import PracticeMode from './PracticeMode';
import Leaderboard from './Leaderboard';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('LOBBY'); 
    const [selectedClass, setSelectedClass] = useState(null);
    const navigate = useNavigate();

    const loadUserData = async () => {
        try {
            const response = await api.get('/user/me');
            console.log("User Data Loaded:", response.data); // Debugging Log
            setUser(response.data);
        } catch (error) {
            console.error("Failed to load user", error);
            // Only redirect if it's a 403/401 (Auth error), not a 500 (Server error)
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    useEffect(() => { loadUserData(); }, []);

    const enterClass = (c) => { setSelectedClass(c); setView('ROOM'); };
    const goHome = () => { setSelectedClass(null); setView('LOBBY'); loadUserData(); };

    // Loading State
    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>
                <h2>Establishing Uplink...</h2>
                <p>If this takes too long, check the Backend Console for errors.</p>
            </div>
        );
    }

    // SAFE VARIABLES (Prevents Blank Screen Crash)
    const safeRank = user.rank || 0;
    const safeXP = user.xp || 0;
    const safeAccuracy = user.accuracy || 0;
    const safeAttempts = user.totalQuestionsAttempted || 0;
    const safeSolved = user.totalCorrectAnswers || 0;
    const safeRole = user.role || 'USER';
    const enrolled = user.enrolledClassrooms || [];
    const teaching = user.teachingClassrooms || [];

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <div className="dashboard-header">
                <div style={{ fontWeight: 'bold', letterSpacing: '2px', color: '#94a3b8' }}>GURANSH SYSTEM v1.0</div>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn-logout">LOGOUT</button>
            </div>

            {/* MAIN LOBBY */}
            {view === 'LOBBY' && (
                <div className="lobby-view">
                    
                    {/* === OPERATOR CARD === */}
                    <div style={{ 
                        background: 'linear-gradient(145deg, #1e293b, #0f172a)', 
                        border: '1px solid #334155', 
                        borderRadius: '16px', 
                        padding: '30px',
                        maxWidth: '800px',
                        margin: '0 auto 40px auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Rank BG */}
                        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '150px', opacity: 0.05, userSelect: 'none' }}>
                            {safeRank > 0 && safeRank <= 3 ? '🏆' : '#'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ color: 'white', margin: 0, fontSize: '2rem' }}>{user.username}</h2>
                                <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {safeRole} ACCESS
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Global Rank</div>
                                <div style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                                    {safeRank > 0 ? `#${safeRank}` : '-'}
                                </div>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Total XP</div>
                                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{safeXP.toLocaleString()}</div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Accuracy</div>
                                <div style={{ color: safeAccuracy > 70 ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {safeAccuracy}%
                                </div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Solved</div>
                                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{safeSolved}</div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Attempts</div>
                                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{safeAttempts}</div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' }}>
                            <button 
                                onClick={() => setView('PRACTICE')}
                                style={{ padding: '15px', background: 'var(--accent-green)', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
                            >
                                ⚔️ Enter Practice
                            </button>
                            <button 
                                onClick={() => setView('LEADERBOARD')}
                                style={{ padding: '15px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
                            >
                                🏆 View Leaderboard
                            </button>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                        ACTIVE PORTALS
                    </h3>
                    
                    {/* PORTALS LIST */}
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {enrolled.map(c => (
                            <div key={c.id} onClick={() => enterClass(c)} className="classroom-card">
                                <div>
                                    <strong style={{fontSize: '1.1rem'}}>{c.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Student Access</div>
                                </div>
                                <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>ENTER &rarr;</span>
                            </div>
                        ))}
                        {teaching.map(c => (
                            <div key={c.id} onClick={() => enterClass(c)} className="classroom-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                                <div>
                                    <strong style={{fontSize: '1.1rem'}}>{c.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Admin Access</div>
                                </div>
                                <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>MANAGE &rarr;</span>
                            </div>
                        ))}
                        {enrolled.length === 0 && teaching.length === 0 && (
                            <div style={{ padding: '20px', border: '1px dashed #334155', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                                No active portals linked. Join or Create one below.
                            </div>
                        )}
                    </div>

                    {/* JOIN / CREATE */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '3rem' }}>
                        <JoinClass onJoinSuccess={loadUserData} />
                        <CreateClass onCreateSuccess={loadUserData} />
                    </div>
                </div>
            )}

            {/* --- SUB VIEWS --- */}
            {view === 'ROOM' && selectedClass && (
                <div className="room-view">
                    <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; BACK TO DASHBOARD</button>
                    <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>{selectedClass.name}</h2>
                    <QuizList classroomId={selectedClass.id} />
                </div>
            )}

            {view === 'PRACTICE' && (
                <div className="practice-view">
                     <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; EXIT PRACTICE</button>
                    <PracticeMode /> 
                </div>
            )}

            {view === 'LEADERBOARD' && (
                <div className="leaderboard-view">
                     <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; BACK TO DASHBOARD</button>
                    <Leaderboard /> 
                </div>
            )}
        </div>
    );
};

export default Dashboard;