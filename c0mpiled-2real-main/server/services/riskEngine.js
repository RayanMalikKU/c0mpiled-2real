export const calculateRiskScore = (listing, areaStats, crustdataSignals = null) => {
    let score = 10;
    const signals = [];
    const trace = [];

    // Helper to add risk
    const addRisk = (points, reason, severity) => {
        score += points;
        signals.push({ reason, severity, points });
        trace.push(`Added ${points} points: ${reason}`);
    };

    // Helper to reduce risk (trust signal)
    const reduceRisk = (points, reason, type = "Trust") => {
        score -= points;
        signals.push({ reason, severity: type, points: -points });
        trace.push(`Subtracted ${points} points: ${reason}`);
    };

    // 0. Crustdata Verification
    if (crustdataSignals) {
        if (crustdataSignals.found) {
            reduceRisk(20, `Verified Entity: ${crustdataSignals.company_name}`, "Trust");

            const age = new Date().getFullYear() - (crustdataSignals.year_founded || new Date().getFullYear());
            if (age > 5) reduceRisk(10, `Established Company (>5 years)`, "Trust");
            else if (age > 1) reduceRisk(5, `Established Company (>1 year)`, "Trust");

            // Employee count can be a number or string range depending on endpoint
            // If it is a string range like "51-200", we can parse it roughly
            let employees = 0;
            const empRaw = crustdataSignals.employee_count;
            if (typeof empRaw === 'number') employees = empRaw;
            else if (typeof empRaw === 'string') {
                const match = empRaw.match(/(\d+)/);
                if (match) employees = parseInt(match[1]);
            }

            if (employees > 50) reduceRisk(10, `Large Team (>50 employees)`, "Trust");
            else if (employees > 5) reduceRisk(5, `Verifiable Team (>5 employees)`, "Trust");

        } else {
            addRisk(15, "Brokerage/Entity not found in public registry", "High");
        }
    }

    // 1. Price Anomaly Check
    if (areaStats && listing.price) {
        const avgPrice = areaStats[`avg_rent_${listing.type.toLowerCase()}`] || areaStats.avg_rent_1bhk;
        if (avgPrice) {
            const discount = (avgPrice - listing.price) / avgPrice;
            if (discount >= 0.40) addRisk(35, "Price >40% below market average", "High");
            else if (discount >= 0.26) addRisk(25, "Price 26-40% below market average", "High");
            else if (discount >= 0.15) addRisk(15, "Price 15-25% below market average", "Medium");
        }
    }

    const text = (listing.description + " " + listing.title).toLowerCase();

    // 2. Contact Method
    if (text.includes("whatsapp only") || text.includes("no calls")) {
        addRisk(15, "WhatsApp only / Refuses calls", "Medium");
    }

    // 3. Urgency
    if (text.includes("urgent") || text.includes("pay today") || text.includes("many people waiting")) {
        addRisk(15, "High pressure urgency tactics", "Medium");
    }

    // 4. Verification Check
    if (!text.includes("rera") && !text.includes("permit") && !text.includes("orn")) {
        // If we verified via Crustdata, this is less critical
        if (crustdataSignals && crustdataSignals.found) {
            addRisk(5, "No Broker License details in text (but Entity Verified)", "Low");
        } else {
            addRisk(15, "No Broker License/RERA details found", "High");
        }
    }

    // 5. Viewing Issues
    if (text.includes("no viewing") || text.includes("keys with security") || text.includes("owner abroad")) {
        addRisk(20, "Viewing restrictions / Owner abroad claim", "High");
    }

    // 6. Payment Red Flags
    if (text.includes("deposit before viewing") || text.includes("transfer before")) {
        addRisk(25, "Asks for deposit before viewing", "Critical");
    }
    if (text.includes("bitcoin") || text.includes("crypto") || text.includes("wire transfer")) {
        addRisk(35, "Untraceable payment method requested", "Critical");
    }

    // Clamp Score
    score = Math.min(100, Math.max(0, score));

    // Determine Label
    let label = "Low";
    if (score > 55) label = "High";
    else if (score > 25) label = "Medium";

    return {
        score,
        label,
        signals,
        trace
    };
};
