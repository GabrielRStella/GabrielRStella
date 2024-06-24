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

    <!-- <div class="collection flow-text center-align"> -->
    <div class="row">

      <?php
      $projects = array(
        array(
          "title"=>"Object-Oriented Reinforcement Learning",
          "abstract"=>"todo abstract",
          "name"=>"oorl",
        ),
        array(
          "title"=>"External-Memory Streaming",
          "abstract"=>"todo abstract",
          "name"=>"em",
        ),
      );
      foreach($projects as $project) {
        $ptitle = $project['title'];
        $pname = $project['name'];
        $pabstract = $project['abstract'];
        $plink = "research/".$pname.".php";
        echo "
          <div class=\"col s12\">
            <div class=\"card\">
              <div class=\"card-content\">
                <a href=\"$plink\" class=\"$primaryText card-title\">$ptitle</a>
                <p>$pabstract</p>
              </div>
            </div>
          </div>";
          // echo "<a href=\"$plink\" class=\"$primaryText collection-item\">$ptitle</a>";
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
          echo "<a class=\"$primaryText\" href=\"$lvalue\">$lkey</a>";
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
