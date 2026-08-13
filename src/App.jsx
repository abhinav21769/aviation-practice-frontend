import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ProgressProvider } from './context/ProgressContext';
import Dashboard from './pages/Dashboard';
import InterviewPrep from './pages/InterviewPrep';
import Practice from './pages/Practice';
import AviationEnglish from './pages/AviationEnglish';
import Scenarios from './pages/Scenarios';
import Progress from './pages/Progress';
import EnglishCommunication from './pages/EnglishCommunication';
import Knowledge from './pages/Knowledge';
import Grooming from './pages/Grooming';

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/aviation-english" element={<AviationEnglish />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/english-communication" element={<EnglishCommunication />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/grooming" element={<Grooming />} />
          </Routes>
        </Layout>
      </ProgressProvider>
    </BrowserRouter>
  );
}
