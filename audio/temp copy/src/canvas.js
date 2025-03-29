/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import { Ripple } from './ripple.js';
import { Fish } from "./fish.js";


let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let rotation = 0;
let waveOffset = 0;
let ripples = []; // Array to store active ripples
let fish = new Fish("../images/fish2.png", -240);
let bgImage = new Image();
bgImage.src = "../images/pond.png";
let lilypad = new Image();
lilypad.src = "../images/lotus.png";


const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

const draw = (params = {}) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    // Choose the correct data type based on user selection
    if (params.visualizationMode === "waveform") {
        analyserNode.getByteTimeDomainData(audioData);
    } else {
        analyserNode.getByteFrequencyData(audioData);
    }
    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - Set pond backdrop
    if (params.showPond) {
        ctx.save();
        ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    if (params.showWaves) {
        let waveAmplitude = document.querySelector("#slider-wave").value; // Get amplitude from slider
        let speed = 2; // Wave movement speed
        ctx.fillStyle = "rgba(0, 150, 255, 0.8)";

        // move line to the right
        waveOffset += speed;

        for (let i = 0; i < 20; i++) { // Generate multiple circles per frame

            let x = (waveOffset + i * 40) % canvasWidth; // Continuous movement to the right
            let y = canvasHeight / 2 + Math.sin((waveOffset + i * 10) * 0.05) * waveAmplitude; // Apply amplitude

            // Get audio intensity at this point
            let audioIntensity = audioData[i] / 255;

            // Apply pulsing effect
            let baseRadius = 10;
            let pulsingRadius = baseRadius;

            if (audioIntensity > 0.55) {
                pulsingRadius = baseRadius + (audioIntensity * 10);
            }

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, pulsingRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    // 4 - draw bars
    if (params.showBars) {
        let numBars = Math.min(64, audioData.length);
        let innerRadius = 70; // circle of bars
        let barWidth = 13;
        let barHeightMultiplier = 0.5; // Adjust bar height

        ctx.save();
        ctx.strokeStyle = `rgba(64, 176, 33, 0.8)`;

        for (let i = 0; i < numBars; i++) {
            let angle = (i / numBars) * Math.PI * 2;
            let barHeight = audioData[i] * barHeightMultiplier;

            let startX = -Math.cos(angle) * innerRadius;
            let startY = -Math.sin(angle) * innerRadius;
            let endX = -Math.cos(angle) * (innerRadius + barHeight);
            let endY = -Math.sin(angle) * (innerRadius + barHeight);

            ctx.save();
            ctx.lineWidth = barWidth;
            ctx.translate((canvasWidth / 2), (canvasHeight / 2));
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();

    }

    if (params.showFish) {
        fish.update(audioData);
        fish.draw(ctx, canvasWidth, canvasHeight);
    }

    // 5 - draw circles
    if (params.showLillypad) {
        let percent = audioData[0] / 255;
        rotation += percent * 0.03;
        ctx.save();
        ctx.translate((canvasWidth / 2), (canvasHeight / 2));
        ctx.rotate(-rotation);
        ctx.drawImage(lilypad, -80, -100, 210, 190);
        ctx.restore();
    }

    if (params.showRipples) {
        for (let i = 0; i < audioData.length; i++) {
            let percent = document.querySelector("#slider-intensity").value;
            if ((audioData[i] / 255) > 0.001 && Math.random() < 0.001) {

                let ripple = new Ripple(
                    Math.random() * canvasWidth,// random x
                    Math.random() * canvasHeight, // random y
                    percent // audio intensity
                );
                ripples.push(ripple);
            }

        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            let r = ripples[i];

            r.update();
            r.draw(ctx);

            if (r.isDead()) {
                ripples.splice(i, 1);
            }
        }
    }


    // 6 - bitmap manipulation
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < 0.05) {
            data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
            data[i] = 100; // make the red channel 100% red
        }

        // invert
        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i + 1] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        }
    }

    // add embossing
    for (let i = 0; i < length; i++) {
        // do so only if checkbox is checked
        if (params.showEmboss) {
            if (i % 4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw };