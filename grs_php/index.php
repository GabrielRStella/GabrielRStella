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
        <!-- <img src="files/img/avatars/<?php echo selectRandomFile('files/img/avatars/'); ?>" alt="A collection of colliding circles." title="Circles" class="responsive-img"></img> -->
        <canvas id="circles" style="width: 100%; cursor: pointer; aspect-ratio: 1 / 1;"/> <!-- https://stackoverflow.com/a/3088012 -->
        <script src="files/scripts/circles.js"></script>
      </div>
      <div class="col s12 m8 pull-m4">
        <div class="center-align">
          <h1>Gabriel Stella</h1>
        </div>
        <p class="flow-text">
          Hi!
          I'm a computer science PhD student at Texas A&M University.
          I'm currently researching new methods for reinforcement learning.
          Previously I worked on theory and algorithms for high-performance Big Data systems.
          I also do game development in my free time.
          Thanks for checking out my website!

          <!-- I'm currently working on writing a new bio. :) In the meantime, go ahead and explore the site! -->

          <!-- My research seeks to shed light on the foundational principles of intelligence. -->

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
      "title"=>"CV",
      "to"=>"/files/resume.pdf",
      "icon"=>"fas fa-file"
    ),
    array(
      "title"=>"IRL@TAMU",
      "to"=>"http://irl.cs.tamu.edu/people/gabriel/",
      "icon"=>"fas fa-network-wired"
    ),
    array(
      "title"=>"GitHub",
      "to"=>"https://github.com/GabrielRStella/",
      "icon"=>"fab fa-github"
    ),
    array(
      "title"=>"LinkedIn",
      "to"=>"https://www.linkedin.com/in/gabrielrstella/",
      "icon"=>"fab fa-linkedin"
    )
//others: google scholar/papers?
);

foreach($options as $option) {
  $title = $option['title'];
  $to = $option['to'];
  $icon = $option['icon'];
  echo "
    <div class=\"col s12 m6 l3\">
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