//https://stackoverflow.com/a/14521482

//array shuffle polyfill
Array.prototype.shuffle = Array.prototype.shuffle || function() {
  for(var i = 0; i < this.length; i++) {
    var j = Math.floor(Math.random() * arr.length);
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
};

Math.TAU = Math.TAU || (Math.PI * 2);

class Game {
  constructor(name) {
    this.name = name;
  }

  register(keys, mouse) {
  }

  unregister(keys, mouse) {
  }

  update(tickPart) {
  }

  //ctx = canvas 2d drawing context
  render(ctx, width, height) {
  }
}

//various generic utility stuff
var GameLib = {};

GameLib.loopRange = function(x, max) {
  if(x < 0) {
    x %= max;
    x += max;
  }
  return x % max;
}

GameLib.randomRange = function(min, max) {
  return min + Math.random() * (max - min);
}

GameLib.randomRangeFloor = function(min, max) {
  return Math.floor(this.randomRange(min, max));
}

GameLib.randomUnitPoint = function() {
  var p = new Point(1, 0);
  p.rotate(Math.random() * Math.PI * 2);
  return p;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//POINT/RECT
/////////////////////////////////////////////////////////////////////////////////////////////////

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
    var tmp = this[i];
    this[i] = undefined;
    return tmp;
  }
}

