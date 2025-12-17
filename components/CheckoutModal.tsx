import React, { useState, useEffect } from 'react';
import { PricingTier } from '../types';
// Removed non-existent and unused Youtube icon from the imports below
import { X, Check, Lock, ChevronRight, FileText, Download, ShieldCheck, CreditCard, Copy, Globe } from './Icons';
import { jsPDF } from 'jspdf';

interface CheckoutModalProps {
  tier: PricingTier | null;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ tier, onClose }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'contract' | 'success'>('details');
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [errors, setErrors] = useState<{ website?: string; email?: string; policy?: string; distributor?: string; signature?: string; youtube?: string }>({});
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [signature, setSignature] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const [formData, setFormData] = useState({
    website: '',
    email: '',
    distributor: '',
    youtube: '',
    affiliateCode: ''
  });

  const protocolId = Math.random().toString(36).substring(2, 15).toUpperCase();

  useEffect(() => {
    if (tier) {
      setStep('details');
      setFormData({ website: '', email: '', distributor: '', youtube: '', affiliateCode: '' });
      setLoadingStatus('Initializing...');
      setErrors({});
      setAgreedToPolicy(false);
      setSignature('');
      setCopyFeedback(false);
    }
  }, [tier]);

  if (!tier) return null;

  const depositValue = tier.id === 'pack-entry' ? tier.price : (tier.id === 'pack-annual' ? 5400 : 53000);
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const getAgreementSections = () => {
    let scopeText = "";
    let deliveryText = "";
    let paymentText = "";

    if (tier.id === 'pack-entry') {
        scopeText = "resulting in the delivery of approximately one million (1,000,000) Spotify streams.";
        deliveryText = "Streams are expected to be delivered within an estimated 30–90 day window from campaign initiation.";
        paymentText = `Client agrees to pay the total contract value of $${tier.price.toLocaleString()} in full upon execution to secure allocation and initiate the service.`;
    } else if (tier.id === 'pack-annual') {
        scopeText = "resulting in the delivery of up to approximately twelve million (12,000,000) Spotify streams over the twelve (12) month term, with monthly pacing used solely for planning purposes and not as a strict monthly delivery obligation.";
        deliveryText = "Streams are expected to be delivered on a monthly basis over the 12-month agreement term. Performance shall be measured on a cumulative annual basis, not on a month-by-month basis.";
        paymentText = `Client agrees to pay the total contract value of $${tier.price.toLocaleString()}. A deposit of $${depositValue.toLocaleString()} is due upon execution to secure allocation and initiate the service.`;
    } else {
        scopeText = "resulting in the delivery of up to approximately one hundred twenty million (120,000,000) Spotify streams over the twelve (12) month term, with monthly pacing used solely for planning purposes and not as a strict monthly delivery obligation.";
        deliveryText = "Streams are expected to be delivered on a monthly basis over the 12-month agreement term. Performance shall be measured on a cumulative annual basis, not on a month-by-month basis.";
        paymentText = `Client agrees to pay the total contract value of $${tier.price.toLocaleString()}. A deposit of $${depositValue.toLocaleString()} is due upon execution to secure allocation and initiate the service.`;
    }

    return [
        {
            title: "1. SCOPE OF SERVICES",
            body: `Provider does not distribute, upload, host, modify, or control any sound recordings.\n\nAll recordings subject to this Agreement are pre-distributed and fully controlled by the Client through its selected distributor or major-label distribution system.\n\nProvider’s services are limited strictly to off-platform traffic facilitation and audience discovery activity directed toward the Client’s existing Spotify-distributed catalog, ${scopeText}`
        },
        {
            title: "2. DELIVERY WINDOW",
            body: `${deliveryText}`
        },
        {
            title: "3. PAYMENT TERMS",
            body: `${paymentText}\n\nOnce campaign initiation has occurred, all payments are strictly non-refundable.`
        }
    ];
  };

  const handleCopyConfig = () => {
    const configStr = `Protocol: ${tier.name}\nID: ${protocolId}\nEntity: ${formData.website}\nYouTube: ${formData.youtube}`;
    navigator.clipboard.writeText(configStr);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: any = {};
    let hasError = false;
    
    if (!formData.website.includes('.') || formData.website.length < 5) { 
        newErrors.website = 'Valid Label Website required.'; 
        hasError = true; 
    }
    if (!formData.email.includes('@')) { newErrors.email = 'Valid email required.'; hasError = true; }
    if (!formData.distributor) { newErrors.distributor = 'Distributor required.'; hasError = true; }
    if (!formData.youtube.includes('youtube.com/') && !formData.youtube.includes('@')) { 
        newErrors.youtube = 'Valid YouTube link required.'; 
        hasError = true; 
    }
    if (!agreedToPolicy) { newErrors.policy = 'Agreement required.'; hasError = true; }

    if (hasError) { setErrors(newErrors); return; }
    
    setStep('processing');
    
    const sequence = [
        { text: `Analyzing Domain Authority...`, time: 1000 },
        { text: `Verifying Distribution Partner...`, time: 2500 },
        { text: 'Generating Service Agreement...', time: 4000 },
        { text: 'Finalizing Protocol...', time: 6000 }
    ];

    sequence.forEach(({ text, time }) => {
        setTimeout(() => setLoadingStatus(text), time);
    });

    setTimeout(() => {
        setStep('contract');
    }, 6500);
  };

  const handleSignContract = () => {
    if (signature.length < 3) {
        setErrors({ signature: 'Please sign your full name.' });
        return;
    }
    setStep('success');
  };

  const handleDownloadContract = () => {
    const doc = new jsPDF();
    const sections = getAgreementSections();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 30;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("URBAN HIPPY FANTASY", pageWidth / 2, y, { align: "center" });
    y += 15;
    
    doc.setFontSize(14);
    doc.text("PROTOCOL EXECUTION", pageWidth / 2, y, { align: "center" });
    y += 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Protocol ID: ${protocolId}`, margin, y);
    y += 10;
    doc.text(`Client Website: ${formData.website}`, margin, y);
    y += 10;
    doc.text(`YouTube Channel: ${formData.youtube}`, margin, y);
    y += 20;

    sections.forEach(s => {
      doc.setFont("helvetica", "bold");
      doc.text(s.title, margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      const body = doc.splitTextToSize(s.body, 170);
      doc.text(body, margin, y);
      y += (body.length * 6) + 10;
    });

    doc.save(`UHF_Agreement_${protocolId}.pdf`);
  };

  const handleProceedToPayment = () => {
    const links = {
        'pack-entry': 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5KT00357JY0333253NFBD7DA',
        'pack-annual': 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-6PG18869JV642600TNFBD5II',
        'pack-scale': 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-6V694153PN622930PNFBDZHQ'
    };
    window.open(links[tier.id as keyof typeof links] || '', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full h-full md:max-w-2xl md:max-h-[90vh] bg-[#050505] border border-white/20 flex flex-col animate-[fadeIn_0.3s_ease-out] shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 shrink-0 bg-[#050505] z-10">
            <h3 className="text-xl font-light uppercase tracking-wide text-white">
                {step === 'success' ? 'Protocol Ready' : step === 'contract' ? 'Execute Agreement' : 'Configuration'}
            </h3>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 relative">
            
            {step === 'success' ? (
              <div className="text-center py-4 md:py-8 space-y-8 pb-12">
                <div className="w-16 h-16 border border-emerald-500/50 flex items-center justify-center mx-auto rounded-none bg-emerald-900/20">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                
                <div>
                    <h3 className="text-3xl font-light text-white uppercase mb-2">Protocol Active</h3>
                    <p className="text-gray-500 text-sm tracking-widest font-mono uppercase">ID: {protocolId}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={handleDownloadContract}
                        className="flex-1 py-4 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button 
                        onClick={handleCopyConfig}
                        className="flex-1 py-4 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                        {copyFeedback ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copyFeedback ? 'Copied' : 'Clone Config'}
                    </button>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 text-left relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-50"><CreditCard className="w-4 h-4" /></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Execution Summary</p>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Protocol Tier</span>
                            <span className="text-white text-sm uppercase tracking-wider">{tier.name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Channel Link</span>
                            <span className="text-gray-400 text-sm truncate max-w-[150px]">{formData.youtube}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-white text-sm font-bold uppercase tracking-wider">Deposit Due</span>
                            <span className="text-emerald-500 text-2xl font-light tracking-tight">${depositValue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <button 
                    className="w-full py-6 bg-white hover:bg-emerald-400 text-black font-bold uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-4 group mt-8 shadow-xl" 
                    onClick={handleProceedToPayment}
                >
                     Proceed to Secure Checkout <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            ) : step === 'processing' ? (
              <div className="text-center py-24">
                <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white animate-pulse">{loadingStatus}</p>
              </div>

            ) : step === 'contract' ? (
                <div className="space-y-8 pb-12">
                    <div className="border border-white/10 bg-[#0a0a0a] p-6 h-64 overflow-y-auto font-mono text-[10px] text-gray-500 leading-relaxed custom-scrollbar">
                        <p className="mb-4 text-white font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                            PROTOCOL AGREEMENT: {protocolId}
                        </p>
                        <p className="mb-6">
                            <strong>Date:</strong> {currentDate}<br/>
                            <strong>Entity:</strong> {formData.website}<br/>
                            <strong>Channel:</strong> {formData.youtube}<br/>
                        </p>
                        {getAgreementSections().map((section, idx) => (
                             <div key={idx} className="mb-6">
                                <strong className="block mb-2 text-white">{section.title}</strong>
                                <p className="whitespace-pre-wrap">{section.body}</p>
                             </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Digital Signature</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#080808] border border-white/20 py-4 px-4 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                            placeholder="Type Full Name"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                        />
                        {errors.signature && <p className="text-red-500 text-xs">{errors.signature}</p>}
                    </div>

                    <button 
                        onClick={handleSignContract}
                        className="w-full py-5 bg-white hover:bg-emerald-400 text-black font-bold uppercase tracking-[0.2em] text-xs transition-colors flex items-center justify-center gap-4"
                    >
                        Execute Protocol <ShieldCheck className="w-4 h-4" />
                    </button>
                </div>

            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 pb-12">
                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Label / Entity Website</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-white/10 py-4 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors rounded-none placeholder-gray-800"
                            placeholder="www.yourdomain.com"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                        {errors.website && <p className="text-red-500 text-[10px] mt-2 uppercase">{errors.website}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">YouTube Channel URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-white/10 py-4 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors rounded-none placeholder-gray-800"
                            placeholder="youtube.com/@yourchannel"
                            value={formData.youtube}
                            onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                        />
                        {errors.youtube && <p className="text-red-500 text-[10px] mt-2 uppercase">{errors.youtube}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Major Distribution Partner</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-white/10 py-4 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors rounded-none placeholder-gray-800"
                            placeholder="Universal / Sony / Warner"
                            value={formData.distributor}
                            onChange={(e) => setFormData({...formData, distributor: e.target.value})}
                        />
                         {errors.distributor && <p className="text-red-500 text-[10px] mt-2 uppercase">{errors.distributor}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Corporate Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-transparent border-b border-white/10 py-4 text-base text-white focus:outline-none focus:border-emerald-500 transition-colors rounded-none placeholder-gray-800"
                            placeholder="management@entity.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                         {errors.email && <p className="text-red-500 text-[10px] mt-2 uppercase">{errors.email}</p>}
                    </div>
                </div>

                <div className="border border-white/10 p-6 bg-[#0a0a0a]">
                     <div className="flex items-start gap-4">
                        <input 
                            type="checkbox" 
                            id="policy"
                            className="mt-1 w-5 h-5 rounded-none border-white/30 bg-transparent focus:ring-0 checked:bg-emerald-500"
                            checked={agreedToPolicy}
                            onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        />
                        <label htmlFor="policy" className="text-[11px] text-gray-500 leading-relaxed cursor-pointer select-none uppercase tracking-widest">
                            I verify 100+ active catalog songs and major distribution. I agree to the non-refundable protocol terms.
                        </label>
                     </div>
                     {errors.policy && <p className="text-red-500 text-[10px] mt-3 ml-9 uppercase">{errors.policy}</p>}
                </div>

                <button 
                    type="submit" 
                    className="w-full py-5 bg-white hover:bg-emerald-400 text-black font-bold uppercase tracking-[0.2em] text-xs transition-colors flex items-center justify-center gap-4"
                >
                    Submit Configuration <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
