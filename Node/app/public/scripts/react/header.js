class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement('div', {},
      React.createElement('div', {style: {
        background: 'url("/header")',
        height: '150px'
      }}, React.createElement('div', {style: {
          'margin': '20px',
          'fontSize': '72px',
          'display': 'inline',
          'height': '150px'
        }}, "Gabriel R Stella")),
      );
  }
}

ReactDOM.render(React.createElement(PageHeader, {}), document.getElementById('react-app-header'))