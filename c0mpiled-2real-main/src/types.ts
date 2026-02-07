export interface Recommendation {
    area: string;
    score: number;
    data: {
        avg_rent_1bhk: number;
        avg_rent_2bhk: number;
        metro: boolean | string;
        vibe: string[];
        good_for: string[];
        notes: string[];
    };
    matchReasons: string[];
}

export interface RiskSignal {
    reason: string;
    severity: "Low" | "Medium" | "High" | "Critical" | "Trust";
    points: number;
}

export interface RiskAnalysisResult {
    score: number;
    label: "Low" | "Medium" | "High";
    signals: RiskSignal[];
    trace: string[];
}

export interface UserPreferences {
    workLocation: string;
    budget: number;
    unitType: '1bhk' | '2bhk' | 'studio';
    commute: 'metro' | 'car';
    vibe: string;
}

export interface BrokerDetails {
    brokerName?: string;
    agentEmail?: string;
    website?: string;
}
