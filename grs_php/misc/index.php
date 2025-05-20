<!DOCTYPE html>
<html>
<?php
$title = 'Misc';
include '../helpers/util.php';
include '../helpers/header.php';
include '../helpers/files.php';
?>
<body>
<?php
make_nav();
?>


<div class="container center-align">
  <div class="section">
    <div class="row">
      <div class="col s12">
        <h1>Miscellaneous</h1>
        <p>
          An assortment of various things I have made.
        </p>
      </div>
    </div>
    <div class="row">
<?php

$projects = array(
  array(
    "to"=>"/CSCE641/index.php",
    "title"=>"CSCE 641 Project",
    "description"=>"My course project for CSCE 641: Computer Graphics."
  ),
  // array(
  //   "to"=>"/buckets.php",
  //   "title"=>"Bucket Game D<sub>1</sub>",
  //   "description"=>"A bucket-game simulator."
  // ),
  // array(
  //   "to"=>"/timer.php",
  //   "title"=>"Timer",
  //   "description"=>"A simple timer."
  // ),
  // array(
  //   "to"=>"/CSCE645/index.php",
  //   "title"=>"CSCE 645 Project",
  //   "description"=>"My research project for CSCE 645: Geometric Modeling."
  // ),
  array(
    "to"=>"/CSCE452/index.php",
    "title"=>"CSCE 452 Robots",
    "description"=>"A set of projects done for CSCE 452: Robotics and Spatial Intelligence."
  ),
  // array(
  //   "to"=>"/github.php",
  //   "title"=>"GitHub Tracker",
  //   "description"=>"A client-side GitHub interface. Built using React."
  // ),
  // array(
  //   "to"=>"/webstorage.php",
  //   "title"=>"Browser Storage Interface",
  //   "description"=>"An interactive viewer/editor for your browser's local storage."
  // ),
  // array(
  //   "to"=>"",
  //   "title"=>"",
  //   "description"=>""
  // )
  array(
    "to"=>"/cspace/index.php",
    "title"=>"Configuration Space",
    "description"=>"Visualizations of the configuration space for some 2-dof robots."
  ),
);

foreach($projects as $proj) {
  $to = $proj['to'];
  $title = $proj['title'];
  $description = $proj['description'];
  if(!$to) {
    continue;
  }
  $to = "/misc".$to;
  echo "
    <div class=\"col s12 m6\">
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
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
