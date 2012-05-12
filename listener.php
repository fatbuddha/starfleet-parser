<?php

//CONNECT TO DATABASE
include('config.php');
$con = mysql_connect($host,$user,$pass);
mysql_select_db($db_name, $con);

//SET VARIABLES FROM URL
$galaxy = mysql_real_escape_string($_GET['g']);
$system = mysql_real_escape_string($_GET['s']);
$timedate = mysql_real_escape_string($_GET['t']);

//SET OTHER VARIABLES WE'll NEED
date_default_timezone_set('UTC');
$hour = date("H");
$hour_ts = date("H")."_ts";

//CHECK IF WE NEED TO UPDATE (Only update if more than 15 minutes since last update)
$updatecheck = mysql_query("SELECT timeupdated FROM planets WHERE galaxy='$galaxy' AND system='$system' LIMIT 1") or die("Couldn't query last time updated!");
if (mysql_num_rows($updatecheck) > 0) {
	$tmp = mysql_fetch_array($updatecheck) or die("Couldn't fetch time array!");
	$lastupdate = $tmp['timeupdated'];
	$doupdate = ($timedate - $lastupdate);
} else {
	$doupdate = 900;
	}

//IF MORE THAN 15 MINUTES PAST LAST UPDATE - LET'S UPDATE!
if ($doupdate >= 900) {

//DELETE OLD SYSTEM ENTRIES
mysql_query("DELETE FROM planets WHERE galaxy='$galaxy' AND system='$system'");

//BUILD STRINGS AND SUBMIT NEW ENTRIES
	for ($i = 1; $i <=45; $i++) {
		$builder = "".$galaxy.", ".$system.", ".$timedate.", ";
		$j = 1;
		while (isset($_GET['v'.$i.$j])) {
			if ($j == 1) { $builder .= '"'; } else { $builder .= ', "'; } 
			$builder .= mysql_real_escape_string((string)$_GET['v'.$i.$j]).'"';
			$j++;
	}
		if ($builder !== "".$galaxy.", ".$system.", ".$timedate.", "){
			mysql_query("INSERT INTO planets (galaxy, system, timeupdated, slot, player, status, alliance, rank, planet, planetactivity) VALUES ($builder)");
			echo $builder." instered into database!<br />";
		} 
	}

//UPDATE PLANET TRACKER
$query = mysql_query("SELECT galaxy, system, slot, planetactivity FROM planets WHERE galaxy='$galaxy' AND system='$system'");
	while($data = mysql_fetch_assoc($query)){
		if (preg_match('[e]', $data['slot'])) {
			echo "You sent parsed Encounters, but they are not included in the planet tracker!";
		} else { 
			if ($data['planetactivity'] === "(*)") {
				mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 10 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'");
				if (mysql_affected_rows()==0) {
				mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 10, 1)"); 
			}
		echo $data['slot']." - Updated (*)'s in the tracker!";	
		}
		elseif ($data['planetactivity'] !== "(*)" && $data['planetactivity'] !== "") {
			mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 5 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'");
			if (mysql_affected_rows()==0) {
			mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 5, 1)");
			}
		echo $data['slot']." - Updated timers in the tracker!";
		} else {
			mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 1 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'") or die(mysql_error());
			if (mysql_affected_rows()==0) {
			mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 1, 1)")  or die(mysql_error());
			}
		echo $data['slot']." - Updated other planets in the tracker!";
		}
	}
}
echo "UPDATE END";
} else { 
echo "NO UPDATE NEEDED";
}
?>