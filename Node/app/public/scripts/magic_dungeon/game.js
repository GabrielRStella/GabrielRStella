/*
TODO:

splash screen?
physics
more traits
fancy element rendering
actual good textures
runes

*/

//general game handling...

var MS_PER_TICK = 10; //100 ticks per s
//var TICKS_PER_SEC = 1000 / MS_PER_TICK;

var PREV_TICK_MS = new Date().getTime();

var GAME_PAUSED = true;

var THE_GAME;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//window
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var CANVAS_ELEMENT = document.getElementById("gameCanvas");
var CANVAS = CANVAS_ELEMENT.getContext("2d");
var CANVAS_INSET = 5;
var EDGE_PADDING = 10;

var WIDTH = 0;
var HEIGHT = 0;

var KEY_OBJ = new Keys();
KEY_OBJ.register();

function RESET_CANVAS() {
  var oldWidth = WIDTH;
  var oldHeight = HEIGHT;

  CANVAS_ELEMENT.width = window.innerWidth - CANVAS_INSET * 2;
  CANVAS_ELEMENT.height = window.innerHeight - CANVAS_INSET * 2;

  WIDTH = CANVAS_ELEMENT.width - EDGE_PADDING * 2;
  HEIGHT = CANVAS_ELEMENT.height - EDGE_PADDING * 2;

  //rescale and transform and such?

  var wMod = WIDTH / oldWidth;
  var hMod = HEIGHT / oldHeight;
}

function RESET_GAME() {
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//this is called from draw() to be continuous
function UPDATE_TICK(part, paused) {
  THE_GAME.update(part, paused);
}

function RESTART_GAME() {
  THE_GAME.unregister(KEY_OBJ);
  THE_GAME = new Game();
  THE_GAME.register(KEY_OBJ);
  GAME_PAUSED = true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//drawing
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var prevWindowWidth = window.innerWidth;
var prevWindowHeight = window.innerHeight;

function UPDATE() {

  var ms = new Date().getTime();
  var part = (ms - PREV_TICK_MS) / MS_PER_TICK;

  //resize
  if(prevWindowWidth != window.innerWidth || prevWindowHeight != window.innerHeight) {
    prevWindowWidth = window.innerWidth;
    prevWindowHeight = window.innerHeight;
    RESET_CANVAS();
  }

  UPDATE_TICK(part, GAME_PAUSED);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //---
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  CANVAS.setTransform(1, 0, 0, 1, 0, 0);
  CANVAS.clearRect(0, 0, CANVAS_ELEMENT.width, CANVAS_ELEMENT.height);
  CANVAS.translate(EDGE_PADDING, EDGE_PADDING);

  //testing
  //CANVAS.drawImage(getImage("box"), 0, 0, WIDTH, HEIGHT);

  THE_GAME.draw(CANVAS, WIDTH, HEIGHT, GAME_PAUSED);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //---
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////


  PREV_TICK_MS = ms;

  requestAnimationFrame(UPDATE);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//start game
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var KEY_PAUSE = new Key(KEY_P, function() { GAME_PAUSED = !GAME_PAUSED; });
KEY_OBJ.addKeyListenerDown(KEY_PAUSE);
var KEY_RESTART = new Key(KEY_R, RESTART_GAME);
KEY_OBJ.addKeyListenerDown(KEY_RESTART);

THE_GAME = new Game();
THE_GAME.register(KEY_OBJ);

RESET_CANVAS();
RESET_GAME();
GAME_PAUSED = true;
UPDATE();