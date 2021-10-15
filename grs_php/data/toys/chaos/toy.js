
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

class ChaosGame extends Game {
  constructor() {
    super("chaos");
	
    this.canvas = document.getElementById("gameCanvas");
	this.paintCanvas = document.getElementById("paintCanvas");
	this.paint = this.paintCanvas.getContext("2d");

    this.tick = 0;
	this.sz = 0; //min(width, height)
	this.center = new Point(0, 0);
	this.points = [];
	this.Reset = this.Reset.bind(this);
	this.Reset2 = this.Reset2.bind(this);

	var DAT_GUI = new dat.GUI();
	
	//options
	
	
	var fShape = DAT_GUI.addFolder("Shape");
	
	this.Vertices = 3;
    fShape.add(this, "Vertices", 1, 20, 1).onChange(this.Reset2); //...
	this.Jump = 0.5;
	this.guiKeyJump = fShape.add(this, "Jump", 0.0, 1.0).onChange(this.Reset); //how much the point moves towards the next point
	this.UpdateJump = true;
	fShape.add(this, "UpdateJump");
	this.SetJump = this.SetJump.bind(this);
	fShape.add(this, "SetJump");
	this.N = 100;
	fShape.add(this, "N", 1, 1000, 1); //how many points are iterated at a time
	this.Angle = 0.0;
	fShape.add(this, "Angle", 0.0, 1.0, 0.01).onChange(this.Reset); //rotate vertices by this portion of a turn (just rotating the shape)
	
	var fRender = DAT_GUI.addFolder("Rendering");
	
	fRender.add(this, "Reset");
	this.RenderVertices = true;
	fRender.add(this, "RenderVertices");
	this.RenderTargets = true;
	fRender.add(this, "RenderTargets");
	this.ColorNear = "#0000ff";
	this.ColorFar = "#ff0000";
	fRender.addColor(this, "ColorNear");
	fRender.addColor(this, "ColorFar");
	this.Radius = 0.3;
	fRender.add(this, "Radius", 0.2, 1);
	
	var fTargets = DAT_GUI.addFolder("Targets");
	
	//targets are a weighted sum of vertices
	this.Combinations = 1;
	fTargets.add(this, "Combinations", 1, 3, 1).onChange(this.Reset);
	this.CombinationWeight1 = 1;
	this.CombinationWeight2 = 1;
	this.CombinationWeight3 = 1;
	fTargets.add(this, "CombinationWeight1", 0, 1).onChange(this.Reset); //TODO reset2, if i can figure out the more complex jump function
	fTargets.add(this, "CombinationWeight2", 0, 1).onChange(this.Reset);
	fTargets.add(this, "CombinationWeight3", 0, 1).onChange(this.Reset);
	//TODO: make it so the user can enable/disable relative vertex choice (e.g., "once you picked one vertex, the next step you have to pick one that isnt adjacent")
	//TODO: flag to restrict combinations to only adjacent neighbors within a certain distance (so you can have e.g. just edge interpolation)
  }
  
  //
  Reset() {
    this.paint.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
  }
  Reset2() {
	  this.Reset();
	  if(this.UpdateJump) this.SetJump(true);
  }
  
  
    // public static double getAlpha(int sides) {
        // int k = (sides - 1) / 4;
        // double angle = 360.0 / sides;
        // double c = 0;
        // for(int i = 1; i <= k; i++) {
            // c += Math.cos(Math.toRadians(angle * i));
        // }
        // double denom = 2.0 * (1.0 + c);
        // return 1 - (1.0 / denom);
    // }
  
  SetJump(noReset) {
	  var k = Math.floor((this.Vertices - 1) / 4);
	  var angle = (Math.PI * 2) / this.Vertices;
	  var c = 0;
	  for(var i = 1; i <= k; i++) {
		  c += Math.cos(angle * i);
	  }
	  var denom = 2 * (1 + c);
	  this.Jump = 1 - (1 / denom);
	  this.guiKeyJump.updateDisplay();
	  if(!noReset) this.Reset();
  }
  
  //vertices of the polygon
  getVertices() {
	  var verts = [];
	  for(var i = 0; i < this.Vertices; i++) {
		  var pt = new Point(1, 0);
		  pt.angle = (Math.PI * 2) * ((i + this.Angle) / this.Vertices - 0.25);
		  verts.push(pt);
	  }
	  return verts;
  }
  
