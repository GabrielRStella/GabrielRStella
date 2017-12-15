//various gui utilities
//such as ordering, arranging, and scaling boxes relative to eachother

var Gui = {
  scale: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  }
};