var APIUtils = new Object();
// APIUtils.SERVER = "http://192.168.3.149/cricket/services/";
//APIUtils.SERVER = "http://202.65.153.12/services/";
APIUtils.SERVER = "http://api.clubtcc.ca/services/";
APIUtils.URLS = {
		getCreateTournamentURL:function(tournament){
			return APIUtils.SERVER+"tournament.php?type=create&tournament_name="+tournament.name+"&tournament_logo="+tournament.logo+"&start_date="+tournament.startDate+"&end_date="+tournament.endDate+"&points_table="+tournament.pointsTable+"&tour_cat="+tournament.cat+"&short_name="+tournament.shortName;
		},
		getAllTournamentsURL:function(){
			return APIUtils.SERVER+"tournament.php?type=list"
		},
		getUpdateTournamentURL:function(tournament){
			return APIUtils.SERVER+"tournament.php?type=update&tournament_id="+tournament.tournamentId+"&tournament_name="+tournament.name+"&tournament_logo="+tournament.logo+"&points_table="+tournament.pointsTable+"&tour_cat="+tournament.cat+"&short_name="+tournament.shortName;
		},
		getDelTournamentURL:function(tournamentId){
			return APIUtils.SERVER+"tournament.php?type=delete&tournament_id="+tournamentId
		},
		getCreateTeamURL:function(team){
			//                      			   type=create&team_name=&team_logo=&team_small_name=
			return APIUtils.SERVER+"team.php?type=create&team_name="+team.name+"&team_logo="+team.logo+"&team_small_name="+team.smallName+"&team_cat_id="+team.teamCatId+"&description="+team.description
		},
		getAllTeamsURL:function(status){
			return APIUtils.SERVER+"team.php?type=list&status="+status;
		},
		getUpdateTeamURL:function(team){
			return APIUtils.SERVER+"team.php?type=update&team_id="+team.teamId+"&team_name="+team.name+"&team_logo="+team.logo+"&team_small_name="+team.smallName+"&team_cat_id="+team.catId+"&description="+team.description
		},
		getDelTeamURL:function(teamId){
			return APIUtils.SERVER+"team.php?type=delete&team_id="+teamId
		},
		getCreateMatchTypeURL:function(obj){
			return APIUtils.SERVER+"match_type.php?type=create&match_type_title="+obj.title
		},
		getAllMatchTypeURL:function(){
			return APIUtils.SERVER+"match_type.php?type=list";
		},
		getUpdateMatchTypeURL:function(obj){
			return APIUtils.SERVER+"match_type.php?type=update&match_type_id="+obj.matchTypeId+"&match_type_title="+obj.title;
		},
		getDelMatchTypeURL:function(obj){
			return APIUtils.SERVER+"match_type.php?type=delete&match_type_id="+obj.matchTypeId
		},
		getCreateBowlingStyleURL:function(obj){
			return APIUtils.SERVER+"bowling_style.php?type=create&bowl_style_title="+obj.title
		},
		getAllBowlingStyleURL:function(){
			return APIUtils.SERVER+"bowling_style.php?type=list";
		},
		getUpdateBowlingStyleURL:function(obj){
			return APIUtils.SERVER+"bowling_style.php?type=update&bowl_style_id="+obj.bowlStyleId+"&bowl_style_title="+obj.title;
		},
		getDelBowlingStyleURL:function(obj){
			return APIUtils.SERVER+"bowling_style.php?type=delete&bowl_style_id="+obj.bowlStyleId
		},
		getCreateBattingStyleURL:function(obj){
			return APIUtils.SERVER+"batting_style.php?type=create&bat_style_title="+obj.batStyleTitle
		},
		getAllBattingStyleURL:function(){
			return APIUtils.SERVER+"batting_style.php?type=list";
		},
		getUpdateBattingStyleURL:function(obj){
			return APIUtils.SERVER+"batting_style.php?type=update&bat_style_id="+obj.batStyleId+"&bat_style_title="+obj.batStyleTitle;
		},
		getDelBattingStyleURL:function(obj){
			return APIUtils.SERVER+"batting_style.php?type=delete&bat_style_id="+obj.batStyleId
		},
		getCreatePlayerRoleURL:function(obj){
			return APIUtils.SERVER+"player_role.php?type=create&player_role_title="+obj.title
		},
		getAllPlayerRoleURL:function(){
			return APIUtils.SERVER+"player_role.php?type=list";
		},
		getUpdatePlayerRoleURL:function(obj){
			return APIUtils.SERVER+"player_role.php?type=update&player_role_id="+obj.playerRoleId+"&player_role_title="+obj.title;
		},
		getDelPlayerRoleURL:function(obj){
			return APIUtils.SERVER+"player_role.php?type=delete&player_role_id="+obj.playerRoleId
		},
		getCreateUmpireURL:function(umpire){
			return APIUtils.SERVER+"umpire.php?type=create&umpire_name="+umpire.umpireName+"&umpire_country_id="+umpire.umpireCountryId+"&umpire_logo="+umpire.umpireLogo+"&team_logo="+umpire.teamLogo+"&umpire_dob="+umpire.dob;
		},
		getAllUmpireURL:function(){
			return APIUtils.SERVER+"umpire.php?type=list";
		},
		getUpdateUmpireURL:function(umpire){
			return APIUtils.SERVER+"umpire.php?type=update&umpire_id="+umpire.umpireId+"&umpire_name="+umpire.umpireName+"&umpire_country_id="+umpire.umpireCountryId+"&umpire_logo="+umpire.umpireLogo+"&team_logo="+umpire.teamLogo+"&umpire_dob="+umpire.dob;
		},
		getDelUmpireURL:function(umpireId){
			return APIUtils.SERVER+"umpire.php?type=delete&umpire_id="+umpireId;
		},
		
		getCreateTournamentHasTeamURL:function(obj){
			return APIUtils.SERVER+"tournament_has_team.php?type=create&tournament_id="+obj.tournamentId+"&team_id="+obj.teamId 
		},
		getAllTournamentHasTeamURL:function(obj){
			return APIUtils.SERVER+"tournament_has_team.php?type=totallist";
		},
		
		
		getTournamentHasTeamByTournamentURL:function(tournamentId){
			return APIUtils.SERVER+"tournament_has_team.php?type=list&tournament_id="+tournamentId;
		},
		
		
		getCreateMultiTournamentHasTeamURL:function(obj){
			return APIUtils.SERVER+"tournament_has_team.php?type=createmulti&tournament_id="+obj.tournamentId+"&team_ids="+obj.teamId;
		},
		getDelTournamentHasTeamURL:function(obj){
			return APIUtils.SERVER+"tournament_has_team.php?type=delete&tournament_id="+obj.tournamentId+"&team_id="+obj.teamId;
		},
		
		getCreateTeamHasPlayerURL:function(obj){
			return APIUtils.SERVER+"team_has_player.php?type=create&team_id="+obj.teamId+"&player_id="+obj.playerId 
		},
		getAllTeamHasPlayerURL:function(obj){
			return APIUtils.SERVER+"team_has_player.php?type=totallist";
		},
		getCreateMultiTeamHasPlayerURL:function(obj){
			return APIUtils.SERVER+"team_has_player.php?type=createmulti&team_id="+obj.teamId+"&player_ids="+obj.playerId;
		},
		getDelTeamHasPlayerURL:function(obj){
			return APIUtils.SERVER+"team_has_player.php?type=delete&team_id="+obj.teamId+"&player_id="+obj.playerId;
		},
		getAllTeamHasPlayerByTeamIdURL:function(obj){
			return APIUtils.SERVER+"team_has_player.php?type=list&team_id="+obj.teamId;
		},
		getCreateTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=create&t_thp_id="+tournamentHasPlayer.tThdId+"&tournament_id="+tournamentHasPlayer.tournamentId+"&team_id="+tournamentHasPlayer.teamId+"&player_id="+tournamentHasPlayer.playerId+"&odi="+tournamentHasPlayer.odi+"&test="+tournamentHasPlayer.test+"&t20="+tournamentHasPlayer.t20;
		},
		getAllTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=totallist";
		},
		getUpdateTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=update&tournament_id="+tournamentHasPlayer.tournamentId+"&team_id="+tournamentHasPlayer.teamId+"&player_id="+tournamentHasPlayer.playerId+"&odi="+tournamentHasPlayer.odi+"&test="+tournamentHasPlayer.test+"&t20="+tournamentHasPlayer.t20; 
		},
		getDelTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=delete&tournament_id="+tournamentHasPlayer.tournamentId+"&team_id="+tournamentHasPlayer.teamId+"&player_id="+tournamentHasPlayer.playerId;
		},
		getCreateMultiTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=createmulti&tournament_id="+tournamentHasPlayer.tournamentId+"&team_id="+tournamentHasPlayer.teamId+"&player_ids="+tournamentHasPlayer.playerId+"&odi="+tournamentHasPlayer.odi+"&test="+tournamentHasPlayer.test+"&t20="+tournamentHasPlayer.t20;
		},
		getAllByTourTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=listbytour&tournament_id="+tournamentHasPlayer.tournamentId;
		},
		getAllByTeamTournamentHasPlayerURL:function(tournamentHasPlayer){
			return APIUtils.SERVER+"tournament_has_player.php?type=listbytour&tournament_id="+tournamentHasPlayer.tournamentId+"&team_id="+tournamentHasPlayer.teamId;
		},
		getCreateCategoryURL:function(category){
			return APIUtils.SERVER+"category.php?type=create&category_title="+category.categoryName;
		},
		getAllCategoryURL:function(){
			return APIUtils.SERVER+"category.php?type=list"
		},
		getUpdateCategoryURL:function(category){
			return APIUtils.SERVER+"category.php?type=update&category_id="+category.catId+"&category_title="+category.categoryName;
		},
		getDelCategoryURL:function(category){
			return APIUtils.SERVER+"category.php?type=delete&category_id="+category.catId;
		},
		
		getCreatePlayerURL:function(player){
			return APIUtils.SERVER+"player.php?type=create&player_name="+player.playerName+"&player_country_id="+player.playerCountryId+"&player_logo="+player.playerLogo+"&dob="+player.dob+"&bowl_style_id="+player.bowlStyleId+"&bat_style_id="+player.batStyleId+"&player_cat="+player.cat+"&playing_role="+player.role+"&description="+player.description+"&phonenumber="+player.phonenumber;
		},
		getAllPlayerURL:function(){
			return APIUtils.SERVER+"player.php?type=list&player_status=all";
		},
		getUpdatePlayerURL:function(player){
			return APIUtils.SERVER+"player.php?type=update&player_id="+player.playerId+"&player_name="+player.playerName+"&player_country_id="+player.playerCountryId+"&player_logo="+player.playerLogo+"&dob="+player.dob+"&bowl_style_id="+player.bowlStyleId+"&bat_style_id="+player.batStyleId+"&player_cat="+player.cat+"&playing_role="+player.role+"&description="+player.description+"&phonenumber="+player.phonenumber;
		},
		getDelPlayerURL:function(player){
			return APIUtils.SERVER+"player.php?type=delete&player_id="+player.playerId
		},
		
		getAllCountryURL:function(country){
			return APIUtils.SERVER+"country.php?type=list"
		},
		getCreateMatchURL:function(match){
			return APIUtils.SERVER+"match.php?type=create&match_name="+match.matchName+"&match_type_id="+match.matchTypeId+"&tournament_id="+match.tournamentId+"&location="+match.location+"&no_inngs="+match.noInngs+"&starttime="+match.starttime+"&description="+match.description+"&umpire1="+match.umpire1+"&umpire2="+match.umpire2+"&tv_umpire="+match.tvUmpire+"&match_ref="+match.matchRef+"&res_umpire="+match.resUmpire+"&local_time="+match.localTime+"&match_cat="+match.matchCat+"&match_day_night="+match.matchDayNight+"&venue_id="+match.venueId;
		},
		getAllMatchURL:function(){
			return APIUtils.SERVER+"match.php?type=list";
		},
		getUpdateMatchURL:function(match){
			return APIUtils.SERVER+"match.php?type=update&match_id="+match.matchId+"&match_type_id="+match.matchTypeId+"&tournament_id="+match.tournamentId+"&match_name="+match.matchName+"&location="+match.location+"&no_inngs="+match.noInngs+"&starttime="+match.starttime+"&description="+match.description+"&match_status="+match.matchStatus+"&toss="+match.toss+"&mom_match="+match.momMatch+"&umpire1="+match.umpire1+"&umpire2="+match.umpire2+"&tv_umpire="+match.tvUmpire+"&match_ref="+match.matchRef+"&res_umpire="+match.resUmpire+"&match_result="+match.matchResult+"&local_time="+match.localTime+"&match_cat="+match.matchCat+"&mom_id="+match.momId+"&winning_match_id="+match.winningMatchId+"&match_day_night="+match.matchDayNight+"&venue_id="+match.venueId+"&match_result_status="+match.matchResultstatus;
		},
		getDelMatchURL:function(match){
			return APIUtils.SERVER+"match.php?type=delete&match_id="+match.matchId+"&tournament_id="+match.tournamentId;
		},
		getAllByTourMatchURL:function(match){
			return APIUtils.SERVER+"match.php?type=totallist";
		},
		getMatchDetailURL:function(match){
			return APIUtils.SERVER+"match.php?type=detail&match_id="+match.matchId;
		},
		getAllByTournamentIdMatchURL:function(match){
			return APIUtils.SERVER+"match.php?type=listbytour&tournament_id="+match.tournamentId;
		},
		getCreateMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=create&match_id="+matchHasTeam.matchId+"&team_id="+matchHasTeam.teamId+"&tournament_id="+matchHasTeam.tournamentId;
		},
		getAllMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=totallist";
		},
		getAllByMatchMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=list&match_id="+matchHasTeam.matchId;
		},
		getDelMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=delete&match_id="+matchHasTeam.matchId+"&team_id="+matchHasTeam.teamId;
		},
		getCreateMultiMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=createmulti&match_id="+matchHasTeam.matchId+"&team_ids="+matchHasTeam.teamId+"&tournament_id="+matchHasTeam.tournamentId;
		},
		getUpdateScoreMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=updatescore&match_id="+matchHasTeam.matchId+"&team_id="+matchHasTeam.teamId+"&bat_seq="+matchHasTeam.batSeq+"&inngs="+matchHasTeam.Inngs+"&score="+matchHasTeam.Score+"&wickets="+matchHasTeam.Wickets+"&result="+matchHasTeam.Result+"&overs="+matchHasTeam.Overs+"&bys="+matchHasTeam.Bys+"&leg_bys="+matchHasTeam.legBys+"&wide="+matchHasTeam.Wide+"&noballs="+matchHasTeam.noBalls+"&fall_of_wicket="+matchHasTeam.fallofWicket+"&maxOvers="+matchHasTeam.maxOvers+"&fours="+matchHasTeam.Fours+"&sixes="+matchHasTeam.Sixes;
		},
		getUpdateMatchHasTeamURL:function(matchHasTeam){
			return APIUtils.SERVER+"match_has_team.php?type=update&mht_id="+matchHasTeam.mhtId+"&match_id="+matchHasTeam.matchId+"&team_id="+matchHasTeam.teamId+"&tournament_id="+matchHasTeam.tournamentId;
		},
		getCreateMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=create&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId+"&inngs="+matchHasPlayer.Inngs;
		},
		getCreateMultiMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=createmulti&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_ids="+matchHasPlayer.playerId+"&inngs="+matchHasPlayer.Inngs;
		},
		getDelMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=delete&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId;
		},
		getUpdateMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=update&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId+"&is_captain="+matchHasPlayer.Captain+"&inngs="+matchHasPlayer.Inngs;
		},
		getAllByTourMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=totallist"
		},
		getAllByMatchMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=listbymatch&match_id="+matchHasPlayer.matchId;
		},
		getAllByMatchAndTeamMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=list&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId;
		},
		getUpdateScoreMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=updatescore&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId+"&inngs="+matchHasPlayer.Inngs+"&bat_seq="+matchHasPlayer.batSeq+"&bowl_seq="+matchHasPlayer.bowlSeq+"&score="+matchHasPlayer.Score+"&balls="+matchHasPlayer.Balls+"&out_str="+matchHasPlayer.outStr+"&fours="+matchHasPlayer.Fours+"&sixes="+matchHasPlayer.Sixes+"&overs="+matchHasPlayer.Overs+"&madin="+matchHasPlayer.Madin+"&b_runs="+matchHasPlayer.bRuns+"&wicks="+matchHasPlayer.Wicks+"&wides="+matchHasPlayer.Wides+"&nobals="+matchHasPlayer.Nobals+"&this_over_runs="+matchHasPlayer.thisoverRuns+"&b_sixes="+matchHasPlayer.bSixes+"&b_fours="+matchHasPlayer.bFours+"&candb="+matchHasPlayer.CandB+"&f_catches="+matchHasPlayer.fCatches+"&f_IR="+matchHasPlayer.fIR+"&w_keeper="+matchHasPlayer.wKeeper+"&f_DR="+matchHasPlayer.fDR+"&keeper_stumps="+matchHasPlayer.keeperStumps+"&captain="+matchHasPlayer.Captain;
		},
		getUpdateCaptainMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=updatecaptain&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId+"&is_captain="+matchHasPlayer.Captain+"&inngs="+matchHasPlayer.Inngs;
		},
		getUpdateKeeperMatchHasPlayerURL:function(matchHasPlayer){
			return APIUtils.SERVER+"match_has_player.php?type=updatekeeper&match_id="+matchHasPlayer.matchId+"&team_id="+matchHasPlayer.teamId+"&player_id="+matchHasPlayer.playerId+"&is_keeper="+matchHasPlayer.wKeeper+"&inngs="+matchHasPlayer.Inngs;
		},
		getCreateVenueURL:function(venue){
			return APIUtils.SERVER+"venue.php?type=create&venue_title="+venue.venueTitle+"&geoLat="+venue.venueGeoLat+"&geoLang="+venue.venueGeoLang+"&venue_description="+venue.venueDescription+"&venue_location="+venue.venuelocation+"&country_id="+venue.countryId;
		},
		getAllVenueURL:function(venue){
			return APIUtils.SERVER+"venue.php?type=list";
		},
		getUpdateVenueURL:function(venue){
			return APIUtils.SERVER+"venue.php?type=update&venue_id="+venue.venueId+"&venue_title="+venue.venueTitle+"&geoLat="+venue.venueGeoLat+"&geoLang="+venue.venueGeoLang+"&venue_description="+venue.venueDescription+"&venue_location="+venue.venuelocation+"&country_id="+venue.countryId;
		},
		getDelVenueURL:function(venue){
			return APIUtils.SERVER+"venue.php?type=delete&venue_id="+venue.venueId;
		},
		getAllByCountryVenueURL:function(venue){
			return APIUtils.SERVER+"venue.php?type=listbycountry&country_id="+venue.countryId;
		},
		
		getCreatePicturesURL:function(pictures){
			return APIUtils.SERVER+"pictures.php?type=create&picture_title="+pictures.pictureTitle+"&picture_description="+pictures.pictureDescription+"&picture_type="+pictures.pictureType+"&picture_type_id="+pictures.pictureTypeId+"&picture_logo="+pictures.PicPath+"&shortname="+pictures.shortname;
		},
		getUpdatePicturesURL:function(pictures){
			return APIUtils.SERVER+"pictures.php?type=update&picture_id="+pictures.pictureId+"&picture_title="+pictures.pictureTitle+"&picture_description="+pictures.pictureDescription+"&picture_type="+pictures.pictureType+"&picture_type_id="+pictures.pictureTypeId+"&picture_logo="+pictures.PicPath+"&shortname="+pictures.shortname;
		},
		getDelPicturesURL:function(pictures){
			return APIUtils.SERVER+"pictures.php?type=delete&picture_id="+pictures.pictureId+"&picture_type="+pictures.pictureType+"&picture_type_id="+pictures.pictureTypeId;
		},
		getAllPicturesURL:function(){
			return APIUtils.SERVER+"pictures.php?type=list";
		},
		getAllByTypePicturesURL:function(pictures){
			return APIUtils.SERVER+"pictures.php?type=listbytype&picture_type="+pictures.pictureType+"&picture_type_id="+pictures.pictureTypeId;
		},
		getCreateVideosURL:function(videos){
			return APIUtils.SERVER+"videos.php?type=create&video_title="+videos.videoTitle+"&video_description="+videos.videoDescription+"&video_type="+videos.videoType+"&video_type_id="+videos.videoTypeId+"&video_logo="+videos.PicPath+"&thumbnail="+videos.thumbnail+"&shortname="+videos.shortname+"&duration="+videos.duration;
		},
		getUpdateVideosURL:function(videos){
			return APIUtils.SERVER+"videos.php?type=update&video_id="+videos.videoId+"&video_title="+videos.videoTitle+"&video_description="+videos.videoDescription+"&video_type="+videos.videoType+"video_type_id="+videos.videoTypeId+"&video_logo="+videos.PicPath+"&thumbnail="+videos.thumbnail+"&shortname="+videos.shortname+"&duration="+videos.duration;
		},
		getDelVideosURL:function(videos){
			return APIUtils.SERVER+"videos.php?type=delete&video_id="+videos.videoId+"&video_type="+videos.videoType+"&video_type_id="+videos.videoTypeId;
		},
		getAllVideosURL:function(){
			return APIUtils.SERVER+"videos.php?type=list";
		},
		getAllByTypeVideosURL:function(videos){
			return APIUtils.SERVER+"videos.php?type=listbytype&video_type="+videos.videoType+"&video_type_id="+videos.videoTypeId;
		},
		//points
		getCreatePointsConfigureURL:function(points){
			return APIUtils.SERVER+"points_confiure.php?type=create&pc_name="+points.pcName+"&tournament_id="+points.tournamentId+"&points="+points.points;
		},
		getUpdatePointsConfigureURL:function(points){
			return APIUtils.SERVER+"points_confiure.php?type=update&pc_id="+points.pcId+"&pc_name="+points.pcName+"&tournament_id="+points.tournamentId+"&points="+points.points;
		},
		getDeletePointsConfigureURL:function(points){
			return APIUtils.SERVER+"points_confiure.php?type=delete&pc_id="+points.pcId+"&tournament_id="+points.tournamentId
		},
		getListPointsConfigureURL:function(){
			return APIUtils.SERVER+"points_confiure.php?type=list"
		},

		getListByTourPointsConfigureURL:function(points){
			return APIUtils.SERVER+"points_confiure.php?type=listbytour&tournament_id="+points.tournamentId
		},
		// user
		getCreateUserURL:function(user){
			return APIUtils.SERVER+"user.php?type=create&username="+user.userName+"&role_name="+user.roleName+"&emailId="+user.emailId+"&password="+user.password+"&team_id="+user.teamId
		},
		getUpdateUserURL:function(user){
			//type=update&uId=&role_name=&team_id=
			return APIUtils.SERVER+"user.php?type=update&uId="+user.uId+"&role_name="+user.roleName+"&team_id="+user.teamId+"&password="+user.password+"&username="+user.username+"&status="+user.status;
		},
		getDeleteUserURL:function(uId){
			return APIUtils.SERVER+"user.php?type=delete&uId="+uId;
		},
		getListURL:function(){
			return APIUtils.SERVER+"user.php?type=list"
		},
		getUpdatePasswordURL:function(user){
			return APIUtils.SERVER+"user.php?type=updatepassword&uId="+user.uId+"&password="+user.password
		},
		getForgotPasswordURL:function(user){
			return APIUtils.SERVER+"user.php?type=forgotpassword&emailId="+user.emailId
		},
		getChangePasswordURL:function(user){
			return APIUtils.SERVER+"user.php?type=changepassword&uId="+user.uId+"&password="+user.password+"&newpassword="+user.newpassword
		},
		getLoginURL:function(user){
			return APIUtils.SERVER+"user.php?type=login&emailId="+user.emailId+"&password="+user.password;
		},
		getDetailByIdURL:function(user){
			return APIUtils.SERVER+"user.php?type=detailbyid&uId="+user.uId;
		},
		getUpdateUdIdURL:function(user){
			return APIUtils.SERVER+"user.php?type=updateudid&uId="+user.uId+"&uDId="+user.uDeviceId+"&deviceType="+user.deviceType
		},
		
		getScorecardURL:function(){
			return APIUtils.SERVER+"scorecard.php"
		}
}

