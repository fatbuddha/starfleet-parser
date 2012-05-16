<?php 
//CONNECT TO THE DATABASE
include('config.php'); 
$con = mysql_connect($host,$user,$pass);
mysql_select_db($db_name, $con);
header('Content-Type: text/html; charset=utf-8');

//WHAT UNI IS THIS DATABASE FOR? SET IN CONFIG
switch($isuni) {
	case 1:
		$gameurl = "http://stardriftempires.com";
		break;
	case 2:
		$gameurl = "http://nova.playstarfleet.com";
		break;
	case 3:
		$gameurl = "http://playstarfleet.com";
		break;
	case 4:
		$gameurl = "http://uni2.playstarfleet.com";
		break;
	case 5:
		$gameurl = "http://playstarfleetextreme.com";
		break;
	case 6:
		$gameurl = "http://uni2.playstarfleetextreme.com";
		break;
}
		
//GET URL VARIABLES FROM URL AND SET OTHER VARIABLES
$searchtype = mysql_real_escape_string($_GET['search']);
$searchquery = mysql_real_escape_string($_GET['query']);
$exactsearch = mysql_real_escape_string($_GET['exact']);
$currentplanet = mysql_real_escape_string($_GET['cp']);
$hour = date("H"); //SO WE KNOW WHICH BOX TO HIGHLIGHT
$z=1; //WHY Z? BECAUSE FIREFOX IS HORRIBLE

//WHAT KIND OF SEARCH IS THIS? GET DATA!
switch($searchtype) {
	case "a":
		if ($exactsearch === "true") {
			$explain = 1;
			$results = mysql_query("SELECT * FROM planets WHERE alliance='".$searchquery."' ORDER BY player ASC");
			$resultcount = mysql_num_rows($results);
		} else { 
			$explain = 0;
			$results = mysql_query("SELECT * FROM planets WHERE alliance LIKE '".$searchquery."%' ORDER BY alliance ASC");
			$resultcount = mysql_num_rows($results);
		}
		break;
	case "p":
		if ($exactsearch === "true"){
			$explain = 0;
			$results = mysql_query("SELECT * FROM planets WHERE player='".$searchquery."' ORDER BY galaxy ASC, system ASC, slot ASC");
			$hephdata = mysql_query("SELECT * FROM heph_tracker WHERE player='".$searchquery."' ORDER BY timeupdated DESC");
			$resultcount = mysql_num_rows($results);
			$ishephdata = mysql_num_rows($hephdata);
		} else {
			$explain = 1;
			$results = mysql_query("SELECT * FROM planets WHERE player LIKE '".$searchquery."%' ORDER BY 'player' ASC");
			$resultcount = mysql_num_rows($results);
		}
		break;
	default:
		$plainsearch = 1;
}
?>

<html>
<head>
<!-- PAGE TITLE SET IN CONFIG -->
<title><? echo $unititle; ?></title>
<!-- JAVASCRIPT AND STYLE SHEETS TO MAKE THINGS FANCY -->
<script type="text/javascript" src="javascript/Common.js"></script>
<script src="javascript/lib/prototype.js" type="text/javascript"></script>
<script src="javascript/src/effects.js" type="text/javascript"></script>
<script src="javascript/src/scriptaculous.js" type="text/javascript"></script>
<script type="text/javascript">
	function showTracker() {
		new Effect.Appear(tracking_1);
		new Effect.Appear(tracking_2);
		new Effect.Appear(tracking_3);
		new Effect.Appear(tracking_4);
		new Effect.Appear(tracking_5);
		new Effect.Appear(tracking_6);
		new Effect.Appear(tracking_7);
		new Effect.Appear(tracking_8);
		new Effect.Appear(tracking_9);
		new Effect.Appear(tracking_10);
		new Effect.Appear(tracking_11);
		new Effect.Appear(tracking_12);
		new Effect.Appear(tracking_13);
		new Effect.Appear(tracking_14);
		new Effect.Appear(tracking_15);
		new Effect.Appear(tracking_16);
		new Effect.Appear(tracking_17);
		new Effect.Appear(tracking_18);
	return false;}
	function hideTracker() {
		new Effect.Fade(tracking_1);
		new Effect.Fade(tracking_2);
		new Effect.Fade(tracking_3);
		new Effect.Fade(tracking_4);
		new Effect.Fade(tracking_5);
		new Effect.Fade(tracking_6);
		new Effect.Fade(tracking_7);
		new Effect.Fade(tracking_8);
		new Effect.Fade(tracking_9);
		new Effect.Fade(tracking_10);
		new Effect.Fade(tracking_11);
		new Effect.Fade(tracking_12);
		new Effect.Fade(tracking_13);
		new Effect.Fade(tracking_14);
		new Effect.Fade(tracking_15);
		new Effect.Fade(tracking_16);
		new Effect.Fade(tracking_17);
		new Effect.Fade(tracking_18);
	return false;} 
	function showHephTracking() {
		new Effect.Appear(hephTracker); 
	return false;} 
	function hideHephTracking() { 
		new Effect.Fade(hephTracker); 
	return false;} 
	
	function checkFirst(el) {
			if (document.getElementById("query").value.length >= 2)
				el.submit();
			else {
				alert("You have to write two or more characters...");
				return false;
			}
		}
