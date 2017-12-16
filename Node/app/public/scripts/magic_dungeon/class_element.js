var ELEMENTS = [];
var ELEMENT_COUNT = 0;

function chooseElement() {
  return ELEMENTS[Math.floor(Math.random() * ELEMENT_COUNT)];
}

class Element {
  constructor(name, deathMessage) {
    this.id = ELEMENT_COUNT;
    ELEMENT_COUNT++;
    if(ELEMENTS.push(this) != ELEMENT_COUNT) {
      throw "ERROR: Invalid Element count";
    }
    this.name = name;
    this.deathMessage = deathMessage;
  }

  beats(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (ELEMENT_COUNT - 1);
  }

  loses(e) {
    return loop(this.id - e.id, ELEMENT_COUNT) == (1);
  }

  //draw this element's symbol on the given canvas inside the given rectangle
  drawSymbol(canvas, r) {
    canvas.save();
    canvas.translate(r.minX, r.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(getImage("elements/" + this.name.toLowerCase()), 0, 0, r.width, r.height);
    canvas.restore();
  }
}

var ELEMENT_LIGHTNING = new Element("Lightning", "You died. Shocking!");
var ELEMENT_WATER = new Element("Water", "You drowned!");
var ELEMENT_FIRE = new Element("Fire", "You got roasted!");
var ELEMENT_EARTH = new Element("Earth", "You got crushed!");