class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get magnitude() {
    var m = this.x * this.x + this.y * this.y;
    return Math.sqrt(m);
  }

  set magnitude(len) {
    var m = this.magnitude;
    if(m == 0) return;
    len /= m;
    this.x *= len;
    this.y *= len;
  }

  get zero() {
    return (this.x == 0) && (this.y == 0);
  }

  distanceSquared(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return m;
  }

  distance(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var m = dx * dx + dy * dy;
    return Math.sqrt(m);
  }

  multiply(d) {
    this.x *= d;
    this.y *= d;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(r) {
    var m = this.magnitude;
    this.x = Math.cos(r) * m;
    this.y = Math.sin(r) * m;
  }

  rotate(dr) {
    var cos = Math.cos(dr);
    var sin = Math.sin(dr);
    var xP = cos * this.x - sin * this.y;
    var yP = sin * this.x + cos * this.y;
    this.x = xP;
    this.y = yP;
  }

  angleTo(other) {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  apply(f) {
    this.x = f(this.x);
    this.y = f(this.y);
  }

  copy() {
    return new Point(this.x, this.y);
  }

}

class Rectangle {
  constructor(x, y, w, h) {
    this.point = new Point(x, y);
    this.width = w;
    this.height = h;
  }

  get center() {
    return new Point(this.point.x + (this.width / 2), this.point.y + (this.height / 2));
  }

  get minX() {
    return this.point.x;
  }

  get minY() {
    return this.point.y;
  }

  get maxX() {
    return this.point.x + this.width;
  }

  get maxY() {
    return this.point.y + this.height;
  }

  set center(p) {
    this.point = p.copy();
    this.point.x -= this.width / 2;
    this.point.y -= this.height / 2;
  }

  set minX(x) {
    this.point.x = x;
  }

  set minY(y) {
    this.point.y = y;
  }

  set maxX(x) {
    this.point.x = x - this.width;
  }

  set maxY(y) {
    this.point.y = y - this.height;
  }

  contains(p) {
    return (p.x >= this.minX) && (p.x <= this.maxX) && (p.y >= this.minY) && (p.y <= this.maxY);
  }

  distance(p) {
    var dx = Math.min(this.minX - p.x, 0, p.x - this.maxX);
    var dy = Math.min(this.minY - p.y, 0, p.y - this.maxY);
    return Math.sqrt(dx * dx + dy * dy);
  }

  //https://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
  //do the two rectangles intersect?
  intersects(r) {
    var c = this.center;
    var rc = r.center;
    var x = c.x;
    var y = c.y;
    var rx = rc.x;
    var ry = rc.y;
    return (Math.abs(x - rx) * 2 < (this.width + r.width))
      && (Math.abs(y - ry) * 2 < (this.height + r.height));
  }

  pushPoint(p) {
    if(p.x < this.point.x) {
      p.x = this.point.x;
    }
    if(p.x > this.point.x + this.width) {
      p.x = this.point.x + this.width;
    }
    if(p.y < this.point.y) {
      p.y = this.point.y;
    }
    if(p.y > this.point.y + this.height) {
      p.y = this.point.y + this.height;
    }
  }

  //push rectangle r out of this rectangle's bounds
  push(r) {
    var center = r.center;
    var w2 = r.width / 2;
    var h2 = r.height / 2;
    //first: check if it's inside and push it out
    if (this.intersects(r)) {
      //TODO: this jumps slightly when it touches a corner.
      //maybe I can make it smoother?
      var cx = this.point.x + this.width / 2;
      var cy = this.point.y + this.height / 2;
      var dist_inset_x = Math.min(center.x - this.point.x, (this.point.x + this.width) - center.x);
      var dist_inset_y = Math.min(center.y - this.point.y, (this.point.y + this.height) - center.y);
      if (dist_inset_x <= dist_inset_y) {
        //inset horizontally (or on corner)
        if (center.x < cx) {
          //left
          center.x = this.point.x - w2;
        }
        else {
          //right
          center.x = this.point.x + this.width + w2;
        }
      }
      if (dist_inset_y <= dist_inset_x) {
        //inset vertically (or on corner)
        if (center.y < cy) {
          //"bottom"
          center.y = this.point.y - h2;
        }
        else {
          //"top"
          center.y = this.point.y + this.height + h2;
        }
      }
    }
    //else: it's outside, grab it
    else {
      if (center.x < this.point.x - w2) {
        //left (outside)
        center.x = this.point.x - w2;
      }
      else if (center.x > this.point.x + this.width + w2) {
        //right (outside)
        center.x = this.point.x + this.width + w2;
      }
      if (center.y < this.point.y - h2) {
        //"bottom" (outside)
        center.y = this.point.y - h2;
      }
      else if (center.y > this.point.y + this.height + h2) {
        //"top" (outside)
        center.y = this.point.y + this.height + h2;
      }
    }
    r.center = center;
  }

  copy() {
    return new Rectangle(this.point.x, this.point.y, this.width, this.height);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//rectangle positioning (for gui systems)
/////////////////////////////////////////////////////////////////////////////////////////////////

//ordering, arranging, and scaling boxes relative to eachother
var RectanglePosition = {
  align: function(outer, inner, funcs, padding) {
    padding = padding || 0;
    for(var i = 0; i < funcs.length; i++) {
      funcs[i](outer, inner, padding);
    }
  },
  fit: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  },
  fit2: function(outer, inner) {
    var maxScale = Math.max(outer.width / inner.width, outer.height / inner.height);
    inner.width *= maxScale;
    inner.height *= maxScale;
  },
  center: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  centerX: function(outer, inner) {
    inner.minX = outer.minX + (outer.width - inner.width) / 2;
  },
  centerY: function(outer, inner) {
    inner.minY = outer.minY + (outer.height - inner.height) / 2;
  },
  left: function(outer, inner, padding) {
    inner.minX = outer.minX + padding;
  },
  right: function(outer, inner, padding) {
    inner.maxX = outer.maxX - padding;
  },
  top: function(outer, inner, padding) {
    inner.maxY = outer.maxY - padding;
  },
  bottom: function(outer, inner, padding) {
    inner.minY = outer.minY + padding;
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//IMAGES
/////////////////////////////////////////////////////////////////////////////////////////////////

class ImageStore {
  constructor(name, full) {
    if(full) {
      this.path = name;
    } else {
      this.path = "/data/toys/" + name + "/res/";
    }
    this.imgCache = {};
  }

  getImage(name) {
    if(imgCache[name]) {
      return imgCache[name];
    } else {
      loadImage(name);
      return imgCache[name];
    }
  }

  loadImage(name) {
    var img = new Image();
    img.src = this.path + name + ".png";
    imgCache[name] = img;
//todo - make sure it's loaded before returning (and have async version)
  }

  drawImage(img, canvas, r, flipped) {
    if(flipped) this.drawImageFlipped(img, canvas, r);
    else canvas.drawImage(this.getImage(img), r.minX, r.minY, r.width, r.height);
  }

  drawImageFlipped(img, canvas, r) {
    canvas.save();
    canvas.translate(r.minX, r.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(this.getImage(img), 0, 0, r.width, r.height);
    canvas.restore();
  }
}

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

class GameManager {

  /*
    all options:
    -canvasName = "gameCanvas"
    -imagePath = game.name
    -ticksPerSec = 20
  */

  constructor(game, options) {

    this.game = game;

    options = options || {};

    this.canvas = document.getElementById(options.canvasName || "gameCanvas");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ctx = this.canvas.getContext("2d");

    this.keys = new Keys();
    this.images = new ImageStore(options.imagePath || game.name);
    this.mouse = new MouseListener(this.canvas, 0);

    this.ticksPerSec = options.ticksPerSec || 20;
    this.msPerTick = 1000 / this.ticksPerSec;

    this.update = this.update.bind(this);
    this.running = false;



    game.gameManager = this;
  }

  start() {
    this.keys.register();
    this.mouse.register();
    this.game.register(this.keys, this.mouse);

    this.running = true;
    this.prevTickMs = new Date().getTime();

    requestAnimationFrame(this.update);
  }

  update() {
    if(!this.running) return;

    var ms = new Date().getTime();
    var part = (ms - this.prevTickMs) / this.msPerTick;

    //resize
    if(this.prevWindowWidth != window.innerWidth || this.prevWindowHeight != window.innerHeight) {
      this.prevWindowWidth = window.innerWidth;
      this.prevWindowHeight = window.innerHeight;

      //reset canvas
      var canvas = this.canvas;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 1; //?
      this.width = canvas.width;
      this.height = canvas.height;
    }

    //prepare for next screen
    var ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.game.update(part);
    this.game.render(ctx, this.width, this.height);

    this.prevTickMs = ms;

    requestAnimationFrame(this.update);
  }

  stop() {
    this.game.unregister(this.keys, this.mouse);
    this.keys.unregister();
    this.mouse.unregister();

    this.running = false;
  }
}

//basically the same as the Game interface
//but it serves a different purpose

class Gui {
  constructor() {
    
  }

  //when it first gets added on
  enter(guiManager) {}
  //final: is this gui coming off the stack, or is it just being covered
  exit(guiManager, final) {}

  register(keys, mouse) {}

  unregister(keys, mouse) {}

  update(tickPart) {}
  render(ctx, width, height) {}

  renderTitle(ctx, text) {
    ctx.font = '64px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.lineWidth = 2;

    ctx.fillText(text, 10, 10);
    ctx.strokeText(text, 10, 10);
  }
}

class GuiManager {
  constructor(game) {
    this.game = game;
    this.screens = [];
    this.screen = null;

    this.input = false;
  }

  push(gui) {
    if(this.screen) {
      this.screen.exit(this, false);
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
    }
    this.screens.push(gui);
    this.screen = gui;
    this.screen.enter(this);
    if(this.input) {
      this.screen.register(this.keys, this.mouse);
    }
  }

  pop() {
    if(this.screen) {
      this.screens.pop();
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      }
      this.screen.exit(this, true);
    }
    this.screen = this.screens.length > 0 ? this.screens[this.screens.length - 1] : null;
    if(this.screen) {
      this.screen.enter(this);
      if(this.input) {
        this.screen.register(this.keys, this.mouse);
      }
    }
  }

  popTo(gui) {
    while(this.screen != gui) {
      this.pop();
    }
  }

  popOff(gui) {
    this.popTo(gui);
    this.pop();
  }

  register(keys, mouse) {
    if(this.screen) {
      if(this.input) {
        this.screen.unregister(this.keys, this.mouse);
      } 
      this.screen.register(keys, mouse);
    }
    this.input = true;
    this.keys = keys;
    this.mouse = mouse;
  }

  unregister(keys, mouse) {
    if(this.input && this.screen) {
      this.screen.unregister(this.keys, this.mouse);
    }
    this.input = false;
  }

  update(tickPart) {
    if(this.screen) this.screen.update(tickPart);
  }

  render(ctx, width, height) {
    if(this.screen) this.screen.render(ctx, width, height);
  }
}