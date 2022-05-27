var DBUtils = new Object();

DBUtils.loadDBInitials = function(){
	function errorCB(err) {
	    alert("Error processing SQL: "+JSON.stringify(err));
	}
	function successCB() {
		autoSyncTables();
	    var event = new CustomEvent("oncclibready", { "message": "CCLIB is ready" });
	    document.dispatchEvent(event);
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

									}
									localStorage.setItem("appVersion",version);
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
					tx.executeSql('CREATE TABLE IF NOT EXISTS country(id integer primary key,iso text,name text,nicename text,iso3 text,numcode integer,phonecode integer,flagPath text,status integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&match_id=&match_type_id=&tournament_id=&match_name=&location=&no_inngs=&starttime=&description=&match_status=&toss=&mom_match=&umpire1,umpire2=&tv_umpire=&match_ref=&res_umpire=&match_result=&local_time=&match_cat=&mom_id=&winning_match_id=&match_day_night=
					tx.executeSql('CREATE TABLE IF NOT EXISTS match(match_id integer primary key,match_type_id integer,tournament_id integer,match_name text,location text,no_inngs integer,starttime integer,description text,match_status text,toss text,umpire1 text,umpire2 text,tv_umpire text,match_ref text,res_umpire text,match_result text,local_time integer,match_cat text,mom_id integer,winning_match_id integer,match_day_night text,venue_id integer,team1_id integer,team1_logo text,team1_name text,team2_id integer,team2_logo text,team2_name text,tournament_title text,venue_details text,team1shortname text,team2shortname text,match_result_status integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=create&match_id=&team_id=
					tx.executeSql('CREATE TABLE IF NOT EXISTS matchhasteam(mht_id integer,team_logo text,match_id integer,team_id integer,tournament_id integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)')
					//matchhasplayer
					tx.executeSql('CREATE TABLE IF NOT EXISTS matchhasplayer(match_id integer,team_id integer,player_id integer,inngs integer,is_captain integer,is_keeper integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(match_id, team_id,player_id))')
					//type=update&venue_id=&team_id=&player_id=&country_id=&venue_description=&venue_location=
					tx.executeSql('CREATE TABLE IF NOT EXISTS venue(venue_id integer primary key,venue_title text ,geoLat integer,geoLang integer,venue_description text,venue_location text,country_id integer,country_title text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&picture_id=&picture_title=&picture_description=&picture_type=&picture_type_id=&pic_path=
					tx.executeSql('CREATE TABLE IF NOT EXISTS pictures(picture_id integer primary key,picture_title text,picture_description text,picture_type text,picture_type_id integer,picture_logo text,shortname text,createdOn datetime,updatedOn datetime,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');

					//type=create&player_name=&player_logo=&bowl_style_id=&bat_style_id=&player_cat=&playing_role=&player_country_id=&description=&dob=
					tx.executeSql('CREATE TABLE IF NOT EXISTS players(player_id integer primary key,player_name text ,player_logo text,bowl_style_id integer,bat_style_id integer,player_cat integer,playing_role integer,player_country_id text,description text,dob text,status integer,bowl_style_title integer,bat_style_title integer,player_category_title text,player_role_title text,player_country_title text,player_teams text,player_teams_small text,phonenumber text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//type=update&video_id=&video_title
					tx.executeSql('CREATE TABLE IF NOT EXISTS videos(video_id integer primary key,video_title text,video_description text,video_type text,video_type_id integer,video_logo text,thumbnail text,shortname text,duration integer,createdOn datetime,updatedOn datetime,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//points
					tx.executeSql('CREATE TABLE IF NOT EXISTS points(pc_id integer primary key,pc_name text,tournament_id integer,points integer,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
					//user
					tx.executeSql('CREATE TABLE IF NOT EXISTS user(uid integer primary key,username text ,role_name text,emailid text,password text,socialid text,udeviceid text,devicetype text,teamid integer,status text,lupdate datetime DEFAULT CURRENT_TIMESTAMP)');
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
			window.dbObject = openDatabase('cricket_admin', '1.0', 'cricket_admin DB', 2 * 1024 * 1024*1024);
			DBUtils.loadDBInitials();
		}else{
			
			
			
			window.dbObject = window.sqlitePlugin.openDatabase({name: "cricketadmin.db", location: 1},function(){
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
		           // alert("Error processing SQL: "+JSON.stringify(err));
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
				var query = 'INSERT INTO teams(team_id,name,small_name,team_logo,team_cat_id,description,team_category_title) VALUES(?,?,?,?,?,?,?) ';
				tx.executeSql(query,[team.teamId,team.name,team.smallName,team.logo,team.catId,team.description,team.categoryTitle],
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
				var query = 'update teams set name = ?,small_name = ?,team_logo = ?,team_cat_id = ?,description=?,team_category_title = ? where team_id = ?';
				tx.executeSql(query,[team.name,team.smallName,team.logo,team.catId,team.description,team.categoryTitle,team.teamId],
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
		            // alert("Error processing SQL: "+JSON.stringify(err));
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
				      sql      = sql + '("'+data[i].team_id+'","'+data[i].team_name+'","'+data[i].team_small_name+'","'+data[i].team_logo+'","'+data[i].team_cat+'","'+data[i].description+'","'+data[i].team_category_title+'","'+data[i].status+'")';
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
DBUtils.deleteMatchType = function(matchType,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from matchtypes where match_type_id = ?';
				tx.executeSql(query,[matchType.matchTypeId],
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
DBUtils.deleteBowlStyle = function(bowlStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from bowlstyles where bowl_style_id = ?';
				tx.executeSql(query,[bowlStyle.bowlStyleId],
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

DBUtils.deleteBatStyle = function(batStyle,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from batstyles where bat_style_id = ?';
				tx.executeSql(query,[batStyle.batStyleId],
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

DBUtils.deletePlayerRole = function(playerRole,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from playerroles where player_role_id = ?';
				tx.executeSql(query,[playerRole.playerRoleId],
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
				var paramsArr = [];
				var teamIds = tournamentHasTeam.teamId.split(",");
				for(var i=0;i<teamIds.length;i++){
					var query = 'INSERT INTO tournamenthasteam(tournament_id,team_id) VALUES(?,?) ';
					tx.executeSql(query,[tournamentHasTeam.tournamentId,teamIds[i]],
							function(tx, res) {
						if(i==teamIds.length){
							respObj.status = "success";
							respObj.data = tournamentHasTeam;
							retFun(respObj);
						}
					}, function(e1) {
						respObj.data = e1;
						retFun(respObj);
					}); 
				}
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

DBUtils.getTournamentHasTeam = function(retFun){
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



DBUtils.getTournamentHasTeamByTournament = function(tournamentHasTeam ,retFun){
   window.dbObject.transaction(
		function(tx) {
			var dataArray = [];
			var respObj = {};
			respObj.status = "failed";
			tx.executeSql("SELECT tournament_id,tht.team_id,t.team_logo,t.name as team_title FROM tournamenthasteam tht left join teams t on t.team_id=tht.team_id where tournament_id=? order by tournament_id ", [tournamentHasTeam], function(tx, res) {
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
				var paramsArr = [];
				var playerIds = teamHasPlayer.playerId.split(",");
				for(var i=0;i<playerIds.length;i++){
				var query = 'INSERT INTO teamhasplayer(team_id,player_id) VALUES(?,?) ';
				tx.executeSql(query,[teamHasPlayer.teamId,playerIds[i]],
				function(tx, res) {
					if(i==playerIds.length){
					respObj.status = "success";
					respObj.data = teamHasPlayer;
			        retFun(respObj);
					}
				}, function(e1) {
					respObj.data = e1;
					retFun(respObj);
				}); 
				}
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





DBUtils.createMultiTeamhasPlayers = function(data,retFun){
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
				var query = 'update tournamenthasplayer set t_thp_id = ?,odi = ?,test = ?,t20 = ? where tournament_id = ? and team_id = ? and player_id = ?';
				tx.executeSql(query,[tournamentHasPlayer.tThpId ,tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
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

DBUtils.getTournamentHasPlayer = function(retFun){
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

DBUtils.createMultiTournamentHasPlayer = function(tournamentHasPlayer,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var paramsArr = [];
				var playerIds = tournamentHasPlayer.playerId.split(",");
				for(var i=0;i<playerIds.length;i++){
				var query = 'INSERT INTO tournamenthasplayer(tournament_id,team_id,player_id,odi,test,t20) VALUES(?,?,?,?,?,?) ';
				tx.executeSql(query,[tournamentHasPlayer.tournamentId,tournamentHasPlayer.teamId,playerIds[i],tournamentHasPlayer.odi,tournamentHasPlayer.test,tournamentHasPlayer.t20],
				function(tx, res) {
				  if(i==playerIds.length){
					respObj.status = "success";
					respObj.data = tournamentHasPlayer;
			        retFun(respObj);
				  }
				}, function(e1) {
					respObj.data = e1;
					retFun(respObj);
				}); 
			}
		}
	);
}

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

DBUtils.getCategory = function(retFun){
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

				    for(var i = 0; i < data.length; i++)
				    {
				      sql      = sql + '("'+data[i].id+'","'+data[i].iso+'","'+data[i].name+'","'+data[i].nicename+'","'+data[i].iso3+'","'+data[i].numcode+'","'+data[i].phonecode+'","'+data[i].flagPath+'","'+data[i].status+'")';

				      if(i < (data.length - 1))
				      {
				        sql    = sql + ',';
				      }
				    }

				    var params = [];
				    /*for(var k = 0; k < data.length; k++)
				    {
				    	//country.id,country.iso,country.name,country.nicename,country.iso3,country.numcode,country.phonecode,country.flagPath,country.status
				       params.push(data[k].id);
				       params.push(data[k].iso);
				       params.push(data[k].name);
				       params.push(data[k].nicename);
				       params.push(data[k].iso3);
				       params.push(data[k].numcode);
				       params.push(data[k].phonecode);
				       params.push(data[k].flagPath);
				       params.push(data[k].status);
				    }*/
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

/*DBUtils.createMatch = function(match,retFun){
	//console.log(match)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				
				var query = 'INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[match.matchId,match.matchName,match.matchTypeId,match.tournamentId,match.location,match.noInngs,match.starttime,match.description,match.umpire1,match.umpire2,match.tvUmpire,match.matchRef,match.resUmpire,match.localTime,match.matchCat,match.matchDayNight,match.venueId],
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
}*/

DBUtils.createMatch = function(match,retFun){
	//console.log(match)
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id,match_status,toss,mom_id,winning_match_id,match_result,team1_id ,team1_logo ,team1_name,team2_id,team2_logo,team2_name,tournament_title,venue_details,team1shortname,team2shortname,match_result_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[match.matchId,match.matchName,match.matchTypeId,match.tournamentId,match.location,match.noInngs,match.starttime,match.description,match.umpire1,match.umpire2,match.tvUmpire,match.matchRef,match.resUmpire,match.localTime,match.matchCat,match.matchDayNight,match.venueId,match.matchStatus,match.toss,match.momId,match.winningMatchId,match.matchResult,match.team1Id,match.team1Logo,match.team1Name,match.team2Id,match.team2Logo,match.team2Name,match.tournamentTitle,match.venueDetails,match.team1shortname,match.team2shortname,match.matchResultstatus],
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
				var query = 'delete from match ';
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
				var query = 'update match set ';
				query += ' match_type_id = "'+match.matchTypeId+'",';
				query += ' tournament_id = "'+match.tournamentId+'",';
				query += ' match_name = "'+match.matchName+'",';
				query += ' location = "'+match.location+'",';
				query += ' no_inngs = "'+match.noInngs+'",';
				query += ' starttime = "'+match.starttime+'",';
				query += ' description = "'+match.description+'",';
				query += ' match_status = "'+match.matchStatus+'",';
				query += ' toss = "'+match.toss+'",';
				query += ' umpire1 = "'+match.umpire1+'",';
				query += ' umpire2 = "'+match.umpire2+'",';
				query += ' tv_umpire = "'+match.tvUmpire+'",';
				query += ' match_ref = "'+match.matchRef+'",';
				query += ' res_umpire = "'+match.resUmpire+'",';
				query += ' match_result = "'+match.matchResult+'",';
				query += ' local_time = "'+match.localTime+'",';
				query += ' match_cat = "'+match.matchCat+'", ';
				query += ' mom_id = "'+match.momId+'",';
				query += ' winning_match_id= "'+match.winningMatchId+'",';
				query += ' match_day_night="'+match.matchDayNight+'",';
				query += ' venue_id="'+match.venueId+'",';
				query += ' match_result_status="'+match.matchResultstatus+'" ';
				query += ' where match_id = "'+match.matchId+'" ';
				console.log(query)
				tx.executeSql(query,[],
				function(tx, res) {
					respObj.status = "success";
					respObj.data = match;
			        retFun(respObj);
				}, function(trans,e1) {
					console.log(e1.message)
					respObj.data = [e1];
					retFun(respObj);
				}); 
			},function(err){
				// alert(err.message)
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

DBUtils.getMatchByStatus = function(status,retFun){
    window.dbObject.transaction(
            function(tx) {
                var dataArray = [];
                var respObj = {};
                respObj.status = "failed";
                var query = "SELECT * FROM match where match_status="+status+" order by match_id ";
                //console.log(query)
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
                });
            }
    );
}


DBUtils.getByTournamentIdMatchByStatus = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM match where match_status=? and tournament_id=? order by tournament_id ", [match.matchStatus,match.tournamentId], function(tx, res) {
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



DBUtils.getAllByTournamentIdMatch = function(match,retFun){
	window.dbObject.transaction(
			function(tx) {
				var dataArray = [];
				var respObj = {};
				respObj.status = "failed";
				tx.executeSql("SELECT * FROM match where tournament_id=? order by tournament_id ", [match.tournamentId], function(tx, res) {
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
                 var sql    = ' INSERT INTO match(match_id,match_name,match_type_id,tournament_id,location,no_inngs,starttime,description,umpire1,umpire2,tv_umpire,match_ref,res_umpire,local_time,match_cat,match_day_night,venue_id,match_status,toss,mom_id,winning_match_id,match_result,team1_id ,team1_logo ,team1_name,team2_id,team2_logo,team2_name,tournament_title,venue_details,team1shortname,team2shortname,match_result_status) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].match_id+'","'+data[i].match_name+'","'+data[i].match_type_id+'","'+data[i].tournament_id+'","'+data[i].location+'","'+data[i].no_inngs+'","'+data[i].starttime+'","'+data[i].description+'","'+data[i].umpire1+'","'+data[i].umpire2+'","'+data[i].tv_umpire+'","'+data[i].match_ref+'","'+data[i].res_umpire+'","'+data[i].local_time+'","'+data[i].match_cat+'","'+data[i].match_day_night+'","'+data[i].venue_id+'","'+data[i].match_status+'","'+data[i].toss+'","'+data[i].mom_id+'","'+data[i].winning_team_id+'","'+data[i].match_result+'","'+data[i].team1id+'","'+data[i].team1logo+'","'+data[i].team1name+'","'+data[i].team2id+'","'+data[i].team2logo+'","'+data[i].team2name+'","'+data[i].tournament_title+'","'+data[i].venue_details+'","'+data[i].team1shortname+'","'+data[i].team2shortname+'","'+data[i].match_result_status+'")';
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
				var query = 'INSERT INTO matchhasteam(mht_id,match_id,team_id,tournament_id,team_logo) VALUES(?,?,?,?,?) ';
				tx.executeSql(query,[matchHasTeam.mhtId,matchHasTeam.matchId,matchHasTeam.teamId,matchHasTeam.tournamentId,matchHasTeam.teamLogo],
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
				var query = 'delete from matchhasteam where match_id = ? and team_id= ? ';
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
				tx.executeSql("select m.mht_id,m.team_logo,m.match_id,m.team_id,t.small_name,t.name  from matchhasteam as m left join teams as t on m.team_id=t.team_id where m.match_id=?", [matchHasTeam.matchId], function(tx, res) {
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
				var paramsArr = [];
				var teamIds = matchHasTeam.teamId.split(",");
				for(var i=0;i<teamIds.length;i++){
					var query = 'INSERT INTO matchhasteam(match_id,team_id,tournament_id) VALUES(?,?,?) ';
					tx.executeSql(query,[matchHasTeam.matchId,teamIds[i],matchHasTeam.tournamentId],
							function(tx, res) {
						if(i==teamIds.length){
							respObj.status = "success";
							respObj.data = matchHasTeam;
							retFun(respObj);
						}
					}, function(e1) {
						respObj.data = e1;
						retFun(respObj);
					}); 
				}
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

DBUtils.updateMatchHasTeam = function(matchHasTeam,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'update matchHasTeam set mht_id = ?,match_id = ?,team_id = ?,tournament_id = ?';
				tx.executeSql(query,[matchHasTeam.mhtId,matchHasTeam.matchId,matchHasTeam.teamId,matchHasTeam.tournamentId],
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


DBUtils.createMultiMatchTeams = function(data,retFun){
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                 var sql    = 'INSERT INTO matchhasteam(mht_id,match_id,team_id,tournament_id,team_logo) VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].mht_id+'","'+data[i].match_id+'","'+data[i].team_id+'","'+data[i].tournament_id+'","'+data[i].team_logo+'")';
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
				var query = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs,is_captain,is_keeper) VALUES(?,?,?,?,?,?) ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId,matchHasPlayer.Inngs,matchHasPlayer.Captain,matchHasPlayer.wKeeper],
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
				var paramsArr = [];
				var playerIds = matchHasPlayer.playerId.split(",");
				for(var i=0;i<playerIds.length;i++){
					var query = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs,is_captain,is_keeper) VALUES(?,?,?,?,?,?) ';
					tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,playerIds[i],matchHasPlayer.Inngs,matchHasPlayer.Captain,matchHasPlayer.wKeeper],
							function(tx, res) {
						if(i==playerIds.length){
							respObj.status = "success";
							respObj.data = matchHasPlayer;
							retFun(respObj);
						}
					}, function(e1) {
						respObj.data = e1;
						retFun(respObj);
					}); 
				}
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
				var query = 'update  matchhasplayer set is_captain="0" where match_id=? and team_id=? and player_id=? ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
				function(tx, res) {
				}, function(e1) {
                }); 
				query = 'update  matchhasplayer set is_captain="1" where match_id=? and team_id=? and player_id=? ';
				tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
						function(tx, res) {
                    respObj.status = "success";
                    respObj.data = matchHasPlayer;
                    retFun(respObj);
                }, function(e1) {
                    respObj.data = matchHasPlayer;
                    retFun(respObj);
                }); 
            })
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
				tx.executeSql("select m.match_name,t.name team_name,p.player_name,p.player_logo,mhp.match_id,mhp.team_id,mhp.player_id,mhp.inngs,mhp.is_captain,mhp.is_keeper from matchhasplayer mhp left join match m on m.match_id = mhp.match_id left join teams t on t.team_id = mhp.team_id left join players p on p.player_id = mhp.player_id where mhp.match_id=? and mhp.team_id=?", [obj.matchId,obj.teamId], function(tx, res) {
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
					respObj.data = matchHasPlayer;
			        retFun(respObj);
				}, function(e1) {
					respObj.data = [e1];
					retFun(respObj);
				}); 
			}
	);
	
	
}



DBUtils.updateCaptain = function(matchHasPlayer,retFun){
    //console.log(matchHasPlayer)
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                var query = 'update  matchhasplayer set is_captain=0 where match_id=? and team_id=?';
                tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId],
                function(tx, res) {
                }, function(e1) {
                    //console.log(JSON.stringify(e1))
                }); 
                query = 'update  matchhasplayer set is_captain=1 where match_id=? and team_id=? and player_id=? ';
                tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
                function(tx, res) {
                    respObj.status = "success";
                    respObj.data = matchHasPlayer;
                    retFun(respObj);
                }, function(e1) {
                    respObj.data = e1;
                    retFun(respObj);
                }); 
            }
    );
}


DBUtils.updateKeeper = function(matchHasPlayer,retFun){
    //console.log(matchHasPlayer)
    window.dbObject.transaction(
            function(tx) {
                var respObj = {};
                respObj.status = "failed";
                var query = 'update  matchhasplayer set is_keeper=0 where match_id=? and team_id=?';
                tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId],
                function(tx, res) {
                }, function(e1) {
                    console.log(JSON.stringify(e1))
                }); 
                query = 'update  matchhasplayer set is_keeper=1 where match_id=? and team_id=? and player_id=?';
                tx.executeSql(query,[matchHasPlayer.matchId,matchHasPlayer.teamId,matchHasPlayer.playerId],
                function(tx, res) {
                    respObj.status = "success";
                    respObj.data = matchHasPlayer;
                    retFun(respObj);
                }, function(e1) {
                    respObj.data = e1;
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
				 var sql    = 'INSERT INTO matchhasplayer(match_id,team_id,player_id,inngs,is_captain,is_keeper) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].match_id+'","'+data[i].team_id+'","'+data[i].player_id+'","'+data[i].inngs+'","'+data[i].captain+'","'+data[i].w_keeper+'")';
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
				tx.executeSql(query,[venue.venueId,venue.venueTitle,venue.venueGeoLat,venue.venueGeoLang,venue.venueDescription,venue.venuelocation,venue.countryId,venue.country_title],
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
				var query = 'update venue set venue_title = ?,geoLat = ?,geoLang = ?,venue_description = ?,venue_location = ?,country_id = ? where venue_id = ?';
				tx.executeSql(query,[venue.venueTitle,venue.venueGeoLat,venue.venueGeoLang,venue.venueDescription,venue.venuelocation,venue.countryId,venue.venueId],
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
			},
			function(err){
				// alert(err.message)
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
				tx.executeSql("SELECT picture_id,picture_title,picture_description,picture_type,picture_type_id,picture_logo pic_path,shortname,createdOn,updatedOn, lupdate FROM pictures ", [], function(tx, res) {
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
				var query = 'INSERT INTO players(player_id,player_name,player_logo,bowl_style_id,bat_style_id,player_cat,playing_role,player_country_id,description,dob,bowl_style_title,bat_style_title,player_category_title,player_role_title,player_country_title,player_teams,player_teams_small,status,phonenumber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[player.playerId,player.playerName,player.playerLogo,player.bowlStyleId,player.batStyleId,player.cat,player.role,player.playerCountryId,player.description,player.dob,player.bowl_style_title,player.bat_style_title,player.player_category_title,player.player_role_title,player.player_country_title,player.player_teams,player.player_teams_small,player.Status,player.phonenumber],
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
				var query = 'update players set player_name=?,player_logo=?,bowl_style_id=?,bat_style_id=?,player_cat=?,playing_role=?,player_country_id=?,description=?,dob=?,bowl_style_title=?,bat_style_title=?,player_category_title=?,player_role_title=?,player_country_title=?,player_teams=?,player_teams_small=?,status=?,phonenumber=?  where player_id = ?';
				tx.executeSql(query,[player.playerName,player.playerLogo,player.bowlStyleId,player.batStyleId,player.cat,player.role,player.playerCountryId,player.description,player.dob,player.bowl_style_title,player.bat_style_title,player.player_category_title,player.player_role_title,player.player_country_title,player.player_teams,player.player_teams_small,player.Status,player.phonenumber,player.playerId],
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
DBUtils.deletePlayer = function(player,retFun){
	window.dbObject.transaction(
			function(tx) {
				var respObj = {};
				respObj.status = "failed";
				var query = 'delete from players where player_id = ?';
				tx.executeSql(query,[player.playerId],
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
				tx.executeSql("SELECT * FROM players", [], function(tx, res) {
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
                 var sql    = 'INSERT INTO players(player_id,player_name,player_logo,bowl_style_id,bat_style_id,player_cat,playing_role,player_country_id,description,dob,status,bat_style_title,bowl_style_title,player_country_title,player_category_title,player_role_title,player_teams,player_teams_small,status,phonenumber)  VALUES';
                    for(var i = 0; i < data.length; i++){
                      sql      = sql + '("'+data[i].player_id+'","'+data[i].player_name+'","'+data[i].player_logo+'","'+data[i].bowl_style_id+'","'+data[i].bat_style_id+'","'+data[i].player_cat+'","'+data[i].playing_role+'","'+data[i].player_country_id+'","'+data[i].description+'","'+data[i].dob+'","'+data[i].player_status+'","'+data[i].bat_style_title+'","'+data[i].bowl_style_title+'","'+data[i].player_country_title+'","'+data[i].player_category_title+'","'+data[i].player_role_title+'","'+data[i].player_teams+'","'+data[i].player_teams_small+'","'+data[i].Status+'","'+data[i].phonenumber+'")';
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
				var query = 'INSERT INTO videos(video_id,video_title,video_description,video_type,video_type_id,video_logo,thumbnail,shortname,duration,createdOn,updatedOn) VALUES(?,?,?,?,?,?,?,?,?,?,?) ';
				tx.executeSql(query,[videos.videoId,videos.videoTitle,videos.videoDescription,videos.videoType,videos.videoTypeId,videos.PicPath,videos.thumbnail,videos.shortname,videos.duration,videos.createdOn,videos.updatedOn],
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
				var query = 'update videos set video_title= ?,video_description= ?,video_type= ?,video_type_id= ?,video_logo=?,thumbnail=?,shortname=?,duration=?,createdOn=?,updatedOn=? where video_id = ?';
				tx.executeSql(query,[videos.videoTitle,videos.videoDescription,videos.videoType,videos.videoTypeId,videos.PicPath,videos.thumbnail,videos.shortname,videos.duration,videos.createdOn,videos.updatedOn,videos.videoId],
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
				 var sql    = 'INSERT INTO videos(video_id,video_title,video_description,video_type,video_type_id,video_logo,thumbnail,shortname,duration,createdOn,updatedOn) VALUES';
				    for(var i = 0; i < data.length; i++){
				      sql      = sql + '("'+data[i].video_id+'","'+data[i].video_title+'","'+data[i].video_description+'","'+data[i].video_type+'","'+data[i].video_type_id+'","'+data[i].video_path+'","'+data[i].thumbnail+'","'+data[i].shortname+'","'+data[i].duration+'","'+data[i].createdOn+'","'+data[i].updatedOn+'")';
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