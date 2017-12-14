var ELEMENTS = [];
var ELEMENT_COUNT = 0;

class Element {
  constructor(name, deathMessage) {
    this.id = ELEMENT_COUNT;
    ELEMENT_COUNT++;
    if(ELEMENTS.push(this) != ELEMENT_COUNT) {
      throw "ERROR: Invalid Element count";
    }
    this.name = name;
  }

  beats(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (ELEMENT_COUNT - 1);
  }

  loses(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (1);
  }

  //draw this element's symbol on the given canvas inside the given rectangle
  drawSymbol(canvas, r) {
  }
}

var ELEMENT_LIGHTNING = new Element("Lightning", "You died. Shocking!");
var ELEMENT_WATER = new Element("Water", "You drowned!");
var ELEMENT_FIRE = new Element("Fire", "You got roasted!");
var ELEMENT_EARTH = new Element("Earth", "You got crushed!");