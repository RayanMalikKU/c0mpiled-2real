import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
    checkHealth: async () => {
        try {
            const response = await axios.get(`${API_URL}/health`);
            return response.data;
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    },

    getRecommendations: async (preferences: any) => {
        try {
            const response = await axios.post(`${API_URL}/recommend`, preferences);
            return response.data;
        } catch (error) {
            console.error('Failed to get recommendations:', error);
            throw error;
        }
    },

    analyzeRisk: async (listingText: string, area: string, brokerDetails?: { brokerName?: string; agentEmail?: string; website?: string }) => {
        try {
            const response = await axios.post(`${API_URL}/analyze-risk`, { listingText, area, ...brokerDetails });
            return response.data;
        } catch (error) {
            console.error('Failed to analyze risk:', error);
            throw error;
        }
    }
};
