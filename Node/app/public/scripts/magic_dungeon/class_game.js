class Game {
  constructor() {
    this.tick = 0;

    this.world = new World(this);

    this.prevPaused = false;

    this.score = 0;
    this.loadHighScore();
  }

  get scoreInfo() {
    return [
        "Score: " + this.score,
        "High Score: " + this.highScore,
      ];
  }

  addScore(s) {
    this.score += s;
    this.saveScore();
  }

  saveScore() {
    if(this.score > this.highScore) {
      var date = new Date();
      date.setFullYear(date.getFullYear() + 1); //won't expire for a while :)
      document.cookie = "maxScore=" + this.score + ";expires=" + date;
      this.highScore = this.score;
    }
  }

  loadHighScore() {
    var cookie = document.cookie;
    var index = cookie.search("maxScore=");
    if(index >= 0) {
      index += 9; //beginning of the number
      this.highScore = parseInt(cookie.substring(index));
    } else this.highScore = 0;
    return this.highScore;
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
    this.screen = new ScreenDeath(this, msg);
    this.world = new World(this);
    GAME_PAUSED = true;
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
    var heartEmpty = getImage("heartEmpty");
    var heartFull = getImage("heart");
    var imgW = heartFull.width;
    var imgH = heartFull.height;
    
    for(var i = 0; i < player.maxhealth; i++) {
      var delta = player.health - i;
      var r = new Rectangle(new Point(bounds.minX + i * heartSize, bounds.minY), heartSize, heartSize);
      if(true) { //what condition?
        canvas.drawImage(heartEmpty, r.minX, r.minY, r.width, r.height);
      }
      if(delta > 0) {
        if(delta >= 1) {
          canvas.drawImage(heartFull, r.minX, r.minY, r.width, r.height);
        } else {
          canvas.drawImage(heartFull, 0, 0, imgW * delta, imgH, r.minX, r.minY, r.width * delta, r.height);
        }
      }
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

      y += dy;
      var scoreInfo = this.scoreInfo;

      for(var i = 0; i < scoreInfo.length; i++) {
        canvas.fillText(scoreInfo[i], x, y);
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