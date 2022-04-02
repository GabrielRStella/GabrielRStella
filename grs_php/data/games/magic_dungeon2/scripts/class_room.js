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

  countOpen() {
    var open = 0;
    for(var i = 0; i < DIRS.length; i++) {
      if(this.open[DIRS[i]] && this.connections[DIRS[i]] == null) open++;
    }
    return open;
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

  findConnection(room) {
    for(var i = 0; i < DIRS.length; i++) {
      if(this.connections[DIRS[i]] == room) return DIRS[i];
    }
    return null;
  }

  getState(x, y) {
    if((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)) {
      return STATE_EMPTY;
    }
    return this.states[x][y];
  }

  setState(x, y, state) {
    if((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)) {
      return;
    }
    this.states[x][y] = state;
  }
  
  checkBounds(x, y, off) {
    off = off || 0;
    return !((x < off) || (x >= this.width - off) || (y < off) || (y >= this.height - off));
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
    if(Math.random() < 0.9) { //TMP was 0.13
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
    } else if(Math.random() < 1) {
      //structures
      while(Math.random() < 0.8) {
        var minX = 2;
        var minY = 2;
        var maxX = this.width - 2;
        var maxY = this.height - 2;
        var x = randomRangeFloor(minX, maxX);
        var y = randomRangeFloor(minY, maxY);
        var width = Math.min(maxX - x, Math.ceil(Math.random() * 4));
        var height = Math.min(maxY - y, Math.ceil(Math.random() * 4));
        for(var dx = 0; dx < width; dx++) {
          for(var dy = 0; dy < height; dy++) {
            this.states[x + dx][y + dy] = STATE_WALL;
          }
        }
      }
    } else {
      //empty
    }
  }

  generateMaze() {
    //make it a maze
    //using a custom algorithm :))) hope it works well
    //set operations: add, delete, clear, has, forEach
   
    var regions = [];
    var regionList = new Map(); //maps from region number to set of block positions (as integers)
    for(var i = 0; i < this.width; i++) {
      var arr = [];
      for(var j = 0; j < this.height; j++) {
        arr.push(-1); //no region
      }
      regions.push(arr);
    }
    var frontier = [];
    var seen = new Set(); //blocks that can't be added to frontier anymore
    
    //set all blocks to stone
    for(var x = 1; x < this.width - 1; x++) {
      for(var y = 1; y < this.height - 1; y++) {
        this.states[x][y] = STATE_WALL;
      }
    }

    //dig tunnels from the gates and add the corresponding regions
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
        //initialize the region
        regions[src.x][src.y] = i;
        regions[src.x + dx][src.y + dy] = i;
        var idx1 = this.convertPos(src.x, src.y);
        var idx2 = this.convertPos(src.x + dx, src.y + dy);
        regionList.set(i, new Set([idx1, idx2]));
      }
    }
    
    for(var x = 1; x < this.width - 1; x++) {
      for(var y = 1; y < this.height - 1; y++) {
        if(this.states[x][y] == STATE_WALL) {
          //if it's a wall, and it's next to an empty block, add it to the frontier
          if(this.getState(x - 1, y) == STATE_EMPTY || this.getState(x + 1, y) == STATE_EMPTY || this.getState(x, y - 1) == STATE_EMPTY || this.getState(x, y + 1) == STATE_EMPTY) {
            frontier.push(x + y * this.width); //index number of that block
          }
        }
      }
    }
    
    //randomly carve out spots in the frontier
    while(frontier.length > 0) {
      //get random from frontier and remove it
      var idx = randomIndex(frontier);
      var curr = frontier[idx];
      frontier.splice(idx, 1);
      //
      var p = this.convertInt(curr);
      var x = p.x;
      var y = p.y;
      //if breaking this wall would lead to a diagonal disconnect, then we can't delete it; leave it a wall and remove from frontier
      //if any of this wall's neighbors are walls, then the diagonals in that direction must also be walls
      var canBreak = true;
      for(var i = 0; i < DIRS.length; i++) {
        var dir = DIRS[i];
        //neighbor pos
        var nx = x + dir.delta.x;
        var ny = y + dir.delta.y;
        if(this.states[nx][ny] == STATE_WALL) {
          //two diagonals; one must be a wall, or we can't break the current block
          var d1 = dir.next;
          var d1x = nx + d1.delta.x, d1y = ny + d1.delta.y;
          var d2 = dir.prev;
          var d2x = nx + d2.delta.x, d2y = ny + d2.delta.y;
          if(this.states[d1x][d1y] == STATE_EMPTY && this.states[d2x][d2y] == STATE_EMPTY) {
            canBreak = false;
            break;
          }
        }
      }
      if(!canBreak) continue;
      
      //can't break a wall that would connect a region to itself
      //to test: if the wall has two or more neighbors in the same region, it can't be broken
      //(doesn't seem to be necessary with current rules; may add it back later)
      /*
      var lRegion = regions[x-1][y];
      var rRegion = regions[x+1][y];
      var dRegion = regions[x][y-1];
      var uRegion = regions[x][y+1];
      var neighborRegions = new Set();
      if(lRegion >= 0) neighborRegions.add(lRegion);
      if(neighborRegions.has(rRegion)) continue;
      if(rRegion >= 0) neighborRegions.add(rRegion);
      if(neighborRegions.has(dRegion)) continue;
      if(dRegion >= 0) neighborRegions.add(dRegion);
      if(neighborRegions.has(uRegion)) continue;
      */
      
      //count neighbors and add them to frontier,
      //if they aren't in the "seen" set
      var neighborWalls = 0;
      var neighborsToAdd = [];
      var addNeighbors = false;
      for(var i = 0; i < DIRS.length; i++) {
        var dir = DIRS[i];
        //neighbor pos
        var nx = x + dir.delta.x;
        var ny = y + dir.delta.y;
        if(!this.checkBounds(nx, ny, 1)) {
          neighborWalls++;
          continue;
        }
        if(this.states[nx][ny] == STATE_WALL) {
          neighborWalls++;
          var nidx = this.convertPos(nx, ny);
          neighborsToAdd.push(nidx);
        }
      }
      
      //if this block is surrounded on three sides, let's just delete it
      if(neighborWalls == 3) {
        this.states[x][y] = STATE_EMPTY;
        addNeighbors = true;
      }
      
      
      
      for(var i = 0; i < neighborsToAdd.length; i++) {
        var nidx = neighborsToAdd[i];
        if(!seen.has(nidx)) {
          seen.add(nidx);
          frontier.push(nidx);
        }
      }
    }
    
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
    bossChance = Math.min(0.3, bossChance * bossChance * 0.2 * Math.log1p(this.id));
    if(this.canHaveBoss && (Math.random() < bossChance)) {
      return this.generateBoss(difficulty);
    }

    var health = 5 + Math.floor(Math.sqrt(Math.random() * difficulty));
    var bounds = new Rectangle(
      new Point(),
      1, 1);
    bounds.center = this.getRandomPoint(4);
    var element = chooseElement();
    var damage = 0.5;
    var trait = new Trait([TRAIT_BASIC]);
    var t = chooseMonsterType();
    var monster = new t(this.world, this, difficulty, health, bounds, element, damage, trait);
    return monster;
  }

  //TODO: different enemy class types (including better ai and such
  generateBoss(difficulty) {
    var health = 10 + Math.floor(Math.sqrt(Math.random() * difficulty));
    var sz = 2;
    var type = MonsterBoss;
    if(Math.random() < 0.1) {
      type = MonsterBigBoss;
      sz = 3;
    }
    var bounds = new Rectangle(
      new Point(),
      sz, sz);
    bounds.center = this.getRandomPoint(3 + sz);
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
    var monster = new type(this.world, this, difficulty, health, bounds, element, damage, trait, cooldown);
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

  convertPoint(p) {
    return p.x + p.y * this.width;
  }

  convertPos(x, y) {
    return x + y * this.width;
  }

  convertInt(x) {
    return new Point(x % this.width, Math.floor(x / this.width));
  }

  inBounds(p) {
    return p.x >= 0 && p.x < this.width && p.y >= 0 && p.y < this.height;
  }

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

  //path finder
  findPath(start, end, sz) {
    var sz2 = sz / 2;
    start = start.copy();
    end = end.copy();
    //align to block
    start.x = Math.round(start.x - sz2);
    start.y = Math.round(start.y - sz2);
    end.x = Math.round(end.x - sz2);
    end.y = Math.round(end.y - sz2);

    var startp = start;
    var endp = end;
    start = this.convertPoint(start);
    end = this.convertPoint(end);
    
    if(start == end) return [];

    var checked = [start];
    var frontier = new PriorityQueue();
    frontier.push(start, 0); //element, priority
    var sources = {};
    var path = [];

    //simple path length heuristic - may make it A*
    var heuristic = function(p) {
      return p.distance(startp) + p.distance(endp);
    }

    var last = null;
      
    while(frontier.size) {
      var curr = frontier.pop();
      checked.push(curr);
      curr = this.convertInt(curr);

      for(var j = 0; j < DIRS.length; j++) {
        var dir = DIRS[j];
        var next = curr.copy();
        next.add(dir.delta);

        //check if it's a usable point (enough space around)
        var cont = true;
        for(var dx = 0; cont && dx < sz; dx++) {
          for(var dy = 0; cont && dy < sz; dy++) {
            var nextd = next.copy();
            nextd.x += dx;
            nextd.y += dy;
            if(!this.inBounds(nextd) || !this.states[next.x + dx][next.y + dy].walkable) {
              cont = false;
            }
          }
        }
        if(!cont) continue;

        next = this.convertPoint(next);
        if(next == end) {
          sources[next] = this.convertPoint(curr);
          last = next;
          frontier = []; //to make it end
          break;
        } else if(!checked.includes(next)) {
          sources[next] = this.convertPoint(curr);
          checked.push(next);
          frontier.push(next, heuristic(this.convertInt(next)));
        }
      }

    }

    while(last) {
      var p = this.convertInt(last);
      p.add(new Point(sz2, sz2));
      path.push(p);
      last = sources[last];
    }

    path.reverse();
    return path;

  }
  
}