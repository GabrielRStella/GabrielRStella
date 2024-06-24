<!DOCTYPE html>
<html>
<?php
$title = 'Research';
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
        <h1>Research</h1>
    </div>
    <p>
      This research statement is WIP. :)
    </p>
  </div>
  <div class="section">
    <div class="center-align">
        <h2>Projects</h2>
    </div>
    <p>
        Hi!
        This is placeholder text, present while I work on reorganizing my site.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </p>
    <div class="row">

      <?php
      $projects = array(
        array(
          "title"=>"Object-Oriented Reinforcement Learning",
          "name"=>"oorl",
        ),
        array(
          "title"=>"External-Memory Streaming",
          "name"=>"em",
        ),
      );
      foreach($projects as $project) {
        $ptitle = $project['title'];
        $pname = $project['name'];
        $plink = "research/".$pname.".php";
        echo "
          <div class=\"col s12 m6 l12\">
            <div class=\"card-panel center-align\">
              <a href=\"$plink\">$ptitle</a>
            </div>
          </div>";
      }

      ?>


    </div>
  </div>
  <div class="section">
    <div class="center-align">
        <h2>Publications</h2>
    </div>
    <div class="row">
    <?php
      
      $pubs = json_decode(file_get_contents("pub.json"), true);
      foreach($pubs as $pub) {
        $ptitle = $pub['title'];
        $pauthors = $pub['authors'];
        $pvenue = $pub['venue'];

        //begin
        echo "
          <div class=\"col s12 l6\">
            <div class=\"card\">
              <div class=\"card-content\">
                <span class=\"card-title\">$ptitle</span>
                <p>$pauthors. $pvenue.</p>
              </div>
              <div class=\"card-action\">";

        //links 
        foreach($pub["links"] as $lkey => $lvalue) {
          echo "<a class=\"blue-text text-accent-4\" href=\"$lvalue\">$lkey</a>";
        }
        //end
        echo "
              </div>
            </div>
          </div>
        ";
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
