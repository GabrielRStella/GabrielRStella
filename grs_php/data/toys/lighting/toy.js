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

class LightingGame extends Game {
  constructor() {
    super("lighting");

    this.tick = 0;

    this.window = new Rectangle(0, 0, 0, 0);
    this.prevSpacing = 0;
    this.Spacing = 100;
    this.Radius = 200;
    this.PointSize = 3;
    this.LightSize = 2;
    this.ShowLights = true;

    this.gui = new dat.GUI();

    var f = this.gui.addFolder("Options");
    f.open();

    f.add(this, "Spacing", 10, 500);
    f.add(this, "Radius", 10, 1000);
    f.add(this, "PointSize", 0, 100);
    f.add(this, "LightSize", 0, 100);
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

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    this.window = new Rectangle(0, 0, width, height);

    if(this.Spacing != this.prevSpacing) {
      this.lighting = {};
      this.prevSpacing = this.Spacing;
    }

    if(this.lights.length == 0) {
      this.addLight(1, 0, 0);
      this.addLight(0, 1, 0);
      this.addLight(0, 0, 1);
    }

    //solve lighting
    for(var x = this.Spacing / 2; x < width; x += this.Spacing) {
      this.lighting[x] = {};
      for(var y = this.Spacing / 2; y < height; y += this.Spacing) {
        var lighting = [0, 0, 0, 1];
        //additive lighting
        for(var l = 0; l < this.lights.length; l++) {
          var light = this.lights[l];
          //var mag = this.Radius * this.Radius * this.Radius / light.pos.distanceSquared(new Point(x, y));
          var mag = Math.max(0, this.Radius - light.pos.distance(new Point(x, y)));
          lighting[0] += mag * light.r / this.Radius;
          lighting[1] += mag * light.g / this.Radius;
          lighting[2] += mag * light.b / this.Radius;
        }
        this.lighting[x][y] = lighting;
      }
    }
    //could be way more efficient...but it's js :(


    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    if(this.PointSize > 0) {
      for(var x = this.Spacing / 2; x < width; x += this.Spacing) {
        for(var y = this.Spacing / 2; y < height; y += this.Spacing) {
          var l = this.lighting[x][y];
          this.drawPoint(ctx, new Point(x, y), color(l[0], l[1], l[2], l[3]), this.PointSize);
        }
      }
    }
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
var gameManager = new GameManager(new LightingGame(), {});
gameManager.start();