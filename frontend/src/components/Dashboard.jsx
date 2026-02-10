import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import ManageClass from './ManageClass';
import QuizList from './QuizList';
import TakeQuiz from './TakeQuiz';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, animation: 'fadeIn 0.2s ease'
        }}>
            <div style={{
                background: '#1e293b', padding: '30px', borderRadius: '12px',
                width: '400px', maxWidth: '90%', border: '1px solid #334155',
                position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: 'none', border: 'none', color: '#94a3b8',
                    fontSize: '1.2rem', cursor: 'pointer'
                }}>✕</button>
                <h3 style={{ marginTop: 0, color: 'white', borderBottom:'1px solid #334155', paddingBottom:'10px', marginBottom:'20px' }}>
                    {title}
                </h3>
                {children}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [globalQuizzes, setGlobalQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [view, setView] = useState('dashboard'); 
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [selectedGlobalQuizId, setSelectedGlobalQuizId] = useState(null);
    
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadData = async () => {
        try {
            const [userRes, globalRes] = await Promise.all([
                api.get('/user/me'),
                api.get('/quizzes/global')
            ]);
            setUser(userRes.data);
            setGlobalQuizzes(globalRes.data);
        } catch (error) {
            console.error("Failed to load data", error);
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [navigate]);

    const handleOpenPortal = (classroom, isTeacher) => {
        setSelectedClassroom(classroom);
        setView(isTeacher ? 'manage' : 'student_portal');
    };

    const handleBack = () => {
        setSelectedClassroom(null);
        setSelectedGlobalQuizId(null);
        setView('dashboard');
        loadData();
    };

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Dashboard...</div>;
    if (!user) return null;
    
    if (selectedGlobalQuizId) {
        return <TakeQuiz quizId={selectedGlobalQuizId} onBack={handleBack} />;
    }

    if (view === 'manage' && selectedClassroom) return <ManageClass classroom={selectedClassroom} onBack={handleBack} />;

    if (view === 'student_portal' && selectedClassroom) {
        return (
            <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease' }}>
                <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px' }}>&larr; Back to Dashboard</button>
                <h1 style={{ color: 'white' }}>{selectedClassroom.name}</h1>
                <p style={{ color: '#64748b' }}>Student Portal • {selectedClassroom.teacherName}</p>
                <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
                <QuizList classroomId={selectedClassroom.id} />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>Welcome, <span style={{ color: 'var(--accent-blue)' }}>{user.username}</span></h1>
                    <p style={{ color: '#94a3b8', marginTop: '5px' }}>Let's continue your learning journey.</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', gap: '20px' }}>
                    <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>RANK</div>
                        <div style={{ fontSize: '1.2rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>#{user.rank || '-'}</div>
                    </div>
                    <div style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>XP</div>
                        <div style={{ fontSize: '1.2rem', color: '#facc15', fontWeight: 'bold' }}>{user.xp}</div>
                    </div>
                </div>
            </div>

            <h3 style={{ color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                <div 
                    onClick={() => setShowJoinModal(true)}
                    className="action-card"
                    style={{
                        height: '150px', background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        padding: '20px', borderRadius: '12px', border: '1px solid #334155',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔗</div>
                    <h3 style={{ color: 'white', margin: 0 }}>Join Portal</h3>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px' }}>Enter Access Code</p>
                </div>

                <div 
                    onClick={() => setShowCreateModal(true)}
                    className="action-card"
                    style={{
                        height: '150px', background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        padding: '20px', borderRadius: '12px', border: '1px solid #334155',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>➕</div>
                    <h3 style={{ color: 'white', margin: 0 }}>Create Portal</h3>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px' }}>New Class Group</p>
                </div>

                <div 
                    onClick={() => navigate('/theory')}
                    className="action-card"
                    style={{
                        height: '150px', background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        padding: '20px', borderRadius: '12px', border: '1px solid #334155',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
                    <h3 style={{ color: 'white', margin: 0 }}>Theory Hub</h3>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px' }}>OCR J277 Notes</p>
                </div>

                <div 
                    onClick={() => navigate('/leaderboard')}
                    className="action-card"
                    style={{
                        height: '150px', background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        padding: '20px', borderRadius: '12px', border: '1px solid #334155',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆</div>
                    <h3 style={{ color: 'white', margin: 0 }}>Leaderboard</h3>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '5px' }}>Global Rankings</p>
                </div>
            </div>

            <h3 style={{ color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Global Practice</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {globalQuizzes.length === 0 ? (
                    <div style={{ color: '#64748b', fontStyle: 'italic' }}>No global challenges available right now.</div>
                ) : (
                    globalQuizzes.map(quiz => (
                        <div key={quiz.id} 
                            style={{ 
                                background: '#0f172a', border: '1px solid #334155', padding: '20px', borderRadius: '12px',
                                opacity: quiz.completed ? 0.7 : 1, transition: '0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: quiz.completed ? '#94a3b8' : 'white' }}>{quiz.title} {quiz.completed && '✅'}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{quiz.description}</p>
                            </div>
                            
                            {quiz.completed ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold' }}>Score: {quiz.scoreDisplay}</span>
                                    <button disabled style={{ flex: 1, padding: '8px', background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.8rem' }}>COMPLETED</button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setSelectedGlobalQuizId(quiz.id)}
                                    style={{ width: '100%', padding: '10px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Start Challenge
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                    <h3 style={{ color: '#94a3b8', marginBottom: '15px' }}>My Enrolled Portals</h3>
                    {user.enrolledClassrooms.length === 0 ? (
                        <div style={{ padding: '20px', border: '1px dashed #334155', borderRadius: '8px', color: '#64748b', textAlign: 'center' }}>
                            You haven't joined any portals yet.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {user.enrolledClassrooms.map(c => (
                                <div key={c.id} onClick={() => handleOpenPortal(c, false)} style={{ background: '#0f172a', border: '1px solid #334155', padding: '20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div><h4 style={{ margin: 0, color: 'white' }}>{c.name}</h4><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{c.teacherName}</p></div>
                                    <span style={{ color: 'var(--accent-blue)' }}>Enter &rarr;</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ color: '#94a3b8', marginBottom: '15px' }}>Portals I Manage</h3>
                    {user.teachingClassrooms.length === 0 ? (
                        <div style={{ padding: '20px', border: '1px dashed #334155', borderRadius: '8px', color: '#64748b', textAlign: 'center' }}>
                            No portals created.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {user.teachingClassrooms.map(c => (
                                <div key={c.id} onClick={() => handleOpenPortal(c, true)} style={{ background: '#0f172a', border: '1px solid var(--accent-green)', padding: '20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div><h4 style={{ margin: 0, color: 'white' }}>{c.name}</h4><p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Code: {c.portalCode}</p></div>
                                    <span style={{ color: 'var(--accent-green)' }}>Manage ⚙️</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Portal">
                <JoinClass onJoinSuccess={() => { setShowJoinModal(false); loadData(); }} />
            </Modal>

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Portal">
                <CreateClass onCreateSuccess={() => { setShowCreateModal(false); loadData(); }} />
            </Modal>
        </div>
    );
};

export default Dashboard;