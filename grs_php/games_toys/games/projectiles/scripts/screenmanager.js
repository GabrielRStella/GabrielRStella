/////////////////////////////////////////////////////////////////////////////////////////////////
//screens
/////////////////////////////////////////////////////////////////////////////////////////////////

class ScreenManager {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.window = new Rectangle(this.width, this.height);

    this.ctx = this.canvas.getContext("2d");
    this.renderer = new RenderHelper(this.ctx, this.width, this.height);
    
    
    //screen management
    this.screens = [];
    this.screen = null;

    //input-related things to make Screen stuff easier
    this.keys = new Keys();
    this.mouse = new MouseListener(this.canvas, 0);
    
    this.input = false;

    this.cursor = new Point();
    this.mouse_down = false;
    this.mouse_down_start = null;
    this.mouse_prev = null;
    
    //running/timing
    this.ticksPerSec = 60;
    this.msPerTick = 1000 / this.ticksPerSec;

    this.update = this.update.bind(this);
    this.running = false;
  }
  
  //screen management

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
  
  //events

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
  
  //lifecycle
  
  start() {
    this.keys.register();
    this.mouse.register();
    this.LISTENER_MOUSE_DOWN = this.mouse.addListener("mousedown", this.onMouseDown.bind(this));
    this.LISTENER_MOUSE_UP = this.mouse.addListener("mouseup", this.onMouseUp.bind(this));
    
    if(this.screen) {
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      } 
      this.screen.register(this.keys, this.mouse);
    }
    this.input = true;

    this.prevTickMs = new Date().getTime();
    this.running = true;

    requestAnimationFrame(this.update);
  }

  update() {
    if(!this.running) return;

    var ms = new Date().getTime();
    var part = (ms - this.prevTickMs) / this.msPerTick;

    //resize
    if(this.prevWindowWidth != window.innerWidth || this.prevWindowHeight != window.innerHeight) {
      this.prevWindowWidth = window.innerWidth;
      this.prevWindowHeight = window.innerHeight;

      //reset canvas
      var canvas = this.canvas;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 1; //is the -1 necessary? I think it is, to make borders render properly
      this.width = canvas.width;
      this.height = canvas.height;

      this.window = new Rectangle(0, 0, this.width, this.height);
      this.resize(this.window);
    }

    //prepare for next screen
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateAndRender(part, ctx, this.window);

    this.prevTickMs = ms;

    requestAnimationFrame(this.update);
  }

  stop() {
    if(this.input && this.screen) {
      this.screen.unregister(this.keys, this.mouse);
    }
    this.input = false;

    this.mouse.removeListener(this.LISTENER_MOUSE_DOWN);
    this.mouse.removeListener(this.LISTENER_MOUSE_UP);
    
    this.keys.unregister();
    this.mouse.unregister();

    this.running = false;
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

  //final (bool): is this screen coming off the stack, or is it just being covered
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
}

class RenderHelper {
  constructor(ctx, w, h) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
  }

  //rendering helper functions

  renderTitle(text) {
    var ctx = this.ctx;
    //
    ctx.font = '64px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.lineWidth = 2;

    ctx.fillText(text, 10, 10);
    ctx.strokeText(text, 10, 10);
  }

  drawRect(r, fill, stroke) {
    var ctx = this.ctx;
    //
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(r.minX, r.minY, r.width, r.height);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

  drawPoint(p, fill, stroke, radius) {
    var ctx = this.ctx;
    //
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

  drawLine(a, b, color) {
    var ctx = this.ctx;
    //
    if(color) ctx.strokeStyle = color;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  
  drawText(text, baseline, align, size, p, fill, stroke) {
    var ctx = this.ctx;
    //
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.font = size + 'px sans-serif';
    ctx.textBaseline = baseline;
    ctx.textAlign = align;
    if(fill) ctx.fillText(text, p.x, p.y);
    if(stroke) ctx.strokeText(text, p.x, p.y);
  }
  
  drawTextCentered(text, size, p, fill, stroke) {
    var ctx = this.ctx;
    //
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.font = size + 'px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    if(fill) ctx.fillText(text, p.x, p.y);
    if(stroke) ctx.strokeText(text, p.x, p.y);
  }
}