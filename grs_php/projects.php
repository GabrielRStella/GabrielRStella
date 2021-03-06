<!DOCTYPE html>
<html>
<?php
$title = 'Projects';
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div class="container center-align">
  <div class="section">
    <div class="row">
      <div class="col s12">
        <h1>Projects</h1>
        <p>
          An assortment of random things I have made.
        </p>
      </div>
    </div>
    <div class="row">
<?php

$projects = array(
  array(
    "to"=>"/CSCE452",
    "title"=>"CSCE 452 Robots",
    "description"=>"A set of projects done for CSCE 452: Robotics and Spatial Intelligence."
  ),
  array(
    "to"=>"/github.php",
    "title"=>"GitHub Tracker",
    "description"=>"A client-side GitHub interface. Built using React."
  ),
  array(
    "to"=>"/webstorage.php",
    "title"=>"Browser Storage Interface",
    "description"=>"An interactive viewer/editor for your browser's local storage."
  ),
  array(
    "to"=>"",
    "title"=>"",
    "description"=>""
  )
);

//load game data
$basedir = 'data/toys/';
//TODO: sort toys by date
foreach($projects as $proj) {
  $to = $proj['to'];
  $title = $proj['title'];
  $description = $proj['description'];
  if(!$to) {
    continue;
  }
  echo "
    <div class=\"col s12 m6 l4\">
      <div class=\"card\">
        <div class=\"card-content\">
          <a href=\"$to\"><span class=\"card-title\">$title</span></a>
          <p>$description</p>
        </div>
      </div>
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
