<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createTour_Team_Player($_REQUEST,$memcache);	
			break;
		
		case "createmulti":
			$result = createTour_Team_Player_Multi($_REQUEST,$memcache);	
			break;
			
		case "update":
			$result = updateTour_Team_Player($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteTour_Team_Player($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listTour_Team_Player($_REQUEST,$memcache);	
			break;
			
		case "listbytour":
			$result = listTour_Player($_REQUEST,$memcache);	
			break;
		
		case "totallist":
			$result = listTour_PlayerTotal($_REQUEST,$memcache);	
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
	
	/* create Tour_Team_Player  */
	//url = /tournament_has_player.php?type=create&tournament_id=&team_id=&player_id=&odi=&test=&t20=
	function createTour_Team_Player($req,$memcache)
	{
		$arry =  array();

		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
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
		
		$arry['status'] = "false";
		$arry['msg'] = "Tour Team Player already exists, please choose another.";
		$favexits = mysql_query("select t_thp_id from tournament_has_player where tournament_id=".$req['tournament_id']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO tournament_has_player(tournament_id,team_id,player_id,odi,test,t20) VALUES (".$req['tournament_id'].",".$req['team_id'].",".$req['player_id'].",".$req['odi'].",".$req['test'].",".$req['t20'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player added successfully.";
				$arry['t_thp_id'] = mysql_insert_id();
				$memcache->delete("tourTeamTotalPlayerList".$req['tournament_id']."_".$req['team_id']);
				$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_".$req['team_id']);
				$memcache->delete("tourTeamPlayerList_".$req['team_id']);
				$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_");
				$memcache->delete("tourTeamPlayerList_");
				$memcache->delete("tourPlayerList".$req['tournament_id']);
				$memcache->delete("tourPlayerList");
				$memcache->delete("playerTourIdByPlayerId".$req['player_id']);
				$memcache->delete("playerListall");
				$memcache->delete("playerList1");
				$memcache->delete("playerList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	

	/* create Tour Team multi  */
	//url = /tournament_has_player.php?type=createmulti&tournament_id=&team_id=&player_ids=&odi=&test=&t20=
	function createTour_Team_Player_Multi($req,$memcache)
	{
		$arry =  array();
		$notadd =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
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
		//print_r($player_ids);
		foreach($player_ids as $player_id)
		{
			if(!empty($player_id))
			{
				$arry['status'] = "true";
				$favexits = mysql_query("select t_thp_id from tournament_has_player where tournament_id=".$req['tournament_id']." and player_id=".$player_id." and team_id=".$req['team_id']);
				if(mysql_num_rows($favexits) <= 0)
				{
						$query =  mysql_query("INSERT INTO tournament_has_player(tournament_id,team_id,player_id,odi,test,t20) VALUES (".$req['tournament_id'].",".$req['team_id'].",".$player_id.",1,1,1)");
						if(mysql_insert_id()>0)
						{
							$arry['msg'] = "Player added successfully.";
							$arry['t_thp_id'] = mysql_insert_id();
							$memcache->delete("playerTourIdByPlayerId".$player_id);
						}
				}
				else $notadd[] = $player_id;			
			}
		}
		
		if(!empty($notadd)){ $arry['duplicates'] = implode(",",$notadd); $arry['msg'] = "Tour Team Players has duplicates.";}
		$memcache->delete("tourTeamTotalPlayerList".$req['tournament_id']."_".$req['team_id']);
		$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_".$req['team_id']);
		$memcache->delete("tourTeamPlayerList_".$req['team_id']);
		$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_");
		$memcache->delete("tourTeamPlayerList_");
		$memcache->delete("tourPlayerList".$req['tournament_id']);
		$memcache->delete("tourPlayerList");
		$memcache->delete("playerListall");
		$memcache->delete("playerList1");
		$memcache->delete("playerList2");
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /tournament_has_player.php?type=update&tournament_id=&team_id=&player_id=&odi=&test=&t20=
	function updateTour_Team_Player($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
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
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['odi'])) $set .= "odi=".$req['odi'].",";
		if(!empty($req['test'])) $set .= "test=".$req['test'].",";
		if(!empty($req['t20'])) $set .= "t20=".$req['t20'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update tournament_has_player set ".$setValue." where tournament_id=".$req['tournament_id']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Team has Player updated successfully.";
				$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_".$req['team_id']);
				$memcache->delete("tourTeamTotalPlayerList".$req['tournament_id']."_".$req['team_id']);
				$memcache->delete("tourTeamPlayerList_".$req['team_id']);
				$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_");
				$memcache->delete("tourTeamPlayerList_");
				$memcache->delete("tourPlayerList".$req['tournament_id']);
				$memcache->delete("tourPlayerList");
				$memcache->delete("playerTourIdByPlayerId".$req['player_id']);
				$memcache->delete("playerListall");
				$memcache->delete("playerList1");
				$memcache->delete("playerList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	
	/* delete tournament_has_player  */
	//url = /tournament_has_player.php?type=delete&tournament_id=&team_id=&player_id=
	function deleteTour_Team_Player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
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
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from tournament_has_player where tournament_id=".$req['tournament_id']." and player_id=".$req['player_id']." and team_id=".$req['team_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Player deleted successfully.";
			$memcache->delete("tourTeamTotalPlayerList".$req['tournament_id']."_".$req['team_id']);
			$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_".$req['team_id']);
			$memcache->delete("tourTeamPlayerList_".$req['team_id']);
			$memcache->delete("tourTeamPlayerList".$req['tournament_id']."_");
			$memcache->delete("tourTeamPlayerList_");
			$memcache->delete("tourPlayerList".$req['tournament_id']);
			$memcache->delete("tourPlayerList");
			$memcache->delete("playerListall");
			$memcache->delete("playerList1");
			$memcache->delete("playerList2");
			$memcache->delete("playerTourIdByPlayerId".$req['player_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list tournament_has_player  */
	//url = /tournament_has_player.php?type=list&tournament_id=&team_id=
	function listTour_Team_Player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
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
		
		$key = "tourTeamPlayerList".$req['tournament_id']."_".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$lists = array(); 
			$query =  mysql_query("select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where tp.tournament_id=".$req['tournament_id']." and tp.team_id=".$req['team_id']." and tp.player_id=p.player_id order by p.player_name asc");
			//echo "select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where tp.tournament_id=".$req['tournament_id']." and tp.team_id=".$req['team_id']." and tp.player_id=p.player_id order by tp.player_id desc";
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;				}
				$arry['msg'] = "Tournament Player list.";
			}
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list tournament_has_player  */
	//url = /tournament_has_player.php?type=listbytour&tournament_id=
	function listTour_Player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$key = "tourPlayerList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where tp.tournament_id=".$req['tournament_id']." and tp.player_id=p.player_id order by tp.player_id desc");
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
			$arry['msg'] = "Tournament Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list tournament_has_player  */
	//url = /tournament_has_player.php?type=totallist
	function listTour_PlayerTotal($req,$memcache)
	{
		$arry =  array();
		$key = "tourPlayerList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			//echo "select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where and tp.player_id=p.player_id order by tp.player_id desc";
			$query =  mysql_query("select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where tp.player_id=p.player_id order by tp.player_id desc");
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
			$arry['msg'] = "Tournament Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
?>