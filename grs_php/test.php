<p>Welcome to
<?php
echo $_SERVER["REQUEST_URI"];
echo "<br/>";
echo "Thu Jan 11 2018 23:33:55 GMT-0600 (Central Standard Time) = ";
$d = json_decode("\"Thu Jan 11 2018 23:33:55 GMT-0600 (Central Standard Time)\"");
echo "\"$d\"";
echo "<br/>";
$d = new DateTime("Thu Jan 11 2018 23:33:55 GMT-0600 (Central Standard Time)");
echo $d;
?>
</p>