import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Stethoscope, 
  Activity, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Play, 
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../services/db";
import ReactMarkdown from "react-markdown";

export default function History() {
  const { language, t } = useLanguage();
  const [encounters, setEncounters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  
  // SQL Console state
  const [showSqlConsole, setShowSqlConsole] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("SELECT id, type, risk_level, symptoms FROM health_history ORDER BY id DESC");
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);

  // Load history from DB
  const loadHistory = async () => {
    try {
      const data = await db.getHistory();
      setEncounters(data);
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === "hi" ? "क्या आप इस रिकॉर्ड को हटाना चाहते हैं?" : "Are you sure you want to delete this encounter?")) {
      // Execute SQL delete query
      try {
        await db.query("DELETE FROM health_history WHERE id = ?", [id]);
        await loadHistory();
        if (sqlResult) await executeSql(); // Refresh console if open
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Run raw SQL queries from the console
  const executeSql = async () => {
    setSqlError(null);
    setSqlResult(null);
    try {
      const result = await db.query(sqlQuery);
      setSqlResult(result);
    } catch (error) {
      setSqlError(error.message || "SQL Execution Error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-500" />
            {language === "hi" ? "स्वास्थ्य इतिहास" : "Health Assessment History"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === "hi"
              ? "आपके स्वास्थ्य इतिहास में सहेजे गए सभी पिछले क्लीनिकल मूल्यांकन।"
              : "Access and query past clinical assessments logged in your health history profile."}
          </p>
        </div>
      </div>

      {/* History timeline feed */}
      {encounters.length === 0 ? (
        <div className="card-elevated py-16 px-6 text-center space-y-3">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-700">
            {language === "hi" ? "कोई इतिहास उपलब्ध नहीं है" : "No encounters logged yet"}
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {language === "hi"
              ? "स्वास्थ्य इतिहास खाली है। परामर्श शुरू करने या लक्षण जांच का उपयोग करने पर यहां इतिहास दिखाई देगा।"
              : "Your health history is currently empty. Complete an AI Consultation or Symptom check to populate your logs."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {encounters.map((enc) => {
            const isExpanded = expandedId === enc.id;
            const isConsult = enc.type === "consultation";
            
            return (
              <div 
                key={enc.id}
                className="card-elevated border border-gray-200/60 overflow-hidden hover:border-blue-200/50 transition-colors"
              >
                {/* Header Row */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      isConsult ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {isConsult ? <Stethoscope className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                    </div>
                    
                    {/* Title & Date */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">
                          {isConsult 
                            ? (language === "hi" ? "एआई चिकित्सा परामर्श" : "Clinical Consultation") 
                            : (language === "hi" ? "सटीक लक्षण विश्लेषण" : "Symptom Check-Up")}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          enc.risk_level === "High" 
                            ? "bg-red-50 text-red-700 border-red-100" 
                            : enc.risk_level === "Moderate"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-green-50 text-green-700 border-green-100"
                        }`}>
                          {enc.risk_level} Risk
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(enc.timestamp).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(enc.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    >
                      <span>{isExpanded ? (language === "hi" ? "विवरण छुपाएं" : "Collapse") : (language === "hi" ? "विवरण देखें" : "View Assessment")}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(enc.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Header Details */}
                <div className="px-5 pb-4 border-b border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                  <div>
                    <span className="font-semibold text-gray-500">{language === "hi" ? "आयु: " : "Age: "}</span>
                    {enc.age}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">{language === "hi" ? "वजन: " : "Weight: "}</span>
                    {enc.weight} kg
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">{language === "hi" ? "लिंग: " : "Gender: "}</span>
                    <span className="capitalize">{enc.gender}</span>
                  </div>
                  <div className="truncate max-w-md">
                    <span className="font-semibold text-gray-500">{language === "hi" ? "लक्षण: " : "Symptoms: "}</span>
                    <span className="text-gray-700 font-medium">{enc.symptoms}</span>
                  </div>
                </div>

                {/* Expanded Details Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="bg-gray-50/50 overflow-hidden"
                    >
                      <div className="p-5 border-t border-gray-100 space-y-4 text-sm text-gray-700 leading-relaxed">
                        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-2">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {language === "hi" ? "क्लीनिकल मूल्यांकन सारांश" : "AI Clinical Evaluation"}
                          </h5>
                          <div className="prose prose-sm max-w-none text-xs md:text-sm">
                            <ReactMarkdown>{enc.summary}</ReactMarkdown>
                          </div>
                        </div>

                        {/* If Chat History exists, show it */}
                        {isConsult && enc.chat_history && JSON.parse(enc.chat_history).length > 2 && (
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              {language === "hi" ? "परामर्श प्रतिलेख" : "Consultation Transcript"}
                            </h5>
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                              {JSON.parse(enc.chat_history).map((msg, i) => {
                                if (msg.id === "greeting") return null;
                                return (
                                  <div key={i} className={`flex flex-col gap-1 max-w-[85%] ${
                                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                                  }`}>
                                    <span className="text-[10px] text-gray-400 font-medium capitalize px-1">{msg.role}</span>
                                    <div className={`p-3 rounded-2xl text-xs ${
                                      msg.role === "user" 
                                        ? "bg-blue-600 text-white rounded-br-none" 
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                    }`}>
                                      {msg.content}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
