import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api'; // refreshUser အတွက် api instance ကို တိုက်ရိုက်သုံးပါမယ်

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ App စဖွင့်တဲ့အချိန်မှာ LocalStorage ကနေ User Data ကို ပြန်ဆွဲယူပါမယ်
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Data ပျက်စီးနေရင် ဖျက်ပစ်ပါမယ်
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ 1. Register Function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { 
        success: true, 
        message: response.data?.message || 'Registration successful!' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please check your details.' 
      };
    }
  };

  // ✅ 2. Login Function
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      // Token နဲ့ User Data ကို သိမ်းဆည်းပါမယ်
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { 
        success: true, 
        message: response.data?.message || 'Login successful!' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials. Please try again.' 
      };
    }
  };

  // ✅ 3. Refresh User Data Function (Balance အပြောင်းအလဲရှိရင် အသုံးပြုရန်)
  const refreshUser = async () => {
    try {
      const response = await api.get('/user/profile');
      const latestUser = response.data?.user || response.data;
      
      setUser(latestUser);
      localStorage.setItem('user', JSON.stringify(latestUser));
      
      return latestUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Token သက်တမ်းကုန်သွားရင် Logout လုပ်ပစ်ပါမယ်
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // ✅ 4. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Login page သို့ ပြန်ပို့ပါမယ် (Optional: Component ထဲမှာ navigate လုပ်တာ ပိုကောင်းပါတယ်)
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom Hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}