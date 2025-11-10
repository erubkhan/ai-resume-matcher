const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const fs = require("fs");
const pdf = require("pdf-parse");


dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/test", (req, res) => {
    console.log("✅ /api/test hit!");
    res.json({ message: "POST request successful" });
  });

// ✅ /api/upload — Handles resume upload
app.post("/api/upload", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const buffer = fs.readFileSync(req.file.path);
        const data = await pdf(buffer); // now allowed because function is async

        res.json({ message: "File uploaded successfully", text: data.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing PDF" });
    }
});


// ✅ /api/match — Matches resume with job descriptions (fixed)
app.post("/api/match", upload.single("resume"), async (req, res) => {
    try {
      // Make sure both resume and job description exist
      if (!req.file || !req.body.jobDescription) {
        return res.status(400).json({ error: "Missing resume file or job description" });
      }
  
      // ✅ Read and parse the uploaded PDF
      const buffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(buffer);
      const resumeText = pdfData.text;
      const jobDescription = req.body.jobDescription;
  
      //Generate match score using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert AI that compares resumes with job descriptions and provides a match score.",
          },
          {
            role: "user",
            content: `
  Compare this resume with the following job description and provide:
  1. A match score out of 100
  2. Key strengths
  3. Key gaps
  4. A short summary of how well this candidate fits the job.
  
  Resume:
  ${resumeText}
  
  Job Description:
  ${jobDescription}
            `,
          },
        ],
      });
  
      const matchResult = response.choices[0].message.content;
  
      // ✅ Cleanup uploaded file
      fs.unlinkSync(req.file.path);
  
      // ✅ Send back response
      res.json({ result: matchResult });
    } catch (error) {
      console.error("Error in /api/match:", error.message);
      res.status(500).json({ error: "Error analyzing match" });
    }
  });
  

// ✅ /api/analysis — Provides detailed AI resume analysis
app.post("/api/analysis", async (req, res) => {
  const { resumeText } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach analyzing resumes.",
        },
        {
          role: "user",
          content: `Analyze this resume for strengths, weaknesses, and improvements:\n\n${resumeText}`,
        },
      ],
    });

    const analysis = response.choices[0].message.content;
    res.json({ analysis });
  } catch (error) {
    console.error("Error in /api/analysis:", error.message);
    res.status(500).json({ error: "Error analyzing resume" });
  }
});


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

