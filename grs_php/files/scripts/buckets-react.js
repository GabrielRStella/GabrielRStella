class Options extends React.Component {
  
  constructor(props) {
    super(props);
    
    var sim = props.simulator;
    this.state = {
      m: sim.m,
      c: sim.c,
      M: sim.M,
      ordered: sim.ordered
      //speed can be set any time
    };
  }
  
  onChange_m(event) {
    this.setState({m: event.target.value});
  }
  
  onChange_c(event) {
    this.setState({c: event.target.value});
  }
  
  onChange_M(event) {
    this.setState({M: event.target.value});
  }
  
  onChange_speed(event) {
    var sim = this.props.simulator;
    sim.speed = parseInt(event.target.value);
    this.setState({}); //trigger rebuild :^) hax
  }
  
  onChange_ordered(event) {
    this.setState({ordered: !this.state.ordered});
  }
  
  onChange_show_free(event) {
    var sim = this.props.simulator;
    sim.show_free = !sim.show_free;
    this.setState({}); //trigger rebuild
  }
  
  onRestart() {
    //sync changes to simulator
    var sim = this.props.simulator;
    sim.m = parseInt(this.state.m);
    sim.c = parseInt(this.state.c);
    sim.M = parseInt(this.state.M);
    sim.ordered = this.state.ordered;
    sim.restart();
  }
  
  render() {
    //parameters:
    //m, c, M, ordered, speed
    var sim = this.props.simulator;
    
    //materializecss uses the following width calculations to determine screen size category:
    //large: >= 993px
    //small: <= 600px
    if(window.innerWidth <= 600) {
      //small
    
      return React.createElement('p', {}, "uhh... mobile not yet supported :^) cya soon!");
    } else {
      //medium or large
      return React.createElement('div', {className: "row valign-wrapper"},
        React.createElement('div', {className: "input-field col l2 s4"},
          React.createElement('input', {type: "number", step:"1", id: "field_m", value: this.state.m, onChange: this.onChange_m.bind(this)}),
          React.createElement('label', {"for": "field_m"}, "Buckets")
        ),
        React.createElement('div', {className: "input-field col l2 s4"},
          React.createElement('input', {type: "number", step:"1", id: "field_c", value: this.state.c, onChange: this.onChange_c.bind(this)}),
          React.createElement('label', {"for": "field_c"}, "Group Size")
        ),
        React.createElement('div', {className: "input-field col l2 s4"},
          React.createElement('input', {type: "number", step:"1", id: "field_M", value: this.state.M, onChange: this.onChange_M.bind(this)}),
          React.createElement('label', {"for": "field_M"}, "Memory")
        ),
        React.createElement('div', {className: "input-field col l2 s4"},
          React.createElement('input', {type: "number", step:"1", id: "field_speed", value: sim.speed, onChange: this.onChange_speed.bind(this)}),
          React.createElement('label', {"for": "field_speed"}, "Speed")
        ),
        React.createElement('label', {className: "input-field col l2 s8"},
          React.createElement('input', {type: "checkbox", className: "filled-in", id: "field_ordered", checked: this.state.ordered, onChange: this.onChange_ordered.bind(this)}),
          React.createElement('span', {}, "Ordered")
        ),
        React.createElement('label', {className: "input-field col l2 s8"},
          React.createElement('input', {type: "checkbox", className: "filled-in", id: "field_show_free", checked: sim.show_free, onChange: this.onChange_show_free.bind(this)}),
          React.createElement('span', {}, "Show Free")
        ),
        React.createElement('div', {className: "col s1"}),
        React.createElement('div', {className: "btn col s1", onClick: this.onRestart.bind(this)},
          React.createElement('i', {className: "material-icons"}, "refresh")
        )
      );
    }
  }
}

ReactDOM.render(React.createElement(Options, {simulator: SIM}), document.getElementById('react-app'))