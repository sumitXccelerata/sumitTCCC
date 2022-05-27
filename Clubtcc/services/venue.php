<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createVenue($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateVenue($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteVenue($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listVenue($_REQUEST,$memcache);	
			break;
			
		case "listbyvenue":
			$result = listVenueByCountry($_REQUEST,$memcache);	
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
	
	/* create Venue  */
	//url = /venue.php?type=create&venue_title=&geoLat=&geoLang=&venue_description=&venue_location=&country_id=
	function createVenue($req,$memcache)
	{
		$arry =  array();

		if(empty($req['venue_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue Title.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['geoLat']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Lattitude.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['geoLang']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Longitude.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['venue_description']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue Description.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['venue_location']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue Location.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['country_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Country.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Venue already exists, please choose another.";
		$favexits = mysql_query("select venue_id from venue where venue_title='".$req['venue_title']."' and geoLat='".$req['geoLat']."' and geoLang='".$req['geoLang']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO venue(venue_title,venue_location,venue_description,geoLat,geoLang,country_id) VALUES ('".mysql_escape_string($req['venue_title'])."','".mysql_escape_string($req['venue_location'])."','".mysql_escape_string($req['venue_description'])."','".$req['geoLat']."','".$req['geoLang']."',".$req['country_id'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Venue added successfully.";
				$arry['venue_id'] = mysql_insert_id();
				$memcache->delete("venueList");
				$memcache->delete("venueListByCountry".$req['country_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /venue.php?type=update&venue_id=&venue_title=&geoLat=&geoLang=&venue_description=&venue_location=&country_id=
	function updateVenue($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['venue_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['venue_title'])) $set .= "venue_title='".mysql_escape_string($req['venue_title'])."',";
		if(!empty($req['geoLat'])) $set .= "geoLat='".$req['geoLat']."',";
		if(!empty($req['geoLang'])) $set .= "geoLang='".$req['geoLang']."',";
		if(!empty($req['venue_description'])) $set .= "venue_description='".mysql_escape_string($req['venue_description'])."',";
		if(!empty($req['venue_location'])) $set .= "venue_location='".mysql_escape_string($req['venue_location'])."',";
		if(!empty($req['country_id'])) $set .= "country_id=".$req['country_id'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update venue set ".$setValue." where venue_id = ".$req['venue_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Venue updated successfully.";
				$memcache->delete("venueList");
				$memcache->delete("venueListByCountry".$req['country_id']);
				$memcache->delete("venueById".$req['venue_id']);
				$memcache->delete("venueNameById".$req['venue_id']);
				$memcache->delete("venueDescById".$req['venue_id']);
				$memcache->delete("venueDetail".$req['venue_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /venue.php?type=delete&venue_id=
	function deleteVenue($req,$memcache)
	{
		$arry =  array();
		if(empty($req['venue_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Venue ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from venue where venue_id = ".$req['venue_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Venue deleted successfully.";
			$memcache->delete("venueList");
			$memcache->delete("venueById".$req['venue_id']);
			$memcache->delete("venueNameById".$req['venue_id']);
			$memcache->delete("venueDescById".$req['venue_id']);
			$memcache->delete("venueDetail".$req['venue_id']);
			$memcache->delete("venueListByCountry".$req['country_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /venue.php?type=list
	function listVenue($req,$memcache)
	{
		$key = "venueList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from venue t order by t.venue_id desc");
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
					$memcache->set("venueDescById".$row->venue_id, $row->venue_description, 0,0);
				}
			}
			$arry['msg'] = "Venue list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /venue.php?type=listbycountry&country_id=
	function listVenueByCountry($req,$memcache)
	{
		if(empty($req['country_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Country.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		
		$key = "venueListByCountry".$req['country_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from venue t where country_id=".$req['country_id']." order by t.venue_id desc");
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
			$arry['msg'] = "Country wise Venue list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}

?>