</script>
<link href="css/StyleSheet.css" type="text/css" rel="Stylesheet" />
<link rel="shortcut icon" href="images/favicon.ico" /></head>
</head>
<body>
<div class="SearchContent">
	<table width="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td rowspan="2" class="wtsite-c1"></td>
			<td class="wtsite-tc"></td>
			<td rowspan="2" class="wtsite-c2"></td>
		</tr>
		<tr>
			<td class="wtMySite-content">
			<?php
			//DO WE NEED TO BUILD A SEARCH BOX? IF YES, DECIDE IF A SEARCH HAD NO RESULT OR IF THIS IS A NEW SEARCH.			
			if($resultcount === 0 ) {
				echo '<h1>No results! Try again..</h1>';
			} elseif($plainsearch === 1) {
				echo '<h1>Search for..</h1>';
			}
			if($resultcount === 0 || $plainsearch === 1) {
				echo '<div class="SearchBox">
							<form action="search.php" method="get" onsubmit="return checkFirst(this);">
							<table>
								<tbody><tr>
									<td>
										<input type="text" class="inputText" title="Search Box" name="query" id="query"><input type="submit" value="Search" class="inputTextBtn">
										Options: <input type="radio" name="search" value="p" checked>Player or <input type="radio" name="search" value="a">Alliance Tag | <input type="radio" name="exact" value="true" checked>Exact Search or <input type="radio" name="exact" value="false">Search Begins With
									</td>
								</tr></tbody>
							</table>
							</form>
						</div>'; 
			} else {
			//NO SEARCH BOX WAS NEEDED BECAUSE WE FOUND RESULTS, LET'S DISPLAY THEM!
				if($searchquery !== ""){echo '<span>Search results for <strong>'.stripslashes($searchquery).'</strong></span>';} ?>
				<span style="float:right;"><a href="search.php">New search</a></span>
					<div class="Info">
					<?php if($explain === 0){ ?>
						<!--IF AN EXACT SEARCH, SHOW BUTTONS TO EXPAND TRACKING -->
						<div class="Explain">
							<span><a href="javascript:void(0);" onclick="showTracker();">Show tracking info</a></span>
							<span><img src="images/Valid.png" /></span> |
							<span><a href="javascript:void(0);" onclick="hideTracker();">Hide tracking info</a></span>
							<span><img src="images/NotValid.png" /></span>
							<?php 
							//HIDE THE HEPH LINKS IF WE DON'T HAVE ANY HEPH DATA
							if($ishephdata > 0){echo' |
							<span><a href="javascript:void(0);" onclick="showHephTracking();">Show <?php if($isuni === 1){echo "Titan";} else {echo "Heph";} ?> tracker</a></span>
							<span><img src="images/NoEsp.png" /></span> |
							<span><a href="javascript:void(0);" onclick="hideHephTracking();">Hide <?php if($isuni === 1){echo "Titan";} else {echo "Heph";} ?> tracker</a></span>
							<span><img src="images/Esp.png" /></span>'; } ?>
							</div>
						<?php } elseif($explain === 1){ ?>
							<!--IF NOT AN EXACT SEARCH, SHOW THE GENERAL INFO BAR -->
							<div class="Explain">
								<span>Click on player name to gain additional options and information!</span>
							</div><?php } ?>							
							<table width="100%" border="0">
								<tr>
									<td>Player</td>
									<td>Alliance</td>
									<td>Colony</td>
									<td align="right">Coordinates</td>
								</tr>
								<!-- IF THERE IS NO HEPH DATA, DON'T GENERATE THE HEPH TRACKING BOX! -->
								<?php if($ishephdata > 0) {
								echo '<tr>
									<td colspan="4" id="hephTracker" style="display:none;">
										<div class="hephTracking">
										<h1>'; if($isuni === 1){echo "Titan";} else {echo "Heph";} echo 'Tracking</h1>';
																		
											while($heph = mysql_fetch_assoc($hephdata)){
											echo "<span>".date("m-d-Y H:i:s A",$heph['timeupdated'])."</span> - <span><a href=".$gameurl."/galaxy/show?current_planet=".$currentplanet."&galaxy=".$heph['galaxy']."&solar_system=".$heph['system'].">[".$heph['galaxy'].":".$heph['system'].":".$heph['slot']."]</a></span><br />";							
											}
										echo'</div>
									</td>
								</tr>';
								}

							//LIST ALL THE PLANET RESULTS
							while($planets = mysql_fetch_assoc($results)){ 
							echo "
							<tr>
								<td id=\"PlayerInfo\"><a href=\"search.php?cp=".$currentplanet."&search=p&exact=true&query=".stripslashes($planets['player'])."\">".$planets['player']."</a>";
								if(preg_match('[m]', $planets['slot'])) { 
									echo '<img src="images/moon.png" border="0" style="padding-left:15px;">'; 
								} elseif(preg_match('[h]', $planets['slot'])) { 
									 echo '<img src="images/';if($isuni ===1){echo'sde';} else{echo'sfc';}echo'_roaming_planet.png" border="0" style="padding-left:15px;height:16px;width:16px">';}
								if($planets['status'] !== ""){echo "<span style=\"font-size:80% !important;\"'>&nbsp;(".$planets['status'].")&nbsp;</span>";}
								echo "<span style=\"font-size:80% !important;\"'>&nbsp;(#".number_format($planets['rank']).")&nbsp;</span>";
							echo "</td>";
							echo "<td><a href=\"search.php?cp=".$currentplanet."&search=a&exact=true&query=".stripslashes($planets['alliance'])."\">".$planets['alliance']."</a></td>";
							echo "<td>".$planets['planet']."</td>";
							echo "<td align=\"right\"><a href=".$gameurl."/galaxy/show?current_planet=".$currentplanet."&galaxy=".$planets['galaxy']."&solar_system=".$planets['system'].">[".$planets['galaxy'].":".$planets['system'].":".$planets['slot']."]</a></span></td>
							</tr>";
							
							//IF WE'VE SEARCHED FOR JUST ONE PLAYER, LET'S SHOW SOME TRACKER DATA!
							if ($exactsearch === "true") {
							echo '			
							<tr id="tracking_'.$z.'" style="display: none; ">
								<td colspan="4">
								<table style="overflow-x: visible; overflow-y: visible;" class="Tracker" width="100%" border="0" cellpadding="1" cellspacing="1">
										<tbody>';
								//IF IT'S A HEPH, WE DON'T KEEP HOUR BY HOUR TRACKER DATA. SORRY. =(
								if(preg_match('[h]', $planets['slot'])) { 
										if($ishephdata > 0) {
												echo '<tr><td class="TrackerHours"><div align="center">Please use the ';
												if($isuni === 1){echo "Titan";} else {echo "Heph";}
												echo ' tracker link to see recent locations!</td></tr>';
											} 
									$z++;
								} else {
								
								//IF IT'S A PLANET, WE CAN LOOK IT UP IN THE TRACKER!
								$trackerdata = mysql_query("SELECT * FROM planets_activity WHERE galaxy='".$planets['galaxy']."' AND system='".$planets['system']."' AND slot='".$planets['slot']."' AND player='".$searchquery."'");										
								while($tracker = mysql_fetch_assoc($trackerdata)){
											
								//LIST ALL THE HOURS IN THE DAY (UTC STYLE!!)
								for ($i = 0; $i <24; $i++) {
									$j = sprintf("%02s",$i);
									$td1 = "";
										if ($i === 0) { $td1 .= '<tr>';}				
										if ($hour === $j){
											$td1 .= '<td class="TrackerHours" style="border:2px solid black;">'.$j.'</td>';		
										} else {
											$td1 .= '<td class="TrackerHours">'.$j.'</td>';
										}
										if ($i === 23) { $td1 .= '</tr>'; } 
								echo $td1;
								}
								
								//HOW OFTEN HAVE WE SEEN ACTIVITY AND COLOR CODE THE RESULTS!
								for ($i = 0; $i <24; $i++) {
									$j = sprintf("%02s",$i);
									$td2 = "";
									$ts = $j."_ts";
										if ($tracker[''.$ts.''] === "0") {
											$trackervalue = number_format(1, 2, '.', '');
											$red = 255;
											$green = 255;
											$blue = 255;
										} else {
											$trackervalue = $tracker[''.$j.''] / $tracker[''.$ts.''];
												if($trackervalue >= 5) {
													$red = 255;
												} else {
													$red = round((255 * $trackervalue) / 10);
												}
												if ($trackervalue <= 5) {
													$green = 255;
												} else {
													$green = round((255*(10 - $trackervalue)) / 10);
												}
											$blue = 0;
										 	$trackervalue = number_format($trackervalue, 2, '.', '');
										}	
									if ($i === 0) { $td2 .= '<tr>';}				
									if ($hour === $j){
										$td2 .= '<td class="TrackerValues" style="border:2px solid black; background-color:rgb('.$red.','.$green.','.$blue.');">'.$trackervalue.'</td>';		
										} else {
											$td2 .= '<td class="TrackerValues" style="background-color:rgb('.$red.','.$green.','.$blue.');">'.$trackervalue.'</td>';
										}
										if ($i === 23) { $td2 .= '</tr>'; } 
								echo $td2;		
								} 
											
							}
							$z++; //INCREMENT Z TO HELP FIREFOX OUT. STUPID FIREFOX.
							}
							echo' </td></tr></tbody></table>';
							}
							}
						} 
						?>	
															
		</td>
	</tr>
	</table>
	</div>
</body>
</html>