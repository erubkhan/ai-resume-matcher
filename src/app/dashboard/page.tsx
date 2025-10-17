"use client";

import { analyzeResume, matchResume, uploadResume } from "@/lib/api";
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

      // ✅ Upload file to backend to extract text
      const response = await uploadResume(file);
      if (response.text) {
        setResumeText(response.text);
      } else {
        alert("Could not extract text from PDF");
      }
    }
  };

  const handleMatch = async () => {
    if (!resumeText) return alert("Please upload a valid resume first!");
    if (!jobDescription) return alert("Please enter a job description!");

    try {
      const response = await matchResume(resumeFile, jobDescription);
      let formatted = response.result
      .replace(/\*\*/g, "") // remove bold markdown
      .replace(/\\n/g, "\n") // convert literal \n to actual line breaks
      .replace(/\n{2,}/g, "\n\n"); // clean double spacing
      
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
      let formatted = response.analysis
      .replace(/\*\*/g, "") // remove bold markdown
      .replace(/\\n/g, "\n") // convert literal \n to actual line breaks
      .replace(/\n{2,}/g, "\n\n"); // clean double spacing

        setAnalysisResult(formatted.trim());
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 p-8 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-blue-400 tracking-tight">
        AI Resume Matcher Dashboard
      </h1>

      {/* Upload Box */}
      <div className="max-w-lg mb-6">
        <div className="relative border-2 border-dashed border-blue-500/40 rounded-xl p-6 bg-gray-900/60 backdrop-blur-sm hover:border-blue-500 transition">
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
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1 font-semibold">
          Job Description
        </label>
        <textarea
          rows={6}
          className="w-full bg-gray-900/70 border border-gray-700 rounded-xl p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
          onClick={handleMatch}
        >
          Match Your Resume 
        </button>
        <button
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition"
          onClick={handleAnalyze}
        >
          Improve Resume
        </button>
      </div>

      {/* Results */}
      {matchResult && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">Check how Fit you are for this Role:</h2>
          <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
          {matchResult && (
            <div className="mt-6 bg-[#0d1117] text-gray-100 p-6 rounded-2xl shadow-lg border border-gray-800 max-w-3xl w-full">
                <h3 className="text-2xl font-semibold mb-4 text-teal-400">Match Result</h3>
                <div
                    className="text-gray-300 leading-relaxed whitespace-pre-line max-h-[500px] overflow-y-auto text-base font-light"
                    style={{ lineHeight: "1.8" }}
                >
                    {matchResult}
                </div>
            </div>
           )}
          </pre>
        </div>
      )}

      {analysisResult && (
        <div>
          <h2 className="text-lg font-semibold text-green-400 mb-2">
            Areas of Improvement in Your Resume:
          </h2>
          <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
            {analysisResult && (
                <div className="mt-6 bg-[#0d1117] text-gray-100 p-6 rounded-2xl shadow-lg border border-gray-800 max-w-3xl w-full">
                    <h3 className="text-2xl font-semibold mb-4 text-teal-400">Resume Analysis</h3>
                    <div
                        className="text-gray-300 leading-relaxed whitespace-pre-line max-h-[500px] overflow-y-auto text-base font-light"
                        style={{ lineHeight: "1.8" }}
                    >
                        {analysisResult}
                    </div>
                </div>
            )}
          </pre>
        </div>
      )}
    </div>   
  );
}
