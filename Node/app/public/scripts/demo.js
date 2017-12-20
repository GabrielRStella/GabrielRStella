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

update();

//////////////////////////////////////////////////////////////////////////////////////////////////

function updateTick(part) {
  //logic...
console.log(part);
}

function draw() {
  //...
}