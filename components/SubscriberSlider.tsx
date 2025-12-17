
import React, { useEffect } from 'react';
import { SongConfiguration } from '../types';
import { AlertCircle, Check } from './Icons';

interface SubscriberSliderProps {
  value: number;
  onChange: (value: number) => void;
  songConfig: SongConfiguration;
  onSongConfigChange: (config: SongConfiguration) => void;
}

const SubscriberSlider: React.FC<SubscriberSliderProps> = ({ value, onChange, songConfig, onSongConfigChange }) => {
  const maxListeners = 1000000;
  const percentage = Math.min((Math.sqrt(value) / Math.sqrt(maxListeners)) * 100, 100);

  // Status mapping
  const statusColor = value >= 500000 ? 'text-white' : value >= 100000 ? 'text-gray-300' : 'text-gray-500';
  const statusLabel = value >= 500000 ? 'Maximum Velocity' : value >= 100000 ? 'Accelerated Growth' : 'Standard Velocity';

  useEffect(() => {
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let message = 'Optimal configuration.';
    
    if (songConfig.count < 50) {
        status = 'danger';
        message = 'Ineligible: Minimum 100 songs required.';
    } else if (songConfig.count < 100) {
        status = 'warning';
        message = 'Risk Detected: Catalog density low.';
    } else {
        status = 'safe';
        message = 'Verified: Catalog density sufficient.';
    }

    if (songConfig.status !== status || songConfig.message !== message) {
        onSongConfigChange({ ...songConfig, status, message, isValid: status !== 'danger' });
    }
  }, [value, songConfig.count]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const adjustSongs = (delta: number) => {
    const newCount = Math.max(0, Math.min(500, songConfig.count + delta));
    onSongConfigChange({ ...songConfig, count: newCount });
  };

  return (
    <div className="w-full">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
                 <h3 className="text-6xl sm:text-7xl md:text-8xl font-thin text-white tracking-tighter tabular-nums leading-none">
                    {value >= 1000000 ? (value/1000000).toFixed(1) + 'M' : value >= 1000 ? (value/1000).toFixed(0) + 'k' : value} 
                 </h3>
                 <span className="text-xs font-bold uppercase tracking-luxury text-gray-500 mt-4 block">Monthly Listeners Target</span>
            </div>
            <div className="flex items-center gap-3 border border-white/20 px-5 py-3 self-start md:self-auto">
                <div className={`w-2 h-2 rounded-full ${value >= 100000 ? 'bg-white' : 'bg-gray-600'}`}></div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-luxury ${statusColor}`}>{statusLabel}</span>
            </div>
        </div>

        {/* The Slider Track */}
        <div className="relative h-20 flex items-center mb-16 md:mb-16 group cursor-pointer">
            {/* Base Track Line */}
            <div className="absolute w-full h-[1px] bg-white/20 group-hover:bg-white/30 transition-colors"></div>
            
            {/* Active Track Line */}
            <div 
                className="absolute h-[1px] bg-white transition-all duration-100 ease-linear"
                style={{ width: `${percentage}%` }}
            ></div>

            {/* Thumb */}
            <div 
                className="absolute h-6 w-6 bg-black border border-white z-10 transition-all duration-100 ease-linear hover:scale-125"
                style={{ left: `calc(${percentage}% - 12px)` }}
            ></div>

            <input 
                type="range" 
                min="1000" 
                max={maxListeners} 
                step="1000" 
                value={value} 
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
        </div>

        {/* Secondary Controls - Catalog Size */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
             <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
                <div className="text-left">
                    <span className="block text-xs font-bold uppercase tracking-luxury text-gray-500 mb-2">Catalog Density</span>
                    <span className="text-2xl md:text-3xl font-light text-white">{songConfig.count} Songs</span>
                </div>
                <div className="flex gap-px bg-white/10 border border-white/10">
                     <button onClick={() => adjustSongs(-10)} className="w-12 h-12 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors text-xl font-light">-</button>
                     <button onClick={() => adjustSongs(10)} className="w-12 h-12 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors text-xl font-light">+</button>
                </div>
             </div>

             <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                  {songConfig.status !== 'safe' ? <AlertCircle className="w-5 h-5 text-white" /> : <Check className="w-5 h-5 text-white" />}
                  <span className={`text-xs font-bold uppercase tracking-luxury ${songConfig.status === 'danger' ? 'text-white' : 'text-gray-400'}`}>
                    {songConfig.message}
                  </span>
             </div>
        </div>
    </div>
  );
};

export default SubscriberSlider;
