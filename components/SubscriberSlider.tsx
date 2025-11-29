
import React, { useEffect } from 'react';
import { Users, TrendingUp, Music, Award, AlertCircle, Check, ShieldCheck } from './Icons';
import { SongConfiguration } from '../types';

interface SubscriberSliderProps {
  value: number;
  onChange: (value: number) => void;
  songConfig: SongConfiguration;
  onSongConfigChange: (config: SongConfiguration) => void;
}

const SubscriberSlider: React.FC<SubscriberSliderProps> = ({ value, onChange, songConfig, onSongConfigChange }) => {
  const maxListeners = 100000;
  const percentage = Math.min((value / maxListeners) * 100, 100);
  
  const isBreakthrough = value >= 10000;
  const isElite = value >= 100000;

  let tierLabel = "Indie Artist";
  let tierColor = "text-zinc-500";
  let tierBorder = "border-zinc-700";
  let tierBg = "bg-zinc-800/50";

  if (isElite) {
    tierLabel = "Elite Status Unlocked";
    tierColor = "text-fuchsia-400";
    tierBorder = "border-fuchsia-500/50";
    tierBg = "bg-fuchsia-900/30";
  } else if (isBreakthrough) {
    tierLabel = "Breakthrough Unlocked";
    tierColor = "text-cyan-400";
    tierBorder = "border-cyan-500/50";
    tierBg = "bg-cyan-900/30";
  }

  // STRICT CATALOG DENSITY PROTOCOL
  useEffect(() => {
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let message = 'Optimal configuration.';
    
    if (value < 1000) {
        if (songConfig.count < 12) {
            status = 'danger';
            message = 'CRITICAL: Algorithm ignores empty profiles. You MUST have 12+ tracks to hold this traffic.';
        } else {
            status = 'safe';
            message = 'Foundation Verified: Catalog depth sufficient for initial injection.';
        }
    } else if (value < 25000) {
        if (songConfig.count < 8) {
            status = 'danger';
            message = 'RISK DETECTED: You cannot sustain this velocity on a skeleton catalog. Release more music (8+ Songs Required).';
        } else {
            status = 'safe';
            message = 'Growth Protocol Active: Healthy song rotation.';
        }
    } else if (value < 100000) {
        if (songConfig.count < 4) {
            status = 'warning';
            message = 'RETENTION WARNING: To reach 100k, you need 4+ active songs to capture repeat listeners.';
        } else {
            status = 'safe';
            message = 'Velocity Approved: Catalog is ready for scaling.';
        }
    } else {
        // 100k+
        status = 'safe';
        message = 'ELITE STATUS CONFIRMED: Single-song high-velocity strategy authorized.';
    }

    // Only update if something changed to prevent infinite loops
    if (songConfig.status !== status || songConfig.message !== message) {
        onSongConfigChange({ ...songConfig, status, message, isValid: status !== 'danger' });
    }

  }, [value, songConfig.count]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const adjustSongs = (delta: number) => {
    const newCount = Math.max(1, Math.min(50, songConfig.count + delta));
    onSongConfigChange({ ...songConfig, count: newCount });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-16 px-4">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-t border-white/20 shadow-2xl relative overflow-hidden group">
        
        {/* Decorative background glow */}
        <div className={`absolute -top-20 -right-20 w-40 sm:w-64 h-40 sm:h-64 rounded-full blur-3xl transition-all duration-700 ${isElite ? 'bg-fuchsia-500/20' : isBreakthrough ? 'bg-cyan-500/20' : 'bg-lime-500/10'}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-40 sm:w-64 h-40 sm:h-64 rounded-full blur-3xl transition-all duration-700 ${isElite ? 'bg-fuchsia-500/20' : isBreakthrough ? 'bg-cyan-500/20' : 'bg-lime-500/10'}`}></div>

        <div className="relative z-10">
            {/* Header Section: Adjusted Flex Layout for Responsive Fit */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="w-full md:w-auto">
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        <Music className="w-4 h-4" />
                        Client Monthly Listeners
                    </label>
                    <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-[Syne] tabular-nums tracking-tight break-all sm:break-normal">
                        {value >= 1000000 ? (value/1000000).toFixed(1) + 'M' : value.toLocaleString()} 
                        <span className="text-zinc-500 text-lg sm:text-xl md:text-2xl font-bold ml-2">/ mo</span>
                    </h3>
                </div>
            
                {/* Badge: Refined sizing to prevent overflow */}
                <div className={`
                    flex items-center gap-2 px-3 py-2 rounded-full border 
                    ${tierBg} ${tierBorder} ${tierColor}
                    transition-all duration-500 max-w-full
                `}>
                    {isElite ? <Award className="w-5 h-5 shrink-0" /> : <TrendingUp className="w-5 h-5 shrink-0" />}
                    <span className="font-bold text-xs sm:text-sm uppercase leading-none">
                        {tierLabel}
                    </span>
                </div>
            </div>

            <div className="relative h-10 flex items-center mb-10">
                {/* Track Background */}
                <div className="absolute w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                    {/* Progress Fill */}
                    <div 
                        className="h-full bg-gradient-to-r from-lime-500 via-cyan-500 to-fuchsia-500 transition-all duration-75 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {/* Slider Thumb (Visual Only - the input covers it) */}
                <div 
                    className="absolute h-8 w-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] border-4 border-black z-10 pointer-events-none transition-all duration-75 ease-out"
                    style={{ left: `calc(${percentage}% - 16px)` }} // Adjusted offset for mobile visual alignment
                ></div>

                {/* Markers */}
                <div className="absolute top-1/2 -translate-y-1/2 left-[10%] h-6 w-0.5 bg-zinc-600/50 z-0 pointer-events-none"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[50%] h-6 w-0.5 bg-zinc-600/50 z-0 pointer-events-none"></div>

                {/* Actual Range Input */}
                <input 
                    type="range" 
                    min="0" 
                    max={maxListeners} 
                    step="500" 
                    value={value} 
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 touch-none"
                    aria-label="Monthly listeners slider"
                />
            </div>
            
            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider relative h-6 -mt-8 mb-8">
                <span className="absolute left-0 text-lime-500">0</span>
                <span className={`absolute left-[10%] -translate-x-1/2 ${isBreakthrough ? 'text-cyan-400' : ''} transition-colors`}>10k</span>
                <span className={`absolute left-[50%] -translate-x-1/2`}>50k</span>
                <span className={`absolute right-0 ${isElite ? 'text-fuchsia-400' : ''} transition-colors`}>100k+</span>
            </div>

            {/* Song Configuration Panel */}
            <div className={`rounded-xl p-5 border transition-all duration-300 ${
                songConfig.status === 'danger' ? 'bg-red-900/20 border-red-500/50' : 
                songConfig.status === 'warning' ? 'bg-yellow-900/20 border-yellow-500/50' : 
                'bg-zinc-800/40 border-white/10'
            }`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-2">
                             <ShieldCheck className="w-3 h-3" /> Catalog Density Audit
                        </label>
                        <h4 className="text-white font-bold text-sm flex items-center gap-2">
                             Active Songs in Rotation
                        </h4>
                    </div>

                    <div className="flex items-center gap-4">
                         <button 
                            onClick={() => adjustSongs(-1)}
                            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-600 text-white hover:bg-zinc-700 flex items-center justify-center transition-colors shadow-lg active:scale-95 shrink-0"
                         >
                            -
                         </button>
                         <span className={`text-3xl font-black font-[Syne] tabular-nums w-12 text-center ${
                            songConfig.status === 'danger' ? 'text-red-500' : 
                            songConfig.status === 'warning' ? 'text-yellow-400' : 'text-white'
                         }`}>
                            {songConfig.count}
                         </span>
                         <button 
                            onClick={() => adjustSongs(1)}
                            className="w-10 h-10 rounded-full bg-white text-black font-bold hover:bg-zinc-200 flex items-center justify-center transition-colors shadow-lg active:scale-95 shrink-0"
                         >
                            +
                         </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
                     {songConfig.status === 'danger' ? <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> :
                      songConfig.status === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" /> :
                      <Check className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" />}
                     
                     <p className={`text-xs sm:text-sm font-bold leading-relaxed text-left ${
                        songConfig.status === 'danger' ? 'text-red-400' :
                        songConfig.status === 'warning' ? 'text-yellow-400' :
                        'text-zinc-300'
                     }`}>
                        {songConfig.message}
                     </p>
                </div>
            </div>

        </div>
      </div>
      
      <p className="text-center text-zinc-400 mt-6 text-xs sm:text-sm font-medium max-w-lg mx-auto px-4 leading-relaxed uppercase tracking-wider">
        Input <strong>client's</strong> current monthly listeners to calculate safe velocity.
      </p>
    </div>
  );
};

export default SubscriberSlider;
