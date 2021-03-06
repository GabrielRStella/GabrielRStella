<!DOCTYPE html>
<html>
<?php
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<?php
//previous avatar
//<img src="img/avatar_old.jpg" alt="A blueberry with a plain facial expression." title="www.mrlovenstein.com" class="responsive-img"></img>
?>
<div class="container">
  <div class="section">
    <div class="row">
      <div class="col s12 m4 push-m8">
        <img src="files/img/avatars/<?php echo selectRandomFile('files/img/avatars/'); ?>" alt="A collection of colliding circles." title="Circles" class="responsive-img"></img>
      </div>
      <div class="col s12 m8 pull-m4">
        <div class="center-align">
          <h1>Gabriel Stella</h1>
        </div>
        <p>
          Hi!
          I'm a student researcher at Texas A&M University.
          I am currently developing theory and algorithms for high-performance Big Data systems.
          I'm interested in external-memory algorithms, distributed computing and artificial intelligence.
          Thanks for checking out my website!
        </p>
      </div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="section">
    <br/>
    <div class="row">

<?php
$options = array(
    /*
    array(
      "title"=>"Games",
      "to"=>"/games.php",
      "icon"=>"fas fa-gamepad"
    ),
    array(
      "title"=>"Resume",
      "to"=>"/files/resume.pdf",
      "icon"=>"fas fa-file-alt"
    ),
    */
    array(
      "title"=>"IRL@TAMU",
      "to"=>"http://irl.cs.tamu.edu/",
      "icon"=>"fas fa-network-wired"
    ),
    array(
      "title"=>"GitHub",
      "to"=>"https://github.com/GabrielRStella/",
      "icon"=>"fab fa-github"
    )
//others: google scholar/papers?
);

foreach($options as $option) {
  $title = $option['title'];
  $to = $option['to'];
  $icon = $option['icon'];
  echo "
    <div class=\"col s12 m4\">
      <a href=$to>
        <div class=\"center $secondaryText\">
          <i class=\"$icon\" style=\"font-size: 120px\"></i>
          <h3>$title</h3>
          <div class=\"divider\"></div>
        </div>
      </a>
    </div>";
}
?>

    </div>
  </div>
</div>
<?php
make_footer();
?>
<?php include 'helpers/materialize.php'; ?>
</body>
</html>
