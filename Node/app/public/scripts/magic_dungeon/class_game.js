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
    var bounds = new Rectangle(new Point(0, 0), width, height);
    var worldBounds = this.world.getDrawBounds(bounds);
    this.world.draw(canvas, worldBounds);
    this.drawHUD(canvas, width, height, worldBounds);
    if(paused) {
      this.drawPaused(canvas, width, height);
    }
  }

  drawHUD(canvas, width, height, world) {

    var player = this.world.player;

    var bounds = new Rectangle(new Point(), world.minX, height);
    if(world.minX == 0) {
      bounds = new Rectangle(new Point(), width, world.minY);
    }
    var space = 10;
    bounds.point.x += space;
    bounds.point.y += space;
    bounds.width -= space * 2;
    bounds.height -= space * 2;

    var padding = 10;
    var elemWidth = (bounds.width - (padding * (ELEMENT_COUNT + 1))) / ELEMENT_COUNT;
    var elemHeight = elemWidth;
    var x = bounds.minX;
    var y = bounds.minY;
    var element = player.element;
    for(var i = 0; i < ELEMENT_COUNT; i++) {
      if(element == ELEMENTS[i]) {
        canvas.fillStyle = "#606060";
        canvas.beginPath();
        canvas.rect(x, y, elemWidth + padding * 2, elemHeight + padding * 2);
        canvas.fill();
        canvas.closePath();
      }
      ELEMENTS[i].drawSymbol(canvas, new Rectangle(new Point(x + padding, y + padding), elemWidth, elemHeight));
      x += elemWidth + padding;
    }

    var delta = elemHeight + padding * 2;
    bounds.point.y += delta;
    bounds.height -= delta;

    var hearts = new Rectangle(new Point(), player.maxhealth, 1);
    Gui.align(bounds, hearts, [Gui.fit, Gui.center], 0);
    var heartSize = hearts.height;
    
    for(var i = 0; i < player.maxhealth; i++) {
      var heartBounds = new Rectangle(new Point(bounds.minX + i * heartSize, bounds.minY), heartSize, heartSize);
      drawImage(i >= player.health ? "heartEmpty" : "heart", canvas, heartBounds);
      x += elemWidth + padding;
    }

    delta = heartSize;
    bounds.point.y += delta;
    bounds.height -= delta;
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
    var keybindInfo = [
      "P to pause",
      "R to restart",
      "WASD to move",
      "Arrow keys to shoot",
      "1-4 to select element"
      ];

    for(var i = 0; i < keybindInfo.length; i++) {
      canvas.fillText(keybindInfo[i], x, y);
      y += dy;
    }

    y += dy;

    var pauseInfo = this.world.pauseInfo;

    for(var i = 0; i < pauseInfo.length; i++) {
      canvas.fillText(pauseInfo[i], x, y);
      y += dy;
    }
  }
}