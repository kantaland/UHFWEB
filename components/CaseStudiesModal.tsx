
import React from 'react';
import { X, Building2 } from './Icons';

interface CaseStudiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudiesModal: React.FC<CaseStudiesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header with Imprint Branding */}
        <div className="p-6 border-b border-white/10 bg-zinc-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Building2 className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                        About
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black font-[Syne] text-white uppercase tracking-tighter">
                    URBAN HIPPY <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">FANTASY</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-zinc-400 tracking-wider">PARENT CORP OF</span>
                    <span className="text-sm font-black text-white tracking-widest">KANTALAND HOLLYWOOD</span>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors z-20"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-12 space-y-12 flex flex-col justify-center min-h-[300px]">
            
            {/* Mission Statement */}
            <section className="text-center space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">The Mission</h3>
                <p className="text-zinc-300 leading-relaxed text-sm sm:text-lg max-w-2xl mx-auto">
                    This promotion infrastructure operates under the KANTALAND HOLLYWOOD imprint. 
                    Our philosophy is simple: <span className="text-lime-400 font-bold">Give Back to Music.</span>
                </p>
                <div className="h-px w-24 bg-white/10 mx-auto"></div>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
                    For decades, Major Label promo tech was gated behind multi-million dollar deals. 
                    We have unlocked this infrastructure to democratize success, giving independent talent 
                    access to the same algorithmic triggers used by global superstars.
                </p>
            </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <p className="uppercase tracking-widest font-bold">© URBAN HIPPY FANTASY</p>
            <div className="flex gap-4">
                <span>All Rights Reserved</span>
                <span>Imprint: KANTALAND HOLLYWOOD / AWAL</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CaseStudiesModal;
