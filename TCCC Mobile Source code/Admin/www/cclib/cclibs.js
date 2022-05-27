var CCLIB = new Object();
CCLIB.CRICKET_ADMIN = new Object();

/*
 * Create tournament....
 */

CCLIB.CRICKET_ADMIN.createTournament = function(tournament,reFun){
	APIUtils.createTournament(tournament,function(resp1){
		//console.log("..............")
		//console.log(resp1)
		if(resp1.status=="success"){
			tournament.tournamentId = resp1.data.tournament_id;
			DBUtils.createTournament(tournament,function(resp2){
				if(resp2.status=="success")
					reFun(resp1);
				else
					reFun(resp2);
			});
			DBUtils.autoSyncFunctions.tournaments();
		}else{
			reFun(resp1);
		}
	});
}
/*
 * Ex:
 */
CCLIB.CRICKET_ADMIN.updateTournament = function(tournament,reFun){
	//alert(JSON.stringify(tournament))
	APIUtils.updateTournament(tournament,function(resp1){
		if(resp1.status=="success"){
			DBUtils.updateTournament(tournament,function(resp2){
				if(resp2.status=="success")
					reFun(resp1);
				else
					reFun(resp2);
			});
			DBUtils.autoSyncFunctions.tournaments();
		}else{
			reFun(resp1);
		}
	});
}


/*
 * Select all tournments
 */

CCLIB.CRICKET_ADMIN.retrieveTournaments = function(reFun){
	DBUtils.retrieveTournaments(function(resp){
		reFun(resp);
		//console.log(resp)
	});
}

CCLIB.CRICKET_ADMIN.deleteTournament = function(tournamentId,reFun){
	APIUtils.deleteTournament(tournamentId,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteTournament(tournamentId,function(resp1){
				reFun(resp1);
			});
			DBUtils.autoSyncFunctions.tournaments();
		}
	});
}

CCLIB.CRICKET_ADMIN.getTournaments = function(tournament,reFun){
	DBUtils.getTournamentList(tournament,function(resp){
		console.log(resp)
	reFun(resp);
	console.log(resp)
	});
	}

//Teams....

/*
 * Create team....
 */

CCLIB.CRICKET_ADMIN.createTeam = function(team,reFun){
	APIUtils.createTeam(team,function(resp1){
		if(resp1.status=="success"){
			team.teamId = resp1.data.team_id;
			DBUtils.createTeam(team,function(resp2){
				if(resp2.status=="success")
					reFun(resp1);
				else
					reFun(resp2);
			});
			DBUtils.autoSyncFunctions.teams();
		}else{
			reFun(resp1);
		}
	});
}


CCLIB.CRICKET_ADMIN.updateTeam = function(team,reFun){
	APIUtils.updateTeam(team,function(resp1){
		if(resp1.status=="success"){
			DBUtils.updateTeam(team,function(resp2){
				if(resp2.status=="success")
					reFun(resp1);
				else
					reFun(resp2);
			});
			DBUtils.autoSyncFunctions.teams();
		}else{
			reFun(resp1);
		}
	});
}

/*
 * Select all tournments
 */

CCLIB.CRICKET_ADMIN.retrieveTeams = function(reFun){
	DBUtils.retrieveTeams(function(resp){
		reFun(resp);
	})
	/*DBUtils.retrieveTeams(function(resp){
		reFun(resp);
	});*/
}

CCLIB.CRICKET_ADMIN.deleteTeam = function(teamId,reFun){
	
	APIUtils.deleteTeam(teamId,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteTeam(teamId,function(resp1){
				reFun(resp1);
			});
			DBUtils.autoSyncFunctions.teams();
		}
	});
}

CCLIB.CRICKET_ADMIN.retrieveTeams = function(reFun){
	DBUtils.retrieveTeams(function(resp){
		reFun(resp);
		//console.log(resp)
	});
}

