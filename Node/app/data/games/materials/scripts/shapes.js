class Body {
  //poly = single polygon or array of polygons
  constructor(material, poly, grainDirection) {
    this.material = material;

    if(!(poly instanceof Array)) {
      poly = [poly];
    }
    this.polygons = poly;

    this.grainDirection = grainDirection || new Point();

    //TODO: store fractures and stuff?
  }
}