<!DOCTYPE html>
<html>
<?php
$title = 'Teaching';
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
        <h1>Teaching</h1>
        <p class="flow-text center-align">
        Hi! This page is in progress. In the future, I'll be adding information about courses I've assisted or taught.
        </p>
      </div>
    </div>
    <div class="row">
<?php

$projects = array(
  array(
    "to"=>"/csce181.php",
    "title"=>"CSCE 181",
    "description"=>"Materials for my talk in the introductory computer science seminar."
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
  $to = "/teaching".$to;
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
