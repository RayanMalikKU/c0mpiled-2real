import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getRecommendations, analyzeListingRisk } from './services/trustMove.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// 1. Relocation Recommendations
app.post('/api/recommend', (req, res) => {
    try {
        const preferences = req.body; // { budget, unitType, commute, vibe, etc. }

        if (!preferences) {
            return res.status(400).json({ error: "Preferences required" });
        }

        const results = getRecommendations(preferences);
        res.json(results);
    } catch (error) {
        console.error("Recommendation error:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

// 2. Listing Risk Analysis
app.post('/api/analyze-risk', async (req, res) => {
    try {
        const { listingText, area, brokerName, agentEmail, website } = req.body;
        console.log("Received listing for analysis:", { area, textLength: listingText?.length });

        if (!listingText) {
            return res.status(400).json({ error: "Listing text required" });
        }

        const results = await analyzeListingRisk(listingText, area, { brokerName, agentEmail, website });
        res.json(results);

    } catch (error) {
        console.error("Risk analysis error:", error);
        res.status(500).json({ error: "Failed to analyze risk" });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'TrustMove UAE Agent'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`TrustMove UAE API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