//matchTypeId,title
CCLIB.CRICKET_ADMIN.createMatchType = function(matchType,myFunction) {
	/*APIUtils.createMatchType(matchType,function(resp){
		myFunction(resp);
	});*/
	APIUtils.createMatchType(matchType,function(resp1){
		if(resp1.status=="success"){
			matchType.matchTypeId = resp1.data.match_type_id;
			DBUtils.createMatchType(matchType,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.matchTypes();
		}else{
			myFunction(resp1);
		}
	});
};

CCLIB.CRICKET_ADMIN.updateMatchType = function(matchType,myFunction) {
	APIUtils.updateMatchType(matchType,function(resp){
		if(resp.status=="success"){
			DBUtils.updateMatchType(matchType,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.matchTypes();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteMatchType = function(matchType,myFunction) {
	
	APIUtils.deleteMatchType(matchType,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteMatchType(matchType,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.matchTypes();
		}
	});
}

CCLIB.CRICKET_ADMIN.getMatchTypes = function(myFunction) {
	DBUtils.getMatchTypes(function(resp){
		myFunction(resp);
	});
}



//bowlStyleId, title
CCLIB.CRICKET_ADMIN.createBowlingStyle = function(bowlingStyle,myFunction) {
	APIUtils.createBowlingStyle(bowlingStyle,function(resp1){
		if(resp1.status=="success"){
			bowlingStyle.bowlStyleId = resp1.data.bowl_style_id;
			DBUtils.createBowlStyle(bowlingStyle,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.bowlingStyles();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateBowlingStyle = function(bowlingStyle,myFunction) {
	APIUtils.updateBowlingStyle(bowlingStyle,function(resp){
		if(resp.status=="success"){
			DBUtils.updateBowlingStyle(bowlingStyle,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.bowlingStyles();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteBowlingStyle = function(bowlingStyle,myFunction) {
	
	APIUtils.deleteBowlingStyle(bowlingStyle,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteBowlStyle(bowlingStyle,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.bowlingStyles();
		}
	});
	
	/*APIUtils.deleteBowlingStyle(bowlingStyleId,function(resp){
		myFunction(resp);
	});*/
}

CCLIB.CRICKET_ADMIN.getBowlingStyles = function(myFunction) {
	DBUtils.getBowlStyles(function(resp){
		myFunction(resp);
	});
}



//batStyleId, title
CCLIB.CRICKET_ADMIN.createBattingStyle = function(battingStyle,myFunction) {
	APIUtils.createBattingStyle(battingStyle,function(resp1){
		//myFunction(resp);
		//console.log("..............")
		if(resp1.status=="success"){
			battingStyle.batStyleId = resp1.data.bat_style_id;
			DBUtils.createBatStyle(battingStyle,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.battingStyles();
		}else{
			myFunction(resp1);
		}
	});
}


CCLIB.CRICKET_ADMIN.updateBattingStyle = function(battingStyle,myFunction) {
	APIUtils.updateBattingStyle(battingStyle,function(resp1){
		//myFunction(resp);
		//console.log("..............")
		//console.log(resp1)
		if(resp1.status=="success"){
			DBUtils.updateBatStyle (battingStyle,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.battingStyles();
		}else{
			myFunction(resp1);
		}
	
	
	});
}

CCLIB.CRICKET_ADMIN.deleteBattingStyle = function(battingStyle,myFunction) {
	
	
	APIUtils.deleteBattingStyle(battingStyle,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteBatStyle(battingStyle,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.battingStyles();
		}
	});
	
	
	/*APIUtils.deleteBattingStyle(battingStyleId,function(resp){
		myFunction(resp);
	});*/
}


CCLIB.CRICKET_ADMIN.getBattingStyles = function(myFunction) {
	DBUtils.getBatStyles(function(resp){
		myFunction(resp);
	});
}

//playerRoleId, title
CCLIB.CRICKET_ADMIN.createPlayerRole = function(playerRole,myFunction) {
	APIUtils.createPlayerRole(playerRole,function(resp1){
		//console.log("..............")
		if(resp1.status=="success"){
			playerRole.playerRoleId = resp1.data.player_role_id;
			DBUtils.createPlayerRole (playerRole,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.playerRoles();
		}else{
			myFunction(resp1);
		}
	
	
	
	});
}

CCLIB.CRICKET_ADMIN.updatePlayerRole = function(playerRole,myFunction) {
	APIUtils.updatePlayerRole(playerRole,function(resp){
		if(resp.status=="success"){
			DBUtils.updatePlayerRole(playerRole,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.playerRoles();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deletePlayerRole = function(playerRole,myFunction) {
	APIUtils.deletePlayerRole(playerRole,function(resp){
		if(resp.status=="success"){
			DBUtils.deletePlayerRole(playerRole,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.playerRoles();
		}
	});
	
/*	var playerRoles={};
	playerRoles.playerRoleId=4;

	APIUtils.deletePlayerRole(playerRoleId,function(resp){
		myFunction(resp);
	});*/
}

CCLIB.CRICKET_ADMIN.getPlayerRoles = function(myFunction) {
	DBUtils.getPlayerRoles(function(resp){
		myFunction(resp);
	});
}

//umpireId, name, countryName=
CCLIB.CRICKET_ADMIN.createUmpire = function(umpire,myFunction) {
	APIUtils.createUmpire(umpire,function(resp1){
		//console.log("Umpireeeeeeeeeeeeeeeeeeeeeeeeeeee..............")
		//console.log(resp1)
		if(resp1.status=="success"){
			umpire.umpireId = resp1.data.umpire_id;
			DBUtils.createUmpire(umpire,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.umpires();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateUmpire = function(umpire,myFunction) {
	APIUtils.updateUmpire(umpire,function(resp){
		if(resp.status=="success"){
			DBUtils.updateUmpire(umpire,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.umpires();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteUmpire = function(umpireId,myFunction) {
	APIUtils.deleteUmpire(umpireId,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteUmpire(umpireId,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.umpires();
		}
	});
	
	
	/*APIUtils.deleteUmpire(umpireId,function(resp){
		myFunction(resp);
	});*/
}

CCLIB.CRICKET_ADMIN.getUmpires = function(myFunction) {
	DBUtils.getUmpires(function(resp){
		myFunction(resp);
	});
}

//create TournamentHasTeam


CCLIB.CRICKET_ADMIN.createTournamentHasTeam = function(tournamentHasTeam,myfunction){
	APIUtils.createTournamentHasTeam(tournamentHasTeam,function(resp1){
		//console.log("..............")
			if(resp1.status=="success"){
				//tournamentHasTeam.tournamentId = resp1.data.tournament_id;
			DBUtils.createTournamentHasTeam(tournamentHasTeam,function(resp2){
				if(resp2.status=="success")
					myfunction(resp1);
				else
					myfunction(resp2);
			});
			DBUtils.autoSyncFunctions.tournamentHasTeam();
		}else{
			myfunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.createTournamentHasTeam=function(tournamentHasTeam,myfunction){
	APIUtils.createTournamentHasTeam(tournamentHasTeam,function(resp){
		DBUtils.autoSyncFunctions.tournamentHasTeam();
		myfunction(resp)
	
	});

}

CCLIB.CRICKET_ADMIN.createMultiTournamentHasTeam =function(tournamentHasTeam ,myFunction){
	APIUtils.createMultiTournamentHasTeam(tournamentHasTeam ,function(resp1){
		console.log("Server............."+JSON.stringify(resp1))
		// DBUtils.autoSyncFunctions.tournamentHasTeam();
		if(resp1.status=="success"){
			DBUtils.createMultiTournamentHasTeam(tournamentHasTeam,function(resp2){
				myFunction(resp1);
			});
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteTournamentHasTeam =function(tournamentHasTeam ,myFunction){
	APIUtils.deleteTournamentHasTeam (tournamentHasTeam ,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteTournamentHasTeam(tournamentHasTeam,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.tournamentHasTeam();
		}
	});
	}

CCLIB.CRICKET_ADMIN.getTournamentHasTeam =function(myFunction){
	DBUtils.getTournamentHasTeam (function(resp){
		myFunction(resp)
	});
};


CCLIB.CRICKET_ADMIN.getTournamentHasTeamByTournament =function(tournamentHasTeam ,myFunction){
	DBUtils.getTournamentHasTeamByTournament(tournamentHasTeam  ,function(resp){
		console.log(resp)
		myFunction(resp)
	});
};

//create TeamHasPlayers
CCLIB.CRICKET_ADMIN.createTeamHasPlayer = function(teamHasPlayer,myfunction){
	APIUtils.createTeamHasPlayer(teamHasPlayer,function(resp1){
		//console.log("..............")
		if(resp1.status=="success"){
			teamHasPlayer.thpId = resp1.data.thp_id;
			DBUtils.createTeamHasPlayer(teamHasPlayer,function(resp2){
				if(resp2.status=="success")
					myfunction(resp1);
				else
					myfunction(resp2);
			});
			DBUtils.autoSyncFunctions.teamHasPlayer();
		}else{
			myfunction(resp1);
		}
	});
}


CCLIB.CRICKET_ADMIN.createMultiTeamHasPlayer=function(teamHasPlayer,myFunction){
	APIUtils.createMultiTeamHasPlayer(teamHasPlayer,function(resp1){
		console.log("Server............."+JSON.stringify(resp1))
		// DBUtils.autoSyncFunctions.teamHasPlayer();
		if(resp1.status=="success"){
			DBUtils.createMultiTeamHasPlayer(teamHasPlayer,function(resp2){
				myFunction(resp1);
			});
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteTeamHasPlayer=function(teamHasPlayer,myFunction){
	APIUtils.deleteTeamHasPlayer(teamHasPlayer,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteTeamHasPlayer(teamHasPlayer,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.teamHasPlayer(function(){});
		}
	});
	}

CCLIB.CRICKET_ADMIN.getTeamHasPlayer=function(myFunction){
	/*APIUtils.getTeamHasPlayer(teamHasPlayer,function(resp){
		myFunction(resp)
	});*/
	DBUtils.getTeamHasPlayer(function(resp){
		console.log(resp)
		myFunction(resp)
	});
};

CCLIB.CRICKET_ADMIN.getTeamHasPlayerByTeamId=function(teamHasPlayer,myFunction){
	DBUtils.getTeamHasPlayerByTeamId(teamHasPlayer,function(resp){
		console.log(resp)
		myFunction(resp)
	});
};

//tournamentHasPlayer::tournamentId, teamId, playerId, odi, test, t20
CCLIB.CRICKET_ADMIN.createTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	APIUtils.createTournamentHasPlayer(tournamentHasPlayer,function(resp1){
		console.log(resp1)
		if(resp1.status=="success"){
			tournamentHasPlayer.tThdId = resp1.data.t_thp_id;
			DBUtils.createTournamentHasPlayer(tournamentHasPlayer,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.tournamentHasPlayer();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	APIUtils.updateTournamentHasPlayer(tournamentHasPlayer,function(resp){
		if(resp.status=="success"){
			DBUtils.updateTournamentHasPlayer(tournamentHasPlayer,function(resp1){
				DBUtils.autoSyncFunctions.tournamentHasPlayer(function(){
					myFunction(resp1);
				});
			});
			
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	APIUtils.deleteTournamentHasPlayer(tournamentHasPlayer,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteTournamentHasPlayer(tournamentHasPlayer,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.tournamentHasPlayer(function(){});
		}
	});
	}

CCLIB.CRICKET_ADMIN.getTournamentHasPlayer = function(myFunction) {
	DBUtils.getTournamentHasPlayer(function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.createMultiTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	APIUtils.createMultiTournamentHasPlayer(tournamentHasPlayer,function(resp1){
		console.log("Server............."+JSON.stringify(resp1))
		// DBUtils.autoSyncFunctions.tournamentHasPlayer();
		if(resp1.status=="success"){
			DBUtils.createMultiTournamentHasPlayer(tournamentHasPlayer,function(resp2){
				myFunction(resp1);
			});
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.getByTourTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	APIUtils.getByTourTournamentHasPlayer(tournamentHasPlayer,function(resp){
		console.log()
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.getByTeamTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	DBUtils.getTournamentHasPlayerId(tournamentHasPlayer,function(resp){
		console.log(resp)
		myFunction(resp);
	});
}


//category

CCLIB.CRICKET_ADMIN.createCategory = function(category,myFunction) {
	APIUtils.createCategory(category,function(resp1){
		if(resp1.status=="success"){
			category.catId = resp1.data.category_id;
			DBUtils.createCategory(category,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.category();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateCategory = function(category,myFunction) {
	APIUtils.updateCategory(category,function(resp){
		if(resp.status=="success"){
			DBUtils.updateCategory(category,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.category();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteCategory = function(category,myFunction) {
	APIUtils.deleteCategory(category,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteCategory(category,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.category();
		}
	});
	}

CCLIB.CRICKET_ADMIN.getCategory = function(Category,myFunction) {
	DBUtils.getCategory(function(resp){
	//alert(JSON.stringify(resp));
		myFunction(resp);
	});
	
}//PlayerId, name, countryName=
CCLIB.CRICKET_ADMIN.createPlayer = function(player,myFunction) {
	APIUtils.createPlayer(player,function(resp1){
		console.log(resp1)
		if(resp1.status=="success"){
			player.playerId = resp1.data.player_id;
			DBUtils.createPlayer(player,function(resp2){
				if(resp2.status=="success"){
					DBUtils.autoSyncFunctions.players(function(){
						myFunction(resp1);
					});
				}else
					myFunction(resp2);
			});
			
		}else{
			myFunction(resp1);
		}
	});
}


CCLIB.CRICKET_ADMIN.updatePlayer = function(player,myFunction) {
	APIUtils.updatePlayer(player,function(resp){
		if(resp.status=="success"){
			DBUtils.updatePlayer(player,function(resp1){
				DBUtils.autoSyncFunctions.players(function(){
					myFunction(resp1);
				});
			});
			
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deletePlayer = function(player,myFunction) {
	APIUtils.deletePlayer(player,function(resp){
		if(resp.status=="success"){
			DBUtils.deletePlayer(player,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.players(function(){});
		}
	});
	}

CCLIB.CRICKET_ADMIN.getPlayers = function(myFunction) {
	DBUtils.getPlayers(function(resp){
		console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

//country
CCLIB.CRICKET_ADMIN.getCountry = function(myFunction) {
	DBUtils.getCountry(function(resp1){
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

//match
CCLIB.CRICKET_ADMIN.createMatch = function(match,myFunction) {
	APIUtils.createMatch(match,function(resp1){
		if(resp1.status=="success"){
			match.matchId = resp1.data.match_id;
			DBUtils.createMatch(match,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.match();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateMatch = function(match,myFunction) {
	APIUtils.updateMatch(match,function(resp){
		//alert(JSON.stringify(resp))
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.updateMatch(match,function(resp1){
				//alert(JSON.stringify(resp1))
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.match();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteMatch = function(match,myFunction) {
	APIUtils.deleteMatch(match,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteMatch(match,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.match();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.getMatch = function(obj,myFunction) {
	DBUtils.getMatch(obj,function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.getMatchDetails = function(match,myFunction){
	APIUtils.getMatchDetails(match,function(resp){
		myFunction(resp);
	})
}

CCLIB.CRICKET_ADMIN.getAllByTournamentIdMatch = function(match,myFunction){
	DBUtils.getAllByTournamentIdMatch(match,function(resp){
		console.log(resp)
		myFunction(resp);
	})
}

CCLIB.CRICKET_ADMIN.getMatchByStatus = function(status,myFunction) {
    DBUtils.getMatchByStatus(status,function(resp){
        myFunction(resp);
    });
}

CCLIB.CRICKET_ADMIN.getByTournamentIdMatchByStatus = function(match,myFunction) {
    DBUtils.getByTournamentIdMatchByStatus(match,function(resp){
    	console.log(resp)
        myFunction(resp);
    });
}

//match_has_team
CCLIB.CRICKET_ADMIN.createMatchHasTeam = function(matchHasTeam,myFunction) {
	APIUtils.createMatchHasTeam(matchHasTeam,function(resp1){
	/*	console.log("::::|||......|||::::")
		console.log(resp1)*/
		if(resp1.status=="success"){
			//matchHasTeam.matchId = resp1.data.match_id;
			DBUtils.createMatchHasTeam(matchHasTeam,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.matchHasTeam();
		}else{
			myFunction(resp1);
		}
	});
}


CCLIB.CRICKET_ADMIN.createMultiMatchHasTeam = function(matchHasTeam,myFunction) {
	APIUtils.createMultiMatchHasTeam(matchHasTeam,function(resp1){
		console.log("Server............."+JSON.stringify(resp1))
		if(resp1.status=="success"){
			DBUtils.createMultiMatchHasTeam(matchHasTeam,function(resp2){
				myFunction(resp1);
			});
		}else{
			myFunction(resp1);
		}
	});
}
CCLIB.CRICKET_ADMIN.updateScoreMatchHasTeam = function(matchHasTeam,myFunction) {
	APIUtils.updateScoreMatchHasTeam(matchHasTeam,function(resp){
		DBUtils.autoSyncFunctions.matchHasTeam(function(){
			myFunction(resp);
		});
	});
}
CCLIB.CRICKET_ADMIN.updateMatchHasTeam = function(matchHasTeam,myFunction) {
	APIUtils.updateMatchHasTeam(matchHasTeam,function(resp){
		DBUtils.autoSyncFunctions.matchHasTeam(function(){
			console.log(resp)
			myFunction(resp);
		});
	});
}

CCLIB.CRICKET_ADMIN.deleteMatchHasTeam = function(matchHasTeam,myFunction) {
	APIUtils.deleteMatchHasTeam(matchHasTeam,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteMatchHasTeam(matchHasTeam,function(resp1){
				myFunction(resp1);
			});
			//DBUtils.autoSyncFunctions.matchHasTeam(function(){});
		}
	});
	}

CCLIB.CRICKET_ADMIN.getMatchHasTeam = function(myFunction) {
	DBUtils.getMatchHasTeam(null,function(resp){
		console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.getMatchHasTeamName = function(matchHasTeam,myFunction) {
	DBUtils.getMatchHasTeamName(matchHasTeam,function(resp){
		console.log(resp)
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.getByMatchMatchHasTeam = function(matchHasTeam,myFunction) {
	DBUtils.getMatchHasTeamName(matchHasTeam,function(resp){
		console.log(resp)
		myFunction(resp);
	});
}

//matchhasplayer
CCLIB.CRICKET_ADMIN.createMatchHasPlayer = function(matchHasPlayer,myFunction) {
	APIUtils.createMatchHasPlayer(matchHasPlayer,function(resp1){
		if(resp1.status=="success"){
			matchHasPlayer.matchId = resp1.data.match_id;
			DBUtils.createMatchHasPlayer(matchHasPlayer,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.matchHasPlayer();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.createMultiMatchHasPlayer = function(matchHasPlayer,myFunction) {
	APIUtils.createMultiMatchHasPlayer(matchHasPlayer,function(resp1){
		console.log("Server............."+JSON.stringify(resp1))
		//DBUtils.autoSyncFunctions.matchHasPlayer();
		if(resp1.status=="success"){
			DBUtils.createMultiMatchHasPlayer(matchHasPlayer,function(resp2){
				myFunction(resp1);
			});
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateMatchHasPlayer = function(matchHasPlayer,myFunction) {
	APIUtils.updateMatchHasPlayer(matchHasPlayer,function(resp){
		console.log(JSON.stringify(resp))
		if(resp.status=="success"){
			DBUtils.updateMatchHasPlayer(matchHasPlayer,function(resp1){
				console.log(JSON.stringify(resp1))
				myFunction(resp1);
			});
			//DBUtils.autoSyncFunctions.matchHasPlayer();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteMatchHasPlayer = function(matchHasPlayer,myFunction) {
	
	APIUtils.deleteMatchHasPlayer(matchHasPlayer,function(resp){
		if(resp.status=="success"){
			DBUtils.deleteMatchHasPlayer(matchHasPlayer,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.matchHasPlayer();
		}
	});
	}

CCLIB.CRICKET_ADMIN.getMatchHasPlayer = function(myFunction) {
	DBUtils.getMatchHasPlayer(function(resp){
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.getMatchHasPlayerByMatchAndTeam = function(matchHasPlayer,myFunction) {
	DBUtils.getMatchHasPlayerByMatchAndTeam(matchHasPlayer,function(resp){
		console.log(resp)
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.getMatchHasPlayerByMatch = function(matchId,myFunction) {
	DBUtils.getMatchHasPlayerByMatch(matchId,function(resp){
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.updateScoreMatchHasPlayer = function(matchHasPlayer,myFunction) {
	APIUtils.updateScoreMatchHasPlayer(matchHasPlayer,function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.updateCaptain = function(matchHasPlayer,myFunction) {
    APIUtils.updatecaptainMatchHasPlayer(matchHasPlayer,function(resp){
        console.log(JSON.stringify(resp))
        if(resp.status=="success"){
            DBUtils.updateCaptain(matchHasPlayer,function(resp1){
                myFunction(resp1);
            });
            //DBUtils.autoSyncFunctions.matchHasPlayer();
        }else{
            myFunction(resp);
        }
    });
}

CCLIB.CRICKET_ADMIN.updateKeeper = function(matchHasPlayer,myFunction) {
    APIUtils.updatekeeperMatchHasPlayer(matchHasPlayer,function(resp){
        console.log(JSON.stringify(resp))
        if(resp.status=="success"){
            DBUtils.updateKeeper(matchHasPlayer,function(resp1){
                myFunction(resp1);
            });
            //DBUtils.autoSyncFunctions.matchHasPlayer();
        }else{
            myFunction(resp);
        }
    });
}



//venue::venueId, teamId, playerId, country_id, venue_description
CCLIB.CRICKET_ADMIN.createVenue = function(venue,myFunction) {
	APIUtils.createVenue(venue,function(resp1){
		//console.log(":::::::::::::::::::::::::::::::..............")
		console.log(resp1)
		if(resp1.status=="success"){
			venue.venueId = resp1.data.venue_id;
			DBUtils.createVenue(venue,function(resp2){
				if(resp2.status=="success")
					myFunction(resp1);
				else
					myFunction(resp2);
			});
			DBUtils.autoSyncFunctions.venue();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateVenue = function(venue,myFunction) {
	APIUtils.updateVenue(venue,function(resp){
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.updateVenue(venue,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.venue();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deleteVenue = function(venue,myFunction) {
	APIUtils.deleteVenue(venue,function(resp){
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.deleteVenue(venue,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.venue();
		}
	});
	}
CCLIB.CRICKET_ADMIN.getVenue = function(myFunction) {
	DBUtils.getVenue(function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.getByCountryVenue = function(venue,myFunction) {
	DBUtils.getByCountryVenue(venue,function(resp){
		myFunction(resp);
	});
}



//pictures::picturestype, picturesdescription, picturestypeid, picturestitle, picturespath
CCLIB.CRICKET_ADMIN.createPictures = function(pictures,myFunction) {
	APIUtils.createPictures(pictures,function(resp1){
		if(resp1.status=="success"){
			pictures.pictureId = resp1.data.picture_id;
			DBUtils.createPictures(pictures,function(resp2){
				if(resp2.status=="success"){
					DBUtils.autoSyncFunctions.pictures(function(){
						myFunction(resp1);
					});
				}else
					myFunction(resp2);
			});
			
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updatePictures = function(pictures,myFunction) {
	APIUtils.updatePictures(pictures,function(resp){
		console.log(JSON.stringify(resp))
		if(resp.status=="success"){
			DBUtils.updatePictures(pictures,function(resp1){
				//alert(JSON.stringify(resp1))
				console.log(JSON.stringify(resp1))
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.pictures(function(){});
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.deletePictures = function(pictures,myFunction) {
	
	APIUtils.deletePictures(pictures,function(resp){
		if(resp.status=="success"){
			DBUtils.deletePictures(pictures,function(resp1){
				DBUtils.autoSyncFunctions.pictures(function(){});
				myFunction(resp1);
			});
			
		}
	});
}

CCLIB.CRICKET_ADMIN.getPictures = function(myFunction) {
	DBUtils.getPictures(function(resp){
		//alert(JSON.stringify(resp))
		myFunction(resp);
	});
}


//video_id, video_title
CCLIB.CRICKET_ADMIN.createVideos = function(videos,myFunction) {
	APIUtils.createVideos(videos,function(resp1){
		console.log(resp1)
		if(resp1.status=="success"){
			videos.videoId = resp1.data.video_id;
			DBUtils.createVideos(videos,function(resp2){
				if(resp2.status=="success"){
					DBUtils.autoSyncFunctions.videos(function(){
						myFunction(resp1);
					});
					//myFunction(resp1);
				}else
					myFunction(resp2);
			});
			//DBUtils.autoSyncFunctions.videos();
		}else{
			myFunction(resp1);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateVideos = function(videos,myFunction) {
	APIUtils.updateVideos(videos,function(resp){
		if(resp.status=="success"){
			DBUtils.updateVideos(videos,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.videos(function(){});
		}else{
			myFunction(resp);
		}
	});
}


CCLIB.CRICKET_ADMIN.deleteVideos = function(videos,myFunction) {
	APIUtils.deleteVideos(videos,function(resp){
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.deleteVideos(videos,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.videos(function(){});
		}
	});
}

CCLIB.CRICKET_ADMIN.getVideos = function(myFunction) {
	DBUtils.getVideos(function(resp){
		console.log(JSON.stringify(resp))
		myFunction(resp);
	});
}

// points
CCLIB.CRICKET_ADMIN.createPointsConfig= function(points,myFunction) {
	APIUtils.createPointsConfiguration(points,function(resp){
		console.log(resp)
		DBUtils.autoSyncFunctions.points();
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.updatePointsConfig= function(points,myFunction) {
	APIUtils.updatePointsConfiguration(points,function(resp){
		DBUtils.autoSyncFunctions.points();
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.deletePointsConfig= function(points,myFunction) {
	APIUtils.delPointsConfiguration(points,function(resp){
		DBUtils.autoSyncFunctions.points();
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.listByTourPointsConfiguration = function(points,myFunction) {
	APIUtils.listByTourPointsConfiguration(points,function(resp){
		myFunction(resp);
	});
}
CCLIB.CRICKET_ADMIN.getListPointsConfiguration = function(myFunction) {
	APIUtils.getListPointsConfiguration(function(resp){
		myFunction(resp);
	});
}

// users
CCLIB.CRICKET_ADMIN.createUser = function(user,myFunction) {
	APIUtils.createUser(user,function(resp){
		console.log(user)
		if(resp.status=="success"){
			user.uId = resp.data.uId;
			DBUtils.createUser(user,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.users();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.getDeleUser= function(user,myFunction) {
	APIUtils.deleteUser(user.uId,function(resp){
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.deleteuser(user.uId,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.users();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.updateScoreCard = function(obj,myFunction){
	APIUtils.updateScoreCard(obj,function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.updateUser= function(user,myFunction) {
	APIUtils.updateUser(user,function(resp){
		console.log(resp)
		if(resp.status=="success"){
			DBUtils.updateUser(user,function(resp1){
				myFunction(resp1);
			});
			DBUtils.autoSyncFunctions.users();
		}else{
			myFunction(resp);
		}
	});
}

CCLIB.CRICKET_ADMIN.getUser= function(myFunction) {
	DBUtils.getUserList(function(resp){
		myFunction(resp);
	});
}


CCLIB.CRICKET_ADMIN.updatePassword= function(user,myFunction) {
	APIUtils.updatePassword(user,function(resp){
		myFunction(resp);
	});
}


CCLIB.CRICKET_ADMIN.forgotPassword= function(user,myFunction) {
	APIUtils.forgotPassword(user,function(resp){
		myFunction(resp);
	});
}


CCLIB.CRICKET_ADMIN.changePassword= function(user,myFunction) {
	APIUtils.changePassword(user,function(resp){
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.login= function(user,myFunction) {
	APIUtils.login(user,function(resp){
		console.log(JSON.stringify(resp));
		if(resp.status=="success"){
			var roleName = resp.data.role_name;
			var teamId = resp.data.team_id;
			if(roleName == "Team Manager"){
				localStorage.setItem("isTeamManager", true);
				localStorage.setItem("roleTeamId", teamId);
			}else{
				localStorage.setItem("isTeamManager", false);
				localStorage.setItem("roleTeamId", 0);
			}
		}
		myFunction(resp);
	});
}

CCLIB.CRICKET_ADMIN.getDetailBy= function(user,myFunction) {
	APIUtils.detailById(user,function(resp){
		myFunction(resp);
	});
}




DBUtils.autoSyncFunctions = {};


DBUtils.autoSyncFunctions.countries = function(){
	APIUtils.getCountry(function(resp){
		DBUtils.deleteAllCountries(function(resp){
			
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiCountry(list,function(resp){
		});
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
				});
			}*/
	});
}


DBUtils.autoSyncFunctions.tournaments = function(){
	APIUtils.getTournaments(function(resp){
		DBUtils.deleteAllTournaments(function(resp){
			
		});
		var list = resp.data.list;
		DBUtils.createMultiTournament(list,function(resp){
		});
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
					if(resp.status=="failed"){
						DBUtils.updateTournament(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.teams = function(){
	APIUtils.getTeams(function(resp){
		DBUtils.deleteAllTeams(function(resp){
			
		});
		var list = resp.data.list;
		DBUtils.createMultiTeam(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
					if(resp.status=="failed"){
						DBUtils.updateTeam(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.matchTypes = function(){
	APIUtils.getMatchTypes(function(resp){
		DBUtils.deleteAllMatchTypes(function(resp0){
			// console.log(JSON.stringify(resp0))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiMatchType(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
}
DBUtils.autoSyncFunctions.bowlingStyles = function(){
	//type=update&bowl_style_id=&bowl_style_title
	APIUtils.getBowlingStyles(function(resp){
		DBUtils.deleteAllBowlStyles(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiBowlingStyle(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				team.bowlStyleId = team.bowl_style_id;
				team.title = team.bowl_style_title;
				DBUtils.createBowlStyle(team,function(resp){
					if(resp.status=="failed"){
						DBUtils.updateBowlStyle(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.battingStyles = function(){
	//type=update&bat_style_id=&bat_style_title
	APIUtils.getBattingStyles(function(resp){
		DBUtils.deleteAllBatStyles(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiBattingStyle(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var battingStyle = list[i];
				battingStyle.batStyleId = battingStyle.bat_style_id;
				battingStyle.batStyleTitle = battingStyle.bat_style_title;
				DBUtils.createBatStyle(battingStyle,function(resp){
					if(resp.status=="failed"){
						DBUtils.updateBatStyle(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.playerRoles = function(){
	//type=update&player_role_id=&player_role_title
	APIUtils.getPlayerRoles(function(resp){
		DBUtils.deleteAllPlayerRoles(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiPlayerRole(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var team = list[i];
				team.playerRoleId = team.player_role_id;
				team.title = team.player_role_title;
				DBUtils.createPlayerRole(team,function(resp){
					if(resp.status=="failed"){
						DBUtils.updatePlayerRole(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.umpires = function(){
	//type=update&umpire_id=&umpire_name=&umpire_country_name=
	APIUtils.getUmpires(function(resp){
		DBUtils.deleteAllUmpires(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiUmpire(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
					if(resp.status=="failed"){
						DBUtils.updateUmpire(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.tournamentHasTeam = function(){
	//type=update&tournament_id=&team_id=
	var tournamentHasTeamObj = {};
	APIUtils.getTournamentHasTeam(tournamentHasTeamObj,function(resp){
		// console.log(resp)
		DBUtils.deleteAllTournamentHasTeam(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiTournamentTeam(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var tournamentHasTeam = list[i];
				tournamentHasTeam.tournamentId = tournamentHasTeam.tournament_id;
				tournamentHasTeam.teamId = tournamentHasTeam.team_id;
				
				DBUtils.createTournamentHasTeam(tournamentHasTeam,function(resp){
					if(resp.status=="failed"){
						DBUtils.updatetournamentHasTeam(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.tournamentHasPlayer = function(calBack){
	var tournamentHasPlayerObj = {};
	APIUtils.getTournamentHasPlayer(tournamentHasPlayerObj,function(resp){
		DBUtils.deleteAllTournamentHasPlayers(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiTHP(list,function(resp){
            // console.log(JSON.stringify(resp))
			calBack();
        });
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
					if(resp.status=="failed"){
						DBUtils.updateTournamentHasPlayer(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.category = function(){
	APIUtils.getCategory(function(resp){
		DBUtils.deleteAllCategory(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiCategory(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var category = list[i];
				category.categoryName = category.category_title;
				category.catId = category.category_id;
				
				DBUtils.createCategory(category,function(resp){
					if(resp.status=="failed"){
						DBUtils.updateCategory(category,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.players = function(calBack){
    //type=update&player_id=&player_name=&player_country_name=
    APIUtils.getPlayers(function(resp){
        //console.log(JSON.stringify(resp))
        DBUtils.deleteAllPlayer(function(resp){
        });
        var list = resp.data.list;
        DBUtils.createMultiPlayer(list,function(resp){
            //console.log(JSON.stringify(list))
        	calBack();
        });
    /*    if(list)
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
                player.playerStatus=player.player_status;
                player.bowl_style_title=player.bowl_style_title;
                player.bat_style_title=player.bat_style_title;
                player.player_category_title=player.player_category_title;
                player.player_role_title=player.player_role_title ;
                player.player_country_title=player.player_country_title;    
                player.player_teams=player.player_teams;
                player.player_teams_small=player.player_teams_small;
                
                
                DBUtils.createPlayer(player,function(resp){
                    //if(resp.status=="failed"){
                        DBUtils.updatePlayer(resp.data,function(resp1){
                        })
                    //}
                });
            }*/
    });
}



DBUtils.autoSyncFunctions.match = function(){
    APIUtils.getMatch(function(resp){
        DBUtils.deleteAllMatch(function(resp){
        });
        var list = resp.data.list;
        DBUtils.createMultiMatch(list,function(resp){
        });
    /*    if(list)
            for(var i=0;i<list.length;i++){
                var match = list[i];
                match.matchId = match.match_id;
                match.matchName = match.match_name;
                match.matchTypeId = match.match_type_id;
                match.tournamentId = match.tournament_id;
                match.location = match.location;
                match.noInngs = match.no_inngs;
                match.starttime = match.starttime;
                match.description = match.description;
                match.umpire1 = match.umpire1;
                match.umpire2 = match.umpire2;
                match.tvUmpire = match.tv_umpire;
                match.matchRef = match.match_ref;
                match.resUmpire = match.res_umpire;
                match.localTime = match.local_time;
                match.matchCat = match.match_cat;
                match.matchDayNight = match.match_day_night;
                match.venueId=match.venue_id;
                match.matchStatus=match.match_status;
                match.toss=match.toss;
                //match.momMatch=match.mom_match;
                match.matchResult=match.match_result;
                match.momId=match.mom_id;
                match.winningMatchId=match.winning_team_id;
                match.team1Id=match.team1id;
                match.team1Name=match.team1name;
                match.team1Logo=match.team1logo;
                match.team2Id=match.team2id;
                match.team2Name=match.team2name;
                match.team2Logo=match.team2logo;
                match.tournamentTitle=match.tournament_title;
                match.venueDetails=match.venue_details;
                match.team1shortname=match.team1shortname;
                match.team2shortname=match.team2shortname;
                DBUtils.createMatch(match,function(resp){
                    // console.log(resp)
                    //if(resp.status=="failed"){
                        DBUtils.updateMatch(resp.data,function(resp1){
                            console.log("................")
                            console.log(resp1)
                        })
                    //}
                });
            }*/
    });
}




DBUtils.autoSyncFunctions.matchHasTeam = function(calback){
    //matchHasTeam
    var matchHasTeam = {};
    APIUtils.getMatchHasTeam(matchHasTeam,function(resp){
        if(resp && resp.status=="failed")
            return;
        DBUtils.deleteAllMatchHasTeam(function(resp){
        });
        var list = resp.data.list;
        DBUtils.createMultiMatchTeams(list,function(resp){
          //  console.log(JSON.stringify(list))
        });
    /*    if(list)
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
                matchHasTeam.tournamentId = matchHasTeam.tournament_id;
                matchHasTeam.mhtId= matchHasTeam.mht_id;
                matchHasTeam.teamLogo=matchHasTeam.team_logo;
                
                DBUtils.createMatchHasTeam(matchHasTeam,function(resp){
                    if(resp.status=="failed"){
                        DBUtils.updateScoreMatchHasTeam(resp.data,function(resp1){
                        })
                    }
                });
            }*/
        calback()
    });
}



DBUtils.autoSyncFunctions.teamHasPlayer = function(calBack){
	//teamhasplayer
	APIUtils.getTeamHasPlayer(null,function(resp1){
		// console.log(resp1)
		DBUtils.deleteAllTeamHasPlayers(function(resp){
		});
		var list = resp1.data.list;
DBUtils.createMultiTeamhasPlayers(list,function(resp){
            
            // con// // console.log(JSON.stringify(resp1))    });
	calBack();
        });
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
			});
		}*/
	})
}
DBUtils.autoSyncFunctions.venue = function(){
	APIUtils.getVenue(function(resp){
		DBUtils.deleteAllVenue(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiVenue(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
				venue.country_title = venue.country_title;
				DBUtils.createVenue(venue,function(resp){
					if(resp.status=="failed"){
						DBUtils.updateVenue(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.pictures = function(calBack){
	APIUtils.getPictures(function(resp){
		DBUtils.deleteAllPictures(function(resp){
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPicture(list,function(resp){
			// console.log(JSON.stringify(resp))
			calBack();
		});
		/*if(list)
			for(var i=0;i<list.length;i++){
				var pictures = list[i];
				pictures.pictureId = pictures.picture_id;
				pictures.pictureTitle = pictures.picture_title;
				pictures.pictureDescription =pictures.picture_description;
				pictures.pictureType=pictures.picture_type;
				pictures.pictureTypeId=pictures.picture_type_id;
				//pic_path
				if(pictures.pic_path)
					pictures.PicPath=pictures.pic_path;
				else if(pictures.picture_logo)
					pictures.PicPath=pictures.picture_logo;
				DBUtils.createPictures(pictures,function(resp){
					if(resp.status=="failed"){
						DBUtils.updatePictures(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.matchHasPlayer = function(){
	APIUtils.getMatchHasPlayer(function(resp){
		DBUtils.deleteAllMatchHasPlayer(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiMatchPlayer(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
				matchHasPlayer.Captain=matchHasPlayer.captain;
				matchHasPlayer.wKeeper=matchHasPlayer.w_keeper;
				
				DBUtils.createMatchHasPlayer(matchHasPlayer,function(resp){
					if(resp.status=="failed"){
						DBUtils.updateMatchHasPlayer(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}
DBUtils.autoSyncFunctions.videos = function(calBack){
	APIUtils.getVideos(function(resp){
		DBUtils.deleteAllVideos(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		DBUtils.createMultiVideos(list,function(resp){
			//console.log(JSON.stringify(resp))
			calBack();
		});
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
}
DBUtils.autoSyncFunctions.points = function(){
	APIUtils.getListPointsConfiguration(function(resp){
		DBUtils.deleteAllPoints(function(resp){
			// console.log(JSON.stringify(resp))
		});
		var list = resp.data.list;
		//console.log(JSON.stringify(list))
		DBUtils.createMultiPoint(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
}
DBUtils.autoSyncFunctions.users = function(){
	//userName,user.roleName,user.emailId,user.password,user.socialId,user.updateId,user.deviceType,user.uId],	
	APIUtils.getUserList(function(resp){
		DBUtils.deleteAllUser(function(resp){
		});
		var list = resp.data.list;
		DBUtils.createMultiUser(list,function(resp){
			// console.log(JSON.stringify(resp))
		});
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
					if(resp.status=="failed"){
						DBUtils.updateUser(resp.data,function(resp1){
						})
					}
				});
			}*/
	});
}

function autoSyncTables(){
	sysncLines();
	setTimeout(autoSyncTables,45000);
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
	DBUtils.autoSyncFunctions.tournamentHasPlayer(function(){});
	DBUtils.autoSyncFunctions.category();
	DBUtils.autoSyncFunctions.players(function(){});
	DBUtils.autoSyncFunctions.match();
	DBUtils.autoSyncFunctions.matchHasTeam(function(){});
	DBUtils.autoSyncFunctions.teamHasPlayer(function(){});
	DBUtils.autoSyncFunctions.venue();
	DBUtils.autoSyncFunctions.pictures(function(){});
	DBUtils.autoSyncFunctions.matchHasPlayer();
	DBUtils.autoSyncFunctions.videos(function(){});
	DBUtils.autoSyncFunctions.points();
	DBUtils.autoSyncFunctions.users();
}
