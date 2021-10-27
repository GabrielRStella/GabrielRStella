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

var DIST = 1 / Math.cos(Math.PI / 6); //distance of circle from the origin when in a triangular equilateral arrangement
var RADIUS = 1 + DIST; //"radius" of a grain (max dist from origin to far side of a member particle)
var RADIUS2 = RADIUS * RADIUS;
//a rigid collection of circular particles
//all particles are assumed to be radius 1
class Body {
	constructor() {
		this.particles = []; //list of member particle offsets
		this.position = new Point(0, 0);
		this.velocity = new Point(0, 0);
		this.accel = new Point(0, 0);
		this.angle = 0;
		this.angularvelocity = 0;
		this.angularaccel = 0;
	}
	
	createTriangularParticles() {
	  var p = new Point(0, DIST);
	  this.particles.push(p.copy());
	  p.rotate(Math.PI * 2 / 3); //rotate 120 degrees
	  this.particles.push(p.copy());
	  p.rotate(Math.PI * 2 / 3); //another 120 degrees
	  this.particles.push(p.copy());
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
	
	//collide with a particle at a given (world coords) point
	//tests for collision (overlap) with each of its own constituent particles, then updates force/torque on self (not on other body)
	collide(p) {
		for(var i = 0; i < this.particles.length; i++) {
			var selfp = this.getParticlePosition(i);
			var dist = p.distance(selfp);
			var overlap = Math.max(0, 2 - dist);
			if(overlap > 0) {
				//collision
				var N = p.copy();
				N.sub(selfp);
				N.magnitude = 1;
				var V = 0;
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
		var v = this.velocity.copy();
		v.multiply(dt);
		this.position.add(v);
		//
		this.angularaccel *= dt;
		this.angularvelocity += this.angularaccel;
		this.angle += this.angularvelocity * dt;
		this.angularaccel = 0;
	}
	
	render(ctx, color) {
		for(var i = 0; i < this.particles.length; i++) {
			RenderHelper.drawPoint(ctx, this.getParticlePosition(i), color, null, 1);
		}
	}
}

class SandGame extends Game {
  constructor() {
    super("sand");
	
	//physics area bounds
	this.w = 100;
	this.h = 100;
	
	this.particles = [];
	
	for(var i = 0; i < 30; i++) {
		var b = new Body();
		b.createTriangularParticles();
		b.position = new Point(Math.random() * this.w, Math.random() * this.h);
		b.angularvelocity = Math.random() * 0.5 - 0.25;
		this.particles.push(b);
	}
    
	var DAT_GUI = new dat.GUI();
  }

  update(tickPart) {
    if(this.Paused) return;
	
    
    //update forces, apply gravity / wall repulsion
	for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		for(var j = 0; j < this.particles.length; j++) {
			if(i == j) continue;
			var b2 = this.particles[j];
			//possible collision
			if(b.position.distanceSquared(b2.position) < RADIUS2) {
				for(var k = 0; k < b2.getParticleCount(); k++) {
					b.collide(b2.getParticlePosition(k));
				}
			}
		}
		b.accel.y += 0.1; //TMP gravity value
	}
	
	//update velocities and positions
	for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		//bounds
		if(b.position.x < 0) b.velocity.x += (0.1);
		if(b.position.x > this.w) b.velocity.x += (-0.1);
		if(b.position.y < 0) b.velocity.y += (0.1);
		if(b.position.y > this.h) b.velocity.y += (-0.1);
		//update
		b.update(tickPart);
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
	  
	  var fill = "#000000";
	  var stroke = "#ffffff";
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		b.render(ctx, stroke);
	  }
	  
	  ctx.restore();
  }
}

//use default options
var gameManager = new GameManager(new SandGame(), {});
gameManager.start();