<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createMatch_Team($_REQUEST,$memcache);	
			break;
		
		case "createmulti":
			$result = createMatch_Team_Multi($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteMatch_Team($_REQUEST,$memcache);	
			break;
			
		case "update":
			$result = updateMatch_Team($_REQUEST,$memcache);	
			break;
			
		case "updatescore":
			$result = updateMatch_Team_score($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listMatch_Team($_REQUEST,$memcache);	
			break;
			
		case "totallist":
			$result = listMatch_TeamTotal($_REQUEST,$memcache);	
			break;
		
		case "default":
			$arry =  array();
			$arry['status'] = "false";
			$arry['msg'] = "Invalid Type";
			$result = json_encode($arry);
			break;		
	}
	ob_clean();
	echo $result;
	
	/* create Match_Team  */
	//url = /match_has_team.php?type=create&match_id=&team_id=&tournament_id=&inngs=
	function createMatch_Team($req,$memcache)
	{
		$arry =  array();

		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$inngs=1;
		if(!empty($req['inngs'])) $inngs=$req['inngs'];
		
		
		$arry['status'] = "false";
		$arry['msg'] = "Team already exists in Match, please choose another.";
		$favexits = mysql_query("select mhs_id from match_has_team where match_id=".$req['match_id']." and team_id=".$req['team_id']." and inngs=".$inngs);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO match_has_team(match_id,team_id,inngs) VALUES (".$req['match_id'].",".$req['team_id'].",".$inngs.")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Team added successfully.";
				$arry['mhs_id'] = mysql_insert_id();
				$memcache->delete("matchteamList".$req['match_id']);
				$memcache->delete("matchTeamBYId".$req['match_id']);
				$memcache->delete("matchListByTeamId".$req['team_id']."_".$req['tournament_id']);
				$memcache->delete("matchTotalteamList");
				$memcache->delete("teamMatches".$req['team_id']);
				$memcache->delete("fixtures".$req['tournament_id']);
				$memcache->delete("fixtures");
				$memcache->delete("results".$req['tournament_id']);
				$memcache->delete("results");
			}
		}
		
				$arry['tournament_id'] = $req['tournament_id'];
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	/* update Match_Team  */
	//url = /match_has_team.php?type=update&mht_id=&team_id=&match_id=&tournament_id=
	function updateMatch_Team($req,$memcache)
	{
		$arry =  array();

		if(empty($req['mht_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Has Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$query =  mysql_query("update match_has_team set team_id=".$req['team_id']." where mht_id = ".$req['mht_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Match Team updated successfully.";
			$memcache->delete("matchteamList".$req['match_id']);
			$memcache->delete("matchTeamBYId".$req['match_id']);
			$memcache->delete("matchTotalteamList");
			$memcache->delete("teamMatches".$req['team_id']);
			$memcache->delete("matchListByTeamId".$req['team_id']."_".$req['tournament_id']);
			$memcache->delete("fixtures".$req['tournament_id']);
			$memcache->delete("fixtures");
			$memcache->delete("results".$req['tournament_id']);
			$memcache->delete("results");
		}
		
				$arry['tournament_id'] = $req['tournament_id'];
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* create Match Team multi  */
	//url = /match_has_team.php?type=createmulti&match_id=&team_ids=&tournament_id=&inngs=
	function createMatch_Team_Multi($req,$memcache)
	{
		$arry =  array();
		$notadd =  array();
		$exceed =  array();
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_ids']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$inngs=1;
		if(!empty($req['inngs'])) $inngs=$req['inngs'];
		$tht_id= array();
		$team_ids = explode(",",$req['team_ids']);
		foreach($team_ids as $team_id)
		{
			if(!empty($team_id))
			{
				$arry['status'] = "false";
				$matchexits = mysql_query("select mhs_id from match_has_team where match_id=".$req['match_id']);
				if(mysql_num_rows($matchexits) <2)
				{
					$favexits = mysql_query("select mhs_id from match_has_team where match_id=".$req['match_id']." and team_id=".$team_id." and inngs=".$inngs);
					if(mysql_num_rows($favexits) <= 0)
					{
						$query =  mysql_query("INSERT INTO match_has_team(match_id,team_id,inngs) VALUES (".$req['match_id'].",".$team_id.",".$inngs.")");
						if(mysql_insert_id()>0)
						{
							$arry['msg'] = "Team added successfully.";
							$arry['status'] = "true";
							$tht_id[] = mysql_insert_id();
							$memcache->delete("matchListByTeamId".$team_id."_".$req['tournament_id']);
							$memcache->delete("teamMatches".$team_id);
						}
					}
					else $notadd[] = $team_id;	
				}
				else  $exceed[] = $team_id;	
			}
		}
		$arry['mht_id'] = $tht_id;
		
				$arry['tournament_id'] = $req['tournament_id'];
		if(!empty($notadd)){ $arry['duplicates'] = implode(",",$notadd); $arry['msg'] = "Match Team has duplicates.";}
		if(!empty($exceed)){ $arry['duplicates'] = implode(",",$exceed); $arry['msg'] = "Match Team count exceded.";}
		$memcache->delete("matchteamList".$req['match_id']);
		$memcache->delete("matchTotalteamList");
		$memcache->delete("matchTeamBYId".$req['match_id']);
		$memcache->delete("fixtures".$req['tournament_id']);
		$memcache->delete("fixtures");
		$memcache->delete("results".$req['tournament_id']);
		$memcache->delete("results");
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update score match_has_team  */
	//url = /match_has_team.php?type=updatescore&match_id=&team_id=&bat_seq=&inngs=&score=&wickets=&result=&overs=&bys=&leg_bys=&wide=&noballs=&fall_of_wicket=&maxOvers=&fours=&sixes=
	function updateMatch_Team_score($req,$memcache)
	{
		$arry =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['bat_seq'])) $set .= "bat_seq=".$req['bat_seq'].",";
		if(!empty($req['inngs'])) $set .= "inngs=".$req['inngs'].",";
		if(!empty($req['score'])) $set .= "score=".$req['score'].",";
		if(!empty($req['wickets'])) $set .= "wickets=".$req['wickets'].",";
		if(!empty($req['result'])) $set .= "result='".$req['result']."',";
		if(!empty($req['overs'])) $set .= "overs=".$req['overs'].",";
		if(!empty($req['bys'])) $set .= "bys=".$req['bys'].",";
		if(!empty($req['leg_bys'])) $set .= "leg_bys=".$req['leg_bys'].",";
		if(!empty($req['wide'])) $set .= "wide=".$req['wide'].",";
		if(!empty($req['noballs'])) $set .= "noballs=".$req['noballs'].",";
		if(!empty($req['maxOvers'])) $set .= "maxOvers=".$req['maxOvers'].",";
		if(!empty($req['fours'])) $set .= "fours=".$req['fours'].",";
		if(!empty($req['sixes'])) $set .= "sixes=".$req['sixes'].",";
		if(!empty($req['fall_of_wicket'])) $set .= "fall_of_wicket='".mysql_escape_string($req['fall_of_wicket'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update match_has_team set ".$setValue." where match_id = ".$req['match_id']." and team_id = ".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Team updated successfully.";
				$arry['tournament_id'] = $req['tournament_id'];
				$memcache->delete("matchteamList".$req['match_id']);
				$memcache->delete("matchTeamBYId".$req['match_id']);
				$memcache->delete("matchTotalteamList");
				$memcache->delete("teamMatches".$req['team_id']);
				$memcache->delete("matchListByTeamId".$req['team_id']."_".$req['tournament_id']);
				$memcache->delete("fixtures".$req['tournament_id']);
				$memcache->delete("fixtures");
				$memcache->delete("results".$req['tournament_id']);
				$memcache->delete("results");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match_has_team  */
	//url = /match_has_team.php?type=delete&match_id=&team_id=
	function deleteMatch_Team($req,$memcache)
	{
		$arry =  array();
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from match_has_team where match_id=".$req['match_id']." and team_id=".$req['team_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			
				$arry['tournament_id'] = $req['tournament_id'];
			$arry['msg'] = "Match Team deleted successfully.";
			$memcache->delete("matchteamList".$req['match_id']);
			$memcache->delete("matchTeamBYId".$req['match_id']);
			$memcache->delete("matchTotalteamList");
			$memcache->delete("teamMatches".$req['team_id']);
			$memcache->delete("matchListByTeamId".$req['team_id']."_".$req['tournament_id']);
			$memcache->delete("fixtures".$req['tournament_id']);
			$memcache->delete("fixtures");
			$memcache->delete("results".$req['tournament_id']);
			$memcache->delete("results");
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match_has_team  */
	//url = /match_has_team.php?type=list&match_id=
	function listMatch_Team($req,$memcache)
	{
		$arry =  array();
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "matchteamList".$req['match_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select mt.*,t.team_name,t.team_small_name,t.team_logo from match_has_team mt, team t where mt.match_id=".$req['match_id']." and mt.team_id = t.team_id");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Match Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list match_has_team  */
	//url = /match_has_team.php?type=totallist
	function listMatch_TeamTotal($req,$memcache)
	{
		$arry =  array();
		$key = "matchTotalteamList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select mt.*,t.team_name,t.team_small_name,t.team_logo from match_has_team mt, team t where mt.team_id = t.team_id order by mt.team_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Match Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
?>