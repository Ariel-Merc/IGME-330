import { RippleParams } from "../interfaces/rippleParams.interface";

export default class Ripple {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    growthTime: number;
    fadeTime: number;

    constructor({ x, y, intensity }: RippleParams) {
        Object.assign(this, { x, y });
        this.radius = 5;
        this.alpha = 1.0;
        this.growthTime = 1 + intensity * 2;
        this.fadeTime = 0.01 + intensity * 0.002;
    }

    update() {
        this.radius += this.growthTime; // expand ripple
        this.alpha -= this.fadeTime; // fade out the ripple
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.alpha})`; // Light blue ripple
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    isDead() {
        return this.alpha <= 0;
    }
}