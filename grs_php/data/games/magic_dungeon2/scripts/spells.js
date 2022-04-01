class SpellPart {
  constructor(room, srcEntity, element, damage, bounds, velocity) {
    this.room = room;
    this.srcEntity = srcEntity;
    this.element = element;
    this.damage = damage;
    this.bounds = bounds;
    this.velocity = velocity;
    this.active = true;
  }

  update(tickPart) {
    var vel = this.velocity.copy();
    vel.multiply(tickPart);
    this.bounds.point.add(vel);
  }

  draw(canvas) {
    var padding = 0.05;
    canvas.fillStyle = "#000000";
    canvas.beginPath();
    canvas.rect(this.bounds.minX - padding, this.bounds.minY - padding, this.bounds.width + padding * 2, this.bounds.height + padding * 2);
    canvas.fill();
    canvas.closePath();

    this.element.drawSpellPart(canvas, this.bounds, this.velocity);
  }
}

class SpellPartLauncher {
  constructor(room, srcEntity, element, damage) {
    this.room = room;
    this.srcEntity = srcEntity;
    this.element = element;
    this.damage = damage;
  }

  create(bounds, velocity) {
    return new SpellPart(this.room, this.srcEntity, this.element, this.damage, bounds, velocity);
  }

  launch(bounds, velocity) {
    this.room.fireSpellPart(new SpellPart(this.room, this.srcEntity, this.element, this.damage, bounds, velocity));
  }
}

class Spell {
  constructor(room, srcEntity, element, damage, traits, direction) {
    this.room = room;
    this.srcEntity = srcEntity;
    this.element = element;
    this.damage = damage;
    this.traits = traits;
    this.direction = direction;

    this.tick = 0;
  }

  get active() {
    //if there are traits left...
    return this.traits.hasNext();
  }

  update(tickPart) {
    if(this.tick >= 1) {
      this.tick--;
      //get next trait and fire it...
      this.traits.next.fireSpell(this.room, this.srcEntity, this.element, this.damage, this.direction);
    }

    this.tick += tickPart;
  }

  draw(canvas) {
    //maybe add a cool animation but eh
  }
}