const { openFile } = require("macos-open-file-dialog"); // Sorry windows users, could not get node-file-dialog to work on my machine.
const fs = require("fs").promises;
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { VertexAI } = require("@google-cloud/vertexai");

// // // VERTEX/GEMINI CONFIGURATIN -- CHANGE THIS TO YOUR PROJECT // // //
const projectLocation = "us-central1";
const projectId = "REPLACE WITH YOUR GOOGLE CLOUD PROJECT ID";
const model = "gemini-pro-vision"; // vision required for images/videos
// // //

// Take a file and return a base64 string
async function getFileAsBase64(filePath) {
  const fileData = await fs.readFile(filePath);
  return fileData.toString("base64");
}

// List of file types you want to allow a user to upload to Gemini
const allowedTypes = [
  "public.png",
  "public.jpeg",
  "public.jpg",
  "public.webp",
  "public.heic",
  "public.heif",
  "com.apple.quicktime-movie",
  "public.mpeg-4",
  "public.avi",
  "com.microsoft.windows-media-wmv",
  "public.mpeg",
];

// Get the MIME file type required by Gemini when passing files
function getMimeType(filePath) {
  const extensionToMimeType = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    mov: "video/mov",
    mpeg: "video/mpeg",
    mp4: "video/mp4",
    mpg: "video/mpg",
    avi: "video/avi",
    wmv: "video/wmv",
    mpegps: "video/mpegps",
    flv: "video/flv",
  };

  const extension = filePath.split(".").pop().toLowerCase();
  return extensionToMimeType[extension] || null;
}

function askQuestion(question) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

//
async function callGeminiAPI(
  projectId,
  projectLocation,
  model,
  inputFilePath,
  userPrompt
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({
    project: projectId,
    location: projectLocation,
  });

  // Instantiate the model
  const generativeVisionModel = vertexAI.preview.getGenerativeModel({
    model: model,
  });

  // Construct the request with the user question only, assuming no file is uploaded
  const textPart = {
    text: userPrompt,
  };
  let requestPart = [textPart];

  // If the user has selected a file, add it to the request
  if (inputFilePath) {
    // Gemini requires the file in base64 and with a mimetype
    const base64File = await getFileAsBase64(inputFilePath);
    const mimeType = await getMimeType(inputFilePath);

    const filePart = {
      inlineData: {
        data: base64File,
        mimeType: mimeType,
      },
    };

    // Push the file information to  requestPart
    requestPart.push(filePart);
  }

  const request = {
    contents: [{ role: "user", parts: requestPart }],
  };

  // Create the response stream
  let aggregatedResponse;
  try {
    const responseStream = await generativeVisionModel.generateContentStream(
      request
    );

    // Wait for the response stream to complete
    aggregatedResponse = await responseStream.response;
  } catch (error) {
    return `There was an error processing the API request: ${error}`;
  }

  return aggregatedResponse.candidates[0].content.parts[0].text;
}

async function main() {
  let keepRunning = true;

  console.log(
    "\n/ // /// //// WELCOME TO YOUR GEMINI CHAT BOT //// /// // /\n\n"
  );
  while (keepRunning) {
    let filePath = "";
    const uploadChoice = await askQuestion(
      "Do you want to upload a file with your question? (yes/no): "
    );

    let inputFilePath = null;

    // This will only work on macOS. If you're on windows use e.g. node-file-dialog package, or comment the if-statement below and hard-code the inputFilePath above to: let inputFilePath = "myFileName.png"
    if (uploadChoice.toLowerCase() === "yes") {
      inputFilePath = await openFile("Select a file", allowedTypes);
      if (!inputFilePath) {
        console.log("No file selected.");
      }
    }

    // Ask the user what their question is
    const userQuestion = await askQuestion("\nWhat's your question? ");

    // Call the Gemini API
    const geminiResponse = await callGeminiAPI(
      projectId,
      projectLocation,
      model,
      inputFilePath,
      userQuestion
    ).catch((err) => {
      console.error(err.message);
      process.exitCode = 1;
    });

    console.log(`\n${geminiResponse}\n`);

    const continueRunning = await askQuestion(
      "Do you have another question? (yes/no): "
    );
    keepRunning = continueRunning.toLowerCase() === "yes";
  }
  console.log("\nOk, have a great rest of your day!\n");
  readline.close();
}

main();
