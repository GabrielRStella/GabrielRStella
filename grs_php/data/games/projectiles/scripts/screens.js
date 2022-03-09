
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
  }

  enter(gui, window, parent) {
    gui.push(new ScreenGame()); //currently just a pseudo-screen; any time it comes up, it creates a new game
  }

  //rendering helper functions
  //renderTitle(ctx, text);
  //drawRect(ctx, r, fill, stroke);
  //drawPoint(ctx, p, fill, stroke, radius);
  //drawLine(ctx, a, b, color);
  //drawText(ctx, text, baseline, align, size, p, fill, stroke)
  //drawTextCentered(ctx, text, size, p, fill, stroke);
}

class ScreenGame extends Screen {
  constructor() {
    super();
    this.game = game;
  }
  
  enter(gui, window, parent) {
    this.gui = gui;
    this.game.begin(gui, window, window.center);
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