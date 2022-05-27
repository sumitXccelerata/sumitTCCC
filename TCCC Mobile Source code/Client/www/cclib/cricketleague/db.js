var DBUtils = new Object();



DBUtils.loadDBInitials = function(){
	function errorCB(err) {
	    alert("Error processing SQL: "+JSON.stringify(err));
	}
	function successCB() {
		
		
		
		autoSyncTables();
		if(cordova){
			getAppVersion(function (version) {
				var appVerson = localStorage.getItem("appVersion");
				if(appVerson && version==appVerson){
					setTimeout(function(){
						localStorage.setItem("appVersion",version);
						var event = new CustomEvent("oncclibready", { "message": "CCLIB is ready" });
						document.dispatchEvent(event);
					},1000)
				}
			});
		}else{

			var event = new CustomEvent("oncclibready", { "message": "CCLIB is ready" });
			document.dispatchEvent(event);
}
	}
	/*document.addEventListener("oncclibready", function(e) {
		  alert(e.message);
	});*/
	try{
	window.dbObject.transaction(
			function(tx) {
				if(navigator.connection){
					var networkState = navigator.connection.type;
					if (networkState !== Connection.NONE) {
						
						if(cordova){
							try{
								getAppVersion(function (version) {
									var appVerson = localStorage.getItem("appVersion");
									if(!appVerson || version!=appVerson){
										var event = new CustomEvent("onappready", { "message": "CCLIB is ready" });
										document.dispatchEvent(event);
										tx.executeSql('DROP TABLE IF EXISTS teams');
										tx.executeSql('DROP TABLE IF EXISTS tournaments');
										tx.executeSql('DROP TABLE IF EXISTS matchtypes');
										tx.executeSql('DROP TABLE IF EXISTS bowlstyles');
										tx.executeSql('DROP TABLE IF EXISTS batstyles');
										tx.executeSql('DROP TABLE IF EXISTS playerroles');
										tx.executeSql('DROP TABLE IF EXISTS umpires');
										tx.executeSql('DROP TABLE IF EXISTS tournamenthasteam');
										tx.executeSql('DROP TABLE IF EXISTS teamhasplayer');
										tx.executeSql('DROP TABLE IF EXISTS tournamenthasplayer');
										tx.executeSql('DROP TABLE IF EXISTS category');
										tx.executeSql('DROP TABLE IF EXISTS country');
										tx.executeSql('DROP TABLE IF EXISTS match');
										tx.executeSql('DROP TABLE IF EXISTS matchhasteam');
										tx.executeSql('DROP TABLE IF EXISTS matchhasplayer');
										tx.executeSql('DROP TABLE IF EXISTS venue');
										tx.executeSql('DROP TABLE IF EXISTS pictures');
										tx.executeSql('DROP TABLE IF EXISTS players');
										tx.executeSql('DROP TABLE IF EXISTS videos');
										tx.executeSql('DROP TABLE IF EXISTS points');
										tx.executeSql('DROP TABLE IF EXISTS user');
										tx.executeSql('DROP TABLE IF EXISTS teamplayers');
										tx.executeSql('DROP TABLE IF EXISTS clientpoints');
										createTables(tx);
									}
									
								});
							}catch(ermsg){
								alert(ermsg.message)
							}
						}
					}else{
						createTables(tx);
					}
				}else{
					createTables(tx);
				}
				function createTables(tx){
					//team_id,name,small_name,logo,color1,color2,color3
					tx.executeSql('CREATE TABLE IF NOT EXISTS teams(team_id integer primary key,name text,small_name text,team_logo text,team_cat_id integer,description text,status integer,team_category_title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=create&tournament_name=&tournament_logo=&start_date=&end_date=&starttime=&endtime=&points_table=&tour_cat=&short_name=
					tx.executeSql('CREATE TABLE IF NOT EXISTS tournaments(tournament_id integer primary key,name text,short_name text,logo text,category text,start_date datetime,end_date datetime,points_table text,category_title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&match_type_id=&match_type_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS matchtypes(match_type_id integer primary key,title text, lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&bowl_style_id=&bowl_style_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS bowlstyles(bowl_style_id integer primary key,title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&bat_style_id=&bat_style_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS batstyles(bat_style_id integer primary key,bat_style_title text, lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&player_role_id=&player_role_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS playerroles(player_role_id integer primary key,title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&umpire_id=&umpire_name=&umpire_country_name=
					tx.executeSql('CREATE TABLE IF NOT EXISTS umpires(umpire_id integer primary key,umpire_name text,umpire_country_id text,umpire_logo text,team_logo text,umpire_dob integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=create&tournament_id=&team_id=
					tx.executeSql('CREATE TABLE IF NOT EXISTS tournamenthasteam(tournament_id integer,team_id integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(tournament_id, team_id))');
					//type=create&team_id=&player_id=
					tx.executeSql('CREATE TABLE IF NOT EXISTS teamhasplayer(team_id integer,player_id integer,thp_id integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(team_id, player_id))');
					//type=update&tournament_id=&team_id=&player_id=&odi=0or1&test=0or1&t20=0or1
					tx.executeSql('CREATE TABLE IF NOT EXISTS tournamenthasplayer(t_thp_id integer,tournament_id integer ,team_id integer,player_id integer,odi integer,test integer,t20 integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(tournament_id, team_id,player_id))');
				    //type=update&player_role_id=&player_role_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS category(category_id integer primary key,categoryName text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=create&id=&=iso&name=&nicename=&iso3=&numcode=&phonecode=&flagPath=&status= 
					tx.executeSql('CREATE TABLE IF NOT EXISTS country(id integer,iso text,name text,nicename text,iso3 text,numcode integer,phonecode integer,flagPath text,status integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&match_id=&match_type_id=&tournament_id=&match_name=&location=&no_inngs=&starttime=&description=&match_status=&toss=&mom_match=&umpire1,umpire2=&tv_umpire=&match_ref=&res_umpire=&match_result=&local_time=&match_cat=&mom_id=&winning_match_id=&match_day_night=
					tx.executeSql('CREATE TABLE IF NOT EXISTS match(match_id integer primary key,match_type_id integer,tournament_id integer,match_name text,location text,no_inngs integer,starttime integer,description text,match_status text,toss text,umpire1 text,umpire2 text,tv_umpire text,match_ref text,res_umpire text,match_result text,local_time integer,match_cat text,mom_id integer,winning_match_id integer,match_day_night text,venue_id integer,team1_id integer,team1_logo text,team1_name text,team2_id integer,team2_logo text,team2_name text,tournament_title text,venue_details text,team1shortname text,team2shortname text,team1score integer,team2score integer,team1wkts integer,team2wkts integer,match_no text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
	                //type=create&match_id=&team_id=
					tx.executeSql('CREATE TABLE IF NOT EXISTS matchhasteam(match_id integer,team_id integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)')
					//matchhasplayer
					tx.executeSql('CREATE TABLE IF NOT EXISTS matchhasplayer(match_id integer,team_id integer,player_id integer,inngs integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(match_id, team_id,player_id))')
				    //type=update&venue_id=&team_id=&player_id=&country_id=&venue_description=&venue_location=
					tx.executeSql('CREATE TABLE IF NOT EXISTS venue(venue_id integer primary key,venue_title text ,geoLat integer,geoLang integer,venue_description text,venue_location text,country_id integer,country_title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&picture_id=&picture_title=&picture_description=&picture_type=&picture_type_id=&pic_path=
					tx.executeSql('CREATE TABLE IF NOT EXISTS pictures(picture_id integer primary key,picture_title text,picture_description text,picture_type text,picture_type_id integer,picture_logo text,createdOn integer,shortname text,updatedOn datetime,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					
					//type=create&player_name=&player_logo=&bowl_style_id=&bat_style_id=&player_cat=&playing_role=&player_country_id=&description=&dob=
					tx.executeSql('CREATE TABLE IF NOT EXISTS players(player_id integer primary key,player_name text ,player_logo text,bowl_style_id integer,bat_style_id integer,player_cat integer,playing_role integer,player_country_id text,description text,dob text,player_status integer,bat_style_title text,bowl_style_title text,player_country_title text,player_category_title text,player_role_title text,player_teams text,player_search_name text,player_teams_small text,phonenumber integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&video_id=&video_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS videos(video_id integer primary key,video_title text,video_description text,video_type text,video_type_id integer,video_logo text,createdOn integer,thumbnail text,shortname text,duration integer,updatedOn datetime,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//points
					tx.executeSql('CREATE TABLE IF NOT EXISTS points(pc_id integer primary key,pc_name text,tournament_id integer,points integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//user
					tx.executeSql('CREATE TABLE IF NOT EXISTS user(uid integer primary key,username text ,role_name text,emailid text,password text,socialid text,udeviceid text,devicetype text,teamid integer,status text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//clien team squad
					tx.executeSql('CREATE TABLE IF NOT EXISTS teamplayers(player_id integer,team_id integer,tournament_id integer,odi integer,test integer,t20 integer,bowl_style_id integer,bat_style_id integer,player_name text ,player_logo text,player_status integer,player_search_name text,player_country_id integer,player_cat integer,playing_role integer,description text,dob integer,phonenumber integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(tournament_id, team_id,player_id))');
					//client points
					tx.executeSql('CREATE TABLE IF NOT EXISTS clientpoints(tournament_id integer,played integer,won integer,lost integer,tied integer,nr integer,points integer,runrate text,tht_id integer,team_id integer,team_name text,team_logo text,team_small_name text,team_cat integer,description text,status integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
				}
				
			},errorCB, successCB
		);
	}catch(e){
		alert(e.message)
	}
}
function deviceready(){
		//DBUtils.loadDBInitials();
		if(!window.sqlitePlugin){
			window.dbObject = openDatabase('cricket_client', '1.0', 'cricket_client DB', 2 * 1024 * 1024*1024);
			DBUtils.loadDBInitials();
		}else{
			window.dbObject = window.sqlitePlugin.openDatabase({name: "cricketclient.db", location: 1},function(){
				setTimeout(DBUtils.loadDBInitials,1000);
			},function(){
				alert("Problem with connect sqlite...")
			});
		}
}
document.addEventListener("deviceready", deviceready, false);
DBUtils.createTournament = function(tournament,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO tournaments(tournament_id,name,short_name,logo,points_table,category,start_date,end_date) VALUES(?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[tournament.tournamentId,tournament.name,tournament.shortName,tournament.logo,tournament.pointsTable,tournament.cat,tournament.startDate,tournament.endDate],
				function(tx, res) {
					respObj.status = "success";
					tournament.id = res.insertId;
					respObj.data = tournament;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = tournament;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateTournament = function(tournament,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'UPDATE tournaments SET name = ?,short_name = ?,logo = ?,points_table = ?,category = ?,start_date = ?,end_date = ?,category_title = ? where tournament_id = ?';
				tx.executeSql(query,[tournament.name,tournament.shortName,tournament.logo,tournament.pointsTable,tournament.cat,tournament.startDate,tournament.endDate,tournament.categoryTitle,tournament.tournamentId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournament;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteTournament = function(tournamentId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from tournaments where tournament_id = ?';
				tx.executeSql(query,[tournamentId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteAllTournaments = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from tournaments';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllCountries = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from country';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
isTeamManager = function(){
	/*localStorage.setItem("isTeamManager", true);
	localStorage.setItem("roleTeamId", teamId);*/
	return localStorage.getItem("isTeamManager");
}
getTeamManagerTeamId = function(){
	return localStorage.getItem("roleTeamId");
}
DBUtils.retrieveTournaments = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				//SELECT * FROM tournaments where tournament_id in (select tournament_id from tournamenthasteam where team_id=1)
				var query = "SELECT * FROM tournaments order by name";
				/*if(isTeamManager() && isTeamManager()=="true"){
					query = "SELECT * FROM tournaments where tournament_id in (select tournament_id from tournamenthasteam where team_id='"+getTeamManagerTeamId()+"')";
				}*/
				respObj.status = "failed";
				tx.executeSql(query, [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}

DBUtils.getTournamentList = function(tournament,retFun){
	window.dbObject.transaction(
	function(tx) {
	var dataArray = [];
	var respObj = {};
	respObj.status = "failed";
	respObj.data = {};
	tx.executeSql("select tmt.tournament_id,tmt.name,tmt.short_name,tmt.logo,tmt.category,tmt.start_date,tmt.end_date ,tmt.points_table,c.categoryName from tournaments as tmt left join category as c on tmt.category=c.category_id where tmt.tournament_id=?", [tournament.tournamentId], function(tx, res) {
	           for (var i = 0; i < res.rows.length; i++){
	               dataArray[i] = res.rows.item(i);
	           }
	           if(dataArray && dataArray.length>0){
	           	respObj.status = "success";
	           	respObj.data.list = dataArray;
	           }else{
	           	respObj.status = "success";
	           	respObj.data.list = [];
	           }
	           retFun(respObj);
	       });
	}
	);
	}



DBUtils.createMultiTournament = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO tournaments(tournament_id,name,short_name,logo,points_table,category,start_date,end_date,category_title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].tournament_id+'","'+data[i].tournament_name+'","'+data[i].short_name+'","'+data[i].tournament_logo+'","'+data[i].points_table+'","'+data[i].tour_cat+'","'+data[i].start_date+'","'+data[i].end_date+'","'+data[i].category_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				   // console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}



DBUtils.createTeam = function(team,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO teams(team_id,name,small_name,team_logo,team_cat_id,description,team_category_title,status) VALUES(?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[team.teamId,team.name,team.smallName,team.logo,team.catId,team.description,team.categoryTitle,team.status],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = team;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = team;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateTeam = function(team,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update teams set name = ?,small_name = ?,team_logo = ?,team_cat_id = ?,description=?,team_category_title = ?,status=? where team_id = ?';
				tx.executeSql(query,[team.name,team.smallName,team.logo,team.catId,team.description,team.categoryTitle,team.status,team.teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = team;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteTeam = function(teamId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from teams where team_id = ?';
				tx.executeSql(query,[teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = teamId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteAllTeams = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from teams';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.retrieveTeams = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				var query = "";
				tx.executeSql("SELECT * FROM teams", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}




DBUtils.createMultiTeam = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO teams(team_id,name,small_name,team_logo,team_cat_id,description,team_category_title,status) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].team_id+'","'+data[i].team_name+'","'+data[i].team_small_name+'","'+data[i].team_logo+'","'+data[i].team_cat+'","'+data[i].description+'","'+data[i].status+'","'+data[i].team_category_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				    // console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}

///client teams




DBUtils.createMatchType = function(matchType,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				//match_type_id integer primary key,title text
				var query = 'INSERT INTO matchtypes(match_type_id,title) VALUES(?,?) ';
				tx.executeSql(query,[matchType.matchTypeId,matchType.title],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchType;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchType;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateMatchType = function(matchType,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update matchtypes set title = ? where match_type_id = ?';
				tx.executeSql(query,[matchType.title,matchType.matchTypeId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchType;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteMatchType = function(matchTypeId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from matchtypes where match_type_id = ?';
				tx.executeSql(query,[matchTypeId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchTypeId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteAllMatchTypes = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from matchtypes';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.getMatchTypes = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT match_type_id,title as match_type_title  FROM matchtypes ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiMatchType = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO matchtypes(match_type_id,title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].match_type_id+'","'+data[i].match_type_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}



//bowlstyles : bowl_style_id integer primary key,title text
DBUtils.createBowlStyle = function(bowlStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				//match_type_id integer primary key,title text
				var query = 'INSERT INTO bowlstyles(bowl_style_id,title) VALUES(?,?) ';
				tx.executeSql(query,[bowlStyle.bowlStyleId,bowlStyle.title],
						//bowlStyleId
				function(tx, res) {
					respObj.status = "success";
					respObj.data = bowlStyle;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = bowlStyle;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateBowlStyle = function(bowlStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update bowlstyles set title = ? where bowl_style_id = ?';
				tx.executeSql(query,[bowlStyle.title,bowlStyle.bowlStyleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = bowlStyle;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteBowlStyle = function(bowlStyleId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from bowlstyles where bowl_style_id = ?';
				tx.executeSql(query,[bowlStyleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = bowlStyleId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllBowlStyles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from bowlstyles';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getBowlStyles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT bowl_style_id,title as bowl_style_title FROM bowlstyles ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiBowlingStyle = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO bowlstyles(bowl_style_id,title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].bowl_style_id+'","'+data[i].bowl_style_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}



//batstyles : bat_style_id integer primary key,title text
DBUtils.createBatStyle = function(batStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO batstyles(bat_style_id,bat_style_title) VALUES(?,?) ';
				tx.executeSql(query,[batStyle.batStyleId,batStyle.batStyleTitle],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = batStyle;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = batStyle;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateBatStyle = function(batStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update batstyles set bat_style_title = ? where bat_style_id = ?';
				tx.executeSql(query,[batStyle.batStyleTitle,batStyle.batStyleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = batStyle;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateBowlingStyle = function(bowlStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update bowlstyles set title = ? where bowl_style_id = ?';
				tx.executeSql(query,[bowlStyle.title,bowlStyle.bowlStyleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = bowlStyle;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteBatStyle = function(batStyleId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from batstyles where bat_style_id = ?';
				tx.executeSql(query,[batStyleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = batStyleId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllBatStyles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from batstyles';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getBatStyles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT * FROM batstyles ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiBattingStyle = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO batstyles(bat_style_id,bat_style_title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].bat_style_id+'","'+data[i].bat_style_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


//playerroles(player_role_id integer primary key,title text
DBUtils.createPlayerRole = function(playerRole,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO playerroles(player_role_id,title) VALUES(?,?) ';
				tx.executeSql(query,[playerRole.playerRoleId,playerRole.title],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRole;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = playerRole;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updatePlayerRole = function(playerRole,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update playerroles set title = ? where player_role_id = ?';
				tx.executeSql(query,[playerRole.title,playerRole.playerRoleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRole;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deletePlayerRole = function(playerRoleId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from playerroles where player_role_id = ?';
				tx.executeSql(query,[playerRoleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRoleId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllPlayerRoles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from playerroles';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getPlayerRoles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT player_role_id,title as player_role_title FROM playerroles ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiPlayerRole = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO playerroles(player_role_id,title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].player_role_id+'","'+data[i].player_role_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}

//type=update&umpire_id=&umpire_name=&umpire_country_name=
DBUtils.createUmpire = function(umpire,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO umpires(umpire_id,umpire_name,umpire_country_id,umpire_logo,team_logo,umpire_dob) VALUES(?,?,?,?,?,?) ';
				tx.executeSql(query,[umpire.umpireId,umpire.umpireName,umpire.umpireCountryId,umpire.umpireLogo,umpire.teamLogo,umpire.dob],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = umpire;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = umpire;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateUmpire = function(umpire,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update umpires set umpire_name = ?, umpire_country_id = ?,umpire_logo=?,team_logo=?,umpire_dob=? where umpire_id = ?';
				tx.executeSql(query,[umpire.umpireId,umpire.umpireName,umpire.umpireCountryId,umpire.umpireLogo,umpire.teamLogo,umpire.dob],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = umpire;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteUmpire = function(umpireId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from umpires where umpire_id = ?';
				tx.executeSql(query,[umpireId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = umpireId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllUmpires = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from umpires';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.getUmpires = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT umpire_id,umpire_name,umpire_country_id,c.name as country_title,umpire_logo,team_logo,umpire_dob FROM umpires u left join country c on u.umpire_country_id=c.id group by umpire_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiUmpire = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO umpires(umpire_id,umpire_name,umpire_country_id,umpire_logo,team_logo,umpire_dob) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].umpire_id+'","'+data[i].umpire_name+'","'+data[i].umpire_country+'","'+data[i].umpire_logo+'","'+data[i].team_logo+'","'+data[i].umpire_dob+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}

DBUtils.createTournamentHasTeam = function(tournamentHasTeam,retFun){
    window.dbObject.transaction(
		function(tx) {
			var respObj = {};
			respObj.status = "failed";
			var query = 'INSERT INTO tournamenthasteam(tournament_id,team_id) VALUES(?,?) ';
			tx.executeSql(query,[tournamentHasTeam.tournamentId,tournamentHasTeam.teamId],
			function(tx, res) {
				respObj.status = "success";
				respObj.data = tournamentHasTeam;
		        retFun(respObj);
			}, function(e1) {
				respObj.data =tournamentHasTeam;
				retFun(respObj);
			}); 
		}
);
}


 DBUtils.createMultiTournamentHasTeam = function(tournamentHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO tournamenthasteam(tournament_id,team_id) VALUES(?,?) ';
				tx.executeSql(query,[tournamentHasTeam.tournamentId,tournamentHasTeam.teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =tournamentHasTeam;
					retFun(respObj);
				}); 
			}
	);
}

 DBUtils.deleteTournamentHasTeam = function(tournamentHasTeam,retFun){
	 window.dbObject.transaction(
			 function(tx) {
				 var respObj = {};
				 respObj.status = "failed";
				 var query = 'delete from tournamenthasteam where  tournament_id= ? and team_id= ?';
				 tx.executeSql(query,[tournamentHasTeam.tournamentId,tournamentHasTeam.teamId],
						 function(tx, res) {
					 respObj.status = "success";
					 respObj.data =tournamentHasTeam;
					 retFun(respObj);
				 }, function(e1) {
					 respObj.data = [e1];
					 retFun(respObj);
				 }); 
			 }
	 );
}
 

 DBUtils.deleteAllTournamentHasTeam = function(retFun){
	 window.dbObject.transaction(
			 function(tx) {
				 var respObj = {};
				 respObj.status = "failed";
				 var query = 'delete from tournamenthasteam';
				 tx.executeSql(query,[],
						 function(tx, res) {
					 respObj.status = "success";
					 retFun(respObj);
				 }, function(e1) {
					 respObj.data = [e1];
					 retFun(respObj);
				 }); 
			 }
	 );
}

DBUtils.getTournamentHasTeam = function(tournamentHasTeam,retFun){
   window.dbObject.transaction(
		function(tx) {
			var dataArray = [];
			var respObj = {};
			respObj.status = "failed";
			tx.executeSql("SELECT * FROM tournamenthasteam order by tournament_id ", [], function(tx, res) {
	            for (var i = 0; i < res.rows.length; i++){
	                dataArray[i] = res.rows.item(i);
	            }
	            if(dataArray && dataArray.length>0){
	            	respObj.status = "success";
	            	respObj.data = dataArray;
	            }else{
	            	respObj.status = "success";
	            	respObj.data = [];
	            }
	            retFun(respObj);
	        });
		}
);
}



DBUtils.getTournamentHasTeamByTournament = function(tournamentId,retFun){
   window.dbObject.transaction(
		function(tx) {
			var dataArray = [];
			var respObj = {};
			respObj.status = "failed";
			tx.executeSql("SELECT tournament_id,tht.team_id,t.team_logo,t.name as team_title FROM tournamenthasteam tht left join teams t on t.team_id=tht.team_id where tournament_id=? order by tournament_id ", [tournamentId], function(tx, res) {
	            for (var i = 0; i < res.rows.length; i++){
	                dataArray[i] = res.rows.item(i);
	            }
	            if(dataArray && dataArray.length>0){
	            	respObj.status = "success";
	            	respObj.data = dataArray;
	            }else{
	            	respObj.status = "success";
	            	respObj.data = [];
	            }
	            retFun(respObj);
	        });
		}
);
}



DBUtils.createMultiTournamentTeam = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO tournamenthasteam(tournament_id,team_id) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].tournament_id+'","'+data[i].team_id+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				 // console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


DBUtils.createTeamHasPlayer = function(teamHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO teamhasplayer(team_id,player_id,thp_id) VALUES(?,?,?) ';
				tx.executeSql(query,[teamHasPlayer.teamId,teamHasPlayer.playerId,teamHasPlayer.thpId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = teamHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =teamHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.createMultiTeamHasPlayer = function(teamHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO teamhasplayer(team_id,player_id,thp_id) VALUES(?,?,?) ';
				tx.executeSql(query,[teamHasPlayer.teamId,teamHasPlayer.playerId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = teamHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =teamHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteTeamHasPlayer = function(teamHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from teamhasplayer where  team_id= ? and player_id= ?';
				tx.executeSql(query,[teamHasPlayer.teamId,teamHasPlayer.playerId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data =teamHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllTeamHasPlayers = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from teamhasplayer';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.getTeamHasPlayer = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT team_id,thp.player_id,p.player_name,thp_id FROM teamhasplayer thp left join players p on p.player_id=thp.player_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.getTeamHasPlayerByTeamId= function(teamHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("select thp.team_id,thp.player_id,thp.thp_id,p.player_name,p.player_logo from teamhasplayer as thp left join players as p on thp.player_id=p.player_id where thp.team_id=?; ", [teamHasPlayer.teamId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.createMultiTeamHasPlayers = function(data,retFun){
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = ' INSERT INTO teamhasplayer(team_id,player_id,thp_id) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].team_id+'","'+data[i].player_id+'","'+data[i].thp_id+'")';
                      if(i < (data.length - 1)) {
                        sql    = sql + ',';
                      }
                    }
                  //  console.log(sql)
                    var params = [];
                    tx.executeSql(
                      sql, 
                      params,               
                      function(tx, res) {
                            respObj.status = "success";
                            respObj.data = data;
                            retFun(respObj);
                        }, function(e1) {
                            respObj.data = e1;
                            retFun(respObj);
                        }
                    );
                  },function(suc){},function(err){}
            
    );
}





//tournament_has_player

DBUtils.createTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	//console.log(tournamentHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO tournamenthasplayer(tournament_id,team_id,player_id,odi,test,t20) VALUES(?,?,?,?,?,?) ';
				tx.executeSql(query,[tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId,tournamentHasPlayer.playerId,tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = tournamentHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from tournamenthasplayer where tournament_id = ? and team_id = ? and player_id = ? and odi = ? and test = ? and t20 = ?';
				tx.executeSql(query,[tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId,tournamentHasPlayer.playerId,tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllTournamentHasPlayers = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from tournamenthasplayer';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update tournamenthasplayer set tournament_id = ?,team_id = ?,player_id = ?,odi = ?,test = ?,t20 = ? where tournament_id = ?,team_id = ?,player_id = ?,odi = ?,test = ?,t20 = ? ';
				tx.executeSql(query,[tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId,tournamentHasPlayer.playerId,tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}

DBUtils.getTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM tournamenthasplayer order by tournament_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

/*DBUtils.createMultiTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO tournamenthasplayer(tournament_id,team_id,player_id,odi,test,t20) VALUES(?,?,?,?,?,?) ';
				tx.executeSql(query,[tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId,tournamentHasPlayer.playerId,tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = tournamentHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = tournamentHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}*/

DBUtils.getAllByTourTournamentHasPlayerURL = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM tournamenthasplayer order by tournament_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.getTournamentHasPlayerId = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
	function(tx) {
	var dataArray = [];
	var respObj = {};
	respObj.status = "failed";
	tx.executeSql("select thp.tournament_id,thp.team_id,thp.player_id,thp.odi,thp.test,thp.t20,p.player_name,p.player_logo  from tournamenthasplayer as thp left join players as p on thp.player_id=p.player_id where thp.tournament_id=? and thp.team_id=?", [tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId], function(tx, res) {
	           for (var i = 0; i < res.rows.length; i++){
	               dataArray[i] = res.rows.item(i);
	           }
	           if(dataArray && dataArray.length>0){
	           	respObj.status = "success";
	           	respObj.data = dataArray;
	           }else{
	           	respObj.status = "success";
	           	respObj.data = [];
	           }
	           retFun(respObj);
	       });
	}
	);
	}


DBUtils.createMultiTHP = function(data,retFun){
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = ' INSERT INTO tournamenthasplayer(t_thp_id,tournament_id,team_id,player_id,odi,test,t20) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].t_thp_id+'","'+data[i].tournament_id+'","'+data[i].team_id+'","'+data[i].player_id+'","'+data[i].odi+'","'+data[i].test+'","'+data[i].t20+'")';
                      if(i < (data.length - 1)) {
                        sql    = sql + ',';
                      }
                    }
                   // console.log(sql)
                    var params = [];
                    tx.executeSql(
                      sql, 
                      params,               
                      function(tx, res) {
                            respObj.status = "success";
                            respObj.data = data;
                            retFun(respObj);
                        }, function(e1) {
                            respObj.data = e1;
                            retFun(respObj);
                        }
                    );
                  },function(suc){},function(err){}
            
    );
}

//category

DBUtils.createCategory = function(category,retFun){
	//console.log(category)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO category(category_id,categoryName) VALUES(?,?) ';
				tx.executeSql(query,[category.catId,category.categoryName],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = category;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = category;
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteCategory = function(category,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from category where category_id = ?';
				tx.executeSql(query,[category.catId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = category;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllCategory = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from category ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateCategory = function(category,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update category set categoryName = ? where category_id = ? ';
				tx.executeSql(query,[category.categoryName,category.catId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = category;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}

DBUtils.getCategory = function(category,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT category_id,categoryName as category_title FROM category order by category_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.createMultiCategory = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO category(category_id,categoryName) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].category_id+'","'+data[i].category_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


//playerroles(player_role_id integer primary key,title text
DBUtils.createPlayerRole = function(playerRole,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO playerroles(player_role_id,title) VALUES(?,?) ';
				tx.executeSql(query,[playerRole.playerRoleId,playerRole.title],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRole;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = playerRole;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updatePlayerRole = function(playerRole,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update playerroles set title = ? where player_role_id = ?';
				tx.executeSql(query,[playerRole.title,playerRole.playerRoleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRole;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deletePlayerRole = function(playerRoleId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from playerroles where player_role_id = ?';
				tx.executeSql(query,[playerRoleId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerRoleId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.deleteAllPlayerRoles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from playerroles ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

/*DBUtils.getPlayerRoles = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM playerroles ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}*/

//country

DBUtils.getCountry = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT * FROM country order by id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.createCountry = function(country,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO country(id,iso,name,nicename,iso3,numcode,phonecode,flagPath,status) VALUES(?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[country.id,country.iso,country.name,country.nicename,country.iso3,country.numcode,country.phonecode,country.flagPath,country.status],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = country;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = country;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.createMultiCountry = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = ' INSERT INTO country(id,iso,name,nicename,iso3,numcode,phonecode,flagPath,status) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].id+'","'+data[i].iso+'","'+data[i].name+'","'+data[i].nicename+'","'+data[i].iso3+'","'+data[i].numcode+'","'+data[i].phonecode+'","'+data[i].flagPath+'","'+data[i].status+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


//match

DBUtils.createMatch = function(match,retFun){
	//console.log(match)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id,match_status,toss,mom_id,winning_match_id,match_result,team1_id ,team1_logo ,team1_name,team2_id,team2_logo,team2_name,tournament_title,venue_details,team1shortname,team2shortname,team1score,team2score,team1wkts,team2wkts,match_no) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[match.matchId,match.matchName,match.matchTypeId,match.tournamentId,match.location,match.noInngs,match.starttime,match.description,match.umpire1,match.umpire2,match.tvUmpire,match.matchRef,match.resUmpire,match.localTime,match.matchCat,match.matchDayNight,match.venueId,match.matchStatus,match.toss,match.momId,match.winningMatchId,match.matchResult,match.team1Id,match.team1Logo,match.team1Name,match.team2Id,match.team2Logo,match.team2Name,match.tournamentTitle,match.venueDetails,match.team1shortname,match.team2shortname,match.team1score,match.team2score,match.team1wkts,match.team2wkts,match.match_no],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = match;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = match;
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteMatch = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from match where match_id = ? and tournament_id= ? ';
				tx.executeSql(query,[match.matchId,match.tournamentId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = match;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllMatch = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from match';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllResultMatch = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from match where match_status=1';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteAllFixturesMatch = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from match where match_status=0';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateMatch = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update match set match_type_id = ?,tournament_id = ?,match_name = ?,location = ?,no_inngs = ?,starttime = ?,description = ?,match_status = ?,toss = ?,umpire1 = ?,umpire2 = ?,tv_umpire = ?,match_ref = ?,res_umpire = ?,match_result = ?,local_time = ?,match_cat = ?,mom_id = ?,winning_match_id= ?,match_day_night=?,venue_id=?,match_no=? where match_id = ? ';
				tx.executeSql(query,[match.matchTypeId,match.tournamentId,match.matchName,match.location,match.noInngs,match.starttime,match.description,match.matchStatus,match.toss,match.umpire1,match.umpire2,match.tvUmpire,match.matchRef,match.resUmpire,match.matchResult,match.localTime,match.matchCat,match.momId,match.winningMatchId,match.matchDayNight,match.venueId,match.match_no,match.matchId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = match;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}

DBUtils.getMatch = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT m.*,v.venue_title FROM match m left join venue v on v.venue_id=m.venue_id ORDER BY m.starttime ASC", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.getAllByTourMatch = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM match order by match_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiMatch = function(data,retFun){
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = ' INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id,match_status,toss,mom_id,winning_match_id,match_result,team1_id ,team1_logo ,team1_name,team2_id,team2_logo,team2_name,tournament_title,venue_details,team1shortname,team2shortname,team1score,team2score,team1wkts,team2wkts,match_no) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].match_id+'","'+data[i].match_name+'","'+data[i].match_type_id+'","'+data[i].tournament_id+'","'+data[i].location+'","'+data[i].no_inngs+'","'+data[i].starttime+'","'+data[i].description+'","'+data[i].umpire1+'","'+data[i].umpire2+'","'+data[i].tv_umpire+'","'+data[i].match_ref+'","'+data[i].res_umpire+'","'+data[i].local_time+'","'+data[i].match_cat+'","'+data[i].match_day_night+'","'+data[i].venue_id+'","'+data[i].match_status+'","'+data[i].toss+'","'+data[i].mom_id+'","'+data[i].winning_team_id+'","'+data[i].match_result+'","'+data[i].team1id+'","'+data[i].team1logo+'","'+data[i].team1name+'","'+data[i].team2id+'","'+data[i].team2logo+'","'+data[i].team2name+'","'+data[i].tournament_title+'","'+data[i].venue_title+'","'+data[i].team1shortname+'","'+data[i].team2shortname+'","'+data[i].team1score+'","'+data[i].team2score+'","'+data[i].team1wkts+'","'+data[i].team2wkts+'","'+data[i].match_no+'")';
                      if(i < (data.length - 1)) {
                        sql    = sql + ',';
                      }
                    }
                  //  console.log(sql)
                    var params = [];
                    tx.executeSql(
                      sql, 
                      params,               
                      function(tx, res) {
                            respObj.status = "success";
                            respObj.data = data;
                            retFun(respObj);
                        }, function(e1) {
                            respObj.data = e1;
                            retFun(respObj);
                        }
                    );
                  },function(suc){},function(err){}
            
    );
}

//multifixtures
DBUtils.createMultiFixtures = function(data,retFun){
	window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = ' INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id,match_status,toss,mom_id,winning_match_id,match_result,team1_id ,team1_logo ,team1_name,team2_id,team2_logo,team2_name,tournament_title,venue_details,team1shortname,team2shortname,team1score,team2score,team1wkts,team2wkts,match_no) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].match_id+'","'+data[i].match_name+'","'+data[i].match_type_id+'","'+data[i].tournament_id+'","'+data[i].location+'","'+data[i].no_inngs+'","'+data[i].starttime+'","'+data[i].description+'","'+data[i].umpire1+'","'+data[i].umpire2+'","'+data[i].tv_umpire+'","'+data[i].match_ref+'","'+data[i].res_umpire+'","'+data[i].local_time+'","'+data[i].match_cat+'","'+data[i].match_day_night+'","'+data[i].venue_id+'","'+data[i].match_status+'","'+data[i].toss+'","'+data[i].mom_id+'","'+data[i].winning_team_id+'","'+data[i].match_result+'","'+data[i].team1id+'","'+data[i].team1logo+'","'+data[i].team1name+'","'+data[i].team2id+'","'+data[i].team2logo+'","'+data[i].team2name+'","'+data[i].tournament_title+'","'+data[i].venue_title+'","'+data[i].team1shortname+'","'+data[i].team2shortname+'","'+data[i].team1score+'","'+data[i].team2score+'","'+data[i].team1wkts+'","'+data[i].team2wkts+'","'+data[i].match_no+'")';
                      if(i < (data.length - 1)) {
                        sql    = sql + ',';
                      }
                    }
                  //  console.log(sql)
                    var params = [];
                    tx.executeSql(
                      sql, 
                      params,               
                      function(tx, res) {
                            respObj.status = "success";
                            respObj.data = data;
                            retFun(respObj);
                        }, function(e1) {
                            respObj.data = e1;
                            retFun(respObj);
                        }
                    );
                  },function(suc){},function(err){}
            
    );
}



//match_has_team


DBUtils.createMatchHasTeam = function(matchHasTeam,retFun){
	//console.log(matchHasTeam)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO matchhasteam(match_id,team_id) VALUES(?,?) ';
				tx.executeSql(query,[matchHasTeam.matchId,matchHasTeam.teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasTeam;
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteMatchHasTeam = function(matchHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from matchhasteam where match_id = ? & team_id= ? ';
				tx.executeSql(query,[matchHasTeam.matchId,matchHasTeam.teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllMatchHasTeam = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from matchhasteam';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}



DBUtils.getMatchHasTeam = function(matchHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select m.match_name,t.name team_name,t.small_name,mhp.match_id,mhp.team_id,m.tournament_id from matchhasteam mhp inner join match m on m.match_id = mhp.match_id inner join teams t on t.team_id = mhp.team_id", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err){
		        	respObj.status = "failed";
	            	respObj.data = JSON.stringify(err);
	            	retFun(respObj);
		        });
			}
	);
}

DBUtils.getMatchHasTeamName = function(matchHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select m.match_id,m.team_id,t.name  from matchhasteam as m left join teams as t on m.team_id=t.team_id where m.match_id=?", [matchHasTeam.matchId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err){
		        	respObj.status = "failed";
	            	respObj.data = JSON.stringify(err);
	            	retFun(respObj);
		        });
			}
	);
}

DBUtils.createMultiMatchHasTeam = function(matchHasTeam,retFun){
	//console.log(matchHasTeam)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO matchhasteam(match_id,team_ids) VALUES(?,?) ';
				tx.executeSql(query,[matchHasTeam.matchId,matchHasTeam.teamId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasTeam;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateScoreMatchHasTeam = function(matchHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'updateScore matchHasTeam set match_id = ?,team_id = ?,bat_seq = ?,inngs = ?,score = ?,wickets = ?,result = ?,overs = ?,bys = ?,leg_bys = ?,wide = ?,noballs = ?,fall_of_wicket = ?,maxOvers = ?,fours = ?,sixes = ?';
				tx.executeSql(query,[matchHasTeam.matchId,matchHasTeam.teamId,matchHasTeam.batSeq,matchHasTeam.Inngs,matchHasTeam.Score,matchHasTeam.Wickets,matchHasTeam.Result,matchHasTeam.Overs,matchHasTeam.Bys,matchHasTeam.legBys,matchHasTeam.Wide,matchHasTeam.noBalls,matchHasTeam.fallofWicket,matchHasTeam.maxOvers,matchHasTeam.Fours,matchHasTeam.Sixes],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}



DBUtils.createMultiMatchTeam = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO matchhasteam(match_id,team_id) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].match_id+'","'+data[i].team_id+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}




DBUtils.createMatchHasPlayer = function(matchHasPlayer,retFun){
	//console.log(matchHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs) VALUES(?,?,?,?) ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId,matchHasPlayer.Inngs],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.createMultiMatchHasPlayer = function(matchHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs) VALUES(?,?,?,?) ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId,matchHasPlayer.Inngs],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.deleteMatchHasPlayer = function(matchHasPlayer,retFun){
	//console.log(matchHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'DELETE from matchhasplayer where match_id=? and team_id=? and player_id=?';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.deleteAllMatchHasPlayer = function(retFun){
	//console.log(matchHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'DELETE from matchhasplayer where match_id=?&team_id=?&player_id=?';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateMatchHasPlayer = function(matchHasPlayer,retFun){
	//console.log(matchHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  matchhasplayer set  match_id=?&team_id=?&player_id=? ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = matchHasPlayer;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getMultiMatchHasPlayer = function(matchHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM matchhasplayer order by match_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.getMatchHasPlayer = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select m.match_name,t.name team_name,p.player_name,mhp.match_id,mhp.team_id,mhp.player_id,mhp.inngs from matchhasplayer mhp left join match m on m.match_id = mhp.match_id left join teams t on t.team_id = mhp.team_id left join players p on p.player_id = mhp.player_id ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.getMatchHasPlayerByMatchAndTeam = function(obj,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select m.match_name,t.name team_name,p.player_name,p.player_logo,mhp.match_id,mhp.team_id,mhp.player_id,mhp.inngs from matchhasplayer mhp left join match m on m.match_id = mhp.match_id left join teams t on t.team_id = mhp.team_id left join players p on p.player_id = mhp.player_id where mhp.match_id=? and mhp.team_id=?", [obj.matchId,obj.teamId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.getMatchHasPlayerByMatch = function(matchId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select m.match_name,t.name team_name,p.player_name,mhp.match_id,mhp.team_id,mhp.player_id,mhp.inngs from matchhasplayer mhp left join match m on m.match_id = mhp.match_id left join teams t on t.team_id = mhp.team_id left join players p on p.player_id = mhp.player_id where mhp.match_id=? ", [matchId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.updateScoreMatchHasPlayer = function(matchHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'updateScore matchHasPlayer set match_id = ?,team_id = ?,player_id = ?,inngs = ?,bat_seq = ?,bowl_seq = ?,score = ?,balls = ?,out_str = ?,fours = ?,sixes = ?,overs = ?,madin = ?,b_runs = ?,wicks = ?,wides = ?,nobals = ?,this_over_runs = ?,b_sixes = ?,b_fours = ?,candb = ?,f_catches = ?,f_IR = ?,w_keeper = ?,f_DR = ?,keeper_stumps = ?,captain = ?';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId,matchHasPlayer.Inngs,matchHasPlayer.batSeq,matchHasPlayer.bowlSeq,matchHasPlayer.Score,matchHasPlayer.Balls,matchHasPlayer.outStr,matchHasPlayer.Fours,matchHasPlayer.Sixes,matchHasPlayer.Overs,matchHasPlayer.Madin,matchHasPlayer.bRuns,matchHasPlayer.Wicks,matchHasPlayer.Wides,matchHasPlayer.Nobals,matchHasPlayer.thisoverRuns,matchHasPlayer.bSixes,matchHasPlayer.bFours,matchHasPlayer.CandB,matchHasPlayer.fCatches,matchHasPlayer.fIR,matchHasPlayer.wKeeper,matchHasPlayer.fDR,matchHasPlayer.keeperStumps,matchHasPlayer.Captain],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = matchHasTeam;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}


DBUtils.createMultiMatchPlayer = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].match_id+'","'+data[i].team_id+'","'+data[i].player_id+'","'+data[i].inngs+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				 // console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}
//venue

DBUtils.createVenue = function(venue,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO venue(venue_id,venue_title,geoLat,geoLang,venue_description,venue_location,country_id,country_title) VALUES(?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[venue.venueId,venue.venueTitle,venue.venueGeoLat,venue.venueGeoLang,venue.venueDescription,venue.venuelocation,venue.countryId,venue.countryTitle],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = venue;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = venue;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteVenue = function(venue,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from venue where venue_id = ? ';
				tx.executeSql(query,[venue.venueId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = venue;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}



DBUtils.deleteAllVenue = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from venue ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.updateVenue = function(venue,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update venue set venue_title = ?,geoLat = ?,geoLang = ?,venue_description = ?,venue_location = ?,country_id = ?,country_title=? where venue_id = ?';
				tx.executeSql(query,[venue.venueTitle,venue.venueGeoLat,venue.venueGeoLang,venue.venueDescription,venue.venuelocation,venue.countryId,venue.countryTitle,venue.venueId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = venue;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.getVenue = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT * FROM venue", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.getByCountryVenue = function(venue,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM venue where country_id = ? order by country_id ", [venue.countryId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiVenue = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO venue(venue_id,venue_title,geoLat,geoLang,venue_description,venue_location,country_id,country_title) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].venue_id+'","'+data[i].venue_title+'","'+data[i].geoLat+'","'+data[i].geoLang+'","'+data[i].venue_description+'","'+data[i].venue_location+'","'+data[i].country_id+'","'+data[i].country_title+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				 //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}

//pictures

DBUtils.createPictures = function(pictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO pictures(picture_id,picture_title,picture_description,picture_type,picture_type_id,picture_logo,shortname,createdOn,updatedOn) VALUES(?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[pictures.pictureId,pictures.pictureTitle,pictures.pictureDescription,pictures.pictureType,pictures.pictureTypeId,pictures.PicPath,pictures.shortname,pictures.createdOn,pictures.updatedOn],
						function(tx, res) {
					respObj.status = "success";
					respObj.data = pictures;
					retFun(respObj);
				}, function(e1) {
					respObj.data = pictures;
					retFun(respObj);
				});
			}
	);
}

DBUtils.updatePictures = function(pictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update pictures set picture_title= ?,picture_description= ?,picture_type= ?,picture_type_id= ?,picture_logo=?,shortname=?,createdOn=?,updatedOn=? where picture_id = ?';
				tx.executeSql(query,[pictures.pictureTitle,pictures.pictureDescription,pictures.pictureType,pictures.pictureTypeId,pictures.PicPath,pictures.shortname,pictures.createdOn,pictures.updatedOn,pictures.pictureId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = pictures;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deletePictures = function(pictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from pictures where picture_id = ? and picture_type = ? and picture_type_id = ?';
				tx.executeSql(query,[pictures.pictureId,pictures.pictureType,pictures.pictureTypeId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = pictures;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllPictures = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from pictures ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getPictures = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT picture_id,picture_title,picture_description,picture_type,picture_type_id,picture_logo pic_path,shortname,createdOn,updatedOn,lupdate FROM pictures ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.getAllByTypePictures = function(pictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM pictures order by picture_id", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiPicture = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO pictures(picture_id,picture_title,picture_description,picture_type,picture_type_id,picture_logo,shortname,createdOn,updatedOn) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].picture_id+'","'+data[i].picture_title+'","'+data[i].picture_description+'","'+data[i].picture_type+'","'+data[i].picture_type_id+'","'+data[i].pic_path+'","'+data[i].shortname+'","'+data[i].createdOn+'","'+data[i].updatedOn+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}




//

//player_id,player_name,player_logo,bowl_style_id,player_cat,playing_role,player_country_id,description,dob
DBUtils.createPlayer = function(player,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO players(player_id,player_name,player_logo,bowl_style_id,bat_style_id,player_cat,playing_role,player_country_id,description,dob,player_status,bat_style_title,bowl_style_title,player_country_title,player_category_title,player_role_title,player_teams,player_search_name,player_teams_small,phonenumber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[player.playerId,player.playerName,player.playerLogo,player.bowlStyleId,player.batStyleId,player.cat,player.role,player.playerCountryId,player.description,player.dob,player.player_status,player.batStyleTitle,player.bowlStyletitle,player.playerCountrytitle,player.playerCategorytitle,player.playerRoletitle,player.playerTeams,player.playerSearchname,player.player_teams_small,player.phonenumber],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = player;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = player;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updatePlayer = function(player,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update players set player_name=?,player_logo=?,bowl_style_id=?,bat_style_id=?,player_cat=?,playing_role=?,player_country_id=?,description=?,dob=?,player_status=?,bat_style_title=?,bowl_style_title=?,player_country_title=?,player_category_title=?,player_role_title=?,player_teams=?,player_search_name=?,phonenumber=? where player_id = ?';
				tx.executeSql(query,[player.playerName,player.playerLogo,player.bowlStyleId,player.batStyleId,player.cat,player.role,player.playerCountryId,player.description,player.dob,player.playerId,player.player_status,player.batStyleTitle,player.bowlStyletitle,player.playerCountrytitle,player.playerCategorytitle,player.playerRoletitle,player.playerTeams,player.playerSearchname,player.phonenumber],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = player;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deletePlayer = function(playerId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from players where player_id = ?';
				tx.executeSql(query,[playerId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = playerId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllPlayer = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from players ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.getPlayers = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT * FROM players order by player_name ASC", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiPlayer = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO players(player_id,player_name,player_logo,bowl_style_id,bat_style_id,player_cat,playing_role,player_country_id,description,dob,player_status,bat_style_title,bowl_style_title,player_country_title,player_category_title,player_role_title,player_teams,player_search_name,player_teams_small,phonenumber)  VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].player_id+'","'+data[i].player_name+'","'+data[i].player_logo+'","'+data[i].bowl_style_id+'","'+data[i].bat_style_id+'","'+data[i].player_cat+'","'+data[i].playing_role+'","'+data[i].player_country_id+'","'+data[i].description+'","'+data[i].dob+'","'+data[i].player_status+'","'+data[i].bat_style_title+'","'+data[i].bowl_style_title+'","'+data[i].player_country_title+'","'+data[i].player_category_title+'","'+data[i].player_role_title+'","'+data[i].player_teams+'","'+data[i].player_search_name+'","'+data[i].player_teams_small+'","'+data[i].phonenumber+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  // console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}





//videos : video_id integer primary key,video_title text
DBUtils.createVideos = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO videos(video_id,video_title,video_description,video_type,video_type_id,video_logo,createdOn,thumbnail,shortname,duration,updatedOn) VALUES(?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[videos.videoId,videos.videoTitle,videos.videoDescription,videos.videoType,videos.videoTypeId,videos.PicPath,videos.createdOn,videos.thumbnail,videos.shortname,videos.duration,videos.updatedOn],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = videos;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = videos;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateVideos = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update videos set video_title= ?,video_description= ?,video_type= ?,video_type_id= ?,video_logo=?,thumbnail=?,shortname=?,duration=?,updatedOn=?,createdOn=? where video_id = ?';
				tx.executeSql(query,[videos.videoTitle,videos.videoDescription,videos.videoType,videos.videoTypeId,videos.PicPath,videos.thumbnail,videos.shortname,videos.duration,videos.updatedOn,videos.createdOn,videos.videoId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = videos;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.deleteVideos = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from videos where video_id = ? and video_type = ? and video_type_id = ?';
				tx.executeSql(query,[videos.videoId,videos.videoType,videos.videoTypeId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = videos;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllVideos = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from videos ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getVideos = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.getAllByTypeVideos = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos order by video_id", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiVideos = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO videos(video_id,video_title,video_description,video_type,video_type_id,video_logo,createdOn,thumbnail,shortname,duration,updatedOn) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].video_id+'","'+data[i].video_title+'","'+data[i].video_description+'","'+data[i].video_type+'","'+data[i].video_type_id+'","'+data[i].video_path+'","'+data[i].createdOn+'","'+data[i].thumbnail+'","'+data[i].shortname+'","'+data[i].duration+'","'+data[i].updatedOn+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


// points
DBUtils.createPointsconfig = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO points(pc_id,pc_name,tournament_id,points) VALUES(?,?,?,?) ';
				tx.executeSql(query,[points.pcId,points.pcName,points.tournamentId,points.points],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = points;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =points;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updatePointsconfig = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  points set  pc_name=?,tournament_id=?,points=? where pc_id=? ';
				tx.executeSql(query,[points.pcName,points.tournamentId,points.points,points.pcId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = points;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =points;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deletepointsconfig = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from points where tournaments_id = ? and pc_id=?';
				tx.executeSql(query,[points.tournamentId,points.pcId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = points;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllPoints = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from points ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getPoints = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM points ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.getPointsListByTour = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM points where tournament_id=?", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiPoint = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO points(pc_id,pc_name,tournament_id,points) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].pc_id+'","'+data[i].pc_name+'","'+data[i].tournament_id+'","'+data[i].points+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}

//user
DBUtils.createUser = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO user(uid,username ,role_name,emailid,password,socialid,udeviceid,devicetype,teamid,status ) VALUES(?,?,?,?,?,?,?,?,?,?)';
				tx.executeSql(query,[user.uId,user.userName,user.roleName,user.emailId,user.password,user.socialId,user.uDeviceId,user.deviceType,user.teamId,user.status],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = user;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =user;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.updateUser = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  user set role_name=?,teamid=?,password=?,username= ?,status=? where uid= ?';
				tx.executeSql(query,[user.roleName,user.teamId,user.password,user.username,user.status,user.uId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = user;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =user;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteuser = function(uId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from user where uid = ?';
				tx.executeSql(query,[uId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = uId;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteAllUser = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from user ';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getUserList = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT u.uid,u.username,u.role_name,u.emailid,u.password,u.teamid,t.name as team_name,u.status FROM user u left join teams t on t.team_id=u.teamid ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.updatePassword = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  user set password=? where uid= ?';
				tx.executeSql(query,[user.userName,user.uId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = user;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =user;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getLogin = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT socialid,password FROM user where socialid=? and password=? ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.changePassword = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  user set password=? where uid= ?';
				tx.executeSql(query,[user.userName,user.uId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = user;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =user;
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.updateUdId = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update  user set udeviceid=?,devicetype=? where uid= ?';
				tx.executeSql(query,[user.uDeviceId,user.userName,user.uId],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = user;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =user;
					retFun(respObj);
				}); 
			}
	);
}
DBUtils.forgotPassword = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT password FROM user where email=? ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}
DBUtils.getDetailById = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM user where uid=? ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.changePassword = function(user,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT password FROM user where email=? ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}



DBUtils.createMultiUser = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    =  'INSERT INTO user(uid,username ,role_name,emailid,password,socialid,udeviceid,devicetype,teamid,status ) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].uId+'","'+data[i].username+'","'+data[i].role_name+'","'+data[i].emailId+'","'+data[i].password+'","'+data[i].socialId+'","'+data[i].uDId+'","'+data[i].deviceType+'","'+data[i].team_id+'","'+data[i].ustatus+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				  //  console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}



//  Client Home Videos
DBUtils.getHomeVideos = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos where video_type=? and video_type_id=? ORDER BY updatedOn DESC", [videos.videoType,videos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


// Client Fixtures
DBUtils.getFixturesBytournamentId = function(matches,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM match where tournament_id='"+matches.tournamentId+"' and match_status='"+matches.matchStatus+"' ORDER BY starttime ASC ", [], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

// Client Venue
DBUtils.getVenuesByTournamentId = function(venues,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("SELECT v.venue_id,v.venue_title,v.geoLat,v.geoLang,v.venue_description,v.venue_location,v.country_id,v.country_title  FROM venue as v left join match as m on v.venue_id=m.venue_id where m.tournament_id=? group by v.venue_id", [venues.tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

// Client Points
DBUtils.createClientPoints = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO clientpoints(tournament_id,played,won,lost,tied,nr,points,runrate,tht_id,team_id,team_name,team_logo,team_small_name,team_cat,description,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[points.tournamentId,points.played,points.won,points.lost,points.tied,points.nr,points.points,points.runrate,points.tht_id,points.team_id,points.team_name,points.team_logo,points.team_small_name,points.team_cat,points.description,points.status],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = points;
			        retFun(respObj);
				}, function(e1) {
					respObj.data =points;
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.getPointByTournId = function(points,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM clientpoints where tournament_id=?", [points.tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.deleteAllClientPoints = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from clientpoints';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}

DBUtils.deleteClientPointsByTournament = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from clientpoints';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}



DBUtils.createMultiCientpoint = function(data,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				 var sql    = 'INSERT INTO clientpoints(tournament_id,played,won,lost,tied,nr,points,runrate,tht_id,team_id,team_name,team_logo,team_small_name,team_cat,description,status) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].tournament_id+'","'+data[i].played+'","'+data[i].won+'","'+data[i].Lost+'","'+data[i].tied+'","'+data[i].nr+'","'+data[i].points+'","'+data[i].runrate+'","'+data[i].tht_id+'","'+data[i].team_id+'","'+data[i].team_name+'","'+data[i].team_logo+'","'+data[i].team_small_name+'","'+data[i].team_cat+'","'+data[i].description+'","'+data[i].status+'")';
				      if(i < (data.length - 1)) {
				        sql    = sql + ',';
				      }
				    }
				   //console.log(sql)
				    var params = [];
				    tx.executeSql(
				      sql, 
				      params,               
				      function(tx, res) {
							respObj.status = "success";
							respObj.data = data;
					        retFun(respObj);
						}, function(e1) {
							respObj.data = e1;
							retFun(respObj);
						}
				    );
				  },function(suc){},function(err){}
			
	);
}


// Client Team
DBUtils.getTeamsByTourId = function(teams,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				var query = "";
				tx.executeSql("SELECT t.team_id,t.name,t.small_name,t.team_logo,t.team_cat_id,t.description,t.status,t.team_category_title FROM teams as t left join tournamenthasteam as tht on t.team_id=tht.team_id where tht.tournament_id=? ", [teams.tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}

// Client Team Videos
DBUtils.getTeamsVideosTeamId = function(teamsVideos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				var query = "";
				tx.executeSql("SELECT * from videos where video_type=? and video_type_id=? ", [teamsVideos.videoType,teamsVideos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}


// Client Team Pictures
DBUtils.getTeamsPicturesTeamId = function(teamsPictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				var query = "";
				tx.executeSql("SELECT * from pictures where picture_type=? and picture_type_id=? ", [teamsPictures.pictureType,teamsPictures.pictureTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}

// Client Team Squad

DBUtils.createTeamPlayers = function(teamplayers,retFun){
	//console.log(tournamentHasPlayer)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO teamplayers(player_id,team_id,tournament_id,odi,test,t20,bowl_style_id,bat_style_id,player_name,player_logo,player_status,player_search_name,player_country_id,player_cat,playing_role,description,dob,phonenumber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[teamplayers.playerId,teamplayers.teamId,teamplayers.tournamentId,teamplayers.odi,teamplayers.test,teamplayers.t20,teamplayers.bowlstyleId,teamplayers.batstyleId,teamplayers.playername,teamplayers.playerlogo,teamplayers.playerstatus,teamplayers.playersearchname,teamplayers.playercountryid,teamplayers.playercat,teamplayers.playerrole,teamplayers.description,teamplayers.dob,teamplayers.phonenumber],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = teamplayers;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = teamplayers;
					retFun(respObj);
				}); 
			}
	);
}


DBUtils.getTeamPlayersByTeamId = function(teamPlayers,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("select * from teamplayers where tournament_id=? and team_id=? order by player_name ASC", [teamPlayers.tournamentId,teamPlayers.teamId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

DBUtils.deleteAllTeamPlayers = function(retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from teamplayers';
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
}


// Client Player Details
DBUtils.getPlayersByPlayerId = function(players,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				respObj.data = {};
				tx.executeSql("select * from players where player_id=?", [players.playerId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data.list = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data.list = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


DBUtils.createMultiTeamPlayers = function(data,retFun){
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = ' INSERT INTO teamplayers(player_id,team_id,tournament_id,odi,test,t20,bowl_style_id,bat_style_id,player_name,player_logo,player_status,player_search_name,player_country_id,player_cat,playing_role,description,dob) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].player_id+'","'+data[i].team_id+'","'+data[i].tournament_id+'","'+data[i].odi+'","'+data[i].test+'","'+data[i].t20+'","'+data[i].bowl_style_id+'","'+data[i].bat_style_id+'","'+data[i].player_name+'","'+data[i].player_logo+'","'+data[i].player_status+'","'+data[i].player_search_name+'","'+data[i].player_country_id+'","'+data[i].player_cat+'","'+data[i].playing_role+'","'+data[i].description+'","'+data[i].dob+'")';
                      if(i < (data.length - 1)) {
                        sql    = sql + ',';
                      }
                    }
                  //  console.log(sql)
                    var params = [];
                    tx.executeSql(
                      sql, 
                      params,               
                      function(tx, res) {
                            respObj.status = "success";
                            respObj.data = data;
                            retFun(respObj);
                        }, function(e1) {
                            respObj.data = e1;
                            retFun(respObj);
                        }
                    );
                  },function(suc){},function(err){}
            
    );
}

// Client Player Videos
DBUtils.getPlayersVideosplayerId = function(playersVideos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				var query = "";
				tx.executeSql("SELECT * from videos where video_type=? and video_type_id=? ", [playersVideos.videoType,playersVideos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        },function(err) {
		            alert("Error processing SQL: "+JSON.stringify(err));
		        });
			}
	);
}


// Client Videos Latest
DBUtils.getVideosByVideoType = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos where video_type=? and video_type_id=? ORDER BY updatedOn DESC", [videos.videoType,videos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

// Client Videos Most Watched
DBUtils.getVideosByMostWatched = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos where video_type=? and video_type_id=? ", [videos.videoType,videos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

// Client Videos Heighlights
DBUtils.getVideosByHighlights = function(videos,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM videos where video_type=? and video_type_id=? ", [videos.videoType,videos.videoTypeId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}

// Client Pictures Related to Event
DBUtils.getPicturesByPictureType = function(pictures,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM pictures  where picture_type=? and picture_type_id=? order by picture_id", [pictures.pictureType,pictures.pictureTypeid], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		                dataArray[i] = res.rows.item(i);
		            }
		            if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);
		        });
			}
	);
}


// Client MatchByTeamID
	DBUtils.getmatchbyteamId = function(match,retFun){
		window.dbObject.transaction(
				function(tx) {
					var dataArray = [];
					var respObj = {};
					respObj.status = "failed";
					tx.executeSql("SELECT * FROM match where (team1_id='"+match.team1Id+"' or team2_id='"+match.team1Id+"') and tournament_id=? ORDER BY starttime ASC ", [match.tournamentId], function(tx, res) {
			            for (var i = 0; i < res.rows.length; i++){
			                dataArray[i] = res.rows.item(i);
			            }
			            if(dataArray && dataArray.length>0){
			            	respObj.status = "success";
			            	respObj.data = dataArray;
			            }else{
			            	respObj.status = "success";
			            	respObj.data = [];
			            }
			            retFun(respObj);
			        });
				}
		);
	}



// Client Team videos list based on tounament id
DBUtils.getTeamVideosByTournament = function(tournamentId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var team_ids = "";
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select team_id from tournamenthasteam where tournament_id=?", [tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		            	if(i==0)
		            		team_ids += res.rows.item(i).team_id;
		            	else
		            		team_ids += ","+res.rows.item(i).team_id;
		            }
		            console.log(team_ids)
		            /*if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);*/
		            tx.executeSql("select v.* from videos v where video_type='team' and video_type_id in ("+team_ids+")  ORDER BY updatedOn DESC", [], function(tx, res) {
			            for (var i = 0; i < res.rows.length; i++){
			                dataArray[i] = res.rows.item(i);
			            }
			            if(dataArray && dataArray.length>0){
			            	respObj.status = "success";
			            	respObj.data = dataArray;
			            }else{
			            	respObj.status = "success";
			            	respObj.data = [];
			            }
			            retFun(respObj);
			        });
		        });
			}
	);
}



//Client Player videos list based on tournament id
DBUtils.getPlayerVideosByTournament = function(tournamentId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var player_ids = "";
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select player_id from tournamenthasplayer where tournament_id=?", [tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		            	if(i==0)
		            		player_ids += res.rows.item(i).player_id;
		            	else
		            		player_ids += ","+res.rows.item(i).player_id;
		            }
		            console.log(player_ids)
		            /*if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);*/
		            tx.executeSql("select v.* from videos v where video_type='player' and video_type_id in ("+player_ids+")  ORDER BY updatedOn DESC", [], function(tx, res) {
			            for (var i = 0; i < res.rows.length; i++){
			                dataArray[i] = res.rows.item(i);
			            }
			            if(dataArray && dataArray.length>0){
			            	respObj.status = "success";
			            	respObj.data = dataArray;
			            }else{
			            	respObj.status = "success";
			            	respObj.data = [];
			            }
			            retFun(respObj);
			        });
		        });
			}
	);
}


//Client Team pictures list based on tounament id
DBUtils.getTeamPicturesByTournament = function(tournamentId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var team_ids = "";
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select team_id from tournamenthasteam where tournament_id=?", [tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		            	if(i==0)
		            		team_ids += res.rows.item(i).team_id;
		            	else
		            		team_ids += ","+res.rows.item(i).team_id;
		            }
		            console.log(team_ids)
		            /*if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);*/
		            tx.executeSql("select p.* from pictures p where picture_type='team' and picture_type_id in ("+team_ids+")", [], function(tx, res) {
			            for (var i = 0; i < res.rows.length; i++){
			                dataArray[i] = res.rows.item(i);
			            }
			            if(dataArray && dataArray.length>0){
			            	respObj.status = "success";
			            	respObj.data = dataArray;
			            }else{
			            	respObj.status = "success";
			            	respObj.data = [];
			            }
			            retFun(respObj);
			        });
		        });
			}
	);
}



//Client Player videos list based on tournament id
DBUtils.getPlayerPicturesByTournament = function(tournamentId,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var player_ids = "";
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("select player_id from tournamenthasplayer where tournament_id=?", [tournamentId], function(tx, res) {
		            for (var i = 0; i < res.rows.length; i++){
		            	if(i==0)
		            		player_ids += res.rows.item(i).player_id;
		            	else
		            		player_ids += ","+res.rows.item(i).player_id;
		            }
		            console.log(player_ids)
		            /*if(dataArray && dataArray.length>0){
		            	respObj.status = "success";
		            	respObj.data = dataArray;
		            }else{
		            	respObj.status = "success";
		            	respObj.data = [];
		            }
		            retFun(respObj);*/
		            tx.executeSql("select p.* from pictures p where picture_type='player' and picture_type_id in ("+player_ids+")", [], function(tx, res) {
			            for (var i = 0; i < res.rows.length; i++){
			                dataArray[i] = res.rows.item(i);
			            }
			            if(dataArray && dataArray.length>0){
			            	respObj.status = "success";
			            	respObj.data = dataArray;
			            }else{
			            	respObj.status = "success";
			            	respObj.data = [];
			            }
			            retFun(respObj);
			        });
		        });
			}
	);
}


