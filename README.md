# MedAI: Clinical-Grade Diagnostic Triage & Assessment Interface

MedAI is a high-fidelity, light-themed React single-page application (SPA) integrated with an Express backend and SQLite database to facilitate intelligent patient triage, symptom tracking, and diagnostic consultation. Powered by advanced AI inference, the interface translates patient-reported parameters into structured clinical assessments.

*   **Production Deployment:** [https://novusai.vercel.app/](https://novusai.vercel.app/)
*   **Target Models:** `llama-3.3-70b-versatile` (Primary Inference Engine)
*   **Supported Locales:** English, Hindi (Dual-language toggle)

---

## Key Features

1.  **Holographic Anatomical Visualization**
    *   Dynamic holographic human body silhouette integrating a vertical radar scan sweep, pulsing organ state indicators, and floating background micro-particles.
    *   Configured with hardware-accelerated CSS and Framer Motion spring physics.
2.  **Multiclass Symptom Checker**
    *   Client-side search and category filtering indexing 50+ clinical symptom groups.
    *   State-bound selection matrix with prompt guardrails (max 8 categories) to optimize context window limits and prevent API payload inflation.
3.  **Real-Time Streaming Consultation & Live Auto-Saving**
    *   Asynchronous token streaming via an OpenAI-compatible interface connected directly to the AI model.
    *   **Persistent Auto-Saving:** Chat sessions automatically evaluate and log clinical consultations (e.g. diagnoses, relief actions, or explanations) directly to the SQLite database, while filtering out trivial greetings.
4.  **Integrated Telemetry & Profile Sync**
    *   Validated patient parameters (Age, Weight, Gender, Blood Group, and Allergies/History) synchronized in real-time across the AI consultation panel and stored securely in `localStorage` for dynamic contextual injection.
5.  **Structured Hospital Progress Reports**
    *   Automated compilation of historical diagnostic encounters into structured "Hospital Progress Reports" incorporating Markdown patient metrics tables, chief symptoms logs, executive observations, and clinical advice.

---

## Technical Stack

*   **Monorepo Workspaces:** NPM Workspaces (`frontend`, `backend`)
*   **Frontend Engine:** React 19 (Vite 8, Context API state management)
*   **Backend API:** Node.js, Express, CORS
*   **Database Engine:** SQLite (Persistent local file database under `data/database.sqlite`)
*   **Styling & Animation:** Tailwind CSS v4, Framer Motion 12, GSAP (Staggered Navigation)

---

## Repository Structure

```
├── backend/
│   ├── package.json         # Backend Node configuration
│   └── server.js            # Express API server & SQLite database schemas
├── data/
│   └── database.sqlite      # SQLite persistent storage (gitignored)
├── frontend/
│   ├── public/              # Static assets (Anatomical heart, silhouette)
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/        # Markdown-rendering streaming chat interface
│   │   │   ├── forms/       # Patient health input panel
│   │   │   ├── layout/      # Glassmorphic Header topbar, StaggeredMenu
│   │   │   └── HumanBodySVG # Animated holographic overlay
│   │   ├── pages/           # SymptomChecker, History, Reports, and LandingPage
│   │   ├── services/        # AI Service wrappers, prompt templates
│   │   ├── context/         # Multi-language translation state provider
│   │   └── utils/           # Utility helpers (clsx tailwind merging)
│   ├── vercel.json          # Vercel API rewrite proxies
│   └── vite.config.js       # Vite configuration with proxy rules
├── render.yaml              # Infrastructure-as-code Blueprint config for Render
└── vercel.json              # Root-level Vercel API rewrite proxies
```

---

## Setup & Local Development

### Prerequisites
*   Node.js (v18 or higher)
*   NPM (v9 or higher)

### Quick Start (Workspace Run)

1.  Clone the repository and install all workspace dependencies from the root:
    ```bash
    npm install
    ```
2.  Configure Environment Variables:
    Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```
3.  Run both the frontend and backend servers concurrently:
    ```bash
    npm run dev
    ```
    *   Frontend runs at: `http://localhost:5173`
    *   Backend API runs at: `http://localhost:3001`
4.  Build the production distribution:
    ```bash
    npm run build
    ```

---

## Deployment Architecture

```
[Patient / Client UI] (Vercel Frontend)
       │
       ├── (Proxied via /api/* rewrite)
       ▼
[Express REST API] (Render Backend Service)
       │
       ├── (SQL Queries & Transactions)
       ▼
[SQLite Database] (Persistent Disk Storage)
       │
       ├── (Historical Encounters & Reports logs)
       ▼
[AI Model Inference API] (Groq / Gemini)
```
