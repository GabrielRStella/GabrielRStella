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

  hasConnection(dir) {
    return this.connections[dir];
  }

  getConnection(dir) {
    if(!this.open[dir]) return null;
    if(this.connections[dir]) return this.connections[dir];
    return this.world.connect(this, dir);
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

  //used to dynamically replace all le blocks (eg. to randomize floor type)
  filter(func) {
    for(var i = 0; i < this.width; i++) {
      var arr = this.states[i];
      for(var j = 0; j < this.height; j++) {
        arr[j] = func(arr[j]) || arr[j];
      }
    }
  }

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
    while(difficulty > 0) {
      if(Math.random() < (1 / difficulty)) this.generateMonster(difficulty);
      difficulty--;
    }
    //TODO
  }

  generateMonster(difficulty) {
    var health = 5 + Math.floor(Math.random() * difficulty);
    var bounds = new Rectangle(
      this.getRandomPoint(),
      1, 1);
    var element = ELEMENT_LIGHTNING; //chooseElement();
    var damage = 1;
    var trait = new Trait([TRAIT_BASIC]);
    var monster = new Monster(this.world, this, difficulty, health, bounds, element, damage, trait);
    this.monsters.push(monster);
  }

  makeBoxes() {
    this.boxes = [];
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
  draw(canvas) {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        this.drawBlock(canvas, i, j);
      }
    }
    var f = function(x) { x.draw(canvas); };
    this.monsters.map(f);
    this.spells.map(f);
    this.spellParts.map(f);
  }

  drawBlock(canvas, x, y, rect) {
    rect = rect || new Rectangle(new Point(x, y), 1, 1);
    this.style.draw(canvas, rect, this.states[x][y]);
  }

  //---helpers

  fireSpell(srcEntity, element, damage, trait, direction) {
    this.spells.push(new Spell(this, srcEntity, element, damage, trait, direction));
  }

  fireSpellPart(sp) {
    this.spellParts.push(sp);
  }

  clearSpells() {
    this.spells = [];
    this.spellParts = [];
  }

  getRandomPoint() {
    return new Point(1 + Math.random() * (this.width - 2), 1 + Math.random() * (this.height - 2));
  }

  update(tickPart) {
    var g = function(x) {
      if(!x.active) return false;
      x.update(tickPart);
      return x.active;
    };
    this.monsters = this.monsters.filter(g);
    this.spells = this.spells.filter(g);
    this.spellParts = this.spellParts.filter(g);
  }
  
}