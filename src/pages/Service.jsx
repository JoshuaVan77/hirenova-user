import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import io from 'socket.io-client';

// ✅ FIXED: Socket connection setup - Production URL
const SOCKET_URL = 'https://hirenova-backend-production-32b1.up.railway.app';
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

// ✅ FIXED: Backend URL for images
const BACKEND_URL = 'https://hirenova-backend-production-32b1.up.railway.app';

export default function Service() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // ၁။ စာများကို Backend မှ ဆွဲယူခြင်း
  const fetchMessages = async () => {
    try {
      console.log('📥 Fetching messages...');
      const response = await api.get('/chat/messages');
      console.log('📥 Messages Response:', response.data);
      
      // ✅ FIXED: Better data handling
      const messagesData = response.data.messages || response.data.data || response.data || [];
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      console.error('Error Response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ၂။ Socket.io Setup (Real-time Chat အတွက်)
  useEffect(() => {
    console.log('🔌 Setting up socket connection...');
    
    // Connection status
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setConnected(true);
      
      if (user?.id) {
        socket.emit('join_user_room', user.id);
        console.log('👤 Joined user room:', user.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    const handleNewMessage = (data) => {
      console.log('📩 New message received:', data);
      
      // ✅ FIXED: Better data structure handling
      const newMessage = data.message || data;
      
      if (newMessage) {
        setMessages(prev => {
          // Don't add duplicate messages
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    // Component ပိတ်တဲ့အခါ Listener ကို ဖျက်ခြင်း
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('new_message', handleNewMessage);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  // ၃။ Message အသစ်တက်တိုင်း အောက်ဆုံးသို့ Scroll ချခြင်း
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ၄။ Image ရွေးချယ်ခြင်း
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        alert('Image size must be less than 5MB'); 
        return; 
      }
      if (!file.type.startsWith('image/')) { 
        alert('Please select a valid image file'); 
        return; 
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ၅။ Image ဖျက်ခြင်း
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
  };

  // ၆။ Message ပို့ခြင်း (FormData ြင့် Image အပါအဝင်)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    console.log('📤 Sending message:', { message, hasImage: !!selectedImage });

    const formData = new FormData();
    formData.append('message', message);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await api.post('/chat/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Message sent:', response.data);
      
      setMessage('');
      handleRemoveImage();
      
      // ✅ FIXED: Add message to UI immediately
      if (response.data.data) {
        setMessages(prev => [...prev, response.data.data]);
      } else if (response.data.message) {
        setMessages(prev => [...prev, response.data.message]);
      } else {
        await fetchMessages(); // Refresh if data structure is different
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error Response:', error.response?.data);
      alert('Failed to send message. Please try again.');
    }
  };

  // ၇။ Image ကို နှိပ်လိုက်ရင် New Tab ဖြင့် ဖွင့်ခြင်း
  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      // ✅ FIXED: Use production backend URL
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BACKEND_URL}${imageUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  // ၈။ Time Format ပြောင်းခြင်း
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white">
      {/* Header */}
      <div className="bg-dark-card border-b border-gray-800 p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Customer Support</h1>
          <p className="text-xs flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className={connected ? 'text-green-400' : 'text-red-400'}>
              {connected ? 'Online' : 'Connecting...'}
            </span>
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MessageCircle className="h-6 w-6 animate-pulse mr-2" /> 
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            // ✅ FIXED: Better message data extraction
            const messageText = msg.message || msg.content || msg.text || '';
            const imageUrl = msg.image_url || msg.imageUrl || msg.image || '';
            
            // ✅ CRITICAL FIX: Determine if message is from current user
            // Backend က "user" လို့ ပို့ရင် (သို့မဟုတ်) user ID ကိုက်ရင်
            const sender = msg.sender || msg.sent_by;
            const isFromUser = sender === 'user' || 
                              (user?.id && sender === user.id.toString()) ||
                              (user?.phone && sender === user.phone);
            
            // ✅ Debugging: Console မှာ ကြည့်ပါ
            console.log(' Message:', {
              id: msg.id,
              sender,
              isFromUser,
              userId: user?.id,
              userPhone: user?.phone
            });
            
            return (
              <div key={msg.id} className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  isFromUser
                    ? 'bg-brand-primary text-white rounded-br-none' 
                    : 'bg-dark-card border border-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {messageText && <p className="text-sm mb-2">{messageText}</p>}
                  
                  {imageUrl && (
                    <div className="mb-2">
                      <img 
                        src={imageUrl.startsWith('http') ? imageUrl : `${BACKEND_URL}${imageUrl}`}
                        alt="Shared" 
                        className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(imageUrl)}
                      />
                    </div>
                  )}
                  
                  <p className={`text-[10px] ${isFromUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(msg.created_at || msg.createdAt || msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="bg-dark-card border-t border-gray-800 p-3">
          <div className="relative inline-block">
            <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg border border-gray-700" />
            <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-dark-card border-t border-gray-800 p-4 sticky bottom-0">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageSelect} 
          className="hidden" 
          id="image-upload" 
        />
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => document.getElementById('image-upload').click()}
            className="text-gray-400 hover:text-brand-secondary p-2 transition-colors"
            title="Send image"
          >
            <Image className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-dark-input border border-gray-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
          
          <button 
            type="submit"
            disabled={!message.trim() && !selectedImage}
            className="bg-brand-secondary hover:bg-brand-primary text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}