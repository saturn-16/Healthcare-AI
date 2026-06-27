# MedAI: Clinical-Grade Diagnostic Triage & Assessment Interface

MedAI is a high-fidelity, light-themed React single-page application (SPA) designed to facilitate intelligent patient triage, symptom tracking, and diagnostic consultation. Powered by the Groq Llama-3.3-70B model, the interface translates patient-reported parameters into structured clinical assessments.

*   **Production Deployment:** [frontend-silk-tau-72.vercel.app](https://frontend-silk-tau-72.vercel.app)
*   **Target Models:** `llama-3.3-70b-versatile` (Primary Inference Engine)
*   **Supported Locales:** English, Hindi (dual-locale contextual switching)

---

## Key Features

1.  **Holographic Anatomical Visualization**
    *   Dynamic holographic human body silhouette integrating a vertical radar scan sweep, pulsing organ state indicators, and floating background micro-particles.
    *   Configured with hardware-accelerated CSS and Framer Motion spring physics.
2.  **Multiclass Symptom Checker**
    *   Client-side search and category filtering indexing 50+ clinical symptom groups.
    *   State-bound selection matrix with prompt guardrails (max 8 categories) to optimize context window limits and prevent API payload inflation.
3.  **Real-Time Streaming Consultation**
    *   Asynchronous token streaming via an OpenAI-compatible interface connected directly to Groq.
    *   Thread state preservation holding up to 10 context cycles for coherent conversational diagnostic paths.
4.  **Telemetry Profile Form**
    *   Validated telemetry inputs (Age, Weight, Gender, Blood Group, and Allergies/History) injected directly into the LLM system prompt for personalized risk profiling.

---

## Technical Stack

*   **Runtime Environment:** Node.js (Vite 8 SPA bundling)
*   **Frontend Engine:** React 19 (Functional Hooks, Context API state management)
*   **Styling Engine:** Tailwind CSS v4 (Light-theme clinical palette, glassmorphism layout, elevated drop shadows)
*   **Animation Engine:** Framer Motion 12
*   **Inference API Integration:** Groq SDK (OpenAI-compatible client-side runner)

---

## Repository Structure

```
├── frontend/
│   ├── public/              # Static assets (Holographic human body silhouette)
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/        # Markdown-rendering streaming Chat interface
│   │   │   ├── forms/       # Staggered-entry Patient profile panel
│   │   │   ├── layout/      # Light-themed Sidebar, Topbar, and MainLayout
│   │   │   └── HumanBodySVG # Animated holographic overlay
│   │   ├── pages/           # Dashboard routing, SymptomChecker page, Consultation page
│   │   ├── services/        # Groq client instance, prompt configuration
│   │   ├── context/         # Multi-language translation state provider
│   │   └── utils/           # Utility helpers (clsx tailwind merging)
```

---

## Setup & Local Development

### Prerequisites
*   Node.js (v18 or higher)
*   NPM or Yarn

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Build production bundle:
    ```bash
    npm run build
    ```

---

## System Architecture

```
[Patient / Client UI]
      │
      ├── (User Input & Symptom Selection)
      ▼
[React Context / Page State]
      │
      ├── (Localized System Prompts & Patient Telemetry)
      ▼
[Groq Service Integration (Llama-3.3-70B)]
      │
      ├── (Asynchronous Token Streaming)
      ▼
[Markdown Parser (ReactMarkdown)]
      │
      ├── (Rendered Clinical Report View)
      ▼
[Viewport Display]
```
