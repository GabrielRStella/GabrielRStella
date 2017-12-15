//various gui utilities
//such as ordering, arranging, and scaling boxes relative to eachother

var Gui = {
  align: function(outer, inner, funcs, padding) {
    padding = padding || 0;
    for(var i = 0; i < funcs.length; i++) {
      funcs[i](outer, inner, padding);
    }
  },
  scale: function(outer, inner) {
    var minScale = Math.min(outer.width / inner.width, outer.height / inner.height);
    inner.width *= minScale;
    inner.height *= minScale;
  },
  center: function(outer, inner) {
    inner.minX = (outer.width - inner.width) / 2;
  },
  centerX: function(outer, inner) {
  },
  centerY: function(outer, inner) {
  },
  left: function(outer, inner, padding) {
  },
  right: function(outer, inner, padding) {
  },
  top: function(outer, inner, padding) {
  },
  bottom: function(outer, inner, padding) {
  }
};