import React, { useState } from 'react';
import { PricingTier, SongConfiguration } from './types';
import PricingCard from './components/PricingCard';
import RoiSimulator from './components/RoiSimulator';
import CheckoutModal from './components/CheckoutModal';
import PitchDeckModal from './components/PitchDeckModal';
import CaseStudiesModal from './components/CaseStudiesModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import FaqModal from './components/FaqModal';
import { Play, ChevronRight, ArrowRight } from './components/Icons';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] flex flex-col justify-center select-none pointer-events-none">
      <div className="absolute inset-0 bg-black"></div>
      <div className="flex flex-col gap-0 opacity-20 relative z-0 scale-110">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`flex whitespace-nowrap overflow-hidden ${i % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
            {[...Array(20)].map((_, j) => (
              <span key={j} className="text-[12vh] md:text-[18vh] font-thin tracking-tighter text-white mr-12 leading-[0.85]">
                URBAN HIPPY FANTASY
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10"></div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10"></div>
    </div>
  );
};

function App() {
  const [currentListeners, setCurrentListeners] = useState<number>(50000);
  const [songConfig, setSongConfig] = useState<SongConfiguration>({ 
    count: 100, 
    isValid: true, 
    status: 'safe',
    message: 'Catalog Verified' 
  });
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showCaseStudies, setShowCaseStudies] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const tiers: PricingTier[] = [
    {
      id: 'pack-nano',
      name: 'Nano Protocol',
      subtitle: 'Entry-level stream acceleration.',
      capacity: 10000,
      capacityLabel: 'Streams',
      price: 30,
      accentColor: 'lime',
      isLocked: false,
      recommended: false,
      features: [
        '10,000 Streams Allocation',
        'Performance Validation',
        'Backend Compatibility',
        'Non-Recurring',
        'System Access'
      ]
    },
    {
      id: 'pack-micro',
      name: 'Micro Protocol',
      subtitle: 'Focused catalog momentum.',
      capacity: 50000,
      capacityLabel: 'Streams',
      price: 150,
      accentColor: 'cyan',
      isLocked: false,
      recommended: true,
      features: [
        '50,000 Streams Allocation',
        'Enhanced Velocity',
        'Algorithmic Warmup',
        'Non-Recurring',
        'Performance Support'
      ]
    },
    {
      id: 'pack-lite',
      name: 'Lite Protocol',
      subtitle: 'Strategic stream dominance.',
      capacity: 100000,
      capacityLabel: 'Streams',
      price: 300,
      accentColor: 'fuchsia',
      isLocked: false,
      features: [
        '100,000 Streams Allocation',
        'Catalog Dominance',
        'Priority Processing',
        'Non-Recurring',
        'Strategic Alignment'
      ]
    },
  ];

  const handleSelectTier = (id: string) => {
    const tier = tiers.find(t => t.id === id);
    if (tier) setSelectedTier(tier);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative selection:bg-white selection:text-black font-light overflow-x-hidden">
      
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
                <span className="text-xs md:text-sm font-medium tracking-luxury uppercase text-white group-hover:text-gray-300 transition-colors">
                  Urban Hippy Fantasy
                </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
                <button onClick={() => setShowCaseStudies(true)} className="text-xs font-bold uppercase tracking-luxury text-gray-500 hover:text-white transition-colors">About</button>
                <button onClick={() => setShowPrivacy(true)} className="text-xs font-bold uppercase tracking-luxury text-gray-500 hover:text-white transition-colors">Legal</button>
                <div className="h-3 w-px bg-white/20"></div>
                <button onClick={() => setShowPitchDeck(true)} className="text-xs font-bold uppercase tracking-luxury text-white border border-white/30 px-6 py-2.5 hover:bg-white hover:text-black transition-all duration-500 hover:border-white">
                    Protocol
                </button>
            </div>
            <button onClick={() => setShowPitchDeck(true)} className="md:hidden text-xs font-bold uppercase tracking-luxury border border-white/30 px-5 py-2.5 text-white">
                Protocol
            </button>
        </div>
      </nav>

      <section className="relative pt-24 md:pt-0 min-h-[90vh] md:h-screen flex flex-col justify-center border-b border-white/10 overflow-hidden">
         <HeroBackground />
         <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-full items-center">
            <div className="lg:col-span-8 flex flex-col justify-center pt-8 md:pt-0">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className="w-8 md:w-12 h-px bg-white"></div>
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Restricted Access System</span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-extralight uppercase tracking-tight leading-[0.95] mb-8 md:mb-12 text-white">
                   Catalog <br/>
                   <span className="font-normal text-gray-500">Acceleration</span>
                </h1>
                <p className="text-gray-300 text-base md:text-lg font-light max-w-lg leading-relaxed mb-12 tracking-wide border-l border-white/20 pl-6">
                    A closed acceleration system designed exclusively for <span className="text-white">Large Scale Catalogs (100+ Songs)</span>. 
                    We do not promote singles. We sustain backend velocity across your entire discography.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 mb-12 md:mb-0">
                    <button onClick={() => setShowPitchDeck(true)} className="group flex items-center gap-6 text-xs md:text-sm font-bold uppercase tracking-luxury text-white hover:text-gray-300 transition-colors">
                        <div className="w-14 h-14 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <Play className="w-4 h-4 fill-current" />
                        </div>
                        Discover Protocol
                    </button>
                </div>
            </div>
            <div className="lg:col-span-4 flex flex-col lg:justify-end pb-12 lg:pb-20">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 p-6 md:p-10 mb-[-1px]">
                    <h3 className="text-xs font-bold uppercase tracking-luxury text-gray-500 mb-6">Eligibility Matrix</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 text-sm md:text-base font-light text-white">
                            <div className="w-1.5 h-1.5 bg-white"></div> 100+ Active Songs
                        </li>
                        <li className="flex items-center gap-4 text-sm md:text-base font-light text-white">
                            <div className="w-1.5 h-1.5 bg-white"></div> Major Label Distribution
                        </li>
                        <li className="flex items-center gap-4 text-sm md:text-base font-light text-white">
                             <div className="w-1.5 h-1.5 bg-white"></div> Full Discography Only
                        </li>
                    </ul>
                </div>
                <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 p-6 md:p-10">
                    <h3 className="text-xs font-bold uppercase tracking-luxury text-gray-500 mb-6">Prohibited</h3>
                    <p className="text-sm font-light text-gray-400 leading-relaxed">
                        Single Song Campaigns, EP Only, Catalogs &lt; 100 Songs, DistroKid/Tunecore, Independent Self-Serve.
                    </p>
                </div>
            </div>
         </div>
      </section>

      <section className="bg-[#080808] border-b border-white/10 py-20 md:py-32">
        <div className="max-w-[1920px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <span className="block text-xs font-bold uppercase tracking-luxury text-gray-500 mb-3">01 — Financial Simulation</span>
                    <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white">Projected Returns</h2>
                </div>
            </div>
            <RoiSimulator initialStreams={currentListeners} songConfig={songConfig} onSongConfigChange={setSongConfig} />
        </div>
      </section>

      <section className="bg-[#050505] py-20 md:py-32">
        <div className="max-w-[1920px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <span className="block text-xs font-bold uppercase tracking-luxury text-gray-500 mb-3">02 — Execution</span>
                    <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white">Select Protocol</h2>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-white/10">
              {tiers.map((tier) => (
                <PricingCard key={tier.id} tier={tier} onSelect={handleSelectTier} />
              ))}
            </div>
        </div>
      </section>

      <footer className="bg-white text-black py-16 md:py-24 px-6">
        <div className="max-w-[1920px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="space-y-8">
                    <h3 className="text-xl md:text-2xl font-medium tracking-luxury uppercase">Urban Hippy Fantasy</h3>
                    <div className="flex flex-wrap gap-8 text-xs font-bold uppercase tracking-[0.15em]">
                        <button onClick={() => setShowCaseStudies(true)} className="hover:text-gray-500 transition-colors">About</button>
                        <button onClick={() => setShowPrivacy(true)} className="hover:text-gray-500 transition-colors">Privacy Policy</button>
                        <button onClick={() => setShowPitchDeck(true)} className="hover:text-gray-500 transition-colors">Protocol</button>
                        <button onClick={() => setShowFaq(true)} className="hover:text-gray-500 transition-colors">System Intelligence</button>
                    </div>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest">© 2024 Registered S-Corp in California.</p>
                </div>
            </div>
        </div>
      </footer>

      <CheckoutModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
      <PitchDeckModal isOpen={showPitchDeck} onClose={() => setShowPitchDeck(false)} />
      <CaseStudiesModal isOpen={showCaseStudies} onClose={() => setShowCaseStudies(false)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <FaqModal isOpen={showFaq} onClose={() => setShowFaq(false)} />
    </div>
  );
}

export default App;