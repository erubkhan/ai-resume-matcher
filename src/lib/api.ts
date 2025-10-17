// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export async function analyzeResume(resumeText: string) {
  const res = await fetch(`${API_URL}/api/analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText }),
  });
  return res.json();
}

export async function matchResume(file: File, jobDescription: string) {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
  
    const res = await fetch(`${API_URL}/api/match`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }  

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}