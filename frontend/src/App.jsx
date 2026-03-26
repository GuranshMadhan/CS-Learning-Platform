import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TheoryHub from './components/TheoryHub';
import Dashboard from './components/Dashboard'; 
import Leaderboard from './components/Leaderboard'
import SystemsArchitectureNotes from './components/SystemsArchitectureNotes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/theory" element={<TheoryHub />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/theory/1.1" element={<SystemsArchitectureNotes />} />
      </Routes>
    </Router>
  );
}

export default App;