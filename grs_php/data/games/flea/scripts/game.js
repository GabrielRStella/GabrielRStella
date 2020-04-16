
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
RenderHelper.drawText = function(ctx, text, baseline, align, size, p, fill, stroke) {
  if(fill) ctx.fillStyle = fill;
  if(stroke) ctx.strokeStyle = stroke;
  ctx.font = size + 'px sans-serif';
  ctx.textBaseline = baseline;
  ctx.textAlign = align;
  if(fill) ctx.fillText(text, p.x, p.y);
  if(stroke) ctx.strokeText(text, p.x, p.y);
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
    //the background moving was just distracting, so i'm removing it for now
    /*
    var rect = window.copy();
    rect.width *= this.completion;
    rect.height *= this.completion;
    rect.center = window.center;
    RenderHelper.drawRect(ctx, rect, "#000000", "#ffffff");
    */
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
    this.block_move_time = 5 / difficulty; //as the difficulty goes up, the blocks get faster
    this.block_size_rel = 1 / 12; //block width/height, as a fraction of room sizeToContent
    this.block_spawn_time = this.block_move_time / 4; //how often it'll spawn boxes, as a fraction of a second
    //absolute constant definitions
    this.ballradius = 5;
    this.block_move_speed = 0;
    this.block_size = 0;
    //game data
    this.playing = false;
    this.ball = null;
    this.ball_move_speed = 0;
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
    //score (elapsed time in seconds)
    this.total_time = 0;
    this.score = 0;
  }
  
  //return the minimum distance [box, index, dist]
  minDist(pt, ignore_index) {
    if(this.boxes.length == 0) {
      return null;
    }
    var best_index = -1;
    var best_box = null;
    var best_dist = this.game_port_size * 2; //upper bound
    for(var i = 0; i < this.boxes.length; i++) {
      if(i == ignore_index) continue;
      var b = this.boxes[i];
      var d = b.rect.distance(pt);
      if(d < best_dist) {
        best_index = i;
        best_box = b;
        best_dist = d;
      }
    }
    if(best_index < 0) return null;
    return [best_box, best_index, best_dist];
  }
  
  //return [index, point] or null
  raytrace(begin, delta, ignore_index, precision) {
    delta = delta.copy();
    var curr = begin.copy();
    delta.magnitude = 1;
    curr.add(delta);
    if(ignore_index >= 0 && this.boxes[ignore_index].rect.contains(curr)) {
      return null;
    }
    while(this.game_port_local.contains(curr)) {
      this.trace_pts.push(curr);
      var triple = this.minDist(curr, ignore_index);
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
  
  begin(gui, window, pt) {
    this.gui = gui;
    this.resize(window);
    this.ball = pt.copy();
    this.ball.sub(this.game_port.point);
    this.playing = true;
  }
  
  //you lost :^(
  end() {
    this.playing = false;
    this.gui.pop();
      this.gui.push(new ScreenGameOver(this));
  }
  
  resize(window) {
    var prev_size = this.game_port_size;
    RectanglePosition.aspect_fit(window, this.game_port);
    RectanglePosition.center(window, this.game_port);
    this.game_port_size = this.game_port.width; //width = height
    this.game_port_local.width = this.game_port_size;
    this.game_port_local.height = this.game_port_size;
    this.block_move_speed = this.game_port_size / this.block_move_time / 20; //tick rate
    this.block_size = this.game_port_size * this.block_size_rel;
    this.ball_move_speed = this.block_move_speed;
    //fix blocks and such
    var szmod = this.game_port_size / prev_size;
    for(var i = 0; i < this.boxes.length; i++) {
      var b = this.boxes[i];
      var p = b.pos;
      p.x *= szmod;
      p.y *= szmod;
      b.size = this.block_size;
      b.vel.magnitude = this.block_move_speed;
    }
    if(this.ball != null) {
      this.ball.x *= szmod;
      this.ball.y *= szmod;
    }
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
    if(this.ball == null || !this.playing) return;
    //score
    this.total_time += tickPart / 20;
    this.score = Math.round(this.total_time * 10) / 10; //round to nearest tenth
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
      else if(b.rect.contains(this.ball)) {
        if(this.grabbed_box < 0) this.grabbed_box = i;
        else if(this.grabbed_box != i) {
          //multi-box collision!!
          //either kill player or grab the new box :^)
          //based on angle between: (this box movement vector) and (player - grabbed box center)
          var v1 = b.vel;
          var v2 = this.ball.copy();
          v2.sub(this.boxes[this.grabbed_box].pos);
          //make it only directional (snap to 90-degree increments)
          if(Math.abs(v2.x) < Math.abs(v2.y)) {
            v2.x = 0;
          } else {
            v2.y = 0;
          }
          var dot = v1.x * v2.x + v1.y * v2.y;
          if(dot >= 0) {
            //aligned, grab new box
            this.grabbed_box = i;
          } else {
            //misaligned, player dies
            this.end();
          }
        }
      }
      if(this.game_port_local.distance(b.pos) > this.box_size) {
        this.boxes.splice(i, 1);
        i--;
      }
    }
    if(this.grabbed_box >= 0) {
      //walk towards cursor
      var mov = this.ball_move_speed * tickPart;
      this.ball.x += Math.sign(this.cursor_local.x - this.ball.x) * Math.min(Math.abs(this.cursor_local.x - this.ball.x), mov);
      this.ball.y += Math.sign(this.cursor_local.y - this.ball.y) * Math.min(Math.abs(this.cursor_local.y - this.ball.y), mov);
      this.boxes[this.grabbed_box].rect.pushPoint(this.ball);
    }
    //ray trace
    var cursor_delta = this.cursor_local.copy();
    cursor_delta.sub(this.ball);
    this.trace_pts = []; //reset
    var trace = this.raytrace(this.ball, cursor_delta, this.grabbed_box, this.ballradius);
    if(trace != null) {
      this.blink_index = trace[0];
      this.blink_point = trace[1];
    } else {
      this.blink_index = null;
      this.blink_point = null;
    }
    //check player death
    if(!this.game_port_local.contains(this.ball)) {
      this.end();
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
      RenderHelper.drawPoint(ctx, this.blink_point, "#000000", "#ffffff", this.ballradius);
    } else if(this.cursor_local) {
      var cursor_delta = this.cursor_local.copy();
      cursor_delta.sub(this.ball);
      cursor_delta.magnitude = 4 * this.game_port_size;
      cursor_delta.add(this.ball);
      //too much clutter
      //RenderHelper.drawLine(ctx, this.ball, cursor_delta, "#ff0000");
    }
    //the ball
    RenderHelper.drawPoint(ctx, this.ball, "#ffffff", null, this.ballradius);
    //reset translations
    ctx.restore();
    //HUD
    if(this.playing) {
      //display score
      RenderHelper.drawText(ctx, "Score: " + this.score, 'top', 'left', 32, new Point(10, 10), "#ffffff", null);
    }
  }
  
}