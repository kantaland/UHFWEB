import React, { useState, useEffect } from 'react';
import { PricingTier } from '../types';
import { X, Check, Lock, ChevronRight, FileText, Download, ShieldCheck } from './Icons';
import { jsPDF } from 'jspdf';

interface CheckoutModalProps {
  tier: PricingTier | null;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ tier, onClose }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'contract' | 'success'>('details');
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const [errors, setErrors] = useState<{ website?: string; email?: string; policy?: string; distributor?: string; signature?: string }>({});
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [signature, setSignature] = useState('');
  
  const [formData, setFormData] = useState({
    website: '',
    email: '',
    distributor: '',
    affiliateCode: ''
  });

  useEffect(() => {
    if (tier) {
      setStep('details');
      setFormData({ website: '', email: '', distributor: '', affiliateCode: '' });
      setLoadingStatus('Initializing...');
      setErrors({});
      setAgreedToPolicy(false);
      setSignature('');
    }
  }, [tier]);

  if (!tier) return null;

  const depositValue = tier.id === 'pack-entry' ? tier.price : (tier.id === 'pack-annual' ? 5400 : 53000);
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Dynamic Agreement Generation
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

    const sections = [
        {
            title: "1. SCOPE OF SERVICES",
            body: `Provider does not distribute, upload, host, modify, or control any sound recordings.\n\nAll recordings subject to this Agreement are pre-distributed and fully controlled by the Client through its selected distributor or major-label distribution system.\n\nProvider’s services are limited strictly to off-platform traffic facilitation and audience discovery activity directed toward the Client’s existing Spotify-distributed catalog, ${scopeText}\n\nStreams are delivered:\n- Exclusively on Spotify\n- Across Geo1 countries\n- Across multiple tracks and catalog assets (100+ songs where applicable)\n- Structured to support sustainable listening behavior and platform compliance\n\nThis service is designed for long-term catalog sustainability, not short-term chart manipulation.`
        },
        {
            title: "2. DELIVERY WINDOW",
            body: `${deliveryText}\n\nClient acknowledges that delivery timelines may vary due to catalog size, DSP behavior, platform conditions, or reporting cycles.`
        },
        {
            title: "3. PAYMENT TERMS & NO REFUNDS",
            body: `${paymentText}\n\nOnce campaign initiation has occurred, all payments are strictly non-refundable.\n\nThis includes, without limitation, circumstances involving:\n- Spotify or DSP algorithm behavior\n- Stream throttling, review, or adjustment\n- Distributor delays or reporting variance\n- Changes in Client strategy, release plans, or preference\n\nClient agrees not to initiate any chargebacks, payment reversals, or disputes after service initiation. Any such action constitutes a material breach of this Agreement.`
        },
        {
            title: "4. VERIFICATION & REPORTING",
            body: "All performance metrics are verified exclusively through:\n- Spotify for Artists, and/or\n- The Client’s distributor backend\n\nProvider does not supply proprietary dashboards, raw traffic data, or third-party reporting tools."
        },
        {
            title: "5. NO GUARANTEES",
            body: "Provider does not guarantee:\n- Chart placement\n- Editorial playlist inclusion\n- Algorithmic triggering\n- Virality, revenue levels, or royalty outcomes\n\nProvider’s obligation is limited solely to traffic facilitation and catalog acceleration efforts."
        },
        {
            title: "6. DSP RISK ACKNOWLEDGMENT",
            body: "Client acknowledges that all Digital Service Providers (DSPs), including Spotify, operate independently and may apply internal reviews, throttling, enforcement actions, or reporting adjustments at their sole discretion.\n\nProvider’s services do not influence, override, or manipulate DSP reporting, royalty calculations, or payout mechanisms.\n\nProvider shall not be liable for any DSP-initiated action, including but not limited to:\n- Stream adjustments or removals\n- Content limitation or takedown\n- Account review or suspension"
        },
        {
            title: "7. CLIENT WARRANTIES",
            body: "Client represents and warrants that:\n- It owns or controls 100% of the master recording rights, or has full legal authority to authorize this service\n- All recordings are lawfully distributed prior to campaign initiation\n- Execution of this Agreement does not violate any third-party agreements, label obligations, or distributor terms"
        },
        {
            title: "8. LIMITATION OF LIABILITY",
            body: "Provider’s total liability under this Agreement shall not exceed the total fees paid by Client.\n\nIn no event shall Provider be liable for indirect, incidental, consequential, punitive, reputational, or lost-profit damages."
        },
        {
            title: "9. CONFIDENTIALITY & NON-DISCLOSURE",
            body: "Client agrees to maintain strict confidentiality regarding:\n- Provider methodologies\n- Operational processes\n- Traffic strategies\n- Pricing structures\n\nDisclosure to any third party without prior written consent is prohibited."
        },
        {
            title: "10. INDEPENDENT CONTRACTOR",
            body: "Provider acts solely as an independent contractor.\n\nNothing in this Agreement shall be deemed to create any partnership, joint venture, fiduciary relationship, or agency."
        },
        {
            title: "11. GOVERNING LAW",
            body: "This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict-of-law principles."
        },
        {
            title: "12. ENTIRE AGREEMENT",
            body: "This Agreement constitutes the entire understanding between the parties and supersedes all prior discussions or representations. Any amendments must be in writing and signed by both parties."
        },
        {
            title: "13. INDEMNIFICATION",
            body: "Client agrees to indemnify, defend, and hold harmless Provider, its officers, directors, partners, contractors, and affiliates from any claims, damages, losses, liabilities, costs, or expenses (including reasonable legal fees) arising from:\n- Client’s catalog, recordings, metadata, or distribution\n- Client’s distributor or DSP relationships\n- Any breach of Client warranties or representations\n- DSP or third-party enforcement actions related to Client content"
        },
        {
            title: "14. FORCE MAJEURE",
            body: "Provider shall not be liable for failure or delay in performance due to events beyond its reasonable control, including but not limited to DSP policy changes, platform outages, algorithmic adjustments, acts of government, network failures, or force majeure events."
        },
        {
            title: "15. NO AGENCY OR AFFILIATION",
            body: "Nothing in this Agreement shall be construed to imply any affiliation, endorsement, or representation between Provider and Spotify, any DSP, distributor, or record label."
        },
        {
            title: "16. NON-DISPARAGEMENT",
            body: "Client agrees not to make or publish any false, misleading, or disparaging statements regarding Provider, its services, personnel, or operations."
        },
        {
            title: "17. NO OPERATIONAL AUDIT",
            body: "Client shall have no right to audit Provider’s internal systems, methodologies, partners, cost structures, or operational processes.\n\nVerification is limited exclusively to Client’s DSP reporting."
        },
        {
            title: "18. PERFORMANCE VARIANCE",
            body: "Client acknowledges that stream delivery figures may vary due to DSP reconciliation, rounding, or reporting adjustments. Minor variances shall not constitute breach of this Agreement."
        },
        {
            title: "19. SURVIVAL",
            body: "Sections relating to payment obligations, confidentiality, limitation of liability, indemnification, non-disparagement, governing law, and no-distribution provisions shall survive completion or termination of this Agreement."
        },
        {
            title: "20. NO DISTRIBUTION OR CONTENT CONTROL",
            body: "Provider does not act as a distributor, label, publisher, or rights administrator.\n\nProvider has no control over:\n- Uploading, editing, or removal of recordings\n- Metadata, ISRCs, or release configurations\n- Distributor selection or DSP ingestion\n- Monetization, royalty calculation, or DSP payouts\n\nAll distribution decisions and responsibilities remain solely with the Client."
        }
    ];

    // Append strict annual clauses for Annual and Scale plans
    if (tier.id !== 'pack-entry') {
        const annualVolume = tier.id === 'pack-annual' ? '12,000,000' : '120,000,000';
        const planName = tier.id === 'pack-annual' ? '12M Annual' : '120M Annual';

        sections.push(
            {
                title: "21. MINIMUM ANNUAL COMMITMENT (NON-NEGOTIABLE)",
                body: `Client agrees to a minimum annual commitment of ${annualVolume} Spotify streams for the ${planName} Plan.\n\nThis commitment is non-cancelable once the annual term has commenced. Even if Client terminates early, Client remains liable for the full value of the Minimum Annual Commitment or a termination fee equal to the remaining value.`
            },
            {
                title: "22. EARLY TERMINATION & LIQUIDATED DAMAGES",
                body: "In the event Client terminates this Agreement prior to completion of the annual term for convenience, Client shall immediately pay Provider liquidated damages equal to the remaining unpaid balance of the annual commitment.\n\nThe parties acknowledge this amount represents a reasonable estimate of Provider’s costs, allocations, and lost opportunity and is not a penalty."
            },
            {
                title: "23. ADVANCE PAYMENT & LOCK-IN PERIOD",
                body: "Client shall pay the equivalent of two (2) months of service fees in advance upon execution.\n\nClient may not terminate this Agreement for convenience during the first six (6) months of the annual term.\n\nThereafter, termination for convenience requires 90 days written notice, during which all scheduled payments remain due."
            },
            {
                title: "24. RATE PROTECTION & ASSET REVERSION",
                body: "Client acknowledges that annual pricing reflects volume-based allocation and may not be used as a benchmark for short-term or alternative service sourcing.\n\nAny undelivered stream balance at termination may be delivered at Provider’s discretion or forfeited without refund."
            },
            {
                title: "25. TERMINATION FOR CAUSE (LIMITED)",
                body: "Client may terminate this Agreement for cause only in the event of a material breach by Provider, provided Client delivers written notice and Provider is given thirty (30) days to cure such breach.\n\nVariations in DSP behavior, stream velocity, reporting delays, platform reviews, or algorithmic adjustments shall not constitute material breach."
            },
            {
                title: "26. TEMPORARY SUSPENSION EVENTS",
                body: "In the event of temporary DSP review, throttling, or platform-initiated suspension affecting delivery pace, Provider may pause or adjust delivery without constituting breach. Delivery timelines shall be extended accordingly."
            }
        );
    }

    return sections;
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
    
    // Config
    const margin = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Title Page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("URBAN HIPPY FANTASY", pageWidth / 2, y, { align: "center" });
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text("CATALOG ACCELERATION PROTOCOL", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Service Agreement Header
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text("SERVICE LEVEL AGREEMENT", margin, y);
    y += 10;

    // Details Box
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setDrawColor(0);
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, y, contentWidth, 40, "F");
    
    let boxY = y + 10;
    const boxMargin = margin + 5;
    
    doc.text(`Protocol Tier: ${tier.name.toUpperCase()}`, boxMargin, boxY);
    doc.text(`Effective Date: ${currentDate}`, boxMargin + 100, boxY);
    boxY += 8;
    doc.text(`Client Entity: ${formData.website}`, boxMargin, boxY);
    boxY += 8;
    doc.text(`Total Contract Value: $${tier.price.toLocaleString()} USD`, boxMargin, boxY);
    boxY += 8;
    doc.text(`Initial Deposit: $${depositValue.toLocaleString()} USD`, boxMargin, boxY);

    y += 50;

    // Content Sections
    sections.forEach(term => {
      // Check for page break
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 30;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(term.title, margin, y);
      y += 6;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitBody = doc.splitTextToSize(term.body, contentWidth);
      
      // Check if body needs page break
      if (y + (splitBody.length * 5) > pageHeight - 30) {
          doc.addPage();
          y = 30;
      }
      
      doc.text(splitBody, margin, y);
      y += (splitBody.length * 5) + 12;
    });

    // Signature Page
    if (y > pageHeight - 100) {
        doc.addPage();
        y = 30;
    } else {
        y += 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("AUTHORIZED EXECUTION", margin, y);
    y += 15;

    // Provider Column
    const leftColX = margin;
    const rightColX = margin + 90;
    let sigY = y;

    // Provider Details
    doc.setFontSize(10);
    doc.text("Provider:", leftColX, sigY);
    sigY += 5;
    doc.setFont("helvetica", "normal");
    doc.text("Urban Hippy Fantasy", leftColX, sigY);
    sigY += 15;
    
    doc.text("Authorized Signatory: ____________________", leftColX, sigY);
    // Draw signature over line
    doc.setFont("courier", "italic");
    doc.text("Kanta Kudo", leftColX + 40, sigY - 1);
    doc.setFont("helvetica", "normal");
    
    sigY += 8;
    doc.text("Name: Kanta Kudo", leftColX, sigY);
    sigY += 8;
    doc.text("Date: ____________________", leftColX, sigY);
    doc.text(currentDate, leftColX + 12, sigY);

    // Client Details (Right Column)
    sigY = y;
    doc.setFont("helvetica", "bold");
    doc.text("Client:", rightColX, sigY);
    sigY += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`Entity: ${formData.website}`, rightColX, sigY);
    sigY += 15;

    doc.text("Authorized Signatory: ____________________", rightColX, sigY);
    // Draw client signature over line
    doc.setFont("courier", "italic");
    doc.text(signature, rightColX + 40, sigY - 1);
    doc.setFont("helvetica", "normal");

    sigY += 8;
    doc.text(`Title: Label Owner / Manager`, rightColX, sigY);
    sigY += 8;
    doc.text("Date: ____________________", rightColX, sigY);
    doc.text(currentDate, rightColX + 12, sigY);

    y = sigY + 30;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const id = Math.random().toString(36).substring(2, 15).toUpperCase();
    doc.text(`Digital Execution ID: ${id}`, margin, y);
    doc.text("Urban Hippy Fantasy | Registered S-Corp in California", margin + 100, y);

    // Save
    doc.save(`UHF_Agreement_${tier.id}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleProceedToPayment = () => {
    if (tier.id === 'pack-annual') {
        window.open('https://www.paypal.com/checkoutweb/signup?useraction=commit&ssrt=1765949112955&ul=1&country.x=GB&locale.x=en_GB&modxo_redirect_reason=guest_user&token=5Y449642VY8628055&rcache=1&cookieBannerVariant=hidden&locale.x=en_GB&country.x=GB', '_blank');
    } else if (tier.id === 'pack-scale') {
        window.open('https://www.paypal.com/checkoutweb/signup?useraction=commit&ssrt=1765948883618&ul=1&country.x=GB&locale.x=en_GB&modxo_redirect_reason=guest_user&token=2KN956842U111793V&rcache=1&cookieBannerVariant=hidden&locale.x=en_GB&country.x=GB', '_blank');
    } else if (tier.id === 'pack-entry') {
        window.open('https://www.paypal.com/checkoutweb/signup?useraction=commit&ssrt=1765949342430&ul=1&country.x=GB&locale.x=en_GB&modxo_redirect_reason=guest_user&token=75537518SS4636435&rcache=1&cookieBannerVariant=hidden&locale.x=en_GB&country.x=GB', '_blank');
    } else {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full h-full md:max-w-2xl md:h-auto bg-black border border-white/20 flex flex-col animate-[fadeIn_0.3s_ease-out] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h3 className="text-xl font-light uppercase tracking-wide text-white">
                {step === 'success' ? 'Protocol Active' : step === 'contract' ? 'Execute Agreement' : 'Application Protocol'}
            </h3>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto">
            
            {/* --- SUCCESS STEP --- */}
            {step === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border border-white flex items-center justify-center mx-auto mb-8 rounded-none bg-emerald-900/20 border-emerald-500/50">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-white uppercase mb-4">Contract Executed</h3>
                <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                    Agreement stored on secure ledger. Please download your copy below before proceeding to payment.
                </p>
                
                <button 
                    onClick={handleDownloadContract}
                    className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black hover:border-white transition-colors flex items-center justify-center gap-3 mb-4"
                >
                    <Download className="w-4 h-4" /> Download Signed Copy (PDF)
                </button>

                <div className="bg-[#111] border border-white/10 p-8 text-left mb-8">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Invoice Summary</p>
                    <div className="flex justify-between mb-3">
                        <span className="text-white text-base">{tier.name}</span>
                        <span className="text-white text-base font-bold">${tier.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Deposit Due Now</span>
                        <span className="text-emerald-500 text-sm font-bold">${depositValue.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-emerald-400 hover:border-emerald-400 transition-colors" 
                    onClick={handleProceedToPayment}
                >
                     'Proceed to Secure Checkout'
                </button>
              </div>

            /* --- PROCESSING STEP --- */
            ) : step === 'processing' ? (
              <div className="text-center py-24">
                <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white animate-pulse">{loadingStatus}</p>
              </div>

            /* --- CONTRACT STEP --- */
            ) : step === 'contract' ? (
                <div className="space-y-8">
                    <div className="border border-white/10 bg-[#0a0a0a] p-6 h-64 overflow-y-auto font-mono text-xs text-gray-400 leading-relaxed custom-scrollbar">
                        <p className="mb-4 text-white font-bold uppercase tracking-widest border-b border-white/10 pb-2 sticky top-0 bg-[#0a0a0a]">
                            SERVICE AGREEMENT: {tier.name.toUpperCase()} PROTOCOL
                        </p>
                        <p className="mb-6">
                            <strong>Effective Date:</strong> {currentDate}<br/>
                            <strong>Provider:</strong> Urban Hippy Fantasy (Registered S-Corp in California)<br/>
                            <strong>Client:</strong> {formData.website}<br/>
                        </p>
                        {getAgreementSections().map((section, idx) => (
                             <div key={idx} className="mb-6">
                                <strong className="block mb-2 text-white">{section.title}</strong>
                                <p className="whitespace-pre-wrap text-gray-400">{section.body}</p>
                             </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-2">Digital Signature</label>
                            <span className="text-xs text-gray-500 font-mono">{currentDate}</span>
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-[#050505] border border-white/20 py-4 px-4 text-base text-white focus:outline-none focus:border-white transition-colors font-mono"
                            placeholder="Type Full Name to Sign"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                        />
                        {errors.signature && <p className="text-red-500 text-xs">{errors.signature}</p>}
                    </div>

                    <button 
                        onClick={handleSignContract}
                        className="w-full py-5 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-[0.2em] text-xs transition-colors flex items-center justify-center gap-4 mt-8"
                    >
                        Sign & Execute Agreement <ShieldCheck className="w-4 h-4" />
                    </button>
                </div>

            /* --- DETAILS FORM STEP --- */
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid gap-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Target Config</label>
                    <div className="text-3xl font-light text-white">{tier.name}</div>
                </div>

                <div className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Label Website</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-white/20 py-4 text-base text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-gray-700 font-light"
                            placeholder="www.yourlabel.com"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                        {errors.website && <p className="text-red-500 text-xs mt-2">{errors.website}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Distribution Partner</label>
                        <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-white/20 py-4 text-base text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-gray-700 font-light"
                            placeholder="Major Label / Affiliate"
                            value={formData.distributor}
                            onChange={(e) => setFormData({...formData, distributor: e.target.value})}
                        />
                         {errors.distributor && <p className="text-red-500 text-xs mt-2">{errors.distributor}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Contact Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-transparent border-b border-white/20 py-4 text-base text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-gray-700 font-light"
                            placeholder="management@label.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                         {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                    </div>
                </div>

                <div className="border border-white/10 p-6 bg-[#0a0a0a]">
                     <div className="flex items-start gap-4">
                        <input 
                            type="checkbox" 
                            id="policy"
                            className="mt-1 w-5 h-5 rounded-none border-white/30 bg-transparent focus:ring-0 checked:bg-white"
                            checked={agreedToPolicy}
                            onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        />
                        <label htmlFor="policy" className="text-sm text-gray-400 leading-relaxed cursor-pointer select-none">
                            I certify this release is distributed via a Major Label system. I confirm 100+ Active Songs. I understand Independent/DistroKid releases are ineligible.
                        </label>
                     </div>
                     {errors.policy && <p className="text-red-500 text-xs mt-3 ml-9">{errors.policy}</p>}
                </div>

                <button 
                    type="submit" 
                    className="w-full py-5 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-[0.2em] text-xs transition-colors flex items-center justify-center gap-4"
                >
                    Submit for Verification <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;