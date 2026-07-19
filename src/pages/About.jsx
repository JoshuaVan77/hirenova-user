import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-24 pt-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">About Us</h1>
        </div>

        {/* Content */}
        <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-6 w-6 text-brand-secondary" />
            <h2 className="text-lg font-semibold">About HireNova</h2>
          </div>
          
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              HireNova is a leading global vacation rental platform, connects millions of travelers each month with unique places to stay across the world. From family-friendly homes to luxurious beachfront villas, HireNova helps travelers discover and book accommodations that suit their needs, preferences, and budgets.
            </p>
            <p>
              With over 2 million listings in 190 countries, HireNova provides access to entire homes, offering more privacy, space, and comfort than traditional hotel stays. Travelers rely on the HireNova website and app to plan unforgettable getaways, supported by trusted reviews and secure booking processes.
            </p>
            <p>
              As part of the Expedia Group (Nasdaq: EXPE), HireNova operates in multiple markets and languages, helping families and groups create lasting memories through hassle-free vacation planning and personalized travel experiences.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}