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

///////

var DAT_GUI = new dat.GUI();

var OPTIONS = {
	ColorHot: "#ff7800",
	ColorCold: "#ffd280",
	ColorHot_: hexToRgb("#ff7800"),
	ColorCold_: hexToRgb("#ffd280"),
	Opacity: 1,
	Heat: 30,
	Overline: false,
	DummyHot: "#ffffff",
	DummyCold: "#101010",
	ColorDummyHot_: hexToRgb("#ffffff"),
	ColorDummyCold_: hexToRgb("#101010"),
	DummyHeat: 0.1,
	Glow: 0.3,
	Grid: false,
	Forces: false,
	NetForce: false,
	Playing: true,
	Steps: 20,
	Speed: 1,
	Width: 80,
	Height: 80,
	Starticles: 100, //get it? starting particles? :^D
	Gravity: 0.1,
	Damping: 0.9, //collision damping coefficient
	Restitution: 1, //restitution/rigidity coefficient
	alpha: 0.5, //normal force modulator (energy dissipation)
	beta: 1.5, //normal force modulator (rigidity)
	Friction: 0.9 //shear friction coefficient
};

var f = DAT_GUI.addFolder("Rendering");

f.addColor(OPTIONS, "ColorHot").onChange(function(){OPTIONS.ColorHot_ = hexToRgb(OPTIONS.ColorHot)});
f.addColor(OPTIONS, "ColorCold").onChange(function(){OPTIONS.ColorCold_ = hexToRgb(OPTIONS.ColorCold)});
f.add(OPTIONS, "Opacity", 0, 1);
f.add(OPTIONS, "Heat", 1, 100);
f.add(OPTIONS, "Overline");
f.addColor(OPTIONS, "DummyHot").onChange(function(){OPTIONS.ColorDummyHot_ = hexToRgb(OPTIONS.DummyHot)});
f.addColor(OPTIONS, "DummyCold").onChange(function(){OPTIONS.ColorDummyCold_ = hexToRgb(OPTIONS.DummyCold)});
f.add(OPTIONS, "DummyHeat", 0.01, 1);
f.add(OPTIONS, "Glow", 0.1, 2);
f.add(OPTIONS, "Grid");
f.add(OPTIONS, "Forces");
f.add(OPTIONS, "NetForce");

f = DAT_GUI.addFolder("World");

f.add(OPTIONS, "Playing");
f.add(OPTIONS, "Steps", 1, 100);
f.add(OPTIONS, "Speed", 0, 1);
f.add(OPTIONS, "Width", 1, 400, 1);
f.add(OPTIONS, "Height", 1, 400, 1);

f = DAT_GUI.addFolder("Physics");

f.add(OPTIONS, "Gravity", -0.1, 0.1, 0.001);
f.add(OPTIONS, "Damping", -1, 1);
f.add(OPTIONS, "Restitution", 0, 10);
f.add(OPTIONS, "alpha", 0, 3);
f.add(OPTIONS, "beta", 0, 3);
f.add(OPTIONS, "Friction", -1, 1); //negative = rolly bois (very dangerous)

function getColor(energy) {
  var d = 1 / (energy + 1);
  var d1 = 1-d;
  var c = {
	  r: OPTIONS.ColorHot_.r * d1 + OPTIONS.ColorCold_.r * d,
	  g: OPTIONS.ColorHot_.g * d1 + OPTIONS.ColorCold_.g * d,
	  b: OPTIONS.ColorHot_.b * d1 + OPTIONS.ColorCold_.b * d,
  };
  return color(c.r, c.g, c.b, OPTIONS.Opacity);
}

function getDummyColor(energy) {
  var d = 1 / (energy + 1);
  var d1 = 1-d;
  var c = {
	  r: OPTIONS.ColorDummyHot_.r * d1 + OPTIONS.ColorDummyCold_.r * d,
	  g: OPTIONS.ColorDummyHot_.g * d1 + OPTIONS.ColorDummyCold_.g * d,
	  b: OPTIONS.ColorDummyHot_.b * d1 + OPTIONS.ColorDummyCold_.b * d,
  };
  return color(c.r, c.g, c.b, 1);
}

