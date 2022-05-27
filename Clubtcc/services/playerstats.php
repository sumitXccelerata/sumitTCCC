<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include("includes/db.php");
include("includes/functions.php");
function getSR($runs,$balls){
	$temp =0;
	if($balls!=0){
	$temp = round(($runs/$balls)*10000);
	}
	$temp = $temp/100;
	return $temp;
}
function getEcon($runs,$over){
	$balls = floor($over)*6 + ($over - floor($over))*10;
	$temp =  round(($runs/$balls)*600);
	$temp = $temp/100;
	return $temp;
}


$stats =array();
$stats['status'] = "false";
$stats['msg'] = "Incorrect/Invalid Tournament Id.";
if(empty($_REQUEST['tournament_id'])) return json_encode($stats);
$tourid = $_REQUEST["tournament_id"];
$stats['status'] = "false";
$stats['msg'] = "Incorrect/Invalid Player Id.";
if(empty($_REQUEST['player_id'])) return json_encode($stats);
$player_id = $_REQUEST["player_id"];
$key = "tourPlayerStats_".$tourid."_".$player_id;
$player = $memcache->get($key);
if(!$player)
{
	$query = "SELECT p.player_name,p.player_id,p.player_logo,t.team_id,t.team_small_name,t.team_name,count(score) as innings,sum(mhp.wicks) as wickets,sum(mhp.score) as runs,sum(mhp.balls) as balls,sum(mhp.fours) as fours ,sum(mhp.sixes) as sixes,sum(mhp.b_runs) as b_runs,sum(mhp.overs) as overs,sum(mhp.f_catches) as catches,max(mhp.score) as highscore FROM match_has_player mhp , player p ,team t where mhp.match_id IN (select match_id from cmatch where tournament_id = $tourid and match_status not in (0,3)) and mhp.team_id= t.team_id and mhp.player_id = p.player_id and mhp.player_id=".$player_id."  group by mhp.player_id";
	///echo $query."<br/>";
	$res1 =mysql_query($query);
	$player =array();
	$player['status'] = "true";
	$player['message'] = "No Stats Found for the player.";
	while($row1 = mysql_fetch_object($res1))
	{	
		$player['message'] = "Stats Found.";
		foreach($row1 as $column_name=>$column_value)
		{
			$player[$column_name] = $column_value;
		}
		$tbstrikeRate = 0.0;
		$tbstrikeRate1 =getSR($row1->runs,$row1->balls);
		if($tbstrikeRate1!=null)$tbstrikeRate = $tbstrikeRate1;
		$player["strikerate"]=$tbstrikeRate; 
		
		$tboeco =0;
		$tboeco1 = 0;
		if($row1->overs!=0){$tboeco1 = getEcon($row1->b_runs,$row1->overs);}
		if($tboeco1!=null)$tboeco = $tboeco1;
		$player["economy"]=$tboeco;
		$query1 = "SELECT count(score) as innings FROM match_has_player mhp where mhp.match_id IN (select match_id from cmatch where tournament_id = $tourid and match_status not in (0,3)) and mhp.out_str not in('','not out') and mhp.player_id=".$player_id."  group by mhp.player_id";
		//echo $query1;
		$res2 =mysql_query($query1);
		$innings = 1;
		if(mysql_num_rows($res2)> 0)
		{
			$row2 = mysql_fetch_row($res2);
			$innings = 1;
		}
		$player["avarage"]= $row1->runs/$innings;
	}
	$memcache->set($key, $player, 0,0);
}

ob_clean();
echo json_encode($player);
?>