import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Stethoscope, Trash2, Copy, CheckCheck } from "lucide-react";
import { cn } from "../../utils/cn";
import geminiService from "../../services/GeminiService";
import { useLanguage } from "../../context/LanguageContext";
import ReactMarkdown from "react-markdown";
import { db } from "../../services/db";

export default function ChatInterface({ patientData, selectedCategory }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const endOfMessagesRef = useRef(null);
  const textareaRef = useRef(null);
  const chatAreaRef = useRef(null);
  const currentSessionId = useRef(null);

  // Update greeting and service language when language changes
  useEffect(() => {
    geminiService.setLanguage(language);
    
    const welcomeMessage = language === "hi"
      ? "नमस्ते! मैं डॉ. मेडएआई हूँ, आपका एआई स्वास्थ्य सहायक। कृपया दाईं ओर **Patient Health Profile** भरें और **Analyze Profile** पर क्लिक करें ताकि मैं आपकी स्थिति की समीक्षा कर सकूं और परामर्श शुरू कर सकूं।"
      : "Hello! I'm Dr. MedAI, your AI-powered healthcare assistant. Please fill in your **Patient Health Profile** on the right and click **Analyze Profile** so I can analyze your vitals and start our consultation.";

    setMessages([
      {
        id: "greeting",
        role: "ai",
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language]);

  // Handle profile submission from panel
  useEffect(() => {
    if (!patientData) return;

    const formattedProfile = `[Patient Health Profile Submitted]
- Age: ${patientData.age || "N/A"}
- Weight: ${patientData.weight || "N/A"} kg
- Gender: ${patientData.gender || "N/A"}
- Blood Group: ${patientData.bloodGroup || "N/A"}
- Primary Symptoms: ${patientData.symptoms || "None"}
- Allergies/History: ${patientData.allergies || "None"}`;

    const alreadySubmitted = messages.some(m => m.content.includes("[Patient Health Profile Submitted]"));
    if (alreadySubmitted) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: formattedProfile,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    triggerProfileConsultation(userMsg);
  }, [patientData]);

  // Automatically save/upsert active session to the SQLite database
  const autoSaveActiveSession = async (latestMessages) => {
    const userMsgs = latestMessages.filter(m => m.role === "user");
    const aiMsgs = latestMessages.filter(m => m.role === "ai" && m.id !== "greeting");
    
    if (userMsgs.length === 0 || aiMsgs.length === 0) return;

    // Skip saving if it's just greetings
    const isTrivial = userMsgs.every(m => {
      const content = m.content.toLowerCase().trim();
      return content === "hi" || content === "hello" || content === "hey" || content === "नमस्ते" || content === "hello doctor";
    });
    if (isTrivial) return;

    const symptomsString = userMsgs.map(m => m.content).join("; ").substring(0, 150);
    const summaryText = aiMsgs[aiMsgs.length - 1].content;
    
    if (!summaryText || summaryText.trim().length === 0) return;

    let risk_level = "Low";
    const lowerText = summaryText.toLowerCase();
    if (lowerText.includes("emergency") || lowerText.includes("immediate care") || lowerText.includes("severe") || lowerText.includes("गंभीर") || lowerText.includes("आपातकालीन")) {
      risk_level = "High";
    } else if (lowerText.includes("moderate") || lowerText.includes("consult a doctor") || lowerText.includes("चिकित्सक से") || lowerText.includes("मध्यम")) {
      risk_level = "Moderate";
    }

    const storedProfile = localStorage.getItem("medai_patient_profile");
    const profile = storedProfile ? JSON.parse(storedProfile) : {};

    const payload = {
      timestamp: new Date().toISOString(),
      age: parseInt(profile.age || patientData?.age) || 34,
      weight: parseInt(profile.weight || patientData?.weight) || 72,
      gender: profile.gender || patientData?.gender || "male",
      type: "consultation",
      symptoms: selectedCategory ? `${selectedCategory}; ${symptomsString}` : symptomsString,
      risk_level: risk_level,
      summary: summaryText,
      chat_history: JSON.stringify(latestMessages)
    };

    if (currentSessionId.current) {
      payload.id = currentSessionId.current;
    }

    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          currentSessionId.current = data.id;
          setIsSaved(true);
        }
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const triggerProfileConsultation = async (userMsg) => {
    setIsTyping(true);
    setMessages((prev) => [...prev, userMsg]);

    const aiMsgId = Date.now() + 1;
    let fullResponse = "";

    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    const promptText = `${userMsg.content}
    
    Please analyze my profile as a professional, friendly, and expert doctor. Address me directly and tell me what you observe, then ask relevant clinical follow-up questions to understand my state better.`;

    try {
      await geminiService.streamResponse(
        promptText,
        (chunk) => {
          setIsTyping(false);
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
            )
          );
        },
        patientData,
        selectedCategory
      );

      // Auto-save session after profile stream completes
      setMessages((prev) => {
        const finalMessages = prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
        );
        autoSaveActiveSession(finalMessages);
        return finalMessages;
      });

    } catch (error) {
      console.error("Profile Chat Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, content: language === "hi" ? "क्षमा करें, आपके प्रोफ़ाइल का विश्लेषण करने में एक त्रुटि हुई।" : "Sorry, I encountered an error analyzing your profile." }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll only the chat container div
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newUserMsg = {
      id: Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    // Auto-resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    const aiMsgId = Date.now() + 1;
    let fullResponse = "";

    // Add placeholder AI message
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    try {
      await geminiService.streamResponse(
        userText,
        (chunk) => {
          setIsTyping(false);
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
            )
          );
        },
        patientData,
        selectedCategory
      );

      // Auto-save session after message stream completes
      setMessages((prev) => {
        const finalMessages = prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, content: fullResponse } : msg
        );
        autoSaveActiveSession(finalMessages);
        return finalMessages;
      });

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, content: language === "hi" ? "क्षमा करें, आपका अनुरोध संसाधित करने में एक त्रुटि हुई।" : "Sorry, I encountered an error processing your request." }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    geminiService.setLanguage(language);
    currentSessionId.current = null;
    setIsSaved(false);

    const welcomeMessage = language === "hi"
      ? "नमस्ते! मैं डॉ. मेडएआई हूँ, आपका एआई स्वास्थ्य सहायक। कृपया दाईं ओर **Patient Health Profile** भरें और **Analyze Profile** पर क्लिक करें ताकि मैं आपकी स्थिति की समीक्षा कर सकूं और परामर्श शुरू कर सकूं।"
      : "Hello! I'm Dr. MedAI, your AI-powered healthcare assistant. Please fill in your **Patient Health Profile** on the right and click **Analyze Profile** so I can analyze your vitals and start our consultation.";

    setMessages([
      {
        id: "greeting",
        role: "ai",
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "44px";
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[calc(100vh-200px)] min-h-[500px] border border-gray-200/70 shadow-lg overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-indigo-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white/60 backdrop-blur-md flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{t.aiDoctor}</h2>
            <p className="text-xs text-blue-500">{t.geminiPowered}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <span className="hidden sm:flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {selectedCategory}
            </span>
          )}
          {isSaved && (
            <span className="flex items-center gap-1 text-[11px] bg-green-50 text-green-600 border border-green-200/50 rounded-full px-2.5 py-1 font-semibold animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>{language === "hi" ? "सहेजा गया" : "Synced to SQL"}</span>
            </span>
          )}
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-5 z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex gap-3 max-w-[88%] group",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === "ai" ? (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                    <Stethoscope className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Bubble */}
              <div className={cn("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed relative",
                    msg.role === "user"
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/15"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm"
                  )}
                >
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:text-blue-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
                      <ReactMarkdown>{msg.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}

                  {/* Copy button */}
                  {msg.content && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-50 rounded-full p-1 shadow-md border border-gray-100"
                    >
                      {copiedId === msg.id ? (
                        <CheckCheck className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 max-w-[88%]"
          >
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-2 shadow-sm">
              <span className="text-xs text-gray-500">{t.aiAnalyzing}</span>
              <span className="flex gap-1">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                    className="h-1.5 w-1.5 bg-blue-500 rounded-full"
                  />
                ))}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-md z-10 flex-shrink-0">
        <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/30 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={t.chatPlaceholder}
            className="flex-1 bg-transparent border-none focus:outline-none resize-none py-3 px-2 text-sm text-gray-800 placeholder:text-gray-400 min-h-[44px] max-h-32"
            rows={1}
            disabled={isTyping}
          />
          <button
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-3">{t.disclaimer}</p>
      </div>
    </div>
  );
}
