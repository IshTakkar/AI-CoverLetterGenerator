import * as pdfjsLib from "pdfjs-dist";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
            generateCoverLetter(jobDescription, resume);
          } else {
            alert("Please upload your resume first.");
          }
        }
      }
    );
  });
});

document.getElementById("resumeUpload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);
      const text = await extractTextFromPDF(pdfData);
      localStorage.setItem("resume", text);
      alert("Resume uploaded and parsed successfully.");
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Please upload a valid PDF file.");
  }
});

function extractText() {
  const paragraphs = Array.from(document.querySelectorAll("p, li"));
  return paragraphs.map((p) => p.innerText).join(" ");
}

async function extractTextFromPDF(pdfData) {
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
      You are a cover letter generator. Your task is to create professional and concise 
      cover letters based on the given resume and job descriptions. 
      To compose a compelling cover letter, you must scrutinize the job description 
      for key qualifications. Begin with a succinct introduction about the candidate's 
      identity and career goals. Highlight skills aligned with the job, underpinned by 
      tangible examples. Incorporate details about the company, emphasizing its mission 
      or unique aspects that align with the candidate's values. Conclude by reaffirming 
      the candidate's suitability, inviting further discussion. Use job-specific 
      terminology for a tailored and impactful letter, maintaining a professional 
      style suitable for a Full-Stack Software Developer. Please provide your response 
      in under 300 words.

      This is the job description:
      ${jobDescription}

      This is my resume:
      ${resume}
    `;

    // const prompt = "how are you?"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    document.getElementById("coverLetter").value = text;
  } catch (error) {
    console.error("Error generating cover letter:", error);
  }
}
