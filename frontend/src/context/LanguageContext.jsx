import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: "MedAI",
    appTagline: "AI Healthcare Assistant",
    dashboard: "Dashboard",
    aiConsultation: "AI Consultation",
    symptomChecker: "Symptom Checker",
    healthHistory: "Health History",
    reports: "Reports",
    settings: "Settings",
    welcomeTitle: "AI-Powered Healthcare Assistant",
    welcomeDesc: "Your personal medical companion for intelligent symptom analysis, health monitoring, and doctor-grade guidance powered by Gemini AI.",
    startConsultation: "Start Consultation",
    viewHealthReport: "View Health Report",
    systemOnline: "System Online & Monitoring",
    chatPlaceholder: "Describe your symptoms or ask a health question...",
    aiAnalyzing: "Dr. MedAI is analyzing",
    greeting: "Hello! I'm Dr. MedAI, your AI-powered healthcare assistant. I can help you understand symptoms, answer health questions, and provide medical guidance across 50+ health categories. Please describe your symptoms or ask me anything about your health. Remember: I'm here to assist, but always consult a qualified doctor for serious conditions.",
    languageToggle: "हिंदी",
    patientProfile: "Patient Health Profile",
    age: "Age",
    weight: "Weight (kg)",
    gender: "Gender",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    primarySymptoms: "Primary Symptoms",
    symptomsPlaceholder: "Describe your symptoms in detail...",
    uploadReport: "Upload Medical Report (Optional)",
    analyzeProfile: "Analyze Profile",
    disclaimer: "AI-generated insights are for informational purposes only. Always consult a qualified healthcare professional for diagnosis and treatment.",
    noActivity: "No Recent Activity",
    noActivityDesc: "Complete your first AI Consultation to see your health history here.",
    startSession: "Start your first session",
    allClear: "All Systems Clear",
    noAlerts: "No urgent alerts detected. Your health monitoring is performing as expected.",
    healthTip: "Health Tip of the Day",
    tipContent: "Drinking 8 glasses of water daily, getting 7-8 hours of sleep, and 30 minutes of physical activity can prevent 80% of chronic diseases.",
    symptomCategories: "Symptom Categories",
    selectCategory: "Select a symptom category",
    analyzeSymptoms: "Analyze Symptoms",
    aiDoctor: "Dr. MedAI",
    geminiPowered: "Gemini AI Medical Engine",
    readyAnalysis: "Ready for Analysis",
    readyAnalysisDesc: "Start a consultation or describe symptoms to generate AI health insights.",
    aiInsights: "AI Health Insights",
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature",
    oxygenSat: "Oxygen Saturation",
    quickActions: "Quick Actions",
    emergencySymptoms: "Emergency Symptoms",
    chronicConditions: "Chronic Conditions",
    mentalHealth: "Mental Health",
    nutrition: "Nutrition & Diet",
  },
  hi: {
    appName: "MedAI",
    appTagline: "AI स्वास्थ्य सहायक",
    dashboard: "डैशबोर्ड",
    aiConsultation: "AI परामर्श",
    symptomChecker: "लक्षण जांचकर्ता",
    healthHistory: "स्वास्थ्य इतिहास",
    reports: "रिपोर्ट्स",
    settings: "सेटिंग्स",
    welcomeTitle: "AI-संचालित स्वास्थ्य सहायक",
    welcomeDesc: "Gemini AI द्वारा संचालित आपका व्यक्तिगत चिकित्सा साथी — बुद्धिमान लक्षण विश्लेषण, स्वास्थ्य निगरानी और डॉक्टर-स्तरीय मार्गदर्शन के लिए।",
    startConsultation: "परामर्श शुरू करें",
    viewHealthReport: "स्वास्थ्य रिपोर्ट देखें",
    systemOnline: "सिस्टम ऑनलाइन और निगरानी में",
    chatPlaceholder: "अपने लक्षण बताएं या स्वास्थ्य संबंधी प्रश्न पूछें...",
    aiAnalyzing: "Dr. MedAI विश्लेषण कर रहा है",
    greeting: "नमस्ते! मैं Dr. MedAI हूँ, आपका AI-संचालित स्वास्थ्य सहायक। मैं 50+ स्वास्थ्य श्रेणियों में लक्षणों को समझने, स्वास्थ्य प्रश्नों का उत्तर देने और चिकित्सा मार्गदर्शन प्रदान करने में आपकी मदद कर सकता हूँ। कृपया अपने लक्षण बताएं या अपने स्वास्थ्य के बारे में कुछ भी पूछें। याद रखें: मैं सहायता के लिए यहाँ हूँ, लेकिन गंभीर स्थितियों के लिए हमेशा किसी योग्य डॉक्टर से परामर्श लें।",
    languageToggle: "English",
    patientProfile: "रोगी स्वास्थ्य प्रोफ़ाइल",
    age: "आयु",
    weight: "वजन (किग्रा)",
    gender: "लिंग",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    primarySymptoms: "प्राथमिक लक्षण",
    symptomsPlaceholder: "अपने लक्षणों का विस्तार से वर्णन करें...",
    uploadReport: "मेडिकल रिपोर्ट अपलोड करें (वैकल्पिक)",
    analyzeProfile: "प्रोफ़ाइल विश्लेषण करें",
    disclaimer: "AI-जनित जानकारी केवल सूचनात्मक उद्देश्यों के लिए है। निदान और उपचार के लिए हमेशा किसी योग्य स्वास्थ्य पेशेवर से परामर्श करें।",
    noActivity: "कोई हालिया गतिविधि नहीं",
    noActivityDesc: "यहाँ अपना स्वास्थ्य इतिहास देखने के लिए अपना पहला AI परामर्श पूरा करें।",
    startSession: "अपना पहला सत्र शुरू करें",
    allClear: "सभी सिस्टम ठीक हैं",
    noAlerts: "कोई तत्काल अलर्ट नहीं मिला। आपकी स्वास्थ्य निगरानी अपेक्षित रूप से काम कर रही है।",
    healthTip: "आज का स्वास्थ्य सुझाव",
    tipContent: "रोजाना 8 गिलास पानी पीना, 7-8 घंटे की नींद लेना और 30 मिनट की शारीरिक गतिविधि 80% पुरानी बीमारियों को रोक सकती है।",
    symptomCategories: "लक्षण श्रेणियां",
    selectCategory: "लक्षण श्रेणी चुनें",
    analyzeSymptoms: "लक्षणों का विश्लेषण करें",
    aiDoctor: "Dr. MedAI",
    geminiPowered: "Gemini AI मेडिकल इंजन",
    readyAnalysis: "विश्लेषण के लिए तैयार",
    readyAnalysisDesc: "AI स्वास्थ्य जानकारी उत्पन्न करने के लिए परामर्श शुरू करें या लक्षण बताएं।",
    aiInsights: "AI स्वास्थ्य जानकारी",
    heartRate: "हृदय गति",
    bloodPressure: "रक्तचाप",
    temperature: "तापमान",
    oxygenSat: "ऑक्सीजन संतृप्ति",
    quickActions: "त्वरित क्रियाएं",
    emergencySymptoms: "आपातकालीन लक्षण",
    chronicConditions: "पुरानी बीमारियां",
    mentalHealth: "मानसिक स्वास्थ्य",
    nutrition: "पोषण और आहार",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
