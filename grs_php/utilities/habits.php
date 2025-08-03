<!DOCTYPE html>
<html>
<?php
$title = 'Habits';
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
    <div class="center-align">
        <h1>Habits</h1>
    </div>
    <p class="flow-text center-align">
      A simple page for tracking the consistency of your habits.
    </p>
  </div>
  <div id="react-app"></div>
  <script src="habits.js"></script>
</div>
<?php
make_footer();
?>
<?php include '../helpers/materialize.php'; ?>
</body>
</html>