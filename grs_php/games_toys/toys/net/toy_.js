class BoxesGame extends Game {
  constructor() {
    super("boxes");

    this.tick = 0;

    this.generated = false;
    this.window = new Rectangle(0, 0, 0, 0);
  }

  generate(pos) {
    var r = this.window;
    var pos = pos || r.center;
    var n = GameLib.randomRangeFloor(3, 10); //number of nodes
    this.points = [];
    this.lines = [];
    //get initial points
    for(var i = 0; i < n; i++) {
      var p = new Point(GameLib.randomRange(0, r.width), GameLib.randomRange(0, r.height));
      this.points.push(p);
    }
    var curr = [];
    var next = [pos];
    for(var i = 0; i < n; i++) {
      next.push(this.points[i]);
    }
    //process: link current points towards center
    while(next.length > 1) {
      curr = next;
      next = [pos];
      var pairs = [];
      var dones = [false];
      for(var i = 0; i < curr.length; i++) {
        dones.push(false);
        for(var j = i + 1; j < curr.length; j++) {
          var p1 = curr[i];
          var p2 = curr[j];
          pairs.push([i, j, p1.distance(p2)]);
        }
      }
      pairs.sort(function(pair1, pair2){
        return pair1[2] < pair2[2];
      });
      for(var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var i1 = pair[0];
        var i2 = pair[1];
        if(!dones[i1] && !dones[i2]) {
          //form some connection
          dones[i1] = dones[i2] = true;
          var p1 = curr[i1];
          var p2 = curr[i2];
          var p = p1.copy();
          var pp = p2.copy();
          if(pp.distance(pos) < p.distance(pos)) {
            p = pp;
          }
          pp = new Point(p1.x, p2.y);
          if(pp.distance(pos) < p.distance(pos)) {
            p = pp;
          }
          pp = new Point(p1.y, p2.x);
          if(pp.distance(pos) < p.distance(pos)) {
            p = pp;
          }
          if(i1 > 0) next.push(p);
          this.lines.push([p1, p], [p2, p]);
        }
      }
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
      this.drawLine(ctx, line[0], line[1], "#ff0000");
    }
    for(var i = 0; i < this.points.length; i++) {
      this.drawPoint(ctx, this.points[i], "#0000ff");
    }
  }
}

//use default options
var gameManager = new GameManager(new BoxesGame(), {});
gameManager.start();