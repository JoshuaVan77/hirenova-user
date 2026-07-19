import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, DollarSign, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function Order() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unfinished'); // 'unfinished' or 'completed'
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'unfinished') {
        const response = await api.get('/user/tasks/unfinished');
        setUnfinishedTasks(response.data.tasks || []);
      } else {
        const response = await api.get('/user/tasks/completed');
        setCompletedTasks(response.data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">My Orders</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-dark-card rounded-lg p-1 mb-6 border border-gray-800">
          <button
            onClick={() => setActiveTab('unfinished')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'unfinished' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <AlertCircle className="h-4 w-4" /> Unfinished
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'completed' 
                ? 'bg-brand-primary text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckCircle className="h-4 w-4" /> Completed
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'unfinished' ? (
              unfinishedTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No unfinished orders. Great job!</p>
                </div>
              ) : (
                unfinishedTasks.map((order) => (
                  <div key={order.id} className="bg-dark-card rounded-xl p-4 border border-red-500/30">
                    <div className="flex items-start gap-4 mb-3">
                      {/* ✅ Hotel Image Display */}
                      {order.hotel_image ? (
                        <img 
                          src={order.hotel_image} 
                          alt={order.hotel_name || 'Hotel'}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-700"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🏨</span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{order.hotel_name || 'Lucky Order Pending'}</h3>
                        <p className="text-sm text-gray-400">Task #{order.task_number}</p>
                      </div>
                      
                      <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-medium border border-red-500/20 flex-shrink-0">
                        Action Required
                      </span>
                    </div>
                    
                    <div className="bg-dark-bg rounded-lg p-3 space-y-2 mb-4 border border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Required Top-up:</span>
                        <span className="text-red-400 font-bold">${parseFloat(order.required_amount || order.amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Commission Reward:</span>
                        <span className="text-green-400 font-bold">+${parseFloat(order.commission || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/topup-form')}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" /> Top Up Now to Continue
                    </button>
                  </div>
                ))
              )
            ) : (
              completedTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No completed orders yet. Start matching tasks!</p>
                </div>
              ) : (
                completedTasks.map((task, index) => (
                  <div key={index} className="bg-dark-card rounded-xl p-4 border border-gray-800 flex items-center gap-4">
                    {task.hotel_image ? (
                      <img 
                        src={task.hotel_image} 
                        alt={task.hotel_name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🏨</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{task.hotel_name}</h3>
                      <p className="text-xs text-gray-400 mt-1">Task #{task.task_number}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(task.completed_at)}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-green-400 font-bold text-sm">+${parseFloat(task.commission).toFixed(2)}</p>
                      <span className="text-[10px] text-gray-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                        Completed
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
}