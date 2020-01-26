<!DOCTYPE html>
<html>
<?php
$title = 'Toys';
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div class="container center-align">
  <div class="section">
    <div class="row">
      <div class="col s12">
        <h1>Toys</h1>
        <p>
          These are mini-projects that I don't consider interesting enough to call games.
          Still, they may be interesting to you.
        </p>
      </div>
    </div>
    <div class="row">
<?php

function cmp($a, $b)
{
  $val = $a['order'] - $b['order'];
  if($val == 0) {
    return 0;
  }
  //invert order
  return - (($val > 0) ? 1 : -1);
}

//load game data
$basedir = 'data/toys/';
$toys = array();
//TODO: sort toys by date
foreach(listFilesAndDirs($basedir) as $dir) {
  if(strpos($dir, '.') !== false) {
    continue;
  }
  $datafile = $basedir . $dir . '/' . $gamedir . 'toy.json';
  $gamedata = json_decode(file_get_contents($datafile), true); //info: title, description, foreground, background, dateString
  if($gamedata['hidden']) {
    continue;
  }
  $gamedata['dir'] = $dir;
  $toys[] = $gamedata;
}
usort($toys, "cmp");
foreach($toys as $gamedata) {
  //extracted data
  $game_title = $gamedata['title'];
  $game_link = '/toy.php?toy='.$gamedata['dir'];
  $game_caption = $gamedata['description'];
  echo "
    <div class=\"col s12 m6 l4\">
      <div class=\"card\">
        <div class=\"card-content\">
          <a href=\"$game_link\"><span class=\"card-title\">$game_title</span></a>
          <p>$game_caption</p>
        </div>
      </div>
    </div>";
}

?>
    </div>
  </div>
</div>
<?php
make_footer();
?>
<?php include 'helpers/materialize.php'; ?>
</body>
</html>
