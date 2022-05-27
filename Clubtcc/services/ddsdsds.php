/* if($overs != 0)
	 {
		$sbowlerid = "";
		 for($i=0;$i<sizeof($bids);$i++)
		 {
		 	if($bids[$i] != $sbowlerid)
			{
				if($bids[$i] != "")
				{
				 
				 $query1 = "select mhp.overs,mhp.madin,mhp.b_runs,mhp.wicks,mhp.wides,mhp.nobals,pl.player_name,pl.player_id,te.team_name,te.team_id from match_has_player mhp,player pl,team te Where mhp.match_id= $mid and mhp.team_id = te.team_id and mhp.player_id = pl.player_id and mhp.overs >0 and mhp.inngs = ".$row[3]." and  pl.player_id = ".$bids[$i]." ORDER BY mhp.bat_seq";
				 echo $query1."<br/>";;
				 $res1 =mysql_query($query1);
					 while($row1 = mysql_fetch_row($res1))
					 {
							 $player = array();
							 $tboname= "";
							 if($row1[6] != null)$tboname = $row1[6];
							 $player["tboname"]=$tboname;
							 $tboid= "";
							 if($row1[7] != null)$tboid = $row1[7];
							 $player["tboid"]=$tboid;
							 $tboovers= 0;
							 if($row1[0] != null)$tboovers = $row1[0];
							 $player["tboovers"]=$row1[0];
							 $tbomadin= 0;
							 if($row1[1] != null)$tbomadin = $row1[1];
							 $player["tbomadin"]=$row1[1];
							 $tboruns= 0;
							 if($row1[2] != null)$tboruns = $row1[2];
							 $player["tboruns"]=$tboruns;
							 $tbowks= 0;
							 if($row1[3] != null)$tbowks = $row1[3];
							 $player["tbowks"]=$tbowks;
							 $tboeco= 0.0;
							 if($tboovers != 0)$tboeco = getEcon($row1[2],$row1[0]);
							 $player["tboeco"]= $tboeco;
							 $player["tboexts"]=getExt($row1[5],$row1[4]);
							 $player["tbotname"]=$row1[8];
							 $player["tbotid"]=$row1[9];
							 $bowlers[] = $player;
					}
					$sbowlerid = $bids[$i];
				}
			 }	
		}
	 }
	 
	 $query1 = "select mhp.overs,mhp.madin,mhp.b_runs,mhp.wicks,mhp.wides,mhp.nobals, pl.player_name,pl.player_id,pl.player_logo,te.team_name,te.team_small_name from match_has_player mhp,player pl, team te Where mhp.match_id= $mid and mhp.team_id =te.team_id and mhp.team_id = ".$row[1]." and mhp.player_id = pl.player_id and mhp.overs >0 and mhp.bat_seq != 0 and mhp.inngs = ".$row[3]." ORDER BY mhp.bowl_seq , mhp.bat_seq";
	 $res1 =mysql_query($query1);
	 while($row1 = mysql_fetch_row($res1))
	 {
		 $player = array();
		 $tboname = "";
	 	 if($row1[6]!=null)$tboname = $row1[6];
		 $player["tboname"]=$tboname;
		 
		 $tboid ="";
	 	 if($row1[7]!=null)$tboid = $row1[7];
		 $player["tboid"]=$tboid;
		 $tename = "";
	 	 if($row1[9]!=null)$tename = $row1[9];
		 $player["tname"]=$tename;
		 
		 $teid ="";
	 	 if($row[1]!=null)$teid = $row[1];
		 $player["tid"]=$teid;
		 
		 $tboovers =0;
	 	 if($row1[0]!=null)$tboovers = $row1[0];
		 $player["tboovers"]=$tboovers;

		 $tbomadin =0;
	 	 if($row1[1]!=null)$tbomadin = $row1[1];
		 $player["tbomadin"]=$tbomadin;
		
		 $tboruns =0;
	 	 if($row1[2]!=null)$tboruns = $row1[2];
		 $player["tboruns"]=$tboruns;
		
		 $tbowks =0;
	 	 if($row1[3]!=null)$tbowks = $row1[3];
		 $player["tbowks"]=$tbowks;
		 
		 $tboeco =0;
		 $tboeco1 = 0;
		 if($row1[0]!=0){$tboeco1 = getEcon($row1[2],$row1[0]);}
	 	 if($tboeco1!=null)$tboeco = $tboeco1;
		 $player["tboeco"]=$tboeco;
		
		 $tboexts =0;
		 $tboexts1 =getExt($row1[5],$row1[4]);
	 	 if($tboexts1 != null)$tboexts = $tboexts1;
		 $player["tboexts"]= $tboexts;
		
		 $tboplayerlogo ="noimage.png";
	 	 if($row1[8]!=null)$tboplayerlogo = $row1[8];
		 $player["tboplayerlogo"] = $tboplayerlogo; 
		
		 $player["tosmallname"]=$smallname;
		 $player["toid"]= $team_id;
		 $player["toname"]= $teamname;
		 $m_Bow[] = $player;
	 }
	 $team["m_bowl"] = $m_Bow; */
     
     
     