//////

//for voxelization of space
var MAX_RADIUS = 2;
var VOXEL_SIZE = 2 * MAX_RADIUS;

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
			if(!b.kinematic) continue;
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
	
	//returns the partcle whose center is closest to the given point
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
		//none found within range; could look through all particles in grid
		//but we'll just... not
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

var DIST = 1 / Math.cos(Math.PI / 6); //distance of circle from the origin when in a triangular equilateral arrangement
var RADIUS = 1 + DIST; //"radius" of a grain (max dist from origin to far side of a member particle)
var RADIUS2 = 4 * RADIUS * RADIUS;
var I = 3 * (1/2 + DIST * DIST); //moment of inertia of our three-particle blobs, assuming each has unit mass

class Body {
	constructor() {
		this.active = true;
		
		//equilateral triangle arrangement
		this.particles = []; //list of member particle offsets
		var p = new Point(0, DIST);
		this.particles.push(p.copy());
		p.rotate(Math.PI * 2 / 3); //rotate 120 degrees
		this.particles.push(p.copy());
		p.rotate(Math.PI * 2 / 3); //another 120 degrees
		this.particles.push(p.copy());
		
		this.position = new Point(0, 0);
		this.velocity = new Point(0, 0);
		this.accel = new Point(0, 0);
		this.angle = 0;
		this.angularvelocity = 0;
		this.angularaccel = 0;
		
		this.forces = []; //list of pairs (position, force vector), re-calculated on each frame
		
		this.kinematic = true;
	}
	
	getParticleCount() {
		return this.particles.length;
	}
	
	getParticlePosition(index) {
		var pos = this.particles[index].copy();
		pos.rotate(this.angle);
		pos.add(this.position);
		return pos;
	}
	
	//kinetic energy
	getEnergy() {
		return (this.velocity.magnitudeSquared + I * (this.angularvelocity * this.angularvelocity)) / 2;
	}
	
	//query velocity at a certain (world coords) point based on vel + angularvel&offset
	getVelocityAt(p) {
		var v = this.velocity.copy();
		var offset = p.copy();
		offset.sub(this.position);
		offset.rotate(Math.PI / 2);
		offset.multiply(this.angularvelocity);
		v.add(offset);
		return v;
	}

	//apply force (and torque) at offset
	//F is a Point (i.e. vector)
	applyForce(offset, F) {
		//F.multiply(1/3); //technically should account for increased mass of 3-body.. but i like it better without this :))
		this.accel.add(F); //ignore mass multiplication lol
		var torque = offset.magnitude * F.magnitude * Math.sin(offset.angleBetween(F));
		this.angularaccel += torque / I;
		//
		this.forces.push([offset, F]);
		this.netForce.add(F);
	}
	
	//collide with a particle at a given (world coords) point
	//tests for collision (overlap) with each of its own constituent particles, then updates force/torque on self (not on other body)
	collide_soft(p, b) {
		for(var i = 0; i < this.particles.length; i++) {
			var selfp = this.getParticlePosition(i);
			//
			var offset = p.copy();
			offset.sub(selfp);
			//
			var dist = offset.magnitude;
			var overlap = Math.max(0, 2 - dist);
			if(overlap > 0) {
				//collision
				//midpoint (approx. collision point)
				var mp = p.copy();
				mp.add(selfp);
				mp.multiply(0.5);
				//"line of centers"
				var N = offset.copy();
				N.magnitude = 1;
				//
				var v1 = this.getVelocityAt(mp);
				var v2 = b.getVelocityAt(mp);// : new Point(0, 0);
				//console.log(mp, v1, v2);
				//relative velocity at point of contact
				var V = v1.copy();
				V.sub(v2);
				//change in overlap (normal velocity)
				var doverlap = V.x * N.x + V.y * N.y;
				//tangent velocity
				var Vt = V.copy();
				var tmp = N.copy();
				tmp.multiply(doverlap);
				Vt.sub(tmp);
				//force parameters
				//normal force
				var fn = -(OPTIONS.Damping * Math.pow(overlap, OPTIONS.alpha) * doverlap + OPTIONS.Restitution * Math.pow(overlap, OPTIONS.beta));
				var Fn = N.copy();
				Fn.multiply(fn);
				//console.log(N, fn, overlap, doverlap, Fn);
				//
				var off = mp.copy();
				off.sub(this.position);
				//this.forces.push([off, v1]);
				this.applyForce(off, Fn);
				if(!b.kinematic) b.netForce.add(Fn);
				//tangent force (shear friction)
				var Ft = Vt.copy();
				if(!Ft.zero) {
					Ft.magnitude = Math.max(-Ft.magnitude, OPTIONS.Friction * fn);
					this.applyForce(off, Ft);
				}
			}
		}
	}
	
