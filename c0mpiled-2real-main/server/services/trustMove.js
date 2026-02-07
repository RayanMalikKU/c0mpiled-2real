import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateRiskScore } from './riskEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const areasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/areas.json'), 'utf-8'));

export const getRecommendations = (preferences) => {
    const scores = [];
    const debugTrace = [];

    // Simple scoring logic based on preferences
    const dubaiAreas = areasData.Dubai;

    for (const [areaName, data] of Object.entries(dubaiAreas)) {
        let score = 0;
        let matchReasons = [];

        // Budget check (rough approximation)
        const avgRent = data[`avg_rent_${preferences.unitType || '1bhk'}`] || data.avg_rent_1bhk;
        if (avgRent <= preferences.budget) {
            score += 30;
            matchReasons.push("Within budget");
        } else if (avgRent <= preferences.budget * 1.2) {
            score += 10;
            matchReasons.push("Slightly over budget but feasible");
        }

        // Metro
        if (preferences.commute === 'metro' && data.metro === true) {
            score += 20;
            matchReasons.push("Direct metro access");
        } else if (preferences.commute === 'metro' && data.metro === 'nearby') {
            score += 10;
            matchReasons.push("Metro nearby");
        }

        // Vibe match
        if (preferences.vibe) {
            const vibeMatch = data.vibe.some(v => preferences.vibe.toLowerCase().includes(v));
            if (vibeMatch) {
                score += 20;
                matchReasons.push("Matches desired vibe");
            }
        }

        scores.push({
            area: areaName,
            score,
            data,
            matchReasons
        });
        debugTrace.push(`Scored ${areaName}: ${score} (${matchReasons.join(', ')})`);
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    // Top 3 + 1 Wildcard (random from remaining or specific logic)
    const top3 = scores.slice(0, 3);

    // Simple wildcard logic: pick a random one from the rest that is within budget
    const remaining = scores.slice(3).filter(s => s.data[`avg_rent_${preferences.unitType || '1bhk'}`] <= preferences.budget * 1.3);
    const wildcard = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : scores[3];

    return {
        recommendations: top3,
        wildcard: wildcard || null,
        trace: debugTrace
    };
};

import { validateEntity } from './crustdata.js';

export const analyzeListingRisk = async (listingText, areaName, brokerDetails = {}) => {
    // 1. Extract simplistic fields from text if not provided structured
    // In a real agent, we'd use an LLM or regex to parse 'listingText' into structured data
    // For this hackathon, we assume 'listingText' is the raw description and we look for keywords
    // We also try to extract price if possible, or expect it passed in 'listing' object

    // For demo: parse a simple price regex: "AED 100,000" or "100k"
    const priceMatch = listingText.match(/(?:AED|Dhs|Price)\s*([\d,]+)/i);
    let price = 0;
    if (priceMatch) {
        price = parseInt(priceMatch[1].replace(/,/g, ''));
    }

    const listing = {
        description: listingText,
        title: "User pasted listing",
        price: price || 0, // Fallback if not found
        type: '1bhk' // Default or parse
    };

    const areaStats = areasData.Dubai[areaName] || areasData.Dubai["Dubai Marina"]; // Fallback to Marina stats if unknown

    // 2. Crustdata Verification
    let crustdataSignals = null;
    const { brokerName, agentEmail, website } = brokerDetails;
    if (brokerName || agentEmail || website) {
        crustdataSignals = await validateEntity(brokerName, agentEmail, website);
    }

    return calculateRiskScore(listing, areaStats, crustdataSignals);
};
