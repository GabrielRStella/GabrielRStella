<!DOCTYPE html>
<html>
<?php
$title = 'Buckets';
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div style="display: block; background: #ffffff">
  <div id="react-app"></div>
  <canvas id="bucket-canvas"></canvas>
  <script src="files/scripts/buckets-canvas.js"></script>
  <script src="files/scripts/buckets-react.js"></script>
</div>
<?php
make_footer();
?>
<?php include 'helpers/materialize.php'; ?>
</body>
</html>