	//update pos + angle and clear accels
	update(dt) {
		//
		if(this.kinematic) {
			//
			this.accel.multiply(dt);
			this.velocity.add(this.accel);
			//
			//this.velocity.multiply(0.995); //damping
			var v = this.velocity.copy();
			v.multiply(dt);
			this.position.add(v);
			//
			this.angularaccel *= dt;
			this.angularvelocity += this.angularaccel / 10;
			//this.angularvelocity *= (0.995); //damping
			this.angle += this.angularvelocity * dt;
		} else {
			this.netForce = new Point(0, 0);
			this.forces = [];
			this.velocity = new Point(0, 0);
			this.angularvelocity = 0;
		}
		this.accel.x = 0;
		this.accel.y = 0;
		this.angularaccel = 0;
	}
	
	render(ctx) {
		var color = "#ffffff";
		if(this.kinematic) {
			var e = this.getEnergy();
			color = getColor(e * OPTIONS.Heat); //the heat scaling just helps with visualization, found experimentally :)
		} else {
			var e = this.netForce.magnitude;
			color = getDummyColor(e * OPTIONS.DummyHeat);
		}
		for(var i = 0; i < this.particles.length; i++) {
			RenderHelper.drawPoint(ctx, this.getParticlePosition(i), color, null, 1);
		}
		//RenderHelper.drawPoint(ctx, this.position, color, null, 1);
		//draw orientation line
		//TODO better orientation symbol for 3-particle bodies
		if(this.kinematic && OPTIONS.Overline) {
			ctx.save();
			ctx.translate(this.position.x, this.position.y);
			ctx.rotate(this.angle);
			//
			ctx.lineWidth = 0.4;
			var o = Math.floor(OPTIONS.Opacity * 255).toString(16);
			if(o.length == 1) o = "0" + o;
		    ctx.strokeStyle = "#000000" + o;
			//
		    ctx.beginPath();
		    ctx.moveTo(this.particles[0].x, this.particles[0].y);
			for(var i = 1; i < this.particles.length; i++) {
				ctx.lineTo(this.particles[i].x, this.particles[i].y);
			}
			ctx.lineTo(this.particles[0].x, this.particles[0].y);
		    ctx.closePath();
		    ctx.stroke();
			ctx.restore();
		}
		//
		return e;
	}
}

class Tool {
	constructor(game) {
		this.game = game;
	}
	
	onClick(x, y, n, r) {
	}
	
	//also works for click+hold
	onDragBegin(p, n, r) {
	}
	onDrag(pBegin, pEnd, n, r, dt) {
	}
	onDragEnd(p, n, r) {
	}
}

class ToolSpawner extends Tool {
	constructor(game) {
		super(game);
		this.MaxSpin = 1;
		f.add(this, "MaxSpin", 0, 1);
		this.dtWait = 10;
	}
	
	onClick(x, y, n, r) {
		// for(var i = 0; i < n; i++) {
			// var b = new Body();
			// var offset = new Point(Math.random() * r, 0);
			// offset.rotate(Math.random() * 2 * Math.PI);
			// b.position = new Point(x, y);
			// b.position.add(offset);
			// b.angularvelocity = (Math.random() - 0.5) * this.MaxSpin;
			// this.game.particles.push(b);
		// }
	}
	
