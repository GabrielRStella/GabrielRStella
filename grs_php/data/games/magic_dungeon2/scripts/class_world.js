class World {
  constructor(game) {
    this.game = game;
    this.player = new Player(game, this, new Rectangle(new Point(11.5, 11.5), 1, 1), 10); //TODO: implement player
    this.difficulty = 0;
    this.rooms = [];
    this.nextRoomId = 0;

    var room = new Room(this, this.nextId, 24, 24); //TODO: non-default constructor (width, height, style)
    room.setOpenAll();
    room.generateWalls();
    room.generateDoors();
    room.generateMonsters(this.difficulty);
    room.makeBoxes();

    this.rooms.push(room);
    this.currentRoom = room;

    this.tick = 0;
  }

  get nextId() {
    return this.nextRoomId++;
  }

  pauseInfo(abridged) {
    var ret = [];
    ret.push("Room: " + this.currentRoom.name);
    ret.push("Difficulty: " + this.currentRoom.difficulty);

    var player = this.player;
    ret.push("Health: " + player.health + "/" + player.maxhealth);
    if(!abridged) {
      for(var i = 0; i < ELEMENT_COUNT; i++) {
        ret.push(ELEMENTS[i].name + ": " + player.elementTraits[i].name + " (" + player.elementDamage[i] + ")");
      }
    }

    return ret;
  }

  update(tickPart) {
    //physics and io

    var player = this.player;

    //IO (movement)
    var io = this.game.io;
    var playerMove = io.playerMove;
    playerMove.multiply(0.07 * tickPart);
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

    //more IO (select element)
    var playerElem = io.playerElement;
    if(playerElem >= 0) {
      player.element = ELEMENTS[playerElem];
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

  getDrawBounds(bounds) {
    var bounds2 = new Rectangle(new Point(0, 0), 1, 1);
    Gui.align(bounds, bounds2, [Gui.fit, Gui.center], 0);
    return bounds2;
  }

  draw(canvas, bounds) {
    canvas.save();

    var room = this.currentRoom;

    var bounds2 = bounds;
    bounds = new Rectangle(new Point(), room.width, room.height);
    Gui.align(bounds2, bounds, [Gui.fit, Gui.center], 0);
    var bounds_ = bounds;

    //TODO: zoom into player?
/*
    Gui.align(bounds2, bounds, [Gui.fit2, Gui.center], 0);
    //make sure player is in view:
    var pos = this.player.bounds.center;
*/
    

    //prevent game rendering from exiting the world drawing bounds
    canvas.beginPath();
    //canvas.rect(bounds2.minX, bounds2.minY, bounds2.width, bounds2.height);
    canvas.rect(bounds.minX, bounds.minY, bounds.width, bounds.height);
    canvas.clip();

    //robots in disguise
    canvas.translate(bounds.minX, bounds.minY);
    canvas.translate(0, bounds.height);
    canvas.scale(1, -1);
    canvas.scale(bounds.width / room.width, bounds.height / room.height);

    //le drawing
    room.draw(canvas);
    this.player.draw(canvas);
    
    //draw a little shadow on unexplored doorways
    for(var d in room.open) {
      if(room.open[d] && !room.connections[d]) {
        var dir = DIRS[d];
        var dx = (dir.delta.x == 0) ? 0 : 1;
        var dy = (dir.delta.y == 0) ? 0 : 1;
        var src;
        if(dx == 0) {
          //vertical direction
          src = new Point(room.width / 2 - 1, (room.height) * (dir.delta.y + 1) / 2 - .5);
        } else {
          //horizontal direction
          src = new Point((room.width) * (dir.delta.x + 1) / 2 - .5, room.height / 2 - 1);
        }
        var bounds = new Rectangle(src, 2 - dx, 2 - dy);
        canvas.save();
        canvas.fillStyle = "#00000040";
        canvas.beginPath();
        canvas.rect(bounds.point.x, bounds.point.y, bounds.width, bounds.height);
        canvas.fill();
        canvas.closePath();
        canvas.restore();
      }
    }
    
    //testing if the path finder worked
    //(it does)
    /*
    bounds = bounds_;
    var tilepos = new Point((THE_MOUSE.x - bounds.minX) * room.width / bounds.width, (1 + (-1 * (THE_MOUSE.y - bounds.minY) / bounds.height)) * room.height);
    tilepos.x = Math.floor(tilepos.x);
    tilepos.y = Math.floor(tilepos.y);
    canvas.save();
    canvas.fillStyle = "#ff0000";
    canvas.beginPath();
    canvas.rect(tilepos.x, tilepos.y, 1, 1);
    canvas.fill();
    canvas.closePath();
    canvas.restore();
    var path = room.findPath(this.player.bounds.center, new Point(tilepos.x + 0.5, tilepos.y + 0.5), 1);
    for(var i = 0; i < path.length - 1; i++) {
      canvas.save();
      canvas.strokeStyle = "#00ff00";
      canvas.lineWidth = 0.1;
      canvas.beginPath();
      var pprev = path[i];
      var pnext = path[i + 1];
      canvas.moveTo(pprev.x, pprev.y);
      canvas.lineTo(pnext.x, pnext.y);
      canvas.stroke();
      canvas.restore();
    }
    */

    canvas.restore();
  }

  connect(room, dir) {
    var dir2 = dir.opposite;
	var rooms = [];
	var totalDoors = 0;
    for(var i = 0; i < this.rooms.length; i++) {
      var r = this.rooms[i];
	  totalDoors += r.countOpen();
      if((r != room) && (r.isOpen(dir2)) && (!r.hasConnection(dir2)) && (!r.findConnection(room))) {
		  rooms.push(r);
      }
    }
	var chance = 1 - (1.0 / totalDoors); //more likely as there are more rooms available
	if(totalDoors < 5) chance = 0;
	if(rooms.length > 0 && Math.random() < chance) {
		//connect to one of the existing rooms
		//keep going until we find a matching one
		while(true) {
			for(var i = 0; i < rooms.length; i++) {
				var r = rooms[i];
				var chance = 1.0 / (Math.abs(room.difficulty - r.difficulty) + 2);
				if(Math.random() < (chance * chance)) {
				  //rooms with similar difficulty are more likely to be connected
				  room.setConnection(dir, r);
				  r.setConnection(dir2, room);
				  return r;
				}
			}
		}
	}
    return this.connectNew(room, dir);
  }

  get nextDifficulty() {
    var dif = this.difficulty;
    return Math.floor(1 + this.nextRoomId * Math.log1p(dif));
  }

  connectNew(r, dir) {
    var dif = this.difficulty = this.nextDifficulty;
    this.game.addScore(1);

    var sz = function() {
      return 16 + Math.floor(Math.random() * 10 + Math.random() * Math.log1p(dif)) * 2;
    }
    var w = sz();
    var h = sz();
    var room = new Room(this, this.nextId, w, h);
    for(var i = 0; i < DIRS.length; i++) {
      room.open[DIRS[i]] = (Math.random() < 0.7); //70% chance of an open door
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