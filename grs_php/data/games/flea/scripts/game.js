
//helpers, copied from Screen class
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
  ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
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
RenderHelper.drawTextCentered = function(ctx, text, size, p, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.font = size + 'px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  if(fill) ctx.fillText(text, p.x, p.y);
  if(stroke) ctx.strokeText(text, p.x, p.y);
}

class Box {
  constructor(position, size, velocity) {
    this.pos = position;
    this.size = size;
    this.vel = velocity;
  }
  
  get rect() {
    var r = new Rectangle(0, 0, this.size, this.size);
    r.center = this.pos;
    return r;
  }

  update(tickPart, window, cursor) {
    var v = this.vel.copy();
    v.magnitude *= tickPart;
    this.pos.add(v);
    return v;
  }
  
  render(ctx, window) {
    RenderHelper.drawRect(ctx, this.rect, "#000000", "#ffffff");
  }
}

//helper for box-spawning timers
class BoxSpawner {
  //duration: time (in seconds) before this spawner expires (and spawns its block)
  //enable_all: true/false; if true, all possible points are enabled;
  //if false, then none are enabled, and each must be enabled manually
  constructor(duration, enable_all) {
    this.duration = duration;
    this.time = 0;
    this.completion = 0;
    if(enable_all) {
      //lol
    }
  }

  update(tickPart, window, cursor) {
    this.time += tickPart;
    this.completion = (this.time / 20) / this.duration;
  }
  
  render(ctx, window) {
    var rect = window.copy();
    rect.width *= this.completion;
    rect.height *= this.completion;
    rect.center = window.center;
    RenderHelper.drawRect(ctx, rect, "#000000", "#ffffff");
  }
}

/*
TODO
-blinking
-box collisions
---getting squished by edge / between boxes
---moving from one box to another by being "scooped up"
-maybe it will automatically walk around on the box it's attached to, towards the mouse? (to prevent getting stuck on a bad side)
-prettiness
BACKBURNER:
-"partial" timers with only some edges active / part of an edge active (and it renders that way as it moves)
---so the user knows a bit more about where the box will spawn
---can also make fun patterns :^)
-different spawning behaviors
---can transition between modes throughout the game
-scoring
*/

//encapsulates static data about the game
class Game {
  //difficulty starts at 0 (does nothing)
  //and goes up
  //ez=1,med=2,hard=3
  constructor(difficulty) {
    this.difficulty = difficulty;
    //relative constant definitions
    this.block_move_time = 4 / difficulty; //as the difficulty goes up, the blocks get faster
    this.block_size_rel = 1 / 12; //block width/height, as a fraction of room sizeToContent
    this.block_spawn_time = this.block_move_time / 3; //how often it'll spawn boxes, as a fraction of a second
    //absolute constant definitions
    this.ballradius = 5;
    this.block_move_speed = 0;
    this.block_size = 0;
    //game data
    this.ball = null;
    this.game_port = new Rectangle(0, 0, 1, 1);
    this.game_port_local = new Rectangle(0, 0, 1, 1);
    this.game_port_size = 1;
    this.boxes = [];
    this.timers = [];
    this.next_timer_spawn = 0;
    //raytracing stuff
    this.cursor_local = null;
    this.blink_index = null;
    this.blink_point = null;
    this.trace_pts = [];
    //having boxes drag the player
    this.grabbed_box = -1;
  }
  
  //return the minimum distance [box, index, dist]
  minDist(pt) {
    if(this.boxes.length == 0) {
      return null;
    }
    var best_index = 0;
    var best_box = this.boxes[0];
    var best_dist = best_box.rect.distance(pt);
    for(var i = 1; i < this.boxes.length; i++) {
      var b = this.boxes[i];
      var d = b.rect.distance(pt);
      if(d < best_dist) {
        best_index = i;
        best_box = b;
        best_dist = d;
      }
    }
    return [best_box, best_index, best_dist];
  }
  
  //return [index, point] or null
  raytrace(begin, delta, precision) {
    delta = delta.copy();
    var curr = begin.copy();
    delta.magnitude = precision + 1;
    curr.add(delta);
    while(this.game_port_local.contains(curr)) {
      this.trace_pts.push(curr);
      var triple = this.minDist(curr);
      if(triple == null) return null;
      var dist = triple[2];
      if(dist < precision) {
        //done
        var box = triple[0];
        var index = triple[1];
        box.rect.pushPoint(curr);
        return [index, curr];
      } else{
        //step by dist
        delta.magnitude = dist;
        curr.add(delta);
      }
    }
    return null;
  }
  
  begin(window, pt) {
    this.resize(window);
    this.ball = pt.copy();
    this.ball.sub(this.game_port.point);
  }
  
