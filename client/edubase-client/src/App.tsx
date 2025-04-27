import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import TutorAgentPage from './pages/Tutor.tsx';
import EvaluatorAgentPage from './pages/Evaluator.tsx';
import OnchainKitProviderWrapper from './OnchainKitProviderWrapper.tsx';
import ZeroKnowledgeTestPage from './pages/ZeroKnowledgeTest.tsx'; // 🚀 NEW PAGE
import ProofOfAchievementPage from './pages/ProofOfAchievement.tsx'; // 🌟 YOUR NEW PAGE




const App: React.FC = () => (
  <OnchainKitProviderWrapper>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tutor-agent" element={<TutorAgentPage />} />
        <Route path="/evaluator-agent" element={<EvaluatorAgentPage />} />
        <Route path="/zero-knowledge-test" element={<ZeroKnowledgeTestPage />} />
        <Route path="/proof-of-achievement" element={<ProofOfAchievementPage />} /> {/* 🚀 NEW ROUTE */}
        
      </Routes>
    </Router>
  </OnchainKitProviderWrapper>
);

export default App;
