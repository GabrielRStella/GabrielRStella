//translating point robot, translating circle robot, 2-dof arm with fixed base, arm that rotates on a prismatic joint
//tpoint, tcircle, arm, slider
//canvas ids: canvas-robot-x and canvas-cspace-x
//TODO: expanding point/circle robot on a slider, ...
//TODO: allow robot-specific behavior when clicking on the left panel (e.g. move end-affector to cursor)

////////////////////////////////////////////////////////////////////////////////
//geometry (point and rect copied from toys)
////////////////////////////////////////////////////////////////////////////////

Math.TAU = Math.TAU || (Math.PI * 2);

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get magnitudeSquared() {
    var m = this.x * this.x + this.y * this.y;
    return m;
  }

  get magnitude() {
    var m = this.x * this.x + this.y * this.y;
    return Math.sqrt(m);
  }

  set magnitude(len) {
    var m = this.magnitude;
    if(m == 0) return;
    len /= m;
    this.x *= len;
    this.y *= len;
  }

  get zero() {
    return (this.x == 0) && (this.y == 0);
  }

  distanceSquared(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return m;
  }

  distance(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return Math.sqrt(m);
  }

  multiply(d) {
    this.x *= d;
    this.y *= d;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(r) {
    var m = this.magnitude;
    this.x = Math.cos(r) * m;
    this.y = Math.sin(r) * m;
  }

  slope() {
    return this.y / this.x;
  }

  slopeFrom(p) {
    return (this.y - p.y) / (this.x - p.x);
  }

  rotate(dr) {
    var cos = Math.cos(dr);
    var sin = Math.sin(dr);
    var xP = cos * this.x - sin * this.y;
    var yP = sin * this.x + cos * this.y;
    this.x = xP;
    this.y = yP;
  }

  rotateAround(p, dr) {
    this.sub(p);
    this.rotate(dr);
    this.add(p);
  }
  
  dot(other) {
	return this.x*other.x + this.y*other.y;
  }
  
  //vector projection
  project(other) {
	  var N = this.copy();
	  N.magnitude = 1;
	  N.multiply(N.dot(other));
	  return N;
  }
  
  //vector rejection
  reject(other) {
	  var projection = this.project(other);
	  projection.sub(other);
	  projection.multiply(-1);
	  return projection;
  }

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }
  
  angleBetween(other) {
	  //this has numerical stability issues...
	// var dot = (this.x * other.x + this.y * other.y);
	// var mags = this.magnitude * other.magnitude;
	// console.log(this, other, dot / mags);
	// if(mags == 0) return 0;
	// return Math.acos(dot / mags);
	//https://stackoverflow.com/a/55510185
	var dot = this.x*other.x + this.y*other.y;
    var cross = this.x*other.y - this.y*other.x;
    return Math.atan2(cross, dot);
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  apply(f) {
    this.x = f(this.x);
    this.y = f(this.y);
  }

  copy() {
    return new Point(this.x, this.y);
  }

}

class Rectangle {
  constructor(x, y, w, h) {
    this.point = new Point(x, y);
    this.width = w;
    this.height = h;
  }

  get center() {
    return new Point(this.point.x + (this.width / 2), this.point.y + (this.height / 2));
  }

  get minX() {
    return this.point.x;
  }

  get minY() {
    return this.point.y;
  }

  get maxX() {
    return this.point.x + this.width;
  }

  get maxY() {
    return this.point.y + this.height;
  }

  set center(p) {
    this.point = p.copy();
    this.point.x -= this.width / 2;
    this.point.y -= this.height / 2;
  }

  set minX(x) {
    this.point.x = x;
  }

  set minY(y) {
    this.point.y = y;
  }

  set maxX(x) {
    this.point.x = x - this.width;
  }

  set maxY(y) {
    this.point.y = y - this.height;
  }

  contains(p) {
    return (p.x >= this.minX) && (p.x <= this.maxX) && (p.y >= this.minY) && (p.y <= this.maxY);
  }

  distance(p) {
    var dx = Math.min(this.minX - p.x, 0, p.x - this.maxX);
    var dy = Math.min(this.minY - p.y, 0, p.y - this.maxY);
    return Math.sqrt(dx * dx + dy * dy);
  }

  //https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
  //do the two rectangles intersect?
  intersects(r) {
    var c = this.center;
    var rc = r.center;
    var x = c.x;
    var y = c.y;
    var rx = rc.x;
    var ry = rc.y;
    return (Math.abs(x - rx) * 2 < (this.width + r.width))
      && (Math.abs(y - ry) * 2 < (this.height + r.height));
  }

  pushPoint(p) {
    if(p.x < this.point.x) {
      p.x = this.point.x;
    }
    if(p.x > this.point.x + this.width) {
      p.x = this.point.x + this.width;
    }
    if(p.y < this.point.y) {
      p.y = this.point.y;
    }
    if(p.y > this.point.y + this.height) {
      p.y = this.point.y + this.height;
    }
  }

