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
  constructor(world, id, width, height, style) {
    width = width || 24;
    height = height || 24;
    style = style || THE_STYLE;

    this.world = world;
    this.id = id;
    this.name = id + 1;
    this.width = width;
    this.height = height;
    this.style = style;
    this.difficulty = -1;
    this.canHaveBoss = true;

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

    if(Math.random() < 0.13) {
      this.generateMaze();
      this.canHaveBoss = false;
    } else if(Math.random() < 0.2) {
      //random stuff...
      var minX = 1;
      var minY = 1;
      var maxX = this.width - 1;
      var maxY = this.height - 1;
      for(var i = minX; i < maxX; i++) {
        var arr = this.states[i];
        for(var j = minY; j < maxY; j++) {
          if(Math.random() < 0.01) {
            arr[j] = STATE_WALL_BROKEN;
          }
        }
      }
    } else if(Math.random() < 0.1) {
      //structures

      while(Math.random() < 0.7) {
        var x = Math.floor(randomRange(minX, maxX));
        var y = Math.floor(randomRange(minY, maxY));
      }
    } else {
      //empty
    }
  }

  generateMaze() {
    var minX = 0;
    var minY = 0;
    var maxX = this.width;
    var maxY = this.height;
    var convert = function(p) {
      return p.x + p.y * this.width;
    }.bind(this);
    var convert2 = function(x) {
      return new Point(x % this.width, Math.floor(x / this.width));
    }.bind(this);

    //make it a maze
    //using a "randomized kruskal's algorithm" from wikipedia
    //https://en.wikipedia.org/wiki/Maze_generation_algorithm
    //woo...
    var walls = [];
    var points = []
    for(var x = minX; x < maxX; x++) {
      for(var y = minY; y < maxY; y++) {
        if(x % 2 == 0 && y % 2 == 0) {
          points.push(new Set([convert(new Point(x, y))]));
        } else if((x % 2 == 0 || y % 2 == 0)) {
          walls.push(convert(new Point(x, y)));
        }
      }
    }
    shuffle(walls);
    walls = new Set(walls);
    walls.forEach(function(wall) {
      wall = convert2(wall);
      var p1;
      var p2;
      if(wall.x % 2 == 0) {
        //join vertically
        p1 = new Point(wall.x, wall.y - 1);
        p2 = new Point(wall.x, wall.y + 1);
      } else {
        //join horizontally
        p1 = new Point(wall.x - 1, wall.y);
        p2 = new Point(wall.x + 1, wall.y);
      }
      p1 = convert(p1);
      p2 = convert(p2);
      var s1;
      var s2;
      var i2;
      for(var i = 0; i < points.length; i++) {
        var s = points[i];
        //console.log(s);
        if(s.has(p1)) {
          s1 = s;
        }
        if(s.has(p2)) {
          s2 = s;
          i2 = i;
        }
      }
      if(s1 && s2 && (s1 != s2)) {
        s1.add(convert(wall));
        var iter = s2.values();
        do {
          var n = iter.next();
          if(n.done) break;
          s1.add(n.value);
        } while(true);

        points.splice(i2, 1);
      }
    });

    if(points.length != 1) {
      console.log("what happened? something went wrong while generating a maze.");
    }
    points = points[0];

    var broken = 1 - (Math.random() * Math.random());
    minX = 1;
    minY = 1;
    maxX = this.width - 1;
    maxY = this.height - 1;
    for(var x = minX; x < maxX; x++) {
      for(var y = minY; y < maxY; y++) {
        if((Math.random() < broken) && !points.has(convert(new Point(x, y)))) {
          this.states[x][y] = STATE_WALL;
        }
      }
    }

    //dig tunnels from the gates
    for(var i = 0; i < DIRS.length; i++) {
      if(this.open[DIRS[i]]) {
        var dir = DIRS[i].opposite; //if it's the bottom gate, we're going up, etc
        
        var src = ROOM_GATE_FUNC(DIRS[i].delta, this.width, this.height);
        var dx = (dir.delta.x == 0) ? 1 : 0;
        var dy = (dir.delta.y == 0) ? 1 : 0;
        src.x += dir.delta.x;
        src.y += dir.delta.y;
        this.states[src.x][src.y] = STATE_EMPTY;
        this.states[src.x + dx][src.y + dy] = STATE_EMPTY;
      }
    }

    //TODO: correctly ensure all gates are reachable using a search
  }

  generateMonsters(difficulty) {
    this.difficulty = difficulty;
    while(difficulty > 0) {
      if(Math.random() < (1 / difficulty)) this.monsters.push(this.generateMonster(difficulty));
      difficulty--;
    }
    //TODO
  }

  generateMonster(difficulty) {
    //higher chance with higher difficulty
    var bossChance = 1 - (1 / difficulty);
    bossChance = bossChance * 0.1;
    if(this.canHaveBoss && (Math.random() < bossChance)) {
      return this.generateBoss(difficulty);
    }

    var health = 5 + Math.floor(Math.random() * difficulty);
    var bounds = new Rectangle(
      new Point(),
      1, 1);
    bounds.center = this.getRandomPoint(4);
    var element = chooseElement();
    var damage = 0.5;
    var trait = new Trait([TRAIT_BASIC]);
    var monster = new Monster(this.world, this, difficulty, health, bounds, element, damage, trait);
    return monster;
  }

  //TODO: different enemy class types (including better ai and such
  generateBoss(difficulty) {
    var health = 10 + Math.floor(Math.random() * difficulty);
    var bounds = new Rectangle(
      new Point(),
      2, 2);
    bounds.center = this.getRandomPoint(5);
    var element = chooseElement();
    var damage = 1 + Math.floor(Math.random() * 2);
    var trait = new Trait([TRAIT_BASIC]);
    var counter = difficulty * Math.random();
    while(counter > 1) {
      var trait2 = trait.copy();
      trait2.not(element);
      trait2 = trait2.getRandomTrait();
      if(!trait2) break;
      trait.add(trait2);
      counter = counter * Math.random() - 1;
    }
    var cooldown = MONSTER_SPELL_COOLDOWN * ((1 - (Math.random() * Math.random())) + 1) / 2;
    var monster = new MonsterBoss(this.world, this, difficulty, health, bounds, element, damage, trait, cooldown);
    return monster;
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

  getRandomPoint(pad) {
    pad = pad || 0;
    var pad2 = pad * 2;
    return new Point(pad + Math.random() * (this.width - pad2), pad + Math.random() * (this.height - pad2));
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