  //target points for iteration (in this version of the program, it's just the vertices; later will be combinations)
  getTargets() {
	  //TODO: cache this stuff
	  var n = Math.pow(this.Vertices, this.Combinations);
	  var vertices = this.getVertices();
	  var targets = [];
	  for(var i = 0; i < n; i++) {
		  var j = i;
		  var x = j % this.Vertices;
		  j = (j - x) / this.Vertices;
		  var y = j % this.Vertices;
		  j = (j - y) / this.Vertices;
		  var z = j % this.Vertices;
		  //
		  var totalWeight = this.CombinationWeight1;
		  var p = new Point(0, 0);
		  //
		  var p1 = vertices[x].copy();
		  p1.multiply(this.CombinationWeight1);
		  p.x += p1.x; p.y += p1.y;
		  if(this.Combinations > 1) {
			  var p2 = vertices[y].copy();
			  p2.multiply(this.CombinationWeight2);
			  p.x += p2.x; p.y += p2.y; totalWeight += this.CombinationWeight2;
			  if(this.Combinations > 2) {
				  var p3 = vertices[z].copy();
				  p3.multiply(this.CombinationWeight3);
				  p.x += p3.x; p.y += p3.y; totalWeight += this.CombinationWeight3;
			  }
		  }
		  //
		  p.multiply(1 / totalWeight);
		  targets.push(p);
	  }
	  return targets;
  }
  
  //randomly sample target points
  getNextTarget() {
	  return GameLib.randomSelect(this.getTargets());
  }
  
  getMaxDist() {
	  var verts = this.getVertices();
	  return verts[0].distance(verts[Math.floor(this.Vertices / 2)]);
  }
  
  getColor(dist) {
	  var d = dist / this.getMaxDist();
	  var d1 = 1-d;
	  var c = {
		  r: this.colorNear.r * d1 + this.colorFar.r * d,
		  g: this.colorNear.g * d1 + this.colorFar.g * d,
		  b: this.colorNear.b * d1 + this.colorFar.b * d,
	  };
	  return color(c.r, c.g, c.b, 1);
  }
  
  //

  update(tickPart) {
    this.tick += tickPart;
	//
	this.colorNear = hexToRgb(this.ColorNear);
	this.colorFar = hexToRgb(this.ColorFar);
	
	if(this.paintCanvas.width != this.canvas.width || this.paintCanvas.height != this.canvas.height) {
		this.paintCanvas.width = this.canvas.width;
		this.paintCanvas.height = this.canvas.height;
	}
	//
	this.sz = Math.min(this.canvas.width, this.canvas.height) / 2 - 20;
	this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
  }

  drawPoint(ctx, p, color, radius) {
    if(color) ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius || 2, 0, Math.TAU);
    ctx.fill();
    ctx.closePath();
  }
  
  transform(pt) {
	pt = pt.copy();
	pt.magnitude = pt.magnitude * this.sz;
	pt.add(this.center);
	return pt;
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
    //draw a border
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.lineWidth = 2; //since this line is on the border, only 1px actually gets drawn
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
	
	if(this.RenderTargets) {
		var verts = this.getTargets();
		for(var i = 0; i < verts.length; i++) {
			var pt = verts[i];
			this.drawPoint(ctx, this.transform(pt), "#808080", 5);
		}
	}
	if(this.RenderVertices) {
		var verts = this.getVertices();
		for(var i = 0; i < verts.length; i++) {
			var pt = verts[i];
			this.drawPoint(ctx, this.transform(pt), "#ffffff", 10);
		}
	}
	
	//update points
	while(this.points.length > this.N) {
		this.points.pop();
	}
	while(this.points.length < this.N) {
		this.points.push(this.getNextTarget());
	}
	
	for(var i = 0; i < this.points.length; i++) {
		var pt = this.points[i];
		var o = pt.copy();
		var next = this.getNextTarget();
		var no = next.copy();
		pt.multiply(1 - this.Jump);
		next.multiply(this.Jump);
		pt.add(next);
		this.drawPoint(this.paint, this.transform(pt), this.getColor(o.distance(no)), this.Radius);
		this.points[i] = pt;
	}
  }
}

var paintCanvas = document.createElement("canvas");
paintCanvas.setAttribute("id", "paintCanvas");
paintCanvas.setAttribute("z-index", "-1");
paintCanvas.setAttribute("style", "background: rgba(0, 0, 0, 0); position: absolute; left: 0; top: 0;");
document.getElementById("gameCanvas").setAttribute("z-index", "0");
document.getElementById("gameCanvas").after(paintCanvas);

//use default options
var gameManager = new GameManager(new ChaosGame(), {});
gameManager.start();