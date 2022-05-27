<?php

	
	/************************************************** Cache functions starts ********************************************************************/
	 
	function getBatStyleNameBYId($memcache,$bat_style_id)
	{
		$key = "battingStyleById".$bat_style_id;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select bat_style_title from bat_style where bat_style_id = ".$bat_style_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	} 
	
	function getBowlStyleNameBYId($memcache,$bowl_style_id)
	{
		$key = "bowlingStyleById".$bowl_style_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select bowl_style_title from bowl_style where bowl_style_id = ".$bowl_style_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getMatchTypeBYId($memcache,$match_type_id)
	{
		$key = "matchTypeById".$match_type_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select match_type_title from match_type where match_type_id = ".$match_type_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getCategoryBYId($memcache,$category_id)
	{
		$key = "categoryById".$category_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select category_title from category where category_id = ".$category_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getCountryNameBYId($memcache,$country_id)
	{
		$key = "countryNameById".$country_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select name from country where id = ".$country_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	function getVenueBYId($memcache,$venue_id)
	{
		$key = "venueById".$venue_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select * from venue where venue_id = ".$venue_id);
			if(mysql_num_rows($query)>0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}	
					$list['country_title'] = getCountryNameBYId($memcache,$row->country_id);
					$arry = $list;
					$memcache->set($key,$arry,0,0);
				}
			}	
		}
		return $arry;
	}
	
	function getVenueDescBYId($memcache,$venue_id)
	{
		$key = "venueDescById".$venue_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select venue_description from venue where venue_id = ".$venue_id);
			if(mysql_num_rows($query)>0)
			{
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->venue_description;
					$memcache->set($key,$arry,0,0);
				}
			}	
		}
		return $arry;
	}
	
	function getteamsByMatch($memcache,$match_id)
	{
		$key = "matchTeamBYId".$match_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = array();
			$query =  mysql_query("select mt.*,t.team_name,t.team_small_name,t.team_logo from match_has_team mt, team t where mt.match_id=".$match_id." and mt.team_id = t.team_id order by mt.team_id desc");
			//echo "select mt.*,t.team_name,t.team_small_name,t.team_logo from match_has_team mt, team t where mt.match_id=".$match_id." and mt.team_id = t.team_id order by mt.team_id desc";
			if(mysql_num_rows($query) > 0)
			{
				$k=1;
				$arry['team1id'] = "";
				$arry['team1name'] ="";
				$arry['team1logo'] = "";
				$arry['team1shortname'] = "";
				$arry['team2id'] = "";
				$arry['team2name'] ="";
				$arry['team2logo'] = "";
				$arry['team2shortname'] = "";
				$arry['team1score'] ="";
				$arry['team2score'] = "";
				$arry['team1wkts'] = "";
				$arry['team2wkts'] = "";
				while($row = mysql_fetch_object($query))
				{
					$arry['team'.$k.'id'] = $row->team_id;
					$arry['team'.$k.'name'] = $row->team_name;
					$arry['team'.$k.'logo'] = $row->team_logo;
					$arry['team'.$k.'shortname'] = $row->team_small_name;
					$arry['team'.$k.'score'] = $row->score;
					$arry['team'.$k.'wkts'] = $row->wickets;
					$k++;
					$memcache->set($key,$arry,0,0);
				}
			}
		}
		return $arry;
	}
	
	function getPlayerBYId($memcache,$player_id)
	{
		$key = "playerNameById".$player_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select player_name from player where player_id = ".$player_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getPlayerRoleBYId($memcache,$player_role_id)
	{
		$key = "playerRoleById".$player_role_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select player_role_title from player_role where player_role_id = ".$player_role_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	function getTeamnamesBYPlayerId($memcache,$player_id)
	{
		$key = "playerTeamsById".$player_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select t.team_name from team_has_player th, team t where t.team_id = th.team_id and th.player_id = ".$player_id);
			if(mysql_num_rows($query)>0)
			{
				$arry = "";
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->team_name.",";
				}
				$arry = rtrim($arry,",");
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	function getTeamIdBYPlayerId($memcache,$player_id)
	{
		$key = "playerTeamIdByPlayerId".$player_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select t.team_id from team_has_player th, team t where t.team_id = th.team_id and th.player_id = ".$player_id);
			if(mysql_num_rows($query)>0)
			{
				$arry = "";
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->team_id.",";
				}
				$arry = rtrim($arry,",");
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getTourIdBYPlayerId($memcache,$player_id)
	{
		$key = "playerTourIdByPlayerId".$player_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select th.team_id,DISTINCT th.tournament_id from tournament_has_player th, tournament t where t.tournament_id = th.tournament_id and th.player_id = ".$player_id);
			if(mysql_num_rows($query)>0)
			{
				$arry = "";
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->tournament_id."*****".$row->team_id.",";
				}
				$arry = rtrim($arry,",");
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	function getTeamshortnamesBYPlayerId($memcache,$player_id)
	{
		$key = "playerShortTeamsById".$player_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select t.team_small_name from team_has_player th, team t where t.team_id = th.team_id and th.player_id = ".$player_id);
			if(mysql_num_rows($query)>0)
			{
				$arry = "";
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->team_small_name.",";
				}
				$arry = rtrim($arry,",");
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getUmpireBYId($memcache,$umpire_id)
	{
		$key = "umpiredetailsById".$umpire_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select umpire_name from umpire where umpire_id = ".$umpire_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getTeamBYId($memcache,$team_id)
	{
		$key = "teamNameById".$team_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select team_name from team where team_id = ".$team_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getTeamSmallBYId($memcache,$team_id)
	{
		$key = "teamSmallNameById".$team_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select team_small_name from team where team_id = ".$team_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getTourBYId($memcache,$tournament_id)
	{
		$key = "tourNameById".$tournament_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select tournament_name from tournament where tournament_id = ".$tournament_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	function getTourSmallBYId($memcache,$tournament_id)
	{
		$key = "tourSmallNameById".$tournament_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select short_name from tournament where tournament_id = ".$tournament_id);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getTourIdbyTeamorPlayer($memcache,$type,$type_id)
	{
		$key = "tourId_".$type."_".$type_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			 $que = "select tournament_id from tournament_has_team where team_id=".$type_id;
			if($type=="player") $que = "select tournament_id from tournament_has_player where player_id=".$type_id;
			$query =  mysql_query($que);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	function getMatchStatus($memcache,$match_id)
	{
		$key = "matchStatus".$match_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = 1;
			$que = "select is_points from cmatch where match_id=".$match_id;
			$query =  mysql_query($que);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry;
	}
	
	
	
	/************************************************** Cache functions ends ********************************************************************/

	function listTournament($memcache)
	{
		$arry =  array();
		$query =  mysql_query("select t.tournament_id,t.year from tournament t order by t.start_date desc limit 0,1");
		//echo "select t.tournament_id,t.year from tournament t order by t.start_date desc limit 0,1";
		if(mysql_num_rows($query) > 0)
		{
			while($row = mysql_fetch_object($query))
			{
				foreach($row as $column_name=>$column_value)
				{
					$arry[$column_name] = $column_value;
				}
			}
		}
		return $arry;
	}

    function listTour_Team($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			$arry["list"] = array();
		}
		
		$key = "tourTeamList".$req['tournament_id'];
		$arry = $memcache->get($key);
		$lists = array(); 
		if(!$arry)
		{
			$arry =  array();
			$query =  mysql_query("select tt.*,t.team_name,t.team_small_name,t.team_logo from tournament_has_team tt, team t where tt.tournament_id=".$req['tournament_id']." and tt.team_id=t.team_id order by tt.team_id desc");
			//echo "select tt.*,t.team_name,t.team_small_name from tournament_has_team tt, team t where tt.tournament_id=".$req['tournament_id']." and tt.team_id=t.team_id order by tt.team_id desc";
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
			$memcache->set($key, $arry, 0,0);
		}
		else
		{
			$lists = $arry["list"];
		}
		return $lists;
	}

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
		$lists = array(); 
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
			$memcache->set($key, $arry, 0,0);
		}
		else
		{
			$lists = $arry["list"];
		}
		return $lists;
	}
	function listMatchByTour($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament.";
			$arry["list"] = array();
		}
		
		$lists = array(); 
		$key = "matchList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$query =  mysql_query("select t.* from cmatch t where tournament_id=".$req['tournament_id']." order by t.match_id asc");
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
					$list['venue_description'] = "";
					if($row->venue_id !=0)$list['venue_description'] = getVenueDescBYId($memcache,$row->venue_id);
					
					$teams = getteamsByMatch($memcache,$row->match_id);
					//print_r($teams); 
					$list['team1id'] = "";
					$list['team1name'] = "TBC";
					$list['team1logo'] = "images/team_default.png";
					$list['team2id'] = "";
					$list['team2name'] = "TBC";
					$list['team2logo'] = "images/team_default.png";
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
					//$memcache->set("matchNameById".$row->match_id,$row->match_name,0,0);
				}
			}
			$arry['msg'] = "Match list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		else
		{
			$lists = $arry["list"];
		}
		return $lists;
	}

	function listMatchByTourByFixtures($tour,$memcache)
	{
		$matches = listMatchByTour($tour,$memcache);
		$lists = array();
		$fixtures = array();
		$results= array();
		foreach($matches as $match)
		{
			//echo $match['match_result_status']."--".$match['match_no']."<br/>";
			if($match['match_result_status']==1) $results[] = $match;
			else $fixtures[] = $match;
		}
		//$lists['fixtures'] = sortArray($fixtures);
		//$lists['results'] = sortArray($results);
		$lists['fixtures'] = $fixtures;
		$lists['results'] = $results;
		return $lists;
	}
	function sortArray($people)
	{
		//var_dump($people); 
		$sortArray = array(); 
		foreach($people as $person){ 
			foreach($person as $key=>$value){ 
				if(!isset($sortArray[$key])){ 
					$sortArray[$key] = array(); 
				} 
				$sortArray[$key][] = $value; 
			} 
		} 
		$orderby = "match_no"; //change this to whatever key you want from the array 
		array_multisort($sortArray[$orderby],SORT_ASC,$people); 
		//var_dump($people);
		return $people;
	}
	/* list team_has_player  */
	function listTeam_has_player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
		}
		$lists = array(); 
		$key = "teamPlayerList".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$query =  mysql_query("SELECT t . * , p.player_name, p.player_logo, p.playing_role, p.bat_style_id, p.bowl_style_id FROM team_has_player t, player p where team_id=".$req['team_id']." and  t.player_id = p.player_id order by p.player_name asc");
			//echo "SELECT t . * , p.player_name, p.player_logo, p.playing_role, p.bat_style_id, p.bowl_style_id FROM team_has_player t, player p where team_id=".$req['team_id']." and  t.player_id = p.player_id order by p.player_name asc";
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					//echo $list['player_logo']."---<br/>";
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
		else
		{
			$lists = $arry["list"];
		}
		//print_r($lists);
		return $lists;
	}
	
	/* list tour_team_has_player  */
	function listTour_Team_has_player($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			//logToFile('admin', $arry['msg']);
			//return json_encode($arry);
		}
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			//logToFile('admin', $arry['msg']);
			//return json_encode($arry);
		}
		
		$key = "tourTeamPlayerList".$req['tournament_id']."_".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$lists = array(); 
			$query =  mysql_query("select tp.*, p.player_name, p.player_logo, p.playing_role, p.bat_style_id, p.bowl_style_id from tournament_has_player tp,player p where tp.tournament_id=".$req['tournament_id']." and tp.team_id=".$req['team_id']." and tp.player_id=p.player_id order by p.player_name asc");
			//echo "select tp.*,p.player_name,p.player_logo from tournament_has_player tp,player p where tp.tournament_id=".$req['tournament_id']." and tp.team_id=".$req['team_id']." and tp.player_id=p.player_id order by tp.player_id desc";
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
					$lists[]= $list;				}
				$arry['msg'] = "Tournament Player list.";
			}
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		else
		{
			$lists = $arry["list"];
		}
		return $lists;
	}
?>