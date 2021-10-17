/*
//example code from wikipedia (using turtle graphics)
#https://en.wikipedia.org/wiki/Barnsley_fern#Python
import turtle
import random

pen = turtle.Turtle()
pen.speed(0)
pen.color("green")
pen.penup()

x = 0
y = 0
for n in range(11000):
    pen.goto(65 * x, 37 * y - 252)  # scale the fern to fit nicely inside the window
    pen.pendown()
    pen.dot(3)
    pen.penup()
    r = random.random()
    if r < 0.01:
        x, y =  0.00 * x + 0.00 * y,  0.00 * x + 0.16 * y + 0.00
    elif r < 0.86:
        x, y =  0.85 * x + 0.04 * y, -0.04 * x + 0.85 * y + 1.60
    elif r < 0.93:
        x, y =  0.20 * x - 0.26 * y,  0.23 * x + 0.22 * y + 1.60
    else:
        x, y = -0.15 * x + 0.28 * y,  0.26 * x + 0.24 * y + 0.44
*/


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

class FernGame extends Game {
  constructor() {
    super("fern");
	
    this.canvas = document.getElementById("gameCanvas");
	this.paintCanvas = document.getElementById("paintCanvas");
	this.paint = this.paintCanvas.getContext("2d");

    this.tick = 0;
	this.sz = 0; //min(width, height)
	this.points = [];
	this.colors = [];
	this.Reset = this.Reset.bind(this);
	this.updateColors = this.updateColors.bind(this);

	var DAT_GUI = new dat.GUI();
	
	//options
	
	DAT_GUI.add(this, "Reset");
	
	this.N = 100;
	DAT_GUI.add(this, "N", 1, 1000, 1).onChange(this.updateColors); //how many points are iterated at a time
	
	this.ColorA = "#004d04";
	this.ColorB = "#35b600";
	DAT_GUI.addColor(this, "ColorA").onChange(this.updateColors);
	DAT_GUI.addColor(this, "ColorB").onChange(this.updateColors);
	
	this.Radius = 0.3;
	DAT_GUI.add(this, "Radius", 0.2, 2);
	
	this.updateColors();
  }
  
  //
  Reset() {
    this.paint.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
  }
  
  updateColors() {
	  var c1 = hexToRgb(this.ColorA);
	  var c2 = hexToRgb(this.ColorB);
	  this.colors = [];
	  for(var i = 0; i < this.N; i++) {
		  var p = i / (this.N - 1);
		  var p1 = 1-p;
		  this.colors[i] = color(c1.r * p + c2.r * p1, c1.g * p + c2.g * p1, c1.b * p + c2.b * p1, 1);
	  }
  }
  
  /*
  
    r = random.random()
    if r < 0.01:
        x, y =  0.00 * x + 0.00 * y,  0.00 * x + 0.16 * y + 0.00
    elif r < 0.86:
        x, y =  0.85 * x + 0.04 * y, -0.04 * x + 0.85 * y + 1.60
    elif r < 0.93:
        x, y =  0.20 * x - 0.26 * y,  0.23 * x + 0.22 * y + 1.60
    else:
        x, y = -0.15 * x + 0.28 * y,  0.26 * x + 0.24 * y + 0.44
  */
  
  //randomly sample target points
  iterate(pt) {
	  var type = Math.random() * 100;
	  if(type < 1) {
		  return new Point(0.00 * pt.x + 0.00 * pt.y + 0.00, 0.00 * pt.x + 0.16 * pt.y + 0.00);
	  }
	  else if(type < 86) {
		  return new Point(0.85 * pt.x + 0.04 * pt.y + 0.00, -0.04 * pt.x + 0.85 * pt.y + 1.60);
	  }
	  else if(type < 93) {
		  return new Point(0.20 * pt.x - 0.26 * pt.y + 0.00, 0.23 * pt.x + 0.22 * pt.y + 1.60);
	  }
	  else {
		  return new Point(-0.15 * pt.x + 0.28 * pt.y + 0.00, 0.26 * pt.x + 0.24 * pt.y + 0.44);
	  }
	  return new Point(0, 0);
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
	this.sz = Math.min(this.canvas.width, this.canvas.height) - 20;
	this.base = new Point(this.canvas.width / 2, this.canvas.height - 2);
	this.transform_ = new Point(this.sz / 10, - this.sz / 10);
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
	pt.x *= this.transform_.x;
	pt.y *= this.transform_.y;
	pt.add(this.base);
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
	
	//update points
	while(this.points.length > this.N) {
		this.points.pop();
	}
	while(this.points.length < this.N) {
		this.points.push(new Point(0, 0));
	}
	
	for(var i = 0; i < this.points.length; i++) {
		var pt = this.points[i];
		var next = this.iterate(pt);
		this.drawPoint(this.paint, this.transform(pt), this.colors[i], this.Radius);
		this.points[i] = next;
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
var gameManager = new GameManager(new FernGame(), {});
gameManager.start();