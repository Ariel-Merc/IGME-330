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
const drawParams = {};

// declare shelves
let highshelf = false;
let lowshelf = false;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "./media/The Forests of Gliese.mp3"
});

const init = () => {
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebAudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // B
  let playButton = document.querySelector("#btn-play");
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
      playButton.innerHTML = "⏸";
      e.target.dataset.playing = "yes"; // css text will be set to pause

    }
    else {
      // if track playing, pause it
      audio.pauseCurrentSound();
      playButton.innerHTML = "▶";
      e.target.dataset.playing = "no"; // css text will be set to play
    }
  }

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume");
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
      playButton.innerHTML = "▶";
    }
  }

  // toggling check boxes
  document.querySelector("#cb-pond").onclick = () => {
    if (drawParams.showPond) {
      drawParams.showPond = false;
    }
    else {
      drawParams.showPond = true;
    }
  }
  document.querySelector("#cb-lillypad").onclick = () => {
    if (drawParams.showLillypad) {
      drawParams.showLillypad = false;
      drawParams.showBars = false;
    }
    else {
      drawParams.showLillypad = true;
      drawParams.showBars = true;
    }
  }
  document.querySelector("#cb-noise").onclick = () => {
    if (drawParams.showNoise) {
      drawParams.showNoise = false;
    }
    else {
      drawParams.showNoise = true;
    }
  }
  document.querySelector("#cb-invert").onclick = () => {
    if (drawParams.showInvert) {
      drawParams.showInvert = false;
    }
    else {
      drawParams.showInvert = true;
    }
  }
  document.querySelector("#cb-emboss").onclick = () => {
    if (drawParams.showEmboss) {
      drawParams.showEmboss = false;
    }
    else {
      drawParams.showEmboss = true;
    }
  }
  document.querySelector("#cb-ripple").onclick = () => {
    if (drawParams.showRipples) {
      drawParams.showRipples = false;
    }
    else {
      drawParams.showRipples = true;
    }
  }
  document.querySelector("#cb-fish").onclick = () => {
    if (drawParams.showFish) {
      drawParams.showFish = false;
    }
    else {
      drawParams.showFish = true;
    }
  }
  // document.querySelector("#cb-waves").onclick = () => {
  //   if (drawParams.showWaves) {
  //     drawParams.showWaves = false;
  //   }
  //   else {
  //     drawParams.showWaves = true;
  //   }
  // }


  // Audio Modifications
  document.querySelector("#cb-highshelf").checked = highshelf;
  // change the value of highshelf every time checkbox changes state
  document.querySelector("#cb-highshelf").onchange = e => {
    highshelf = e.target.checked;
    audio.toggleHighshelf(highshelf); // turn on or turn off the filter
  };
  document.querySelector("#cb-lowshelf").checked = lowshelf;
  document.querySelector("#cb-lowshelf").onchange = e => {
    lowshelf = e.target.checked;
    audio.toggleLowshelf(lowshelf);
  };


} // end setupUI

const loop = () => {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  requestAnimationFrame(loop);
  canvas.draw(drawParams);
}

export { init, drawParams };