//keyboard events and keys

var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var KEY_SPACE = 32;
var KEY_P = 80;
var KEY_P_PRESS = 112;
var KEY_R = 82;
var KEY_C = 67;

var KEY_0 = 48;
var KEY_1 = 49;

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

class Keys {
  constructor() {
    this.KEYS_DOWN = [];
    this.KEYS_UP = [];
    this.KEYS_PRESS = [];
    this.KEYS_DUAL = [];

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
    this.KEYS_DOWN.splice(key, 1);
  }

  removeKeyListenerUp(key) {
    this.KEYS_UP.splice(key, 1);
  }

  removeKeyListenerPress(key) {
    this.KEYS_PRESS.splice(key, 1);
  }

  removeKeyListenerDual(key) {
    this.KEYS_DUAL.splice(key, 1);
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
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(key.keyCode == keyCode) key.callBackDown(e);
    }
    this.keyStates[keyCode] = true;
  }

  eventKeyup(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_UP.length; i++) {
      var key = this.KEYS_UP[i];
      if(key.keyCode == keyCode) key.callBack(e);
    }
    for(var i = 0; i < this.KEYS_DUAL.length; i++) {
      var key = this.KEYS_DUAL[i];
      if(key.keyCode == keyCode) key.callBackUp(e);
    }
    this.keyStates[keyCode] = false;
  }

  eventKeypress(e) {
    var keyCode = e.keyCode;
    for(var i = 0; i < this.KEYS_PRESS.length; i++) {
      var key = this.KEYS_PRESS[i];
      if(key.keyCode == keyCode) key.callBack(e);
    }
  }

}