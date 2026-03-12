// server.js — run this alongside vite with: node server.js
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Allow Vite frontend (localhost:5173) to talk to this server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const SYSTEM_PROMPT = `You are a personal assistant for Raj Patil, an early-career Machine Learning Engineer based in Berlin, Germany.
Your job is to help visitors of Raj's portfolio learn about him in a friendly, concise way.
Always stay on topic — only answer questions related to Raj's skills, projects, experience, and contact info.
If someone asks something unrelated, politely redirect them back.
Keep replies short — 2 to 4 sentences max. Be friendly, confident and human.
If unsure about something, say "You can reach Raj directly at patilraj.sunita@gmail.com for more details."

Here is everything about Raj:

NAME: Raj Patil
LOCATION: Berlin, Germany
ROLE: Early-career Machine Learning Engineer

OBJECTIVE:
Raj has 2 years of experience in data processing, model development, and evaluation using Python.
He is currently expanding into API development, CI/CD workflows, and deployment practices to build
production-ready ML systems. Interested in scalable AI infrastructure and platform engineering.

EDUCATION:
- Master in Artificial Intelligence and Big Data — SRH University Berlin (Expected 2027)
  Coursework: Software Development, Machine Learning, Artificial Intelligence, Advanced Mathematics

SKILLS:
- Programming: Python (Pandas, NumPy, scikit-learn)
- Machine Learning: XGBoost, LightGBM, Feature Engineering, Model Evaluation
- Languages: Python (Advanced), SQL (Intermediate)
- Tools: Git, Jupyter, Google Colab (Advanced)
- MLOps/Engineering: Docker, CI/CD basics, Model Versioning, Logging and Monitoring
- Databases: PostgreSQL
- LLM Exposure: Prompt engineering, LLM API integration, structured output generation

EXPERIENCE:
- Programmer Analyst at Cognizant, Bengaluru (July 2022 – Nov 2024)
  Domain: AI and Analytics (Cognizant Digital Business)
  - Led managing and querying data for Retail sector projects
  - Worked with RDBMS, SQL, DBT, Python, ETL, MSBI tools, Power BI

PROJECTS:
1. Mini ML Service with Production Setup
   Containerized ML prediction service using FastAPI, automated CI/CD (GitHub Actions),
   unit testing (pytest), structured logging, deployed via Docker.

2. Production-Ready Fraud Detection API (Fintech-Inspired)
   Fraud detection system with imbalanced classification, ROC-AUC optimization,
   FastAPI endpoint for real-time scoring, fully Dockerized with monitoring strategy.

CERTIFICATIONS:
- IBM Data Science Specialization (Coursera)
- IBM Machine Learning Specialization (Coursera)

LEADERSHIP:
- Admin for Tharun Speaks "Time Machine" Discord — 250+ enrolled students
- Organised weekly coding sessions in university AI club

CONTACT & LINKS:
- Email: patilraj.sunita@gmail.com
- LinkedIn: linkedin.com/mrrajpatil
- Portfolio: www.patilrajsunita.me`;

app.post("/api/gemini", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY not set in environment" });
    }

    // Build conversation history
    const conversationHistory = history
      .slice(0, -1)
      .filter((m) => m.content && m.content.trim() !== "")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return res.status(response.status).json({ error: "Groq API error", details: errorData });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    res.status(200).json({ text });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});