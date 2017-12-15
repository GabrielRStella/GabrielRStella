class World {
  constructor(game) {
    this.game = game;
    this.player = new Player(this); //TODO: implement player
    this.difficulty = 0;
    this.rooms = [];

    var room = new Room(this); //TODO: non-default constructor (width, height, style)
    room.setOpenAll();
    room.generateWalls();
    room.generateDoors();

    this.rooms.push(room);
    this.currentRoom = room;

    this.tick = 0;
  }

  draw(canvas, bounds) {
    this.room.draw(canvas, bounds);
  }
}