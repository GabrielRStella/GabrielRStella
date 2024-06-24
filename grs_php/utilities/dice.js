class OneDie extends React.Component {
  
  constructor(props) {
    super(props);
    //props:
    //info: {name: "die name", faces: ["die", "faces"]}
    //index: integer
    //callback: die update callback f(index, new_info)

    this.state = {
      new_face_name: "",
      active: -1
    };
    
    this.onFaceNameChange = this.onFaceNameChange.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickRoll = this.onClickRoll.bind(this);
  }

  onFaceNameChange(event) {
    this.setState({new_face_name: event.target.value});
  }
  
  onClickNew() {
    var new_info = {
      name: this.props.info.name,
      faces: this.props.info.faces.concat([this.state.new_face_name || "?"])
    };
    this.props.callback(this.props.index, new_info);
  }
  
  onClickDelete() {
    this.props.callback(this.props.index, null);
  }
  
  onClickRoll() {
    var n = this.props.info.faces.length;
    if(n == 0) return;
    var new_active = this.state.active;
    while(new_active == this.state.active) {
      new_active = Math.floor(Math.random() * n);
      if(n == 1) break;
    }
    this.setState({active: new_active});
  }

  onClickFace(index) {
    //delete face
    var new_info = {
      name: this.props.info.name,
      faces: this.props.info.faces.toSpliced(index, 1)
    };
    this.props.callback(this.props.index, new_info)
  }
  
  render() {
    return React.createElement('div', {style: {border: "1px solid black"}},
      React.createElement('div', {className: "row valign-wrapper"},
        React.createElement('h4', {style: {display: "inline"}},
          this.props.info.name
        ),
        React.createElement('div', {className: "input-field col l3 s6"},
          React.createElement('input', {type: "text", id: "field_face_name", value: this.state.new_face_name, onChange: this.onFaceNameChange}),
          React.createElement('label', {"for": "field_face_name"}, "Face Name")
        ),
        React.createElement('div', {className: "btn col l2 s6 purple", onClick: this.onClickNew},
          "New Face"
        ),
        React.createElement('div', {className: "btn col l2 s6 red", onClick: this.onClickDelete},
          "Delete Die"
        ),
        React.createElement('div', {className: "btn col l1 s6 black", onClick: this.onClickRoll},
          "Roll"
        ),
        React.createElement('div', {style: {width: "20px"}},
        )
      ),
      React.createElement('div', {className: "row valign-wrapper"},
        React.createElement('div', {className: "container"},
        this.props.info.faces.map((face, index) => {
          return [' ', React.createElement('div', {className: "btn col l2 s6 " + (index == this.state.active ? "black" : "red"), onClick: this.onClickFace.bind(this, index)},
            face
            )]
          })
        )
      )
    );
  }
}

class Dice extends React.Component {
  
  constructor(props) {
    super(props);
    
	  var store = window.localStorage;
    this.state = {
      new_die_name: "",
      dice: JSON.parse(store.getItem("dice_info") || "[]")
    };

    this.onDieNameChange = this.onDieNameChange.bind(this);
    this.onClickNew = this.onClickNew.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
    //
    this.onDieChanged = this.onDieChanged.bind(this);
  }

  onDieNameChange(event) {
    this.setState({new_die_name: event.target.value});
  }
  
  onClickNew() {
    var new_die = {
      name: this.state.new_die_name || "New Die",
      faces: ["?"]
    };
    this.setState({dice: this.state.dice.concat([new_die])});
  }
  
  onClickClear() {
    this.setState({dice: []});
  }

  onDieChanged(index, new_info) {
    if(new_info != null) this.setState({dice: this.state.dice.toSpliced(index, 1, new_info)});
    else this.setState({dice: this.state.dice.toSpliced(index, 1)});
  }
  
  render() {
	  var store = window.localStorage;
    store.setItem("dice_info", JSON.stringify(this.state.dice));
    //
    return React.createElement('div', {className: "container"},
      React.createElement('div', {className: "row valign-wrapper"},
        React.createElement('div', {className: "input-field col l6"},
          React.createElement('input', {type: "text", id: "field_die_name", value: this.state.new_die_name, onChange: this.onDieNameChange}),
          React.createElement('label', {"for": "field_die_name"}, "Die Name")
        ),
        React.createElement('div', {className: "btn col l2 s12 purple", onClick: this.onClickNew},
          "New Die"
        ),
        React.createElement('div', {className: "btn col l2 s12 red", onClick: this.onClickClear},
          "Clear Dice"
        )
      ),
      this.state.dice.map((one_die, idx) => {return [' ', React.createElement(OneDie, {info: one_die, index: idx, callback: this.onDieChanged}), React.createElement('br', {})];})
    );
  }
}

ReactDOM.render(React.createElement(Dice), document.getElementById('react-app'))