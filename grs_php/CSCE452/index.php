<!DOCTYPE html>
<html>
<?php
$title = 'CSCE452';
include '../helpers/util.php';
include '../helpers/header.php';
include '../helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div class="container">
  <div class="section">
    <div class="row center-align">
      <div class="col s12">
        <div class="center-align">
          <h1>CSCE 452 Projects</h1>
        </div>
        <p>
          These projects were made for CSCE 452: Robotics and Spatial Intelligence. Most of them use <a href="https://github.com/dataarts/dat.gui">dat.gui</a> for control.
        </p>
      </div>
    </div>
    <div class="row">
<?php

//array of descriptions; links and titles are auto-generated
$files = array(
  "A simple 3-DOF painting robot. The joints can be rotated using the dat.gui menu.",
  "A 3-DOF painting robot that can follow the cursor. Uses my own inverse kinematic solver.",
  "A simulation of \"Braitenberg Vehicles\", light-sensitive mobile robots. The parameters K determine each wheel's response to light.",
  "A racing game that simulates a 4-wheeled steering vehicle to scale on the Charlotte race track. The green, white and red boxes in the top right corner are both the steering wheel and accelerator - click and drag on it to move.",
  "A simple cell-based motion planner. Click and drag any object (3 boxes, 2 points) to interact."
);

foreach($files as $idx=>$desc) {
  $num = $idx + 1;  
  $link = "/CSCE452/P$num/page.html";
  $title = "Project $num";
  echo "
    <div class=\"col s12 m6 l4\">
      <div class=\"card\">
        <div class=\"card-content\">
          <a href=\"$link\"><span class=\"card-title\">$title</span></a>
          <p>$desc</p>
        </div>
      </div>
    </div>
    ";
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
