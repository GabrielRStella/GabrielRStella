class Entry extends React.Component {
  render() {
    return React.createElement('p', {}, this.props.title,
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

  }

  onUserChange(event) {
    this.setState({user: event.target.value});
  }

  onRepoChange(event) {
    this.setState({repo: event.target.value});
  }

  render() {
    return React.createElement('div', {className: "row"},
      React.createElement('div', {className: "input-field col s6"},
        React.createElement('input', {type: "text", id: "field_user", value: this.state.user, onChange: this.onUserChange}),
        React.createElement('label', {"for": "field_user"}, "User")
      ),
      React.createElement('div', {className: "input-field col s6"},
        React.createElement('input', {type: "text", id: "field_repo", value: this.state.repo, onChange: this.onRepoChange}),
        React.createElement('label', {"for": "field_repo"}, "Repository")
      )
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commits: null
    };

  }

  setCommits(commits) {
    this.setState({commits: commits});
  }

  render() {
    return React.createElement('div', {}, 
      React.createElement(Options, {})
    );
  }
}

var rootElement =
  React.createElement(Page, {});
ReactDOM.render(rootElement, document.getElementById('react-app'))