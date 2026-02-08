import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const QuizEditor = ({ quizId, onBack }) => {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({
        content: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: ''
    });
    const [status, setStatus] = useState({ msg: '', type: '' });

    // Load Quiz Details
    const loadQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${quizId}`);
            setQuiz(response.data);
            // Assuming the backend returns the list of questions inside the quiz object
            // If using the simple Entity return I gave above, it will work.
            setQuestions(response.data.questions || []); 
        } catch (error) {
            console.error("Failed to load quiz", error);
        }
    };

    useEffect(() => { loadQuiz(); }, [quizId]);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        
        // Validation: Ensure correct answer matches one of the options
        const { option1, option2, option3, option4, correctAnswer } = formData;
        const validOptions = [option1, option2, option3, option4];
        
        if (!validOptions.includes(correctAnswer)) {
            setStatus({ msg: 'Error: Correct Answer must match one of the options exactly.', type: 'error' });
            return;
        }

        try {
            await api.post('/quizzes/add-question', {
                quizId: quizId,
                ...formData
            });
            
            setStatus({ msg: 'Question Added!', type: 'success' });
            setFormData({ content: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '' });
            loadQuiz(); // Refresh list
            setTimeout(() => setStatus({ msg: '', type: '' }), 2000);
        } catch (error) {
            console.error(error);
            setStatus({ msg: 'Failed to save question.', type: 'error' });
        }
    };

    if (!quiz) return <div style={{padding:'20px', color:'white'}}>Loading Editor...</div>;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* HEADER */}
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '15px' }}>
                &larr; Back to Quiz List
            </button>
            <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', margin: 0 }}>Editing: {quiz.title}</h2>
                <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>{quiz.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* LEFT: ADD QUESTION FORM */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
                    <h3 style={{ color: 'var(--accent-green)', marginTop: 0 }}>+ Add Question</h3>
                    <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        
                        <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Question Text</label>
                        <input 
                            className="input-field" 
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            required 
                            placeholder="e.g. What is 2+2?"
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Option 1</label>
                                <input className="input-field" required value={formData.option1} onChange={e => setFormData({...formData, option1: e.target.value})} />
                            </div>
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Option 2</label>
                                <input className="input-field" required value={formData.option2} onChange={e => setFormData({...formData, option2: e.target.value})} />
                            </div>
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Option 3</label>
                                <input className="input-field" required value={formData.option3} onChange={e => setFormData({...formData, option3: e.target.value})} />
                            </div>
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Option 4</label>
                                <input className="input-field" required value={formData.option4} onChange={e => setFormData({...formData, option4: e.target.value})} />
                            </div>
                        </div>

                        <label style={{color:'#94a3b8', fontSize:'0.8rem', marginTop:'10px'}}>Correct Answer (Must match an option)</label>
                        <input 
                            className="input-field" 
                            style={{ borderColor: 'var(--accent-green)' }}
                            value={formData.correctAnswer}
                            onChange={e => setFormData({...formData, correctAnswer: e.target.value})}
                            required 
                            placeholder="Paste the correct option here"
                        />

                        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Question</button>
                    </form>
                    {status.msg && <p style={{ color: status.type === 'success' ? '#34d399' : '#f87171', textAlign:'center' }}>{status.msg}</p>}
                </div>

                {/* RIGHT: EXISTING QUESTIONS */}
                <div>
                    <h3 style={{ color: 'white', marginTop: 0 }}>Questions ({questions.length})</h3>
                    <div style={{ display: 'grid', gap: '10px', maxHeight: '600px', overflowY: 'auto' }}>
                        {questions.length === 0 && <div style={{color:'#64748b'}}>No questions yet. Add one!</div>}
                        
                        {questions.map((q, index) => (
                            <div key={q.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong style={{ color: '#e2e8f0' }}>Q{index + 1}: {q.content}</strong>
                                    <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', border: '1px solid var(--accent-green)', padding: '2px 6px', borderRadius: '4px' }}>{q.correctAnswer}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    <div>A) {q.option1}</div>
                                    <div>B) {q.option2}</div>
                                    <div>C) {q.option3}</div>
                                    <div>D) {q.option4}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuizEditor;