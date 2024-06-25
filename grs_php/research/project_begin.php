<!DOCTYPE html>
<html>
<?php
$project = json_decode(file_get_contents("projects.json"), true)[$pname];
$title = 'Research::'.strtoupper($pname);
include '../helpers/util.php';
include '../helpers/header.php';
include '../helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<?php
?>
<div class="container">
  <div class="section">
    <div class="center-align">
        <h1><?php echo $project['title']; ?></h1>
    </div>
    <p class="center-align flow-text">
    <!-- <p class="center-align flow-text <?php echo $primaryText; ?>"> -->
    <?php echo $project['abstract']; ?>
    </p>
  </div>

