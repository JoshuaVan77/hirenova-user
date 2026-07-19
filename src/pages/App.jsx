import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// စမ်းသပ် Home Component (နောက်ပိုင်းမှာ အသေးစိတ် ဖန်တီးပါမယ်)
const Home = () => <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center text-2xl">Home Page (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;