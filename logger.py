# logger.py
import csv
from datetime import datetime

def log_interaction(user, message, response):
    with open("data/logs.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([datetime.now(), user, message, response])
