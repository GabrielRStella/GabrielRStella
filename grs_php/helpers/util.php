<?php
$primary= "blue accent-4";
$primaryText= "blue-text text-accent-4";
$primaryAccent= "indigo darken-4";
$primaryAccentText= "indigo-text text-darken-4";
$secondary= "deep-orange accent-3";
$secondaryText= "deep-orange-text text-accent-3";
$secondaryAccent= "red darken-4";
$secondaryAccentText= "red-text text-darken-4";

function make_nav() {
  global $primary;
  $nav = array(
    array(
      "to"=>"/",
      "title"=>"Home"
    ),
    array(
      "to"=>"/games.php",
      "title"=>"Games"
    ),
    array(
      "to"=>"/projects.php",
      "title"=>"Projects"
    ),
    array(
      "to"=>"/toys.php",
      "title"=>"Toys"
    )
  );
  //{navLinks.map((x, i) => (<li key={i}><a href={x.to}>{x.title}</a></li>))}
  //{navLinks.map((x, i) => (<li key={i}><a href={x.to}>{x.title}</a></li>))}
  echo
    "<nav class=\"$primary\">
      <div class=\"nav-wrapper container\">
        <!-- <a href=\"#\" class=\"brand-logo\">Gabriel R Stella</a> -->
        <ul class=\"right hide-on-med-and-down\">";
          foreach($nav as $navitem) {
            $to = $navitem['to'];
            $title = $navitem['title'];
            echo "<li><a href=$to>$title</a></li>";
          }
  echo
        "</ul>
        <ul id=\"nav-mobile\" class=\"sidenav\">";
          foreach($nav as $navitem) {
            $to = $navitem['to'];
            $title = $navitem['title'];
            echo "<li><a href=$to>$title</a></li>";
          }
  echo
        "</ul>
        <a href=\"#\" data-target=\"nav-mobile\" class=\"sidenav-trigger\"><i class=\"material-icons\">menu</i></a>
      </div>
    </nav>
    <br/>";
}

function make_footer() {
  global $primaryAccent;
  echo
    "<footer class=\"page-footer $primaryAccent\" style=\"width: 100%; margin-top: auto; padding: 10px;\">
      <div class=\"center container\">
        This site is a work in progress.
        <br/>
        &copy; 2017-2023 Gabriel Stella
      </div>
    </footer>";
}
?>