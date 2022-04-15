function timeToString(d) {
  return partsToString(d.getHours(), d.getMinutes());
}

function partsToString(h, m) {
  return h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
}

function stringToDate(hhmm) {
  var d = new Date();
  var pieces = hhmm.split(":");
  d.setHours(pieces[0]);
  d.setMinutes(pieces[1]);
  d.setSeconds(0);
  return d;
}

class Message extends React.Component {
  render() {
    return React.createElement('div', {style: {border: "solid 1px black", fontSize: (this.props.fontSize || 72) + "px"}},
      React.createElement('p', {}, this.props.message,
        React.createElement('br', {})
      )
    );
  }
}

class Body extends React.Component {
  render() {
    return React.createElement('div', {style: {border: "solid 1px black", fontSize: "72px"}},
      React.createElement('p', {}, this.props.message,
        React.createElement('br', {})
      )
    );
  }
}

class Options extends React.Component {
  render() {
    return React.createElement('div', {className: "row valign-wrapper"},
      React.createElement('div', {className: "input-field col m6 s12"},
        React.createElement('input', {type: "time", id: "field_begin", value: this.props.timeBegin, onChange: this.props.onTimeBeginChange}),
        React.createElement('label', {"for": "field_begin"}, "Begin")
      ),
      React.createElement('div', {className: "input-field col m6 s12"},
        React.createElement('input', {type: "time", id: "field_end", value: this.props.timeEnd, onChange: this.props.onTimeEndChange}),
        React.createElement('label', {"for": "field_end"}, "End")
      )
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);

    var currentDate = new Date();
    var nextDate = new Date(currentDate.getTime() + 60000); //1 minute, in milliseconds
    this.state = {
      //https://stackoverflow.com/a/30245911
      timeBegin: timeToString(currentDate),
      timeEnd: timeToString(nextDate),
      timeCurrent: timeToString(currentDate) //is actually just a placeholder to let us setState on tick
    };
    //
    this.onTimeBeginChange = this.onTimeBeginChange.bind(this); //when user updates start time
    this.onTimeEndChange = this.onTimeEndChange.bind(this); //when user updates end time
    this.onTimeChange = this.onTimeChange.bind(this); //when the clock ticks
    
    setInterval(this.onTimeChange, 500);
  }
  
  //options callbacks
  onTimeBeginChange(event) {
    console.log(event.target.value);
	  this.setState({timeBegin: event.target.value});
  }
  onTimeEndChange(event) {
	  this.setState({timeEnd: event.target.value});
  }
  onTimeChange() {
	  this.setState({timeCurrent: timeToString(new Date())});
  }
  //entries callbacks
  onEntryClick(key, value) {
	  this.setState({
		  key: key, value: value
	  });
  }

  render() {
	  var options = React.createElement(Options, {
			onTimeBeginChange: this.onTimeBeginChange, onTimeEndChange: this.onTimeEndChange,
      timeBegin: this.state.timeBegin, timeEnd: this.state.timeEnd
		});
    
    var tBegin = this.state.timeBegin;
    var tEnd = this.state.timeEnd;
    
    var dBegin = stringToDate(tBegin);
    var dEnd = stringToDate(tEnd);
    var dCurrent = new Date();
    
    var sTotal = Math.round((dEnd - dBegin) / 1000);
    var sElapsed = Math.round((dCurrent - dBegin) / 1000);
    var sRemaining = Math.round((dEnd - dCurrent) / 1000);
    
	  var body = React.createElement(Message, {message: "..."});
    
    if(sTotal < 0) {
      var body = React.createElement(Message, {message: "Invalid interval"});
    } else if(sElapsed < 0) {
      var body = React.createElement(Message, {message: "Waiting to start"});
    } else if(sRemaining < 0) {
      var body = React.createElement(Message, {message: "Time is over"});
    } else {
      //counting down a valid interval
      var sRemaining_ = sRemaining % 60;
      var mRemaining = Math.floor(sRemaining / 60);
      var mRemaining_ = mRemaining % 60;
      var hRemaining = Math.floor(mRemaining / 60);
      var msg = (hRemaining > 0 ? (hRemaining.toString() + ":") : "") + partsToString(mRemaining_, sRemaining_) + " Remaining";
      var body = React.createElement(Message, {message: msg});
      console.log("hi");
    }
    
    
    return React.createElement('div', {className: "container"},
      React.createElement('div', {style: {height: '10px'}}),
      React.createElement('h4', {style: {display: 'inline'}}, "Timer"),
      React.createElement('div', {style: {height: '10px'}}),
      options,
      React.createElement('div', {style: {alignContent: "center", textAlign: "center"}},
        body
      ),
      React.createElement('div', {style: {height: '1px'}})
    );
  }
}

var rootElement =
  React.createElement(Page, {});
ReactDOM.render(rootElement, document.getElementById('react-app'))