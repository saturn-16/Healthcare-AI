# dashboard.py
import streamlit as st
import pandas as pd

st.set_page_config(page_title="Family Dashboard", layout="wide")
st.title("👨‍👩‍👧 Family Health Dashboard")

try:
    logs = pd.read_csv("data/logs.csv", names=["Time", "User", "Message", "Response"])
    st.write("### Recent Interactions")
    st.dataframe(logs.tail(10))
except:
    st.warning("No logs found yet. Interact with the chatbot first.")
from reminder_handler import save_reminder

st.write("### 💬 Add Reminder for Mom")
reminder = st.text_input("Enter reminder (e.g., Drink water at 3 PM)")
if st.button("Add Reminder") and reminder:
    save_reminder(reminder)
    st.success("Reminder added!")