	onDragBegin(p, n, r) {
		for(var i = 0; i < n; i++) {
			var b = new Body();
			var offset = new Point(Math.random() * r, 0);
			offset.rotate(Math.random() * 2 * Math.PI);
			b.position = p.copy();
			b.position.add(offset);
			b.angularvelocity = (Math.random() - 0.5) * this.MaxSpin;
			this.game.particles.push(b);
		}
		this.dtWait = 10;
	}
	
	onDrag(pBegin, pEnd, n, r, dt) {
		this.dtWait -= dt;
		if(pEnd.distance(pBegin) > 1) this.dtWait = 0;
		if(this.dtWait > 0) return;
		//
		for(var i = 0; i < n; i++) {
			var b = new Body();
			var offset = new Point(Math.random() * r, 0);
			offset.rotate(Math.random() * 2 * Math.PI);
			//
			var blend = Math.random();
			var src = pBegin.copy();
			src.multiply(blend);
			var src2 = pEnd.copy();
			src2.multiply(1 - blend);
			src.add(src2);
			//
			b.position = src;
			b.position.add(offset);
			b.angularvelocity = (Math.random() - 0.5) * this.MaxSpin;
			if(Math.random() < dt * 0.05 * (pEnd.distance(pBegin) + 1)) this.game.particles.push(b);
		}
	}
}

class ToolSpinner extends Tool {
	constructor(game, f) {
		super(game);
		this.SpinRate = 0.01;
		f.add(this, "SpinRate", -0.2, 0.2);
	}
	
	onDragBegin(p, n, r) {
		var particle = this.game.grid.getClosestParticle(p, 2);
		if(particle && particle.position.distance(p) < RADIUS + r) this.dragging = particle;
	}
	onDrag(pBegin, pEnd, n, r, dt) {
		if(this.dragging) {
			this.dragging.angularvelocity += this.SpinRate;
		}
	}
	onDragEnd(p, n, r) {
		this.dragging = null;
	}
}

class ToolDragger extends Tool {
	constructor(game, f) {
		super(game);
		this.Strength = 1;
		f.add(this, "Strength", 0, 1);
	}
	
	onDragBegin(p, n, r) {
		var ps = this.game.grid.getParticlesWithin(p, r);
		this.dragging = [];
		for(let b of ps) {
			var o = b.position.copy();
			o.sub(p);
			this.dragging.push({particle: b, offset: o});
		}
	}
	onDrag(pBegin, pEnd, n, r, dt) {
		if(this.dragging) {
			for(var i = 0; i < this.dragging.length; i++) {
				var d = this.dragging[i];
				var particle = d.particle;
				var offset = d.offset;
				//target location
				var target = offset.copy();
				target.add(pEnd);
				if(OPTIONS.Speed && OPTIONS.Playing) {
					//movement
					var delta = target.copy();
					delta.sub(particle.position);
					delta.multiply(this.Strength);
					//pull fast
					if(delta.magnitude > 2) delta.magnitude = 2;
					delta.multiply(1 / OPTIONS.Speed);
					//account for gravity
					delta.add(new Point(0, -OPTIONS.Gravity * OPTIONS.Steps));
					//do some damping so they don't go crazy
					particle.velocity.multiply(0.99);
					//
					particle.applyForce(new Point(0, 0), delta);
				} else {
					particle.velocity = new Point(0, 0);
					particle.position = target;
				}
			}
		}
	}
	onDragEnd(p, n, r) {
		this.dragging = null;
	}
}

class ToolDelete extends Tool {
	constructor(game, f) {
		super(game);
	}
	
	onDrag(pBegin, pEnd, n, r, dt) {
		var particles = this.game.grid.getParticlesWithin(pEnd, r);
		for(let b of particles) {
			b.active = false;
		}
	}
}

