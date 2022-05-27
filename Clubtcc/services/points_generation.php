<?php 
	include("includes/db.php");
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	include("includes/functions.php");
	$query =  mysql_query("select m.* from cmatch m where points=3 and is_points=1");
	//echo "select m.* from cmatch m where points=3 and is_points=1";
	if(mysql_num_rows($query) > 0)
	{
		while($row = mysql_fetch_object($query))
		{
			if($row->winning_team_id>0)
			{
				//echo $row->tournament_id;
				//echo "<br/>";
				$match_id=$row->match_id;
				$tournament_id=$row->tournament_id;
				$winning_team_id=$row->winning_team_id;
				$match_result_status=$row->match_result_status;
				$win=0;
				$lostteamId=0;
				$draw=0;
				$cancel=0;
				mysql_query("update cmatch set points=4,is_points=2 where match_id=".$match_id);
				$query1 =  mysql_query("select t.* from points_confiure t where tournament_id=".$row->tournament_id." order by t.pc_id desc");
				if(mysql_num_rows($query1) > 0)
				{
					while($row1 = mysql_fetch_object($query1))
					{
						if($row1->pc_name == "win")$win=$row1->points;
						if($row1->pc_name == "draw")$draw=$row1->points;
						if($row1->pc_name == "cancel")$cancel=$row1->points;
					}
				}
				$queryteams =  mysql_query("select mt.team_id from match_has_team mt where mt.match_id=".$match_id);
				//echo "select mt.team_id from match_has_team mt where mt.match_id=".$match_id;
				//echo "<br/>";
				if(mysql_num_rows($queryteams) > 0)
				{
					while($rowteams = mysql_fetch_object($queryteams))
					{
						if($winning_team_id != $rowteams->team_id) $lostteamId=$rowteams->team_id;
					}
				}
				echo $winning_team_id."winning_team_id";echo "---";
					echo $lostteamId."lostteamId";echo "--";
				if($winning_team_id != 0 && $lostteamId != 0)
				{
					
					$runratewinteam = 0.0;
					$runratewinteam1 = 0.0;
					$runratewinteam2 = 0.0;
					$matchesIds = array();
					$wrunrateq = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets from match_has_team mt where mt.match_id in (select match_id from cmatch where match_status=1 and tournament_id=".$tournament_id.") and team_id=".$winning_team_id);
					if(mysql_num_rows($wrunrateq) > 0)
					{
						$ovrs =0;
						$ov = 0;
						$ballsP = 0;
						$scored = 0;
						while($wrunrateeams = mysql_fetch_object($wrunrateq))
						{
							$scored = $scored + $wrunrateeams->scored;
							$matchesIds[]=$wrunrateeams->match_id;
							if($wrunrateeams->wickets == 10) $oversplayed = $wrunrateeams->maxOvers;
							else
							{
								$overs = explode(".",floatval($wrunrateeams->oversplayed));
								$oversplayed = $overs[0];
								if(count($overs) >= 2)
								{
									$ballsP = $ballsP + $overs[1];
								}	
							}
							$ovrs = $ovrs + $oversplayed;
						}
						if($ballsP>0)
						{
							$baltoover = intval($ballsP/6);
							$remainBalls = fmod($ballsP,6);
							$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
							$ovrs = $ovrs + $ballsPlayed;
						}
						if($ovrs!=0 && $scored!=0) $runratewinteam1 = $scored/$ovrs;
					}
					
					$wrunrateq1 = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scorec,mt.match_id,mt.wickets,c.winning_team_id,c.match_result_status from match_has_team mt,cmatch c where mt.match_id in (".implode(",",$matchesIds).") and mt.match_id=c.match_id and team_id !=".$winning_team_id);
					if(mysql_num_rows($wrunrateq1) > 0)
					{
						$ovrsb =0;
						$ov = 0;
						$ballsP = 0;
						$scorec = 0;
						while($wrunrateeams1 = mysql_fetch_object($wrunrateq1))
						{
							$scorec = $scorec + $wrunrateeams1->scorec;
							if($wrunrateeams1->wickets == 10) $oversbowled = $wrunrateeams1->maxOvers;
							else
							{
								$overs = explode(".",floatval($wrunrateeams1->oversplayed));
								$oversbowled = $overs[0];
								if(count($overs) >= 2)
								{
									$ballsP = $ballsP + $overs[1];
								}	
							}
							$ovrsb = $ovrsb + $oversbowled;
						}
						if($ballsP>0)
						{
							$baltoover = intval($ballsP/6);
							$remainBalls = fmod($ballsP,6);
							$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
							$ovrsb = $ovrsb + $ballsPlayed;
						}
						if($ovrsb!=0 && $scorec!=0) $runratewinteam2 = $scorec/$ovrsb;
					}
					echo $runratewinteam1."==1--";
					echo $runratewinteam2."==2--";
					echo $runratewinteam = $runratewinteam1-$runratewinteam2;
					echo $runratewinteam."---<br/>";
					
					$runratelostteam = 0.0;
					$runratelostteam1 = 0.0;
					$runratelostteam2 = 0.0;
					$matchesIds1= array();
					$lrunrateq = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scored,mt.match_id,mt.wickets from match_has_team mt where mt.match_id in (select match_id from cmatch where match_status=1 and tournament_id=".$tournament_id.") and team_id=".$lostteamId);
					if(mysql_num_rows($lrunrateq) > 0)
					{
						$ovrs =0;
						$ov = 0;
						$ballsP = 0;
						$scored = 0;
						while($lrunraterow = mysql_fetch_object($lrunrateq))
						{
							$scored = $scored + $lrunraterow->scored;
							$matchesIds1[]=$lrunraterow->match_id;
							if($lrunraterow->wickets == 10) $oversplayed = $lrunraterow->maxOvers;
							else
							{
								$overs = explode(".",floatval($lrunraterow->oversplayed));
								$oversplayed = $overs[0];
								if(count($overs) >= 2)
								{
									$ballsP = $ballsP + $overs[1];
								}	
							}
							$ovrs = $ovrs + $oversplayed;
						}
						if($ballsP>0)
						{
							$baltoover = intval($ballsP/6);
							$remainBalls = fmod($ballsP,6);
							$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
							$ovrs = $ovrs + $ballsPlayed;
						}
						if($ovrs!=0 && $scored!=0) $runratelostteam1 = $scored/$ovrs;
					}
					
					$lrunrateq1 = mysql_query("select mt.overs as oversplayed, mt.maxOvers,mt.score as scorec,mt.match_id,mt.wickets,c.winning_team_id,c.match_result_status from match_has_team mt,cmatch c where mt.match_id in (".implode(",",$matchesIds1).") and mt.match_id=c.match_id and team_id !=".$lostteamId);
					if(mysql_num_rows($lrunrateq1) > 0)
					{
						$ovrsb =0;
						$ov = 0;
						$ballsP = 0;
						$scorec = 0;
						while($lrunraterow1 = mysql_fetch_object($lrunrateq1))
						{
							$scorec = $scorec + $lrunraterow1->scorec;
							if($lrunraterow1->wickets == 10) $oversbowled = $lrunraterow1->maxOvers;
							else
							{
								$overs = explode(".",floatval($lrunraterow1->oversplayed));
								$oversbowled = $overs[0];
								if(count($overs) >= 2)
								{
									$ballsP = $ballsP + $overs[1];
								}	
							}
							$ovrsb = $ovrsb + $oversbowled;
						}
						if($ballsP>0)
						{
							$baltoover = intval($ballsP/6);
							$remainBalls = fmod($ballsP,6);
							$ballsPlayed = floatval($baltoover) + round(floatval($remainBalls/60),3);
							$ovrsb = $ovrsb + $ballsPlayed;
						}
						if($ovrsb!=0 && $scorec!=0) $runratelostteam2 = $scorec/$ovrsb;
					}
					echo $runratelostteam1."==1--";
					echo $runratelostteam2."==2--";
					echo $runratelostteam = $runratelostteam1-$runratelostteam2;
					echo $runratelostteam."---<br/>";
					echo $match_result_status;echo "--";
					echo $winning_team_id."winning_team_id";echo "---";
					echo $lostteamId."lostteamId";echo "<br/>";
					//ob_clean();
					$runratelostteam = round($runratelostteam,3); 
					$runratewinteam = round($runratewinteam,3);
					if ($runratelostteam >= 0) $runratelostteam = "+".(string)$runratelostteam;
					if ($runratewinteam >= 0)  $runratewinteam = "+".(string)$runratewinteam;
					echo $runratelostteam."runratelostteam---<br/>";
					echo $runratewinteam."runratewinteam---<br/>";
					//played=,won=,Lost=,tied=,nr=,points=,runrate=
					if($match_result_status==1)
					{
						mysql_query("update tournament_has_team set played=played+1,points=(points+$win),won=won+1,runrate='".$runratewinteam."' where tournament_id=".$tournament_id." and team_id=".$winning_team_id);
						mysql_query("update tournament_has_team set played=played+1,Lost=Lost+1,runrate='".$runratelostteam."' where tournament_id=".$tournament_id." and team_id=".$lostteamId);	
						//echo "update tournament_has_team set played=played+1,points=(points+$win),won=won+1,runrate='".$runratewinteam."' where tournament_id=".$tournament_id." and team_id=".$winning_team_id;
						//echo "<br/>";
						//echo "update tournament_has_team set played=played+1,won=won+1,runrate='".$runratewinteam."' where tournament_id=".$tournament_id." and team_id=".$lostteamId;
					}
					
					if($match_result_status==2)
					{
						mysql_query("update tournament_has_team set played=played+1,points=(points+$draw),tied=tied+1,runrate='".$runratewinteam."' where tournament_id=".$tournament_id." and team_id=".$winning_team_id);
						mysql_query("update tournament_has_team set played=played+1,points=(points+$draw),tied=tied+1,runrate='".$runratelostteam."' where tournament_id=".$tournament_id." and team_id=".$lostteamId);	
					}
					if($match_result_status==3)
					{
						mysql_query("update tournament_has_team set played=played+1,points=(points+$cancel),nr=nr+1,runrate='".$runratewinteam."' where tournament_id=".$tournament_id." and team_id=".$winning_team_id);
						mysql_query("update tournament_has_team set played=played+1,points=(points+$cancel),nr=nr+1,runrate='".$runratelostteam."' where tournament_id=".$tournament_id." and team_id=".$lostteamId);	
					}
					
					//ob_clean();
					$memcache->delete("tourTeamPoints".$tournament_id);
					$memcache->delete("tourTeamPoints");
				}
			}
		}
	}
?>