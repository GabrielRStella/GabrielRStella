var TRAITS = [];
var TRAIT_COUNT = 0;

function getAllTraits(element) {
  var arr = [];
  for(var i = 0; i < TRAIT_COUNT; i++) {
    if(traits[i].appliesToElement(element)) arr.push(traits[i]);
  }
  return new Trait(arr);
}

class Trait {
  constructor(traits) {
    this.inner = traits || [];
    this.counter = 0;
  }

  add(traitPart) {
    this.inner.push(traitPart);
  }

  hasNext() {
    return this.inner.length > this.counter;
  }

  get next() {
    var ret = this.inner[this.counter];
    this.counter++;
    return ret;
  }

  copy() {
    var newArr = [];
    for(var i = 0; i < this.inner.length; i++) newArr.push(this.inner[i]);
    return new Trait(newArr);
  }
}

class TraitPart {
  constructor() {
    this.id = TRAIT_COUNT;
    TRAIT_COUNT++;
    if(TRAIT_COUNT != TRAITS.push(this)) {
      throw "ERROR: Invalid TraitPart count";
    }
  }

  //overridable
  appliesToElement(e) {
    return true;
  }

  getBounds(srcEntity, damage) {
    var sz = damage / 2;
    var bounds = new Rectangle(new Point(), sz, sz);
    bounds.center = srcEntity.bounds.center;
    return bounds;
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    //base trait - empty

    //for subclass use
    return new SpellPartLauncher(room, srcEntity, element, damage);
  }
}

class TraitPartBasic extends TraitPart {
  constructor() {
    super();
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
  }
}

class TraitPartRandom extends TraitPart {
  constructor() {
    super();
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    var dir = new Point(Math.random() - Math.random(), Math.random() - Math.random());
    dir.magnitude = direction.magnitude;
    launcher.launch(this.getBounds(srcEntity, damage), dir);
  }
}

class TraitPartHoming extends TraitPart {
  constructor() {
    super();
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    var dir;
    if(srcEntity.isPlayer) {
      var monsters = room.monsters;
      if(monsters.length > 0) {
        var monster = monsters[Math.floor(Math.random() * monsters.length)];
        dir = monster.bounds.center;
        dir.sub(srcEntity.bounds.center);
      } else {
        dir = direction.copy();
      }
    } else {
      dir = room.world.player.bounds.center;
      dir.sub(srcEntity.bounds.center);
    }
    dir.magnitude = direction.magnitude;
    launcher.launch(this.getBounds(srcEntity, damage), dir);
  }
}

//generic traits
var TRAIT_BASIC = new TraitPartBasic();
var TRAIT_RANDOM = new TraitPartRandom();
var TRAIT_HOMING = new TraitPartHoming();