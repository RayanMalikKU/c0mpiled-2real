import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '../types';
import { MapPin, Info, ArrowRight } from 'lucide-react';
import { TrustedListings } from './TrustedListings';

interface Props {
    recommendations: {
        recommendations: Recommendation[];
        wildcard: Recommendation | null;
        trace: string[];
    };
}

export const AgentOutput: React.FC<Props> = ({ recommendations }) => {
    const { recommendations: top3, wildcard, trace } = recommendations;
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    if (selectedArea) {
        return <TrustedListings areaName={selectedArea} onBack={() => setSelectedArea(null)} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Top 3 Recommendations */}
            <h3 className="text-xl font-bold text-slate-800 px-1">Top Recommended Areas</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {top3.map((rec, idx) => (
                    <motion.div
                        key={rec.area}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedArea(rec.area)}
                        className="card hover:shadow-lg transition-all border-t-4 border-t-emerald-500 cursor-pointer group relative"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg">{rec.area}</h4>
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold">
                                {Math.round(rec.score)}% Match
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-slate-400" />
                                <span>{rec.data.metro === true ? 'Metro Access' : rec.data.metro === 'nearby' ? 'Metro Nearby' : 'Car Recommended'}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {rec.data.vibe.slice(0, 2).map(v => (
                                    <span key={v} className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500">{v}</span>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs space-y-1 border-t border-slate-100 pt-3">
                            <p className="text-slate-400">Why it fits:</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                {rec.matchReasons.slice(0, 2).map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 text-xs font-bold flex items-center gap-1">
                            View Flats <ArrowRight size={12} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Wildcard Option */}
            {wildcard && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setSelectedArea(wildcard.area)}
                    className="bg-purple-50 border border-purple-200 rounded-xl p-6 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-600">
                        <MapPin size={100} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                        <div className="bg-white p-3 rounded-full shadow-sm text-2xl">✨</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-purple-900 text-lg mb-1">Wildcard Recommendation: {wildcard.area}</h4>
                            <p className="text-purple-700 text-sm">
                                Maybe consider this? {wildcard.matchReasons.join('. ')}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-purple-600 font-medium">Avg 1BHK Rent</div>
                            <div className="text-xl font-bold text-purple-900">AED {wildcard.data.avg_rent_1bhk.toLocaleString()}</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Decision Trace - Collapsible UI */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <details className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Info size={16} className="text-emerald-600" />
                            <span>How we found these areas (AI Reasoning)</span>
                        </div>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>

                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <div className="space-y-3">
                            {trace.map((t, i) => {
                                // Parse trace string for better formatting if possible, or just style it
                                const [area, reason] = t.split(':');
                                return (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                        <div className="text-slate-600">
                                            <span className="font-semibold text-slate-800">{area}:</span>
                                            <span className="ml-1">{reason}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </details>
            </div>

        </div>
    );
};
