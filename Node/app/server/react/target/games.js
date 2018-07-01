'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
      link: "/games/" + d.file,
      img: "/data/games/" + d.file + "/" + game.thumbnail,
      text: game.text || ""
    };
  });
  //also sort based on date

  return React.createElement(
    'div',
    { className: 'row' },
    games.map(function (x, i) {
      return React.createElement(Game, _extends({
        key: i }, x));
    })
  );
}

function Game(props) {
  return React.createElement(
    'div',
    { className: 'col s12 m4' },
    React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'div',
        { className: 'card-image' },
        React.createElement('img', { src: props.img }),
        React.createElement(
          'span',
          { className: "card-title " + props.text },
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
          { href: props.link, className: utils.palette.secondaryText },
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