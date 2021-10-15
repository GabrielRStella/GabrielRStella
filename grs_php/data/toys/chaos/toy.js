
function color(r, g, b, a) {
  return "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + "," + a + ")";
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

	var DAT_GUI = new dat.GUI();
	
	//options
	this.Vertices = 3;
    DAT_GUI.add(this, "Vertices", 1, 20, 1).onChange(this.Reset); //...
	this.Angle = 0.0;
	DAT_GUI.add(this, "Angle", 0.0, 1.0, 0.01).onChange(this.Reset); //rotate vertices by this portion of a turn (just rotating the shape)
	this.Jump = 0.5;
	DAT_GUI.add(this, "Jump", 0.0, 1.0).onChange(this.Reset); //how much the point moves towards the next point
	this.N = 100;
	DAT_GUI.add(this, "N", 1, 1000, 1); //how many points are iterated at a time
  }
  
  //
  Reset() {
    this.paint.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
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
	  return this.getVertices();
  }
  
  //randomly sample target points
  getNextTarget() {
	  return GameLib.randomSelect(this.getTargets());
  }
  
  getMaxDist() {
	  var verts = this.getVertices();
	  return verts[0].distance(verts[Math.floor(this.Vertices / 2)]);
  }
  
  //

  update(tickPart) {
    this.tick += tickPart;
	//
	
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
	
	// var verts = this.getTargets();
	// for(var i = 0; i < verts.length; i++) {
		// var pt = verts[i];
		// pt.magnitude = this.sz;
		// pt.add(this.center);
		// this.drawPoint(ctx, pt, "#808080", 5);
	// }
	var verts = this.getVertices();
	for(var i = 0; i < verts.length; i++) {
		var pt = verts[i];
		this.drawPoint(ctx, this.transform(pt), "#ffffff", 10);
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
		var d = o.distance(no) / this.getMaxDist();
		this.drawPoint(this.paint, this.transform(pt), color(Math.sqrt(d), 0, Math.sqrt(1-d), 1), 0.5);
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