/*
TODO
-runge-kutta integration
-better physics (no squishy particles...)
-polyspheres
-better tools ?
-C++ impl
*/
class SandGame extends Game {
  constructor() {
    super("sand");
	
	//physics area bounds
	this.w = OPTIONS.Width;
	this.h = OPTIONS.Height;
	this.sz = VOXEL_SIZE;
	
	this.particles = [];
	this.dummies = []; //dummy particles spaced out evenly along the edge of the world box
	this.grid = new Grid(this.sz);
	
	for(var i = 0; i < OPTIONS.Starticles; i++) {
		var b = new Body();
		b.position = new Point(RADIUS + Math.random() * (this.w - 2 * RADIUS), RADIUS + Math.random() * (this.h - 2 * RADIUS));
		b.angularvelocity = Math.random() * 0.5 - 0.25;
		this.particles.push(b);
	}
	
	//init dummy walls
	var nDummies =  this.w * 2 + (this.h * 2) + 3;
	for(var i = 0; i < nDummies; i++) {
		var b = new Body();
		b.kinematic = false;
		var x = 0;
		var y = 0;
		var j = i;
		if(j <= this.w) {
			//top wall
			x = j;
		} else if(j >= (this.w + this.h * 2 + 3)) {
			//bottom wall
			j -= this.w + this.h * 2 + 3;
			x = j;
			y = this.h;
		} else {
			j -= this.w + 1;
			//sides
			if(j >= this.h) {
				x = this.w;
				j -= this.h;
			}
			y = j;
		}
		b.position = new Point(x, y);
		b.angle = Math.random() * 2 * Math.PI;
		this.dummies.push(b);
	}
	this.dummySet = false;
	
	//create tools and gui

	f = DAT_GUI.addFolder("Tool");
	
	this.toolSpawner = new ToolSpawner(this);
	this.Spawner = function(){this.tool = this.toolSpawner}.bind(this);
	f.add(this, "Spawner");
	
	this.toolSpinner = new ToolSpinner(this, f);
	this.Spinner = function(){this.tool = this.toolSpinner}.bind(this);
	f.add(this, "Spinner");
	
	this.toolDragger = new ToolDragger(this, f);
	this.Dragger = function(){this.tool = this.toolDragger}.bind(this);
	f.add(this, "Dragger");
	
	this.toolDelete = new ToolDelete(this, f);
	this.Delete = function(){this.tool = this.toolDelete}.bind(this);
	f.add(this, "Delete");
	//
	this.toolSize = 1;
	this.tool = this.toolSpawner;
	this.dragging = false;
	
  }

