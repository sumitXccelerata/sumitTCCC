<?php 
error_reporting(E_ALL);
ini_set('display_errors', '1');
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createVideos($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateVideos($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteVideos($_REQUEST,$memcache);	
			break;
			
		case "ff":
			$result = ggTumb($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listVideos($_REQUEST,$memcache);	
			break;
			
		case "listbytype":
			$result = listByTypeVideos($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicVideos($_REQUEST,$memcache);	
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
	
	/* create videos  */
	//video_title, video_description, video_type, video_type_id, createdOn, updatedOn
	//url = /videos.php?type=create&video_title=&video_description=&video_type=&video_type_id=&video_logo=
	function createVideos($req,$memcache)
	{
		$arry =  array();

		if(empty($req['video_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['video_type']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['video_type_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video type id.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['video_logo']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video Path.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$query =  mysql_query("INSERT INTO videos(video_title, video_type, video_type_id, video_path, video_description) VALUES ('".$req['video_title']."','".$req['video_type']."',".$req['video_type_id'].",'".$req['video_logo']."','".$req['video_description']."')");
		//echo "INSERT INTO videos(video_title, video_type, video_type_id, video_path, video_description) VALUES ('".$req['video_title']."','".$req['video_type']."',".$req['video_type_id'].",'".$req['video_logo']."','".$req['video_description']."')";
		if(mysql_insert_id()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Video added successfully.";
			$video_id = mysql_insert_id();
			$arry['video_id'] = $video_id;
			generateThumnail($req['video_logo'],$video_id);
			$memcache->delete("videoList");
			$memcache->delete("videoTypeList".$req['video_type']."_".$req['video_type_id']);
			//generateThumnail($req['video_logo'],$arry['video_id']);
			if($req['video_type'] == "tournament")
			{
				$memcache->delete("videoTypeListbyteamtour".$req['video_type_id']);
				$memcache->delete("videoTypeListbyplayertour".$req['video_type_id']);
			}
			if($req['video_type'] == "team" || $req['video_type'] == "player")
			{
				$tour_id = getTourIdbyTeamorPlayer($memcache,$req['video_type'],$req['video_type_id']);
				$memcache->delete("videoTypeListbyteamtour".$tour_id);
				$memcache->delete("videoTypeListbyplayertour".$tour_id);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update videos  */
	//url = /videos.php?type=update&video_id=&video_title=&video_description=&video_type=&video_type_id=&video_logo=
	function updateVideos($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['video_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Video ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['video_title'])) $set .= "video_title='".mysql_escape_string($req['video_title'])."',";
		if(!empty($req['video_type'])) $set .= "video_type='".$req['video_type']."',";
		if(!empty($req['video_type_id'])) $set .= "video_type_id=".$req['video_type_id'].",";
		if(!empty($req['video_description'])) $set .= "video_description='".mysql_escape_string($req['video_description'])."',";
		if(!empty($req['video_logo'])) $set .= "video_path='".$req['video_logo']."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update videos set ".$setValue." where video_id = ".$req['video_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Video updated successfully.";
				$memcache->delete("videoList");
				$memcache->delete("videoTypeList".$req['video_type']."_".$req['video_type_id']);
				if($req['video_type'] == "tournament")
				{
					$memcache->delete("videoTypeListbyteamtour".$req['video_type_id']);
					$memcache->delete("videoTypeListbyplayertour".$req['video_type_id']);
				}
				if($req['video_type'] == "team" || $req['video_type'] == "player")
				{
					$tour_id = getTourIdbyTeamorPlayer($memcache,$req['video_type'],$req['video_type_id']);
					$memcache->delete("videoTypeListbyteamtour".$tour_id);
					$memcache->delete("videoTypeListbyplayertour".$tour_id);
				}
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete videos  */
	//url = /videos.php?type=delete&video_id=&video_type=&video_type_id=
	function deleteVideos($req,$memcache)
	{
		$arry =  array();
		if(empty($req['video_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Videos ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from videos where video_id = ".$req['video_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Video deleted successfully.";
			$memcache->delete("videoList");
			$memcache->delete("videoTypeList".$req['video_type']."_".$req['video_type_id']);
			if($req['video_type'] == "tournament")
			{
				$memcache->delete("videoTypeListbyteamtour".$req['video_type_id']);
				$memcache->delete("videoTypeListbyplayertour".$req['video_type_id']);
			}
			if($req['video_type'] == "team" || $req['video_type'] == "player")
			{
				$tour_id = getTourIdbyTeamorPlayer($memcache,$req['video_type'],$req['video_type_id']);
				$memcache->delete("videoTypeListbyteamtour".$tour_id);
				$memcache->delete("videoTypeListbyplayertour".$tour_id);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list videos  */
	//url = /videos.php?type=list
	function listVideos($req,$memcache)
	{
		$key = "videoList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from videos t order by t.createdOn desc");
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
	
	/* list videos  */
	//url = /videos.php?type=listbytype&video_type=&video_type_id=
	function listByTypeVideos($req,$memcache)
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
					if($req['video_type'] == 'tournament') $list['shortname'] = getTourSmallBYId($memcache,$req['video_type_id']);
					if($req['video_type'] == 'team') $list['shortname'] = getTeamSmallBYId($memcache,$req['video_type_id']);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Videos Types list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	
	/* upload pic for videos  */
	//url = /videos.php?type=uploadpic&video_type=
	function uploadPicVideos($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("videos/".$req['video_type'],$_FILES,$req);
		$arry['status'] = "true";
		$arry['video_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
	
	function ggTumb($req,$memcache)
	{
		echo "";
		$query =  mysql_query("select t.video_path from videos t where video_id=".$req['vId']);
		if(mysql_num_rows($query) > 0)
		{
			$row = mysql_fetch_row($query);
			echo $row[0];
			generateThumnail($row[0],$req['vId']); 
		}
	}
	
	
	function generateThumnail($video_file_path,$vId)
	{
		$thumbnail_path = 'images/videos/thumbnail/';
		$second             = 1;
		$thumbSize       = '150x150';
		$videonamepaths = pathinfo($video_file_path);
		$videoname  = $videonamepaths['filename'];
		$thumb_path = $thumbnail_path . $videoname . '.jpg';
		$video_attributes = get_video_attributes($video_file_path);
		//$duration = "00:00:00";
		$duration = $video_attributes['duration'];
		$cmd = "ffmpeg -y  -i $video_file_path -f mjpeg -vframes 1 $thumb_path";
		exec($cmd, $output, $retval);
		if (!$retval)
		{
			mysql_query("update videos set thumbnail='".$thumb_path."',duration='".$duration."' where video_id = ".$vId);
		}
	}
	
function get_video_attributes($video) {

    $command = 'ffmpeg -i ' . $video . ' -vstats 2>&1';  
    $output = shell_exec($command);  

    $regex_duration = "/Duration: ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}).([0-9]{1,2})/";
    if (preg_match($regex_duration, $output, $regs)) {
        $hours = $regs [1] ? $regs [1] : null;
        $mins = $regs [2] ? $regs [2] : null;
        $secs = $regs [3] ? $regs [3] : null;
        $ms = $regs [4] ? $regs [4] : null;
    }

    return array (
            'hours' => $hours,
            'mins' => $mins,
            'secs' => $secs,
            'ms' => $ms,
			'duration' => $hours.':'.$mins.':'.$secs
    );

}

?>