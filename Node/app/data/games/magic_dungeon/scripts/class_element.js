var ELEMENTS = [];
var ELEMENT_COUNT = 0;

function chooseElement() {
  return ELEMENTS[Math.floor(Math.random() * ELEMENT_COUNT)];
}

class Element {
  constructor(name, color, deathMessage) {
    this.id = ELEMENT_COUNT;
    ELEMENT_COUNT++;
    if(ELEMENTS.push(this) != ELEMENT_COUNT) {
      throw "ERROR: Invalid Element count";
    }
    this.name = name;
    this.color = color;
    this.deathMessage = deathMessage;
  }

  beats(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (ELEMENT_COUNT - 1);
  }

  loses(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (1);
  }

  get prev() {
    return ELEMENTS[loop(this.id - 1, ELEMENT_COUNT)];
  }

  get next() {
    return ELEMENTS[loop(this.id + 1, ELEMENT_COUNT)];
  }

  //draw this element's symbol on the given canvas inside the given rectangle
  drawSymbol(canvas, r, flipped) {
    drawImage("elements/" + this.name.toLowerCase(), canvas, r, flipped);
  }

  drawSpellPart(canvas, bounds, velocity) {
    this.drawSymbol(canvas, bounds, true);
  }
}

var ELEMENT_LIGHTNING = new Element("Lightning", "#ffff00", "You died. Shocking!");
var ELEMENT_WATER = new Element("Water", "#0000ff", "You drowned!");
var ELEMENT_FIRE = new Element("Fire", "#ff0000", "You got roasted!");
var ELEMENT_EARTH = new Element("Earth", "#00ff00", "You got crushed!");