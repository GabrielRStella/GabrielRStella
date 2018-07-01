var utils = require('./utils.js');

var React = require('react');

var Loader = require('../../data')
var loader = new Loader("games", "game.json");

function Games(props) {
  var data = loader.loadSync();
  //TODO: fill in defaults
  var games = data.map(function(d) {
    var game = d.data;
    return {
      title: game.title,
      caption: game.caption,
      url: ("/games/" + d.file),
      thumbnail: ("/data/games/" + d.file + "/" + game.thumbnail)
    };
  });

  return (
    <div className="row">
      {games.map((x, i) => <Game
          key={i} title={x.title} caption={x.caption} link={x.url} img={x.thumbnail}
        />)}
    </div>
  );
}

function Game(props) {
  return (
    <div className="col s12 m4 l3">
      <div className="card">
        <div className="card-image">
          <img src={props.img} />
          <span className="card-title">{props.title}</span>
        </div>
        <div className="card-content">
          <p>{props.caption}</p>
        </div>
        <div className="card-action">
          <a href={props.link}>Play</a>
        </div>
      </div>
    </div>
  );
}

module.exports = ([
  (
    <header>
    </header>
  ),
  (
    <main>
      {utils.nav}
      <div className="container">
        <div className="section">
          <Games/>
        </div>
      </div>
    </main>
  ),
  utils.footer
]);