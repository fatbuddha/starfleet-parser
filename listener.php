<?php
//SET PARSER VERSION
$version = "0.0.1";

//CONNECT TO DATABASE
include('config.php');
$con = mysql_connect($host,$user,$pass);
mysql_select_db($db_name, $con);
header('Content-Type: text/html; charset=utf-8');

//SET VARIABLES FROM URL
$galaxy = mysql_real_escape_string($_GET['g']);
$system = mysql_real_escape_string($_GET['s']);
$timedate = mysql_real_escape_string($_GET['t']);
$delete = mysql_real_escape_string($_GET['d']);
$clientversion = mysql_real_escape_string($_GET['info']);

//SET OTHER VARIABLES WE'll NEED
date_default_timezone_set('UTC');
$hour = date("H");
$hour_ts = date("H")."_ts";

//CHECK PARSER VERSION
if ($version !== $clientversion) {
header("Status: 405");
//header('HTTP/1.1 405 Method Not Allowed', true, 405);
	} else {

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
header("Status: 200");

//DELETE OLD SYSTEM ENTRIES
if ($delete = 1){
mysql_query("DELETE FROM planets WHERE galaxy='$galaxy' AND system='$system'");
}

//BUILD STRINGS AND SUBMIT NEW ENTRIES
	for ($i = 1; $i <=45; $i++) {
		$builder = "".$galaxy.", ".$system.", ".$timedate.", ";
		$j = 0;
		while (isset($_GET['v'.$i.$j])) {
			if ($j === 0) { $builder .= '"'; } else { $builder .= ', "'; } 
			$builder .= mysql_real_escape_string((string)$_GET['v'.$i.$j]).'"';
			$j++;
	}
		if ($builder !== "".$galaxy.", ".$system.", ".$timedate.", "){
			mysql_query("INSERT INTO planets (galaxy, system, timeupdated, slot, player, status, alliance, rank, planet, planetactivity) VALUES ($builder)");
			echo $builder." instered into database!<br />";
		} 
	}

//UPDATE PLANET TRACKER
$query = mysql_query("SELECT * FROM planets WHERE galaxy='$galaxy' AND system='$system'");
	while($data = mysql_fetch_assoc($query)){
		//ENCOUNTERS ARE NOT TRACKED IN THE PLANET TRACKER
		if (preg_match('[e]', $data['slot'])) {
			echo $data['slot']." - You sent an encounter, but they are not included in the planet tracker!";
		} 
		//HEPHS ARE TRACKED IN HEPH TRACKER, NOT PLANET TRACKER
		elseif (preg_match('[h]', $data['slot'])) {
			$hephupdate = mysql_query("SELECT timeupdated FROM heph_tracker WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}' ORDER BY timeupdated DESC LIMIT 1");
				if (mysql_num_rows($hephupdate) > 0) {
					$hephtmp = mysql_fetch_array($hephupdate) or die("Couldn't fetch time array!");
					$hephlastupdate = $hephtmp['timeupdated'];
					$hephdoupdate = ($timedate - $hephlastupdate);
				} else {
					$hephdoupdate = 3600;
				}
			//ONLY UPDATE HEPH ONCE PER HOUR IF ITS IN THE SAME SPOT
			if ($hephdoupdate >= 3600) {
				mysql_query("INSERT INTO heph_tracker (galaxy, system, slot, player, planet, timeupdated) VALUES ('{$data['galaxy']}', '{$data['system']}', '{$data['slot']}', '{$data['player']}', '{$data['planet']}', {$data['timeupdated']})");
				echo $data['slot']." - Add the Heph to the Heph Tracker instead of the planet tracker!<br />";
			} else { 
				echo $data['slot']." - We only add Heph tracking once per hour unless it moves!<br />";
			}
		} 
		//FINALLY ADD THE PLANETS TO THE PLANET TRACKER
		else { 
			//(*) PLANETS ARE WORTH +10
			if ($data['planetactivity'] === "(*)") {
				mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 10 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'");
				if (mysql_affected_rows()==0) {
				mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 10, 1)"); 
			}
		echo $data['slot']." - Updated (*)'s in the tracker!<br />";	
		}
			//PLANETS ON TIMERS ARE WORTH +5
			elseif ($data['planetactivity'] !== "(*)" && $data['planetactivity'] !== "") {
				mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 5 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'");
				if (mysql_affected_rows()==0) {
				mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 5, 1)");
			}
		echo $data['slot']." - Updated timers in the tracker!<br />";
		} 
			//PLANETS SEEM WITH NO TIMERS AND NO (*) ARE WORTH +1
			else {
				mysql_query("UPDATE planets_activity SET ".$hour_ts." = ".$hour_ts." + 1, `".$hour."` = `".$hour."` + 1 WHERE galaxy='$galaxy' AND system='$system' AND slot='{$data['slot']}' AND player='{$data['player']}'") or die(mysql_error());
				if (mysql_affected_rows()==0) {
				mysql_query("INSERT INTO planets_activity (galaxy, system, slot, player, `".$hour."`, ".$hour_ts.") VALUES ('$galaxy', '$system', '{$data['slot']}', '{$data['player']}', 1, 1)")  or die(mysql_error());
			}
		echo $data['slot']." - Updated other planets in the tracker!<br />";
		}
		}
	}
echo "UPDATE END";
//header('HTTP/1.1 200 OK', true, 200);
} else { 
header("Status: 412");
echo "NO UPDATE NEEDED";
//header('HTTP/1.1 412 Precondition Failed', true, 412);
}

}
?>