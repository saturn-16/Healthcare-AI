import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X, Stethoscope, Send, Bot } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SYMPTOM_CATEGORIES } from "../services/GeminiService";
import geminiService from "../services/GeminiService";
import ReactMarkdown from "react-markdown";
import { db } from "../services/db";

export default function SymptomChecker() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const resultRef = useRef(null);

  // Sync language with gemini service
  useEffect(() => {
    geminiService.setLanguage(language);
  }, [language]);

  const filtered = SYMPTOM_CATEGORIES.filter((cat) => {
    const query = search.toLowerCase();
    const nameMatch = language === "hi"
      ? cat.labelHi.toLowerCase().includes(query)
      : cat.label.toLowerCase().includes(query);
    const keywordMatch = cat.keywords.some((k) => k.toLowerCase().includes(query));
    return nameMatch || keywordMatch;
  });

  const toggleCategory = (cat) => {
    setSelected((prev) =>
      prev.find((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : prev.length < 8 ? [...prev, cat] : prev
    );
  };

  const handleAnalyze = async () => {
    if (selected.length === 0 && !freeText.trim()) return;
    setIsAnalyzing(true);
    setResult("");

    const categoryNames = selected.map((c) =>
      language === "hi" ? c.labelHi : c.label
    ).join(", ");

    const prompt = language === "hi"
      ? `मुझे निम्नलिखित लक्षण हो रहे हैं:\n${categoryNames ? `श्रेणियां: ${categoryNames}` : ""}${freeText ? `\nविवरण: ${freeText}` : ""}\n\nकृपया एक विस्तृत चिकित्सा मूल्यांकन, संभावित कारण, और अनुशंसित अगले कदम हिंदी में बताएं।`
      : `I am experiencing the following symptoms:\n${categoryNames ? `Categories: ${categoryNames}` : ""}${freeText ? `\nDescription: ${freeText}` : ""}\n\nPlease provide a detailed medical assessment, possible causes, recommended investigations, and next steps.`;

    try {
      let fullText = "";
      await geminiService.streamResponse(prompt, (chunk) => {
        fullText += chunk;
        setResult(fullText);
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      // Save to SQL Database
      const symptomsString = [categoryNames, freeText].filter(Boolean).join("; ");
      let risk_level = "Low";
      const lowerText = fullText.toLowerCase();
      if (lowerText.includes("emergency") || lowerText.includes("immediate care") || lowerText.includes("severe") || lowerText.includes("गंभीर") || lowerText.includes("आपातकालीन")) {
        risk_level = "High";
      } else if (lowerText.includes("moderate") || lowerText.includes("consult a doctor") || lowerText.includes("चिकित्सक से") || lowerText.includes("मध्यम")) {
        risk_level = "Moderate";
      }

      const storedProfile = localStorage.getItem("medai_patient_profile");
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      await db.addEncounter({
        timestamp: new Date().toISOString(),
        age: parseInt(profile.age) || 34,
        weight: parseInt(profile.weight) || 72,
        gender: profile.gender || "male",
        type: "symptoms",
        symptoms: symptomsString || "Self-reported symptoms",
        risk_level: risk_level,
        summary: fullText,
        chat_history: "[]"
      });

    } catch (e) {
      setResult(language === "hi" ? "विश्लेषण में त्रुटि।" : "Error during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setSelected([]);
    setFreeText("");
    setResult("");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="h-6 w-6 text-blue-500" />
          {t.symptomChecker}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {language === "hi"
            ? "50+ स्वास्थ्य श्रेणियों में से अपने लक्षण चुनें और AI से तुरंत मूल्यांकन पाएं।"
            : "Select from 50+ health categories and get instant AI-powered medical assessment."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Picker */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="symptom-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "hi" ? "लक्षण खोजें..." : "Search symptoms..."}
              className="input-premium w-full pl-11 text-sm"
            />
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((cat) => (
                <motion.span
                  key={cat.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium rounded-full px-3 py-1.5"
                >
                  {language === "hi" ? cat.labelHi : cat.label}
                  <button onClick={() => toggleCategory(cat)}>
                    <X className="h-3 w-3 hover:text-red-500 transition-colors" />
                  </button>
                </motion.span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2"
              >
                {language === "hi" ? "सब साफ करें" : "Clear all"}
              </button>
            </div>
          )}

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filtered.map((cat) => {
              const isSelected = !!selected.find((c) => c.id === cat.id);
              return (
                <motion.button
                  key={cat.id}
                  id={`symptom-cat-${cat.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleCategory(cat)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  <span className="block truncate">
                    {language === "hi" ? cat.labelHi : cat.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-blue-500 mt-0.5 block">✓ Selected</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>{language === "hi" ? "कोई परिणाम नहीं मिला" : "No results found"}</p>
            </div>
          )}
        </div>

        {/* Right: Analysis Panel */}
        <div className="space-y-4">
          {/* Free-text description */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              {language === "hi" ? "लक्षणों का विवरण" : "Describe Your Symptoms"}
            </h3>
            <textarea
              id="symptom-free-text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder={language === "hi" ? "अपने लक्षणों का विस्तार से वर्णन करें — कब शुरू हुए, तीव्रता, अन्य जानकारी..." : "Describe in detail — when it started, severity, any other context..."}
              className="input-premium w-full h-32 resize-none text-sm"
            />

            {/* Selected summary */}
            {selected.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {selected.length} {language === "hi" ? "श्रेणियां चुनी गई" : "categories selected"}
              </p>
            )}

            <button
              id="analyze-symptoms-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || (selected.length === 0 && !freeText.trim())}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Stethoscope className="h-4 w-4" />
                  </motion.span>
                  {language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t.analyzeSymptoms}
                </>
              )}
            </button>
          </div>

          {/* Result */}
          <AnimatePresence>
            {(result || isAnalyzing) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-2xl p-5"
                ref={resultRef}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">{t.aiDoctor}</h3>
                  {isAnalyzing && (
                    <span className="ml-auto flex gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d }} className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                      ))}
                    </span>
                  )}
                </div>
                <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-li:my-0.5 prose-headings:text-blue-600 prose-strong:text-gray-900 text-gray-600 max-h-[50vh] overflow-y-auto">
                  <ReactMarkdown>{result || "…"}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
