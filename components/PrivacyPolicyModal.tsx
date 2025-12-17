import React from 'react';
import { X } from './Icons';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full h-full md:max-w-4xl md:h-[800px] bg-black border border-white/10 flex flex-col animate-[fadeIn_0.3s_ease-out] shadow-2xl">
        
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#050505] z-10 shrink-0">
            <h2 className="text-xl md:text-2xl font-light uppercase tracking-wide text-white">Privacy & Terms</h2>
            <button onClick={onClose}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
        </div>

        <div className="p-6 md:p-16 overflow-y-auto space-y-10 md:space-y-12 pb-32 md:pb-16 custom-scrollbar scroll-smooth">
            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">01. DATA HANDLING & CONFIDENTIALITY</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    Urban Hippy Fantasy employs strict data compartmentalization, access controls, and internal safeguards.
                    <br/><br/>
                    Client-provided information, including catalog metadata and campaign parameters, is processed solely for operational execution, eligibility validation, compliance review, and internal performance analysis.
                    <br/><br/>
                    Urban Hippy Fantasy:
                </p>
                <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5">
                    <li>Does not sell, rent, license, or monetize Client data</li>
                    <li>Does not disclose Client data to third parties, except where strictly necessary to perform the services through direct technological or distribution partners (including, without limitation, AWAL and Sony Music UK)</li>
                    <li>Does not access, store, or control Client distributor or DSP account credentials</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mt-4">
                    All data handling is conducted in accordance with applicable California privacy, business, and commercial regulations.
                </p>
            </section>

            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">02. SERVICE LIABILITY & NO REFUNDS</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    By submitting a campaign, executing a Service Agreement, or authorizing any services, the Client expressly acknowledges and agrees that:
                    <br/><br/>
                    Urban Hippy Fantasy is not responsible or liable for any actions taken by Spotify or any Digital Service Provider (DSP), including but not limited to:
                </p>
                <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5 mb-4">
                    <li>Content reviews, throttling, adjustments, removals, or takedowns</li>
                    <li>Account, catalog, or track-level flagging or suspension</li>
                    <li>Algorithmic behavior, reporting delays, reconciliation, or metric variance</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    The Client represents and warrants that it owns or controls 100% of the master recording rights, or otherwise has full legal authority to authorize the services.
                </p>
                 <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5 mb-4">
                    <li>All delivered metrics (including streams, listeners, and engagement activity) constitute final service outputs</li>
                    <li>No refunds, reversals, credits, or chargebacks are permitted once capital allocation, campaign initiation, or service execution has commenced, regardless of outcome, platform behavior, DSP decisions, or Client preference</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    The Client assumes all risk associated with its catalog, distribution relationships, and DSP compliance.
                </p>
            </section>

            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">03. LIMITATION OF LIABILITY</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    To the maximum extent permitted by law:
                    <br/><br/>
                    Urban Hippy Fantasy’s total aggregate liability arising out of or related to any services shall not exceed the total fees actually paid by the Client under the applicable agreement.
                    <br/><br/>
                    In no event shall Urban Hippy Fantasy be liable for:
                </p>
                 <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5 mb-4">
                    <li>Indirect, incidental, consequential, punitive, or special damages</li>
                    <li>Loss of revenue, royalties, profits, goodwill, reputation, or business opportunity</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    Client agrees that its sole and exclusive remedy for any claim shall be limited to the amount paid for the specific services giving rise to the claim.
                </p>
            </section>

             <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">04. JURISDICTION & ARBITRATION</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    These Terms and all related agreements shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict-of-law principles.
                    <br/><br/>
                    Any dispute, claim, or controversy arising out of or relating to these Terms or the services shall be resolved exclusively through binding arbitration conducted in Los Angeles County, California.
                    <br/><br/>
                    The parties expressly waive:
                </p>
                 <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5 mb-4">
                    <li>Any right to a jury trial</li>
                    <li>Any right to participate in class, collective, or representative actions</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    Arbitration shall be the sole and exclusive forum for dispute resolution.
                </p>
            </section>

            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">05. NON-AFFILIATION</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    Urban Hippy Fantasy is not affiliated with, endorsed by, or acting on behalf of Spotify, any DSP, distributor, record label, publisher, or rights organization.
                    <br/><br/>
                    Nothing in these Terms shall be construed as creating any partnership, agency, joint venture, fiduciary, or employment relationship.
                </p>
            </section>

            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">06. CONFIDENTIALITY</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    Client agrees to maintain strict confidentiality regarding:
                </p>
                 <ul className="space-y-3 text-gray-500 text-sm md:text-base font-normal md:font-light list-disc pl-5 mb-4">
                    <li>Urban Hippy Fantasy’s methodologies, systems, strategies, and processes</li>
                    <li>Pricing structures, service frameworks, and operational models</li>
                </ul>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    Disclosure to any third party without prior written consent is strictly prohibited.
                </p>
            </section>

            <section>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">07. SURVIVAL</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl">
                    Sections relating to payment obligations, no refunds, limitation of liability, confidentiality, arbitration, governing law, and non-affiliation shall survive completion, termination, or expiration of any services or agreements.
                </p>
            </section>

            <section className="pt-4 md:pt-0">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-3 md:mb-4">08. CONTACT</h3>
                <p className="text-gray-300 md:text-gray-400 text-sm md:text-base font-normal md:font-light leading-relaxed max-w-3xl mb-4">
                    For inquiries regarding these Terms, Privacy Policy, or specific data compliance requests, please direct official correspondence to:
                </p>
                 <a href="mailto:aoi@urbanhippyfantasy.com" className="text-emerald-500 text-base md:text-lg font-medium md:font-light tracking-wider hover:text-white transition-colors border-b border-emerald-500/30 pb-1 block w-fit">
                    aoi@urbanhippyfantasy.com
                </a>
            </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;