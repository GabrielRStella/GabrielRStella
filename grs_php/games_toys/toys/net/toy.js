class BoxesGame extends Game {
  constructor() {
    super("boxes");

    this.tick = 0;

    this.generated = false;
    this.window = new Rectangle(0, 0, 0, 0);

    var gui = new dat.GUI();

    this.LineColor = "#ffffff";
    this.PointColor = "#ffffff";
    this.n_min = 5;
    this.n_max = 20;

    gui.add(this, "n_min", 1, 100);
    gui.add(this, "n_max", 1, 100);
    gui.addColor(this, "LineColor");
    gui.addColor(this, "PointColor");
  }

  generate(pos) {
    var r = this.window;
    var pos = pos || r.center;
    var s = 50; //line length
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
    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", this.onClick.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }

  update(tickPart) {
    this.tick += tickPart;
  }

  onClick(evt) {
    var pos = this.mouse.getMousePos(evt);
    this.generate(pos);
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
    if(!this.generated) {
      this.generate();
    }

    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    for(var i = 0; i < this.lines.length; i++) {
      var line = this.lines[i];
      this.drawLine(ctx, line[0], line[1], this.LineColor);
    }
    for(var i = 0; i < this.points.length; i++) {
      this.drawPoint(ctx, this.points[i], this.PointColor, 3);
    }
  }
}

//use default options
var gameManager = new GameManager(new BoxesGame(), {});
gameManager.start();