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
    canvas.scale(bounds2.width / room.width, bounds2.height / room.height);

    //le drawing
    room.draw(canvas);
    this.player.draw(canvas);

    canvas.restore();
  }
}