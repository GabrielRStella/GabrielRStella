class GameEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
console.log(this.props);
    return React.createElement('div', {style: {fontSize: "12px"}}, this.props.title);
  }
}

class GamesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    var url = "/api/games";
    var thisFake = this;

    $.ajax(url, {
      dataType: "json"
    }).always(function(){
      thisFake.setState({games: null, error: null});
    }).done(function(data, status, obj) {
      thisFake.setState({games: data, error: null});
    }).fail(function(obj, status, err) {
      thisFake.setState({games: null, error: err});
    });
  }

  render() {
    var child;
    if(this.state.games) {
      child = this.state.games.map(x => React.createElement(GameEntry, x));
    } else if(this.state.error) {
      child = "error!";
    } else {
      child = "Loading...";
    }
    return React.createElement('div', {style: {display: "inline", fontSize: "36px"}}, child);
  }
}

ReactDOM.render(React.createElement(GamesPage, {}), document.getElementById('react-app'))