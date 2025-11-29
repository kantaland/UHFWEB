
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, ShieldCheck, TrendingUp, Users, Zap, Music, Wallet, AlertCircle, Building2, Globe, FileText, Check, Award, Lock } from './Icons';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Internal component for the Simulator logic
const EconomicsSimulator = () => {
  const [streams, setStreams] = useState(1000000); // Default 1M
  const [masterShare, setMasterShare] = useState(100); // Default 100%

  const lowRate = 0.003;
  const highRate = 0.005;

  const grossLow = streams * lowRate;
  const grossHigh = streams * highRate;

  const netLow = grossLow * (masterShare / 100);
  const netHigh = grossHigh * (masterShare / 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md">
      
      {/* Scenario Selection */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[1000000, 3000000, 10000000].map((val) => (
          <button
            key={val}
            onClick={() => setStreams(val)}
            className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${
              streams === val 
              ? 'bg-lime-500 text-black border-lime-500 shadow-[0_0_15px_rgba(163,230,53,0.3)]' 
              : 'bg-zinc-900 text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-white'
            }`}
          >
            {(val / 1000000)}M Pack
          </button>
        ))}
      </div>

      {/* Master Ownership Slider */}
      <div className="mb-6 px-1">
        <div className="flex justify-between items-end mb-2">
          <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Your Master Split</label>
          <span className={`text-base font-black font-mono ${masterShare === 100 ? 'text-lime-400' : 'text-white'}`}>
            {masterShare}%
          </span>
        </div>
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group border border-white/5">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-lime-500 to-cyan-500 transition-all duration-100"
            style={{ width: `${masterShare}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={masterShare}
            onChange={(e) => setMasterShare(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
          <span>Label Deal (15%)</span>
          <span>Independent (100%)</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/60 border border-white/5 rounded-lg p-3 text-center">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Min Est. Revenue</p>
          <p className="text-xl font-bold text-white tracking-tight">{formatCurrency(netLow)}</p>
        </div>

        <div className="bg-lime-900/10 border border-lime-500/20 rounded-lg p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-lime-400/5 animate-pulse"></div>
          <p className="text-[9px] text-lime-400/80 uppercase tracking-widest font-bold mb-1 relative z-10">Max Potential</p>
          <p className="text-xl font-bold text-lime-400 tracking-tight relative z-10">
            {formatCurrency(netHigh)}
          </p>
        </div>
      </div>
    </div>
  );
};

const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "The Unfair Advantage",
      subtitle: "Institutional Access",
      icon: <Building2 className="w-6 h-6 text-lime-400" />,
      content: (
        <div className="flex flex-col h-full justify-center">
          <div className="p-6 sm:p-8 bg-zinc-900 border border-white/10 rounded-2xl relative overflow-hidden mb-6">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="w-32 h-32 text-white" />
             </div>
             
             <div className="space-y-6 relative z-10">
                <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">The Infrastructure</h4>
                    <p className="text-white text-xl sm:text-2xl font-bold leading-tight">
                        We don't "bot" streams. We rent the machine.
                    </p>
                </div>
                
                <div className="h-px w-full bg-white/10"></div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                        <p className="text-sm text-zinc-200"><strong>Parent Corp:</strong> Urban Hippy Fantasy (UHF)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <p className="text-sm text-zinc-200"><strong>Imprint:</strong> Kantaland Hollywood</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                        <p className="text-sm text-zinc-200"><strong>Tech Partner:</strong> AWAL / Sony Music UK</p>
                    </div>
                </div>
             </div>
          </div>
          <p className="text-center text-zinc-400 text-sm font-medium">
             You are accessing the same proprietary backend used for global priority artists.
          </p>
        </div>
      )
    },
    {
      title: "The Reality",
      subtitle: "Signal vs. Noise",
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 h-full content-center">
             <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-xl flex flex-col justify-center">
                <div className="mb-4 bg-red-500/10 w-fit p-2 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h4 className="font-black text-white text-lg mb-2">The Trap</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                    100,000+ songs are uploaded daily. Without initial velocity, you are mathematically invisible. The algorithm ignores "cold" uploads.
                </p>
             </div>

             <div className="bg-lime-900/20 border border-lime-500/20 p-6 rounded-xl flex flex-col justify-center">
                <div className="mb-4 bg-lime-500/10 w-fit p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-lime-400" />
                </div>
                <h4 className="font-black text-white text-lg mb-2">The Solution</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                    We inject trusted, whitelisted data. This bypasses the "source trust" filter, forcing the DSP to recognize your track as a priority.
                </p>
             </div>
        </div>
      )
    },
    {
      title: "The Engine",
      subtitle: "How It Works",
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      content: (
         <div className="grid grid-cols-1 gap-3 mt-4">
               <div className="flex items-center gap-4 p-4 bg-zinc-900/60 rounded-xl border border-white/10">
                  <div className="p-2 bg-cyan-500/10 rounded-lg shrink-0"><Globe className="w-6 h-6 text-cyan-400"/></div>
                  <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">Tier 1 Geo-Targeting</h4>
                     <p className="text-xs text-zinc-400 mt-1">We filter for High-GDP territories (USA, UK, DE, SE). No low-value spam traffic.</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 p-4 bg-zinc-900/60 rounded-xl border border-white/10">
                  <div className="p-2 bg-lime-500/10 rounded-lg shrink-0"><Users className="w-6 h-6 text-lime-400"/></div>
                  <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">Real Hardware Agents</h4>
                     <p className="text-xs text-zinc-400 mt-1">Physical devices, not virtual emulators. 100% compliant with standard consumption patterns.</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 p-4 bg-zinc-900/60 rounded-xl border border-white/10">
                  <div className="p-2 bg-fuchsia-500/10 rounded-lg shrink-0"><TrendingUp className="w-6 h-6 text-fuchsia-400"/></div>
                  <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">Algorithmic Resonance</h4>
                     <p className="text-xs text-zinc-400 mt-1">High retention signals "Quality." This triggers Discover Weekly & Radio migration.</p>
                  </div>
               </div>
         </div>
      )
    },
    {
      title: "Safety Protocol",
      subtitle: "Adaptive Velocity",
      icon: <ShieldCheck className="w-6 h-6 text-lime-400" />,
      content: (
        <div className="space-y-4 mt-4 justify-center flex flex-col h-full">
            <p className="text-center text-zinc-300 text-sm font-medium mb-4 max-w-lg mx-auto">
                We don't burn your profile. We calibrate speed based on your current size.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/10 bg-zinc-900/80 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-lime-500/10 rounded-bl-full"></div>
                    <h4 className="font-bold text-lime-400 text-sm uppercase tracking-wider mb-2">Incubator Mode</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-3">&lt; 1,000 Listeners</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                        Streams are dripped over <strong>1-3 Months</strong>. Mimics a natural "sleeper hit" trajectory to avoid algorithmic flagging.
                    </p>
                </div>

                <div className="border border-white/10 bg-zinc-900/80 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full"></div>
                    <h4 className="font-bold text-cyan-400 text-sm uppercase tracking-wider mb-2">Accelerator Mode</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-3">&gt; 100,000 Listeners</p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                        High-velocity injection. We can safely deliver <strong>1M+ streams in 6 days</strong> for established profiles.
                    </p>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                <Lock className="w-3 h-3" /> Lifetime Non-Drop Guarantee
            </div>
        </div>
      )
    },
    {
      title: "The Investment",
      subtitle: "ROI Analysis",
      icon: <Wallet className="w-6 h-6 text-lime-400" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
            <div className="space-y-6">
                <div>
                    <h4 className="text-3xl sm:text-4xl font-black text-white font-[Syne]">$0.003</h4>
                    <p className="text-xs text-lime-400 font-bold uppercase tracking-wide">Cost Per Verified Listener</p>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-zinc-500 mt-0.5" />
                        <p className="text-xs text-zinc-300 leading-snug"><strong>High-Tier Royalties:</strong> Revenue generated offsets up to 60-100% of campaign cost.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-zinc-500 mt-0.5" />
                        <p className="text-xs text-zinc-300 leading-snug"><strong>Asset Valuation:</strong> 1M+ streams creates immutable social proof for bookings and deals.</p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <EconomicsSimulator />
            </div>
        </div>
      )
    },
    {
      title: "The Decision",
      subtitle: "Acquire The Asset",
      icon: <Award className="w-6 h-6 text-lime-400" />,
      content: (
        <div className="text-center flex flex-col justify-center h-full max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-[Syne] uppercase leading-tight mb-6">
                You are not buying streams.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">You are buying validation.</span>
            </h2>
            
            <p className="text-sm text-zinc-400 font-medium mb-8 leading-relaxed">
                The difference between a local artist and a global export is infrastructure. We have the machine. You have the music.
            </p>

            <button 
                onClick={onClose}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] flex items-center justify-center gap-3"
            >
                <Zap className="w-5 h-5 fill-black" /> Initiate Campaign
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-zinc-900 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] md:h-[600px]">
        
        {/* Left Sidebar (Navigation) - Fixed Width */}
        <div className="w-56 bg-black/50 border-r border-white/5 p-5 hidden md:flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar h-full">
            <div>
                <h3 className="text-xl font-black font-[Syne] uppercase tracking-tighter mb-6">
                    Pitch<span className="text-lime-400">Deck</span>
                </h3>
                <nav className="space-y-1">
                    {slides.map((slide, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`flex items-center gap-3 w-full text-left transition-all group py-3 px-3 rounded-lg ${currentSlide === idx ? 'bg-white/10 border border-white/5' : ''}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${currentSlide === idx ? 'bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)] scale-125' : 'bg-zinc-800 group-hover:bg-zinc-600'}`}></div>
                            <span className={`font-bold text-[10px] uppercase tracking-wider transition-colors truncate ${currentSlide === idx ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                {slide.title}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mt-4 border-t border-white/5 pt-4">
                UHF Corp / Kantaland
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] min-h-0">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors z-20 bg-black/20 rounded-full"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 flex flex-col justify-center">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-lime-400 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-lime-900/20 rounded border border-lime-500/20">
                                Step {String(currentSlide + 1).padStart(2, '0')}
                            </span>
                            <div className="md:hidden">
                                {slides[currentSlide].icon}
                            </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-[Syne] uppercase leading-none mb-1 tracking-tight">
                            {slides[currentSlide].title}
                        </h2>
                        <h3 className="text-sm sm:text-base text-zinc-400 font-bold uppercase tracking-wide">
                            {slides[currentSlide].subtitle}
                        </h3>
                    </div>
                    
                    <div className="animate-[slideUp_0.4s_ease-out]">
                        {slides[currentSlide].content}
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md z-10 shrink-0">
                <button 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={`flex items-center gap-2 uppercase text-[10px] font-bold tracking-widest transition-colors ${currentSlide === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white'}`}
                >
                    <ChevronLeft className="w-3 h-3" /> Back
                </button>
                
                <button 
                    onClick={handleAction}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg
                        ${currentSlide === slides.length - 1 
                            ? 'bg-white text-black hover:bg-zinc-200 hover:shadow-white/20' 
                            : 'bg-lime-400 hover:bg-lime-300 text-black hover:shadow-lime-400/20'}
                    `}
                >
                    {currentSlide === slides.length - 1 ? 'Close Deck' : 'Next Step'} 
                    {currentSlide !== slides.length - 1 && <ChevronRight className="w-3 h-3" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckModal;
