var canvas = document.getElementById("the-canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

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
  ctx.clearRect(0, 0, width, height);

  draw();

  PREV_TICK_MS = ms;

  requestAnimationFrame(update);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

var positions = [];
var maxAge = 20;

function updateTick(part) {
  //logic...
  positions = positions.filter(function(e) {
    e.age -= part;
    e.size += part;
    return e.age > 0;
  });
  positions.push({
    x: mouse.x,
    y: mouse.y,
    age: maxAge,
    size: 0
  });
}

function draw() {
  //this is the 21st century, I shouldn't have to write my own for loops
  positions.forEach(drawElement);
}

function drawElement(e) {
  ctx.fillStyle = "#00000010";
  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
  ctx.fill();
  ctx.closePath();
}

//////////////////////////////////////////////////////////////////////////////////////////////////

update();