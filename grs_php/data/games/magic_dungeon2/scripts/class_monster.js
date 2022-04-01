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

    this.ai = new AICombined(this);

    this.randomBulletChance = 0.1;
  }

  get isPlayer() {
    return false;
  }

  get active() {
    return this.health > 0;
  }

  get moveSpeed() {
    return 0.03;
  }

  update(tickPart) {
    this.spellCooldown -= tickPart;

    var mov = this.ai.move(tickPart);
    mov.magnitude = this.moveSpeed * tickPart;
    this.bounds.point.add(mov);

    if((this.spellCooldown <= 0) && (Math.random() < this.randomBulletChance)) {
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

  get cooldown() {
    return this.maxCooldown + (this.difficulty * Math.random())
  }

  fireSpellNaturally() {
    var player = this.world.player;
    var dir = player.bounds.center;
    dir.sub(this.bounds.center);
    dir.magnitude = 0.1;
    dir.rotate((Math.random() - Math.random()) * (0.5 / this.difficulty));
    this.fireSpell(dir);
    this.spellCooldown = this.cooldown;
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

class MonsterBigBoss extends Monster {

  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    super(world, room, difficulty, health, bounds, element, damage, trait, cooldown);
  }

  onDeath(player) {
    player.health = ++player.maxhealth;
  }

  get moveSpeed() {
    return 0.05;
  }

  get cooldown() {
    return (this.maxCooldown + this.difficulty) * Math.random();
  }

  getDamageModifier(element) {
    return 0.75 * super.getDamageModifier(element);
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

class MonsterFast extends Monster {

  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    super(world, room, difficulty, health, bounds, element, damage, trait, cooldown);
  }

  get moveSpeed() {
    return 0.06;
  }

  getDamageModifier(element) {
    return 2 * super.getDamageModifier(element);
  }
}

class MonsterBurster extends Monster {
  constructor(world, room, difficulty, health, bounds, element, damage, trait, cooldown) {
    super(world, room, difficulty, health, bounds, element, damage, trait, cooldown);
    this.resetFiring();
    this.randomBulletChance = 0.20;
  }

  resetFiring() {
    var r = (Math.random() + Math.random()) / 2;
    this.firing = Math.floor(r * (10 + Math.sqrt(this.difficulty))) + 1;
  }

  get cooldown() {
    this.firing--;
    if(this.firing < 0) {
      this.resetFiring();
      return (this.maxCooldown + (this.difficulty * Math.random())) * 2;
    }
    return 20 / Math.sqrt(this.difficulty);
  }
}

class MonsterType {
  constructor(type, weight) {
    this.type = type;
    this.weight = weight;
  }
}

var MONSTER_TYPES = [
    new MonsterType(Monster, 100),
    new MonsterType(MonsterRainbow, 5),
    new MonsterType(MonsterFast, 20),
    new MonsterType(MonsterBurster, 10)
  ];

function chooseMonsterType() {
  var total = 0;
  for(var i = 0; i < MONSTER_TYPES.length; i++) {
    total += MONSTER_TYPES[i].weight;
  }
  total *= Math.random();
  for(var i = 0; i < MONSTER_TYPES.length; i++) {
    total -= MONSTER_TYPES[i].weight;
    if(total <= 0) {
      return MONSTER_TYPES[i].type;
    }
  }
  return null; //what happen???
}