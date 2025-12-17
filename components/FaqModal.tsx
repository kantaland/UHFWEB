
import React from 'react';
import { X, HelpCircle, ShieldCheck, TrendingUp, DollarSign, Globe, Lock, AlertCircle } from './Icons';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: "1. Revenue & Streams",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "How do you guarantee the streams? Are they organic or playlist-driven?", a: "Streams are delivered exclusively via major-label Spotify distribution channels in Geo1 countries globally. We focus on sustainable, long-term engagement, not global scaling. Historical campaigns consistently hit projected stream targets." },
        { q: "How do clients verify streams and revenue?", a: "Clients verify all streams through their Spotify for Artists dashboard or their distributor backend, fully auditable." },
        { q: "Do you have historical data to show reliability?", a: "Yes. Campaigns across Geo1 countries for 1M-stream tests and larger catalogs consistently achieve projected streams, proving predictable performance." },
        { q: "How do you handle stream decay over time?", a: "Projections are conservative, designed to maintain long-term catalog yield rather than chasing short-term spikes. Even as individual tracks slow down, the overall catalog remains stable." }
      ]
    },
    {
      title: "2. Costs & Margins",
      icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "How is the $2,650–$2,700 per million streams calculated?", a: "Rates are structured for major-label Spotify campaigns in Geo1 countries, aligned with sustainable, predictable delivery." },
        { q: "What happens if streams fall short?", a: "Clients are billed only for streams delivered, ensuring costs align with actual performance." },
        { q: "Are there any hidden fees?", a: "No. All costs are per million streams delivered, fully transparent." }
      ]
    },
    {
      title: "3. Contracts & Rights",
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "Who owns the rights?", a: "Clients retain full IP ownership. Partial exits via SPVs share economic rights, while the underlying masters remain with the catalog owner." },
        { q: "Are partial exit agreements legally guaranteed?", a: "Yes. SPVs and holdco agreements are legally binding, compliant with Spotify rules and label contracts." }
      ]
    },
    {
      title: "4. Strategy & Delivery",
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "Why do you distribute campaigns across 100+ songs instead of focusing on hits?", a: "Spotify flags abnormal stream concentration on single tracks, which can lead to throttling or suspension. By distributing streams across 100+ songs plus the full catalog, we create natural listening patterns, preserving long-term sustainable revenue." },
        { q: "Can you scale to more countries?", a: "Our strategy focuses on Geo1 countries globally. This ensures high-value streams while maintaining compliance and minimizing risk of flags." },
        { q: "How many clients can you manage at once?", a: "Infrastructure supports 10+ major-label Spotify campaigns across Geo1 countries simultaneously, maintaining predictable and sustainable delivery." }
      ]
    },
    {
      title: "5. Risk & Compliance",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "How do you ensure compliance with Spotify?", a: "Campaigns are delivered via major-label Spotify channels, following all Spotify for Artists rules." },
        { q: "How do you prevent fraud or flags?", a: "By spreading activity across 100+ songs and Geo1 countries, we maintain natural listening behavior, reducing risk of algorithmic flags or suspensions." },
        { q: "Any prior takedowns?", a: "No — all campaigns are fully compliant with Spotify rules." }
      ]
    },
    {
      title: "6. Exit Strategy & Investor Returns",
      icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "How are catalog multiples calculated?", a: "Multiples (8–15×) are based on verified Spotify Geo1 royalties, projected long-term yield, and sustainable stream performance." },
        { q: "Can you show a partial exit case study?", a: "Selling 50% of a catalog at $9M upfront retains 50% yield (~$900K/year), yielding ~130% IRR over 5 years while maintaining sustainable Geo1 streams." },
        { q: "Expected timeline for liquidity?", a: "Partial exits: 1–3 months; full exits: 6–12 months, depending on buyer negotiations." }
      ]
    },
    {
      title: "7. Competitive Advantage",
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "How do you differ from playlist or marketing services?", a: "Unlike indie Spotify campaigns, which charge per submission and don’t guarantee streams, we deliver predictable, sustainable Spotify streams across 100+ songs in Geo1 countries, optimized for long-term catalog yield." },
        { q: "How do you maintain predictable cost per million streams?", a: "Optimized delivery through major-label Spotify Geo1 integration allows $2,650–$2,700 per million, ensuring profitability for investors." },
        { q: "Barriers to entry?", a: "Proprietary Geo1 Spotify strategies, major-label relationships, and compliance expertise create strong competitive moats." }
      ]
    },
    {
      title: "8. Reporting & Transparency",
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "What dashboards are provided?", a: "Clients verify streams via Spotify for Artists dashboard or their distributor backend, fully auditable." },
        { q: "Can streams be independently verified?", a: "Yes, all streams are traceable through Spotify Geo1 reporting." }
      ]
    },
    {
      title: "9. Tactical / Custom Questions",
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />,
      items: [
        { q: "Can you customize campaigns for specific artists or tracks?", a: "Yes, campaigns are tailored for catalog size, genre, or region while maintaining sustainable Geo1 delivery." },
        { q: "Are prices locked for multiple years?", a: "Annual contracts allow clients to lock per-million-stream rates, protecting against price increases." },
        { q: "Upsell opportunities?", a: "Higher-volume campaigns or exclusive early-release campaigns for major-label clients in Geo1 countries." }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/95 transition-opacity duration-300" onClick={onClose}></div>

      <div className="relative w-full h-full md:max-w-[1600px] md:h-[92vh] bg-black border border-white/10 flex flex-col animate-[fadeIn_0.3s_ease-out] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/10 flex justify-between items-center bg-[#050505] shrink-0 z-10">
            <div className="flex items-center gap-6">
                <div className="p-3 bg-white/5 border border-white/10">
                    <HelpCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-light uppercase tracking-wide text-white">System Intelligence</h2>
                    <p className="text-xs uppercase tracking-luxury text-gray-500 mt-1">Classified: Investor Grade Q&A</p>
                </div>
            </div>
            <button onClick={onClose} className="group flex items-center gap-2 px-4 py-2 hover:bg-white/5 transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Close Terminal</span>
                <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 scroll-smooth">
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-24 gap-y-24 max-w-[1400px] mx-auto">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <span className="p-2 bg-[#0a0a0a] border border-white/5">{section.icon}</span>
                            <h3 className="text-base font-bold uppercase tracking-[0.25em] text-white">{section.title}</h3>
                        </div>
                        <div className="space-y-12">
                            {section.items.map((item, i) => (
                                <div key={i} className="group pl-2">
                                    <h4 className="text-base font-medium uppercase tracking-wider text-white mb-4 leading-snug group-hover:text-emerald-400 transition-colors">
                                        <span className="text-emerald-500 font-bold mr-3 opacity-50 group-hover:opacity-100">Q.</span>
                                        {item.q}
                                    </h4>
                                    <div className="pl-8 border-l border-white/10 group-hover:border-emerald-500/30 transition-colors">
                                        <p className="text-base text-gray-200 font-normal leading-relaxed md:font-light md:text-gray-300 md:leading-loose">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Line Statement */}
            <div className="mt-32 pt-20 border-t border-white/10 text-center max-w-5xl mx-auto">
                <div className="inline-block px-4 py-2 border border-emerald-500/30 bg-emerald-900/10 mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Executive Summary</h4>
                </div>
                <p className="text-2xl md:text-3xl font-normal md:font-light text-white leading-relaxed tracking-wide">
                    “Our Spotify-only, Geo1 countries strategy delivers <span className="text-gray-400">sustainable, predictable streams</span> across 100+ songs, fully compliant with major-label requirements, creating investor-grade catalogs suitable for <span className="text-gray-400">partial exits or SPV structures</span>.”
                </p>
                
                <div className="mt-12 flex justify-center gap-12">
                     <div className="text-center">
                        <span className="block text-5xl font-light text-white mb-3">130%</span>
                        <span className="text-xs uppercase tracking-luxury text-gray-500">Target IRR</span>
                     </div>
                     <div className="w-px bg-white/10"></div>
                     <div className="text-center">
                        <span className="block text-5xl font-light text-white mb-3">Geo1</span>
                        <span className="text-xs uppercase tracking-luxury text-gray-500">Market Focus</span>
                     </div>
                </div>
            </div>

            <div className="h-20"></div> {/* Bottom Spacer */}
        </div>

        {/* Footer Bar */}
        <div className="p-6 border-t border-white/10 bg-[#050505] flex justify-between items-center shrink-0 z-10">
            <span className="text-xs text-gray-600 uppercase tracking-widest">Confidential • Authorized Personnel Only</span>
            <span className="text-xs text-emerald-900/40 uppercase tracking-widest font-bold">Encrypted Connection</span>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;
