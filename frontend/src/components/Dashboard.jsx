import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// Child Components
import QuizList from './QuizList';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import PracticeMode from './PracticeMode';
import Leaderboard from './Leaderboard';
import ManageClass from './ManageClass'; // <--- The new Teacher Console

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('LOBBY'); 
    const [selectedClass, setSelectedClass] = useState(null);
    const navigate = useNavigate();

    // --- 1. Load User Data ---
    const loadUserData = async () => {
        try {
            const response = await api.get('/user/me');
            console.log("User Data Loaded:", response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to load user", error);
            // Redirect only on Auth Failure (401/403), not Server Error (500)
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    useEffect(() => { loadUserData(); }, []);

    // --- 2. Navigation Handlers ---
    const enterClass = (c) => { setSelectedClass(c); setView('ROOM'); };
    const goHome = () => { setSelectedClass(null); setView('LOBBY'); loadUserData(); };

    // --- 3. Loading State ---
    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>
                <h2>Establishing Uplink...</h2>
                <p>Connecting to Guransh System...</p>
            </div>
        );
    }

    // --- 4. Safety Variables (Prevents Crash on Null Data) ---
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
            {/* TOP BAR */}
            <div className="dashboard-header">
                <div style={{ fontWeight: 'bold', letterSpacing: '2px', color: '#94a3b8' }}>GURANSH SYSTEM v1.0</div>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn-logout">LOGOUT</button>
            </div>

            {/* === VIEW 1: MAIN LOBBY === */}
            {view === 'LOBBY' && (
                <div className="lobby-view">
                    
                    {/* OPERATOR STAT CARD */}
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
                        {/* Background Rank Watermark */}
                        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '150px', opacity: 0.05, userSelect: 'none' }}>
                            {safeRank > 0 && safeRank <= 3 ? '🏆' : '#'}
                        </div>

                        {/* User Header */}
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

                        {/* Stats Grid */}
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

                        {/* Buttons */}
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
                        {/* 1. Classrooms I am enrolled in (Student) */}
                        {enrolled.map(c => (
                            <div key={c.id} onClick={() => enterClass(c)} className="classroom-card">
                                <div>
                                    <strong style={{fontSize: '1.1rem'}}>{c.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Student Access</div>
                                </div>
                                <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>ENTER &rarr;</span>
                            </div>
                        ))}
                        
                        {/* 2. Classrooms I am teaching (Admin) */}
                        {teaching.map(c => (
                            <div key={c.id} onClick={() => enterClass(c)} className="classroom-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                                <div>
                                    <strong style={{fontSize: '1.1rem'}}>{c.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Admin Access</div>
                                </div>
                                <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>MANAGE &rarr;</span>
                            </div>
                        ))}

                        {/* 3. Empty State */}
                        {enrolled.length === 0 && teaching.length === 0 && (
                            <div style={{ padding: '20px', border: '1px dashed #334155', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                                No active portals linked. Join or Create one below.
                            </div>
                        )}
                    </div>

                    {/* ACTIONS: JOIN / CREATE */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '3rem' }}>
                        <JoinClass onJoinSuccess={loadUserData} />
                        <CreateClass onCreateSuccess={loadUserData} />
                    </div>
                </div>
            )}

            {/* === VIEW 2: CLASSROOM ROOM === */}
            {view === 'ROOM' && selectedClass && (
                <div className="room-view">
                    {/* LOGIC SWITCH: 
                        If the user is in the 'teachingClassrooms' list for this ID, show Admin View.
                        Otherwise, show Student View.
                    */}
                    {teaching.some(c => c.id === selectedClass.id) ? (
                        <ManageClass 
                            classroom={selectedClass} 
                            onBack={goHome} 
                        />
                    ) : (
                        <>
                            <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; BACK TO DASHBOARD</button>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px'}}>
                                <div>
                                    <h2 style={{ color: 'white', margin: 0 }}>{selectedClass.name}</h2>
                                    <div style={{color: '#64748b', fontSize: '0.9rem'}}>Instructor: {selectedClass.teacherName || 'Unknown'}</div>
                                </div>
                                <div style={{ padding: '5px 10px', background: 'var(--accent-green)', color: '#0f172a', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>STUDENT VIEW</div>
                            </div>
                            <QuizList classroomId={selectedClass.id} />
                        </>
                    )}
                </div>
            )}

            {/* === VIEW 3: INFINITE PRACTICE === */}
            {view === 'PRACTICE' && (
                <div className="practice-view">
                     <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>&larr; EXIT PRACTICE</button>
                    <PracticeMode /> 
                </div>
            )}

            {/* === VIEW 4: LEADERBOARD === */}
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