APIUtils.createTournament = function(tournament,myFunction) {
	var url = APIUtils.URLS.getCreateTournamentURL(tournament);
	console.log(url);
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateTournament = function(tournament,myFunction) {
	var url = APIUtils.URLS.getUpdateTournamentURL(tournament);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getTournaments = function(myFunction) {
	var url = APIUtils.URLS.getAllTournamentsURL();
	// console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteTournament = function(tournamentId,myFunction) {
	var url = APIUtils.URLS.getDelTournamentURL(tournamentId);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}



APIUtils.createTeam = function(team,myFunction) {
	var url = APIUtils.URLS.getCreateTeamURL(team);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateTeam = function(team,myFunction) {
	var url = APIUtils.URLS.getUpdateTeamURL(team);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteTeam = function(teamId,myFunction) {
	var url = APIUtils.URLS.getDelTeamURL(teamId);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getTeams = function(myFunction) {
	var url = APIUtils.URLS.getAllTeamsURL(2);
	callAjax(url,null,"GET",myFunction);
}




APIUtils.createMatchType = function(matchType,myFunction) {
	var url = APIUtils.URLS.getCreateMatchTypeURL(matchType);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateMatchType = function(matchType,myFunction) {
	var url = APIUtils.URLS.getUpdateMatchTypeURL(matchType);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteMatchType = function(matchType,myFunction) {
	var url = APIUtils.URLS.getDelMatchTypeURL(matchType);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getMatchTypes = function(myFunction) {
	var url = APIUtils.URLS.getAllMatchTypeURL();
	callAjax(url,null,"GET",myFunction);
}




APIUtils.createBowlingStyle = function(bowlingStyle,myFunction) {
	var url = APIUtils.URLS.getCreateBowlingStyleURL(bowlingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateBowlingStyle = function(bowlingStyle,myFunction) {
	var url = APIUtils.URLS.getUpdateBowlingStyleURL(bowlingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteBowlingStyle = function(bowlingStyle,myFunction) {
	var url = APIUtils.URLS.getDelBowlingStyleURL(bowlingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getBowlingStyles = function(myFunction) {
	var url = APIUtils.URLS.getAllBowlingStyleURL();
	callAjax(url,null,"GET",myFunction);
}




APIUtils.createBattingStyle = function(battingStyle,myFunction) {
	var url = APIUtils.URLS.getCreateBattingStyleURL(battingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateBattingStyle = function(battingStyle,myFunction) {
	var url = APIUtils.URLS.getUpdateBattingStyleURL(battingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteBattingStyle = function(battingStyle,myFunction) {
	var url = APIUtils.URLS.getDelBattingStyleURL(battingStyle);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getBattingStyles = function(myFunction) {
	var url = APIUtils.URLS.getAllBattingStyleURL();
	callAjax(url,null,"GET",myFunction);
}






APIUtils.createPlayerRole = function(playerRole,myFunction) {
	var url = APIUtils.URLS.getCreatePlayerRoleURL(playerRole);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatePlayerRole = function(playerRole,myFunction) {
	var url = APIUtils.URLS.getUpdatePlayerRoleURL(playerRole);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deletePlayerRole = function(playerRole,myFunction) {
	var url = APIUtils.URLS.getDelPlayerRoleURL(playerRole);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getPlayerRoles = function(myFunction) {
	var url = APIUtils.URLS.getAllPlayerRoleURL();
	callAjax(url,null,"GET",myFunction);
}






APIUtils.createUmpire = function(umpire,myFunction) {
	var url = APIUtils.URLS.getCreateUmpireURL(umpire);
	//console.log("------------**************"+url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateUmpire = function(umpire,myFunction) {
	var url = APIUtils.URLS.getUpdateUmpireURL(umpire);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteUmpire = function(umpireId,myFunction) {
	var url = APIUtils.URLS.getDelUmpireURL(umpireId);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getUmpires = function(myFunction) {
	var url = APIUtils.URLS.getAllUmpireURL();
	callAjax(url,null,"GET",myFunction);
}





APIUtils.createTournamentHasTeam= function(tournamentHasTeam,myFunction) {
	var url = APIUtils.URLS.getCreateTournamentHasTeamURL(tournamentHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
     }

    APIUtils.createMultiTournamentHasTeam = function(tournamentHasTeam,myFunction) {
	var url = APIUtils.URLS.getCreateMultiTournamentHasTeamURL(tournamentHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
     }

    APIUtils.deleteTournamentHasTeam = function(tournamentHasTeam,myFunction) {
	var url = APIUtils.URLS.getDelTournamentHasTeamURL(tournamentHasTeam);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
     }

    APIUtils.getTournamentHasTeam= function(tournamentHasTeam,myFunction) {
	var url = APIUtils.URLS.getAllTournamentHasTeamURL(tournamentHasTeam);
	callAjax(url,null,"GET",myFunction);
     }
    
    //getTournamentHasTeamByTournamentURL
    
    APIUtils.getTournamentHasTeamByTournament= function(tournamentId,myFunction) {
    	var url = APIUtils.URLS.getTournamentHasTeamByTournamentURL(tournamentId);
    	console.log(url)
    	callAjax(url,null,"GET",myFunction);
         }
    
    
    
    APIUtils.createTeamHasPlayer= function(teamHasPlayer,myFunction) {
    	var url = APIUtils.URLS.getCreateTeamHasPlayerURL(teamHasPlayer);
    	//console.log(url)
    	callAjax(url,null,"GET",myFunction);
    }

    APIUtils.createMultiTeamHasPlayer = function(teamHasPlayer,myFunction) {
    	var url = APIUtils.URLS.getCreateMultiTeamHasPlayerURL(teamHasPlayer);
    	console.log(url)
    	callAjax(url,null,"GET",myFunction);
    }

    APIUtils.deleteTeamHasPlayer = function(teamHasPlayer,myFunction) {
    	var url = APIUtils.URLS.getDelTeamHasPlayerURL(teamHasPlayer);
    	console.log(url)
    	callAjax(url,null,"GET",myFunction);
    }

    APIUtils.getTeamHasPlayer= function(teamHasPlayer,myFunction) {
    	var url = APIUtils.URLS.getAllTeamHasPlayerURL(teamHasPlayer);
    	callAjax(url,null,"GET",myFunction);
    }
    
    APIUtils.getTeamHasPlayerByTeamId= function(teamHasPlayer,myFunction) {
    	var url = APIUtils.URLS.getAllTeamHasPlayerByTeamIdURL(teamHasPlayer);
    	callAjax(url,null,"GET",myFunction);
    }

// TournamentHasPlayer

APIUtils.createTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getCreateTournamentHasPlayerURL(tournamentHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getUpdateTournamentHasPlayerURL(tournamentHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getDelTournamentHasPlayerURL(tournamentHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getAllTournamentHasPlayerURL(tournamentHasPlayer);
	callAjax(url,null,"GET",myFunction);
}

APIUtils.createMultiTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getCreateMultiTournamentHasPlayerURL(tournamentHasPlayer);
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTourTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getAllByTourTournamentHasPlayerURL(tournamentHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTeamTournamentHasPlayer = function(tournamentHasPlayer,myFunction) {
	var url = APIUtils.URLS.getAllByTeamTournamentHasPlayerURL(tournamentHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//Category

APIUtils.createCategory = function(category,myFunction) {
	var url = APIUtils.URLS.getCreateCategoryURL(category);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateCategory = function(category,myFunction) {
	var url = APIUtils.URLS.getUpdateCategoryURL(category);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteCategory = function(category,myFunction) {
	var url = APIUtils.URLS.getDelCategoryURL(category);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getCategory = function(myFunction) {
	var url = APIUtils.URLS.getAllCategoryURL();
//	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//country

APIUtils.getCountry = function(myFunction) {
	var url = APIUtils.URLS.getAllCountryURL();
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//match

APIUtils.createMatch = function(match,myFunction) {
	var url = APIUtils.URLS.getCreateMatchURL(match);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateMatch = function(match,myFunction) {
	var url = APIUtils.URLS.getUpdateMatchURL(match);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteMatch = function(match,myFunction) {
	var url = APIUtils.URLS.getDelMatchURL(match);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getMatch = function(myFunction) {
	var url = APIUtils.URLS.getAllMatchURL();
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTourMatch = function(match,myFunction) {
	var url = APIUtils.URLS.getAllByTourMatchURL(match);
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getMatchDetails = function(match,myFunction) {
	var url = APIUtils.URLS.getMatchDetailURL(match);
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTournamentIdMatch = function(match,myFunction) {
	var url = APIUtils.URLS.getAllByTournamentIdMatchURL(match);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//match_has_team

APIUtils.createMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getCreateMatchHasTeamURL(matchHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.createMultiMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getCreateMultiMatchHasTeamURL(matchHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getDelMatchHasTeamURL(matchHasTeam);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getAllMatchHasTeamURL(matchHasTeam);
	//alert(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getByMatchMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getAllByMatchMatchHasTeamURL(matchHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updateScoreMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getUpdateScoreMatchHasTeamURL(matchHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updateMatchHasTeam = function(matchHasTeam,myFunction) {
	var url = APIUtils.URLS.getUpdateMatchHasTeamURL(matchHasTeam);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.createMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getCreateMatchHasPlayerURL(matchHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.createMultiMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getCreateMultiMatchHasPlayerURL(matchHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.deleteMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getDelMatchHasPlayerURL(matchHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updateMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getUpdateMatchHasPlayerURL(matchHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getMatchHasPlayer = function(myFunction) {
	var url = APIUtils.URLS.getAllByTourMatchHasPlayerURL();
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getByMatchMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getAllByMatchMatchHasPlayerURL(matchHasPlayer);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}
//getAllByMatchAndTeamMatchHasPlayerURL
APIUtils.getMatchHasPlayerByMatchAndTeam = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getAllByMatchAndTeamMatchHasPlayerURL(matchHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updateScoreMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getUpdateScoreMatchHasPlayerURL(matchHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updatecaptainMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getUpdateCaptainMatchHasPlayerURL(matchHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatekeeperMatchHasPlayer = function(matchHasPlayer,myFunction) {
	var url = APIUtils.URLS.getUpdateKeeperMatchHasPlayerURL(matchHasPlayer);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}



function callAjax(url,obj,type,calback){
	//console.log(url);
	var respObj = {};
	var xhttp;
	//console.log(url)
	xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
//			console.log(xhttp.responseText)
			try{
				var obj = JSON.parse(xhttp.responseText);
				if(obj.status=="true"){
					respObj.status = "success";
					respObj.data = obj;
					calback(respObj);
					//sysncLines();
				}else{
					respObj.status = "failed";
					respObj.data = obj.msg;
					calback(respObj);
				}
			}catch(e){
				respObj.status = "failed";
				respObj.data = e.message;
				calback(respObj);
			}
			
			
		}
	};
	//'Content-Type': 'application/x-www-form-urlencoded'
	
	xhttp.open(type, url, true);
if(type.toLowerCase()=="post")
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(obj);
}

APIUtils.createPlayer = function(player,myFunction) {
	var url = APIUtils.URLS.getCreatePlayerURL(player);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatePlayer = function(player,myFunction) {
	var url = APIUtils.URLS.getUpdatePlayerURL(player);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deletePlayer = function(player,myFunction) {
	var url = APIUtils.URLS.getDelPlayerURL(player);
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getPlayers = function(myFunction) {
	var url = APIUtils.URLS.getAllPlayerURL();
	callAjax(url,null,"GET",myFunction);
}
//venue
APIUtils.createVenue = function(venue,myFunction) {
	var url = APIUtils.URLS.getCreateVenueURL(venue);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateVenue = function(venue,myFunction) {
	var url = APIUtils.URLS.getUpdateVenueURL(venue);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteVenue = function(venue,myFunction) {
	var url = APIUtils.URLS.getDelVenueURL(venue);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getVenue = function(myFunction) {
	var url = APIUtils.URLS.getAllVenueURL();
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getByCountryVenue = function(venue,myFunction) {
	var url = APIUtils.URLS.getAllByCountryVenueURL(venue);
	callAjax(url,null,"GET",myFunction);
}
//pictures
APIUtils.createPictures = function(pictures,myFunction) {
	var url = APIUtils.URLS.getCreatePicturesURL(pictures);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatePictures = function(pictures,myFunction) {
	var url = APIUtils.URLS.getUpdatePicturesURL(pictures);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deletePictures = function(pictures,myFunction) {
	var url = APIUtils.URLS.getDelPicturesURL(pictures);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getPictures = function(myFunction) {
	var url = APIUtils.URLS.getAllPicturesURL();
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTypePictures = function(pictures,myFunction) {
	var url = APIUtils.URLS.getAllByTypePicturesURL(pictures);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//video.php
APIUtils.createVideos = function(videos,myFunction) {
	var url = APIUtils.URLS.getCreateVideosURL(videos);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateVideos = function(videos,myFunction) {
	var url = APIUtils.URLS.getUpdateVideosURL(videos);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteVideos = function(videos,myFunction) {
	var url = APIUtils.URLS.getDelVideosURL(videos);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getVideos = function(myFunction) {
	var url = APIUtils.URLS.getAllVideosURL();
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getByTypeVideos = function(videos,myFunction) {
	var url = APIUtils.URLS.getAllByTypeVideosURL(videos);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

// points
APIUtils.createPointsConfiguration = function(points,myFunction) {
	var url = APIUtils.URLS.getCreatePointsConfigureURL(points);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatePointsConfiguration = function(points,myFunction) {
	var url = APIUtils.URLS.getUpdatePointsConfigureURL(points);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.delPointsConfiguration = function(points,myFunction) {
	var url = APIUtils.URLS.getDeletePointsConfigureURL(points);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.getListPointsConfiguration = function(myFunction) {
	var url = APIUtils.URLS.getListPointsConfigureURL();
	// console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.listByTourPointsConfiguration = function(points,myFunction) {
	var url = APIUtils.URLS.getListByTourPointsConfigureURL(points);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
//user
APIUtils.createUser = function(user,myFunction) {
	var url = APIUtils.URLS.getCreateUserURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

//getUpdateUserURL
APIUtils.updateUser = function(user,myFunction) {
	var url = APIUtils.URLS.getUpdateUserURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.deleteUser = function(uId,myFunction) {
	var url = APIUtils.URLS.getDeleteUserURL(uId);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.getUserList = function(myFunction) {
	var url = APIUtils.URLS.getListURL();
	//console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updatePassword = function(user,myFunction) {
	var url = APIUtils.URLS.getUpdatePasswordURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.forgotPassword = function(user,myFunction) {
	var url = APIUtils.URLS.getForgotPasswordURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.changePassword = function(user,myFunction) {
	var url = APIUtils.URLS.getChangePasswordURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.login = function(user,myFunction) {
	var url = APIUtils.URLS.getLoginURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.detailById = function(user,myFunction) {
	var url = APIUtils.URLS.getDetailByIdURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}
APIUtils.updateUdId = function(user,myFunction) {
	var url = APIUtils.URLS.getUpdateUdIdURL(user);
	console.log(url)
	callAjax(url,null,"GET",myFunction);
}

APIUtils.updateScoreCard = function(obj,myFunction) {
	var url = APIUtils.URLS.getScorecardURL();
	console.log(url);
	console.log("Object ::::::::"+JSON.stringify(obj))
	var parm = "requester="+JSON.stringify(obj);
	callAjax(url,parm,"POST",myFunction);
}


