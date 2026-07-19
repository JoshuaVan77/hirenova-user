import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

export default function Language() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺' },
    { code: 'es', name: 'Español', flag: '🇸' },
    { code: 'ja', name: '日本語', flag: '🇵' },
    { code: 'ko', name: '한국어', flag: '🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮' },
  ];

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
          <h1 className="text-xl sm:text-2xl font-bold">Language</h1>
        </div>

        {/* Language List */}
        <div className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${
                index !== languages.length - 1 ? 'border-b border-gray-800' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white text-sm sm:text-base">{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && (
                <Check className="h-5 w-5 text-brand-secondary" />
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}