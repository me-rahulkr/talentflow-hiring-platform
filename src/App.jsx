import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import JobsBoardPage from './pages/JobsBoardPage';
import CandidatesPage from './pages/CandidatesPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import TakeAssessmentPage from './pages/TakeAssessmentPage'; // Naya import

function App() {
  return (
    <Routes>
      {/* Routes with Sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<JobsBoardPage />} />
        <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilderPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
      </Route>

      {/* Route without Sidebar */}
      <Route path="/assessment/:jobId/take" element={<TakeAssessmentPage />} />
    </Routes>
  );
}

export default App;