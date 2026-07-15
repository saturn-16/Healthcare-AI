import OpenAI from "openai";

// 50+ NLP symptom categories for comprehensive healthcare coverage
export const SYMPTOM_CATEGORIES = [
  { id: "fever", label: "Fever & Chills", labelHi: "बुखार और ठंड लगना", keywords: ["fever", "chills", "temperature", "sweating", "shivering"] },
  { id: "headache", label: "Headache & Migraine", labelHi: "सिरदर्द और माइग्रेन", keywords: ["headache", "migraine", "head pain", "throbbing"] },
  { id: "chest_pain", label: "Chest Pain & Palpitations", labelHi: "सीने में दर्द और धड़कन", keywords: ["chest pain", "palpitations", "heartburn", "pressure"] },
  { id: "breathing", label: "Breathing Difficulty", labelHi: "सांस लेने में कठिनाई", keywords: ["breathlessness", "shortness of breath", "wheezing", "cough"] },
  { id: "abdominal", label: "Abdominal Pain", labelHi: "पेट दर्द", keywords: ["stomach pain", "abdomen", "cramps", "bloating"] },
  { id: "nausea", label: "Nausea & Vomiting", labelHi: "मतली और उल्टी", keywords: ["nausea", "vomiting", "puking", "sick to stomach"] },
  { id: "diarrhea", label: "Diarrhea & Bowel Issues", labelHi: "दस्त और आंत की समस्याएं", keywords: ["diarrhea", "loose stool", "constipation", "bowel"] },
  { id: "urinary", label: "Urinary Problems", labelHi: "पेशाब की समस्याएं", keywords: ["frequent urination", "burning urination", "UTI", "urine"] },
  { id: "skin", label: "Skin Rash & Itching", labelHi: "त्वचा पर चकत्ते और खुजली", keywords: ["rash", "itching", "hives", "eczema", "psoriasis"] },
  { id: "joint", label: "Joint & Muscle Pain", labelHi: "जोड़ और मांसपेशियों में दर्द", keywords: ["joint pain", "arthritis", "muscle ache", "stiffness"] },
  { id: "back_pain", label: "Back & Neck Pain", labelHi: "पीठ और गर्दन में दर्द", keywords: ["back pain", "neck pain", "spine", "lumbar"] },
  { id: "fatigue", label: "Fatigue & Weakness", labelHi: "थकान और कमजोरी", keywords: ["tired", "fatigue", "weakness", "exhaustion", "low energy"] },
  { id: "dizziness", label: "Dizziness & Vertigo", labelHi: "चक्कर और वर्टिगो", keywords: ["dizziness", "vertigo", "spinning", "balance"] },
  { id: "sleep", label: "Sleep Disorders", labelHi: "नींद विकार", keywords: ["insomnia", "sleep apnea", "nightmares", "restless sleep"] },
  { id: "anxiety", label: "Anxiety & Stress", labelHi: "चिंता और तनाव", keywords: ["anxiety", "panic", "stress", "worry", "nervous"] },
  { id: "depression", label: "Depression & Mood", labelHi: "अवसाद और मनोदशा", keywords: ["depression", "sadness", "mood swings", "hopelessness"] },
  { id: "eye", label: "Eye & Vision Problems", labelHi: "आंख और दृष्टि समस्याएं", keywords: ["blurry vision", "eye pain", "redness", "dryness"] },
  { id: "ear", label: "Ear & Hearing Issues", labelHi: "कान और सुनने की समस्याएं", keywords: ["earache", "hearing loss", "tinnitus", "ear infection"] },
  { id: "throat", label: "Throat & Mouth", labelHi: "गला और मुँह", keywords: ["sore throat", "swallowing difficulty", "mouth ulcers", "tonsils"] },
  { id: "nose", label: "Nasal & Sinus", labelHi: "नाक और साइनस", keywords: ["runny nose", "congestion", "sinusitis", "nosebleed"] },
  { id: "dental", label: "Dental & Gum Problems", labelHi: "दांत और मसूड़ों की समस्याएं", keywords: ["toothache", "gum bleeding", "dental pain", "cavity"] },
  { id: "hair", label: "Hair & Scalp", labelHi: "बाल और खोपड़ी", keywords: ["hair loss", "dandruff", "alopecia", "scalp itch"] },
  { id: "weight", label: "Weight Changes", labelHi: "वजन में बदलाव", keywords: ["weight gain", "weight loss", "obesity", "underweight"] },
  { id: "appetite", label: "Appetite Changes", labelHi: "भूख में बदलाव", keywords: ["loss of appetite", "increased appetite", "anorexia", "food cravings"] },
  { id: "diabetes", label: "Diabetes Symptoms", labelHi: "मधुमेह के लक्षण", keywords: ["excessive thirst", "frequent urination", "high blood sugar"] },
  { id: "thyroid", label: "Thyroid Problems", labelHi: "थायरॉइड की समस्याएं", keywords: ["hypothyroid", "hyperthyroid", "goiter", "TSH"] },
  { id: "hypertension", label: "Blood Pressure Issues", labelHi: "रक्तचाप की समस्याएं", keywords: ["high blood pressure", "hypertension", "low BP"] },
  { id: "heart", label: "Heart Conditions", labelHi: "हृदय की स्थितियां", keywords: ["heart disease", "angina", "arrhythmia", "heart failure"] },
  { id: "kidney", label: "Kidney & Urinary Tract", labelHi: "गुर्दे और मूत्र पथ", keywords: ["kidney stone", "renal failure", "edema", "proteinuria"] },
  { id: "liver", label: "Liver & Digestive", labelHi: "लीवर और पाचन", keywords: ["jaundice", "liver pain", "hepatitis", "fatty liver"] },
  { id: "lungs", label: "Respiratory & Lungs", labelHi: "श्वसन और फेफड़े", keywords: ["asthma", "COPD", "pneumonia", "bronchitis"] },
  { id: "allergy", label: "Allergies", labelHi: "एलर्जी", keywords: ["food allergy", "drug allergy", "hay fever", "anaphylaxis"] },
  { id: "infection", label: "Infections & Fever", labelHi: "संक्रमण और बुखार", keywords: ["viral infection", "bacterial infection", "fungal", "sepsis"] },
  { id: "immunity", label: "Immune System", labelHi: "प्रतिरक्षा प्रणाली", keywords: ["autoimmune", "HIV", "frequent infections", "low immunity"] },
  { id: "blood", label: "Blood & Anemia", labelHi: "रक्त और एनीमिया", keywords: ["anemia", "blood clot", "bleeding disorder", "hemoglobin"] },
  { id: "hormonal", label: "Hormonal Imbalance", labelHi: "हार्मोनल असंतुलन", keywords: ["PCOS", "hormones", "endocrine", "menstrual irregularity"] },
  { id: "menstrual", label: "Menstrual Issues", labelHi: "मासिक धर्म की समस्याएं", keywords: ["irregular period", "heavy bleeding", "amenorrhea", "PMS"] },
  { id: "pregnancy", label: "Pregnancy & Maternity", labelHi: "गर्भावस्था और मातृत्व", keywords: ["pregnancy", "morning sickness", "prenatal", "postpartum"] },
  { id: "pediatric", label: "Child Health", labelHi: "बच्चों का स्वास्थ्य", keywords: ["child fever", "pediatric", "growth delay", "vaccination"] },
  { id: "elderly", label: "Geriatric Health", labelHi: "वृद्ध स्वास्थ्य", keywords: ["dementia", "osteoporosis", "fall risk", "elderly care"] },
  { id: "neuro", label: "Neurological Issues", labelHi: "तंत्रिका संबंधी समस्याएं", keywords: ["seizures", "numbness", "tingling", "tremors", "stroke"] },
  { id: "memory", label: "Memory & Cognitive", labelHi: "स्मृति और संज्ञानात्मक", keywords: ["memory loss", "brain fog", "confusion", "Alzheimer's"] },
  { id: "sexual", label: "Sexual Health", labelHi: "यौन स्वास्थ्य", keywords: ["STD", "STI", "erectile dysfunction", "sexual health"] },
  { id: "cancer", label: "Cancer Symptoms", labelHi: "कैंसर के लक्षण", keywords: ["unexplained weight loss", "lump", "blood in stool", "tumor"] },
  { id: "bone", label: "Bone & Ortho", labelHi: "हड्डी और आर्थो", keywords: ["fracture", "osteoporosis", "bone pain", "arthritis"] },
  { id: "sports", label: "Sports & Injury", labelHi: "खेल और चोट", keywords: ["sprain", "strain", "sports injury", "ligament", "tendon"] },
  { id: "nutrition", label: "Nutrition Deficiency", labelHi: "पोषण की कमी", keywords: ["vitamin deficiency", "malnutrition", "B12", "iron deficiency"] },
  { id: "substance", label: "Addiction & Substance", labelHi: "लत और पदार्थ", keywords: ["alcohol", "smoking", "drug addiction", "withdrawal"] },
  { id: "occupational", label: "Occupational Health", labelHi: "व्यावसायिक स्वास्थ्य", keywords: ["work stress", "occupational hazard", "carpal tunnel", "RSI"] },
  { id: "emergency", label: "Emergency Symptoms", labelHi: "आपातकालीन लक्षण", keywords: ["chest pain sudden", "stroke symptoms", "unconscious", "severe bleeding"] },
  { id: "mental", label: "Mental Health & Wellbeing", labelHi: "मानसिक स्वास्थ्य और कल्याण", keywords: ["ADHD", "bipolar", "schizophrenia", "OCD", "phobia"] },
  { id: "vaccination", label: "Vaccines & Preventive", labelHi: "टीके और निवारक स्वास्थ्य", keywords: ["vaccination", "immunization", "flu shot", "preventive"] },
  { id: "chronic", label: "Chronic Disease Management", labelHi: "पुरानी बीमारी प्रबंधन", keywords: ["diabetes management", "hypertension control", "chronic pain"] },
];

