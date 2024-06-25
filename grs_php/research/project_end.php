  <div class="section">
    <div class="center-align">
        <h2>Publications</h2>
    </div>
    <div class="row">
    <?php
      
      $pubs = json_decode(file_get_contents("pub.json"), true);
      $papernames = $project['papers'];
      foreach($pubs as $pub) {
        if(!in_array($pub['ref'], $papernames)) continue;

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