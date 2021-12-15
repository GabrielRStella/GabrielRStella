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

var DAT_GUI = new dat.GUI();

var OPTIONS = {
	Width: 20,
	Height: 20,
	Gravity: 0,
	Restitution: 1,
	//
	Speed: 1,
	Collisions: true,
};

var f = DAT_GUI.addFolder("World");

f.add(OPTIONS, "Width", 10, 200, 1);
f.add(OPTIONS, "Height", 10, 200, 1);
f.add(OPTIONS, "Gravity", -1, 1, 0.001);
f.add(OPTIONS, "Restitution", 0, 1, 0.001);
f.add(OPTIONS, "Speed", 0, 1, 0.001);
f.add(OPTIONS, "Collisions");

//////
//for voxelization of space
var VOXEL_SIZE = 2;

class Grid {
	constructor(sz) {
		this.sz = sz;
		this.grid = {};
	}
	
	pos2index(p) {
		var x = Math.floor(p.x / this.sz);
		var y = Math.floor(p.y / this.sz);
		return {x: x, y: y};
	}
	
	at(index) {
		//index = this.pos2index(index);
		index = "" + index.x + "," + index.y;
		if(!(index in this.grid)) {
			this.grid[index] = new Set();
		}
		return this.grid[index];
	}
	
	clear() {
		this.grid = {};
	}
	
	//helper functions
	
	closest(p, particles) {
		if(!particles || particles.size == 0) return null;
		var particle = null;
		var d = -1;
		
		for(let b of particles) {
			var dist = p.distance(b.position);
			if(d < 0 || dist < d) {
				particle = b;
				d = dist;
			}
		}
		return particle ? {particle: particle, dist: d} : null;
	}
	
	//looks in grid cells +=d in both x and y
	helperGetClosestParticle(p, d) {
		var particle = null;
		var pdist = ((d + 1) * this.sz) * ((d + 1) * this.sz); //upper bound on distance
		//
		var i = this.pos2index(p);
		//try corners
		var closest1 = this.closest(p, this.at({x: i.x - d, y: i.y - d}));
		if(closest1 != null && closest1.dist < pdist) {
			particle = closest1.particle;
			pdist = closest1.dist;
		}
		if(d > 0) {
			var closest2 = this.closest(p, this.at({x: i.x + d, y: i.y - d}));
			if(closest2 != null && closest2.dist < pdist) {
				particle = closest2.particle;
				pdist = closest2.dist;
			}
			var closest3 = this.closest(p, this.at({x: i.x - d, y: i.y + d}));
			if(closest3 != null && closest3.dist < pdist) {
				particle = closest3.particle;
				pdist = closest3.dist;
			}
			var closest4 = this.closest(p, this.at({x: i.x + d, y: i.y + d}));
			if(closest4 != null && closest4.dist < pdist) {
				particle = closest4.particle;
				pdist = closest4.dist;
			}
		}
		//try edges
		for(var j = -d + 1; j < d; j++) {
			var closest1 = this.closest(p, this.at({x: i.x - d, y: i.y + j}));
			if(closest1 != null && closest1.dist < pdist) {
				particle = closest1.particle;
				pdist = closest1.dist;
			}
			var closest2 = this.closest(p, this.at({x: i.x + d, y: i.y + j}));
			if(closest2 != null && closest2.dist < pdist) {
				particle = closest2.particle;
				pdist = closest2.dist;
			}
			var closest3 = this.closest(p, this.at({x: i.x + j, y: i.y - d}));
			if(closest3 != null && closest3.dist < pdist) {
				particle = closest3.particle;
				pdist = closest3.dist;
			}
			var closest4 = this.closest(p, this.at({x: i.x + j, y: i.y + d}));
			if(closest4 != null && closest4.dist < pdist) {
				particle = closest4.particle;
				pdist = closest4.dist;
			}
		}
		return particle;
	}
	
	//returns the particle whose center is closest to the given point
	getClosestParticle(p, dmax) {
		dmax = dmax || 1;
		var d = 0;
		var particle = null;
		var pdist = -1;
		while(d <= dmax) {
			var particle2 = this.helperGetClosestParticle(p, d);
			if(particle2) {
				var dist = p.distance(particle2.position);
				if(pdist < 0 || dist < pdist) {
					particle = particle2;
					pdist = dist;
				}
			}
			d++;
		}
		return particle;
	}
	
	//returns all particles whose centers are contained within a circle centered at p with radius r (add MAX_RADIUS to r to get all particles touching the circle)
	getParticlesWithin(p, r) {
		var ps = new Set();
		var i = this.pos2index(p);
		var ir = Math.ceil(r);
		for(var dx = -ir; dx <= ir; dx++) {
			for(var dy = -ir; dy <= ir; dy++) {
				var index = {x: i.x + dx, y: i.y + dy};
				var particles = this.at(index);
				for(let b of particles) {
					//possible overlap
					if(b.kinematic && b.position.distance(p) < r) {
						ps.add(b);
					}
				}
			}
		}
		return ps;
	}
}

