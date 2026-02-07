const test = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/analyze-risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                listingText: "Luxury 2BHK in Downtown, amazing view, contact now!",
                area: "Downtown Dubai",
                brokerName: "Betterhomes",
                agentEmail: "agent@betterhomes.ae"
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Result:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
};

test();
