import React, { useState, useEffect } from 'react';
import { PricingTier } from '../types';
import { X, Check, Lock, ChevronRight, FileText, Download, ShieldCheck, CreditCard } from './Icons';
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

  const depositValue = (tier.id === 'pack-nano' || tier.id === 'pack-micro' || tier.id === 'pack-lite' || tier.id === 'pack-entry') ? tier.price : (tier.id === 'pack-annual' ? 5400 : 53000);
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Dynamic Agreement Generation
  const getAgreementSections = () => {
    let scopeText = "";
    let deliveryText = "";
    let paymentText = "";

    if (tier.id === 'pack-nano' || tier.id === 'pack-micro' || tier.id === 'pack-lite') {
        scopeText = `resulting in the delivery of approximately ${tier.capacity.toLocaleString()} Spotify streams. Singles and EPs are welcome with no minimum catalog size requirements.`;
        deliveryText = "Streams are expected to be delivered within an estimated 14–45 day window from campaign initiation.";
        paymentText = `Client agrees to pay the total contract value of $${tier.price.toLocaleString()} in full upon execution to secure allocation and initiate the service.`;
    } else if (tier.id === 'pack-entry') {
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
            body: `Provider does not distribute, upload, host, modify, or control any sound recordings.\n\nAll recordings subject to this Agreement are pre-distributed and fully controlled by the Client through its selected distributor or major-label distribution system.\n\nProvider’s services are limited strictly to off-platform traffic facilitation and audience discovery activity directed toward the Client’s existing Spotify-distributed catalog, ${scopeText}\n\nStreams are delivered:\n- Exclusively on Spotify\n- Across Geo1 countries\n- Singles and EPs are permitted\n- Structured to support sustainable listening behavior and platform compliance\n\nThis service is designed for long-term catalog sustainability, not short-term chart manipulation.`
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
            body: "Client agrees to not make or publish any false, misleading, or disparaging statements regarding Provider, its services, personnel, or operations."
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
    if (tier.id !== 'pack-nano' && tier.id !== 'pack-micro' && tier.id !== 'pack-lite' && tier.id !== 'pack-entry') {
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

    // --- EXHIBIT A: ACTIVATION INSTRUCTIONS ---
    doc.addPage();
    y = 30;
    
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EXHIBIT A: ACTIVATION PROTOCOL", margin, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text("PROMOTION ACTIVATION INSTRUCTIONS & OFFICE HOURS (REQUIRED)", margin, y);
    y += 15;

    const activationSteps = [
        {
            title: "1. Playlist Preparation",
            body: [
                "Prior to promotion activation, the Client must create one (1) Spotify playlist containing all catalog tracks intended for inclusion in the campaign.",
                "Playlist requirements:",
                "• Playlist must be created directly on Spotify",
                "• Playlist must include all approved catalog songs (recommended 100+ tracks for sustainability)",
                "• Playlist must be set to Public",
                "• No third-party, editorial, or algorithmic playlists may be used"
            ]
        },
        {
            title: "2. Submission Requirements",
            body: [
                "Along with the executed and downloaded Service Agreement, the Client must submit:",
                "• Spotify playlist link (URL) containing the full catalog",
                "• Signed Service Agreement (PDF or equivalent)",
                "All materials must be submitted via email to: aoi@urbanhippyfantasy.com",
                "Promotion will not begin until both items are received and verified."
            ]
        },
        {
            title: "3. Activation & Confirmation",
            body: [
                "Upon receipt of the signed agreement and playlist link:",
                "• An Urban Hippy Fantasy consultant will review the submission",
                "• Promotion activation status will be confirmed within 24–48 business hours",
                "• Once promotion activation has commenced, the campaign is considered initiated and subject to all no-refund, lock-in, and commitment provisions outlined in the Agreement"
            ]
        },
        {
            title: "4. Office Hours & Processing Window",
            body: [
                "Urban Hippy Fantasy Corp business hours are:",
                "• Monday – Friday",
                "• 10:00 AM – 3:00 PM (Pacific Time)",
                "Submissions received after 3:00 PM PT will be processed on the next business day.",
                "Weekends and recognized holidays are non-operational.",
                "Any materials submitted during weekends or holidays will be reviewed on the next business day.",
                "All processing timelines and activation windows are calculated exclusively within stated business hours."
            ]
        },
        {
            title: "5. Important Notices",
            body: [
                "Client is responsible for ensuring all tracks are properly distributed, live, and visible on Spotify prior to submission.",
                "Changes to playlist content after activation may impact delivery timelines.",
                "Incomplete submissions may delay activation without liability to the Provider."
            ]
        }
    ];

    activationSteps.forEach(step => {
        // Checks for page breaks
        if (y > pageHeight - 40) { doc.addPage(); y = 30; }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(step.title, margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        step.body.forEach(line => {
             // split long lines
             const splitLine = doc.splitTextToSize(line, contentWidth - 5);
             if (y + (splitLine.length * 5) > pageHeight - 20) { doc.addPage(); y = 30; }
             doc.text(splitLine, margin + 5, y);
             y += (splitLine.length * 5) + 2;
        });
        y += 4;
    });

    // Save
    doc.save(`UHF_Agreement_${tier.id}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleProceedToPayment = () => {
    if (tier.id === 'pack-annual') {
        window.open('https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-6PG18869JV642600TNFBD5II', '_blank');
    } else if (tier.id === 'pack-scale') {
        window.open('https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-94P7227546419741VTNFBD7Y', '_blank');
    } else if (tier.id === 'pack-entry') {
        window.open('https://buy.stripe.com/5kA1737eC2gTfTidQU', '_blank');
    } else if (tier.id === 'pack-nano') {
        window.open('https://buy.stripe.com/fZe3ff6ay08L5uEaES', '_blank');
    } else if (tier.id === 'pack-micro') {
        window.open('https://buy.stripe.com/cN24jj7eCaRr5uEdQT', '_blank');
    } else if (tier.id === 'pack-lite') {
        window.open('https://buy.stripe.com/14kbLL3YqdZzfTi7sA', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div 
                className="h-full bg-white transition-all duration-700 ease-out"
                style={{ width: step === 'details' ? '25%' : step === 'processing' ? '50%' : step === 'contract' ? '75%' : '100%' }}
            ></div>
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-12">
            {/* --- DETAILS STEP --- */}
            {step === 'details' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10">
                        <span className="text-xs font-bold uppercase tracking-luxury text-gray-500 block mb-2">Checkout Protocol</span>
                        <h2 className="text-3xl font-light uppercase tracking-widest text-white">System Initiation</h2>
                    </div>

                    <div className="bg-white/5 p-6 mb-10 border-l-2 border-white">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-white uppercase tracking-wider">{tier.name}</span>
                            <span className="text-xl font-light text-white">${tier.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{tier.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-luxury text-gray-500 mb-2">Distributor</label>
                                <select 
                                    className={`w-full bg-black border ${errors.distributor ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors appearance-none`}
                                    value={formData.distributor}
                                    onChange={(e) => setFormData({...formData, distributor: e.target.value})}
                                >
                                    <option value="">Select Partner</option>
                                    <option value="major">Major Label (Universal/Sony/Warner)</option>
                                    <option value="empire">EMPIRE</option>
                                    <option value="orchard">The Orchard</option>
                                    <option value="united">UnitedMasters</option>
                                    <option value="vydia">Vydia</option>
                                    <option value="other">Other High-Level Distro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-luxury text-gray-500 mb-2">Label Website / Social</label>
                                <input 
                                    type="text" 
                                    placeholder="yourlabel.com"
                                    className={`w-full bg-black border ${errors.website ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors`}
                                    value={formData.website}
                                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-luxury text-gray-500 mb-2">Communication Channel (Email)</label>
                            <input 
                                type="email" 
                                placeholder="contact@yourlabel.com"
                                className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-white/10'} px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors`}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-luxury text-gray-500 mb-2">Affiliate / Partner Code (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="PROMO-2024"
                                className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
                                value={formData.affiliateCode}
                                onChange={(e) => setFormData({...formData, affiliateCode: e.target.value})}
                            />
                        </div>

                        <div className="pt-4">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className={`mt-1 w-5 h-5 border ${errors.policy ? 'border-red-500' : 'border-white/20'} flex items-center justify-center group-hover:border-white transition-colors`}>
                                    {agreedToPolicy && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={agreedToPolicy}
                                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                                />
                                <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    I acknowledge that this is a <span className="text-white">Professional Service Agreement</span>. All payments are non-refundable upon campaign initiation.
                                </span>
                            </label>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-white text-black py-5 text-xs font-bold uppercase tracking-luxury hover:bg-gray-200 transition-all flex items-center justify-center gap-3 mt-8"
                        >
                            Execute Protocol <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* --- PROCESSING STEP --- */}
            {step === 'processing' && (
                <div className="py-20 text-center animate-in fade-in duration-700">
                    <div className="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-10"></div>
                    <p className="text-xs font-bold uppercase tracking-luxury text-gray-500 animate-pulse">{loadingStatus}</p>
                </div>
            )}

            {/* --- CONTRACT STEP --- */}
            {step === 'contract' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-luxury text-gray-500 block mb-2">Step 02 / 03</span>
                            <h2 className="text-3xl font-light uppercase tracking-widest text-white">Review Agreement</h2>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-500">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-luxury">Verified</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 h-[300px] overflow-y-auto mb-10 custom-scrollbar">
                        <div className="space-y-8">
                            {getAgreementSections().map((section: any, idx: number) => (
                                <div key={idx} className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{section.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{section.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-luxury text-gray-500 mb-2">Digital Signature (Full Name)</label>
                            <input 
                                type="text" 
                                placeholder="Enter full legal name"
                                className={`w-full bg-black border ${errors.signature ? 'border-red-500' : 'border-white/10'} px-4 py-4 text-base italic text-white focus:border-white outline-none transition-colors`}
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                            />
                            {errors.signature && <p className="text-[10px] text-red-500 uppercase mt-2 font-bold tracking-widest">{errors.signature}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleDownloadContract}
                                className="flex-1 border border-white/20 text-white py-5 text-xs font-bold uppercase tracking-luxury hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                            <button 
                                onClick={handleSignContract}
                                className="flex-1 bg-white text-black py-5 text-xs font-bold uppercase tracking-luxury hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                            >
                                Sign & Finalize <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SUCCESS STEP --- */}
            {step === 'success' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-light uppercase tracking-widest text-white mb-4">Protocol Ready</h2>
                <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                  The service agreement has been digitally executed. Complete the deposit to initiate catalog acceleration.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={handleProceedToPayment}
                        className="w-full bg-emerald-500 text-white py-6 text-xs font-bold uppercase tracking-luxury hover:bg-emerald-600 transition-all flex items-center justify-center gap-4"
                    >
                        <CreditCard className="w-5 h-5" /> Proceed to Secure Payment
                    </button>
                    <button 
                        onClick={handleDownloadContract}
                        className="w-full border border-white/10 text-gray-500 py-4 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <FileText className="w-4 h-4" /> Download Final Agreement
                    </button>
                </div>
              </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
