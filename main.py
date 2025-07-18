import streamlit as st
import google.generativeai as genai
from deep_translator import GoogleTranslator

# Set page config
st.set_page_config(page_title="EyeCare Companion", layout="wide")

# Add animated background with medical theme
st.markdown("""
    <style>
    body {
        background: linear-gradient(to bottom, #e3f2fd, #ffffff);
        font-family: 'Segoe UI', sans-serif;
    }

    .medical-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('https://i.ibb.co/fpxwS0m/medical-bg.gif');
        background-size: cover;
        background-repeat: no-repeat;
        opacity: 0.1;
        z-index: -1;
    }

    .chat-box {
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
    }

    .user {
        text-align: right;
        color: #0d47a1;
    }

    .bot {
        text-align: left;
        color: #1b5e20;
    }

    .lang-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    </style>
    <div class="medical-bg"></div>
""", unsafe_allow_html=True)

# Gemini API Key
genai.configure(api_key="your-api-key")
model = genai.GenerativeModel("gemini-1.5-flash")

# Session State
if "messages" not in st.session_state:
    st.session_state.messages = []
if "preferred_language" not in st.session_state:
    st.session_state.preferred_language = "English"

st.title("🩺 EyeCare AI Companion")

# Language selection buttons
col1, col2 = st.columns(2)
with col1:
    if st.button("🗣️ Hindi"):
        st.session_state.preferred_language = "Hindi"
with col2:
    if st.button("🗣️ English"):
        st.session_state.preferred_language = "English"

# Age, weight, gender inputs
age = st.number_input("Enter Age:", min_value=1, max_value=120, step=1)
weight = st.number_input("Enter Approx Weight (kg):", min_value=1.0, max_value=200.0, step=0.5)
gender = st.selectbox("Select Gender:", ["Male", "Female", "Other"])
query = st.text_input("Ask a Health Question:", key="user_input")

# Handle user query
if st.button("Send"):
    if query:
        try:
            # Translate to English if input is in Hindi
            detected_lang = GoogleTranslator().detect(query)
            if detected_lang == "hi":
                query_translated = GoogleTranslator(source='auto', target='en').translate(query)
            else:
                query_translated = query
        except:
            query_translated = query

        # Send to Gemini
        try:
            full_query = f"Patient details:\nAge: {age}, Weight: {weight}kg, Gender: {gender}\n\nQuestion: {query_translated}"
            response = model.generate_content(full_query)
            ai_response = response.text
        except:
            ai_response = "AI: Sorry, I couldn't process that right now. Please try again later."

        # Translate response if needed
        try:
            if st.session_state.preferred_language == "Hindi":
                ai_response = GoogleTranslator(source='en', target='hi').translate(ai_response)
        except:
            pass

        # Save messages
        st.session_state.messages.append(("user", query))
        st.session_state.messages.append(("ai", ai_response))

# Show chat
st.markdown("### 👁️ Chat")
for sender, msg in st.session_state.messages[::-1]:
    if sender == "user":
        st.markdown(f"<div class='chat-box user'><strong>You:</strong> {msg}</div>", unsafe_allow_html=True)
    else:
        st.markdown(f"<div class='chat-box bot'><strong>EyeCare AI:</strong> {msg}</div>", unsafe_allow_html=True)
