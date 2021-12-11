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
	//
	Speed: 1,
	Collisions: true,
};

var f = DAT_GUI.addFolder("World");

f.add(OPTIONS, "Width", 10, 100, 1);
f.add(OPTIONS, "Height", 10, 100, 1);
f.add(OPTIONS, "Gravity", 0, 1, 0.001);
f.add(OPTIONS, "Speed", 0, 1, 0.001);
f.add(OPTIONS, "Collisions");

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
		tmp = this.velocity.copy();
		tmp.multiply(-overlaptime);
		this.position.add(tmp);
		tmp = b.velocity.copy();
		tmp.multiply(-overlaptime);
		b.position.add(tmp);
		//swap velocities
		tmp = b.velocity;
		b.velocity = this.velocity;
		this.velocity = tmp;
		//move forward by however much we went back
		tmp = this.velocity.copy();
		tmp.multiply(overlaptime);
		this.position.add(tmp);
		tmp = b.velocity.copy();
		tmp.multiply(overlaptime);
		b.position.add(tmp);
		
		
		// if(overlap > 0) {
			// //change in overlap (normal velocity)
			// var doverlap = V.x * N.x + V.y * N.y;
			// //tangent velocity
			// var Vt = V.copy();
			// var tmp = N.copy();
			// tmp.multiply(doverlap);
			// Vt.sub(tmp);
			// //force parameters
			// //normal force
			// var fn = -(OPTIONS.kd * Math.pow(overlap, OPTIONS.alpha) * doverlap + OPTIONS.kr * Math.pow(overlap, OPTIONS.beta));
			// var Fn = N.copy();
			// Fn.multiply(fn);
			// //console.log(N, fn, overlap, doverlap, Fn);
			// //
			// var off = mp.copy();
			// off.sub(this.position);
			// //this.forces.push([off, v1]);
			// this.applyForce(off, Fn);
			// //tangent force (shear friction)
			// var Ft = Vt.copy();
			// if(!Ft.zero) {
				// Ft.magnitude = OPTIONS.u * fn;
				// this.applyForce(off, Ft);
			// }
		// }
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
		return 0;
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
	constructor(game) {
		super(game);
	}
	
	onClick(x, y) {
		var b = new Body();
		b.position = new Point(x, y);
		this.game.particles.push(b);
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
		if(this.dragging) {
			//drag particle towards pEnd, with upper bound on force magnitude
			var delta = pEnd.copy();
			delta.sub(this.dragging.position);
			if(delta.magnitude > 1) delta.magnitude = 1;
			this.dragging.applyForce(new Point(0, 0), delta);
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
	
	//create tools and gui

	var f = DAT_GUI.addFolder("Tool");
	
	this.toolDragger = new ToolDragger(this, f);
	this.Drag = function(){this.tool = this.toolDragger}.bind(this);
	f.add(this, "Drag");
	
	this.toolSpawner = new ToolSpawner(this);
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
	  var b = this.getClosestParticle(p);
	  if(b == null) return null;
	  return b.position.distance(p) < 1 ? b : null;
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
				for(var j = i + 1; j < this.particles.length; j++) {
					var b2 = this.particles[j];
					//possible collision
					if(b.position.distance(b2.position) < 2) {
						b.collide(b2.position, b2);
					}
				}
			}
			//if gravity enabled, add downwards force
			if(OPTIONS.Gravity > 0) b.applyForce(new Point(0, 0), new Point(0, OPTIONS.Gravity));
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
				//b.velocity.multiply(0.95);
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
	  RenderHelper.drawRect(ctx, new Rectangle(0, 0, this.w, this.h), null, "#ffffff");
	  
	  var totalEnergy = 0;
	  for(var i = 0; i < this.particles.length; i++) {
		var b = this.particles[i];
		totalEnergy += b.render(ctx);
	  }
	  
	  ctx.restore();
	  
	  RenderHelper.drawText(ctx, "" + this.particles.length, "top", "left", 36, new Point(10, 10), "#ffffff", null);
	  RenderHelper.drawText(ctx, "" + (Math.floor(totalEnergy * 1000) / 1000), "top", "left", 36, new Point(10, 50), "#ffffff", null);
  }
}

//use default options
var gameManager = new GameManager(new BallGame(), {});
gameManager.start();