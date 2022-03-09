/////////////////////////////////////////////////////////////////////////////////////////////////
//gui / screens
/////////////////////////////////////////////////////////////////////////////////////////////////

class Gui {
  constructor() {
    this.screens = [];
    this.screen = null;

    this.input = false;

    this.window = new Rectangle(0, 0, 0, 0);

    //input-related things to make Screen stuff easier
    this.cursor = new Point();
    this.mouse_down = false;
    this.mouse_down_start = null;
    this.mouse_prev = null;
  }

  push(screen) {
    if(this.screen) {
      this.screen.exit(this, false);
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
    }
    this.screens.push(screen);
    this.screen = screen;
    this.screen.enter(this, this.window, this.screen);
    if(this.input) {
      this.screen.register(this.keys, this.mouse);
    }
  }

  pop() {
    if(this.screen) {
      this.screens.pop();
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
      this.screen.exit(this, true);
    }
    this.screen = this.screens.length > 0 ? this.screens[this.screens.length - 1] : null;
    if(this.screen) {
      this.screen.enter(this);
      if(this.input) {
        this.screen.register(this.keys, this.mouse);
      }
    }
  }

  popTo(gui) {
    while(this.screen && this.screen != gui) {
      this.pop();
    }
  }

  popOff(gui) {
    this.popTo(gui);
    this.pop();
  }

  register(keys, mouse) {
    if(this.screen) {
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      } 
      this.screen.register(keys, mouse);
    }
    this.input = true;
    this.keys = keys;
    this.mouse = mouse;

    this.LISTENER_MOUSE_DOWN = mouse.addListener("mousedown", this.onMouseDown.bind(this));
    this.LISTENER_MOUSE_UP = mouse.addListener("mouseup", this.onMouseUp.bind(this));
  }

  unregister(keys, mouse) {
    if(this.input && this.screen) {
      this.screen.unregister(this.keys, this.mouse);
    }
    this.input = false;

    mouse.removeListener(this.LISTENER_MOUSE_DOWN);
    mouse.removeListener(this.LISTENER_MOUSE_UP);
  }

  onMouseDown(evt) {
    var pos = this.mouse.getMousePos(evt);
    this.mouse_down = true;
    this.mouse_down_start = pos;
    if(this.screen) {
      this.screen.mouseDown(pos);
    }
  }

  onMouseUp(evt) {
    var pos = this.mouse.getMousePos(evt);
    if(this.screen) {
      this.screen.mouseUp(pos);
      if(this.mouse_down) {
        var prev = this.mouse_down_start;
        this.screen.mouseDownUp(prev, pos);
      }
    }
    this.mouse_down = false;
    this.mouse_down_start = null;
  }

  onMouseMove(pos) {
    if(this.mouse_prev != null && this.screen) {
      this.screen.mouseMove(this.mouse_prev, pos);
      if(this.mouse_down) {
        this.screen.mouseDrag(this.mouse_prev, pos);
      }
    }
    this.mouse_prev = pos;
  }

  resize(windowRect) {
    for(var i = 0; i < this.screens.length; i++) {
      this.screens[i].resize(windowRect);
    }
    this.window = windowRect;
  }

  updateAndRender(tickPart, ctx, windowRect) {
    if(this.input) {
      this.cursor = this.mouse.mouse;
      this.onMouseMove(this.cursor);
    }

    if(this.screen) {
      //separate the two so that screens can call parent.render()
      this.screen.update(tickPart, windowRect, this.cursor);
      this.screen.render(ctx, windowRect);
    }
  }
}

class Screen {
  constructor() {
    
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

  renderTitle(ctx, text) {
    ctx.font = '64px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.lineWidth = 2;

    ctx.fillText(text, 10, 10);
    ctx.strokeText(text, 10, 10);
  }

  drawRect(ctx, r, fill, stroke) {
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(r.minX, r.minY, r.width, r.height);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

  drawPoint(ctx, p, fill, stroke, radius) {
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

  drawLine(ctx, a, b, color) {
    if(color) ctx.strokeStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  
  drawText(ctx, text, baseline, align, size, p, fill, stroke) {
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.font = size + 'px sans-serif';
    ctx.textBaseline = baseline;
    ctx.textAlign = align;
    if(fill) ctx.fillText(text, p.x, p.y);
    if(stroke) ctx.strokeText(text, p.x, p.y);
  }
  
  drawTextCentered(ctx, text, size, p, fill, stroke) {
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.font = size + 'px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    if(fill) ctx.fillText(text, p.x, p.y);
    if(stroke) ctx.strokeText(text, p.x, p.y);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//rectangle positioning (for gui layout)
/////////////////////////////////////////////////////////////////////////////////////////////////

//ordering, arranging, and scaling boxes relative to eachother
var RectanglePosition = {
  align: function(outer, inner, funcs, padding) {
    padding = padding || 0;
    for(var i = 0; i < funcs.length; i++) {
      funcs[i](outer, inner, padding);
    }
  },
  aspect_fit: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  },
  aspect_fill: function(outer, inner) {
    var maxScale = Math.max(outer.width / inner.width, outer.height / inner.height);
    inner.width *= maxScale;
    inner.height *= maxScale;
  },
  center: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  centerX: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
  },
  centerY: function(outer, inner) {
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  //scaled
  insideY: function(outer, inner, padding) {
    inner.minY = outer.height * padding - inner.height / 2;
  },
  //inside window
  left: function(outer, inner, padding) {
    inner.minX = outer.minX + padding;
  },
  right: function(outer, inner, padding) {
    inner.maxX = outer.maxX - padding;
  },
  top: function(outer, inner, padding) {
    inner.maxY = outer.maxY - padding;
  },
  bottom: function(outer, inner, padding) {
    inner.minY = outer.minY + padding;
  },
  //outside
  above: function(outer, inner, padding) {
    inner.maxY = outer.minY - padding;
  },
  below: function(outer, inner, padding) {
    inner.minY = outer.maxY + padding;
  },
  //moving
  up: function(outer, inner, padding) {
    inner.minY -= padding
  },
  down: function(outer, inner, padding) {
    inner.minY += padding
  }
};

//helper classes

class Alignment {
  constructor(ref, box, funcs, padding) {
    this.ref = ref;
    this.box = box;
    this.funcs = funcs || [];
    this.padding = padding || 0;
  }

  align() {
    RectanglePosition.align(this.ref, this.box, this.funcs, this.padding);
  }
}

class Aligner {
  constructor() {
    this.aligns = [];
  }

  add(ref, box, funcs, padding) {
    this.aligns.push(new Alignment(ref, box, funcs, padding));
  }

  align() {
    for(var i = 0; i < this.aligns.length; i++) {
      this.aligns[i].align();
    }
  }
};