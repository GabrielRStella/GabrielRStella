var MONSTER_SPELL_COOLDOWN = 40;

class Monster {
  constructor(world, room, health, bounds, element, damage, trait) {
    this.world = world;
    this.room = room;

    this.maxhealth = health;
    this.health = health;

    this.bounds = bounds;
    this.element = element;
    this.damage = damage;
    this.trait = trait;

    this.spellCooldown = 0;
  }

  get isPlayer() {
    return false;
  }

  get active() {
    //if there are traits left...

    return this.health > 0;
  }

  update(tickPart) {
    this.spellCooldown -= tickPart;

    //TODO: move
    var mov = new Point(Math.random() - Math.random(), Math.random() - Math.random());
    mov.magnitude = 0.1;
    this.bounds.point.add(mov);

    if((this.spellCooldown <= 0) && (Math.random() < 0.2)) {
      var player = this.world.player;
      var dir = player.bounds.center;
      dir.sub(this.bounds.center);
      dir.magnitude = 1;
      this.fireSpell(dir);
      this.spellCooldown = MONSTER_SPELL_COOLDOWN;
    }
  }

  draw(canvas) {
    //temporary...
    canvas.save();
    canvas.translate(this.bounds.minX, this.bounds.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(getImage("monster"), 0, 0, this.bounds.width, this.bounds.height);
    canvas.restore();
  }

  fireSpell(dir) {
    this.room.fireSpell(this, this.element, this.damage, this.trait, dir);
  }

  onHit(spellPart) {
  }
}