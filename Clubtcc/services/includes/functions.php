<?php 
	require_once("mail.php");
	require_once("mailattachment.php");
	@set_magic_quotes_runtime(false);
	ini_set('magic_quotes_runtime', 0);
	function object_to_array($data)
	{
		$result = array();
		if (is_array($data) || is_object($data))
		{
			foreach ($data as $key => $value)
			{
				$result[$key] = object_to_array($value);
			}
			return $result;
		}
		return $data;
	}
	
	
	function sendMail($sendMail,$verifyString,$to,$subject)
	{
		//$to = $to;
		$from = "support@clubtcc.ca";
		//$subject = "Password Recovery Mail from Viatutuk";
		//echo $sendMail."---".$verifyString."---".$to."---".$subject;
		$SMTPChat = smtpmailer($sendMail, $from, "Clubtcc Support", $subject,$verifyString);
		return true;	
	}
	
	function file_upload($type,$files,$req,$name='file')
	{
		$randomString = substr(str_shuffle("0123456789"), 0, 3);
		$target_Path = "images/".$type."/".$name."_".$randomString."_";
		$target_Path1 = $target_Path.basename($files['picPath']['name']);
		if($type == "users")
		{
			$target_Path1 = "images/".$type."/".$name.".jpg";
			if(file_exists($target_Path1)) unlink($target_Path1);
		}
		$picPath="";
		echo $target_Path1."---target_Path1";
		echo $files['picPath']['tmp_name']."---target_Path1";
		//move_uploaded_file( $files['picPath']['tmp_name'], $target_Path1 );
		if(move_uploaded_file( $files['picPath']['tmp_name'], $target_Path1 ))
		{
			$picPath =$target_Path1;
			echo $picPath."picPath";
		}
		echo $picPath."picPath1";
		ob_clean();
		return $picPath;
	}
	
	/************************************************** notification functions ends ********************************************************************/
	
	function getDeviceId($memcache,$uId)
	{
		$key = "udIdUser".$uId;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select deviceType,deviceId from user where uId = ".$uId);
			//echo "select deviceType,deviceId from user where uId = ".$uId;
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				//print_r($row);
				$arry = $row[0]."****".$row[1];
				$memcache->set($key,$arry,0,0);
			}	
		}
		//echo $arry;
		return $arry;
	}
	
	function getUserTimeZone($memcache,$uId)
	{
		$key = "userTimeZone".$uId;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "+5:30";
			$query =  mysql_query("select timeZone from user where uId = ".$uId);
			//echo "select deviceType,deviceId from user where uId = ".$uId;
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_row($query);
				//print_r($row);
				$arry = $row[0];
				$memcache->set($key,$arry,0,0);
			}
		}
		return $arry;
	}
	
	function getuserDetailsId($memcache,$uId)
	{
		$key = "userDetailsId".$uId;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$query =  mysql_query("select * from user where uId = ".$uId);
			if(mysql_num_rows($query)>0)
			{
				$row = mysql_fetch_object($query);
				$arry = array();
				foreach($row as $column_name=>$column_value){
					$arry[$column_name] = $column_value;
				}
				//$arry = $row;
				$memcache->set($key,$arry,0,0);
			}	
		}
		return $arry ;
	}
		
	function sendNotification($memcache,$receiverId,$message)
	{
		logToFile("noto", "user id ".$receiverId." - message".$message);
		$deviceDetails = explode("****",getDeviceId($memcache,$receiverId));
		//$details = getuserDetailsId($memcache,$requesterId);
		$deviceId = $deviceDetails[1];
		//print_r($deviceDetails);
		//print_r($deviceId);
		
		if($deviceDetails[0]=="ios")
		{
			logToFile("ios", "user id - ".$receiverId." - message - ".$message," - deviceId - ".$deviceId." - device type - ".$deviceDetails[0]);
			//$message = "You have friend request.";
			iosNotify($deviceId,$message);
		}
		
		if($deviceDetails[0]=="android")
		{
			logToFile("android", "user id - ".$receiverId." - message - ".$message," - deviceId - ".$deviceId." - device type - ".$deviceDetails[0]);
			$messageq=array('message'=>$message,'title'=>$message,'subtitle'	=> $message,'tickerText'=> $message,'vibrate'=> 1,'sound'=> 1,'largeIcon'=> 'large_icon','smallIcon'=> 'small_icon');
			androidNotify(explode(",",$deviceId),$messageq);
		}
		if($deviceDetails[0]=="windows")
		{
			
		}
	}
	
	function androidNotify($registrationIds,$msg)
	{
		//define( 'API_ACCESS_KEY', 'AIzaSyAEIvTjJu3fNMXUXkwvJoIk0_ZtJnKgkmY');
		//define( 'API_ACCESS_KEY', '648623896528' );
		/*$msg = array
		(
			'message' 	=> 'here is a message. message',
			'title'		=> 'This is a title. title',
			'subtitle'	=> 'This is a subtitle. subtitle',
			'tickerText'	=> 'Ticker text here...Ticker text here...Ticker text here',
			'vibrate'	=> 1,
			'sound'		=> 1,
			'largeIcon'	=> 'large_icon',
			'smallIcon'	=> 'small_icon'
		);*/
		logToFile("android", " - deviceId- ".implode(",",$registrationIds));
		$fields = array
		(
			'registration_ids' 	=> $registrationIds,
			'data'			=> $msg
		);
		//print_r($fields);
		$API_ACCESS_KEY = 'AIzaSyBJntnJVUsNj0vQBFJ-PFrZF4SY25jp0u0';
		$headers = array
		(
			'Authorization: key=' .$API_ACCESS_KEY,
			'Content-Type: application/json'
		);
		 
		$ch = curl_init();
		curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
		curl_setopt( $ch,CURLOPT_POST, true );
		curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
		$result = curl_exec($ch );
		curl_close( $ch );
		//ob_clean();
		//echo $result;
		ob_clean();
		logToFile("android", " - deviceId - ".implode(",",$registrationIds)." - result- ".$result);
		return $result;
	}
	
	function iosNotify($deviceToken,$message)
	{
		$passphrase = "viatuktuk123";
		//logToFile('ios', $deviceToken);
		// Put your alert message here:
		//$message = 'Emetting test notification new one';
		logToFile("ios", " - deviceId - ".$deviceToken);
		////////////////////////////////////////////////////////////////////////////////
		
		$ctx = stream_context_create();
		#stream_context_set_option($ctx, 'ssl', 'local_cert', '/home/tixony/public_html/services/includes/ck.pem');
		stream_context_set_option($ctx, 'ssl', 'local_cert', '/var/www/html/services/includes/ck.pem');
		stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
		
		// Open a connection to the APNS server
		$fp = stream_socket_client(
			'ssl://gateway.push.apple.com:2195', $err,
			$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
		
		if (!$fp)
			exit("Failed to connect: $err $errstr" . PHP_EOL);
		
		echo 'Connected to APNS' . PHP_EOL;
		
		// Create the payload body
		$body['aps'] = array(
			'alert' => $message,
			'sound' => 'default'
			);
		
		// Encode the payload as JSON
		$payload = json_encode($body);
		
		// Build the binary notification
		$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
		
		// Send it to the server
		$result = fwrite($fp, $msg, strlen($msg));
		logToFile('ios', $result);
		if (!$result)
			echo 'Message not delivered' . PHP_EOL;
		else
			echo 'Message successfully delivered' . PHP_EOL;
		logToFile("ios", " - deviceId - ".$deviceToken." -result- ".$result);
		// Close the connection to the server
		fclose($fp);
		ob_clean();
	}
	
	
	
	/************************************************** notification functions ends ********************************************************************/
	/************************************************** log functions starts ********************************************************************/
	
	function logToFile($id, $msg)
	{ 
	  	$filename = "logs/".$id.".log";
	   // open file
	   $read = "w";
	   if(file_exists($filename)) $read = "a";
	   $fd = fopen($filename, $read);
	   // write string
	   fwrite($fd, date('l jS \of F Y h:i:s A')." - Info - ".$msg . "\n");
	   // close file
	   fclose($fd);
	}
	/************************************************** log functions ends ********************************************************************/
	/************************************************** backup functions starts ********************************************************************/
	
	function backup_db()
	{
		/* Store All Table name in an Array */
		$allTables = array();
		$result = mysql_query('SHOW TABLES');
		while($row = mysql_fetch_row($result))
		{
			 $allTables[] = $row[0];
		}
		$return="";
		foreach($allTables as $table)
		{
			$result = mysql_query('SELECT * FROM '.$table);
			$num_fields = mysql_num_fields($result);

			$return.= 'DROP TABLE IF EXISTS '.$table.';';
			$row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
			$return.= "\n\n".$row2[1].";\n\n";

			for ($i = 0; $i < $num_fields; $i++) 
			{
				while($row = mysql_fetch_row($result))
				{
					$return.= 'INSERT INTO '.$table.' VALUES(';
					 for($j=0; $j<$num_fields; $j++){
					   $row[$j] = addslashes($row[$j]);
					   $row[$j] = str_replace("\n","\\n",$row[$j]);
					   if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } 
					   else { $return.= '""'; }
					   if ($j<($num_fields-1)) { $return.= ','; }
					 }
					$return.= ");\n";
				}
			}
			$return.="\n\n";
		}

		// Create Backup Folder
		$folder = 'dbbackup/';
		if (!is_dir($folder))
		{
			mkdir($folder, 0777, true);
			chmod($folder, 0777);
		}

		$date = date('m-d-Y-H-i-s', time()); 
		$filename = $folder."db-backup-".$date.'.sql'; 

		$handle = fopen($filename,'w+');
		fwrite($handle,$return);
		fclose($handle);
		$zipFile = backup($filename);
		$from = "support@clubtcc.ca";

		//$sendMail = "satya.g@iton.com";
		$sendMail = "admin@clubtcc.ca";
		$SMTPChat = smtpmailerwithattachment($sendMail, $from, "Clubtcc Support", "Clubtcc db back Up File On ".date("F j, Y, g:i a"),"Clubtcc db back Up File On ".date("F j, Y, g:i a"),$zipFile);
		
		$SMTPChat = smtpmailerwithattachment("nag@iton.com", $from, "Clubtcc Support", "Clubtcc db back Up File On ".date("F j, Y, g:i a"),"Clubtcc db back Up File On ".date("F j, Y, g:i a"),$zipFile);
		if ($SMTPChat)
		{
			 unlink($zipFile);
			 unlink($filename);
		}
		//smtpmailerwithattachment();
	}

	function backup($filename) 
	{
		$suffix = time();
		/*#Execute the command to create backup sql file
		exec("mysqldump --user={$username} --password={$password} --quick --add-drop-table --add-locks --extended-insert --lock-tables --all {$db} > backups/backup.sql");*/

		#Now zip that file
		$zip = new ZipArchive();
		$filename1 = "dbbackup/backup-$suffix.zip";
		if ($zip->open($filename1, ZIPARCHIVE::CREATE) !== TRUE) 
		{
			exit("cannot open <$filename>n");
		}
		$zip->addFile($filename, "db-$suffix.sql");
		$zip->close();
		//unlink($zipFile);
		#Now delete the .sql file without any warning
		//@unlink($filename);
		#Return the path to the zip backup file
		return $filename1;
	} 
	/************************************************** backup functions ends ********************************************************************/
	
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
	
	function getVenueNameBYId($memcache,$venue_id)
	{
		$key = "venueNameById".$venue_id;
		$arry = $memcache->get($key);	
		if(!$arry)
		{
			$arry = "";
			$query =  mysql_query("select venue_title from venue where venue_id = ".$venue_id);
			if(mysql_num_rows($query)>0)
			{
				while($row = mysql_fetch_object($query))
				{
					$arry = $row->venue_title;
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

?>