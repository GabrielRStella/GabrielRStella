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
	ColorHot: "#ff0000",
	ColorCold: "#0000ff",
	ColorHot_: hexToRgb("#ff0000"),
	ColorCold_: hexToRgb("#0000ff"),
	Heat: 30,
	kd: 0.9, //collision damping coefficient
	kr: 0.85, //restitution/rigidity coefficient
	alpha: 0.5, //normal force modulator (energy dissipation)
	beta: 1.5, //normal force modulator (rigidity)
	u: 0.5 //shear friction coefficient
};

DAT_GUI.addColor(OPTIONS, "ColorHot").onChange(function(){OPTIONS.ColorHot_ = hexToRgb(OPTIONS.ColorHot)});
DAT_GUI.addColor(OPTIONS, "ColorCold").onChange(function(){OPTIONS.ColorCold_ = hexToRgb(OPTIONS.ColorCold)});
DAT_GUI.add(OPTIONS, "Heat", 1, 100);
DAT_GUI.add(OPTIONS, "kd", -1, 2);
DAT_GUI.add(OPTIONS, "kr", -1, 2);
DAT_GUI.add(OPTIONS, "alpha", 0, 3);
DAT_GUI.add(OPTIONS, "beta", 0, 3);
DAT_GUI.add(OPTIONS, "u", -1, 1); //negative = rolly bois

function getColor(energy) {
  var d = 1 / (energy + 1);
  var d1 = 1-d;
  var c = {
	  r: OPTIONS.ColorHot_.r * d1 + OPTIONS.ColorCold_.r * d,
	  g: OPTIONS.ColorHot_.g * d1 + OPTIONS.ColorCold_.g * d,
	  b: OPTIONS.ColorHot_.b * d1 + OPTIONS.ColorCold_.b * d,
  };
  return color(c.r, c.g, c.b, 1);
}

//////

class Body {
	constructor() {
		this.position = new Point(0, 0);
		this.velocity = new Point(0, 0);
		this.accel = new Point(0, 0);
		this.angle = 0;
		this.angularvelocity = 0;
		this.angularaccel = 0;
	}
	
	getEnergy() {
		return this.velocity.magnitudeSquared + this.angularvelocity * this.angularvelocity;
	}
	
	//query velocity at a certain (world coords) point based on vel + angularvel&offset
	getVelocityAt(p) {
		var v = this.velocity.copy();
		var offset = p.copy();
		offset.sub(this.position);
		offset.rotate(Math.PI / 4);
		offset.multiply(this.angularvelocity);
		v.add(offset);
		return v;
	}

	//apply force (and torque) at offset
	//F is a Point (i.e. vector)
	applyForce(offset, F) {
		this.accel.add(F); //ignore mass multiplication lol
		var torque = offset.magnitude * F.magnitude * Math.sin(offset.angleBetween(F));
		this.angularaccel += torque;
	}
	
	//collide with a particle at a given (world coords) point
	//tests for collision (overlap) with each of its own constituent particles, then updates force/torque on self (not on other body)
	collide(p, b) {
		var offset = p.copy();
		offset.sub(this.position);
		//
		var dist = offset.magnitude;
		var overlap = Math.max(0, 2 - dist);
		if(overlap > 0) {
			//collision
			//midpoint (approx. collision point)
			var mp = p.copy();
			mp.add(this.position);
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
			var fn = -(OPTIONS.kd * Math.pow(overlap, OPTIONS.alpha) * doverlap + OPTIONS.kr * Math.pow(overlap, OPTIONS.beta));
			var Fn = N.copy();
			Fn.multiply(fn);
			//console.log(N, fn, overlap, doverlap, Fn);
			//
			var off = mp.copy();
			off.sub(this.position);
			this.applyForce(off, Fn);
			//tangent force (shear friction)
			var Ft = Vt.copy();
			if(!Ft.zero) {
				Ft.magnitude = OPTIONS.u * fn;
				this.applyForce(off, Ft);
			}
		}
	}
	
