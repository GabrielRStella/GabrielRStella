var MONSTER_SPELL_COOLDOWN = 40;

class Monster {
  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    this.world = world;
    this.room = room;
    this.difficulty = difficulty;

    this.maxhealth = health;
    this.health = health;

    this.bounds = bounds;
    this.element = element;
    this.damage = damage;
    this.trait = trait;

    this.maxCooldown = cooldown || MONSTER_SPELL_COOLDOWN;
    this.spellCooldown = this.maxCooldown * Math.random();

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

  get img() {
    return "monsters/" + this.element.name.toLowerCase();
  }

  draw(canvas) {
    drawImageFlipped(this.img, canvas, this.bounds);

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
    this.spellCooldown = this.maxCooldown + (this.difficulty * Math.random());
  }

  fireSpell(dir) {
    this.room.fireSpell(this, this.element, this.damage, this.trait.copy(), dir);
  }

  getDamageModifier(element) {
    if(element.beats(this.element)) {
      return 2;
    } else if(element.loses(this.element)) {
      return 0.5;
    }
    return 1;
  }

  onHit(spellPart) {
    var dmg = spellPart.damage;
    dmg *= this.getDamageModifier(spellPart.element);
    this.health -= dmg;
  }

  onDeath(player) {
    player.heal(1);
    player.game.addScore(1);
  }
}

class MonsterBoss extends Monster {

  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    super(world, room, difficulty, health, bounds, element, damage, trait, cooldown);
  }

  onDeath(player) {
    //super.onDeath(player);
    player.awardTrait(this.element);
    player.game.addScore(1);
  }
}

class MonsterRainbow extends Monster {

  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    super(world, room, difficulty, health, bounds, element, damage, trait, cooldown);
  }

  get img() {
    return "monster";
  }

  getDamageModifier(element) {
    return 1;
  }

  fireSpell(dir) {
    this.room.fireSpell(this, chooseElement(), this.damage, this.trait.copy(), dir);
  }
}