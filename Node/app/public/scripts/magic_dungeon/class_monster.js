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
  }

  get isPlayer() {
    return false;
  }

  get active() {
    //if there are traits left...

    return health > 0;
  }

  update(tickPart) {
  }

  draw(canvas) {
  }

  fireSpell(dir) {
    this.room.fireSpell(this, this.element, this.damage, this.trait, dir);
  }
}