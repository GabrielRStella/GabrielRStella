//TODO: possibly re-implement dirty rendering

//helpers for gate locations
function ROOM_GATE_G(x, y) {
  return Math.floor(((x + 1) / 2) * (y - 1));
}
function ROOM_GATE_FUNC(p, w, h) {
  p = p.copy();
  p.x = ROOM_GATE_G(p.x, w);
  p.y = ROOM_GATE_G(p.y, h);
  return p;
}

class Room {
  constructor(width, height, style) {
    this.width = width || 32;
    this.height = height || 16;

    this.states = [];
    for(var i = 0; i < width; i++) {
      var arr = [];
      for(var j = 0; j < height; j++) {
        arr.push(STATE_EMPTY);
      }
      states.push(arr);
    }
    //bounding boxes of the wall blocks
    this.boxes = [];

    this.open = {};
    for(var i = 0; i < DIRS.length; i++) {
      this.open[DIRS[i]] = false;
    }
    this.connections = {};

    this.style = style || THE_STYLE;
    this.difficulty = -1;

    this.monsters = [];
    this.spells = [];
    this.spellParts = [];
  }

  isOpen(dir) {
    return this.open[dir];
  }

  getConnection(dir) {
    return this.connections[dir];
  }

  setConnection(dir, room) {
    this.connections[dir] = room;
  }

  getState(x, y) {
    if((x < 0) || (x >= this.width) || (x < 0) || (x >= this.height)) {
      return STATE_EMPTY;
    }
    return this.states[x][y];
  }

  setState(x, y, state) {
    if((x < 0) || (x >= this.width) || (x < 0) || (x >= this.height)) {
      return;
    }
    this.states[x][y] = state;
  }

  //---generators

  generateWalls() {
    for(var i = 0; i < this.width; i++) {
      var arr = this.states[i];
      for(var j = 0; j < this.height; j++) {
        if((i == 0) || (i == this.width - 1) || (j == 0) || (j == this.height - 1)) {
          arr[j] = STATE_WALL;
        }
      }
    }
  }

  generateDoors() {
    var midx = Math.floor(this.width / 2);
    var midy = Math.floor(this.height / 2);
    for(d in this.open) {
      if(this.open[d]) {
        var dir = DIRS[d];
        var src = ROOM_GATE_FUNC(dir, this.width, this.height);
        var dx = (dir.delta.x == 0) ? 1 : 0;
        var dy = (dir.delta.y == 0) ? 1 : 0;
        this.states[src.x][src.y] = STATE_EMPTY;
        this.states[src.x + dx][src.y + dy] = STATE_EMPTY;
      }
    }
  }

  generateObstacles() {
    //TODO
  }

  generateMonsters(difficulty) {
    this.difficulty = difficulty;
    //TODO
  }

  //---helpers

  fireSpell() {
  }

  clearSpells() {
    this.spells = [];
    this.spellParts = [];
  }

  draw() {
  }

  drawBlock(x, y) {
    
  }

  
  
}