//////

class Body {
	constructor() {
		this.active = true;
		
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
		var color = "#ffffff";
		RenderHelper.drawPoint(ctx, this.position, color, null, 1);
		//
		return this.velocity.magnitudeSquared;
	}
}

class Tool {
	constructor(game) {
		this.game = game;
	}
	
	onClick(x, y) {
	}
	
	//also works for click+hold
	onDragBegin(p) {
	}
	onDrag(pBegin, pEnd, dt) {
	}
	onDragEnd(p) {
	}
}

class ToolSpawner extends Tool {
	constructor(game, f) {
		super(game);
		this.N = 1;
		f.add(this, "N", 1, 100);
	}
	
	onClick(x, y) {
		for(var i = 0; i < this.N; i++) {
			var b = new Body();
			b.position = new Point(x, y);
			this.game.particles.push(b);
			
			b.prevIndex = this.game.grid.pos2index(b.position);
			this.game.grid.at(b.prevIndex).add(b);
		}
	}
}

class ToolDragger extends Tool {
	constructor(game, f) {
		super(game);
	}
	
	onDragBegin(p) {
		this.dragging = this.game.getClosestParticleTouching(p);
	}
	
	onDrag(pBegin, pEnd, dt) {
		var dmax = 1;
		if(this.dragging) {
			if(OPTIONS.Speed > 0) {
				//drag particle towards pEnd, with upper bound on force magnitude
				var delta = pEnd.copy();
				delta.sub(this.dragging.position);
				if(delta.magnitude > dmax) delta.magnitude = dmax;
				delta.add(new Point(0, -OPTIONS.Gravity));
				delta.multiply(1 / OPTIONS.Speed);
				this.dragging.applyForce(new Point(0, 0), delta);
			} else {
				this.dragging.velocity = new Point(0, 0);
				this.dragging.position = pEnd;
			}
		}
	}
	onDragEnd(p) {
		this.dragging = null;
	}
}

class ToolDelete extends Tool {
	constructor(game, f) {
		super(game);
	}
	
	onDrag(pBegin, pEnd, dt) {
		var b = this.game.getClosestParticleTouching(pEnd);
		if(b != null) b.active = false;
	}
}

class BallGame extends Game {
  constructor() {
    super("billiards");
	
	//physics area bounds
	this.w = OPTIONS.Width;
	this.h = OPTIONS.Height;
	
	this.particles = [];
	for(var i = 0; i < 10; i++) {
		var b = new Body();
		b.position = new Point(Math.random() * this.w, Math.random() * this.h);
		this.particles.push(b);
	}
	
	this.grid = new Grid(VOXEL_SIZE);
	
	//create tools and gui

	var f = DAT_GUI.addFolder("Tool");
	
	this.toolDragger = new ToolDragger(this, f);
	this.Drag = function(){this.tool = this.toolDragger}.bind(this);
	f.add(this, "Drag");
	
	this.toolSpawner = new ToolSpawner(this, f);
	this.Create = function(){this.tool = this.toolSpawner}.bind(this);
	f.add(this, "Create");
	
	this.toolDelete = new ToolDelete(this, f);
	this.Delete = function(){this.tool = this.toolDelete}.bind(this);
	f.add(this, "Delete");
	//
	this.tool = this.toolDragger;
	this.dragging = false;
	
  }

