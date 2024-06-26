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
    <p class="flow-text center-align">
      The overarching goal of my work is to understand and create intelligent systems.
    </p>
    <div class="divider"></div>
    <p class="flow-text">
      What are the fundamental mechanisms of human intelligence?
      <!-- What aspects of human cognition are "built-in" and what parts are learned? -->
      How can intelligence be broken down and quantified?
      What are the limits of human intelligence and of intelligent systems in general?
    </p>
    <p class="flow-text">
      I believe that many of the most amazing abilities we observe in humans and animals emerge naturally from simple yet incredibly powerful processes based on effective representations of the world.
      Thus, rather than explicitly working towards systems capable of highly sophisticated behaviors,
      my approach focuses on understanding the foundations of intelligence with the expectation that interesting insights and abilities will follow naturally.

      To pursue this goal, I build functional models in the form of computer algorithms.
      I then evaluate the models in the same way that humans evaluate themselves and each other: by placing them in games carefully designed to test their various capabilities.

      <!-- --alignment, interpretability, understanding the methods we use -->
    </p>
    <div class="divider"></div>
    <p class="flow-text">
      How did intelligence arise in this universe?
      Was the emergence of intelligence inevitable?
      Under what conditions <i>can</i> and <i>will</i> intelligence come about?
      Under what conditions will <i>social, cooperating agents</i> arise?
      How does the computational model <i>of the universe itself</i> relate to the potential for intelligence?
    </p>
    <p class="flow-text">
      As I study models of intelligence in virtual worlds, it occurs to me that my research is a bit... recursive.

      I wonder how we came to be here, studying ourselves, in a universe we know little about.
      Although I may not be able to peek <i>outside</i>, I can certainly look deeper <i>inwards</i>.

      I believe that simulated models of reality can shed light on many of our greatest mysteries, such as
      the emergence of complex intelligent life,
      the basis of ethics and morality,
      and the relationships between physics, computation, and intelligence.
      <!-- computational models of physics and their implications for the structure of intelligent systems -->
      <!-- relationship between the physical laws of the universe and the theory of computability  -->
    </p>
    <div class="divider"></div>
    <p class="flow-text">
      Clearly, the above is only a high-level view.
      More specific information about each of my public projects can be found below.

      Although I have many other projects both ongoing and planned for the future,
      I prefer to keep the details of each private until I have concrete results to share.
    </p>
  </div>
  <div class="section">
    <div class="center-align">
        <h2>Projects</h2>
    </div>

    <!-- <div class="collection flow-text center-align"> -->
    <div class="row">

      <?php
      $projects = json_decode(file_get_contents("projects.json"), true);

      foreach($projects as $pname => $project) {
        $ptitle = $project['title'];
        $pabstract = $project['abstract'];
        $plink = $pname.".php";
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
