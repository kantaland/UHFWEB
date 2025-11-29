
import React from 'react';
import { PricingTier } from '../types';
import { Check, Lock, Unlock, Zap, Flame, Award, FileText } from './Icons';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (id: string) => void;
  onViewDetails?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSelect, onViewDetails }) => {
  // Determine color classes based on accent
  const colorMap = {
    lime: {
      border: 'border-lime-400/30 hover:border-lime-400',
      glow: 'shadow-[0_0_30px_rgba(163,230,53,0.1)] hover:shadow-[0_0_50px_rgba(163,230,53,0.3)]',
      text: 'text-lime-400',
      bg: 'bg-lime-400',
      button: 'bg-lime-400 hover:bg-lime-300 text-black',
      icon: <Zap className="w-6 h-6 text-lime-400" />
    },
    cyan: {
      border: 'border-cyan-400/30 hover:border-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_50px_rgba(34,211,238,0.3)]',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400',
      button: 'bg-cyan-400 hover:bg-cyan-300 text-black',
      icon: <Flame className="w-6 h-6 text-cyan-400" />
    },
    fuchsia: {
      border: 'border-fuchsia-500/30 hover:border-fuchsia-500',
      glow: 'shadow-[0_0_30px_rgba(217,70,239,0.1)] hover:shadow-[0_0_50px_rgba(217,70,239,0.3)]',
      text: 'text-fuchsia-500',
      bg: 'bg-fuchsia-500',
      button: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
      icon: <Award className="w-6 h-6 text-fuchsia-500" />
    }
  };

  const styles = colorMap[tier.accentColor];

  return (
    <div 
      className={`
        relative group flex flex-col p-8 rounded-2xl transition-all duration-300 transform
        glass-panel border-2 ${styles.border} ${styles.glow}
        ${tier.isLocked ? 'opacity-60 grayscale scale-95 cursor-not-allowed' : 'hover:-translate-y-2 hover:scale-105 cursor-pointer'}
        ${tier.recommended ? 'mt-0 lg:-mt-8 mb-0 lg:-mb-8 z-10 bg-zinc-900/90' : 'bg-black/60'}
      `}
      onClick={(e) => {
        // Only select if not locked and not clicking a specific button (handled separately)
        if (!tier.isLocked && (e.target as HTMLElement).tagName !== 'BUTTON') {
            onSelect(tier.id);
        }
      }}
    >
      {tier.recommended && !tier.isLocked && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-lime-400 to-cyan-400 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg z-20">
          Most Popular
        </div>
      )}

      {tier.isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm">
          <div className="text-center p-8 border border-zinc-600 bg-zinc-900 rounded-xl shadow-2xl">
            <Lock className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
            <h3 className="text-white font-bold uppercase tracking-widest text-base">Locked</h3>
            <p className="text-fuchsia-400 font-bold text-sm mt-2 uppercase tracking-wide">{tier.requirementText}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-lg bg-white/5 border border-white/10`}>
          {styles.icon}
        </div>
        {!tier.isLocked && <Unlock className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />}
      </div>

      <h3 className={`text-2xl font-black uppercase tracking-wide text-white mb-2 font-[Syne]`}>{tier.name}</h3>
      <p className="text-zinc-300 text-sm mb-6 min-h-[40px] leading-snug font-medium">{tier.subtitle}</p>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-base font-bold text-zinc-400 align-top mr-1">$</span>
          <span className={`text-5xl md:text-6xl font-black ${styles.text} tracking-tighter`}>{tier.price.toLocaleString()}</span>
        </div>
        <div className="text-zinc-300 text-sm font-bold mt-2 uppercase tracking-wide">
          for <span className="text-white text-base">{tier.capacity >= 1000000 ? `${tier.capacity / 1000000}M` : `${tier.capacity / 1000}k`}</span> {tier.capacityLabel}
        </div>
      </div>

      <div className="w-full h-px bg-white/20 mb-6"></div>

      <ul className="flex-1 space-y-4 mb-8">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${styles.text} mt-0.5`} />
            <span className="text-zinc-200 text-sm font-medium leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <button 
            disabled={tier.isLocked}
            onClick={() => onSelect(tier.id)}
            className={`
            w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all
            ${styles.button}
            shadow-lg hover:shadow-xl active:scale-95
            `}
        >
            {tier.isLocked ? 'Locked' : 'Activate Now'}
        </button>
        
        {onViewDetails && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails();
                }}
                className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
                <FileText className="w-4 h-4" /> View Protocol
            </button>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
