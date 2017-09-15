var days = [
"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
var months = [
"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

class Commit extends React.Component {
  render() {
    var commit = this.props.commit;
    var url = commit.html_url;
    commit = commit.commit;
    var author = commit.author.name;
    var date = new Date(commit.author.date);
    var dateString = days[date.getDay()] + ", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    var msg = commit.message.replace("\n\n", " || ");

    return React.createElement('tr', {},
      React.createElement('td', {}, author),
      React.createElement('td', {}, msg),
      React.createElement('td', {}, dateString));
  }
}

class Commits extends React.Component {
  render() {
    return React.createElement('div', {},
      React.createElement('style', {}, `
table {
  border: solid 1px black;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
      `),
      React.createElement('table', {},
        React.createElement('col', {width: "10%"}),
        React.createElement('col', {width: "50%"}),
        React.createElement('col', {width: "30%"}),
        React.createElement('tr', {},
          React.createElement('th', {}, "Author"),
          React.createElement('th', {}, "Message"),
          React.createElement('th', {}, "Date")
        ),
        this.props.commits.map((commit) => {return React.createElement(Commit, {commit: commit});})
      )
    );
  }
}

class Error extends React.Component {
  render() {
    return React.createElement('div', {style: {border: "solid 1px red"}},
      React.createElement('p', {style: {color: "red"}}, "Error: " + this.props.error,
        React.createElement('br', {})
      )
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
    this.onClear = this.onClear.bind(this);
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

  onClear() {
    this.setState({
      user: "GabrielRStella",
      repo: "GabrielRStella"
    });
    this.props.onSearch(null, null);
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
      React.createElement('div', {className: "input-field col s5"},
        React.createElement('input', {type: "text", id: "field_repo", value: this.state.repo, onChange: this.onRepoChange}),
        React.createElement('label', {"for": "field_repo"}, "Repository")
      ),
      React.createElement('div', {className: "btn-flat col s1", onClick: this.onClear},
        "Reset"
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

    //this.load("GabrielRStella", "GabrielRStella");
  }

  load(user, repo) {
    if(!user || !repo) {
      this.setState({commits: null, error: null});
      return;
    }

    var url = "https://api.github.com/repos/" + user + "/" + repo + "/commits";
    var thisFake = this;

    $.ajax(url, {
      dataType: "json"
    }).always(function(){
      thisFake.setState({commits: null, error: null});
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
      body = React.createElement(Placeholder, {message: "Hi! Please enter a github user and repository name, then press the button to load commits."});
    }

    return React.createElement('div', {className: "container"},
      React.createElement('h4', {}, "GitHub Commit Tracker"),
      React.createElement(Options, {onSearch: this.load}),
      React.createElement('div', {style: {alignContent: "center", textAlign: "center"}},
        body,
        React.createElement('p', {style: {fontSize: "10px"}}, "This page uses jQuery to make connections directly to the GitHub api.")
      )
    );
  }
}

var rootElement =
  React.createElement(Page, {});
ReactDOM.render(rootElement, document.getElementById('react-app'))