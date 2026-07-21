import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Key, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const countries = [
  { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
];

export default function Register() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    payment_password: '',
    invite_code: ''
  });
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullPhone = `${selectedCountry.code}${formData.phone}`;
    
    try {
      const result = await register({ ...formData, phone: fullPhone });

      if (result.success) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } else {
        setError(result.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
          <p className="text-gray-400 text-sm sm:text-base">Create a new account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input name="full_name" onChange={handleChange} className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" placeholder="Ko Ko" required />
            </div>
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <div className="relative flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 bg-dark-input border border-gray-700 rounded-lg px-2 sm:px-3 py-2.5 sm:py-3 text-white hover:border-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                  <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
                  <span className="text-xs sm:text-sm font-medium">{selectedCountry.code}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </button>

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

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <input 
                  name="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                  className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" 
                  placeholder="9xxxxxxxxx" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input name="email" type="email" onChange={handleChange} className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" placeholder="example@gmail.com" required />
            </div>
          </div>

          {/* Login Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Login Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input name="password" type="password" onChange={handleChange} className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" placeholder="••••••••" required />
            </div>
          </div>

          {/* Payment Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Payment Password (For Withdrawal)</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input name="payment_password" type="password" onChange={handleChange} className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" placeholder="••••••••" required />
            </div>
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Invite Code</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <input name="invite_code" onChange={handleChange} className="w-full bg-dark-input border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all text-sm sm:text-base" placeholder="HIRE2024" required />
            </div>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 sm:py-4 rounded-lg hover:from-brand-secondary hover:to-brand-accent transition-all duration-300 shadow-lg shadow-brand-primary/30 text-sm sm:text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-brand-accent hover:text-brand-secondary hover:underline font-medium transition-colors">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}