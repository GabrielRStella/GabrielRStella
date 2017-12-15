class Trait {
  constructor(traits) {
    this.inner = traits || [];
  }

  add(trait) {
    this.inner.push(trait);
  }

  hasNext() {
    return inner.length > 0;
  }

  get next() {
    return inner[0];
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