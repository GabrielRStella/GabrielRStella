class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);

    var url = "/api/projects";
    var thisFake = this;

    this.state = {};

    $.ajax(url, {
      dataType: "json"
    }).always(function(){
      thisFake.setState({projects: null, error: null});
    }).done(function(data, status, obj) {
      thisFake.setState({projects: data, error: null});
    }).fail(function(obj, status, err) {
      thisFake.setState({projects: null, error: err});
    });
  }

  render() {
    var child;
    if(this.state.projects) {
      //display project tiles
    } else if(this.state.error) {
      child = React.createElement('p', {style: {color: 'red'}}, "Error: " + this.state.error);
    } else {
      child = React.createElement('p', {}, "Loading...");
    }
    return React.createElement('div', {}, child);
  }
}

ReactDOM.render(React.createElement(ProjectsPage, {}), document.getElementById('react-app'))