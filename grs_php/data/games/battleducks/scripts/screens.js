
/*
The game's title screen.
Elements:
-title text
-Play button
*/
class ScreenMain extends Screen {
  constructor() {
    super();
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
  } //mouse moved from prev to pt
  mouseDrag(prev, pt) {} //mouse moved from prev to pt while button down
  mouseDownUp(start, end) {
    
  } //mouse btn down at start and up at end

  //just in case they want to update some logic without having checks in update()
  resize(windowRect) {
  }

  update(tickPart, windowRect, cursor) {
    this.gui.push(new ScreenGame(new Game())); //TMP
  }
  
  render(ctx, windowRect) {
    ctx.save();
    
    //TODO
    
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
    this.game.begin(gui, window, window.center);
  }
  
  resize(windowRect) {
    this.game.resize(windowRect);
  }
  
  mouseDownUp(start, end) {
    
  } //mouse btn down at start and up at end

  update(tickPart, windowRect, cursor) {
    this.game.update(tickPart, windowRect, cursor);
  }
  
  render(ctx, windowRect) {
    ctx.save();
    this.game.render(ctx, windowRect);
    ctx.restore();
  }
}