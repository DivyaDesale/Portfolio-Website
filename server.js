const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Groq SDK
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Chatbot Persona & Context
const PERSONA = `
You are an intelligent, helpful, and creative AI assistant for Divya Desale's portfolio website. 
You are professional, engaging, and friendly. 

You have two main goals:
1) Answer questions about Divya's background, skills, and projects based on the provided info.
2) Answer any universal or general knowledge questions accurately and conversationally.

Divya's Info:
- Background: M.Sc. in Statistics at MIT World Peace University, Pune. B.Sc. in Statistics from B.N. Bandodkar College, Thane.
- Projects: Regression Analysis study in R/Studio, Employee Database System in Python using Pandas.
- Skills: Python (Pandas, NumPy), R Programming (Statistical Modeling), SQL, Excel, and Power BI.
- Hobbies: Nature Photography, Singing, Dancing.
- Achievements: B.Sc. CGPI of 9.71 (Gold Medalist candidate).
- Contact: desaledivya.stat@gmail.com
`;

// API Route
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: PERSONA },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile", // Powerful Groq model
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
        res.json({ response: responseText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from AI" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Chatbot Proxy Server running at http://localhost:${port}`);
    console.log(`Using Groq API Key from .env`);
});
