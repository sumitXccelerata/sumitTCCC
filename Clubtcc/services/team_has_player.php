<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createTeam_has_player($_REQUEST,$memcache);	
			break;
		
		case "createmulti":
			$result = createTeam_has_player_Multi($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteTeam_has_player($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listTeam_has_player($_REQUEST,$memcache);	
			break;
			
		case "totallist":
			$result = listTeam_has_playerTotal($_REQUEST,$memcache);	
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
	
	/* create Team_has_player  */
	//url = /team_has_player.php?type=create&team_id=&player_id=
	function createTeam_has_player($req,$memcache)
	{
		$arry =  array();
		
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
		$arry['msg'] =  "Player name already exists in Team, please choose another.";
		$favexits = mysql_query("select thp_id from team_has_player where player_id=".$req['player_id']." and team_id=".$req['team_id']);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO team_has_player(team_id,player_id) VALUES (".$req['team_id'].",".$req['player_id'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player added successfully.";
				$arry['thp_id'] = mysql_insert_id();
				$memcache->delete("teamPlayerList".$req['team_id']);
				$memcache->delete("teamPlayerList");
				$memcache->delete("playerTeamsById".$req['player_id']);
				$memcache->delete("playerTeamIdByPlayerId".$req['player_id']);
				$memcache->delete("playerListall");
				$memcache->delete("playerList1");
				$memcache->delete("playerList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	

	/* create Tour Team multi  */
	//url = /team_has_player.php?type=createmulti&team_id=&player_ids=
	function createTeam_has_player_Multi($req,$memcache)
	{
		$arry =  array();
		$notadd =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['player_ids']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$player_ids = explode(",",$req['player_ids']);
		foreach($player_ids as $player_id)
		{
			if(!empty($player_id))
			{
				$arry['status'] = "true";
				$favexits = mysql_query("select thp_id from team_has_player where player_id=".$player_id." and team_id=".$req['team_id']);
				if(mysql_num_rows($favexits) <= 0)
				{
					$query =  mysql_query("INSERT INTO team_has_player(team_id,player_id) VALUES (".$req['team_id'].",".$player_id.")");
					if(mysql_insert_id()>0)
					{
						$arry['msg'] = "Player added successfully.";
						$arry['thp_id'] = mysql_insert_id();
						$memcache->delete("playerTeamsById".$player_id);
						$memcache->delete("playerTeamIdByPlayerId".$player_id);
					}
				}
				else $notadd[] = $player_id;			
			}
		}
		if(!empty($notadd)){ $arry['duplicates'] = implode(",",$notadd); $arry['msg'] = "Team Players has duplicates.";}
		$memcache->delete("teamPlayerList");
		$memcache->delete("teamPlayerList".$req['team_id']);
		
		$memcache->delete("playerListall");
		$memcache->delete("playerList1");
		$memcache->delete("playerList2");
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete team_has_player  */
	//url = /team_has_player.php?type=delete&team_id=&player_id=
	function deleteTeam_has_player($req,$memcache)
	{
		$arry =  array();
		
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
		$query =  mysql_query("delete from team_has_player where player_id=".$req['player_id']." and team_id=".$req['team_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Player deleted successfully.";
			$memcache->delete("teamPlayerList".$req['team_id']);
			$memcache->delete("teamPlayerList");
			$memcache->delete("playerListall");
			$memcache->delete("playerList1");
			$memcache->delete("playerList2");
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list team_has_player  */
	//url = /team_has_player.php?type=list&team_id=
	function listTeam_has_player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}

		$key = "teamPlayerList".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("SELECT t . * , p.player_name, p.player_logo, p.playing_role, p.bat_style_id, p.bowl_style_id FROM team_has_player t, player p where team_id=".$req['team_id']." and  t.player_id = p.player_id order by p.player_name asc");
			//echo "select t.*,p.player_name from team_has_player t, player p where team_id=".$req['team_id']." and  t.player_id = p.player_id order by t.player_id desc";
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					if($list['player_logo'] =="") $list['player_logo'] = "images/player_default.jpg";
					$list['bat_style_title'] = getBatStyleNameBYId($memcache,$row->bat_style_id);
					$list['bowl_style_title'] = getBowlStyleNameBYId($memcache,$row->bowl_style_id);
					$list['player_role_title'] = getPlayerRoleBYId($memcache,$row->playing_role);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Team Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list team_has_player  */
	//url = /team_has_player.php?type=totallist
	function listTeam_has_playerTotal($req,$memcache)
	{
		$arry =  array();

		$key = "teamPlayerList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.*,p.player_name,p.player_logo from team_has_player t, player p where t.player_id = p.player_id order by t.player_id desc");
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
			$arry['msg'] = "Team Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
?>