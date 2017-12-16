var PLAYER_SPELL_COOLDOWN = 10;

class Player {
  constructor(world, bounds, health) {
    this.world = world;
    this.bounds = bounds;
    this.maxhealth = health;
    this.health = health;

    this.element = ELEMENT_LIGHTNING; //arbitrary default
    this.elementDamage = [1, 1, 1, 1];
    this.elementTraits = [
        new Trait([TRAIT_BASIC]),
        new Trait([TRAIT_BASIC]),
        new Trait([TRAIT_BASIC]),
        new Trait([TRAIT_BASIC])
      ];

    this.spellCooldown = 0;
  }

  update(tickPart) {
    this.spellCooldown -= tickPart;
  }

  draw(canvas) {
/*
    canvas.fillStyle = "#000000";
    canvas.beginPath();
    canvas.rect(this.bounds.minX, this.bounds.minY, this.bounds.width, this.bounds.height);
    canvas.fill();
    canvas.closePath();
*/
    canvas.save();
    canvas.translate(this.bounds.minX, this.bounds.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(getImage("player"), 0, 0, this.bounds.width, this.bounds.height);
    canvas.restore();
  }

  fireSpell(dir) {
    if(this.spellCooldown <= 0) {
      var e = this.element;
      this.world.currentRoom.fireSpell(this, e, this.elementDamage[e.id], this.elementTraits[e.id], dir);
      this.spellCooldown = PLAYER_SPELL_COOLDOWN;
    }
  }
}