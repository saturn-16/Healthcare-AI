# 🩺 MedAI — Premium AI Healthcare Assistant (Vercel Deployed)

MedAI is a premium, light-themed, AI-powered healthcare assistant built with **React**, **Vite**, and **Tailwind CSS 4**. It features an elegant dashboard inspired by the **Healthink** design aesthetic, a dynamic holographic human body diagram with floating and scanning animations, and integrates directly with the **Groq API** (Llama-3.3-70b-versatile) for real-time, low-latency streaming diagnostic answers in both English and Hindi.

🚀 **Live Site:** [frontend-silk-tau-72.vercel.app](https://frontend-silk-tau-72.vercel.app)

---

## 🎨 Key Features & UI Improvements

- 🌞 **Premium Light Aesthetic**: Transitioned from a dark theme to a clean white and gray clinical interface with smooth drop shadows.
- 🧑‍🎨 **Interactive Holographic Body**: A beautifully animated, glowing blue human wireframe diagram on the dashboard with 4 layered animations (floating, breathing glow, vertical radar/scanner sweep, and drifting micro-particles).
- 📋 **Elevated Dashboard Cards**: Staggered entrance animations, lift-on-hover effects, and responsive forms for Patient Profiles (Age, Weight, Gender) and Quick Health Questions.
- ⚡ **Groq Llama-3.3 Integration**: Migrated backend services to Groq's high-speed completion API for instant diagnostic advice and responses.
- 🌐 **Bilingual (English + Hindi)**: Fully localizable content and translation capabilities, toggled easily in the topbar or sidebar.

---

## 🛠️ Tech Stack

- **Core**: React 19, Vite 8, Tailwind CSS v4, Framer Motion (animations)
- **APIs**: Groq Cloud SDK (OpenAI-compatible client)
- **Deployment**: Vercel Production Hosting

---

## 📁 Repository Structure

```
├── frontend/             # Standalone React + Vite Single Page Application
│   ├── src/
│   │   ├── components/   # UI elements (Holographic body, Topbar, Sidebar)
│   │   ├── pages/        # Dashboard, AIConsultation, SymptomChecker
│   │   ├── services/     # Groq API streaming logic
│   │   └── context/      # Language & Translation Context
```
