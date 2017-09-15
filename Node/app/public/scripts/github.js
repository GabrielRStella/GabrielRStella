class Commit extends React.Component {
  render() {
    return React.createElement('p', {}, "commit: " + this.props.commit,
      React.createElement('br', {}));
  }
}

class Commits extends React.Component {
  render() {
    return React.createElement('p', {}, "commits: " + this.props.commits.length,
      this.props.commits.map((commit) => {return React.createElement(Commit, {commit: commit});}));
  }
}

class Error extends React.Component {
  render() {
    return React.createElement('p', {style: {color: "red"}}, "Error: " + this.props.error,
      React.createElement('br', {}));
  }
}

class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "GabrielRStella",
      repo: "GabrielRStella"
    };

    this.onUserChange = this.onUserChange.bind(this);
    this.onRepoChange = this.onRepoChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onUserChange(event) {
    this.setState({user: event.target.value});
  }

  onRepoChange(event) {
    this.setState({repo: event.target.value});
  }

  onSearch() {
    this.props.onSearch(this.state.user, this.state.repo);
  }

//TODO: make the repo selection a dropdown, loaded from the user
  render() {
    //heheheheheh
    var icons = ["input", "list", "play_arrow", "file_download"]; //"play_circle_outlined", 
    var icon = icons[Math.floor(Math.random() * icons.length)];

    return React.createElement('div', {className: "row valign-wrapper"},
      React.createElement('div', {className: "input-field col s5"},
        React.createElement('input', {type: "text", id: "field_user", value: this.state.user, onChange: this.onUserChange}),
        React.createElement('label', {"for": "field_user"}, "User")
      ),
      React.createElement('div', {className: "input-field col s6"},
        React.createElement('input', {type: "text", id: "field_repo", value: this.state.repo, onChange: this.onRepoChange}),
        React.createElement('label', {"for": "field_repo"}, "Repository")
      ),
      React.createElement('div', {className: "btn col s1 black", onClick: this.onSearch},
        React.createElement('i', {className: "material-icons"}, icon)
      )
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commits: null,
      error: null
    };

    this.load = this.load.bind(this);
  }

  load(user, repo) {
    var url = "https://api.github.com/repos/" + user + "/" + repo + "/commits";
    this.setState({commits: null, error: null});
    var thisFake = this;
    $.ajax(url, {
      dataType: "json"
    }).done(function(data, status, obj) {
      thisFake.setState({commits: data, error: null});
    }).fail(function(obj, status, err) {
      thisFake.setState({commits: null, error: err});
    });
  }

  setCommits(commits) {
    this.setState({commits: commits});
  }

  render() {
    var body = null;
    if(this.state.commits) {
      body = React.createElement(Commits, {commits: this.state.commits});
    } else if(this.state.error) {
      body = React.createElement(Error, {error: this.state.error});
    } else {
      body = React.createElement('p', {}, "Hi!");
    }

    return React.createElement('div', {className: "container"}, 
      React.createElement(Options, {onSearch: this.load}),
      React.createElement('div', {style: {border: "solid 1px black"}},
        React.createElement('div', {style: {alignContent: "center", textAlign: "center"}},
          body
        )
      )
    );
  }
}

var rootElement =
  React.createElement(Page, {});
ReactDOM.render(rootElement, document.getElementById('react-app'))