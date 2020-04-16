
/*
The game's title screen.
Elements:
-title text
-Play button
-High Score info
*/

class Button {
  constructor(rect, title, id) {
    this.rect = rect;
    this.title = title;
    this.id = id;
  }
};

class ScreenMain extends Screen {
  constructor() {
    super();
    this.align = new Aligner();
    //TODO: elements and alignment and...
    this.modes = [
      ["Easy", 1, "#00ff00"],
      ["Medium", 2, "#ffff00"],
      ["Hard", 3, "#ff0000"]
    ];
    this.buttons = [];
    this.header = new Rectangle(0, 0, 380, 65);
    for(var i = 0; i < this.modes.length; i++) {
      var mode = this.modes[i]
      this.buttons.push(new Button(new Rectangle(0, 0, 250, 70), mode[0], mode[1]));
      this.align.add(i > 0 ? this.buttons[i-1].rect : this.header, this.buttons[i].rect, [RectanglePosition.center, RectanglePosition.below], i > 0 ? 20 : 50);
    }
    this.selected = -1;
    
    this.ball = null;
    this.ballradius = 10;
    this.balldir = GameLib.randomUnitPoint();
    this.ballspeed = 7.5;
  }

  //when it first gets added on
  //also supplies window dimensions as a rect
  //parent (Screen): if this Screen was just pushed, then parent is the Screen before it (or null)
  enter(gui, window, parent) {
    this.gui = gui;
  }

  //final (bool): is this gui coming off the stack, or is it just being covered
  exit(gui, final) {}

  //IO registration
  register(keys, mouse) {}
  unregister(keys, mouse) {}

  //default input events (mouse)
  mouseDown(pt) {} //mouse btn down at a point
  mouseUp(pt) {} //mouse btn up at a point
  mouseMove(prev, pt) {
    this.selected = -1;
    for(var i = 0; i < this.buttons.length; i++) {
      if(this.buttons[i].rect.contains(pt)) {
        this.selected = i;
        break;
      }
    }
  } //mouse moved from prev to pt
  mouseDrag(prev, pt) {} //mouse moved from prev to pt while button down
  mouseDownUp(start, end) {
    //console.log(start, end);
    for(var i = 0; i < this.buttons.length; i++) {
      var b = this.buttons[i];
      var r = b.rect;
      if(r.contains(start) && r.contains(end)) {
        this.selected = -1;
        //play game
        var game = new Game(b.id /*difficulty = id*/);
        //transition
        this.gui.push(new ScreenGameTransition(game, this.ball, this.ballradius, this.ballspeed));
      }
    }
  } //mouse btn down at start and up at end

  //just in case they want to update some logic without having checks in update()
  resize(windowRect) {
    RectanglePosition.center(windowRect, this.header);
    RectanglePosition.insideY(windowRect, this.header, 0.25);
    this.align.align();
    if(this.ball == null) {
      this.ball = new Point();
      this.ball = windowRect.sample();
    } else {
      if(this.prevWindow != null) {
        this.ball.x *= windowRect.width / this.prevWindow.width;
        this.ball.y *= windowRect.height / this.prevWindow.height;
      }
      this.prevWindow = windowRect.copy();
    }
  }

  update(tickPart, windowRect, cursor) {
    if(this.ball != null) {
      this.ball.x += this.balldir.x * this.ballspeed;
      this.ball.y += this.balldir.y * this.ballspeed;
      //check edge collision
      if(
        this.ball.x - this.ballradius < 0 ||
        this.ball.x + this.ballradius > windowRect.width ||
        this.ball.y - this.ballradius < 0 ||
        this.ball.y + this.ballradius > windowRect.height
      ) {
        //if it is colliding, bounce off (towards the cursor)
        this.balldir = cursor.copy();
        this.balldir.sub(this.ball);
        //I changed my mind, bounce it randomly
        this.balldir = windowRect.sample();
        this.balldir.sub(this.ball);
        this.balldir.magnitude = 1;
      }
    }
  }
  render(ctx, windowRect) {
    ctx.save();
    //decorative ball
    ctx.lineWidth = 2;
    if(this.ball != null) this.drawPoint(ctx, this.ball, "#000000", "#ffffff", this.ballradius);
    //title
    //this.drawRect(ctx, this.header, "#000000", "#ffffff");
    ctx.lineWidth = 2;
    this.drawTextCentered(ctx, "SUP NOOB", 72, this.header.center, "#000000", "#ffffff")
    //buttons
    for(var i = 0; i < this.buttons.length; i++) {
      ctx.lineWidth = 1;
      var s = (this.selected == i);
      if(s) ctx.lineWidth = 2;
      var color = s ? this.modes[i][2] : "#ffffff";
      this.drawRect(ctx, this.buttons[i].rect, null, color);
      ctx.lineWidth = 1;
      this.drawTextCentered(ctx, this.buttons[i].title, 36, this.buttons[i].rect.center, "#000000", color);
    }
    ctx.restore();
  }

  //rendering helper functions
  //renderTitle(ctx, text);
  //drawRect(ctx, r, fill, stroke);
  //drawPoint(ctx, p, fill, stroke, radius);
  //drawLine(ctx, a, b, color);
  //drawTextCentered(ctx, text, size, p, fill, stroke);
}

//a screen that transitions between Main Menu and actual Game screen
class ScreenGameTransition extends Screen {
  constructor(game, ball, ballradius, ballspeed) {
    super();
    this.game = game;
    this.ball = ball;
    this.ballradius = ballradius;
    //ball to center
    this.balldir = null;
    this.ballspeed = ballspeed;
    this.balldone = false;
  }
  
  enter(gui, window, parent) {
    this.gui = gui;
    this.balldir = window.center.copy();
    this.balldir.sub(this.ball);
    this.balldir.magnitude = 1;
  }
  
  resize(windowRect) {
    this.balldir = windowRect.center.copy();
    this.balldir.sub(this.ball);
    this.balldir.magnitude = 1;
  }

  update(tickPart, windowRect, cursor) {
    if(this.balldir != null) {
      if(this.ball.distance(windowRect.center) < this.ballspeed) {
        this.ball = windowRect.center.copy();
        this.balldir = null;
        this.balldone = true;
      } else {
        this.ball.x += this.balldir.x * this.ballspeed;
        this.ball.y += this.balldir.y * this.ballspeed;
      }
    }
    if(this.balldone) {
      this.gui.pop();
      this.gui.push(new ScreenGame(this.game));
    }
  }
  
  render(ctx, windowRect) {
    ctx.save();
    //decorative ball
    ctx.lineWidth = 2;
    if(this.ball != null) this.drawPoint(ctx, this.ball, "#000000", "#ffffff", this.ballradius);
    ctx.restore();
  }

}

class ScreenGame extends Screen {
  constructor(game) {
    super();
    this.game = game;
  }
  
  enter(gui, window, parent) {
    this.gui = gui;
    this.game.begin(window, window.center);
  }
  
  resize(windowRect) {
    this.game.resize(windowRect);
  }
  
  mouseDown(pt) {
    this.game.mouseDown(pt);
  } //mouse btn down at a point

  update(tickPart, windowRect, cursor) {
    this.game.update(tickPart, windowRect, cursor);
  }
  
  render(ctx, windowRect) {
    ctx.save();
    this.game.render(ctx, windowRect);
    ctx.restore();
  }
}