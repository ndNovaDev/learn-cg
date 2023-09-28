export class Canvas {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.cw = canvasEl.width;
    this.ch = canvasEl.height;
  }

  transformPos(x, y) {
    return {
      x: x + this.cw / 2,
      y: this.ch / 2 - y - 1,
    };
  }

  transformColor(color) {
    const [r, g, b] = color;
    return `rgb(${r},${g},${b})`;
  }

  putPixel(x, y, color) {
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.transformColor(color);
    const { x: tx, y: ty } = this.transformPos(Math.floor(x), Math.floor(y));
    ctx.fillRect(tx, ty, 1, 1);
  }
}
