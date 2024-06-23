<!DOCTYPE html>
<html>
<?php
$title = 'Games';
include 'helpers/util.php';
include 'helpers/header.php';
include 'helpers/files.php';
?>
<body>
<?php
make_nav();
?>
<div class="container">
  <div class="section">
    <div class="row">
      <div class="col s12">
        <div class="center-align">
          <h1>Games</h1>
        </div>
        <p>
          These games were all written from scratch in JavaScript using the HTML5 canvas.
          They are meant for desktop browsers, though some may partially work on mobile devices.
          I hope you enjoy playing them!
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
$basedir = 'data/games/';
$games = array();
foreach(listFilesAndDirs($basedir) as $dir) {
  $datafile = $basedir . $dir . '/' . 'game.json';
  $gamedata = json_decode(file_get_contents($datafile), true); //info: script/scripts/scriptDir, title, caption, background (color), thumbnail, text (color), dateString
  if(array_key_exists('hidden', $gamedata) and $gamedata['hidden']) {
    continue;
  }
  $gamedata['dir'] = $dir;
  $games[] = $gamedata;
}
usort($games, "cmp");
foreach($games as $gamedata) {
  //extracted data
  $game_img = 'data/games/'.$gamedata['dir'].'/'.$gamedata['thumbnail'];
  $game_text = $gamedata['text'];
  $game_title = $gamedata['title'];
  $game_link = '/game.php?game='.$gamedata['dir'];
  $game_caption = $gamedata['caption'];
  echo "
    <div class=\"col s12\">
      <div class=\"card\">
        <div class=\"card-image\">
          <img src=\"$game_img\"/>
          <span class=\"card-title $game_text\">$game_title</span>
          <a href=\"$game_link\" class=\"btn-floating halfway-fab waves-effect waves-light black\"><i class=\"material-icons\">play_arrow</i></a>
        </div>
        <div class=\"card-content\">
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