  register(keys, mouse) {
    this.mouse = mouse;
    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", this.onClick.bind(this));
    this.LISTENER_MOUSE_MDOWN = mouse.addListener("mousedown", this.onMouseDown.bind(this));
    this.LISTENER_MOUSE_MUP = mouse.addListener("mouseup", this.onMouseUp.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
    mouse.removeListener(this.LISTENER_MOUSE_MDOWN);
    mouse.removeListener(this.LISTENER_MOUSE_MUP);
  }
  
  onClick(evt) {
    var pos = this.mouse.getMousePos(evt);
	var x = (pos.x - this.center.x) / this.scale + this.w / 2;
	var y = (pos.y - this.center.y) / this.scale + this.h / 2;
	var n = this.toolSize;
	var r = Math.sqrt(n / Math.PI);
	//
	this.tool.onClick(x, y, n, r);
  }
  
  onMouseDown(evt) {
	  this.dragging = true;
		var pos = this.mouse.getMousePos(evt);
		var x = (pos.x - this.center.x) / this.scale + this.w / 2;
		var y = (pos.y - this.center.y) / this.scale + this.h / 2;
		this.dragsrc = new Point(x, y);
		
		var n = this.toolSize;
		var r = Math.sqrt(n / Math.PI);
		this.tool.onDragBegin(this.dragsrc, n, r);
  }
  
  onMouseUp(evt) {
	if(this.dragging) {
		var pos = this.mouse.getMousePos(evt);
		var x = (pos.x - this.center.x) / this.scale + this.w / 2;
		var y = (pos.y - this.center.y) / this.scale + this.h / 2;
		
		var n = this.toolSize;
		var r = Math.sqrt(n / Math.PI);
		this.tool.onDragEnd(new Point(x, y), n, r);
	}
	this.dragging = false;
  }
  
  getClosestParticleTouching(p) {
	  var b = this.grid.getClosestParticle(p, 1);
	  if(b == null) return null;
	  return (b.position.distance(p) < 1) ? b : null;
  }
  
  getClosestParticle(p) {
	  if(this.particles.length == 0) return null;
	  var closest = this.particles[0];
	  var d = closest.position.distance(p);
	  
	  for(var i = 1; i < this.particles.length; i++) {
		  var b = this.particles[i];
		  var dist = b.position.distance(p);
		  if(dist < d) {
			  closest = b;
			  d = dist;
		  }
	  }
	  return closest;
  }

  update(tickPart) {
	  
	  this.w = OPTIONS.Width;
	  this.h = OPTIONS.Height;
	
	tickPart *= OPTIONS.Speed;
	
	  if(this.dragging) {
		var pos = this.mouse.mouse;
		var x = (pos.x - this.center.x) / this.scale + this.w / 2;
		var y = (pos.y - this.center.y) / this.scale + this.h / 2;
		var dragdst = new Point(x, y);
		var n = this.toolSize;
		var r = Math.sqrt(n / Math.PI);
		this.tool.onDrag(this.dragsrc, dragdst, n, r, tickPart);
		this.dragsrc = dragdst;
	  }
	
    if(tickPart > 1) tickPart = 1;
	
	var steps = 10;
	for(var step = 0; step < steps; step++) {
		//update forces, apply gravity / wall repulsion
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			b.forces = [];
			b.netForce = new Point(0, 0);
			if(OPTIONS.Collisions) {
				var index = this.grid.pos2index(b.position);
				for(var dx = -1; dx <= 1; dx++) {
					for(var dy = -1; dy <= 1; dy++) {
						var index2 = {x: index.x + dx, y: index.y + dy};
						var neighbors = this.grid.at(index2);
						for(let b2 of neighbors) {
							if(b2 == b) continue;
							//possible collision
							var d = b.position.distance(b2.position);
							if(d > 0 && d < 2) {
								b.collide(b2.position, b2);
							}
						}
					}
				}
			}
			//if gravity enabled, add downwards force
			if(OPTIONS.Gravity != 0) b.applyForce(new Point(0, 0), new Point(0, OPTIONS.Gravity / steps));
		}
		
		//update velocities and positions
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			var index = b.prevIndex;
			//bounds
			var b1 = (b.position.x < 1);
			var b2 = (b.position.x > this.w - 1);
			var b3 = (b.position.y < 1);
			var b4 = (b.position.y > this.h - 1);
			if(b1 || b2 || b3 || b4) {
				b.velocity.multiply(OPTIONS.Restitution);
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
				if(index) this.grid.at(index).delete(b);
				this.particles.splice(i, 1);
				i--;
			} else {
				//update
				b.update(tickPart / steps);
				//
				var index2 = this.grid.pos2index(b.position);
				if(!index || index2.x != index.x || index2.y != index.y) {
					if(index) this.grid.at(index).delete(b);
					this.grid.at(index2).add(b);
					b.prevIndex = index2;
				}
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
	  RenderHelper.drawRect(ctx, new Rectangle(0, 0, this.w, this.h), null, "#ffffff");
	  
	  var kineticEnergy = 0;
	  var potentialEnergy = 0;
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		kineticEnergy += b.render(ctx);
		potentialEnergy += OPTIONS.Gravity * ((this.h - 1) - b.position.y) / 10 * 2; // /10 to account for number of steps; *2 to account for my slightly incorrect energy formula :^)
	  }
	  
	  ctx.restore();
	  
	  RenderHelper.drawText(ctx, "" + this.particles.length, "top", "left", 36, new Point(10, 10), "#ffffff", null);
	  RenderHelper.drawText(ctx, "" + kineticEnergy.toFixed(3) + " + " + potentialEnergy.toFixed(3) + " = " + (kineticEnergy + potentialEnergy).toFixed(3), "top", "left", 36, new Point(10, 50), "#ffffff", null);
  }
}

//use default options
var gameManager = new GameManager(new BallGame(), {});
gameManager.start();