'use strict';

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

var navLinks = [{
  "to": "/",
  "title": "Home"
}, {
  "to": "/games",
  "title": "Games"
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
}];

//TODO: have to test mobile navbar
var nav = React.createElement(
  'nav',
  { className: palette.primary },
  React.createElement(
    'div',
    { className: 'nav-wrapper container' },
    React.createElement(
      'a',
      { href: '#', className: 'brand-logo' },
      'Gabriel R Stella'
    ),
    React.createElement(
      'ul',
      { className: 'right hide-on-med-and-down' },
      navLinks.map(function (x, i) {
        return React.createElement(
          'li',
          { key: i },
          React.createElement(
            'a',
            { href: x.to },
            x.title
          )
        );
      })
    ),
    React.createElement(
      'ul',
      { id: 'nav-mobile', className: 'sidenav' },
      navLinks.map(function (x, i) {
        return React.createElement(
          'li',
          { key: i },
          React.createElement(
            'a',
            { href: x.to },
            x.title
          )
        );
      })
    ),
    React.createElement(
      'a',
      { href: '#', 'data-target': 'nav-mobile', className: 'sidenav-trigger' },
      React.createElement(
        'i',
        { className: 'material-icons' },
        'menu'
      )
    )
  )
);

var footer = React.createElement(
  'footer',
  { className: "page-footer " + palette.primaryAccent },
  React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'div',
      { className: 'center section' },
      React.createElement(
        'p',
        null,
        'This site is a work in progress.',
        React.createElement('br', null),
        '\xA9 2017-2018 Gabriel Stella'
      )
    )
  )
);

module.exports = {
  palette: palette,
  nav: nav,
  footer: footer
};