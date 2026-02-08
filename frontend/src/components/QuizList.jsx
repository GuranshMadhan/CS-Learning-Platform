import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import TakeQuiz from './TakeQuiz'; // <--- We will create this next

const QuizList = ({ classroomId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const response = await api.get(`/quizzes/classroom/${classroomId}`);
                setQuizzes(response.data);
            } catch (error) {
                console.error("Failed to load quizzes", error);
            }
        };
        loadQuizzes();
    }, [classroomId]);

    // If a quiz is selected, show the "Take Quiz" screen
    if (selectedQuizId) {
        return <TakeQuiz quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />;
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
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{quiz.title}</h3>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{quiz.description}</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', marginTop: '5px', display: 'inline-block' }}>
                                {quiz.questionCount} Questions
                            </span>
                        </div>
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
                                textTransform: 'uppercase'
                            }}
                        >
                            Start Quiz &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;