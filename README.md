# Google Gemini API: NodeJS example with image and video upload

This repo is a NodeJS example of how to upload images and videos to Google's Gemini Vision API. It consists of a simple terminal-based user interface where you're asked if you want to upload a file, select which file, and provide your prompt, and get the response from Gemini.

It's intended to give a simple end-to-end example of making a Gemini API call with files.

If you're new to Google Cloud and/or prefer a video tutorial of this project, I published one here (will add later)

## Getting started

Prerequisite

- NodeJS installed on your computer
- A Google Cloud account

### Setting up project on your machine

Clone the github repo
`git clone ...`

`yarn install`

If you're not familar with git you can do this instead:

- Download the repo as a zip, or copy/paste the index.js code
- go to terminal and run these commands in your folder:
  `yarn add macos-open-file-dialog, @google-cloud/vertexai, readline`

Before you can run the project, we have to set up a Google cloud project for your Gemini API

### Setting up Gemini in Google cloud

If you want a visual guide for the steps below, go to this video (at xx:xx)

- Go to https://console.cloud.google.com/
- In the top right-hand corner, click the project selector box, then create a new project
- Name your project and proceed (you don't need to select an organization)
- After a few seconds the project should be created, then select it.
- Go back to the project selctor, and copy/paste the project ID. Replace the default value in `const projectId = "REPLACE WITH YOUR GOOGLE CLOUD PROJECT ID"` with this id
- Exit the project screen and click "APIs and services" in the Quick Access menu
- Select "Enable APIs and Services" on the top bar
- Search for Vertex, which Gemini is a part of. you should see an option "Vertex AI API", click it.
- On the Vertex AI API page, click "Enable" button

Your project now has access to the Vertex AI APIs. But there's one last step before you can run your code locally.

### Setting up Google Cloud CLI and credentials

If this is the first time you run Google Cloud APIs on your computer, you need to set up the Google Cloud CLIlocally and initalize your project.

Follow the steps below or use the official documentation.

First download and follow the install instructions in the [Google Cloud CLI docs](https://cloud.google.com/sdk/gcloud).

When you run `./google-cloud-sdk/bin/gcloud init` you should select the project you just created in Google cloud.

Once this is complete, you're ready to run your code

### Run the code

Go to the folder in your terminal and run:
`node index.js`

I've included three example files in the project that I use in my video tutorial, but you can of course use any files.

The script will ask if you want to upload a file together with your prompt, and if so ask you to select it. The `index.js` has a list where you can define which file types are allowed to be selected, as well as a list of file types that are supported by Gemini.

## Useful resources

Will add a few links later
