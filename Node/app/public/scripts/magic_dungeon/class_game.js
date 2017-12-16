class Game {
  constructor() {
    this.tick = 0;

    this.world = new World(this);
  }

  register(keys) {
    this.keys = keys;
    this.io = new IO(keys);
  }

  unregister(keys) {
    
  }

  end(msg) {
    //displays the given message then ends the game
    
  }

  restart() {
    this.world = new World(this);
    GAME_PAUSED = true;
  }

  update(tickPart, paused) {
    if(paused) {
      //...?
    } else {
      this.tick += tickPart;
      if(!this.world.update(tickPart)) {
        this.restart();
      }
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
    this.world.draw(canvas, new Rectangle(new Point(0, 0), width, height));
  }

  drawHUD(canvas, width, height) {

    //white outline
/*
    canvas.strokeStyle = "#ffffff";
    var sz = 2;
    canvas.lineWidth = sz * 2;
    canvas.beginPath();
    canvas.rect(-sz, -sz, width + sz * 2, height + sz * 2);
    canvas.stroke();
    canvas.closePath();
*/

    //ball
/*
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";
    canvas.lineWidth = 1;
    canvas.beginPath();
    canvas.arc(this.tick % width, this.tick % height, 10, 0, Math.PI*2);
    canvas.fill();
    canvas.stroke();
    canvas.closePath();
*/
  }

  drawPaused(canvas, width, height) {
    //overlay
    canvas.fillStyle = "#00000070";
    canvas.strokeStyle = "#ffffff";
    canvas.lineWidth = 4;
    canvas.beginPath();
    canvas.rect(0, 0, width, height);
    canvas.fill();
    canvas.stroke();
    canvas.closePath();

    //title text
    canvas.font = '36px sans-serif';
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#000000";
    canvas.lineWidth = 1;
    canvas.fillText("Paused", 20, 50);

    //info text

    canvas.font = '24px sans-serif';
    var x = 40;
    var y = 80;
    var dy = 30;

    //TODO: keybind info

    var pauseInfo = this.world.pauseInfo;

    for(var i = 0; i < pauseInfo.length; i++) {
      canvas.fillText(pauseInfo[i], x, y);
      y += dy;
    }
  }
}