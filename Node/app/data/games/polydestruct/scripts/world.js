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
    del.magnitude = 0.5;
    accel.add(del);
    accel.magnitude = 0.4;
    this.velocity.add(accel);
    this.velocity.multiply(0.99);
    pos.add(this.velocity);

    //check for collision (use distance, prevPosition & position)
    var closestEdge = poly.kClosestEdge(pos);
    var pt = new Point(closestEdge.point.x, closestEdge.point.y);

    var a1 = pt.angleTo(prevPos);
    var a2 = pt.angleTo(pos);
    if(Math.abs(a1 - a2) > Math.PI / 2) {
      //collision (good approximation, seems to work)
      
    }

    //otherwise just return age
    this.age += tickPart;
    return this.age < 2000; //20 ticks per sec
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
}