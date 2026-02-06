import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ManageClass = ({ classroom, onBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '' });
    const [status, setStatus] = useState({ msg: '', type: '' });

    // Load existing quizzes for this portal
    const loadQuizzes = async () => {
        try {
            const response = await api.get(`/quizzes/classroom/${classroom.id}`);
            setQuizzes(response.data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    useEffect(() => { loadQuizzes(); }, [classroom.id]);

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            await api.post('/quizzes/create', {
                classroomId: classroom.id,
                title: newQuiz.title,
                description: newQuiz.description
            });
            setStatus({ msg: 'Quiz Created!', type: 'success' });
            setNewQuiz({ title: '', description: '' });
            loadQuizzes(); // Refresh list
            setTimeout(() => setStatus({ msg: '', type: '' }), 3000);
        } catch (error) {
            console.error(error);
            setStatus({ msg: 'Failed to create quiz.', type: 'error' });
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(classroom.portalCode);
        setStatus({ msg: 'Code Copied to Clipboard!', type: 'success' });
        setTimeout(() => setStatus({ msg: '', type: '' }), 2000);
    };

    return (
        <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease' }}>
            {/* HEADER AREA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>
                    &larr; Back to Dashboard
                </button>
                
                {/* PORTAL CODE BADGE */}
                <div 
                    onClick={copyCode}
                    title="Click to Copy"
                    style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px dashed #38bdf8',
                        color: '#38bdf8',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontFamily: '"Courier New", monospace',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <span>CODE:</span>
                    <span style={{ color: 'white' }}>{classroom.portalCode}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>📋</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>{classroom.name}</h1>
                <p style={{ color: '#64748b' }}>Instructor Management Console</p>
                {status.msg && <p style={{ color: status.type === 'success' ? '#34d399' : '#f87171' }}>{status.msg}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                
                {/* LEFT COLUMN: CREATE QUIZ */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
                    <h3 style={{ color: 'var(--accent-green)', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                        + Create New Quiz
                    </h3>
                    <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="Quiz Title (e.g. Week 1 Exam)"
                            value={newQuiz.title}
                            onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                            required
                            className="input-field"
                        />
                        <textarea 
                            placeholder="Description / Instructions..."
                            value={newQuiz.description}
                            onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                            className="input-field"
                            style={{ minHeight: '80px', resize: 'vertical' }}
                        />
                        <button type="submit" className="btn-primary" style={{ background: 'var(--accent-green)', color: '#0f172a' }}>
                            Initialize Quiz
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: QUIZ LIST */}
                <div>
                    <h3 style={{ color: '#94a3b8', marginBottom: '15px' }}>Active Assignments</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {quizzes.length === 0 && (
                            <div style={{ padding: '30px', border: '1px dashed #475569', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                                No quizzes created yet. Start by adding one on the left.
                            </div>
                        )}
                        
                        {quizzes.map(quiz => (
                            <div key={quiz.id} style={{ 
                                background: '#0f172a', 
                                border: '1px solid #334155', 
                                padding: '20px', 
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>{quiz.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{quiz.description}</p>
                                </div>
                                <button style={{ 
                                    padding: '8px 16px', 
                                    background: '#334155', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer' 
                                }}>
                                    Add Questions &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageClass;