class Monster {
  constructor(world, room, bounds, element, damage, trait) {
    this.world = world;
    this.room = room;

    this.bounds = bounds;
    this.element = element;
    this.damage = damage;
    this.trait = trait;
  }

  draw(canvas) {
  }

  fireSpell(dir) {
    this.room.fireSpell(this, this.element, this.damage, this.trait, this.bounds.center, dir);
  }
}