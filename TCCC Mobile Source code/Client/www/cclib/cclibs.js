var CCLIB = new Object();
CCLIB.CRICKET_ADMIN = new Object();


CCLIB.CRICKET_ADMIN.getVideos = function(myFunction) {
	DBUtils.getVideos(function(resp1){
		myFunction(resp1);
		//console.log(":::::::::::::::::::::::::::::::..............")
		/*console.log(resp1)
		if(resp1.status=="success"){
			//tournamentHasPlayer.tThdId = resp1.data.t_thp_id;
			DBUtils.getCountry(function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
		}else{
			myFunction(resp1);
		}*/
	
	});
}



CCLIB.CRICKET_ADMIN.getPictures = function(myFunction) {
	DBUtils.getPictures(function(resp1){
		myFunction(resp1);
		
	
	});
}

/*CCLIB.CRICKET_ADMIN.getVideos = function(myFunction) {
	APIUtils.getVideos(function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}
*/













/*CCLIB.CRICKET_ADMIN.getPictures = function(myFunction) {
	APIUtils.getPictures(function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}*/










CCLIB.CRICKET_ADMIN.getVenues = function(myFunction) {
	DBUtils.getVenues(function(resp1){
		myFunction(resp1);
		
	
	});
}

/*CCLIB.CRICKET_ADMIN.getVenues = function(myFunction) {
	APIUtils.getVenues(function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}
*/







DBUtils.autoSyncFunctions = {};


