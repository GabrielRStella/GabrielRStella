class World {
  constructor(game) {
    this.game = game;
    this.player = new Player(game, this, new Rectangle(new Point(11.5, 11.5), 1, 1), 10); //TODO: implement player
    this.difficulty = 0;
    this.rooms = [];

    var room = new Room(this, 24, 24); //TODO: non-default constructor (width, height, style)
    room.setOpenAll();
    room.generateWalls();
    room.generateDoors();
    room.generateMonsters(this.difficulty);
    room.makeBoxes();

    this.rooms.push(room);
    this.currentRoom = room;

    this.tick = 0;
  }

  get pauseInfo() {
    var ret = [];
    ret.push("Difficulty: " + this.currentRoom.difficulty);
    //TODO: traits and such
    return ret;
  }

  update(tickPart) {
    //physics and io

    var player = this.player;

    //IO (movement)
    var io = this.game.io;
    var playerMove = io.playerMove;
    playerMove.multiply(0.1);
    var bounds = player.bounds;
    bounds.point.add(playerMove);

    //swap room
    if(bounds.maxX < 0) {
      this.go(DIR_LEFT);
    } else if(bounds.minX > this.currentRoom.width) {
      this.go(DIR_RIGHT);
    } else if(bounds.maxY < 0) {
      this.go(DIR_DOWN);
    } else if(bounds.minY > this.currentRoom.height) {
      this.go(DIR_UP);
    }

    //more IO (spells)
    var playerSpell = io.playerSpell;
    if(!playerSpell.zero) {
      playerSpell.multiply(0.1);
      player.fireSpell(playerSpell);
    }

    //physics

    player.update(tickPart);
    this.currentRoom.update(tickPart);

    var boxes = this.currentRoom.boxes;
    var monsters = this.currentRoom.monsters;
    var spells = this.currentRoom.spellParts;

    //push player out of monsters
    for(var i = 0; i < monsters.length; i++) {
      monsters[i].bounds.push(bounds);
    }

    //push monsters out of monsters
    for(var i = 0; i < monsters.length; i++) {
      for(var j = i + 1; j < monsters.length; j++) {
        monsters[i].bounds.push(monsters[j].bounds);
      }
    }

    //push monsters out of blocks
    for(var i = 0; i < boxes.length; i++) {
      for(var j = 0; j < monsters.length; j++) {
        boxes[i].push(monsters[j].bounds);
      }
    }

    //push player out of blocks
    for(var i = 0; i < boxes.length; i++) {
      boxes[i].push(bounds);
    }

    //push monsters out of player
    for(var i = 0; i < monsters.length; i++) {
      bounds.push(monsters[i].bounds);
    }

    //check spell collisions
    for(var i = 0; i < spells.length; i++) {
      var spell = spells[i]; //is actually a SpellPart but whatever
      var doCont = false;
      for(var j = 0; j < boxes.length; j++) {
        if(boxes[j].intersects(spell.bounds)) {
          spell.active = false;
          doCont = true;
          break;
        }
      }
      if(doCont) continue;
      if(spell.srcEntity.isPlayer) {
        //check monster collisions
        for(var j = 0; j < monsters.length; j++) {
          var monster = monsters[j];
          if(spell.bounds.intersects(monster.bounds)) {
            spell.active = false;
            monster.onHit(spell);
            if(!monster.active) {
              monster.onDeath(player);
            }
            break;
          }
        }
      } else {
        //check player collision
        if(spell.bounds.intersects(bounds)) {
          spell.active = false;
          player.onHit(spell);
          if(!player.active) {
            player.onDeath(spell, spell.srcEntity);
          }
        }
      }
    }

    //DONE WITH COLLISIONS

    //increment ticker

    this.tick += tickPart;

    return player.health > 0;
  }

  draw(canvas, bounds) {
    canvas.save();

    var room = this.currentRoom;
    var bounds2 = new Rectangle(new Point(0, 0), room.width, room.height);
    Gui.align(bounds, bounds2, [Gui.fit, Gui.center], 0);

    //prevent game rendering from exiting the world drawing bounds
    canvas.beginPath();
    canvas.rect(bounds2.minX, bounds2.minY, bounds2.width, bounds2.height);
    canvas.clip();

    //robots in disguise
    canvas.translate(bounds2.minX, bounds2.minY);
    canvas.translate(0, bounds2.height);
    canvas.scale(1, -1);
    canvas.scale(bounds2.width / room.width, bounds2.height / room.height);

    //le drawing
    room.draw(canvas);
    this.player.draw(canvas);

    canvas.restore();
  }

  connect(room, dir) {
    var dir2 = dir.opposite;
    for(var i = 0; i < this.rooms.length; i++) {
      var r = this.rooms[i];
      if((r != room) && (r.isOpen(dir2)) && (!r.hasConnection(dir2))) {
        var chance = 1.0 / (Math.abs(room.difficulty - r.difficulty) + 2);
        if(Math.random() < (chance * chance)) {
          //rooms with similar difficulty are more likely to be connected
          room.setConnection(dir, r);
          r.setConnection(dir2, room);
          return r;
        }
      }
    }
    return this.connectNew(room, dir);
  }

  connectNew(r, dir) {
    this.difficulty++;

    var room = new Room(this, 16 + Math.floor(Math.random() * 10) * 2, 16 + Math.floor(Math.random() * 10) * 2);
    for(var i = 0; i < DIRS.length; i++) {
      room.open[DIRS[i]] = (Math.random() < 0.4); //40% chance of an open door
    }
    room.setOpen(dir.opposite, true);
    room.generateWalls();
    room.generateDoors();
    room.generateObstacles();
    room.filter(function(state){
        if((state == STATE_WALL) && (Math.random() < 0.5))
          return (Math.random() < 0.5 ? STATE_WALL_BROKEN : STATE_WALL_BRICK);
      });

    room.generateMonsters(this.difficulty);
    room.makeBoxes();

    r.setConnection(dir, room);
    room.setConnection(dir.opposite, r);
    this.rooms.push(room);

    return room;
  }

  go(dir) {
    var room = this.currentRoom;
    if(room.isOpen(dir)) {
      room.clearSpells();
      this.currentRoom = room.getConnection(dir);

      //fix player bounds

      var bounds = this.player.bounds;

      //re-center
      var center = bounds.center;
      if(dir == DIR_LEFT || dir == DIR_RIGHT) {
        center.y *= this.currentRoom.height / room.height;
      } else if(dir == DIR_DOWN || dir == DIR_UP) {
        center.x *= this.currentRoom.width / room.width;
      }
      bounds.center = center;

      //align on wall
      if(dir == DIR_LEFT) {
        bounds.maxX = this.currentRoom.width;
      } else if(dir == DIR_RIGHT) {
        bounds.minX = 0;
      } else if(dir == DIR_DOWN) {
        bounds.maxY = this.currentRoom.height;
      } else if(dir == DIR_UP) {
        bounds.minY = 0;
      }
    }
  }
}