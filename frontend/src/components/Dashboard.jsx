import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import QuizList from './QuizList';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import PracticeMode from './PracticeMode'; // <--- UPDATED IMPORT

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('LOBBY'); // LOBBY, ROOM, PRACTICE
    const [selectedClass, setSelectedClass] = useState(null);
    const navigate = useNavigate();

    const loadUserData = async () => {
        try {
            const response = await api.get('/user/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(() => { loadUserData(); }, []);

    const enterClass = (c) => {
        setSelectedClass(c);
        setView('ROOM');
    };

    const goHome = () => {
        setSelectedClass(null);
        setView('LOBBY');
        loadUserData(); 
    };

    if (!user) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        User: <span style={{ color: 'white' }}>{user.username}</span>
                    </p>
                </div>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn-logout">
                    Logout
                </button>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card xp">
                    <div className="stat-label">Total XP</div>
                    <div className="stat-value">{user.xp}</div>
                </div>
                <div className="stat-card correct">
                    <div className="stat-label">Questions Correct</div>
                    <div className="stat-value">{user.totalCorrectAnswers}</div>
                </div>
            </div>

            <hr style={{ borderColor: '#334155', margin: '2rem 0', opacity: 0.5 }} />

            {/* VIEWS */}
            {view === 'LOBBY' && (
                <div className="lobby-view">
                    
                    {/* === INFINITE PRACTICE === */}
                    <div 
                        onClick={() => setView('PRACTICE')}
                        style={{ 
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                            border: '1px solid #334155', 
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: '3rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h2 style={{ color: 'white', margin: 0 }}>Start Practice Session</h2>
                        <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                            Answer random questions to earn XP and improve your rating.
                        </p>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>My Classrooms</h3>
                    
                    {/* Enrolled */}
                    {user.enrolledClassrooms.map(c => (
                        <div key={c.id} onClick={() => enterClass(c)} className="classroom-card">
                            <div>
                                <strong>{c.name}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Class ID: {c.id}</div>
                            </div>
                            <span style={{ color: 'var(--accent-green)' }}>Enter &rarr;</span>
                        </div>
                    ))}

                    {/* Teaching */}
                    {user.teachingClassrooms.map(c => (
                        <div key={c.id} onClick={() => enterClass(c)} className="classroom-card" style={{ borderColor: 'var(--accent-blue)' }}>
                            <div>
                                <strong>{c.name}</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>Teacher Access</div>
                            </div>
                            <span style={{ color: 'var(--accent-blue)' }}>Manage &rarr;</span>
                        </div>
                    ))}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '3rem' }}>
                        <JoinClass onJoinSuccess={loadUserData} />
                        <CreateClass onCreateSuccess={loadUserData} />
                    </div>
                </div>
            )}

            {view === 'ROOM' && (
                <div className="room-view">
                    <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>
                        &larr; Back to Dashboard
                    </button>
                    <h2 style={{ color: 'white' }}>{selectedClass.name}</h2>
                    <QuizList classroomId={selectedClass.id} />
                </div>
            )}

            {view === 'PRACTICE' && (
                <div className="mining-view">
                     <button onClick={goHome} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '1rem' }}>
                        &larr; End Session
                    </button>
                    <PracticeMode /> 
                </div>
            )}
        </div>
    );
};

export default Dashboard;