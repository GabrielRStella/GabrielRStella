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

class Options extends React.Component {
  createContent(args) {
  }
  
  render() {
    //materializecss uses the following width calculations to determine screen size category:
    //large: >= 993px
    //small: <= 600px
    if(window.innerWidth <= 600) {
      //small
    
      return React.createElement('div', {},
        React.createElement('div', {className: "row"},
          React.createElement('div', {className: "input-field col l3 s6"},
            React.createElement('input', {type: "time", id: "field_begin", value: this.props.timeBegin, onChange: this.props.onTimeBeginChange}),
            React.createElement('label', {"for": "field_begin"}, "Begin")
          ),
          React.createElement('div', {className: "input-field col l3 s6"},
            React.createElement('input', {type: "time", id: "field_end", value: this.props.timeEnd, onChange: this.props.onTimeEndChange}),
            React.createElement('label', {"for": "field_end"}, "End")
          ),
        ),
        React.createElement('div', {className: "row valign-wrapper"},
          React.createElement('div', {className: "input-field col l2 s4"},
            React.createElement('input', {type: "number", step:"1", id: "field_fontsize", value: this.props.fontSize, onChange: this.props.onFontSizeChange}),
            React.createElement('label', {"for": "field_fontsize"}, "Font size")
          ),
          React.createElement('label', {className: "input-field col l4 s8"},
            React.createElement('input', {type: "checkbox", className: "filled-in", id: "field_showpercent", checked: this.props.showPercent, onChange: this.props.onShowPercentChange}),
            React.createElement('span', {}, "Show Percentage")
          ),
          React.createElement('div', {className: "input-field col l2 s4"},
            React.createElement('input', {type: "number", step:"1", id: "field_pace", value: this.props.pace, onChange: this.props.onPaceChange}),
            React.createElement('label', {"for": "field_pace"}, "Pace")
          ),
        )
      );
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
        ),
        React.createElement('div', {className: "input-field col l2 s4"},
            React.createElement('input', {type: "number", step:"1", id: "field_pace", value: this.props.pace, onChange: this.props.onPaceChange}),
            React.createElement('label', {"for": "field_pace"}, "Pace")
        )
      );
    }
  }
}

//TODO: could have it parse default time values from the URL query stringToDate
//https://www.sitepoint.com/get-url-parameters-with-javascript/
//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
class Page extends React.Component {
  constructor(props) {
    super(props);

    var currentDate = new Date();
    var nextDate = new Date(currentDate.getTime() + 60000); //1 minute, in milliseconds
    this.state = {
      //https://stackoverflow.com/a/30245911
      timeBegin: timeToString(currentDate),
      timeEnd: timeToString(nextDate),
      timeCurrent: timeToString(currentDate), //is actually just a placeholder to let us setState on tick
	  //
	  fontSize: 72,
	  showPercent: false,
      pace: 0
    };
    //
    this.onTimeBeginChange = this.onTimeBeginChange.bind(this); //when user updates start time
    this.onTimeEndChange = this.onTimeEndChange.bind(this); //when user updates end time
    this.onTimeChange = this.onTimeChange.bind(this); //when the clock ticks
    this.onFontSizeChange = this.onFontSizeChange.bind(this); //when the clock ticks
    this.onShowPercentChange = this.onShowPercentChange.bind(this); //when the clock ticks
    this.onPaceChange = this.onPaceChange.bind(this); //when the clock ticks
    
    setInterval(this.onTimeChange, 500);
  }
  
  //options callbacks
  onTimeBeginChange(event) {
	  this.setState({timeBegin: event.target.value});
  }
  onTimeEndChange(event) {
	  this.setState({timeEnd: event.target.value});
  }
  onTimeChange() {
	  this.setState({timeCurrent: timeToString(new Date())});
  }
  onFontSizeChange(event) {
	  this.setState({fontSize: event.target.value});
  }
  onShowPercentChange(event) {
	  this.setState({showPercent: !this.state.showPercent});
  }
  onPaceChange(event) {
	  this.setState({pace: event.target.value});
  }

  render() {
	  var options = React.createElement(Options, {
			onTimeBeginChange: this.onTimeBeginChange, onTimeEndChange: this.onTimeEndChange,
			timeBegin: this.state.timeBegin, timeEnd: this.state.timeEnd,
			onFontSizeChange: this.onFontSizeChange, onShowPercentChange: this.onShowPercentChange,
			fontSize: this.state.fontSize, showPercent: this.state.showPercent,
            onPaceChange: this.onPaceChange, pace: this.state.pace
		});
    
    var tBegin = this.state.timeBegin;
    var tEnd = this.state.timeEnd;
    
    var dBegin = stringToDate(tBegin);
    var dEnd = stringToDate(tEnd);
    var dCurrent = new Date();
    
    var sTotal = Math.round((dEnd - dBegin) / 1000);
    var sElapsed = Math.round((dCurrent - dBegin) / 1000);
    var sRemaining = Math.round((dEnd - dCurrent) / 1000);
    
	var msg = "...";
    
    if(sTotal < 0) {
      msg = "Invalid interval";
    } else if(sElapsed < 0) {
      var sToStart = -sElapsed;
      var mToStart = Math.floor(sToStart / 60);
      var hToStart = Math.floor(mToStart / 60);
      var tString = "";
      if(hToStart > 0) {
        tString = hToStart.toString() + "h";
      } else if(mToStart > 0) {
        tString = mToStart.toString() + "m";
      } else {
        tString = sToStart.toString() + "s";
      }
      msg = "Waiting to start (" + tString + ")";
    } else if(sRemaining <= 0) {
      msg = "Time is over";
    } else {
      //counting down a valid interval
      var sRemaining_ = sRemaining % 60;
      var mRemaining = Math.floor(sRemaining / 60);
      var mRemaining_ = mRemaining % 60;
      var hRemaining = Math.floor(mRemaining / 60);
      var timeString = "";
      if(hRemaining > 0) {
        //h:mm:ss
        timeString = hRemaining.toString() + ":" + partsToString(mRemaining_, sRemaining_);
      } else if(mRemaining_ > 0) {
        //m:ss
        timeString = mRemaining_.toString() + ":" + sRemaining_.toString().padStart(2, '0');
      } else {
        //s
        timeString = sRemaining_.toString() + "s";
      }
      msg = timeString + " Remaining";
      if(this.state.showPercent) {
        var percentElapsed = Math.floor(100 * sElapsed / sTotal);
        msg += " (" + percentElapsed + "%)";
      }
      if(this.state.pace > 0) {
        var percentElapsed = sElapsed / sTotal;
        var progress = Math.ceil(percentElapsed * this.state.pace);
        msg += " (" + progress + "/" + this.state.pace + ")";
      }
    }
	var body = React.createElement(Message, {message: msg, fontSize: this.state.fontSize});
    
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