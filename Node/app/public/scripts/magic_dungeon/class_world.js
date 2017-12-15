class World {
  constructor(game) {
    this.game = game;
    this.player = new Player(this, new Rectangle(new Point(12, 12), 1, 1), 10); //TODO: implement player
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
    //TODO: physics and all that crap... also io?
    

    this.tick += tickPart;
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

    var room = new Room(this, 16 + Math.floor(Math.random() * 16), 16 + Math.floor(Math.random() * 16));
    for(var i = 0; i < DIRS.length; i++) {
      room.open[DIRS[i]] = (Math.random() < 0.4); //40% chance of an open door
    }
    room.setOpen(dir.opposite, true);
    room.generateWalls();
    room.generateDoors();
    room.generateObstacles();
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
      room = room.getConnection(dir);
      this.currentRoom = room;

      //TODO: set player bounds to be on the corresponding wall
    }
  }
}