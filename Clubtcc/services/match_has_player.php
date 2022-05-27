<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createMatch_Team_Player($_REQUEST,$memcache);	
			break;
		
		case "createmulti":
			$result = createMatch_Team_Player_Multi($_REQUEST,$memcache);	
			break;
			
		case "updatescore":
			$result = updateMatch_Team_Player_Score($_REQUEST,$memcache);	
			break;
			
		case "updatecaptain":
			$result = updateMatch_Team_Player_Captain($_REQUEST,$memcache);	
			break;
			
		case "updatekeeper":
			$result = updateMatch_Team_Player_Keeper($_REQUEST,$memcache);	
			break;
			
		case "updatefinal12":
			$result = updateMatch_Team_Player_Final11($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteMatch_Team_Player($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listMatch_Team_Player($_REQUEST,$memcache);	
			break;
			
		case "listbymatch":
			$result = listMatch_Player($_REQUEST,$memcache);	
			break;
			
		case "totallist":
			$result = listMatch_PlayerTotal($_REQUEST,$memcache);	
			break;
		
		case "default":
			$arry =  array();
			$arry['status'] = "false";
			$arry['msg'] = "Invalid Type";
			$result = json_encode($arry);
			break;		
	}
	//ob_clean();
	echo $result;
	
	/* create Match_Team_Player  */
	//url = /match_has_player.php?type=create&match_id=&team_id=&player_id=&inngs=
	function createMatch_Team_Player($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Match Team Player already exists, please choose another.";
		$favexits = mysql_query("select mhp_id from match_has_player where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO match_has_player(match_id,team_id,player_id,inngs) VALUES (".$req['match_id'].",".$req['team_id'].",".$req['player_id'].",".$req['inngs'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player added successfully.";
				$arry['mhp_id'] = mysql_insert_id();
				$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
				$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	

	/* create Match Team multi  */
	//url = /match_has_player.php?type=createmulti&match_id=&team_id=&player_ids=&inngs=
	function createMatch_Team_Player_Multi($req,$memcache)
	{
		$arry =  array();
		$notadd =  array();
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
		$player_ids = explode(",",$req['player_ids']);
		foreach($player_ids as $player_id)
		{
			$bat_seq = 0;
			if(!empty($player_id) && $bat_seq <=11)
			{
				$arry['status'] = "true";
				$favexits = mysql_query("select mhp_id from match_has_player where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$player_id." and team_id=".$req['team_id']);
				$bat_seq = 0;
				if(mysql_num_rows($favexits) <= 0)
				{
					$bat_seq +1;
					$query =  mysql_query("INSERT INTO match_has_player(match_id,team_id,player_id,inngs,bat_seq) VALUES (".$req['match_id'].",".$req['team_id'].",".$player_id.",".$req['inngs'].",".$bat_seq.")");
					if(mysql_insert_id()>0)
					{
						$arry['msg'] = "Player added successfully.";
						$arry['t_thp_id'] = mysql_insert_id();
					}
				}
				else $notadd[] = $player_id;			
			}
		}
		if(!empty($notadd)){ $arry['duplicates'] = implode(",",$notadd); $arry['msg'] = "match Players has duplicates.";}
		$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
		$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /match_has_player.php?type=updatescore&match_id=&team_id=&player_id=&inngs=&bat_seq=&bowl_seq=&score=&balls=&out_str=&fours=&sixes=&overs=&madin=&b_runs=&wicks=&wides=&nobals=&this_over_runs=&b_sixes=&b_fours=&candb=&f_catches=&f_IR=&w_keeper=&f_DR=&keeper_stumps=&captain=
	function updateMatch_Team_Player_Score($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['bat_seq'])) $set .= "bat_seq=".$req['bat_seq'].",";
		if(!empty($req['bowl_seq'])) $set .= "bowl_seq=".$req['bowl_seq'].",";
		if(!empty($req['score'])) $set .= "score=".$req['score'].",";
		if(!empty($req['balls'])) $set .= "balls=".$req['balls'].",";
		if(!empty($req['fours'])) $set .= "fours=".$req['fours'].",";
		if(!empty($req['sixes'])) $set .= "sixes=".$req['sixes'].",";
		
		if(!empty($req['overs'])) $set .= "overs=".$req['overs'].",";
		if(!empty($req['maidin'])) $set .= "madin=".$req['maidin'].",";
		if(!empty($req['b_runs'])) $set .= "b_runs=".$req['b_runs'].",";
		if(!empty($req['wicks'])) $set .= "wicks=".$req['wicks'].",";
		if(!empty($req['wides'])) $set .= "wides=".$req['wides'].",";
		if(!empty($req['nobals'])) $set .= "nobals=".$req['nobals'].",";
		if(!empty($req['b_sixes'])) $set .= "b_sixes=".$req['b_sixes'].",";
		if(!empty($req['b_fours'])) $set .= "b_fours=".$req['b_fours'].",";
		if(!empty($req['candb'])) $set .= "candb=".$req['candb'].",";
		if(!empty($req['f_catches'])) $set .= "f_catches=".$req['f_catches'].",";
		if(!empty($req['f_IR'])) $set .= "f_IR=".$req['f_IR'].",";
		if(!empty($req['f_DR'])) $set .= "f_DR=".$req['f_DR'].",";
		if(!empty($req['keeper_stumps'])) $set .= "keeper_stumps=".$req['keeper_stumps'].",";
		if(!empty($req['w_keeper'])) $set .= "w_keeper=".$req['w_keeper'].",";
		if(!empty($req['captain'])) $set .= "captain=".$req['captain'].",";
		
		if(!empty($req['out_str'])) $set .= "out_str='".mysql_escape_string($req['out_str'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update match_has_player set ".$setValue." where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Player updated successfully.";
				$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
				$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /match_has_player.php?type=updatecaptain&match_id=&team_id=&player_id=&is_captain=&inngs=
	function updateMatch_Team_Player_Captain($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['is_captain'])) $set .= "captain=".$req['is_captain'].",";
		
		if(!empty($set))
		{
			$query1 = mysql_query("select mhp_id from match_has_player where match_id=".$req['match_id']." and inngs=".$req['inngs']." and captain=1 and team_id=".$req['team_id']);
		//	echo "select mhp_id from match_has_player where where match_id=".$req['match_id']." and inngs=".$req['inngs']." and captain=1 and team_id=".$req['team_id'];
			if(mysql_num_rows($query1) > 0)
			{
				while($row1 = mysql_fetch_object($query1))
				{
					//echo "<br/>";
					mysql_query("update match_has_player set captain=0 where mhp_id = ".$row1->mhp_id);
					//echo "update match_has_player set captain=0 where mhp_id = ".$row1->mhp_id;
					//echo "<br/>";
				}
			}
			
			$setValue = rtrim($set,',');
			$query =  mysql_query("update match_has_player set ".$setValue." where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Player updated successfully.";
				$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
				$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /match_has_player.php?type=updatekeeper&match_id=&team_id=&player_id=&is_keeper=&inngs=
	function updateMatch_Team_Player_Keeper($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['is_keeper'])) $set .= "w_keeper=".$req['is_keeper'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query1 = mysql_query("select mhp_id from match_has_player where match_id=".$req['match_id']." and inngs=".$req['inngs']." and w_keeper=1 and team_id=".$req['team_id']);
			if(mysql_num_rows($query1) > 0)
			{
				while($row1 = mysql_fetch_object($query1))
				{
					mysql_query("update match_has_player set w_keeper=0 where mhp_id = ".$row1->mhp_id);
				}
			}
			$query =  mysql_query("update match_has_player set ".$setValue." where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Player updated successfully.";
				$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
				$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /match_has_player.php?type=updatefinal12&match_id=&team_id=&player_id=&in_final=0/1&inngs=
	function updateMatch_Team_Player_Final11($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['in_final'])) $set .= "in_final=".$req['in_final'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update match_has_player set ".$setValue." where match_id=".$req['match_id']." and inngs=".$req['inngs']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Player updated successfully.";
				$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
				$memcache->delete("matchPlayerList".$req['match_id']);
				$memcache->delete("matchPlayerList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match_has_player  */
	//url = /match_has_player.php?type=delete&match_id=&team_id=&player_id=
	function deleteMatch_Team_Player($req,$memcache)
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
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$inngs=1;
		if(!empty($req['inngs'])) $inngs=$req['inngs'];
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from match_has_player where match_id=".$req['match_id']." and inngs=".$inngs." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
		//echo "delete from match_has_player where match_id=".$req['match_id']." and player_id=".$req['player_id']." and team_id=".$req['team_id'];
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Player deleted successfully.";
			$memcache->delete("matchTeamPlayerList".$req['match_id']."_".$req['team_id']);
			$memcache->delete("matchPlayerList".$req['match_id']);
			$memcache->delete("matchPlayerList");
			$memcache->delete("playerListall");
			$memcache->delete("playerList1");
			$memcache->delete("playerList2");
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match_has_player  */
	//url = /match_has_player.php?type=list&match_id=&team_id=
	function listMatch_Team_Player($req,$memcache)
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
		
		$key = "matchTeamPlayerList".$req['match_id']."_".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$lists = array(); 
			$query =  mysql_query("select mp.*,p.player_name,p.player_logo from match_has_player mp,player p where mp.match_id=".$req['match_id']." and mp.team_id=".$req['team_id']." and mp.player_id=p.player_id order by p.player_name asc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;				}
				$arry['msg'] = "Match Player list.";
			}
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list match_has_player  */
	//url = /match_has_player.php?type=listbymatch&match_id=
	function listMatch_Player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$key = "matchPlayerList".$req['match_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select mp.*,p.player_name,p.player_logo from match_has_player mp,player p where mp.match_id=".$req['match_id']." and mp.player_id=p.player_id order by mp.player_id desc");
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
			$arry['msg'] = "Match Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list match_has_player  */
	//url = /match_has_player.php?type=totallist
	function listMatch_PlayerTotal($req,$memcache)
	{
		$arry =  array();
	
		$key = "matchPlayerList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select mp.*,p.player_name,p.player_logo from match_has_player mp,player p where mp.player_id=p.player_id order by mp.player_id desc");
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
			$arry['msg'] = "Match Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
?>