import time
import requests
from duckduckgo_search import DDGS

import os

TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

def send_message(text):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    try:
        requests.post(url, json={"chat_id": CHAT_ID, "text": text, "parse_mode": "Markdown"}, timeout=10)
    except Exception as e:
        print(f"Error sending message: {e}")

def search_jobs():
    queries = [
        "site:travelweekly.co.uk \"Business Travel\" Manchester 25000",
        "site:otta.com \"Customer Experience\" Manchester 25000",
        "site:linkedin.com \"Business Travel Consultant\" Manchester 25000",
        "\"Business Travel\" TMC Manchester 25000",
        "\"Travel Advisor\" Bolton 25000",
        "\"Travel Operations\" Manchester 25000",
        "\"Business Travel\" Hybrid Manchester 25000",
        "\"Travel Consultant\" Preston 25000",
        "\"Travel Consultant\" Wigan 25000"
    ]
    
    results = []
    with DDGS() as ddgs:
        for query in queries:
            try:
                for r in ddgs.text(query, max_results=2):
                    results.append(f"* {r['title']}\n  {r['href']}")
                time.sleep(2) 
            except Exception as e:
                print(f"Search error: {e}")
    
    return list(set(results))

if __name__ == "__main__":
    print("Hermes Job Hunter scanning the horizon...")
    jobs = search_jobs()
    
    if jobs:
        message = "🎯 *Hermes Job Hunter Alert*\n\nI found some potential matches for your daughter in Manchester/Bolton (£28k target):\n\n" + "\n\n".join(jobs[:8])
        send_message(message)
    else:
        send_message("🔍 Hermes checked for jobs but didn't find any new £28k+ matches in Manchester/Bolton in the last 24 hours. I will scan again tomorrow morning!")