DBUtils.autoSyncFunctions.countries = function(){
	APIUtils.getCountry(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllCountries(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiCountry(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var country = list[i];
				country.id=country.id;
				country.iso=country.iso;
				country.name=country.name;
				country.nicename=country.nicename;
				country.iso3=country.iso3;
				country.numcode=country.numcode;
				country.phonecode =country.phonecode; 
				country.flagPath =country.flagPath; 
				country.status= country.status;
				DBUtils.createCountry(country,function(resp){
					// console.log(JSON.stringify(resp))
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.countries,50000)
}


DBUtils.autoSyncFunctions.tournaments = function(){
	APIUtils.getTournaments(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllTournaments(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		DBUtils.createMultiTournament(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var tournament = list[i];
				tournament.pointsTable = tournament.points_table;
				tournament.tournamentId = tournament.tournament_id;
				tournament.name = tournament.tournament_name;
				tournament.shortName = tournament.short_name;
				tournament.logo = tournament.tournament_logo;
				tournament.cat = tournament.tour_cat;
				tournament.startDate = tournament.start_date;
				tournament.endDate = tournament.end_date;
				tournament.categoryId= tournament.category_id;
				tournament.categoryTitle=tournament.category_title;
				DBUtils.createTournament(tournament,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateTournament(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.tournaments,30000)
}
DBUtils.autoSyncFunctions.teams = function(){
	APIUtils.getTeams(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllTeams(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		DBUtils.createMultiTeam(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				//type=create&team_name=&team_logo=&team_small_name=&team_color1=&team_color2=&team_color3=
				team.teamId = team.team_id;
				team.name = team.team_name;
				team.smallName = team.team_small_name;
				team.logo = team.team_logo;
				team.catId = team.team_cat;
				team.description = team.description;
				team.status=team.status;
				team.categoryTitle=team.team_category_title;
				DBUtils.createTeam(team,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateTeam(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.teams,30000)
}


DBUtils.autoSyncFunctions.matchTypes = function(){
	APIUtils.getMatchTypes(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllMatchTypes(function(resp0){
			// console.log(JSON.stringify(resp0))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiMatchType(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				//type=update&match_type_id=&match_type_title
				team.matchTypeId = team.match_type_id;
				team.title = team.match_type_title;
				DBUtils.createMatchType(team,function(resp1){
					// console.log(JSON.stringify(resp1))
					if(resp.status=="failed"){
						DBUtils.updateMatchType(resp.data,function(resp2){
							console.log(JSON.stringify(resp2))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.matchTypes,30000)
}

DBUtils.autoSyncFunctions.bowlingStyles = function(){
	//type=update&bowl_style_id=&bowl_style_title
	APIUtils.getBowlingStyles(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllBowlStyles(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiBowlingStyle(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				team.bowlStyleId = team.bowl_style_id;
				team.title = team.bowl_style_title;
				DBUtils.createBowlStyle(team,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateBowlStyle(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.bowlingStyles,30000)
}
DBUtils.autoSyncFunctions.battingStyles = function(){
	//type=update&bat_style_id=&bat_style_title
	APIUtils.getBattingStyles(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllBatStyles(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiBattingStyle(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var battingStyle = list[i];
				battingStyle.batStyleId = battingStyle.bat_style_id;
				battingStyle.batStyleTitle = battingStyle.bat_style_title;
				DBUtils.createBatStyle(battingStyle,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateBatStyle(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.battingStyles,30000)
}
DBUtils.autoSyncFunctions.playerRoles = function(){
	//type=update&player_role_id=&player_role_title
	APIUtils.getPlayerRoles(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllPlayerRoles(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPlayerRole(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				team.playerRoleId = team.player_role_id;
				team.title = team.player_role_title;
				DBUtils.createPlayerRole(team,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updatePlayerRole(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.playerRoles,30000)
}
DBUtils.autoSyncFunctions.umpires = function(){
	//type=update&umpire_id=&umpire_name=&umpire_country_name=
	APIUtils.getUmpires(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllUmpires(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiUmpire(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var umpire = list[i];
				umpire.umpireId = umpire.umpire_id;
				umpire.umpireName = umpire.umpire_name;
				umpire.umpireCountryId = umpire.umpire_country;
				umpire.umpireLogo=umpire.umpire_logo;
				umpire.teamLogo=umpire.team_logo;
				umpire.dob=umpire.umpire_dob
				DBUtils.createUmpire(umpire,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateUmpire(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.umpires,30000)
}
DBUtils.autoSyncFunctions.tournamentHasTeam = function(){
	var tournamentHasTeamObj = {};
	APIUtils.getTournamentHasTeam(tournamentHasTeamObj,function(resp){
		if(resp.status=="success"){
		// console.log(resp)
		DBUtils.deleteAllTournamentHasTeam(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiTournamentTeam(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var tournamentHasTeam = list[i];
				tournamentHasTeam.tournamentId = tournamentHasTeam.tournament_id;
				tournamentHasTeam.teamId = tournamentHasTeam.team_id;
				
				DBUtils.createTournamentHasTeam(tournamentHasTeam,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updatetournamentHasTeam(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.tournamentHasTeam,30000)
}


DBUtils.autoSyncFunctions.tournamentHasPlayer = function(){
    var tournamentHasPlayerObj = {};
    APIUtils.getTournamentHasPlayer(tournamentHasPlayerObj,function(resp){
    	if(resp.status=="success"){
        DBUtils.deleteAllTournamentHasPlayers(function(resp){
             // console.log(JSON.stringify(resp))
        });
        var list = resp.data.list;
        
        DBUtils.createMultiTHP(list,function(resp){
            // console.log(JSON.stringify(resp))
            
        });
    	}
        /*if(list)
            for(var i=0;i<list.length;i++){
                var tournamentHasPlayer = list[i];
                tournamentHasPlayer.tThpId = tournamentHasPlayer.t_thp_id
                tournamentHasPlayer.tournamentId = tournamentHasPlayer.tournament_id;
                tournamentHasPlayer.teamId = tournamentHasPlayer.team_id;
                tournamentHasPlayer.playerId = tournamentHasPlayer.player_id;
                tournamentHasPlayer.Odi = tournamentHasPlayer.odi;
                tournamentHasPlayer.Test = tournamentHasPlayer.test;
                tournamentHasPlayer.T20 = tournamentHasPlayer.t20;
                DBUtils.createTournamentHasPlayer(tournamentHasPlayer,function(resp){
                    // console.log(JSON.stringify(resp))
                    if(resp.status=="failed"){
                        DBUtils.updateTournamentHasPlayer(resp.data,function(resp1){
                            // console.log(JSON.stringify(resp1))
                        })
                    }
                });
            }*/
    });
    setTimeout(DBUtils.autoSyncFunctions.tournamentHasPlayer,30000)
}


DBUtils.autoSyncFunctions.category = function(){
	APIUtils.getCategory(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllCategory(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiCategory(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var category = list[i];
				category.categoryName = category.category_title;
				category.catId = category.category_id;
				
				DBUtils.createCategory(category,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateCategory(category,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.category,30000)
}


DBUtils.autoSyncFunctions.players = function(){
	//type=update&player_id=&player_name=&player_country_name=
	APIUtils.getPlayers(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllPlayer(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPlayer(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var player = list[i];
				player.playerId=player.player_id;
				player.playerName=player.player_name;
				player.playerCountryId=player.player_country_id;
				player.playerLogo=player.player_logo;
				player.dob=player.dob;
				player.bowlStyleId=player.bowl_style_id;
				player.batStyleId=player.bat_style_id;
				player.cat=player.player_cat ;
				player.role=player.playing_role;	
				player.description=player.description;
				player.player_status=player.player_status;
				player.batStyleTitle=player.bat_style_title;
				player.bowlStyletitle=player.bowl_style_title;
				player.playerCountrytitle=player.player_country_title;
				player.playerCategorytitle=player.player_category_title;
				player.playerRoletitle=player.player_role_title;
				player.playerTeams=player.player_teams;
				player.playerSearchname=player.player_search_name;
				player.player_teams_small=player.player_teams_small;
				DBUtils.createPlayer(player,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updatePlayer(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.players,30000)
}


DBUtils.autoSyncFunctions.match = function(){
	APIUtils.getClientResults(null,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteAllResultMatch(function(resp){
			});
			var list = resp.data.list;
			DBUtils.createMultiMatch(list,function(resp){
			});
		}

	});
	APIUtils.getClientFixtures(null,function(resp){
		if(resp.status=="success"){
			var list = resp.data.list;
			DBUtils.deleteAllFixturesMatch(function(resp){
			});
			DBUtils.createMultiFixtures(list,function(resp){
			});
		}
	});    

	setTimeout(DBUtils.autoSyncFunctions.match,10000)
}




DBUtils.autoSyncFunctions.matchHasTeam = function(){
	//matchHasTeam
	var matchHasTeam = {};
	APIUtils.getMatchHasTeam(matchHasTeam,function(resp){
		if(resp && resp.status=="failed")
			return;
		DBUtils.deleteAllMatchHasTeam(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiMatchTeam(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		
		/*if(list)
			for(var i=0;i<list.length;i++){
				var matchHasTeam = list[i];
				
				matchHasTeam.matchId = matchHasTeam.match_id;
				matchHasTeam.teamId = matchHasTeam.team_id;
				matchHasTeam.batSeq = matchHasTeam.bat_seq;
				matchHasTeam.Inngs = matchHasTeam.inngs;
				matchHasTeam.Score = matchHasTeam.score;
				matchHasTeam.Wickets = matchHasTeam.wickets;
				matchHasTeam.Result = matchHasTeam.result;
				matchHasTeam.Overs = matchHasTeam.overs;
				matchHasTeam.Bys = matchHasTeam.bys;
				matchHasTeam.legBys = matchHasTeam.leg_bys;
				matchHasTeam.Wide = matchHasTeam.wide;
				matchHasTeam.noBalls = matchHasTeam.noballs;
				matchHasTeam.fallofWicket = matchHasTeam.fall_of_wicket;
				matchHasTeam.maxOvers = matchHasTeam.maxOvers;
				matchHasTeam.Fours = matchHasTeam.fours;
				matchHasTeam.Sixes = matchHasTeam.sixes;
				DBUtils.createMatchHasTeam(matchHasTeam,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateScoreMatchHasTeam(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.matchHasTeam,30000)
}

DBUtils.autoSyncFunctions.teamHasPlayer = function(){
    //teamhasplayer
    APIUtils.getTeamHasPlayer(null,function(resp1){
    	if(resp1.status=="success"){
        // console.log(resp1)
        DBUtils.deleteAllTeamHasPlayers(function(resp){
        
            // con// // console.log(JSON.stringify(resp1))    });
        })
        var list = resp1.data.list;
        
        DBUtils.createMultiTeamHasPlayers(list,function(resp){
            
            // con// // console.log(JSON.stringify(resp1))    });
        });
    	}
        /*for(var i=0;i<list.length;i++){
            var obj = list[i];
            obj.teamId = obj.team_id;
            obj.playerId = obj.player_id;
            obj.thpId = obj.thp_id;
            DBUtils.deleteTeamHasPlayer(obj,function(resp1){
                DBUtils.createTeamHasPlayer(obj,function(resp){
                });
            })
            DBUtils.createTeamHasPlayer(obj,function(resp){
                // console.log(JSON.stringify(resp))
            });
        }*/
    })
    
    setTimeout(DBUtils.autoSyncFunctions.teamHasPlayer,30000)
}


DBUtils.autoSyncFunctions.venue = function(){
	APIUtils.getVenue(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllVenue(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiVenue(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var venue = list[i];
				venue.venueId = venue.venue_id;
				venue.venueTitle = venue.venue_title;
				venue.venueGeoLat = venue.geoLat ;
				venue.venueGeoLang = venue.geoLang;
				venue.venueDescription = venue.venue_description;
				venue.venuelocation = venue.venue_location;
				venue.countryId = venue.country_id;
				venue.countryTitle = venue.country_title;
				DBUtils.createVenue(venue,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateVenue(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.venue,30000)
}
DBUtils.autoSyncFunctions.pictures = function(){
	APIUtils.getPictures(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllPictures(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPicture(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var pictures = list[i];
				pictures.pictureId = pictures.picture_id;
				pictures.pictureTitle = pictures.picture_title;
				pictures.pictureDescription =pictures.picture_description;
				pictures.pictureType=pictures.picture_type;
				pictures.pictureTypeId=pictures.picture_type_id;
				pictures.createdOn=pictures.createdOn;
				//pic_path
				if(pictures.pic_path)
					pictures.PicPath=pictures.pic_path;
				else if(pictures.picture_logo)
					pictures.PicPath=pictures.picture_logo;
				DBUtils.createPictures(pictures,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updatePictures(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.pictures,30000)
}



DBUtils.autoSyncFunctions.matchHasPlayer = function(){
	APIUtils.getMatchHasPlayer(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllMatchHasPlayer(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiMatchPlayer(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var matchHasPlayer = list[i];
				matchHasPlayer.matchId = matchHasPlayer.match_id;
				matchHasPlayer.teamId = matchHasPlayer.team_id;
				matchHasPlayer.playerId =matchHasPlayer.player_id;
				matchHasPlayer.Inngs=matchHasPlayer.inngs;
				matchHasPlayer.batSeq=matchHasPlayer.bat_seq;
				matchHasPlayer.bowlSeq = matchHasPlayer.bowl_seq;
				matchHasPlayer.Score = matchHasPlayer.score;
				matchHasPlayer.Balls =matchHasPlayer.balls;
				matchHasPlayer.outStr=matchHasPlayer.out_str;
				matchHasPlayer.Fours=matchHasPlayer.fours;
				matchHasPlayer.Sixes = matchHasPlayer.sixes;
				matchHasPlayer.Overs = matchHasPlayer.overs;
				matchHasPlayer.Madin =matchHasPlayer.madin;
				matchHasPlayer.bRuns=matchHasPlayer.b_runs;
				matchHasPlayer.Wicks=matchHasPlayer.wicks;
				matchHasPlayer.Wides = matchHasPlayer.wides;
				matchHasPlayer.Nobals = matchHasPlayer.nobals;
				matchHasPlayer.thisoverRuns =matchHasPlayer.this_over_runs;
				matchHasPlayer.bSixes=matchHasPlayer.b_sixes;
				matchHasPlayer.bFours=matchHasPlayer.b_fours;
				matchHasPlayer.CandB = matchHasPlayer.candb;
				matchHasPlayer.fCatches = matchHasPlayer.f_catches;
				matchHasPlayer.fIR =matchHasPlayer.f_IR;
				matchHasPlayer.wKeeper=matchHasPlayer.w_keeper;
				matchHasPlayer.fDR=matchHasPlayer.f_DR;
				matchHasPlayer.keeperStumps =matchHasPlayer.keeper_stumps;
				matchHasPlayer.Captain=matchHasPlayer.captain;
				DBUtils.createMatchHasPlayer(matchHasPlayer,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateMatchHasPlayer(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.matchHasPlayer,30000)
}


DBUtils.autoSyncFunctions.videos = function(){
	APIUtils.getVideos(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllVideos(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		DBUtils.createMultiVideos(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
	/*	if(list)
			for(var i=0;i<list.length;i++){
				var videos = list[i];
				videos.videoId = videos.video_id;
				videos.videoTitle = videos.video_title;
				videos.videoDescription =videos.video_description;
				videos.videoType=videos.video_type;
				videos.videoTypeId=videos.video_type_id;
				videos.PicPath=videos.video_path;
				videos.createdOn=videos.createdOn;
				videos.thumbnail=videos.thumbnail;
				DBUtils.createVideos(videos,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateVideos(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.videos,30000)
}


DBUtils.autoSyncFunctions.points = function(){
	APIUtils.getListPointsConfiguration(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllPoints(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPoint(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var points = list[i];
				points.pcName =points.pc_name;
				points.tournamentId = points.tournament_id;
				points.points =points.points;
				points.pcId=points.pc_id;
				DBUtils.createPointsconfig(points,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updatePointsconfig(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.points,30000)
}


DBUtils.autoSyncFunctions.users = function(){
	//userName,user.roleName,user.emailId,user.password,user.socialId,user.updateId,user.deviceType,user.uId],	
	APIUtils.getUserList(function(resp){
		if(resp.status=="success"){
		DBUtils.deleteAllUser(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiUser(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		}
		/*if(list)
			for(var i=0;i<list.length;i++){
				var user = list[i];
				user.uId =user.uId;
				user.userName =user.username ;
				user.roleName =user.role_name ;
				user.emailId=user.emailId ;
				user.password =user.password ;
				user.socialId= user.socialId;
				user.uDeviceId=user.uDId;
				user.deviceType=user.deviceType;
				user.teamId =user.team_id;
				user.status =user.ustatus;
				DBUtils.createUser(user,function(resp){
					// console.log(JSON.stringify(resp))
					if(resp.status=="failed"){
						DBUtils.updateUser(resp.data,function(resp1){
							// console.log(JSON.stringify(resp1))
						})
					}
				});
			}*/
	});
	setTimeout(DBUtils.autoSyncFunctions.users,30000)
}

// Client Team Squad
DBUtils.autoSyncFunctions.teamplayers = function(){
            APIUtils.getTeamPlayers(null,function(resp){
            	if(resp.status=="success"){
            		DBUtils.deleteAllTeamPlayers(function(resp){
            			// console.log(JSON.stringify(resp))
            		});
            		var list = resp.data.list;
            		DBUtils.createMultiTeamPlayers(list,function(resp){
            			// console.log(JSON.stringify(resp))
            		});
            	}
                /*DBUtils.deleteAllClientPoints(function(resp){
                });*/
            /*    if(list)
                    for(var i=0;i<list.length;i++){
                        var teamplayers = list[i];
                        teamplayers.playerId =teamplayers.player_id;
                        teamplayers.teamId = teamplayers.team_id;
                        teamplayers.tournamentId =teamplayers.tournament_id;
                        teamplayers.odi=teamplayers.odi;
                        teamplayers.test=teamplayers.test;
                        teamplayers.t20=teamplayers.t20;
                        teamplayers.bowlstyleId=teamplayers.bowl_style_id;
                        teamplayers.batstyleId=teamplayers.bat_style_id;
                        teamplayers.playername=teamplayers.player_name;
                        teamplayers.playerlogo=teamplayers.player_logo;
                        teamplayers.playerstatus=teamplayers.player_status;
                        teamplayers.playersearchname=teamplayers.player_search_name;
                        teamplayers.playercountryid=teamplayers.player_country_id;
                        teamplayers.playercat=teamplayers.player_cat;
                        teamplayers.playerrole=teamplayers.playing_role;
                        teamplayers.description=teamplayers.description;
                        teamplayers.dob=teamplayers.dob;
                        DBUtils.createTeamPlayers(teamplayers,function(resp){
                            // console.log(JSON.stringify(resp))
                            if(resp.status=="failed"){
                                DBUtils.updatePointsconfig(resp.data,function(resp1){
                                })
                            }
                        });
                    }*/
           
       
    });
    setTimeout(DBUtils.autoSyncFunctions.teamplayers,6000)
    
}


// Client Points
DBUtils.autoSyncFunctions.clientpoints = function(){
			APIUtils.getClientListPoints(null,function(resp){
				if(resp.status=="success"){
					DBUtils.deleteClientPointsByTournament(function(resp){
					});
					var list = resp.data.list;
					/*DBUtils.deleteAllClientPoints(function(resp){
				});*/
					//console.log(JSON.stringify(list))
					DBUtils.createMultiCientpoint(list,function(resp){
						// console.log(JSON.stringify(resp))
					});
				}
				/*if(list)
					for(var i=0;i<list.length;i++){
						var points = list[i];
						points.played =points.played;
						points.tournamentId = points.tournament_id;
						points.won =points.won;
						points.lost=points.Lost;
						points.tied=points.tied;
						points.nr=points.nr;
						points.points=points.points;
						points.runrate=points.runrate;
						points.tht_id=points.tht_id;
						points.team_id=points.team_id;
						points.team_name=points.team_name;
						points.team_logo=points.team_logo;
						points.team_small_name=points.team_small_name;
						points.team_cat=points.team_cat;
						points.description=points.description;
						points.status=points.status;
						DBUtils.createClientPoints(points,function(resp){
							// console.log(JSON.stringify(resp))
							if(resp.status=="failed"){
								DBUtils.updatePointsconfig(resp.data,function(resp1){
								})
							}
						});
					}*/
	
	});
	setTimeout(DBUtils.autoSyncFunctions.clientpoints,6000)
	
}






function autoSyncTables(){
	sysncLines();
	//setTimeout(sysncLines,45000);
}
function sysncLines(){
	
	 DBUtils.autoSyncFunctions.countries();
	 DBUtils.autoSyncFunctions.tournaments();
	 DBUtils.autoSyncFunctions.teams();
	 DBUtils.autoSyncFunctions.matchTypes();
	 DBUtils.autoSyncFunctions.bowlingStyles();
	 DBUtils.autoSyncFunctions.battingStyles();
	 DBUtils.autoSyncFunctions.playerRoles();
	 DBUtils.autoSyncFunctions.umpires();
	 DBUtils.autoSyncFunctions.tournamentHasTeam();
	 DBUtils.autoSyncFunctions.tournamentHasPlayer();
	 DBUtils.autoSyncFunctions.category();
	 DBUtils.autoSyncFunctions.players();
	 DBUtils.autoSyncFunctions.match();
	 DBUtils.autoSyncFunctions.matchHasTeam();
	 DBUtils.autoSyncFunctions.teamHasPlayer();
	 DBUtils.autoSyncFunctions.venue();
	 DBUtils.autoSyncFunctions.pictures();
	 DBUtils.autoSyncFunctions.matchHasPlayer();
	 DBUtils.autoSyncFunctions.videos();
	 DBUtils.autoSyncFunctions.points();
	 DBUtils.autoSyncFunctions.users();
	 DBUtils.autoSyncFunctions.teamplayers();
	 DBUtils.autoSyncFunctions.clientpoints();


	 if(cordova){
			getAppVersion(function (version) {
				var appVerson = localStorage.getItem("appVersion");
				if(!appVerson || version!=appVerson){
					setTimeout(function(){
						localStorage.setItem("appVersion",version);
						var event = new CustomEvent("oncclibready", { "message": "CCLIB is ready" });
						document.dispatchEvent(event);
					},6000);
					
				}
			})
	}
}


// Client Home Videos
CCLIB.CRICKET_ADMIN.getHomeVideos = function(videos,myFunction) {
	DBUtils.getHomeVideos(videos,function(resp){
		console.log(JSON.stringify(resp))
		
		myFunction(resp);
	});
}


// Client Fixtures
CCLIB.CRICKET_ADMIN.getFixturesBytournamentId = function(matches,myFunction) {
	DBUtils.getFixturesBytournamentId(matches,function(resp){
		 console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}


//Client Result
CCLIB.CRICKET_ADMIN.getResultsBytournamentId = function(matches,myFunction) {
	DBUtils.getFixturesBytournamentId(matches,function(resp){
		 console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Venue
CCLIB.CRICKET_ADMIN.getVenuesByTournamentId = function(venues,myFunction) {
	DBUtils.getVenuesByTournamentId(venues,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Points
CCLIB.CRICKET_ADMIN.getPointsByTournId = function(points,myFunction) {
	DBUtils.getPointByTournId(points,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Team
CCLIB.CRICKET_ADMIN.getTeamsByTourId = function(teams,myFunction) {
	DBUtils.getTeamsByTourId(teams,function(resp){
		//// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Team Videos
CCLIB.CRICKET_ADMIN.getTeamsVideosTeamId = function(teamsVideos,myFunction) {
	DBUtils.getTeamsVideosTeamId(teamsVideos,function(resp){
		//// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}


// Client Team Pictures
CCLIB.CRICKET_ADMIN.getTeamsPicturesTeamId = function(teamsPictures,myFunction) {
	DBUtils.getTeamsPicturesTeamId(teamsPictures,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Team Squad
CCLIB.CRICKET_ADMIN.getTeamPlayersByTeamId = function(teamPlayers,myFunction) {
	DBUtils.getTeamPlayersByTeamId(teamPlayers,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Player Details
CCLIB.CRICKET_ADMIN.getPlayersByPlayerId = function(players,myFunction) {
	DBUtils.getPlayersByPlayerId(players,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Player Videos
CCLIB.CRICKET_ADMIN.getplayersVideosPlayerId = function(playersVideos,myFunction) {
	DBUtils.getPlayersVideosplayerId(playersVideos,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Videos Latest
CCLIB.CRICKET_ADMIN.getVideosByVideoType = function(videos,myFunction) {
	DBUtils.getVideosByVideoType(videos,function(resp){
		// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Videos Most Watched
CCLIB.CRICKET_ADMIN.getVideosByMostWatched = function(videos,myFunction) {
	DBUtils.getVideosByMostWatched(videos,function(resp){
		//// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Videos Heighlights
CCLIB.CRICKET_ADMIN.getVideosByHighlights = function(videos,myFunction) {
	DBUtils.getVideosByHighlights(videos,function(resp){
		//// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// Client Pictures Related to Event
CCLIB.CRICKET_ADMIN.getPicturesByPictureType = function(pictures,myFunction) {
	DBUtils.getPicturesByPictureType(pictures,function(resp){
		//// console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

//Client Retrieve Tournament
CCLIB.CRICKET_ADMIN.retrieveTournaments = function(reFun){
	DBUtils.retrieveTournaments(function(resp){
		reFun(resp);
		//console.log(resp)
	});
}


//Client MatchByTeamID
CCLIB.CRICKET_ADMIN.getmatchbyteamId = function(match,reFun){
	DBUtils.getmatchbyteamId(match,function(resp){
		console.log(JSON.stringify(resp))
		reFun(resp);
		//console.log(resp)
	});
}

//Client Team videos list based on tounament id
CCLIB.CRICKET_ADMIN.getTeamVideosByTournament = function(tournamentId,myFunction) {
	DBUtils.getTeamVideosByTournament(tournamentId,function(resp1){
		console.log(resp1)
		myFunction(resp1);
	
	});
}


//Client Player videos list based on tournament id
CCLIB.CRICKET_ADMIN.getPlayerVideosByTournament = function(tournamentId,myFunction) {
	DBUtils.getPlayerVideosByTournament(tournamentId,function(resp1){
		console.log(resp1)
		myFunction(resp1);
	
	});
}



//Client Team pictures list based on tounament id
CCLIB.CRICKET_ADMIN.getTeamPicturesByTournament = function(tournamentId,myFunction) {
	DBUtils.getTeamPicturesByTournament(tournamentId,function(resp1){
		console.log(resp1)
		myFunction(resp1);
	
	});
}


//Client Player pictures list based on tournament id
CCLIB.CRICKET_ADMIN.getPlayerPicturesByTournament = function(tournamentId,myFunction) {
DBUtils.getPlayerPicturesByTournament(tournamentId,function(resp1){
		console.log(resp1)
		myFunction(resp1);
	
	});
}


