"use client";

import { analyzeResume, matchResume } from "@/lib/api";
import { useState } from "react";

export default function DashboardPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleMatch = async () => {
    if (!resumeFile) return alert("Please select a resume file!");
    try {
      const response = await matchResume(resumeFile, jobDescription);
      setMatchResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(error);
      alert("Error matching resume");
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return alert("Please select a resume file!");
    try {
      const response = await analyzeResume(resumeFile);
      setAnalysisResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Resume Matcher Dashboard</h1>

      <div className="mb-4">
        <label className="block mb-1">Upload Resume (PDF):</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Job Description:</label>
        <textarea
          rows={5}
          className="w-full border p-2"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleMatch}
        >
          Match Resume
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAnalyze}
        >
          Analyze Resume
        </button>
      </div>

      {matchResult && (
        <div className="mb-4">
          <h2 className="font-bold">Match Result:</h2>
          <pre className="bg-gray-100 p-2">{matchResult}</pre>
        </div>
      )}

      {analysisResult && (
        <div className="mb-4">
          <h2 className="font-bold">Analysis Result:</h2>
          <pre className="bg-gray-100 p-2">{analysisResult}</pre>
        </div>
      )}
    </div>
  );
}
