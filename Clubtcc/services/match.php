<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createMatch($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateMatch($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteMatch($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listMatch($_REQUEST,$memcache);	
			break;
			
		case "teamfixtures":
			$result = listMatchByTeam($_REQUEST,$memcache);	
			break;
		
		case "detail":
			$result = detailtMatch($_REQUEST,$memcache);	
			break;
			
		case "listbytour":
			$result = listMatchByTour($_REQUEST,$memcache);	
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
	
	/* create Match  */
	
	//url = /match.php?type=create&match_name=&match_type_id=&tournament_id=&location=&no_inngs=&starttime=&description==&umpire1=&umpire2=&tv_umpire=&match_ref=&res_umpire=&local_time=&match_cat=&match_day_night=&venue_id=&match_no=
	function createMatch($req,$memcache)
	{
		$arry =  array();

		if(empty($req['match_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['starttime']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Start Time.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['match_cat']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Category.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['match_type_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Type Id.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['no_inngs']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Innings.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['venue_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['match_no']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Number.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$local_time = "";
		if(!empty($req['local_time']))$local_time = $req['local_time'];
		$match_day_night = "";
		if(!empty($req['match_day_night']))$local_time = $req['match_day_night'];
		$location = "";
		if(!empty($req['location']))$local_time = $req['location'];
		$description = "";
		if(!empty($req['description']))$local_time = $req['description'];
		$umpire1 = 0;
		if(!empty($req['umpire1']))$umpire1 = $req['umpire1'];
		$umpire2 = 0;
		if(!empty($req['umpire2']))$umpire2 = $req['umpire2'];
		$tv_umpire = 0;
		if(!empty($req['tv_umpire']))$tv_umpire = $req['tv_umpire'];
		$match_ref = 0;
		if(!empty($req['match_ref']))$match_ref = $req['match_ref'];
		$res_umpire = 0;
		if(!empty($req['res_umpire']))$res_umpire = $req['res_umpire'];
		
			
		$query =  mysql_query("INSERT INTO cmatch(match_name, match_type_id, tournament_id, location, no_inngs, starttime,description, umpire1, umpire2, tv_umpire, match_ref, res_umpire,local_time, match_day_night, match_cat,venue_id,match_no) VALUES ('".$req['match_name']."',".$req['match_type_id'].",".$req['tournament_id'].",'".$location."',".$req['no_inngs'].",'".$req['starttime']."','".$description."',".$umpire1.",".$umpire2.",".$tv_umpire.",".$match_ref.",".$res_umpire.",'".$local_time."','".$match_day_night."',".$req['match_cat'].",".$req['venue_id'].",'".$req['match_no']."')");		
	//	echo "INSERT INTO cmatch(match_name, match_type_id, tournament_id, location, no_inngs, starttime,description, umpire1, umpire2, tv_umpire, match_ref, res_umpire,local_time, match_day_night, match_cat,venue_id) VALUES ('".$req['match_name']."',".$req['match_type_id'].",".$req['tournament_id'].",'".$location."',".$req['no_inngs'].",'".$req['starttime']."','".$description."',".$umpire1.",".$umpire2.",".$tv_umpire.",".$match_ref.",".$res_umpire.",'".$local_time."','".$match_day_night."',".$req['match_cat'].",".$req['venue_id'].")";
		if(mysql_insert_id()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Match created successfully.";
			$arry['match_id'] = mysql_insert_id();
			$memcache->delete("matchList");
			$memcache->delete("matchList".$req['tournament_id']);
			$memcache->delete("fixtures");
			$memcache->delete("fixtures".$req['tournament_id']);
			$memcache->delete("results");
			$memcache->delete("results".$req['tournament_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match  */
	
	//url = /match.php?type=update&match_id=&match_type_id=&tournament_id=&match_name=&location=&no_inngs=&starttime=&description=&match_status=&toss=&mom_match=&umpire1,umpire2=&tv_umpire=&match_ref=&res_umpire=&match_result=&local_time=&match_cat=&mom_id=&winning_match_id=&match_day_night=&venue_id=
	function updateMatch($req,$memcache)
	{
		$arry =  array();
		
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
		if(!empty($req['match_name'])) $set .= "match_name='".mysql_escape_string($req['match_name'])."',";
		if(!empty($req['match_type_id'])) $set .= "match_type_id=".$req['match_type_id'].",";
		if(!empty($req['tournament_id'])) $set .= "tournament_id=".$req['tournament_id'].",";
		if(!empty($req['no_inngs'])) $set .= "no_inngs=".$req['no_inngs'].",";
		if(!empty($req['match_status'])) $set .= "match_status=".$req['match_status'].",";
		if(!empty($req['mom_id'])) $set .= "mom_id=".$req['mom_id'].",";
		if(!empty($req['venue_id'])) $set .= "venue_id=".$req['venue_id'].",";
		if(!empty($req['match_cat'])) $set .= "match_cat=".$req['match_cat'].",";
		if(!empty($req['match_day_night'])) $set .= "match_day_night='".$req['match_day_night']."',";
		if(!empty($req['match_no'])) $set .= "match_no='".$req['match_no']."',";
		if(!empty($req['winning_match_id'])) $set .= "winning_team_id=".$req['winning_match_id'].",";
		if(!empty($req['umpire1'])) $set .= "umpire1=".$req['umpire1'].",";
		if(!empty($req['umpire2'])) $set .= "umpire2=".$req['umpire2'].",";
		if(!empty($req['tv_umpire'])) $set .= "tv_umpire=".$req['tv_umpire'].",";
		if(!empty($req['match_ref'])) $set .= "match_ref=".$req['match_ref'].",";
		if(!empty($req['res_umpire'])) $set .= "res_umpire=".$req['res_umpire'].",";
		if(!empty($req['location'])) $set .= "location='".mysql_escape_string($req['location'])."',";
		if(!empty($req['starttime'])) $set .= "starttime='".$req['starttime']."',";
		if(!empty($req['local_time'])) $set .= "local_time='".$req['local_time']."',";
		if(!empty($req['description'])) $set .= "description='".mysql_escape_string($req['description'])."',";
		if(!empty($req['toss'])) $set .= "toss='".mysql_escape_string($req['toss'])."',";
		if(!empty($req['match_result'])) $set .= "match_result='".$req['match_result']."',";
		if(!empty($req['match_result_status'])) $set .= "match_result_status=".$req['match_result_status'].",";
		//if(!empty($req['description'])) $set .= "description='".mysql_escape_string($req['description'])."',";
		$points = 2;
		$is_points = getMatchStatus($memcache,$req['match_id']);
		logToFile('admin', $req);
		if(!empty($req['match_status']) && $req['match_status']==1) $points = 3;
		if(!empty($req['match_status']) && $is_points==1) $set .= "points=".$points.",";
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update cmatch set ".$setValue." where match_id = ".$req['match_id']);
			logToFile('admin', "update cmatch set ".$setValue." where match_id = ".$req['match_id']);
		//	echo "update cmatch set ".$setValue." where match_id = ".$req['match_id'];
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match updated successfully.";
				$memcache->delete("matchList");
				$memcache->delete("matchNameById".$req['match_id']);
				$memcache->delete("matchStatus".$req['match_id']);
				$memcache->delete("detailmatch".$req['match_id']);
				$memcache->delete("matchList".$req['tournament_id']);
				$memcache->delete("fixtures");
				$memcache->delete("fixtures".$req['tournament_id']);
				$memcache->delete("results");
				$memcache->delete("results".$req['tournament_id']);
				if(!empty($req['match_result_status']) && !empty($req['tournament_id']) && $req['match_result_status']==1) 
				{
					$memcache->delete("tourTeamPoints".$req['tournament_id']);
					$memcache->delete("tourTeamPoints");
				}
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match  */
	//url = /match.php?type=delete&match_id=&tournament_id=
	function deleteMatch($req,$memcache)
	{
		$arry =  array();
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from cmatch where match_id = ".$req['match_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Match deleted successfully.";
			$memcache->delete("matchList");
			$memcache->delete("matchNameById".$req['match_id']);
			$memcache->delete("detailmatch".$req['match_id']);
			$memcache->delete("matchList".$req['tournament_id']);
			$memcache->delete("fixtures");
			$memcache->delete("fixtures".$req['tournament_id']);
			$memcache->delete("results");
			$memcache->delete("results".$req['tournament_id']);
			$memcache->delete("matchStatus".$req['match_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match  */
	//url = /match.php?type=list
	function listMatch($req,$memcache)
	{
		$key = "matchList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select m.* from cmatch m, tournament t where m.tournament_id=t.tournament_id order by m.match_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['mom_title'] = "";
					if($row->mom_id !=0)$list['mom_title'] = getPlayerBYId($memcache,$row->mom_id);
					$list['winning_team_title'] = "";
					if($row->winning_team_id !=0)$list['winning_team_title'] = getTeamBYId($memcache,$row->winning_team_id);
					$list['umpire1_title'] = "";
					if($row->umpire1 !=0)$list['umpire1_title'] = getUmpireBYId($memcache,$row->umpire1);
					$list['umpire2_title'] = "";
					if($row->umpire2 !=0)$list['umpire2_title'] = getUmpireBYId($memcache,$row->umpire2);
					$list['tv_umpire_title'] = "";
					if($row->tv_umpire !=0)$list['tv_umpire_title'] = getUmpireBYId($memcache,$row->tv_umpire);
					$list['match_ref_title'] = "";
					if($row->match_ref !=0)$list['match_ref_title'] = getUmpireBYId($memcache,$row->match_ref);
					$list['res_umpire_title'] = "";
					if($row->res_umpire !=0)$list['res_umpire_title'] = getUmpireBYId($memcache,$row->res_umpire);
					$list['match_type_title'] = "";
					if($row->match_type_id !=0)$list['match_type_title'] = getMatchTypeBYId($memcache,$row->match_type_id);
					$list['tournament_title'] = "";
					if($row->tournament_id !=0)$list['tournament_title'] = getTourBYId($memcache,$row->tournament_id);
					$list['match_category'] = "";
					if($row->match_cat !=0)$list['match_category'] = getCategoryBYId($memcache,$row->match_cat);
					$list['venue_details'] = "";
					if($row->venue_id !=0)$list['venue_details'] = getVenueNameBYId($memcache,$row->venue_id);
					$teams = getteamsByMatch($memcache,$row->match_id);
					//print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "";
					$list['team1logo'] = "";
					$list['team2id'] = "";
					$list['team2name'] = "";
					$list['team2logo'] = "";
					$list['team1shortname'] = "";
					$list['team2shortname'] = "";
					if(!empty($teams) && count($teams)>2)
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
					}
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Match list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list match  */
	//url = /match.php?type=teamfixtures&team_id=&tournament_id=
	function listMatchByTeam($req,$memcache)
	{
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$key = "matchListByTeamId".$req['team_id'];
		$where="";
		if(!empty($req['tournament_id']))
		{
			$key = "matchListByTeamId".$req['team_id']."_".$req['tournament_id'];
			$where=" and t.tournament_id=".$req['tournament_id'];
		}
		
		$key = "matchListByTeamId".$req['team_id']."_".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			
			$query =  mysql_query("select t.* from cmatch t,match_has_team mt where mt.match_id = t.match_id and mt.team_id=".$req['team_id']." $where and t.match_status=0  order by t.match_id asc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['mom_title'] = "";
					if($row->mom_id !=0)$list['mom_title'] = getPlayerBYId($memcache,$row->mom_id);
					$list['winning_team_title'] = "";
					if($row->winning_team_id !=0)$list['winning_team_title'] = getTeamBYId($memcache,$row->winning_team_id);
					$list['umpire1_title'] = "";
					if($row->umpire1 !=0)$list['umpire1_title'] = getUmpireBYId($memcache,$row->umpire1);
					$list['umpire2_title'] = "";
					if($row->umpire2 !=0)$list['umpire2_title'] = getUmpireBYId($memcache,$row->umpire2);
					$list['tv_umpire_title'] = "";
					if($row->tv_umpire !=0)$list['tv_umpire_title'] = getUmpireBYId($memcache,$row->tv_umpire);
					$list['match_ref_title'] = "";
					if($row->match_ref !=0)$list['match_ref_title'] = getUmpireBYId($memcache,$row->match_ref);
					$list['res_umpire_title'] = "";
					if($row->res_umpire !=0)$list['res_umpire_title'] = getUmpireBYId($memcache,$row->res_umpire);
					$list['match_type_title'] = "";
					if($row->match_type_id !=0)$list['match_type_title'] = getMatchTypeBYId($memcache,$row->match_type_id);
					$list['tournament_title'] = "";
					if($row->tournament_id !=0)$list['tournament_title'] = getTourBYId($memcache,$row->tournament_id);
					$list['match_category'] = "";
					if($row->match_cat !=0)$list['match_category'] = getCategoryBYId($memcache,$row->match_cat);
					$list['venue_details'] = "";
					if($row->venue_id !=0)$list['venue_details'] = getVenueNameBYId($memcache,$row->venue_id);
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
					$teams = getteamsByMatch($memcache,$row->match_id);
					//print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "";
					$list['team1logo'] = "";
					$list['team2id'] = "";
					$list['team2name'] = "";
					$list['team2logo'] = "";
					$list['team1shortname'] = "";
					$list['team2shortname'] = "";
					if(!empty($teams) && count($teams)>2)
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
					}
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Match list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* detail match  */
	//url = /match.php?type=detail&match_id=
	function detailtMatch($req,$memcache)
	{
		if(empty($req['match_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$key = "detailmatch".$req['match_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from cmatch t  where t.match_id=".$req['match_id']);
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['mom_title'] = "";
					if($row->mom_id !=0)$list['mom_title'] = getPlayerBYId($memcache,$row->mom_id);
					$list['winning_team_title'] = "";
					if($row->winning_team_id !=0)$list['winning_team_title'] = getTeamBYId($memcache,$row->winning_team_id);
					$list['umpire1_title'] = "";
					if($row->umpire1 !=0)$list['umpire1_title'] = getUmpireBYId($memcache,$row->umpire1);
					$list['umpire2_title'] = "";
					if($row->umpire2 !=0)$list['umpire2_title'] = getUmpireBYId($memcache,$row->umpire2);
					$list['tv_umpire_title'] = "";
					if($row->tv_umpire !=0)$list['tv_umpire_title'] = getUmpireBYId($memcache,$row->tv_umpire);
					$list['match_ref_title'] = "";
					if($row->match_ref !=0)$list['match_ref_title'] = getUmpireBYId($memcache,$row->match_ref);
					$list['res_umpire_title'] = "";
					if($row->res_umpire !=0)$list['res_umpire_title'] = getUmpireBYId($memcache,$row->res_umpire);
					$list['match_type_title'] = "";
					if($row->match_type_id !=0)$list['match_type_title'] = getMatchTypeBYId($memcache,$row->match_type_id);
					$list['tournament_title'] = "";
					if($row->tournament_id !=0)$list['tournament_title'] = getTourBYId($memcache,$row->tournament_id);
					$list['match_category'] = "";
					if($row->match_cat !=0)$list['match_category'] = getCategoryBYId($memcache,$row->match_cat);
					$list['venue_details'] = "";
					if($row->venue_id !=0)$list['venue_details'] = getVenueNameBYId($memcache,$row->venue_id);
					$teams = getteamsByMatch($memcache,$row->match_id);
					//print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "";
					$list['team1logo'] = "";
					$list['team2id'] = "";
					$list['team2name'] = "";
					$list['team2logo'] = "";
					$list['team1shortname'] = "";
					$list['team2shortname'] = "";
					if(!empty($teams) && count($teams)>2)
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
					}
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
					
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Match list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	/* list match by tour */
	
	//url = /match.php?type=listbytour&tournament_id=
	function listMatchByTour($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "matchList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from cmatch t where tournament_id=".$req['tournament_id']." order by t.match_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$list['mom_title'] = "";
					if($row->mom_id !=0)$list['mom_title'] = getPlayerBYId($memcache,$row->mom_id);
					$list['winning_team_title'] = "";
					if($row->winning_team_id !=0)$list['winning_team_title'] = getTeamBYId($memcache,$row->winning_team_id);
					$list['umpire1_title'] = "";
					if($row->umpire1 !=0)$list['umpire1_title'] = getUmpireBYId($memcache,$row->umpire1);
					$list['umpire2_title'] = "";
					if($row->umpire2 !=0)$list['umpire2_title'] = getUmpireBYId($memcache,$row->umpire2);
					$list['tv_umpire_title'] = "";
					if($row->tv_umpire !=0)$list['tv_umpire_title'] = getUmpireBYId($memcache,$row->tv_umpire);
					$list['match_ref_title'] = "";
					if($row->match_ref !=0)$list['match_ref_title'] = getUmpireBYId($memcache,$row->match_ref);
					$list['res_umpire_title'] = "";
					if($row->res_umpire !=0)$list['res_umpire_title'] = getUmpireBYId($memcache,$row->res_umpire);
					$list['match_type_title'] = "";
					if($row->match_type_id !=0)$list['match_type_title'] = getMatchTypeBYId($memcache,$row->match_type_id);
					$list['tournament_title'] = "";
					if($row->tournament_id !=0)$list['tournament_title'] = getTourBYId($memcache,$row->tournament_id);
					$list['match_category'] = "";
					if($row->match_cat !=0)$list['match_category'] = getCategoryBYId($memcache,$row->match_cat);
					$list['venue_details'] = "";
					if($row->venue_id !=0)$list['venue_title'] = getVenueNameBYId($memcache,$row->venue_id);
					$teams = getteamsByMatch($memcache,$row->match_id);
					//print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "";
					$list['team1logo'] = "";
					$list['team2id'] = "";
					$list['team2name'] = "";
					$list['team2logo'] = "";
					$list['team1shortname'] = "";
					$list['team2shortname'] = "";
					if(!empty($teams) && count($teams)>2)
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
						
					}
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
				}
			}
			$arry['msg'] = "Match list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
//&match_type_id=&tournament_id=&match_name=&location=&no_inngs=&starttime=&description=&match_status=&toss=&mom_match=&umpire1,umpire2=&tv_umpire=&match_ref=&res_umpire=&match_result=&local_time=&match_cat=&mom_id=&winning_match_id=&match_day_night=
?>