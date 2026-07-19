import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Gift } from 'lucide-react';

export default function WalletDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Sample earnings data
  const earnings = [
    { id: 1, type: 'order', amount: 787.55, time: '2026-07-11 14:26:25' },
    { id: 2, type: 'referral', amount: 1.58, time: '2026-07-11 14:26:25' },
    { id: 3, type: 'order', amount: 787.55, time: '2026-07-11 14:26:25' },
    { id: 4, type: 'order', amount: 785.90, time: '2026-07-11 14:26:16' },
    { id: 5, type: 'referral', amount: 1.65, time: '2026-07-11 14:26:16' },
    { id: 6, type: 'order', amount: 785.90, time: '2026-07-11 14:26:16' },
  ];

  const filteredEarnings = activeTab === 'all' 
    ? earnings 
    : earnings.filter(e => e.type === activeTab);

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
          <h1 className="text-xl sm:text-2xl font-bold">Wallet Details</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-brand-primary text-white' : 'bg-dark-card text-gray-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'order' ? 'bg-green-600 text-white' : 'bg-dark-card text-gray-400'
            }`}
          >
            Order Earnings
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'referral' ? 'bg-purple-600 text-white' : 'bg-dark-card text-gray-400'
            }`}
          >
            Referral Bonus
          </button>
        </div>

        {/* Earnings List */}
        <div className="space-y-3">
          {filteredEarnings.map((earning) => (
            <div 
              key={earning.id} 
              className="bg-dark-card rounded-lg p-4 border border-gray-800"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {earning.type === 'order' ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <Gift className="h-5 w-5 text-purple-400" />
                  )}
                  <span className="text-gray-400 text-sm">Amount</span>
                </div>
                <span className={`text-lg font-bold ${
                  earning.type === 'order' ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {earning.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">Time</span>
                <span className="text-gray-500 text-xs">{earning.time}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800">
                <span className="text-gray-400 text-xs">
                  {earning.type === 'order' ? 'Order Earnings' : 'Referral Bonus'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}