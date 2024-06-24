<!DOCTYPE html>
<html>
<?php
$title = 'GitHub_Tracker';
include '../helpers/util.php';
include '../helpers/header.php';
include '../helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div style="display: block; background: #ffffff">
  <div id="react-app"></div>
  <script src="github.js"></script>
</div>
<?php
make_footer();
?>
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