  register(keys, mouse) {
    this.mouse = mouse;
    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", this.onClick.bind(this));
    this.LISTENER_MOUSE_MDOWN = mouse.addListener("mousedown", this.onMouseDown.bind(this));
    this.LISTENER_MOUSE_MUP = mouse.addListener("mouseup", this.onMouseUp.bind(this));
    this.LISTENER_MOUSE_WHEEL = mouse.addListener("wheel", this.onWheel.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
    mouse.removeListener(this.LISTENER_MOUSE_MDOWN);
    mouse.removeListener(this.LISTENER_MOUSE_MUP);
    mouse.removeListener(this.LISTENER_MOUSE_WHEEL);
  }
  
  onClick(evt) {
    var pos = this.mouse.getMousePos(evt);
	var x = (pos.x - this.center.x) / this.scale + this.w / 2;
	var y = (pos.y - this.center.y) / this.scale + this.h / 2;
	var n = this.toolSize;
	var r = 2 * Math.sqrt(n / Math.PI);
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
		var r = 2 * Math.sqrt(n / Math.PI);
		this.tool.onDragBegin(this.dragsrc, n, r);
  }
  
  onMouseUp(evt) {
	if(this.dragging) {
		var pos = this.mouse.getMousePos(evt);
		var x = (pos.x - this.center.x) / this.scale + this.w / 2;
		var y = (pos.y - this.center.y) / this.scale + this.h / 2;
		
		var n = this.toolSize;
		var r = 2 * Math.sqrt(n / Math.PI);
		this.tool.onDragEnd(new Point(x, y), n, r);
	}
	this.dragging = false;
  }
  
  onDrag(evt) {
	console.log(evt);
	var n = this.toolSize;
	var r = 2 * Math.sqrt(n / Math.PI);
	//
	this.tool.onClick(x, y, n, r);
  }
  
  onWheel(evt) {
	  var dir = Math.sign(evt.deltaY); //1 = down, -1 = up
	  this.toolSize = Math.max(1, this.toolSize - dir);
  }

  update(tickPart) {
	//reorganize dummy cells if size changes
	if(!this.dummySet || OPTIONS.Width != this.w || OPTIONS.Height != this.h) {
		this.w = OPTIONS.Width;
		this.h = OPTIONS.Height;
		//add/remove dummies to proper new amt
		var nDummies =  this.w * 2 + (this.h * 2) + 3;
		while(this.dummies.length > nDummies) {
			var b = this.dummies.pop();
			if(b.prevIndex) this.grid.at(b.prevIndex).delete(b);
		}
		while(this.dummies.length < nDummies) {
			var b = new Body();
			b.kinematic = false;
			b.angle = Math.random() * 2 * Math.PI;
			this.dummies.push(b);
		}
		//
		for(var i = 0; i < this.dummies.length; i++) {
			var b = this.dummies[i];
			//update
			b.update(0);
			//TODO: recalc edge position here
			var x = 0;
			var y = 0;
			var j = i;
			if(j <= this.w) {
				//top wall
				x = j;
			} else if(j >= (this.w + this.h * 2 + 3)) {
				//bottom wall
				j -= this.w + this.h * 2 + 3;
				x = j;
				y = this.h;
			} else {
				j -= this.w + 1;
				//sides
				if(j >= this.h) {
					x = this.w;
					j -= this.h;
				}
				y = j;
			}
			b.position = new Point(x, y);
			//
			var index = b.prevIndex;
			var index2 = this.grid.pos2index(b.position);
			//
			if(index) this.grid.at(index).delete(b);
			this.grid.at(index2).add(b);
			b.prevIndex = index2;
		}
		//
		this.dummySet = true;
	}
	
	tickPart *= OPTIONS.Speed;
	
	  if(this.dragging) {
		var pos = this.mouse.mouse;
		var x = (pos.x - this.center.x) / this.scale + this.w / 2;
		var y = (pos.y - this.center.y) / this.scale + this.h / 2;
		var dragdst = new Point(x, y);
		var n = this.toolSize;
		var r = 2 * Math.sqrt(n / Math.PI);
		this.tool.onDrag(this.dragsrc, dragdst, n, r, tickPart);
		this.dragsrc = dragdst;
	  }
	  
	
    if(!OPTIONS.Playing) return;
	
    if(tickPart > 1) tickPart = 1;
	
	for(var i = 0; i < this.dummies.length; i++) {
		var b = this.dummies[i];
		b.update(tickPart);
	}
	
	for(var step = 0; step < OPTIONS.Steps; step++) {
		//update forces, apply gravity / wall repulsion
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			b.forces = [];
			b.netForce = new Point(0, 0);
			b.collisions = [];
			var index = this.grid.pos2index(b.position);
			for(var dx = -1; dx <= 1; dx++) {
				for(var dy = -1; dy <= 1; dy++) {
					var index2 = {x: index.x + dx, y: index.y + dy};
					var neighbors = this.grid.at(index2);
					for(let b2 of neighbors) {
						if(b2 == b) continue;
						//possible collision
						if(b.position.distanceSquared(b2.position) < RADIUS2) {
							for(var k = 0; k < b2.getParticleCount(); k++) {
								b.collide_soft(b2.getParticlePosition(k), b2);
							}
						}
					}
				}
			}
			for(var offset of b.particles) {
				var offset2 = offset.copy();
				offset2.rotate(b.angle);
				b.applyForce(offset2, new Point(0, OPTIONS.Gravity));
			}
		}
		
		//clear grid for updating
		//TODO: optimized grid updates (only when particle actually moves to new cell)
		//this.grid.clear();
		
		//update velocities and positions
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			var index = b.prevIndex;
			//bounds
			var b1 = (b.position.x < 0);
			var b2 = (b.position.x > this.w);
			var b3 = (b.position.y < 0);
			var b4 = (b.position.y > this.h);
			if(b1 || b2 || b3 || b4) {
				b.velocity.multiply(0.95);
				if(b1) {
					b.position.x += this.w;
				}
				else if(b2) {
					b.position.x -= this.w;
				}
				if(b3) {
					b.position.y += this.h;
				}
				else if(b4) {
					b.position.y -= this.h;
				}
			}
			if(!b.active) {
				//out of bounds
				if(index) this.grid.at(index).delete(b);
				this.particles.splice(i, 1);
				i--;
			} else {
				//update
				b.update(tickPart / OPTIONS.Steps);
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
	  
	  if(OPTIONS.Grid) {
		  for(var x = 0; x < this.w / this.sz; x++) {
			  for(var y = 0; y < this.h / this.sz; y++) {
				  var n = this.grid.at({x: x, y: y}).size;
				  var c = (1 - 1/(n * OPTIONS.Glow + 1));
				  RenderHelper.drawRect(ctx, new Rectangle(x * this.sz, y * this.sz, this.sz, this.sz), color(c, c, c, 1), null);
			  }
		  }
	  }
	  
	  //draw area bounds
	  ctx.lineWidth = 0.1;
	  RenderHelper.drawRect(ctx, new Rectangle(0, 0, this.w, this.h), null, "#ffffff");
	  
	  for(var i = 0; i < this.dummies.length; i++) {
		var b = this.dummies[i];
		b.render(ctx);
	  }
	  
	  var kineticEnergy = 0;
	  var potentialEnergy = 0;
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
	  }
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		kineticEnergy += b.render(ctx);
		potentialEnergy += Math.abs(OPTIONS.Gravity) * (OPTIONS.Gravity > 0 ? ((this.h - 1) - b.position.y) : (b.position.y - 1)) / OPTIONS.Steps;
		if(OPTIONS.Forces) {
			ctx.lineWidth = 0.01;
			for(var j = 0; j < b.forces.length; j++) {
				var f = b.forces[j];
				var begin = f[0].copy();
				begin.add(b.position);
				var end = begin.copy();
				end.add(f[1]);
				RenderHelper.drawPoint(ctx, begin, "#ffffff", null, 0.02);
				RenderHelper.drawLine(ctx, begin, end, "#ffffff");
			}
		}
		if(OPTIONS.NetForce && b.netForce) {
			ctx.lineWidth = 0.02;
			var begin = b.position.copy();
			var end = begin.copy();
			end.add(b.netForce);
			RenderHelper.drawPoint(ctx, begin, "#ffffff", null, 0.03);
			RenderHelper.drawLine(ctx, begin, end, "#ffffff");
		}
	  }
	  
      var pos = this.mouse.mouse;
	  var x = (pos.x - this.center.x) / this.scale + this.w / 2;
	  var y = (pos.y - this.center.y) / this.scale + this.h / 2;
	  ctx.lineWidth = 0.05;
	  RenderHelper.drawPoint(ctx, new Point(x, y), null, "#ffffff", 2 * Math.sqrt(this.toolSize / Math.PI));
	  
	  ctx.restore();
	  
	  RenderHelper.drawText(ctx, "" + this.particles.length, "top", "left", 36, new Point(10, 10), "#ffffff", null);
	  RenderHelper.drawText(ctx, "" + kineticEnergy.toFixed(3) + " + " + potentialEnergy.toFixed(3) + " = " + (kineticEnergy + potentialEnergy).toFixed(3), "top", "left", 36, new Point(10, 50), "#ffffff", null);
  }
}

//use default options
var gameManager = new GameManager(new SandGame(), {});
gameManager.start();