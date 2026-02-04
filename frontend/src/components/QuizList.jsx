import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const QuizList = ({ classroomId }) => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        if (!classroomId) return;
        const fetchQuizzes = async () => {
            try {
                const response = await api.get(`/quizzes/classroom/${classroomId}`);
                setQuizzes(response.data);
            } catch (err) { console.error(err); }
        };
        fetchQuizzes();
    }, [classroomId]);

    return (
        <div className="list-container">
            {quizzes.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #334155', borderRadius: '8px', color: '#94a3b8' }}>
                    No active missions in this sector.
                </div>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="card-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'white' }}>{quiz.title}</h3>
                                <p style={{ color: '#94a3b8', margin: '5px 0 10px 0', fontSize: '0.9rem' }}>
                                    {quiz.description}
                                </p>
                            </div>
                            {/* This is where a 'Start' button will go later */}
                        </div>
                        <div className="badge-xp">+{quiz.completionBonusXp} XP REWARD</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default QuizList;