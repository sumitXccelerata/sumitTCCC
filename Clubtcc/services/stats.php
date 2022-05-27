<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include("includes/db.php");
include("includes/functions.php");

$stats =array();
$stats['status'] = "false";
$stats['msg'] = "Incorrect/Invalid Tournament Id.";
if(empty($_REQUEST['tournament_id'])) return json_encode($stats);

$tourid = $_REQUEST["tournament_id"];
$key1 = "tourStats".$tourid;
	$stats = $memcache->get($key1);
	if(!$stats)
	{
		$stats["tournament_id"]=$tourid;
		$stats["tournament_name"]="";
		$query = mysql_query("select t.tournament_name from tournament t where t.tournament_id = $tourid");
		while($row = mysql_fetch_object($query))
		{	
			$stats["tournament_name"]=$row->tournament_name;
			$stats['status'] = "true";
			$stats['msg'] = "Tournament Stats.";
		}
		
		$players =array();
		//$teamid = $_REQUEST["teamid"];
		$c1= array("wickets"=> "sum(mhp.wicks)","runs"=> "sum(mhp.score)","fours"=> "sum(mhp.fours)","sixes"=> "sum(mhp.sixes)","centuries"=> "count(mhp.score)","fifties"=> "count(mhp.score)","wkts5"=> "count(mhp.wicks)");
		
		$where = "";
		$wickets =array();
		$runs =array();
		$fours =array();
		$sixes =array();
		$centuries =array();
		$fifties =array();
		$wkts5 =array();
		
			foreach($c1 as $key=>$ty)
			{
				$orderby = "";
				if($key == "centuries") $where ="and mhp.score >= 100";
				if($key == "fifties") $where ="and mhp.score < 100 and mhp.score >= 50";
				if($key == "fifties") $orderby =", mhp.balls asc";
				if($key == "centuries") $orderby =", mhp.balls asc";
				if($key == "wkts5") $where ="and mhp.wicks >= 5";
				$query = "SELECT p.player_name,p.player_id,p.player_logo,t.team_id,t.team_small_name,t.team_name,$ty as score,$ty as $key FROM match_has_player mhp , player p ,team t where mhp.match_id IN (select match_id from cmatch where tournament_id = $tourid and match_status not in (0,3)) and mhp.team_id= t.team_id $where and mhp.player_id = p.player_id group by mhp.player_id order by $ty desc$orderby limit 0,10";
				echo $query."<br/>";
				$res1 =mysql_query($query);
				$players=array();
				while($row1 = mysql_fetch_object($res1))
				{	
					$player =array();
					if ( $row1->score != "0")
					{
						foreach($row1 as $column_name=>$column_value){
								$player[$column_name] = $column_value;
							}
						$players[]=$player;
					}	
				}
				$$key=$players;
				$stats[$key]=$$key;
			}
		$memcache->set($key1, $stats, 0,0);
	}
ob_clean();
echo json_encode($stats);
?>