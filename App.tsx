
import React, { useState } from 'react';
import { PricingTier, SongConfiguration } from './types';
import PricingCard from './components/PricingCard';
import SubscriberSlider from './components/SubscriberSlider';
import CheckoutModal from './components/CheckoutModal';
import PitchDeckModal from './components/PitchDeckModal';
import CaseStudiesModal from './components/CaseStudiesModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import { Speaker, Play, Music, ShieldCheck } from './components/Icons';

function App() {
  const [currentListeners, setCurrentListeners] = useState<number>(5000);
  const [songConfig, setSongConfig] = useState<SongConfiguration>({ 
    count: 3, 
    isValid: true, 
    status: 'safe',
    message: 'Balanced distribution.' 
  });
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // New Simplified Tiers: Indie, Breakthrough, Elite
  const tiers: PricingTier[] = [
    {
      id: 'pack-indie',
      name: 'Indie Pack',
      subtitle: 'The essential kickstart for serious independent artists.',
      capacity: 1000000,
      capacityLabel: 'Streams',
      price: 3000,
      accentColor: 'lime',
      isLocked: false,
      recommended: false,
      features: [
        '1 Million Organic Streams',
        'Official Spotify Playlist Placement',
        'Algorithmic Triggering',
        'Monthly Listener Boost',
        '100% Royalties Eligible'
      ]
    },
    {
      id: 'pack-breakthrough',
      name: 'Breakthrough',
      subtitle: 'Technically enhanced scaling for breaking artists.',
      capacity: 3000000,
      capacityLabel: 'Streams',
      price: 9000, 
      accentColor: 'cyan',
      isLocked: currentListeners < 10000,
      requirementText: 'Requires 10k+ Listeners',
      recommended: true,
      features: [
        '3 Million Organic Streams',
        'Advanced Algorithmic Triggering',
        'High-Impact Editorial Pitching',
        'Top 5 Geos: US, CA, UK, DE, SE',
        '100% Royalties Eligible'
      ]
    },
    {
      id: 'pack-elite',
      name: 'Elite Status',
      subtitle: 'Total market saturation. Major label dominance.',
      capacity: 10000000,
      capacityLabel: 'Streams',
      price: 30000,
      accentColor: 'fuchsia',
      isLocked: currentListeners < 100000,
      requirementText: 'Requires 100k+ Listeners',
      features: [
        '10 Million Organic Streams',
        'Organic Monthly Listener Boost',
        'Dedicated Campaign Manager',
        'Top 5 Geos: US, CA, UK, DE, SE'
      ]
    },
  ];

  const handleSelectTier = (id: string) => {
    const tier = tiers.find(t => t.id === id);
    if (tier) setSelectedTier(tier);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-lime-400 selection:text-black">
      
      {/* Background Ambient Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-lime-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
      </div>

      <div className="relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 group cursor-pointer z-20">
            <div className="p-2 bg-white text-black rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
              <Speaker className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-[Syne] font-bold text-xl sm:text-2xl tracking-tighter">
              UHF
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-10 sm:pt-16 pb-12 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-300">Authorized Consultant Access</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-[Syne] leading-[0.95] sm:leading-[0.9] mb-8 uppercase tracking-tight break-words animate-[slideUp_0.5s_ease-out]">
            Artist Growth <br/>
            <span className="wild-gradient-text relative inline-block">
              Architect
              <Music className="absolute -top-3 -right-6 sm:-top-4 sm:-right-8 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-white opacity-50 rotate-12" />
            </span>
          </h1>
          
          <p className="text-zinc-300 max-w-xl mx-auto text-lg sm:text-xl leading-loose mb-12 px-2 animate-[slideUp_0.7s_ease-out]">
            Artist Acceleration Ecosystem. Review real-time metrics with the artist to identify eligibility for backend major label campaign.
          </p>

          <div className="flex justify-center mb-12 animate-[slideUp_0.9s_ease-out]">
             <button 
                onClick={() => setShowPitchDeck(true)}
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
             >
                <Play className="w-4 h-4 fill-black" /> Launch Presentation Mode
             </button>
          </div>
        </section>

        {/* Interactive Control */}
        <SubscriberSlider 
          value={currentListeners} 
          onChange={setCurrentListeners} 
          songConfig={songConfig}
          onSongConfigChange={setSongConfig}
        />

        {/* Pricing Grid */}
        <section className="px-4 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
              {tiers.map((tier) => (
                <PricingCard 
                  key={tier.id} 
                  tier={tier} 
                  onSelect={handleSelectTier}
                  onViewDetails={() => setShowPitchDeck(true)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 opacity-50 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                <span className="font-bold tracking-tight uppercase">URBAN HIPPY FANTASY</span>
              </div>
              
              {/* Footer Links */}
              <div className="flex items-center gap-6 mt-4 md:mt-0 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <button 
                  onClick={() => setShowCaseStudies(true)}
                  className="hover:text-lime-400 transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Privacy & Policy
                </button>
              </div>
            </div>

            <p className="text-zinc-600 text-[10px] md:text-xs max-w-md text-center md:text-right">
              © 2024 Urban Hippy Fantasy. Parent Company of Kantaland Hollywood (Imprint under AWAL / Sony Music UK). Registered in CA.
            </p>
          </div>
        </footer>

      </div>
      
      {/* Checkout Modal (Now Submission Modal) */}
      <CheckoutModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
      
      {/* Pitch Deck Modal */}
      <PitchDeckModal isOpen={showPitchDeck} onClose={() => setShowPitchDeck(false)} />

      {/* Case Studies (Now About) Modal */}
      <CaseStudiesModal isOpen={showCaseStudies} onClose={() => setShowCaseStudies(false)} />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}

export default App;
