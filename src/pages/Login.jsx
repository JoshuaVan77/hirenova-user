import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, ChevronDown, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const countries = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+60', flag: '🇾', name: 'Malaysia' },
];

export default function Login() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullPhone = `${selectedCountry.code}${phone}`;
    const result = await login({ phone: fullPhone, password });

    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-bg to-brand-primary/20 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg bg-dark-card p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-sm">
        
        {/* Logo & Header */}
        <div className="text-center mb-6 sm:mb-8">
          <img src="/logo.png" alt="HireNova Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg border-2 border-brand-secondary/50" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent mb-2">
            HireNova
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Login to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          
          {/* Phone Input with Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <div className="relative flex gap-2">
              
              {/* Country Code Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 bg-dark-input border border-gray-700 rounded-lg px-3 py-3 text-white hover:border-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-sm font-medium">{selectedCountry.code}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown List */}
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute z-20 mt-2 w-40 bg-dark-card border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto left-0">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700/50 transition-colors text-sm ${
                            selectedCountry.code === country.code ? 'bg-brand-primary/20 text-brand-secondary' : 'text-white'
                          }`}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  placeholder="9xxxxxxxxx"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-input border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 rounded-lg hover:from-brand-secondary hover:to-brand-accent transition-all duration-300 shadow-lg shadow-brand-primary/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-brand-accent hover:text-brand-secondary hover:underline font-medium transition-colors"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}