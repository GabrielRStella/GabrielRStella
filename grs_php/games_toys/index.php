<!DOCTYPE html>
<html>
<?php
$title = 'Games+Toys';
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
        <h1>Projects</h1>
    </div>
    <p>
        Hi!
        This is placeholder text, present while I work on reorganizing my site.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </p>
  </div>
  <div class="section">
    <div class="center-align">
        <h1>Publications</h1>
    </div>
    <p>
        Hi!
        This is placeholder text, present while I work on reorganizing my site.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
    </p>
  </div>
</div>


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
$basedir = 'games/';
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
  $game_img = 'games_toys/games/'.$gamedata['dir'].'/'.$gamedata['thumbnail'];
  $game_text = $gamedata['text'];
  $game_title = $gamedata['title'];
  $game_link = '/games_toys/game.php?game='.$gamedata['dir'];
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









<div class="container center-align">
  <div class="section">
    <div class="row">
      <div class="col s12">
        <h1>Toys</h1>
        <p>
          These are mini-projects that I don't consider complete enough to call games.
          Still, they may be interesting to you.
        </p>
      </div>
    </div>
    <div class="row">
<?php

// function cmp($a, $b)
// {
//   $val = $a['order'] - $b['order'];
//   if($val == 0) {
//     return 0;
//   }
//   //invert order
//   return - (($val > 0) ? 1 : -1);
// }

//load game data
$basedir = 'toys/';
$toys = array();
//TODO: sort toys by date
foreach(listFilesAndDirs($basedir) as $dir) {
  if(strpos($dir, '.') !== false) {
    continue;
  }
  $datafile = $basedir . $dir . '/' . 'toy.json';
  $gamedata = json_decode(file_get_contents($datafile), true); //info: title, description, foreground, background, dateString
  if(array_key_exists('hidden', $gamedata) and $gamedata['hidden']) {
    continue;
  }
  $gamedata['dir'] = $dir;
  $toys[] = $gamedata;
}
usort($toys, "cmp");
foreach($toys as $gamedata) {
  //extracted data
  $game_title = $gamedata['title'];
  $game_link = '/games_toys/toy.php?toy='.$gamedata['dir'];
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
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
