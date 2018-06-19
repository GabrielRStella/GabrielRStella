class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement('p', {style: {display: "inline", fontSize: "36px"}}, "Hello! (index)");
  }
}

ReactDOM.render(React.createElement(IndexPage, {}), document.getElementById('react-app'))