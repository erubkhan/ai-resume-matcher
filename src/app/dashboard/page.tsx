"use client";

import { analyzeResume, matchResume, uploadResume } from "@/lib/api";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DashboardPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setFileName(file.name);

      const response = await uploadResume(file);
      if (response.text) {
        setResumeText(response.text);
      } else {
        alert("Could not extract text from PDF");
      }
    }
  };

  const handleMatch = async () => {
    if (!resumeFile) return alert("Please upload your resume first!");
    if (!jobDescription) return alert("Please enter a job description!");

    try {
      const response = await matchResume(resumeFile, jobDescription);
      const formatted = response.result
        .replace(/\*\*/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n");
      setMatchResult(formatted.trim());
    } catch (error) {
      console.error(error);
      alert("Error matching resume");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) return alert("Please upload a valid resume first!");
    try {
      const response = await analyzeResume(resumeText);
      const formatted = response.analysis
        .replace(/\*\*/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\n{2,}/g, "\n\n");
      setAnalysisResult(formatted.trim());
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-200 px-6 py-10 font-sans">
      {/* Header / Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Welcome to <span className="text-blue-500">ResumeGPT</span>
        </h1>
        <h2 className="text-2xl md:text-2xl font-bold text-white mb-3 tracking-tight">
            Your AI Resume Matcher
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload your resume, paste a job description, and let AI show you how well you're fit for the role — 
          plus personalized insights to improve your chances of getting hired.
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto mb-12 bg-gray-900/70 rounded-2xl border border-gray-800 p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          Step 1 — Upload Your Resume
        </h2>
        <div className="relative border-2 border-dashed border-blue-500/40 rounded-xl p-6 bg-gray-900/60 hover:border-blue-500 transition">
          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="text-center">
            <i className="fa fa-cloud-upload fa-3x text-blue-400 mb-3"></i>
            <p className="text-gray-400">
              {fileName ? (
                <span className="text-blue-400 font-semibold">{fileName}</span>
              ) : (
                "Click or drag to upload your resume (PDF)"
              )}
            </p>
          </div>
        </div>

        {/* Preview */}
        {resumeFile && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Resume Preview
            </h3>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-3">
              <iframe
                src={URL.createObjectURL(resumeFile)}
                className="w-full h-[600px] rounded-lg"
                title="Resume Preview"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Job Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-3xl mx-auto mb-12 bg-gray-900/70 rounded-2xl border border-gray-800 p-8 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-green-400 mb-4">
          Step 2 — Paste Job Description
        </h2>
        <textarea
          rows={8}
          className="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-16">
        <button
          onClick={handleMatch}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition shadow-md"
        >
          Match Resume
        </button>
        <button
          onClick={handleAnalyze}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition shadow-md"
        >
          Analyze Resume
        </button>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto space-y-10">
        {matchResult && (
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-blue-400 mb-4">
              Match Result
            </h2>
            <pre className="whitespace-pre-wrap bg-gray-950 border border-gray-800 rounded-xl p-5 text-gray-200 leading-relaxed overflow-y-auto max-h-[500px]">
              {matchResult}
            </pre>
          </div>
        )}

        {analysisResult && (
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              Analysis Result
            </h2>
            <pre className="whitespace-pre-wrap bg-gray-950 border border-gray-800 rounded-xl p-5 text-gray-200 leading-relaxed overflow-y-auto max-h-[500px]">
              {analysisResult}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-16">
        Built with ❤️ using Next.js + OpenAI | © {new Date().getFullYear()} AI Resume Matcher
      </footer>
    </div>
  );
}
