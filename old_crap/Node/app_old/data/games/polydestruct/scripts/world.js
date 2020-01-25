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