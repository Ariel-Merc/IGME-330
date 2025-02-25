/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	audio.setupWebAudio(DEFAULTS.sound1);
  console.log("did smth");
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  document.querySelector("#playButton").onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state
    if(audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no"){
      // if track paused, then play
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // css text will be set to pause
      
    }
    else {
      // if track playing, pause it
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // css text will be set to play
    }
  }
	
} // end setupUI

export {init};