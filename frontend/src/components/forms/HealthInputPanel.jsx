import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

import { useEffect } from "react";

export default function HealthInputPanel({ onAnalyze }) {
  const { t, language } = useLanguage();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [allergies, setAllergies] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("medai_patient_profile");
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setAge(data.age || "");
      setWeight(data.weight || "");
      setGender(data.gender || "");
      setBloodGroup(data.bloodGroup || "");
      setSymptoms(data.symptoms || "");
      setAllergies(data.allergies || "");
    }
  }, []);

  const handleProfileChange = (field, value) => {
    const saved = localStorage.getItem("medai_patient_profile");
    const current = saved ? JSON.parse(saved) : {};
    current[field] = value;
    
    // Set local states
    if (field === "age") setAge(value);
    if (field === "weight") setWeight(value);
    if (field === "gender") setGender(value);
    if (field === "bloodGroup") setBloodGroup(value);
    if (field === "symptoms") setSymptoms(value);
    if (field === "allergies") setAllergies(value);

    localStorage.setItem("medai_patient_profile", JSON.stringify(current));
  };

  const handleAnalyze = () => {
    if (onAnalyze) {
      onAnalyze({ age, weight, gender, bloodGroup, symptoms, allergies });
    }
  };

  const label = (text) => (
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
      {text}
    </label>
  );

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-base font-bold text-gray-900 mb-5">{t.patientProfile}</h3>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {/* Age & Weight */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          <div>
            {label(t.age)}
            <input
              id="patient-age"
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(e) => handleProfileChange("age", e.target.value)}
              className="input-premium w-full text-sm"
              placeholder={language === "hi" ? "जैसे 34" : "e.g. 34"}
            />
          </div>
          <div>
            {label(t.weight)}
            <input
              id="patient-weight"
              type="number"
              min="0"
              value={weight}
              onChange={(e) => handleProfileChange("weight", e.target.value)}
              className="input-premium w-full text-sm"
              placeholder={language === "hi" ? "जैसे 70" : "e.g. 70"}
            />
          </div>
        </motion.div>

        {/* Gender */}
        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
          {label(t.gender)}
          <select
            id="patient-gender"
            value={gender}
            onChange={(e) => handleProfileChange("gender", e.target.value)}
            className="input-premium w-full text-sm appearance-none cursor-pointer"
          >
            <option value="">{t.selectGender}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other}</option>
          </select>
        </motion.div>

        {/* Blood Group */}
        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
          {label(language === "hi" ? "रक्त समूह" : "Blood Group")}
          <select
            id="patient-blood-group"
            value={bloodGroup}
            onChange={(e) => handleProfileChange("bloodGroup", e.target.value)}
            className="input-premium w-full text-sm appearance-none cursor-pointer"
          >
            <option value="">{language === "hi" ? "रक्त समूह चुनें" : "Select blood group"}</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </motion.div>

        {/* Primary Symptoms */}
        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
          {label(t.primarySymptoms)}
          <div className="relative">
            <textarea
              id="patient-symptoms"
              value={symptoms}
              onChange={(e) => handleProfileChange("symptoms", e.target.value)}
              className="input-premium w-full h-24 resize-none text-sm"
              placeholder={t.symptomsPlaceholder}
            />
            <button className="absolute bottom-3 right-3 text-gray-400 hover:text-blue-500 transition-colors">
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Allergies / Medical History */}
        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
          {label(language === "hi" ? "एलर्जी / चिकित्सा इतिहास" : "Allergies / Medical History")}
          <textarea
            id="patient-allergies"
            value={allergies}
            onChange={(e) => handleProfileChange("allergies", e.target.value)}
            className="input-premium w-full h-16 resize-none text-sm"
            placeholder={language === "hi" ? "कोई एलर्जी, पुरानी बीमारी..." : "Any allergies, chronic conditions..."}
          />
        </motion.div>
      </div>

      <motion.button
        id="analyze-profile-btn"
        onClick={handleAnalyze}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        {t.analyzeProfile}
      </motion.button>
    </div>
  );
}
