'use strict';

var utils = require('./utils.js');

var React = require('react');

module.exports = [React.createElement('header', null), React.createElement(
  'main',
  null,
  utils.nav,
  React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col s12 m4 push-m8' },
          React.createElement('img', { src: 'img/avatar.jpg', alt: 'A blueberry with a plain facial expression.', title: 'www.mrlovenstein.com', className: 'responsive-img' })
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
          )
        )
      )
    ),
    React.createElement('div', { className: 'divider' }),
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'p',
          null,
          'Hi! I\'m a senior at Texas A&M University. I\'m getting a bachelor\'s degree in computer science with a minor in mathematics. I like to experiment with AI and other random programming things. Check out my games!'
        )
      )
    ),
    React.createElement('div', { className: 'divider' }),
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col s12 m4' },
          React.createElement(
            'a',
            { href: '#' },
            React.createElement(
              'h1',
              { className: 'center' },
              React.createElement(
                'i',
                { className: 'material-icons', style: { fontSize: "120px" } },
                'description'
              )
            ),
            React.createElement(
              'h2',
              { className: 'center' },
              'Resume'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col s12 m4' },
          React.createElement(
            'h1',
            { className: 'center' },
            React.createElement('i', { className: 'fab fa-github', style: { fontSize: "120px" } })
          ),
          React.createElement(
            'h2',
            { className: 'center' },
            'GitHub'
          )
        )
      )
    )
  )
), React.createElement('footer', null)];