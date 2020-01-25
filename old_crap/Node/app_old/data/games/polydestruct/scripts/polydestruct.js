class GuiScreenPolygonDestroyer extends Gui {
  constructor(poly) {
    super();
    this.poly = poly;
    this.world = new World(poly);
  }

  //when it first gets added on
  enter(guiManager) {
    this.guiManager = guiManager;
  }

  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {
    this.keys = keys;
    this.mouse = mouse;

    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", function(evt) {
      this.world.spawnRocket(mouse.getMousePos(evt));
    }.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }

  update(tickPart) {
    this.world.update(tickPart);
  }

  render(ctx, width, height) {
    ctx.save();

/////////////////////////////////////////////////////////////////////////////////////////////////
//the actual shape

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    var radius = 2;

    var drawPoint = function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.TAU);
      ctx.closePath();
      ctx.fill();
    };
    var drawLine = function(a, b) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    this.poly.forEachVertex(drawPoint);
    this.poly.forEachEdge(drawLine);

/////////////////////////////////////////////////////////////////////////////////////////////////
//debug stuff

    var mouse = this.mouse.mouse;
    var center = this.poly.center;
    var delta = center.copy();
    delta.sub(mouse);

/////////////////////////////////////////////////////////////////////////////////////////////////
//debug: raytrace

    ctx.fillStyle = ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    radius = 2;
    var rayCast = this.poly.kRaycast(mouse, delta);

    var delta2 = delta.copy();
    delta2.magnitude = rayCast.dist;
    var rayHit = mouse.copy();
    rayHit.add(delta2);
    var rayRefl = rayCast.refl;
    rayRefl = new Point(rayRefl.x, rayRefl.y);
    rayRefl.magnitude = 30;
    var rayEnd = rayHit.copy();
    rayEnd.add(rayRefl);

    drawLine(mouse, center);
    drawLine(mouse, rayHit);
    drawLine(rayHit, rayEnd);

/////////////////////////////////////////////////////////////////////////////////////////////////
//debug: closest point

    ctx.fillStyle = ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 3;
    radius = 3;

    var closestEdge = this.poly.kClosestEdge(mouse);
    drawPoint(closestEdge.point);
    drawLine(mouse, closestEdge.point);
    
    var edge = closestEdge.edge;
    var p1 = this.poly.points[edge];
    var p2 = this.poly.points[(edge + 1) % this.poly.points.length];
    drawLine(p1, p2);

/////////////////////////////////////////////////////////////////////////////////////////////////
//debug: two points

    ctx.fillStyle = ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    radius = 2;

    drawPoint(mouse);
    drawPoint(center);

/////////////////////////////////////////////////////////////////////////////////////////////////
//rockets
    this.world.render(ctx, width, height);

/////////////////////////////////////////////////////////////////////////////////////////////////

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    this.renderTitle(ctx, "Destroy the Polygon");

    ctx.restore();
  }
}

class GuiScreenInitial extends Gui {
  constructor() {
    super();
    this.points = [];
    this.tolerance = 20;
  }

  //when it first gets added on
  enter(guiManager) {
    this.guiManager = guiManager;
  }

  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {
    this.keys = keys;
    this.mouse = mouse;

    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", function(evt) {
      var p = mouse.getMousePos(evt);
      for(var i = 0; i < this.points.length; i++) {
        if(this.points[i].distance(p) < this.tolerance) {
          //dont need to add the final point, polygons are closed
          this.guiManager.push(new GuiScreenPolygonDestroyer(new Polygon(this.points)));
          return;
        }
      }
      this.points.push(p);
    }.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }

  update(tickPart) {
    
  }

  render(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    var radius = 3;

    var mouse = this.mouse.mouse;

    var prev = null;
    for(var i = 0; i <= this.points.length; i++) {
      var p = null;
      if(i == this.points.length) p = mouse;
      else p = this.points[i];

      ctx.beginPath();
      if(i == 0 && p != this.mouse.mouse && p.distance(this.mouse.mouse) < this.tolerance) {
        ctx.fillStyle = "#ff0000";
        mouse = p;
      } else {
        ctx.fillStyle = "#ffffff";
      }
      ctx.arc(p.x, p.y, radius, 0, Math.TAU);
      ctx.closePath();
      ctx.fill();

      if(prev) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      prev = p;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, this.tolerance, 0, Math.TAU);
    ctx.closePath();
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    this.renderTitle(ctx, "Create a Polygon");

    ctx.restore();
  }
}

class PolyDestructGame extends Game {
  constructor() {
    super("polydestruct");

    this.tick = 0;
    this.guiManager = new GuiManager(this);
    this.guiManager.push(new GuiScreenInitial());
  }

  register(keys, mouse) {
    this.guiManager.register(keys, mouse);
  }

  unregister(keys, mouse) {
    this.guiManager.unregister(keys, mouse);
  }

  update(tickPart) {
    this.tick += tickPart;
    this.guiManager.update(tickPart);
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    this.guiManager.render(ctx, width, height);
  }
}

//use default options
var gameManager = new GameManager(new PolyDestructGame(), {
  canvasInset: 5 //prevents chrome from making scrollbars
});
gameManager.start();