<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include("includes/db.php");
	include("includes/functions.php");
	
//logToFile('score',  gettype($_REQUEST['requester']));
$req1 = json_decode(urldecode($_REQUEST['requester']));
//$req1 = json_decode($_REQUEST['requester']);
/*$req = '{"status": "success",'scorer':"Satya","battingteam_id": "23","inngs": "1","team_seq": "1","match_id": "1","bowlingteam_id": "36","batting":[{"player_id": 1,"player_status": "C rohit B tambe","runs": 40,"bat_seq":1,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 2,"player_status": "C rohit B tambe ","runs": 40,"bat_seq":2,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 3,"player_status": "batting ","runs": 40,"bat_seq":3,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 4,"player_status": "batting ","runs": 40,"bat_seq":4,"balls": 50,"fours": 6,"sixes": 3}],"bowling": [{"player_id": 1,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 2,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 3,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 1,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}],"extras": {"wides":13,"lbs":1,"byes":1,"noballs":2,"total": 17},"fow": "42-1,58-2.."}';*/
//$req = $req1;
$req = object_to_array($req1);
//logToFile('score', $req1);
//logToFile('score', "req1".$req1);
//exit();
echo gettype($req)."-----req<br/>";
//logToFile('score', $req);
$battingteam_id = $req['battingteam_id'];
$tournament_id = $req['tournament_id'];
$inngs = $req['inngs'];
//echo $req['battingteam_id']."---battingteam_id<br/>";
$match_id = $req['match_id'];
//echo $req['match_id']."-----match_id<br/>";
$bowlingteam_id = $req['bowlingteam_id'];
//echo $req['bowlingteam_id']."-----bowlingteam_id<br/>";
$fow = $req['fow'];
//echo $req['fow']."---fow<br/>";
$team_total=0;
$sixes=0;
$fours = 0;
$wkts = 0;
$extras = $req['extras'];
//logToFile('score', $extras);
//echo gettype($extras)."-----extrastype<br/>";
//echo $extras['wides']."-----wides<br/>";

//echo $extras['lbs']."-----lbs<br/>";

//echo $extras['noballs']."-----noballs<br/>";

////echo $extras['byes']."-----byes<br/>";

//echo $extras['total']."-----total<br/>";

