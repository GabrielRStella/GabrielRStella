<?php
$dir = $_GET['toy'];
$basedir = 'data/toys/';
$gamedir = $basedir . $dir . '/';
$game_exists = true;

if(file_exists($gamedir)) {
  $datafile = $gamedir . 'toy.json';
  $gamedata = json_decode(file_get_contents($datafile), true); //info: title, description, foreground, background, dateString
  //extracted data
  $game_background = $gamedata['background']; //bg color on game page
  $game_title = $gamedata['title']; //self-explanatory
  $game_script = $gamedir . 'toy.js';
  
  $game_ext = $gamedata['external'] ? $gamedata['external'] : array();
  $game_scripts = $gamedata['scripts'] ? $gamedata['scripts'] : array();

  $title = 'Toys::'.$game_title;
} else {
  $game_exists = false;
  $title = 'Toys::Unknown';
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
    <script type=\"text/javascript\" src=\"data/toys/dat.gui.min.js\"></script>
  </head>
  <body>
  <div style=\"background: $game_background\">
    <style>* { background: $game_background; padding: 0; margin: 0;} canvas { background: $game_background; display: block; margin: 0 auto; }</style>

    <canvas id=\"gameCanvas\"></canvas>";
    
  foreach($game_ext as $ext) {
    echo "<script src=\"$ext\"></script>";
  }
  foreach($game_scripts as $script) {
    echo "<script src=\"$gamedir$script\"></script>";
  }
  if(!$gamedata['no_lib']) {
    echo "<script src=\"data/toys/toy_lib.js\"></script>";
  }
  echo
    "<script src=\"$game_script\"></script>
  </div>
</body>";
} else {
  include 'helpers/util.php';
  include 'helpers/header.php';
  make_nav();
  echo
   "<div class=\"container\">
      <div class=\"section\">
        <p>Could not find toy: \"$dir\"</p>
      </div>
    </div>";
  include 'helpers/materialize.php';
}
?>
</html>