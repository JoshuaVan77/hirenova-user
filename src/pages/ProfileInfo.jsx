import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    phone: user?.phone || '',
    trc20_address: user?.trc20_address || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/profile')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Nickname */}
          <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Nickname</label>
              <button className="text-brand-secondary text-sm flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                Modify
              </button>
            </div>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-2 px-3 text-white text-sm"
              readOnly
            />
          </div>

          {/* Phone Number */}
          <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
            <label className="text-gray-400 text-sm block mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-2 px-3 text-white text-sm"
              readOnly
            />
          </div>

          {/* TRC20 Address */}
          <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
            <label className="text-gray-400 text-sm block mb-2">TRC20 Address</label>
            <input
              type="text"
              name="trc20_address"
              value={formData.trc20_address}
              onChange={handleChange}
              placeholder="Enter your USDT TRC20 address"
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-2 px-3 text-white text-sm"
            />
          </div>

          {/* Login Password */}
          <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Login Password</label>
              <button className="text-brand-secondary text-sm flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                Modify
              </button>
            </div>
            <input
              type="password"
              value="••••••••"
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-2 px-3 text-white text-sm"
              readOnly
            />
          </div>

          {/* Payment Password */}
          <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Payment Password</label>
              <button className="text-brand-secondary text-sm flex items-center gap-1">
                <Edit2 className="h-4 w-4" />
                Modify
              </button>
            </div>
            <input
              type="password"
              value="••••••••"
              className="w-full bg-dark-input border border-gray-700 rounded-lg py-2 px-3 text-white text-sm"
              readOnly
            />
          </div>
        </div>

      </div>
    </div>
  );
}