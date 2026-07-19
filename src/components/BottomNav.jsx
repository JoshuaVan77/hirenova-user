import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, ClipboardList, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/order', icon: ClipboardList, label: 'Order' },
    { path: '/trade', icon: TrendingUp, label: 'Trade' },
    { path: '/service', icon: MessageCircle, label: 'Service' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-gray-800 px-2 py-2 sm:px-6 sm:py-3 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors ${
                isActive ? 'text-brand-secondary' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive ? 'fill-brand-secondary/20' : ''}`} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}