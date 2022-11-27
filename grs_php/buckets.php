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
  <div class="container">
    <div style="height: 10px;"></div>
    <h4 style="display: inline;">Bucket Game D1</h4>
    <div style="height: 10px;"></div>
    <!-- options go here --> <div id="react-app"></div>
    <div style="align-content: center; text-align: center;">
      <div style="border: solid 1px black;">
        <canvas id="bucket-canvas"></canvas>
      </div>
    </div>
    <div style="height: 1px;"></div>
  </div>
  <script src="files/scripts/buckets-canvas.js"></script>
  <script src="files/scripts/buckets-react.js"></script>
</div>
<?php
make_footer();
?>
<?php include 'helpers/materialize.php'; ?>
</body>
</html>