import React from 'react';
import { useNavigate } from 'react-router-dom';

const SystemsArchitectureNotes = () => {
    const navigate = useNavigate();

    // --- SHARED STYLES ---
    const sectionStyle = {
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const h3Style = {
        color: '#34d399', // Accent green
        marginTop: '0',
        marginBottom: '15px',
        borderBottom: '1px solid #334155',
        paddingBottom: '10px',
        fontSize: '1.4rem'
    };

    const pStyle = {
        color: '#94a3b8',
        marginBottom: '15px',
        lineHeight: '1.6'
    };

    const ulStyle = {
        margin: '0',
        paddingLeft: '20px',
        color: '#cbd5e1',
        lineHeight: '1.6'
    };

    const liStyle = {
        marginBottom: '10px'
    };

    const strongStyle = {
        color: 'white'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', animation: 'fadeIn 0.5s ease' }}>
            
            {/* BACK BUTTON */}
            <button 
                onClick={() => navigate('/theory')} // Adjust this path if your TheoryHub is mapped differently in App.jsx
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}
            >
                &larr; Back to Topics
            </button>

            {/* HEADER */}
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ color: 'white', fontSize: '2.5rem', margin: '0 0 10px 0' }}>1.1 Systems Architecture</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0' }}>OCR A-Level Computer Science: Review notes and key concepts.</p>
            </header>

            {/* Section 1: Core CPU Components */}
            <section style={sectionStyle}>
                <h3 style={h3Style}>1. Core CPU Components</h3>
                <p style={pStyle}>The Central Processing Unit (CPU) is the brain of the computer, responsible for executing instructions.</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong style={strongStyle}>Control Unit (CU):</strong> Coordinates the activities of the CPU, directs data flow between components, and decodes instructions.</li>
                    <li style={liStyle}><strong style={strongStyle}>Arithmetic Logic Unit (ALU):</strong> Performs all mathematical calculations (addition, subtraction) and logical operations (AND, OR, NOT).</li>
                    <li style={liStyle}><strong style={strongStyle}>Registers:</strong> Extremely fast, temporary memory locations located directly inside the CPU.</li>
                </ul>
            </section>

            {/* Section 2: The Special Purpose Registers */}
            <section style={sectionStyle}>
                <h3 style={h3Style}>2. The Special Purpose Registers</h3>
                <p style={pStyle}>These registers have specific roles in processing instructions via the Fetch-Decode-Execute cycle.</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong style={strongStyle}>Program Counter (PC):</strong> Holds the memory address of the <em>next</em> instruction to be executed. It increments after the fetch stage.</li>
                    <li style={liStyle}><strong style={strongStyle}>Accumulator (ACC):</strong> Stores the intermediate and final results of calculations performed by the ALU.</li>
                    <li style={liStyle}><strong style={strongStyle}>Memory Address Register (MAR):</strong> Holds the memory address of the data or instruction that needs to be fetched from, or written to, memory.</li>
                    <li style={liStyle}><strong style={strongStyle}>Memory Data Register (MDR):</strong> Holds the actual data or instruction that has just been fetched from memory, or is about to be written to memory.</li>
                    <li style={liStyle}><strong style={strongStyle}>Current Instruction Register (CIR):</strong> Holds the current instruction while it is being decoded and executed.</li>
                </ul>
            </section>

            {/* Section 3: The Buses */}
            <section style={sectionStyle}>
                <h3 style={h3Style}>3. The Buses</h3>
                <p style={pStyle}>A bus is a set of parallel wires connecting two or more components of a computer.</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong style={strongStyle}>Address Bus:</strong> Carries memory addresses from the processor to other components. It is <strong>unidirectional</strong> (one-way).</li>
                    <li style={liStyle}><strong style={strongStyle}>Data Bus:</strong> Carries the actual data and instructions between components. It is <strong>bidirectional</strong> (two-way).</li>
                    <li style={liStyle}><strong style={strongStyle}>Control Bus:</strong> Carries control signals (like read/write commands or clock signals) around the system. It is <strong>bidirectional</strong>.</li>
                </ul>
            </section>

            {/* Section 4: CPU Architecture & Performance */}
            <section style={sectionStyle}>
                <h3 style={h3Style}>4. CPU Architecture & Performance</h3>
                <p style={pStyle}>Different architectures and components affect how fast a processor can run.</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong style={strongStyle}>Von Neumann Architecture:</strong> Uses a single shared memory space and shared buses for both data and instructions. This can lead to the "Von Neumann bottleneck."</li>
                    <li style={liStyle}><strong style={strongStyle}>Harvard Architecture:</strong> Uses physically separate memories and buses for data and instructions, allowing them to be fetched simultaneously.</li>
                    <li style={liStyle}><strong style={strongStyle}>Clock Speed:</strong> The number of fetch-decode-execute cycles the CPU can perform per second, measured in Hertz (Hz).</li>
                    <li style={liStyle}><strong style={strongStyle}>Cache Memory:</strong> A small amount of super-fast memory near the CPU that stores frequently used instructions to speed up processing.</li>
                    <li style={liStyle}><strong style={strongStyle}>Pipelining:</strong> A technique where the CPU fetches the next instruction while the current instruction is being decoded, and the previous one is being executed, keeping all parts of the CPU active.</li>
                </ul>
            </section>

            {/* Section 5: Processor Types */}
            <section style={sectionStyle}>
                <h3 style={h3Style}>5. Processor Types</h3>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong style={strongStyle}>CISC (Complex Instruction Set Computer):</strong> Has a large instruction set. An instruction may take multiple clock cycles to execute, but requires less RAM to store the code.</li>
                    <li style={liStyle}><strong style={strongStyle}>RISC (Reduced Instruction Set Computer):</strong> Has a small, highly optimized instruction set. Each instruction takes exactly one clock cycle, heavily utilizing pipelining.</li>
                    <li style={liStyle}><strong style={strongStyle}>GPU (Graphics Processing Unit):</strong> A highly parallelized processor with thousands of smaller cores, designed for processing multiple streams of data simultaneously (ideal for graphics and machine learning).</li>
                </ul>
            </section>
        </div>
    );
};

export default SystemsArchitectureNotes;