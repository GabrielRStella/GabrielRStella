class Game {
  constructor() {
    this.tick = 0;

    this.world = new World(this);

    this.prevPaused = false;
  }

  register(keys) {
    this.keys = keys;
    this.io = new IO(keys);
    this.KEY_MAP = new Key(KEY_M, function(e) {
      if(GAME_PAUSED) GAME_PAUSED = false;
      else this.display(new ScreenMap(this));
    }.bind(this));
    keys.addKeyListenerDown(this.KEY_MAP);
  }

  unregister(keys) {
    keys.removeKeyListenerDown(this.KEY_MAP);
  }

  end(msg) {
    //displays the given message then ends the game
    
  }

  restart() {
    this.world = new World(this);
    GAME_PAUSED = true;
  }

  display(screen) {
    GAME_PAUSED = true;
    this.screen = screen;
  }

  update(tickPart, paused) {
    if(!paused && this.prevPaused) this.screen = null;
    this.prevPaused = paused;
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
    this.drawHUD(canvas, width, height, worldBounds, paused);
    if(paused) {
      this.drawPaused(canvas, width, height);
    }
  }

  drawHUD(canvas, width, height, world, paused) {

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

    if(!paused) {
      canvas.font = '24px sans-serif';
      canvas.fillStyle = "#ffffff";
      canvas.strokeStyle = "#000000";

      var x = bounds.minX + 20;
      var y = bounds.minY + 30;
      var dy = 30;

      var pauseInfo = this.world.pauseInfo(true);

      for(var i = 0; i < pauseInfo.length; i++) {
        canvas.fillText(pauseInfo[i], x, y);
        y += dy;
      }
    }
  }

  drawPaused(canvas, width, height) {
    if(!this.screen) {
      this.screen = new ScreenPause(this);
    }

    this.screen.draw(canvas, width, height);
  }
}