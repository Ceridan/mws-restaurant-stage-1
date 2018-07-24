# Mobile Web Specialist Certification Course
This repository forked from: https://github.com/udacity/mws-restaurant-stage-1

Here is my implementation of the **Restaurant Review project (stages 1, 2 and 3)** as a part of [Mobile Web Specialist Nanodegree](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024) from the [Udacity](https://www.udacity.com).

Checkout `master` branch to work with the latest version of the Restaurant Review project (currently stage 3).

You may also checkout `complete-stage-1` branch to see the project state when it passed stage 1 review or `complete-stage-2` branch to see the project state when it passed stage 2.

## How to build and run the Restaurant Review project

### Step 1. How to build the Restaurant Review project
To build the project you need [npm and Node.js](https://nodejs.org/) installed (tested with npm 5.6 and Node.js 9+ versions). Also you have to install [Gulp](https://gulpjs.com/) build tool.
To install Gulp use the following command:
```
$ npm install -g gulp-cli
```
The project uses Google Maps and you have to provide your own [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) to use it. To do this you should create `secret.json` file in the root folder of the project and add the following information to it:
```
{
  "GoogleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
}
```

Now you are ready to build the project. Use the following commands:
```
$ npm install
$ npm run build
```
The `dist` folder should appear in the project directory.

### Step 2. How to run the Restaurant Review server project
To work with stage 3 code you have to run the server project which provides all restaurant review data. To run it you have to clone the [Server Project](https://github.com/udacity/mws-restaurant-stage-3) and follow the instructions how to run it in the `README.md`.

### Step 3. How to run the Restaurant Review project
You should have the `dist` folder after completing step 1. You have few options how to run the project.

**Option 1.** You may serve the project using [BrowserSync](https://browsersync.io/). To do this run the following command:
```
$ npm run serve
```
Now the Restaurant Review project is available via URL: `http://localhost:3000`

**Option 2.** You may serve the project using [BrowserSync](https://browsersync.io/) in developer mode. It means that you will have the same project, but without minification CSS and JS files. So it allows to debug the project using the [Google Developer Tools](https://developer.chrome.com/devtools). To do this run the following command:
```
$ npm run dev
```
Now the Restaurant Review project is available via URL: `http://localhost:3000`

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 

### Copyrights
This project uses open source libraries:
  - [idb](https://github.com/jakearchibald/idb) for pretty promise-like interface over IndexedDB. Thanks to [Jake Archibald] (https://jakearchibald.com/)

Also thanks to [Iconfinder](https://www.iconfinder.com/) and [DinosoftLabs](https://www.iconfinder.com/dinosoftlabs) for `manifest.json` icons.
