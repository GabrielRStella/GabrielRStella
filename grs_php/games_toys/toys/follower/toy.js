function randPoint(r) {
  return new Point(GameLib.randomRange(0, r.width), GameLib.randomRange(0, r.height));
}

function color(r, g, b, a) {
  return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + a + ")";
}

function intersection(p1, s1, p2, s2) {
  var x = ((p2.y - p1.y) - (s2 * p2.x - s1 * p1.x)) / (s1 - s2);
  var y = s1 * (x - p1.x) + p1.y;
  return new Point(x, y);
}

var options = {
  "GoalRadius": 10,
  "FSize": 25,
  "FSpeed": 5,
  "FPointOffset": 1/4,
  "FWidth": 1/3,
  "Primary": "#ffffff",
  "Secondary": "#000000"
};

options["Reset"] = function() {
  options["GoalRadius"] = 10;
  options["FSize"] = 25;
  options["FSpeed"] = 5;
  options["FPointOffset"] = 1/4;
  options["FWidth"] = 1/3;
  options["Primary"] = "#ffffff";
  options["Secondary"] = "#000000";
};

//let the user control all aspects above

var DAT_GUI = new dat.GUI();

DAT_GUI.add(options, "GoalRadius", 1, 50);
DAT_GUI.add(options, "FSize", 0, 100);
DAT_GUI.add(options, "FSpeed", 0, 50);
DAT_GUI.add(options, "FPointOffset", -1, 1);
DAT_GUI.add(options, "FWidth", 0, 1);
DAT_GUI.addColor(options, "Primary");
DAT_GUI.addColor(options, "Secondary");
DAT_GUI.add(options, "Reset");

class FollowerGame extends Game {
  constructor() {
    super("follower");

    this.tick = 0;
    this.window = null;
    this.pos = new Point(0, 0);
    this.angle = 0;

    this.cursor = null;
    this.path_center = null;
    this.path_index = 0;
    this.path_dir = 0;
  }

  register(keys, mouse) {
    this.mouse = mouse;
  }

  drawPath(ctx) {
    if(this.path != null) {
      this.drawPoint(ctx, this.path_center, options["Secondary"], options["Primary"]);
      for(var i = this.path_index; i < this.path.length - 1; i++) {
        this.drawLine(ctx, this.path[i], this.path[i + 1], options["Primary"]);
      }
    }
  }

  drawCursor(ctx) {
    ctx.fillStyle = options["Primary"];

    var sz = options["FSize"];
    var forward = options["FPointOffset"];
    var side = options["FWidth"];
    var delta = new Point(sz, 0); //front corner
    var delta2 = new Point(sz * forward, sz * side); //back left corner
    var delta3 = new Point(sz * forward, -sz * side); //back right corner
    delta.rotate(this.angle);
    delta2.rotate(this.angle);
    delta3.rotate(this.angle);
    delta.add(this.pos);
    delta2.add(this.pos);
    delta3.add(this.pos);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(delta2.x, delta2.y);
    ctx.lineTo(delta.x, delta.y);
    ctx.lineTo(delta3.x, delta3.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGoal(ctx) {
    if(this.goal) {
      this.drawPoint(ctx, this.goal, options["Secondary"], options["Primary"], options["GoalRadius"]);
    }
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    var window = new Rectangle(0, 0, width, height);
    if(!this.window) {
      this.window = window;
      this.pos = randPoint(window);
      this.angle = GameLib.randomRange(0, Math.TAU);
      this.goal = randPoint(window);
      this.path = null;
    }

    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = options["Secondary"];
    ctx.strokeStyle = options["Primary"];
    ctx.stroke();

    //draw the path we're taking
    this.drawPath(ctx);

    //draw the cursor thing
    this.drawCursor(ctx);

    //draw the goal spot
    this.drawGoal(ctx);

    //update stuff

    var cursor = this.mouse.mouse || new Point(width / 2, height / 2); //cursor pos
    if(this.cursor == null) {
      this.cursor = cursor;
    }
    if(cursor != this.cursor) {
      this.cursor = cursor;
      this.goal = cursor; //if they moved, update + set goal
      this.path = null;
    }
    //update goal
    if(this.goal == null || this.pos.distance(this.goal) < options["GoalRadius"]) {
      this.goal = randPoint(window);
      this.path = null;
    }
    //update path
    if(this.path == null) {
      //create path
      //step 1: get bisector line (pt + slope)
      var pt_bisector = this.pos.copy();
      pt_bisector.add(this.goal);
      pt_bisector.multiply(1/2);
      var slope_bisector = -1 / (this.goal.slopeFrom(this.pos));
      //step 2: get horizon line (pt + slope)
      var pt_horizon = this.pos.copy();
      var pt_delta = new Point(1, 0);
      pt_delta.rotate(this.angle);
      var slope_horizon = -1 / pt_delta.slope();
      //step 3: get intersection (that's the center of the path arc)
      var center = intersection(pt_bisector, slope_bisector, pt_horizon, slope_horizon);
      this.path_center = center; //store for later :^)
      var radius = center.distance(this.pos);
      //step 4: subdivide arc in steps of length <SPEED> (going cw or ccw)
      var dir = 0;
      var goal_rotated = this.goal.copy();
      goal_rotated.sub(this.pos);
      goal_rotated.rotate(-this.angle);
      if(goal_rotated.y > 0) dir = 1; //cw
      else dir = -1; //ccw
      this.path_dir = dir;
      var angle_step = options["FSpeed"] / radius;
      var angle_curr = angle_step;
      this.path = [];

      var counter = 250;
      while(counter > 0) {
        counter--;
        var pt_curr = this.pos.copy();
        pt_curr.rotateAround(center, angle_curr * dir);
        angle_curr += angle_step;
        this.path.push(pt_curr);
        if(pt_curr.distance(this.goal) < options["GoalRadius"]) break;
      }

      //finalize
      this.path_index = 0;
    }
    //step along path

    while(this.path_index < this.path.length) {
      this.pos = this.path[this.path_index];
      this.angle = this.pos.angleTo(this.path_center) - (Math.PI / 2) * this.path_dir; //hm...
      this.path_index++;
      if(window.contains(this.pos)) break;
    }
    if(this.path_index >= this.path.length) {
      this.path = null;
    }



    //update pos
  }

  drawPoint(ctx, p, fill, stroke, radius) {
    if(fill) ctx.fillStyle = fill;
    if(stroke) ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
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
}

//use default options
var gameManager = new GameManager(new FollowerGame(), {});
gameManager.start();