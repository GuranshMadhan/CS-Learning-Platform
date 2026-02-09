import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TakeQuiz from './TakeQuiz';

const QuizList = ({ classroomId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    // Extracted loader so we can refresh after finishing a quiz
    const loadQuizzes = async () => {
        try {
            const response = await api.get(`/quizzes/classroom/${classroomId}`);
            setQuizzes(response.data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    useEffect(() => {
        loadQuizzes();
    }, [classroomId]);

    // If a quiz is selected, show the "Take Quiz" screen
    if (selectedQuizId) {
        return (
            <TakeQuiz 
                quizId={selectedQuizId} 
                onBack={() => {
                    setSelectedQuizId(null);
                    loadQuizzes(); // Refresh to lock the quiz & show score immediately
                }} 
            />
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'grid', gap: '15px' }}>
                {quizzes.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', border: '1px dashed #334155', borderRadius: '8px' }}>
                        No quizzes available in this portal yet.
                    </div>
                )}

                {quizzes.map(quiz => (
                    <div key={quiz.id} style={{ 
                        background: '#0f172a', 
                        border: '1px solid #334155', 
                        padding: '20px', 
                        borderRadius: '12px',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        // Dim the card slightly if completed
                        opacity: quiz.completed ? 0.8 : 1 
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: quiz.completed ? '#94a3b8' : 'white' }}>
                                {quiz.title} {quiz.completed && "✅"}
                            </h3>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{quiz.description}</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', marginTop: '5px', display: 'inline-block' }}>
                                {quiz.questionCount} Questions
                            </span>
                        </div>

                        {/* --- CONDITIONAL BUTTON LOGIC --- */}
                        {quiz.completed ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {/* SCORE BADGE */}
                                {quiz.scoreDisplay && (
                                    <span style={{ 
                                        color: '#34d399', 
                                        fontWeight: 'bold', 
                                        background: 'rgba(52, 211, 153, 0.1)', 
                                        border: '1px solid rgba(52, 211, 153, 0.2)',
                                        padding: '8px 12px', 
                                        borderRadius: '6px',
                                        fontSize: '0.9rem',
                                        fontFamily: 'monospace'
                                    }}>
                                        Score: {quiz.scoreDisplay}
                                    </span>
                                )}
                                
                                <button 
                                    disabled
                                    style={{
                                        padding: '10px 20px',
                                        background: '#334155',
                                        color: '#94a3b8',
                                        border: '1px solid #475569',
                                        borderRadius: '6px',
                                        cursor: 'not-allowed',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Completed
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setSelectedQuizId(quiz.id)}
                                style={{
                                    padding: '10px 20px',
                                    background: 'var(--accent-green)',
                                    color: '#0f172a',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                Start Quiz &rarr;
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;