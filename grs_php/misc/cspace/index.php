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
          If a pose is in collision with one or more obstacles, it is darkened in the c&#8209;space panel.
          Robot configurations can be changed by clicking/dragging inside either panel;
          moving inside the robot panel will change the pose via IK,
          while moving inside the c&#8209;space panel will directly set the pose.
          (this page is a work in progress!)
        </p>
        <p class="flow-text center">
          For more information on the importance of c&#8209;spaces, scroll to the bottom.
        </p>
      </div>
    </div>
    <div id="react-root">
    </div>
    <div class="divider"></div>
    <div class="row center-align">
      <div class="col s12">
        <div class="center-align">
          <h1>Why are Configuration Spaces important?</h1>
        </div>
        <p class="flow-text center">
          One of the most important tasks in robotics is <i>motion planning</i>:
          finding a continuous path that the robot can take to move from its current position to some target position.
          This might make it sound like the solution is a path through real space, e.g.,
          the route that the robot's end affector (i.e., a gripper) should take as it moves towards the target.
          However, to control the robot, parameters need to be specified to all of its
          actuators (e.g., motors). Thus, motion planning finds paths through the <i>configuration space</i> of the robot,
          which describes all possible "poses" (i.e., setting of parameters for each actuator) that the robot can have.
          Of course, many of these poses are not desirable, because the robot would be in collision (with the environment or with itself).
          Solving the motion planning problem typically requires that the robot avoids these collisions.
        </p>
        <p class="flow-text center">
          Note that although real space is three-dimensional,
          the configuration space of a robot has as many dimensions as the robot has actuators.
          For example, if a robot has six motors, its c&#8209;space is six-dimensional.
          Obviously, this is quite difficult for humans to visualize.
          Hence, for the above simulations, the environments are all two-dimensional and the robots all have only two actuators.
          This allows both spaces to be fully displayed on the screen.
        </p>
      </div>
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
