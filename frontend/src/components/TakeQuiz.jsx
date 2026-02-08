import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TakeQuiz = ({ quizId, onBack }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [parsonsState, setParsonsState] = useState({}); // Stores the shuffled order for each Parsons question
    const [result, setResult] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const response = await api.get(`/quizzes/${quizId}`);
                const quizData = response.data;
                
                // Initialize Parsons Problems: Shuffle the options for the student
                const initialParsons = {};
                quizData.questions.forEach(q => {
                    if (q.type === 'PARSONS_PROBLEM') {
                        // Create a copy and shuffle it
                        const shuffled = [...q.options].sort(() => Math.random() - 0.5);
                        initialParsons[q.id] = shuffled;
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

    // Handle Drag and Drop
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;
        // The Droppable ID is the Question ID
        const questionId = parseInt(source.droppableId);
        
        const currentOrder = Array.from(parsonsState[questionId]);
        const [reorderedItem] = currentOrder.splice(source.index, 1);
        currentOrder.splice(destination.index, 0, reorderedItem);

        setParsonsState(prev => ({
            ...prev,
            [questionId]: currentOrder
        }));
    };

    const handleTextChange = (questionId, val) => {
        setAnswers(prev => ({ ...prev, [`question_${questionId}`]: val }));
    };

    const handleSubmit = async () => {
        if (!window.confirm("Submit Assessment?")) return;

        // Prepare Payload
        const finalAnswers = { ...answers };

        // For Parsons, join the current state into a single string
        Object.keys(parsonsState).forEach(qId => {
            finalAnswers[`question_${qId}`] = parsonsState[qId].join('|||');
        });

        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, finalAnswers);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert("Submission Failed");
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
                            
                            {/* Question Header */}
                            <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>
                                <span style={{ color: 'var(--accent-blue)', marginRight: '10px' }}>{index + 1}.</span> 
                                {q.content}
                            </h3>

                            {/* --- RENDER BASED ON TYPE --- */}

                            {/* 1. PARSONS PROBLEM */}
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

                            {/* 2. CLOZE CODE */}
                            {q.type === 'CLOZE_CODE' && (
                                <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                                    {q.options[0].split('__BLANK__').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <input 
                                                    style={{ 
                                                        background: '#1e293b', 
                                                        border: '1px solid var(--accent-blue)', 
                                                        color: 'white', 
                                                        padding: '4px', 
                                                        borderRadius: '4px',
                                                        width: '100px',
                                                        margin: '0 5px'
                                                    }}
                                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {/* 3. MULTIPLE CHOICE / TRUE FALSE */}
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