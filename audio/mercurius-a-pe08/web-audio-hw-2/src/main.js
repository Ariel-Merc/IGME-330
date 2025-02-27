/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// draw params object with bools to toggle
const drawParams = {
  showGradient: true,
  showBars: true,
  showCircles: true,
  showNoise: true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "./media/New Adventure Theme.mp3"
});

function init() {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebAudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

function setupUI(canvasElement) {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // B
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no") {
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

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set gain
    audio.setVolume(e.target.value);
    //update value of label to match slider value
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  // toggling check boxes
  document.querySelector("#gradientCB").onclick = () => {
    if (drawParams.showGradient) {
      drawParams.showGradient = false;
    }
    else {
      drawParams.showGradient = true;
    }
  }
  document.querySelector("#barsCB").onclick = () => {
    if (drawParams.showBars) {
      drawParams.showBars = false;
    }
    else {
      drawParams.showBars = true;
    }
  }
  document.querySelector("#circlesCB").onclick = () => {
    if (drawParams.showCircles) {
      drawParams.showCircles = false;
    }
    else {
      drawParams.showCircles = true;
    }
  }

} // end setupUI

function loop() {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  canvas.draw(drawParams);
}

export { init };