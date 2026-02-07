import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { RiskAnalysisResult } from '../types';
import { Shield, ShieldAlert, CheckCircle, Search } from 'lucide-react';

interface Props {
    selectedArea?: string;
}

export const TrustCheck: React.FC<Props> = ({ selectedArea }) => {
    const [listingText, setListingText] = useState('');
    const [brokerName, setBrokerName] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<RiskAnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!listingText) return;
        setAnalyzing(true);
        try {
            const data = await api.analyzeRisk(listingText, selectedArea || 'Dubai Marina', { brokerName, agentEmail, website });
            setResult(data);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Shield className="text-blue-600" />
                    Listing Trust Check
                </h2>
                <p className="text-slate-500 mb-6 text-sm">
                    Paste a listing description or WhatsApp message to scan for scam signals.
                </p>

                <div className="space-y-4">
                    <textarea
                        className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                        placeholder="Paste listing text here... e.g. '1BHK for rent, 40k, amazing deal, contact via WhatsApp only...'"
                        value={listingText}
                        onChange={e => setListingText(e.target.value)}
                    />

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Optional: Verify Legitimacy</p>
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                type="text"
                                placeholder="Brokerage / Company Name"
                                className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={brokerName}
                                onChange={e => setBrokerName(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Agent Email"
                                    className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={agentEmail}
                                    onChange={e => setAgentEmail(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Website (e.g. agency.ae)"
                                    className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!listingText || analyzing}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
              ${analyzing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'}`}
                    >
                        {analyzing ? 'Scanning...' : <><Search size={18} /> Analyze Risk</>}
                    </button>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 border-t border-slate-200 pt-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600 font-medium">Risk Score</span>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2
                ${result.score > 55 ? 'bg-red-100 text-red-700' : result.score > 25 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                {result.score > 55 ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
                                Risk: {result.label} ({result.score}/100)
                            </div>
                        </div>

                        {result.signals.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected Signals</p>
                                {result.signals.map((signal, idx) => (
                                    <div key={idx} className={`flex items-start gap-2 text-sm p-3 rounded-lg border 
                                        ${signal.severity === 'Trust' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 
                                            ${signal.severity === 'Critical' || signal.severity === 'High' ? 'bg-red-500' :
                                                signal.severity === 'Medium' ? 'bg-yellow-500' :
                                                    signal.severity === 'Trust' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                        <div>
                                            <span className="font-medium">{signal.reason}</span>
                                            <span className={`ml-2 text-xs ${signal.severity === 'Trust' ? 'text-green-600' : 'text-slate-400'}`}>({signal.severity})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center">
                                No major red flags detected. Always verify physically!
                            </div>
                        )}

                        <div className="bg-slate-900 text-slate-400 p-4 rounded-lg text-xs font-mono">
                            <div className="flex items-center gap-2 mb-2 text-slate-200">
                                <Search size={12} /> Agent Trace
                            </div>
                            {result.trace.map((t, i) => (
                                <div key={i} className="mb-1">&gt; {t}</div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
