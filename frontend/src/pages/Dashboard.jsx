import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  User,
  Weight,
  Users,
  MessageSquare,
  Send,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import HumanBodySVG from "../components/HumanBodySVG";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("medai_patient_profile");
    if (saved) {
      const data = JSON.parse(saved);
      setAge(data.age || "");
      setWeight(data.weight || "");
      setGender(data.gender || "");
    }
  }, []);

  const handleProfileChange = (field, value) => {
    const saved = localStorage.getItem("medai_patient_profile");
    const current = saved ? JSON.parse(saved) : {};
    current[field] = value;

    if (field === "age") setAge(value);
    if (field === "weight") setWeight(value);
    if (field === "gender") setGender(value);

    localStorage.setItem("medai_patient_profile", JSON.stringify(current));
  };

  const handleQuickConsult = () => {
    if (question.trim()) {
      navigate("/consultation");
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === "hi" ? "सुप्रभात" : "Good Morning";
    if (hour < 17) return language === "hi" ? "शुभ दोपहर" : "Good Afternoon";
    return language === "hi" ? "शुभ संध्या" : "Good Evening";
  };

  const today = new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden">
      {/* Holographic Human Body — Background (shifted down to prevent overlap with greeting) */}
      <div className="absolute left-0 top-[60%] -translate-y-[45%] -translate-x-[2%] w-[480px] h-[630px] z-0 pointer-events-none select-none opacity-70">
        <HumanBodySVG className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {greeting()},{" "}
              <span className="text-gradient">
                {language === "hi" ? "उपयोगकर्ता" : "User"}
              </span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {language === "hi"
                ? "आज आपकी सेहत का ख्याल रखते हैं"
                : "Let's take care of your health today"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-600">📅 {today}</span>
            </div>
            <button
              onClick={() => navigate("/consultation")}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Stethoscope className="h-4 w-4" />
              {t.startConsultation}
            </button>
          </div>
        </motion.div>

        {/* Cards Grid — positioned to the right to not overlap with body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-auto lg:max-w-[75%] xl:max-w-[70%]">

          {/* Patient Info Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card-elevated p-6 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {language === "hi" ? "रोगी की जानकारी" : "Patient Information"}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Age */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  {t.age}
                </label>
                <div className="relative">
                  <input
                    id="dashboard-age"
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    onChange={(e) => handleProfileChange("age", e.target.value)}
                    className="input-premium w-full text-sm"
                    placeholder={language === "hi" ? "जैसे 34" : "e.g. 34"}
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  {t.weight}
                </label>
                <div className="relative">
                  <input
                    id="dashboard-weight"
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => handleProfileChange("weight", e.target.value)}
                    className="input-premium w-full text-sm"
                    placeholder={language === "hi" ? "जैसे 70" : "e.g. 70 kg"}
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  {t.gender}
                </label>
                <select
                  id="dashboard-gender"
                  value={gender}
                  onChange={(e) => handleProfileChange("gender", e.target.value)}
                  className="input-premium w-full text-sm appearance-none cursor-pointer"
                >
                  <option value="">{t.selectGender}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Quick Question Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card-elevated p-6 hover:-translate-y-1 transition-transform duration-300 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {language === "hi" ? "स्वास्थ्य प्रश्न पूछें" : "Ask a Health Question"}
              </h3>
            </div>

            <div className="flex-1 flex flex-col">
              <textarea
                id="dashboard-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-premium w-full flex-1 min-h-[120px] resize-none text-sm"
                placeholder={
                  language === "hi"
                    ? "अपने लक्षण बताएं या स्वास्थ्य प्रश्न पूछें..."
                    : "Describe your symptoms or ask a health question..."
                }
              />

              <button
                id="dashboard-send-question"
                onClick={handleQuickConsult}
                disabled={!question.trim()}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
                {language === "hi" ? "भेजें" : "Send"}
              </button>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card-elevated p-6 hover:-translate-y-1 transition-transform duration-300 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-teal-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {language === "hi" ? "त्वरित कार्य" : "Quick Actions"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: language === "hi" ? "AI परामर्श शुरू करें" : "Start AI Consultation",
                  desc: language === "hi" ? "Gemini AI से स्वास्थ्य सलाह" : "Get health guidance from Gemini AI",
                  icon: Stethoscope,
                  color: "blue",
                  path: "/consultation",
                },
                {
                  label: language === "hi" ? "लक्षण जांच" : "Symptom Checker",
                  desc: language === "hi" ? "50+ श्रेणियों में जांच" : "Check across 50+ categories",
                  icon: Users,
                  color: "indigo",
                  path: "/symptoms",
                },
                {
                  label: language === "hi" ? "स्वास्थ्य रिपोर्ट" : "Health Reports",
                  desc: language === "hi" ? "अपनी रिपोर्ट देखें" : "View your health reports",
                  icon: Weight,
                  color: "teal",
                  path: "/reports",
                },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className={`text-left p-4 rounded-xl border border-${action.color}-100 bg-${action.color}-50/40 hover:bg-${action.color}-50 transition-all duration-200 group`}
                >
                  <div className={`h-8 w-8 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5 flex items-center gap-1">
                    {action.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 text-center z-10"
      >
        {t.disclaimer}
      </motion.p>
    </div>
  );
}
