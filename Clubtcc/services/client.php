<?php 
error_reporting(E_ALL);
	ini_set('display_errors', 1);
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "teams":
			$result = listTeams($_REQUEST,$memcache);	
			break;	
			
		case "teamplayers":
			$result = listTeamPlayer($_REQUEST,$memcache);	
			break;			
			
		case "teammatches":
			$result = teamMatches($_REQUEST,$memcache);	
			break;	
				
		case "points":
			$result = tourPoints($_REQUEST,$memcache);	
			break;		
			
		case "playerdetail":
			$result = playerDetail($_REQUEST,$memcache);	
			break;	
			
		case "fixtures":
			$result = listFixtures($_REQUEST,$memcache);	
			break;	
			
		case "results":
			$result = listResults($_REQUEST,$memcache);	
			break;		
			
		case "venues":
			$result = listVenues($_REQUEST,$memcache);	
			break;		
		
		case "video-list":
			$result = listVideos($_REQUEST,$memcache);	
			break;		
			
		case "video-listby-tourteam":
			$result = listVideosTourTeam($_REQUEST,$memcache);	
			break;			
			
		case "video-listby-tourplayer":
			$result = listVideosTourPlayer($_REQUEST,$memcache);	
			break;		
		
		case "pictures-list":
			$result = listPictures($_REQUEST,$memcache);	
			break;		
			
		case "pictures-listby-tourteam":
			$result = listPicturesTourTeam($_REQUEST,$memcache);	
			break;			
			
		case "pictures-listby-tourplayer":
			$result = listPicturesTourPlayer($_REQUEST,$memcache);	
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
	
	/* list tournament_has_team  */
	//url = /client.php?type=teams&tournament_id=
	function listTeams($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "tourTeamList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select th.*,t.* from tournament_has_team th,team t where th.team_id = t.team_id and th.tournament_id=".$req['tournament_id']." order by t.team_id desc");
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
			$arry['msg'] = "Tour Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			//$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
	/* list tournament_has_team  */
	//url = /client.php?type=points&tournament_id=
	function tourPoints($req,$memcache)
	{
		$arry =  array();
		$tournament_id = "";
		$where = "";
		if(!empty($req['tournament_id']))
		{
			$tournament_id = $req['tournament_id'];
			$where = "and th.tournament_id=".$tournament_id;
		}
		
		$key = "tourTeamPoints".$tournament_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select th.*,t.* from tournament_has_team th,team t where th.team_id = t.team_id $where order by th.points desc,th.runrate desc");
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
			$arry['msg'] = "Tour Team Points.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			//$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
	
	/* list tournament_has_player  */
	//url = /client.php?type=teamplayers&tournament_id=&team_id=
	function listTeamPlayer($req,$memcache)
	{
		$arry =  array();
				
		$team_id = "";
		$tournament_id = "";
		$where = "";
		if(!empty($req['tournament_id']))
		{
			$tournament_id = $req['tournament_id'];
			$where .= "and tournament_id=".$tournament_id;
		}
		
		if(!empty($req['team_id']))
		{
			$team_id = $req['team_id'];
			$where .= "and team_id=".$team_id;
		}
		
		$key = "tourTeamPlayerList".$tournament_id."_".$team_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$lists = array(); 
			$query =  mysql_query("select t.*,p.* from tournament_has_player t,player p where t.player_id=p.player_id $where order by t.player_id desc");
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
	//url = /client.php?type=playerdetail&player_id=
	function playerDetail($req,$memcache)
	{		
		$key = "playerDetail".$req['player_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array();
			$query =  mysql_query("select t.* from player t where player_id=".$req['player_id']);
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
					$list['player_teams'] = getTeamnamesBYPlayerId($memcache,$row->playing_id);
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
	
	//url = /client.php?type=teammatches&team_id=
	function teamMatches($req,$memcache)
	{
		$team_id = "";
		$where = "";
		if(!empty($req['team_id']))
		{
			$tour_id = $req['team_id'];
			$where = "and team_id=".$team_id;
		}
		$key = "teamMatches".$team_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			
			$query =  mysql_query("select t.*,m.* from match_has_team t,cmatch m where t.match_id=c.match_id and team_id=".$req['team_id']." order by c.match_id asc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value)
					{
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
					///print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "";
					$list['team1logo'] = "";
					$list['team2id'] = "";
					$list['team2name'] = "";
					$list['team2logo'] = "";
					$list['team1shortname'] = "";
					$list['team2shortname'] = "";
					$list['team1score'] = "";
					$list['team2score'] = "";
					$list['team1wkts'] = "";
					$list['team2wkts'] = "";
					if(!empty($teams))
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
						$list['team1score'] = $teams['team1score'];
						$list['team2score'] = $teams['team2score'];
						$list['team1wkts'] = $teams['team1wkts'];
						$list['team2wkts'] = $teams['team2wkts'];
					}
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
					
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Fixtures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	//url = /client.php?type=fixtures&tournament_id=
	function listFixtures($req,$memcache)
	{
		$tour_id = "";
		$where = "";
		if(!empty($req['tournament_id']))
		{
			$tour_id = $req['tournament_id'];
			$where = "and tournament_id=".$tour_id;
		}
		$key = "fixtures".$tour_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			
			$query =  mysql_query("select t.* from cmatch t where match_status=0 $where order by t.match_id desc");
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
					$list['venue_title'] = "";
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
					$list['team1score'] = "";
					$list['team2score'] = "";
					$list['team1wkts'] = "";
					$list['team2wkts'] = "";
					if(!empty($teams))
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
						$list['team1score'] = $teams['team1score'];
						$list['team2score'] = $teams['team2score'];
						$list['team1wkts'] = $teams['team1wkts'];
						$list['team2wkts'] = $teams['team2wkts'];
					}
					$lists[]= $list;
					$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
				}
			}
			$arry['msg'] = "Fixtures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	//url = /match.php?type=results&tournament_id=
	function listResults($req,$memcache)
	{
		$tour_id = "";
		$where = "";
		if(!empty($req['tournament_id']))
		{
			$tour_id = $req['tournament_id'];
			$where = "and tournament_id=".$tour_id;
		}
		$key = "results".$tour_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			
			$query =  mysql_query("select t.* from cmatch t where match_status=1 $where order by t.match_id desc");
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
					$list['venue_title'] = "";
					if($row->venue_id !=0)$list['venue_title'] = getVenueNameBYId($memcache,$row->venue_id);
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
					$list['team1score'] = "";
					$list['team2score'] = "";
					$list['team1wkts'] = "";
					$list['team2wkts'] = "";
					if(!empty($teams))
					{
						$list['team1id'] = $teams['team1id'];
						$list['team1name'] = $teams['team1name'];
						$list['team1logo'] = $teams['team1logo'];
						$list['team2id'] = $teams['team2id'];
						$list['team2name'] = $teams['team2name'];
						$list['team2logo'] = $teams['team2logo'];
						$list['team1shortname'] = $teams['team1shortname'];
						$list['team2shortname'] = $teams['team2shortname'];
						$list['team1score'] = $teams['team1score'];
						$list['team2score'] = $teams['team2score'];
						$list['team1wkts'] = $teams['team1wkts'];
						$list['team2wkts'] = $teams['team2wkts'];
					}
					$lists[]= $list;
 				}
			}
			$arry['msg'] = "Fixtures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list venue  */
	//url = /client.php?type=venues&tournament_id=
	function listVenues($req,$memcache)
	{
		
		$querymain = "select t.* from venue t order by t.venue_id desc";
		$tour_id = "";
		if(!empty($req['tournament_id']))
		{
			$tour_id = $req['tournament_id'];
			$querymain = "select t.* from venue t,cmatch m where t.venue_id = m.venue_id and m.tournament_id=".$tour_id." group by t.venue_id order by t.venue_id desc";
		}
		$key = "venueList".$tour_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query($querymain);
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['country_title'] = getCountryNameBYId($memcache,$row->country_id);
					$lists[]= $list;
					$memcache->set("venueById".$row->venue_id, $list, 0,0);
					$memcache->set("venueNameById".$row->venue_id, $row->venue_title, 0,0);
				}
			}
			$arry['msg'] = "Venue list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	
	/* list videos  */
	//url = /client.php?type=video-list&video_type=&video_type_id=
	function listVideos($req,$memcache)
	{
		if(empty($req['video_type']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "videoTypeList".$req['video_type']."_".$req['video_type_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$where = "where video_type='".$req['video_type']."'";
			if(!empty($req['video_type_id'])) $where .= " and video_type_id=".$req['video_type_id'];
			$query =  mysql_query("select t.* from videos t $where order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = '';
					if($row->video_type == 'tournament') $list['shortname'] = getTourSmallBYId($memcache,$row->video_type_id);
					if($row->video_type == 'team') $list['shortname'] = getTeamSmallBYId($memcache,$row->video_type_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Videos list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list videos by tour team  */
	//url = /client.php?type=video-listby-tourteam&tournament_id=
	function listVideosTourTeam($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "videoTypeListbyteamtour".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.*, tm.* from videos t, team tm where video_type='team' and video_type_id in(select distinct(tht.team_id) from tournament_has_team tht where tht.tournament_id = ".$req['tournament_id'].") and tm.team_id = t.video_type_id order by t.createdOn desc");
			//echo "select t.* from videos t video_type='team' and video_type_id in(select distinct(tht.team_id) from tournament_has_team tht where tht.tournament_id = ".$req['tournament_id'].") order by t.createdOn desc";
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = getTourSmallBYId($memcache,$req['tournament_id']);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Videos list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list videos by tour player  */
	//url = /client.php?type=video-listby-tourplayer&tournament_id=
	function listVideosTourPlayer($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "videoTypeListbyplayertour".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from videos t where video_type='player' and video_type_id in(select distinct(thp.player_id) from tournament_has_player thp where thp.tournament_id = ".$req['tournament_id'].") order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = getTourSmallBYId($memcache,$req['tournament_id']);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Videos list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list pictures  */
	//url = /client.php?type=pictures-list&picture_type=&picture_type_id=
	function listPictures($req,$memcache)
	{
		if(empty($req['picture_type']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "pictureTypeList".$req['picture_type']."_".$req['picture_type_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$where = "where picture_type='".$req['picture_type']."'";
			if(!empty($req['picture_type_id'])) $where .= " and picture_type_id=".$req['picture_type_id'];
			$query =  mysql_query("select t.* from pictures t $where order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = '';
					if($row->picture_type == 'tournament') $list['shortname'] = getTourSmallBYId($memcache,$row->picture_type_id);
					if($row->picture_type == 'team') $list['shortname'] = getTeamSmallBYId($memcache,$row->picture_type_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Pictures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list videos by tour team  */
	//url = /client.php?type=pictures-listby-tourteam&tournament_id=
	function listPicturesTourTeam($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$key = "pictureTypeListbyteamtour".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from pictures t where picture_type='team' and picture_type_id in (select distinct(tht.team_id) from tournament_has_team tht where tht.tournament_id = ".$req['tournament_id'].") order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = getTourSmallBYId($memcache,$req['tournament_id']);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Pictures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list videos by tour player  */
	//url = /client.php?type=pictures-listby-tourplayer&tournament_id=
	function listPicturesTourPlayer($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		
		$key = "pictureTypeListbyplayertour".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from pictures t where picture_type='player' and picture_type_id in (select distinct(thp.player_id) from tournament_has_player thp where thp.tournament_id = ".$req['tournament_id'].") order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = getTourSmallBYId($memcache,$req['tournament_id']);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Pictures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
?>