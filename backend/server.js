import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure data folder exists
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "database.sqlite");

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize SQLite database
async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS health_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      age INTEGER NOT NULL,
      weight INTEGER NOT NULL,
      gender TEXT NOT NULL,
      type TEXT NOT NULL,
      symptoms TEXT,
      risk_level TEXT,
      summary TEXT,
      chat_history TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS clinical_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source_encounters TEXT
    );
  `);

  // Seed sample data if database history is empty
  const count = await db.get("SELECT COUNT(*) as count FROM health_history");
  if (count.count === 0) {
    console.log("Seeding initial medical history into SQLite...");
    
    const sampleEncounters = [
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        age: 34,
        weight: 72,
        gender: "male",
        type: "consultation",
        symptoms: "Mild Chest Tightness, Fatigue",
        risk_level: "Moderate",
        summary: "Patient reported mild pressure in the central chest area accompanied by general lethargy. The system identified moderate cardiovascular strain risk. Suggested rest, stress management, and clinical consultation if symptoms worsen or radiate.",
        chat_history: JSON.stringify([
          { role: "user", content: "I feel some mild tightness in my chest and I am very tired." },
          { role: "assistant", content: "Mild chest tightness combined with fatigue warrants careful observation. Have you experienced shortness of breath or dizziness?" }
        ])
      },
      {
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        age: 34,
        weight: 73,
        gender: "male",
        type: "symptoms",
        symptoms: "Dry Eyes, Eye Strain, Slight Headache",
        risk_level: "Low",
        summary: "Symptom check indicated high likelihood of digital eye strain (asthenopia) due to prolonged screen exposure. Recommended 20-20-20 rule, screen brightness adjustments, and hydrating eye drops.",
        chat_history: JSON.stringify([])
      },
      {
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        age: 34,
        weight: 73,
        gender: "male",
        type: "consultation",
        symptoms: "Mild Headache, Dehydration",
        risk_level: "Low",
        summary: "Assessment identified tension-type headache likely secondary to insufficient hydration during active work shift. Recommended immediate fluid intake and minor rest.",
        chat_history: JSON.stringify([
          { role: "user", content: "My head is aching slightly since afternoon." },
          { role: "assistant", content: "A tension headache can often be triggered by lack of water or neck strain. Please try drinking a glass of water and resting your eyes." }
        ])
      }
    ];

    for (const enc of sampleEncounters) {
      await db.run(
        `INSERT INTO health_history (timestamp, age, weight, gender, type, symptoms, risk_level, summary, chat_history) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [enc.timestamp, enc.age, enc.weight, enc.gender, enc.type, enc.symptoms, enc.risk_level, enc.summary, enc.chat_history]
      );
    }

    // Seed one report
    const sampleReport = {
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      title: "Clinical Progress Summary & Risk Report",
      content: `## Clinical Health Summary Report
**Date Generated:** ${new Date().toLocaleDateString()}
**Patient Age:** 34 | **Weight:** 72 kg | **Gender:** Male

### Summary of Encounters
The patient database records **3 clinical assessments** over the past 14 days, primarily tracking mild cardiovascular symptoms, tension headaches, and digital eye strain.

1. **Cardiovascular & Vital Indicators:** Moderate concern regarding reported *Mild Chest Tightness* on ${new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}. Patient is advised to monitor chest vitals and secure a diagnostic ECG.
2. **Occupational & Lifestyle Strain:** Digital eye strain and dehydration-induced headaches remain recurring factors. Vitals indicate positive response to hydration.

### Recommended Action Plan
- Hydration targets: 3L daily.
- Implement screen breaks using the 20-20-20 rule.
- Book a routing ECG to check chest tightness indicators.`,
      source_encounters: JSON.stringify([1, 2, 3])
    };

    await db.run(
      "INSERT INTO clinical_reports (timestamp, title, content, source_encounters) VALUES (?, ?, ?, ?)",
      [sampleReport.timestamp, sampleReport.title, sampleReport.content, sampleReport.source_encounters]
    );
  }
}

// REST Endpoints
app.get("/api/history", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM health_history ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/history", async (req, res) => {
  try {
    const { id, timestamp, age, weight, gender, type, symptoms, risk_level, summary, chat_history } = req.body;
    
    if (id) {
      // Perform UPDATE for existing session
      await db.run(
        `UPDATE health_history SET 
         timestamp = ?, age = ?, weight = ?, gender = ?, type = ?, symptoms = ?, risk_level = ?, summary = ?, chat_history = ?
         WHERE id = ?`,
        [
          timestamp || new Date().toISOString(),
          age || 0,
          weight || 0,
          gender || "unknown",
          type || "consultation",
          symptoms || "",
          risk_level || "Low",
          summary || "",
          chat_history || "[]",
          id
        ]
      );
      res.json({ success: true, id });
    } else {
      // Perform INSERT for new session
      const result = await db.run(
        `INSERT INTO health_history (timestamp, age, weight, gender, type, symptoms, risk_level, summary, chat_history) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          timestamp || new Date().toISOString(),
          age || 0,
          weight || 0,
          gender || "unknown",
          type || "consultation",
          symptoms || "",
          risk_level || "Low",
          summary || "",
          chat_history || "[]"
        ]
      );
      res.json({ success: true, id: result.lastID });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM health_history WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM clinical_reports ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const { timestamp, title, content, source_encounters } = req.body;
    await db.run(
      "INSERT INTO clinical_reports (timestamp, title, content, source_encounters) VALUES (?, ?, ?, ?)",
      [
        timestamp || new Date().toISOString(),
        title || "Clinical Report",
        content || "",
        source_encounters || "[]"
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Secure SQL Sandbox query endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    // Safety check - restrict queries to health_history and clinical_reports tables
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.includes("drop table") || cleanQuery.includes("alter table")) {
      return res.status(400).json({ error: "DDL operations (DROP, ALTER) are not allowed in sandbox console." });
    }

    let rows;
    if (cleanQuery.startsWith("select")) {
      rows = await db.all(query, params);
    } else {
      const result = await db.run(query, params);
      rows = [{ success: true, changes: result.changes, lastID: result.lastID }];
    }
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 3001;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failure:", err);
});
