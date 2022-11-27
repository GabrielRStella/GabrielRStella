class Options extends React.Component {
  
  render() {
    //parameters:
    //m, c, M, ordered, speed
    
    //materializecss uses the following width calculations to determine screen size category:
    //large: >= 993px
    //small: <= 600px
    if(window.innerWidth <= 600) {
      //small
    
      return React.createElement('p', {}, "uhh...");
    } else {
      //medium or large
      return React.createElement('div', {className: "row valign-wrapper"},
        React.createElement('div', {className: "input-field col l3 s6"},
          React.createElement('input', {type: "time", id: "field_begin", value: this.props.timeBegin, onChange: this.props.onTimeBeginChange}),
          React.createElement('label', {"for": "field_begin"}, "Begin")
        ),
        React.createElement('div', {className: "input-field col l3 s6"},
          React.createElement('input', {type: "time", id: "field_end", value: this.props.timeEnd, onChange: this.props.onTimeEndChange}),
          React.createElement('label', {"for": "field_end"}, "End")
        ),
        React.createElement('div', {className: "input-field col l2 s4"},
          React.createElement('input', {type: "number", step:"1", id: "field_fontsize", value: this.props.fontSize, onChange: this.props.onFontSizeChange}),
          React.createElement('label', {"for": "field_fontsize"}, "Font size")
        ),
        React.createElement('label', {className: "input-field col l4 s8"},
          React.createElement('input', {type: "checkbox", className: "filled-in", id: "field_showpercent", checked: this.props.showPercent, onChange: this.props.onShowPercentChange}),
          React.createElement('span', {}, "Show Percentage")
        )
      );
    }
  }
}

ReactDOM.render(React.createElement(Options, {simulator: SIM}), document.getElementById('react-app'))