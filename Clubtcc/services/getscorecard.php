<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
//echo "<pre/>";
require_once("includes/db.php");

$rarray =  array();
$rarray['status'] = "false";
$rarray['msg'] = "Incorrect/Invalid Match Id.";
if(empty($_REQUEST['match_id'])) return json_encode($rarray);
$mid = $_REQUEST["match_id"];	
$cat = "International";
$arry= array("Test Match","Three day match","Four day match");
$inngs = 1;
$bating_team="";
$rarray['status'] = "true";
$rarray['msg'] = "Match Scorecard.";
$query = "SELECT m.match_name,m.location,m.description,m.toss,m.umpire1,m.umpire2,m.tv_umpire, m.match_ref, m.res_umpire, m.mom_id, m.starttime,  m.scorer, t.tournament_name , mt.match_type_title,t.tournament_id,m.match_cat,m.match_result,m.match_type_id from cmatch m ,tournament t ,match_type mt where t.tournament_id = m.tournament_id and mt.match_type_id = m.match_type_id and match_id=$mid";
$score = array();
$res = mysql_query($query);
while($row = mysql_fetch_object($res))
{
	foreach($row as $column_name=>$column_value)
	{
		$score[$column_name] = $column_value;
	}
	
	$manofthematch = array();
	$query_p = "select p.player_logo, p.player_name, p.player_logo from cmatch m,player p where m.mom_id = p.player_id and m.match_id=$mid";
	$res_p =mysql_query($query_p);
	while($row_p = mysql_fetch_object($res_p))
	{
		foreach($row_p as $column_name=>$column_value)
		{
			$manofthematch[$column_name] = $column_value;
		}
	}
	$score["manofthematch"]=$manofthematch;
	  
	$teams = array();
	$query_team = "select mht.match_id, mht.team_id, mht.bat_seq, mht.inngs, mht.score, mht.wickets, mht.result, mht.overs, mht.bys, mht.leg_bys, mht.wide, mht.noballs, mht.fall_of_wicket,te.team_name,te.team_small_name, mht.maxOvers FROM match_has_team mht,team te WHERE mht.match_id = $mid and mht.team_id =te.team_id ORDER BY inngs,bat_seq";
	
	$res_team =mysql_query($query_team);
	$team_ids = array();
	$count =0;
	$getovers = 0;
	 while($row_team = mysql_fetch_object($res_team))
	 {
		$team_ids[] = $row_team->team_id;
	 }
	// print_r($team_ids);
	// echo count($team_ids);
	 if(count($team_ids)>=2)
	 {
		$k=0;
		$res_team =mysql_query($query_team);
		while($row_team = mysql_fetch_object($res_team))
		{
			$team = array();
			foreach($row_team as $column_name=>$column_value)
			{
				$team[$column_name] = $column_value;
			}
			
			if($k ==0 || $k ==2) $bowling_teamid = $team_ids[$k+1];
			else $bowling_teamid = $team_ids[$k-1];
			$batting = array();
			$bowling = array();
			$batting_query = "select mhp.out_str,mhp.fours,mhp.sixes,mhp.score,mhp.balls, pl.player_name,pl.player_id,pl.player_logo from match_has_player mhp,player pl Where mhp.match_id= $mid and mhp.team_id = ".$team_ids[$k]." and mhp.bat_seq>0 and mhp.player_id = pl.player_id and mhp.inngs = ".$row_team->inngs." ORDER BY mhp.bat_seq";
			//echo "<br/>";
			$k++;
			//echo $k;echo "<br/>";
			//echo $bowling_teamid;echo "<br/>";
			$res_batting =mysql_query($batting_query);
			while($row_batting = mysql_fetch_object($res_batting))
			{
				$batsmen = array();
				foreach($row_batting as $column_name=>$column_value)
				{
					$batsmen[$column_name] = $column_value;
				}
				
				$tbstrikeRate = 0.0;
				$tbstrikeRate1 =getSR($row_batting->score,$row_batting->balls);
				if($tbstrikeRate1!=null)$tbstrikeRate = $tbstrikeRate1;
				$batsmen["tbstrikeRate"]=$tbstrikeRate; 
				$batting[] =$batsmen;
			}
			$team['batting'] = $batting;
			
			$query_bowling = "select mhp.overs,mhp.madin,mhp.b_runs,mhp.wicks,mhp.wides,mhp.nobals, pl.player_name,pl.player_id,pl.player_logo,te.team_name,te.team_small_name from match_has_player mhp,player pl, team te Where mhp.match_id= $mid and mhp.team_id =te.team_id and mhp.team_id = ".$bowling_teamid." and mhp.bowl_seq>0 and mhp.player_id = pl.player_id and mhp.overs >0 and mhp.inngs = ".$row_team->inngs." ORDER BY mhp.bowl_seq";//echo "<br/>";
			$res_bowling =mysql_query($query_bowling);
			while($row_bowling = mysql_fetch_object($res_bowling))
			{
				$bowler = array();
				foreach($row_bowling as $column_name=>$column_value)
				{
					$bowler[$column_name] = $column_value;
				}
				$tboeco =0;
				$tboeco1 = 0;
				if($row_bowling->overs!=0){$tboeco1 = getEcon($row_bowling->b_runs,$row_bowling->overs);}
				if($tboeco1!=null)$tboeco = $tboeco1;
				$bowler["tboeco"]=$tboeco;
				
				$tboexts =0;
				$tboexts1 = getExt($row_bowling->nobals,$row_bowling->wides);
				if($tboexts1 != null)$tboexts = $tboexts1;
				$bowler["tboexts"]= $tboexts;
				if($row_bowling->overs!=0)$bowling[] = $bowler;
			}
			 
			$team['bowling'] = $bowling;
			$teams[] = $team;
		}
	 }
	$score["teams"]=$teams;
	$rarray['status'] = "true";
	$rarray['msg'] = "Match Scorecard.";
}


ob_clean();
$rarray['scorecard'] = $score;
echo json_encode($rarray);


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

function getExt($nb,$w){
	$rstr = "";
	if($nb != 0){
		$rstr = $nb."nb";
	}
	if($w != 0){
		if($rstr == ""){
			$rstr = $w."w";
		}
		else{
			$rstr .= ", ".$w."w";
		}
	}
	if($rstr != ""){
		$rstr = "(".$rstr.")";
	}
	return $rstr;
}
?>