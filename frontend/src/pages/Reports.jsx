import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  Trash2, 
  Printer, 
  Plus, 
  History, 
  CheckCircle,
  FileCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../services/db";
import geminiService from "../services/GeminiService";
import ReactMarkdown from "react-markdown";

export default function Reports() {
  const { language, t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const loadData = async () => {
    try {
      const data = await db.getReports();
      setReports(data);
      
      const encounters = await db.getHistory();
      setHistoryCount(encounters.length);
    } catch (e) {
      console.error("Failed to load reports:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === "hi" ? "क्या आप इस रिपोर्ट को हटाना चाहते हैं?" : "Are you sure you want to delete this report?")) {
      try {
        await db.query("DELETE FROM clinical_reports WHERE id = ?", [id]);
        await loadData();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleGenerateReport = async () => {
    const encounters = await db.getHistory();
    if (encounters.length === 0) {
      alert(language === "hi" ? "रिपोर्ट बनाने के लिए कोई इतिहास उपलब्ध नहीं है।" : "No health history available to compile a report.");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    // Load real-time patient metrics from localStorage
    const storedProfile = localStorage.getItem("medai_patient_profile");
    const profile = storedProfile ? JSON.parse(storedProfile) : {};
    
    // Format history data to feed into the prompt
    const formattedHistory = encounters.map((enc, idx) => `
    Assessment #${idx + 1}:
    Date: ${new Date(enc.timestamp).toLocaleDateString()}
    Type: ${enc.type}
    Symptoms: ${enc.symptoms}
    Risk Level: ${enc.risk_level}
    AI Evaluation Notes: ${enc.summary}
    `).join("\n---\n");

    const prompt = language === "hi"
      ? `आप एक वरिष्ठ क्लीनिकल निदेशक हैं। कृपया मरीज (आयु: ${profile.age || 34}, वजन: ${profile.weight || 72}kg, लिंग: ${profile.gender || 'male'}) के स्वास्थ्य इतिहास के आधार पर एक औपचारिक "अस्पताल क्लीनिकल रिपोर्ट" (Hospital Diagnostic & Care Report) तैयार करें।
      
      डेटा:\n${formattedHistory}\n
      
      रिपोर्ट को बिल्कुल निम्नलिखित प्रारूप (Markdown Table & Headers) में व्यवस्थित करें:
      
      # क्लीनिकल प्रगति और स्वास्थ्य निदान रिपोर्ट
      **मेडएआई क्लीनिकल सेंटर (MedAI Clinical Center)**
      
      ### 📋 रोगी का विवरण (PATIENT METRICS SUMMARY)
      | पैरामीटर (Parameter) | मान (Value) |
      | --- | --- |
      | **रोगी का नाम/आईडी** | Guest Patient |
      | **आयु (Age)** | ${profile.age || 34} वर्ष |
      | **वजन (Weight)** | ${profile.weight || 72} किलोग्राम |
      | **लिंग (Gender)** | ${profile.gender || 'male'} |
      | **रिपोर्ट तिथि** | ${new Date().toLocaleDateString('hi-IN')} |
      | **कुल क्लीनिकल आकलन** | ${encounters.length} रिकॉर्ड |
      
      ---
      
      ### 1. 🗂️ प्राथमिक लक्षण सूची (CHIEF SYMPTOMS LOG)
      तैयार करें एक तालिका (Table) जिसमें रोगी के सभी आकलनों के लक्षण सूचीबद्ध हों:
      | आकलन तिथि (Date) | प्रकार (Type) | रिपोर्ट किए गए लक्षण (Symptoms) | जोखिम का स्तर (Risk) |
      [प्रत्येक आकलन के लिए एक रो (row) बनाएं]
      
      ---
      
      ### 2. 📝 मुख्य निदान और अवलोकन (EXECUTIVE DIAGNOSIS & OBSERVATIONS)
      [पैराग्राफ और मुख्य बिंदुओं में रोगी के लक्षणों के रुझान (trends) और संभावित अंतर्निहित कारणों का विश्लेषण करें।]
      
      ---
      
      ### 3. 💊 उपचार और राहत प्रोटोकॉल (CURE & RELIEF ACTION PROTOCOL)
      मरीज को आराम और सुधार के लिए निम्नलिखित श्रेणियों में स्पष्ट दिशानिर्देश दें:
      - **तात्कालिक उपचार/राहत (Immediate Cure/Relief):** [सक्रिय देखभाल निर्देश]
      - **जीवनशैली सुधार (Lifestyle & Hydration):** [आहार, पानी, आराम और स्क्रीन-टाइम आदि]
      - **परहेज और सावधानियां (Precautions):** [क्या करने से बचें]
      
      ---
      
      ### 4. 🏥 डॉक्टर परामर्श गाइड (REFERRAL & CONSULTATION GUIDE)
      - **अनुशंसित परीक्षण (Recommended Investigations):** [जैसे ब्लड टेस्ट, ईसीजी, आई-चेकअप]
      - **लाल झंडे (Red Flags):** [वे लक्षण जिनके दिखने पर तुरंत आपातकालीन विभाग जाना है]
      `
      : `You are a Senior Clinical Director. Generate a formal, highly-structured "Hospital Clinical Report" compiling the patient's (Age: ${profile.age || 34}, Weight: ${profile.weight || 72}kg, Gender: ${profile.gender || 'male'}) health history.
      
      Data:\n${formattedHistory}\n
      
      Ensure you output the report strictly using the following Markdown Hospital Template:
      
      # CLINICAL DISCHARGE & PROGRESS REPORT
      **MedAI Clinical Center**
      
      ### 📋 PATIENT METRICS SUMMARY
      | Patient Metric | Value |
      | --- | --- |
      | **Patient Name/ID** | Guest Patient |
      | **Age** | ${profile.age || 34} Years |
      | **Weight** | ${profile.weight || 72} kg |
      | **Gender** | ${profile.gender || 'male'} |
      | **Report Date** | ${new Date().toLocaleDateString()} |
      | **Total Clinical Encounters** | ${encounters.length} logged |
      
      ---
      
      ### 1. 🗂️ CHIEF SYMPTOMS & ENCOUNTER LOG
      Render a Markdown table summarizing all clinical logs in history:
      | Date | Type | Symptoms Reported | Risk Level |
      [Create a row for each encounter from the history]
      
      ---
      
      ### 2. 📝 EXECUTIVE DIAGNOSIS & CLINICAL OBSERVATIONS
      [Provide a concise clinical overview of the patient's historical trends, symptom frequency, and cardiovascular/physical indicators.]
      
      ---
      
      ### 3. 💊 CURE & RELIEF ACTION PROTOCOL
      Provide clear, actionable medical recommendations divided into these sections:
      - **Immediate Relief/Cure:** [Active care protocols to alleviate current symptoms]
      - **Lifestyle Adjustments:** [Hydration, diet, sleep, screen time limits]
      - **Precautions & Things to Avoid:** [Critical restrictions]
      
      ---
      
      ### 4. 🏥 REFERRAL & DOCTOR CONSULTATION GUIDE
      - **Recommended Investigations:** [List specific tests like ECG, blood panels, visual acuity tests if applicable]
      - **Emergency Indicators (Red Flags):** [When to seek immediate emergency care]
      `;

    try {
      let fullReport = "";
      await geminiService.streamReport(prompt, (chunk) => {
        fullReport += chunk;
        setGeneratedContent(fullReport);
      });

      // Save report in the SQLite database
      await db.addReport({
        timestamp: new Date().toISOString(),
        title: language === "hi" ? "एकीकृत क्लीनिकल स्वास्थ्य रिपोर्ट" : "Integrated Clinical Progress Report",
        content: fullReport,
        source_encounters: JSON.stringify(encounters.map(e => e.id))
      });

      await loadData();
    } catch (e) {
      console.error("Report generation failed:", e);
      alert(language === "hi" ? "रिपोर्ट तैयार करने में त्रुटि।" : "Error generating clinical report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = (content, title) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; font-size: 24px; }
            h2, h3 { color: #2563eb; margin-top: 24px; }
            hr { border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0; }
            ul, ol { padding-left: 20px; }
            code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p style="font-size: 12px; color: #64748b;">Generated on: ${new Date().toLocaleString()}</p>
          <hr />
          <div>${content.replace(/\n/g, "<br/>")}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            {language === "hi" ? "क्लीनिकल ​​रिपोर्ट" : "Clinical Progress Reports"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === "hi"
              ? "आपके स्वास्थ्य इतिहास के आधार पर विस्तृत चिकित्सा और प्रगति रिपोर्ट तैयार करें।"
              : "Compile detailed, multi-encounter health reports compiled from your local SQL database."}
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || historyCount === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>
            {isGenerating 
              ? (language === "hi" ? "रिपोर्ट तैयार हो रही है..." : "Generating...") 
              : (language === "hi" ? "रिपोर्ट तैयार करें" : "Generate Progress Report")}
          </span>
        </button>
      </div>

      {/* History Stats Bar */}
      <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <History className="h-4 w-4 text-gray-400" />
          <span>
            {language === "hi" 
              ? `SQL डेटाबेस रिकॉर्ड: ${historyCount} आकलन उपलब्ध` 
              : `SQL History Status: ${historyCount} assessment records stored`}
          </span>
        </div>
        {historyCount === 0 && (
          <span className="text-amber-600 font-semibold flex items-center gap-1">
            ⚠️ {language === "hi" ? "रिपोर्ट के लिए पहले आकलन सहेजें" : "Log history to unlock reports"}
          </span>
        )}
      </div>

      {/* Generating Real-Time Streaming View */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-elevated p-6 border border-blue-200 bg-blue-50/5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-150 pb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
              <span>AI Compilation in Progress...</span>
            </h3>
            <span className="flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay }}
                  className="h-1.5 w-1.5 bg-blue-500 rounded-full"
                />
              ))}
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-xs md:text-sm font-mono text-gray-700 bg-white border border-gray-100 rounded-2xl p-5 overflow-y-auto max-h-[350px]">
            <ReactMarkdown>{generatedContent || "Reading clinical SQL data..."}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Reports Feed */}
      {reports.length === 0 ? (
        <div className="card-elevated py-16 px-6 text-center space-y-3">
          <FileCheck className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-700">
            {language === "hi" ? "कोई रिपोर्ट नहीं मिली" : "No Reports Compiled Yet"}
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            {language === "hi"
              ? "नियमित प्रगति और डॉक्टर-फाइल सारांश संकलित करने के लिए 'रिपोर्ट तैयार करें' पर क्लिक करें।"
              : "Click the generate button above to compile your symptoms and consultations into a clinical progress report."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => {
            const isExpanded = expandedId === rep.id;
            
            return (
              <div 
                key={rep.id} 
                className="card-elevated border border-gray-200/60 overflow-hidden hover:border-blue-200/50 transition-colors"
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{rep.title}</h4>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(rep.timestamp).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(rep.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    >
                      <span>{isExpanded ? (language === "hi" ? "रिपोर्ट बंद करें" : "Collapse") : (language === "hi" ? "रिपोर्ट खोलें" : "View Report")}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handlePrint(rep.content, rep.title)}
                      className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
                      title="Print / PDF Export"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rep.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="bg-gray-50/50 overflow-hidden"
                    >
                      <div className="p-6 border-t border-gray-150">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm prose prose-sm max-w-none text-xs md:text-sm">
                          <ReactMarkdown>{rep.content}</ReactMarkdown>
                        </div>
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
