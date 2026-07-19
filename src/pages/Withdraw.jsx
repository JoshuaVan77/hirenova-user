import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, AlertCircle, CheckCircle, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Withdraw() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [trc20Address, setTrc20Address] = useState(user?.trc20_address || '');
  const [paymentPassword, setPaymentPassword] = useState(''); // ✅ Payment Password State
  const [loading, setLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [checking, setChecking] = useState(true);

  // ၁။ Page ဝင်ဝင်ချင်း Task အခြေအနေကို စစ်ဆေးခြင်း
  useEffect(() => {
    fetchTaskStatus();
  }, []);

  const fetchTaskStatus = async () => {
    try {
      const response = await api.get('/user/tasks/today');
      setCompletedCount(response.data.completedCount || 0);
    } catch (error) {
      console.error('Error fetching task status:', error);
    } finally {
      setChecking(false);
    }
  };

  // ၂။ Withdraw Form Submit လုပ်ခြင်း
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ 40 Tasks မပြည့်သေးရင် တားဆီးမယ်
    if (completedCount < 40) {
      alert('You must complete 40 tasks today to withdraw.');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    const userBalance = parseFloat(user?.balance || 0);

    if (withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > userBalance) {
      alert('Insufficient balance');
      return;
    }

    if (!trc20Address.trim()) {
      alert('Please enter your TRC20 address');
      return;
    }

    // ✅ Payment Password စစ်ဆေးခြင်း
    if (!paymentPassword.trim()) {
      alert('Please enter your payment password');
      return;
    }

    setLoading(true);
    try {
      await api.post('/user/withdraw', {
        amount: withdrawAmount,
        trc20_address: trc20Address,
        payment_password: paymentPassword // ✅ Payment Password ပါပို့မယ်
      });
      
      // ✅ Alert ကို ဖျက်ထုတ်လိုက်ပါပြီ။ အောင်မြင်သွားရင် Profile page ကို တန်းပို့ပါမယ်။
      setAmount('');
      setPaymentPassword('');
      await refreshUser();
      navigate('/profile'); // ဒါက Success ဖြစ်သွားကြောင်း သိသာစေမယ့် တစ်ခုတည်းသော လက္ခဏာ ဖြစ်ပါမယ်
      
    } catch (error) {
      console.error('Withdraw Error:', error);
      // Error ဖြစ်မှသာ Alert ပြပါမယ်
      alert(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" /> Checking task status...
        </div>
      </div>
    );
  }

  const isEligible = completedCount >= 40;
  const displayBalance = parseFloat(user?.balance || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Withdraw</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6 mb-6">
          <p className="text-gray-300 text-sm mb-1">Available Balance</p>
          <h2 className="text-3xl font-bold text-white">USDT {displayBalance}</h2>
        </div>

        {/* Task Eligibility Check Banner */}
        <div className={`rounded-xl p-4 border mb-6 flex items-start gap-3 ${
          isEligible 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          {isEligible ? (
            <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className={`font-semibold mb-1 ${isEligible ? 'text-green-400' : 'text-red-400'}`}>
              {isEligible ? 'Eligible for Withdrawal' : 'Withdrawal Locked'}
            </h3>
            <p className="text-sm text-gray-300">
              {isEligible 
                ? `You have completed ${completedCount}/40 tasks today. You can now withdraw your earnings.`
                : `You must complete 40 tasks today to withdraw. Currently completed: ${completedCount}/40.`
              }
            </p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleSubmit} className="bg-dark-card rounded-xl p-4 sm:p-6 border border-gray-800 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Withdrawal Amount (USDT)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isEligible || loading}
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter amount"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum withdrawal amount may apply.</p>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">TRC20 Wallet Address</label>
            <input
              type="text"
              value={trc20Address}
              onChange={(e) => setTrc20Address(e.target.value)}
              disabled={!isEligible || loading}
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your TRC20 address"
              required
            />
          </div>

          {/* ✅ Payment Password Field */}
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" /> Payment Password
            </label>
            <input
              type="password"
              value={paymentPassword}
              onChange={(e) => setPaymentPassword(e.target.value)}
              disabled={!isEligible || loading}
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your payment password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter the payment password you set during registration.</p>
          </div>

          <button
            type="submit"
            disabled={!isEligible || loading || !amount || !trc20Address || !paymentPassword}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-800 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" /> Submit Withdrawal
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}