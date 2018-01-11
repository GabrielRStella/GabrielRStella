//https://stackoverflow.com/a/14521482

//file order:
/*
    "utilities.js",
    "images.js",
    "keys.js",
    "io.js",
    "gui.js",
    "screens.js",
    "class_element.js",
    "spells.js",
    "class_trait.js",
    "ai.js",
    "class_monster.js",
    "class_player.js",
    "class_state.js",
    "class_style.js",
    "class_room.js",
    "class_world.js",
    "class_game.js",
    "game.js"
    ],
*/

var GAME_LIB = {};

GAME_LIB.loop = function(x, max) {
  if(x < 0) {
    x %= max;
    x += max;
  }
  return x % max;
}

GAME_LIB.shuffle = function(arr) {
  for(var i = 0; i < arr.length; i++) {
    var j = Math.floor(Math.random() * arr.length);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

GAME_LIB.randomRange = function(min, max) {
  return min + Math.random() * (max - min);
}

GAME_LIB.randomRangeFloor = function(min, max) {
  return Math.floor(randomRange(min, max));
}

GAME_LIB.randomUnitPoint = function() {
  var p = new Point(1, 0);
  p.rotate(Math.random() * Math.PI * 2);
  return p;
}