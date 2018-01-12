class Material {
  //hardness = resistance to breaking/deformation
  //brittleness = resistance to bending (it shatters instead)
  //am i really going to implement bending? probably not. whatever.
  //grain = if there is a linear grain that affects fracturing (and if so, how strong is it)
  constructor(name, density, hardness, brittleness, grain) {
    this.name = name;
    this.density = density;
    this.hardness = hardness;
    this.brittleness = brittleness;
    this.grain = grain;
  }
}

var MATERIALS = [
  new Material("simple", 1, 1, 0.5, 0),
  new Material("metal", 10, 2, 0.2, 0),
  new Material("glass", 0.1, 0.5, 10, 0),
  new Material("wood", 0.1, 1, 0.5, 1)
];

var Materials = {};

for(var i = 0; i < MATERIALS.length; i++) {
  var mat = MATERIALS[i];
  Materials[mat.name] = mat;
}