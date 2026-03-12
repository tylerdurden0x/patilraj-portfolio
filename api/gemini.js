// pages/api/gemini.js

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
PHONE: +49 1637139585

OBJECTIVE:
Raj has 2 years of experience in data processing, model development, and evaluation using Python.
He is currently expanding into API development, CI/CD workflows, and deployment practices to build
production-ready ML systems. He is interested in scalable AI infrastructure and platform engineering.

EDUCATION:
- Master in Artificial Intelligence and Big Data — SRH University Berlin (Expected 2027)
  Relevant Coursework: Software Development, Machine Learning, Artificial Intelligence, Advanced Mathematics

SKILLS:
- Programming: Python (Pandas, NumPy, scikit-learn)
- Machine Learning: XGBoost, LightGBM, Feature Engineering, Model Evaluation
- Languages: Python (Advanced), SQL (Intermediate)
- Tools: Git, Jupyter, Google Colab (Advanced)
- MLOps/Engineering: Docker, Git, CI/CD basics, Model Versioning, Logging and Monitoring
- Databases: PostgreSQL
- LLM Exposure: Prompt engineering, LLM API integration, structured output generation

EXPERIENCE:
- Programmer Analyst at Cognizant, Bengaluru (July 2022 – Nov 2024)
  Domain: Cognizant Digital Business (CDB) — Artificial Intelligence and Analytics
  - Led managing and querying data for Retail sector projects
  - Trained in RDBMS, SQL, DBT, Python, ETL, MSBI tools, and Power BI

PROJECTS:
1. Mini ML Service with Production Setup
   Built a containerized ML prediction service using FastAPI with automated CI/CD pipeline (GitHub Actions),
   unit testing (pytest), and structured logging. Deployed via Docker with reproducible development workflow.

2. Production-Ready Fraud Detection API (Fintech-Inspired)
   Designed a fraud detection system simulating merchant payment transactions with imbalanced classification.
   Trained and evaluated model using ROC-AUC and threshold optimization. Exposed model via FastAPI endpoint
   for real-time scoring. Dockerized with full production best practices including monitoring and retraining strategy.

CERTIFICATIONS:
- IBM Data Science Specialization (Coursera)
- IBM Machine Learning Specialization (Coursera)

LEADERSHIP:
- Admin for Tharun Speaks "Time Machine" Discord with 250+ enrolled students — moderating discussions,
  facilitating events, and supporting students alongside a team of moderators.
- Organised weekly coding sessions in university AI club, mentoring peers on Python and ML best practices.

CONTACT & LINKS:
- Email: patilraj.sunita@gmail.com
- LinkedIn: linkedin.com/mrrajpatil
- Portfolio: www.patilrajsunita.me`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build conversation history for Gemini
    // Gemini uses "user" and "model" roles (not "assistant")
    const conversationHistory = history
      .slice(0, -1) // exclude the latest user message (we add it separately)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Add the current user message
    const contents = [
      ...conversationHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return res.status(response.status).json({
        error: "Gemini API error",
        details: errorData,
      });
    }

    const data = await response.json();

    let text = "I couldn't generate a response. Please try again.";
    if (data.candidates?.length > 0) {
      const parts = data.candidates[0].content?.parts;
      if (parts && parts.length > 0) {
        text = parts[0].text || text;
      }
    }

    res.status(200).json({ text });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: err.message });
  }
}