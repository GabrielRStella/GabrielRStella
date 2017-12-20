class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement('p', {style: {display: "inline", fontSize: "36px"}}, "Hello! (projects)");
  }
}

ReactDOM.render(React.createElement(ProjectsPage, {}), document.getElementById('react-app'))