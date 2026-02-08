import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import QuizEditor from './QuizEditor'; // <--- IMPORT THIS

const ManageClass = ({ classroom, onBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '' });
    const [status, setStatus] = useState({ msg: '', type: '' });
    
    // NEW STATE: Tracks which quiz is being edited
    const [editingQuizId, setEditingQuizId] = useState(null);

    // ... (loadQuizzes and handleCreateQuiz logic remains the same) ...
    const loadQuizzes = async () => {
        try {
            const response = await api.get(`/quizzes/classroom/${classroom.id}`);
            setQuizzes(response.data);
        } catch (error) { console.error(error); }
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
            loadQuizzes();
        } catch (error) { console.error(error); }
    };
    // ...

    // --- LOGIC SWITCH ---
    // If we are editing a quiz, show the Editor instead of the Manager
    if (editingQuizId) {
        return <QuizEditor quizId={editingQuizId} onBack={() => { setEditingQuizId(null); loadQuizzes(); }} />;
    }

    return (
        <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease' }}>
            {/* ... Header and Title ... */}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                
                {/* Left Column (Create Quiz Form) - SAME AS BEFORE */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
                   {/* ... form code ... */}
                   <form onSubmit={handleCreateQuiz}>
                       {/* ... inputs ... */}
                       <button type="submit" className="btn-primary">Initialize Quiz</button>
                   </form>
                </div>

                {/* Right Column (Quiz List) - UPDATED BUTTON */}
                <div>
                    <h3 style={{ color: '#94a3b8', marginBottom: '15px' }}>Active Assignments</h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
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
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                        {quiz.questionCount} Questions
                                    </p>
                                </div>
                                
                                {/* CLICKING THIS NOW OPENS THE EDITOR */}
                                <button 
                                    onClick={() => setEditingQuizId(quiz.id)}
                                    style={{ 
                                        padding: '8px 16px', 
                                        background: 'var(--accent-blue)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Edit / Add Questions &rarr;
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