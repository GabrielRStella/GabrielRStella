//https://stackoverflow.com/a/1199420
function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + "..." : str;
};

class Entry extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(event) {
		this.props.callback(this.props.keyy, this.props.value);
		event.preventDefault();
	}
	
  render() {
	  var key = this.props.keyy;
	  var value = truncate(this.props.value, 50);

    return React.createElement('tr', {},
      React.createElement('td', {}, React.createElement('a', {href: "#", onClick: this.onClick}, key)), //TODO: make key clickable to autofill the "key" field in options
      React.createElement('td', {style: {textAlign: "right"}}, value)
    );
  }
}

class Entries extends React.Component {
  render() {
	  var callback = this.props.callback;
    return React.createElement('div', {},
      React.createElement('style', {}, `
table {
  border: solid 1px black;
}
td, th {
  padding-left: 10px;
  padding-right: 10px;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
      `),
      React.createElement('table', {},
        React.createElement('col', {width: "20%"}),
        React.createElement('col', {width: "80%"}),
        React.createElement('tr', {},
          React.createElement('th', {}, "Key"),
          React.createElement('th', {style: {textAlign: "right"}}, "Value")
        ),
        this.props.entries.map((entry) => {return React.createElement(Entry, {keyy: entry.key, value: entry.value, callback: callback});})
      )
    );
  }
}

class Options extends React.Component {
  render() {
	var icon_reload = "refresh";
	var icon_add = "add";
	var icon_del = "clear";

    return React.createElement('div', {className: "row valign-wrapper"},
      React.createElement('div', {className: "input-field col s3"},
        React.createElement('input', {type: "text", id: "field_key", value: this.props.keyy, onChange: this.props.onKeyChange}),
        React.createElement('label', {"for": "field_key"}, "Key")
      ),
      React.createElement('div', {className: "input-field col s6"},
        React.createElement('input', {type: "text", id: "field_value", value: this.props.value, onChange: this.props.onValueChange}),
        React.createElement('label', {"for": "field_value"}, "Value")
      ),
      React.createElement('div', {className: "btn-flat col s1", onClick: this.props.onAdd},
        React.createElement('i', {className: "material-icons"}, icon_add)
      ),
      React.createElement('div', {className: "btn-flat col s1", onClick: this.props.onDel},
        React.createElement('i', {className: "material-icons"}, icon_del)
      ),
      React.createElement('div', {className: "btn-flat col s1", onClick: this.props.onReload},
        React.createElement('i', {className: "material-icons"}, icon_reload)
      ),
    );
  }
}

class Placeholder extends React.Component {
  render() {
    return React.createElement('div', {style: {border: "solid 1px black"}},
      React.createElement('p', {}, this.props.message,
        React.createElement('br', {})
      )
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
		key: "test-key",
		value: "test-value",
		entries: this.load()
    };

    this.load = this.load.bind(this);
    this.add = this.add.bind(this);
    this.del = this.del.bind(this);
	//
	this.onKeyChange = this.onKeyChange.bind(this);
	this.onValueChange = this.onValueChange.bind(this);
	//
	this.onEntryClick = this.onEntryClick.bind(this);
  }

  load() {
	  var store = window.localStorage;
	  var n = store.length;
	  var entries = [];
	  for(var i = 0; i < n; i++) {
		  var key = store.key(i);
		  var value = store.getItem(key);
		  var entry = {key: key, value: value};
		  entries.push(entry);
	  }
	  this.setState({
		  entries: entries
	  });
	  return entries;
  }
  
  add() {
	  var store = window.localStorage;
	  store.setItem(this.state.key, this.state.value);
	  this.load();
  }
  
  del() {
	  var store = window.localStorage;
	  var prev = store.getItem(this.state.key) || "Key did not exist";
	  this.setState({value: prev}); //want this to set to the deleted value, but it isn't working
	  store.removeItem(this.state.key);
	  this.load();
  }
  
  //options callbacks
  onKeyChange(event) {
	  this.setState({key: event.target.value});
  }
  onValueChange(event) {
	  this.setState({value: event.target.value});
  }
  //entries callbacks
  onEntryClick(key, value) {
	  this.setState({
		  key: key, value: value
	  });
  }

  render() {
	  var options = React.createElement(Options, {
			onKeyChange: this.onKeyChange, onValueChange: this.onValueChange,
			onReload: this.load, onAdd: this.add, onDel: this.del, keyy: this.state.key, value: this.state.value
		});
	  var body = React.createElement(Placeholder, {message: "Web Storage is currently empty."});
	  if(this.state.entries.length > 0) {
		  body = React.createElement(Entries, {entries: this.state.entries, callback: this.onEntryClick});
	  }
    return React.createElement('div', {className: "container"},
      React.createElement('div', {style: {height: '10px'}}),
      React.createElement('h4', {style: {display: 'inline'}},
		"Browser Storage Interface ",
		React.createElement('a', {href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API", target: "_blank", rel: "noopener noreferrer"}, React.createElement('i', {className: "material-icons"}, "help_outline"))
	  ),
      React.createElement('div', {style: {height: '10px'}}),
      options,
      React.createElement('div', {style: {alignContent: "center", textAlign: "center"}},
        body,
        React.createElement('p', {style: {fontSize: "10px"}}, "Click on a record to copy its key and value to the text fields. Deleting an entry will copy its old value to the value text field.")
      ),
      React.createElement('div', {style: {height: '1px'}})
    );
  }
}

var rootElement =
  React.createElement(Page, {});
ReactDOM.render(rootElement, document.getElementById('react-app'))