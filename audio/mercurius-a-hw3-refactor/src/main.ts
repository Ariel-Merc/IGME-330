/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './canvas';

import { DrawParams } from './interfaces/drawParams.interface';

// draw params object with bools to toggle
const drawParams: DrawParams = {
  showPond: false,
  showBars: false,
  showLillypad: false,
  showRipples: false,
  showNoise: false,
  showInvert: false,
  showEmboss: false,
  showFish: false,
  showWaves: false,
  visualizationMode: "frequency"
};


// declare shelves
let highshelf = false;
let lowshelf = false;

// 1 - here we are faking an enumeration
import { MainDefaults } from './enums/main-defaults.enum';

const init = () => {
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebAudio(MainDefaults.Sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

const setupUI = (canvasElement: HTMLCanvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button") as HTMLButtonElement;

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // B
  let playButton = document.querySelector("#btn-play") as HTMLButtonElement;
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    const target = e.target as HTMLInputElement;
    if (target.dataset.playing == "no") {
      // if track paused, then play
      audio.playCurrentSound();
      playButton.innerHTML = "⏸";
      target.dataset.playing = "yes"; // css text will be set to pause

    }
    else {
      // if track playing, pause it
      audio.pauseCurrentSound();
      playButton.innerHTML = "▶";
      target.dataset.playing = "no"; // css text will be set to play
    }
  }

  // C - hookup volume slider & label
  const volumeSlider = document.querySelector("#slider-volume") as HTMLInputElement;
  let volumeLabel = document.querySelector("#volume-label");

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    const target = e.target as HTMLInputElement;
    // set gain
    audio.setVolume(target.value);
    //update value of label to match slider value
    const value = Number((e.target as HTMLInputElement).value);
    volumeLabel.innerHTML = Math.round((value / 2 * 100)).toString();
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#select-track") as HTMLSelectElement;
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    const target = e.target as HTMLInputElement;
    audio.loadSoundFile(target.value);
    // pause current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
      playButton.innerHTML = "▶";
    }
  }

  // toggling check boxes
  const pondCheckbox = document.querySelector("#cb-pond") as HTMLInputElement;

  pondCheckbox.onclick = () => {
    drawParams.showPond = !drawParams.showPond;
  }
  const lillypadCheckbox = document.querySelector("#cb-lillypad") as HTMLInputElement;

  lillypadCheckbox.onclick = () => {
    if (drawParams.showLillypad) {
      drawParams.showLillypad = false;
      drawParams.showBars = false;
    }
    else {
      drawParams.showLillypad = true;
      drawParams.showBars = true;
    }
  }
  const noiseCheckbox = document.querySelector("#cb-noise") as HTMLInputElement;

  noiseCheckbox.onclick = () => {
    if (drawParams.showNoise) {
      drawParams.showNoise = false;
    }
    else {
      drawParams.showNoise = true;
    }
  }
  const invertCheckbox = document.querySelector("#cb-invert") as HTMLInputElement;


  invertCheckbox.onclick = () => {
    if (drawParams.showInvert) {
      drawParams.showInvert = false;
    }
    else {
      drawParams.showInvert = true;
    }
  }
  const embossCheckbox = document.querySelector("#cb-emboss") as HTMLInputElement;

  embossCheckbox.onclick = () => {
    if (drawParams.showEmboss) {
      drawParams.showEmboss = false;
    }
    else {
      drawParams.showEmboss = true;
    }
  }
  const rippleCheckbox = document.querySelector("#cb-ripple") as HTMLInputElement;

  rippleCheckbox.onclick = () => {
    if (drawParams.showRipples) {
      drawParams.showRipples = false;
    }
    else {
      drawParams.showRipples = true;
    }
  }
  const fishCheckbox = document.querySelector("#cb-fish") as HTMLInputElement;

  fishCheckbox.onclick = () => {
    if (drawParams.showFish) {
      drawParams.showFish = false;
    }
    else {
      drawParams.showFish = true;
    }
  }
  const visualizeCheckbox = document.querySelector("#select-viz") as HTMLInputElement;

  visualizeCheckbox.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    drawParams.visualizationMode = target.value;
  };



  // Audio Modifications
  const highshelfCheckbox = document.querySelector("#cb-highshelf") as HTMLInputElement;
  highshelfCheckbox.checked = highshelf;
  // change the value of highshelf every time checkbox changes state
  highshelfCheckbox.onchange = e => {
    const target = e.target as HTMLInputElement;
    highshelf = target.checked;
    audio.toggleHighshelf(highshelf); // turn on or turn off the filter
  };
  const lowshelfCheckbox = document.querySelector("#cb-lowshelf") as HTMLInputElement;
  lowshelfCheckbox.checked = lowshelf;
  lowshelfCheckbox.onchange = e => {
    const target = e.target as HTMLInputElement;
    lowshelf = target.checked;
    audio.toggleLowshelf(lowshelf);
  };


} // end setupUI

const loop = () => {
  canvas.draw(drawParams);
  setTimeout(loop, 1000 / 60); // Limit the loop to 60 FPS
}

export { init, drawParams };