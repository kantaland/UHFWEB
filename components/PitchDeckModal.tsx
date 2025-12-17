
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, ShieldCheck, Globe, BarChart3, Lock, Activity } from './Icons';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when slide changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  if (!isOpen) return null;

  // Refined FAQ Grid for better readability on mobile (text-base)
  const FaqGrid = ({ items }: { items: { q: string, a: string }[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10 md:gap-y-12">
        {items.map((item, idx) => (
            <div key={idx} className="group">
                <div className="flex items-start gap-4 mb-3">
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Q.</span>
                    <h4 className="text-white text-base md:text-sm lg:text-base font-medium uppercase tracking-wider leading-snug group-hover:text-emerald-400 transition-colors">
                        {item.q}
                    </h4>
                </div>
                <div className="pl-4 border-l-2 border-white/10 ml-2 group-hover:border-emerald-500/30 transition-colors">
                    <p className="text-gray-300 text-base md:text-sm lg:text-base font-light leading-relaxed">
                        {item.a}
                    </p>
                </div>
            </div>
        ))}
    </div>
  );

  const slides = [
    {
      title: "01. The Directive",
      subtitle: "Catalog Acceleration Protocol",
      content: (
        <div className="flex flex-col justify-center items-center text-center py-4 md:py-0">
            <div className="mb-8 md:mb-12 border border-emerald-500/30 bg-emerald-900/10 px-6 py-2 md:px-8 md:py-3">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Restricted Access • Geo1 Only</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light uppercase tracking-tighter text-white mb-8 md:mb-12 leading-none">
                Urban Hippy <br/><span className="text-gray-600">Fantasy</span>
            </h1>
            <div className="w-20 md:w-32 h-px bg-white mb-10 md:mb-16"></div>
            <p className="text-base md:text-xl font-light tracking-wide text-gray-200 max-w-3xl leading-relaxed">
                We convert stagnant music catalogs into <span className="text-white font-normal">high-yield financial assets</span> through sustainable, compliance-focused injection of velocity.
            </p>
        </div>
      )
    },
    {
      title: "02. Strategy",
      subtitle: "Geo1 & High Density",
      content: (
        <div className="space-y-10 md:space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="border border-white/10 p-6 md:p-10 bg-[#080808] hover:bg-[#0f0f0f] transition-colors group">
                     <div className="flex items-center gap-4 mb-4 md:mb-8">
                        <Globe className="w-6 h-6 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                        <h4 className="text-white font-bold uppercase text-sm tracking-[0.2em]">Geo1 Global Focus</h4>
                     </div>
                     <p className="text-gray-300 text-base md:text-base leading-relaxed mb-8">
                        We do not chase hollow global numbers. We target <strong>Tier 1 Markets (USA, UK, CA, AU, EU)</strong> exclusively via Major Label Spotify distribution.
                     </p>
                     <ul className="text-xs md:text-xs text-gray-400 uppercase tracking-widest space-y-4">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-500"></div> High RPM ($4.00+)</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-500"></div> Algorithm Sticky</li>
                     </ul>
                </div>
                <div className="border border-white/10 p-6 md:p-10 bg-[#080808] hover:bg-[#0f0f0f] transition-colors group">
                     <div className="flex items-center gap-4 mb-4 md:mb-8">
                        <div className="w-6 h-6 text-emerald-500 group-hover:text-emerald-400 transition-colors flex items-center justify-center font-bold text-lg">100</div>
                        <h4 className="text-white font-bold uppercase text-sm tracking-[0.2em]">The 100+ Song Rule</h4>
                     </div>
                     <p className="text-gray-300 text-base md:text-base leading-relaxed mb-8">
                        Spotify flags abnormal concentration on singles. By distributing velocity across <strong>100+ songs</strong>, we mimic natural listening patterns.
                     </p>
                     <ul className="text-xs md:text-xs text-gray-400 uppercase tracking-widest space-y-4">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-500"></div> Zero Flag Risk</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-500"></div> Catalog-Wide Lift</li>
                     </ul>
                </div>
            </div>
            <div className="border-t border-white/10 pt-10 md:pt-12">
                 <h4 className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-8 md:mb-10">Tactical Intelligence</h4>
                 <FaqGrid items={[
                    { q: "Why not focus on Hits?", a: "Single-track spikes trigger throttling. Broad distribution preserves long-term asset value." },
                    { q: "Can you scale globally?", a: "Our infrastructure focuses purely on Geo1 to ensure high-value, royalty-generating streams." }
                 ]} />
            </div>
        </div>
      )
    },
    {
      title: "03. Economics",
      subtitle: "Costs & Margins",
      content: (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 mb-12 md:mb-20">
                <div className="bg-black p-6 md:p-12 hover:bg-[#050505] transition-colors">
                    <span className="text-4xl md:text-6xl font-light text-white block mb-3 md:mb-4">$2,700</span>
                    <span className="text-xs font-bold uppercase text-emerald-500 tracking-[0.2em]">Cost Per Million Streams</span>
                </div>
                <div className="bg-black p-6 md:p-12 hover:bg-[#050505] transition-colors">
                    <span className="text-4xl md:text-6xl font-light text-white block mb-3 md:mb-4">100%</span>
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em]">Auditable Verification</span>
                </div>
                <div className="bg-black p-6 md:p-12 hover:bg-[#050505] transition-colors">
                    <span className="text-4xl md:text-6xl font-light text-white block mb-3 md:mb-4">0%</span>
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em]">Hidden Fees</span>
                </div>
            </div>

            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 md:mb-10 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Financial Queries
            </h4>
            <FaqGrid items={[
                { q: "How is the rate calculated?", a: "Rates align with major-label Geo1 delivery costs. We prioritize sustainability over cheap, low-retention traffic." },
                { q: "How do we verify?", a: "All streams are visible in your Spotify for Artists dashboard and Distributor backend. Fully transparent." },
                { q: "What if streams fall short?", a: "You are billed only for delivered streams. We align costs strictly with performance." },
                { q: "Do you handle decay?", a: "Projections are conservative. We build a 'floor' for the catalog, preventing sharp drop-offs." }
            ]} />
        </div>
      )
    },
    {
      title: "04. Risk & Compliance",
      subtitle: "Asset Protection",
      content: (
        <div className="space-y-10 md:space-y-16">
             <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-12 border border-white/10 bg-[#0a0a0a]">
                <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-emerald-500 shrink-0" />
                <div>
                    <h4 className="text-white text-base md:text-lg font-bold uppercase tracking-[0.2em] mb-4 md:mb-4">Major Label Compliance</h4>
                    <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-3xl">
                        We operate exclusively via Major Label distribution channels. All campaigns adhere strictly to Spotify for Artists Terms of Service.
                    </p>
                </div>
             </div>

             <div className="border-l-2 border-white pl-6 md:pl-10 ml-2 md:ml-4">
                <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8 md:mb-10">Security FAQ</h4>
                <div className="space-y-10 md:space-y-12">
                    <div>
                        <h5 className="text-white text-base md:text-lg font-bold uppercase mb-3 md:mb-3">How do you prevent fraud or flags?</h5>
                        <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-4xl">By spreading velocity across 100+ songs in Geo1 regions, we maintain natural listening behavior metrics (skip rate, save rate), nullifying algorithmic flags.</p>
                    </div>
                    <div>
                        <h5 className="text-white text-base md:text-lg font-bold uppercase mb-3 md:mb-3">Any Prior Takedowns?</h5>
                        <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-4xl">Zero. Our infrastructure is designed for asset preservation, not aggressive, risky growth.</p>
                    </div>
                    <div>
                        <h5 className="text-white text-base md:text-lg font-bold uppercase mb-3 md:mb-3">Who owns the rights?</h5>
                        <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-4xl">Client retains 100% IP ownership. We provide the velocity; you own the equity.</p>
                    </div>
                </div>
             </div>
        </div>
      )
    },
    {
      title: "05. The Exit",
      subtitle: "Liquidity Events",
      content: (
        <div className="space-y-12 md:space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 md:pb-12">
                <div className="mb-8 md:mb-0">
                    <h4 className="text-5xl md:text-7xl font-light text-white mb-3">130% IRR</h4>
                    <span className="text-xs font-bold uppercase text-emerald-500 tracking-[0.2em]">Projected 5-Year Return</span>
                </div>
                <div className="text-left md:text-right">
                    <h4 className="text-5xl md:text-7xl font-light text-white mb-3">8x — 15x</h4>
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-[0.2em]">Catalog Multiples (Geo1)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                <div>
                     <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500" /> The Strategy
                     </h4>
                     <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                        We force-feed value into the catalog to create a predictable yield curve. This allows for <strong className="text-white font-medium">Partial Exits (SPVs)</strong> where you sell 50% of the income stream while keeping the Masters.
                     </p>
                </div>
                <div>
                     <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-emerald-500" /> Structure
                     </h4>
                     <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
                        SPVs and HoldCo agreements are legally binding and fully compliant with Spotify royalty collection rules. 
                     </p>
                </div>
            </div>

            <div className="bg-[#111] p-6 md:p-10 border border-white/10">
                <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest block mb-4">Case Study</span>
                <p className="text-white text-base md:text-xl font-light leading-relaxed">
                    Selling 50% of a catalog at <strong>$9M upfront</strong> retains 50% yield (~$900K/year), yielding significant ROI while maintaining sustainable Geo1 streams. Liquidity timelines range from 1-3 months for partial exits.
                </p>
            </div>
        </div>
      )
    },
    {
      title: "06. Summary",
      subtitle: "The Bottom Line",
      content: (
        <div className="flex flex-col justify-center text-center">
            <div className="mb-12 md:mb-20">
                <h3 className="text-2xl md:text-6xl font-light text-white uppercase leading-tight tracking-tight mb-8 md:mb-12 max-w-5xl mx-auto">
                    "Investor-grade catalogs suitable for partial exits or SPV structures."
                </h3>
                <div className="w-full max-w-lg mx-auto h-px bg-white/20 mb-8 md:mb-12"></div>
                <p className="text-gray-300 text-base md:text-xl font-light leading-relaxed max-w-4xl mx-auto">
                    Our Spotify-only, Geo1 strategy delivers sustainable, predictable streams across 100+ songs, fully compliant with major-label requirements.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center max-w-6xl mx-auto">
                <div className="p-6 md:p-10 border border-white/5 hover:border-white/10 transition-colors bg-[#080808]">
                    <span className="block text-white font-bold text-xl md:text-2xl mb-2">Stop Failure</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Intervene before decay</span>
                </div>
                <div className="p-6 md:p-10 border border-white/5 hover:border-white/10 transition-colors bg-[#080808]">
                    <span className="block text-white font-bold text-xl md:text-2xl mb-2">Build Invisibly</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">No promo begging</span>
                </div>
                <div className="p-6 md:p-10 border border-white/5 hover:border-white/10 transition-colors bg-[#080808]">
                    <span className="block text-white font-bold text-xl md:text-2xl mb-2">Be Left Alone</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Automated Yield</span>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="w-full md:w-auto mx-auto px-16 py-6 mt-12 md:mt-20 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-emerald-400 hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
                Acknowledge & Close
            </button>
        </div>
      )
    }
  ];

  const handleAction = () => {
    if (currentSlide === slides.length - 1) {
        onClose();
    } else {
        setCurrentSlide((prev) => (prev + 1));
    }
  };

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/95 transition-opacity duration-300" onClick={onClose}></div>

      {/* Changed to fixed inset-0 on mobile to ensure full viewport coverage and eliminate scroll chaining issues */}
      <div className="fixed inset-0 md:relative md:w-full md:max-w-[1600px] md:h-[90vh] bg-black border border-white/10 flex flex-col md:flex-row shadow-2xl overflow-hidden md:inset-auto">
        
        {/* Sidebar Nav (Hidden on Mobile) */}
        <div className="hidden md:flex w-96 border-r border-white/10 p-10 flex-col bg-[#050505]">
            <div className="mb-12">
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em]">Confidential Protocol</span>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {slides.map((slide, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-full text-left py-5 px-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border-l-2 ${
                            currentSlide === idx 
                            ? 'border-emerald-500 text-white bg-white/5' 
                            : 'border-transparent text-gray-500 hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                        {slide.title}
                    </button>
                ))}
            </nav>
            <div className="mt-auto pt-10 border-t border-white/5">
                <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-relaxed">
                    Internal Use Only<br/>
                    Do Not Distribute
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative bg-[#0a0a0a] min-w-0 h-full w-full">
            
            {/* Mobile Progress Bar */}
            <div className="md:hidden w-full h-0.5 bg-gray-900 absolute top-0 left-0 right-0 z-40">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>

            {/* Mobile Header */}
            <div className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-5 md:px-12 shrink-0 bg-[#050505] z-30 relative">
                <div className="flex flex-col">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Step {String(currentSlide + 1).padStart(2, '0')}</span>
                     {/* Show title on mobile to give context since sidebar is hidden */}
                     <span className="md:hidden text-sm font-bold uppercase tracking-widest text-white mt-0.5 truncate max-w-[200px]">
                        {slides[currentSlide].title}
                     </span>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-gray-400 border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors md:border-none md:p-0 md:hover:bg-transparent md:hover:text-white"
                >
                    Close
                </button>
            </div>

            {/* Subliminal Back Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.02] z-0">
                 <div className="text-[80px] md:text-[200px] leading-none font-bold uppercase text-white tracking-tighter whitespace-nowrap rotate-90 md:rotate-0">
                    Stop Failure
                 </div>
            </div>

            {/* Main Content Area */}
            {/* Added -webkit-overflow-scrolling: touch for iOS momentum scrolling */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth -webkit-overflow-scrolling-touch"
            >
                 {/* CRITICAL FIX: Changed md:h-full to min-h-full to allow vertical expansion for tall content (like slide 4) */}
                 <div className="flex flex-col p-6 md:p-24 min-h-full md:justify-center">
                     <div className="w-full max-w-6xl mx-auto pb-24 md:pb-0">
                        {currentSlide !== 0 && (
                            <h2 className="text-2xl md:text-5xl font-light uppercase tracking-wide text-white mb-8 md:mb-16 border-l-2 border-emerald-500 pl-4 md:pl-8">
                                {slides[currentSlide].subtitle}
                            </h2>
                        )}
                        <div className="animate-[fadeIn_0.5s_ease-out]">
                            {slides[currentSlide].content}
                        </div>
                     </div>
                 </div>
            </div>

            {/* Footer Nav Controls */}
            {/* Changed height to min-h-[80px] and added py-4 to handle Safe Area on newer iPhones better without clipping */}
            <div className="min-h-[80px] border-t border-white/10 flex items-center justify-between px-6 md:px-12 bg-[#050505] shrink-0 z-30 relative pb-safe">
                <button 
                    onClick={prevSlide}
                    className={`flex items-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-[0.2em] p-4 -ml-4 ${currentSlide === 0 ? 'text-gray-800 cursor-not-allowed' : 'text-white hover:text-emerald-500 transition-colors'}`}
                    disabled={currentSlide === 0}
                >
                    <ChevronLeft className="w-5 h-5" /> Prev
                </button>
                
                {/* Mobile Slide Counter */}
                <div className="md:hidden text-[10px] uppercase tracking-luxury text-gray-500 font-bold">
                    {currentSlide + 1} / {slides.length}
                </div>

                <button 
                    onClick={handleAction}
                    className="flex items-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-emerald-500 transition-colors p-4 -mr-4"
                >
                    {currentSlide === slides.length - 1 ? 'Close' : 'Next'} <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckModal;
