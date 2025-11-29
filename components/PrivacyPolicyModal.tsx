
import React from 'react';
import { X, ShieldCheck, Lock, FileText, Globe } from './Icons';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        <div className="p-6 border-b border-white/10 bg-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-lime-400" />
                <h2 className="text-xl font-bold font-[Syne] text-white uppercase tracking-wide">
                    Privacy & Terms
                </h2>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8 text-sm text-zinc-400 leading-relaxed">
            
            <section>
                <h3 className="text-white font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-zinc-500" /> 1. Data Handling Protocol
                </h3>
                <p>
                    <strong>Urban Hippy Fantasy Corp</strong> ("The Company") employs strict data compartmentalization. Client metadata submitted via the Artist Acceleration Ecosystem is processed solely for the purpose of algorithmic eligibility audits and campaign calibration. We do not sell, rent, or trade artist data to third parties outside of our direct technological partners (AWAL / Sony Music UK) required for service fulfillment.
                </p>
            </section>

            <section>
                <h3 className="text-white font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-500" /> 2. Service Liability
                </h3>
                <p className="mb-2">
                    By submitting a campaign for activation, the Client acknowledges:
                </p>
                <ul className="list-disc pl-5 space-y-1 marker:text-lime-500">
                    <li>The Company is not liable for Digital Service Provider (DSP) takedowns, strikes, or algorithmic flagging.</li>
                    <li>The Client warrants 100% ownership or control of all master recordings and publishing rights.</li>
                    <li>The Client agrees that all delivered metrics (streams, listeners) are final assets, and no refunds are issued once capital has been allocated to network partners.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-white font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-zinc-500" /> 3. International Compliance
                </h3>
                <p>
                    This service operates under the jurisdiction of the State of California. International clients agree to waive local consumer protection laws in favor of binding arbitration within Los Angeles County for any disputes arising from campaign performance or asset delivery.
                </p>
            </section>

             <div className="pt-6 border-t border-white/5 text-xs text-zinc-600">
                <p>Last Updated: November 2024</p>
                <p>Legal Counsel: Kantaland Hollywood Internal Affairs</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
