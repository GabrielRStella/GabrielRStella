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

function randPoint(r) {
  return new Point(GameLib.randomRangeFloor(0, r.width), GameLib.randomRangeFloor(0, r.height));
}

function color(r, g, b, a) {
  return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + a + ")";
}

//https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

//////

class Player {
	constructor() {
		this.alive = true;
		
		this.color = "#ffffff";
		this.position = new Point(0, 0);
		this.target = new Point(0, 0);
	}
	
	getBullet() {
		var bullet = new Bullet();
		bullet.color = this.color;
		bullet.position = this.posiiton;
		bullet.velocity = this.target.copy();
		bullet.velocity.sub(this.position);
		bullet.velocity.magnitude = 1;
		return bullet;
	}
	
	render(ctx, imgs) {
		ctx.lineWidth = 0.1;
		RenderHelper.drawLine(ctx, this.position, this.target, this.color);
		RenderHelper.drawPoint(ctx, this.target, this.color, null, 0.2);
		//
		RenderHelper.drawPoint(ctx, this.position, "#000000", null, 1.1);
		RenderHelper.drawPoint(ctx, this.position, this.color, null, 1);
		//
		var composite = ctx.globalCompositeOperation;
		//
		var r = new Rectangle(0, 0, 2, 2);
		r.center = this.position;
		ctx.globalCompositeOperation = "darken";
		imgs.drawImage(this.alive ? "face" : "face2", ctx, r, false);
		//
		ctx.globalCompositeOperation = composite;
	}
}

class Bullet {
	constructor() {
		this.active = true;
		
		this.color = "#ffffff";
		
		this.position = new Point(0, 0);
		this.velocity = new Point(0, 0);
		this.accel = new Point(0, 0);
		
		this.forces = []; //list of pairs (position, force vector), re-calculated on each frame
		this.netForce = new Point(0, 0);
	}

	applyForce(offset, F) {
		this.accel.add(F);
		//
		this.forces.push([offset, F]);
		this.netForce.add(F);
	}
	
	//assumes collision is checked (overlap)
	collide(p, b) {
		//no forces; just directly exchange momentum/energy and fix overlap
		
		//positions
		var midpoint = p.copy(); //midpoint (center of contact)
		midpoint.add(this.position);
		midpoint.multiply(0.5);
		var offset = p.copy(); //offset (vec from this to other)
		offset.sub(this.position);
		var N = offset.copy(); //normalized offset ("line of centers")
		N.magnitude = 1;
		//overlap
		var dist = offset.magnitude; //distance between centers
		var overlap = Math.max(0, 2 - dist); //length of overlap
		//velocities
		var v1 = this.velocity.copy(); //technically may want to use getVelocityAtPoint(mp) here, if rotation is allowed
		var v2 = b.velocity.copy();
		//relative velocity
		var V = v1.copy(); //relative velocity at point of contact
		V.sub(v2);
		//normal component of relative velocity (change in overlap)
		var Vn = V.x * N.x + V.y * N.y;
		//tangent component of relative velocity
		var Vt = V.copy();
		var tmp = N.copy();
		tmp.multiply(Vn);
		Vt.sub(tmp);
		//move positions back in time to when contact occurred, and keep track of how much we have to move forward
		var overlaptime = overlap / Vn;
		if(Vn > 0.1) {
			tmp = this.velocity.copy();
			tmp.multiply(-overlaptime);
			this.position.add(tmp);
			tmp = b.velocity.copy();
			tmp.multiply(-overlaptime);
			b.position.add(tmp);
		}
		//if they are still overlapping, have to manually move them - in this case, just move evenly apart
		overlap = 2 - b.position.distance(this.position);
		if(overlap > 0) {
			var delta = this.position.copy();
			delta.sub(b.position);
			delta.magnitude = overlap;
			delta.multiply(0.5);
			this.position.add(delta);
			b.position.sub(delta);
		}
		//swap velocities
		var Cr = OPTIONS.Restitution; //coefficient of restitution
		//
		var vn1 = N.project(v1);
		vn1.multiply(Cr);
		var vt1 = N.reject(v1);
		var vn2 = N.project(v2);
		vn2.multiply(Cr);
		var vt2 = N.reject(v2);
		//
		var v1p = vt1;
		v1p.add(vn2);
		this.velocity = v1p;
		var v2p = vt2;
		v2p.add(vn1);
		b.velocity = v2p;
		//move forward by however much we went back
		if(Vn > 0.1) {
			tmp = this.velocity.copy();
			tmp.multiply(overlaptime);
			this.position.add(tmp);
			tmp = b.velocity.copy();
			tmp.multiply(overlaptime);
			b.position.add(tmp);
		}
	}
	
	//update pos + angle and clear accels
	update(dt) {
		//
		this.accel.multiply(dt);
		this.velocity.add(this.accel);
		//
		//this.velocity.multiply(0.995); //damping
		var v = this.velocity.copy();
		v.multiply(dt);
		this.position.add(v);
		//
		this.accel.x = 0;
		this.accel.y = 0;
	}
	
