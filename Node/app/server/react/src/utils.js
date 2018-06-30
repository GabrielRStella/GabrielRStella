var React = require('react');
var styled = require('styled-components');

var palette = {
  "primary": "blue accent-4",
  "primaryText": "blue-text text-accent-4",
  "primaryAccent": "indigo darken-4",
  "primaryAccentText": "indigo-text text-darken-4",
  "secondary": "deep-orange accent-3",
  "secondaryText": "deep-orange-text text-accent-3",
  "secondaryAccent": "red darken-4",
  "secondaryAccentText": "red-text text-darken-4"
};

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
  <nav className={palette.primary}>
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

var footer = (
  <footer className={"page-footer " + palette.primaryAccent}>
    <div className="container">
      <div className="center section">
        <p>
          This site is a work in progress.
          <br/>
          &copy; 2017-2018 Gabriel Stella
        </p>
      </div>
    </div>
  </footer>
);

module.exports = {
  palette: palette,
  nav: nav,
  footer: footer
};