  resize(window) {
    RectanglePosition.aspect_fit(window, this.game_port);
    RectanglePosition.center(window, this.game_port);
    this.game_port_size = this.game_port.width; //width = height
    this.game_port_local.width = this.game_port_size;
    this.game_port_local.height = this.game_port_size;
    this.block_move_speed = this.game_port_size / this.block_move_time / 20; //tick rate
    this.block_size = this.game_port_size * this.block_size_rel;
  }
  
  spawn_box() {
    var side = GameLib.randomRangeFloor(0, 4);
    var pos = null;
    var v = null;
    if(side == 0) {
      //left
      pos = new Point(-this.block_size_rel, GameLib.randomRange(0, 1));
      v = new Point(1, 0);
    } else if(side == 1) {
      //right
      pos = new Point(1+this.block_size_rel, GameLib.randomRange(0, 1));
      v = new Point(-1, 0);
    } else if(side == 2) {
      //top
      pos = new Point(GameLib.randomRange(0, 1), -this.block_size_rel);
      v = new Point(0, 1);
    } else if(side == 3) {
      //bottom
      pos = new Point(GameLib.randomRange(0, 1), 1+this.block_size_rel);
      v = new Point(0, -1);
    }
    pos.x *= this.game_port_size;
    pos.y *= this.game_port_size;
    pos.add(v);
    v.magnitude = this.block_move_speed;
    this.boxes.push(new Box(pos, this.block_size, v))
  }
  
  mouseDown(pt) {
    if(this.blink_point != null) {
      this.ball = this.blink_point;
      this.grabbed_box = this.blink_index;
    }
  }

  update(tickPart, window, cursor) {
    if(this.ball == null) return;
    //cursor stuff
    this.cursor_local = cursor.copy();
    this.cursor_local.x -= this.game_port.point.x;
    this.cursor_local.y -= this.game_port.point.y;
    //update timers
    for(var i = 0; i < this.timers.length; i++) {
      var t = this.timers[i];
      t.update(tickPart, window, cursor);
      if(t.completion >= 1) {
        this.timers.splice(i, 1);
        i--;
        this.spawn_box();
      }
    }
    //new timers
    if(this.next_timer_spawn <= 0) {
      //spawn timer
      this.timers.push(new BoxSpawner(this.block_spawn_time * 2, true));
      //reset
      this.next_timer_spawn = this.block_spawn_time;
    } else {
      this.next_timer_spawn -= tickPart / 20;
    }
    //update boxes
    for(var i = 0; i < this.boxes.length; i++) {
      var b = this.boxes[i];
      var delta = b.update(tickPart, window, cursor);
      if(i == this.grabbed_box) {
        this.ball.add(delta); //move the player
      }
      if(this.game_port_local.distance(b.pos) > this.box_size) {
        this.boxes.splice(i, 1);
        i--;
      }
    }
    //ray trace
    var cursor_delta = this.cursor_local.copy();
    cursor_delta.sub(this.ball);
    this.trace_pts = []; //reset
    var trace = this.raytrace(this.ball, cursor_delta, this.ballradius);
    if(trace != null) {
      this.blink_index = trace[0];
      this.blink_point = trace[1];
      if(this.blink_index == this.grabbed_box) {
        //"blink" immediately (to walk around the box)
        this.ball = this.blink_point;
      }
    } else {
      this.blink_index = null;
      this.blink_point = null;
    }
    //check player death
    if(!this.game_port_local.contains(this.ball)) {
      this.ball = this.game_port_local.center;
      this.grabbed_box = -1; //TMP
    }
  }
  
  render(ctx, window) {
    if(this.ball == null) return;
    //bg
    ctx.lineWidth = 2;
    RenderHelper.drawRect(ctx, this.game_port, null, "#ff0000");
    //translations
    ctx.save();
    ctx.translate(this.game_port.minX, this.game_port.minY);  
    //set up the snipping layer
    ctx.beginPath();
    ctx.rect(0, 0, this.game_port_size, this.game_port_size);
    ctx.clip();
    //timers
    for(var i = 0; i < this.timers.length; i++) {
      this.timers[i].render(ctx, this.game_port_local);
    }
    //boxes
    for(var i = 0; i < this.boxes.length; i++) {
      var b = this.boxes[i];
      b.render(ctx, this.game_port_local);
    }
    //blinking stuff
    if(this.blink_point != null) {
      RenderHelper.drawLine(ctx, this.ball, this.blink_point, "#ffffff");
    } else if(this.cursor_local) {
      var cursor_delta = this.cursor_local.copy();
      cursor_delta.sub(this.ball);
      cursor_delta.magnitude = 4 * this.game_port_size;
      cursor_delta.add(this.ball);
      RenderHelper.drawLine(ctx, this.ball, cursor_delta, "#ff0000");
    }
    //the ball
    RenderHelper.drawPoint(ctx, this.ball, "#ffffff", null, this.ballradius);
    //the cursor
    if(this.cursor_local != null) RenderHelper.drawPoint(ctx, this.cursor_local, "#000000", "#ffffff", this.ballradius);
    //reset translations
    ctx.restore();
  }
  
}