	render(ctx) {
		RenderHelper.drawPoint(ctx, this.position, this.color, null, 1);
	}
}

class DuelGame extends Game {
  constructor() {
    super("duel");
	
	//physics area bounds
	this.w = 30;
	this.h = 30;
	
	this.players = [];
	this.bullets = [];
	this.state = 0; //false: setup; true: simulation
	
	//
	this.dragging = false;
	this.drag = null; //null = aim, Point = drag player with offset
	
	this.resetGame();
  }
  
  resetGame() {
	this.state = 0;
	var player = new Player();
	player.color = "#ff0000";
	player.position = new Point(Math.random() * this.w, Math.random() * this.h);
	player.target = player.position.copy();
	this.players.push(player);
  }

  register(keys, mouse) {
    this.mouse = mouse;
    this.LISTENER_MOUSE_MDOWN = mouse.addListener("mousedown", this.onMouseDown.bind(this));
    this.LISTENER_MOUSE_MUP = mouse.addListener("mouseup", this.onMouseUp.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_MDOWN);
    mouse.removeListener(this.LISTENER_MOUSE_MUP);
  }
  
  transformLocal(pos) {
	var x = (pos.x - this.center.x) / this.scale + this.w / 2;
	var y = (pos.y - this.center.y) / this.scale + this.h / 2;
	return new Point(x, y);
  }
  
  onMouseDown(evt) {
	if(this.state == 1) {
		//game on, do nothing
		return;
	}
	var pos = this.transformLocal(this.mouse.getMousePos(evt));
	//
	if(this.state == 0) {
		//move player/aim
		var player = this.players[this.players.length - 1];
		if(pos.distance(player.position) <= 1)  {
			var delta = player.position.copy();
			delta.sub(pos);
			this.drag = delta;
		} else {
			this.drag = null;
		}
		this.dragging = true;
	} else if(this.state == 2) {
		//game ended, reset
		this.resetGame();
	}
  }
  
  onMouseUp(evt) {
	if(this.dragging) {
		var pos = this.transformLocal(this.mouse.getMousePos(evt));
		//
	}
	this.dragging = false;
  }

  update(tickPart) {
	
	  if(this.dragging) {
		var dragdst = this.transformLocal(this.mouse.mouse);
		var player = this.players[this.players.length - 1];
		//
		if(this.drag) {
			var newpos = this.drag.copy();
			newpos.add(dragdst);
			player.position = newpos;
		} else {
			player.target = dragdst;
		}
		//
		this.dragsrc = dragdst;
	  }
	
	
    if(tickPart > 1) tickPart = 1;
	
	var steps = 10;
	for(var step = 0; step < steps; step++) {
		//update forces, apply gravity / wall repulsion
		for(let b of this.bullets) {
			b.forces = [];
			b.netForce = new Point(0, 0);
			for(let b2 of this.bullets) {
				if(b != b2) {
					var d = b.position.distance(b2.position);
					if(d > 0 && d < 2) {
						b.collide(b2.position, b2);
					}
				}
			}
		}
		
		//update velocities and positions
		for(var i = 0; i < this.bullets.length; i++) {
			var b = this.particles[i];
			//bounds
			var b1 = (b.position.x < 1);
			var b2 = (b.position.x > this.w - 1);
			var b3 = (b.position.y < 1);
			var b4 = (b.position.y > this.h - 1);
			if(b1 || b2 || b3 || b4) {
				if(b1) {
					b.position.x = 2 - b.position.x;
					b.velocity.x = - b.velocity.x;
				}
				else if(b2) {
					b.position.x = (this.w - 1) * 2 - b.position.x;
					b.velocity.x = - b.velocity.x;
				}
				if(b3) {
					b.position.y = 2 - b.position.y;
					b.velocity.y = - b.velocity.y;
				}
				else if(b4) {
					b.position.y = (this.h - 1) * 2 - b.position.y;
					b.velocity.y = - b.velocity.y;
				}
			}
			if(!b.active) {
				//ded
				this.particles.splice(i, 1);
				i--;
			} else {
				//update
				b.update(tickPart / steps);
			}
		}
	}
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
	  //rescale to window size
	  this.scale = Math.min(width / this.w, height / this.h);
	  this.center = new Point(width / 2, height / 2);
	
	  ctx.save();
	  
	  ctx.translate(this.center.x, this.center.y);
	  ctx.scale(this.scale, this.scale);
	  ctx.translate(-this.w / 2, -this.h / 2);
	  
	  //draw area bounds
	  ctx.lineWidth = 0.1;
	  RenderHelper.drawRect(ctx, new Rectangle(0, 0, this.w, this.h), "#000000", "#ffffff");
	  
	  for(var i = 0; i < this.bullets.length; i++) {
		var b = this.bullets[i];
		b.render(ctx);
	  }
	  
	  for(var i = 0; i < this.players.length; i++) {
		var b = this.players[i];
		b.render(ctx, this.gameManager.images);
	  }
	  
	  ctx.restore();
	  
	}
}

//use default options
var gameManager = new GameManager(new DuelGame(), {});
gameManager.start();