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
  constructor(world, width, height, style) {
    width = width || 24;
    height = height || 24;
    style = style || THE_STYLE;

    this.world = world;
    this.width = width;
    this.height = height;
    this.style = style;
    this.difficulty = -1;

    this.states = [];
    for(var i = 0; i < width; i++) {
      var arr = [];
      for(var j = 0; j < height; j++) {
        arr.push(STATE_EMPTY);
      }
      this.states.push(arr);
    }
    //bounding boxes of the wall blocks
    this.boxes = [];

    this.open = {};
    for(var i = 0; i < DIRS.length; i++) {
      this.open[DIRS[i]] = false;
    }
    this.connections = {};

    this.monsters = [];
    this.spells = [];
    this.spellParts = [];
  }

  isOpen(dir) {
    return this.open[dir];
  }

  setOpen(dir, open) {
    this.open[dir] = open;
  }

  setOpenAll() {
    for(var i = 0; i < DIRS.length; i++) {
      this.open[DIRS[i]] = true;
    }
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
    for(var d in this.open) {
      if(this.open[d]) {
        var dir = DIRS[d];
        var src = ROOM_GATE_FUNC(dir.delta, this.width, this.height);
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

  makeBoxes(bounds) {
    this.boxes = [];
    var width = bounds.width / this.width;
    var height = bounds.height / this.height;
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        if(!this.states[i][j].walkable) {
          this.boxes.push(new Rectangle(new Point(i, j), 1, 1));
        }
      }
    }
  }

  //draw

  //bounds = the rectangle in which to draw the room
  draw(canvas, bounds) {
    var width = bounds.width / this.width;
    var height = bounds.height / this.height;
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        var x = bounds.minX + width * i;
        var y = bounds.minY + height * j;
        this.drawBlock(canvas, i, j, new Rectangle(new Point(x, y), width, height));
      }
    }
  }

  drawBlock(canvas, x, y, rect) {
    this.style.draw(canvas, rect, this.states[x][y]);
  }

  //---helpers

  fireSpell() {
  }

  clearSpells() {
    this.spells = [];
    this.spellParts = [];
  }
  
}