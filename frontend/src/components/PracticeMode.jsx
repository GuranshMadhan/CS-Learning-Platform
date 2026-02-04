import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const PracticeMode = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null); 
    const [streak, setStreak] = useState(0);

    // Parsons Problem State
    const [parsonsItems, setParsonsItems] = useState([]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/questions/infinite');
            setQuestions(response.data);
            setCurrentQIndex(0);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // When question changes, prepare the data
    useEffect(() => {
        if (!questions || questions.length === 0) return;
        
        const currentQ = questions[currentQIndex];

        // If it's a Parsons problem, we need to map options to IDs
        if (currentQ.type === 'PARSONS_PROBLEM') {
            const items = [
                { id: '0', content: currentQ.option1 },
                { id: '1', content: currentQ.option2 },
                { id: '2', content: currentQ.option3 },
                { id: '3', content: currentQ.option4 }
            ].filter(item => item.content != null); // Remove nulls
            
            // Shuffle for difficulty
            setParsonsItems(items.sort(() => Math.random() - 0.5));
        }

    }, [currentQIndex, questions]);

    const handleNextQuestion = () => {
        setFeedback(null);
        if (currentQIndex + 1 < questions.length) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            fetchQuestions();
        }
    };

    // 1. STANDARD ANSWER (Multiple Choice / True False)
    const handleStandardAnswer = async (selectedAnswer) => {
        const currentQuestion = questions[currentQIndex];
        const isCorrect = currentQuestion.correctAnswer.trim().toLowerCase() === selectedAnswer.trim().toLowerCase();
        processResult(isCorrect, selectedAnswer);
    };

    // 2. PARSONS ANSWER (Drag & Drop)
    const handleParsonsSubmit = async () => {
        // Convert the current order of IDs into a string like "2,1,3,0"
        const userAnswer = parsonsItems.map(item => item.id).join(",");
        
        // Backend expects strict string match
        const currentQuestion = questions[currentQIndex];
        const isCorrect = currentQuestion.correctAnswer.trim() === userAnswer;
        
        processResult(isCorrect, userAnswer);
    };

    // Common Result Processor
    const processResult = async (isCorrect, answerPayload) => {
        if (isCorrect) {
            setFeedback('CORRECT');
            setStreak(prev => prev + 1);
            try {
                await api.post(`/questions/${questions[currentQIndex].id}/submit`, { answer: answerPayload });
            } catch (err) { console.error(err); }
            setTimeout(handleNextQuestion, 1500);
        } else {
            setFeedback('WRONG');
            setStreak(0);
        }
    };

    // Drag End Handler
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(parsonsItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setParsonsItems(items);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Scouting the mines...</div>;
    if (!questions || questions.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>No questions found.</div>;

    const currentQuestion = questions[currentQIndex];
    const isParsons = currentQuestion.type === 'PARSONS_PROBLEM';

    // Helper for Standard Options
    const standardOptions = [
        currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4
    ].filter(opt => opt != null);

    return (
        <div style={{ padding: '2rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', maxWidth: '700px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {isParsons ? "🧩 Code Reorder" : "Infinite Practice"}
                </span>
                <span style={{ color: streak > 0 ? 'var(--accent-green)' : '#94a3b8' }}>
                    Current Streak: {streak} 🔥
                </span>
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'white', lineHeight: '1.5' }}>
                {currentQuestion.content}
            </h3>

            {/* --- PARSONS MODE (DRAG & DROP) --- */}
            {isParsons ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="parsons-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'grid', gap: '10px' }}>
                                {parsonsItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!!feedback}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    userSelect: 'none',
                                                    padding: '16px',
                                                    background: '#0f172a',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px',
                                                    color: 'var(--accent-blue)',
                                                    fontFamily: 'monospace',
                                                    ...provided.draggableProps.style
                                                }}
                                            >
                                                {item.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    
                    {!feedback && (
                        <button 
                            onClick={handleParsonsSubmit}
                            className="btn-primary" 
                            style={{ marginTop: '20px', background: 'var(--accent-green)' }}
                        >
                            SUBMIT ORDER
                        </button>
                    )}
                </DragDropContext>
            ) : (
                /* --- STANDARD MODE (BUTTONS) --- */
                <div style={{ display: 'grid', gap: '12px' }}>
                    {standardOptions.map((option, index) => {
                        let bgColor = '#0f172a';
                        let borderColor = '#334155';
                        if (feedback === 'CORRECT' && option.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
                            bgColor = 'rgba(16, 185, 129, 0.2)'; borderColor = 'var(--accent-green)';
                        }
                        return (
                            <button
                                key={index}
                                onClick={() => !feedback && handleStandardAnswer(option)}
                                disabled={!!feedback}
                                style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    background: bgColor,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: feedback ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* FEEDBACK MESSAGES */}
            {feedback === 'WRONG' && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--accent-red)', fontWeight: 'bold' }}>
                    Incorrect. Streak reset. Try again!
                </div>
            )}
            {feedback === 'CORRECT' && (
                <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                    System Optimization Successful. <span style={{color: '#fbbf24'}}>+{currentQuestion.xpValue} XP</span>
                </div>
            )}
        </div>
    );
};

export default PracticeMode;