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
        { className: 'container' },
        React.createElement(
          'p',
          null,
          'Hi! 1'
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
          'Hi! 2'
        )
      )
    )
  )
), React.createElement('footer', null)];