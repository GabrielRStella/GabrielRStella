var PLAYER_SPELL_COOLDOWN = 25;

class Player {
  constructor(game, world, bounds, health) {
    this.game = game;
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

  get isPlayer() {
    return true;
  }

  get active() {
    return this.health > 0;
  }

  update(tickPart) {
    this.spellCooldown -= tickPart;
  }

  draw(canvas) {
    drawImageFlipped("player", canvas, this.bounds);

    //health bar (from monster)

    var padding = 0.1;
    var minX = this.bounds.minX + padding;
    var delta = (this.bounds.maxX - padding) - minX;
    var y = this.bounds.maxY + padding;
    var height = 0.1;

    canvas.fillStyle = "#000000";
    canvas.beginPath();
    canvas.rect(minX, y, delta, height);
    canvas.fill();
    canvas.closePath();

    delta *= (this.health / this.maxhealth);
    canvas.fillStyle = "#0000ff";
    canvas.beginPath();
    canvas.rect(minX, y, delta, height);
    canvas.fill();
    canvas.closePath();
  }

  fireSpell(dir) {
    if(this.spellCooldown <= 0) {
      var e = this.element;
      this.world.currentRoom.fireSpell(this, e, this.elementDamage[e.id], this.elementTraits[e.id].copy(), dir);
      this.spellCooldown = PLAYER_SPELL_COOLDOWN;
    }
  }

  heal(amt) {
    this.health = Math.min(this.maxhealth, this.health + amt);
  }

  onHit(spellPart) {
    this.health -= spellPart.damage;
  }

  onDeath(spellPart, monster) {
    this.game.end(spellPart.element.deathMessage);
  }

  getRandomNewTraitPart(elem) {
    var trait = this.elementTraits[elem.id].copy();
    trait.not(elem);
    return trait.getRandomTrait();
  }

  applyTraitPart(elem, t) {
    var trait = this.elementTraits[elem.id];
    if(t) {
      trait.add(t);
    } else {
      this.elementDamage[elem.id]++; //woo
    }
    //do some message... todo
    this.game.display(new ScreenTrait(this.game, new Trait([t]), elem));
  }

  awardTrait(elem) {
    this.applyTraitPart(elem, this.getRandomNewTraitPart(elem));
  }
}