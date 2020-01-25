<?php

function listFilesAndDirs($path) {
  return array_diff(scandir($path), array('.', '..'));
}

function selectRandomFile($path) {
  $arr = listFilesAndDirs($path);
  return $arr[array_rand($arr)];
}

?>