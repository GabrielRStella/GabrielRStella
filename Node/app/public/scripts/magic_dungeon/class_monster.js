var MONSTER_SPELL_COOLDOWN = 40;

class Monster {
  constructor(world, room, difficulty, health, bounds, element, damage, trait) {
    this.world = world;
    this.room = room;
    this.difficulty = difficulty;

    this.maxhealth = health;
    this.health = health;

    this.bounds = bounds;
    this.element = element;
    this.damage = damage;
    this.trait = trait;

    this.spellCooldown = MONSTER_SPELL_COOLDOWN * Math.random();

    this.tick = 0;
  }

  get isPlayer() {
    return false;
  }

  get active() {
    return this.health > 0;
  }

  update(tickPart) {
    this.spellCooldown -= tickPart;
    this.tick += tickPart;

    //TODO: move
    var mov = new Point(Math.random() - Math.random(), Math.random() - Math.random());
    if(this.goal) {
      var delta = this.goal.copy();
      delta.sub(this.bounds.center);
      delta.magnitude = 1;
      mov.add(delta);
    }
    mov.magnitude = 0.03;
    this.bounds.point.add(mov);

    if(!this.goal || this.bounds.center.distance(this.goal) < (this.tick / 100)) {
      this.goal = this.room.getRandomPoint();
      this.tick = 0;
    }

    if((this.spellCooldown <= 0) && (Math.random() < 0.1)) {
      this.fireSpellNaturally();
    }
  }

  draw(canvas) {
    //temporary...
    canvas.save();
    canvas.translate(this.bounds.minX, this.bounds.maxY);
    canvas.scale(1, -1);
    canvas.drawImage(getImage("monster"), 0, 0, this.bounds.width, this.bounds.height);
    canvas.restore();

    //health bar!

    var padding = 0.1;
    var minX = this.bounds.minX + padding;
    var delta = (this.bounds.maxX - padding) - minX;
    var y = this.bounds.maxY + padding;
    var height = 0.1;

    canvas.fillStyle = "#ff0000";
    canvas.beginPath();
    canvas.rect(minX, y, delta, height);
    canvas.fill();
    canvas.closePath();

    delta *= (this.health / this.maxhealth);
    canvas.fillStyle = "#00ff00";
    canvas.beginPath();
    canvas.rect(minX, y, delta, height);
    canvas.fill();
    canvas.closePath();
  }

  fireSpellNaturally() {
    var player = this.world.player;
    var dir = player.bounds.center;
    dir.sub(this.bounds.center);
    dir.magnitude = 0.1;
    dir.rotate((Math.random() - Math.random()) * (0.5 / this.difficulty));
    this.fireSpell(dir);
    this.spellCooldown = MONSTER_SPELL_COOLDOWN;
  }

  fireSpell(dir) {
    this.room.fireSpell(this, this.element, this.damage, this.trait.copy(), dir);
  }

  onHit(spellPart) {
    var dmg = spellPart.damage;
    if(spellPart.element.beats(this.element)) {
      dmg *= 2;
    } else if(spellPart.element.loses(this.element)) {
      dmg /= 2;
    }
    this.health -= dmg;
  }

  onDeath(player) {
    player.heal(1);
  }
}