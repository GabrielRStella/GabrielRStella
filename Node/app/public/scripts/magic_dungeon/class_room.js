class Room {
  constructor(width, height, style) {
    this.width = width || 32;
    this.height = height || 16;

    this.states = [];
    for(var i = 0; i < width; i++) {
      var arr = [];
      for(var j = 0; j < height; j++) {
        arr.push(STATE_EMPTY);
      }
      states.push(arr);
    }
    //bounding boxes of the wall blocks
    this.boxes = [];

    this.open = [];
    for(var i = 0; i < DIRS.length; i++) {
      this.open[DIRS[i].id] = false;
    }

    this.style = style || THE_STYLE;

    this.monsters = [];
    this.spells = [];
    this.spellParts = [];
  }

  isOpen(dir) {
    return this.open[dir.id];
  }
}