import google.generativeai as genai

# Set your Gemini API key
genai.configure(api_key="your-api-key")  # 🔁 Replace with your Gemini API key

# Load supported model (make sure your key has access to it)
model = genai.GenerativeModel("models/gemini-1.5-flash")  # or "models/gemini-1.5-pro"

def ask_gemini(user_input, context="You are a helpful eye care assistant."):
    try:
        prompt = f"{context}\nUser: {user_input}\nAI:"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[Gemini Error]: {e}")
        return "AI: Sorry, I couldn't process that right now. Please try again later."
