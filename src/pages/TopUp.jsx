import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import api from '../services/api';

export default function TopUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Admin ရဲ့ TRC20 Address ကို Backend ကနေ ဆွဲယူမယ် (Default value ထားရှိသည်)
  const [adminTrc20Address, setAdminTrc20Address] = useState("TUsE7GyeGet2c1728xJnRm6JcwEGNgkL8"); 
  const [copied, setCopied] = useState(false);

  // Backend ကနေ Settings (TRC20 Address) ကို ဆွဲယူခြင်း
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && response.data.settings && response.data.settings.trc20_address) {
          setAdminTrc20Address(response.data.settings.trc20_address);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Error ဖြစ်ရင် Default value ကိုပဲ ဆက်သုံးမယ်
      }
    };
    fetchSettings();
  }, []);

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(amount) < 10) {
      alert("အနည်းဆုံး 10 USDT ဖြည့်သွင်းရပါမည်။");
      return;
    }
    setStep(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(adminTrc20Address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // Backend သို့ Top-up Request ပို့ခြင်း
      await api.post('/user/topup', {
        amount: parseFloat(amount),
        trc20_address: adminTrc20Address
      });
      
      // ✅ Alert ကို ဖျက်ထုတ်လိုက်ပါပြီ။ အောင်မြင်သွားရင် Profile page ကို တန်းပို့ပါမယ်။
      navigate('/profile');
      
    } catch (error) {
      console.error('Top-up Error:', error);
      // Error ဖြစ်မှသာ Alert ပြပါမယ်
      alert(error.response?.data?.message || "Top-up request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Top-Up</h1>
        </div>

        {step === 1 ? (
          // Step 1: Amount ထည့်သွင်းခြင်း
          <form onSubmit={handleFirstSubmit} className="space-y-4">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 flex items-center gap-3">
              <Info className="h-5 w-5 text-brand-secondary flex-shrink-0" />
              <p className="text-gray-300 text-sm">Minimum recharge amount is 10 USDT-TRC20</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="Enter amount"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all mt-6"
            >
              Submit
            </button>
          </form>
        ) : (
          // Step 2: TRC20 Address ပြသခြင်း
          <div className="space-y-4">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 flex items-center gap-3">
              <Info className="h-5 w-5 text-brand-secondary flex-shrink-0" />
              <p className="text-gray-300 text-sm">
                To recharge successfully, you must transfer <span className="text-brand-secondary font-bold">{amount} USDT-TRC20</span> to the following address
              </p>
            </div>

            <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-2">TRC20 Address:</p>
              <div className="bg-dark-input rounded-lg p-3 text-white text-xs sm:text-sm break-all font-mono mb-4 border border-gray-700">
                {adminTrc20Address}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
              <h3 className="text-white font-bold mb-2">Friendly Reminder:</h3>
              <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
                <li>Send via external wallet</li>
                <li>Recharge via bank transfer</li>
                <li>Please contact customer service to get bank information</li>
                <li>Due to the large number of orders, please confirm the correct bank information with our customer service before each recharge</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}