var utils = require('./utils.js');

var React = require('react');

var options = [
  {
    "title": "Resume",
    "to": "/resume.pdf",
    "icon": "fas fa-file-alt"
  },
  {
    "title": "GitHub",
    "to": "https://github.com/GabrielRStella/",
    "icon": "fab fa-github"
  },
  {
    "title": "Apps",
    "to": "https://itunes.apple.com/us/developer/gabriel-stella/id1409925984?ls=1?mt=8",
    "icon": "fab fa-app-store-ios"
  }
//others: youtube, twitter, linkedin, ...?
];

//former avatar
//<img src="img/avatar_old.jpg" alt="A blueberry with a plain facial expression." title="www.mrlovenstein.com" className="responsive-img"></img>

var intro = (
  <div className="section">
    <div className="row">
      <div className="col s12 m4 push-m8">
        <img src="/avatar" alt="A collection of colliding circles." title="Circles" className="responsive-img"></img>
      </div>
      <div className="col s12 m8 pull-m4">
        <div className="center-align">
          <h1>Gabriel Stella</h1>
        </div>
        <p>
          Hi!
          I'm a senior at Texas A&M University.
          I'm getting a bachelor's degree in computer science with a minor in mathematics.
          I like to experiment with artificial intelligence and make games.
          Thanks for checking out my website!
        </p>
      </div>
    </div>
  </div>
);

function Option(props) {
  return (
    <div className="col s12 m4">
      <a href={props.to}>
        <div className={"center " + utils.palette.secondaryText}>
          <i className={props.icon} style={{fontSize: "120px"}}></i>
          <h3>{props.title}</h3>
          <div className="divider"></div>
        </div>
      </a>
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
        {intro}
        <div className="divider"></div>
        <div className="section">
          <br/>
          <div className="row">
            {options.map((x, i) => <Option key={i} {...x}/>)}
          </div>
        </div>
      </div>
    </main>
  ),
  utils.footer
]);