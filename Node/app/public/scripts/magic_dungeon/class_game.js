class Game {
  constructor() {
    this.tick = 0;
    this.lastTick = 0;
  }

  register(keys) {
    
  }

  unregister(keys) {
    
  }

  update(tickPart, paused) {
    this.lastTick = tickPart;
    if(paused) {
      //...?
    } else {
      this.tick += tickPart;
    }
  }

  draw(canvas, width, height, paused) {
    this.drawGame(canvas, width, height);
    this.drawHUD(canvas, width, height);
    if(paused) {
      this.drawPaused(canvas, width, height);
    }
  }

  drawGame(canvas, width, height) {
    canvas.fillStyle = "#ffffff";
    canvas.beginPath();
    canvas.arc(this.tick % width, this.tick % height, 10, 0, Math.PI*2);
    canvas.fill();
    canvas.stroke();
    canvas.closePath();
  }

  drawHUD(canvas, width, height) {
    canvas.drawImage(getImage("box"), 0, 0, width - (this.tick % width), height - (this.tick % height));
  }

  drawPaused(canvas, width, height) {
    canvas.font = '24px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";
    canvas.lineWidth = 1;
    canvas.fillText("Paused", 200, 50);
  }
}