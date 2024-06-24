/////////////////////////////////////////////////////////////////////////////////////////////////
//MOUSE
/////////////////////////////////////////////////////////////////////////////////////////////////

class MouseListener {
  constructor(canvas, edgePadding) {
    this.canvas = canvas;
    this.edgePadding = edgePadding;
    this.mouse = new Point(0, 0);

    this.listeners = new FakeArray();

    this.eventListenerMove = function(evt) {
      this.mouse = this.getMousePos(evt);
    }.bind(this);
  }

  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return new Point(evt.clientX - rect.left - this.edgePadding, evt.clientY - rect.top - this.edgePadding);
  }

  register() {
    this.canvas.addEventListener('mousemove', this.eventListenerMove, false);
  }

  unregister() {
    this.canvas.removeEventListener('mousemove', this.eventListenerMove);
  }

  addListener(event, listener) {
    var entry = {event: event, listener: listener};
    this.canvas.addEventListener(event, listener, false);
    return this.listeners.push(entry) - 1;
  }

  removeListener(listenerId) {
    var entry = this.listeners.remove(listenerId);
    this.canvas.removeEventListener(entry.event, entry.listener);
  }
  
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//KEYS
/////////////////////////////////////////////////////////////////////////////////////////////////

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_SPACE = 32;
var KEY_P = 80;
var KEY_P_PRESS = 112;
var KEY_R = 82;
var KEY_C = 67;
var KEY_M = 77;
var KEY_Q = 81;
var KEY_E = 69;

var KEY_0 = 48;
var KEY_1 = 49;

var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;

//example: key_a = getKeyCode('a');
//how does this work with capital letters? hm...
function getKeyCode(keyChar) {
  return keyChar.toUpperCase().charCodeAt(0);
}

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

class FakeArray {
  constructor() {
    this.length = 0;
  }

  push(t) {
    this[this.length] = t;
    this.length++;
    return this.length;
  }

  remove(i) {
    this[i] = undefined;
  }
}

class Keys {
  constructor() {
    this.KEYS_DOWN = new FakeArray();
    this.KEYS_UP = new FakeArray();
    this.KEYS_PRESS = new FakeArray();
    this.KEYS_DUAL = new FakeArray();

    this.eventKeydownB = this.eventKeydown.bind(this);
    this.eventKeyupB = this.eventKeyup.bind(this);
    this.eventKeypressB = this.eventKeypress.bind(this);

    this.keyStates = {};
  }

  checkKey(key) {
    return this.keyStates[getKeyCode(key)];
  }

  checkKeyCode(key) {
    return this.keyStates[key];
  }

  addKeyListenerDown(key) {
    return this.KEYS_DOWN.push(key) - 1;
  }

  addKeyListenerUp(key) {
    return this.KEYS_UP.push(key) - 1;
  }

  addKeyListenerPress(key) {
    return this.KEYS_PRESS.push(key) - 1;
  }

  addKeyListenerDual(key) {
    return this.KEYS_DUAL.push(key) - 1;
  }

  removeKeyListenerDown(key) {
    this.KEYS_DOWN.remove(key);
  }

  removeKeyListenerUp(key) {
    this.KEYS_UP.remove(key);
  }

  removeKeyListenerPress(key) {
    this.KEYS_PRESS.remove(key);
  }

  removeKeyListenerDual(key) {
    this.KEYS_DUAL.remove(key);
  }

  register() {
    document.addEventListener("keydown", this.eventKeydownB, false);
    document.addEventListener("keyup", this.eventKeyupB, false);
    document.addEventListener("keypress", this.eventKeypressB, false);
  }

  unregister() {
    document.removeEventListener("keydown", this.eventKeydownB);
    document.removeEventListener("keyup", this.eventKeyupB);
    document.removeEventListener("keypress", this.eventKeypressB);
  }

  eventKeydown(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_DOWN.length; i++) {
      var key = this.KEYS_DOWN[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBackDown(e);
    }
    this.keyStates[keyCode] = true;
  }

  eventKeyup(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_UP.length; i++) {
      var key = this.KEYS_UP[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBackUp(e);
    }
    this.keyStates[keyCode] = false;
  }

  eventKeypress(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_PRESS.length; i++) {
      var key = this.KEYS_PRESS[i];
      if(!key) continue;
      if(key.keyCode == keyCode) key.callBack(e);
    }
  }

}