class Trait {
  constructor(traits) {
    this.inner = traits || [];
    this.counter = 0;
  }

  add(traitPart) {
    this.inner.push(traitPart);
  }

  hasNext() {
    return inner.length > this.counter;
  }

  get next() {
    var ret = inner[this.counter];
    this.counter++;
    return ret;
  }

  copy() {
    //splice(0) does a shallow copy
    //https://davidwalsh.name/javascript-clone-array
    return new Trait(this.inner.splice(0));
  }
}

class TraitPart {
  constructor(id) {
    this.id = id;
  }

  fireSpell(room, srcEntity, element, damage, direction) {
    
  }
}