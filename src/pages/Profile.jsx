import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wallet, ArrowUpCircle, ArrowDownCircle, Globe, LogOut, ChevronRight, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Page ဝင်ဝင်ချင်း Balance အသစ်ကို အလိုအလျောက် ဆွဲယူခြင်း
  useEffect(() => {
    refreshUser();
  }, []);

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 800); // Animation အတွက် အနည်းငယ် စောင့်မယ်
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile/info', color: 'text-blue-400' },
    { icon: Wallet, label: 'Wallet Details', path: '/profile/wallet', color: 'text-green-400' },
    { icon: ArrowUpCircle, label: 'Top-up Records', path: '/profile/topup', color: 'text-purple-400' },
    { icon: ArrowDownCircle, label: 'Withdrawal History', path: '/profile/withdraw', color: 'text-orange-400' },
    { icon: Globe, label: 'Language', path: '/profile/language', color: 'text-cyan-400' },
  ];

  const displayBalance = parseFloat(user?.balance || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Balance */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {user?.full_name || user?.nickname || 'User'}
              </h2>
              <p className="text-gray-200 text-sm">Credit: {user?.credit_score || 100}</p>
            </div>
          </div>
          
          {/* Balance Display with Refresh Button */}
          <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-white" />
              <span className="text-white text-sm sm:text-base font-bold">{displayBalance} USDT</span>
            </div>
            <button 
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50"
              title="Refresh Balance"
            >
              <RefreshCw className={`h-4 w-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => navigate('/withdraw-form')}
            className="bg-dark-card border border-gray-800 rounded-lg py-3 px-4 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Withdraw
          </button>
          <button 
            onClick={() => navigate('/topup-form')}
            className="bg-dark-card border border-gray-800 rounded-lg py-3 px-4 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Top-Up
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-white text-sm sm:text-base">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-500/10 border border-red-500/50 text-red-400 font-bold py-3 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>

      </div>
    </div>
  );
}