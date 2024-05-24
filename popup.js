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
            // generateCoverLetter(jobDescription, resume);
            document.getElementById("coverLetter").value = jobDescription;
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
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("resume", reader.result);
      alert("Resume uploaded successfully.");
    };
    reader.readAsDataURL(file);
  }
});

function extractText() {
  const paragraphs = Array.from(document.querySelectorAll("p, li"));
  return paragraphs.map((p) => p.innerText).join(" ");
}

async function generateCoverLetter(jobDescription, resume) {
  try {
    const response = await fetch("https://api.google.com/gemini/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ jobDescription, resume }),
    });
    const data = await response.json();
    document.getElementById("coverLetter").value = data.coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
  }
}
