import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPreferences } from '../types';

interface Props {
    onComplete: (prefs: UserPreferences) => void;
}

export const RelocationAssist: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<UserPreferences>>({
        unitType: '1bhk',
        commute: 'metro'
    });

    const handleNext = () => setStep(s => s + 1);
    const handleSubmit = () => {
        if (formData.workLocation && formData.budget) {
            onComplete(formData as UserPreferences);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="glass-panel rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">📍</span>
                    Find Your Ideal Area
                </h2>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Where will you be working?</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., DIFC, Internet City"
                                    value={formData.workLocation || ''}
                                    onChange={e => setFormData({ ...formData, workLocation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">What is your annual rental budget (AED)?</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="e.g., 80000"
                                    value={formData.budget || ''}
                                    onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                />
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!formData.workLocation || !formData.budget}
                                className="btn-primary w-full mt-4"
                            >
                                Next Step
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">What size unit do you need?</label>
                                <div className="flex gap-2">
                                    {['Studio', '1BHK', '2BHK'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFormData({ ...formData, unitType: type.toLowerCase() as any })}
                                            className={`flex-1 py-2 rounded-lg border ${formData.unitType === type.toLowerCase() ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">How do you prefer to commute?</label>
                                <div className="flex gap-2">
                                    {[
                                        { val: 'metro', label: '🚇 Metro / Public' },
                                        { val: 'car', label: '🚗 Car' }
                                    ].map(opt => (
                                        <button
                                            key={opt.val}
                                            onClick={() => setFormData({ ...formData, commute: opt.val as any })}
                                            className={`flex-1 py-2 rounded-lg border ${formData.commute === opt.val ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="label">What vibe are you looking for?</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., quiet, family-friendly, nightlife"
                                    value={formData.vibe || ''}
                                    onChange={e => setFormData({ ...formData, vibe: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                                <button onClick={handleSubmit} className="btn-primary flex-1">Find Areas</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
