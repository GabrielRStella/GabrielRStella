<!DOCTYPE html>
<html>
<?php
$title = 'Dice';
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div style="display: block; background: #ffffff">
  <div class="container">
    <div style="height: 10px;"></div>
    <h4 style="display: inline;">Dice</h4>
    <div style="height: 10px;"></div>
  </div>
  <div id="react-app"></div>
  <script src="files/scripts/dice.js"></script>
</div>
<?php
make_footer();
?>
<?php include 'helpers/materialize.php'; ?>
</body>
</html>