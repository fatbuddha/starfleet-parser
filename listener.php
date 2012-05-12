<?php

//CONNECT TO DATABASE
include('config.php');
$con = mysql_connect($host,$user,$pass);
mysql_select_db($db_name, $con);

//SET VARIABLES FROM URL
$galaxy = $_GET['galaxy'];
$system = $_GET['system'];
$string = stripslashes($_GET['string']);

//SET OTHER VARIABLES WE'll NEED
$currenttime = time();
date_default_timezone_set('UTC');
$hour = date("H");

//CHECK IF WE NEED TO UPDATE (Only update if more than 15 minutes since last update)
$updatecheck = mysql_query("SELECT timeupdated FROM planets WHERE galaxy='$galaxy' AND system='$system' LIMIT 1") or die("Couldn't query last time updated!");
if (mysql_num_rows($updatecheck) > 0) {
	$tmp = mysql_fetch_array($updatecheck) or die("Couldn't fetch time array!");
	$lastupdate = $tmp['timeupdated'];
	$doupdate = ($currenttime - $lastupdate);
} else {
	$doupdate = 900;
	}

//IF UPDATED NEEDED DELETE OLD ENTRIES AND UPDATE
if ($doupdate >= 900) {
mysql_query("DELETE FROM planets WHERE galaxy='$galaxy' AND system='$system';") or die("Couldn't delete planets!");
mysql_query("INSERT INTO planets (galaxy, system, slot, player, status, alliance, timeupdated, rank, planet, planetactivity) VALUES $string;") or die("Couldn't update planets!");
echo "UPDATE END";
} else { 
echo "NO UPDATE NEEDED";
}
?>