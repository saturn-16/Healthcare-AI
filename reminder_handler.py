# reminder_handler.py
import csv
from datetime import datetime

def save_reminder(message):
    with open("data/reminders.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([datetime.now(), message])
