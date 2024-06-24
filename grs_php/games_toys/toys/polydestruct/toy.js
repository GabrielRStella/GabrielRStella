class Rocket {
  constructor(world, p, r) {
    this.world = world;
    this.position = p;
    this.velocity = GameLib.randomUnitPoint();

    this.size = r || 2;

    this.age = 0;
  }

  update(tickPart) {
    var poly = this.world.poly;

    var pos = this.position; //will get modified
    var prevPos = pos.copy();

    var accel = GameLib.randomUnitPoint();
    var del = poly.center.copy();
    del.sub(pos);
    del.magnitude = 1;
    accel.add(del);
    accel.magnitude = 0.4;
    this.velocity.add(accel);
    this.velocity.multiply(0.999);
    pos.add(this.velocity);

    if(poly.contains(pos)) {

      //check for collision (use distance, prevPosition & position)
      var closestEdge = poly.kClosestEdge(pos);
      var pt = new Point(closestEdge.point.x, closestEdge.point.y);
      this.world.collide(prevPos, this.size, pt, this.velocity.copy(), closestEdge.edge);
      return false;
    }

    //otherwise just return age
    this.age += tickPart;
    return this.age < 200; //20 ticks per sec
  }
}

class World {
  constructor(poly) {
    this.poly = poly;
    this.rockets = [];
  }

  spawnRocket(p, r) {
    this.rockets.push(new Rocket(this, p, r));
  }

  update(tickPart) {
    this.rockets = this.rockets.filter(r => r.update(tickPart));
  }

  render(ctx, width, height) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    var radius = 2;

    var drawPoint = function(p, radius) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.TAU);
      ctx.closePath();
      ctx.fill();
    };

    this.rockets.forEach(r => drawPoint(r.position, r.size));
  }

  collide(pos, size, hit, dir, edge) {
    var area = this.poly.area;

    var deflection = (Math.pow(area, 1/3) / dir.magnitude / size);


    //deflect dir away from center
    var points = this.poly.points;
    var closest = points[0];
    var dist = closest.distance(hit);
    for(var i = 1; i < points.length; i++) {
      var p = points[i];
      var d = p.distance(hit);
      if(d < dist) {
        closest = p;
        dist = d;
      }
    }

    var dir2 = closest.copy();
    dir2.sub(hit);
    dir2.magnitude = deflection;
    dir.magnitude = (1 / deflection);
    dir.add(dir2);
    dir.magnitude = 1000;

    //the segment
    var a = pos;
    var b = pos.copy();
    b.add(dir);

    //decide which poly to keep
    var polys = this.poly.slice(a, b);
    polys.sort(function(a, b) {
      return a.area > b.area;
    });
    var center = this.poly.center;
    var polys2 = polys.filter(x => x.contains(center));
    var poly = polys2[0] || polys[0];

    this.poly.rebuild(poly.points, poly.apiPoints);
  }
}

//polygons should be constructed CCW (x+ = right, y+ = up)

var Polygons = {
  toApiPoints: function(points) {
    var apiPoints = [];
    for(var i = 0; i < points.length; i++) {
      var p = points[i];
      apiPoints.push(p.x);
      apiPoints.push(p.y);
    }
    return apiPoints;
  },
  fromApiPoints: function(apiPoints) {
    var points = [];
    for(var i = 0; i < apiPoints.length; i+=2) {
      points.push(new Point(apiPoints[i], apiPoints[i + 1]));
    }
    return points;
  }
};

class Polygon {
  constructor(points, apiPoints) {
    this.points = points || Polygons.fromApiPoints(apiPoints);
    this.apiPoints = apiPoints || Polygons.toApiPoints(points);
    this.area = PolyK.GetArea(this.apiPoints);
  }

  rebuild(points, apiPoints) {
    this.points = points || Polygons.fromApiPoints(apiPoints);
    this.apiPoints = apiPoints || Polygons.toApiPoints(points);
    this.area = PolyK.GetArea(this.apiPoints);
    this.triangles = null;
    this.centerPoint = null;
  }

  isSimple() {
    return PolyK.IsSimple(this.apiPoints);
  }

  isConvex() {
    return PolyK.IsConvex(this.apiPoints);
  }

  contains(p) {
    return PolyK.ContainsPoint(this.apiPoints, p.x, p.y);
  }

  get bounds() {
    var b = PolyK.GetAABB(this.apiPoints)
    return new Rectangle(b.x, b.y, b.width, b.height);
  }

  triangulate() {
    if(this.triangles) return this.triangles;
    if(this.isSimple()) {
      var indices = PolyK.Triangulate(this.apiPoints);
      var points = this.points;
      var triangles = [];
      for(var i = 0; i < indices.length; i += 3) {
        triangles.push(new Polygon([points[indices[i]], points[indices[i + 1]], points[indices[i + 2]]]));
      }
      this.triangles = triangles;
      return triangles;
    }
    //no return for u
  }

  get center() {
    if(this.centerPoint) return this.centerPoint;
    if(this.points.length == 0) return new Point();

    //triangle or line or point
    if(this.points.length <= 3) {
      var p = new Point();
      for(var i = 0; i < this.points.length; i++) {
        p.add(this.points[i]);
      }
      p.multiply(1/this.points.length);
      this.centerPoint = p;
      return p;
    }

    //n-gon
    var triangles = this.triangulate();
    if(triangles) {
      var p = new Point();
      var weight = 0;
      for(var i = 0; i < triangles.length; i++) {
        var triangle = triangles[i];
        var area = triangle.area;
        var center = triangle.center.copy();
        center.multiply(area);

        p.add(center);
        weight += area;
      }
      p.multiply(1/weight);
      this.centerPoint = p;
      return p;
    }
  }

  forEachVertex(f) {
    for(var i = 0; i < this.points.length; i++) {
      f(this.points[i]);
    }
  }

  forEachEdge(f) {
    var prev = null;
    for(var i = 0; i <= this.points.length; i++) {
      var p = this.points[i % this.points.length];
      if(prev) {
        f(prev, p);
      }
      prev = p;
    }
  }

  kRaycast(point, dir) {
    return PolyK.Raycast(this.apiPoints, point.x, point.y, dir.x, dir.y);
  }

  kClosestEdge(point) {
    return PolyK.ClosestEdge(this.apiPoints, point.x, point.y);
  }

  slice(a, b) {
    var polys = PolyK.Slice(this.apiPoints, a.x, a.y, b.x, b.y);
    return polys.map(x => new Polygon(null, x));
  }
}

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