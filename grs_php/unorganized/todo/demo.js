var canvas = document.getElementById("the-canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width = 200;
var height = canvas.height = 200;

var MS_PER_TICK = 10; //100 ticks per s
var PREV_TICK_MS = new Date().getTime();

//http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
var mouse = {x: width / 2, y: height / 2}
canvas.addEventListener('mousemove', function(evt) {
  var rect = canvas.getBoundingClientRect();
  mouse = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}, false);


function update() {

  var ms = new Date().getTime();
  var part = (ms - PREV_TICK_MS) / MS_PER_TICK;

  updateTick(part);

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.closePath();

  var edge = 2;
  ctx.clearRect(edge, edge, width - edge * 2, height - edge * 2);

  ctx.save();
  ctx.beginPath();
  ctx.rect(edge, edge, width - edge * 2, height - edge * 2);
  ctx.clip();
  draw();
  ctx.restore();

  PREV_TICK_MS = ms;

  requestAnimationFrame(update);
}

function weighted(a, b, weight) {
  weight = weight || 1; //default = equal weight
  return (a * weight + b) / (weight + 1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

var positions = [];
var maxAge = 50;

var pos = mouse;
var vel = {x: 0, y: 0};
var speed = 1.8;
var edge = 4;

var prevMouse = null;

function updateTick(part) {
  //logic...
  positions = positions.filter(function(e) {
    e.age -= part;
    e.size += part;
    return e.age > 0;
  });

  if(mouse == prevMouse) {
    //mouse isn't moving, do physics
    if(pos.x < edge) {
      vel = {
        x: Math.abs(vel.x),
        y: vel.y
      };
    } else if(pos.x > width - edge) {
      vel = {
        x: -Math.abs(vel.x),
        y: vel.y
      };
    } else if(pos.y < edge) {
      vel = {
        x: vel.x,
        y: Math.abs(vel.y)
      };
    } else if(pos.y > height - edge) {
      vel = {
        x: vel.x,
        y: -Math.abs(vel.y)
      };
    }
  } else {
    var dx = mouse.x - pos.x;
    var dy = mouse.y - pos.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var mult = 0;
    if(dist) mult = speed / dist; //set magnitude
    vel = {x: dx * mult, y: dy * mult};
  }
  prevMouse = mouse;

  pos.x += vel.x;
  pos.y += vel.y;

  positions.push({
    x: pos.x,
    y: pos.y,
    age: maxAge,
    size: 0
  });
}

function draw() {
  //this is the 21st century, I shouldn't have to write my own for loops
  positions.forEach(drawElement);
}

function drawElement(e) {
  ctx.fillStyle = "rgba(" + Math.round((e.x / width) * 255) + ", 0, " + Math.round((e.y / height) * 255) + ", 0.1)";
  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
  ctx.fill();
  ctx.closePath();
}

//////////////////////////////////////////////////////////////////////////////////////////////////

update();