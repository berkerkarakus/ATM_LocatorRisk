import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HighRisk from './pages-components/AdvancedSearch';
import MapDashboard from './pages-components/MapDashboard';
import Navbar from './pages-components/navbar';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<MapDashboard />} />
            <Route path="/advancedSearch" element={<HighRisk />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
