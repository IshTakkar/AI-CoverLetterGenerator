# AI-CoverLetterGenerator Chrome Extension

This Chrome extension allows users to generate a professional cover letter from a job description on the current page using a pre-uploaded resume. The extension scrapes the current page, parses an uploaded PDF resume, and utilizes the Google Gemini API to generate a customized cover letter.

## Features

- Scrapes the job description on the current webpage.
- Parses uploaded PDF resumes to extract text.
- Generates a cover letter using the Google Gemini API.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- A Google Gemini API key.

### Step-by-Step Guide

1. **Clone the repository**

    ```bash
    git clone https://github.com/IshTakkar/AI-CoverLetterGenerator.git
    cd AI-CoverLetterGenerator
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root of the project and add your Google Gemini API key:

    ```env
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4. **Build the project**

    ```bash
    npx webpack --config webpack.config.js
    ```

    This will create a `dist` folder containing the bundled files. Note that the `.env` and `dist` folders are included in `.gitignore` to keep sensitive information secure and prevent build files from being tracked.

### Manual Installation of Chrome Extension

Since this extension is not available on the Chrome Web Store (yet), you'll need to install it manually:

1. **Open the Chrome browser and navigate to the Extensions page**

    ```url
    chrome://extensions/
    ```

2. **Enable Developer Mode**

    Toggle the "Developer mode" switch in the top right corner.

3. **Load the unpacked extension**

    Click the "Load unpacked" button and select the `dist` folder from the project directory.

4. **Pin the extension**

    Optionally, you can pin the extension to the Chrome toolbar for easy access.

## Usage

1. **Open a webpage with a job description**

    Navigate to a webpage that contains a job description. The extension will scrape the job description from the page.

2. **Upload your resume**

    Click the extension icon in the toolbar. In the popup, upload your resume in PDF format.

3. **Generate the cover letter**

    Click the "Generate Cover Letter" button. The extension will use the Google Gemini API to generate a customized cover letter based on the job description and your resume. The generated cover letter will be displayed in the textarea.

## Project Structure

- `popup.js`: Main JavaScript file for the extension's popup.
- `background.js`: Background script for the extension.
- `dist/`: Directory for the bundled files (ignored in the repository).
- `manifest.json`: Configuration file for the Chrome extension.
- `popup.html`: HTML file for the extension's popup interface.
- `popup.html`: CSS file containing the styles
- `webpack.config.js`: Webpack configuration file.
- `.env`: Environment variables file (ignored in the repository).
- `.gitignore`: List of files and directories to be ignored by Git.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Google Generative AI](https://ai.google.dev/gemini-api) for the cover letter generation.
- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist) for PDF parsing.
- [Webpack](https://webpack.js.org/) for module bundling.
