import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const TakeQuiz = ({ quizId, onBack }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({}); // Stores { "question_1": "Paris", "question_2": "5" }
    const [result, setResult] = useState(null); // Stores the XP result after submitting

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const response = await api.get(`/quizzes/${quizId}`);
                setQuiz(response.data);
            } catch (error) {
                console.error("Failed to load quiz", error);
            }
        };
        loadQuiz();
    }, [quizId]);

    const handleOptionSelect = (questionId, optionValue) => {
        setAnswers(prev => ({
            ...prev,
            [`question_${questionId}`]: optionValue
        }));
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit?")) return;

        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, answers);
            // The backend returns a string like "Quiz Submitted! You earned 50 XP."
            // You might want to update the backend to return a JSON object later for better UI
            setResult(response.data); 
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit quiz.");
        }
    };

    if (!quiz) return <div style={{color:'white', padding:'20px'}}>Loading Assessment...</div>;

    // --- VIEW: RESULTS SCREEN ---
    if (result) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', background: '#0f172a', borderRadius: '16px', border: '1px solid var(--accent-green)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🎉</div>
                <h2 style={{ color: 'white', margin: 0 }}>Assessment Complete!</h2>
                <p style={{ color: 'var(--accent-green)', fontSize: '1.2rem', margin: '20px 0' }}>{result}</p>
                <button onClick={onBack} className="btn-primary">Return to Lobby</button>
            </div>
        );
    }

    // --- VIEW: QUIZ FORM ---
    return (
        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px' }}>
                &larr; Cancel Assessment
            </button>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>{quiz.title}</h1>
                <p style={{ color: '#64748b' }}>{quiz.description}</p>
            </div>

            {/* Questions List */}
            <div style={{ display: 'grid', gap: '30px' }}>
                {quiz.questions.map((q, index) => (
                    <div key={q.id} style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>
                            <span style={{ color: 'var(--accent-blue)', marginRight: '10px' }}>{index + 1}.</span> 
                            {q.content}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                                <div 
                                    key={i}
                                    onClick={() => handleOptionSelect(q.id, opt)}
                                    style={{
                                        padding: '15px',
                                        background: answers[`question_${q.id}`] === opt ? 'var(--accent-blue)' : '#0f172a',
                                        color: answers[`question_${q.id}`] === opt ? 'white' : '#94a3b8',
                                        border: answers[`question_${q.id}`] === opt ? '1px solid var(--accent-blue)' : '1px solid #334155',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '40px', textAlign: 'right' }}>
                <button 
                    onClick={handleSubmit}
                    style={{
                        padding: '15px 40px',
                        background: 'var(--accent-green)',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    SUBMIT ANSWERS &rarr;
                </button>
            </div>
        </div>
    );
};

export default TakeQuiz;