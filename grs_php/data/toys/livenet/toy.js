function randPoint(r) {
  return new Point(GameLib.randomRange(0, r.width), GameLib.randomRange(0, r.height));
}

function color(r, g, b, a) {
  return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + a + ")";
}

class Light {
  constructor(pos, r, g, b) {
    this.pos = pos;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class LightNetGame extends Game {
  constructor() {
    super("lightnet");

    this.tick = 0;

    this.generated = false;
    this.window = new Rectangle(0, 0, 0, 0);
    this.prevSpacing = 0;
    this.n_min = 5;
    this.n_max = 20;
    this.Length = 20;
    this.LightSize = 2;
    this.Radius = 200;
    this.ShowLights = true;

    var gui = this.gui = new dat.GUI();

    var f = this.gui.addFolder("Options");
    f.open();

    gui.add(this, "n_min", 1, 500);
    gui.add(this, "n_max", 1, 500);
    f.add(this, "Length", 1, 200);
    f.add(this, "LightSize", 0, 100);
    f.add(this, "Radius", 0, 1000);
    f.add(this, "ShowLights");
    f.add(this, "AddWhiteLight");

    this.lights = [];

    this.selected = -1;
    this.selection_radius = 20;
    this.selected_src = null;
  }

  AddWhiteLight() {
    this.addLight(1, 1, 1);
  }

  addLight(r, g, b) {
    var l = new Light(randPoint(this.window), r, g, b);
    this.lights.push(l);
    var f = this.gui.addFolder("Light " + this.lights.length);
    f.open();
    f.add(l, "r", 0, 1);
    f.add(l, "g", 0, 1);
    f.add(l, "b", 0, 1);
  }

  generate(pos) {
    var r = this.window;
    var pos = pos || r.center;
    var s = this.Length; //line length
    var n = GameLib.randomRangeFloor(this.n_min, this.n_max); //approximate # of endpoints to make
    this.points = [];
    this.lines = [];
    //where points and intersections are
    var present = [pos];
    //how many endpoints there are
    var count = 0;
    //from initial point, start expanding out
    var tips = [pos];
    var tips_index = 0;
    var any_finished = true;
    while(count < n && any_finished) {
      any_finished = false;
      var src = tips[tips_index];
      tips_index++;
      //try to generate branches
      var added = false;
      while(true) {
        var dx = Math.random() > 0.5 ? 1 : -1;
        var dy = Math.random() < 0.5 ? 1 : -1;
        if(Math.random() < 0.5) dx = 0;
        else dy = 0;
        //
        var point = new Point(src.x + dx * s, src.y + dy * s);
        var contains = r.contains(point);
        if(contains) any_finished = true;
        if(!present[[point.x, point.y]] && contains) {
          present[[point.x, point.y]] = true;
          //add a line
          this.lines.push([src, point]);
          //put new tip in
          tips.push(point);
          //this one is no longer an endpoint
          if(!added) {
            count--;
            added = true;
          }
          //but the new one is
          count++;
        } else {
          break;
        }
      }
      //put it back in for next time
      if(!added) {
        tips.push(src);
      }
    }
    for(var i = tips_index; i < tips.length; i++) {
      this.points.push(tips[i]);
    }

    this.generated = true;
  }

  register(keys, mouse) {
    this.mouse = mouse;
    this.LISTENER_MOUSE_DOWN = mouse.addListener("mousedown", this.onDown.bind(this));
    this.LISTENER_MOUSE_UP = mouse.addListener("mouseup", this.onUp.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_DOWN);
    mouse.removeListener(this.LISTENER_MOUSE_UP);
  }

  onDown(evt) {
    var pos = this.mouse.getMousePos(evt);
    for(var l = 0; l < this.lights.length; l++) {
      if(this.lights[l].pos.distance(pos) <= this.selection_radius + this.LightSize) {
        this.selected = l;
        this.selected_src = pos;
        break;
      }
    }
  }

  onUp(evt) {
    if(this.selected < 0) {
      var pos = this.mouse.getMousePos(evt);
      this.generate(pos);
    }
    var pos = this.mouse.getMousePos(evt);
    this.onDrag(pos);
    this.selected = -1;
  }

  onDrag(pos) {
    if(this.selected < 0) return;
    var delta = pos.copy();
    delta.sub(this.selected_src);
    this.selected_src = pos;
    this.lights[this.selected].pos.add(delta);
  }

  update(tickPart) {
    this.tick += tickPart;
  }

  drawRect(ctx, r, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.rect(r.minX, r.minY, r.width, r.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawPoint(ctx, p, color, radius) {
    if(color) ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.closePath();
    ctx.fill();
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

  getLightAt(p) {
    var r = 0;
    var g = 0;
    var b = 0;
    for(var l = 0; l < this.lights.length; l++) {
      var light = this.lights[l];
      var mag = Math.max(0, this.Radius - light.pos.distance(p));
      r += mag * light.r / this.Radius;
      g += mag * light.g / this.Radius;
      b += mag * light.b / this.Radius;
    }
    return new Light(p, r, g, b);
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    this.window = new Rectangle(0, 0, width, height);
    if(!this.generated) {
      this.generate();
      this.addLight(1, 0, 0);
      this.addLight(0, 1, 0);
      this.addLight(0, 0, 1);
    }

    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    //network
    for(var i = 0; i < this.lines.length; i++) {
      var line = this.lines[i];
      //additive lighting
      var light = this.getLightAt(line[0]); //just use beginning
      //draw it
      this.drawLine(ctx, line[0], line[1], color(light.r, light.g, light.b, 1));
    }
    for(var i = 0; i < this.points.length; i++) {
      //additive lighting
      var light = this.getLightAt(this.points[i]); //just use beginning
      //draw it
      this.drawPoint(ctx, this.points[i], color(light.r, light.g, light.b, 1), 3);
    }

    //lights
    if(this.ShowLights && this.LightSize > 0) {
      for(var i = 0; i < this.lights.length; i++) {
        var light = this.lights[i];
        this.drawPoint(ctx, light.pos, color(light.r, light.g, light.b, 1), this.LightSize);
      }
    }
    var mouse = this.mouse.mouse;
    this.onDrag(mouse);
    for(var i = 0; i < this.lights.length; i++) {
      var light = this.lights[i];
      if(light.pos.distance(mouse) <= this.selection_radius + this.LightSize) {
        this.drawPoint(ctx, light.pos, color(light.r, light.g, light.b, 0.5), this.selection_radius + this.LightSize);
        break;
      }
    }
  }
}

//use default options
var gameManager = new GameManager(new LightNetGame(), {});
gameManager.start();