
import React, { useState, useEffect } from 'react';
import { PricingTier } from '../types';
import { 
  X, Check, Zap, AlertCircle, 
  TrendingUp, Award, Music, Users, ShieldCheck, Copy, ExternalLink, Lock,
  Loader2, Globe
} from './Icons';

interface CheckoutModalProps {
  tier: PricingTier | null;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ tier, onClose }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing secure connection...');
  const [errors, setErrors] = useState<{ url?: string; email?: string; policy?: string }>({});
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  
  const [formData, setFormData] = useState({
    url: '',
    email: '',
    affiliateCode: ''
  });

  // Reset state when tier changes or modal opens
  useEffect(() => {
    if (tier) {
      setStep('details');
      setFormData({ url: '', email: '', affiliateCode: '' });
      setLoadingStatus('Initializing...');
      setErrors({});
      setAgreedToPolicy(false);
    }
  }, [tier]);

  if (!tier) return null;

  const getPaymentLink = (tierId: string) => {
    if (tierId === 'pack-indie') return 'https://pci.jotform.com/form/250396091363155';
    if (tierId === 'pack-breakthrough') return 'https://pci.jotform.com/form/253318562941157';
    // Elite falls back to manual invoice
    return null;
  };

  const paymentLink = getPaymentLink(tier.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { url?: string; email?: string; policy?: string } = {};
    let hasError = false;

    // Spotify Validation (relaxed to allow text, but checks for 'spotify')
    if (!formData.url.toLowerCase().includes('spotify')) {
        newErrors.url = 'Please enter a valid Spotify Artist URL.';
        hasError = true;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        newErrors.email = 'A valid artist email is required.';
        hasError = true;
    }

    // Policy Validation
    if (!agreedToPolicy) {
        newErrors.policy = 'You must acknowledge the operational policy.';
        hasError = true;
    }
    
    if (hasError) {
        setErrors(newErrors);
        return;
    }
    
    setStep('processing');
    
    // Automated Email Submission via FormSubmit (Background)
    // Using aoi@urbanhippyfantasy.com as requested
    fetch("https://formsubmit.co/ajax/aoi@urbanhippyfantasy.com", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            _subject: `NEW SUBMISSION: ${tier.name} ($${tier.price})`,
            _template: "table",
            _captcha: "false", // Try false, if blocked, user must activate via email
            tier: tier.name,
            price: `$${tier.price}`,
            artist_url: formData.url,
            client_email: formData.email,
            consultant_name: formData.affiliateCode || "None Provided",
            status: "Pending Verification"
        })
    })
    .then(response => console.log("Background email attempt:", response.status))
    .catch(error => console.log("Background email failed:", error));

    // Simulation Sequence
    const sequence = [
        { text: 'Connecting to Spotify for Artists API...', time: 800 },
        { text: `Scanning Artist Profile...`, time: 2000 },
        { text: 'Analyzing Monthly Listener Trends...', time: 3500 },
        { text: 'Verifying Agency Credentials...', time: 4500 },
        { text: 'Validating Tier Eligibility...', time: 5500 },
        { text: 'Generating Placement Strategy...', time: 6500 },
        { text: 'Finalizing Application...', time: 7500 }
    ];

    sequence.forEach(({ text, time }) => {
        setTimeout(() => setLoadingStatus(text), time);
    });

    setTimeout(() => {
        setStep('success');
    }, 8000);
  };

  const handleManualEmail = () => {
    const subject = `ELITE VERIFICATION: ${tier.name} - ${formData.affiliateCode}`;
    const body = `
URGENT: NEW ELITE SUBMISSION

TIER: ${tier.name} ($${tier.price.toLocaleString()})
ARTIST URL: ${formData.url}
ARTIST EMAIL: ${formData.email}
CONSULTANT: ${formData.affiliateCode}

Requesting manual invoice and verification.
    `;
    window.location.href = `mailto:aoi@urbanhippyfantasy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyToClipboard = () => {
    const text = `
TIER: ${tier.name} ($${tier.price.toLocaleString()})
ARTIST: ${formData.url}
EMAIL: ${formData.email}
CONSULTANT: ${formData.affiliateCode || "N/A"}
    `;
    navigator.clipboard.writeText(text);
    alert("Order details copied to clipboard.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5 bg-zinc-900/50">
            <div>
                <h3 className="text-xl sm:text-2xl font-bold font-[Syne] uppercase tracking-wide flex items-center gap-2">
                    {step === 'success' ? (
                      <span className="text-lime-400">Submission Approved</span>
                    ) : (
                      <>
                        New Artist Submission
                        <ShieldCheck className="w-5 h-5 text-lime-400" />
                      </>
                    )}
                </h3>
                <p className="text-zinc-400 text-xs mt-1 font-medium">
                  {step === 'success' ? 'Ready for Activation' : `Qualify Artist for ${tier.name}`}
                </p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar">
            
            {/* Success State */}
            {step === 'success' ? (
              <div className="text-center py-4 animate-[fadeIn_0.5s_ease-out]">
                
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-lime-500 blur-xl opacity-20 rounded-full"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-zinc-800 to-black border border-lime-500/50 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Check className="w-10 h-10 text-lime-400" />
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-[Syne] text-white mb-2 uppercase tracking-tight">
                  Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Confirmed</span>
                </h3>
                
                <p className="text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
                    The artist profile has been validated. 
                    {paymentLink ? " Please proceed to the secure checkout to activate the campaign." : " Follow the instructions below for high-value activation."}
                </p>
                
                {paymentLink ? (
                   <div className="mb-8">
                      <a 
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(163,230,53,0.5)] flex items-center justify-center gap-3 text-sm sm:text-base mb-3 group"
                      >
                        Proceed to Secure Checkout <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        Secure Payment Portal • SSL Encrypted
                      </p>
                   </div>
                ) : (
                  <div className="bg-fuchsia-900/20 border border-fuchsia-500/20 rounded-xl p-6 mb-8 text-left">
                      <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
                         <Lock className="w-5 h-5" />
                         <span className="font-bold uppercase tracking-wider text-xs">High Value Transaction Protocol</span>
                      </div>
                      
                      <div className="text-zinc-300 text-xs leading-relaxed space-y-3 mb-6 font-medium">
                        <p>
                            For <strong className="text-white">Elite Status</strong> ($30,000), we require a secure Wire Transfer or Manual Invoice.
                        </p>
                        <p>
                            Please email <strong className="text-white">aoi@urbanhippyfantasy.com</strong> with the <strong>Track URL</strong> and <strong>Agent Name</strong>.
                        </p>
                        <p>
                            After verification, your priority agent will email you a secure invoice.
                        </p>
                      </div>

                      <button 
                        onClick={handleManualEmail}
                        className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold uppercase text-xs tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg mb-3"
                      >
                        <Copy className="w-4 h-4" /> Compose Verification Email
                      </button>
                      
                      <button 
                        onClick={copyToClipboard}
                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all"
                      >
                         Copy Details to Clipboard
                      </button>
                  </div>
                )}
                
                {paymentLink && (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-left">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Submission Summary</p>
                        <div className="flex justify-between items-center text-xs text-zinc-300 mb-1">
                            <span>Artist:</span>
                            <span className="font-mono text-white truncate max-w-[150px]">{formData.url}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-300">
                            <span>Email:</span>
                            <span className="font-mono text-white">{formData.email}</span>
                        </div>
                    </div>
                )}

              </div>
            ) : step === 'processing' ? (
              <div className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-white/10 border-t-lime-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Music className="w-8 h-8 text-lime-400 animate-pulse" />
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">Auditing Artist Metrics</h3>
                
                {/* Simulated Terminal Output */}
                <div className="h-8 flex items-center justify-center w-full max-w-xs">
                    <p className="text-lime-400/80 font-mono text-sm animate-pulse text-center">
                        {`> ${loadingStatus}`}
                    </p>
                </div>
                
                <p className="text-zinc-500 text-xs mt-8">
                    Accessing Major Label Backend...<br/>
                    Do not close this window.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 rounded-xl border border-white/10 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-black/40`}>
                      {tier.accentColor === 'lime' ? <Zap className="w-5 h-5 text-lime-400" /> : 
                       tier.accentColor === 'cyan' ? <TrendingUp className="w-5 h-5 text-cyan-400" /> : 
                       <Award className="w-5 h-5 text-fuchsia-400" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase text-zinc-400">Target Strategy</span>
                      <div className="font-bold text-white text-lg">{tier.name}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 animate-[slideIn_0.3s_ease-out]" noValidate>
                    
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-300 mb-2">
                            <Music className="w-4 h-4 text-lime-400" /> Artist Spotify URL
                        </label>
                        <input 
                            type="text" 
                            placeholder="https://open.spotify.com/artist/..."
                            className={`
                                w-full bg-black/50 border rounded-lg p-4 text-white placeholder-zinc-500 
                                focus:outline-none focus:ring-1 transition-all font-mono text-sm sm:text-base font-medium
                                ${errors.url ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-white/20 focus:border-lime-500/50 focus:ring-lime-500/50'}
                            `}
                            value={formData.url}
                            onChange={(e) => {
                                setFormData({...formData, url: e.target.value});
                                if (errors.url) setErrors({...errors, url: undefined});
                            }}
                        />
                        {errors.url ? (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1 animate-pulse">
                                <AlertCircle className="w-3 h-3" /> {errors.url}
                            </p>
                        ) : (
                            <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" /> Required for algorithm eligibility audit
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-300 mb-2">Artist Contact Email</label>
                        <input 
                            type="email" 
                            placeholder="artist@management.com"
                            className={`
                                w-full bg-black/50 border rounded-lg p-4 text-white placeholder-zinc-500 
                                focus:outline-none focus:ring-1 transition-all text-sm sm:text-base font-medium
                                ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-white/20 focus:border-lime-500/50 focus:ring-lime-500/50'}
                            `}
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({...formData, email: e.target.value});
                                if (errors.email) setErrors({...errors, email: undefined});
                            }}
                        />
                         {errors.email ? (
                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1 animate-pulse">
                                <AlertCircle className="w-3 h-3" /> {errors.email}
                            </p>
                        ) : (
                            <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                                Onboarding and strategy report will be sent here.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-300 mb-2">
                            <Users className="w-4 h-4 text-cyan-400" /> Consultant Full Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="ENTER FULL NAME"
                            className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm sm:text-base uppercase tracking-wider font-bold"
                            value={formData.affiliateCode}
                            onChange={(e) => setFormData({...formData, affiliateCode: e.target.value})}
                        />
                    </div>

                    {/* Operational Policy Section */}
                    <div className="bg-zinc-800/40 rounded-xl p-5 border border-zinc-700/50 space-y-4">
                        <div className="flex items-center gap-2 text-red-500 mb-1">
                            <AlertCircle className="w-5 h-5" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Strict Liability & Rights Policy</h4>
                        </div>
                        
                        <div className="text-xs sm:text-sm text-zinc-300 space-y-3 leading-relaxed font-medium">
                            <p>
                                <span className="text-white font-bold">1. Rights Verification:</span> The artist/label warrants that the song is <strong className="text-white">100% owned or controlled</strong>. Metadata must be correct and samples cleared.
                            </p>
                            <p>
                                <span className="text-white font-bold">2. Zero Liability for Removal:</span> We are <strong className="text-white">NOT responsible</strong> for any Spotify removals or flagging caused by metadata errors or uncleared samples.
                            </p>
                            <p>
                                <span className="text-white font-bold">3. No Refund Policy:</span> Promo activation triggers immediate payment to tech partners. <strong className="text-white">NO REFUNDS</strong> can be issued once funds are deployed.
                            </p>
                        </div>

                        <label className={`flex items-start gap-3 cursor-pointer group mt-2 pt-4 border-t border-white/10`}>
                            <div className="relative flex items-center pt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={agreedToPolicy}
                                    onChange={(e) => {
                                        setAgreedToPolicy(e.target.checked);
                                        if (errors.policy) setErrors({...errors, policy: undefined});
                                    }}
                                />
                                <div className={`w-5 h-5 border-2 rounded bg-black transition-all ${errors.policy ? 'border-red-500' : 'border-zinc-500 peer-checked:bg-lime-400 peer-checked:border-lime-400'}`}></div>
                                <Check className="w-3 h-3 text-black absolute top-[6px] left-[4px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className={`text-xs transition-colors font-medium ${errors.policy ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                I confirm ownership of rights and agree to the No Refund policy.
                            </span>
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-4 mt-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        Submit Artist For Approval
                    </button>
                </form>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
