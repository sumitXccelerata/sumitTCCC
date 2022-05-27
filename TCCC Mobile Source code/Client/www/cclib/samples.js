document.addEventListener("oncclibready", function(resp){
	// alert(1)
}, false)


function process(){
	
	
	/*var match={};
	match.team1Id= "8";
	match.tournamentId= "1";
	CCLIB.CRICKET_ADMIN.getmatchbyteamId(match,function(resp){
		// console.log(JSON.stringify(resp))
					})*/
	

   /* var matches={};
    matches.tournamentId ="1";
    matches.matchStatus="0";
	   CCLIB.CRICKET_ADMIN.getFixturesBytournamentId(matches,function(resp){
   // console.log(JSON.stringify(resp))
})*/
	

/*var matches={};
matches.tournamentId ="1";
matches.matchStatus="1";
CCLIB.CRICKET_ADMIN.getResultsBytournamentId(matches,function(resp){
// console.log(JSON.stringify(resp))
})*/
	
	
	
	/*DBUtils.getPlayers (function(resp){
		 console.log(JSON.stringify(resp))
	});*/
// Client Home Videos
	

	         /*var videos={};
	         videos.videoType = "tournament";
		    videos.videoTypeId = "2";
	        CCLIB.CRICKET_ADMIN.getHomeVideos(videos,function(resp){
	        console.log(JSON.stringify(resp))
	})*/

	

// Client Fixtures	


	       /*var matches={};
	       matches.tournamentId ="1";
	       matches.matchStatus="0";
		   CCLIB.CRICKET_ADMIN.getFixturesBytournamentId(matches,function(resp){
	       console.log(JSON.stringify(resp))
	})*/
	
	
	
// Client Result	


	       /*var matches={};
	       matches.tournamentId ="2";
	       matches.matchStatus="1";
		   CCLIB.CRICKET_ADMIN.getResultsBytournamentId(matches,function(resp){
	       console.log(JSON.stringify(resp))
	})*/	
	
	

	
// Client Venue	
	
	
	 /*var venues={};
	 venues.tournamentId="1";
	 CCLIB.CRICKET_ADMIN.getVenuesByTournamentId(venues,function(resp){
	 console.log(JSON.stringify(resp))
	 })*/
	

	
// Client Points
	

	 /*var points={};
	 points.tournamentId="1";
	 CCLIB.CRICKET_ADMIN.getPointsByTournId(points,function(resp){
	console.log(JSON.stringify(resp))
	})*/

	
	
// Client Team


	      /*var teams={};
	      teams.tournamentId = "2";
	      CCLIB.CRICKET_ADMIN.getTeamsByTourId(teams,function(resp){
	      console.log(JSON.stringify(resp))
	 })*/
	 

	

// Client Team Videos
	

		 /*var teamsVideos={};
	     teamsVideos.videoType = "tournament";
		 teamsVideos.videoTypeId="2"
		 CCLIB.CRICKET_ADMIN.getTeamsVideosTeamId(teamsVideos,function(resp){
	     console.log(JSON.stringify(resp))
	 })*/
 
	
// Client Team Pictures	

/*
	    var teamsPictures={};
	    teamsPictures.pictureType = "team";
		teamsPictures.pictureTypeId="1"
		CCLIB.CRICKET_ADMIN.getTeamsPicturesTeamId(teamsPictures,function(resp){
	       console.log(JSON.stringify(resp))
	 })*/

	

// Client Team Squad
	

	    /*var teamPlayers={};
		teamPlayers.tournamentId="1";
		teamPlayers.teamId="2";
		CCLIB.CRICKET_ADMIN.getTeamPlayersByTeamId(teamPlayers,function(resp){
		console.log(JSON.stringify(resp))
		 })*/
	
	
	
// Client Player Details
	
 
	     /*var players={};
		 players.playerId="31";
		 CCLIB.CRICKET_ADMIN.getPlayersByPlayerId(players,function(resp){
		 console.log(JSON.stringify(resp))
	})*/

	
	
// Client Player Videos
	

        /*var playersVideos={};
	    playersVideos.videoType = "player";
		playersVideos.videoTypeId="6"
		CCLIB.CRICKET_ADMIN.getplayersVideosPlayerId(playersVideos,function(resp){
	    console.log(JSON.stringify(resp))
	 })*/
	 

	
	
// Client Videos Latest
	

	     /* var videos={};
	      videos.videoType = "tournament";
		  videos.videoTypeId = "2";
	      CCLIB.CRICKET_ADMIN.getVideosByVideoType(videos,function(resp){
	      console.log(JSON.stringify(resp))
	})*/


	
// Client Videos Most Watched
	

	   /*var videos={};
       videos.videoType = "player";
	   videos.videoTypeId = "6";
	   CCLIB.CRICKET_ADMIN.getVideosByMostWatched(videos,function(resp){
	   console.log(JSON.stringify(resp))
	})*/


	
	
// Client Videos Heighlights


	    /*var videos={};
	    videos.videoType = "tournament";
		videos.videoTypeId = "2";
	    CCLIB.CRICKET_ADMIN.getVideosByHighlights(videos,function(resp){
	    console.log(JSON.stringify(resp))
	})*/


	
	
// Client Pictures Related to Event
	 

        /*var pictures={};
        pictures.pictureType = "team";
	 	pictures.pictureTypeid = "1";
	    CCLIB.CRICKET_ADMIN.getPicturesByPictureType(pictures,function(resp){
	    console.log(JSON.stringify(resp))
	 })*/


// Client Retrieve Tournament	
 
/*CCLIB.CRICKET_ADMIN.retrieveTournaments(function(resp){
	console.log(JSON.stringify(resp))
			})*/


	
	
// Client Retrieve Tournament	
/*var match={};
match.team1Id= "10";
match.tournamentId= "2";
CCLIB.CRICKET_ADMIN.getmatchbyteamId(match,function(resp){
	console.log(JSON.stringify(resp))
				})*/

	
	
// Client Team videos list based on tounament id
/*CCLIB.CRICKET_ADMIN.getTeamVideosByTournament(2,function(resp){
	console.log(JSON.stringify(resp))
				})*/
	



//Client Player videos list based on tournament id
/*CCLIB.CRICKET_ADMIN.getPlayerVideosByTournament(2,function(resp){
	console.log(JSON.stringify(resp))
				})*/
				
				
				
// Client Team videos list based on tounament id
/*CCLIB.CRICKET_ADMIN.getTeamPicturesByTournament(1,function(resp){
		console.log(JSON.stringify(resp))
				})*/
				
				

//Client Player pictures list based on tournament id
/*CCLIB.CRICKET_ADMIN.getPlayerPicturesByTournament(1,function(resp){
		console.log(JSON.stringify(resp))
				})*/
				
				
				

	
}
	
	
	
	
	
	
	
	
	
	
	
	
	
