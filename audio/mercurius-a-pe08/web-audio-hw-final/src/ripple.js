class Ripple {
    constructor(x, y, intensity) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.alpha = 1.0;
        this.growthTime = 1 + intensity * 2;
        this.fadeTime = 0.01 + intensity * 0.002;
    }

    update() {
        this.radius += this.growthTime; // expand ripple
        this.alpha -= this.fadeTime; // fade out the ripple
    }

    draw(ctx, strokeStyle) {
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

export { Ripple };