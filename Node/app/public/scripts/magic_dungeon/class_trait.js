var TRAITS = [];
var TRAIT_COUNT = 0;

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

var TRAIT_BASIC = new TraitPartBasic(0);