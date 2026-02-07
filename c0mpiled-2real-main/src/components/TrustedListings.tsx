import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '../types';
import { MapPin, ArrowLeft, Building, Bus, Star, ShieldCheck } from 'lucide-react';

interface Props {
    areaName: string;
    onBack: () => void;
}

// Mock clean listings for demo purposes
const MOCK_LISTINGS: Record<string, any[]> = {
    "Dubai Marina": [
        { id: 1, title: "Modern 1BHK with Marina View", price: 115000, type: "1BHK", score: 15, label: "Low Risk" },
        { id: 2, title: "Spacious Studio near Metro", price: 85000, type: "Studio", score: 10, label: "Low Risk" },
        { id: 3, title: "Luxury 2BHK in Cayan Tower", price: 190000, type: "2BHK", score: 20, label: "Low Risk" },
    ],
    "DIFC": [
        { id: 1, title: "Premium 1BHK in Index Tower", price: 145000, type: "1BHK", score: 12, label: "Low Risk" },
        { id: 2, title: "Stylish Studio near Gate Village", price: 95000, type: "Studio", score: 8, label: "Low Risk" },
    ],
    "Business Bay": [
        { id: 1, title: "Canal View 1BHK", price: 105000, type: "1BHK", score: 18, label: "Low Risk" },
        { id: 2, title: "High Floor Studio", price: 75000, type: "Studio", score: 14, label: "Low Risk" },
    ],
    "JLT": [
        { id: 1, title: "Lake View 1BHK Cluster O", price: 88000, type: "1BHK", score: 10, label: "Low Risk" },
        { id: 2, title: "2BHK Family Apartment", price: 135000, type: "2BHK", score: 15, label: "Low Risk" },
    ]
};

export const TrustedListings: React.FC<Props> = ({ areaName, onBack }) => {
    const [office, setOffice] = useState('');
    const [commute, setCommute] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);

    const listings = MOCK_LISTINGS[areaName] || MOCK_LISTINGS["Dubai Marina"];

    const calculateCommute = () => {
        if (!office) return;
        setCalculating(true);
        // Mock calculation delay
        setTimeout(() => {
            // Random "realistic" commute based on text length hashing to be consistent-ish
            const distance = Math.floor(Math.random() * 20) + 10;
            const time = Math.floor(distance * 1.5 + 5);
            setCommute(`${distance} km / ~${time} mins drive`);
            setCalculating(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft size={18} /> Back to Recommendations
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Trusted Flats in <span className="text-emerald-600">{areaName}</span></h2>
                    <p className="text-slate-600">Verifying Listings with TrustMove AI Score</p>
                </div>

                {/* Office Commute Calculator */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full md:w-80">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Check Commute to Office</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Media City"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            value={office}
                            onChange={(e) => setOffice(e.target.value)}
                        />
                        <button
                            onClick={calculateCommute}
                            disabled={!office || calculating}
                            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                        >
                            {calculating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Bus size={18} />}
                        </button>
                    </div>
                    {commute && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center gap-2"
                        >
                            <MapPin size={14} /> {commute}
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {listings.map((listing, idx) => (
                    <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                    >
                        <div className="h-40 bg-slate-200 relative">
                            {/* Placeholder for Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <Building size={48} />
                            </div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 flex items-center gap-1 shadow-sm">
                                <ShieldCheck size={12} /> Trust Score: {listing.score}/100 (Safe)
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900">{listing.title}</h3>
                                    <p className="text-slate-500 text-sm">{listing.type} • {areaName}</p>
                                </div>
                                <div className="text-lg font-bold text-emerald-600">
                                    {listing.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">AED/yr</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 text-xs">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded"> verified owner</span>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded"> rera checked</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
