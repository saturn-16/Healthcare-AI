import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Stethoscope, ArrowRight, Activity, Shield, Brain, FileText, Sparkles, Globe } from "lucide-react";
import RotatingText from "../components/layout/RotatingText";
import CardSwap, { Card } from "../components/layout/CardSwap";
import { useLanguage } from "../context/LanguageContext";

export default function LandingPage() {
  const { t, language } = useLanguage();

  // Dynamic rotating words that reflect advanced clinical features
  const rotatingWords = language === "hi"
    ? ["सटीक", "बुद्धिमान", "त्वरित", "सुरक्षित"]
    : ["Precision", "Intelligent", "Instant", "Empathetic"];

  const heroHeading = language === "hi"
    ? "हर निदान की शुरुआत समझ से होती है।"
    : "Every Diagnosis Begins with Understanding.";

  const heroParagraph = language === "hi"
    ? "चिकित्सा डेटा का विश्लेषण करने, स्वास्थ्य पेशेवरों की सहायता करने और तेजी से, अधिक सूचित निर्णय लेने के लिए एआई की शक्ति का उपयोग करें - क्योंकि प्रत्येक रोगी समय पर और दयालु देखभाल का हकदार है।"
    : "Harness the power of AI to analyze medical data, assist healthcare professionals, and deliver faster, more informed decisions—because every patient deserves timely and compassionate care.";

  return (
    <div className="relative w-full flex flex-col gap-10 py-6 md:py-8 overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: Hero Section */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-medium text-xs w-fit"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "उन्नत चिकित्सा एआई प्लेटफॉर्म" : "Advanced Medical AI Platform"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-x-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">
              <RotatingText
                texts={rotatingWords}
                mainClassName="px-3 bg-blue-600 text-white rounded-xl overflow-hidden py-1 justify-center inline-flex font-bold"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
              <span className="mt-1">{language === "hi" ? "स्वास्थ्य एआई" : "Healthcare AI"}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug pt-2">
              {heroHeading}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-gray-500 leading-relaxed max-w-xl"
          >
            {heroParagraph}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              to="/consultation"
              className="btn-primary flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-blue-500/20 px-6 py-3"
            >
              <Stethoscope className="h-5 w-5" />
              <span>{t.startConsultation}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link
              to="/symptoms"
              className="btn-secondary flex items-center gap-2 hover:scale-105 transition-all px-6 py-3"
            >
              <span>{language === "hi" ? "लक्षणों की जाँच करें" : "Symptom Checker"}</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-6 pt-4 text-gray-400 text-xs font-semibold uppercase tracking-wider"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-500" />
              <span>{language === "hi" ? "डेटा एन्क्रिप्टेड" : "Data Encrypted"}</span>
            </div>
            <div>•</div>
            <div>{language === "hi" ? "त्वरित एआई ट्राइएज" : "Instant AI Triage"}</div>
          </motion.div>
        </div>

        {/* Right Side: Holographic Heart Image with Animated SVG Pipelines */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[450px] lg:min-h-[650px] w-full">
          {/* Subtle glow behind the heart */}
          <div className="absolute w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[600px] aspect-square relative flex items-center justify-center overflow-hidden bg-transparent"
          >
            <style>{`
              @keyframes strokeFlow {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .flowing-path {
                animation: strokeFlow 1.4s linear infinite;
              }
            `}</style>

            {/* Static Holographic Heart Image with inverted background blended seamlessly */}
            <img
              src="/heart.png"
              alt="Holographic Heart"
              style={{ 
                filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.4)",
                clipPath: "inset(0 0 22% 0)"
              }}
              className="w-full h-full object-contain opacity-95 select-none mix-blend-multiply translate-y-[5%] scale-[1.1]"
            />

            {/* Glowing animated pipeline overlays mapping directly through the heart channels */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Pipeline 1: Aorta Flow (Arching from center-top to top-right) */}
              <path
                d="M 52 35 C 57 19, 68 20, 71 35"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="1.0"
                opacity="0.8"
              />
              <path
                d="M 52 35 C 57 19, 68 20, 71 35"
                fill="none"
                stroke="#2563eb"
                strokeWidth="0.6"
                strokeDasharray="4 6"
                className="flowing-path"
                filter="url(#neon-glow)"
              />

              {/* Pipeline 2: Vena Cava Flow (Left side vertical path) */}
              <path
                d="M 33 28 C 26 48, 28 64, 34 78"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="1.0"
                opacity="0.8"
              />
              <path
                d="M 33 28 C 26 48, 28 64, 34 78"
                fill="none"
                stroke="#2563eb"
                strokeWidth="0.6"
                strokeDasharray="4 6"
                className="flowing-path"
                filter="url(#neon-glow)"
              />

              {/* Pipeline 3: Front Diagonals (Coronary branches) */}
              <path
                d="M 45 42 C 40 58, 38 68, 48 88"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="1.0"
                opacity="0.8"
              />
              <path
                d="M 45 42 C 40 58, 38 68, 48 88"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.6"
                strokeDasharray="5 7"
                className="flowing-path"
                filter="url(#neon-glow)"
              />

              {/* Pipeline 4: Right ventricle diagonal branch */}
              <path
                d="M 43 54 C 48 64, 52 72, 54 84"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="1.0"
                opacity="0.8"
              />
              <path
                d="M 43 54 C 48 64, 52 72, 54 84"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.6"
                strokeDasharray="4 6"
                className="flowing-path"
                filter="url(#neon-glow)"
              />

              {/* Pipeline 5: Right side coronary curve */}
              <path
                d="M 56 46 C 66 56, 64 68, 60 80"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="1.0"
                opacity="0.8"
              />
              <path
                d="M 56 46 C 66 56, 64 68, 60 80"
                fill="none"
                stroke="#2563eb"
                strokeWidth="0.6"
                strokeDasharray="4 6"
                className="flowing-path"
                filter="url(#neon-glow)"
              />

              {/* Pipeline 6: Fine capillaries branch */}
              <path
                d="M 48 62 C 43 72, 42 78, 40 85"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="0.8"
                opacity="0.7"
              />
              <path
                d="M 48 62 C 43 72, 42 78, 40 85"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.5"
                strokeDasharray="3 5"
                className="flowing-path"
                filter="url(#neon-glow)"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Features & Solutions Section */}
      <div className="w-full mt-4 md:mt-6 border-t border-gray-100/80 pt-10 md:pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Solution Descriptions */}
          <div className="lg:col-span-5 space-y-6 max-w-[480px]">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 uppercase">
              <Sparkles className="h-3 w-3" />
              <span>{language === "hi" ? "एआई स्वास्थ्य समाधान" : "Intelligent Platform Solutions"}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {language === "hi" 
                ? "क्लीनिकल सहायता जो रोगियों और डॉक्टरों को सशक्त बनाती है"
                : "Clinical Assistance Empowering Patients & Doctors"}
            </h2>
            
            <p className="text-sm text-gray-500 leading-relaxed">
              {language === "hi"
                ? "हमारा सुरक्षित हेल्थकेयर एआई प्लेटफॉर्म जटिल चिकित्सा डेटा को सुलझाता है, जिससे आपके स्वास्थ्य को प्रबंधित करना और चिकित्सा नियुक्तियों के लिए तैयार होना आसान हो जाता है।"
                : "Our secure healthcare AI platform simplifies complex medical data, making it effortless to manage your health and prepare for clinical appointments with confidence."}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-xs text-gray-400 font-medium">
                  {language === "hi" ? "डेटा एन्क्रिप्शन गोपनीयता" : "Privacy & Encryption"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">&lt; 10s</div>
                <div className="text-xs text-gray-400 font-medium">
                  {language === "hi" ? "त्वरित एआई प्रतिक्रिया" : "Instant Response Time"}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center items-center relative min-h-[400px] w-full" style={{ contain: 'layout' }}>
            <div style={{ height: '420px', width: '460px', position: 'relative', overflow: 'visible' }} className="flex items-center justify-center translate-x-0 md:translate-x-4 mx-auto">
              <CardSwap
                width={460}
                height={320}
                cardDistance={35}
                verticalDistance={30}
                delay={1600}
              >
                {/* Card 1 */}
                <Card className="flex flex-col justify-between h-full bg-transparent shadow-none border-none p-0">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950/40 text-blue-400 shadow-inner">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {language === "hi" ? "सटीक लक्षण विश्लेषण" : "Symptom Analysis"}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {language === "hi"
                        ? "उन्नत चिकित्सा एआई मॉडलों का उपयोग करके जटिल लक्षणों का त्वरित विश्लेषण करें और प्राथमिकता स्तरों पर सुरक्षित मार्गदर्शन प्राप्त करें।"
                        : "Analyze multi-symptom clinical inputs to generate safe, prioritized triage guidance and potential diagnostic directions in seconds."}
                    </p>
                  </div>
                  <Link to="/symptoms" className="flex items-center text-xs font-semibold text-blue-400 gap-1 mt-4 hover:underline w-fit">
                    <span>{language === "hi" ? "लक्षण जांचें" : "Explore Symptom Checker"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Card>

                {/* Card 2 */}
                <Card className="flex flex-col justify-between h-full bg-transparent shadow-none border-none p-0">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-950/40 text-indigo-400 shadow-inner">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {language === "hi" ? "एआई चिकित्सा परामर्श" : "Interactive Consultation"}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {language === "hi"
                        ? "डॉक्टर से मिलने से पहले अपने लक्षणों और सवालों को संरचित करें, ताकि आपकी चर्चा अधिक उद्देश्यपूर्ण और केंद्रित हो।"
                        : "Prepare thoroughly for physician appointments with dynamic preparation tools, symptom histories, and structured questions."}
                    </p>
                  </div>
                  <Link to="/consultation" className="flex items-center text-xs font-semibold text-indigo-400 gap-1 mt-4 hover:underline w-fit">
                    <span>{language === "hi" ? "परामर्श शुरू करें" : "Start Consultation"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Card>

                {/* Card 3 */}
                <Card className="flex flex-col justify-between h-full bg-transparent shadow-none border-none p-0">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/40 text-cyan-400 shadow-inner">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {language === "hi" ? "लैब रिपोर्ट सारांश" : "Medical Report Summarizer"}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {language === "hi"
                        ? "कठिन लैब रिपोर्ट और पीडीएफ को सरल शब्दों में बदलें। असामान्य जैव-मापदंडों को समझें और उन्हें हाइलाइट करें।"
                        : "Translate dense clinical reports and biomarker values into easy-to-understand summaries to monitor your health markers."}
                    </p>
                  </div>
                  <Link to="/reports" className="flex items-center text-xs font-semibold text-cyan-400 gap-1 mt-4 hover:underline w-fit">
                    <span>{language === "hi" ? "रिपोर्ट अपलोड करें" : "Upload Reports"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Card>

                {/* Card 4 */}
                <Card className="flex flex-col justify-between h-full bg-transparent shadow-none border-none p-0">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950/40 text-teal-400 shadow-inner">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {language === "hi" ? "द्विभाषी एआई स्वास्थ्य सेवा" : "Bilingual AI Access"}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {language === "hi"
                        ? "भाषा की बाधाओं को तोड़ें। पूरी एआई कार्यप्रणाली हिंदी और अंग्रेजी दोनों भाषाओं में समान रूप से उपलब्ध है।"
                        : "Break down language barriers with seamless English and Hindi bilingual support for all clinical consultations."}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-teal-400 gap-1 mt-4">
                    <span>{language === "hi" ? "भाषा बदलें" : "Toggle Language (In Header)"}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
