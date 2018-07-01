'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var utils = require('./utils.js');

var React = require('react');

var options = [{
  "title": "Resume",
  "to": "/resume.pdf",
  "icon": "fas fa-file-alt"
}, {
  "title": "GitHub",
  "to": "https://github.com/GabrielRStella/",
  "icon": "fab fa-github"
}, {
  "title": "Apps",
  "to": "#",
  "icon": "fab fa-app-store-ios"
  //others: youtube, twitter, linkedin, ...?
}];

//former avatar
//<img src="img/avatar_old.jpg" alt="A blueberry with a plain facial expression." title="www.mrlovenstein.com" className="responsive-img"></img>

var intro = React.createElement(
  'div',
  { className: 'section' },
  React.createElement(
    'div',
    { className: 'row' },
    React.createElement(
      'div',
      { className: 'col s12 m4 push-m8' },
      React.createElement('img', { src: '/avatar', alt: 'A collection of colliding circles.', title: 'Circles', className: 'responsive-img' })
    ),
    React.createElement(
      'div',
      { className: 'col s12 m8 pull-m4' },
      React.createElement(
        'div',
        { className: 'center-align' },
        React.createElement(
          'h1',
          null,
          'Gabriel Stella'
        )
      ),
      React.createElement(
        'p',
        null,
        'Hi! I\'m a senior at Texas A&M University. I\'m getting a bachelor\'s degree in computer science with a minor in mathematics. I like to experiment with artificial intelligence and make games. Thanks for checking out my website!'
      )
    )
  )
);

function Option(props) {
  return React.createElement(
    'div',
    { className: 'col s12 m4' },
    React.createElement(
      'a',
      { href: props.to },
      React.createElement(
        'div',
        { className: "center " + utils.palette.secondaryText },
        React.createElement('i', { className: props.icon, style: { fontSize: "120px" } }),
        React.createElement(
          'h3',
          null,
          props.title
        ),
        React.createElement('div', { className: 'divider' })
      )
    )
  );
}

module.exports = [React.createElement('header', null), React.createElement(
  'main',
  null,
  utils.nav,
  React.createElement(
    'div',
    { className: 'container' },
    intro,
    React.createElement('div', { className: 'divider' }),
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement('br', null),
      React.createElement(
        'div',
        { className: 'row' },
        options.map(function (x, i) {
          return React.createElement(Option, _extends({ key: i }, x));
        })
      )
    )
  )
), utils.footer];