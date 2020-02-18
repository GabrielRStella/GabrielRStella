
/*
The game's title screen.
Elements:
-title text
-Play button
-High Score info
*/
class ScreenMain extends Screen {
  constructor() {
    //TODO: elements and alignment and...
  }

  //when it first gets added on
  //also supplies window dimensions as a rect
  //parent (Screen): if this Screen was just pushed, then parent is the Screen before it (or null)
  enter(gui, window, parent) {}

  //final (bool): is this gui coming off the stack, or is it just being covered
  exit(gui, final) {}

  //IO registration
  register(keys, mouse) {}
  unregister(keys, mouse) {}

  //default input events (mouse)
  mouseDown(pt) {} //mouse btn down at a point
  mouseUp(pt) {} //mouse btn up at a point
  mouseMove(prev, pt) {} //mouse moved from prev to pt
  mouseDrag(prev, pt) {} //mouse moved from prev to pt while button down
  mouseDownUp(start, end) {} //mouse btn down at start and up at end

  //just in case they want to update some logic without having checks in update()
  resize(windowRect) {}

  update(tickPart, windowRect, cursor) {}
  render(ctx, windowRect) {}

  //rendering helper functions
  //renderTitle(ctx, text);
  //drawRect(ctx, r, fill, stroke);
  //drawPoint(ctx, p, fill, stroke, radius);
  //drawLine(ctx, a, b, color);
}