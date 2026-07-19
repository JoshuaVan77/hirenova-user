import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RefreshCw, AlertCircle, DollarSign, Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Trade() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  
  // Min Task Balance State
  const [minTaskBalance, setMinTaskBalance] = useState(30); 
  
  // Lucky Order Modal State
  const [showLuckyModal, setShowLuckyModal] = useState(false);
  const [luckyData, setLuckyData] = useState(null);
  const [isLuckyOrderActive, setIsLuckyOrderActive] = useState(false);

  // Order Modal State (First Modal - Regular Task)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Rating Modal State (Second Modal)
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState({
    description: 3,
    match: 3,
    cleanliness: 3,
    serviceQuality: 3
  });

  // ✅ Custom Insufficient Balance Modal State
  const [showBalanceAlert, setShowBalanceAlert] = useState(false);
  const [balanceAlertAmount, setBalanceAlertAmount] = useState(0);

  const forceRefreshUserData = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const fetchTodayTasks = async () => {
    setLoading(true);
    try {
      const [tasksRes, settingsRes] = await Promise.all([
        api.get('/user/tasks/today'),
        api.get('/settings')
      ]);
      
      const fetchedTasks = Array.isArray(tasksRes.data.tasks) ? tasksRes.data.tasks : [];
      setTasks(fetchedTasks);
      setCompletedCount(tasksRes.data.completedCount || 0);
      
      if (settingsRes.data?.settings?.min_task_balance) {
        setMinTaskBalance(parseFloat(settingsRes.data.settings.min_task_balance));
      }
      
      await fetchTodayEarnings();
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      alert('Failed to load tasks. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayEarnings = async () => {
    try {
      const response = await api.get('/user/tasks/earnings/today');
      if (response.data && response.data.totalEarnings !== undefined) {
        setTodayEarnings(parseFloat(response.data.totalEarnings));
      }
    } catch (error) {
      console.error('Error fetching today earnings:', error);
      setTodayEarnings(0);
    }
  };

  useEffect(() => {
    fetchTodayTasks();
    forceRefreshUserData();

    const handleFocus = () => {
      forceRefreshUserData();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleCompleteTask = async () => {
    if (completedCount >= 40) {
      alert('You have completed all 40 tasks for today! Come back tomorrow.');
      return;
    }

    const currentBalance = parseFloat(user?.balance || 0);
    if (currentBalance < minTaskBalance) {
      alert(`Insufficient balance! You need at least $${minTaskBalance} to start tasks. Please Top-up.`);
      navigate('/topup-form');
      return;
    }

    if (!tasks || tasks.length === 0) {
      alert('No tasks available. Please contact support.');
      return;
    }

    // 🧹 CRITICAL FIX: Reset ALL states before checking for a new task
    setIsLuckyOrderActive(false);
    setLuckyData(null);
    setCurrentTask(null);
    setShowLuckyModal(false);
    setShowOrderModal(false);
    setShowRatingModal(false);
    setShowBalanceAlert(false);
    setBalanceAlertAmount(0);

    const currentTaskIndex = completedCount;
    const task = tasks[currentTaskIndex];
    
    if (!task || !task.id) {
      console.error('❌ Current task is undefined or missing ID at index:', currentTaskIndex);
      alert('Task data is not available. Please refresh the page.');
      return;
    }

    try {
      console.log(`🔍 Checking Lucky Order for Task #${completedCount + 1}...`);
      
      const luckyCheck = await api.post('/user/tasks/check-lucky', {
        task_number: completedCount + 1
      });

      console.log('📡 Lucky Check Response:', luckyCheck.data);

      if (luckyCheck.data.isLuckyOrder) {
        console.log('🎰 LUCKY ORDER DETECTED!');
        
        const newLuckyData = {
          taskNumber: completedCount + 1,
          requiredAmount: parseFloat(luckyCheck.data.requiredAmount || luckyCheck.data.amount || 0),
          commission: parseFloat(luckyCheck.data.commission || 0),
          hotel_name: luckyCheck.data.hotel_name || task?.hotel_name || 'Lucky Hotel',
          hotel_image: luckyCheck.data.hotel_image || task?.hotel_image || '',
          task_id: luckyCheck.data.task_id || task?.id,
          // ✅ Backend က Top-up လုပ်ပြီးသားလား ဆိုတာ ပြန်ပို့ပေးရင် ဒီနေရာမှာ သုံးလို့ရအောင် ထည့်ထားသည်
          topUpCompleted: luckyCheck.data.topUpCompleted || false 
        };
        
        console.log('💾 Saving Lucky Data:', newLuckyData);
        
        setLuckyData(newLuckyData);
        setIsLuckyOrderActive(true);
        setShowLuckyModal(true);
        return; 
      } else {
        console.log('✅ Regular Task (No Lucky Order)');
      }
    } catch (error) {
      console.error('Lucky check failed, proceeding with regular task', error);
    }

    // Regular Task Flow
    setCurrentTask(task);
    setIsLuckyOrderActive(false);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async () => {
    setShowOrderModal(false);
    setRatings({ description: 3, match: 3, cleanliness: 3, serviceQuality: 3 });
    setShowRatingModal(true);
  };

  // ✅ STRICT LUCKY ORDER ENFORCEMENT
  const handleRatingSubmit = async () => {
    const currentBalance = parseFloat(user?.balance || 0);
    const requiredAmount = isLuckyOrderActive 
      ? parseFloat(luckyData?.requiredAmount || 0) 
      : parseFloat(currentTask?.order_amount || 0);
    
    console.log('🔍 STRICT SUBMISSION CHECK:', {
      isLuckyOrderActive,
      currentBalance,
      requiredAmount,
      topUpCompleted: luckyData?.topUpCompleted,
      willBlock: isLuckyOrderActive && requiredAmount > 0 && !luckyData?.topUpCompleted
    });

    // ✅ RULE: If it's a Lucky Order AND the required top-up hasn't been completed, BLOCK it.
    // ဒါမှ User က Lucky Order တိုင်းမှာ Top-up မလုပ်မချင်း Task မပြီးနိုင်တော့ဘူး။
    if (isLuckyOrderActive && requiredAmount > 0 && !luckyData?.topUpCompleted) {
      console.log('🚫 BLOCKING: Lucky Order requires Top-up. Showing alert.');
      setShowRatingModal(false);
      setBalanceAlertAmount(requiredAmount);
      setShowBalanceAlert(true);
      return; // ⛔ Backend ကို လုံးဝ မပို့ဘူး ဒီနေရာမှာ ရပ်မယ်
    }
    
    // ✅ Balance လုံလောက်ရင် (သို့မဟုတ်) Regular Task ဆိုရင် Submit လုပ်မယ်
    console.log('✅ Proceeding with submission');
    setSubmitting(true);
    try {
      await submitTaskToBackend(
        currentTask, 
        isLuckyOrderActive, 
        isLuckyOrderActive ? requiredAmount : 0
      );
      
      // ✅ Reset states after successful submission
      setShowRatingModal(false);
      setCurrentTask(null);
      setIsLuckyOrderActive(false);
      setLuckyData(null);
      setRatings({ description: 3, match: 3, cleanliness: 3, serviceQuality: 3 });
      
    } catch (error) {
      console.error('❌ Submit Error:', error);
      alert(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const submitTaskToBackend = async (task, isLucky, luckyAmount) => {
    try {
      const response = await api.post('/user/tasks/submit', {
        task_id: task.id,
        task_number: completedCount + 1,
        order_amount: isLucky ? luckyAmount : parseFloat(task.order_amount || 0),
        commission: isLucky ? (luckyData?.commission || 0) : parseFloat(task.commission || 0),
        is_lucky_order: isLucky ? 1 : 0,
        lucky_order_amount: isLucky ? luckyAmount : 0,
        ratings: ratings
      });

      await forceRefreshUserData();
      setCompletedCount(response.data.completedCount);
      await fetchTodayEarnings();
      
    } catch (error) {
      console.error('❌ Submit Error:', error);
      alert(error.response?.data?.message || 'Failed to submit task');
      throw error;
    }
  };

  const handleLuckyAction = async () => {
    try {
      await api.post('/user/tasks/acknowledge-lucky', {
        task_number: luckyData.taskNumber
      });
    } catch (error) {
      console.error('Failed to acknowledge lucky order', error);
    }

    setCurrentTask({
      id: luckyData.task_id,
      hotel_name: luckyData.hotel_name,
      hotel_image: luckyData.hotel_image,
      order_amount: luckyData.requiredAmount,
      commission: luckyData.commission
    });
    
    setIsLuckyOrderActive(true);

    setShowLuckyModal(false);
    setRatings({ description: 3, match: 3, cleanliness: 3, serviceQuality: 3 });
    setShowRatingModal(true);
  };

  const handleStarClick = (category, rating) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const displayBalance = parseFloat(user?.balance || 0).toFixed(2);
  const progressPercentage = Math.min((completedCount / 40) * 100, 100);
  const expectedEarnings = ((completedCount / 40) * 100).toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" /> Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Account Balance */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6 relative overflow-hidden">
          <p className="text-gray-300 text-sm mb-1">Account Balance</p>
          <h2 className="text-3xl font-bold text-white">USDT {displayBalance}</h2>
          
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
            <p className="text-[10px] text-gray-300">Min. Required</p>
            <p className="text-sm font-bold text-green-400 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> {minTaskBalance}
            </p>
          </div>
        </div>

        {/* Transaction Introduction */}
        <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
          <h3 className="text-white font-semibold mb-2">Transaction Introduction</h3>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
            HireNova helps you earn rewards by completing hotel booking tasks. Simply click the order and the system automatically generates the order signature. Payments are made via USDT (TRC-20) or bank transfer. Each transaction earns a commission of 0.5%-1%, and the system randomly allocates high-reward orders.
          </p>
          
          {parseFloat(displayBalance) < minTaskBalance && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">
                Your current balance is below the minimum required amount (<span className="font-bold text-white">${minTaskBalance}</span>). Please Top-up to start matching tasks.
              </p>
            </div>
          )}
        </div>

        {/* Task Progress */}
        <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
          <div className="flex justify-between mb-4">
            <div className="text-center flex-1 border-r border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-400">40</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-gray-400 text-xs mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-400">{completedCount}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <button
            onClick={handleCompleteTask}
            disabled={submitting || completedCount >= 40 || tasks.length === 0 || parseFloat(displayBalance) < minTaskBalance}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-800"
          >
            {submitting ? (
              <><RefreshCw className="h-5 w-5 animate-spin" /> Processing...</>
            ) : completedCount >= 40 ? (
              <><AlertCircle className="h-5 w-5" /> All Tasks Completed</>
            ) : parseFloat(displayBalance) < minTaskBalance ? (
              <><AlertCircle className="h-5 w-5" /> Insufficient Balance (Min: ${minTaskBalance})</>
            ) : tasks.length === 0 ? (
              <><AlertCircle className="h-5 w-5" /> No Tasks Available</>
            ) : (
              <><Play className="h-5 w-5" /> Start Matching</>
            )}
          </button>
        </div>

        {/* Today's Earnings Summary */}
        <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-green-400">📈</span> Today's Earnings Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-input rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-xs mb-2">Expected Earnings</p>
              <p className="text-xl font-bold text-cyan-400">{expectedEarnings}%</p>
            </div>
            <div className="bg-dark-input rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-xs mb-2">Today's Earnings</p>
              <p className="text-xl font-bold text-green-400">{todayEarnings.toFixed(2)} USDT</p>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ Lucky Order Modal */}
      {showLuckyModal && luckyData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl p-6 max-w-md w-full border border-yellow-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Lucky Order Alert!</h3>
                <p className="text-gray-400 text-sm">Task #{luckyData.taskNumber}</p>
              </div>
            </div>

            {luckyData.hotel_image && (
              <img 
                src={luckyData.hotel_image} 
                alt={luckyData.hotel_name}
                className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-700"
              />
            )}
            <h4 className="text-lg font-bold text-white text-center mb-4">{luckyData.hotel_name}</h4>

            <div className="bg-dark-bg rounded-lg p-4 border border-gray-800 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Order Amount:</span>
                <span className="text-red-400 font-bold">${luckyData.requiredAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Balance:</span>
                <span className="text-white font-bold">${displayBalance}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-3">
                <span className="text-gray-400">Lucky Commission:</span>
                <span className="text-green-400 font-bold">+${luckyData.commission.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowLuckyModal(false);
                  setIsLuckyOrderActive(false);
                  setLuckyData(null);
                }} 
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleLuckyAction} 
                className={`flex-1 text-white font-bold py-3 rounded-lg transition-all ${
                  parseFloat(displayBalance) < luckyData.requiredAmount
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                    : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                }`}
              >
                {parseFloat(displayBalance) < luckyData.requiredAmount ? 'Top Up Now' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regular Order Modal */}
      {showOrderModal && currentTask && !isLuckyOrderActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              {currentTask.hotel_image && (
                <img 
                  src={currentTask.hotel_image} 
                  alt={currentTask.hotel_name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-white">{currentTask.hotel_name}</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Total Order Amount:</span>
                <span className="text-white font-bold">${parseFloat(currentTask.order_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Commission:</span>
                <span className="text-green-400 font-bold">+${parseFloat(currentTask.commission || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowOrderModal(false)} 
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={handleOrderSubmit} 
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all"
              >
                SUBMIT ORDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && currentTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Hotel Rating</h3>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {currentTask.hotel_image && (
              <img 
                src={currentTask.hotel_image} 
                alt={currentTask.hotel_name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-white font-semibold text-center mb-6">{currentTask.hotel_name}</p>

            <div className="space-y-4 mb-6">
              {['description', 'match', 'cleanliness', 'serviceQuality'].map((category) => (
                <div key={category}>
                  <p className="text-gray-400 text-sm mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleStarClick(category, star)} className="p-1">
                        <Star className={`h-6 w-6 ${star <= ratings[category] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRatingModal(false)} 
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={handleRatingSubmit}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'SUBMIT ORDER'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Custom Insufficient Balance Modal (Middle of Screen) */}
      {showBalanceAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl p-6 max-w-sm w-full border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Insufficient Balance</h3>
              </div>
            </div>

            <p className="text-gray-300 mb-6 text-center leading-relaxed">
              Your balance is too low. You need{' '}
              <span className="text-red-400 font-bold text-lg">${balanceAlertAmount.toFixed(2)}</span>{' '}
              to complete this Lucky Order.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowBalanceAlert(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowBalanceAlert(false);
                  navigate('/topup-form');
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                Top Up Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}