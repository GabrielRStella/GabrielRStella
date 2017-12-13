//keyboard events and keys

var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SPACE = 32;
var KEY_P = 80;
var KEY_R = 82;
var KEY_C = 67;

class Key {
  constructor(keyCode, callBack) {
    this.keyCode = keyCode;
    this.callBack = callBack;
  }
}

class KeyDual {
  constructor(keyCode, callBackDown, callBackUp) {
    this.keyCode = keyCode;
    this.callBackDown = callBackDown;
    this.callBackUp = callBackUp;
  }
}

KEYS_DOWN = [];
KEYS_UP = [];
KEYS_PRESS = [];

KEYS_DUAL = [];

function addKeyListenerDown(key) {
  KEYS_DOWN.push(key);
}

function addKeyListenerUp(key) {
  KEYS_UP.push(key);
}

function addKeyListenerPress(key) {
  KEYS_PRESS.push(key);
}

function addKeyListenerDual(key) {
  KEYS_DUAL.push(key);
}

document.addEventListener("keydown", function(e) {
  var keyCode = e.keyCode;
  for(var i = 0; i < KEYS_DOWN.length; i++) {
    var key = KEYS_DOWN[i];
    if(key.keyCode == keyCode) key.callBack(e);
  }
  for(var i = 0; i < KEYS_DUAL.length; i++) {
    var key = KEYS_DUAL[i];
    if(key.keyCode == keyCode) key.callBackDown(e);
  }
}, false);

document.addEventListener("keyup", function(e) {
  var keyCode = e.keyCode;
  for(var i = 0; i < KEYS_UP.length; i++) {
    var key = KEYS_UP[i];
    if(key.keyCode == keyCode) key.callBack(e);
  }
  for(var i = 0; i < KEYS_DUAL.length; i++) {
    var key = KEYS_DUAL[i];
    if(key.keyCode == keyCode) key.callBackUp(e);
  }
}, false);

document.addEventListener("keypress", function(e) {
  var keyCode = e.keyCode;
  for(var i = 0; i < KEYS_PRESS.length; i++) {
    var key = KEYS_PRESS[i];
    if(key.keyCode == keyCode) key.callBack(e);
  }
}, false);