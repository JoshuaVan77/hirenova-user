import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import io from 'socket.io-client';

const SOCKET_URL = 'https://hirenova-backend-production-32b1.up.railway.app';
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

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

  const fetchMessages = async () => {
    try {
      console.log('📥 Fetching messages...');
      const response = await api.get('/chat/messages');
      const rawData = response.data.messages || response.data.data || response.data || [];
      
      const safeMessages = Array.isArray(rawData) ? rawData.map(msg => {
        // Admin သို့မဟုတ် User ဘာလဲဆိုတာ စစ်ဆေးခြင်း
        let sender = msg.sender || msg.sent_by || msg.sender_id;
        if (!sender) {
          if (msg.admin_id) sender = 'admin';
          else if (msg.user_id) sender = 'user';
          else sender = 'user';
        }
        return { ...msg, sender };
      }) : [];
      
      setMessages(safeMessages);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      if (user?.id) {
        socket.emit('join_user_room', user.id);
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    const handleNewMessage = (data) => {
      const newMessage = data.message || data;
      if (newMessage) {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, { ...newMessage, sender: newMessage.sender || 'admin' }];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append('message', message);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await api.post('/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage('');
      handleRemoveImage();
      
      const responseData = response.data.data || response.data.message;
      if (responseData) {
        const sentMessage = { 
          ...responseData, 
          sender: responseData.sender || 'user' 
        };
        setMessages(prev => [...prev, sentMessage]);
      } else {
        await fetchMessages();
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BACKEND_URL}${imageUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      {/* Header Section */}
      <div className="bg-[#121824] border-b border-gray-800 p-4 flex items-center gap-4 sticky top-0 z-10">
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

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <MessageCircle className="h-6 w-6 animate-pulse mr-2" /> Loading messages...
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
            const messageText = msg.message || msg.content || msg.text || '';
            const imageUrl = msg.image_url || msg.imageUrl || msg.image || '';
            const timestamp = msg.created_at || msg.createdAt || msg.timestamp;
            
            const currentUserId = user?.id || user?._id;
            const senderId = msg.sender;
            
            // စာပို့သူသည် လက်ရှိ User ဖြစ်ပါက ညာဘက်၊ Admin/Receiver ဖြစ်ပါက ဘယ်ဘက်
            const isFromCurrentUser = senderId === 'user' || 
                                     (currentUserId && String(senderId) === String(currentUserId));

            return (
              <div 
                key={msg.id || Math.random()} 
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isFromCurrentUser 
                    ? 'bg-[#1e40af] text-white rounded-br-none' // Sender (ညာဘက် - အပြာရောင်)
                    : 'bg-[#1f2937] text-gray-200 rounded-bl-none' // Receiver (ဘယ်ဘက် - မီးခိုးရောင်)
                }`}>
                  {messageText && <p className="text-sm leading-relaxed mb-1">{messageText}</p>}
                  
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
                  
                  <p className={`text-[10px] text-right ${isFromCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(timestamp)}
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
        <div className="bg-[#121824] border-t border-gray-800 p-3">
          <div className="relative inline-block">
            <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg border border-gray-700" />
            <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-[#121824] border-t border-gray-800 p-4 sticky bottom-0">
        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" onClick={() => document.getElementById('image-upload').click()} className="text-gray-400 hover:text-blue-400 p-2 transition-colors">
            <Image className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#1f2937] border border-gray-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={!message.trim() && !selectedImage} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}