chrome.runtime.onInstalled.addListener(() => {
  console.log(process.env.GEMINI_API_KEY);
});
