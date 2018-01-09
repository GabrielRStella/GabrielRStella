var STATES = [];

class State {
  constructor(id, name, walkable) {
    this.id = id;
    this.name = name;
    this.walkable = walkable || false;

    STATES.push(this);
  }

  toString() {
    return this.name;
  }

}

var STATE_EMPTY = new State(0, "empty", true);
var STATE_WALL = new State(1, "wall");
var STATE_WALL_BROKEN = new State(2, "wall_broken");
var STATE_WALL_BRICK = new State(3, "wall_brick");