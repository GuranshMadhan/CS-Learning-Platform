import React from 'react';
import { useNavigate } from 'react-router-dom';

const topics = [
    { id: '1.1', title: '1.1 Systems Architecture' },
    { id: '1.2', title: '1.2 Memory and Storage' },
    { id: '1.3', title: '1.3 Computer Networks' },
    { id: '1.4', title: '1.4 Network Security' },
    { id: '1.5', title: '1.5 Systems Software' },
    { id: '1.6', title: '1.6 Ethical, Legal, Cultural & Environmental' },
    { id: '2.1', title: '2.1 Algorithms' },
    { id: '2.2', title: '2.2 Programming Fundamentals' },
    { id: '2.3', title: '2.3 Producing Robust Programs' },
    { id: '2.4', title: '2.4 Boolean Logic' },
    { id: '2.5', title: '2.5 Programming Languages & IDEs' }
];

const TheoryHub = ({ onBack }) => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease' }}>
            <button 
                onClick={() => navigate('/dashboard')} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px' }}
            >
                &larr; Back to Dashboard
            </button>

            <h1 style={{ color: 'white', marginBottom: '10px' }}>OCR Computer Science Theory</h1>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Select a topic to review notes and key concepts.</p>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
                {topics.map((topic) => (
                    <div 
                        key={topic.id}
                        onClick={() => alert(`Content for ${topic.title} coming soon!`)} // Placeholder action
                        style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, border-color 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            minHeight: '100px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-blue)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#334155';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <h3 style={{ color: 'var(--accent-green)', margin: '0 0 10px 0' }}>{topic.id}</h3>
                        <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{topic.title.substring(4)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheoryHub;