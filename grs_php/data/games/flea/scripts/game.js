
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

  update(tickPart, window, cursor) {
    var v = this.vel.copy();
    v.magnitude *= tickPart;
    this.pos.add(v);
  }
  
  render(ctx, window) {
    var rect = new Rectangle(0, 0, this.size, this.size);
    rect.center = this.pos;
    RenderHelper.drawRect(ctx, rect, "#000000", "#ffffff");
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
      pos = new Point(0, GameLib.randomRange(0, 1));
      v = new Point(1, 0);
    } else if(side == 1) {
      //right
      pos = new Point(1, GameLib.randomRange(0, 1));
      v = new Point(-1, 0);
    } else if(side == 2) {
      //top
      pos = new Point(GameLib.randomRange(0, 1), 0);
      v = new Point(0, 1);
    } else if(side == 3) {
      //bottom
      pos = new Point(GameLib.randomRange(0, 1), 1);
      v = new Point(0, -1);
    }
    pos.x *= this.game_port_size;
    pos.y *= this.game_port_size;
    pos.add(v);
    v.magnitude = this.block_move_speed;
    this.boxes.push(new Box(pos, this.block_size, v))
  }

  update(tickPart, window, cursor) {
    if(this.ball == null) return;
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
      b.update(tickPart, window, cursor);
      if(!this.game_port_local.contains(b.pos)) {
        this.boxes.splice(i, 1);
        i--;
      }
    }
  }
  
  render(ctx, window) {
    if(this.ball == null) return;
    //bg
    ctx.lineWidth = 2;
    RenderHelper.drawRect(ctx, this.game_port, null, "#ffffff");
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
      this.boxes[i].render(ctx, this.game_port_local);
    }
    //the ball
    RenderHelper.drawPoint(ctx, this.ball, "#ffffff", null, this.ballradius);
    //reset translations
    ctx.restore();
  }
  
}