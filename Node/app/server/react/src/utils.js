var React = require('react');
var styled = require('styled-components');

var navLinks = [
  {
    "to": "/",
    "title": "Home"
  },
  {
    "to": "/games",
    "title": "Games"
  }
/*
,
  {
    "to": "/apps",
    "title": "Apps"
  },
  {
    "to": "/projects",
    "title": "Projects"
  },
  {
    "to": "/toys",
    "title": "Toys"
  }
*/
];

//TODO: have to test mobile navbar
var nav = (
  <nav className="blue accent-4">
    <div className="nav-wrapper container">
      <a href="#" className="brand-logo">Gabriel R Stella</a>
      <ul className="right hide-on-med-and-down">
        {navLinks.map((x, i) => (<li key={i}><a href={x.to}>{x.title}</a></li>))}
      </ul>
      <ul id="nav-mobile" className="sidenav">
        {navLinks.map((x, i) => (<li key={i}><a href={x.to}>{x.title}</a></li>))}
      </ul>
      <a href="#" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
    </div>
  </nav>
);

module.exports = {
  test: (
    <p>Test p</p>
  ),
  nav: nav
};