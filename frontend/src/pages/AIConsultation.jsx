import { useState } from "react";
import { motion } from "framer-motion";
import ChatInterface from "../components/chat/ChatInterface";
import HealthInputPanel from "../components/forms/HealthInputPanel";
import { useLanguage } from "../context/LanguageContext";
import { Stethoscope } from "lucide-react";

export default function AIConsultation() {
  const { t, language } = useLanguage();
  const [patientData, setPatientData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleProfileAnalysis = (data) => {
    setPatientData(data);
  };

  return (
    <div className="h-full flex flex-col pb-6">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t.aiConsultation}</h2>
        </div>
        <p className="text-sm text-gray-500">
          {language === "hi"
            ? "Gemini AI द्वारा संचालित इंटरैक्टिव डायग्नोस्टिक सहायता — 50+ स्वास्थ्य श्रेणियों में।"
            : "Interactive diagnostic assistance powered by Gemini Medical AI — covering 50+ health categories."}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <ChatInterface patientData={patientData} selectedCategory={selectedCategory} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-full"
        >
          <HealthInputPanel onAnalyze={handleProfileAnalysis} />
        </motion.div>
      </div>
    </div>
  );
}
