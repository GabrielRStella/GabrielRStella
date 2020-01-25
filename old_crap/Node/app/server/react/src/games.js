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
      link: ("/games/" + d.file),
      img: ("/data/games/" + d.file + "/" + game.thumbnail),
      text: (game.text || "")
    };
  });
  //also sort based on date

  return (
    <div>
      {games.map((x, i) => <Game
          key={i} {...x}
        />)}
    </div>
  );
}

function Game(props) {
  return (
    <div className="row">
    <div className="col s12">
      <div className="card">
        <div className="card-image">
          <img src={props.img}/>
          <span className={"card-title " + props.text}>{props.title}</span>
          <a href={props.link} className={"btn-floating halfway-fab waves-effect waves-light black"}><i className={"material-icons"}>play_arrow</i></a>
        </div>
        <div className="card-content">
          <p>{props.caption}</p>
        </div>
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