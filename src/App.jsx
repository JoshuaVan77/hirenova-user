import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import BottomNav from './components/BottomNav';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Order from './pages/Order';
import Profile from './pages/Profile';
import ProfileInfo from './pages/ProfileInfo';
import WalletDetails from './pages/WalletDetails';
import TopupRecords from './pages/TopupRecords';
import WithdrawRecords from './pages/WithdrawRecords';
import Language from './pages/Language';
import Withdraw from './pages/Withdraw';
import TopUp from './pages/TopUp';
import Help from './pages/Help';
import About from './pages/About';
import Service from './pages/Service'; 

// Layout Component
// ✅ FIXED: Changed bg-gray-50 to bg-dark-bg to match the dark theme of the app
const UserLayout = ({ children }) => (
  <div className="relative min-h-screen pb-20 bg-dark-bg text-white">
    {children}
    <BottomNav />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main User Routes */}
          <Route path="/home" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/trade" element={<UserLayout><Trade /></UserLayout>} />
          <Route path="/order" element={<UserLayout><Order /></UserLayout>} />
          
          {/* Support & Info Routes */}
          <Route path="/help" element={<UserLayout><Help /></UserLayout>} />
          <Route path="/about" element={<UserLayout><About /></UserLayout>} />
          <Route path="/service" element={<Service />} /> {/* Full Screen Chat without BottomNav */}
          
          {/* Profile & Settings Routes */}
          <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
          <Route path="/profile/info" element={<UserLayout><ProfileInfo /></UserLayout>} />
          <Route path="/profile/wallet" element={<UserLayout><WalletDetails /></UserLayout>} />
          <Route path="/profile/topup" element={<UserLayout><TopupRecords /></UserLayout>} />
          <Route path="/profile/withdraw" element={<UserLayout><WithdrawRecords /></UserLayout>} />
          <Route path="/profile/language" element={<UserLayout><Language /></UserLayout>} />
          
          {/* Transaction Form Routes (Standalone / Full Screen) */}
          <Route path="/topup-form" element={<TopUp />} />
          <Route path="/withdraw-form" element={<Withdraw />} />
          
          {/* Catch-all Route for 404 (Redirects to login) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;