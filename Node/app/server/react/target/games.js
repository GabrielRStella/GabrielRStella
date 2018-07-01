'use strict';

var utils = require('./utils.js');

var React = require('react');

var Loader = require('../../data');
var loader = new Loader("games", "game.json");

function Games(props) {
  var data = loader.loadSync();
  //TODO: fill in defaults
  var games = data.map(function (d) {
    var game = d.data;
    return {
      title: game.title,
      caption: game.caption,
      url: "/games/" + d.file,
      thumbnail: "/data/games/" + d.file + "/" + game.thumbnail
    };
  });

  return React.createElement(
    'div',
    { className: 'row' },
    games.map(function (x, i) {
      return React.createElement(Game, {
        key: i, title: x.title, caption: x.caption, link: x.url, img: x.thumbnail
      });
    })
  );
}

function Game(props) {
  return React.createElement(
    'div',
    { className: 'col s12 m4 l3' },
    React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'div',
        { className: 'card-image' },
        React.createElement('img', { src: props.img }),
        React.createElement(
          'span',
          { className: 'card-title' },
          props.title
        )
      ),
      React.createElement(
        'div',
        { className: 'card-content' },
        React.createElement(
          'p',
          null,
          props.caption
        )
      ),
      React.createElement(
        'div',
        { className: 'card-action' },
        React.createElement(
          'a',
          { href: props.link },
          'Play'
        )
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
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(Games, null)
    )
  )
), utils.footer];