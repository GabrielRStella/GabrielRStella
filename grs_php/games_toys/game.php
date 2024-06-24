<?php
$dir = $_GET['game'];
$basedir = 'games/';
$gamedir = $basedir . $dir . '/';
$game_exists = true;

if(file_exists($gamedir)) {
$datafile = $gamedir . 'game.json';
$gamedata = json_decode(file_get_contents($datafile), true); //info: script/scripts/scriptDir, title, caption, background (color), thumbnail, text (color), dateString
//extracted data
$game_background = $gamedata['background']; //bg color on game page
$game_title = $gamedata['title']; //self-explanatory
$game_scripts = array(); //relative paths to the game's scripts (relative to the $gamedir)
if(array_key_exists('script', $gamedata)) {
  //apparently this appends
  $game_scripts[] = $gamedata['script'];
} else {
  foreach($gamedata['scripts'] as $script) {
    $game_scripts[] = $gamedata['scriptDir'].$script;
  }
}

$title = 'Games::'.$game_title;
} else {
  $game_exists = false;
  $title = 'Games::Unknown';
}

?>
<!DOCTYPE html>
  <html>
<?php
if($game_exists) {
  echo "
  <head>
    <meta charset=\"utf-8\" />
    <title>GabrielRStella::$title</title>
  </head>
  <body>
  <div style=\"background: $game_background\">
    <!-- do I need overflow: hidden? -->
    <style>* { overflow: hidden; background: $game_background; padding: 0; margin: 0;} canvas { background: $game_background; display: block; margin: 0 auto; }</style>

    <canvas id=\"gameCanvas\"></canvas>";

      foreach($game_scripts as $script) {
        $script_path = $gamedir.$script;
        echo "<script src=\"$script_path\"></script>";
      }
echo
  "</div>
</body>";
} else {
  include 'helpers/util.php';
  include 'helpers/header.php';
  make_nav();
  echo
   "<div class=\"container\">
      <div class=\"section\">
        <p>Could not find game: \"$dir\"</p>
      </div>
    </div>";
  include 'helpers/materialize.php';
}
?>
</html>