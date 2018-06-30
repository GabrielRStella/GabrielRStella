'use strict';

var React = require('react');
var styled = require('styled-components');

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
  { className: 'blue accent-4' },
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

module.exports = {
  test: React.createElement(
    'p',
    null,
    'Test p'
  ),
  nav: nav
};