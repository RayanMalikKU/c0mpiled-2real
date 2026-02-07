import axios from 'axios';

const CRUSTDATA_API_BASE = 'https://api.crustdata.com/screener';

const getHeaders = () => ({
    'Authorization': `Token ${process.env.CRUSTDATA_API_TOKEN}`,
    'Content-Type': 'application/json'
});

// Helper: Identify company by name to get domain
async function identifyCompany(name) {
    try {
        console.log(`Searching for company: ${name}`);
        const response = await axios.post(
            `${CRUSTDATA_API_BASE}/identify/`,
            {
                query_company_name: name,
                count: 1
            },
            { headers: getHeaders() }
        );

        if (response.data && response.data.length > 0) {
            return response.data[0]; // Returns { company_website_domain, company_id, ... }
        }
        return null;
    } catch (error) {
        console.error('Crustdata Identify Error:', error.message);
        return null;
    }
}

// Helper: Enrich company by domain
async function enrichCompany(domain) {
    try {
        console.log(`Enriching domain: ${domain}`);
        // Request specific fields to save credits/bandwidth
        const fields = 'year_founded,headcount,linkedin_profile_url,company_type,company_name';
        const response = await axios.get(
            `${CRUSTDATA_API_BASE}/company`,
            {
                params: {
                    company_domain: domain,
                    fields: fields,
                    enrich_realtime: true // Force real-time enrichment if missing
                },
                headers: getHeaders()
            }
        );

        // Crustdata returns a list of companies (usually 1 if exact match)
        // OR an object with "status": "enriching" if it's being enriched
        if (response.data) {
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0];
            }
            // Handle single object response (e.g. enrichment status)
            if (!Array.isArray(response.data)) {
                return response.data;
            }
        }
        return null;
    } catch (error) {
        console.error('Crustdata Enrich Error:', error.message);
        return null; // or throw if we want to bubble up
    }
}

export const validateEntity = async (name, email, website) => {
    if (!process.env.CRUSTDATA_API_TOKEN) {
        console.warn("CRUSTDATA_API_TOKEN not set. Skipping verification.");
        return null;
    }

    let domain = website;
    let identity = null;

    // 1. Try to extract domain from email if no website
    if (!domain && email) {
        const parts = email.split('@');
        if (parts.length === 2) {
            const emailDomain = parts[1];
            // Ignore generic domains
            if (!['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(emailDomain)) {
                domain = emailDomain;
            }
        }
    }

    // 2. If still no domain, but we have a name, identify it
    if (name) {
        // Always try to identify if name is provided, to get fallback data
        identity = await identifyCompany(name);
        if (identity && identity.company_website_domain && !domain) {
            domain = identity.company_website_domain;
        }
    }

    // 3. If we have a domain, enrich it (or try to)
    if (domain) {
        const enriched = await enrichCompany(domain);

        // Check if we got a valid enriched profile
        const isEnrichedStart = enriched && (enriched.status === 'enriching' || enriched.status === 'creating');
        const hasEnrichedData = enriched && enriched.company_name;

        // PRIORITIZE ENRICHED DATA IF AVAILABLE
        if (hasEnrichedData) {
            return {
                found: true,
                company_name: enriched.company_name,
                year_founded: enriched.year_founded,
                employee_count: enriched.employee_count || (enriched.headcount ? enriched.headcount.latest : 0),
                linkedin_url: enriched.linkedin_profile_url,
                domain: domain,
                source: 'enrich'
            };
        }

        // FALLBACK TO IDENTITY DATA IF ENRICHMENT IS PENDING OR FAILED BUT WE HAVE IDENTITY
        if (identity) {
            return {
                found: true,
                company_name: identity.company_name,
                year_founded: identity.founded_year || 2020, // Default if missing in identify, assumes safe
                employee_count: identity.employee_count_range || 0, // identifying returns range usually
                domain: domain,
                source: 'identify_fallback',
                status: isEnrichedStart ? 'enriching' : 'identified'
            };
        }

        // If we only have domain but enrichment is creating...
        if (isEnrichedStart) {
            return {
                found: true,
                company_name: domain, // Fallback name
                status: 'enriching',
                source: 'enrich_pending'
            };
        }
    } else if (identity) {
        // No domain found but identity exists (rare?)
        return {
            found: true,
            company_name: identity.company_name,
            source: 'identify_only'
        };
    }

    return { found: false };
};
