
import React from 'react';
import { PricingTier } from '../types';
import { Check, Lock, ChevronRight } from './Icons';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (id: string) => void;
  onViewDetails?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect }) => {
  // Map accents to subtle trim lines
  const accentColor = 
    tier.accentColor === 'lime' ? 'bg-[#a3e635]' : 
    tier.accentColor === 'cyan' ? 'bg-[#22d3ee]' : 
    'bg-[#d946ef]';

  const isLargeNumber = tier.price >= 100000;

  return (
    <div 
      className={`
        relative group p-6 sm:p-10 lg:p-12 transition-all duration-500 cursor-pointer
        border-b border-r border-white/5 bg-[#0a0a0a] hover:bg-[#111]
        flex flex-col justify-between min-h-[auto] md:min-h-[600px]
      `}
      onClick={() => !tier.isLocked && onSelect(tier.id)}
    >
      {/* Hover Trim Line */}
      <div className={`absolute top-0 left-0 w-full h-[1px] ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {tier.isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-[2px]">
          <div className="text-center">
            <Lock className="w-6 h-6 mx-auto mb-4 text-gray-500" />
            <span className="block text-xs font-bold uppercase tracking-luxury text-gray-500">Restricted</span>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-6 md:mb-8">
            <span className="text-xs font-bold uppercase tracking-luxury text-gray-500">{tier.capacityLabel}</span>
            {tier.recommended && <span className="text-[10px] font-bold uppercase tracking-luxury text-white border border-white/20 px-2 py-1">Standard</span>}
        </div>

        <h3 className="text-3xl md:text-3xl font-light uppercase tracking-widest text-white mb-3">{tier.name}</h3>
        <p className="text-gray-400 text-sm md:text-base font-light mb-8 md:mb-12 min-h-[auto] md:min-h-[56px] leading-relaxed">{tier.subtitle}</p>

        <div className="mb-10 md:mb-12">
            <div className="flex items-start gap-1">
                <span className="text-sm text-gray-500 mt-2">$</span>
                <span className={`font-light text-white tracking-tight ${isLargeNumber ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'}`}>
                    {tier.price.toLocaleString()}
                </span>
            </div>
            <div className="h-px w-full bg-white/10 mt-8 mb-8 md:mt-10 md:mb-10"></div>
            
            <ul className="space-y-5">
                {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm md:text-base text-gray-300 font-light leading-relaxed">{feature}</span>
                </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 md:border-none">
        <button 
            disabled={tier.isLocked}
            className={`
                w-full py-5 border border-white/20 text-white 
                text-xs font-bold uppercase tracking-luxury
                hover:bg-white hover:text-black hover:border-white
                transition-all duration-300 flex items-center justify-between px-6
                group-hover:border-white/40
            `}
        >
            <span>{tier.id === 'pack-entry' ? 'Initiate Protocol' : 'Select Configuration'}</span>
            <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
