<!DOCTYPE html>
<html>
<?php
$title = 'Utilities';
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
        <h1>Utilities</h1>
        <p>
          Helpful web-based tools.
        </p>
      </div>
    </div>
    <div class="row">
<?php

$projects = array(
  array(
    "to"=>"/timer.php",
    "title"=>"Timer",
    "description"=>"A simple timer."
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
    "to"=>"/dice.php",
    "title"=>"Dice",
    "description"=>"Create and roll custom dice (i.e., select from a user-specified set of choices)."
  ),
  // array(
  //   "to"=>"",
  //   "title"=>"",
  //   "description"=>""
  // )
);

foreach($projects as $proj) {
  $to = $proj['to'];
  $title = $proj['title'];
  $description = $proj['description'];
  if(!$to) {
    continue;
  }
  $to = "/utilities".$to;
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