const DOCTOR_SYSTEM_PROMPT_EN = `You are Dr. Novus AI, an advanced AI healthcare assistant powered by NOVUS AI. You function as a knowledgeable, empathetic virtual doctor.

CORE RESPONSIBILITIES:
1. Analyze patient symptoms with clinical precision.
2. Provide simple differential diagnoses (list possible conditions).
3. Recommend appropriate tests and lifestyle remedies.
4. Clearly mark EMERGENCY situations that need immediate care.

RESPONSE FORMAT & STYLE RULES (CRITICAL):
- Keep your answers VERY SHORT, CONCISE, AND TO THE POINT.
- STRICTLY GIVE YOUR ANSWERS IN BULLET POINTS. Avoid long paragraph explanations entirely.
- MAKE IMPORTANT TEXT BOLD (e.g. **key instructions, warnings, condition names**).
- Explain everything in simple layman's terms; do not use complex medical jargon.
- Clearly state red flags / emergency indicators.
- End with a single sentence of quick reassurance.

TONE: Professional, friendly, warm, like a trusted family doctor.`;

const DOCTOR_SYSTEM_PROMPT_HI = `आप Dr. Novus AI हैं, जो NOVUS AI द्वारा संचालित एक उन्नत AI स्वास्थ्य सहायक हैं। आप एक जानकार, सहानुभूतिपूर्ण वर्चुअल डॉक्टर के रूप में काम करते हैं।

मुख्य जिम्मेदारियां:
1. रोगी के लक्षणों का नैदानिक सटीकता के साथ विश्लेषण करें।
2. संभावित स्थितियों की संक्षिप्त सूची प्रदान करें।
3. उचित परीक्षण और जीवनशैली में बदलाव की सिफारिश करें।
4. आपातकालीन स्थितियों को स्पष्ट रूप से चिह्नित करें।

प्रतिक्रिया प्रारूप और शैली नियम (महत्वपूर्ण):
- अपने उत्तरों को बहुत छोटा, संक्षिप्त और सीधे मुद्दे पर (very short and to the point) रखें।
- अपने उत्तरों को केवल और केवल बुलेट पॉइंट्स (bullet points) में दें। लंबे पैराग्राफ लिखने से बचें।
- महत्वपूर्ण शब्दों को बोल्ड (**bold**) में लिखें (जैसे **मुख्य सलाह, चेतावनी, बीमारी का नाम**)।
- जटिल चिकित्सा शब्दों से बचें और बहुत ही सरल भाषा का उपयोग करें।
- लाल झंडे / आपातकालीन देखभाल की आवश्यकता कब है, यह स्पष्ट रूप से बताएं।
- हमेशा हिंदी में उत्तर दें। गर्मजोशी भरे मित्रवत स्वर में बोलें।`;

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    this.openai = this.apiKey
      ? new OpenAI({
          apiKey: this.apiKey,
          baseURL: "https://api.groq.com/openai/v1",
          dangerouslyAllowBrowser: true,
        })
      : null;
    this.model = "llama-3.3-70b-versatile";
    this.conversationHistory = [];
    this.language = "en";
  }

  setLanguage(lang) {
    this.language = lang;
    this.conversationHistory = [];
  }

  getSystemPrompt() {
    return this.language === "hi" ? DOCTOR_SYSTEM_PROMPT_HI : DOCTOR_SYSTEM_PROMPT_EN;
  }

  buildContext(userMessage, patientData = null, selectedCategory = null) {
    let contextualPrompt = "";
    
    if (patientData && (patientData.age || patientData.symptoms)) {
      if (this.language === "hi") {
        contextualPrompt = `
रोगी जानकारी:
- आयु: ${patientData.age || "अज्ञात"}
- वजन: ${patientData.weight ? patientData.weight + " किग्रा" : "अज्ञात"}
- लिंग: ${patientData.gender || "अज्ञात"}
- रक्त समूह: ${patientData.bloodGroup || "अज्ञात"}
- प्राथमिक लक्षण: ${patientData.symptoms || "कोई नहीं"}
- एलर्जी / चिकित्सा इतिहास: ${patientData.allergies || "कोई नहीं"}
${selectedCategory ? `- लक्षण श्रेणी: ${selectedCategory}` : ""}

रोगी का प्रश्न: ${userMessage}

कृपया हिंदी में एक विस्तृत चिकित्सा मूल्यांकन प्रदान करें।`;
      } else {
        contextualPrompt = `
Patient Information:
- Age: ${patientData.age || "Unknown"}
- Weight: ${patientData.weight ? patientData.weight + " kg" : "Unknown"}
- Gender: ${patientData.gender || "Unknown"}
- Blood Group: ${patientData.bloodGroup || "Unknown"}
- Primary Symptoms: ${patientData.symptoms || "None stated"}
- Allergies / Medical History: ${patientData.allergies || "None stated"}
${selectedCategory ? `- Symptom Category: ${selectedCategory}` : ""}

Patient Query: ${userMessage}

Please provide a thorough clinical assessment.`;
      }
    } else {
      contextualPrompt = userMessage;
    }

    return contextualPrompt;
  }

  async streamResponse(userMessage, onChunk, patientData = null, selectedCategory = null) {
    if (!this.openai) {
      onChunk(this.language === "hi" 
        ? "त्रुटि: Groq API key गायब है। कृपया अपनी .env फ़ाइल जांचें।"
        : "Error: Groq API key is missing. Please check your .env file."
      );
      return;
    }

    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.buildContext(userMessage, patientData, selectedCategory);

    try {
      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...this.conversationHistory,
          { role: "user", content: userPrompt }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      });

      // Update history with the user message
      this.conversationHistory.push({ role: "user", content: userPrompt });
      
      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        onChunk(content);
      }

      // Add assistant response to history
      this.conversationHistory.push({ role: "assistant", content: fullResponse });
      
      // Keep history from growing too large (keep last 10 messages)
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(this.conversationHistory.length - 10);
      }

    } catch (error) {
      console.error("Groq API Error:", error);
      const msg = error.message || "";

      if (msg.includes("401") || msg.includes("invalid_api_key")) {
        onChunk(this.language === "hi"
          ? "\n\n🚫 **API Key अमान्य**: आपकी Groq API key अमान्य है। कृपया अपनी .env फ़ाइल में VITE_GROQ_API_KEY अपडेट करें।"
          : "\n\n🚫 **Invalid API Key**: Your Groq API key is invalid. Please update VITE_GROQ_API_KEY in your .env file."
        );
      } else if (msg.includes("429") || msg.includes("quota")) {
        onChunk(this.language === "hi"
          ? "\n\n⏳ **API कोटा समस्या**: आपने अपना Groq API कोटा पार कर लिया है।"
          : "\n\n⏳ **API Quota Exceeded**: You've exceeded your Groq API rate limit. Please try again shortly."
        );
      } else {
        onChunk(this.language === "hi"
          ? `\n\n[सिस्टम त्रुटि]: Groq API से कनेक्ट करने में विफल। ${msg}`
          : `\n\n[System Error]: Failed to connect to Groq API. ${msg}`
        );
      }
    }
  }

  detectSymptomCategories(text) {
    const lowerText = text.toLowerCase();
    const detected = [];
    
    for (const category of SYMPTOM_CATEGORIES) {
      const matched = category.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
      if (matched) {
        detected.push(category);
      }
    }
    
    return detected.slice(0, 5);
  }

  async streamReport(prompt, onChunk) {
    if (!this.openai) {
      onChunk(this.language === "hi" 
        ? "त्रुटि: Groq API key गायब है। कृपया अपनी .env फ़ाइल जांचें।"
        : "Error: Groq API key is missing. Please check your .env file."
      );
      return;
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: "You are an expert clinical medical summary generator. Write a structured clinical summary report in Markdown based on the provided patient health history. Be concise, highly professional, and provide clear recommended action items. Write the entire report in the language requested (English or Hindi)." },
          { role: "user", content: prompt }
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 2048,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        onChunk(content);
      }
    } catch (error) {
      console.error("Report generation failed:", error);
      throw error;
    }
  }
}

// Still export as default so existing imports continue to work without changes
export default new AIService();
