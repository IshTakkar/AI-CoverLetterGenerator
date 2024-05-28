import * as pdfjsLib from "pdfjs-dist";
import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener("DOMContentLoaded", () => {
  loadResumes();
  const generateButton = document.getElementById("generateButton");
  generateButton.disabled = true;

  document.getElementById("resumeSelect").addEventListener("change", () => {
    toggleGenerateButton();
  });

  document.getElementById("generateButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractText,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const jobDescription = results[0].result;
            const resume = localStorage.getItem("resume");
            if (resume) {
              showLoader();
              generateCoverLetter(jobDescription, resume);
            } else {
              alert("Please upload your resume first.");
            }
          }
        }
      );
    });
  });
});

document.getElementById("resumeUpload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);
      const text = await extractTextFromPDF(pdfData);
      // localStorage.setItem("resume", text);
      saveResume(file.name, text);
      alert("Resume uploaded and parsed successfully.");
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Please upload a valid PDF file.");
  }
});

function extractText() {
  const paragraphs = Array.from(document.querySelectorAll("p, li, h1, h2"));
  return paragraphs.map((p) => p.innerText).join(" ");
}

async function extractTextFromPDF(pdfData) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }
  return text;
}

async function generateCoverLetter(jobDescription, resume) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
      You are a cover letter generator. Your task is to create professional and concise cover letters based on the given resume and job descriptions. To compose a compelling cover letter, you must scrutinize the job description for key qualifications. Begin with a succinct introduction about the candidate's identity and career goals. Highlight skills aligned with the job, underpinned by tangible examples. Incorporate details about the company, emphasizing its mission or unique aspects that align with the candidate's values. Conclude by reaffirming the candidate's suitability, inviting further discussion. Use job-specific terminology for a tailored and impactful letter, maintaining a professional style suitable for a Software Engineer. Please provide your response in under 500 words.

      This is the job description:
      ${jobDescription}

      This is my resume:
      ${resume}
    `;
    console.log(prompt);

    // const prompt = "how are you?"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    document.getElementById("coverLetter").value = text;
    hideLoader();
  } catch (error) {
    console.error("Error generating cover letter:", error);
    hideLoader();
  }
}

function saveResume(name, text) {
  chrome.storage.local.get({ resumes: [] }, (data) => {
    const resumes = data.resumes;
    resumes.push({ name, text });
    chrome.storage.local.set({ resumes }, () => {
      loadResumes();
    });
  });
}

function loadResumes() {
  chrome.storage.local.get({ resumes: [] }, (data) => {
    const resumeSelect = document.getElementById("resumeSelect");
    resumeSelect.innerHTML = `<option value="">Select a resume</option>`;
    data.resumes.forEach((resume, index) => {
      const option = document.createElement("option");
      option.value = resume.text;
      option.textContent = resume.name;
      resumeSelect.appendChild(option);
    });
    // toggleGenerateButton();
  });
}

function toggleGenerateButton() {
  const generateButton = document.getElementById("generateButton");
  const resumeSelect = document.getElementById("resumeSelect");
  generateButton.disabled = resumeSelect.value === "";
}

function showLoader() {
  const loader = document.getElementById("loader");
  const coverLetter = document.getElementById("coverLetter");
  loader.style.display = "block";
  coverLetter.classList.add("hidden");
}

function hideLoader() {
  const loader = document.getElementById("loader");
  const coverLetter = document.getElementById("coverLetter");
  loader.style.display = "none";
  coverLetter.classList.remove("hidden");
}
