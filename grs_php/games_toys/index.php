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

    <div class="row">
      <div class="col s12 m8">
        <div class="center-align">
          <h1>Games and Toys</h1>
        </div>
        <p>
          This page contains my HTML5 games and toys. They were all written from scratch in JavaScript using the HTML5 canvas API.

          You can find some of my newer games, variously made with SDL, Godot, and Unity, on my itch.io page.
        </p>
        <!-- <p>
          I've been making games since around 2012. The first game I put on this site, Tetris Matcher, was made in 2017.
        </p> -->
      </div>
      
      <?php
      echo "
      <div class=\"col s12 m4\">
        <a href=\"https://gabrielrstella.itch.io/\">
          <div class=\"center $secondaryText\">
            <i class=\"fas fa-gamepad\" style=\"font-size: 120px\"></i>
            <h3>itch.io</h3>
          </div>
        </a>
      </div>";
      ?>
    </div>
  </div>

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

$all_objects = array();
$all_games = array();
$all_toys = array();
//load game data
$basedir_games = 'games/';
$games = array();
foreach(listFilesAndDirs($basedir_games) as $dir) {
  $datafile = $basedir_games . $dir . '/' . 'game.json';
  $gamedata = json_decode(file_get_contents($datafile), true); //info: script/scripts/scriptDir, title, caption, background (color), thumbnail, text (color), dateString
  if(array_key_exists('hidden', $gamedata) and $gamedata['hidden']) {
    continue;
  }
  $gamedata['dir'] = $dir;
  $games[] = $gamedata;
}
//convert game data
usort($games, "cmp");
foreach($games as $gamedata) {
  //
  $game_img = 'games/'.$gamedata['dir'].'/'.$gamedata['thumbnail'];
  $game_text = $gamedata['text'];
  $game_title = $gamedata['title'];
  $game_link = 'game.php?game='.$gamedata['dir'];
  $game_caption = $gamedata['caption'];
  //
  $game_card_data = "
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
  //
  $game_obj = array();
  $game_obj['order'] = $gamedata['order'];
  $game_obj['html'] = $game_card_data;
  $all_objects[] = $game_obj;
  $all_games[] = $game_obj;
}

//load toy data
$basedir_toys = 'toys/';
$toys = array();
foreach(listFilesAndDirs($basedir_toys) as $dir) {
  if(strpos($dir, '.') !== false) {
    continue;
  }
  $datafile = $basedir_toys . $dir . '/' . 'toy.json';
  $toydata = json_decode(file_get_contents($datafile), true); //info: title, description, foreground, background, dateString
  if(array_key_exists('hidden', $toydata) and $toydata['hidden']) {
    continue;
  }
  $toydata['dir'] = $dir;
  $toys[] = $toydata;
}
//convert toy data
usort($toys, "cmp");
foreach($toys as $toydata) {
  //extracted data
  $game_title = $toydata['title'];
  $game_link = '/games_toys/toy.php?toy='.$toydata['dir'];
  $game_caption = $toydata['description'];
  //
  $toy_card_data = "
    <div class=\"col s12\">
      <div class=\"card\">
        <div class=\"card-content\">
          <a href=\"$game_link\"><span class=\"card-title\">$game_title</span></a>
          <p>$game_caption</p>
        </div>
      </div>
    </div>";
  //
  $toy_obj = array();
  $toy_obj['order'] = $toydata['order'];
  $toy_obj['html'] = $toy_card_data;
  $all_objects[] = $toy_obj;
  $all_toys[] = $toy_obj;
}

//sort and emit cards
// usort($all_objects, "cmp");
// foreach($all_objects as $obj) {
//   echo $obj['html'];
// }
?>


  <div class="section">
    <div class="row">
      <div class="col s12 l6">
        <h3 class="center-align">Games</h3>
        <p>
          These are meant for desktop browsers, though some may partially work on mobile devices.
          I hope you enjoy playing them!
        </p>
        <div class="row">
          <?php
            foreach($all_games as $obj) {
              echo $obj['html'];
            }
          ?>
        </div>
      </div>
      <div class="col s12 l6">
        <h3 class="center-align">Toys</h3>
        <p>
          Toys are mini-projects that I don't consider complete enough to call games.
          Still, they may be interesting to you.
        </p>
        <div class="row">
          <?php
            foreach($all_toys as $obj) {
              echo $obj['html'];
            }
          ?>
        </div>
      </div>
    </div>
  </div>




<?php
make_footer();
?>
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
