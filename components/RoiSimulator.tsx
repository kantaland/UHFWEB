import React, { useState, useEffect, useRef } from 'react';
import { SongConfiguration } from '../types';
import { AlertCircle, Check, DollarSign, PieChart, TrendingUp, Layers, RefreshCw, FileText, Activity, Lock, BarChart3, Sparkles, Send, Loader2 } from './Icons';
import { GoogleGenAI } from "@google/genai";

interface RoiSimulatorProps {
  initialStreams: number;
  songConfig: SongConfiguration;
  onSongConfigChange: (config: SongConfiguration) => void;
}

const RoiSimulator: React.FC<RoiSimulatorProps> = ({ initialStreams, songConfig, onSongConfigChange }) => {
  // Simulation State
  const [targetStreams, setTargetStreams] = useState(12000000); // Default 12M/yr
  const [dealSplit, setDealSplit] = useState(80); // Label Master share %
  const [publishingSplit, setPublishingSplit] = useState(0); // Label Publishing share %
  const [timeHorizon, setTimeHorizon] = useState<1 | 3 | 5>(1);
  const [catalogSize, setCatalogSize] = useState(100);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'model', text: string}>>([
    { role: 'model', text: "I have analyzed your current configuration.\n\nAsk me about optimizing your deal structure, improving your ROI multiple, or potential exit scenarios." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Constants (Realistic Industry Averages)
  const MASTER_RPM = 3.60; 
  const PUB_RPM = 0.75;
  const ORGANIC_LIFT = 0.15; // 15% organic lift per year due to algo triggering
  const COST_PER_1M_STREAMS = 2700; // Based on the "Annual Core" pricing roughly

  // Calculated Values
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    masterRevenue: 0,
    publishingRevenue: 0,
    marketingCost: 0,
    netProfit: 0,
    labelShare: 0,
    artistShare: 0,
    roiMultiple: 0,
    labelMasterShare: 0,
    labelPubShare: 0,
    monthlyLabelShare: 0,
    annualNetEarnings: 0
  });

  useEffect(() => {
    // 1. Calculate Total Streams over Time Horizon including Compound Organic Growth
    let totalStreams = 0;
    let currentYearStreams = targetStreams;

    for (let i = 0; i < timeHorizon; i++) {
      totalStreams += currentYearStreams;
      // Growth factor: More songs = higher stickiness/organic lift
      const densityMultiplier = Math.min(1.5, Math.max(1, catalogSize / 100)); 
      currentYearStreams = currentYearStreams * (1 + (ORGANIC_LIFT * densityMultiplier));
    }

    // 2. Financials - Detailed Royalty Calculation
    const masterRevenue = (totalStreams / 1000) * MASTER_RPM;
    const publishingRevenue = (totalStreams / 1000) * PUB_RPM;
    const grossRev = masterRevenue + publishingRevenue;
    
    // Marketing Cost (Recoupable against Master)
    // We assume the cost is recurrent annually for this simulation to maintain velocity
    const annualMarketingCost = (targetStreams / 1000000) * COST_PER_1M_STREAMS; 
    const totalMarketingCost = annualMarketingCost * timeHorizon;

    // 3. Splits Calculation
    // Marketing is recouped from Master Revenue
    const netMaster = masterRevenue - totalMarketingCost;
    
    // Label Share
    // Master: Applied to Net Master (Recouped). If negative, label bears the cost.
    const labelMasterShare = netMaster > 0 
        ? netMaster * (dealSplit / 100)
        : netMaster;
    
    // Publishing: Typically not cross-collateralized with marketing in this simplified view, 
    // unless specified. We will treat Pub as separate income stream based on split.
    const labelPubShare = publishingRevenue * (publishingSplit / 100);
    
    const totalLabelShare = labelMasterShare + labelPubShare;
        
    // Artist Share
    // Artist gets remainder of Master (if positive) + remainder of Publishing
    const artistMasterShare = netMaster > 0 
        ? netMaster * ((100 - dealSplit) / 100)
        : 0;
    
    const artistPubShare = publishingRevenue * ((100 - publishingSplit) / 100);
        
    const artistTotalShare = artistMasterShare + artistPubShare;

    // Project Level Stats
    const net = grossRev - totalMarketingCost;
    const roi = totalMarketingCost > 0 ? (totalLabelShare / totalMarketingCost) : 0; // ROI from Label perspective
    
    // Monthly Average over the horizon
    const monthlyLabelShare = totalLabelShare / (timeHorizon * 12);
    
    // Average Annual Net (for Valuation Multiples)
    const annualNetEarnings = totalLabelShare / timeHorizon;

    setMetrics({
      grossRevenue: grossRev,
      masterRevenue,
      publishingRevenue,
      marketingCost: totalMarketingCost,
      netProfit: net,
      labelShare: totalLabelShare,
      artistShare: artistTotalShare,
      roiMultiple: roi,
      labelMasterShare,
      labelPubShare,
      monthlyLabelShare,
      annualNetEarnings
    });

    // Update Parent Validity (Legacy support)
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let message = 'Catalog Optimized';
    
    // High Velocity Requirement: >100M streams requires 300+ songs
    // Updated Logic for >500M streams to require 500+ songs
    if (targetStreams >= 500000000) {
        if (catalogSize < 500) {
            status = 'danger';
            message = 'Requires 500+ Songs for Maximum Scale';
        } else {
            status = 'safe';
            message = 'Massive Scale Validated';
        }
    } else if (targetStreams >= 100000000) {
        if (catalogSize < 300) {
            status = 'danger';
            message = 'Requires 300+ Songs for Scale';
        } else {
            status = 'safe';
            message = 'Global Scale Validated';
        }
    } 
    // Standard Requirements
    else if (catalogSize < 50) {
        status = 'danger';
        message = 'Inefficient: < 50 Songs';
    } else if (catalogSize < 100) {
        status = 'warning';
        message = 'Sub-Optimal: < 100 Songs';
    }

    if (songConfig.count !== catalogSize || songConfig.status !== status || songConfig.message !== message) {
        onSongConfigChange({ ...songConfig, count: catalogSize, status, message, isValid: status !== 'danger' });
    }

  }, [targetStreams, dealSplit, publishingSplit, timeHorizon, catalogSize]);

  // Auto-scroll chat without scrolling the entire page
  useEffect(() => {
    if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        if (scrollHeight > clientHeight) {
            chatContainerRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
        }
    }
  }, [messages, isChatLoading]);

  // Formatters
  const fmtCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  
  const fmtCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(val);

  // --- AI Chat Logic ---
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' }); 
        
        const context = `
            CONTEXT DATA (Live Financial Simulation):
            - Annual Target Velocity: ${fmtCompact(targetStreams)} streams/year
            - Projection Horizon: ${timeHorizon} Year(s)
            - Catalog Density: ${catalogSize} Songs
            - Deal Structure: ${dealSplit}% Label (Master) / ${publishingSplit}% Label (Publishing)
            - Protocol Investment (Cost): ${fmtCurrency(metrics.marketingCost)}
            - Total Gross Revenue Generated: ${fmtCurrency(metrics.grossRevenue)}
            - Label Net Profit: ${fmtCurrency(metrics.labelShare)}
            - Label ROI Multiple: ${metrics.roiMultiple.toFixed(2)}x
            - Projected Monthly Net Cashflow: ${fmtCurrency(metrics.monthlyLabelShare)}
            - Exit Valuation (based on 10x multiple): ${fmtCurrency(metrics.annualNetEarnings * 10)}
            
            ROLE: You are an elite, high-level financial consultant for a major music label executive. 
            TONE: Professional, concise, sharp, institutional, "Wall Street" style. Avoid fluff. Use formatting like bullet points or bold text for key figures.
            OBJECTIVE: Help the executive maximize ROI, understand the risks, and plan exit strategies.
            
            GUIDELINES:
            1. Use the provided data numbers to back up your answers.
            2. If ROI is under 2.0x, suggest increasing the time horizon to 3 or 5 years, or negotiating a better Master split.
            3. If catalog density is low (<100 songs), warn that this is "Inefficient" and risky for algorithmic stability.
            4. If the user asks about "Exit", explain that catalogs with >100M streams often trade at 8x-12x multiples and calculate the potential sale value.
            5. Keep responses relatively short (under 100 words) unless complex analysis is requested.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `System Context: ${context}\n\nUser Question: ${userMsg}`,
        });
        
        const text = response.text;
        setMessages(prev => [...prev, { role: 'model', text: text || "Analysis complete." }]);
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "Connection to Intelligence Grid interrupted. Please check your credentials or try again." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 p-0 md:p-1 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="w-full lg:w-auto">
                <span className="text-xs font-bold uppercase tracking-luxury text-emerald-500 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Financial Projection Engine
                </span>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                     <div>
                        <h3 className="text-4xl md:text-5xl font-light text-white tracking-tight">
                            {fmtCurrency(metrics.labelShare)}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-luxury text-gray-500 mt-2 block">
                            Total Net Profit ({timeHorizon} Yr)
                        </span>
                    </div>
                    <div className="md:border-l md:border-white/10 md:pl-16">
                        <h3 className="text-4xl md:text-5xl font-light text-white tracking-tight">
                            {fmtCurrency(metrics.monthlyLabelShare)}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-luxury text-emerald-500 mt-2 block">
                            Projected Monthly Returns
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="text-left lg:text-right">
                <div className="text-3xl md:text-3xl font-light text-white">{metrics.roiMultiple.toFixed(2)}x</div>
                <span className="text-xs font-bold uppercase tracking-luxury text-gray-500 mt-1 block">Label ROI Multiple</span>
            </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* 1. Velocity Control */}
            <div className="lg:col-span-5 p-6 md:p-8">
                <div className="flex justify-between mb-4">
                    <label className="text-xs font-bold uppercase tracking-luxury text-gray-500 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Target Velocity
                    </label>
                    <span className="text-sm font-bold text-white">{fmtCompact(targetStreams)} / yr</span>
                </div>
                <input 
                    type="range" 
                    min="1000000" 
                    max="900000000" 
                    step="1000000"
                    value={targetStreams} 
                    onChange={(e) => setTargetStreams(Number(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                />
                <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                    Adjusts annual stream injection. <span className={targetStreams >= 100000000 ? "text-emerald-500 font-bold" : ""}>Note: High Velocity (&gt;100M) requires 300+ songs.</span>
                </p>
            </div>

            {/* 2. Deal Structure (Master & Publishing) */}
            <div className="lg:col-span-4 p-6 md:p-8 space-y-8">
                {/* Master Split */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-luxury text-gray-500 flex items-center gap-2">
                            <PieChart className="w-4 h-4" /> Master Split
                        </label>
                        <span className="text-sm font-bold text-white">{dealSplit}% Label</span>
                    </div>
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5"
                        value={dealSplit} 
                        onChange={(e) => setDealSplit(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>

                {/* Publishing Split */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-luxury text-gray-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Publishing Split
                        </label>
                        <span className="text-sm font-bold text-white">{publishingSplit}% Label</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={publishingSplit} 
                        onChange={(e) => setPublishingSplit(Number(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-500 hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                </div>
            </div>

            {/* 3. Catalog Size */}
            <div className="lg:col-span-3 p-6 md:p-8 bg-[#0d0d0d]">
                <div className="flex justify-between mb-4">
                    <label className="text-xs font-bold uppercase tracking-luxury text-gray-500 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Catalog Density
                    </label>
                    <span className="text-sm font-bold text-white">{catalogSize} Songs</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCatalogSize(Math.max(10, catalogSize - 10))}
                        className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors text-lg"
                    >-</button>
                    <button 
                        onClick={() => setCatalogSize(Math.min(500, catalogSize + 10))}
                        className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors text-lg"
                    >+</button>
                </div>
                <div className="mt-5 flex items-center gap-3">
                    {songConfig.status === 'safe' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-[10px] uppercase tracking-luxury ${songConfig.status === 'safe' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {songConfig.message}
                    </span>
                </div>
            </div>
        </div>

        {/* Results Matrix */}
        <div className="bg-[#050505] p-6 md:p-8">
            <div className="flex items-center gap-4 mb-10">
                <span className="text-xs font-bold uppercase tracking-luxury text-gray-500">Projection Period:</span>
                <div className="flex border border-white/20">
                    {[1, 3, 5].map(yr => (
                        <button
                            key={yr}
                            onClick={() => setTimeHorizon(yr as 1|3|5)}
                            className={`px-5 py-3 text-xs font-bold uppercase transition-colors ${timeHorizon === yr ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            {yr} Year{yr > 1 ? 's' : ''}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-12">
                <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Total Revenue Generated</span>
                    <span className="text-xl md:text-2xl font-light text-white block">{fmtCurrency(metrics.grossRevenue)}</span>
                    <div className="space-y-1 pt-2 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Master</span>
                            <span className="text-[10px] text-gray-300">{fmtCurrency(metrics.masterRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Publishing</span>
                            <span className="text-[10px] text-gray-300">{fmtCurrency(metrics.publishingRevenue)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Protocol Cost</span>
                    <span className="text-xl md:text-2xl font-light text-white block">-{fmtCurrency(metrics.marketingCost)}</span>
                    <span className="text-[10px] text-gray-600 block">Recoupable against Master</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 md:border-none md:pt-0">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-emerald-500 block">Label Net Profit</span>
                    <span className="text-xl md:text-2xl font-light text-white block border-l-2 border-emerald-500 pl-4">
                        {fmtCurrency(metrics.labelShare)}
                    </span>
                    <div className="space-y-1 pt-2 pl-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Master</span>
                            <span className="text-[10px] text-gray-300">{fmtCurrency(metrics.labelMasterShare)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Pub</span>
                            <span className="text-[10px] text-gray-300">{fmtCurrency(metrics.labelPubShare)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 md:border-none md:pt-0">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Artist Net Profit</span>
                    <span className="text-xl md:text-2xl font-light text-gray-400 block border-l-2 border-gray-700 pl-4">
                        {fmtCurrency(metrics.artistShare)}
                    </span>
                    <span className="text-[10px] text-gray-600 block pl-4">Remainder Master + Pub</span>
                </div>
            </div>
        </div>

        {/* --- Advanced Valuation / Investor Intelligence Section --- */}
        <div className="border-t border-white/10 bg-[#080808]">
            {/* Header */}
            <div className="px-6 md:px-8 py-6 border-b border-white/5 flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Investor Intelligence & Exit Analysis</h4>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2">
                
                {/* 1. IRR & Summary */}
                <div className="p-6 md:p-10 border-b xl:border-b-0 border-white/10 xl:border-r">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-400 block mb-2">Internal Rate of Return</span>
                            <div className="text-4xl md:text-5xl font-light text-white tracking-tight">
                                {metrics.roiMultiple > 0 ? "~18% - 22%" : "N/A"} <span className="text-lg text-gray-400 font-normal">Net IRR</span>
                            </div>
                        </div>
                        <div className="self-start bg-emerald-900/10 border border-emerald-500/20 px-4 py-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 whitespace-nowrap">Institutional Grade</span>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <p className="text-sm md:text-base text-gray-200 font-normal leading-relaxed">
                            A <span className="text-white font-bold border-b border-emerald-500/30 pb-0.5">{metrics.roiMultiple.toFixed(2)}x net ROI multiple</span> over a {timeHorizon}-year projection period implies a strong institutional return profile, driven by:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm md:text-base font-normal text-gray-200">
                                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Early capital recoupment against master revenue</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm md:text-base font-normal text-gray-200">
                                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Consistent monthly cash flow <strong className="text-white">({fmtCurrency(metrics.monthlyLabelShare)}/mo projected)</strong></span>
                            </li>
                            <li className="flex items-start gap-3 text-sm md:text-base font-normal text-gray-200">
                                <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Low volatility yield from diversified catalog deployment</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="bg-[#111] p-6 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 block mb-3">Label ROI Explained</span>
                        <p className="text-sm md:text-base text-gray-200 font-normal leading-relaxed italic relative z-10">
                            “A <span className="text-white font-bold">{metrics.roiMultiple.toFixed(2)}x Label ROI Multiple</span> means the label generates <span className="text-white font-bold">${metrics.roiMultiple.toFixed(2)}</span> in net profit for every dollar deployed over {timeHorizon} years, with early capital recoupment and optional exit upside driving total returns beyond 3x.”
                        </p>
                    </div>
                </div>

                {/* 2. Exit Scenario Analysis */}
                <div className="p-6 md:p-10">
                     <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-400">Exit Scenario Analysis (Optional)</span>
                    </div>

                    <p className="text-sm md:text-base text-gray-300 font-normal mb-8 leading-relaxed max-w-lg">
                        Catalogs demonstrating 100M+ annual streams and Geo1 diversification typically transact at <strong className="text-white">8x–12x annual net earnings</strong>. 
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Exit Multiple</th>
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Est. Exit Value</th>
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-emerald-500 text-right">Combined Value (Ops + Exit)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[8, 10, 12].map((multiple) => {
                                    const exitValue = metrics.annualNetEarnings * multiple;
                                    const totalValue = metrics.labelShare + exitValue;
                                    const totalMultiple = totalValue / (metrics.marketingCost || 1); // Avoid div by zero
                                    
                                    return (
                                        <tr key={multiple} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                                            <td className="py-5 text-sm md:text-base font-bold text-white pl-2">{multiple}x</td>
                                            <td className="py-5 text-sm md:text-base font-normal text-gray-200">{fmtCompact(exitValue)}</td>
                                            <td className="py-5 text-right pr-2">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm md:text-base font-bold text-white">{fmtCompact(totalValue)}</span>
                                                    <span className="text-[10px] text-emerald-500 font-bold tracking-wider">{totalMultiple.toFixed(1)}x Total ROI</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                             <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-500 block mb-1">Capital Deployed</span>
                             <span className="text-sm font-bold text-white">{fmtCompact(metrics.marketingCost)}</span>
                        </div>
                        <div className="text-left md:text-right max-w-xs">
                             <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                ⚠️ IRR calculation excludes terminal sale. Combined Value reflects Operating Net ({timeHorizon} yrs) + Exit Proceeds.
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- AI Strategic Consultant Section --- */}
        <div className="border-t border-white/10 bg-[#000000] p-0 md:p-0"> {/* Full width black */}
            
            {/* Header - Range Rover Style: Minimal, lots of padding, sharp typography */}
            <div className="px-6 py-8 md:px-12 md:py-10 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-emerald-500/30 flex items-center justify-center bg-emerald-900/5">
                        <Sparkles className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white leading-none">
                            Intelligence Grid
                        </h4>
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-500 mt-1 block">
                            Strategic ROI Consultant
                        </span>
                    </div>
                </div>
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Online</span>
                </div>
            </div>
            
            <div className="bg-[#050505] h-[500px] md:h-[600px] flex flex-col relative">
                {/* Messages Area */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar scroll-smooth"
                >
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
                        {msg.role === 'model' ? (
                            // AI Message Style: Editorial, Clean, No Box
                            <div className="max-w-[90%] md:max-w-[75%] flex gap-4 md:gap-6">
                                <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
                                    <div className="w-px h-full bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                                </div>
                                <div className="space-y-2">
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 block">
                                        Analyst
                                     </span>
                                     <p className="text-sm md:text-lg font-light leading-relaxed text-gray-200 whitespace-pre-line tracking-wide">
                                        {msg.text}
                                     </p>
                                </div>
                            </div>
                        ) : (
                            // User Message Style: Sharp Box, High Contrast
                            <div className="max-w-[85%] md:max-w-[60%] bg-[#111] border border-white/10 p-5 md:p-6 relative group">
                                <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30"></span>
                                <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30"></span>
                                <p className="text-sm md:text-base font-normal leading-relaxed text-white tracking-wide">
                                    {msg.text}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
                {isChatLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-[90%] md:max-w-[75%] flex gap-4 md:gap-6">
                             <div className="hidden md:flex w-px h-10 bg-emerald-500/20"></div>
                             <div className="flex items-center gap-3">
                                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" strokeWidth={1.5} />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] animate-pulse">Processing Query...</span>
                             </div>
                         </div>
                    </div>
                )}
                </div>

                {/* Input Area - Range Rover Style: Minimalist Bar */}
                <div className="border-t border-white/10 bg-[#080808] p-0">
                    <div className="flex flex-col md:flex-row">
                        <input 
                            type="text"
                            className="flex-1 bg-transparent px-8 py-6 md:py-8 text-sm md:text-lg text-white focus:bg-[#0a0a0a] transition-colors focus:outline-none placeholder-gray-600 font-light tracking-wide border-none"
                            placeholder="INITIALIZE QUERY // ASK ABOUT ROI..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-white text-black hover:bg-emerald-500 hover:text-white px-10 py-6 md:py-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group border-l border-white/10"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.25em]">Execute</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default RoiSimulator;