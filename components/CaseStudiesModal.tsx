import React from 'react';
import { X, Building2, Linkedin, Globe, TrendingUp, Layers, Activity } from './Icons';

interface CaseStudiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudiesModal: React.FC<CaseStudiesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full h-full md:max-w-5xl md:h-[90vh] bg-black border border-white/10 flex flex-col animate-[fadeIn_0.3s_ease-out] shadow-2xl">
        
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#050505] z-10 shrink-0">
            <h2 className="text-2xl font-light uppercase tracking-wide text-white">Corporate Profile</h2>
            <button onClick={onClose}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
        </div>

        <div className="p-8 md:p-20 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Entity Section */}
            <div className="mb-20">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 block mb-4">Registered Entity</span>
                <h3 className="text-4xl md:text-6xl font-light uppercase tracking-tighter text-white mb-4">Urban Hippy Fantasy</h3>
                <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">Registered S-Corp in California</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-white/10 pt-16">
                
                {/* Thesis */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> Investment Thesis
                    </h4>
                    <p className="text-3xl font-light text-white leading-tight mb-8">
                        Give Back to Music — <span className="text-gray-500">Sustainably.</span>
                    </p>
                    <p className="text-gray-300 font-light leading-loose text-base mb-8">
                        For decades, major-label promotional infrastructure was gated behind multi-million-dollar commitments. We responsibly unlock this power for qualified catalogs.
                    </p>
                    <ul className="space-y-4 text-sm text-gray-400 font-medium tracking-wide uppercase">
                        <li className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-emerald-500 shrink-0"></div>
                            <span>Spotify-only catalog acceleration</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-emerald-500 shrink-0"></div>
                            <span>Geo1 market execution</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-emerald-500 shrink-0"></div>
                            <span>Long-term sustainability</span>
                        </li>
                    </ul>
                </div>

                {/* Founder */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500" /> Executive Profile
                    </h4>
                    <div className="mb-8">
                        <h5 className="text-2xl text-white font-light uppercase tracking-wide">Kanta Kudo</h5>
                        <span className="text-xs text-emerald-500 font-bold uppercase tracking-[0.2em] block mt-2">Founder & Managing Director</span>
                    </div>
                    <p className="text-gray-300 font-light leading-loose text-base mb-10">
                        A systems architect operating at the intersection of catalog strategy and distribution infrastructure. Founder of <strong className="text-white">KANTALAND</strong>, with deep operational experience within major-label frameworks including AWAL and Kobalt.
                    </p>
                    
                    <div className="flex gap-6">
                        <a href="https://www.linkedin.com/in/kanta-kudo-5b018785" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white transition-colors">
                            <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <Linkedin className="w-4 h-4" />
                            </div>
                            <span>Profile</span>
                        </a>
                        <a href="https://www.kantaland.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white transition-colors">
                            <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <Globe className="w-4 h-4" />
                            </div>
                            <span>Kantaland</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Strategy */}
            <div className="mt-20 pt-16 border-t border-white/10">
                <h4 className="text-sm font-bold text-white mb-10 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Layers className="w-5 h-5 text-emerald-500" /> Strategic Positioning
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0a0a] p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-emerald-500 font-bold text-xl block mb-4">01</span>
                        <p className="text-gray-300 text-base font-light leading-relaxed">Operates adjacent to, not inside, DSPs. Services only pre-distributed catalogs.</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-emerald-500 font-bold text-xl block mb-4">02</span>
                        <p className="text-gray-300 text-base font-light leading-relaxed">Targets institutional-grade clients (labels, rights holders) with annualized contracts.</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-emerald-500 font-bold text-xl block mb-4">03</span>
                        <p className="text-gray-300 text-base font-light leading-relaxed">Infrastructure-first approach ensuring scalable execution and predictable revenue.</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-emerald-500 font-bold text-xl block mb-4">04</span>
                        <p className="text-gray-300 text-base font-light leading-relaxed">No dependency on chart outcomes, virality, or short-term metrics.</p>
                    </div>
                </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-24 pt-10 border-t border-white/10">
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 block mb-3">Corporate Notice</span>
                 <p className="text-[11px] text-gray-500 leading-relaxed max-w-2xl font-light">
                    Urban Hippy Fantasy is a registered S-Corp in California and is not affiliated with, endorsed by, or acting on behalf of Spotify, AWAL, Kobalt, Sony Music, or any Digital Service Provider.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesModal;