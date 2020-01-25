var TRAITS = [];
var TRAIT_COUNT = 0;

function getAllTraits(element) {
  var arr = [];
  for(var i = 0; i < TRAIT_COUNT; i++) {
    if(TRAITS[i].appliesToElement(element)) arr.push(TRAITS[i]);
  }
  return new Trait(arr);
}

class Trait {
  constructor(traits) {
    this.inner = traits || [];
    this.counter = 0;
  }

  get empty() {
    return this.inner.length == 0;
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

  //the following are operations that can be used to generate new sets of traits

  and(t) {
    this.inner = this.inner.filter(x => t.has(x));
  }

  or(t) {
    for(var i = 0; i < t.inner.length; i++) {
      if(!this.has(t.inner[i])) this.inner.push(t.inner[i]);
    }
  }

  not(elem) {
    var t = getAllTraits(elem).inner;
    var arr = [];
    for(var i = 0; i < t.length; i++) {
      if(!this.has(t[i])) {
        arr.push(t[i]);
      }
    }
    this.inner = arr;
  }

  //other stuff

  has(p) {
    for(var i = 0; i < this.inner.length; i++) {
      if(this.inner[i].id == p.id) return true;
    }
    return false;
  }

  //uses a weighted random distribution
  getRandomTrait() {
    //inverse rarity = commonness
    var total = 0;
    for(var i = 0; i < this.inner.length; i++) {
      total += 1 / this.inner[i].rarity;
    }
    total *= Math.random();
    for(var i = 0; i < this.inner.length; i++) {
      total -= 1 / this.inner[i].rarity;
      if(total <= 0) {
        return this.inner[i];
      }
    }
    return null; //what happen???
  }

  get name() {
    var ret = "";
    var space = false;
    for(var i = 0; i < this.inner.length; i++) {
      if(space) ret += " ";
      space = true;
      ret += (this.inner[i] ? this.inner[i].name : "Damage");
    }
    return ret;
  }
}

class TraitPart {
  constructor(name, rarity) {
    this.name = name;
    this.rarity = rarity || 1;
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
    var sz = (1 / 3) + (damage * 0.05);
    if(sz > 1) sz = 1; //ez limit
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
  constructor(name, rarity) {
    super(name, rarity);
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
  }
}

class TraitPartRandom extends TraitPart {
  constructor(name, rarity) {
    super(name, rarity);
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    var dir = new Point(Math.random() - Math.random(), Math.random() - Math.random());
    dir.magnitude = direction.magnitude;
    launcher.launch(this.getBounds(srcEntity, damage), dir);
  }
}

class TraitPartHoming extends TraitPart {
  constructor(name, rarity) {
    super(name, rarity);
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

class TraitPartCircle extends TraitPart {
  constructor(name, rarity, angle) {
    super(name, rarity);
    this.angle = angle || 0;
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    direction = direction.copy();
    direction.rotate(this.angle);
    var angle = Math.PI / 2;

    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
    direction.rotate(angle);
    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
    direction.rotate(angle);
    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
    direction.rotate(angle);
    launcher.launch(this.getBounds(srcEntity, damage), direction.copy());
  }
}

class TraitPartSpread extends TraitPart {
  constructor(name, rarity) {
    super(name, rarity);
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    var launcher = super.fireSpell(room, srcEntity, element, damage);
    var direction1 = direction.copy();
    var direction2 = direction.copy();
    var angle = Math.PI / 8;
    direction1.rotate(angle);
    direction2.rotate(-angle);

    launcher.launch(this.getBounds(srcEntity, damage), direction1);
    launcher.launch(this.getBounds(srcEntity, damage), direction2);
  }
}

//generic traits
var TRAIT_BASIC = new TraitPartBasic("Basic", 1);
var TRAIT_RANDOM = new TraitPartRandom("Random", 1);
var TRAIT_HOMING = new TraitPartHoming("Homing", 4);
var TRAIT_CIRCLE = new TraitPartCircle("Circle", 4);
var TRAIT_CROSS = new TraitPartCircle("Cross", 4, Math.PI / 4);
var TRAIT_SPREAD = new TraitPartSpread("Spread", 2);

//specific traits-

//lightning

//water

//fire

//earth