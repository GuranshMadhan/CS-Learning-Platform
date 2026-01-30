import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import QuizList from './QuizList';
import JoinClass from './JoinClass';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null); // <--- NEW: Track which class is active
    const navigate = useNavigate();

    const loadUserData = async () => {
        try {
            const response = await api.get('/user/me');
            setUser(response.data);
            
            // OPTIONAL: If they are in exactly ONE class total, auto-select it for convenience
            const totalClasses = response.data.enrolledClassrooms.length + response.data.teachingClassrooms.length;
            if (totalClasses === 1) {
                if (response.data.enrolledClassrooms.length > 0) setSelectedClass(response.data.enrolledClassrooms[0]);
                else setSelectedClass(response.data.teachingClassrooms[0]);
            }

        } catch (error) {
            console.error("Failed to load user", error);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!user) return <div style={{ padding: '20px' }}>Loading...</div>;

    // HELPER: Reset selection to go back to "Lobby"
    const handleBackToLobby = () => setSelectedClass(null);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>Student Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            <h2 style={{ color: '#555' }}>Welcome, {user.firstname}!</h2>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: 1, padding: '20px', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', borderRadius: '10px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: 0, opacity: 0.8 }}>Total XP</h3>
                    <p style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: 'bold' }}>{user.xp}</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: '10px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: 0, opacity: 0.8 }}>Questions Correct</h3>
                    <p style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: 'bold' }}>{user.totalCorrectAnswers}</p>
                </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            {/* LOGIC: Either show the Class List (Lobby) OR the Selected Class (Room) */}
            {!selectedClass ? (
                // --- VIEW 1: THE LOBBY (Class Selector) ---
                <div>
                    <h3>Your Classrooms</h3>
                    
                    {/* List Enrolled Classes */}
                    {user.enrolledClassrooms.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#666' }}>Student In:</h4>
                            {user.enrolledClassrooms.map(c => (
                                <div key={c.id} onClick={() => setSelectedClass(c)} 
                                     style={{ padding: '15px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                                    <strong>{c.name}</strong> (ID: {c.id})
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List Teaching Classes */}
                    {user.teachingClassrooms.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#666' }}>Teaching:</h4>
                            {user.teachingClassrooms.map(c => (
                                <div key={c.id} onClick={() => setSelectedClass(c)} 
                                     style={{ padding: '15px', background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                                    <strong>{c.name}</strong> (Teacher)
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Join Class Form is always available in Lobby */}
                    <JoinClass onJoinSuccess={loadUserData} />
                </div>
            ) : (
                // --- VIEW 2: INSIDE A CLASSROOM ---
                <div>
                    <button onClick={handleBackToLobby} style={{ marginBottom: '15px', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline' }}>
                        &larr; Back to Classrooms
                    </button>
                    
                    <div style={{ padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px', marginBottom: '20px' }}>
                        You are viewing: <strong>{selectedClass.name}</strong>
                    </div>

                    <QuizList classroomId={selectedClass.id} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;