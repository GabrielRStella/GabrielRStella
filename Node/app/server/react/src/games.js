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
          <div className="container">
            <p>
              Hi! 1
            </p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="section">
          <div className="container">
            <p>
              Hi! 2
            </p>
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