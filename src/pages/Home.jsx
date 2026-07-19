import { useNavigate } from 'react-router-dom';
import { Briefcase, HeadphonesIcon, HelpCircle, Info } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Background Images for each menu item
  const menuItems = [
    { 
      title: 'Trade', 
      icon: Briefcase, 
      path: '/trade',
      bgImage: 'https://png.pngtree.com/thumb_back/fh260/background/20241026/pngtree-stock-market-trading-graph-economy-3d-illustration-financial-flow-of-graphs-image_16458544.jpg'
    },
    { 
      title: 'Service', 
      icon: HeadphonesIcon, 
      path: '/service',
      bgImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop'
    },
    { 
      title: 'Help', 
      icon: HelpCircle, 
      path: '/help',
      bgImage: 'https://img.magnific.com/free-vector/stylish-question-mark-sign-background-web-help-request_1017-58615.jpg?semt=ais_hybrid&w=740&q=80'
    },
    { 
      title: 'About Us', 
      icon: Info, 
      path: '/about',
      bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'
    },
  ];

  // Cryptocurrency Logos with SVG icons
  const partners = [
    { 
      name: 'BTC', 
      color: '#F7931A',
      delay: '0s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M22.6 12.2c.4-2.7-1.7-4.1-4.5-5.1l.9-3.7-2.3-.6-.9 3.6c-.6-.2-1.2-.3-1.8-.5l.9-3.6-2.3-.6-.9 3.7c-.5-.1-1-.3-1.5-.4l-3.2-.8-.6 2.5s1.7.4 1.7.4c.9.2 1.1.8 1.1 1.3l-1.1 4.4c.1 0 .2.1.3.1l-.3-.1-1.5 6.1c-.1.3-.4.8-1.2.6 0 0-1.7-.4-1.7-.4l-1.1 2.6 3 .8c.6.1 1.1.3 1.7.4l-.9 3.8 2.3.6.9-3.7c.6.2 1.2.3 1.8.5l-.9 3.6 2.3.6.9-3.8c3.9.7 6.8-.4 8-3.1 1-2.2-.1-3.5-2-4.3 1.4-.3 2.5-1.2 2.8-3zm-5 7c-.7 2.8-5.5 1.3-7.1.9l1.3-5.1c1.6.4 6.6 1.2 5.8 4.2zm.7-7.1c-.6 2.5-4.6 1.2-5.9.9l1.1-4.6c1.3.3 5.4.9 4.8 3.7z"/>
        </svg>
      )
    },
    { 
      name: 'ETH', 
      color: '#627EEA',
      delay: '0.3s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M15.9 2v8.6L8.6 15l7.3-13zM16.1 2v8.6l7.3 4.4-7.3-13zM15.9 16.5v6.9l-7.3-4.5 7.3-2.4zM16.1 16.5v6.9l7.3-4.5-7.3-2.4zM15.9 24.9v5.1l-7.3-10.2 7.3 5.1zM16.1 24.9v5.1l7.3-10.2-7.3 5.1z"/>
        </svg>
      )
    },
    { 
      name: 'USDT', 
      color: '#26A17B',
      delay: '0.6s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm4.8 21.6c-.6.6-1.4.8-2.4.8h-4.8c-1 0-1.8-.2-2.4-.8-.6-.6-.8-1.4-.8-2.4V12h3.2v7.2h4.8V12h3.2v7.2c0 1-.2 1.8-.8 2.4z"/>
        </svg>
      )
    },
    { 
      name: 'BNB', 
      color: '#F3BA2F',
      delay: '0.9s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 2.5L25.5 9 16 13.5 6.5 9 16 4.5zM6 10.5l9 4.5v10.5L6 21V10.5zm11 15V15l9-4.5V21l-9 4.5z"/>
        </svg>
      )
    },
    { 
      name: 'SOL', 
      color: '#00FFA3',
      delay: '1.2s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M4 10h24v4H4v-4zm0 8h24v4H4v-4zm0-16h24v4H4V2z"/>
        </svg>
      )
    },
    { 
      name: 'ADA', 
      color: '#0033AD',
      delay: '1.5s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="16" cy="16" r="6" fill="currentColor"/>
        </svg>
      )
    },
    { 
      name: 'XRP', 
      color: '#23292F',
      delay: '1.8s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm4 20l-4-4.8-4 4.8H9.6l5.6-6.4L9.6 8h2.4l4 4.8L20 8h2.4l-5.6 6.4 5.6 6.4H20z"/>
        </svg>
      )
    },
    { 
      name: 'DOGE', 
      color: '#C2A633',
      delay: '2.1s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm6.4 20.8c-.8.8-2.4 1.6-4 1.6-3.2 0-5.6-2.4-5.6-5.6s2.4-5.6 5.6-5.6c1.6 0 3.2.8 4 1.6l-1.6 1.6c-.8-.8-1.6-.8-2.4-.8-1.6 0-2.4.8-2.4 2.4s.8 2.4 2.4 2.4c.8 0 1.6 0 2.4-.8l1.6 1.6z"/>
        </svg>
      )
    },
    { 
      name: 'DOT', 
      color: '#E6007A',
      delay: '2.4s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <circle cx="16" cy="6" r="4" fill="currentColor"/>
          <circle cx="16" cy="26" r="4" fill="currentColor"/>
          <circle cx="6" cy="16" r="4" fill="currentColor"/>
          <circle cx="26" cy="16" r="4" fill="currentColor"/>
        </svg>
      )
    },
    { 
      name: 'MATIC', 
      color: '#8247E5',
      delay: '2.7s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 2.5l9.5 5.5-9.5 5.5-9.5-5.5L16 4.5zM6 11l9 5v10l-9-5V11zm11 15V16l9-5v10l-9 5z"/>
        </svg>
      )
    },
    { 
      name: 'LTC', 
      color: '#345D9D',
      delay: '3s',
      svg: (
        <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-8 sm:h-8">
          <path fill="currentColor" d="M21.6 4H10.4L4 16l6.4 12h11.2l6.4-12-6.4-12zM16 24l-4-8h8l-4 8zm0-12l-2-4h4l-2 4z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner with Background Image - NO OVERLAY */}
        <div 
          className="w-full h-32 sm:h-48 lg:h-64 rounded-xl sm:rounded-2xl mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
          style={{
            backgroundImage: 'url("https://wallpapercave.com/wp/wp1846068.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* ✅ Animated Text: Slide In + Bounce + Gradient/Glow */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-center px-4 relative z-10 animate-slide-in">
            <span className="animate-text-fx">Welcome to HireNova</span>
          </h2>

          {/* Enhanced Floating Particles Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Menu Buttons with Background Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="relative p-3 sm:p-6 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform animate-fadeInUp overflow-hidden group"
                style={{ 
                  animationDelay: `${0.2 + index * 0.1}s`,
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Subtle Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                
                {/* Icon & Text */}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon className="h-8 w-8 sm:h-12 sm:w-12 text-white drop-shadow-md" />
                  <span className="text-white font-bold text-sm sm:text-base mt-2 drop-shadow-md">{item.title}</span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Partner Icons with Beautiful Animations */}
        <div className="bg-dark-card p-4 sm:p-6 rounded-xl border border-gray-800 overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 text-center font-semibold animate-glow">
            Our Partners
          </h3>
          
          {/* Enhanced Animated Partner Logos with 3D Effect */}
          <div className="relative flex flex-wrap justify-center items-center gap-3 sm:gap-5 overflow-hidden">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="flex flex-col items-center group"
                style={{
                  animationDelay: partner.delay
                }}
              >
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-125 hover:-translate-y-2 cursor-pointer animate-coin-bounce"
                  style={{
                    background: `linear-gradient(135deg, ${partner.color}, ${partner.color}cc)`,
                    boxShadow: `0 8px 25px ${partner.color}60, inset 0 2px 10px rgba(255,255,255,0.3)`,
                    color: 'white',
                    animationDelay: partner.delay,
                    animationDuration: '3s'
                  }}
                >
                  {partner.svg}
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-2 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

          {/* Enhanced Sliding Animation Background */}
          <div className="mt-6 relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-secondary to-transparent animate-slide-enhanced"></div>
          </div>
          
          {/* Additional Glow Line */}
          <div className="mt-2 relative h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse"></div>
        </div>

      </div>

      {/* Enhanced Custom CSS Animations */}
      <style>{`
        /* 1. Slide In Animation (ဘေးကနေ ရွေ့ဝင်လာခြင်း) */
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-100px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* 2. Gradient Animation (အရောင်ပြောင်းခြင်း) */
        @keyframes gradientMove {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        /* 3. Glow Pulse Animation (အလင်းထွက်ခြင်း) */
        @keyframes glowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.5)) drop-shadow(0 0 10px rgba(167, 139, 250, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(96, 165, 250, 0.9)) drop-shadow(0 0 30px rgba(167, 139, 250, 0.7));
          }
        }

        /* 4. Bounce Animation (ခုန်နေသလို) */
        @keyframes bounceText {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Other Existing Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(-15px); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(10px); opacity: 0.5; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes slide-enhanced {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes coin-bounce {
          0%, 100% { transform: translateY(0) rotateY(0deg); }
          25% { transform: translateY(-10px) rotateY(10deg); }
          50% { transform: translateY(0) rotateY(0deg); }
          75% { transform: translateY(-5px) rotateY(-5deg); }
        }

        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Animation Classes */
        .animate-slide-in {
          animation: slideIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-text-fx {
          display: inline-block;
          background: linear-gradient(90deg, #ffffff, #60a5fa, #a78bfa, #ffffff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: 
            gradientMove 4s linear infinite,
            glowPulse 2.5s ease-in-out infinite,
            bounceText 2s ease-in-out infinite;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float-particle {
          animation: float-particle 6s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2.5s ease-in-out infinite;
        }

        .animate-slide-enhanced {
          animation: slide-enhanced 4s linear infinite;
        }

        .animate-coin-bounce {
          animation: coin-bounce 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}