import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-utils.js";

let ctx;
let paused = false;
let canvas;
let createRectangles = true;
let createArcs = false;
let createLines = false;

// Canvas drawing
const drawRandomRect = () => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480),
        getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(),
        getRandomInt(2, 12), getRandomColor());
}

const drawRandomArc = () => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480),
        getRandomInt(10, 90), getRandomInt(0, Math.PI * 2), getRandomInt(0, Math.PI * 2),
        getRandomColor(), getRandomInt(2, 12), getRandomColor())
}

const drawRandomLine = () => {
    drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480),
        getRandomInt(0, 640), getRandomInt(0, 480),
        getRandomInt(2, 12), getRandomColor())
}

// update animation
const update = () => {
    if (paused) {
        return;
    }
    requestAnimationFrame(update);
    if (createRectangles) {
        drawRandomRect(drawRandomRect(ctx));
    }
    if (createArcs) {
        drawRandomArc(drawRandomArc(ctx))
    }
    if (createLines) {
        drawRandomLine(drawRandomLine(ctx))
    }
}

// event handlers
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);
        let startAngle = getRandomInt(0, Math.PI * 2);
        let endAngle = getRandomInt(0, Math.PI * 2);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, startAngle, endAngle, color);
    }
}

// helpers
const setupUI = () => {
    document.querySelector("#btn-pause").onclick = () => {
        paused = true;
    }
    document.querySelector("#btn-play").onclick = () => {
        if (paused) {

            paused = false; update();
        }
    }
    document.querySelector("#btn-clear").onclick = () => {
        drawRectangle(ctx, 0, 0, 640, 480, "blue");
    }
    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = (e) => {
        createRectangles = e.target.checked;
    }
    document.querySelector("#cb-arcs").onclick = (e) => {
        createArcs = e.target.checked;
    }
    document.querySelector("#cb-lines").onclick = (e) => {
        createLines = e.target.checked;
    }
}

const init = () => {
    console.log("page loaded!");
    // page loaded, begin drawing
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    // draw base rectangle
    ctx.fillRect(20, 20, 600, 440);
    drawRectangle(ctx, 20, 20, 600, 440, "red");

    // smaller rect
    drawRectangle(ctx, 120, 120, 400, 300, "yellow", 10, "magenta");

    // two additional side rects
    drawRectangle(ctx, 50, 60, 50, 360, "purple", 10, "white");
    drawRectangle(ctx, 550, 100, 50, 300, "purple", 10, "white");

    // crossed lines
    drawLine(ctx, 20, 20, 620, 460, 10, "blue");
    drawLine(ctx, 620, 20, 20, 460, 10, "blue");

    // additional line 
    drawLine(ctx, 320, 0, 320, 600, 20, "gray");


    // face arc (circle)
    drawArc(ctx, 320, 240, 50, 0, Math.PI * 2, "green", 10, "purple", 1);

    // eye arcc (circles)
    drawArc(ctx, 300, 260, 10, 0, Math.PI * 2, "blue", 5, "white", 1);
    drawArc(ctx, 340, 260, 10, 0, Math.PI * 2, "blue", 5, "white", 1);

    // smile arc
    drawArc(ctx, 320, 240, 30, Math.PI, Math.PI * 2, "gray", 5, "yellow", 1)

    // setup and update screensaver
    setupUI();
    update();

}

init();