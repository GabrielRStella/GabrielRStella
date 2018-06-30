var utils = require('./utils.js');

var React = require('react');

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
            <div className="col s12 m4 push-m8">
              <img src="img/avatar.jpg" alt="A blueberry with a plain facial expression." title="www.mrlovenstein.com" className="responsive-img"></img>
            </div>
            <div className="col s12 m8 pull-m4">
              <div className="center-align">
                <h1>Gabriel Stella</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="section">
          <div className="container">
            <p>
              Hi!
              I'm a senior at Texas A&M University.
              I'm getting a bachelor's degree in computer science with a minor in mathematics.
              I like to experiment with AI and other random programming things.
              Check out my games!
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="section">
          <div className="row">
            <div className="col s12 m4">
              <a href="#">
              <h1 className="center">
                <i className="material-icons" style={{fontSize: "120px"}}>description</i>
              </h1>
              <h2 className="center">
                Resume
              </h2>
              </a>
            </div>
            <div className="col s12 m4">
              <h1 className="center">
                <i className="fab fa-github" style={{fontSize: "120px"}}></i>
              </h1>
              <h2 className="center">
                GitHub
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  ),
  (
    <footer>
    </footer>
  )
]);