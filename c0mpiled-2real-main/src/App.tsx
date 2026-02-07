import React, { useState } from 'react';
import { RelocationAssist } from './components/RelocationAssist';
import { AgentOutput } from './components/AgentOutput';
import { TrustCheck } from './components/TrustCheck';
import { api } from './services/api';
import { UserPreferences } from './types';
import { ShieldCheck, Map } from 'lucide-react';

function App() {
    const [view, setView] = useState<'relocation' | 'trust'>('relocation');
    const [recommendations, setRecommendations] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRelocationComplete = async (prefs: UserPreferences) => {
        setLoading(true);
        try {
            const results = await api.getRecommendations(prefs);
            setRecommendations(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            T
                        </div>
                        <h1 className="font-bold text-slate-800 text-xl tracking-tight">TrustMove <span className="text-emerald-600">UAE</span></h1>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setView('relocation')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2
                ${view === 'relocation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Map size={16} /> Relocation
                        </button>
                        <button
                            onClick={() => setView('trust')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2
                ${view === 'trust' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ShieldCheck size={16} /> Trust Check
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                {view === 'relocation' ? (
                    <div className="space-y-8">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                                Move with Confidence in Dubai
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Your AI agent for finding the perfect neighborhood and avoiding rental scams.
                            </p>
                        </div>

                        {!recommendations && (
                            <RelocationAssist onComplete={handleRelocationComplete} />
                        )}

                        {loading && (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-500 font-medium">Analyzing Dubai areas for you...</p>
                            </div>
                        )}

                        {recommendations && (
                            <div className="animate-fade-in">
                                <AgentOutput recommendations={recommendations} />
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={() => setRecommendations(null)}
                                        className="text-slate-500 hover:text-slate-800 text-sm underline"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Cross-sell Trust Check if recommendations done */}
                        {recommendations && (
                            <div className="mt-12 p-1 border-t border-slate-200">
                                <TrustCheck selectedArea={recommendations.recommendations[0]?.area} />
                            </div>
                        )}
                    </div>
                ) : (
                    <TrustCheck />
                )}
            </main>
        </div>
    );
}

export default App;
