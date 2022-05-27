<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createPlayer($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updatePlayer($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deletePlayer($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listPlayer($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicPlayer($_REQUEST,$memcache);	
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
	
	/* create Player  */
	//Player role, Bowling style, Bat style, Player name, Player status, Country, Player category, Player Avatar, description, DOB
	//bowl_style_id, bat_style_id, player_name, player_logo, player_status, player_search_name, player_country_id, player_cat, playing_role, description, dob
	//url = /player.php?type=create&player_name=&player_logo=&bowl_style_id=&bat_style_id=&player_cat=&playing_role=&player_country_id=&description=&dob=
	function createPlayer($req,$memcache)
	{
		$arry =  array();

		if(empty($req['player_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['playing_role']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Role.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['player_country_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Country Id.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$bowl_style_id = 0;
		if(!empty($req['bowl_style_id']))$bowl_style_id = $req['bowl_style_id'];
		$bat_style_id = 0;
		if(!empty($req['bat_style_id']))$bat_style_id = $req['bat_style_id'];
		$player_cat = 0;
		if(!empty($req['player_cat']))$player_cat = $req['player_cat'];
		$description = "";
		if(!empty($req['description']))$description = $req['description'];
		$player_logo = "";
		if(!empty($req['player_logo']))$player_logo = $req['player_logo'];
		$dob = "";
		if(!empty($req['dob']))$dob = $req['dob'];
		$phonenumber = "";
		if(!empty($req['phonenumber']))$phonenumber = $req['phonenumber'];
	
		$arry['status'] = "false";
		$arry['msg'] = "Player name already exists, please choose another.";
		$favexits = mysql_query("select player_id from player where player_name='".$req['player_name']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO player(bowl_style_id, bat_style_id, player_name, player_logo, player_search_name, player_country_id, player_cat, playing_role, description, dob,phonenumber) VALUES (".$bowl_style_id.",".$bat_style_id.",'".mysql_escape_string($req['player_name'])."','".$player_logo."','".mysql_escape_string($req['player_name'])."',".$req['player_country_id'].",".$player_cat.",".$req['playing_role'].",'".mysql_escape_string($description)."','".$dob."','".$phonenumber."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player added successfully.";
				$arry['player_id'] = mysql_insert_id();
				$memcache->delete("playerListall");
				$memcache->delete("playerList1");
				$memcache->delete("playerList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update player  */
	//url = /player.php?type=update&player_name=&player_logo=&bowl_style_id=&bat_style_id=&player_cat=&playing_role=&player_country_id=&description=&dob=
	function updatePlayer($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		logToFile('rest', $req['player_country_id']);
		logToFile('rest', $req['playing_role']);
		$set = "";
		if(!empty($req['player_name'])) $set .= "player_name='".mysql_escape_string($req['player_name'])."',";
		if(!empty($req['player_logo'])) $set .= "player_logo='".$req['player_logo']."',";
		if(!empty($req['playing_role'])) $set .= "playing_role=".$req['playing_role'].",";
		if(!empty($req['player_country_id'])) $set .= "player_country_id=".$req['player_country_id'].",";
		if(!empty($req['player_cat'])) $set .= "player_cat=".$req['player_cat'].",";
		if(!empty($req['bat_style_id'])) $set .= "bat_style_id=".$req['bat_style_id'].",";
		if(!empty($req['bowl_style_id'])) $set .= "bowl_style_id=".$req['bowl_style_id'].",";
		if(!empty($req['player_status'])) $set .= "player_status=".$req['player_status'].",";
		if(!empty($req['description'])) $set .= "description='".mysql_escape_string($req['description'])."',";
		if(!empty($req['dob'])) $set .= "dob='".$req['dob']."',";		
		if(!empty($req['phonenumber'])) $set .= "phonenumber='".$req['phonenumber']."',";		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update player set ".$setValue." where player_id = ".$req['player_id']);
			logToFile('rest', "update player set ".$setValue." where player_id = ".$req['player_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player updated successfully.";
				$memcache->delete("playerListall");
				$memcache->delete("playerList1");
				$memcache->delete("playerList2");
				$memcache->delete("playerNameById".$req['player_id']);
				$memcache->delete("playerTeamsById".$req['player_id']);
				$memcache->delete("playerShortTeamsById".$req['player_id']);
				$memcache->delete("tourTeamPlayerList_");
				/*$team_ids = explode(",",getTeamIdBYPlayerId($memcache,$req['player_id']));
				foreach($team_ids as $team_id)
				{
					$memcache->delete("teamPlayerList".$team_id);
				}*/
				$tournament_ids = explode(",",getTourIdBYPlayerId($memcache,$req['player_id']));
				foreach($tournament_ids as $tour_id)
				{
					$tournament_team = explode("*****",$tour_id);
					$tournament_id = $tournament_team[0];
					$team_id = $tournament_team[1];
					$memcache->delete("tourTeamPlayerList".$tournament_id."_".$team_id);
					$memcache->delete("tourTeamPlayerList".$tournament_id."_");
					$memcache->delete("tourTeamPlayerList_".$team_id);
					$memcache->delete("teamPlayerList".$team_id);
				}
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete player  */
	//url = /player.php?type=delete&player_id=
	function deletePlayer($req,$memcache)
	{
		$arry =  array();
		if(empty($req['player_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from player where player_id = ".$req['player_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Player deleted successfully.";
			$memcache->delete("playerListall");
			$memcache->delete("playerList1");
			$memcache->delete("playerList2");
			$memcache->delete("playerNameById".$req['player_id']);
			$memcache->delete("playerTeamsById".$req['player_id']);
			$memcache->delete("playerShortTeamsById".$req['player_id']);
			$tournament_ids = explode(",",getTourIdBYPlayerId($memcache,$req['player_id']));
			foreach($tournament_ids as $tour_id)
			{
				$tournament_team = explode("*****",$tour_id);
				$tournament_id = $tournament_team[0];
				$team_id = $tournament_team[1];
				$memcache->delete("tourTeamPlayerList".$tournament_id."_".$team_id);
				$memcache->delete("tourTeamPlayerList".$tournament_id."_");
				$memcache->delete("tourTeamPlayerList_".$team_id);
				$memcache->delete("teamPlayerList".$team_id);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list player  */
	//url = /player.php?type=list&player_status=
	function listPlayer($req,$memcache)
	{
		$player_status = "all";
		if(!empty($req['player_status'])) $player_status = $req['player_status'];
		
		$key = "playerList".$player_status;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array();
			$where = ""; 
			if($player_status != "all")  $where="where player_status=$player_status";
			$query =  mysql_query("select t.* from player t $where order by t.player_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['bat_style_title'] = getBatStyleNameBYId($memcache,$row->bat_style_id);
					$list['bowl_style_title'] = getBowlStyleNameBYId($memcache,$row->bowl_style_id);
					$list['player_country_title'] = getCountryNameBYId($memcache,$row->player_country_id);
					$list['player_category_title'] = getCategoryBYId($memcache,$row->player_cat);
					$list['player_role_title'] = getPlayerRoleBYId($memcache,$row->playing_role);
					$list['player_teams'] = getTeamnamesBYPlayerId($memcache,$row->player_id);
					$list['player_teams_small'] = getTeamshortnamesBYPlayerId($memcache,$row->player_id);
					$memcache->set("playerNameById".$row->player_id,$row->player_name,0,0);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Player list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	//bowl_style_id, bat_style_id, player_name, player_logo, player_status, player_search_name, player_country_id, player_cat, playing_role, description, dob
	/* upload pic for player  */
	//url = /player.php?type=uploadpic
	function uploadPicPlayer($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("player",$_FILES,$req);
		$arry['status'] = "true";
		$arry['player_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
?>