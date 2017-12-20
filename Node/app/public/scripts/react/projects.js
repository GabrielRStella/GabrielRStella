//https://stackoverflow.com/a/28985475
//http://jsfiddle.net/38Tnx/1425/

class ProjectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    window.location.assign(this.props.url);
  }

  render() {
    var width = 25;
    return React.createElement('div', {},
      React.createElement('div', {className: 'square-box', style: {width: (width + '%')}},
        React.createElement('div', {className: 'square-content'},
          React.createElement('div', {className: 'square-inner', onClick: this.onClick},
            React.createElement('img', {style: {position: 'relative', minWidth: '100%', minHeight: '100%'}, src: this.props.thumbnail}),
            React.createElement('p', {className: 'img-overlay', style: {color: this.props.color}}, this.props.title),
          )
        )
      )
    );
  }
}

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
      child = React.createElement('div',
        {style: {overflow: 'auto'}},
        this.state.projects.map(x => React.createElement(ProjectEntry, x))
      );
    } else if(this.state.error) {
      child = React.createElement('p', {style: {color: 'red'}}, "Error: " + this.state.error);
    } else {
      child = React.createElement('p', {}, "Loading...");
    }
    return React.createElement('div', {},
      React.createElement('link', {rel: 'stylesheet', href: 'static/css/projects.css'}),
      child
    );
  }
}

ReactDOM.render(React.createElement(ProjectsPage, {}), document.getElementById('react-app'))