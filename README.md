# TrustMove UAE 🇦🇪

An AI-powered agentic assistant for relocation and rental trust in the UAE.

## 🎯 Features

### 1. Relocation Assistant ("Relocation Fit")
Helps users decide where to live in Dubai based on:
-   **Work Location**: Commute preference.
-   **Budget**: Real-time rent estimation.
-   **Vibe**: Lifestyle matching (e.g., "Family", "Nightlife").

### 3. Broker Verification (New! 🚀)
Verifies the legitimacy of brokerages and agents in real-time using the **Crustdata Company API**.
-   **Entity Verification**: Checks if the company exists in public records.
-   **Trust Signals**:
    -   🏢 **Established Company**: >5 years old (Reduces Risk)
    -   👥 **Large Team**: >50 employees (Reduces Risk)
    -   ✅ **Verified Entity**: Validated existence (Reduces Risk)

---

## 🛡️ How the Risk Score Works (Scam Rubric)

The "Trust Check" feature uses a deterministic scoring engine (`server/services/riskEngine.js`) combined with **Crustdata Verification**.

**Maximum Risk Score: 100**
-   **0-25**: ✅ **Low Risk**
-   **26-55**: ⚠️ **Medium Risk**
-   **56-100**: 🚨 **High Risk**

### Scoring Rules

| Category | Signal | Points Added |
| :--- | :--- | :--- |
| **💰 Price Anomaly** | Price is **15-25% below** area average | **+15** |
| | Price is **26-40% below** area average | **+25** |
| | Price is **>40% below** area average | **+35** |
| **📞 Contact Method** | "WhatsApp only" / Refuses calls | **+15** |
| **⏳ Urgency** | "Urgent", "Pay today" | **+15** |
| **📜 License Check** | No RERA / Permit / ORN number mentioned | **+15** |
| **👀 Viewing Issues** | "No viewing", "Keys with security" | **+20** |
| **💸 Payment Flags** | Asks for **deposit before viewing** | **+25** (Critical) |
| | Asks for **Crypto / Wire Transfer** | **+35** (Critical) |
| **✅ Trust Signals** | **Verified Entity** (Crustdata) | **-20** (Reduces Risk) |
| | **Established Company** (>5 years) | **-10** (Reduces Risk) |
| | **Large Team** (>50 employees) | **-10** (Reduces Risk) |

### Example Calculation

> *Listing: "1BHK in Marina for 40k. Agent from Betterhomes."*

-   **Base Score**: 10
-   **Price Check**: ~66% below average (+35)
-   **Trust Verification**: "Betterhomes" verified via Crustdata (-20), Established (-10), Large Team (-10).
-   **Total Score**: **5** -> ✅ **LOW RISK** (Trust signals outweighed price anomaly).

---

## 🚀 Getting Started

### Prerequisites
-   Node.js 16+
-   **Crustdata API Token**

### Installation

1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    CRUSTDATA_API_TOKEN=your_token_here
    ```
4.  Start the development server (Frontend + Backend):
    ```bash
    npm run dev:full
    ```

### Tech Stack
-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express
-   **APIs**: **Crustdata Company API** (Verification)
-   **Data**: Internal JSON dataset for Dubai areas
****
