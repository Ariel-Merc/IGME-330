import { FishParams } from "../interfaces/fishParams.interface";

export default class Fish {
    image: HTMLImageElement;
    radius: number;
    theta: number;
    baseSpeed: number;
    currentSpeed: number;

    constructor({ image, radius }: FishParams) {
        this.image = new Image();
        this.image.src = image;
        this.radius = radius; // distance from center
        this.theta = 0;
        this.baseSpeed = 0.01;
        this.currentSpeed = this.baseSpeed;
    }

    update(audio: Uint8Array) {
        //let maxIntensity = Math.max(...audio) / 255; // Get strongest audio frequency
        const percent = audio[0] / 255;
        const maxIntensity = percent;
        this.currentSpeed = this.baseSpeed + maxIntensity * 0.1; // Adjust speed accordingly

        // Move in a clockwise circular path
        this.theta -= this.currentSpeed;
        if (this.theta < 0) {
            this.theta += Math.PI * 2;
        }
    }

    draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        const x = canvasWidth / 2 + this.radius * Math.cos(this.theta);
        const y = canvasHeight / 2 + this.radius * Math.sin(this.theta);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.theta);
        // draw image
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        ctx.restore();
    }
}