<?php 
	include("includes/db.php");
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	include("includes/functions.php");
	$points= array();
	$query1 =  mysql_query("select t.* from points_confiure t order by t.tournament_id desc");
	if(mysql_num_rows($query1) > 0)
	{
		while($row1 = mysql_fetch_object($query1))
		{
			if(!array_key_exists($row1->tournament_id,$points))
			{
				//echo "ddd<br/>";
				$points[$row1->tournament_id]= array();
				$points[$row1->tournament_id]['win']= 0;
				$points[$row1->tournament_id]['draw']= 0;
				$points[$row1->tournament_id]['cancel']= 0;
			}
			//mysql_query("update tournament_has_team_p set played=0,points=0,Lost=0,nr=0,won=0,tied=0,runrate='0.0' where tournament_id=".$row1->tournament_id);
			if($row1->pc_name == "win") $points[$row1->tournament_id]['win'] = $row1->points;
			if($row1->pc_name == "draw") $points[$row1->tournament_id]['draw'] = $row1->points;
			if($row1->pc_name == "cancel") $points[$row1->tournament_id]['cancel'] = $row1->points;
			
		}
	}
	//print_r($points);
	// and t.team_id = 7
	$query =  mysql_query("select tp.*,t.team_name from tournament_has_team_p tp,team t where t.team_id=tp.team_id order by tp.team_id asc,tp.tournament_id asc");
	if(mysql_num_rows($query) > 0)
	{
		while($row = mysql_fetch_object($query))
		{
			//echo $row->team_id.'<br/>';
			$runrate = 0.0;
			$runratewinteam1 = 0.0;
			$runratewinteam2 = 0.0;
			$matchesPlayed = 0;
			$matchesIds=array();
			$wrunrateq = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets from match_has_team mt where mt.match_id in (select match_id from cmatch where match_status=1 and tournament_id=".$row->tournament_id.") and team_id=".$row->team_id);
			//echo "select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets from match_has_team mt where mt.match_id in (select match_id from cmatch where match_status=1 and tournament_id=".$row->tournament_id.") and team_id=".$row->team_id;
			if(mysql_num_rows($wrunrateq) > 0)
			{
				$ovrs =0;
				$ballsP = 0;
				$scored = 0;
				while($wrunrateeams = mysql_fetch_object($wrunrateq))
				{
					$matchesPlayed = $matchesPlayed +1;
					$matchesIds[]=$wrunrateeams->match_id;
					$scored = $scored + $wrunrateeams->scored;
					$overs = explode(".",floatval($wrunrateeams->oversplayed));
					$oversplayed = $overs[0];
					if(count($overs) >= 2)
					{
						$ballsP = $ballsP + $overs[1];
					}	
					//echo "oversPlayed---".$oversplayed."<br/>";
					$ovrs = $ovrs + $oversplayed;
				}
				if($ballsP>0)
				{
					$baltoover = intval($ballsP/6);
					$remainBalls = fmod($ballsP,6);
					$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
				//	$ballsPlayed = $ballsP/6;
					$ovrs = $ovrs + $ballsPlayed;
				}
				echo "Totalovrs---".$ovrs."<br/>";
				echo "scored---".$scored."<br/>";
				if($ovrs!=0 && $scored!=0) $runratewinteam1 = $scored/$ovrs;
			}
			$wpoints = 0;
			$dpoints = 0;
			$nrpoints = 0;
			if(array_key_exists($row->tournament_id,$points))
			{
				 $wpoints =  $points[$row->tournament_id]['win'];
				 $dpoints =  $points[$row->tournament_id]['draw'];
				 $nrpoints =  $points[$row->tournament_id]['cancel'];
			}
			
			$win = 0;
			$lost = 0;
			$draw = 0;
			$nr = 0;
			$tpoints=0;
			$wrunrateq1 = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets,c.winning_team_id,c.match_result_status from match_has_team mt,cmatch c where mt.match_id in (".implode(",",$matchesIds).") and mt.match_id=c.match_id and team_id !=".$row->team_id);
			//echo "select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets,c.winning_team_id from match_has_team mt,cmatch c where mt.match_id in (".implode(",",$matchesIds).") and mt.match_id=c.match_id and team_id !=".$row->team_id;
			if(mysql_num_rows($wrunrateq1) > 0)
			{
				$ovrs =0;
				$ballsP = 0;
				$scored = 0;
				
				while($wrunrateeams1 = mysql_fetch_object($wrunrateq1))
				{
					$scored = $scored + $wrunrateeams1->scored;
					
					if($wrunrateeams1->wickets == 10) $oversplayed = $wrunrateeams1->maxOvers;
					else
					{
						$overs = explode(".",floatval($wrunrateeams1->oversplayed));
						$oversplayed = $overs[0];
						if(count($overs) >= 2)
						{
							$ballsP = $ballsP + $overs[1];
						}	
					}
					if($wrunrateeams1->winning_team_id == $row->team_id)
					{
						$win = $win +1;
						$tpoints = $tpoints +$wpoints;
					}
					if($wrunrateeams1->winning_team_id != $row->team_id)
					{
						if($wrunrateeams1->match_result_status==1) $lost = $lost +1;
						if($wrunrateeams1->match_result_status==2)
						{
							$draw = $draw +1;
							$tpoints = $tpoints +$dpoints;
						}
						if($wrunrateeams1->match_result_status==3)
						{
							 $nr = $nr +1;
							 $tpoints = $tpoints +$nrpoints;
						}
					}
					
					//echo "oversBowled---".$oversplayed."<br/>";
					$ovrs = $ovrs + $oversplayed;
				}
				if($ballsP>0)
				{
					$baltoover = intval($ballsP/6);
					$remainBalls = fmod($ballsP,6);
					$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
					$ovrs = $ovrs + $ballsPlayed;
				}
				echo "TotalovrsBowled---".$ovrs."<br/>";
				echo "scored---".$scored."<br/>";
				if($ovrs!=0 && $scored!=0) $runratewinteam2 = $scored/$ovrs;
			}
			
			$runrate = $runratewinteam1- $runratewinteam2;
			echo $row->team_name."-------**".$runrate."--winpoints=".$tpoints."--matchesPlayed=".$matchesPlayed."--win=".$win."--lost=".$lost."--draw=".$draw."--nr=".$nr."<br/>";
			//print_r($matchesIds);
			echo "<br/>";
			
			//mysql_query("update tournament_has_team_p set played=$matchesPlayed,points=$tpoints,Lost=$lost,nr=$nr,won=$win,tied=$draw,runrate='".$runrate."' where tournament_id=".$row->tournament_id." and team_id=".$row->team_id);
			
		}
	}
	
	
	
	
	
	
	
?>