$team_total = $team_total+$extras['total'];
//echo $team_total."----team_total<br/>";
$batting = $req['batting'];
$outStr = array('not out',"",' ', 'notout');
echo gettype($batting)."-----bat<br/>";
//logToFile('score', gettype($batting));
foreach($batting as $bat)
{
	//echo gettype($bat)."-----bat<br/>";
	//echo $bat['player_id']."-----player_id<br/>";
	//echo $bat['player_status']."-----player_status<br/>";
	//echo $bat['runs']."-----runs<br/>";
	//echo $bat['balls']."-----balls<br/>";
	//echo $bat['fours']."-----fours<br/>";
	//echo $bat['sixes']."-----sixes<br/>";

	$set = "bat_seq=".$bat['bat_seq'].",";
	$set .= "score=".$bat['runs'].",";
	$set .= "balls=".$bat['balls'].",";
	$set .= "fours=".$bat['fours'].",";
	$set .= "sixes=".$bat['sixes'].",";
	$set .= "out_str='".mysql_real_escape_string($bat['player_status'])."',";
	$os = array("Mac", "NT", "Irix", "Linux");
	if (!in_array(rtrim(strtolower($bat['player_status']),' '), $outStr)) 
	//if(rtrim(strtolower($bat['player_status']),' ') != "not out")
	{
		$wkts = $wkts+1;
	}
	echo $wkts."----Player Status ---".$bat['player_status'];
	$setValue = rtrim($set,',');
	$query = mysql_query("update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bat['player_id']." and team_id=".$battingteam_id);
	echo "update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bat['player_id']." and team_id=".$battingteam_id."<br/>";
	$team_total = $team_total + $bat['runs'];
	$fours = $fours  + $bat['fours'];
	$sixes = $sixes + $bat['sixes'];
	$memcache->delete("tourPlayerStats_".$req['tournament_id']."_".$bat['player_id']);
	//echo $team_total."----$team_total"; 
}

$bowling = $req['bowling'];


echo gettype($bowling)."-----bowling<br/>";
$ovrs = 0;
$set1 = '';
$ballsP = 0;
foreach($bowling as $bowl){
		$set1 = "bowl_seq=".$bowl['bowl_seq'].",";
		$set1 .= "overs=".$bowl['overs'].",";
		$set1 .= "madin=".$bowl['madin'].",";
		$set1 .= "b_runs=".$bowl['runs'].",";
		$set1 .= "wicks=".$bowl['wickets'].",";
		$set1 .= "wides=".$bowl['wides'].",";
		$set1 .= "nobals=".$bowl['nobals'].",";
		$set1 .= "b_sixes=".$bowl['b_sixes'].",";
		$set1 .= "b_fours=".$bowl['b_fours'].",";
		//$wkts = $wkts + $bowl['wickets'];
		//logToFile('score', floatval($bowl['overs']));
		$overs = explode(".",floatval($bowl['overs']));
		$oversplayed = $overs[0];
		//logToFile('score', "oversplayed-".$oversplayed);
		if($overs[1]>0 )
		{
			$ballsP = $ballsP + $overs[1];
			//logToFile('score', "ballsP-".$ballsP);
		}
		$ovrs = $ovrs + $oversplayed;
		//logToFile('score', "without-".$ovrs);
$setValue1 = rtrim($set1,',');
	$query = mysql_query("update match_has_player set ".$setValue1." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bowl['player_id']." and team_id=".$bowlingteam_id);
	echo "update match_has_player set ".$setValue1." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bowl['player_id']." and team_id=".$bowlingteam_id."<br/>";
	//{"player_id": 2,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}
	echo $bowl['player_id']."-----player_id<br/>";
	echo $bowl['overs']."-----overs<br/>";
	echo $bowl['runs']."-----runs<br/>";
	echo $bowl['wickets']."-----wickets<br/>";
	echo $bowl['dotballs']."-----dotballs<br/>";
	$memcache->delete("tourPlayerStats_".$req['tournament_id']."_".$bowl['player_id']);
}

if($ballsP>0)
{
	$baltoover = intval($ballsP/6);
	$remainBalls = fmod($ballsP,6);
	$ballsPlayed = floatval($baltoover) + floatval($remainBalls/10);
	$ovrs = $ovrs + $ballsPlayed;
}
$setteam = "bat_seq=".$req['team_seq'].",";
//$setteam = "bat_seq=1,";
 $setteam .= "inngs=".$inngs.",";
$setteam .= "score=".$team_total.",";
 $setteam .= "wickets=".$wkts.",";
$setteam .= "overs=".$ovrs.",";
$setteam .= "bys=".$extras['byes'].",";
//$setteam .= "bys=0,";
$setteam .= "leg_bys=".$extras['lbs'].",";
$setteam .= "wide=".$extras['wides'].",";
 $setteam .= "noballs=".$extras['noballs'].",";
$setteam .= "fours=".$fours.",";
$setteam .= "sixes=".$sixes.",";
$setteam .= "fall_of_wicket='".mysql_real_escape_string($req['fow'])."',";
///	echo $team_total."team_total";
			$setValue = rtrim($setteam,',');
			$query =  mysql_query("update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$battingteam_id);
			echo "update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$battingteam_id;
			$memcache->delete("detailmatch".$req['match_id']);
			$memcache->delete("matchTeamBYId".$req['match_id']);
			$memcache->delete("matchList");
			$query =  mysql_query("update cmatch set scorer='".$req['scorer']."' where match_id = ".$req['match_id']);
			$memcache->delete("matchList".$req['tournament_id']);
			$memcache->delete("tourStats".$req['tournament_id']);
			$memcache->delete("fixtures".$req['tournament_id']);
			$memcache->delete("fixtures");
			$memcache->delete("results".$req['tournament_id']);
			$memcache->delete("results");
			$memcache->delete("teamMatches".$battingteam_id);
			$memcache->delete("teamMatches".$bowlingteam_id);
			$memcache->delete("teamMatches");
		//	echo "Team Update"."<br/>";			
		//	echo "update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$battingteam_id."<br/>";
			$arry=array();
			$arry['status'] = 'false';
			$arry['scorer'] = $req['scorer'];
			if($team_total>0) $arry['status'] = 'true';
			$arry['total'] = $team_total;
			ob_clean();
			echo json_encode($arry);
			
?>