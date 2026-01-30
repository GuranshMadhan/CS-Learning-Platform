import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const QuizList = ({ classroomId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!classroomId) return;

        const fetchQuizzes = async () => {
            try {
                // Fetch quizzes for the specific classroom passed in as a prop
                const response = await api.get(`/quizzes/classroom/${classroomId}`);
                setQuizzes(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load quizzes.');
            }
        };

        fetchQuizzes();
    }, [classroomId]);

    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Available Quizzes</h3>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {quizzes.length === 0 ? (
                <p>No quizzes found for this class.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id} style={{ 
                            background: '#fff', 
                            border: '1px solid #ddd',
                            margin: '10px 0', 
                            padding: '15px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <strong style={{ fontSize: '1.1rem' }}>{quiz.title}</strong>
                            <p style={{ margin: '5px 0', color: '#666' }}>{quiz.description}</p>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'green', fontWeight: 'bold' }}>
                                Reward: {quiz.completionBonusXp} XP
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuizList;