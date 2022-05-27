<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include("includes/db.php");
	include("includes/functions.php");
$req1 = json_decode($_REQUEST['requester']);
/*$req = '{"status": "success",'scorer':"Satya","battingteam_id": "23","inngs": "1","team_seq": "1","match_id": "1","bowlingteam_id": "36","batting":[{"player_id": 1,"player_status": "C rohit B tambe","runs": 40,"bat_seq":1,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 2,"player_status": "C rohit B tambe ","runs": 40,"bat_seq":2,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 3,"player_status": "batting ","runs": 40,"bat_seq":3,"balls": 50,"fours": 6,"sixes": 3}, {"player_id": 4,"player_status": "batting ","runs": 40,"bat_seq":4,"balls": 50,"fours": 6,"sixes": 3}],"bowling": [{"player_id": 1,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 2,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 3,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}, {"player_id": 1,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}],"extras": {"wides":13,"lbs":1,"byes":1,"noballs":2,"total": 17},"fow": "42-1,58-2.."}';*/
print_r($req1);
 $req = object_to_array($req1);
echo gettype($req);
//exit();
$battingteam_id = $req['battingteam_id'];
$tournament_id = $req['tournament_id'];
$inngs = $req['inngs'];
echo $req['battingteam_id']."---battingteam_id<br/>";
$match_id = $req['match_id'];
echo $req['match_id']."-----match_id<br/>";
$bowlingteam_id = $req['bowlingteam_id'];
echo $req['bowlingteam_id']."-----bowlingteam_id<br/>";
$fow = $req['fow'];
echo $req['fow']."---fow<br/>";
$team_total=0;
$sixes=0;
$fours = 0;
$extras = (array) json_decode($req['extras']);
echo gettype($extras)."-----extrastype<br/>";
echo $req['extras']."-----extras<br/>";
echo $extras."-----wides<br/>";

echo $extras['lbs']."-----lbs<br/>";

echo $extras['noballs']."-----noballs<br/>";

echo $extras['byes']."-----byes<br/>";

echo $extras['total']."-----total<br/>";

$team_total = $team_total+$extras['total'];
echo $team_total."----team_total<br/>";
$batting = (array) json_decode($req['batting']);
echo $req['batting']."-----batting<br/>";
foreach($batting as $bat)
{
	echo gettype($bat)."-----bat<br/>";
	echo $bat->player_id."-----player_id<br/>";
	echo $bat->player_status."-----player_status<br/>";
	echo $bat->runs."-----runs<br/>";
	echo $bat->balls."-----balls<br/>";
	echo $bat->fours."-----fours<br/>";
	echo $bat->sixes."-----sixes<br/>";

	$set = "bat_seq=".$bat->bat_seq.",";
	$set .= "score=".$bat->runs.",";
	$set .= "balls=".$bat->balls.",";
	$set .= "fours=".$bat->fours.",";
	$set .= "sixes=".$bat->sixes.",";
	$set .= "out_str='".mysql_escape_string($bat->player_status)."',";
	$setValue = rtrim($set,',');
	$query = mysql_query("update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bat->player_id." and team_id=".$battingteam_id);
	echo "update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bat->player_id." and team_id=".$battingteam_id."<br/>";
	$team_total = $team_total + $bat->runs;
	$fours = $fours  + $bat->fours;
	$sixes = $sixes + $bat->sixes;
	echo $team_total."----$team_total"; 
}

$bowling = (array) json_decode($req['bowling']);
echo $req['bowling']."---bowling<br/>";
$wkts = 0;
$ovrs = 0;
foreach($bowling as $bowl){
		$set = "bowl_seq=".$bowl->bowl_seq.",";
		$set .= "overs=".$bowl->overs.",";
		$set .= "madin=".$bowl->madin.",";
		$set .= "b_runs=".$bowl->runs.",";
		$set .= "wicks=".$bowl->wickets.",";
		$set .= "wides=".$bowl->wides.",";
		$set .= "nobals=".$bowl->nobals.",";
		$set .= "b_sixes=".$bowl->b_sixes.",";
		$set .= "b_fours=".$bowl->b_fours.",";
		$wkts = $wkts + $bowl->wickets;
		$ovrs = $ovrs + $bowl->overs;

	$query = mysql_query("update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bowl->player_id." and team_id=".$bowlingteam_id);
	echo "update match_has_player set ".$setValue." where match_id=".$match_id." and inngs=".$inngs." and player_id=".$bowl->player_id." and team_id=".$bowlingteam_id."<br/>";
	//{"player_id": 2,"overs": "4 ","runs": "30","wickets": 2,"bowl_seq":1,"madin":0,"wides":0,"nobals":0,"b_sixes":7,"b_fours":6,"dotballs": 6}
	echo $bowl->player_id."-----player_id<br/>";
	echo $bowl->overs."-----overs<br/>";
	echo $bowl->runs."-----runs<br/>";
	echo $bowl->wickets."-----wickets<br/>";
	echo $bowl->dotballs."-----dotballs<br/>";
}


$setteam = "bat_seq=".$req['team_seq'].",";
 $setteam .= "inngs=".$inngs.",";
$setteam .= "score=".$team_total.",";
 $setteam .= "wickets=".$wkts.",";
$setteam .= "overs=".$ovrs.",";
$setteam .= "bys=".$extras['byes'].",";
$setteam .= "leg_bys=".$extras['lbs'].",";
$setteam .= "wide=".$extras['wides'].",";
 $setteam .= "noballs=".$extras['noballs'].",";
$setteam .= "fours=".$fours.",";
$setteam .= "sixes=".$sixes.",";
$setteam .= "fall_of_wicket='".mysql_escape_string($req['fow'])."',";
	echo $team_total."team_total";
			$setValue = rtrim($setteam,',');
			$query =  mysql_query("update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$battingteam_id);
			$memcache->delete("detailmatch".$req['match_id']);
			$memcache->delete("matchList");
			$query =  mysql_query("update cmatch set scorer='".$req['scorer']."' where match_id = ".$req['match_id']);
			$memcache->delete("matchList".$req['tournament_id']);
			echo "Team Update"."<br/>";			
			echo "update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$battingteam_id."<br/>";
			$arry=array();
			$arry['status'] = 'false';
			if($team_total>0) $arry['status'] = 'true';
			$arry['total'] = $team_total;
			//ob_clean();
			echo json_encode($arry);
			
?>