  //push rectangle r out of this rectangle's bounds
  push(r) {
    var center = r.center;
    var w2 = r.width / 2;
    var h2 = r.height / 2;
    //first: check if it's inside and push it out
    if (this.intersects(r)) {
      //TODO: this jumps slightly when it touches a corner.
      //maybe I can make it smoother?
      var cx = this.point.x + this.width / 2;
      var cy = this.point.y + this.height / 2;
      var dist_inset_x = Math.min(center.x - this.point.x, (this.point.x + this.width) - center.x);
      var dist_inset_y = Math.min(center.y - this.point.y, (this.point.y + this.height) - center.y);
      if (dist_inset_x <= dist_inset_y) {
        //inset horizontally (or on corner)
        if (center.x < cx) {
          //left
          center.x = this.point.x - w2;
        }
        else {
          //right
          center.x = this.point.x + this.width + w2;
        }
      }
      if (dist_inset_y <= dist_inset_x) {
        //inset vertically (or on corner)
        if (center.y < cy) {
          //"bottom"
          center.y = this.point.y - h2;
        }
        else {
          //"top"
          center.y = this.point.y + this.height + h2;
        }
      }
    }
    //else: it's outside, grab it
    else {
      if (center.x < this.point.x - w2) {
        //left (outside)
        center.x = this.point.x - w2;
      }
      else if (center.x > this.point.x + this.width + w2) {
        //right (outside)
        center.x = this.point.x + this.width + w2;
      }
      if (center.y < this.point.y - h2) {
        //"bottom" (outside)
        center.y = this.point.y - h2;
      }
      else if (center.y > this.point.y + this.height + h2) {
        //"top" (outside)
        center.y = this.point.y + this.height + h2;
      }
    }
    r.center = center;
  }

  copy() {
    return new Rectangle(this.point.x, this.point.y, this.width, this.height);
  }
}

////////////////////////////////////////////////////////////////////////////////
//rendering
////////////////////////////////////////////////////////////////////////////////

//helpers, copied from The Flea
RenderHelper = {};
//
RenderHelper.drawRect = function(ctx, r, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.rect(r.minX, r.minY, r.width, r.height);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
RenderHelper.drawPoint = function(ctx, p, fill, stroke, radius) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.TAU);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
RenderHelper.drawLine = function(ctx, a, b, color) {
  if(color) ctx.strokeStyle = color;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

////////////////////////////////////////////////////////////////////////////////
//robots
////////////////////////////////////////////////////////////////////////////////

//a robot with 2 degrees of freedom
class Robot {
    constructor() {
    }
}

//translating point robot
class RTPoint {

    //return the number of obstacles that are in collision at configuration (t0, t1)
    testCollisions(obstacles, t0, t1) {
        var p = new Point(t0, t1);

        var collisions = 0;
        for(var i = 0; i < obstacles.length; i++) {
            if(obstacles[i].contains(p)) collisions++;
        }
        return collisions;
    }

    //ctx is pre-transformed to the [0, 1]^2 c-space coordinate system
    render(ctx, t0, t1) {
        // console.log("hi", t0, t1);
        //TODO
        RenderHelper.drawPoint(ctx, new Point(t0, t1), "#ffffff", null, 0.01);
    }
}

////////////////////////////////////////////////////////////////////////////////
//running
////////////////////////////////////////////////////////////////////////////////

//https://stackoverflow.com/a/74622706
function decToHex(dec) {
  const part = Math.floor(dec * 255).toString(16)
  return `#${part}${part}${part}`
}

//a set of rectangular obstacles + a robot
class World {
    constructor(obstacles, robot, id) {
        this.obstacles = obstacles;
        this.robot = robot;
        this.id = id;
        //the two dof parameters; all parameters have range [0, 1] or [0, 1)
        this.t0 = Math.random();
        this.t1 = Math.random();
        //canvas element ids: canvas-robot-x and canvas-cspace-x
        this.canvas_robot = null;
        this.canvas_cspace = null;
        //visualization stuff
        // this.resolution = 10; //number of samples per side of the c-space canvas
        // this.data_collisions = new Array(this.resolution * this.resolution);
        // this.data_draw = new Image(this.resolution, this.resolution);
        // //
        // for(var x = 0; x < this.resolution; x++) {
        //     for(var y = 0; y < this.resolution; y++) {
        //         var p0 = x / (this.resolution - 1);
        //         var p1 = y / (this.resolution - 1);
        //         var c = this.robot.testCollisions(this.obstacles, p0, p1);
        //         this.data_collisions[x * this.resolution + y] = c;
        //         // this.data_draw.
        //     }
        // }
    }

    process() {
        //update c-space render, if necessary
        if(this.canvas_robot == null) {
            this.canvas_robot = document.getElementById("canvas-robot-" + this.id);
        }
        if(this.canvas_cspace == null) {
            this.canvas_cspace = document.getElementById("canvas-cspace-" + this.id);
            this.canvas_cspace.onmousemove = this.onMouseMove.bind(this);
            this.canvas_cspace.onmousedown = this.onMouseDown.bind(this);
            this.canvas_cspace.onmouseup = this.onMouseUp.bind(this);
        }
        if(this.canvas_robot != null && this.canvas_cspace != null) {
            //TODO: sample some points and fill in the c-space
        }
    }

    render() {
        //render robot
        if(this.canvas_robot != null) {
            this.canvas_robot.width = this.canvas_robot.clientWidth;
            this.canvas_robot.height = this.canvas_robot.clientWidth;

            //TODO
            var ctx = this.canvas_robot.getContext("2d");

            ctx.clearRect(0, 0, this.canvas_robot.width, this.canvas_robot.height);

            ctx.save();

            ctx.scale(this.canvas_robot.width, this.canvas_robot.height)

            for(var i = 0; i < this.obstacles.length; i++) {
                RenderHelper.drawRect(ctx, this.obstacles[i], "#000000");
            }

            this.robot.render(ctx, this.t0, this.t1);

            ctx.restore();
        }
        //render c-space
        if(this.canvas_cspace != null) {
            this.canvas_cspace.width = this.canvas_cspace.clientWidth;
            this.canvas_cspace.height = this.canvas_cspace.clientWidth;

            //TODO
            var ctx = this.canvas_cspace.getContext("2d");

            ctx.clearRect(0, 0, this.canvas_robot.width, this.canvas_robot.height);

            ctx.save();

            ctx.scale(this.canvas_robot.width, this.canvas_robot.height)

            
            var resolution = 10; //number of samples per side of the c-space canvas
            //
            for(var x = 0; x < resolution; x++) {
                for(var y = 0; y < resolution; y++) {
                    var p0 = x / (resolution);
                    var p1 = y / (resolution);
                    var c = 1 - this.robot.testCollisions(this.obstacles, p0, p1) / (this.obstacles.length - 1);
                    ctx.fillStyle = decToHex(c);
                    ctx.beginPath();
                    ctx.rect(p0, p1, 1/resolution, 1/resolution);
                    ctx.closePath();
                    ctx.fill();
                }
            }


            // ctx.drawImage(this.data_draw, 0, 0, 1, 1);
            
            RenderHelper.drawPoint(ctx, new Point(this.t0, this.t1), "#0000ff", null, 0.01);

            ctx.restore();
        }
    }

    onMouseMove(e) {
        // https://stackoverflow.com/a/10109204
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        if(mouseDown) {
            this.onMouse(x, y);
        }
        
    }

    onMouseDown(e) {
        mouseDown = 1;
        //
        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        if(mouseDown) {
            this.onMouse(x, y);
        }
    }

    onMouseUp(e) {
        mouseDown = 0;
        //
        // const x = e.pageX - e.currentTarget.offsetLeft;
        // const y = e.pageY - e.currentTarget.offsetTop;

        // console.log(this.id, x, y, mouseDown);

        // if(mouseDown) {
        //     this.onMouse(x, y);
        // }
    }

    //use this to set the robot's configuration
    onMouse(x, y) {
        // console.log(x, y, this.canvas_cspace.clientWidth, this.canvas_cspace.clientHeight)
        x = x / this.canvas_cspace.clientWidth;
        y = y / this.canvas_cspace.clientHeight;
        // console.log(x, y);
        this.t0 = x;
        this.t1 = y;
    }
}

class Runner {

    constructor(worlds) {
        this.worlds = worlds;
        this.run = this.run.bind(this);
    }

    run(t) {
        for(var i = 0; i < this.worlds.length; i++) {
            this.worlds[i].process(); //TODO: maybe multiple processing passes (up to some time limit, eg, 1ms, to fill in the c-space viz)
            this.worlds[i].render();
        }
        // console.log(t);
        // console.log(this.worlds);
        requestAnimationFrame(this.run);
    }
}


////////////////////////////////////////////////////////////////////////////////
//setup
////////////////////////////////////////////////////////////////////////////////

//https://stackoverflow.com/a/322650
var mouseDown = 0;
document.body.onmousedown = function() { 
    mouseDown = 1;
}
document.body.onmouseup = function() {
    mouseDown = 0;
}


var o = [new Rectangle(0.1, 0.1, 0.2, 0.1), new Rectangle(0.8, 0.3, 0.1, 0.2), new Rectangle(0.2, 0.6, 0.3, 0.3)];
var r = new RTPoint();
var w = new World(o, r, "tpoint");

var worlds = [w];

var runner = new Runner(worlds);

runner.run(0);