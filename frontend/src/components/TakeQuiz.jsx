import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const TakeQuiz = ({ quizId, onBack }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [parsonsState, setParsonsState] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const response = await api.get(`/quizzes/${quizId}`);
                const quizData = response.data;
                
                const initialParsons = {};
                quizData.questions.forEach(q => {
                    if (q.type === 'PARSONS_PROBLEM') {
                        initialParsons[q.id] = shuffleArray(q.options);
                    }
                });
                
                setParsonsState(initialParsons);
                setQuiz(quizData);
            } catch (error) {
                console.error("Failed to load quiz", error);
            }
        };
        loadQuiz();
    }, [quizId]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const questionId = parseInt(source.droppableId);
        
        const currentOrder = Array.from(parsonsState[questionId]);
        const [reorderedItem] = currentOrder.splice(source.index, 1);
        currentOrder.splice(destination.index, 0, reorderedItem);

        setParsonsState(prev => ({ ...prev, [questionId]: currentOrder }));
    };

    const handleTextChange = (questionId, val) => {
        setAnswers(prev => ({ ...prev, [`question_${questionId}`]: val }));
    };

    const handleSubmit = async () => {
        if (!window.confirm("Submit Assessment?")) return;
        const finalAnswers = { ...answers };
        Object.keys(parsonsState).forEach(qId => {
            finalAnswers[`question_${qId}`] = parsonsState[qId].join('|||');
        });

        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, finalAnswers);
            setResult(response.data);
        } catch (error) {
            alert(error.response?.data || "Submission Failed");
        }
    };

    if (!quiz) return <div style={{color:'white', padding:'20px'}}>Loading Interface...</div>;

    if (result) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
                <h1 style={{ fontSize: '3rem' }}>🎉</h1>
                <h2>Assessment Complete</h2>
                <p style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}>{result}</p>
                <button onClick={onBack} className="btn-primary">Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '50px' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px' }}>&larr; Abort Assessment</button>
            <h1 style={{ color: 'white' }}>{quiz.title}</h1>
            
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'grid', gap: '30px', marginTop: '20px' }}>
                    {quiz.questions.map((q, index) => (
                        <div key={q.id} style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
                            <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>
                                <span style={{ color: 'var(--accent-blue)', marginRight: '10px' }}>{index + 1}.</span> 
                                {q.type === 'CLOZE_CODE' ? "Fill in the blank:" : q.content}
                            </h3>

                            {q.type === 'PARSONS_PROBLEM' && (
                                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>Drag items to reorder:</p>
                                    <Droppable droppableId={String(q.id)}>
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {parsonsState[q.id]?.map((line, idx) => (
                                                    <Draggable key={`${q.id}-${idx}`} draggableId={`${q.id}-${idx}`} index={idx}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    userSelect: 'none',
                                                                    padding: '12px',
                                                                    margin: '0 0 8px 0',
                                                                    backgroundColor: '#334155',
                                                                    color: '#e2e8f0',
                                                                    fontFamily: 'monospace',
                                                                    borderRadius: '4px',
                                                                    whiteSpace: 'pre',
                                                                    ...provided.draggableProps.style
                                                                }}
                                                            >
                                                                {line}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )}

                            {q.type === 'CLOZE_CODE' && (
                                <div style={{ 
                                    background: '#0f172a', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    fontFamily: 'monospace', 
                                    color: '#e2e8f0', 
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '1.1rem',
                                    lineHeight: '2'
                                }}>
                                    {q.content.split('________').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <input 
                                                    type="text"
                                                    autoComplete="off"
                                                    style={{ 
                                                        background: 'transparent', 
                                                        border: 'none',
                                                        borderBottom: '2px solid var(--accent-blue)', 
                                                        color: 'var(--accent-green)', 
                                                        padding: '0 5px', 
                                                        width: '120px',
                                                        textAlign: 'center',
                                                        fontSize: '1.1rem',
                                                        outline: 'none',
                                                        fontWeight: 'bold'
                                                    }}
                                                    placeholder="type answer..."
                                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {(q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                                    {(q.type === 'TRUE_FALSE' ? ['True', 'False'] : q.options).map((opt, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => handleTextChange(q.id, opt)}
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
                            )}
                        </div>
                    ))}
                </div>
            </DragDropContext>

            <div style={{ marginTop: '40px', textAlign: 'right' }}>
                <button onClick={handleSubmit} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                    SUBMIT ANSWERS &rarr;
                </button>
            </div>
        </div>
    );
};

export default TakeQuiz;