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
          These games were all written from scratch in JavaScript using the HTML5 canvas.
          They are meant for desktop browsers, though some may partially work on mobile devices.
          I hope you enjoy playing them!
          
          Toys are mini-projects that I don't consider complete enough to call games.
          Still, they may be interesting to you.
        </p>
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




  <div class="section">
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









  <div class="section">
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











<?php
make_footer();
?>
<?php include '../helpers/materialize.php'; ?>
</body>
</html>
