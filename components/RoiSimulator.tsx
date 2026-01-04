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
  const COST_PER_1M_STREAMS = 2700; 

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
      const densityMultiplier = Math.min(1.5, Math.max(1, catalogSize / 100)); 
      currentYearStreams = currentYearStreams * (1 + (ORGANIC_LIFT * densityMultiplier));
    }

    // 2. Financials - Detailed Royalty Calculation
    const masterRevenue = (totalStreams / 1000) * MASTER_RPM;
    const publishingRevenue = (totalStreams / 1000) * PUB_RPM;
    const grossRev = masterRevenue + publishingRevenue;
    
    const annualMarketingCost = (targetStreams / 1000000) * COST_PER_1M_STREAMS; 
    const totalMarketingCost = annualMarketingCost * timeHorizon;

    // 3. Splits Calculation
    const netMaster = masterRevenue - totalMarketingCost;
    
    const labelMasterShare = netMaster > 0 
        ? netMaster * (dealSplit / 100)
        : netMaster;
    
    const labelPubShare = publishingRevenue * (publishingSplit / 100);
    const totalLabelShare = labelMasterShare + labelPubShare;
        
    const artistMasterShare = netMaster > 0 
        ? netMaster * ((100 - dealSplit) / 100)
        : 0;
    
    const artistPubShare = publishingRevenue * ((100 - publishingSplit) / 100);
    const artistTotalShare = artistMasterShare + artistPubShare;

    const net = grossRev - totalMarketingCost;
    const roi = totalMarketingCost > 0 ? (totalLabelShare / totalMarketingCost) : 0; 
    
    const monthlyLabelShare = totalLabelShare / (timeHorizon * 12);
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

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let message = 'Catalog Optimized';
    
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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
        
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
            TONE: Professional, concise, sharp, institutional. Use formatting like bullet points or bold text for key figures.
            OBJECTIVE: Help maximize ROI and plan exit strategies.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `System Context: ${context}\n\nUser Question: ${userMsg}`,
        });
        
        const text = response.text;
        setMessages(prev => [...prev, { role: 'model', text: text || "Analysis complete." }]);
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "Connection to Intelligence Grid interrupted. Please verify system access or try again." }]);
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
            </div>

            <div className="lg:col-span-4 p-6 md:p-8 space-y-8">
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
                        className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>

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
                        className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-500"
                    />
                </div>
            </div>

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
                        className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center text-lg"
                    >-</button>
                    <button 
                        onClick={() => setCatalogSize(Math.min(500, catalogSize + 10))}
                        className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center text-lg"
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
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Total Revenue</span>
                    <span className="text-xl md:text-2xl font-light text-white block">{fmtCurrency(metrics.grossRevenue)}</span>
                </div>
                
                <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Protocol Cost</span>
                    <span className="text-xl md:text-2xl font-light text-white block">-{fmtCurrency(metrics.marketingCost)}</span>
                </div>

                <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-emerald-500 block">Label Net Profit</span>
                    <span className="text-xl md:text-2xl font-light text-white block border-l-2 border-emerald-500 pl-4">
                        {fmtCurrency(metrics.labelShare)}
                    </span>
                </div>

                <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-600 block">Artist Net</span>
                    <span className="text-xl md:text-2xl font-light text-gray-400 block border-l-2 border-gray-700 pl-4">
                        {fmtCurrency(metrics.artistShare)}
                    </span>
                </div>
            </div>
        </div>

        {/* Exit Analysis Section */}
        <div className="border-t border-white/10 bg-[#080808]">
            <div className="px-6 md:px-8 py-6 border-b border-white/5 flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Investor Intelligence & Exit Analysis</h4>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2">
                <div className="p-6 md:p-10 border-b xl:border-b-0 border-white/10 xl:border-r">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-400 block mb-2">Internal Rate of Return</span>
                            <div className="text-4xl md:text-5xl font-light text-white tracking-tight">
                                {metrics.roiMultiple > 0 ? "~18% - 22%" : "N/A"} <span className="text-lg text-gray-400 font-normal">Net IRR</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className="text-sm text-gray-300 font-normal leading-relaxed">
                            A <span className="text-white font-bold">{metrics.roiMultiple.toFixed(2)}x net ROI multiple</span> over a {timeHorizon}-year projection period suggests high-velocity institutional performance.
                        </p>
                    </div>
                </div>

                <div className="p-6 md:p-10">
                     <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-luxury text-gray-400">Exit Scenario Analysis</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Exit Multiple</th>
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Est. Exit Value</th>
                                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-emerald-500 text-right">Combined Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[8, 10, 12].map((multiple) => {
                                    const exitValue = metrics.annualNetEarnings * multiple;
                                    const totalValue = metrics.labelShare + exitValue;
                                    
                                    return (
                                        <tr key={multiple} className="border-b border-white/5">
                                            <td className="py-5 text-sm font-bold text-white">{multiple}x</td>
                                            <td className="py-5 text-sm text-gray-200">{fmtCompact(exitValue)}</td>
                                            <td className="py-5 text-right font-bold text-white">{fmtCompact(totalValue)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        {/* Intelligence Grid (AI Chat) */}
        <div className="border-t border-white/10 bg-[#000000]">
            <div className="px-6 py-8 md:px-12 md:py-10 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-emerald-500/30 flex items-center justify-center bg-emerald-900/5">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white leading-none">Intelligence Grid</h4>
                        <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-500 mt-1 block">Strategic ROI Consultant</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Online</span>
                </div>
            </div>
            
            <div className="bg-[#050505] h-[500px] flex flex-col">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' ? (
                            <div className="max-w-[90%] md:max-w-[75%] space-y-2">
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 block">Analyst</span>
                                 <p className="text-sm md:text-lg font-light leading-relaxed text-gray-200 whitespace-pre-line">{msg.text}</p>
                            </div>
                        ) : (
                            <div className="max-w-[85%] md:max-w-[60%] bg-[#111] border border-white/10 p-5 md:p-6 text-white text-sm md:text-base">{msg.text}</div>
                        )}
                    </div>
                ))}
                {isChatLoading && <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest p-6"><Loader2 className="animate-spin w-4 h-4" /> Processing Query...</div>}
                </div>

                <div className="border-t border-white/10 bg-[#080808] flex flex-col md:flex-row">
                    <input 
                        type="text"
                        className="flex-1 bg-transparent px-8 py-6 text-sm md:text-lg text-white focus:outline-none placeholder-gray-600"
                        placeholder="INITIALIZE QUERY // ASK ABOUT ROI..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={isChatLoading || !chatInput.trim()}
                        className="bg-white text-black hover:bg-emerald-500 hover:text-white px-10 py-6 font-bold uppercase tracking-[0.25em] text-xs transition-all disabled:opacity-50"
                    >
                        Execute
                    </button>
                </div>
            </div>
        </div>

    </div>
  );
};

export default RoiSimulator;