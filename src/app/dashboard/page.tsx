"use client";

import { analyzeResume, matchResume } from "@/lib/api";
import { useState } from "react";

export default function DashboardPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setFileName(file.name);
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
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        AI Resume Matcher Dashboard
      </h1>

      {/* Modern file upload box */}
      <div className="max-w-md mb-6">
        <div className="relative border-dotted h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
          <div className="absolute text-center">
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-800 font-normal mt-2">
                {fileName ? (
                  <span className="text-blue-700 font-semibold">{fileName}</span>
                ) : (
                  "Attach your resume file here (PDF)"
                )}
              </span>
            </div>
          </div>
          <input
            type="file"
            accept=".pdf"
            className="h-full w-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Job Description Input */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-500 font-semibold">Job Description:</label>
        <textarea
          rows={5}
          className="w-full border rounded p-2 text-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={handleMatch}
        >
          Match Resume
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleAnalyze}
        >
          Analyze Resume
        </button>
      </div>

      {/* Match Result */}
      {matchResult && (
        <div className="mb-6">
          <h2 className="font-bold text-gray-500 mb-1">Match Result:</h2>
          <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
            {matchResult}
          </pre>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="mb-6">
          <h2 className="font-bold text-gray-500 mb-1">Analysis Result:</h2>
          <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
            {analysisResult}
          </pre>
        </div>
      )}
    </div>
  );
}