	//update pos + angle and clear accels
	update(dt) {
		//
		this.accel.multiply(dt);
		this.velocity.add(this.accel);
		this.accel.x = 0;
		this.accel.y = 0;
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
		this.angularaccel = 0;
	}
	
	render(ctx) {
		var color = getColor(this.getEnergy() * OPTIONS.Heat); //the scaling just helps with visualization, found experimentally :)
		RenderHelper.drawPoint(ctx, this.position, color, null, 1);
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.angle);
		ctx.lineWidth = 0.4;
		RenderHelper.drawLine(ctx, new Point(0, -0.8), new Point(0, 0.8), "#000000");
		//RenderHelper.drawPoint(ctx, new Point(0, 0.5), "#000000", null, 0.5);
		//RenderHelper.drawPoint(ctx, new Point(0, -0.5), "#000000", null, 0.5);
		ctx.restore();
	}
}

class SandGame extends Game {
  constructor() {
    super("sand");
	
	//physics area bounds
	this.w = 100;
	this.h = 100;
	
	this.particles = [];
	
	for(var i = 0; i < 300; i++) {
		var b = new Body();
		b.position = new Point(Math.random() * this.w, Math.random() * this.h);
		b.angularvelocity = Math.random() * 0.5 - 0.25;
		this.particles.push(b);
	}
  }

  register(keys, mouse) {
    this.mouse = mouse;
    this.LISTENER_MOUSE_CLICK = mouse.addListener("click", this.onClick.bind(this));
  }

  unregister(keys, mouse) {
    mouse.removeListener(this.LISTENER_MOUSE_CLICK);
  }
  
	  // ctx.translate(this.center.x, this.center.y);
	  // ctx.scale(this.scale, this.scale);
	  // ctx.translate(-this.w / 2, -this.h / 2);
  onClick(evt) {
    var pos = this.mouse.getMousePos(evt);
	var x = (pos.x - this.center.x) / this.scale + this.w / 2;
	var y = (pos.y - this.center.y) / this.scale + this.h / 2;
	//
	var b = new Body();
	b.position = new Point(x, y);
	b.angularvelocity = Math.random() * 1 - 0.5;
	this.particles.push(b);
  }

  update(tickPart) {
    if(this.Paused) return;
	
    if(tickPart > 1) tickPart = 1;
	
	var steps = 10;
	for(var step = 0; step < steps; step++) {
		//update forces, apply gravity / wall repulsion
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			for(var j = 0; j < this.particles.length; j++) {
				if(i == j) continue;
				var b2 = this.particles[j];
				//possible collision
				b.collide(b2.position, b2);
			}
			b.accel.y += 0.1; //TMP gravity value
		}
		
		//update velocities and positions
		for(var i = 0; i < this.particles.length; i++) {
			var b = this.particles[i];
			//bounds
			if(b.position.x < 0) b.velocity.x = (b.velocity.x + 0.1) * 0.95;
			if(b.position.x > this.w) b.velocity.x = (b.velocity.x - 0.1) * 0.75;
			if(b.position.y < 0) b.velocity.y = (b.velocity.y + 0.1) * 0.95;
			if(b.position.y > this.h) b.velocity.y = (b.velocity.y - 0.1) * 0.75;
			// if(b.position.x < RADIUS2 || b.position.x > (this.w - RADIUS2) || b.position.y < RADIUS2 || b.position.y > (this.h - RADIUS2)) {
				// for(var k = 0; k < this.dummy.getParticleCount(); k++) {
					// b.collide(this.dummy.getParticlePosition(k), this.dummy);
				// }
			// }
			//update
			b.update(tickPart / steps);
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
	  
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		b.render(ctx);
	  }
	  //this.dummy.render(ctx, "#ff0000");
	  
	  ctx.restore();
  }
}

//use default options
var gameManager = new GameManager(new SandGame(), {});
gameManager.start();