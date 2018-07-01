var utils = require('./utils.js');

var React = require('react');

function Game(props) {
  return (
    <div className="col s12 m4 l3">
      <div className="card">
        <div class="card-image">
          <img src={props.img}>
          <span class="card-title">{props.title}</span>
        </div>
        <div class="card-content">
          <p>{props.caption}</p>
        </div>
        <div class="card-action">
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
          <div className="row">
            hi
          </div>
        </div>
      </div>
    </main>
  ),
  utils.footer
]);