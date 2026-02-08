import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const QuizEditor = ({ quizId, onBack }) => {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [status, setStatus] = useState({ msg: '', type: '' });

    // --- FORM STATE ---
    const [qType, setQType] = useState('MULTIPLE_CHOICE');
    const [content, setContent] = useState('');
    const [options, setOptions] = useState(['', '']); 
    const [correctAnswer, setCorrectAnswer] = useState('');

    const loadQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${quizId}`);
            setQuiz(response.data);
            setQuestions(response.data.questions || []); 
        } catch (error) { console.error("Failed to load quiz", error); }
    };

    useEffect(() => { loadQuiz(); }, [quizId]);

    // Dynamic Option Handlers
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);
    
    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        let finalOptions = options;
        
        // --- VALIDATION LOGIC ---
        if (qType === 'TRUE_FALSE') {
            finalOptions = ['True', 'False'];
            if (correctAnswer !== 'True' && correctAnswer !== 'False') {
                setStatus({ msg: 'Answer must be "True" or "False"', type: 'error' });
                return;
            }
        } 
        else if (qType === 'PARSONS_PROBLEM') {
            // For Parsons, 'options' are the correct lines of code in order.
            // We verify at least 2 lines exist.
            if (options.length < 2) {
                setStatus({ msg: 'Parsons Problems need at least 2 lines of code.', type: 'error' });
                return;
            }
            // The "Correct Answer" isn't strictly needed as the order IS the answer, 
            // but we can store a joined string for verification.
        }
        else if (qType === 'MULTIPLE_CHOICE') {
            if (!finalOptions.includes(correctAnswer)) {
                setStatus({ msg: 'Correct answer must match one of the options exactly.', type: 'error' });
                return;
            }
        }

        try {
            await api.post('/quizzes/add-question', {
                quizId,
                content,
                type: qType,
                options: finalOptions,
                correctAnswer
            });
            setStatus({ msg: 'Question Added!', type: 'success' });
            
            // Reset Form
            setContent('');
            setOptions(['', '']);
            setCorrectAnswer('');
            loadQuiz();
            setTimeout(() => setStatus({ msg: '', type: '' }), 2000);
        } catch (error) {
            console.error(error);
            setStatus({ msg: 'Save Failed', type: 'error' });
        }
    };

    if (!quiz) return <div style={{padding:'20px', color:'white'}}>Loading...</div>;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '15px' }}>&larr; Back to Quiz List</button>
            <h2 style={{ color: 'white' }}>Editing: {quiz.title}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* --- EDITOR FORM --- */}
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
                    <h3 style={{ color: 'var(--accent-green)', marginTop: 0 }}>+ Add Question</h3>
                    
                    {/* TYPE SELECTOR */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Question Type</label>
                        <select 
                            value={qType} 
                            onChange={(e) => { setQType(e.target.value); setOptions(['','']); }}
                            className="input-field"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        >
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True / False</option>
                            <option value="PARSONS_PROBLEM">Parsons Problem (Drag & Drop)</option>
                            <option value="CLOZE_CODE">Cloze Code (Fill in Blanks)</option>
                            <option value="LOGIC_GATE">Logic Gate (Coming Soon)</option>
                        </select>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>
                                {qType === 'PARSONS_PROBLEM' ? 'Task Description' : 'Question Prompt'}
                            </label>
                            <textarea 
                                className="input-field" 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                required 
                                placeholder={qType === 'PARSONS_PROBLEM' ? "e.g. Arrange the code to calculate factorial." : "Enter the question..."}
                                style={{ minHeight: '60px' }}
                            />
                        </div>

                        {/* --- DYNAMIC INPUTS BASED ON TYPE --- */}

                        {/* 1. MULTIPLE CHOICE */}
                        {qType === 'MULTIPLE_CHOICE' && (
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Options</label>
                                {options.map((opt, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                        <input 
                                            className="input-field" 
                                            value={opt} 
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            required 
                                        />
                                        {options.length > 2 && (
                                            <button type="button" onClick={() => removeOption(idx)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor:'pointer' }}>×</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addOption} style={{ background: '#334155', color: '#38bdf8', border: '1px dashed #38bdf8', padding: '5px 10px', borderRadius: '4px', cursor:'pointer', fontSize: '0.8rem' }}>+ Add Option</button>
                            </div>
                        )}

                        {/* 2. PARSONS PROBLEM */}
                        {qType === 'PARSONS_PROBLEM' && (
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Code Lines (Enter in CORRECT order)</label>
                                <p style={{fontSize:'0.8rem', color:'#64748b', margin:'0 0 10px 0'}}>Students will see these scrambled and must drag them to fix.</p>
                                {options.map((opt, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{color:'#64748b', padding:'10px 0'}}>{idx+1}.</span>
                                        <input 
                                            className="input-field" 
                                            value={opt} 
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Code Line ${idx + 1}`}
                                            style={{ fontFamily: 'monospace' }}
                                            required 
                                        />
                                        <button type="button" onClick={() => removeOption(idx)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor:'pointer' }}>×</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addOption} style={{ background: '#334155', color: '#38bdf8', border: '1px dashed #38bdf8', padding: '5px 10px', borderRadius: '4px', cursor:'pointer', fontSize: '0.8rem' }}>+ Add Code Line</button>
                            </div>
                        )}

                        {/* 3. CLOZE CODE */}
                        {qType === 'CLOZE_CODE' && (
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Code Snippet (Use __BLANK__ for missing parts)</label>
                                <textarea 
                                    className="input-field" 
                                    value={options[0]} 
                                    onChange={(e) => handleOptionChange(0, e.target.value)}
                                    placeholder={`public void main(String[] args) {\n    System.out.__BLANK__("Hello");\n}`}
                                    style={{ fontFamily: 'monospace', minHeight: '120px' }}
                                    required 
                                />
                                <div style={{marginTop:'10px'}}>
                                    <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Correct Answer (What goes in the blank?)</label>
                                    <input 
                                        className="input-field"
                                        style={{ borderColor: 'var(--accent-green)' }}
                                        value={correctAnswer} 
                                        onChange={e => setCorrectAnswer(e.target.value)} 
                                        required 
                                        placeholder="println"
                                    />
                                </div>
                            </div>
                        )}

                        {/* SHARED: CORRECT ANSWER FIELD (Only for types that need explicit matching) */}
                        {(qType === 'MULTIPLE_CHOICE' || qType === 'TRUE_FALSE') && (
                            <div>
                                <label style={{color:'#94a3b8', fontSize:'0.8rem'}}>Correct Answer</label>
                                {qType === 'TRUE_FALSE' ? (
                                    <select 
                                        className="input-field"
                                        value={correctAnswer}
                                        onChange={e => setCorrectAnswer(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Answer...</option>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </select>
                                ) : (
                                    <input 
                                        className="input-field" 
                                        style={{ borderColor: 'var(--accent-green)' }}
                                        value={correctAnswer} 
                                        onChange={e => setCorrectAnswer(e.target.value)} 
                                        required 
                                        placeholder="Paste the correct option text here"
                                    />
                                )}
                            </div>
                        )}

                        <button type="submit" className="btn-primary">Save Question</button>
                    </form>
                    {status.msg && <p style={{ color: status.type === 'success' ? '#34d399' : '#f87171', textAlign:'center', marginTop:'10px' }}>{status.msg}</p>}
                </div>

                {/* --- RIGHT: PREVIEW LIST --- */}
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <h3 style={{ color: 'white', marginTop: 0 }}>Questions ({questions.length})</h3>
                    {questions.map((q, i) => (
                        <div key={q.id} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ color: '#e2e8f0' }}>{i + 1}. {q.content}</strong>
                                <span style={{ fontSize: '0.7rem', background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>{q.type}</span>
                            </div>
                            
                            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                {q.type === 'PARSONS_PROBLEM' ? (
                                    <div style={{fontFamily:'monospace', background:'#000', padding:'10px', borderRadius:'4px'}}>
                                        {q.options.map((line, lIdx) => <div key={lIdx}>{line}</div>)}
                                    </div>
                                ) : (
                                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                        {q.options && q.options.map((opt, idx) => (
                                            <li key={idx} style={{ color: opt === q.correctAnswer ? 'var(--accent-green)' : 'inherit', fontWeight: opt === q.correctAnswer ? 'bold' : 'normal' }}>
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default QuizEditor;