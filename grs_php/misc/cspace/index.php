<!DOCTYPE html>
<html>
<?php
$title = 'CSpace';
include '../../helpers/util.php';
include '../../helpers/header.php';
include '../../helpers/files.php';
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
          <h1>Configuration Space Visualizer</h1>
        </div>
        <p class="flow-text center">
          The panels below visualize the configuration space for several 2-degree-of-freedom robots.
          The left shows the robot (in white) inside the environment (obstacles in black), while the right shows the configuration space.
          If a pose is in collision with one or more obstacles, it is darkened in the c-space panel.
          Robot configurations can be changed by clicking/dragging inside either panel;
          moving inside the robot panel will change the pose via IK,
          while moving inside the c-space panel will directly set the pose.
          (this page is a work in progress!)
        </p>
      </div>
    </div>
    <div id="react-root">
    </div>
    <script src="/files/scripts/cspace-react.js"></script>
    <script src="/files/scripts/cspace-logic.js"></script>
  </div>
</div>
<?php
make_footer();
?>
<?php include '../../helpers/materialize.php'; ?>
</body>
</html>
