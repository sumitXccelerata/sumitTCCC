if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Main = function(container, config) {
	this.$container = $(container);
	this.$linksContainer = this.$container.find(".linksContainer");
	this.config = config;
	this.blankPageTemplate = this.$container.html();
	var tournamentGroupName = config["data-group"] || "worldt20";
	this.tournamentGroup = WidgetController.getTournamentByName(tournamentGroupName);
	this.setMatchFromUrl();
	if (PULSE.CLIENT.isTest()) this.tournament.scorecardOnly = false;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.customer = this.match.customer = "icc";
	this.$mcHeader = this.$container.find(".mcHeaderName");
	PULSE.SpeedModeController.setMode(PULSE.SpeedModeController.MODE_KMH);
	this.match.startScoringFeed();
	this.initTopSection();
	this.components.matchSummary.activate();
	this.components.scoreboard.activate();
	this.initTabs();
	this.setEventListeners();
	this.setSubscriptions();
	this.playerLookup = new PULSE.CLIENT.CRICKET.PlayerLookup(this.match);
	this.matchEvents = new PULSE.CLIENT.CRICKET.MC.MatchEvents(this.match)
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success) {
			that.$mcHeader.html("\x3cstrong\x3e" + (that.match.tournament.fullName || that.match.getTournamentLabel()) + "\x3c/strong\x3e Match Centre");
			if (!that.match.tournament.matchTypes) that.match.tournament.matchTypes = [that.match.getMatchType()]
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.setMatchFromUrl = function() {
	var url = window.location.href,
		rootUrl = url.split("?")[0].split("#")[1] || url.split("?")[0],
		splitBySlash = rootUrl.split("/"),
		matchNumber = splitBySlash[splitBySlash.length - 1],
		tid = this.config["data-season"] || splitBySlash[splitBySlash.length - 2];
	matchNumber = parseInt(matchNumber, 10);
	if (!isNaN(matchNumber) && matchNumber < 10) matchNumber = "0" + matchNumber;
	this.params = PULSE.CLIENT.Util.parseUrlParameters();
	if (this.params.tid && this.params.m) {
		tid = this.params.tid;
		matchNumber = this.params.m
	}
	if (this.config["data-season"]) tid = this.config["data-season"];
	this.tournament = window.WidgetController.getTournamentByName(tid);
	this.matchId = this.config["data-match-id"] || tid + "-" + matchNumber;
	this.match = new PULSE.CLIENT.CRICKET.Match(this.tournament, this.matchId);
	this.tournament.matches[this.matchId] = this.match
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.setEventListeners = function() {
	var that = this;
	$(window).resize(function() {
		if ($(window).width() > 860) that.closeMenu()
	});
	this.$linksContainer.on("click", ".back a", function(e) {
		e.preventDefault();
		var url = HH && HH.Params ? HH.Params.baseUrl + "/" + HH.Params.websiteUrl : undefined;
		if (url) window.open(url, "_self")
	});
	this.$linksContainer.on("click", "a.close", function(e) {
		e.preventDefault();
		that.closeMenu()
	});
	this.$linksContainer.on("click", "a.matches", function() {
		that.closeMenu();
		that.components.matchNavigator.activate()
	});
	this.$container.on("click", ".mainNavBtn", function() {
		if (!that.match.tournament.scorecardOnly) that.$linksContainer.addClass("open");
		else that.components.matchNavigator.activate()
	});
	this.$container.on("click", ".mcHomeButton", function(e, params) {
		e.preventDefault();
		window.location.href = "/" + that.tournament.urlRoot + "/"
	});
	this.$container.on("click", ".todayButton", function(e, params) {
		if (!that.components.todayPanel.isActive()) {
			that.components.matchSummary.deactivate();
			that.components.scoreboard.deactivate();
			that.components.todayPanel.activate()
		} else {
			that.components.matchSummary.activate();
			that.components.scoreboard.activate();
			that.components.todayPanel.deactivate()
		}
		$(this).toggleClass("open", that.components.todayPanel.isActive());
		e.preventDefault()
	});
	this.$container.on("click", ".eovMoreButton", function(e, params) {
		e.preventDefault();
		var $players = $(this).parent().parent().find(".overPlayers");
		if ($players.is(":visible")) {
			$players.hide();
			$(this).html('\x3cp\x3eMore\x3c/p\x3e\x3ci class\x3d"icon-angle-down"\x3e\x3c/i\x3e')
		} else {
			$players.show();
			$(this).html('\x3cp\x3eClose\x3c/p\x3e\x3ci class\x3d"icon-angle-up"\x3e\x3c/i\x3e')
		}
	});
	$("body").on("load/match", function(e, params) {
		var matchId = params.matchId;
		that.switchToMatch(matchId)
	})
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.initTopSection = function() {
	var templates = {
		scoreboard: {
			live: "templates/wt20/mc/scoreboard-live.html",
			prematch: "templates/wt20/mc/scoreboard-prematch.html"
		}
	};
	this.components = {
		matchSummary: new PULSE.CLIENT.CRICKET.MC.MatchSummary(this.$container.find(".matchSummary"), this.match),
		poll: new PULSE.CLIENT.CRICKET.MC.Poll(this.$container.find(".fanPoll"), this.$container.find(".fanPollBtn"), this.match),
		scoreboard: new PULSE.CLIENT.CRICKET.MC.Scoreboard(this.$container.find(".scoreboardContainer"), this.match, templates.scoreboard),
		sharing: new PULSE.CLIENT.CRICKET.MC.Sharing(this.$container.find(".shareBtn"), {}),
		todayPanel: new PULSE.CLIENT.CRICKET.MC.TodayPanel(this.$container.find(".matchesToday"), this.match.tournament, this.$container.find(".todayButton")),
		preMatchPanel: new PULSE.CLIENT.CRICKET.MC.PreMatchPanel(this.$container.find(".pre-match-panel"), this.match, this.tournamentGroup)
	}
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.initTabs = function() {
	this.tabController = new PULSE.CLIENT.CRICKET.MC.TabController(this.$container, this.match)
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.updateMatchStreamIcon = function() {
	if (this.match.getMatchState() === "L") $(".matchStream .liveIcon").show();
	else $(".matchStream .liveIcon").hide()
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.closeMenu = function() {
	this.$linksContainer.removeClass("open")
};
PULSE.CLIENT.CRICKET.MC.Main.prototype.switchToMatch = function(matchId) {
	var match = this.tournament.matches[matchId],
		link = match.getMatchLink(),
		Modernizr = Modernizr || undefined;
	if (Modernizr && Modernizr.history) {
		this.$container.html(this.blankPageTemplate);
		history.pushState(null, null, link);
		WidgetController.resetWidgets()
	} else window.open(link, "_self")
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Tab = function() {};
PULSE.CLIENT.CRICKET.MC.Tab.prototype.getName = function() {};
PULSE.CLIENT.CRICKET.MC.Tab.prototype.activate = function() {};
PULSE.CLIENT.CRICKET.MC.Tab.prototype.deactivate = function() {};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TabController = function($container, match) {
	this.$container = $container;
	this.match = match;
	this.$linksContainer = this.$container.find(".linksContainer");
	this.$linksList = this.$linksContainer.find(".links");
	this.$tabs = this.$container.find(".contentTab");
	if (!this.match.tournament.scorecardOnly) {
		this.tabs = [new PULSE.CLIENT.CRICKET.MC.OverviewTab("Overview", this.$container.find("#overviewContent"), this.match), new PULSE.CLIENT.CRICKET.MC.DetailsTab("Match Details", this.$container.find("#detailsContent"), this.match), new PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab("Scorecard", this.$container.find("#scorecardContent"), this.match)];
		this.tabs.push(new PULSE.CLIENT.CRICKET.MC.TeamsTab("Teams", this.$container.find("#teamsContent"), this.match));
		this.tabs.push(new PULSE.CLIENT.CRICKET.MC.VideoTab("Video", this.$container.find("#videosContent"), this.match));
		this.tabs.push(new PULSE.CLIENT.CRICKET.MC.PhotosTab("Photostream", this.$container.find("#photostreamContent"), this.match));
		if (!this.match.tournament.mcDefaults || !this.match.tournament.mcDefaults.noHawkeye) this.tabs.push(new PULSE.CLIENT.CRICKET.MC.HawkeyeTab("Hawk-Eye", this.$container.find("#hawkeyeContent"), this.match))
	} else {
		$(".mainNav").hide();
		this.tabs = [new PULSE.CLIENT.CRICKET.MC.MinimalTab("Overview", this.$container.find("#overviewContent"), this.match)]
	} if (this.match.tournament.tournamentName === "worldt20-2016") this.$container.find(".live-audio-button").removeClass("inactive");
	this.initNav();
	this.setSubscriptions();
	this.switchToTab(this.getDefaultTab(), true)
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.initNav = function() {
	var that = this,
		$tabButtons = this.$linksContainer.find("a.nav[data-tab]");
	this.menuScroller = new PULSE.CLIENT.UI.Scroller(this.$linksList);
	$tabButtons.each(function() {
		$(this).on("click", function(e) {
			var tabName = $(this).attr("data-tab");
			that.switchToTab(tabName);
			that.$linksContainer.removeClass("open");
			e.preventDefault()
		})
	})
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.getDefaultTab = function() {
	if (!this.match.tournament.scorecardOnly && this.tabs.length > 1) {
		var params = PULSE.CLIENT.Util.parseUrlParameters();
		if (params.tab) {
			var index = this.getTabIndex(params.tab);
			if (index > -1) return index
		}
	}
	return this.getTabIndex("overview")
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.switchToTab = function(selectedTab, dontTrack) {
	if (typeof selectedTab === "string") selectedTab = this.getTabIndex(selectedTab);
	for (var i = 0, iLimit = this.tabs.length; i < iLimit; i++) {
		var tab = this.tabs[i];
		if (i !== selectedTab) this.tabs[i].deactivate()
	}
	var $tabButtons = this.$container.find("a.nav");
	$tabButtons.removeClass("active");
	var tabName = this.tabs[selectedTab].getName();
	var $selectedButton = this.$container.find('a.nav[data-tab\x3d"' + tabName + '"]');
	$selectedButton.addClass("active");
	var button_left = $selectedButton.offset().left;
	var list_left = this.$linksList[0].scrollLeft;
	var container_width = this.$linksList.width();
	var button_width = $selectedButton.outerWidth(true);
	this.menuScroller.scrollTo(list_left + (button_left - (container_width / 2 - button_width / 2)));
	this.tabs[selectedTab].activate()
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.getTabIndex = function(name) {
	var tabNames = $.map(this.tabs, function(tab, i) {
		return tab.getName()
	});
	var tabName = PULSE.Levenshtein.bestMatch(tabNames, name);
	if (tabName) return _.indexOf(tabNames, tabName);
	else return -1
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.getTabByName = function(name) {
	var index = this.getTabIndex(name);
	return this.tabs[index]
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.addTab = function(tab, index) {
	if (tab instanceof PULSE.CLIENT.CRICKET.MC.Tab)
		if (typeof index !== "undefined" && Math.abs(index) < this.tabs.length) {
			index = index < 0 ? this.tabs.length + index : index;
			this.tabs.splice(index, 0, tab)
		} else this.tabs.push(tab)
};
PULSE.CLIENT.CRICKET.MC.TabController.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("play/video", function(e, params) {
		var id = params.id,
			tab = that.getTabByName("Videos");
		that.switchToTab("Videos");
		tab.components.hero.refreshVideoPlayer(id)
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InningsBreak = function(container, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.templates = {
		stats: "templates/wt20/mc/innings-stats.html"
	};
	this.components = {
		stats: new PULSE.CLIENT.CRICKET.MC.InningsStats(this.$container.find(".inningsStatsContainer"), this.match, this.templates),
		photos: new PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos(this.$container.find(".inningsBreakPhotos"), this.match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.InningsBreak.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (that.match.isInInningsBreak()) that.activate();
		else that.deactivate()
	})
};
PULSE.CLIENT.CRICKET.MC.InningsBreak.prototype.activate = function() {
	if (this.match.isInInningsBreak()) {
		for (var name in this.components) this.components[name].activate();
		this.$container.show()
	}
};
PULSE.CLIENT.CRICKET.MC.InningsBreak.prototype.deactivate = function() {
	for (var name in this.components) this.components[name].deactivate();
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos = function($container, match) {
	this.$container = $container;
	this.match = match;
	this.limit = 4;
	this.template = "templates/wt20/mc/innings-photos.html";
	this.setSubscriptions();
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/photos", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.active) {
			that.modalId = that.match.getModalTheatre().Id;
			that.render()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos.prototype.render = function() {
	var model = this.match.getMatchPhotosModel(this.limit);
	PULSE.CLIENT.Template.publish(this.template, this.$container, model);
	this.$container.toggle(model.photos.length > 0)
};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos.prototype.activate = function() {
	this.match.getPhotosData(true);
	this.active = true
};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos.prototype.deactivate = function() {
	this.match.stopPhotosData();
	this.active = false;
	this.$container.hide()
};
PULSE.CLIENT.CRICKET.MC.InningsBreakPhotos.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".supersizedModal", function(e) {
		e.preventDefault();
		var supersized_photomodal = new PULSE.CLIENT.SUPERSIZED("#photomodal"),
			$el = $(this),
			position = $el.index() + 1,
			actionUrl = $(this).attr("data-action-url");
		supersized_photomodal.openModal(that.modalId, position, actionUrl)
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.HeadToHead = function($container, match, tournamentGroup, template) {
	this.$container = $container;
	this.match = match;
	this.tournamentGroup = tournamentGroup;
	this.template = template;
	this.msModel = new PULSE.CLIENT.CRICKET.AllMatches;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.match.tournament);
	var MS_IDS = this.urlGenerator.getMSIds();
	var matchTypes = [MS_IDS[this.match.getMatchType()]];
	this.filters = {
		"ms": this.tournamentGroup.tournamentName,
		"mt": matchTypes,
		"te": [this.match.getTeamId(0),
			this.match.getTeamId(1)
		],
		"s": ["C"],
		"p": 1,
		"ps": 100,
		"o": ["cd"],
		"se": true,
		"ta": true
	};
	this.feedId = "team-head-to-head-metaschedule-data";
	this.msModel.requestMetaScheduleData({
		feedName: this.feedId,
		params: this.filters
	}, true);
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.HeadToHead.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("metaSchedule/data", function(e, params) {
		if (params.success && params.id === that.feedId) that.render()
	})
};
PULSE.CLIENT.CRICKET.MC.HeadToHead.prototype.render = function() {
	var matchesModel = this.msModel.getMatchesModel();
	var team1 = this.match.getTeam(0);
	var team2 = this.match.getTeam(1);
	var model = {
		matches: matchesModel.matches.length,
		team1: team1,
		team2: team2,
		team1won: matchesModel.matches.length ? 0 : "-",
		team2won: matchesModel.matches.length ? 0 : "-",
		other: matchesModel.matches.length ? 0 : "-"
	};
	for (var i = 0, iLimit = matchesModel.matches.length; i < iLimit; i++) {
		var match = matchesModel.matches[i];
		if (match.team1won && team1.id == match.team1id || match.team2won && team1.id == match.team2id) model.team1won++;
		else if (match.team1won && team2.id == match.team1id || match.team2won && team2.id == match.team2id) model.team2won++;
		else model.other++
	}
	PULSE.CLIENT.Template.publish(this.template, this.$container, model)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.MatchTeamRankings = function($container, match, templates) {
	this.$container = $container;
	this.match = match;
	this.templates = $.extend({
		teamRankings: "unset",
		headerOnly: "unset"
	}, templates);
	this.rankingsModel = new PULSE.CLIENT.CRICKET.RankingsModels;
	this.gender = this.match.matchId.search("women") > -1 ? "women" : "men";
	this.rankingsModel.getRankingsData(this.gender);
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.MatchTeamRankings.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("rankings/update", function(e, params) {
		if (params.success) that.render()
	})
};
PULSE.CLIENT.CRICKET.MC.MatchTeamRankings.prototype.render = function() {
	var allDataModels = this.rankingsModel.getRankingsModel(this.gender);
	var rankings = [];
	var matchType = this.match.getMatchType();
	this.$container[0].innerHTML = "";
	var team1 = this.match.getTeam(0);
	var team2 = this.match.getTeam(1);
	if (this.gender === "men") {
		switch (matchType) {
			case "T20I":
			case "WT20":
				matchType = "T20I";
				break;
			case "ODI":
			case "CWC":
				matchType = "ODI";
				break;
			case "TEST":
				matchType = "TEST";
				break;
			default:
				matchType = "";
				break
		}
		rankings = allDataModels[matchType]
	} else {
		PULSE.CLIENT.Template.publish(this.templates.headerOnly, this.$container, {
			team1: team1,
			team2: team2
		});
		rankings = allDataModels["All"]
	}
	var team1model = this.rankingsModel.getTeamRankings(rankings, team1.fullName);
	var team2model = this.rankingsModel.getTeamRankings(rankings, team2.fullName);
	PULSE.CLIENT.Template.append(this.templates.teamRankings, this.$container, {
		rankingType: this.gender === "men" ? matchType : "",
		team1: team1model || {},
		team2: team2model || {}
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.PreMatchPanel = function($container, match, tournamentGroup, templates) {
	this.$container = $container;
	this.match = match;
	this.tournamentGroup = tournamentGroup;
	this.templates = $.extend({
		headToHead: "templates/wt20/mc/prematch/head-to-head.html",
		teamForm: "templates/wt20/mc/prematch/team-form.html",
		teamRankings: "templates/wt20/mc/prematch/team-rankings.html",
		headerOnly: "templates/wt20/mc/prematch/header-only.html"
	}, templates || {});
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.PreMatchPanel.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success)
			if (that.match.getMatchState() === "U") {
				if (!that.initialised) that.init()
			} else that.deactivate()
	})
};
PULSE.CLIENT.CRICKET.MC.PreMatchPanel.prototype.init = function() {
	var $teamForm = this.$container.find(".team-form-container");
	var gender = this.match.matchId.search("women") > -1 ? "w" : "m";
	this.components = {
		team1Form: new PULSE.CLIENT.CRICKET.MC.TeamForm($teamForm.eq(0), 0, this.match, "icc", this.templates.teamForm),
		team2Form: new PULSE.CLIENT.CRICKET.MC.TeamForm($teamForm.eq(1), 1, this.match, "icc", this.templates.teamForm),
		headToHead: gender === "m" ? new PULSE.CLIENT.CRICKET.MC.HeadToHead(this.$container.find(".head-to-head-container"), this.match, this.tournamentGroup, this.templates.headToHead) : undefined,
		teamRankings: new PULSE.CLIENT.CRICKET.MC.MatchTeamRankings(this.$container.find(".team-rankings-container"), this.match, {
			teamRankings: this.templates.teamRankings,
			headerOnly: this.templates.headerOnly
		})
	};
	this.$container.show();
	this.initialised = true
};
PULSE.CLIENT.CRICKET.MC.PreMatchPanel.prototype.deactivate = function() {
	this.$container.hide();
	this.initialised = false
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TeamForm = function($container, teamIndex, match, metaschedule, template) {
	this.$container = $container;
	this.match = match;
	this.teamIndex = teamIndex;
	this.teamId = this.match.getTeamId(this.teamIndex);
	this.metaschedule = metaschedule || "icc";
	this.template = template;
	this.limit = 5;
	this.msModel = new PULSE.CLIENT.CRICKET.AllMatches;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.match.tournament);
	var MS_IDS = this.urlGenerator.getMSIds();
	var matchTypes = [MS_IDS[this.match.getMatchType()]];
	this.filters = {
		"ms": this.metaschedule,
		"mt": matchTypes,
		"te": [this.teamId],
		"s": ["C"],
		"p": 1,
		"ps": this.limit,
		"o": ["cd"],
		"se": true
	};
	this.feedId = "team-form-metaschedule-data-" + this.teamId;
	this.msModel.requestMetaScheduleData({
		feedName: this.feedId,
		params: this.filters
	}, true);
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.TeamForm.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("metaSchedule/data", function(e, params) {
		if (params.success && params.id === that.feedId) that.render()
	})
};
PULSE.CLIENT.CRICKET.MC.TeamForm.prototype.render = function() {
	var model = {
		team: {
			id: this.teamId,
			fullName: this.match.getFullName(this.teamIndex),
			shortName: this.match.getShortName(this.teamIndex),
			abbreviation: this.match.getTeamAbbr(this.teamIndex)
		},
		formEntries: []
	};
	var that = this;
	var matchesModel = this.msModel.getMatchesModel();
	model.formEntries = $.map(matchesModel.matches, function(match) {
		var entry = {
			match: match,
			summary: that.getMatchSummary(match),
			won: false,
			lost: false
		};
		if (match.team1id === that.teamId && match.team1won || match.team2id === that.teamId && match.team2won) entry.won = true;
		else if (match.team1id === that.teamId && match.team2won || match.team2id === that.teamId && match.team1won) entry.lost = true;
		return entry
	});
	PULSE.CLIENT.Template.publish(this.template, this.$container, model)
};
PULSE.CLIENT.CRICKET.MC.TeamForm.prototype.getMatchSummary = function(match) {
	var splitSummary = match.matchSummary.split(" (");
	if (splitSummary.length > 1 && match.matchSummary.search("D/L") === -1) splitSummary.pop();
	return splitSummary.join(" (")
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.MatchEvents = function(match) {
	this.match = match;
	this.events = {
		"partnership": [50, 100, 150, 200, 250],
		"player-score": [50, 100, 150, 200, 250]
	};
	this.players = {};
	this.batsmen = [];
	this.fifties = [];
	this.hundreds = [];
	this.partnership = undefined;
	this.wickets = [];
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.match.getMatchState() === "L") that.inspectMatch()
	})
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.inspectMatch = function() {
	this.checkPlayerScores();
	this.checkPartnership();
	this.checkWickets();
	this.checkNewBatsmen();
	if (!this.firstRun) this.firstRun = true
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.checkPartnership = function() {
	var partnership = this.match.getCurrentPartnership();
	if (!partnership) partnership = 0;
	if (partnership !== this.partnership) {
		for (var i = 0, iLimit = this.events["partnership"].length; i < iLimit; i++) {
			var threshold = this.events["partnership"][i];
			if (this.partnership < threshold && partnership >= threshold) {
				console.log("match event: partnership " + threshold);
				PULSE.CLIENT.notify("match/event", {
					type: "partnership",
					count: threshold
				});
				break
			}
		}
		this.partnership = partnership
	}
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.checkWickets = function() {
	var cii = this.match.getCurrentInningsIndex();
	var fow = this.match.getFOW(cii);
	if (!fow) return;
	if (!this.wicketsInitialised) {
		var striker = this.match.getCurrentFacingBatsman();
		var nonStriker = this.match.getCurrentNonFacingBatsman();
		if (!striker || !nonStriker) {
			console.log("match event: wicket " + _.last(fow).id);
			PULSE.CLIENT.notify("match/event", {
				type: "wicket",
				playerId: _.last(fow).id
			})
		}
		for (var i = 0, iLimit = fow.length; i < iLimit; i++) {
			var wicket = fow[i];
			this.wickets.push(wicket.id)
		}
		this.wicketsInitialised = true
	} else {
		var newWickets = [];
		for (var i = 0, iLimit = fow.length; i < iLimit; i++) {
			var wicket = fow[i];
			if (-1 === _.indexOf(this.wickets, wicket.id)) {
				newWickets.push(wicket.id);
				console.log("match event: wicket " + wicket.id);
				PULSE.CLIENT.notify("match/event", {
					type: "wicket",
					playerId: wicket.id
				});
				this.wickets.push(wicket.id)
			}
		}
	}
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.checkPlayerScores = function() {
	var striker = this.match.getCurrentFacingBatsman();
	var nonStriker = this.match.getCurrentNonFacingBatsman();
	if (striker) {
		this.comparePlayerStats(striker);
		this.facingBatsman = striker.id
	}
	if (nonStriker) {
		this.comparePlayerStats(nonStriker);
		this.nonFacingBatsman = nonStriker.id
	}
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.comparePlayerStats = function(player) {
	if (this.players[player.id])
		for (var i = 0, iLimit = this.events["player-score"].length; i < iLimit; i++) {
			var threshold = this.events["player-score"][i];
			if (this.players[player.id].runs < threshold && player.runs >= threshold) {
				console.log("match event: " + player.fullName + " " + threshold + " runs");
				PULSE.CLIENT.notify("match/event", {
					type: "player-score",
					playerId: player.id,
					count: threshold
				});
				break
			}
		} else if (this.firstRun) PULSE.CLIENT.notify("match/event", {
			type: "new-batsman",
			playerId: player.id
		});
	this.players[player.id] = player
};
PULSE.CLIENT.CRICKET.MC.MatchEvents.prototype.checkNewBatsmen = function() {
	var striker = this.match.getCurrentFacingBatsman();
	var nonStriker = this.match.getCurrentNonFacingBatsman();
	if (!this.newBatsmenInitialised) {
		var cii = this.match.getCurrentInningsIndex();
		var batsmen = this.match.getBatsmen(cii);
		this.batsmen = $.map(batsmen, function(batsman) {
			return batsman.id
		});
		this.newBatsmenInitialised = true
	} else {
		var newPlayer = undefined;
		if (striker && -1 === _.indexOf(this.batsmen, striker.id)) newPlayer = striker;
		else if (nonStriker && -1 === _.indexOf(this.batsmen, nonStriker.id)) newPlayer = nonStriker;
		if (newPlayer) {
			this.batsmen.push(newPlayer.id);
			PULSE.CLIENT.notify("match/event", {
				type: "new-batsman",
				playerId: newPlayer.id
			})
		}
	}
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
PULSE.CLIENT.CRICKET.PlayerLookup = function(match) {
	this.match = match;
	this.tournament = this.match.tournament;
	this.setSubscriptions();
	this.tournament.getSquads(true)
};
PULSE.CLIENT.CRICKET.PlayerLookup.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("squads/update", function(e, params) {
		if (params.success && that.tournament.tournamentName === params.tournamentName) that.refreshLookup()
	})
};
PULSE.CLIENT.CRICKET.PlayerLookup.prototype.refreshLookup = function() {
	if (!this.match.playerLookup) this.match.playerLookup = {};
	if (!this.match.playersToTeams) this.match.playersToTeams = {};
	for (var i = 0, iLimit = this.tournament.squadsData.length; i < iLimit; i++) {
		var squad = this.tournament.squadsData[i];
		if (squad.players)
			for (var j = 0, jLimit = squad.players.length; j < jLimit; j++) {
				var player = squad.players[j];
				player.team = squad.team;
				this.match.playerLookup[player.id] = player
			}
	}
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Countdown = function(container, date, config) {
	this.$container = $(container);
	this.config = config;
	this.start_date = date;
	this.$countdown = this.$container;
	this.$days = this.$countdown.find(".days");
	this.$hours = this.$countdown.find(".hours");
	this.$minutes = this.$countdown.find(".minutes");
	this.$seconds = this.$countdown.find(".seconds");
	this.setCountdown()
};
PULSE.CLIENT.CRICKET.MC.Countdown.prototype.setCountdown = function() {
	var that = this;
	this.refreshTime();
	this.refreshCountdown();
	this.liveRefresh = setInterval(function() {
		that.refreshTime();
		that.refreshCountdown()
	}, 1E3)
};
PULSE.CLIENT.CRICKET.MC.Countdown.prototype.stopCountdown = function() {
	clearInterval(this.liveRefresh)
};
PULSE.CLIENT.CRICKET.MC.Countdown.prototype.refreshTime = function() {
	var now = (new Date).getTime();
	var start = (new PULSE.CLIENT.DateUtil.parseDateTime(this.start_date)).getTime();
	var time_lasting = start - now;
	if (time_lasting <= 0) {
		this.days = "00";
		this.hours = "00";
		this.minutes = "00";
		this.seconds = "00";
		this.stopCountdown()
	} else {
		this.days = Math.floor(time_lasting / 1E3 / (60 * 60 * 24));
		if (this.days < 10) this.days = "0" + this.days;
		var days_in_s = this.days * 60 * 60 * 24;
		this.hours = Math.floor((time_lasting / 1E3 - days_in_s) / (60 * 60));
		if (this.hours < 10) this.hours = "0" + this.hours;
		var hours_in_s = this.hours * 60 * 60;
		this.minutes = Math.floor((time_lasting / 1E3 - hours_in_s - days_in_s) / 60);
		if (this.minutes < 10) this.minutes = "0" + this.minutes;
		var minutes_in_s = this.minutes * 60;
		this.seconds = Math.floor(time_lasting / 1E3 - minutes_in_s - hours_in_s - days_in_s);
		if (this.seconds < 10) this.seconds = "0" + this.seconds
	}
};
PULSE.CLIENT.CRICKET.MC.Countdown.prototype.refreshCountdown = function() {
	this.$days.html(this.days + "\x3cspan\x3eDay\x3c/span\x3e");
	this.$hours.html(this.hours + "\x3cspan\x3eHrs\x3c/span\x3e");
	this.$minutes.html(this.minutes + "\x3cspan\x3eMin\x3c/span\x3e");
	this.$seconds.html(this.seconds + "\x3cspan\x3eSec\x3c/span\x3e")
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
PULSE.CLIENT.CRICKET.Hawkeye = function(selector, match) {
	this.metaLastUpdated = [];
	this.match = match;
	this.tournament = match.tournament;
	this.metadata = {};
	this.trajData = {};
	this.statsData = {};
	this.highestInnings = 1;
	this.isFirstLoad = true;
	this.$header = $(".hawkeyeHeader");
	this.params = PULSE.CLIENT.Util.parseUrlParameters();
	this.dm = PULSE.CLIENT.getDataManager();
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	var that = this;
	PULSE.CLIENT.CRICKET.Hawkeye.getInstance = function() {
		return that
	};
	graphInit();
	var ui = new PULSE.NewUI(this, false);
	this.controller = new PULSE.GraphController(ui, this);
	this.controller.active = false;
	this.getUdsMeta()
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.activate = function() {
	this.controller.active = true;
	this.controller.setGraph(this.controller.selectedGraphName)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.deactivate = function() {
	this.controller.stopRendering()
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.activateHawkeyeTab = function() {
	$(".linksContainer .links li a").each(function() {
		if ($(this).text() === "Hawk-Eye") $(this).removeClass("inactive")
	})
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getUdsMeta = function() {
	var url = this.urlGenerator.makeDataUrl("uds-meta", this.match.matchId);
	this.dm.addFeed("udsMeta", url, 30, "onUdsMeta", [this]);
	this.dm.start(url)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.onData = function(data, id) {
	if (data && "udsMeta" === id) {
		this.activateHawkeyeTab();
		this.metadata = data;
		this.playerLookup = PULSE.CLIENT.Util.CreatePlayerLookup(data.teams || []);
		if (data.lastUpdated.length > 0) {
			this.modifiedChunks = this.getUpdatedChunksNumber(data.lastUpdated);
			this.metaLastUpdated = data.lastUpdated;
			this.trajChunks = [];
			this.statsChunks = [];
			for (var i = 0; i < this.modifiedChunks.length; i++) {
				this.getUdsTraj(this.modifiedChunks[i]);
				this.getUdsStats(this.modifiedChunks[i])
			}
		}
	}
	if (data && data.fragNum && id.search("uds-traj") !== -1) {
		this.handleUdsData(data, this.trajChunks, true);
		this.hasTraj = true
	}
	if (data && data.fragNum && id.search("uds-stats") !== -1) {
		this.handleUdsData(data, this.statsChunks, false);
		this.hasStats = true
	}
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.handleUdsData = function(data, udsChunks, isTrajData) {
	var chunkNo = data.fragNum;
	this.populateData(data, isTrajData);
	udsChunks.push(chunkNo);
	if (PULSE.CLIENT.Util.isSimilarArray(udsChunks, this.modifiedChunks)) this.inform()
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getUdsTraj = function(number) {
	var url = this.urlGenerator.makeDataUrl("uds-traj-" + number, this.match.matchId);
	this.dm.removeFeed("uds-traj-" + number);
	this.dm.addFeed("uds-traj-" + number, url, 0, "onUdsTraj", [this]);
	this.dm.start(url)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getUdsStats = function(number) {
	var url = this.urlGenerator.makeDataUrl("uds-stats-" + number, this.match.matchId);
	this.dm.removeFeed("uds-stats-" + number);
	this.dm.addFeed("uds-stats-" + number, url, 0, "onUdsStats", [this]);
	this.dm.start(url)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.populateData = function(data, isTrajData) {
	if (data && data.data) {
		var bowlerSpeeds = {};
		var countingBallDelta = 0;
		var tData = data.data;
		for (var i = 0; i < tData.length; i++) {
			var obj = tData[i];
			for (var key in obj) {
				if (isTrajData) {
					var record = new PULSE.UdsTrajRecord(key, obj[key], this.playerLookup);
					this.trajData[key] = record
				} else {
					var record = new PULSE.UdsStatsRecord(key, obj[key], this.playerLookup);
					this.statsData[key] = record
				}
				var ballNum = +record.get(CricketField.BALL);
				if (ballNum === 1) countingBallDelta = 0;
				record.countingBall = ballNum - countingBallDelta;
				if (!record.get(CricketField.IS_COUNTING)) countingBallDelta++;
				var bowler = record.get(CricketField.BOWLER);
				if (!Utils.isNullish(bowler) && bowlerSpeeds[bowler] === undefined) {
					var speed = record.get(CricketField.BOWL_SPEED);
					if (!Utils.isNullish(speed)) {
						var s = +speed;
						if (s > 13) bowlerSpeeds[bowler] = s < 32 ? CricketBowlerSpeed.SPIN : CricketBowlerSpeed.SEAM
					}
				}
				var innings = record.get(CricketField.INNINGS);
				if (innings > this.highestInnings) this.highestInnings = innings
			}
		}
		this.latestTraj = data.latest
	}
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getUpdatedChunksNumber = function(lastUpdated) {
	var chunks = [];
	for (var i = 0; i < lastUpdated.length; i++)
		if (!this.metaLastUpdated[i] || this.metaLastUpdated[i] < lastUpdated[i]) chunks.push(i + 1);
	return chunks
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.inform = function() {
	if (this.getMatchType() !== this.matchType) {
		this.matchType = this.getMatchType();
		this.controller.graphProvider.setEnvironment(this.getMatchType());
		this.controller.ui.setAvailableGraphs(this.controller.graphProvider.getAvailableGraphs())
	}
	if (this.isFirstLoad) {
		this.controller.selectedInnings = this.controller.selectedInnings || this.controller.getSelectedInnings();
		this.selectedGraphIdx = this.controller.graphProvider.currentGraphIdx();
		this.scrollToPage(this.selectedGraphIdx);
		this.isFirstLoad = false
	}
	if (this.controller.isTraj) this.controller.setRawData(this.trajData);
	else this.controller.setRawData(this.statsData)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.normalise = function(xyz) {
	return {
		x: xyz.x - 10.06,
		y: xyz.y,
		z: xyz.z
	}
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getMatchType = function() {
	var mt = CricketMatchType.TEST;
	var overs = this.metadata["overs"];
	if (overs === 20) mt = CricketMatchType.T20;
	else if (overs === 50) mt = CricketMatchType.ODI;
	return mt
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getParticipants = function() {
	return [new Participant(this.metadata.teams[0].team), new Participant(this.metadata.teams[1].team)]
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getBattingTeamIndex = function(innings) {
	var order = this.metadata["battingOrder"];
	if (order && order.length >= innings) {
		var idx = order[innings - 1];
		return idx
	} else return 1
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getInningsString = function(innings) {
	var string = "";
	if (this.metadata.teams) {
		var battingIndex = this.getBattingTeamIndex(innings);
		var participant = this.getParticipants()[battingIndex];
		string = participant.fullName;
		if (this.getMatchType() === CricketMatchType.TEST) string += innings <= 2 ? " 1st" : " 2nd";
		string += " innings"
	}
	return string
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getInningsFromString = function(string) {
	var candidates = [];
	var inningsLookup = {};
	for (var i = 1, j = this.highestInnings; i <= j; i++) {
		var is = this.getInningsString(i);
		candidates.push(is);
		inningsLookup[is] = i
	}
	var matched = PULSE.Levenshtein.bestMatch(candidates, string);
	return inningsLookup[matched]
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.lookupPlayer = function(name) {
	return name
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getParameter = function(key) {
	if ("ww-sign" === key) return 1;
	else if ("ww-origin-x" === key) return -11
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.getInningsList = function() {
	var allInnings = [];
	var previousInnings = "";
	var d = this.statsData;
	for (var key in d) {
		var record = d[key];
		var s = record.get(CricketField.INNINGS);
		s = this.getInningsString(+s);
		if (s && s !== previousInnings) allInnings[allInnings.length] = s;
		previousInnings = s
	}
	return allInnings
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.scrollToPage = function(pageIdx) {
	PULSE.Tracer.info("HawkEye STP " + pageIdx + " versus " + this.selectedGraphIdx);
	var $theList = $("#thelist"),
		$selectedEle = $("#thelist").find("\x3e li").eq(pageIdx),
		$graphingDiv = this.controller.ui.graphingDiv,
		selectedGraph = $($selectedEle).find(".viewLabel").text(),
		left = this.controller.ui.getCanvasWidth() * pageIdx;
	this.$header.find(".viewLabel").text(selectedGraph);
	this.selectedGraphIdx = pageIdx;
	PULSE.Tracer.info("Scrolling to page " + pageIdx);
	PULSE.Tracer.info("selectedEle\x3d" + $selectedEle);
	PULSE.Tracer.info("selectedGraph\x3d" + selectedGraph);
	$theList.find(".graphCntr").remove();
	$($selectedEle).append($("\x3cdiv class\x3d'graphCntr'\x3e").append($graphingDiv));
	$theList.css("left", "-" + left + "px");
	this.controller.setGraph(selectedGraph)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.scrollToPageByGraphName = function(graphName) {
	var graph = graphName,
		index;
	switch (graph) {
		case "Trajectory Viewer":
			index = 0;
			break;
		case "Wagon Wheel":
			index = 1;
			break;
		case "Pitch Map":
			index = 2;
			break;
		case "Beehive Placement":
			index = 3;
			break;
		case "Run Rate":
			index = 4;
			break;
		case "Bowl Speeds":
			index = 5;
			break;
		case "Speed Pitch Map":
			index = 6;
			break;
		case "Partnerships":
			index = 7;
			break;
		case "Variable Bounce":
			index = 8;
			break;
		case "Runs Per Over":
			index = 9;
			break;
		case "Worms":
			index = 10;
			break;
		default:
			index = 0;
			break
	}
	this.scrollToPage(index)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.showHistoricTraj = function(bp) {
	this.scrollToPage(0);
	this.controller.showGraph("Trajectory Viewer", undefined, undefined, undefined, bp)
};
PULSE.CLIENT.CRICKET.Hawkeye.prototype.setBackgroundCSS = function(css) {
	$("#thelist").children().eq(this.selectedGraphIdx).attr("class", css)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InningsStats = function(container, match, templates) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.match.tournament);
	this.active = false;
	this.templates = $.extend({
		stats: "templates/mc/inningsStats.html"
	}, templates || {});
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.InningsStats.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		that.tournament.getTeamStatsData(that.match.getTeamId(0), true);
		that.tournament.getTeamStatsData(that.match.getTeamId(1), true);
		if (that.match.isInInningsBreak()) that.activate();
		else that.deactivate(); if (params.success && that.active) that.refreshStats()
	});
	$("body").on("teamStats/update", function(e, params) {
		if (params.success && that.match.hasScoringData() && that.active) that.refreshStats()
	})
};
PULSE.CLIENT.CRICKET.MC.InningsStats.prototype.refreshStats = function() {
	if (!this.match.hasScoringData()) return;
	var that = this,
		nextToBat = this.match.getTeamBatFirst(0) === true ? 1 : 0,
		model = {
			model: this.match.getFullModel(),
			battingStats: this.match.getTopStatsForInnings(0, 3, "runs"),
			bowlingStats: this.match.getBestBowlingFiguresForInnings(0, 3),
			incomingBatsmen: this.match.getPlayingXI(nextToBat)
		};
	PULSE.CLIENT.Template.publish(this.templates.stats, this.$container, model, function() {
		that.loadPlayerImages()
	})
};
PULSE.CLIENT.CRICKET.MC.InningsStats.prototype.loadPlayerImages = function() {
	var that = this;
	this.$container.find(".player").each(function() {
		var self = $(this),
			playerId = self.attr("data-player-id");
		if (typeof playerId !== "undefined") that.urlFactory.setPlayerImageLoader(playerId, "100x115", self.find(".photoContainer"), "png", that.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.InningsStats.prototype.activate = function() {
	if (this.match.isInInningsBreak()) {
		this.active = true;
		this.refreshStats();
		this.$container.show()
	}
};
PULSE.CLIENT.CRICKET.MC.InningsStats.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InPlay = function($container, match, templates) {
	this.$container = $container;
	this.tournament = match.tournament;
	this.match = match;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.$cards = this.$container.find(".player-card-container");
	this.$striker = this.$cards.eq(0);
	this.$nonStriker = this.$cards.eq(1);
	this.$bowler = this.$cards.eq(2);
	this.$partnership = this.$container.find(".partnership-run-count");
	this.templates = $.extend({
		bowler: "templates/mc/bowler-card.html",
		batsman: "templates/mc/batsman-card.html",
		awaiting: "templates/mc/awaiting-player-card.html"
	}, templates || {});
	this.setSubscriptions();
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.active)
			if (that.match.getMatchState() === "L" && !that.match.isInInningsBreak()) {
				that.refreshPlayerCards(true);
				that.$container.show()
			} else that.$container.hide()
	})
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.setEventListeners = function() {
	this.$container.on("click", ".player-popup-link", function(e) {
		PULSE.CLIENT.Tracking.event("in-play", "show", "player page")
	})
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.refreshPlayerCards = function(animate) {
	var that = this;
	var partial = this.match.getScorecardSource() !== undefined;
	var bowlerModel = this.match.getCurrentBowler();
	if (bowlerModel) {
		bowlerModel.hasDots = this.match.getScorecardSource() !== "opta";
		this.publishPlayer(this.$bowler.find(".player-card"), {
			bowler: bowlerModel,
			id: bowlerModel.id
		}, this.templates.bowler, partial)
	} else {
		bowlerModel = {
			team: this.match.getCurrentBowlingTeam()
		};
		this.publishPlayer(this.$bowler.find(".player-card"), {
			bowler: bowlerModel
		}, this.templates.bowler, partial)
	}
	this.$partnership.text(this.match.getCurrentPartnership());
	if (partial === true) this.$partnership.hide();
	var strikerModel = this.match.getCurrentFacingBatsman();
	var nonStrikerModel = this.match.getCurrentNonFacingBatsman();
	if (animate && (!strikerModel || strikerModel.id.toString() !== this.$striker.find(".player-card").attr("data-player-id")) && (!nonStrikerModel || nonStrikerModel.id.toString() !== this.$nonStriker.find(".player-card").attr("data-player-id"))) {
		this.$striker.find(".player-card").attr("data-player-id", nonStrikerModel ? nonStrikerModel.id : "");
		this.$nonStriker.find(".player-card").attr("data-player-id", strikerModel ? strikerModel.id : "");
		this.$partnership.fadeOut(100);
		this.$striker.animate({
			"left": "33%"
		}, {
			duration: 500,
			easing: "easeInOutQuad",
			complete: function() {
				$(this).css("left", 0)
			}
		});
		this.$nonStriker.animate({
			"left": "-33%"
		}, {
			duration: 500,
			easing: "easeInOutQuad",
			complete: function() {
				$(this).css("left", 0);
				that.$partnership.fadeIn(100);
				that.refreshPlayerCards()
			}
		});
		return
	}
	if (strikerModel) this.publishPlayer(this.$striker.find(".player-card"), {
		batsman: strikerModel,
		id: strikerModel.id
	}, this.templates.batsman, partial);
	else {
		this.$partnership.hide();
		strikerModel = {
			team: this.match.getCurrentBattingTeam(),
			facing: true
		};
		this.publishPlayer(this.$striker.find(".player-card"), {
			batsman: strikerModel
		}, this.templates.batsman, partial)
	} if (nonStrikerModel) this.publishPlayer(this.$nonStriker.find(".player-card"), {
		batsman: nonStrikerModel,
		id: nonStrikerModel.id
	}, this.templates.batsman, partial);
	else {
		this.$partnership.hide();
		nonStrikerModel = {
			team: this.match.getCurrentBattingTeam(),
			facing: false
		};
		this.publishPlayer(this.$nonStriker.find(".player-card"), {
			batsman: nonStrikerModel
		}, this.templates.batsman, partial)
	}
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.publishPlayer = function($container, model, template, partial) {
	var that = this;
	if (model.id && $container.attr("data-player-id") === model.id.toString()) this.updatePlayerStats($container, model);
	else {
		model.partial = partial;
		$container.attr("data-player-id", model.id);
		PULSE.CLIENT.Template.replace(template, $container, model);
		var $imgContainer = this.$container.find(".playerPhoto");
		if ($imgContainer.length > 0) $imgContainer.each(function() {
			that.urlFactory.setPlayerImageLoader($(this).attr("data-player-id"), "100x115", $(this), "png", that.match.isLimitedOvers())
		})
	}
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.updatePlayerStats = function($container, model) {
	if (model.bowler) this.updateBowlerStats($container, model);
	else this.updateBatsmanStats($container, model)
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.updateBowlerStats = function($container, model) {
	$container.find(".figures-container").html(model.bowler.wickets + "/" + model.bowler.runsConceded);
	$container.find(".overs-container").html(model.bowler.overs);
	$container.find(".economy-container").html(model.bowler.economy);
	$container.find(".maidens-container").html(model.bowler.maidens);
	$container.find(".dots-container").html(model.bowler.dots)
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.updateBatsmanStats = function($container, model) {
	$container.find(".runs-container").html(model.batsman.runs);
	$container.find(".balls-faced-container").html(model.batsman.ballsFaced);
	$container.find(".fours-container").html(model.batsman.fours);
	$container.find(".strike-rate-container").html(model.batsman.strikeRate);
	$container.find(".sixes-container").html(model.batsman.sixes)
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.activate = function() {
	if (this.match.getMatchState() === "L" && !this.match.isInInningsBreak() && !this.active) {
		this.active = true;
		this.refreshPlayerCards();
		this.$container.show()
	}
	this.active = true
};
PULSE.CLIENT.CRICKET.MC.InPlay.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.MatchDetails = function(container, match, mobileOnly, config) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.mobileOnly = mobileOnly;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.template = config && config.template ? config.template : "templates/mc/match-info.html";
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.MatchDetails.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) that.refreshMatchDetails()
	});
	if (this.mobileOnly) $(window).on("resize", function(e) {
		var width = $(window).width();
		if (width < 720) that.isMobile = true;
		else that.isMobile = false
	})
};
PULSE.CLIENT.CRICKET.MC.MatchDetails.prototype.refreshMatchDetails = function() {
	var that = this,
		model = this.match.getMatchInfoModel();
	PULSE.CLIENT.Template.publish(this.template, this.$container.find(".mcWidgetContent"), model)
};
PULSE.CLIENT.CRICKET.MC.MatchDetails.prototype.activate = function() {
	if (!this.isMobile) {
		this.active = true;
		this.$container.show()
	} else this.deactivate()
};
PULSE.CLIENT.CRICKET.MC.MatchDetails.prototype.deactivate = function() {
	this.$container.hide();
	this.active = false
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.MatchSummary = function(container, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.$details = this.$container.find(".details");
	this.$info = this.$container.find(".matchInfo");
	this.$summary = this.$container.find(".summary");
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.MatchSummary.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) that.refreshTopInfoBar()
	})
};
PULSE.CLIENT.CRICKET.MC.MatchSummary.prototype.refreshTopInfoBar = function() {
	var that = this,
		model = this.match.getFullModel("dddd mmmm dS yyyy", "HH:MM"),
		matchState = model.matchState,
		matchNav, override, inningsBreakOverrideMessage;
	switch (matchState) {
		case "U":
			override = this.match.getInnsBreakOverride();
			model.matchSummary = override ? override : model.formattedTimeZoneDate + " - " + model.formattedMatchTime.GMT + " GMT";
			this.$container.addClass("preMatch").hide();
			if (this.active) this.activate();
			break;
		case "L":
			if (model.inningsBreak) {
				inningsBreakOverrideMessage = this.match.getInnsBreakOverride();
				model.matchSummary = inningsBreakOverrideMessage ? inningsBreakOverrideMessage : "Innings Break"
			}
			this.$container.removeClass("preMatch").fadeIn();
			if (this.active) this.activate();
			break;
		case "C":
			this.$container.removeClass("preMatch").hide();
			this.$container.hide();
			break
	}
	this.$summary.html(model.matchSummary);
	if (!this.initialised) {
		this.$details.html(model.matchDescription);
		this.$info.html(model.formattedTimeZoneDate + ", " + model.venue.shortName);
		this.$summary.html(model.matchSummary);
		this.lastMatchSummary = model.matchSummary;
		this.initialised = true
	}
};
PULSE.CLIENT.CRICKET.MC.MatchSummary.prototype.activate = function() {
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.MatchSummary.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.OverSummary = function($container, match, templates) {
	this.$container = $container;
	this.tournament = match.tournament;
	this.match = match;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.templates = $.extend({
		summary: "templates/mc/over-summary.html"
	}, templates || {});
	this.setSubscriptions();
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId == that.match.matchId && that.active && that.match.getScorecardSource() !== "cixml") that.refreshOverSummary()
	})
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.setEventListeners = function() {
	var that = this
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.refreshOverSummary = function() {
	var that = this,
		currentInnings = this.match.getCurrentInningsIndex(),
		latestOver = _.last(this.match.getOverHistory(currentInnings)) || {
			ovBalls: []
		},
		bowler = this.match.getCurrentBowler(),
		batsmenArray = this.match.scoringData.currentState ? this.match.scoringData.currentState.currentBatsmen : [],
		facingId = this.match.scoringData.currentState ? this.match.scoringData.currentState.facingBatsman : undefined,
		batsmen = _.map(batsmenArray, function(id) {
			var facing = facingId === id;
			return id > -1 ? that.match.getBatsmanModel(facing, id) : undefined
		});
	if (batsmen[0] && batsmen[0].facing && batsmen[1] && !batsmen[1].facing) batsmen.reverse();
	var model = {
		batsmen: batsmen,
		bowler: bowler,
		match: this.match.getFullModel(),
		over: latestOver,
		overRuns: this.getRunsInOver(latestOver),
		overWickets: this.getWicketsInOver(latestOver),
		matchSummary: this.match.getMatchSummary()
	};
	if (this.isEndOfOver()) this.$container.hide();
	else PULSE.CLIENT.Template.publish(this.templates.summary, this.$container, model, function() {
		that.updatePlayerImages();
		that.$container.show()
	})
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.isEndOfOver = function() {
	if (this.match.getMatchState() !== "L" || this.match.getMatchState() === "L" && !this.match.isInInningsBreak() && !this.match.getCurrentBowler() && (this.match.getCurrentFacingBatsman() || this.match.getCurrentNonFacingBatsman())) return true;
	return false
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.getRunsInOver = function(over) {
	var runs = 0,
		parseNumbersRegex = /\d+/g,
		i, ball, val;
	for (i = 0; i < over.ovBalls.length; i++) {
		ball = over.ovBalls[i];
		val = _.first(ball.match(parseNumbersRegex) || [0]);
		runs += parseInt(val, undefined)
	}
	return runs
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.getWicketsInOver = function(over) {
	var wickets = 0,
		i, ball, val;
	for (i = 0; i < over.ovBalls.length; i++) {
		ball = over.ovBalls[i];
		if (ball.toLowerCase() === "w") wickets++
	}
	return wickets
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.updatePlayerImages = function() {
	var that = this,
		$imgContainer = this.$container.find(".playerPhoto");
	if ($imgContainer.length > 0) $imgContainer.each(function() {
		that.urlFactory.setPlayerImageLoader($(this).attr("data-player-id"), "100x115", $(this), "png", that.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.activate = function() {
	this.active = true;
	if (!this.isEndOfOver() && this.match.getScorecardSource() !== "cixml") {
		this.refreshOverSummary();
		this.$container.show()
	}
};
PULSE.CLIENT.CRICKET.MC.OverSummary.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.OverviewTeams = function(container, match, templates) {
	this.$container = $(container);
	this.$teams = $(container).find(".playingXIContainer");
	this.tournament = match.tournament;
	this.matchId = match.matchId;
	this.match = match;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.templates = $.extend({
		team: "templates/mc/overview-team.html"
	}, templates || {});
	this.setSubscriptions();
	this.setListeners()
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId)
			if (that.active) that.refreshTeams()
	});
	$("body").on("squads/update", function(e, params) {
		if (params.success && params.tournamentName === that.tournament.tournamentName) {
			that.hasSquads = true;
			if (that.active) that.refreshTeams()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.setListeners = function() {
	this.$container.on("click", ".preMatchNoLink", function(e, params) {
		e.preventDefault()
	})
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.setWidgetTitle = function(titleText) {
	this.$container.find(".mcWidget-header p").text(titleText)
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.refreshTeams = function() {
	var that = this,
		team1playingXI = this.match.getPlayingXI(0),
		team2playingXI = this.match.getPlayingXI(1),
		team1squadModel, team2squadModel;
	if (team1playingXI && team2playingXI) {
		if (this.playingXIInitalised) return;
		this.setWidgetTitle("Playing XI");
		team1playingXI.captain = undefined;
		team2playingXI.captain = undefined;
		PULSE.CLIENT.Template.publish(this.templates.team, this.$teams, {
			teams: [team1playingXI, team2playingXI]
		});
		this.playingXIInitalised = true
	} else if (!this.tournament.squadsData.length) this.tournament.getSquads(true);
	else if (!this.squadsInitalised) {
		this.setWidgetTitle("Squads");
		team1squadModel = this.match.getSquad(0);
		team2squadModel = this.match.getSquad(1);
		if (team1squadModel && team1squadModel.players && team1squadModel.players.length || team2squadModel && team2squadModel.players && team2squadModel.players.length) {
			PULSE.CLIENT.Template.publish(this.templates.team, this.$teams, {
				teams: [team1squadModel, team2squadModel]
			});
			if (team1squadModel && team1squadModel.players && team1squadModel.players.length && team2squadModel && team2squadModel.players && team2squadModel.players.length) this.squadsInitalised = true
		}
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.activate = function() {
	var windowWidth = $("html").width();
	if (windowWidth > 640) {
		this.active = true;
		this.refreshTeams()
	}
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.OverviewTeams.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Photos = function(container, match) {
	this.$container = $(container);
	this.$photoList = this.$container.find(".photoList");
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.curPage = 0;
	this.refreshOnActivation = false;
	this.templates = {
		photoCard: "templates/mc/photostream.html"
	};
	this.feedId = "player";
	this.setSubscriptions();
	this.setListeners();
	this.match.getPhotosData(true)
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/photos", function(e, params) {
		if (params.success) {
			if ($("div.pulse-theatre-modal:hidden").length) $(".pulse-theatre-modal").remove();
			that.model = that.match.getModalTheatre();
			var photos = that.match.getMatchPhotosModel();
			that.photos = photos.photos;
			if (that.active) that.refreshPhotoStream();
			else that.refreshOnActivation = true
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.setListeners = function() {
	var that = this;
	this.$container.on("click", ".supersizedModal", function(e) {
		e.preventDefault();
		var supersized_photomodal = new PULSE.CLIENT.SUPERSIZED("#photomodal"),
			position = that.$photoList.children().children().index($(this)) + 1,
			actionUrl = $(this).attr("data-action-url");
		supersized_photomodal.openModal(that.model.Id, position, actionUrl)
	})
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.refreshPhotoStream = function() {
	if (!this.photos || !this.photos.length) return;
	this.matchModel = this.match.getFullModel();
	var that = this,
		model = {
			photos: this.photos,
			matchModel: this.matchModel,
			pages: this.paginatePhotos(),
			curPage: this.curPage
		},
		containerWidth = 203 * Math.ceil(model.photoCount / 2);
	this.curPage = 0;
	this.pagesModel = model;
	this.$photoList.empty();
	this.$photoList.append('\x3cul class\x3d"page small-block-grid-2 medium-block-grid-3 large-block-grid-4" style\x3d"display:none"\x3e\x3c/ul\x3e');
	PULSE.CLIENT.Template.publish(this.templates.photoCard, this.$photoList.find(".page").first(), model, function() {
		that.$photoList.children().first().show().addClass("fadeIn");
		setTimeout(function() {
			$.waypoints("refresh")
		}, 1200)
	})
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.loadPage = function() {
	if (!this.pagesModel) return;
	if (this.pagesModel.pages.length <= this.$photoList.children().length) return;
	this.$photoList.append('\x3cul class\x3d"page small-block-grid-2 medium-block-grid-3 large-block-grid-4" style\x3d"display:none"\x3e\x3c/ul\x3e');
	var that = this,
		model = this.pagesModel;
	model.curPage = this.curPage + 1;
	PULSE.CLIENT.Template.publish(this.templates.photoCard, this.$photoList.find(".page").last(), model, function() {
		that.$photoList.find(".page").last().show().addClass("fadeIn");
		setTimeout(function() {
			$.waypoints("refresh")
		}, 1200)
	});
	this.curPage++
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.paginatePhotos = function() {
	var step = 24,
		pages = [];
	for (var i = 0; i < Math.ceil(this.photos.length / step); i++) {
		var page = [];
		for (var x = i * step, limit = Math.min(step * (i + 1), this.photos.length); x < limit; x++) {
			var photo = this.photos[x];
			page.push(photo)
		}
		pages.push(page)
	}
	return pages
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.activate = function() {
	this.active = true;
	if (this.refreshOnActivation) {
		this.refreshPhotoStream();
		this.refreshOnActivation = false
	}
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.Photos.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Poll = function($pollContainer, $pollButton, match) {
	this.match = match;
	this.tournament = this.match.tournament;
	this.$pollButton = $pollButton;
	this.$pollContainer = $pollContainer;
	this.$closeButton = this.$pollContainer.find(".close");
	this.$pollButton = $pollButton;
	this.poll = new PULSE.CLIENT.Poll.ListView(this.$pollContainer, {
		name: this.tournament.tournamentName + "_poll",
		templates: {
			answered: "templates/poll/answered.html",
			question: "templates/poll/question.html",
			unanswered: "templates/poll/unanswered.html"
		},
		feedOptions: {
			start: true,
			url: this.tournament.tournamentUrlGenerator.makePollDataUrl(this.customer)
		},
		backwardsCompatible: true,
		cookieOptions: {
			path: "/"
		}
	}, this.tournament);
	this.setSubscriptions();
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.setSubscriptions = function() {
	var that = this;
	this.$pollContainer.on("poll/data", function(e, params) {
		that.showPollButton();
		that.showNotification();
		that.updateQuestionCount()
	});
	this.$pollContainer.on("poll/answer", function(e, params) {
		that.updateQuestionCount()
	})
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.setEventListeners = function() {
	var that = this;
	this.$pollButton.on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		that.poll.refresh();
		that.activate()
	});
	this.$closeButton.on("click", function(e) {
		e.preventDefault();
		that.deactivate()
	});
	$(document).on("mouseup", function(e) {
		if (that.active && !that.$pollContainer.is(e.target) && that.$pollContainer.has(e.target).length === 0) that.deactivate()
	});
	$("body").on("click", ".newFanPoll", function(e) {
		e.preventDefault();
		that.activate()
	})
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.showNotification = function() {
	var question = this.poll.controller.model.getLatestQuestion("unanswered"),
		matchState = this.match.getMatchState();
	if (question && matchState !== "C") {
		var newQuestionHtml = '\x3ca href\x3d"#" class\x3d"newFanPoll"\x3e' + '\x3cspan class\x3d"title"\x3eNew Fan Poll:\x3c/span\x3e' + '\x3cspan class\x3d"question"\x3e\x3cp\x3e' + question.text + '\x3c/p\x3e\x3cspan class\x3d"cta"\x3eAnswer Poll\x3c/span\x3e\x3c/span\x3e' + "\x3c/a\x3e";
		$(".newFanPoll").remove();
		$(".poll-notification-hook").prepend(newQuestionHtml)
	}
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.showPollButton = function() {
	var questions = this.poll.controller.model.getQuestions();
	if (questions.length) this.$pollButton.show()
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.updateQuestionCount = function() {
	var questions = this.poll.controller.model.getQuestions("unanswered"),
		$newPolls = this.$pollButton.find(".newPolls");
	if (questions.length) {
		$newPolls.show();
		$newPolls.text(questions.length)
	} else $newPolls.hide()
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.activate = function() {
	this.active = true;
	this.poll.update("home");
	this.$pollContainer.addClass("open")
};
PULSE.CLIENT.CRICKET.MC.Poll.prototype.deactivate = function() {
	this.active = false;
	this.$pollContainer.removeClass("open")
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.PostMatchReactions = function(container, match) {
	this.$container = $(container);
	this.tournament = match.tournament;
	this.match = match;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.isComplete = false;
	this.templates = {
		videoCard: "templates/mc/reactions.html"
	};
	this.components = [{
		title: "Match Highlights",
		type: "video",
		id: "highlightsId",
		thumbId: "highlightsThumb",
		missing: "highlights"
	}, {
		title: "Match Report",
		type: "article",
		id: "reportLink",
		thumbId: "reportThumb",
		missing: "report"
	}, {
		title: "Man of the Match",
		type: "video",
		id: "momId",
		thumbId: "momThumb",
		missing: "mom"
	}];
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.PostMatchReactions.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (that.match.getMatchState() === "C") {
			that.refreshRecapContent();
			that.activate()
		} else that.deactivate()
	});
	this.$container.on("click", ".videoThumb", function(e) {
		e.preventDefault();
		var id = $(this).attr("data-media-id");
		PULSE.CLIENT.notify("play/video", {
			id: id,
			success: true
		})
	})
};
PULSE.CLIENT.CRICKET.MC.PostMatchReactions.prototype.refreshRecapContent = function() {
	var matchModel = this.match.getFullModel(),
		model = {};
	model.media = {};
	model.matchDescription = matchModel.matchDescription.replace("atch ", "") + ": " + matchModel.team1abbr + " vs " + matchModel.team2abbr;
	for (var i = 0; i < this.components.length; i++) {
		var component = this.components[i];
		if (matchModel[component.id]) {
			if (matchModel[component.thumbId]) {
				component.thumb = matchModel[component.thumbId];
				component.hidePlayIcon = false
			} else {
				component.thumb = undefined;
				component.hidePlayIcon = true
			}
			component.value = matchModel[component.id];
			model.media[component.id] = component
		}
	}
	if (_.keys(model.media).length) PULSE.CLIENT.Template.publish(this.templates.videoCard, this.$container, model, function() {});
	else this.deactivate()
};
PULSE.CLIENT.CRICKET.MC.PostMatchReactions.prototype.activate = function() {
	if (this.match.getMatchState() === "C") {
		this.active = true;
		this.refreshRecapContent();
		this.$container.show()
	}
};
PULSE.CLIENT.CRICKET.MC.PostMatchReactions.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Scoreboard = function(container, match, templates) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.templates = $.extend({
		live: "templates/mc/scoreboard-live.html",
		prematch: "templates/mc/scoreboard-prematch.html"
	}, templates || {});
	this.setSubscriptions();
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) {
			that.refreshScoring();
			that.setBackground()
		}
	});
	$("body").on("schedule/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) {
			that.refreshScoring();
			that.setBackground()
		}
	});
	$("body").on("squads/update", function(e, params) {
		if (params.success) {
			that.hasSquads = true;
			that.refreshScoring()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".horizontalSliderNav", function() {
		var matchId = $(this).attr("data-match-id");
		PULSE.CLIENT.notify("load/match", {
			matchId: matchId
		})
	});
	this.$container.on("click", ".twitterBtn", function() {
		var matchModel = that.match.getFullModel(),
			url = HH && HH.Params ? HH.Params.baseUrl + that.match.getMatchLink() : "",
			hashtag = $(this).attr("data-hashtag"),
			text = url + " " + hashtag;
		PULSE.CLIENT.TwitterController.tweetEvent("tweet", {
			text: text
		})
	})
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.setBackground = function() {
	if (!this.hasSetBackground) {
		var model = this.match.getFullModel(),
			venueClass = model.venue.shortName.toLowerCase().replace("'", "");
		this.$container.parent().addClass(venueClass);
		this.hasSetBackground = true
	}
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.refreshScoring = function() {
	if (this.active && (this.match.scheduleData || this.match.scoringData)) {
		var that = this,
			model = this.match.getFullModel(),
			limited = this.match.isLimitedOvers(),
			template = this.getTemplate(),
			nextMatch = this.tournament.getNextMatchForId(this.match.matchId),
			previousMatch = this.tournament.getPreviousMatchForId(this.match.matchId);
		this.team1captain = this.match.getCaptain(0), this.team2captain = this.match.getCaptain(1);
		if (!this.team1captain || !this.team2captain)
			if (this.hasSquads) {
				this.team1captain = this.getCaptainFromSquads(0);
				this.team2captain = this.getCaptainFromSquads(1)
			} else this.tournament.getSquads(true);
		model.team1captain = this.team1captain;
		model.team2captain = this.team2captain;
		model.nextMatch = nextMatch ? nextMatch.getFullModel() : undefined;
		model.previousMatch = previousMatch ? previousMatch.getFullModel() : undefined;
		model.team1won = model.winnerIndex === 0 ? true : false;
		model.day = this.match.getMatchDay();
		PULSE.CLIENT.Template.publish(template, this.$container, model, function() {
			if (that.match.getMatchState() === "U") {
				that.$container.parent().addClass("preMatch");
				that.$container.parent().removeClass("innings-scorebox live postMatch");
				that.initCountdown();
				that.loadCaptainImages()
			} else if (that.match.getMatchState() === "L") {
				that.$container.parent().addClass("innings-scorebox live");
				if (that.match.isInInningsBreak()) that.$container.parent().addClass("inningsBreak");
				else that.$container.parent().removeClass("inningsBreak");
				that.$container.parent().removeClass("preMatch");
				that.$container.parent().removeClass("postMatch")
			} else if (that.match.getMatchState() === "C") {
				that.$container.parent().removeClass("preMatch");
				that.$container.parent().addClass("innings-scorebox postMatch")
			}
		})
	}
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.getTemplate = function() {
	if (this.match.getMatchState() === "U") return this.templates.prematch;
	else return this.templates.live
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.initCountdown = function() {
	var $countdownContainer = this.$container.find(".countdown"),
		model = this.match.getFullModel();
	if ($countdownContainer.length) this.countdown = new PULSE.CLIENT.CRICKET.MC.Countdown(this.$container, model.matchDate, {})
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.loadCaptainImages = function() {
	var that = this;
	if (!this.team1captain || !this.team2captain) return;
	this.$container.find("[data-player-id]").each(function() {
		var $el = $(this),
			id = $el.attr("data-player-id"),
			$imgContainer = $el.hasClass("playerPhoto") ? $el : $el.find(".playerPhoto");
		if ($imgContainer.length > 0) {
			that.urlFactory.setPlayerImageLoader(id, "210", $imgContainer, "png", that.match.isLimitedOvers());
			$imgContainer.find("img").addClass("captain")
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.getCaptainFromSquads = function(teamIndex) {
	var team = this.match.getTeam(teamIndex),
		squad = team ? this.tournament.getSquadWithCaptainModel(team.id) : {},
		captain = squad ? squad.captain : undefined;
	return captain
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.activate = function() {
	this.active = true;
	this.refreshScoring();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.Scoreboard.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Sharing = function(container, config) {
	this.$container = $(container);
	this.config = config;
	this.$container.find(".share").on("click", function(e) {
		e.preventDefault();
		var url = window.location.href;
		if ($(this).hasClass("facebook")) {
			PULSE.CLIENT.FacebookController.publishEvent(url);
			if (typeof ga !== "undefined") ga("send", "event", "button", "click", "share-facebook")
		} else if ($(this).hasClass("twitter")) {
			PULSE.CLIENT.TwitterController.tweetEvent("tweet", {
				text: url
			});
			if (typeof ga !== "undefined") ga("send", "event", "button", "click", "share-twitter")
		} else if ($(this).hasClass("google")) {
			PULSE.CLIENT.GooglePlusController.publishEvent(url);
			if (typeof ga !== "undefined") ga("send", "event", "button", "click", "share-googleplus")
		}
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TeamsFull = function(container, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.active = false;
	this.defaultTab = 0;
	this.$nav = this.$container.find(".filterNav");
	this.$team1 = this.$container.find(".teamList").eq(0);
	this.$team2 = this.$container.find(".teamList").eq(1);
	this.templates = {
		team: "templates/mc/teamsFull.html"
	};
	this.setSubscriptions();
	this.setEventListeners();
	this.initGui(this.defaultTab)
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.setSubscriptions = function() {
	var that = this,
		index = 0;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId)
			if (that.active) {
				that.refreshLabels();
				that.refreshTeams()
			}
		that.team1id = that.match.getTeamId(0);
		that.team2id = that.match.getTeamId(1);
		that.tournament.getTeamStatsData(that.team1id, true);
		that.tournament.getTeamStatsData(that.team2id, true)
	});
	$("body").on("squads/update", function(e, params) {
		if (params.success && params.tournamentName === that.tournament.tournamentName) {
			that.hasSquads = true;
			if (that.active) that.refreshTeams()
		}
	});
	$("body").on("teamStats/update", function(e, params) {
		var that = this;
		if (params.success && that.hasSquads && that.active) that.refreshTeams()
	})
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.setEventListeners = function() {
	var that = this;
	this.$container.find(".filterNav .toggle li").on("click", function(e, params) {
		e.preventDefault();
		$(this).parent().find("li").removeClass("active");
		$(this).addClass("active");
		var index = $(this).index();
		that.toggleController.switchToTab(index)
	});
	this.$container.on("click", ".player-popup-link", function(e) {
		PULSE.CLIENT.Tracking.event("teams", "show", "player page")
	})
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.initGui = function(index) {
	if (this.hasInitGui) return;
	var options = {
		activeTab: index,
		navigationContainer: this.$container.find(".filterNav"),
		contentContainer: this.$container.find(".teamList").parent(),
		contentClassPrefix: "team",
		navLinksSelector: "li",
		animate: true
	};
	this.toggleController = new PULSE.CLIENT.UI.ToggleNav(options);
	this.$container.find(".filterNav .toggle li").removeClass("active");
	this.$container.find(".filterNav .toggle li").eq(index).addClass("active");
	this.hasInitGui = true
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.refreshLabels = function() {
	if (this.match.scoringData && !this.hasLabels) {
		for (var i = 0; i < 2; i++) {
			var team = this.match.scoringData.matchInfo.teams[i].team.fullName,
				abbr = this.match.scoringData.matchInfo.teams[i].team.abbreviation;
			this.$nav.find("li").eq(i).text(team)
		}
		this.hasLabels = true
	}
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.refreshTeams = function() {
	if (!this.hasSquads)
		if (this.tournament.squadsData && this.tournament.squadsData.length > 0) this.hasSquads = true;
		else this.tournament.getSquads(true);
	var that = this,
		player, team1model = {
			playingXI: this.match.getPlayingXI(0),
			squad: undefined
		},
		team2model = {
			playingXI: this.match.getPlayingXI(1),
			squad: undefined
		},
		teamfirst, teamsecond;
	if (team1model.playingXI && team2model.playingXI) {
		if (this.playingXIinitialised) return;
		if (this.hasSquads) {
			team1model.squad = this.match.getSquad(0);
			if (team1model.squad.captain) {
				player = team1model.squad.captain;
				player.captain = true;
				team1model.squad.players.unshift(player)
			}
			team2model.squad = this.match.getSquad(1);
			if (team2model.squad.captain) {
				player = team2model.squad.captain;
				player.captain = true;
				team2model.squad.players.unshift(player)
			}
		}
		team1model = this.filterPlayingXI(team1model);
		team2model = this.filterPlayingXI(team2model);
		PULSE.CLIENT.Template.publish(this.templates.team, this.$team1, team1model);
		PULSE.CLIENT.Template.publish(this.templates.team, this.$team2, team2model, function() {
			that.loadPlayerImages()
		});
		if (team1model.playingXI && team1model.squad) this.playingXIinitialised = true
	} else if (this.hasSquads && !this.squadsInitalised) {
		team1model = {
			playingXI: undefined,
			squad: this.match.getSquad(0)
		};
		team2model = {
			playingXI: undefined,
			squad: this.match.getSquad(1)
		};
		if (team1model.squad.captain) {
			player = team1model.squad.captain;
			player.captain = true;
			team1model.squad.players.unshift(player)
		}
		if (team2model.squad.captain) {
			player = team2model.squad.captain;
			player.captain = true;
			team2model.squad.players.unshift(player)
		}
		team1model = this.filterPlayingXI(team1model);
		team2model = this.filterPlayingXI(team2model);
		PULSE.CLIENT.Template.publish(this.templates.team, this.$team1, team1model);
		PULSE.CLIENT.Template.publish(this.templates.team, this.$team2, team2model, function() {
			that.loadPlayerImages()
		});
		this.squadsInitalised = true
	}
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.filterPlayingXI = function(model) {
	var playingIds = [],
		i, player;
	if (model.squad)
		if (model.playingXI) {
			for (i = 0; i < 11; i++) playingIds.push(model.playingXI.players[i].id);
			for (i = 0; i < model.squad.players.length; i++) {
				player = model.squad.players[i];
				if (_.indexOf(playingIds, player.id) > -1) player.isPlaying = true
			}
		} else
			for (i = 0; i < model.squad.players.length; i++) model.squad.players[i].isPlaying = false;
	return model
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.loadPlayerImages = function() {
	var that = this;
	this.$container.find(".player").each(function() {
		var self = $(this),
			playerId = self.attr("data-player-id");
		if (typeof playerId !== "undefined") {
			that.urlFactory.setPlayerImageLoader(playerId, "210", self.find(".playerPhoto"), "png", that.match.isLimitedOvers());
			self.find("img").addClass("playerPhoto")
		}
	})
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.activate = function() {
	this.active = true;
	this.refreshLabels();
	this.refreshTeams();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.TeamsFull.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TodayPanel = function(container, tournament, button) {
	this.$container = $(container);
	this.tournament = tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.$button = $(button);
	this.tournaments = [];
	if (this.$container.attr("data-tournaments")) {
		var tournamentArray = this.$container.attr("data-tournaments").split(",");
		if (-1 === _.indexOf(tournamentArray, this.tournament.tournamentName)) this.tournaments.push(this.tournament);
		for (var i = 0; i < tournamentArray.length; i++) this.tournaments.push(window.WidgetController.getTournamentByName(tournamentArray[i]))
	} else this.tournaments = [this.tournament];
	this.checkScheduleData();
	this.setSubscriptions();
	this.matchTakeovers = {}
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.renderTakeover = function() {
	if (!this.rendered && this.active && this.checkScheduleData(true)) {
		var tournament = this.tournament;
		var matchIds = "";
		if (this.matchesToday && this.matchesToday.length > 0) {
			var matchIdArray = [];
			for (var i = 0; i < this.matchesToday.length; i++) matchIdArray.push(this.matchesToday[i].matchId);
			matchIds = matchIdArray.join(",")
		}
		var config = {
			"data-match-id": matchIds,
			"data-widget-type": "matchhero_worldt20_widget"
		};
		var hero = new PULSE.CLIENT.CRICKET.MatchHero.Multiple(this.$container, config);
		this.tournament.dm.startAll();
		this.rendered = true
	}
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("schedule/update", function(e, params) {
		if (params.success) that.findTodayMatches()
	})
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.checkScheduleData = function(start) {
	var hasScheduleData = true;
	for (var i = 0; i < this.tournaments.length; i++)
		if (!this.tournaments[i].scheduleData.length) {
			hasScheduleData = false;
			this.tournaments[i].getMatchSchedule({
				start: start
			})
		}
	return hasScheduleData
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.findTodayMatches = function() {
	if (!this.checkScheduleData(true)) return;
	var todayMatches = [];
	for (var i = 0; i < this.tournaments.length; i++) todayMatches.push(this.tournaments[i].getMatchesGroupedByDate().matches);
	var allMatches = {};
	for (var i = 0; i < todayMatches.length; i++)
		for (var day in todayMatches[i]) {
			var matches = todayMatches[i][day];
			if (allMatches[day]) allMatches[day] = allMatches[day].concat(todayMatches[i][day]);
			else allMatches[day] = todayMatches[i][day]
		}
	var today = dateFormat(new Date, "yyyy-mm-dd", true);
	this.matchesToday = allMatches[today];
	if (this.matchesToday && this.matchesToday.length > 0 && this.$button) this.$button.show();
	else this.$button.hide();
	this.renderTakeover()
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.activate = function() {
	this.active = true;
	this.renderTakeover();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
PULSE.CLIENT.CRICKET.MC.TodayPanel.prototype.isActive = function() {
	return this.active
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TournamentTwitter = function(container, match) {
	this.$container = $(container);
	this.match = match;
	this.twitter = new PULSE.CLIENT.CRICKET.TournamentTwitter(container, undefined, this.match.tournament)
};
PULSE.CLIENT.CRICKET.MC.TournamentTwitter.prototype.activate = function() {
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.TournamentTwitter.prototype.deactivate = function() {
	this.$container.hide();
	this.active = false
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.VideoHero = function(container, match) {
	this.$container = $(container);
	this.$videoPlayer = this.$container.find(".videoWrapper");
	this.$videoList = this.$container.find(".list");
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.refreshOnActivation = true;
	this.limit = 4;
	this.setSubscriptions();
	this.setEventListeners();
	this.templates = {
		videoList: "templates/mc/video-latest.html",
		videoPlayer: "templates/mc/video-player.html"
	};
	this.match.getMatchVideosData(true)
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/videos", function(e, params) {
		if (params.success)
			if (that.active) {
				that.refreshVideoPlayer();
				that.refreshLatestVideos()
			} else that.refreshOnActivation = true
	})
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".videoThumb", function(e) {
		var $this = $(this),
			id = $this.attr("data-media-id");
		that.refreshVideoPlayer(id);
		$this.parent().siblings("li").find("a").removeClass("active playing");
		$this.addClass("active playing");
		e.preventDefault()
	})
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.refreshVideoPlayer = function(videoId) {
	if (!this.videoPlayerAdded || videoId) {
		var that = this,
			latestVideo = _.first(this.match.getMatchVideosModel().videos);
		latestVideoId = latestVideo ? latestVideo.id : undefined, model = {
			id: videoId || latestVideoId
		};
		this.videoId = model.id;
		PULSE.CLIENT.Template.publish(this.templates.videoPlayer, this.$videoPlayer, model);
		this.videoPlayerAdded = true
	}
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.refreshLatestVideos = function() {
	var that = this,
		model = this.match.getMatchVideosModel();
	model.videoUrl = "http://www.icc-cricket.com/videos/media/id/";
	model.selectedId = this.videoId;
	model.limit = this.limit;
	PULSE.CLIENT.Template.publish(this.templates.videoList, this.$videoList, model, function() {})
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.activate = function() {
	this.active = true;
	if (this.refreshOnActivation) {
		this.refreshVideoPlayer();
		this.refreshLatestVideos();
		this.refreshOnActivation = false
	}
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.VideoHero.prototype.deactivate = function() {
	this.active = false;
	if (typeof videojs !== "undefined") videojs(this.$container.find(".brightcove-player").children().first().attr("id")).pause();
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.VideoIndex = function(container, match) {
	this.$container = $(container);
	this.$videoList = this.$container.find(".video-list ul.listContent");
	this.$pagination = this.$container.find(".pagination");
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.curPage = 0;
	this.refreshOnActivation = false;
	this.setSubscriptions();
	this.setEventListeners();
	this.templates = {
		videoCard: "templates/mc/video-card.html"
	};
	this.match.getMatchVideosData(true)
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/videos", function(e, params) {
		if (params.success)
			if (that.active) that.refreshMatchVideos();
			else that.refreshOnActivation = true
	})
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.setEventListeners = function() {
	var that = this;
	this.$container.find(".video-sub a").on("click", function(e) {
		e.preventDefault();
		var $this = $(this),
			tag = $this.attr("data-id"),
			videos = that.match.getMatchVideosByTagName(tag);
		if ($this.hasClass("active")) return;
		$this.parent().parent().find("a").removeClass("active");
		$this.addClass("active");
		if (!tag || tag === "all") that.refreshMatchVideos();
		else that.refreshMatchVideos(videos)
	});
	this.$videoList.on("click", ".videoThumb", function(e) {
		e.preventDefault();
		var id = $(this).attr("data-media-id");
		PULSE.CLIENT.notify("play/video", {
			id: id,
			success: true
		})
	});
	this.$pagination.on("click", ".btn", function(e) {
		var $button = $(this);
		if ($button.hasClass("prev") && !$button.hasClass("inactive") && that.curPage > 0) {
			that.curPage--;
			that.refreshMatchVideos()
		}
		if ($button.hasClass("next") && !$button.hasClass("inactive") && that.curPage < that.pagesModel.pages.length - 1) {
			that.curPage++;
			that.refreshMatchVideos()
		}
		that.updatePaginationState()
	});
	this.$pagination.on("change", ".paginationValue", function(e) {
		var $input = $(this),
			inputValue = parseInt($input.val(), undefined);
		if (inputValue < that.pagesModel.pages.length - 1 && inputValue > 0) {
			that.curPage = inputValue - 1;
			that.refreshMatchVideos()
		}
		that.updatePaginationState()
	})
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.updatePaginationState = function() {
	var $prevButton = this.$pagination.find(".prev.btn"),
		$nextButton = this.$pagination.find(".next.btn");
	if (this.curPage === 0) $prevButton.addClass("inactive");
	else $prevButton.removeClass("inactive"); if (this.curPage < this.pagesModel.pages.length - 1) $nextButton.removeClass("inactive");
	else $nextButton.addClass("inactive");
	this.$pagination.find(".maxPages").html(this.pagesModel.pages.length);
	this.$pagination.find(".paginationValue").val(this.curPage + 1)
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.refreshMatchVideos = function(videos) {
	var that = this,
		model = typeof videos !== "undefined" ? videos : this.match.getMatchVideosModel();
	if (model.videos.length === 0) {
		this.$videoList.empty().html("\x3cp\x3eNo videos\x3c/p\x3e");
		return
	}
	model.pages = this.paginateVideos(model);
	model.curPage = this.curPage;
	model.videoUrl = "http://www.icc-cricket.com/videos/media/id/";
	this.pagesModel = model;
	PULSE.CLIENT.Template.publish(this.templates.videoCard, this.$videoList, model, function() {
		that.updatePaginationState()
	})
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.paginateVideos = function(model) {
	var step = 12,
		pages = [],
		page, i, x;
	for (i = 0; i < Math.ceil(model.videos.length / step); i++) {
		page = [];
		for (x = i * step, limit = Math.min(step * (i + 1), model.videos.length); x < limit; x++) {
			var video = model.videos[x],
				tags = video.tags;
			if (_.indexOf(tags, "six") > -1) video.typeClass = "6";
			if (_.indexOf(tags, "wicket") > -1) video.typeClass = "W";
			page.push(video)
		}
		pages.push(page)
	}
	return pages
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.activate = function() {
	this.active = true;
	if (this.refreshOnActivation) {
		this.refreshMatchVideos();
		this.refreshOnActivation = false
	}
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.VideoIndex.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.VideoLatest = function(container, match) {
	this.$container = $(container);
	this.$videoList = this.$container.find("ul");
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.refreshOnActivation = false;
	this.limit = 4;
	this.setSubscriptions();
	this.setEventListeners();
	this.templates = {
		videoList: "templates/mc/video-list-small.html"
	};
	this.match.getMatchVideosData(true)
};
PULSE.CLIENT.CRICKET.MC.VideoLatest.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/videos", function(e, params) {
		if (params.success) {
			model = that.match.getMatchVideosModel();
			if (model.videos.length) that.hasVideos = true;
			if (that.active) that.refreshLatestVideos();
			else that.refreshOnActivation = true; if (that.hasVideos && that.active) that.$container.show()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.VideoLatest.prototype.setEventListeners = function() {
	this.$videoList.on("click", ".videoThumb", function(e) {
		e.preventDefault();
		var id = $(this).attr("data-media-id");
		PULSE.CLIENT.notify("play/video", {
			id: id,
			success: true
		})
	})
};
PULSE.CLIENT.CRICKET.MC.VideoLatest.prototype.refreshLatestVideos = function() {
	var that = this,
		model = this.match.getMatchVideosModel();
	model.videoUrl = "http://www.icc-cricket.com/videos/media/id/";
	model.limit = this.limit;
	PULSE.CLIENT.Template.publish(this.templates.videoList, this.$videoList, model, function() {})
};
PULSE.CLIENT.CRICKET.MC.VideoLatest.prototype.activate = function() {
	this.active = true;
	if (this.refreshOnActivation) {
		this.refreshLatestVideos();
		this.refreshOnActivation = false
	}
	if (this.hasVideos) this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.VideoLatest.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.Scorecard = function(container, match) {
	this.$container = $(container);
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.templates = {
		scorecard: "templates/mc/scorecard.html"
	};
	this.setSubscriptions();
	this.$container.on("click", ".player-popup-link", function(e) {
		PULSE.CLIENT.Tracking.event("scorecard", "show", "player page")
	})
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (that.match.getMatchState() != "U") that.activateTab();
		if (params.success && params.matchId === that.match.matchId && that.active) that.refreshScoring()
	})
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.refreshScoring = function() {
	var that = this,
		model = this.match.getScorecardModel();
	if (!model) return;
	_.each(model.innings, function(team, index) {
		var extras = [];
		var size = _.size(team.extras) - 2;
		index = 0;
		for (var type in team.extras)
			if (type !== "total") extras.push(type + " " + team.extras[type]);
		team.extras.array = extras
	});
	model.matchState = this.match.getMatchState();
	model.matchType = this.match.getMatchType();
	model.hasDots = this.match.getScorecardSource() !== "opta";
	for (var i = 0; i < model.innings.length; i++) {
		var teamIndex = this.match.getIndexOfTeamByAbbr(model.innings[i].teamAbbr);
		model.innings[i].playingXI = this.match.getPlayingXI(teamIndex);
		model.innings[i] = this.getYetToBatForInnings(model.innings[i])
	}
	PULSE.CLIENT.Template.publish(this.templates.scorecard, this.$container, model, function() {
		that.setPlayerImages()
	})
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.setPlayerImages = function() {
	var that = this;
	this.$container.find(".playerEntry").each(function() {
		var $this = $(this),
			id = $this.attr("data-player-id");
		var $imgContainer = $this.find(".playerPhoto");
		if (!$imgContainer.children().length)
			if ($imgContainer.length > 0) {
				that.urlGenerator.setPlayerImageLoader($this.attr("data-player-id"), "100x115", $imgContainer, "png", true);
				$imgContainer.find("img").addClass("captain")
			}
	})
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.getYetToBatForInnings = function(model) {
	var batsmenIds = [],
		i, player;
	if (model.playingXI && model.batsmen) {
		for (i = 0; i < model.batsmen.length; i++) batsmenIds.push(model.batsmen[i].id);
		for (i = 0; i < model.playingXI.players.length; i++) {
			player = model.playingXI.players[i];
			if (_.indexOf(batsmenIds, player.id) > -1) player.hasBatted = true;
			else player.hasBatted = false
		}
	} else if (model.playingXI)
		for (i = 0; i < model.playingXI.players.length; i++) model.playingXI.players[i].hasBatted = false;
	return model
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.activateTab = function() {
	$(".linksContainer .links li a").each(function() {
		if ($(this).text() === "Scorecard") $(this).removeClass("inactive")
	})
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.activate = function() {
	this.active = true;
	this.refreshScoring();
	this.$container.fadeIn()
};
PULSE.CLIENT.CRICKET.MC.Scorecard.prototype.deactivate = function() {
	this.active = false;
	this.$container.fadeOut()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard = function($container, match) {
	PULSE.CLIENT.CRICKET.MC.Scorecard.call(this, $container, match);
	this.templates = {
		scorecard: "templates/mc/scorecard-interactive.html",
		videoPlayer: "templates/mc/video-player.html",
		playerPanel: "templates/mc/scorecard-player-panel.html"
	};
	this.setEventListeners();
	this.panels = {}
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Scorecard.prototype);
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.InteractiveScorecard;
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (that.match.getMatchState() !== "U") that.activateTab();
		if (params.success && params.matchId === that.match.matchId && that.active) {
			that.refreshScoring();
			that.reAddContainers();
			that.renderCurrentPanel()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.reAddContainers = function() {
	for (var playerId in this.panels) {
		var $container = this.$container.find('.player-video-row[data-player-id\x3d"' + playerId + '"]');
		this.panels[playerId].setContainer($container)
	}
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.collapseExisting = function() {
	if (this.playerId) {
		this.$container.find('.playerEntry[data-player-id\x3d"' + this.playerId + '"]').removeClass("open");
		this.panels[this.playerId].deactivate();
		this.panels[this.playerId].$container.hide()
	}
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.renderCurrentPanel = function() {
	if (this.playerId) {
		this.$container.find('.playerEntry[data-player-id\x3d"' + this.playerId + '"]').addClass("open");
		this.panels[this.playerId].render();
		this.panels[this.playerId].$container.show()
	}
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecard.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".playerEntry", function(e) {
		if ($(window).width() > 1026) {
			var $playerEntry = $(this);
			var playerId = $playerEntry.data("player-id");
			$playerEntry.toggleClass("open");
			that.collapseExisting();
			if (that.playerId !== playerId) {
				if (!that.panels[playerId]) {
					var $panel = that.$container.find('.player-video-row[data-player-id\x3d"' + playerId + '"]');
					that.panels[playerId] = new PULSE.CLIENT.CRICKET.MC.PlayerPanel($panel, that.match, playerId)
				}
				that.panels[playerId].activate();
				that.panels[playerId].$container.show();
				that.playerId = playerId;
				PULSE.CLIENT.Tracking.event("scorecard", "show", "interactive player panel")
			} else that.playerId = undefined;
			e.preventDefault()
		}
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.PlayerPanel = function($container, match, playerId) {
	this.$container = $container;
	this.match = match;
	this.playerId = playerId;
	this.templates = {
		videoPlayer: "templates/mc/video-player.html",
		playerPanel: "templates/mc/scorecard-player-panel.html",
		playerPanelBowler: "templates/mc/scorecard-player-panel-bowler.html"
	};
	this.videoRequestParams = {
		order: "desc",
		limit: 5,
		encodingFields: "url",
		terms: ["match:" + this.match.matchId, "playerid " + this.playerId.toString()]
	};
	this.APICaller = match.APICaller;
	this.videoFeedPrefix = "scorecardPlayerVideos";
	this.playerBioPrefix = "scorecardPlayerBio";
	this.setEventListeners();
	this.videoData = {
		items: []
	};
	this.playerData = undefined
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.getPlayerBioData = function() {
	var feedId = this.playerBioPrefix + this.playerId.toString();
	this.APICaller.getPlayer(feedId, this, {
		id: this.playerId
	}, true)
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.getPlayerVideoData = function() {
	var feedId = this.videoFeedPrefix + this.playerId.toString();
	this.APICaller.getVideos(feedId, this, this.videoRequestParams, true)
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.stopFeeds = function() {
	this.APICaller.stopPlayerFeed({
		id: this.playerId
	});
	this.APICaller.stopVideosFeed(this.videoRequestParams)
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.onData = function(data, id) {
	if (id === this.videoFeedPrefix + this.playerId.toString()) this.videoData = data;
	else if (id === this.playerBioPrefix + this.playerId.toString())
		if (data.result) this.playerData = data.result;
	this.render()
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.onError = function(id) {
	console.warn("error with " + id)
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.activate = function() {
	this.active = true;
	if (!this.playerData) this.getPlayerBioData();
	else this.render();
	this.getPlayerVideoData()
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.deactivate = function() {
	this.active = false;
	this.stopFeeds()
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.setContainer = function($container) {
	this.$container = $container;
	this.setEventListeners()
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.render = function() {
	var player = this.match.playerLookup[this.playerId] || {};
	var team = this.match.getTeamByPlayerId(this.playerId) || {};
	var playerUrl = this.match.urlGenerator.getPlayerURL(this.playerId, player.fullName, team.id, team.fullName);
	var videos = $.map(this.videoData.items || [], function(video) {
		return PULSE.CLIENT.makeBrightcoveVideoModel(video)
	});
	var model = {
		player: $.extend({
			playerUrl: playerUrl
		}, player, this.playerData, PULSE.CLIENT.Util.getPlayerNames(player.fullName)),
		videos: videos
	};
	var template = this.$container.data("type") === "batsman" ? this.templates.playerPanel : this.templates.playerPanelBowler;
	PULSE.CLIENT.Template.publish(template, this.$container, model);
	var that = this;
	var $imgContainer = this.$container.find(".imgContainer");
	if ($imgContainer.length > 0) $imgContainer.each(function() {
		that.match.urlGenerator.setPlayerImageLoader($(this).attr("data-player-id"), "100x115", $(this), "png", that.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.PlayerPanel.prototype.setEventListeners = function() {
	this.$container.on("click", ".videoThumb", function(e) {
		e.preventDefault();
		var id = $(this).attr("data-media-id");
		PULSE.CLIENT.notify("play/video", {
			id: id,
			success: true
		})
	})
};
var FilterEnforcement = {
	ALL: 0,
	SPECIFIC: 1
};
var clearImg = "i/hawkeye/graph-opacity.png";
if (!PULSE) var PULSE = {};
PULSE.config = {};
PULSE.config.REGION_LOOKUP = {
	"india": ""
};
PULSE.config.IMAGE_URL_PREFIX = PULSE.config.REGION_LOOKUP["india"];
PULSE.config.FF1 = "Arial";
PULSE.config.FF2 = "Verdana";
PULSE.config.ProjecionCongfig = {
	xyz: {
		x: 57.1221291054471,
		y: -0.0174487035898505,
		z: 13.1300009460449
	},
	rpy: {
		r: 0.0010000000475,
		p: -1.77694492740557,
		y: 1.5707852324946
	},
	ar: 1,
	fl: 4665.591796875,
	center: {
		x: 315,
		y: 175
	}
};
var configInit = function() {
	PULSE.config.wagonWheel = {
		width: 630,
		height: 350,
		font: new PULSE.Font(PULSE.config.FF1, 9, "Normal"),
		lineWidth: 2,
		origin: {
			x: 214,
			y: 157
		},
		scale: {
			x: 0.71,
			y: 0.83
		},
		scaleback: {
			length: 100,
			amount: 0.8
		},
		region: {
			origin: {
				x: 10,
				y: 0
			},
			width: 610,
			height: 350
		},
		background: "i/hawkeye/WW.png",
		clazz: "ww",
		transform: function(x, y, sign) {
			return {
				x: this.origin.x + sign * y * this.scale.x,
				y: this.origin.y + sign * x * this.scale.y
			}
		},
		colors: {
			1: ["rgba(255,224,11,0)", "rgba(255,224,11,1)"],
			2: ["rgba(200,200,200,0)", "rgba(200,200,200,1)"],
			3: ["rgba(200,200,200,0)", "rgba(200,200,200,1)"],
			4: ["rgba(90,173,250,0)", "rgba(90,173,250,1)"],
			5: ["rgba(90,173,250,0)", "rgba(90,173,250,1)"],
			6: ["rgba(226,6,44,0)", "rgba(226,6,44,1)"],
			7: ["rgba(226,6,44,0)", "rgba(226,6,44,1)"]
		},
		key: {
			x: [422, 576],
			runs: {
				label: "Runs",
				y: 26,
				color: "white",
				lcolor: "white"
			},
			balls: {
				label: "Balls",
				y: 49,
				color: "white",
				lcolor: "white"
			},
			scoring: {
				label: "Scoring Balls",
				y: 72,
				color: "white",
				lcolor: "white"
			},
			runsleg: {
				label: "Runs Leg-side",
				y: 95,
				color: "white",
				lcolor: "white"
			},
			runsoff: {
				label: "Runs Off-side",
				y: 118,
				color: "white",
				lcolor: "white"
			},
			singles: {
				label: "Singles",
				y: 171,
				color: "white",
				lcolor: "white"
			},
			twothrees: {
				label: "2's and 3's",
				y: 195,
				color: "white",
				lcolor: "white"
			},
			fours: {
				label: "Fours",
				y: 217,
				color: "white",
				lcolor: "white"
			},
			sixes: {
				label: "Sixes",
				y: 240,
				color: "white",
				lcolor: "white"
			}
		},
		keyLabelLeftLimit: 306,
		keyLabelRightLimit: 590,
		keyLabelTopLimit: 135,
		keyLabelBottomLimit: 218,
		keyLabelWidth: 21,
		keyDisplayMode: "labelsandvalues"
	};
	PULSE.config.pmTooltip = {
		font: new PULSE.Font(PULSE.config.FF2, 10, "Bold"),
		spacing: 3,
		border: {
			width: 2,
			color: "rgba(255,255,255,0.8)",
			indicator: 14
		},
		background: "rgba(0,0,0,0.75)",
		margin: {
			top: 5,
			left: 8,
			bottom: 8,
			right: 10
		}
	};
	PULSE.config.pitchMap = {
		width: 630,
		height: 350,
		projection: new OldProjection(PULSE.config.ProjecionCongfig.xyz, PULSE.config.ProjecionCongfig.rpy, PULSE.config.ProjecionCongfig.ar, PULSE.config.ProjecionCongfig.fl, PULSE.config.ProjecionCongfig.center),
		ballSize: "8px",
		ballImagePath: "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/",
		region: {
			origin: {
				x: 63,
				y: 0
			},
			width: 504,
			height: 350
		},
		variants: {
			rh: {
				background: "i/hawkeye/SF03-pitchmap-RH.png",
				offset: -157.5,
				css: "pitchmap rightHanded",
				clazz: "pitchmap-right"
			},
			lh: {
				background: "i/hawkeye/SF03-pitchmap-LH.png",
				offset: 157.5,
				css: "pitchmap leftHanded",
				clazz: "pitchmap-left"
			},
			mix: {
				background: "i/hawkeye/SF03-pitchmap-split.png",
				css: "pitchmap split",
				clazz: "pitchmap-split"
			}
		},
		colors: {
			w: "white",
			"0": "red",
			1: "blue",
			2: "blue",
			3: "blue",
			4: "yellow",
			5: "yellow",
			6: "yellow",
			7: "yellow"
		},
		tooltip: PULSE.config.pmTooltip
	};
	PULSE.config.variableBounce = {
		width: 630,
		height: 350,
		projection: new OldProjection(PULSE.config.ProjecionCongfig.xyz, PULSE.config.ProjecionCongfig.rpy, PULSE.config.ProjecionCongfig.ar, PULSE.config.ProjecionCongfig.fl, PULSE.config.ProjecionCongfig.center),
		ballSize: "8px",
		ballImagePath: "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/",
		region: {
			origin: {
				x: 63,
				y: 0
			},
			width: 504,
			height: 350
		},
		variants: {
			rh: {
				background: "i/hawkeye/SF03-pitchmap-RH.png",
				offset: -157.5,
				css: "pitchmap rightHanded",
				clazz: "pitchmap-right"
			},
			lh: {
				background: "i/hawkeye/SF03-pitchmap-LH.png",
				offset: 157.5,
				css: "pitchmap leftHanded",
				clazz: "pitchmap-left"
			},
			mix: {
				background: "i/hawkeye/SF03-pitchmap-split.png",
				css: "pitchmap split",
				clazz: "pitchmap-split"
			}
		},
		colors: {
			w: "white",
			a: "red",
			s: "blue"
		},
		tooltip: PULSE.config.pmTooltip
	};
	PULSE.config.speedPitchMap = {
		width: 630,
		height: 350,
		projection: new OldProjection(PULSE.config.ProjecionCongfig.xyz, PULSE.config.ProjecionCongfig.rpy, PULSE.config.ProjecionCongfig.ar, PULSE.config.ProjecionCongfig.fl, PULSE.config.ProjecionCongfig.center),
		ballSize: "8px",
		ballImagePath: "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/",
		region: {
			origin: {
				x: 63,
				y: 0
			},
			width: 504,
			height: 350
		},
		variants: {
			rh: {
				background: "i/hawkeye/SF03-pitchmap-RH.png",
				offset: -157.5,
				css: "pitchmap rightHanded",
				clazz: "pitchmap-right"
			},
			lh: {
				background: "i/hawkeye/SF03-pitchmap-LH.png",
				offset: 157.5,
				css: "pitchmap leftHanded",
				clazz: "pitchmap-left"
			},
			mix: {
				background: "i/hawkeye/SF03-pitchmap-split.png",
				css: "pitchmap split",
				clazz: "pitchmap-split"
			}
		},
		buckets: [90, 130, 140],
		colors: {
			"0": "blue",
			1: "yellow",
			2: "orange",
			3: "red"
		},
		tooltip: PULSE.config.pmTooltip
	};
	PULSE.config.pitchMapMountain = {
		width: 480,
		height: 288,
		projection: new OldProjection({
			x: 26.5430542697524,
			y: 6.42045784603685,
			z: 6.95600094604488
		}, {
			r: 0.0010000000475,
			p: -1.80349481105804,
			y: 1.79893524333115
		}, 1, 1991.85864257813, {
			x: 315,
			y: 175
		}),
		boundary: {
			x: {
				min: -1,
				max: 15
			},
			y: {
				min: -2.5,
				max: 2.5
			}
		},
		bucketSize: 0.1,
		light: {
			x: 0.85998,
			y: 0.35092,
			z: 0.28127
		},
		color: {
			r: 1,
			g: 0.13,
			b: 0.13
		},
		lightStrength: 0.7,
		maxHeight: 1.5,
		clazz: "pitchmap-mountain"
	};
	PULSE.config.trajViewer = {
		width: 630,
		height: 350,
		enforcement: {
			innings: FilterEnforcement.SPECIFIC,
			batsman: FilterEnforcement.ALL
		},
		speed: 0.25,
		shadowStyle: "rgba( 0,0,0,0.3 )",
		trailColors: ["rgba( 255, 25, 25,0.5 )", "rgba( 51, 51,229,0.5 )", "rgba( 255,255,25,0.5 )", "rgba( 242,242,242,0.5 )", "rgba( 76,255, 76,0.5 )", "rgba( 255,127, 0,0.5 )", "rgba(  71,178,211,0.5 )", "rgba(  0,  0,  0,0.5 )"],
		maxBalls: 12,
		timeMargin: {
			start: 0.2,
			end: 0.8
		},
		interval: 0.016,
		refresh: 16,
		releaseX: 18.5,
		views: [{
			background: "i/hawkeye/CF06-behind-stumps.png",
			mask: "i/hawkeye/CF06-behind-stumps-overlay.png",
			region: {
				origin: {
					x: 63,
					y: -5
				},
				width: 504,
				height: 370
			},
			projection: new OldProjection({
				x: -12.7894096582779,
				y: 0.00447766839141739,
				z: 0.86519560813904
			}, {
				r: 0,
				p: -1.60535468673334,
				y: -1.57878985199265
			}, 1, 592.308837890625, {
				x: 315,
				y: 175
			}),
			ordering: "serial",
			ballSize: {
				max: 9,
				min: 3
			},
			clazz: "cam1"
		}, {
			background: "i/hawkeye/SF02-slips-view.png",
			mask: "i/hawkeye/SF02-slips-view-overlay.png",
			projection: new OldProjection({
				x: -15.2046166560366,
				y: -2.45856293149031,
				z: 1.27394558906555
			}, {
				r: 0,
				p: -1.61830483720405,
				y: -1.31218983921342
			}, 1, 699.837646484375, {
				x: 315,
				y: 175
			}),
			ordering: "serial",
			ballSize: {
				max: 6,
				min: 4
			},
			clazz: "cam2"
		}, {
			background: "i/hawkeye/CF08-bowler-view.png",
			mask: clearImg,
			projection: new OldProjection({
				x: 15.1697119567005,
				y: -0.0810017372724457,
				z: 1.72019555854797
			}, {
				r: 0,
				p: -1.65470480918884,
				y: 1.56476029743438
			}, 1, 1700.00903320313, {
				x: 315,
				y: 175
			}),
			ordering: "serial",
			ballSize: {
				max: 3,
				min: 7
			},
			clazz: "cam3"
		}],
		ballImagePath: "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/"
	};
	PULSE.config.beehive = {
		width: 630,
		height: 350,
		region: {
			origin: {
				x: 63,
				y: 0
			},
			width: 504,
			height: 350
		},
		projection: new OldProjection({
			x: 11.9629250340501,
			y: 0.00444219825170092,
			z: 1.41549010276794
		}, {
			r: 0,
			p: -1.58300000638701,
			y: 1.56240000052247
		}, 1, 1497.74475097656, {
			x: 315,
			y: 175
		}),
		ballSize: 7,
		ballImagePath: "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/",
		variants: {
			rh: {
				background: "i/hawkeye/CF05_Beehive_RH.jpg",
				clazz: "beehive-right",
				css: "beehive rightHanded"
			},
			lh: {
				background: "i/hawkeye/CF05_Beehive_LH.jpg",
				clazz: "beehive-left",
				css: "beehive leftHanded"
			},
			mix: {
				background: "i/hawkeye/CF05_Beehive_RH.jpg",
				clazz: "beehive",
				css: "beehive"
			}
		},
		colors: {
			w: "white",
			d: "red",
			o: "blue",
			ob: "cyan",
			l: "yellow",
			lb: "orange"
		}
	};
	PULSE.config.bowlSpeeds = {
		width: 630,
		height: 350,
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		enforcement: {
			innings: FilterEnforcement.SPECIFIC
		},
		keyMargin: 10,
		keyMarginR: 10,
		keyFill: "rgba( 0, 0, 0, 0.3 )",
		colors: ["#FF3F3F", "#E6DF1B", "#3CE61B", "#E65E1B", "#007EFF", "#1BD5D2", "#B0B0B0", "#FFFFFF"],
		xAxis: new Axis("Ball", 0, 20, 50, 450, 240, 8, {
			"0": ""
		}),
		yAxis: new Axis("Speed (km/h)", 60, 160, 240, 40, 50, 6, {
			60: "-60",
			160: "160+"
		}),
		clazz: "bowl-speeds"
	};
	PULSE.config.partnerships = {
		width: 630,
		height: 350,
		region: {
			origin: {
				x: 53,
				y: 0
			},
			width: 525,
			height: 350
		},
		enforcement: {
			innings: FilterEnforcement.SPECIFIC,
			batsman: FilterEnforcement.ALL,
			bowler: FilterEnforcement.ALL
		},
		ystart: 23,
		yspacing: 27,
		fontOffset: {
			x: 4,
			y: 3
		},
		pshipText: {
			font: new PULSE.Font(PULSE.config.FF1, 22, "Bold"),
			style: "#ff0"
		},
		otherText: {
			font: new PULSE.Font(PULSE.config.FF1, 20),
			style: "#fff"
		},
		bars: {
			yshift: 0,
			xshift: 125,
			height: 15,
			width: 50,
			colorStops: ["#f00", "#800"],
			minLength: 9,
			maxLength: 80
		},
		tabs: [162, 0, 20],
		clazz: "partnerships"
	};
	PULSE.config.runsPerOver = {
		width: 630,
		height: 350,
		enforcement: {
			innings: FilterEnforcement.SPECIFIC,
			batsman: FilterEnforcement.ALL,
			bowler: FilterEnforcement.ALL
		},
		fow: {
			stroke: "#000",
			fill: "#f00"
		},
		clazz: "runs-per-over",
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		variants: {
			t20: {
				background: "i/hawkeye/runs_per_over_background.png",
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 20, 50, 450, 240, 10, {
					"0": ""
				}, 1, -8),
				yAxis: new NonLinearAxis("Run Rate", 0, 16, 240, 40, 50, 8, [
					[0, 0],
					[4, 1 / 6],
					[12, 5 / 6],
					[16, 1]
				], {
					16: "16+",
					2: "",
					14: ""
				})
			},
			odi: {
				background: "i/hawkeye/runs_per_over_background.png",
				bars: {
					width: 8,
					colorStops: ["#ff0", "#fff"],
					fowsize: 8
				},
				xAxis: new Axis("Overs", 0, 50, 90, 570, 300, 5, {
					"0": ""
				}, 1, -3),
				yAxis: new NonLinearAxis("Runs per over", 0, 12, 300, 40, 90, 4, [
					[0, 0],
					[3, 1 / 6],
					[9, 5 / 6],
					[12, 1]
				], {
					12: "12+"
				})
			}
		}
	};
	PULSE.config.flexikey = {
		width: 630,
		height: 350,
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		spacing: 5,
		background: "rgba(0,0,0,0.3)",
		position: {
			x: 465,
			y: 15,
			anchor: "ne"
		},
		margin: {
			top: 6,
			left: 8,
			bottom: 9,
			right: 10
		},
		swatch: {
			size: 8,
			spacing: 6
		}
	};
	PULSE.config.runRate = {
		width: 630,
		height: 350,
		clazz: "run-rates",
		enforcement: {
			innings: FilterEnforcement.ALL,
			batsman: FilterEnforcement.ALL,
			bowler: FilterEnforcement.ALL
		},
		fow: {
			stroke: "white",
			size: 8
		},
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		flexikey: PULSE.config.flexikey,
		variants: {
			t20: {
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 20, 50, 450, 240, 10, {
					"0": ""
				}, 1, -8),
				yAxis: new NonLinearAxis("Run Rate", 0, 16, 240, 40, 50, 8, [
					[0, 0],
					[4, 1 / 6],
					[12, 5 / 6],
					[16, 1]
				], {
					16: "16+",
					2: "",
					14: ""
				})
			},
			odi: {
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 50, 90, 570, 300, 10, {
					"0": ""
				}, 1, -3),
				yAxis: new NonLinearAxis("Run Rate", 0, 10, 300, 80, 90, 10, [
					[0, 0],
					[3, 1 / 6],
					[7, 5 / 6],
					[10, 1]
				], {
					10: "10+",
					1: "",
					2: "",
					8: "",
					9: ""
				})
			},
			test: {
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 20, 90, 570, 300, 10, {
					"0": ""
				}),
				yAxis: new Axis("Run Rate", 0, 6, 300, 80, 90, 6, {
					6: "6+"
				})
			}
		},
		textField: {
			font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
			spacing: 3,
			background: "rgba(0,0,0,0.3)",
			position: {
				x: 155,
				y: 55,
				anchor: "nw"
			},
			margin: {
				top: 3,
				left: 6,
				bottom: 4,
				right: 8
			}
		}
	};
	PULSE.config.worms = {
		width: 630,
		height: 350,
		enforcement: {
			innings: FilterEnforcement.ALL,
			batsman: FilterEnforcement.ALL,
			bowler: FilterEnforcement.ALL
		},
		fow: {
			stroke: "white",
			size: 8
		},
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		flexikey: PULSE.config.flexikey,
		variants: {
			t20: {
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 20, 55, 450, 240, 10, {
					"0": ""
				}, 1, -8),
				yAxis: new Axis("Runs", 0, 250, 240, 40, 55, 5, undefined, undefined, undefined, 10)
			},
			odi: {
				bars: {
					width: 18,
					colorStops: ["#ff0", "#fff"],
					fowsize: 12
				},
				xAxis: new Axis("Overs", 0, 50, 90, 570, 300, 5, {
					"0": ""
				}, 1, -3),
				yAxis: new Axis("Runs", 0, 350, 300, 80, 90, 7, undefined, undefined, undefined, 10)
			}
		},
		textField: {
			font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
			spacing: 3,
			background: "rgba(0,0,0,0.3)",
			position: {
				x: 45,
				y: 15,
				anchor: "nw"
			},
			margin: {
				top: 3,
				left: 6,
				bottom: 6,
				right: 8
			}
		},
		clazz: "worms"
	};
	PULSE.config.winLikelihood = {
		width: 480,
		height: 288,
		enforcement: {
			innings: FilterEnforcement.ALL,
			batsman: FilterEnforcement.ALL,
			bowler: FilterEnforcement.ALL
		},
		flexikey: PULSE.config.flexikey,
		font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
		fow: {
			stroke: "white",
			size: 8
		},
		drawColor: "#aaa",
		xAxis: new PULSE.RaphaelAxis("Match Progress", 0, 20, 90, 570, 300, 0, {
			"0": ""
		}),
		yAxis: new PULSE.RaphaelAxis("Win Likelihood %", 0, 100, 300, 70, 90, 5),
		tooltips: {
			background: {
				color: "#000",
				opacity: 0.5
			},
			foreground: "#fff",
			font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
			height: 18,
			border: {
				left: 6,
				right: 5
			}
		},
		dismissalTextField: {
			font: new PULSE.Font(PULSE.config.FF2, 12, "Bold"),
			spacing: 5,
			background: {
				color: "#000",
				opacity: 0.3
			},
			position: {
				x: 45,
				y: 15,
				anchor: "nw"
			},
			margin: {
				top: 5,
				left: 8,
				bottom: 8,
				right: 10
			}
		}
	}
};
var graphs;
var graphInit = function() {
	configInit();
	graphs = {
		"Wagon Wheel": new Graph("", clearImg, new WagonWheelRenderer(PULSE.config.wagonWheel)),
		"Pitch Map": new Graph("", clearImg, new PitchMapRenderer(PULSE.config.pitchMap)),
		"Speed Pitch Map": new Graph("", clearImg, new SpeedPitchMapRenderer(PULSE.config.speedPitchMap)),
		"Pitch Map Mountain": new Graph("", clearImg, new PitchMapMountainRenderer(PULSE.config.pitchMapMountain)),
		"Trajectory Viewer": new Graph("", clearImg, new TrajectoryRenderer(PULSE.config.trajViewer)),
		"Beehive Placement": new Graph("", clearImg, new BeehiveRenderer(PULSE.config.beehive)),
		"Variable Bounce": new Graph("", clearImg, new VariableBounceRenderer(PULSE.config.variableBounce)),
		"Bowl Speeds": new Graph("", clearImg, new BowlSpeedsRenderer(PULSE.config.bowlSpeeds)),
		"Partnerships": new Graph("", clearImg, new PartnershipsRenderer(PULSE.config.partnerships)),
		"Runs Per Over": new Graph("", clearImg, new RunsPerOverRenderer(PULSE.config.runsPerOver)),
		"Run Rate": new Graph("", clearImg, new RunRateRenderer(PULSE.config.runRate)),
		"Worms": new Graph("", clearImg, new WormsRenderer(PULSE.config.worms)),
		"Win Likelihood": new Graph("", clearImg, new WinLikelihoodRenderer(PULSE.config.winLikelihood))
	}
};

function Axis(title, min, max, start, end, fixed, numLabels, labels, overdraw, shift, titleShift) {
	this.title = title;
	this.min = min;
	this.max = max;
	this.configuredMax = max;
	this.start = start;
	this.end = end;
	this.configuredEnd = end;
	this.fixed = fixed;
	this.numLabels = numLabels;
	this.labels = labels;
	this.overdraw = overdraw === undefined ? 0 : overdraw;
	this.shift = shift === undefined ? 0 : shift;
	this.titleShift = titleShift === undefined ? 0 : titleShift
}
Axis.prototype.project = function(value) {
	var clamped = value;
	if (clamped < this.min) clamped = this.min;
	if (clamped > this.max) clamped = this.max;
	return this.shift + this.start + (clamped - this.min) / (this.max - this.min) * (this.end - this.start)
};
Axis.prototype.drawTo = function(ctx, isX) {
	ctx.save();
	ctx.strokeStyle = "rgba(255,255,255,1)";
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.lineCap = "square";
	ctx.lineWidth = 2;
	ctx.beginPath();
	if (isX) {
		ctx.moveTo(this.start, this.fixed);
		ctx.lineTo(this.end + this.overdraw, this.fixed)
	} else {
		ctx.moveTo(this.fixed, this.start);
		ctx.lineTo(this.fixed, this.end + this.overdraw)
	}
	ctx.stroke();
	var spacing = Math.round((this.max - this.min) / this.numLabels);
	var newSpacing = 10 * Math.round(spacing / 10);
	if (newSpacing > 0) spacing = newSpacing;
	for (var val = this.min; val <= this.max; val += spacing) {
		var pos = this.project(val);
		var label = val;
		if (this.labels !== undefined && this.labels[val] !== undefined) label = this.labels[val];
		if (isX) Utils.anchoredFillText(ctx, label, pos, this.fixed + 4, "n");
		else Utils.anchoredFillText(ctx, label, this.fixed - 4, pos, "e")
	}
	var fontsize = Utils.fontSizeToString(ctx.font.fontsize());
	var pos = this.project((this.min + this.max) / 2);
	if (isX) Utils.anchoredFillText(ctx, this.title, pos, this.fixed + 25 + this.titleShift + (fontsize > 14 ? fontsize * 1.5 : 0), "n");
	else {
		var x = this.fixed - 37 - this.titleShift - (fontsize > 14 ? fontsize + fontsize : 0);
		var y = pos;
		ctx.save();
		ctx.rotate(Math.PI / -2);
		ctx.translate(-y - x, -y + x);
		Utils.anchoredFillText(ctx, this.title, x, y, "s");
		ctx.restore()
	}
	ctx.restore()
};
if (!PULSE) var PULSE = {};
PULSE.BallRenderer = {
	mode: "image",
	specular: true,
	imageCache: {},
	colorMap: {
		white: ["#fff", "#222", "#bbb"],
		red: ["#f77", "#200", "#b33"],
		blue: ["#77f", "#002", "#33b"],
		yellow: ["#ff7", "#220", "#bb3"],
		cyan: ["#7ff", "#022", "#3bb"],
		orange: ["#f80", "#210", "#b40"],
		black: ["#333", "#000", "#bbb"]
	},
	freeRender: function(ctx, x, y, color, sz) {
		ctx.save();
		var c = new PULSE.Color(color);
		var gradient = ctx.createLinearGradient(x + sz / 2, y - sz / 2, x - sz / 2, y + sz / 2);
		gradient.addColorStop(0, c.toCSS());
		gradient.addColorStop(1, c.darken().toCSS());
		ctx.fillStyle = gradient;
		ctx.beginPath();
		Utils.circle(ctx, x, y, sz / 2);
		ctx.fill();
		ctx.restore()
	},
	render: function(ctx, x, y, color, size, onLoadCallback) {
		var sz = size;
		var fixed = false;
		if (typeof size === "string") {
			sz = parseInt(size, 10);
			fixed = true
		}
		if ("gradient" === this.mode) {
			var gradient = ctx.createLinearGradient(x + sz / 2, y - sz / 2, x - sz / 2, y + sz / 2);
			gradient.addColorStop(0, this.colorMap[color][0]);
			gradient.addColorStop(1, this.colorMap[color][1]);
			ctx.fillStyle = gradient;
			ctx.beginPath();
			Utils.circle(ctx, x, y, sz / 2);
			ctx.fill();
			if (this.specular) {
				ctx.strokeStyle = "none";
				ctx.fillStyle = "r(0.8,0.2)#fff-" + this.colorMap[color][2];
				ctx.beginPath();
				Utils.circle(ctx, x + sz / 4 - 1, y - sz / 4, sz / 4);
				ctx.fill()
			}
		} else if ("plain" === this.mode) {
			ctx.fillStyle = this.colorMap[color][2];
			ctx.beginPath();
			Utils.circle(ctx, x, y, sz / 2);
			ctx.fill()
		} else if ("image" === this.mode) {
			var path = PULSE.config.IMAGE_URL_PREFIX;
			path += "http://dynamic.pulselive.com/test/client/india-times/i/hawkeye/balls/phe_" + color + "_ball.png";
			var image = PULSE.BallRenderer.imageCache[path];
			if (image === undefined) {
				PULSE.Tracer.info("Reloading ball image for " + path);
				image = new Image;
				image.src = path;
				image.onload = onLoadCallback;
				PULSE.BallRenderer.imageCache[path] = image
			} else if (image.width > 0 && image.height > 0)
				if (isiPad()) {
					sz = Math.round(sz);
					x = Math.round(x);
					y = Math.round(y);
					ctx.drawImage(image, x - (sz >> 1), y - (sz >> 1), sz, sz)
				} else ctx.drawImage(image, x - sz / 2, y - sz / 2, sz, sz)
		}
	}
};

function TrajectoryRenderer(config) {
	this.config = config;
	this.timerId = null;
	this.animationPeriod = null;
	this.time = null;
	this.speed = config.speed;
	this.viewIndex = 0;
	this.lastCall = new Date;
	var hash = location.hash;
	if (hash && hash.length > 0) {
		hash = hash.slice(1, hash.length);
		var index = $.inArray(hash, ["stumps", "slips", "bowler"]);
		if (index > -1) this.viewIndex = index
	}
	this.defer = true;
	this.renderBounce = true;
	this.renderEnd = true;
	TrajectoryRenderer.prototype.augmentConfig = function() {
		if (this.viewIndex < this.config.views.length) {
			var subconfig = this.config.views[this.viewIndex];
			for (var property in subconfig) this.config[property] = subconfig[property]
		}
	};
	this.augmentConfig();
	var that = this;
	this.animloop = function() {
		var id = requestAnimationFrame(that.animloop);
		that.increment();
		return id
	}
}
TrajectoryRenderer.prototype.setSize = function(sizeProperties) {
	if (this.config.region) {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = 1 / this.origConfig.region.width * sizeProperties.width;
		var scaleY = 1.1 / this.origConfig.region.height * sizeProperties.height;
		if (widerRatio) var scale = this.config.scaleXY = scaleY;
		else var scale = this.config.scaleXY = scaleX;
		this.dimensions = {};
		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;
		this.cropDimensions = {};
		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;
		this.cropOffset = {};
		this.cropOffset.x = sizeProperties.width / 2 - this.origConfig.region.width / 2 * scale;
		this.cropOffset.y = sizeProperties.height / 2 - this.origConfig.region.height / 2 * scale;
		this.offset = {};
		this.offset.x = sizeProperties.width / 2 - (this.origConfig.region.origin.x + this.origConfig.region.width / 2) * scale;
		this.offset.y = sizeProperties.height / 2 - (this.origConfig.region.origin.y + this.origConfig.region.height / 2) * scale;
		$("body").find("#traj-description, .returnLive a").attr("style", "font-size:" + Math.max(10, Math.round(11 * this.config.scaleXY * 0.9)) + "px");
		for (var i = 0; i < this.config.views.length; i++) {
			var view = this.config.views[i];
			view.projection.fl = this.origConfig.views[i].projection.fl * scale;
			view.projection.center.x = this.offset.x + this.config.width / 2;
			view.projection.center.y = this.offset.y + this.config.height / 2
		}
	} else {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.width / this.origConfig.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = 1 / this.origConfig.width * sizeProperties.width;
		var scaleY = 1 / this.origConfig.height * sizeProperties.height;
		if (widerRatio) var scale = this.config.scaleXY = scaleY;
		else var scale = this.config.scaleXY = scaleX;
		this.dimensions = {};
		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;
		this.offset = {};
		this.offset.x = (sizeProperties.width - this.dimensions.x) / 2;
		this.offset.y = (sizeProperties.height - this.dimensions.y) / 2;
		for (var i = 0; i < this.config.views.length; i++) {
			var view = this.config.views[i];
			view.projection.fl = this.origConfig.views[i].projection.fl * scale;
			view.projection.center.x = sizeProperties.width / 2;
			view.projection.center.y = sizeProperties.height / 2
		}
	}
};
TrajectoryRenderer.prototype.setView = function(viewIndex) {
	this.resetRendering();
	this.viewIndex = viewIndex;
	this.augmentConfig();
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.setMask()
};
TrajectoryRenderer.prototype.nextView = function() {
	var viewIndex = this.viewIndex + 1;
	if (viewIndex >= this.config.views.length) viewIndex = 0;
	this.setView(viewIndex)
};
TrajectoryRenderer.prototype.setSpeed = function(speed) {
	this.speed = speed
};
TrajectoryRenderer.prototype.showDescription = function() {
	if (this.data.length > this.activeBall) PULSE.GraphController.setInfo(this.data[this.activeBall].generateDescription(), true)
};
TrajectoryRenderer.prototype.render = function(db, data, ctx, immediate) {
	PULSE.Tracer.info("TrajectoryRenderer.render called with immediate\x3d" + immediate);
	this.ctx = ctx.canvas;
	this.augmentConfig();
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.setMask();
	if (this.defer && !immediate)
		if (data === undefined || data === null || data.length === 0) {
			PULSE.Tracer.info("No data, returning");
			return
		} else if (this.deferredRenderCall !== undefined) {
		PULSE.Tracer.info("Deferring call");
		this.deferredRenderCall = {
			db: db,
			data: data,
			ctx: ctx
		};
		return
	} else {
		PULSE.Tracer.info("Continuing");
		this.deferredRenderCall = null
	} if (this.config.maxBalls !== undefined) this.data = data.slice(0, this.config.maxBalls);
	else this.data = data;
	var validData = [];
	for (var i = 0, j = this.data.length; i < j; i++) {
		var row = this.data[i];
		var traj = row.get(CricketField.TRAJECTORY);
		if (traj !== undefined && traj.trackApproved) validData.push(row)
	}
	this.data = validData;
	this.renderData = [];
	this.activeBall = 0;
	this.offsets = [0];
	this.showDescription();
	var anim = {
		start: Number.MAX_VALUE,
		end: Number.MIN_VALUE
	};
	PULSE.Tracer.info("Rendering " + this.data.length + " trajectories");
	var total = 0;
	for (var i = 0, j = this.data.length; i < j; i++) {
		var row = this.data[i];
		var traj = row.get(CricketField.TRAJECTORY);
		PULSE.Tracer.info("Traj " + i + " period " + Utils.toString(traj.period, true));
		if ("serial" === this.config.ordering) {
			var length = traj.period.end - traj.period.start;
			total += length;
			if (i === 0) anim.start = 0;
			if (i === j - 1) anim.end = total + this.config.timeMargin.end;
			this.offsets[i + 1] = total
		} else {
			var start = traj.period.start - this.config.timeMargin.start;
			var end = traj.period.end + this.config.timeMargin.end;
			if (start < anim.start) anim.start = start;
			if (end > anim.end) anim.end = end
		}
	}
	PULSE.Tracer.info("Offsets: " + Utils.toString(this.offsets, true));
	this.animationPeriod = anim;
	this.time = this.animationPeriod.start;
	PULSE.Tracer.info("Animation period is " + Utils.toString(anim, true));
	if (this.timerId !== null) clearInterval(this.timerId);
	var that = this;
	this.timerId = setInterval(function() {
		that.increment()
	}, this.config.refresh)
};
TrajectoryRenderer.prototype.unrender = function() {
	this.deferredRenderCall = undefined;
	if (this.timerId !== null) {
		clearInterval(this.timerId);
		this.timerId = null
	}
};
TrajectoryRenderer.prototype.resetRendering = function() {
	this.time = this.animationPeriod.start;
	this.renderData = [];
	this.activeBall = 0;
	this.showDescription();
	if (this.deferredRenderCall) {
		PULSE.Tracer.info("Making deferred rendering call");
		this.render(this.deferredRenderCall.db, this.deferredRenderCall.data, this.deferredRenderCall.ctx, true);
		this.deferredRenderCall = null
	}
};
TrajectoryRenderer.prototype.setMask = function() {
	this.controller.setMask(this.config.mask, this.dimensions, this.offset, this.config.clazz)
};
TrajectoryRenderer.addRenderData = function(config, rd, traj, time) {
	var bos = TrajectoryRenderer.getBallOnScreen(config, traj, time);
	rd.shadow.push({
		x: bos.shadow.x,
		y: bos.shadow.y,
		size: bos.size
	});
	rd.trail.push({
		x: bos.ball.x,
		y: bos.ball.y,
		size: bos.size
	});
	rd.ball = {
		x: bos.ball.x,
		y: bos.ball.y,
		size: bos.size
	}
};
TrajectoryRenderer.prototype.increment = function() {
	var now = new Date;
	var interval = now - this.lastCall;
	if (interval === 0) return;
	this.lastCall = now;
	if (interval > 500) interval = 16;
	this.time += interval * this.speed / 1E3;
	if (this.time > this.animationPeriod.end) this.resetRendering();
	if (this.time > this.offsets[this.activeBall + 1]) {
		if (this.renderEnd) {
			var thisTraj = this.data[this.activeBall].get(CricketField.TRAJECTORY);
			var thisRd = this.renderData[this.activeBall];
			TrajectoryRenderer.addRenderData(this.config, thisRd, thisTraj, thisTraj.period.end)
		}
		this.activeBall++;
		this.showDescription()
	}
	for (var i = 0, j = this.data.length; i < j; i++)
		if ("parallel" === this.config.ordering || i === this.activeBall) {
			var row = this.data[i];
			var traj = row.get(CricketField.TRAJECTORY);
			var rd = this.renderData[i];
			if (rd === undefined) {
				rd = [];
				rd.shadow = [];
				rd.trail = [];
				this.renderData[i] = rd
			}
			var offset = this.offsets[i] === undefined ? 0 : this.offsets[i];
			var t1 = this.time - offset + traj.period.start;
			TrajectoryRenderer.addRenderData(this.config, rd, traj, t1);
			if (this.renderBounce) {
				var t2 = t1 + this.config.interval * this.config.speed;
				if (t1 < traj.bt && t2 > traj.bt) TrajectoryRenderer.addRenderData(this.config, rd, traj, traj.bt)
			}
		}
	this.drawTo(this.ctx, this.renderData)
};
TrajectoryRenderer.prototype.drawTo = function(ctx, renderData) {
	var that = this;
	ctx.save();
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var w = ctx.canvas.width;
	ctx.canvas.width = 1;
	ctx.canvas.width = w;
	ctx.strokeStyle = this.config.shadowStyle;
	for (var i = 0, j = renderData.length; i < j; i++) {
		var shadowData = renderData[i].shadow;
		ctx.beginPath();
		ctx.lineWidth = 6 * this.config.scaleXY;
		if (shadowData.length > 0) ctx.moveTo(shadowData[0].x, shadowData[0].y);
		for (var m = 1, n = shadowData.length; m < n; m++) ctx.lineTo(shadowData[m].x, shadowData[m].y);
		ctx.stroke()
	}
	for (var i = 0, j = renderData.length; i < j; i++) {
		var trailColor = this.getTrailColor(i, renderData.length);
		ctx.strokeStyle = trailColor;
		var trailData = renderData[i].trail;
		ctx.beginPath();
		ctx.lineWidth = 6 * this.config.scaleXY;
		ctx.lineJoin = "bevel";
		if (trailData.length > 0) ctx.moveTo(trailData[0].x, trailData[0].y);
		for (var m = 1, n = trailData.length; m < n; m++) ctx.lineTo(trailData[m].x, trailData[m].y);
		ctx.stroke()
	}
	var callback = function() {
		that.drawTo(ctx, renderData)
	};
	for (var i = 0, j = renderData.length; i < j; i++) {
		var ball = renderData[i].ball;
		PULSE.BallRenderer.render(ctx, ball.x, ball.y, "red", ball.size * this.config.scaleXY * 1.5, callback)
	}
	ctx.restore()
};
TrajectoryRenderer.prototype.getTrailColor = function(i, size) {
	var pretty = true;
	var color = this.config.trailColors[i % this.config.trailColors.length];
	if (!pretty && i < size - 1) color = "rgba(0,0,0,0.3)";
	return color
};
TrajectoryRenderer.getBallOnScreen = function(config, traj, time) {
	var xyz;
	if (time > traj.period.end) xyz = traj.getPositionAtTime(traj.period.end);
	else if (time < traj.period.start) xyz = traj.getPositionAtTime(traj.period.start);
	else xyz = traj.getPositionAtTime(time);
	var size = config.ballSize.max - xyz.x * ((config.ballSize.max - config.ballSize.min) / config.releaseX);
	xyz.x -= 10.06;
	var shadowScreen = config.projection.project({
		x: xyz.x,
		y: xyz.y,
		z: 0
	});
	var ballScreen = config.projection.project(xyz);
	return {
		shadow: shadowScreen,
		ball: ballScreen,
		size: size
	}
};

function Flexikey(config) {
	this.entries = [];
	this.config = Utils.cloneObject(config)
}
Flexikey.prototype.addEntry = function(label, color) {
	this.entries.push({
		label: label,
		color: color
	})
};
Flexikey.prototype.render = function(ctx) {
	ctx.save();
	var height = this.config.margin.top;
	var width = this.config.margin.left;
	var scale = 1 / this.config.width * ctx.canvas.width;
	var maxWidth = 0;
	var sheight = 0;
	for (var i = 0, j = this.entries.length; i < j; i++) {
		var entry = this.entries[i];
		var ss = Utils.stringSize(ctx, entry.label);
		height += ss.height + this.config.spacing;
		sheight = ss.height;
		if (ss.width > maxWidth) maxWidth = ss.width
	}
	height += this.config.margin.bottom - this.config.spacing;
	width += this.config.swatch.size + this.config.swatch.spacing + maxWidth + this.config.margin.right;
	var origin = Utils.adjustForAnchor(this.config.position.x, this.config.position.y, {
		width: width,
		height: height
	}, this.config.position.anchor);
	var padding = this.config.width - (origin.x + width);
	origin.x = ctx.canvas.width - origin.y - width;
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.config.background;
	ctx.rect(origin.x, origin.y, width, height);
	ctx.fill();
	ctx.restore();
	var x0 = origin.x + this.config.margin.left + this.config.swatch.size / 2;
	var x1 = x0 + this.config.swatch.size / 2 + this.config.swatch.spacing;
	var y = origin.y + this.config.margin.top + sheight / 2;
	ctx.font = this.config.font;
	for (var i = 0, j = this.entries.length; i < j; i++) {
		var entry = this.entries[i];
		ctx.beginPath();
		ctx.fillStyle = entry.color;
		Utils.circle(ctx, x0, y, this.config.swatch.size / 2);
		ctx.fill();
		ctx.fillStyle = "white";
		Utils.anchoredFillText(ctx, entry.label, x1, y, "w");
		y += sheight + this.config.spacing
	}
	ctx.restore()
};
if (!PULSE) var PULSE = {};
PULSE.GraphController = function(ui, db) {
	this.ui = ui;
	this.db = db;
	this.graphProvider = new PULSE.GraphProvider;
	var that = this;
	$(ui.placeholderDiv).mousemove(function(event) {
		that.onMouse(event)
	});
	$(ui.placeholderDiv).mousedown(function(event) {
		that.onMouse(event)
	});
	$(ui.placeholderDiv).mouseup(function(event) {
		that.onMouse(event)
	});
	ui.controller = this;
	this.trajFilteredData = [];
	this.trajFilterMode = this.latestOverMode;
	this.selectedFilterMode = this.latestOverFilterMode;
	this.data = [];
	this.rawData = {};
	this.filter = {};
	this.graph = null;
	this.selectedGraphName = null;
	this.isTraj = false;
	this.filterModeLookup = {
		"Trajectory Viewer": [{
			mode: this.latestOverFilterMode,
			selector: "latestOverFilterCntr"
		}, {
			mode: this.wicketsFilterMode,
			selector: "wicketsFilterCntr"
		}, {
			mode: this.findABallFilterMode,
			selector: "findABallFilterCntr"
		}],
		"Worms": [{
			mode: this.noOptionsFilterMode,
			selector: "noOptionsFilterCntr"
		}],
		"Wagon Wheel": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Win Likelihood": [{
			mode: this.noOptionsFilterMode,
			selector: "noOptionsFilterCntr"
		}],
		"Run Rate": [{
			mode: this.noOptionsFilterMode,
			selector: "noOptionsFilterCntr"
		}],
		"Variable Bounce": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Speed Pitch Map": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Pitch Map": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Pitch Map Mountain": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Runs Per Over": [{
			mode: this.inningsFilterMode,
			selector: "inningsFilterCntr"
		}],
		"Partnerships": [{
			mode: this.inningsFilterMode,
			selector: "inningsFilterCntr"
		}],
		"Bowl Speeds": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}],
		"Beehive Placement": [{
			mode: this.defaultFilterMode,
			selector: "defaultFilterCntr"
		}]
	};
	if (db.params.graph) {
		var name = this.graphProvider.getBestMatch(db.params.graph);
		if (name) this.graphProvider.syncTo(name)
	}
	this.setGraph(this.graphProvider.current());
	this.ui.setAvailableGraphs(this.graphProvider.getAvailableGraphs())
};
PULSE.GraphController.prototype.deriveUrlParamaters = function(includeLocation, prefix, suffix) {
	var params = this.db.params;
	var s = prefix || "";
	if (includeLocation) s += window.location.origin + window.location.pathname;
	s += "?tid\x3d" + params.tid;
	s += "\x26mid\x3d" + params.mid;
	s += "\x26nonav";
	if (this.selectedGraphName) {
		s += "\x26graph\x3d";
		s += this.selectedGraphName
	}
	if (this.isTraj)
		if (!this.filter || this.filter.over === CricketFilter.WATCHLIVE);
		else {
			s += "\x26bp\x3d";
			s += this.getSelectedInnings();
			s += ".";
			s += this.getSelectedOver();
			if (this.getSelectedBall() !== "All Balls") {
				s += ".";
				s += this.getSelectedBall()
			}
		} else if (this.filter)
		for (var key in this.filter) {
			var value = this.filter[key];
			if (value) {
				s += "\x26";
				s += key;
				s += "\x3d";
				s += value
			}
		}
	s += suffix || "";
	return s
};
PULSE.GraphController.prototype.deriveFilter = function() {
	var filterModes = this.filterModeLookup[this.selectedGraphName];
	var exists = false;
	for (var i = 0; i < filterModes.length; i++) {
		var mode = filterModes[i].mode;
		if (this.selectedFilterMode === mode) {
			exists = true;
			this.ui.markSelectedFilterPanel(filterModes[i].selector);
			break
		}
	}
	if (!exists) {
		this.selectedFilterMode = filterModes[0].mode;
		this.ui.markSelectedFilterPanel(filterModes[0].selector)
	}
	return this.selectedFilterMode()
};
PULSE.GraphController.prototype.deriveData = function() {
	var derived = [];
	var rawSize = 0;
	var thisFilter = this.explicit ? this.filter : this.deriveFilter();
	if (!this.explicit) this.filter = thisFilter;
	PULSE.Tracer.info("Deriving data using filter: " + Utils.toString(thisFilter, true) + " explicit\x3d" + this.explicit);
	for (var key in this.rawData)
		if (this.rawData.hasOwnProperty(key)) {
			var item = this.rawData[key];
			if (item.get(CricketField.BATSMAN)) {
				rawSize++;
				if (item.satisfiesFilter(thisFilter)) derived.push(item)
			}
		}
	PULSE.Tracer.info("Raw data size: " + rawSize + ", derived data size: " + derived.length);
	this.setPlaceholder(rawSize, derived.length);
	if (rawSize > 0) this.setFilterOptions();
	return derived
};
PULSE.GraphController.prototype.setPlaceholder = function(rawDataLength, derivedDataLength) {
	if (rawDataLength === 0) {
		this.ui.setPlaceholderState(PULSE.PlaceholderState.NODATA);
		$(".menu .filter").css("display", "none")
	} else if (derivedDataLength === 0) {
		this.ui.setPlaceholderState(PULSE.PlaceholderState.NOFILTEREDDATA);
		$("#traj-description").html("\x26nbsp;");
		$(".menu .filter").css("display", "inline-block")
	} else {
		this.ui.setPlaceholderState(PULSE.PlaceholderState.DATA);
		$(".menu .filter").css("display", "inline-block")
	}
};
PULSE.GraphController.prototype.setView = function(view) {
	if (this.graph !== null && typeof this.graph.renderer.setView === "function") {
		this.graph.renderer.setView(view);
		this.ui.setCameraExpanded(false)
	}
};
PULSE.GraphController.prototype.reset = function() {
	this.ui.setMenuExpanded(false)
};
PULSE.GraphController.prototype.getEnforcements = function() {
	if (this.graph !== undefined && this.graph.renderer.config !== undefined) return this.graph.renderer.config.enforcement
};
PULSE.GraphController.prototype.setRawData = function(rawData) {
	this.rawData = rawData;
	this.setData(this.deriveData(), true)
};
PULSE.GraphController.prototype.setFilter = function(filter, explicit) {
	PULSE.Tracer.info("setFilter:" + Utils.toString(filter, true) + " explicit:" + explicit);
	this.explicit = explicit;
	this.filter = filter;
	if (filter.innings !== undefined && filter.innings !== CricketFilter.ALL && isNaN(+filter.innings)) {
		this.filter.innings = this.db.getInningsFromString(filter.innings);
		PULSE.Tracer.info("Innings name " + filter.innings + " derived number " + this.filter.innings)
	}
	this.updateInfo();
	this.setData(this.deriveData(), true)
};
PULSE.GraphController.prototype.setData = function(data, immediateRender) {
	this.data = data;
	if (!this.active) return;
	if (this.graph !== null) this.render(immediateRender);
	this.updateInfo()
};
PULSE.GraphController.prototype.makeCrossBrowserCss = function(path, dimensions) {
	var css = {
		"width": Math.round(dimensions.x),
		"height": Math.round(dimensions.y)
	};
	if ($.support.opacity) css["background-size"] = "100%";
	else {
		css["filter"] = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d" + path + ', sizingMethod\x3d"scale");';
		css["-ms-filter"] = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d" + path + ', sizingMethod\x3d"scale");'
	}
	return css
};
PULSE.GraphController.prototype.setBackground = function(path, css, dimensions, offset, clazz) {
	if (dimensions && offset) {
		var img = $("\x3cdiv\x3e").addClass(clazz).css(this.makeCrossBrowserCss(path, dimensions)).html("\x26nbsp;");
		PULSE.GraphController.setContent(this.ui.backgroundDiv, img, dimensions, offset)
	} else {
		var img = new Image;
		if (!Utils.isNullish(path)) img.src = PULSE.config.IMAGE_URL_PREFIX + path;
		PULSE.GraphController.setContent(this.ui.backgroundDiv, img, dimensions, offset)
	}
	this.db.setBackgroundCSS(css)
};
PULSE.GraphController.prototype.setMask = function(path, dimensions, offset, clazz) {
	if (dimensions && offset) {
		var img = $("\x3cdiv\x3e").addClass(clazz).css(this.makeCrossBrowserCss(path, dimensions)).html("\x26nbsp;");
		PULSE.GraphController.setContent(this.ui.overlayDiv, img, dimensions, offset)
	} else {
		var img = new Image;
		if (!Utils.isNullish(path)) img.src = PULSE.config.IMAGE_URL_PREFIX + path;
		PULSE.GraphController.setContent(this.ui.overlayDiv, img, dimensions, offset)
	}
};
PULSE.GraphController.prototype.showGraph = function(feature, innings, batsman, bowler, bp) {
	var graphList = this.graphProvider.getAvailableGraphs();
	var name = PULSE.Levenshtein.bestMatch(graphList, feature);
	if (!Utils.isNullish(name)) {
		this.setGraph(name);
		this.graphProvider.syncTo(name);
		var page = this.graphProvider.currentGraphIdx()
	}
	if ("Trajectory Viewer" === name) this.showTrajectory(bp);
	else {
		var filter = {};
		if (!Utils.isNullish(innings)) filter.innings = innings;
		if (!Utils.isNullish(batsman)) filter.batsman = batsman;
		if (!Utils.isNullish(bowler)) filter.bowler = bowler;
		if (batsman) batsman = unescape(batsman);
		if (bowler) bowler = unescape(bowler);
		this.selectedInnings = innings ? parseInt(innings, 10) : undefined;
		this.selectedBatsman = !Utils.isNullish(batsman) ? batsman : CricketFilter.ALLBATSMEN;
		this.selectedBowler = !Utils.isNullish(bowler) ? bowler : CricketFilter.ALLBOWLERS;
		this.setFilter(filter, false)
	}
};
PULSE.GraphController.prototype.showGame = function(game) {
	this.trajFilteredData = [];
	this.data = [];
	this.rawData = {};
	this.setRawData(this.rawData);
	this.ui.setPlaceholderState(PULSE.PlaceholderState.NODATA);
	$(".trajDescription .status").html("\x26nbsp;");
	$(".hawkeyeContextCntr").addClass("turnedOff");
	this.resetNewFilteringData();
	this.reset()
};
PULSE.GraphController.prototype.showTrajectory = function(bpString) {
	var filter = {};
	if (!bpString) filter.over = CricketFilter.WATCHLIVE;
	else {
		var bp;
		if (bpString.match(/[0-9]+\.[0-9]+\.All/)) bp = new PULSE.BallProgress(bpString.replace(/All/, "0"));
		else bp = new PULSE.BallProgress(bpString)
	}
	this.setGraph("Trajectory Viewer");
	var rawSize = 0;
	for (var key in this.rawData)
		if (this.rawData.hasOwnProperty(key)) {
			var item = this.rawData[key];
			if (item.get(CricketField.BATSMAN)) rawSize++
		}
	this.setPlaceholder(rawSize, this.trajFilteredData.length);
	this.selectedInnings = parseInt(bp.innings);
	this.selectedBowler = CricketFilter.ALLBOWLERS;
	this.selectedOver = bp.over;
	this.selectedBall = bp.ball;
	this.selectedWicket = bpString;
	this.selectedFilterMode = this.findABallFilterMode;
	this.setData(this.deriveData(), true);
	this.ui.setSettingsExpanded(false)
};
PULSE.GraphController.prototype.setActive = function(value) {
	this.db.setActive(value);
	if (!value) this.setGraph(null);
	else this.setGraph(this.selectedGraphName)
};
PULSE.GraphController.setInfo = function(infoText, traj) {
	var info = $(".trajDescription .status");
	if (info.length) info.html(infoText);
	PULSE.GraphController.setShowTrajDescription(traj);
	if (traj);
};
PULSE.GraphController.updateLatestTrajInfo = function(trajData) {
	if (trajData) {
		$("#latestOverCntr .ballLabel").html(trajData.bp ? "Viewing " + PULSE.UdsHawkeyeDatabase.getInstance().getInningsString(trajData.bp.innings) + " : " + (trajData.get(CricketField.OVER) - 1) + "." + trajData.get(CricketField.COUNTING_BALL) : "");
		$("#latestOverCntr table tr:eq(0) td:eq(1)").html(trajData.get(CricketField.BOWLER));
		$("#latestOverCntr table tr:eq(1) td:eq(1)").html(trajData.get(CricketField.BATSMAN));
		$("#latestOverCntr table tr:eq(2) td:eq(1)").html(trajData.get(CricketField.NF_BATSMAN));
		var speed = trajData.get(CricketField.BOWL_SPEED);
		if (!isNaN(speed) && speed >= 13 && speed <= 54) {
			if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) speed = PULSE.SpeedModeController.mpsToKmh(speed);
			speed = speed.toFixed(1);
			speed += " " + PULSE.SpeedModeController.unit
		} else speed = "";
		$("#latestOverCntr table tr:eq(4) td:eq(1)").html(speed);
		var credit = +trajData.get(CricketField.CREDIT);
		var description = "";
		if (trajData.get(CricketField.IS_WICKET)) description += "wicket";
		else if (credit === 0) description += "dot ball";
		else {
			description += credit;
			description += " run";
			if (credit > 1) description += "s"
		}
		$("#latestOverCntr table tr:eq(3) td:eq(1)").html(description)
	}
};
PULSE.GraphController.setGraphInfo = function(graphName) {
	var info = document.getElementById("current-graph");
	if (info !== null) info.innerHTML = graphName
};
PULSE.GraphController.setShowTrajDescription = function(show) {
	var desc = document.getElementById("trajDescWrapper");
	if (desc !== null) {
		var c = "vControlWrap";
		if (!show) c += " hidden";
		desc.setAttribute("class", c);
		desc.setAttribute("className", c)
	}
};
PULSE.GraphController.prototype.stopRendering = function() {
	if (this.graph.renderer !== null && typeof this.graph.renderer.unrender === "function") {
		this.active = false;
		this.graph.renderer.unrender()
	}
};
PULSE.GraphController.prototype.setGraph = function(name) {
	PULSE.Tracer.info("Setting graph to " + name);
	this.ui.setMenuExpanded(false);
	if (this.graph !== null)
		if (this.graph.renderer !== null && typeof this.graph.renderer.unrender === "function") this.graph.renderer.unrender();
	if (!Utils.isNullish(name)) {
		this.selectedGraphName = name;
		PULSE.GraphController.setGraphInfo(name);
		var g = graphs[name];
		if (g !== undefined && g !== null) {
			if (PULSE.onGraphSelection) PULSE.onGraphSelection(name);
			this.graph = g;
			this.isTraj = "Trajectory Viewer" === name;
			if (this.isTraj) g.renderer.nextIndex = -1;
			else PULSE.GraphController.setInfo("\x26nbsp;"); if (this.graph !== null && this.db) {
				if (this.isTraj) this.setRawData(this.db.trajData);
				else this.setRawData(this.db.statsData);
				this.ui.showCameraButton(this.isTraj);
				PULSE.CLIENT.Util.applyActiveClass($(".featureNav li"), this.db.selectedGraphIdx, "active")
			}
		} else PULSE.Tracer.error("Undefined graph")
	}
	this.updateInfo()
};
PULSE.GraphController.prototype.updateInfo = function() {
	if (!this.isTraj) {
		var info = "";
		if (!$(".hawkeyeContextCntr").hasClass("turnedOff")) {
			var enf = this.getEnforcements();
			if (enf === undefined || enf.innings !== FilterEnforcement.ALL) {
				var df = this.deriveFilter();
				if (df.bowler !== undefined) {
					if (CricketFilter.ALL === df.bowler || CricketFilter.ALLBOWLERS === df.bowler) info += "All bowlers";
					else info += df.bowler;
					info += " to ";
					if (CricketFilter.ALL === df.batsman || CricketFilter.ALLBATSMEN === df.batsman) info += "all batsmen";
					else if (CricketFilter.RIGHTHANDERS === df.batsman || CricketFilter.LEFTHANDERS === df.batsman) info += df.batsman.toLowerCase();
					else info += df.batsman;
					info += " in "
				}
				if (CricketFilter.ALL === df.innings) {
					if (info.length === 0) info += "A";
					else info += "a";
					info += "ll innings"
				} else info += this.db.getInningsString(df.innings)
			}
		}
		PULSE.GraphController.setInfo(info)
	}
};
PULSE.GraphController.prototype.getFilterShowState = function() {
	var showState = {};
	var showCount = 0;
	var enf = this.getEnforcements();
	var targets = ["innings", "batsman", "bowler"];
	for (var i = 0, j = targets.length; i < j; i++) {
		var show = enf === undefined || enf[targets[i]] !== FilterEnforcement.ALL;
		showState[targets[i]] = show;
		if (show) showCount++
	}
	showState.reset = showCount > 1 || showCount === 1 && (enf === undefined || enf.innings !== FilterEnforcement.SPECIFIC);
	return showState
};
PULSE.GraphController.prototype.setSize = function(width, height) {
	if (this.graph.renderer.setSize) this.graph.renderer.setSize({
		x: 0,
		y: 0,
		width: width,
		height: height
	})
};
PULSE.GraphController.prototype.render = function(immediateRender) {
	if (this.graph.renderer !== null) {
		this.graph.renderer.controller = this;
		this.graph.renderer.render(this.db, this.data, this.ui.ctx, immediateRender)
	} else this.ui.ctx.clear()
};
PULSE.GraphController.prototype.latestOverMode = function() {
	var latestOverData = [];
	var lastTraj = this.db.getLastKeys().traj;
	if (lastTraj !== undefined) {
		var lastBP = new PULSE.BallProgress(lastTraj);
		for (var key in this.rawData) {
			var record = this.rawData[key];
			if (record.bp && lastBP.innings === record.bp.innings && lastBP.over === record.bp.over) latestOverData[latestOverData.length] = this.rawData[key]
		}
	}
	return latestOverData
};
PULSE.GraphController.prototype.wicketsMode = function() {
	var modTraj = $(".wicketWrapper ul li").eq(this.ui.dismissedBatsmanIdx).attr("id");
	return modTraj ? [this.rawData[modTraj.substr(1)]] : []
};
PULSE.GraphController.prototype.findABallMode = function() {
	var selectedOverBalls = this.getBallList();
	if (this.ui.selectedBall === CricketFilter.ALLBALLS) return selectedOverBalls;
	else
		for (var i = 0; i < selectedOverBalls.length; i++) {
			var record = selectedOverBalls[i];
			if (record && record.bp && record.bp.ball === this.ui.selectedBall) return [record]
		}
	return []
};
PULSE.GraphController.prototype.updateTrajData = function() {};
PULSE.GraphController.prototype.getWicketsList = function() {
	var wList = [];
	for (var key in this.rawData) {
		var record = this.rawData[key];
		var batsman = record.get(CricketField.DISMISSED);
		if (record && record.bp && record.bp.innings && batsman && this.selectedInnings && parseInt(record.bp.innings) === this.selectedInnings && record.get(CricketField.IS_WICKET)) {
			var mod = record.get(CricketFilter.MOD);
			wList[wList.length] = {
				"bp": key,
				"batsman": batsman,
				"mod": mod
			}
		}
	}
	return wList
};
PULSE.GraphController.prototype.getBowlersList = function() {
	var bList = [CricketFilter.ALLBOWLERS];
	for (var key in this.rawData) {
		var record = this.rawData[key];
		if (record && record.bp && record.bp.innings && this.selectedInnings && parseInt(record.bp.innings) === this.selectedInnings) {
			var bowler = record.get(CricketField.BOWLER);
			var batsman = record.get(CricketField.BATSMAN);
			if (bowler && bList.indexOf(bowler) === -1) bList[bList.length] = bowler
		}
	}
	return bList
};
PULSE.GraphController.prototype.getBatsmenList = function() {
	var bList = [CricketFilter.ALLBATSMEN];
	for (var key in this.rawData) {
		var record = this.rawData[key];
		if (record && record.bp && record.bp.innings && this.selectedInnings && parseInt(record.bp.innings) === this.selectedInnings) {
			var bowler = record.get(CricketField.BOWLER);
			var batsman = record.get(CricketField.BATSMAN);
			if (batsman && bList.indexOf(batsman) === -1 && (this.selectedBowler === undefined || this.selectedBowler === bowler || this.selectedBowler === CricketFilter.ALL || this.selectedBowler === CricketFilter.ALLBOWLERS)) bList[bList.length] = batsman
		}
	}
	return bList
};
PULSE.GraphController.prototype.getOversList = function() {
	var oList = [];
	for (var key in this.rawData) {
		var record = this.rawData[key];
		if (record && record.bp && record.bp.innings && this.selectedInnings && parseInt(record.bp.innings) === this.selectedInnings && oList.indexOf(record.bp.over) === -1)
			if (this.selectedBowler === record.get(CricketField.BOWLER) || this.selectedBowler === CricketFilter.ALL || this.selectedBowler === CricketFilter.ALLBOWLERS) oList[oList.length] = record.bp.over;
			else {
				var speed = record.get(CricketField.BOWL_SPEED);
				if (this.selectedBowler === CricketFilter.SPINBOWLERS && speed >= 13 && speed < 32) oList[oList.length] = record.bp.over;
				else if (this.selectedBowler === CricketFilter.SEAMBOWLERS && speed >= 32) oList[oList.length] = record.bp.over
			}
	}
	oList.reverse();
	return oList
};
PULSE.GraphController.prototype.getBallsList = function() {
	var ballList = [CricketFilter.ALLBALLS];
	var selectedOver = this.selectedOver;
	for (var key in this.rawData) {
		var record = this.rawData[key];
		if (record && record.bp && record.bp.innings && this.selectedInnings && parseInt(record.bp.innings) === this.selectedInnings && record.bp.over === selectedOver) ballList[ballList.length] = record.bp.ball
	}
	return ballList
};
PULSE.GraphController.prototype.resetNewFilteringData = function() {
	this.ui.wSelectedInnings = "";
	this.ui.fabSelectedInnings = "";
	this.ui.dismissedBatsmanIdx = -1;
	this.ui.selectedBowler = CricketFilter.ALLBOWLERS;
	this.ui.selectedOverIdx = -1;
	this.ui.selectedBall = CricketFilter.ALLBALLS;
	this.ui.selectedBallIdx = -1;
	$("#latestOverCntr .ballLabel").html("");
	$("#latestOverCntr table tr:eq(0) td:eq(1)").html("");
	$("#latestOverCntr table tr:eq(1) td:eq(1)").html("");
	$("#latestOverCntr table tr:eq(2) td:eq(1)").html("");
	$("#latestOverCntr table tr:eq(3) td:eq(1)").html("");
	$("#latestOverCntr table tr:eq(4) td:eq(1)").html("")
};
PULSE.GraphController.setContent = function(div, content, dimensions, offset) {
	if (dimensions && offset) $(div).css({
		"left": offset.x,
		"top": offset.y
	}).append(content);
	else div.appendChild(content);
	$(div).children().each(function(index) {
		if (index < $(div).children().length - 1) $(this).remove()
	})
};
PULSE.GraphController.prototype.latestOverFilterMode = function() {
	PULSE.Tracer.info("Filter mode is latestOverFilterMode");
	var latestBP = this.getLatestBP();
	return {
		innings: latestBP.innings,
		over: latestBP.over,
		ball: undefined,
		batsman: undefined,
		bowler: undefined
	}
};
PULSE.GraphController.prototype.findABallFilterMode = function() {
	PULSE.Tracer.info("Filter mode is findABallFilterMode");
	return {
		innings: this.getSelectedInnings(),
		bowler: this.getSelectedBowler(),
		over: this.getSelectedOver(),
		ball: this.getSelectedBall(),
		batsman: undefined
	}
};
PULSE.GraphController.prototype.defaultFilterMode = function() {
	PULSE.Tracer.info("Filter mode is defaultFilterMode");
	return {
		innings: this.getSelectedInnings(),
		bowler: this.getSelectedBowler(),
		batsman: this.getSelectedBatsman(),
		over: undefined,
		ball: undefined
	}
};
PULSE.GraphController.prototype.inningsFilterMode = function() {
	PULSE.Tracer.info("Filter mode is inningsFilterMode");
	return {
		innings: this.getSelectedInnings(),
		over: undefined,
		ball: undefined,
		batsman: undefined,
		bowler: undefined
	}
};
PULSE.GraphController.prototype.wicketsFilterMode = function() {
	PULSE.Tracer.info("Filter mode is wicketsFilterMode");
	return {
		innings: this.getSelectedInnings(),
		over: undefined,
		ball: undefined,
		batsman: undefined,
		bowler: undefined
	}
};
PULSE.GraphController.prototype.noOptionsFilterMode = function() {
	PULSE.Tracer.info("Filter mode is noOptionsFilterMode");
	return {
		innings: undefined,
		over: undefined,
		ball: undefined,
		batsman: undefined,
		bowler: undefined
	}
};
PULSE.GraphController.prototype.getSelectedInnings = function() {
	if (this.selectedInnings === undefined && !PULSE.CLIENT.Util.isEmptyObject(this.rawData)) {
		var inns = this.db.getInningsList();
		if (inns[inns.length - 1]) this.selectedInnings = this.db.getInningsFromString(inns[inns.length - 1])
	}
	return this.selectedInnings
};
PULSE.GraphController.prototype.getSelectedBowler = function() {
	if (this.selectedBowler === undefined && !PULSE.CLIENT.Util.isEmptyObject(this.rawData)) this.selectedBowler = CricketFilter.ALLBOWLERS;
	return this.selectedBowler
};
PULSE.GraphController.prototype.getSelectedBatsman = function() {
	if (this.selectedBatsman === undefined && !PULSE.CLIENT.Util.isEmptyObject(this.rawData)) this.selectedBatsman = CricketFilter.ALLBATSMEN;
	return this.selectedBatsman
};
PULSE.GraphController.prototype.getSelectedOver = function() {
	if (this.selectedOver === undefined && !PULSE.CLIENT.Util.isEmptyObject(this.rawData)) {
		var lastBP = this.getLatestBP();
		this.selectedOver = lastBP.over
	}
	return this.selectedOver
};
PULSE.GraphController.prototype.getSelectedBall = function() {
	if (this.selectedBall === undefined && !PULSE.CLIENT.Util.isEmptyObject(this.rawData)) this.selectedBall = CricketFilter.ALLBALLS;
	return this.selectedBall
};
PULSE.GraphController.prototype.getLatestBP = function() {
	var latestBP = {};
	if (this.db.latestTraj) latestBP = new PULSE.BallProgress(this.db.latestTraj);
	return latestBP
};
PULSE.GraphController.prototype.setFilterOptions = function() {
	var filterOptions = {};
	var inningsList = this.db.getInningsList();
	var bowlersList = [];
	var batsmenList = [];
	var oversList = [];
	var ballsList = [];
	var wicketsList = [];
	if (this.selectedInnings) {
		wicketsList = this.getWicketsList();
		bowlersList = this.getBowlersList();
		oversList = this.getOversList();
		if (this.selectedOver) {
			if (-1 === $.inArray(this.selectedOver, oversList) && oversList.length > 0) this.selectedOver = oversList[0];
			ballsList = this.getBallsList()
		}
		if (this.selectedBatsman) batsmenList = this.getBatsmenList();
		filterOptions.innings = {
			selected: this.db.getInningsString(this.selectedInnings),
			options: inningsList
		};
		filterOptions.batsman = {
			selected: this.selectedBatsman,
			options: batsmenList
		};
		filterOptions.bowler = {
			selected: this.selectedBowler,
			options: bowlersList
		};
		filterOptions.over = {
			selected: this.selectedOver,
			options: oversList
		};
		filterOptions.ball = {
			selected: this.selectedBall,
			options: ballsList
		};
		filterOptions.wickets = {
			selected: this.selectedWicket,
			options: wicketsList
		};
		this.ui.populateFilterOptions(filterOptions)
	}
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
PULSE.PlaceholderState = {
	DATA: "data",
	NODATA: "nodata",
	NOFILTEREDDATA: "nofiltereddata"
};
PULSE.NewUI = function(db, enableScroll) {
	var that = this;
	this.db = db;
	this.xAspectRatio = 9;
	this.yAspectRatio = 5;
	this.NO_OF_BALLS_IN_AN_OVER = 6;
	this.fabSelectedInnings = "";
	this.dismissedBatsmanIdx = -1;
	this.selectedBowler = CricketFilter.ALLBOWLERS;
	this.selectedOverIdx = -1;
	this.selectedBall = CricketFilter.ALLBALLS;
	this.selectedBallIdx = -1;
	var focus = function() {
		that.setMenuExpanded(false)
	};
	this.selectors = {};
	this.graphingDiv = PULSE.NewUI.createElement("div", PULSE.createClass("relative"));
	var raphaelDiv = PULSE.NewUI.createElement("div", PULSE.createClass("graph layer", "graph"));
	var canvasDiv = $("\x3ccanvas\x3e").attr({
		"id": "graphCanvas",
		"width": 480,
		"height": 288,
		"className": "graph layer"
	}).addClass("graph layer");
	this.backgroundDiv = PULSE.NewUI.createElement("div", PULSE.createClass("background layer", "background"));
	this.overlayDiv = PULSE.NewUI.createElement("div", PULSE.createClass("overlay layer", "overlay"));
	this.placeholderDiv = PULSE.NewUI.createElement("div", PULSE.createClass("layer nodata", "placeholder"));
	this.placeholderDiv.appendChild(PULSE.NewUI.createElement("div", PULSE.createClass("dataContent")));
	this.placeholderDiv.appendChild(PULSE.NewUI.createElement("div", PULSE.createClass("nodataContent")));
	var nfdDiv = PULSE.NewUI.createElement("div", PULSE.createClass("nofiltereddataContent"));
	var nfdDiv2 = PULSE.NewUI.createElement("div", PULSE.createClass("textCntr"));
	var h1 = PULSE.NewUI.createElement("h1");
	h1.innerHTML = "";
	var h2 = PULSE.NewUI.createElement("h2");
	h2.innerHTML = "";
	nfdDiv2.appendChild(h1);
	nfdDiv2.appendChild(h2);
	nfdDiv.appendChild(nfdDiv2);
	this.placeholderDiv.appendChild(nfdDiv);
	this.graphingDiv.appendChild(this.backgroundDiv);
	this.graphingDiv.appendChild(raphaelDiv);
	$(this.graphingDiv).append(canvasDiv);
	this.graphingDiv.appendChild(this.overlayDiv);
	this.graphingDiv.appendChild(this.placeholderDiv);
	var topLevel = document.getElementById("pulseGraphing");
	topLevel.appendChild(this.graphingDiv);
	var tm = document.getElementById(TextMeasurerDivId);
	if (tm === null) {
		tm = PULSE.NewUI.createElement("div", {
			id: TextMeasurerDivId,
			style: "position: absolute; left: -1000; top: -1000; width: auto; height: auto; visibility: hidden;"
		});
		$("body").prepend(tm)
	}
	var $li = $("#thelist \x3e li");
	$("body").on("click", function(e) {
		that.setSettingsExpanded(false);
		that.setMenuExpanded(false);
		that.setCameraExpanded(false)
	});
	$(".hawkeyeHeader .filter").click(function(e) {
		that.setSettingsExpanded();
		that.setMenuExpanded(false);
		that.setCameraExpanded(false);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".hawkeyeHeader .camera").click(function(e) {
		that.setCameraExpanded();
		that.setSettingsExpanded(false);
		that.setMenuExpanded(false);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".hawkeyeHeader .menuBtn").click(function(e) {
		that.setMenuExpanded();
		that.setCameraExpanded(false);
		that.setSettingsExpanded(false);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".cameraMenu, .filterPanel, .featureList .content").on("click", function(e) {
		e.stopPropagation()
	});
	$(".inningsSelect").change(function(e) {
		var selectedInn = $(this).find("option:selected").text();
		that.controller.selectedInnings = that.controller.db.getInningsFromString(selectedInn);
		that.controller.selectedBowler = CricketFilter.ALLBOWLERS;
		that.controller.selectedBatsman = CricketFilter.ALLBATSMEN;
		that.controller.selectedOver = that.controller.getLatestBP().over;
		that.controller.selectedBall = CricketFilter.ALLBALLS;
		that.controller.setFilterOptions();
		PULSE.CLIENT.Tracking.event("hawkeye", "filter", that.controller.selectedGraphName.toLowerCase() + " - innings");
		e.preventDefault();
		e.stopPropagation()
	});
	$(".bowlerSelect").change(function(e) {
		that.controller.selectedBowler = $(this).find("option:selected").text();
		that.controller.selectedBatsman = CricketFilter.ALLBATSMEN;
		that.controller.setFilterOptions();
		PULSE.CLIENT.Tracking.event("hawkeye", "filter", that.controller.selectedGraphName.toLowerCase() + " - bowler");
		e.preventDefault();
		e.stopPropagation()
	});
	$(".batsmanSelect").change(function(e) {
		that.controller.selectedBatsman = $(this).find("option:selected").text();
		that.controller.setFilterOptions();
		PULSE.CLIENT.Tracking.event("hawkeye", "filter", that.controller.selectedGraphName.toLowerCase() + " - batsman");
		that.batsmanSelected = true;
		e.preventDefault();
		e.stopPropagation()
	});
	$(".overSelect").change(function(e) {
		that.controller.selectedOver = $(this).find("option:selected").text();
		that.controller.selectedBall = CricketFilter.ALLBALLS;
		that.controller.setFilterOptions();
		PULSE.CLIENT.Tracking.event("hawkeye", "filter", that.controller.selectedGraphName.toLowerCase() + " - over");
		e.preventDefault();
		e.stopPropagation()
	});
	$(".ballSelect").change(function(e) {
		that.controller.selectedBall = $(this).find("option:selected").text();
		that.controller.setFilterOptions();
		PULSE.CLIENT.Tracking.event("hawkeye", "filter", that.controller.selectedGraphName.toLowerCase() + " - ball");
		e.preventDefault();
		e.stopPropagation()
	});
	$(".trajPanel .menu li").click(function(e) {
		var index = $(this).index();
		if (index === 0) {
			that.controller.selectedFilterMode = that.controller.findABallFilterMode;
			that.controller.deriveData();
			$(".returnLive").show()
		} else if (index === 1) {
			that.controller.selectedFilterMode = that.controller.wicketsFilterMode;
			that.controller.deriveData();
			$(".returnLive").show()
		} else return;
		that.setSettingsExpanded(true);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".returnLive").click(function(e) {
		that.controller.selectedFilterMode = that.controller.latestOverFilterMode;
		that.controller.setData(that.controller.deriveData(), true);
		$(".returnLive").hide();
		e.preventDefault();
		e.stopPropagation()
	});
	$(".closeButton").click(function(e) {
		that.setSettingsExpanded(false);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".confirmButton").click(function(e) {
		window.repeatedScroll = false;
		that.controller.setData(that.controller.deriveData(), true);
		var text = that.controller.selectedGraphName + ": ";
		switch (that.controller.selectedGraphName) {
			case "Trajectory Viewer":
				break
		}
		that.setSettingsExpanded(false);
		that.db.scrollToPage(that.db.selectedGraphIdx);
		e.preventDefault();
		e.stopPropagation()
	});
	$(".cameraMenu li").click(function(e) {
		var index = $(".cameraMenu li").index(this);
		PULSE.CLIENT.Util.applyActiveClass($(".cameraMenu li"), index, "active");
		that.controller.setView(index);
		that.setCameraExpanded(false);
		PULSE.CLIENT.Tracking.event("hawkeye", "select", that.controller.selectedGraphName.toLowerCase() + " - " + $(this).find(".tag").text().toLowerCase() + " view");
		e.preventDefault();
		e.stopPropagation()
	});
	var $li = $(".hawkeye .featureCntr ul.featureCarousel \x3e li");
	var $menu = $(".menu");
	var resize = function() {
		var width = $(window).width();
		var maxWidth = $(".hawkeye").closest(".row").outerWidth(true);
		if (maxWidth < width) width = maxWidth;
		width -= 20;
		var height = width / that.xAspectRatio * that.yAspectRatio,
			totalWidth = 0;
		$(".hawkeye").height(height + 40);
		$(".hawkeye").find(".featureCntr").height(height);
		PULSE.Tracer.info("Resize called with height\x3d" + height + " width\x3d" + width);
		$($li).each(function() {
			$(this).width(width);
			totalWidth += width
		});
		canvasDiv.attr("height", height);
		canvasDiv.attr("width", $($li).last().width());
		$("#scroller").width(totalWidth + "px");
		if (that.db && that.db.controller) that.db.scrollToPage(that.db.selectedGraphIdx);
		if (that.controller) that.controller.render();
		that.getCanvasHeight = function() {
			return height
		};
		that.getCanvasWidth = function() {
			return width
		}
	};
	$(window).resize(resize);
	resize();
	this.menuContainer = document.getElementById("hawkeye-nav");
	$("#current-graph").click(function() {
		that.setMenuExpanded();
		that.setSettingsExpanded(false);
		that.setCameraExpanded(false)
	});
	var content = PULSE.NewUI.createElement("div", PULSE.createClass("content"));
	this.menuContainer.appendChild(content);
	var closeFeature = PULSE.NewUI.createElement("div", PULSE.createClass("close"));
	var closeAnchor = PULSE.NewUI.createElement("a");
	closeAnchor.innerHTML = "Close";
	closeFeature.appendChild(closeAnchor);
	$(closeFeature).click(function() {
		that.setMenuExpanded(false)
	});
	this.menuContainer.appendChild(closeFeature);
	var featuresHeader = PULSE.NewUI.createElement("h1");
	featuresHeader.innerHTML = "Features";
	content.appendChild(featuresHeader);
	this.menu = PULSE.NewUI.createElement("ul");
	content.appendChild(this.menu);
	content.appendChild(PULSE.NewUI.createElement("div", PULSE.createClass("cl")));
	PULSE.NewUI.prototype.setPlaceholderState = function(state) {
		that.placeholderDiv.setAttribute("class", "layer placeholder " + state);
		that.placeholderDiv.setAttribute("className", "layer placeholder " + state)
	};
	this.setPlaceholderState(PULSE.PlaceholderState.NODATA);
	var el = document.getElementById("graphCanvas");
	if (typeof G_vmlCanvasManager != "undefined") G_vmlCanvasManager.initElement(el);
	var canvasElement = el.getContext("2d");
	this.ctx = {
		canvas: canvasElement
	};
	PULSE.NewUI.getInstance = function() {
		return that
	}
};
PULSE.createClass = function(clazz, id) {
	var object = {
		"class": clazz,
		"className": clazz
	};
	if (id) object.id = id;
	return object
};
PULSE.NewUI.switchView = function(e) {
	var ui = PULSE.NewUI.getInstance();
	var index;
	if (e.type === "click") index = $(".cameraMenu li").index(e.currentTarget);
	else {
		var hash = location.hash;
		if (hash && hash.length > 0) {
			hash = hash.slice(1, hash.length);
			var $el = $(".cameraMenu li." + hash);
			index = $el.index()
		}
	} if (typeof index !== "undefined") {
		PULSE.CLIENT.Util.applyActiveClass($(".cameraMenu li"), index, "active");
		ui.controller.setView(index);
		ui.setCameraExpanded(false)
	}
};
PULSE.NewUI.resetDrillDownFilter = function() {
	$(".filterPanel h1").text("Settings");
	$(".filterPanel .back").addClass("hidden");
	$(".filterPanel").find(".defaultFilterContent, .trajMenuContent, .trajWickets").css("left", "0")
};
PULSE.NewUI.prototype.setActiveMenuItem = function(name) {
	if (this.menuLookup)
		for (var thisName in this.menuLookup) {
			var element = this.menuLookup[thisName];
			if (element) {
				element.setAttribute("class", name === thisName ? "active" : "");
				element.setAttribute("className", name === thisName ? "active" : "")
			}
		}
};
PULSE.NewUI.prototype.setAvailableGraphs = function(graphs) {
	graphs = $.grep(graphs, function(g, i) {
		return g !== "Pitch Map Mountain"
	});
	while (this.menu.firstChild) this.menu.removeChild(this.menu.firstChild);
	var that = this;
	var f = function(e) {
		that.setMenuExpanded(false);
		that.db.selectedGraphIdx = $(this).closest("li").index();
		that.db.scrollToPage(that.db.selectedGraphIdx);
		that.controller.setGraph($(this).attr("data-graph-name"));
		PULSE.CLIENT.Tracking.event("hawkeye", "select", $(this).attr("data-graph-name").toLowerCase());
		e.preventDefault()
	};
	this.menuLookup = {};
	for (var g = 0, glimit = graphs.length; g < glimit; g++) {
		var graph = graphs[g];
		var li = document.createElement("li");
		PULSE.CLIENT.Template.publish("templates/mc/hawkeye/menu-list-item.html", li, {
			type: graph.toLowerCase(),
			name: graph
		});
		$(li).find("a").click(f);
		this.menu.appendChild(li);
		this.menuLookup[graph] = li
	}
};
PULSE.NewUI.prototype.getGraphIndexByName = function(graphName) {
	var index = -1;
	$(this.menu).children().each(function(i) {
		var name = $(this).find("a").html();
		if (name.toLowerCase() === graphName.toLowerCase()) index = i
	});
	return index
};
PULSE.NewUI.prototype.callback = function(id, value) {};
PULSE.NewUI.prototype.updateBallSelector = function(inningsOver) {
	var ui = PULSE.NewUI.getInstance();
	var bp = new PULSE.BallProgress(inningsOver);
	var selectors = ui.getSelectorValues();
	selectors.ball = undefined;
	selectors.innings = +bp.innings;
	selectors.over = +bp.over;
	var options = ui.controller.db.getOptions(selectors);
	ui.setPopulator({
		ball: options.ball
	})
};
PULSE.NewUI.prototype.getSelectorById = function(id) {
	for (var property in this.selectors)
		if (this.selectors[property].element.id === id) return this.selectors[property]
};
PULSE.NewUI.prototype.setShow = function(id, show) {
	var item = document.getElementById("graph-" + id);
	item.setAttribute("class", id + (show ? " turnedOn" : " turnedOff"));
	item.setAttribute("className", id + (show ? " turnedOn" : " turnedOff"))
};
PULSE.NewUI.prototype.setShowSelector = function(name, show, traj) {
	var selector = this.selectors[name];
	if (!show) {
		selector.parent.setAttribute("class", "turnedOff");
		selector.parent.setAttribute("className", "turnedOff")
	} else {
		var root = name.substr(0, 1).toUpperCase() + name.substr(1);
		var className = "customDropCntr position" + root;
		if ("Bowler" === root && traj) className += "Traj";
		selector.parent.setAttribute("class", className);
		selector.parent.setAttribute("className", className)
	}
};
PULSE.NewUI.prototype.getSelectorValues = function() {
	var values = {};
	for (var property in this.selectors)
		if (this.selectors[property].selected) {
			values[property] = this.selectors[property].selected.value;
			PULSE.Tracer.info("Setting " + property + " to " + this.selectors[property].selected.value)
		}
	return values
};
PULSE.NewUI.prototype.setShowViewNavigation = function(show) {
	if (show) {
		$("#oldFilterCntr").addClass("turnedOff");
		$("#newFilterCntr").removeClass("turnedOff")
	} else {
		$("#oldFilterCntr").removeClass("turnedOff");
		$("#newFilterCntr").addClass("turnedOff")
	}
};
PULSE.NewUI.prototype.setMenuExpanded = function(expanded) {
	if (this.menuContainer)
		if ($(this.menuContainer).is(":visible") || typeof expanded !== "undefined") {
			$(this.menuContainer).css("display", "none");
			$("#current-graph").removeClass("active")
		} else {
			$(this.menuContainer).css("display", "block");
			$("#current-graph").addClass("active")
		}
};
PULSE.NewUI.prototype.setPopulator = function(populator) {
	if (!this.populator) this.populator = {};
	for (var key in populator) this.populator[key] = populator[key];
	this.resync()
};
PULSE.NewUI.prototype.setSelectorData = function(selector, data, additionals, showLast) {
	var actualData = [];
	if (additionals !== undefined && additionals.length > 0) actualData = actualData.concat(additionals);
	if (data !== undefined && data.length > 0) actualData = actualData.concat(data);
	var taggedData = [];
	for (var i = 0, j = actualData.length; i < j; i++) {
		var d = actualData[i];
		if (selector === this.selectors.over) {
			if (d.indexOf(".") !== -1) {
				var bp = new PULSE.BallProgress(d);
				var dminus = +bp.over - 1;
				taggedData.push({
					label: dminus,
					value: d
				});
				continue
			}
		} else if (selector === this.selectors.ball)
			if (typeof d !== "string") {
				taggedData.push(d);
				continue
			}
		taggedData.push({
			label: d
		})
	}
	PULSE.Tracer.info("Setting selector with " + taggedData.length + " items");
	if (selector.setData(taggedData, showLast)) {
		PULSE.Tracer.info("Redriving selection of " + selector.element.id);
		this.callback(selector.element.id, "")
	}
};
PULSE.NewUI.createElement = function(tag, attributes) {
	var element = document.createElement(tag);
	if (attributes !== undefined)
		for (var attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute]);
			if (attribute === "class") element.setAttribute("className", attributes[attribute])
		}
	return element
};
PULSE.NewUI.prototype.getOverOutcome = function(oList, overNo) {
	var credit = 0;
	var outcome = "";
	var isWicketOver = false;
	var noOfBallsBowled = 0;
	if (oList.length > 0) {
		for (var i = 0; i < oList.length; i++) {
			var record = oList[i];
			if (record && record.bp && (overNo === undefined || record.bp.over === overNo)) {
				credit += parseInt(record.get(CricketField.CREDIT));
				noOfBallsBowled++;
				if (record.get(CricketField.IS_WICKET)) isWicketOver = true
			}
		}
		if (isWicketOver) outcome += "wicket";
		if (credit > 0) {
			if (isWicketOver) outcome += " - ";
			outcome += credit;
			if (credit === 1) outcome += " run";
			else outcome += " runs"
		} else if (!isWicketOver && noOfBallsBowled === this.NO_OF_BALLS_IN_AN_OVER) outcome = "maiden over"
	}
	return outcome
};
PULSE.NewUI.prototype.resetFiltersByInnings = function(inningsNumber) {
	var options = this.controller.db.getOptions({
		innings: inningsNumber
	});
	this.setPopulator({
		innings: options.innings,
		batsman: options.batsman,
		bowler: options.bowler
	})
};
PULSE.NewUI.prototype.markSelectedFilterPanel = function(selectedFilterPanel) {
	$("#filterPanelCntr").find(".filterPanel").removeClass("selectedFilter");
	$("#filterPanelCntr").find("#" + selectedFilterPanel).addClass("selectedFilter")
};
PULSE.NewUI.prototype.setSettingsExpanded = function(expanded) {
	var filterCntr = $(".selectedFilter");
	if (filterCntr.length) {
		if (expanded === undefined) {
			expanded = filterCntr.attr("class").search("hidden") !== -1;
			if (filterCntr.is("#latestOverFilterCntr")) {
				var $el = $("body").find(".trajPanel .menu li.left");
				$el.trigger("click")
			}
		}
		$(".filterPanelOverlay").css("display", expanded ? "block" : "none");
		filterCntr.attr("class", "filterPanel selectedFilter" + (expanded ? "" : " hidden"));
		if (expanded) $(".menu .filter a").addClass("active");
		else {
			PULSE.NewUI.resetDrillDownFilter();
			$(".menu .filter a").removeClass("active")
		}
		$(".filterPanel").not(".selectedFilter").addClass("hidden")
	}
};
PULSE.NewUI.prototype.setCameraExpanded = function(expanded) {
	var cameraCntr = $(".cameraMenu");
	if (cameraCntr) {
		if (expanded === undefined) expanded = cameraCntr.css("display") === "none";
		if (expanded) {
			cameraCntr.show();
			$(".menu .camera a").addClass("active")
		} else {
			cameraCntr.hide();
			$(".menu .camera a").removeClass("active")
		}
	}
};
PULSE.NewUI.prototype.populateFilterOptions = function(filterOptions) {
	if (filterOptions.innings) this.populateDropdown(".inningsSelect", filterOptions.innings.selected, filterOptions.innings.options);
	if (filterOptions.batsman) this.populateDropdown(".batsmanSelect", filterOptions.batsman.selected, filterOptions.batsman.options);
	if (filterOptions.bowler) this.populateDropdown(".bowlerSelect", filterOptions.bowler.selected, filterOptions.bowler.options);
	if (filterOptions.over) this.populateDropdown(".overSelect", filterOptions.over.selected, filterOptions.over.options);
	if (filterOptions.ball) this.populateDropdown(".ballSelect", filterOptions.ball.selected, filterOptions.ball.options);
	if (filterOptions.wickets) this.populateWicketsList(".trajWickets .content", filterOptions.wickets.selected, filterOptions.wickets.options)
};
PULSE.NewUI.prototype.populateDropdown = function(selector, selectedValue, options) {
	var that = this;
	$(selector).html("");
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (option === selectedValue) $(selector).append($("\x3coption selected\x3d'selected'\x3e").html(option));
		else $(selector).append($("\x3coption\x3e").html(option))
	}
};
PULSE.NewUI.prototype.populateList = function(selector, selectedValue, options) {
	$(selector).empty();
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		var $li = $('\x3cli class\x3d"option" data-option\x3d"' + option + '"\x3e').html(option).append("\x3cspan\x3e");
		if (option === selectedValue) $li.addClass("selected");
		$(selector).append($li)
	}
};
PULSE.NewUI.prototype.populateWicketsList = function(container, selected, options) {
	var that = this;
	$(container).find("ul").empty();
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		$(container).find("ul").append($("\x3cli id\x3d'bp" + option.bp + "'\x3e").click(function() {
			var bpString = $(this).attr("id").substr(2);
			that.controller.showTrajectory(bpString)
		}).append($("\x3ca\x3e").html("\x3cspan class\x3d'batsmen'\x3e" + option.batsman + "\x3c/span\x3e" + "\x3cspan class\x3d'dismissal'\x3e" + option.mod + "\x3c/span\x3e")))
	}
};
PULSE.NewUI.prototype.showCameraButton = function(cameraFlag) {
	if (cameraFlag) $(".hawkeyeHeader .camera").css("display", "inline-block");
	else {
		$(".hawkeyeHeader .camera").css("display", "none");
		this.setCameraExpanded(false)
	}
};

function PitchMapRenderer(config) {
	this.config = config
}
PitchMapRenderer.isSameCategory = function(a, b) {
	return a === b || a >= 1 && a <= 3 && b >= 1 && b <= 3 || a >= 4 && b >= 4
};
PitchMapRenderer.prototype.isValid = function(row) {
	return true
};
PitchMapRenderer.prototype.render = function(db, data, ctx) {
	this.db = db;
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.data = this.prepareData(data);
	this.ctx = ctx;
	this.tooltipData = undefined;
	this.draw()
};
PitchMapRenderer.prototype.setSize = function(sizeProperties) {
	PULSE.Tracer.info("setSize x\x3d" + sizeProperties.x + " y\x3d" + sizeProperties.y + " w\x3d" + sizeProperties.width + " h\x3d" + sizeProperties.height);
	if (this.config.region) {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = 1 / this.origConfig.region.width * sizeProperties.width;
		var scaleY = 1.1 / this.origConfig.region.height * sizeProperties.height;
		var scale;
		if (widerRatio) this.config.scaleXY = scaleY;
		else this.config.scaleXY = scaleX;
		scale = this.config.scaleXY;
		PULSE.Tracer.info("Scale is set to " + scale);
		this.dimensions = {};
		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;
		this.cropDimensions = {};
		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;
		this.cropOffset = {};
		this.cropOffset.x = sizeProperties.width / 2 - this.origConfig.region.width / 2 * scale;
		this.cropOffset.y = sizeProperties.height / 2 - this.origConfig.region.height / 2 * scale;
		this.offset = {};
		this.offset.x = sizeProperties.width / 2 - (this.origConfig.region.origin.x + this.origConfig.region.width / 2) * scale;
		this.offset.y = sizeProperties.height / 2 - (this.origConfig.region.origin.y + this.origConfig.region.height / 2) * scale;
		this.config.ballSize = 6;
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = this.offset.x + this.config.width / 2;
		this.config.projection.center.y = this.offset.y + this.config.height / 2
	} else {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.width / this.origConfig.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		if (this.config.aspect >= this.origConfig.aspect) var scale = this.config.scale = 1 / this.origConfig.height * sizeProperties.height;
		else var scale = this.config.scale = 1 / this.origConfig.width * sizeProperties.width;
		PULSE.Tracer.info("Scale is set to " + scale);
		this.config.height = this.origConfig.height * scale;
		this.config.width = this.origConfig.width * scale;
		this.config.ballSize = Utils.numberToPixelString(Utils.pixelStringToNumber(this.origConfig.ballSize) * scale > 11 ? 12 : 8);
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = sizeProperties.width / 2;
		this.config.projection.center.y = sizeProperties.height / 2
	}
};
PitchMapRenderer.prototype.getColorKey = function(row) {
	return row.get(CricketField.IS_WICKET) ? "w" : row.get(CricketField.DEBIT)
};
PitchMapRenderer.prototype.compare = function(a, b) {
	var aw = a.get(CricketField.IS_WICKET);
	var bw = b.get(CricketField.IS_WICKET);
	if (aw && !bw) return 1;
	else if (!aw && bw) return -1;
	else {
		var ar = +a.get(CricketField.DEBIT);
		var br = +b.get(CricketField.DEBIT);
		if (PitchMapRenderer.isSameCategory(ar, br)) {
			if (a.get(CricketField.PITCHED) !== undefined && b.get(CricketField.PITCHED) !== undefined) return +a.get(CricketField.PITCHED).x - +b.get(CricketField.PITCHED).x
		} else return ar - br
	}
	return 0
};
PitchMapRenderer.prototype.prepareData = function(data) {
	this.tooltipDataCache = {};
	var dataArray = Utils.cloneArray(data);
	var hasRight = false;
	var hasLeft = false;
	var that = this;
	dataArray.sort(function(a, b) {
		var handedness = a.get(CricketField.HANDEDNESS);
		if (!hasRight && CricketHandedness.RIGHT === handedness) hasRight = true;
		if (!hasLeft && CricketHandedness.LEFT === handedness) hasLeft = true;
		return that.compare(a, b)
	});
	if (dataArray.length === 1) {
		var handedness = dataArray[0].get(CricketField.HANDEDNESS);
		if (!hasRight && CricketHandedness.RIGHT === handedness) hasRight = true;
		if (!hasLeft && CricketHandedness.LEFT === handedness) hasLeft = true
	}
	if (hasLeft && hasRight) this.controller.setBackground(this.config.variants.mix.background, this.config.variants.mix.css, this.dimensions, this.offset, this.config.variants.mix.clazz);
	else if (hasLeft) this.controller.setBackground(this.config.variants.lh.background, this.config.variants.lh.css, this.dimensions, this.offset, this.config.variants.lh.clazz);
	else if (hasRight) this.controller.setBackground(this.config.variants.rh.background, this.config.variants.rh.css, this.dimensions, this.offset, this.config.variants.rh.clazz);
	var preparedData = [];
	for (var i = 0, j = dataArray.length; i < j; i++) {
		var row = dataArray[i];
		var xyz = row.get(CricketField.PITCHED);
		if (xyz !== undefined) {
			xyz = this.db.normalise(xyz);
			if (xyz.x > -999 && xyz.y > -999 && this.isValid(row)) {
				var shadow = this.config.projection.project(xyz);
				xyz.z = 0.036;
				var ball = this.config.projection.project(xyz);
				if (hasLeft && hasRight)
					if (CricketHandedness.LEFT === row.get(CricketField.HANDEDNESS)) {
						shadow.x += this.config.variants.lh.offset * this.config.scaleXY;
						ball.x += this.config.variants.lh.offset * this.config.scaleXY
					} else {
						shadow.x += this.config.variants.rh.offset * this.config.scaleXY;
						ball.x += this.config.variants.rh.offset * this.config.scaleXY
					}
				shadow.x -= this.config.ballSize * this.config.scaleXY * 0.4;
				shadow.y += this.config.ballSize * this.config.scaleXY * 0.1;
				var colorKey = this.getColorKey(row);
				preparedData.push({
					ball: ball,
					shadow: shadow,
					color: this.config.colors[colorKey]
				});
				this.updateTooltipCache(ball, row)
			}
		}
	}
	return preparedData
};
PitchMapRenderer.prototype.updateTooltipCache = function(ball, row) {
	var ix = Math.round(ball.x);
	var iy = Math.round(ball.y);
	var tx = this.tooltipDataCache[ix];
	if (tx === undefined) {
		tx = {};
		this.tooltipDataCache[ix] = tx
	}
	var lines = [];
	lines.push("\x3cc:#bbb\x3eBall \x3c/c\x3e" + row.get(CricketField.INNINGS) + "." + (+row.get(CricketField.OVER) - 1) + "." + row.get(CricketField.COUNTING_BALL));
	lines.push(row.get(CricketField.BOWLER) + " \x3cc:#bbb\x3eto \x3c/c\x3e" + row.get(CricketField.BATSMAN));
	var line3 = "";
	var bs = row.get(CricketField.BOWL_SPEED);
	if (!Utils.isNullish(bs) && +bs >= 40) line3 += +bs.toFixed(1) + "mph";
	var summary = row.generateSummary();
	if (!Utils.isNullish(summary)) {
		if (line3.length > 0) line3 += " \x3cc:#bbb\x3eresulting in \x3c/c\x3e";
		line3 += summary
	}
	if (!Utils.isNullish(line3)) lines.push(line3);
	lines.push("\x3cc:#888\x3eClick to view trajectory\x3c/c\x3e");
	var ttd = {
		lines: lines,
		x: ix,
		y: iy,
		bp: row.get(CricketField.ID)
	};
	this.tooltipDataCache[ix][iy] = ttd
};
PitchMapRenderer.prototype.draw = function() {
	this.ctx.canvas.clearRect(0, 0, this.ctx.canvas.canvas.width, this.ctx.canvas.canvas.height);
	this.ctx.canvas.save();
	this.ctx.canvas.scale(1, 0.6);
	this.ctx.canvas.fillStyle = "rgba(0,0,0,0.3)";
	for (var i = 0, j = this.data.length; i < j; i++) {
		this.ctx.canvas.beginPath();
		Utils.circle(this.ctx.canvas, this.data[i].shadow.x, this.data[i].shadow.y / 0.6, this.config.ballSize * this.config.scaleXY * 0.5);
		this.ctx.canvas.fill()
	}
	this.ctx.canvas.restore();
	var that = this;
	var callback = function() {
		that.draw()
	};
	var range = {
		minx: 9999,
		maxx: 0,
		miny: 9999,
		maxy: 0
	};
	for (var i = 0, j = this.data.length; i < j; i++) {
		var x = this.data[i].ball.x;
		var y = this.data[i].ball.y;
		if (x > range.maxx) range.maxx = x;
		if (x < range.minx) range.minx = x;
		if (y > range.maxy) range.maxy = y;
		if (y < range.miny) range.miny = y;
		PULSE.BallRenderer.render(this.ctx.canvas, x, y, this.data[i].color, this.config.ballSize * this.config.scaleXY, callback)
	}
	PULSE.Tracer.info("Rendering range is {" + range.minx + "," + range.miny + "} -\x3e {" + range.maxx + "," + range.maxy + "}");
	if (this.tooltipData !== undefined) {
		var cfg = this.config.tooltip;
		var anchorv = "n";
		var anchorh = "w";
		if (this.tooltipData.x > this.config.width / 2) anchorh = "e";
		if (this.tooltipData.y > this.config.height / 2) anchorv = "s";
		cfg.position = {
			x: this.tooltipData.x,
			y: this.tooltipData.y,
			anchor: anchorv + anchorh
		};
		var tf = new PULSE.TextField(cfg);
		tf.setLines(this.tooltipData.lines);
		tf.render(this.ctx.canvas)
	}
};
PitchMapRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	if (xy !== undefined) {
		var tooltipData = this.findNearbyTooltip(xy);
		if ("mousedown" === event.type)
			if (tooltipData !== undefined) {
				this.controller.showTrajectory(tooltipData.bp);
				return
			}
	}
	if (this.tooltipData !== tooltipData) {
		this.tooltipData = tooltipData;
		this.draw()
	}
};
PitchMapRenderer.prototype.findNearbyTooltip = function(xy) {
	for (var s = 0; s < 4; s++)
		for (var x = xy.x - s; x <= xy.x + s; x++)
			for (var y = xy.y - s; y <= xy.y + s; y++)
				if (this.tooltipDataCache[x] !== undefined && this.tooltipDataCache[x][y] !== undefined) return this.tooltipDataCache[x][y]
};

function VariableBounceRenderer(config) {
	this.config = config
}
VariableBounceRenderer.prototype.getColorKey = function(row) {
	var stumps = row.get(CricketField.STUMPS);
	if (row.get(CricketField.IS_WICKET)) return "w";
	else if (stumps.z > 0.745) return "a";
	else return "s"
};
VariableBounceRenderer.prototype.render = PitchMapRenderer.prototype.render;
VariableBounceRenderer.prototype.setSize = PitchMapRenderer.prototype.setSize;
VariableBounceRenderer.prototype.onMouse = PitchMapRenderer.prototype.onMouse;
VariableBounceRenderer.prototype.findNearbyTooltip = PitchMapRenderer.prototype.findNearbyTooltip;
VariableBounceRenderer.prototype.updateTooltipCache = PitchMapRenderer.prototype.updateTooltipCache;
VariableBounceRenderer.prototype.prepareData = PitchMapRenderer.prototype.prepareData;
VariableBounceRenderer.prototype.isValid = function(row) {
	var pitched = row.get(CricketField.PITCHED);
	var stumps = row.get(CricketField.STUMPS);
	if (pitched !== undefined && stumps !== undefined) {
		var xyz = {
			x: pitched.x,
			y: pitched.y,
			z: stumps.z
		};
		xyz = this.db.normalise(xyz);
		return xyz.x > -999 && xyz.y > -999 && xyz.z > -999
	}
	return false
};
VariableBounceRenderer.prototype.compare = function(a, b) {
	var aw = a.get(CricketField.IS_WICKET);
	var bw = b.get(CricketField.IS_WICKET);
	if (aw && !bw) return 1;
	else if (!aw && bw) return -1;
	else if (a.get(CricketField.PITCHED) !== undefined && b.get(CricketField.PITCHED) !== undefined) return +a.get(CricketField.PITCHED).x - +b.get(CricketField.PITCHED).x;
	return 0
};
VariableBounceRenderer.prototype.draw = PitchMapRenderer.prototype.draw;
VariableBounceRenderer.prototype.updateTooltipCache = PitchMapRenderer.prototype.updateTooltipCache;

function SpeedPitchMapRenderer(config) {
	this.config = config
}
SpeedPitchMapRenderer.prototype.getColorKey = function(row) {
	var speed = +row.get(CricketField.BOWL_SPEED);
	if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) speed = PULSE.SpeedModeController.mpsToKmh(speed);
	for (var b = 0, c = this.config.buckets.length; b < c; b++)
		if (speed < this.config.buckets[b]) return b;
	return this.config.buckets.length
};
SpeedPitchMapRenderer.prototype.render = PitchMapRenderer.prototype.render;
SpeedPitchMapRenderer.prototype.setSize = PitchMapRenderer.prototype.setSize;
SpeedPitchMapRenderer.prototype.onMouse = PitchMapRenderer.prototype.onMouse;
SpeedPitchMapRenderer.prototype.findNearbyTooltip = PitchMapRenderer.prototype.findNearbyTooltip;
SpeedPitchMapRenderer.prototype.updateTooltipCache = PitchMapRenderer.prototype.updateTooltipCache;
SpeedPitchMapRenderer.prototype.prepareData = PitchMapRenderer.prototype.prepareData;
SpeedPitchMapRenderer.prototype.isValid = function(row) {
	var bs = row.get(CricketField.BOWL_SPEED),
		threshold = 40;
	if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) {
		bs = PULSE.SpeedModeController.mpsToKmh(bs);
		threshold = 10
	}
	return !Utils.isNullish(bs) && +bs >= 40
};
SpeedPitchMapRenderer.prototype.compare = function(a, b) {
	if (a.get(CricketField.PITCHED) !== undefined && b.get(CricketField.PITCHED) !== undefined) return +a.get(CricketField.PITCHED).x - +b.get(CricketField.PITCHED).x;
	return 0
};
SpeedPitchMapRenderer.prototype.draw = PitchMapRenderer.prototype.draw;
SpeedPitchMapRenderer.prototype.updateTooltipCache = PitchMapRenderer.prototype.updateTooltipCache;

function PitchMapMountainRenderer(config) {
	this.config = config
}
PitchMapMountainRenderer.prototype.bucketise = function(x, y) {
	if (x >= this.config.boundary.x.min && x <= this.config.boundary.x.max && y >= this.config.boundary.y.min && y <= this.config.boundary.y.max) return {
		x: Math.floor((x - this.config.boundary.x.min) / this.config.bucketSize),
		y: Math.floor((y - this.config.boundary.y.min) / this.config.bucketSize)
	}
};
PitchMapMountainRenderer.prototype.render = function(db, data, ctx) {
	this.projectedPoints = {};
	this.ctx = ctx;
	this.db = db;
	ctx.canvas.clearRect(0, 0, this.config.width, this.config.height);
	var bubble1 = Math.sqrt(8) / 3;
	var bubble2 = Math.sqrt(7) / 3;
	var bubble3 = Math.sqrt(5) / 3;
	var bubble4 = 2 / 3;
	var bubble5 = 1 / 3;
	var heights = {};
	var total = 0;
	for (var i = 0, j = data.length; i < j; i++) {
		var row = data[i];
		var xyz = row.get(CricketField.PITCHED);
		if (xyz !== undefined) {
			var bucket = this.bucketise(xyz.x, xyz.y);
			if (bucket !== undefined) {
				var x = bucket.x;
				var y = bucket.y;
				this.incrementBucket(heights, x, y, 1);
				this.incrementBucket(heights, x - 1, y, bubble1);
				this.incrementBucket(heights, x + 1, y, bubble1);
				this.incrementBucket(heights, x, y - 1, bubble1);
				this.incrementBucket(heights, x, y + 1, bubble1);
				this.incrementBucket(heights, x - 1, y - 1, bubble2);
				this.incrementBucket(heights, x - 1, y + 1, bubble2);
				this.incrementBucket(heights, x + 1, y - 1, bubble2);
				this.incrementBucket(heights, x + 1, y + 1, bubble2);
				this.incrementBucket(heights, x - 2, y, bubble3);
				this.incrementBucket(heights, x + 2, y, bubble3);
				this.incrementBucket(heights, x, y - 2, bubble3);
				this.incrementBucket(heights, x, y + 2, bubble3);
				this.incrementBucket(heights, x - 2, y + 1, bubble4);
				this.incrementBucket(heights, x - 2, y - 1, bubble4);
				this.incrementBucket(heights, x + 2, y + 1, bubble4);
				this.incrementBucket(heights, x + 2, y - 1, bubble4);
				this.incrementBucket(heights, x - 1, y + 2, bubble4);
				this.incrementBucket(heights, x + 1, y + 2, bubble4);
				this.incrementBucket(heights, x - 1, y - 2, bubble4);
				this.incrementBucket(heights, x + 1, y - 2, bubble4);
				this.incrementBucket(heights, x - 2, y - 2, bubble5);
				this.incrementBucket(heights, x - 2, y + 2, bubble5);
				this.incrementBucket(heights, x + 2, y - 2, bubble5);
				this.incrementBucket(heights, x + 2, y + 2, bubble5);
				total++
			}
		}
	}
	var triangles = [];
	if (total > 0) {
		var xs = (this.config.boundary.x.max - this.config.boundary.x.min) / this.config.bucketSize;
		var ys = (this.config.boundary.y.max - this.config.boundary.y.min) / this.config.bucketSize;
		var maxHeight = 0;
		for (var x = 0; x <= xs; x++)
			for (var y = 0; y <= ys; y++) maxHeight = Math.max(maxHeight, this.getHeight(heights, x, y));
		if (maxHeight == 0) maxHeight = 1;
		maxHeight /= this.config.maxHeight;
		for (var x = 0; x <= xs; x++) {
			var xpos1 = this.config.boundary.x.min + x * this.config.bucketSize;
			var xpos2 = xpos1 + this.config.bucketSize;
			for (var y = 0; y <= ys; y++) {
				var ypos1 = this.config.boundary.y.min + y * this.config.bucketSize;
				var ypos2 = ypos1 + this.config.bucketSize;
				var height1 = this.getHeight(heights, x, y) / maxHeight;
				var height2 = this.getHeight(heights, x + 1, y) / maxHeight;
				var height3 = this.getHeight(heights, x, y + 1) / maxHeight;
				var height4 = this.getHeight(heights, x + 1, y + 1) / maxHeight;
				if (height2 > 0 || height3 > 0 || height4 > 0) triangles.push({
					p1: {
						x: xpos2,
						y: ypos1,
						z: height2
					},
					p2: {
						x: xpos2,
						y: ypos2,
						z: height4
					},
					p3: {
						x: xpos1,
						y: ypos2,
						z: height3
					}
				});
				if (height1 > 0 || height2 > 0 || height3 > 0) triangles.push({
					p1: {
						x: xpos1,
						y: ypos1,
						z: height1
					},
					p2: {
						x: xpos2,
						y: ypos1,
						z: height2
					},
					p3: {
						x: xpos1,
						y: ypos2,
						z: height3
					}
				})
			}
		}
		this.renderMesh(triangles)
	}
};
PitchMapMountainRenderer.prototype.incrementBucket = function(heights, x, y, amount) {
	if (heights[x] === undefined) heights[x] = {};
	if (heights[x][y] === undefined) heights[x][y] = 0;
	heights[x][y] += amount
};
PitchMapMountainRenderer.prototype.getHeight = function(heights, x, y) {
	var height = 0;
	if (heights[x] !== undefined && heights[x][y] !== undefined) height = heights[x][y];
	return height
};
PitchMapMountainRenderer.prototype.renderMesh = function(triangles) {
	this.ctx.canvas.save();
	this.ctx.canvas.lineJoin = "round";
	for (var i = 0, limit = triangles.length; i < limit; i++) {
		var triangle = triangles[i];
		var p1 = this.db.normalise({
			x: triangle.p1.x,
			y: triangle.p1.y,
			z: triangle.p1.z
		});
		var p2 = this.db.normalise({
			x: triangle.p2.x,
			y: triangle.p2.y,
			z: triangle.p2.z
		});
		var p3 = this.db.normalise({
			x: triangle.p3.x,
			y: triangle.p3.y,
			z: triangle.p3.z
		});
		var d1 = {
			x: p2.x - p1.x,
			y: p2.y - p1.y,
			z: p2.z - p1.z
		};
		var d2 = {
			x: p3.x - p2.x,
			y: p3.y - p2.y,
			z: p3.z - p2.z
		};
		var crossProduct = {
			x: d1.y * d2.z - d1.z * d2.y,
			y: d1.z * d2.x - d1.x * d2.z,
			z: d1.x * d2.y - d1.y * d2.x
		};
		var crossProductSize = Math.sqrt(crossProduct.x * crossProduct.x + crossProduct.y * crossProduct.y + crossProduct.z * crossProduct.z);
		crossProduct.x /= crossProductSize;
		crossProduct.y /= crossProductSize;
		crossProduct.z /= crossProductSize;
		var dotProduct = crossProduct.x * this.config.light.x + crossProduct.y * this.config.light.y + crossProduct.z * this.config.light.z;
		if (dotProduct < 0) continue;
		dotProduct = dotProduct * this.config.lightStrength + 1 - this.config.lightStrength;
		var color = {
			r: dotProduct * this.config.color.r,
			g: dotProduct * this.config.color.g,
			b: dotProduct * this.config.color.b
		};
		var colorString = "rgba(" + +Math.round(color.r * 255) + "," + +Math.round(color.g * 255) + "," + +Math.round(color.b * 255) + ", 1)";
		this.ctx.canvas.fillStyle = colorString;
		this.ctx.canvas.strokeStyle = colorString;
		this.ctx.canvas.beginPath();
		var pos1 = this.project(p1);
		var pos2 = this.project(p2);
		var pos3 = this.project(p3);
		this.ctx.canvas.moveTo(pos1.x, pos1.y);
		this.ctx.canvas.lineTo(pos2.x, pos2.y);
		this.ctx.canvas.lineTo(pos3.x, pos3.y);
		this.ctx.canvas.closePath();
		this.ctx.canvas.fill();
		this.ctx.canvas.stroke()
	}
	this.ctx.canvas.restore()
};
PitchMapMountainRenderer.prototype.project = function(xyz) {
	var key = xyz.x + "," + xyz.y + "," + xyz.z;
	var projected = this.projectedPoints[key];
	if (!projected) {
		projected = this.config.projection.project(xyz);
		this.projectedPoints[key] = projected
	}
	return projected
};
if (!PULSE) var PULSE = {};

function WagonWheelRenderer(config) {
	this.config = config;
	this.selected = -1
}
WagonWheelRenderer.prototype.render = function(db, data, ctx) {
	this.db = db;
	this.data = data;
	this.ctx = ctx;
	this.setFont();
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.selected = -1;
	this.draw()
};
WagonWheelRenderer.prototype.setFont = function() {
	var width = 480;
	var height = 288;
	var cWidth = this.ctx.canvas.canvas.width;
	var cHeight = this.ctx.canvas.canvas.height;
	this.xScale = 1 / width * cWidth;
	this.yScale = 1.1 / height * cHeight;
	this.scale = Math.min(this.xScale, this.yScale);
	var font = Utils.cloneObject(this.config.font);
	font["font-size"] = Math.floor(font["font-size"] * Math.max(this.scale * 0.8, 1));
	var fontString = Utils.fontToString(font);
	this.ctx.canvas.font = fontString
};
WagonWheelRenderer.prototype.setSize = function(sizeProperties) {
	if (!this.origConfig) {
		this.origConfig = Utils.cloneObject(this.config);
		this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height
	}
	this.config.aspect = sizeProperties.width / sizeProperties.height;
	var widerRatio = this.config.aspect >= this.origConfig.aspect;
	var scaleX = 1 / this.origConfig.region.width * sizeProperties.width;
	var scaleY = 1.1 / this.origConfig.region.height * sizeProperties.height;
	if (this.config.aspect > 2) var scale = this.config.scaleXY = scaleY;
	else var scale = this.config.scaleXY = scaleX;
	this.dimensions = {};
	this.config.width = this.dimensions.x = this.origConfig.width * scale;
	this.config.height = this.dimensions.y = this.origConfig.height * scale;
	this.cropDimensions = {};
	this.cropDimensions.x = this.origConfig.region.width * scale;
	this.cropDimensions.y = this.origConfig.region.height * scale;
	this.cropOffset = {};
	this.cropOffset.x = sizeProperties.width / 2 - this.origConfig.region.width / 2 * scale;
	this.cropOffset.y = sizeProperties.height / 2 - this.origConfig.region.height / 2 * scale;
	this.offset = {};
	this.offset.x = sizeProperties.width / 2 - (this.origConfig.region.origin.x + this.origConfig.region.width / 2) * scale;
	this.offset.y = sizeProperties.height / 2 - (this.origConfig.region.origin.y + this.origConfig.region.height / 2) * scale;
	this.config.origin.y = this.origConfig.origin.y * scale + this.offset.y;
	this.config.origin.x = this.origConfig.origin.x * scale + this.offset.x;
	this.config.scaleback.length = this.origConfig.scaleback.length * scale;
	for (k in this.origConfig.key)
		if (k === "x") {
			this.config.key[k][0] = this.origConfig.key[k][0] * scale + this.offset.x;
			this.config.key[k][1] = this.origConfig.key[k][1] * scale + this.offset.x
		} else this.config.key[k].y = this.origConfig.key[k].y * scale + this.offset.y;
	this.config.keyLabelLeftLimit = this.origConfig.keyLabelLeftLimit * scaleX;
	this.config.keyLabelRightLimit = this.origConfig.keyLabelRightLimit * scaleX;
	this.config.keyLabelTopLimit = this.origConfig.keyLabelTopLimit * scaleY;
	this.config.keyLabelBottomLimit = this.origConfig.keyLabelBottomLimit * scaleY;
	this.config.keyLabelWidth = this.origConfig.keyLabelWidth * scaleX
};
WagonWheelRenderer.prototype.draw = function() {
	this.ctx.canvas.clearRect(0, 0, this.ctx.canvas.canvas.width, this.ctx.canvas.canvas.height);
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	var yscale = this.config.scale.y;
	var xscale = this.config.scale.x;
	var screenOrigin = this.config.transform(0, 0, 1);
	this.ctx.canvas.save();
	this.ctx.canvas.beginPath();
	this.ctx.canvas.scale(xscale, yscale);
	Utils.circle(this.ctx.canvas, screenOrigin.x / xscale, 2 + screenOrigin.y / yscale, 184 * this.config.scaleXY);
	this.ctx.canvas.restore();
	this.ctx.canvas.save();
	this.ctx.canvas.clip();
	this.ctx.canvas.lineWidth = 3;
	this.ctx.canvas.strokeStyle = "rgba(0,0,0,1)";
	var sign = this.db.getParameter("ww-sign");
	var origin = this.config.transform(this.db.getParameter("ww-origin-x"), 0, sign);
	var stats = {
		runs: 0,
		balls: 0,
		scoring: 0,
		runsleg: 0,
		runsoff: 0,
		singles: 0,
		twothrees: 0,
		fours: 0,
		sixes: 0
	};
	var dataArray = Utils.cloneArray(this.data);
	dataArray.sort(function(a, b) {
		var ar = +a.get(CricketField.CREDIT);
		var br = +b.get(CricketField.CREDIT);
		if (ar === 6 && br >= 4) return ar - br;
		else return br - ar
	});
	for (var i = 0, j = dataArray.length; i < j; i++) {
		var row = dataArray[i];
		var extraType = row.get(CricketField.EXTRA_TYPE);
		if (extraType !== "Wd" && extraType !== "WdB") stats.balls++;
		var landing = row.get(CricketField.WW);
		var runs = +row.get(CricketField.CREDIT);
		if (runs > 0) {
			stats.scoring++;
			stats.runs += runs;
			switch (runs) {
				case 1:
					stats.singles++;
					break;
				case 2:
				case 3:
					stats.twothrees++;
					break;
				case 4:
				case 5:
					stats.fours++;
					break;
				case 6:
					stats.sixes++;
					break
			}
			if (landing !== undefined && landing.x > -999 && landing.y > -999) {
				var lh = row.get(CricketField.HANDEDNESS) === CricketHandedness.LEFT;
				if (lh && landing.y < 0 || !lh && landing.y >= 0) stats.runsleg += runs;
				else stats.runsoff += runs; if (this.shouldDraw(runs)) {
					var screenPos = this.config.transform(landing.x * this.config.scaleXY, landing.y * this.config.scaleXY, sign);
					if (runs >= 4) screenPos = Utils.scaleLine(origin, screenPos, 200 * this.config.scaleXY);
					else {
						var len = this.config.scaleback ? this.config.scaleback.length : 170;
						var amt = this.config.scaleback ? this.config.scaleback.amount : 0.8;
						screenPos = Utils.scaleLineRel(origin, screenPos, len, amt)
					}
					this.ctx.canvas.beginPath();
					var gradient = this.ctx.canvas.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 50);
					gradient.addColorStop(0, this.config.colors[runs][0]);
					gradient.addColorStop(1, this.config.colors[runs][1]);
					this.ctx.canvas.strokeStyle = gradient;
					if (this.config.innerClip) {
						var newOrigin = WagonWheelRenderer.pointDownLine(origin, screenPos, this.config.innerClip);
						this.ctx.canvas.moveTo(newOrigin.x, newOrigin.y)
					} else this.ctx.canvas.moveTo(origin.x, origin.y);
					this.ctx.canvas.lineTo(screenPos.x, screenPos.y);
					this.ctx.canvas.stroke()
				}
			}
		}
	}
	var tot = stats.runsleg + stats.runsoff;
	if (tot > 0) {
		stats.runsleg = Math.round(100 * stats.runsleg / tot);
		stats.runsoff = 100 - stats.runsleg + "%";
		stats.runsleg += "%"
	} else {
		stats.runsleg = "";
		stats.runsoff = ""
	}
	this.ctx.canvas.restore();
	this.ctx.canvas.font = this.config.font;
	this.ctx.canvas.fillStyle = "black";
	for (var key in stats)
		if (key !== "x") {
			var cfg = this.config.key[key];
			var color = cfg.color;
			var color2 = cfg.lcolor || cfg.color;
			if (this.config.keyDisplayMode === "values") {
				this.ctx.canvas.fillStyle = color2;
				Utils.anchoredFillText(this.ctx.canvas, stats[key], this.config.key.x[0], cfg.y, "w")
			} else if (this.config.keyDisplayMode === "labelsandvalues") {
				this.ctx.canvas.fillStyle = color2;
				Utils.anchoredFillText(this.ctx.canvas, cfg.label, this.config.key.x[0], cfg.y, "w");
				this.ctx.canvas.fillStyle = color;
				Utils.anchoredFillText(this.ctx.canvas, stats[key], this.config.key.x[1], cfg.y, "e")
			}
		}
	if (this.config.freetext) {
		var tf = new PULSE.TextField(this.config.freetext);
		tf.addLine(this.config.freetext.text);
		tf.render(this.ctx.canvas)
	}
};
WagonWheelRenderer.pointDownLine = function(start, end, amount, isFraction) {
	var dx = end.x - start.x;
	var dy = end.y - start.y;
	if (isFraction) return {
		x: start.x + amount * dx,
		y: start.y + amount * dy
	};
	else {
		var theta = Math.atan2(dy, dx);
		if (Math.sqrt(dx * dx + dy * dy) <= amount) return {
			x: end.x + 3 * Math.cos(theta),
			y: end.y + 3 * Math.sin(theta)
		};
		else return {
			x: start.x + amount * Math.cos(theta),
			y: start.y + amount * Math.sin(theta)
		}
	}
};
WagonWheelRenderer.prototype.shouldDraw = function(runs) {
	return this.selected === -1 || this.selected === 0 && runs === 1 || this.selected === 1 && (runs === 2 || runs === 3) || this.selected === 2 && (runs === 4 || runs === 5) || this.selected === 3 && runs === 6
};
WagonWheelRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	var selection = -1;
	if (xy !== undefined && xy.x >= this.config.keyLabelLeftLimit && xy.x <= this.config.keyLabelRightLimit && xy.y >= this.config.keyLabelTopLimit && xy.y <= this.config.keyLabelBottomLimit) selection = Math.floor((xy.y - this.config.keyLabelTopLimit) / this.config.keyLabelWidth);
	if (selection !== this.selected) {
		this.selected = selection;
		this.draw()
	}
};

function BeehiveRenderer(config) {
	this.config = config
}
BeehiveRenderer.prototype.setSize = function(sizeProperties) {
	if (this.config.region) {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = 1 / this.origConfig.region.width * sizeProperties.width;
		var scaleY = 1.1 / this.origConfig.region.height * sizeProperties.height;
		if (widerRatio) var scale = this.config.scaleXY = scaleY;
		else var scale = this.config.scaleXY = scaleX;
		this.dimensions = {};
		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;
		this.cropDimensions = {};
		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;
		this.cropOffset = {};
		this.cropOffset.x = sizeProperties.width / 2 - this.origConfig.region.width / 2 * scale;
		this.cropOffset.y = sizeProperties.height / 2 - this.origConfig.region.height / 2 * scale;
		this.offset = {};
		this.offset.x = sizeProperties.width / 2 - (this.origConfig.region.origin.x + this.origConfig.region.width / 2) * scale;
		this.offset.y = sizeProperties.height / 2 - (this.origConfig.region.origin.y + this.origConfig.region.height / 2) * scale;
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = this.offset.x + this.config.width / 2;
		this.config.projection.center.y = this.offset.y + this.config.height / 2
	} else {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.width / this.origConfig.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		if (this.config.aspect >= this.origConfig.aspect) var scale = this.config.scale = 1 / this.origConfig.height * sizeProperties.height;
		else var scale = this.config.scale = 1 / this.origConfig.width * sizeProperties.width;
		this.config.height = this.origConfig.height * scale;
		this.config.width = this.origConfig.width * scale;
		this.config.projection.fl = this.origConfig.projection.fl * scale;
		this.config.projection.center.x = sizeProperties.width / 2;
		this.config.projection.center.y = sizeProperties.height / 2
	}
};
BeehiveRenderer.prototype.render = function(db, data, ctx) {
	var that = this;
	this.ctx = ctx;
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	ctx.canvas.clearRect(0, 0, this.ctx.canvas.canvas.width, this.ctx.canvas.canvas.height);
	var dataArray = Utils.cloneArray(data);
	dataArray.sort(function(a, b) {
		var aw = a.get(CricketField.IS_WICKET);
		var bw = b.get(CricketField.IS_WICKET);
		if (aw && !bw) return 1;
		else if (!aw && bw) return -1;
		else {
			var ar = a.get(CricketField.CREDIT);
			var br = b.get(CricketField.CREDIT);
			return ar - br
		}
		return 0
	});
	var hasRight = false;
	var hasLeft = false;
	for (var i = 0, j = dataArray.length; i < j; i++) {
		var row = dataArray[i];
		var handedness = row.get(CricketField.HANDEDNESS);
		if (CricketHandedness.RIGHT === handedness) hasRight = true;
		else if (CricketHandedness.LEFT === handedness) hasLeft = true;
		if (hasLeft && hasRight) break
	}
	if (hasLeft && hasRight) this.controller.setBackground(this.config.variants.mix.background, this.config.variants.mix.css, this.dimensions, this.offset, this.config.variants.mix.clazz);
	else if (hasLeft) this.controller.setBackground(this.config.variants.lh.background, this.config.variants.lh.css, this.dimensions, this.offset, this.config.variants.lh.clazz);
	else if (hasRight) this.controller.setBackground(this.config.variants.rh.background, this.config.variants.rh.css, this.dimensions, this.offset, this.config.variants.rh.clazz);
	ctx.canvas.save();
	ctx.canvas.globalCompositeOperation = "xor";
	ctx.canvas.scale(1, 0.3);
	ctx.canvas.fillStyle = "rgba(0,0,0,0.3)";
	for (var i = 0, j = dataArray.length; i < j; i++) {
		var row = dataArray[i];
		var stumps = row.get(CricketField.STUMPS);
		if (stumps !== undefined) {
			var xyz = {
				x: stumps.x,
				y: stumps.y,
				z: 0
			};
			xyz = db.normalise(xyz);
			if (xyz.x > -999 && xyz.y > -999) {
				if (CricketHandedness.LEFT === row.get(CricketField.HANDEDNESS) && hasRight) xyz.y = -xyz.y;
				var screenPos = this.config.projection.project(xyz);
				ctx.canvas.beginPath();
				Utils.circle(ctx.canvas, screenPos.x, screenPos.y / 0.3, 6);
				ctx.canvas.fill()
			}
		}
	}
	ctx.canvas.restore();
	var callback = function() {
		that.render(db, data, ctx)
	};
	for (var i = 0, j = dataArray.length; i < j; i++) {
		var row = dataArray[i];
		var xyz = row.get(CricketField.STUMPS);
		if (xyz !== undefined) {
			xyz = db.normalise(xyz);
			if (xyz.x > -999 && xyz.y > -999 && xyz.z > -999) {
				if (CricketHandedness.LEFT === row.get(CricketField.HANDEDNESS) && hasRight) xyz.y = -xyz.y;
				var runs = row.get(CricketField.CREDIT);
				var screenPos = this.config.projection.project(xyz);
				var colorKey;
				if (row.get(CricketField.IS_WICKET)) colorKey = "w";
				else if (runs == 0) colorKey = "d";
				else {
					var ww = row.get(CricketField.WW);
					if (ww !== undefined) {
						var ly = ww.y;
						if (ly > -999) {
							var leg = ly > 0;
							if (CricketHandedness.LEFT === row.get(CricketField.HANDEDNESS)) leg = !leg;
							if (runs >= 4) colorKey = leg ? "lb" : "ob";
							else colorKey = leg ? "l" : "o"
						}
					}
				}
				PULSE.BallRenderer.render(ctx.canvas, screenPos.x, screenPos.y, this.config.colors[colorKey], this.config.ballSize * this.config.scaleXY, callback)
			}
		}
	}
};

function BowlSpeedsRenderer(config) {
	this.config = config;
	this.selected = -1;
	this.stickies = []
}
BowlSpeedsRenderer.prototype.render = function(db, data, ctx) {
	this.db = db;
	this.data = data;
	this.ctx = ctx;
	this.selected = -1;
	this.stickies = [];
	this.bowlerData = {};
	this.wicketData = {};
	this.maxPoints = 20;
	this.setFont();
	for (var i = 0, j = this.data.length; i < j; i++) {
		var row = this.data[i];
		var bowler = this.db.lookupPlayer(row.get(CricketField.BOWLER));
		var speed = row.get(CricketField.BOWL_SPEED);
		if (!Utils.isNullish(bowler) && speed >= 10) {
			if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) speed = PULSE.SpeedModeController.mpsToKmh(speed);
			var bd = this.bowlerData[bowler];
			if (bd === undefined) {
				bd = [];
				this.bowlerData[bowler] = bd
			}
			bd.push(speed);
			if (bd.length > this.maxPoints) this.maxPoints = bd.length;
			if (row.get(CricketField.IS_WICKET)) {
				var wf = this.wicketData[bowler];
				if (wf === undefined) {
					wf = [];
					this.wicketData[bowler] = wf
				}
				wf.push({
					x: bd.length,
					y: speed
				})
			}
		}
	}
	this.maxWidth = 90;
	for (var bowler in this.bowlerData) {
		var size = Utils.stringSize(this.ctx.canvas, bowler);
		if (size.width > this.maxWidth) this.maxWidth = size.width
	}
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.draw()
};
BowlSpeedsRenderer.prototype.setFont = function() {
	var width = 480;
	var height = 288;
	var cWidth = this.ctx.canvas.canvas.width;
	var cHeight = this.ctx.canvas.canvas.height;
	this.xScale = 1 / width * cWidth;
	this.yScale = 1 / height * cHeight;
	this.scale = Math.min(this.xScale, this.yScale);
	var font = Utils.cloneObject(this.config.font);
	font["font-size"] = Math.floor(font["font-size"] * Math.max(this.scale * 0.8, 1));
	var fontString = Utils.fontToString(font);
	this.ctx.canvas.font = fontString
};
BowlSpeedsRenderer.prototype.setSize = function(sizeProperties) {
	var paddingLeft = Math.max(sizeProperties.width * 0.1, 50);
	var paddingRight = sizeProperties.width * 0.1;
	var paddingBottom = Math.max(sizeProperties.height * 0.15, 48);
	var paddingTop = sizeProperties.height * 0.1;
	this.keyMarginR = this.config.keyMarginR ? this.config.keyMarginR : this.config.keyMargin;
	this.boxWidth = this.maxWidth + this.config.keyMargin + this.keyMarginR;
	this.config.xAxis.start = paddingLeft;
	this.config.xAxis.end = sizeProperties.width - paddingRight - this.boxWidth;
	this.config.xAxis.fixed = sizeProperties.height - paddingBottom;
	this.config.xAxis.max = this.maxPoints;
	this.config.yAxis.start = sizeProperties.height - paddingBottom;
	this.config.yAxis.end = paddingTop;
	this.config.yAxis.fixed = paddingLeft;
	var mt = this.db.getMatchType();
	var barCount = 1;
	if (CricketMatchType.ODI === mt) barCount = 50;
	else if (CricketMatchType.T20 === mt) barCount = 20;
	this.variant = {};
	this.variant.xAxis = {};
	this.variant.yAxis = {};
	this.variant.bars = {};
	this.variant.xAxis.start = paddingLeft;
	this.variant.xAxis.end = sizeProperties.width - paddingRight;
	this.variant.xAxis.fixed = sizeProperties.height - paddingBottom;
	this.variant.yAxis.start = sizeProperties.height - paddingBottom;
	this.variant.yAxis.end = paddingTop;
	this.variant.yAxis.fixed = paddingLeft;
	this.variant.bars.width = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.9;
	this.variant.bars.fowsize = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.6;
	this.variant.xAxis.shift = (2 - this.variant.bars.width) / 2
};
BowlSpeedsRenderer.prototype.draw = function() {
	var width = this.ctx.canvas.canvas.width,
		height = this.ctx.canvas.canvas.height;
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.ctx.font = this.config.font;
	this.ctx.canvas.clearRect(0, 0, width, height);
	this.ctx.canvas.beginPath();
	this.ctx.canvas.fillStyle = this.config.keyFill;
	this.ctx.canvas.rect(width - this.boxWidth, 0, this.boxWidth, height);
	this.ctx.canvas.fill();
	this.ctx.canvas.strokeStyle = "rgba( 255, 255, 255, 1 )";
	this.config.xAxis.drawTo(this.ctx.canvas, true);
	this.config.yAxis.drawTo(this.ctx.canvas, false);
	var y = 20;
	var i = 0;
	var selectedBowler;
	for (var bowler in this.bowlerData) {
		if (i == this.selected) selectedBowler = bowler;
		var speeds = this.bowlerData[bowler];
		var falls = this.wicketData[bowler];
		var stats = Utils.getStats(speeds);
		this.ctx.canvas.fillStyle = this.getColor(this.config.colors[i], i, this.selected, this.stickies);
		Utils.anchoredFillText(this.ctx.canvas, bowler, width - this.keyMarginR, y, "e");
		y += 15 * this.scale;
		this.ctx.canvas.fillStyle = this.getColor("rgba( 255, 255, 255, 1)", i, this.selected, this.stickies, "rgba( 180, 180, 180, 1)");
		Utils.anchoredFillText(this.ctx.canvas, stats.mean.toFixed(1) + " / " + stats.maximum.toFixed(1), width - this.keyMarginR, y, "e");
		y += 18 * this.scale;
		if (this.selected !== -1 && Utils.isInArray(this.stickies, i)) {
			this.ctx.canvas.beginPath();
			this.ctx.canvas.strokeStyle = "rgba( 255, 255, 255, 0.3 )";
			this.ctx.canvas.lineWidth = 1;
			this.ctx.canvas.rect(width - this.boxWidth + this.config.keyMargin / 2, y - 52, this.boxWidth - keyMarginR, 37);
			this.ctx.canvas.stroke()
		}
		this.renderSeries(this.config.boxWhisker, this.ctx.canvas, bowler, speeds, falls, this.config.colors[i], i);
		if (++i > 7) break
	}
	this.bowlerCount = i;
	if (this.selected !== -1) this.renderSeries(this.config.boxWhisker, this.ctx.canvas, selectedBowler, this.bowlerData[selectedBowler], this.wicketData[selectedBowler], this.config.colors[this.selected], this.selected)
};
BowlSpeedsRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	var selection = -1;
	if (xy !== undefined && xy.x > 490 && (!this.config.keyMarginR || xy.x < this.config.width - this.config.keyMarginR)) {
		selection = Math.round((xy.y - 27) / 42);
		if (selection >= this.bowlerCount) selection = -1
	}
	if ("mousemove" === event.type) this.selected = selection;
	else if ("mousedown" === event.type) this.stickies = Utils.toggleExistence(this.stickies, selection);
	this.draw()
};
BowlSpeedsRenderer.prototype.getColor = function(color, index, selection, others, alt) {
	if (selection === -1 || selection === index || Utils.isInArray(others, index)) return color;
	else if (alt !== undefined) return alt;
	else return "gray"
};
BowlSpeedsRenderer.prototype.renderSeries = function(boxWhisker, ctx, bowler, speeds, falls, color, index) {
	if (boxWhisker) this.renderSeriesBW(ctx, bowler, speeds, falls, color, index);
	else this.renderSeriesLine(ctx, bowler, speeds, falls, color, index)
};
BowlSpeedsRenderer.prototype.renderSeriesLine = function(ctx, bowler, speeds, falls, color, index) {
	ctx.save();
	ctx.beginPath();
	var markerOutline = "black";
	var markerSize = 3 * this.scale;
	ctx.strokeStyle = this.getColor(color, index, this.selected, this.stickies);
	if (this.selected === -1) ctx.lineWidth = Math.max(2, Math.round(2 * this.scale));
	else if (this.selected === index || Utils.isInArray(this.stickies, index)) {
		ctx.lineWidth = Math.max(3, Math.round(3 * this.scale));
		markerSize = 4 * this.scale
	} else {
		ctx.lineWidth = 1;
		markerOutline = "#444"
	}
	for (var i = 0, j = speeds.length; i < j; i++) {
		var x = this.config.xAxis.project(i + 1);
		var y = this.config.yAxis.project(speeds[i]);
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y)
	}
	ctx.stroke();
	if (falls !== undefined) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.strokeStyle = markerOutline;
		ctx.lineWidth = 1;
		for (var i = 0, j = falls.length; i < j; i++) {
			ctx.beginPath();
			var point = falls[i];
			var x = this.config.xAxis.project(point.x);
			var y = this.config.yAxis.project(point.y);
			Utils.circle(ctx, x, y, markerSize);
			ctx.fill();
			ctx.stroke()
		}
	}
	ctx.restore()
};
BowlSpeedsRenderer.prototype.renderSeriesBW = function(ctx, bowler, speeds, falls, color, index) {
	var fns = Utils.getFiveNumberSummary(speeds);
	var hw = 10;
	var values = [fns.min, fns.lq, fns.median, fns.uq, fns.max];
	var projected = [];
	for (var i = 0, ilimit = values.length; i < ilimit; i++) projected.push(this.config.yAxis.project(values[i]));
	var x = this.config.xAxis.project((index + 1) * 10);
	ctx.beginPath();
	ctx.moveTo(x - hw, projected[0]);
	ctx.lineTo(x + hw, projected[0]);
	ctx.moveTo(x - hw, projected[4]);
	ctx.lineTo(x + hw, projected[4]);
	ctx.moveTo(x, projected[0]);
	ctx.lineTo(x, projected[4]);
	ctx.stroke();
	ctx.rect(x - hw, projected[3], hw * 2, projected[1] - projected[3]);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.moveTo(x - hw, projected[2]);
	ctx.lineTo(x + hw, projected[2]);
	ctx.stroke()
};

function PartnershipsRenderer(config) {
	this.config = config
}
PartnershipsRenderer.prototype.setSize = function(sizeProperties) {
	if (this.config.region) {
		if (!this.origConfig) {
			this.origConfig = Utils.cloneObject(this.config);
			this.origConfig.aspect = this.origConfig.region.width / this.origConfig.region.height
		}
		this.config.aspect = sizeProperties.width / sizeProperties.height;
		var widerRatio = this.config.aspect >= this.origConfig.aspect;
		var scaleX = 1 / this.origConfig.region.width * sizeProperties.width;
		var scaleY = 1 / this.origConfig.region.height * sizeProperties.height;
		if (widerRatio) var scale = this.config.scaleXY = scaleY;
		else var scale = this.config.scaleXY = scaleX;
		this.dimensions = {};
		this.config.width = this.dimensions.x = this.origConfig.width * scale;
		this.config.height = this.dimensions.y = this.origConfig.height * scale;
		this.cropDimensions = {};
		this.cropDimensions.x = this.origConfig.region.width * scale;
		this.cropDimensions.y = this.origConfig.region.height * scale;
		this.cropOffset = {};
		this.cropOffset.x = sizeProperties.width / 2 - this.origConfig.region.width / 2 * scale;
		this.cropOffset.y = sizeProperties.height / 2 - this.origConfig.region.height / 2 * scale;
		this.offset = {};
		this.offset.x = sizeProperties.width / 2 - (this.origConfig.region.origin.x + this.origConfig.region.width / 2) * scale;
		this.offset.y = sizeProperties.height / 2 - (this.origConfig.region.origin.y + this.origConfig.region.height / 2) * scale;
		this.config.ystart = this.origConfig.ystart * scale;
		this.config.yspacing = this.origConfig.yspacing * scale;
		this.config.fontOffset.x = this.origConfig.fontOffset.x * scale;
		this.config.fontOffset.y = Math.max(3, this.origConfig.fontOffset.y * scale);
		this.config.pshipText.font["font-size"] = Math.max(11, Math.round(this.origConfig.pshipText.font["font-size"] * scale * 0.5));
		this.config.otherText.font["font-size"] = Math.max(11, Math.round(this.origConfig.otherText.font["font-size"] * scale * 0.5));
		this.config.bars.yshift = this.origConfig.bars.yshift * scale;
		this.config.bars.xshift = this.origConfig.bars.xshift * Math.max(1, scale);
		this.config.bars.width = Math.max(this.origConfig.bars.width, this.origConfig.bars.width * scale);
		this.config.bars.height = Math.max(this.origConfig.bars.height, this.origConfig.bars.height * scale);
		this.config.bars.minLength = this.origConfig.bars.minLength * scale;
		this.config.bars.maxLength = this.origConfig.bars.maxLength * scale;
		for (var i = 0; i < this.config.tabs.length; i++) {
			var tab = this.config.tabs[i];
			tab = this.origConfig.tabs[i] * scale
		}
	}
};
PartnershipsRenderer.prototype.render = function(db, data, ctx) {
	ctx = ctx.canvas;
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.width,
		height: ctx.canvas.height
	});
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	var stats = {
		b1name: null,
		b2name: null,
		b1runs: 0,
		b2runs: 0,
		pruns: 0
	};
	var first = true;
	var y = 0;
	for (var i = 0, j = data.length; i < j; i++) {
		var row = data[i];
		var facing = db.lookupPlayer(row.get(CricketField.BATSMAN));
		var nonfacing = db.lookupPlayer(row.get(CricketField.NF_BATSMAN));
		if (Utils.isNullish(facing) || Utils.isNullish(nonfacing)) continue;
		if (facing !== stats.b1name && facing !== stats.b2name || nonfacing !== stats.b1name && nonfacing !== stats.b2name) {
			if (first) first = false;
			else this.renderPartnership(ctx, stats, y++); if (nonfacing === stats.b1name) {
				stats.b1name = nonfacing;
				stats.b2name = facing
			} else {
				stats.b1name = facing;
				stats.b2name = nonfacing
			}
			stats.b1runs = 0;
			stats.b2runs = 0;
			stats.pruns = 0
		}
		var credit = +row.get(CricketField.CREDIT);
		if (stats.b1name === facing) stats.b1runs += credit;
		else stats.b2runs += credit;
		stats.pruns += +row.get(CricketField.RUNS)
	}
	this.renderPartnership(ctx, stats, y++)
};
PartnershipsRenderer.prototype.renderPartnership = function(ctx, stats, pship) {
	if (pship < 10) {
		ctx.save();
		var y = this.offset.y + this.config.ystart + pship * this.config.yspacing;
		var x = this.offset.x + this.dimensions.x / 2;
		var name1Scale = this.config.scaleXY < 1.3 ? 15 / stats.b1name.length : 1;
		name1Scale = name1Scale > 1 ? 1 : name1Scale;
		var name2Scale = this.config.scaleXY < 1.3 ? 15 / stats.b2name.length : 1;
		name2Scale = name2Scale > 1 ? 1 : name2Scale;
		ctx.font = Utils.fontToString(this.config.pshipText.font);
		ctx.fillStyle = this.config.pshipText.style;
		Utils.anchoredFillText(ctx, stats.pruns, x, y + this.config.fontOffset.y, "s");
		var gradient = ctx.createLinearGradient(x, y - this.config.bars.height / 2, x, y + this.config.bars.height / 2);
		gradient.addColorStop(0, this.config.bars.colorStops[0]);
		gradient.addColorStop(1, this.config.bars.colorStops[1]);
		ctx.fillStyle = gradient;
		var yshift = 0;
		if (this.config.bars.yshift) yshift = this.config.bars.yshift;
		var xshift = 0;
		if (this.config.bars.xshift) xshift = this.config.bars.xshift;
		var bl;
		if (stats.b1runs > 0) {
			ctx.beginPath();
			bl = this.barLength(stats.b1runs);
			ctx.arc(x - bl - xshift, y + yshift, this.config.bars.height / 2, Math.PI * 0.5, Math.PI * 1.5, false);
			ctx.rect(x - xshift, y + yshift - this.config.bars.height / 2, -bl, this.config.bars.height);
			ctx.fill()
		}
		if (stats.b2runs > 0) {
			ctx.beginPath();
			bl = this.barLength(stats.b2runs);
			ctx.rect(x + xshift, y + yshift - this.config.bars.height / 2, bl, this.config.bars.height);
			ctx.arc(x + bl + xshift, y + yshift, this.config.bars.height / 2, Math.PI * 1.5, Math.PI * 0.5, false);
			ctx.fill()
		}
		ctx.font = Utils.fontToString(this.config.otherText.font);
		ctx.fillStyle = this.config.otherText.style;
		Utils.anchoredFillText(ctx, stats.b1runs, x - xshift - this.config.fontOffset.x, y + this.config.fontOffset.y, "se");
		Utils.anchoredFillText(ctx, stats.b2runs, x + xshift + this.config.fontOffset.x, y + this.config.fontOffset.y, "sw");
		var font1name = Utils.cloneObject(this.config.otherText.font);
		font1name["font-size"] = font1name["font-size"] * name1Scale;
		ctx.font = Utils.fontToString(font1name);
		ctx.fillStyle = this.config.otherText.style;
		Utils.anchoredFillText(ctx, stats.b1name, x - this.config.tabs[2] - this.config.fontOffset.x, y + this.config.fontOffset.y, "se");
		var font2name = Utils.cloneObject(this.config.otherText.font);
		font2name["font-size"] = font2name["font-size"] * name2Scale;
		ctx.font = Utils.fontToString(font2name);
		ctx.fillStyle = this.config.otherText.style;
		Utils.anchoredFillText(ctx, stats.b2name, x + this.config.tabs[2] + this.config.fontOffset.x, y + this.config.fontOffset.y, "sw");
		ctx.restore()
	}
};
PartnershipsRenderer.prototype.barLength = function(runs) {
	return Math.min(runs * this.config.scaleXY + this.config.bars.minLength, this.config.bars.maxLength)
};

function RunsPerOverRenderer(config) {
	this.config = config
}
RunsPerOverRenderer.prototype.render = function(db, data, ctx) {
	this.config.variants.t20.yAxis.title = "Runs";
	this.db = db;
	this.variant = obtainVariant(this.config, this.db);
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.data = this.prepareData(data);
	this.ctx = ctx;
	this.tooltipData = undefined;
	this.setFont();
	this.draw()
};
RunsPerOverRenderer.prototype.setFont = function() {
	var width = 480;
	var height = 288;
	var cWidth = this.ctx.canvas.canvas.width;
	var cHeight = this.ctx.canvas.canvas.height;
	this.xScale = 1 / width * cWidth;
	this.yScale = 1 / height * cHeight;
	this.scale = Math.min(this.xScale, this.yScale);
	var font = Utils.cloneObject(this.config.font);
	font["font-size"] = Math.floor(font["font-size"] * Math.max(this.scale * 0.8, 1));
	var fontString = Utils.fontToString(font);
	this.ctx.canvas.font = fontString
};
RunsPerOverRenderer.prototype.setSize = function(sizeProperties) {
	var paddingLeft = Math.max(sizeProperties.width * 0.1, 50);
	var paddingRight = sizeProperties.width * 0.1;
	var paddingBottom = Math.max(sizeProperties.height * 0.15, 48);
	var paddingTop = sizeProperties.height * 0.1;
	this.variant.xAxis.start = paddingLeft;
	this.variant.xAxis.end = sizeProperties.width - paddingRight;
	this.variant.xAxis.fixed = sizeProperties.height - paddingBottom;
	this.variant.yAxis.start = sizeProperties.height - paddingBottom;
	this.variant.yAxis.end = paddingTop;
	this.variant.yAxis.fixed = paddingLeft;
	var mt = this.db.getMatchType();
	var barCount = 1;
	if (CricketMatchType.ODI === mt) barCount = 50;
	else if (CricketMatchType.T20 === mt) barCount = 20;
	this.variant.bars.width = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.8;
	this.variant.bars.fowsize = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.4;
	this.variant.xAxis.shift = (2 - this.variant.bars.width) / 2
};
RunsPerOverRenderer.prototype.prepareData = function(data) {
	this.tooltipDataCache = {};
	var overStats = [];
	var lastOver = 0;
	var stats = {
		r: 0,
		w: 0,
		dismissed: []
	};
	for (var i = 0, j = data.length; i < j; i++) {
		var row = data[i];
		var over = +row.get(CricketField.OVER);
		if (over !== lastOver) {
			if (over !== 1) overStats.push(this.prepareRecord(lastOver, stats));
			lastOver = over;
			stats.r = 0;
			stats.w = 0;
			stats.dismissed = []
		}
		stats.r += +row.get(CricketField.RUNS);
		if (row.get(CricketField.IS_WICKET)) {
			stats.w++;
			stats.dismissed.push(row.get(CricketField.DISMISSED))
		}
	}
	overStats.push(this.prepareRecord(lastOver, stats));
	return overStats
};
RunsPerOverRenderer.prototype.prepareRecord = function(over, stats) {
	var x = this.variant.xAxis.project(over);
	var y = this.variant.yAxis.project(stats.r);
	var ix = Math.round(x);
	var iy = Math.round(y);
	this.tooltipDataCache[ix] = {
		x: ix,
		y: iy,
		dismissed: stats.dismissed
	};
	return {
		x: x,
		y: y,
		w: stats.w
	}
};
RunsPerOverRenderer.prototype.draw = function() {
	this.ctx.canvas.save();
	this.ctx.canvas.font = this.config.font;
	this.ctx.canvas.clearRect(0, 0, this.ctx.canvas.canvas.width, this.ctx.canvas.canvas.height);
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.ctx.canvas.strokeStyle = "rgba( 255, 255, 255, 1 )";
	this.variant.xAxis.drawTo(this.ctx.canvas, true);
	this.variant.yAxis.drawTo(this.ctx.canvas, false);
	var yMax = this.variant.yAxis.project(this.variant.yAxis.max);
	var yMin = this.variant.yAxis.project(this.variant.yAxis.min);
	var gradient = this.ctx.canvas.createLinearGradient(0, yMin, 0, yMax);
	gradient.addColorStop(0, this.variant.bars.colorStops[1]);
	gradient.addColorStop(1, this.variant.bars.colorStops[0]);
	this.ctx.canvas.fillStyle = gradient;
	var y0 = this.variant.yAxis.project(0) - 1;
	for (var i = 0, ilimit = this.data.length; i < ilimit; i++) {
		var record = this.data[i];
		this.ctx.canvas.beginPath();
		this.ctx.canvas.rect(record.x - this.variant.bars.width / 2, y0, this.variant.bars.width, record.y - y0);
		this.ctx.canvas.fill();
		this.ctx.canvas.save();
		this.ctx.canvas.lineWidth = 1;
		for (var j = 0, jlimit = record.w; j < jlimit; j++) {
			this.ctx.canvas.strokeStyle = this.config.fow.stroke;
			this.ctx.canvas.fillStyle = this.config.fow.fill;
			this.ctx.canvas.beginPath();
			Utils.circle(this.ctx.canvas, record.x, record.y - j * this.variant.bars.fowsize, this.variant.bars.fowsize / 2);
			this.ctx.canvas.fill();
			this.ctx.canvas.stroke()
		}
		this.ctx.canvas.restore()
	}
	if (this.tooltipData !== undefined && this.config.tooltip && this.tooltipData.dismissed.length > 0) {
		var cfg = this.config.tooltip;
		var anchorv = "n";
		var anchorh = "w";
		if (this.tooltipData.x > this.config.width / 2) anchorh = "e";
		if (this.tooltipData.y > this.config.height / 2) anchorv = "s";
		cfg.position = {
			x: this.tooltipData.x,
			y: this.tooltipData.y,
			anchor: anchorv + anchorh
		};
		var tf = new PULSE.TextField(cfg);
		tf.setLines(this.tooltipData.dismissed);
		tf.render(this.ctx.canvas)
	}
	this.ctx.canvas.restore()
};
RunsPerOverRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	this.tooltipData = this.findNearbyTooltip(xy);
	this.draw()
};
RunsPerOverRenderer.prototype.findNearbyTooltip = function(xy) {
	if (xy)
		for (var x = xy.x - this.variant.bars.width / 2; x <= xy.x + this.variant.bars.width / 2; x++)
			if (this.tooltipDataCache[x]) return this.tooltipDataCache[x]
};

function RunRateRenderer(config) {
	this.config = config
}
RunRateRenderer.prototype.render = function(db, data, ctx) {
	this.db = db;
	this.variant = obtainVariant(this.config, this.db);
	this.ctx = ctx;
	if (CricketMatchType.TEST === this.db.getMatchType()) this.data = this.prepareData(data);
	this.setFont();
	this.setSize({
		x: 0,
		y: 0,
		width: ctx.canvas.canvas.width,
		height: ctx.canvas.canvas.height
	});
	this.data = this.prepareData(data);
	this.tooltipData = undefined;
	this.draw()
};
RunRateRenderer.prototype.setFont = function() {
	var width = 480;
	var height = 288;
	var cWidth = this.ctx.canvas.canvas.width;
	var cHeight = this.ctx.canvas.canvas.height;
	this.xScale = 1 / width * cWidth;
	this.yScale = 1 / height * cHeight;
	this.scale = Math.min(this.xScale, this.yScale);
	var font = Utils.cloneObject(this.config.font);
	font["font-size"] = Math.floor(font["font-size"] * Math.max(this.scale * 0.8, 1));
	var fontString = Utils.fontToString(font);
	this.ctx.canvas.font = fontString
};
RunRateRenderer.prototype.setSize = function(sizeProperties) {
	if (!this.origConfig) {
		this.origConfig = Utils.cloneObject(this.config);
		this.origConfig.aspect = this.origConfig.width / this.origConfig.height
	}
	this.config.aspect = sizeProperties.width / sizeProperties.height;
	var widerRatio = this.config.aspect >= this.origConfig.aspect;
	var scaleX = 1 / this.origConfig.width * sizeProperties.width;
	var scaleY = 1.1 / this.origConfig.height * sizeProperties.height;
	if (widerRatio) var scale = this.config.scaleXY = scaleY;
	else var scale = this.config.scaleXY = scaleX;
	var paddingLeft = Math.max(sizeProperties.width * 0.15, 50);
	var paddingRight = sizeProperties.width * 0.1;
	var paddingBottom = Math.max(sizeProperties.height * 0.15, 48);
	var paddingTop = sizeProperties.height * 0.1;
	this.variant.xAxis.start = paddingLeft;
	this.variant.xAxis.end = sizeProperties.width - paddingRight;
	this.variant.xAxis.fixed = sizeProperties.height - paddingBottom;
	this.variant.yAxis.start = sizeProperties.height - paddingBottom;
	this.variant.yAxis.end = paddingTop;
	this.variant.yAxis.fixed = paddingLeft;
	var mt = this.db.getMatchType();
	var barCount = 1;
	if (CricketMatchType.ODI === mt) barCount = 50;
	else if (CricketMatchType.T20 === mt) barCount = 20;
	else if (CricketMatchType.TEST === mt)
		if (this.data)
			for (var inningsIndex in this.data) {
				var overs = this.data[inningsIndex].length;
				if (overs > barCount) barCount = overs
			}
		this.variant.bars.width = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.9;
	this.variant.bars.fowsize = (this.variant.xAxis.end - this.variant.xAxis.start) / barCount * 0.6;
	this.variant.xAxis.shift = (2 - this.variant.bars.width) / 2
};
RunRateRenderer.prototype.prepareData = function(data) {
	this.tooltipDataCache = {};
	var inningsSeries = {};
	if (data.length > 0) {
		var inningsData = {};
		for (var i = 0, ilimit = data.length; i < ilimit; i++) {
			var row = data[i];
			var innings = +row.get(CricketField.INNINGS);
			var inningsDataItem = inningsData[innings];
			if (inningsDataItem === undefined) {
				inningsDataItem = [];
				inningsData[innings] = inningsDataItem
			}
			inningsDataItem.push(row)
		}
		var maxOvers = 0;
		var participants = this.db.getParticipants();
		for (var innings = 1; innings <= 4; innings++) {
			var pIndex = this.db.getBattingTeamIndex(innings);
			var pName = participants[pIndex].abbreviation;
			inningsSeries[innings] = [];
			var inningsRecords = inningsData[innings];
			if (inningsRecords === undefined || inningsRecords.length === 0) break;
			var stats = {
				runs: 0,
				wickets: 0,
				over: 0
			};
			var lastOver = 0;
			for (var i = 0, j = inningsRecords.length; i < j; i++) {
				var row = inningsRecords[i];
				var over = +row.get(CricketField.OVER);
				if (over !== lastOver) {
					if (over !== 1) inningsSeries[innings].push(this.prepareRecord(stats, pName));
					lastOver = over;
					stats.wickets = 0;
					stats.over = over
				}
				stats.runs += +row.get(CricketField.RUNS);
				if (row.get(CricketField.IS_WICKET)) stats.wickets++;
				if (over > maxOvers) maxOvers = over
			}
			inningsSeries[innings].push(this.prepareRecord(stats, pName))
		}
		this.variant.xAxis.max = this.variant.xAxis.configuredMax;
		if (maxOvers > this.variant.xAxis.max) this.variant.xAxis.max = maxOvers
	}
	return inningsSeries
};
RunRateRenderer.prototype.prepareRecord = function(stats, participant) {
	var yvalue = this.getYValue(stats);
	var x = this.variant.xAxis.project(stats.over);
	var y = this.variant.yAxis.project(yvalue);
	var ix = Math.round(x);
	var iy = Math.round(y);
	var xcache = this.tooltipDataCache[ix];
	if (!xcache) {
		xcache = {
			x: ix,
			xvalue: stats.over
		};
		this.tooltipDataCache[ix] = xcache
	}
	xcache[iy] = {
		y: iy,
		yvalue: yvalue,
		participant: participant
	};
	return {
		x: x,
		y: y,
		w: stats.wickets
	}
};
RunRateRenderer.prototype.draw = function() {
	this.controller.setBackground(this.config.background, this.config.css, this.dimensions, this.offset, this.config.clazz);
	this.ctx.canvas.lineWidth = 10;
	this.ctx.canvas.save();
	this.ctx.canvas.font = this.config.font;
	this.ctx.canvas.clearRect(0, 0, this.ctx.canvas.canvas.width, this.ctx.canvas.canvas.height);
	this.renderTooltip(this.ctx.canvas, this.tooltipData);
	this.ctx.canvas.strokeStyle = "rgba( 255, 255, 255, 1 )";
	this.variant.xAxis.drawTo(this.ctx.canvas, true);
	this.variant.yAxis.drawTo(this.ctx.canvas, false);
	var flexikey = new Flexikey(this.config.flexikey);
	try {
		var participants = this.db.getParticipants();
		var gt = this.db.getMatchType();
		var suffix = "";
		for (var i = 1; i <= 4; i++) {
			var thisInningsSeries = this.data[i];
			if (thisInningsSeries === undefined || thisInningsSeries.length < 1) break;
			var pIndex = this.db.getBattingTeamIndex(i);
			var color;
			if (i <= 2) {
				color = participants[pIndex].primaryColor;
				suffix = " 1st inns"
			} else {
				color = participants[pIndex].secondaryColor;
				suffix = " 2nd inns"
			}
			this.renderSeries(this.ctx.canvas, thisInningsSeries, color);
			var label = participants[pIndex].fullName;
			if (CricketMatchType.TEST === gt) label += suffix;
			flexikey.addEntry(label, color)
		}
		flexikey.render(this.ctx.canvas)
	} catch (e) {}
};
RunRateRenderer.prototype.renderSeries = function(ctx, series, color) {
	ctx.save();
	ctx.lineWidth = Math.max(3, Math.round(3 * this.config.scaleXY));
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.beginPath();
	for (var i = 0, j = series.length; i < j; i++) {
		var item = series[i];
		if (i === 0) ctx.moveTo(item.x, item.y);
		else ctx.lineTo(item.x, item.y)
	}
	ctx.stroke();
	ctx.lineWidth = Math.max(1, Math.round(1 * this.config.scaleXY));
	ctx.strokeStyle = this.config.fow.stroke;
	for (var i = 0, j = series.length; i < j; i++) {
		var item = series[i];
		if (item.w > 0)
			for (var k = 0, l = item.w; k < l; k++) {
				ctx.beginPath();
				Utils.circle(ctx, item.x, item.y - k * this.config.fow.size, this.config.fow.size * this.config.scaleXY / 2);
				ctx.fill();
				ctx.stroke()
			}
	}
	ctx.restore()
};
RunRateRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	this.tooltipData = this.findNearbyTooltip(xy);
	this.draw()
};
RunRateRenderer.prototype.findNearbyTooltip = function(xy) {
	if (xy)
		if (xy.x <= this.variant.xAxis.end && xy.x >= this.variant.xAxis.start && xy.y >= this.variant.yAxis.end && xy.y <= this.variant.yAxis.start) {
			var search = xy.x;
			while (search >= this.variant.xAxis.start)
				if (this.tooltipDataCache[search]) return this.tooltipDataCache[search];
				else search--
		}
};
RunRateRenderer.prototype.getYValue = function(item) {
	return item.runs / item.over
};
RunRateRenderer.prototype.renderTooltip = function(ctx, ttd) {
	if (ttd) {
		ctx.save();
		ctx.strokeStyle = "rgba( 255, 255, 255, 0.6 )";
		var tf = undefined;
		if (this.config.textField) {
			tf = new PULSE.TextField(this.config.textField);
			tf.addLine("\x3cc:#bbb\x3eOver \x3c/c\x3e" + ttd.xvalue)
		}
		var line = "";
		for (var ttditem in ttd)
			if (ttditem !== "x" && ttditem !== "xvalue") {
				var t = ttd[ttditem];
				ctx.beginPath();
				ctx.moveTo(this.variant.xAxis.start, t.y);
				ctx.lineTo(ttd.x, t.y);
				ctx.lineTo(ttd.x, this.variant.yAxis.start);
				ctx.stroke();
				line += "\x3cc:#bbb\x3e" + t.participant + " \x3c/c\x3e" + this.format(t.yvalue) + ", "
			}
		if (tf) {
			if (line.length > 2) line = line.substr(0, line.length - 2);
			tf.addLine(line);
			tf.render(ctx)
		}
		ctx.restore()
	}
};
RunRateRenderer.prototype.format = function(value) {
	return value.toFixed(2) + " \x3cc:#bbb\x3erpo\x3c/c\x3e"
};

function WormsRenderer(config) {
	this.config = config
}
WormsRenderer.prototype.render = RunRateRenderer.prototype.render;
WormsRenderer.prototype.setFont = RunRateRenderer.prototype.setFont;
WormsRenderer.prototype.prepareData = RunRateRenderer.prototype.prepareData;
WormsRenderer.prototype.draw = RunRateRenderer.prototype.draw;
WormsRenderer.prototype.setSize = RunRateRenderer.prototype.setSize;
WormsRenderer.prototype.renderSeries = RunRateRenderer.prototype.renderSeries;
WormsRenderer.prototype.prepareRecord = RunRateRenderer.prototype.prepareRecord;
WormsRenderer.prototype.onMouse = RunRateRenderer.prototype.onMouse;
WormsRenderer.prototype.findNearbyTooltip = RunRateRenderer.prototype.findNearbyTooltip;
WormsRenderer.prototype.renderTooltip = RunRateRenderer.prototype.renderTooltip;
WormsRenderer.prototype.format = function(value) {
	return value + " \x3cc:#bbb\x3eruns\x3c/c\x3e"
};
WormsRenderer.prototype.getYValue = function(item) {
	return item.runs
};

function WinLikelihoodRenderer(config) {
	this.config = config
}
WinLikelihoodRenderer.prototype.render = function(db, data, ctx) {
	this.db = db;
	this.data = data;
	this.ctx = ctx;
	this.tooltipData = undefined;
	this.dismissalData = undefined;
	this.tooltipDataCache = {};
	this.draw()
};
WinLikelihoodRenderer.prototype.draw = function() {
	this.ctx.save();
	this.ctx.font = this.config.font;
	this.ctx.clearRect(0, 0, this.config.width, this.config.height);
	this.renderTextFields = true;
	var currentInnings = 0;
	var currentOver = 0;
	var dismissals = [];
	var x = 1;
	var battingIndex = 0;
	var series = [
		[],
		[],
		[]
	];
	var likelihoods;
	var lastLikelihoods;
	for (var i = 0, j = this.data.length; i < j; i++) {
		var row = this.data[i];
		likelihoods = row.get(CricketField.WIN_LIKELIHOODS);
		if (likelihoods === undefined) likelihoods = lastLikelihoods;
		if (likelihoods === undefined) continue;
		var over = row.get(CricketField.OVER);
		if (over !== currentOver) {
			if (currentOver != 0) this.addData(series, x, likelihoods, battingIndex, dismissals);
			dismissals = [];
			currentOver = over;
			x++
		}
		var innings = row.get(CricketField.INNINGS);
		if (innings !== currentInnings) {
			currentInnings = innings;
			battingIndex = this.db.getBattingTeamIndex(innings)
		}
		if (row.get(CricketField.IS_WICKET)) dismissals.push(row.get(CricketField.DISMISSED));
		lastLikelihoods = likelihoods
	}
	if (likelihoods !== undefined) this.addData(series, x, likelihoods, battingIndex, dismissals);
	this.config.xAxis.max = this.config.xAxis.configuredMax;
	if (x > this.config.xAxis.max) this.config.xAxis.max = x;
	this.config.yAxis.end = this.config.yAxis.configuredEnd;
	var testMatch = CricketMatchType.TEST === this.db.getMatchType();
	if (testMatch) this.config.yAxis.end += 30;
	this.ctx.strokeStyle = "rgba( 255, 255, 255, 1 )";
	this.config.xAxis.drawTo(this.ctx, true);
	this.config.yAxis.drawTo(this.ctx, false);
	var flexikey = new Flexikey(this.config.flexikey);
	if (testMatch) this.renderSeries(this.ctx, series[1], this.config.drawColor, "Draw");
	var participants = this.db.getParticipants();
	for (var team = 0; team < 2; team++) {
		var color = participants[team].primaryColor;
		this.renderSeries(this.ctx, series[2 * team], color, participants[team].fullName);
		flexikey.addEntry(participants[team].fullName, color);
		if (team === 0 && testMatch) flexikey.addEntry("Draw", this.config.drawColor)
	}
	flexikey.render(this.ctx);
	if (this.tooltipData !== undefined) {
		this.ctx.save();
		this.ctx.strokeStyle = this.config.tooltips.background;
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.moveTo(this.tooltipData.x, this.config.yAxis.start - 1);
		this.ctx.lineTo(this.tooltipData.x, this.config.yAxis.end);
		this.ctx.stroke();
		this.ctx.font = this.config.tooltips.font;
		for (var labelName in this.tooltipData.labels) {
			var label = this.tooltipData.labels[labelName];
			var others = [];
			for (var labelCheck in this.tooltipData.labels) {
				if (labelCheck === labelName) continue;
				var other = this.tooltipData.labels[labelCheck];
				if (Math.abs(other.y - label.y) <= this.config.tooltips.height) others.push(other)
			}
			var skip = false;
			for (var i = 0, j = others.length; i < j && !skip; i++)
				if (others[i].y < label.y) skip = true;
				else if (others[i].y === label.y) skip = others[i].string < label.string;
			if (this.dismissalData !== undefined && this.renderTextFields) {
				this.renderTextFields = false;
				var tf = new PULSE.TextField(this.config.dismissalTextField);
				var d = "";
				for (dd = 0, ee = this.dismissalData.length; dd < ee; dd++) {
					if (dd !== 0)
						if (dd === ee - 1) d += " and ";
						else d += ", ";
					d += this.dismissalData[dd]
				}
				tf.addLine(d + " dismissed");
				tf.render(this.ctx)
			}
			if (!skip) {
				var width = Utils.stringSize(this.ctx, label.string).width + 2 * this.config.tooltips.border;
				var anchor = "w";
				var border = this.config.tooltips.border;
				var offset = 1;
				this.ctx.beginPath();
				this.ctx.fillStyle = this.config.tooltips.background;
				if (this.tooltipData.x + width > this.config.xAxis.end) {
					width *= -1;
					border *= -1;
					offset *= -1;
					anchor = "e"
				}
				this.ctx.rect(this.tooltipData.x + offset, label.y - this.config.tooltips.height / 2, width, this.config.tooltips.height);
				this.ctx.fill();
				this.ctx.fillStyle = this.config.tooltips.foreground;
				Utils.anchoredFillText(this.ctx, label.string, this.tooltipData.x + border, label.y - 2, anchor)
			}
		}
		this.ctx.restore()
	}
	this.ctx.restore()
};
WinLikelihoodRenderer.prototype.renderSeries = function(ctx, series, color, label) {
	ctx.save();
	ctx.lineWidth = 3;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.beginPath();
	for (var i = 0, j = series.length; i < j; i++) {
		var item = series[i];
		var x = this.config.xAxis.project(item.x);
		var y = this.config.yAxis.project(item.y);
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
		var index = Math.round(x);
		var cacheRecord = this.tooltipDataCache[index];
		if (!cacheRecord) {
			cacheRecord = {
				x: x,
				labels: {}
			};
			this.tooltipDataCache[index] = cacheRecord
		}
		var rec = {
			string: label + ": " + Math.round(item.y) + "%",
			y: y
		};
		if (item.dismissals !== undefined) {
			rec.z = item.dismissals.length;
			cacheRecord.dismissals = item.dismissals
		}
		cacheRecord.labels[label] = rec
	}
	ctx.stroke();
	ctx.lineWidth = 1;
	ctx.strokeStyle = this.config.fow.stroke;
	for (var i = 0, j = series.length; i < j; i++) {
		var item = series[i];
		if (item.z > 0) {
			var x = this.config.xAxis.project(item.x);
			var y = this.config.yAxis.project(item.y);
			for (var k = 0, l = item.z; k < l; k++) {
				ctx.beginPath();
				Utils.circle(ctx, x, y - k * this.config.fow.size, this.config.fow.size / 2);
				ctx.fill();
				ctx.stroke()
			}
		}
	}
	ctx.restore()
};
WinLikelihoodRenderer.prototype.addData = function(series, x, likelihoods, battingIndex, dismissals) {
	for (var k = 0; k < 3; k++) {
		var item = {
			x: x,
			y: likelihoods[k] / 10,
			z: 0
		};
		if (dismissals.length > 0 && k === battingIndex * 2) {
			item.z = dismissals.length;
			item.dismissals = dismissals
		}
		series[k].push(item)
	}
};
WinLikelihoodRenderer.prototype.onMouse = function(event) {
	var xy = Utils.getXY(event);
	if (xy !== undefined && xy.y >= this.config.yAxis.end && xy.y <= this.config.yAxis.start && xy.x >= this.config.xAxis.start && xy.x <= this.config.xAxis.end) {
		this.tooltipData = this.tooltipDataCache[xy.x];
		var search = xy.x;
		while (this.tooltipData === undefined && search >= this.config.xAxis.start) {
			search--;
			this.tooltipData = this.tooltipDataCache[search]
		}
		if (this.tooltipData === undefined || this.tooltipData.dismissals === undefined) {
			this.dismissalData = undefined;
			for (var offset = 1; offset <= 3; offset++) {
				var neighbour = this.tooltipDataCache[xy.x - offset];
				if (neighbour !== undefined && neighbour.dismissals !== undefined) {
					this.dismissalData = neighbour.dismissals;
					break
				}
				neighbour = this.tooltipDataCache[xy.x + offset];
				if (neighbour !== undefined && neighbour.dismissals !== undefined) {
					this.dismissalData = neighbour.dismissals;
					break
				}
			}
		} else this.dismissalData = this.tooltipData.dismissals
	} else this.tooltipData = undefined;
	this.draw()
};
obtainVariant = function(config, db) {
	var mt = db.getMatchType();
	if (CricketMatchType.ODI === mt) return config.variants.odi;
	else if (CricketMatchType.T20 === mt || CricketMatchType.T20I === mt) return config.variants.t20;
	else if (CricketMatchType.TEST === mt) return config.variants.test
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.Main = function($container, match, defaults, templates) {
	this.$container = $container;
	this.match = match;
	this.customer = this.match.customer;
	this.customer = "icc";
	this.simpleRender = this.match.tournament.mcDefaults && this.match.tournament.mcDefaults.simpleRenderComms;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.match.tournament);
	this.templates = $.extend({
		auto: "templates/mc/commentary/auto.html",
		manual: "templates/mc/commentary/manual.html",
		eov: "templates/mc/commentary/eov.html",
		tweet: "templates/mc/commentary/tweet.html",
		video: "templates/mc/commentary/video.html",
		photo: "templates/mc/commentary/photo.html",
		loading: "templates/mc/commentary/loading.html",
		empty: "templates/mc/commentary/empty.html"
	}, templates || {});
	this.entries = {};
	defaults = defaults || {};
	this.defaults = {
		"no-data": defaults["no-data"] || "Commentary not yet available",
		"no-match": defaults["no-match"] || ""
	};
	this.setConditions();
	this.categories = [];
	var commentaryTypes = ["Manual", "Eov", "Video", "Auto"];
	if (this.match.tournament && this.match.tournament.mcDefaults && this.match.tournament.mcDefaults.onlyManual) commentaryTypes = ["Manual", "Eov", "Video"];
	this.filters = {
		"commentary": {
			types: commentaryTypes,
			categories: this.categories,
			condition: this.returnsTrue,
			loadRate: 1
		},
		"videos": {
			types: ["Video"],
			categories: this.categories,
			condition: this.matchesTags,
			loadRate: 2
		},
		"photos": {
			types: ["Photo"],
			categories: [],
			condition: this.returnsTrue,
			loadRate: 1
		},
		"tweets": {
			types: ["Manual"],
			categories: [],
			condition: this.isATweet,
			loadRate: 3
		},
		"progress": {
			types: ["Eov", "Auto"],
			categories: this.categories,
			condition: this.matchesBp,
			loadRate: 5
		}
	};
	this.filter = ["commentary"];
	this.onFirstLoad = true;
	this.canRender = true;
	this.startWith = 2;
	this.loadRate = 2;
	this.timestamps = [];
	this.chunks = [];
	this.setSubscriptions();
	this.setEventListeners();
	this.$container.append('\x3cdiv class\x3d"loading"\x3e\x3c/div\x3e');
	this.$loading = this.$container.find("div.loading");
	PULSE.CLIENT.Template.publish(this.templates.loading, this.$loading, {});
	this.$container.append('\x3cdiv class\x3d"no-data" style\x3d"display:none;"\x3e\x3c/div\x3e');
	this.$emptyMessage = this.$container.find("div.no-data");
	this.match.startCommentaryFeed(this.customer)
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.setEventListeners = function() {
	var that = this;
	this.$container.waypoint({
		handler: function(direction) {
			if (direction === "down" && that.chunks[0] - 1 > 0) {
				var nextChunks = that.getMoreChunks();
				that.loadChunks(nextChunks, "append")
			}
		},
		offset: "bottom-in-view"
	});
	this.$container.on("click", ".videoThumb", function(e) {
		e.preventDefault();
		var id = $(this).attr("data-media-id");
		PULSE.CLIENT.notify("play/video", {
			id: id,
			success: true
		})
	})
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getCurrentFilters = function() {
	if (!this.filter || this.filter.length === 0) return this.filters;
	else {
		var that = this;
		return $.map(this.filter, function(name) {
			return that.filters[name]
		})
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getCurrentLoadRate = function() {
	if (!this.filter || this.filter.length === 0) return this.loadRate;
	else {
		var currentFilters = this.getCurrentFilters();
		var loadRates = $.map(currentFilters, function(f) {
			return f.loadRate
		});
		return _.min(loadRates)
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getMoreChunks = function() {
	var howMany = this.getCurrentLoadRate();
	var chunks = [];
	if (howMany === 0 || this.chunks[0] - 1 === 0) return chunks;
	chunks.push(this.chunks[0] - 1);
	while (howMany - 1 > 0 && _.last(chunks) - 1 > 0) {
		chunks.push(_.last(chunks) - 1);
		howMany--
	}
	return chunks
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("commentary/meta", function(e, params) {
		if (params.matchId !== that.match.matchId) return;
		if (params.success) {
			that.$emptyMessage.hide();
			that.removeDeletedChunks();
			var newChunks = that.getNewChunks(that.chunks.length ? undefined : that.startWith);
			that.loadChunks(newChunks);
			var updatedChunks = that.getUpdatedChunks();
			that.getChunks(updatedChunks);
			that.timestamps = that.match.commentaryMeta;
			that.onFirstLoad = false
		} else if (that.timestamps.length === 0) {
			PULSE.CLIENT.Template.publish(that.templates.empty, that.$emptyMessage, {
				message: that.defaults["no-data"]
			});
			that.$loading.hide();
			that.$emptyMessage.show()
		}
	});
	$("body").on("commentary/chunk", function(e, params) {
		if (params.matchId !== that.match.matchId) return;
		that.canRender = true;
		if (params.success) {
			var data = params.data;
			var number = data.fragment;
			if (!that.simpleRender)
				for (var i = 0, iLimit = data.commentaries.length; i < iLimit; i++) {
					var entry = data.commentaries[i];
					if (!that.entries[entry.id]) that.createEntry(entry);
					else that.entries[entry.id].update(entry)
				}
			that.renderChunk($("#chunk" + number), data.commentaries);
			that.updatePlayerImages();
			if (number === that.chunks[0]) {
				$.waypoints("refresh");
				if (that.active)
					if ((that.$container.find("li.entry:visible").length < 15 || that.$container.find("#chunk" + that.chunks[0] + " li:visible").length === 0) && that.chunks[0] - 1 > 0) {
						var nextChunks = that.getMoreChunks();
						that.loadChunks(nextChunks, "append")
					}
			}
			if (that.active && 1 === that.chunks[0])
				if (that.$container.find("li.entry:visible").length === 0) {
					var message = that.filter.length ? that.defaults["no-match"] : that.defaults["no-data"];
					PULSE.CLIENT.Template.publish(that.templates.empty, that.$emptyMessage, {
						message: message
					});
					that.$loading.hide();
					that.$emptyMessage.show()
				} else that.$emptyMessage.hide()
		} else {
			if (params.fragment - 1 > 0) that.loadChunks([params.fragment - 1], "append");
			$.waypoints("refresh")
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.refresh = function(immediate) {
	if (!this.match.commentaryMeta) return;
	if (immediate || this.simpleRender)
		for (var i = this.chunks.length - 1; i >= 0; i--) {
			var num = this.chunks[i];
			if (this.match.chunks[num]) this.renderChunk(this.$container.find("#chunk" + num), this.match.chunks[num].commentaries)
		} else {
			var newChunks = this.getNewChunks(this.chunks.length ? undefined : this.startWith);
			this.loadChunks(newChunks);
			var updatedChunks = this.getUpdatedChunks();
			this.getChunks(updatedChunks)
		}
	$.waypoints("refresh")
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.removeDeletedChunks = function() {
	for (var i = this.chunks.length - 1; i >= 0; i--) {
		var chunk = this.chunks[i];
		if (chunk > this.match.commentaryMeta.length) this.chunks.splice(i, 1)
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.loadChunks = function(chunks, func) {
	if (this.canRender && chunks.length) {
		this.addChunks(chunks, func);
		this.getChunks(chunks);
		this.canRender = false
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getChunks = function(numbers) {
	for (var i = numbers.length - 1; i >= 0; i--) this.match.getCommentarySegment(numbers[i], true, {
		customer: this.customer
	})
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getNewChunks = function(limit) {
	var chunks = [];
	if (typeof limit === "undefined") limit = 0;
	var added = 0;
	var iLimit = _.last(this.chunks) || 1;
	for (var i = this.match.commentaryMeta.length; i >= iLimit; i--)
		if (-1 === _.indexOf(this.chunks, i)) {
			chunks.unshift(i);
			added++;
			if (limit && added === limit) break
		}
	return chunks
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getUpdatedChunks = function() {
	var chunks = [];
	for (var i = 0; i < this.timestamps.length; i++)
		if (this.match.commentaryMeta[i] !== this.timestamps[i] && $.inArray(i + 1, this.chunks) > -1) chunks.push(i + 1);
	return chunks
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.addChunks = function(chunks, func) {
	var show = this.onFirstLoad;
	func = func || "prepend";
	var chunksHTML = "";
	chunks.sort(function(a, b) {
		return a - b
	});
	for (var i = chunks.length - 1; i >= 0; i--) {
		var number = chunks[i];
		chunksHTML += '\x3cul id\x3d"chunk' + number + '" class\x3d"streamItems' + (show ? " fadeIn" : "") + '"\x3e\x3c/ul\x3e'
	}
	this.chunks = this.chunks.concat(chunks);
	this.chunks.sort(function(a, b) {
		return a - b
	});
	if (_.isFunction(this.$container[func])) this.$container[func](chunksHTML);
	this.$loading.appendTo(this.$container).show()
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.renderChunk = function($chunk, entries) {
	this.$loading.hide();
	var entries = this.filterEntries(entries);
	var published = $chunk.children().length;
	if (PULSE.CLIENT.Util.isEmpty($chunk) || published < 5 && published < entries.length / 2 || !this.active || this.simpleRender) {
		var entriesHTML = this.getEntriesHTML(entries, $chunk);
		$chunk.html(entriesHTML);
		var $chunks = this.$container.find(".streamItems");
		$chunks.first().css("opacity", 1);
		$chunk.css("opacity", 0);
		window.getComputedStyle($chunk.get(0)).getPropertyValue("top");
		$chunk.css("opacity", 1)
	} else this.updateEntryContainers($chunk, entries); if (!this.simpleRender)
		for (var i = 0, iLimit = entries.length; i < iLimit; i++) {
			var entry = entries[i];
			this.entries[entry.id].setContainer()
		}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getEntriesHTML = function(entries) {
	var listHTML = "";
	for (var i = entries.length - 1; i >= 0; i--) {
		var id = entries[i].id;
		if (this.simpleRender) listHTML += '\x3cli class\x3d"entry" data-entry-id\x3d"' + id + '" data-update-time\x3d"' + entries[i].updateTime + '"\x3e' + this.getEntryHTML(entries[i]) + "\x3c/li\x3e";
		else listHTML += '\x3cli class\x3d"entry" data-entry-id\x3d"' + id + '" data-update-time\x3d"' + entries[i].updateTime + '"\x3e' + this.entries[id].getHTML() + "\x3c/li\x3e"
	}
	return listHTML
};
var isiPad = function() {
	return false
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.createEntry = function(entry) {
	if (entry.type === "Eov") {
		this.entries[entry.id] = new PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver(entry, this);
		this.entries[this.makeEntryKey(entry)] = this.entries[entry.id]
	} else if (entry.type === "Auto") {
		this.entries[entry.id] = new PULSE.CLIENT.CRICKET.MC.Comms.Ball(entry, this);
		this.entries[this.makeEntryKey(entry)] = this.entries[entry.id]
	} else if (entry.type === "Video") this.entries[entry.id] = new PULSE.CLIENT.CRICKET.MC.Comms.Video(entry, this);
	else if (entry.tweetjson) this.entries[entry.id] = new PULSE.CLIENT.CRICKET.MC.Comms.Tweet(entry, this);
	else this.entries[entry.id] = new PULSE.CLIENT.CRICKET.MC.Comms.Entry(entry, this)
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.updateEntryContainers = function($chunk, entries) {
	var ids = $.map(entries, function(entry, i) {
		return entry.id
	});
	var that = this;
	$chunk.children().each(function() {
		var entryId = $(this).attr("data-entry-id");
		if ($.inArray(+entryId, ids) === -1) {
			$(this).hide();
			that.entries[+entryId].deactivate()
		}
	});
	for (var i = entries.length - 1; i >= 0; i--) {
		var id = entries[i].id;
		var $entry = $chunk.find('li[data-entry-id\x3d"' + id + '"]');
		var index;
		if (!$entry || $entry.length === 0) $entry = this.getEntriesHTML([entries[i]]);
		index = $.inArray($entry[0], $chunk.children());
		if (index === entries.length - i - 1);
		else if (i === 0) $chunk.append($entry);
		else $chunk.children().eq(entries.length - i - 1).before($entry);
		$($entry).show()
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getBallProgress = function(entry) {
	if (entry && entry.countingProgress) return entry.countingProgress.over + "." + entry.countingProgress.ball;
	else return "EOV"
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getEntryHTML = function(entry) {
	var entryHTML = "";
	if (entry.type === "Eov") entryHTML = this.getEndOfOverCommentary(entry);
	else if (entry.type === "Auto") entryHTML = this.getAutoCommentary(entry);
	else if (entry.type === "Photo") entryHTML = this.getPhotoCommentary(entry);
	else if (entry.type === "Video") entryHTML = this.getVideoCommentary(entry);
	else if (entry.tweetjson) entryHTML = this.getTweetCommentary(entry.tweetjson);
	else entryHTML = this.getStandardCommentary(entry);
	return entryHTML
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getEndOfOverCommentary = function(entry) {
	var html = "";
	PULSE.CLIENT.Template.fetch(this.templates.eov, function(commentaryTemplate) {
		html = commentaryTemplate(entry)
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getAutoCommentary = function(entry) {
	var html = "";
	var type = entry.type;
	if (entry.autoText && entry.autoText.indexOf("%SPEED%") !== -1) {
		var ballSpeed = entry.speed * 3.6;
		entry.autoText = entry.autoText.replace(/%SPEED%/, ballSpeed.toFixed(1) + " km/h")
	}
	entry.autoText = entry.autoText || "";
	entry.thisOver = entry.thisOver || "";
	entry.timestamp = entry.timestamp || undefined;
	PULSE.CLIENT.Template.fetch(this.templates.auto, function(commentaryTemplate) {
		html = commentaryTemplate(entry)
	});
	entry.type = type;
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getStandardCommentary = function(entry) {
	var html = "";
	if (entry.timestamp) entry.localTime = (new Date(entry.timestamp)).format("HH:MM");
	else entry.localTime = undefined;
	entry.tags = entry.tags || [];
	PULSE.CLIENT.Template.fetch(this.templates.manual, function(commentaryTemplate) {
		html = commentaryTemplate(entry)
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getTweetCommentary = function(tweetJson) {
	var html = "";
	var model = PULSE.CLIENT.Twitter.getTweetModel(tweetJson);
	PULSE.CLIENT.Template.fetch(this.templates.tweet, function(commentaryTemplate) {
		html = commentaryTemplate(model)
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getVideoCommentary = function(entry) {
	var html = "";
	entry.cls = this.match.getVideoClasses(entry.tags);
	entry.date = dateFormat(new Date(entry.publishDate), "dd mmmm yyyy");
	PULSE.CLIENT.Template.fetch(this.templates.video, function(commentaryTemplate) {
		html = commentaryTemplate(entry)
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.getPhotoCommentary = function(entry) {
	var html = "";
	PULSE.CLIENT.Template.fetch(this.templates.photo, function(commentaryTemplate) {
		html = commentaryTemplate(entry)
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.filterEntries = function(entries, filter) {
	filter = filter || this.filter;
	if (!filter || filter.length === 0) return entries;
	if (!_.isArray(entries)) return [];
	var that = this;
	var matchingEntries = $.grep(entries, function(entry, i) {
		for (var i = 0, iLimit = filter.length; i < iLimit; i++) {
			var name = filter[i];
			if (-1 < _.indexOf(that.filters[name].types, entry.type) && that.filters[name].condition(entry)) return true
		}
		return false
	});
	return matchingEntries
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.setConditions = function() {
	var that = this;
	this.isATweet = function(entry) {
		return entry.tweetjson
	};
	this.commsNotTwitter = function(entry) {
		return !that.isATweet(entry) && that.matchesTags(entry)
	};
	this.matchesTags = function(entry) {
		for (var i = 0, iLimit = that.filter.length; i < iLimit; i++) {
			var name = that.filter[i];
			var categories = _.clone(that.filters[name].categories);
			categories = $.grep(categories, function(array, i) {
				return array.length
			});
			if (categories.length === 0) return true;
			for (var j = 0, jLimit = categories.length; j < jLimit; j++)
				if (_.intersection(entry.tags, categories[j]).length === 0) return false;
			return true
		}
	};
	this.returnsTrue = function(entry) {
		return true
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.resetFilter = function() {
	this.filter = []
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.makeEntryKey = function(entry) {
	switch (entry.type) {
		case "Auto":
			var progress = entry.progress || entry.countingProgress;
			return progress.innings + "." + progress.over + "." + progress.ball;
		case "Eov":
			return entry.innings + "." + entry.over;
		default:
			return entry.id
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.updatePlayerImages = function() {
	var that = this;
	var $imgContainer = this.$container.find(".playerPhoto");
	if ($imgContainer.length > 0) $imgContainer.each(function() {
		that.urlFactory.setPlayerImageLoader($(this).attr("data-player-id"), "100x115", $(this), "png", that.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.activate = function() {
	this.active = true;
	this.$container.waypoint("enable");
	this.$container.parent().show();
	this.refresh()
};
PULSE.CLIENT.CRICKET.MC.Comms.Main.prototype.deactivate = function() {
	this.active = false;
	this.$container.waypoint("disable");
	this.$container.parent().hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.Entry = function(entry, parent) {
	this.id = entry.id;
	this.entry = entry;
	this.parent = parent;
	this.active = true;
	this.template = parent.templates.manual
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.setContainer = function($container) {
	if (!$container && (!this.$container || !this.$container.length)) $container = this.parent.$container.find('li[data-entry-id\x3d"' + this.id + '"]');
	else if (this.$container && this.$container.length) this.$container.off();
	this.$container = $container;
	this.setListeners()
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.isEqual = _.isEqual;
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.update = function(newEntryData) {
	if (!newEntryData || false === this.isEqual(this.entry, newEntryData)) {
		this.entry = newEntryData || this.entry;
		if (this.active)
			if (this.$container && this.$container.length) {
				this.$container.html(this.getHTML());
				this.refresh()
			}
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.refresh = function() {};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.getHTML = function() {
	var html = "";
	var that = this;
	PULSE.CLIENT.Template.fetch(this.template, function(entryTemplate) {
		html = entryTemplate(that.getModel())
	});
	return html
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.getModel = function() {
	this.entry.localTime = this.entry.timestamp ? (new Date(this.entry.timestamp)).format("HH:MM") : "";
	return this.entry
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.setListeners = function() {};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.activate = function() {
	this.active = true
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.deactivate = function() {
	this.active = false
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.Ball = function(entry, parent) {
	PULSE.CLIENT.CRICKET.MC.Comms.Entry.call(this, entry, parent);
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator(this.parent.match.tournament);
	this.innings = entry.progress ? entry.progress.innings : entry.countingProgress.innings;
	this.over = entry.progress ? entry.progress.over : entry.countingProgress.over;
	this.ball = entry.progress ? entry.progress.ball : entry.countingProgress.ball;
	this.template = parent.templates.auto
};
PULSE.CLIENT.CRICKET.MC.Comms.Ball.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype);
PULSE.CLIENT.CRICKET.MC.Comms.Ball.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Comms.Ball;
PULSE.CLIENT.CRICKET.MC.Comms.Ball.prototype.refresh = function() {
	var that = this;
	var $imgContainer = this.$container.find(".playerPhoto");
	if ($imgContainer.length > 0) $imgContainer.each(function() {
		that.urlFactory.setPlayerImageLoader($(this).attr("data-player-id"), "100x115", $(this), "png", that.parent.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.Comms.Ball.prototype.getModel = function() {
	this.entry.ballSpeed = PULSE.CLIENT.getBallSpeedModel(this.entry);
	if (this.entry.ballSpeed) {
		this.entry.autoText = this.entry.autoText.replace(/%SPEED%/, this.entry.ballSpeed.kmph.toFixed(1) + " km/h");
		this.entry.previousBallSpeed = this.getPreviousBallSpeed()
	}
	var gender = this.parent.match.getTeamType(0);
	if (gender === "w") {
		this.entry.autoText = this.entry.autoText.replace(/(\W)he(\W)/, "$1she$2");
		this.entry.autoText = this.entry.autoText.replace(/(\W)He(\W)/, "$1She$2")
	}
	this.entry.thisOver = this.entry.thisOver || "";
	this.entry.bowler = this.parent.match.getBowlerModel(this.entry.bowlerId);
	this.entry.facingBatsman = this.parent.match.getBatsmanModel(true, this.entry.facingBatsmanId);
	this.entry.nonFacingBatsman = this.parent.match.getBatsmanModel(false, this.entry.nonfacingBatsmanId);
	return this.entry
};
PULSE.CLIENT.CRICKET.MC.Comms.Ball.prototype.getPreviousBallSpeed = function() {
	var ball = this.ball - 1;
	var over = this.over - 1;
	if (ball === 0) return;
	var bp = this.innings + "." + this.over + "." + ball;
	if (this.parent.entries[bp]) {
		var ballEntry = this.parent.entries[bp];
		return PULSE.CLIENT.getBallSpeedModel(ballEntry.entry)
	}
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.activate = function() {
	this.active = true;
	this.update();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver = function(entry, parent) {
	PULSE.CLIENT.CRICKET.MC.Comms.Entry.call(this, entry, parent);
	this.innings = entry.innings;
	this.over = entry.over;
	this.selectedBall = -1;
	this.template = parent.templates.eov
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype);
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver;
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.setListeners = function() {
	var that = this;
	if (!this.$container || this.$container.length === 0) return
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.loadBall = function(index) {
	var ball = this.getBallEntry(index);
	if (ball) {
		ball.setContainer(this.$container.find(".ballDetails" + index));
		ball.activate();
		this.selectedBall = index
	} else console.log("tried to load ball " + index + " but commentary has no such entry")
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.unloadBall = function(index) {
	var ball = this.getBallEntry(index);
	if (ball) {
		ball.deactivate();
		this.selectedBall = -1
	} else console.log("tried to unload ball " + index + " but commentary has no such entry")
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.getBallEntry = function(index) {
	var bp = this.innings + "." + this.over + "." + (+index + 1);
	return this.parent.entries[bp]
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.getModel = function() {
	for (var i = 0, iLimit = this.entry.batsmanSummaries.length; i < iLimit; i++) {
		var player = this.entry.batsmanSummaries[i];
		var playerNames = PULSE.CLIENT.Util.getPlayerNames(player.batsman.fullName);
		player.batsman.firstName = playerNames.firstName;
		player.batsman.lastName = playerNames.secondName
	}
	var playerNames = PULSE.CLIENT.Util.getPlayerNames(this.entry.bowlerSummary.bowler.fullName);
	this.entry.bowlerSummary.bowler.firstName = playerNames.firstName;
	this.entry.bowlerSummary.bowler.lastName = playerNames.secondName;
	this.entry.bowlerSummary.team = this.parent.match.getTeamByPlayerId(this.entry.bowlerSummary.bowler.id);
	this.entry.overSummary = this.parent.match.getOver(this.innings - 1, this.over - 1);
	this.entry.matchSummary = this.getMatchSummary();
	if (this.selectedBall > -1) {
		var ball = this.getBallEntry(this.selectedBall);
		if (ball) this.entry.selectedBall = ball.getHTML()
	}
	return this.entry
};
PULSE.CLIENT.CRICKET.MC.Comms.EndOfOver.prototype.getMatchSummary = function() {
	var teamName = this.entry.team ? this.entry.team.shortName || this.entry.team.fullName : "";
	if (typeof this.entry.projectedScore !== "undefined" && this.entry.projectedScore > -1) {
		var runRate = this.entry.inningsRuns * 6 / this.entry.inningsBalls;
		var decimals = runRate - (this.entry.inningsRuns - this.entry.inningsRuns % 6);
		if (decimals.toString().length > 4) runRate = runRate.toFixed(2);
		return "Projected score for " + teamName + ": " + this.entry.projectedScore + " @ " + runRate + " RPO"
	} else if (typeof this.entry.requiredRuns !== "undefined" && this.entry.requiredRuns > -1) return teamName + " require " + this.entry.requiredRuns + " off " + (this.entry.inningsMaxBalls - this.entry.inningsBalls) + " balls";
	return ""
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.Tweet = function(entry, parent) {
	PULSE.CLIENT.CRICKET.MC.Comms.Entry.call(this, entry, parent);
	this.active = true;
	this.template = parent.templates.tweet
};
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype);
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Comms.Tweet;
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype.isEqual = function() {
	return true
};
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype.getModel = function() {
	var model = PULSE.CLIENT.Twitter.getTweetModel(this.entry.tweetjson);
	model.localTime = (new Date(this.entry.timestamp)).format("HH:MM");
	model.containsVine = this.containsVine();
	model.containsVideo = this.containsVideo();
	model.markup = this.entry.message.text;
	if (!model.containsVine && window.twttr && twttr.impressions && _.isFunction(twttr.impressions.logTweets)) twttr.impressions.logTweets([model.id], "pulse-cwc-mc-commentary");
	return model
};
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype.containsVideo = function() {
	var containsVideo = false,
		entities = this.entry.tweetjson.extended_entities;
	if (entities && entities.media && entities.media.length) _.each(entities.media, function(entity, i) {
		if (entity.type === "video") containsVideo = true
	});
	return containsVideo
};
PULSE.CLIENT.CRICKET.MC.Comms.Tweet.prototype.containsVine = function() {
	var containsVine = false,
		entities = this.entry.tweetjson.entities;
	if (entities && entities.urls && entities.urls.length) _.each(entities.urls, function(url, i) {
		if (url.expanded_url.indexOf("vine.co/v/") > -1) containsVine = true
	});
	return containsVine
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Comms) PULSE.CLIENT.CRICKET.MC.Comms = {};
PULSE.CLIENT.CRICKET.MC.Comms.Video = function(entry, parent) {
	PULSE.CLIENT.CRICKET.MC.Comms.Entry.call(this, entry, parent);
	this.active = true;
	this.template = parent.templates.video
};
PULSE.CLIENT.CRICKET.MC.Comms.Video.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Comms.Entry.prototype);
PULSE.CLIENT.CRICKET.MC.Comms.Video.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Comms.Video;
PULSE.CLIENT.CRICKET.MC.Comms.Video.prototype.isEqual = function() {
	return true
};
PULSE.CLIENT.CRICKET.MC.Comms.Video.prototype.getModel = function() {
	var model = this.entry;
	model.localTime = (new Date(this.entry.timestamp)).format("HH:MM");
	model.date = dateFormat(new Date(this.entry.publishDate), "dd mmmm yyyy");
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.Main = function($container, match) {
	this.$container = $container;
	this.match = match;
	this.cards = [];
	this.storedCards = {};
	this.cardTypes = ["mostRunsTournament", "mostWicketsTournament", "bestBattingStrikeRateTournament", "bestBowlingFiguresTournament", "mostSixesTournament", "mostFoursTournament", "mostRunsAllTime", "highestScoresAllTime", "bestEconomyTournament", "bestEconomyAllTime", "mostWicketsAllTime", "bestBowlingFiguresAllTime", "standings"];
	this.current = undefined;
	this.setSubscriptions();
	if (this.match.scoringData) this.init()
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId)
			if (!that.initialised || that.matchState !== that.match.getMatchState()) that.init()
	});
	$("body").on("match/event", function(e, params) {
		that.pushCard(true, params.type, params)
	});
	this.$container.on("card/expired", function(e, params) {
		console.log("card expired: " + params.card.name);
		that.switchCards()
	});
	this.$container.on("card/about-to-expire", function(e, params) {
		console.log("card about to expire: " + params.card.name);
		if (params.card instanceof PULSE.CLIENT.CRICKET.MC.Insights.EventCard && that.paused) {
			console.log("card preparing: " + that.paused.name + " (from pause)");
			that.paused.prepare()
		} else if (that.cards.length > 1) {
			console.log("card preparing: " + that.cards[1].name);
			that.cards[1].prepare()
		}
	});
	this.$container.on("card/paused", function(e, params) {
		console.log("card paused: " + params.card.name);
		this.paused = params.card
	});
	this.$container.on("card/ready", function(e, params) {
		console.log("card ready: " + params.card.name)
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.init = function() {
	this.matchState = this.match.getMatchState();
	var availableCards = this.filterCards([].concat(this.cardTypes));
	if (availableCards.length) {
		if (!this.current) {
			var index = Math.floor(Math.random() * (availableCards.length - 1));
			var cardName = availableCards[index];
			var $container = $('\x3cdiv class\x3d"insights-card" data-name\x3d"' + cardName + '"\x3e\x3c/div\x3e');
			this.$container.html($container);
			this.setCurrentCard(this.makeCard($container, cardName));
			availableCards.splice(index, 1)
		} else {
			var index = _.indexOf(availableCards, this.current.name);
			if (-1 < index) availableCards.splice(index, 1)
		}
		var that = this;
		this.cards = [this.current].concat(_.map(_.shuffle(availableCards), function(name) {
			var $container;
			if (that.storedCards[name]) $container = that.storedCards[name].$container;
			else $container = $('\x3cdiv class\x3d"insights-card" data-name\x3d"' + name + '"\x3e\x3c/div\x3e');
			that.current.$container.after($container);
			return that.makeCard($container, name)
		}));
		this.initialised = true
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.pushCard = function(immediate, name, options) {
	var $container = $('\x3cdiv class\x3d"insights-card" style\x3d"display:none;"\x3e\x3c/div\x3e');
	this.current.$container.after($container);
	var newCard = this.makeCard($container, name, options);
	if (immediate && !(this.current instanceof PULSE.CLIENT.CRICKET.MC.Insights.EventCard)) {
		this.current.pauseTimer();
		this.setCurrentCard(newCard)
	} else {
		var cardIndex = this.getCurrentCardIndex();
		this.cards.splice(cardIndex + 1, 0, newCard)
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.getCurrentCardIndex = function() {
	for (var i = 0, iLimit = this.cards.length; i < iLimit; i++) {
		var card = this.cards[i];
		if (this.current.name === card.name) return i
	}
	return -1
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.switchCards = function() {
	console.log("cards left " + this.cards.length);
	if (this.paused && this.isValid(this.paused.name)) this.setCurrentCard(this.paused);
	else {
		if (this.cards.length <= 1) this.init();
		this.cards.shift();
		this.setCurrentCard(this.cards[0])
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.setCurrentCard = function(card) {
	var now = new Date;
	console.log("current insights card: " + card.name + " @ " + dateFormat(now, "HH:MM:ss"));
	if (this.current) {
		this.current.deactivate();
		this.current.$container.hide()
	}
	this.current = card;
	this.current.activate();
	this.current.publish();
	this.current.$container.show();
	this.current.startTimer()
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.makeCard = function($container, name, options) {
	if (this.storedCards[name]) {
		this.storedCards[name].reset();
		return this.storedCards[name]
	}
	switch (name) {
		case "mostRunsTournament":
			this.storedCards["mostRunsTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "MostRuns", "tournament", false);
			return this.storedCards["mostRunsTournament"];
		case "mostRunsAllTime":
			this.storedCards["mostRunsAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "MostRuns", "all-time", false);
			return this.storedCards["mostRunsAllTime"];
		case "mostWicketsTournament":
			this.storedCards["mostWicketsTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard($container, this, name, "MostWickets", "tournament", false);
			return this.storedCards["mostWicketsTournament"];
		case "mostWicketsAllTime":
			this.storedCards["mostWicketsAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard($container, this, name, "MostWickets", "all-time", false);
			return this.storedCards["mostWicketsAllTime"];
		case "mostSixesTournament":
			this.storedCards["mostSixesTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "MostSixes", "tournament", false);
			return this.storedCards["mostSixesTournament"];
		case "highestScoresAllTime":
			this.storedCards["highestScoresAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "HighestScores", "all-time", false);
			return this.storedCards["highestScoresAllTime"];
		case "mostFoursTournament":
			this.storedCards["mostFoursTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "MostFours", "tournament", false);
			return this.storedCards["mostFoursTournament"];
		case "bestBattingStrikeRateTournament":
			this.storedCards["bestBattingStrikeRateTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "BestBattingStrikeRate", "tournament", false);
			return this.storedCards["bestBattingStrikeRateTournament"];
		case "bestBattingStrikeRateAllTime":
			this.storedCards["bestBattingStrikeRateAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "BestBattingStrikeRate", "all-time", false);
			return this.storedCards["bestBattingStrikeRateAllTime"];
		case "bestEconomyTournament":
			this.storedCards["bestEconomyTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard($container, this, name, "BestEconomy", "tournament", false);
			return this.storedCards["bestEconomyTournament"];
		case "bestEconomyAllTime":
			this.storedCards["bestEconomyAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard($container, this, name, "BestEconomy", "all-time", false);
			return this.storedCards["bestEconomyAllTime"];
		case "bestBowlingFiguresTournament":
			this.storedCards["bestBowlingFiguresTournament"] = new PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard($container, this, name, "BestBowling", "tournament", true);
			return this.storedCards["bestBowlingFiguresTournament"];
		case "bestBowlingFiguresAllTime":
			this.storedCards["bestBowlingFiguresAllTime"] = new PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard($container, this, name, "BestBowling", "all-time", true);
			return this.storedCards["bestBowlingFiguresAllTime"];
		case "new-batsman":
			return new PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard($container, this, options);
		case "nextMatch":
			return new PULSE.CLIENT.CRICKET.MC.Insights.NextMatchCard($container, this, this.match);
		case "partnership":
			return new PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard($container, this, options);
		case "player-score":
			return new PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard($container, this, options);
		case "standings":
			this.storedCards["standings"] = new PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard($container, this);
			return this.storedCards["standings"];
		case "wicket":
			return new PULSE.CLIENT.CRICKET.MC.Insights.WicketCard($container, this, options);
		case "worms":
			return new PULSE.CLIENT.CRICKET.MC.Insights.WormsCard($container, this);
		default:
			return
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.filterCards = function(cardNames) {
	var that = this;
	return $.grep(cardNames, function(cardName) {
		return that.isValid(cardName)
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.isValid = function(cardName) {
	switch (cardName) {
		case "mostRunsAllTime":
		case "mostWicketsAllTime":
		case "bestBattingStrikeRateAllTime":
		case "highestScoresAllTime":
		case "bestEconomyAllTime":
		case "bestBowlingFiguresAllTime":
			return this.canAddAllTimeTopStats();
		case "mostRunsTournament":
		case "mostWicketsTournament":
		case "bestBattingStrikeRateTournament":
		case "mostSixesTournament":
		case "mostFoursTournament":
		case "bestEconomyTournament":
		case "bestBowlingFiguresTournament":
			return this.canAddTopStats();
		case "nextMatch":
			return this.hasNextMatch();
		case "standings":
			return this.canAddStandings();
		case "worms":
			return this.hasUdsStats() && this.match.getMatchState() === "L" && this.match.getCurrentInningsIndex() > 0;
		case "new-batsman":
		case "partnership":
		case "player-score":
		case "wicket":
			return this.match.getMatchState() === "L" && !this.match.isInInningsBreak();
		default:
			return
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.canAddStandings = function() {
	var groupName = this.match.getGroupName().toLowerCase();
	var isKnockout = -1 < groupName.search("knockout") || -1 < groupName.search("playoff");
	return !isKnockout
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.canAddAllTimeTopStats = function() {
	return this.match.getTeamType(0) !== "w"
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.canAddTopStats = function() {
	var matchNumberString = _.last(this.match.matchId.split("-"));
	var matchNumber = parseInt(matchNumberString, 10);
	return !isNaN(matchNumber) && (matchNumber >= 2 && this.match.getMatchState() !== "U" || matchNumber < 2 && this.match.getMatchState() === "C")
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.hasNextMatch = function() {
	return true
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.hasUdsStats = function() {
	return true
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.activate = function() {
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.Insights.Main.prototype.deactivate = function() {
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.Card = function($container, parent) {
	this.CARD_LIFETIME = 20;
	this.name = "default";
	this.$container = $container;
	this.lifetime = this.timeLeft = this.CARD_LIFETIME;
	this.parent = parent;
	this.match = this.parent.match;
	this.urlFactory = this.match.urlGenerator;
	this.tournament = this.match.tournament;
	this.template = "templates/mc/insights/default.html";
	var that = this;
	this.options = {
		scaleColor: false,
		trackColor: "rgba(255,255,255,0.3)",
		barColor: "#ffffff",
		lineWidth: 2,
		animate: 300,
		lineCap: "butt",
		size: 30,
		onStop: function() {
			if (that.timeLeft <= 0) {
				that.expire();
				if (that.cardInterval) clearInterval(that.cardInterval)
			}
		}
	};
	var that = this;
	this.$container.on("click", ".countdown", function(e) {
		if ($(this).hasClass("paused")) {
			$(this).removeClass("paused");
			that.startTimer()
		} else {
			$(this).addClass("paused");
			that.pauseTimer(true)
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.reset = function() {
	this.timeLeft = this.lifetime
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.prepare = function() {};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.stopData = function() {};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.getModel = function() {};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.startTimer = function() {
	if (!this.initialised) {
		this.$timer.easyPieChart(this.options);
		this.timeLeft = this.lifetime;
		this.initialised = true
	} else console.log("resuming " + this.name + " with " + this.timeLeft + "s to go");
	this.animate = true;
	var that = this;
	this.cardInterval = setInterval(function() {
		if (that.timeLeft > 0 && that.animate) {
			that.timeLeft--;
			if (!document.visibilityState || document.visibilityState === "visible") that.setDuration(that.timeLeft);
			else if (that.timeLeft <= 0) {
				that.expire();
				clearInterval(that.cardInterval)
			}
		}
		if (that.timeLeft === 5) that.parent.$container.trigger("card/about-to-expire", {
			card: that
		})
	}, 1E3)
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.pauseTimer = function(pausedByUser) {
	if (this.cardInterval) clearInterval(this.cardInterval);
	if (this.timeLeft > this.lifetime / 3 || pausedByUser) {
		this.pause();
		return true
	} else {
		this.timeLeft = 0;
		return false
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.tick = function() {
	var now = new Date;
	if (now - this.animationStart >= 1E3) {
		this.timeLeft -= Math.floor((now - this.animationStart) / 1E3);
		this.animationStart = now;
		this.setDuration(this.timeLeft)
	}
	if (this.timeLeft > 0 && this.animate) this.request = window.requestAnimationFrame(this.tick.bind(this))
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.setDuration = function(time) {
	var percent = 100 - time * 100 / this.lifetime;
	if (!this.$timer.data("easyPieChart")) this.$timer.easyPieChart(this.options);
	this.$timer.data("easyPieChart").update(percent)
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.expire = function() {
	this.initialised = false;
	this.parent.$container.trigger("card/expired", {
		card: this
	});
	this.stopData()
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.pause = function() {
	this.parent.$container.trigger("card/paused", {
		card: this
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.ready = function() {
	this.isReady = true;
	this.parent.$container.trigger("card/ready", {
		card: this
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.publish = function(callback) {
	PULSE.CLIENT.Template.publish(this.template, this.$container, this.getModel(), function() {
		if (callback && _.isFunction(callback)) callback()
	});
	this.$timer = this.$container.find(".chart");
	var that = this;
	var $imgContainer = this.$container.find(".playerPhoto");
	if ($imgContainer.length > 0) $imgContainer.each(function() {
		that.urlFactory.setPlayerImageLoader($(this).attr("data-player-id"), "210", $(this), "png", that.match.isLimitedOvers())
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.activate = function() {
	this.active = true;
	this.animate = true;
	console.log(this.name + " activated");
	if (this.isReady) this.publish();
	else this.prepare()
};
PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.deactivate = function() {
	this.active = false;
	this.animate = false;
	this.pauseTimer();
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.EventCard = function($container, parent) {
	PULSE.CLIENT.CRICKET.MC.Insights.Card.call(this, $container, parent)
};
PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.EventCard;
PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype.publish = function() {
	var that = this;
	PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype.publish.call(this, function() {
		that.$container.find(".overlay").delay(500).fadeOut()
	})
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard = function($container, parent, name, type, scope, inningsScoped) {
	PULSE.CLIENT.CRICKET.MC.Insights.Card.call(this, $container, parent);
	this.name = name;
	this.type = type;
	this.scope = scope;
	this.inningsScoped = inningsScoped;
	this.limit = 7;
	this.template = "templates/mc/insights/leaders.html";
	this.match = this.parent.match;
	this.tournament = this.parent.match.tournament;
	this.tournamentGroupName = parent.match.matchId.search("cwc") > -1 ? "cwc" : "worldt20";
	this.allTimeStats = window.WidgetController.getTournamentByName(this.tournamentGroupName);
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard;
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.prepare = function() {
	if (this.scope === "tournament") this.tournament["get" + this.type + "Data"](true, true);
	else this.allTimeStats["get" + this.type + "Data"](true, true)
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("stats/update", function(e, params) {
		if ((params.tournamentName === that.tournament.tournamentName || params.tournamentName === that.tournamentGroupName) && params.statName === that.type) {
			that.hasStats = params.success;
			that.statType = params.statName;
			that.statDataName = params.url;
			if (that.active) that.publish();
			else that.ready()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.getGenericModel = function() {
	var model = {
		type: "default",
		title: "Top Stats",
		message: this.getMessage(),
		records: []
	};
	var stats = this.getFullDataArray();
	if (stats.statsArray.length)
		for (var i = 0; i < Math.min(stats.statsArray.length, this.limit); i++) {
			var record = stats.statsArray[i];
			model.records.push($.extend(true, {
				pos: i + 1
			}, record))
		}
	return model
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.getStatsArray = function(array, limit, p1, p2) {
	if (p1 && !p2) p2 = p1;
	else if (p2 && !p1) p1 = p2;
	else if (!p1 && !p2) return [];
	var aIndex = this.inArray(array, p1);
	var bIndex = this.inArray(array, p2);
	if (aIndex === -1 && bIndex > -1) aIndex = bIndex;
	else if (bIndex === -1 && aIndex > -1) bIndex = aIndex;
	else if (aIndex === -1 && bIndex === -1) return [];
	if (aIndex > bIndex) {
		var aux = aIndex;
		aIndex = bIndex;
		bIndex = aux
	}
	var diff = bIndex - aIndex;
	if (diff <= limit - 1) {
		var lowBuffer = Math.round((limit - diff) / 2);
		var lowIdx = Math.max(0, aIndex - lowBuffer);
		var highIdx = Math.min(array.length - 1, lowIdx + limit);
		var result = [];
		for (var i = lowIdx; i < highIdx; i++) {
			var record = array[i];
			var recordModel = $.extend(true, {
				pos: i + 1
			}, record);
			if (i === aIndex) recordModel.highlight = true;
			else if (i === bIndex) recordModel.highlight = true;
			result.push(recordModel)
		}
		return result
	} else {
		limit = limit - 1;
		var aSize = Math.round(limit / 2);
		var bSize = limit - aSize;
		var aPos = Math.round(aSize / 2) - 1;
		var bPos = Math.round(bSize / 2) - 1 + aSize;
		var aMin = aIndex - aPos;
		var aMax = aIndex + aSize - aPos;
		if (aMin < 0) {
			aMax += Math.abs(aMin);
			aMin = 0
		}
		var bMin = bIndex - (bPos - aSize);
		var bMax = bIndex + (bSize - (bPos - aSize));
		if (bMin - aMax <= 0) {
			bMax = bMax + bMin - aMax;
			bMin = aMax + 1
		}
		if (bMax > array.length - 1) {
			var overlap = bMax - (array.length - 1);
			if (bMin - aMax < overlap && aMin > overlap) {
				aMin -= overlap;
				aMax -= overlap;
				bMin -= overlap;
				bMax -= overlap
			} else {
				aMax -= Math.round(overlap / 2);
				bMin -= overlap - Math.round(overlap / 2);
				bMax -= overlap
			}
		}
		var result = [];
		for (var i = aMin; i < aMax; i++) {
			var record = array[i];
			var recordModel = $.extend(true, {
				pos: i + 1
			}, record);
			if (i === aIndex) recordModel.highlight = true;
			result.push(recordModel)
		}
		for (var i = bMin; i < bMax; i++) {
			var record = array[i];
			var recordModel = $.extend(true, {
				pos: i + 1
			}, record);
			if (i === bIndex) recordModel.highlight = true;
			result.push(recordModel)
		}
		return result
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.inArray = function(array, player) {
	for (var i = 0, iLimit = array.length; i < iLimit; i++) {
		var record = array[i];
		if (record.player.id === player.id) return i
	}
	return -1
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.getFullDataArray = function() {
	if (this.hasStats)
		if (this.scope === "tournament") return this.tournament.getModelArrayFor(this.type, this.statDataName, this.inningsScoped, {});
		else if (this.scope === "all-time") return this.allTimeStats.getModelArrayFor(this.type, this.statDataName, this.inningsScoped, {});
	return {
		statsArray: []
	}
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.getMessage = function() {
	var statLabel = "";
	switch (this.type) {
		case "MostRuns":
			statLabel = "Runs";
			break;
		case "MostWickets":
			statLabel = "Wickets";
			break;
		case "HighestScore":
		case "HighestScores":
			statLabel = "Highest Scores";
			break;
		case "BestBattingStrikeRate":
			statLabel = "Batting Strike Rates";
			break;
		case "MostSixes":
			statLabel = "6s";
			break;
		case "MostFours":
			statLabel = "4s";
			break;
		case "BestEconomy":
		case "BestBowlingEconomy":
			statLabel = "Economy";
			break;
		case "BestBowling":
		case "BestBowlingFigures":
			statLabel = "Bowling Figures";
			break;
		default:
			statLabel = ""
	}
	var group = this.tournamentGroupName === "cwc" ? "CWC" : "WT20";
	var shortName = this.parent.match.tournament.shortName || "Tournament";
	var suffix = this.scope === "all-time" ? "All Time " + group : shortName;
	return statLabel ? suffix + " " + statLabel : suffix
};
PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype.stopData = function() {
	if (this.scope === "tournament") this.tournament["stop" + this.type + "Data"](true);
	else this.allTimeStats["stop" + this.type + "Data"](false)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard = function($container, parent, name, type, scope, inningsScoped) {
	PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.call(this, $container, parent, name, type, scope, inningsScoped)
};
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard;
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard.prototype.getModel = function() {
	var model = {};
	if (this.match.getMatchState() === "U" && this.match.scoringData.matchInfo.battingOrder && this.match.getPlayingXI(this.match.scoringData.matchInfo.battingOrder[0])) {
		model = this.getBattingTeamModel(0);
		if (model.records.length < 2) model = this.getGenericModel()
	} else if (this.match.getMatchState() === "L" && this.match.isInInningsBreak() === false && (this.match.getCurrentFacingBatsman() || this.match.getCurrentNonFacingBatsman())) {
		model = this.getCurrentBatsmenModel();
		if (model.records.length === 0) model = this.getGenericModel()
	} else if (this.match.getMatchState() === "L" && this.match.isInInningsBreak() === true) {
		model = this.getBattingTeamModel(this.match.getCurrentInningsIndex() + 1);
		if (model.records.length < 2) model = this.getGenericModel()
	} else model = this.getGenericModel();
	return model
};
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard.prototype.getCurrentBatsmenModel = function() {
	var model = {
		type: "current-batsmen",
		title: "At the Crease",
		message: this.getMessage(),
		records: []
	};
	var stats = this.getFullDataArray();
	if (stats.statsArray.length) {
		var striker = this.match.getCurrentFacingBatsman();
		var nonStriker = this.match.getCurrentNonFacingBatsman();
		model.records = this.getStatsArray(stats.statsArray, this.limit, striker, nonStriker)
	}
	return model
};
PULSE.CLIENT.CRICKET.MC.Insights.BattingLeadersCard.prototype.getBattingTeamModel = function(index) {
	var model = {
		type: "team",
		title: "Coming to Bat",
		message: this.getMessage(),
		records: []
	};
	var stats = this.getFullDataArray();
	var playingXI = this.match.getPlayingXI(this.match.scoringData.matchInfo.battingOrder[index]);
	if (stats.statsArray.length) statsLoop: for (var i = 0, iLimit = stats.statsArray.length; i < iLimit; i++) {
		var record = stats.statsArray[i];
		for (var j = 0, jLimit = playingXI.players.length; j < jLimit; j++) {
			var player = playingXI.players[j];
			if (player.id == record.player.id) {
				model.records.push($.extend(true, {
					pos: i + 1
				}, record));
				if (model.records.length === this.limit) break statsLoop
			}
		}
	}
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard = function($container, parent, name, type, scope, inningsScoped) {
	PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.call(this, $container, parent, name, type, scope, inningsScoped)
};
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.LeadersCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard;
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard.prototype.getModel = function() {
	var model = {};
	if (this.match.getMatchState() === "U" && this.match.scoringData.matchInfo.battingOrder && this.match.getPlayingXI(this.match.scoringData.matchInfo.battingOrder[1])) {
		model = this.getBowlingTeamModel(0);
		if (model.records.length < 2) model = this.getGenericModel()
	} else if (this.match.getMatchState() === "L" && this.match.isInInningsBreak() === false && this.match.getCurrentBowler()) {
		model = this.getCurrentBowlerModel();
		if (model.records.length === 0) model = this.getGenericModel()
	} else if (this.match.getMatchState() === "L" && this.match.isInInningsBreak() === true) {
		model = this.getBowlingTeamModel(this.match.getCurrentInningsIndex() + 1);
		if (model.records.length < 2) model = this.getGenericModel()
	} else model = this.getGenericModel();
	return model
};
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard.prototype.getCurrentBowlerModel = function() {
	var bowler = this.match.getCurrentBowler();
	var model = {
		type: "current-bowler",
		title: "Bowling Now",
		message: this.getMessage(),
		records: []
	};
	var stats = this.getFullDataArray();
	if (stats.statsArray.length) model.records = this.getStatsArray(stats.statsArray, 7, bowler);
	return model
};
PULSE.CLIENT.CRICKET.MC.Insights.BowlingLeadersCard.prototype.getBowlingTeamModel = function(innsIdx) {
	var model = {
		type: "team",
		title: "Coming to Bowl",
		message: this.getMessage(),
		records: []
	};
	var stats = this.getFullDataArray();
	var playingXI = this.match.getPlayingXI(Math.abs(1 - this.match.scoringData.matchInfo.battingOrder[innsIdx]));
	if (stats.statsArray.length) statsLoop: for (var i = 0, iLimit = stats.statsArray.length; i < iLimit; i++) {
		var record = stats.statsArray[i];
		for (var j = 0, jLimit = playingXI.players.length; j < jLimit; j++) {
			var player = playingXI.players[j];
			if (player.id == record.player.id) {
				model.records.push($.extend(true, {
					pos: i + 1
				}, record));
				if (model.records.length === this.limit) break statsLoop
			}
		}
	}
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.NextMatchCard = function($container, parent, match) {
	this.match = match;
	PULSE.CLIENT.CRICKET.MC.Insights.Card.call(this, $container, parent);
	this.name = "nextMatch";
	this.template = "templates/mc/insights/next-match.html"
};
PULSE.CLIENT.CRICKET.MC.Insights.NextMatchCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.NextMatchCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.NextMatchCard;
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard = function($container, parent, newBatsmanEvent) {
	PULSE.CLIENT.CRICKET.MC.Insights.EventCard.call(this, $container, parent);
	this.name = "new-batsman";
	this.id = newBatsmanEvent.playerId;
	this.template = "templates/mc/insights/new-batsman.html";
	this.tournament = this.parent.match.tournament;
	this.setSubscriptions();
	this.tournament.getPlayerCareerStatsData(this.id, true)
};
PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard;
PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("playerCareerStats/update", function(e, params) {
		if (params.success && params.playerId == that.id)
			if (that.active) that.publish();
			else that.ready()
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.NewBatsmanCard.prototype.getModel = function() {
	var currentInnings = _.last(this.match.scoringData.innings);
	var batsman = this.match.getBatsmanModel(true, this.id);
	var score = this.match.getCurrentScore();
	var overProgress = currentInnings.overProgress;
	var matchType = this.match.getMatchType();
	var model = {
		batsman: batsman,
		score: score,
		matchType: matchType,
		battingStats: undefined,
		bowlingStats: undefined,
		overProgress: overProgress
	};
	if (this.tournament.playerCareerStatsData[this.id]) {
		var stats = this.tournament.playerCareerStatsData[this.id][matchType];
		model.battingStats = stats.battingStats;
		model.bowlingStats = stats.bowlingStats
	}
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard = function($container, parent, partnershipEvent) {
	PULSE.CLIENT.CRICKET.MC.Insights.EventCard.call(this, $container, parent);
	this.name = "partnership";
	this.milestone = partnershipEvent.count;
	this.template = "templates/mc/insights/partnership.html"
};
PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard;
PULSE.CLIENT.CRICKET.MC.Insights.PartnershipCard.prototype.getModel = function() {
	var partnership = this.match.getCurrentPartnership();
	var striker = this.match.getCurrentFacingBatsman();
	var nonStriker = this.match.getCurrentNonFacingBatsman();
	var battingTeam = this.match.teamIsBatting(0) ? this.match.getTeam(0) : this.match.getTeam(1);
	var score = this.match.getCurrentScore();
	var currentInnings = _.last(this.match.scoringData.innings);
	return {
		partnership: partnership,
		milestone: this.milestone,
		score: score,
		overProgress: currentInnings.overProgress,
		battingTeam: battingTeam,
		striker: striker,
		nonStriker: nonStriker
	}
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard = function($container, parent, scoreEvent) {
	PULSE.CLIENT.CRICKET.MC.Insights.EventCard.call(this, $container, parent);
	this.name = "player-score";
	this.id = scoreEvent.playerId;
	this.milestone = scoreEvent.count;
	this.template = "templates/mc/insights/player-score.html"
};
PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard;
PULSE.CLIENT.CRICKET.MC.Insights.PlayerScoreCard.prototype.getModel = function() {
	var currentInnings = _.last(this.match.scoringData.innings);
	var model = {
		batsman: this.match.getBatsmanModel(true, this.id),
		score: this.match.getCurrentScore(),
		overProgress: currentInnings.overProgress,
		milestone: this.milestone
	};
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard = function($container, parent) {
	PULSE.CLIENT.CRICKET.MC.Insights.Card.call(this, $container, parent);
	this.name = "standings";
	this.tournament = this.parent.match.tournament;
	this.template = "templates/mc/insights/standings.html";
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard;
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard.prototype.prepare = function() {
	if (this.tournament.standingsData.length === 0 || this.matchState !== this.match.getMatchState()) {
		this.tournament.getGroupStandings(true);
		this.matchState = this.match.getMatchState()
	} else this.ready()
};
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("standings/update", function(e, params) {
		if (params.success && params.tournamentName === that.tournament.tournamentName)
			if (that.active) that.publish();
			else that.ready()
	})
};
PULSE.CLIENT.CRICKET.MC.Insights.StandingsCard.prototype.getModel = function() {
	var groupName = this.match.getGroupName();
	var model = this.tournament.getStandingsModelByGroupName(groupName);
	var teamA = this.match.getFullName(0);
	var teamB = this.match.getFullName(1);
	return {
		group: model,
		teamA: teamA,
		teamB: teamB
	}
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.WicketCard = function($container, parent, wicketEvent) {
	PULSE.CLIENT.CRICKET.MC.Insights.EventCard.call(this, $container, parent);
	this.name = "wicket";
	this.id = wicketEvent.playerId;
	this.template = "templates/mc/insights/wicket.html"
};
PULSE.CLIENT.CRICKET.MC.Insights.WicketCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.EventCard.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.WicketCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.WicketCard;
PULSE.CLIENT.CRICKET.MC.Insights.WicketCard.prototype.getModel = function() {
	var currentInnings = _.last(this.match.scoringData.innings);
	var batsman = this.match.getBatsmanModel(true, this.id);
	var score = this.match.getCurrentScore();
	var overProgress = currentInnings.overProgress;
	var model = {
		batsman: batsman,
		score: score,
		overProgress: overProgress
	};
	return model
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
if (!PULSE.CLIENT.CRICKET.MC.Insights) PULSE.CLIENT.CRICKET.MC.Insights = {};
PULSE.CLIENT.CRICKET.MC.Insights.WormsCard = function($container, parent) {
	PULSE.CLIENT.CRICKET.MC.Insights.Card.call(this, $container, parent);
	this.name = "worms";
	this.template = "templates/mc/insights/worms.html"
};
PULSE.CLIENT.CRICKET.MC.Insights.WormsCard.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Insights.Card.prototype);
PULSE.CLIENT.CRICKET.MC.Insights.WormsCard.prototype.constructor = PULSE.CLIENT.CRICKET.MC.Insights.WormsCard;
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.OverviewTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.matchState = undefined;
	this.components = {};
	this.initComponent("commentary");
	this.initComponent("matchDetails");
	this.states = {
		upcoming: ["matchDetails", "commentary", "preMatchTeams", "overviewVideos", "insights"],
		live: ["matchDetails", "commentary", "inPlay", "overSummary", "overviewTeams", "overviewVideos", "insights", "inningsBreak"],
		complete: ["postMatchReactions", "matchDetails", "commentary", "overviewTeams", "overviewVideos", "insights"]
	};
	if (this.match.tournament && this.match.tournament.mcDefaults && this.match.tournament.mcDefaults.overviewStates) this.states = this.match.tournament.mcDefaults.overviewStates;
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.matchState !== that.match.getMatchState()) {
			that.update();
			that.matchState = that.match.getMatchState()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.update = function() {
	if (this.active) switch (this.match.getMatchState()) {
		case "U":
			this.setUpcoming();
			break;
		case "L":
			this.setLive();
			break;
		case "C":
			this.setComplete();
			break
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.setUpcoming = function() {
	var otherComponents = [].concat(this.states.live, this.states.complete);
	this.deactivateComponents(_.difference(otherComponents, this.states.upcoming));
	for (var i = 0, iLimit = this.states.upcoming.length; i < iLimit; i++) {
		var componentName = this.states.upcoming[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.setLive = function() {
	var otherComponents = [].concat(this.states.upcoming, this.states.complete);
	this.deactivateComponents(_.difference(otherComponents, this.states.live));
	for (var i = 0, iLimit = this.states.live.length; i < iLimit; i++) {
		var componentName = this.states.live[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.setComplete = function() {
	var otherComponents = [].concat(this.states.live, this.states.upcoming);
	this.deactivateComponents(_.difference(otherComponents, this.states.complete));
	for (var i = 0, iLimit = this.states.complete.length; i < iLimit; i++) {
		var componentName = this.states.complete[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.initComponent = function(name) {
	switch (name) {
		case "commentary":
			var templates = {
				auto: "templates/wt20/mc/commentary/auto.html",
				manual: "templates/wt20/mc/commentary/manual.html",
				eov: "templates/wt20/mc/commentary/eov.html",
				tweet: "templates/wt20/mc/commentary/tweet.html",
				video: "templates/wt20/mc/commentary/video.html",
				photo: "templates/wt20/mc/commentary/photo.html"
			};
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.Comms.Main(this.$container.find(".stream"), this.match, undefined, templates);
			break;
		case "headToHead":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.HeadToHead(this.$container.find(".headToHead"), this.match);
			break;
		case "inPlay":
			var templates = {
				bowler: "templates/wt20/mc/bowler-card.html",
				batsman: "templates/wt20/mc/batsman-card.html"
			};
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.InPlay(this.$container.find(".inPlay"), this.match, templates);
			break;
		case "inningsBreak":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.InningsBreak(this.$container.find(".inningsStats"), this.match);
			break;
		case "insights":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.Insights.Main(this.$container.find(".sapInsights"), this.match);
			break;
		case "matchDetails":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.MatchDetails(this.$container.find(".matchDetails"), this.match, true);
			break;
		case "overSummary":
			var templates = {
				summary: "templates/wt20/mc/over-summary.html"
			};
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.OverSummary(this.$container.find(".overSummary"), this.match, templates);
			break;
		case "overviewTeams":
			var templates = {
				team: "templates/wt20/mc/overview-team.html"
			};
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.OverviewTeams(this.$container.find(".playingXI.liveAndPost"), this.match, templates);
			break;
		case "overviewVideos":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.VideoLatest(this.$container.find(".matchVideos"), this.match);
			break;
		case "postMatchReactions":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.PostMatchReactions(this.$container.find(".reactions"), this.match);
			break;
		case "preMatchTeams":
			var templates = {
				team: "templates/wt20/mc/overview-team.html"
			};
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.OverviewTeams(this.$container.find(".playingXI.preMatch"), this.match, templates);
			break;
		case "tournamentTwitter":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.TournamentTwitter(this.$container.find(".tournamentTwitter"), this.match);
			break
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.deactivateComponents = function(nameArray) {
	for (var i = 0, iLimit = nameArray.length; i < iLimit; i++) {
		var name = nameArray[i];
		if (this.components[name]) this.components[name].deactivate()
	}
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.activate = function() {
	this.active = true;
	this.update();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.OverviewTab.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.DetailsTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		details: new PULSE.CLIENT.CRICKET.MC.MatchDetails(this.$container, match, false)
	}
};
PULSE.CLIENT.CRICKET.MC.DetailsTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.DetailsTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.DetailsTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.DetailsTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.HawkeyeTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.match.tournament);
	this.dm = PULSE.CLIENT.getDataManager();
	this.active = false;
	this.hawkeye = undefined;
	this.$container.addClass(match.tournament.tournamentName);
	var udsMetaUrl = this.urlGenerator.makeDataUrl("uds-meta", this.match.matchId);
	this.dm.addFeed("udsMeta", udsMetaUrl, 30, "onUdsMeta", [this]);
	this.dm.start(udsMetaUrl)
};
PULSE.CLIENT.CRICKET.MC.HawkeyeTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.HawkeyeTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.HawkeyeTab.prototype.onData = function(data, id) {
	if (id === "udsMeta") $('[data-tab\x3d"Hawk-Eye"]').removeClass("inactive")
};
PULSE.CLIENT.CRICKET.MC.HawkeyeTab.prototype.activate = function() {
	var that = this;
	if (!this.hawkeye) this.hawkeye = new PULSE.CLIENT.CRICKET.Hawkeye(that.$container, that.match);
	this.hawkeye.activate();
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.HawkeyeTab.prototype.deactivate = function() {
	if (this.hawkeye) this.hawkeye.deactivate();
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		scorecard: new PULSE.CLIENT.CRICKET.MC.InteractiveScorecard(this.$container, this.match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.match.scoringData && that.match.scoringData.innings && that.match.scoringData.innings.length) $('[data-tab\x3d"Scorecard"]').removeClass("inactive")
	})
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.InteractiveScorecardTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.MinimalTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.matchState = undefined;
	this.components = {};
	this.initComponent("commentary");
	this.initComponent("matchDetails");
	this.states = {
		upcoming: ["matchDetails", "preMatchTeams"],
		live: ["matchDetails", "inPlay", "overviewTeams", "scorecard"],
		complete: ["matchDetails", "overviewTeams", "scorecard"]
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.matchState !== that.match.getMatchState()) {
			that.update();
			that.matchState = that.match.getMatchState()
		}
	})
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.update = function() {
	if (this.active) switch (this.match.getMatchState()) {
		case "U":
			this.setUpcoming();
			break;
		case "L":
			this.setLive();
			break;
		case "C":
			this.setComplete();
			break
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.setUpcoming = function() {
	var otherComponents = [].concat(this.states.live, this.states.complete);
	this.deactivateComponents(_.difference(otherComponents, this.states.upcoming));
	for (var i = 0, iLimit = this.states.upcoming.length; i < iLimit; i++) {
		var componentName = this.states.upcoming[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.setLive = function() {
	var otherComponents = [].concat(this.states.upcoming, this.states.complete);
	this.deactivateComponents(_.difference(otherComponents, this.states.live));
	for (var i = 0, iLimit = this.states.live.length; i < iLimit; i++) {
		var componentName = this.states.live[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.setComplete = function() {
	var otherComponents = [].concat(this.states.live, this.states.upcoming);
	this.deactivateComponents(_.difference(otherComponents, this.states.complete));
	for (var i = 0, iLimit = this.states.complete.length; i < iLimit; i++) {
		var componentName = this.states.complete[i];
		if (!this.components[componentName]) this.initComponent(componentName);
		if (this.components[componentName]) this.components[componentName].activate()
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.initComponent = function(name) {
	switch (name) {
		case "inPlay":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.InPlay(this.$container.find(".inPlay"), this.match);
			break;
		case "matchDetails":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.MatchDetails(this.$container.find(".matchDetails"), this.match);
			break;
		case "preMatchTeams":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.OverviewTeams(this.$container.find(".playingXI.preMatch"), this.match);
			break;
		case "overviewTeams":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.OverviewTeams(this.$container.find(".playingXI.liveAndPost"), this.match);
			break;
		case "scorecard":
			this.components[name] = new PULSE.CLIENT.CRICKET.MC.Scorecard(this.$container.find(".scorecardContainer"), this.match);
			break
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.deactivateComponents = function(nameArray) {
	for (var i = 0, iLimit = nameArray.length; i < iLimit; i++) {
		var name = nameArray[i];
		if (this.components[name]) this.components[name].deactivate()
	}
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.activate = function() {
	this.active = true;
	this.update();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.MinimalTab.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.PhotosTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		photos: new PULSE.CLIENT.CRICKET.MC.Photos(this.$container, match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.PhotosTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.PhotosTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.PhotosTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/photos", function(e, params) {
		if (params.success) {
			var photos = that.match.getMatchPhotosModel();
			if (photos.photos.length) $('[data-tab\x3d"Photostream"]').removeClass("inactive")
		}
	})
};
PULSE.CLIENT.CRICKET.MC.PhotosTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.PhotosTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.ScorecardTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		scorecard: new PULSE.CLIENT.CRICKET.MC.Scorecard(this.$container, this.match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.ScorecardTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.ScorecardTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.ScorecardTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId && that.match.scoringData && that.match.scoringData.innings && that.match.scoringData.innings.length) $('[data-tab\x3d"Scorecard"]').removeClass("inactive")
	})
};
PULSE.CLIENT.CRICKET.MC.ScorecardTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.ScorecardTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.TeamsTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		teams: new PULSE.CLIENT.CRICKET.MC.TeamsFull(this.$container, this.match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.TeamsTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.TeamsTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.TeamsTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("squads/update", function(e, params) {
		if (params.success && params.tournamentName === that.match.tournament.tournamentName) $('[data-tab\x3d"Teams"]').removeClass("inactive")
	})
};
PULSE.CLIENT.CRICKET.MC.TeamsTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.TeamsTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MC) PULSE.CLIENT.CRICKET.MC = {};
PULSE.CLIENT.CRICKET.MC.VideoTab = function(name, $container, match) {
	this.tabName = name;
	this.$container = $container;
	this.match = match;
	this.active = false;
	this.components = {
		hero: new PULSE.CLIENT.CRICKET.MC.VideoHero(this.$container.find(".video-hero"), this.match),
		index: new PULSE.CLIENT.CRICKET.MC.VideoIndex(this.$container.find(".video-index"), this.match)
	};
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MC.VideoTab.prototype = Object.create(PULSE.CLIENT.CRICKET.MC.Tab);
PULSE.CLIENT.CRICKET.MC.VideoTab.prototype.getName = function() {
	return this.tabName
};
PULSE.CLIENT.CRICKET.MC.VideoTab.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/videos", function(e, params) {
		if (params.success) {
			var model = that.match.getMatchVideosModel();
			if (model.videos.length && !that.match.tournament.scorecardOnly) $('[data-tab\x3d"Video"]').removeClass("inactive")
		}
	})
};
PULSE.CLIENT.CRICKET.MC.VideoTab.prototype.activate = function() {
	_.each(this.components, function(component, name) {
		component.activate()
	});
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MC.VideoTab.prototype.deactivate = function() {
	_.each(this.components, function(component, name) {
		component.deactivate()
	});
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
PULSE.CLIENT.CRICKET.Poll = function(container, config, tournament) {
	if ($(container).hasClass("pulsePoll")) this.$container = $(container);
	else this.$container = $(container).find(".pulsePoll");
	this.tournament = tournament;
	this.config = config;
	this.dm = PULSE.CLIENT.getDataManager();
	var url = this.tournament.tournamentUrlGenerator.makePollDataUrl();
	this.url = this.config.url || url;
	if (!this.config.pollExists) {
		this.dm.addFeed(this.url, this.url, 0, "onPollCallback", [this]);
		this.dm.start(this.url)
	} else {
		this.$container.show();
		this.init()
	}
};
PULSE.CLIENT.CRICKET.Poll.prototype.onData = function(data, id) {
	if (id === this.url) {
		this.$container.show();
		this.init()
	}
};
PULSE.CLIENT.CRICKET.Poll.prototype.onError = function(id) {
	if (id === this.url) this.$container.remove()
};
PULSE.CLIENT.CRICKET.Poll.prototype.init = function() {
	if (this.tournament.fullName) this.$container.find(".event").text(this.tournament.fullName);
	if (this.tournament.shortName) this.$container.find(".poll-description").text("- " + this.tournament.shortName);
	this.poll = new PULSE.CLIENT.ICC.Poll(this.$container, {
		url: this.url
	}, this.tournament)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
PULSE.CLIENT.CRICKET.TournamentTwitter = function(container, config, tournament) {
	this.config = config;
	this.$container = $(container);
	this.tournament = tournament;
	this.$list = this.$container.find(".twitterList");
	this.$moreSocialButton = this.$container.find(".moreSocialButton");
	this.template = "templates/twitter/tweets.html";
	if (this.config) this.teamId = this.config["data-team-id"];
	if (this.tournament) {
		if (this.tournament.socialLink) {
			this.$moreSocialButton.attr("href", "/" + this.tournament.urlRoot + this.tournament.socialLink);
			this.$moreSocialButton.show()
		}
		if (this.tournament.twitterLists) this.list = this.tournament.twitterLists[0];
		else this.list = {
			name: this.tournament.tweetUser ? this.tournament.tweetUser.list : "icclist",
			account: this.tournament.tweetUser ? this.tournament.tweetUser.account : "icc",
			list: this.tournament.tweetUser ? this.tournament.tweetUser.list : "icclist"
		}
	}
	this.setSubscriptions();
	if (this.tournament && this.teamId) this.tournament.getSquads();
	else this.getTwitterInstance()
};
PULSE.CLIENT.CRICKET.TournamentTwitter.prototype.getTwitterInstance = function() {
	this.twitter = PULSE.CLIENT.getTwitterInstance();
	this.twitter.getList(this.list.name, {
		fileName: this.list.list,
		start: true,
		interval: 60
	})
};
PULSE.CLIENT.CRICKET.TournamentTwitter.prototype.getTeamTwitter = function() {
	var team = this.tournament.getTeamById(this.teamId);
	var teamName = team.team.shortName.replace(/\s+/g, "");
	var twitterName = (this.tournament.teamTwitterPrefix ? this.tournament.teamTwitterPrefix : "") + teamName.toLowerCase() + "_list";
	this.list = {
		name: twitterName,
		list: twitterName
	};
	this.getTwitterInstance()
};
PULSE.CLIENT.CRICKET.TournamentTwitter.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("twitter/list", function(e, params) {
		if (params.success && params.name === that.list.name) that.refreshList()
	});
	$("body").on("squads/update", function(e, params) {
		if (params.success && that.tournament.tournamentName === params.tournamentName && that.teamId) that.getTeamTwitter()
	})
};
PULSE.CLIENT.CRICKET.TournamentTwitter.prototype.refreshList = function() {
	var model = this.twitter.getTweetsListModel(this.list.name);
	PULSE.CLIENT.Template.publish(this.template, this.$list, model)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.Multiple = function(container, config, tournament) {
	this.$container = $(container);
	this.config = config;
	this.tournament = tournament;
	this.matchIds = this.config["data-match-id"].split(",");
	this.matchIds = $.map(this.matchIds, function(matchId) {
		return $.trim(matchId)
	});
	this.matchIds = $.grep(this.matchIds, function(matchId) {
		return typeof matchId !== "undefined" && matchId.length > 0
	});
	this.layoutTemplates = {
		wt20: {
			heroBase: "templates/match/wt20/hero/base.html",
			1: "templates/match/wt20/hero/layout-1x.html",
			2: "templates/match/wt20/hero/layout-2x.html",
			3: "templates/match/wt20/hero/layout-3x.html",
			4: "templates/match/wt20/hero/layout-4x.html"
		}
	};
	this.templates = this.getTemplates();
	var that = this;
	if (this.matchIds.length)
		if (this.templates[this.matchIds.length]) {
			this.setLayout(this.templates[this.matchIds.length]);
			this.$container.find(".match-hero").each(function(i, cont) {
				var singleConfig = {};
				$.extend(true, singleConfig, that.config, {
					"data-match-id": that.matchIds[i],
					"data-widget-type": that.config["data-widget-type"].replace("_multiple", "")
				});
				var tournament = that.tournament;
				if (!tournament) {
					var splitString = that.matchIds[i].split("-");
					if (splitString.length > 1) {
						splitString.pop();
						tournament = window.WidgetController.getTournamentByName(splitString.join("-"))
					}
				}
				window.WidgetController.initialiseWidget(cont, singleConfig, tournament)
			})
		}
};
PULSE.CLIENT.CRICKET.MatchHero.Multiple.prototype.getTemplates = function() {
	if (this.config["data-widget-type"].search("worldt20") > -1) return this.layoutTemplates["wt20"];
	return this.layoutTemplates
};
PULSE.CLIENT.CRICKET.MatchHero.Multiple.prototype.setLayout = function(template) {
	var model = {
		matchHtml: PULSE.CLIENT.Template.getHtml(this.templates.heroBase, {})
	};
	PULSE.CLIENT.Template.publish(template, this.$container, model)
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.Countdown = function(container, date, config) {
	this.$container = $(container);
	this.config = config;
	this.start_date = date;
	this.$countdown = this.$container;
	this.$days = this.$countdown.find(".days");
	this.$hours = this.$countdown.find(".hours");
	this.$minutes = this.$countdown.find(".minutes");
	this.$seconds = this.$countdown.find(".seconds");
	this.setCountdown()
};
PULSE.CLIENT.CRICKET.MatchHero.Countdown.prototype.setCountdown = function() {
	var that = this;
	this.refreshTime();
	this.refreshCountdown();
	this.liveRefresh = setInterval(function() {
		that.refreshTime();
		that.refreshCountdown()
	}, 1E3)
};
PULSE.CLIENT.CRICKET.MatchHero.Countdown.prototype.stopCountdown = function() {
	clearInterval(this.liveRefresh)
};
PULSE.CLIENT.CRICKET.MatchHero.Countdown.prototype.refreshTime = function() {
	var now = (new Date).getTime();
	var start = (new PULSE.CLIENT.DateUtil.parseDateTime(this.start_date)).getTime();
	var time_lasting = start - now;
	if (time_lasting <= 0) {
		this.days = "00";
		this.hours = "00";
		this.minutes = "00";
		this.seconds = "00";
		this.stopCountdown()
	} else {
		this.days = Math.floor(time_lasting / 1E3 / (60 * 60 * 24));
		if (this.config.hideDaysIfZero && this.days === 0) this.$days.hide();
		if (this.days < 10) this.days = "0" + this.days;
		var days_in_s = this.days * 60 * 60 * 24;
		this.hours = Math.floor((time_lasting / 1E3 - days_in_s) / (60 * 60));
		if (this.hours < 10) this.hours = "0" + this.hours;
		var hours_in_s = this.hours * 60 * 60;
		this.minutes = Math.floor((time_lasting / 1E3 - hours_in_s - days_in_s) / 60);
		if (this.minutes < 10) this.minutes = "0" + this.minutes;
		var minutes_in_s = this.minutes * 60;
		this.seconds = Math.floor(time_lasting / 1E3 - minutes_in_s - hours_in_s - days_in_s);
		if (this.seconds < 10) this.seconds = "0" + this.seconds
	}
};
PULSE.CLIENT.CRICKET.MatchHero.Countdown.prototype.refreshCountdown = function() {
	this.$days.html('\x3cspan class\x3d"number"\x3e' + this.days + '\x3c/span\x3e\x3cspan class\x3d"label"\x3eDay\x3c/span\x3e');
	this.$hours.html('\x3cspan class\x3d"number"\x3e' + this.hours + '\x3c/span\x3e\x3cspan class\x3d"label"\x3eHrs\x3c/span\x3e');
	this.$minutes.html('\x3cspan class\x3d"number"\x3e' + this.minutes + '\x3c/span\x3e\x3cspan class\x3d"label"\x3eMin\x3c/span\x3e');
	this.$seconds.html('\x3cspan class\x3d"number"\x3e' + this.seconds + '\x3c/span\x3e\x3cspan class\x3d"label"\x3eSec\x3c/span\x3e')
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.MatchSummary = function(container, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.$details = this.$container.find(".details");
	this.$info = this.$container.find(".matchInfo");
	this.$summary = this.$container.find(".summary");
	this.$follow = this.$container.find(".follow");
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MatchHero.MatchSummary.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) {
			that.refreshTopInfoBar();
			var url = HH && HH.Params ? HH.Params.baseUrl + that.match.getMatchLink() : "#";
			that.$follow.attr("href", url)
		}
	})
};
PULSE.CLIENT.CRICKET.MatchHero.MatchSummary.prototype.refreshTopInfoBar = function() {
	var that = this,
		model = this.match.getFullModel("dddd mmmm dS yyyy", "HH:MM"),
		matchState = model.matchState,
		matchNav, override, inningsBreakOverrideMessage, info = model.matchSummary;
	switch (matchState) {
		case "U":
			override = this.match.getInnsBreakOverride();
			info = override ? override : "Play Starts: " + model.formattedTimeZoneTime + " Local";
			model.matchSummary = model.matchDescription + ", " + model.venue.shortName;
			this.$container.addClass("preMatch").removeClass("postMatch");
			this.$follow.hide();
			this.$info.show();
			this.$summary.show();
			break;
		case "L":
			if (model.inningsBreak) {
				inningsBreakOverrideMessage = this.match.getInnsBreakOverride();
				model.matchSummary = inningsBreakOverrideMessage ? inningsBreakOverrideMessage : "Innings Break"
			}
			info = model.formattedTimeZoneDate + ", " + model.venue.shortName;
			this.$container.removeClass("preMatch").removeClass("postMatch");
			this.$follow.show();
			this.$info.show();
			this.$summary.show();
			break;
		case "C":
			model.matchDescription = model.matchDescription + ", " + model.venue.shortName;
			this.$container.removeClass("preMatch").addClass("postMatch");
			this.$follow.hide();
			this.$summary.hide();
			this.$info.hide();
			break
	}
	this.$summary.html(model.matchSummary);
	if (!this.initialised) {
		this.$details.html(model.matchDescription);
		this.$info.html(info);
		this.$summary.html(model.matchSummary);
		this.lastMatchSummary = model.matchSummary;
		this.initialised = true
	}
};
PULSE.CLIENT.CRICKET.MatchHero.MatchSummary.prototype.activate = function() {
	this.active = true;
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MatchHero.MatchSummary.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard = function(container, config, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.config = config;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.templates = {
		wt20: {
			live: "templates/match/wt20/hero/scoreboard-live.html",
			prematch: "templates/match/wt20/hero/scoreboard-prematch.html"
		},
		cwc: {
			live: "templates/match/hero_cwc/scoreboard-live.html",
			prematch: "templates/match/hero_cwc/scoreboard-prematch.html"
		},
		live: "templates/match/hero/scoreboard-live.html",
		prematch: "templates/match/hero/scoreboard-prematch.html"
	};
	this.template = this.getTemplates();
	this.setSubscriptions()
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.getTemplates = function() {
	if (this.config["data-widget-type"].search("cwc") > -1) return this.templates["cwc"];
	else if (this.config["data-widget-type"].search("worldt20") > -1) return this.templates["wt20"];
	else return this.templates
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.matchId) {
			that.refreshScoring();
			that.activate()
		}
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".twitterBtn", function() {
		var matchModel = that.match.getFullModel(),
			url = window.HH && HH.Params ? HH.Params.baseUrl + matchModel.matchLink : matchModel.matchLink,
			hashtag = $(this).attr("data-hashtag"),
			text = url + " " + hashtag;
		PULSE.CLIENT.TwitterController.tweetEvent("tweet", {
			text: text
		})
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.setBackground = function() {
	if (!this.hasSetBackground) {
		var model = this.match.getFullModel(),
			venueClass = model.venue.shortName.toLowerCase();
		this.$container.addClass(venueClass);
		this.hasSetBackground = true
	}
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.refreshScoring = function() {
	var that = this;
	var model = this.match.getFullModel();
	model.team1Captain = undefined;
	model.team2Captain = undefined;
	PULSE.CLIENT.Template.publish(model.matchState === "U" ? this.template.prematch : this.template.live, this.$container, model, function() {
		if (model.matchState === "U") that.initCountdown()
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.getTemplate = function() {
	if (this.match.getMatchState() === "U") return this.templates.prematch;
	else return this.templates.live
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.initCountdown = function() {
	var $countdownContainer = this.$container.find(".countdown"),
		model = this.match.getFullModel();
	if ($countdownContainer.length) this.countdown = new PULSE.CLIENT.CRICKET.MatchHero.Countdown(this.$container, model.matchDate, {
		hideDaysIfZero: true
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.activate = function() {
	this.active = true;
	this.refreshScoring();
	this.$container.show()
};
PULSE.CLIENT.CRICKET.MatchHero.Scoreboard.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest = function(container, config, match) {
	this.$container = $(container);
	this.matchId = match.matchId;
	this.match = match;
	this.config = config;
	this.tournament = this.match.tournament;
	this.urlFactory = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
	this.refreshOnActivation = false;
	this.limit = this.config.limit || 1;
	this.setSubscriptions();
	this.setEventListeners();
	this.templates = {
		cwc: {
			videoList: "templates/match/hero_cwc/video-latest.html"
		},
		wt20: {
			videoList: "templates/match/wt20/hero/video-latest.html"
		},
		videoList: "templates/match/hero/video-list.html"
	};
	this.template = this.getTemplates();
	if (this.$container.is(":visible")) {
		this.active = true;
		this.match.getMatchVideosData()
	}
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.getTemplates = function() {
	if (this.config["data-widget-type"].search("cwc") > -1) return this.templates["cwc"];
	else if (this.config["data-widget-type"].search("worldt20") > -1) return this.templates["wt20"];
	else return this.templates
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("match/videos", function(e, params) {
		if (params.success) {
			model = that.match.getMatchVideosModel();
			if (model.videos.length) that.hasVideos = true;
			if (that.active) that.refreshLatestVideos();
			else that.refreshOnActivation = true
		}
	})
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.setEventListeners = function() {
	var that = this;
	this.$container.on("click", ".videoWrapper", function(e) {
		e.preventDefault();
		that.goToMatchCentre()
	});
	this.$container.on("click", ".seeAll", function(e) {
		e.preventDefault();
		that.goToMatchCentre()
	})
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.goToMatchCentre = function() {
	var url = this.match.getMatchLink() + "?tab\x3dVideo";
	window.open(url, "_blank")
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.refreshLatestVideos = function() {
	var model = this.match.getMatchVideosModel();
	model.videoUrl = "http://www.icc-cricket.com/videos/media/id/";
	model.limit = this.limit;
	if (model.videos.length) {
		PULSE.CLIENT.Template.publish(this.template.videoList, this.$container, model);
		this.$container.show().parent().removeClass("noVideo").addClass("with-vid")
	}
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.activate = function() {
	this.active = true;
	if (this.refreshOnActivation) {
		this.refreshLatestVideos();
		this.refreshOnActivation = false
	}
	if (this.hasVideos) this.$container.show()
};
PULSE.CLIENT.CRICKET.MatchHero.VideoLatest.prototype.deactivate = function() {
	this.active = false;
	this.$container.hide()
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.MatchHero) PULSE.CLIENT.CRICKET.MatchHero = {};
PULSE.CLIENT.CRICKET.MatchHero.Main = function(container, config, tournament) {
	this.$container = $(container);
	this.config = config;
	this.tournament = tournament;
	this.matchId = this.config["data-match-id"];
	this.match = undefined;
	if (!this.tournament.getMatchById(this.matchId)) {
		this.match = new PULSE.CLIENT.CRICKET.Match(this.tournament, this.matchId);
		this.tournament.matches[this.matchId] = this.match
	} else this.match = this.tournament.getMatchById(this.matchId);
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator(this.tournament);
	this.match.startScoringFeed();
	this.components = {
		matchSummary: new PULSE.CLIENT.CRICKET.MatchHero.MatchSummary(this.$container.find(".matchSummary"), this.match),
		scoreboard: new PULSE.CLIENT.CRICKET.MatchHero.Scoreboard(this.$container.find(".scoreboardContainer"), this.config, this.match)
	};
	if (this.$container.data("video") !== false) this.components.videoLatest = new PULSE.CLIENT.CRICKET.MatchHero.VideoLatest(this.$container.find(".videoContainer"), this.config, this.match);
	this.setSubscriptions();
	this.setListeners();
	this.showGlobalContainer();
	if (this.match.hasScoringData()) this.update()
};
PULSE.CLIENT.CRICKET.MatchHero.Main.prototype.setSubscriptions = function() {
	var that = this;
	$("body").on("scoring/update", function(e, params) {
		if (params.success && params.matchId === that.match.matchId) that.update()
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Main.prototype.setListeners = function() {
	var that = this;
	this.$container.on("click", function(e) {
		if ($(window).width() < 500) {
			var matchLink = that.match.getMatchLink(),
				url = HH && HH.Params ? HH.Params.baseUrl + matchLink : matchLink;
			window.location.href = url
		}
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Main.prototype.update = function() {
	this.addMatchStateClass();
	_.each(this.components, function(component, name) {
		component.activate()
	})
};
PULSE.CLIENT.CRICKET.MatchHero.Main.prototype.addMatchStateClass = function() {
	var $matchHero = this.$container.find(".match-hero");
	if ($matchHero.length === 0) $matchHero = this.$container;
	$matchHero.removeClass("pre live post");
	var stateClass = "";
	switch (this.match.getMatchState()) {
		case "U":
			stateClass = "pre";
			break;
		case "L":
			stateClass = "live";
			break;
		case "C":
			stateClass = "post";
			break
	}
	$matchHero.addClass(stateClass)
};
PULSE.CLIENT.CRICKET.MatchHero.Main.prototype.showGlobalContainer = function() {
	$(".matchTakeover").show()
};
if (!PULSE) var PULSE = {};
PULSE.GraphProvider = function() {
	this.dbType = "UdsHawkeyeDatabase";
	this.resync()
};
PULSE.GraphProvider.prototype.setEnvironment = function(matchType, dbType) {
	PULSE.Tracer.info("setEnvironment matchType\x3d" + matchType + " dbType\x3d" + dbType);
	if (this.matchType !== matchType || this.dbType !== dbType) {
		this.matchType = matchType;
		this.dbType = dbType;
		this.resync()
	}
};
PULSE.GraphProvider.prototype.getAvailableGraphs = function() {
	return this.graphNames
};
PULSE.GraphProvider.prototype.current = function() {
	if (this.index >= this.graphNames.length || this.index < 0) return undefined;
	else return this.graphNames[this.index]
};
PULSE.GraphProvider.prototype.next = function() {
	this.index++;
	if (this.index >= this.graphNames.length) this.index = 0;
	return this.current()
};
PULSE.GraphProvider.prototype.previous = function() {
	this.index--;
	if (this.index < 0) this.index = this.graphNames.length - 1;
	return this.current()
};
PULSE.GraphProvider.prototype.currentGraphIdx = function() {
	var current = this.current();
	var available = this.getAvailableGraphs();
	for (var i = 0; i < available.length; i++) {
		var graph = available[i];
		if (graph === current) return i
	}
	return -1
};
PULSE.GraphProvider.prototype.graphIdxByName = function(name) {
	var available = this.getAvailableGraphs();
	for (var i = 0; i < available.length; i++) {
		var graph = available[i];
		if (graph === name) return i
	}
	return -1
};
PULSE.GraphProvider.prototype.resync = function() {
	this.graphNames = [];
	this.graphNames.push("Trajectory Viewer");
	this.index = this.index || this.graphNames.length - 1;
	this.graphNames.push("Wagon Wheel");
	this.graphNames.push("Pitch Map");
	this.graphNames.push("Beehive Placement");
	this.graphNames.push("Run Rate");
	this.graphNames.push("Bowl Speeds");
	this.graphNames.push("Pitch Map Mountain");
	this.graphNames.push("Speed Pitch Map");
	this.graphNames.push("Partnerships");
	this.graphNames.push("Variable Bounce");
	if (CricketMatchType.TEST !== this.matchType) {
		this.graphNames.push("Runs Per Over");
		this.graphNames.push("Worms")
	}
	if ("UdsHawkeyeDatabase" === this.dbType) this.graphNames.push("Win Likelihood");
	if (PULSE.Browser && PULSE.Browser.getExcludedGraphs) {
		var exclusions = PULSE.Browser.getExcludedGraphs();
		var newGraphs = [];
		for (var i = 0, ilimit = this.graphNames.length; i < ilimit; i++)
			if (!Utils.isInArray(exclusions, this.graphNames[i])) newGraphs.push(this.graphNames[i]);
		this.graphNames = newGraphs
	}
	PULSE.Tracer.info("Available graphs are now: " + this.graphNames)
};
PULSE.GraphProvider.prototype.syncTo = function(name) {
	for (var i = 0, j = this.graphNames.length; i < j; i++)
		if (name === this.graphNames[i]) {
			this.index = i;
			break
		}
};
PULSE.GraphProvider.prototype.getBestMatch = function(graphName) {
	var graphList = this.getAvailableGraphs();
	var name = PULSE.Levenshtein.bestMatch(graphList, graphName);
	return name
};
if (!PULSE) var PULSE = {};
PULSE.UdsTrajRecord = function(rawBp, rawData, playerLookup) {
	this.fields = rawData.split(",");
	this.bp = new PULSE.BallProgress(rawBp);
	this.traj = null;
	this.playerLookup = playerLookup
};
PULSE.UdsTrajRecord.prototype.satisfiesFilter = function(filter) {
	if (filter === undefined) return true;
	else {
		var inn = Utils.isNullish(filter.innings) || CricketFilter.ALL === filter.innings || this.get(CricketField.INNINGS) == filter.innings.toString();
		var over = Utils.isNullish(filter.over) || CricketFilter.ALL === filter.over || this.get(CricketField.OVER) == filter.over;
		var ball = Utils.isNullish(filter.ball) || CricketFilter.ALL === filter.ball || CricketFilter.ALLBALLS === filter.ball || this.get(CricketField.BALL) == filter.ball;
		if (inn && over && ball) {
			var lh = this.get(CricketField.HANDEDNESS) === CricketHandedness.LEFT;
			var ba = Utils.isNullish(filter.batsman) || CricketFilter.ALL === filter.batsman || CricketFilter.ALLBATSMEN === filter.batsman || !lh && CricketFilter.RIGHTHANDERS === filter.batsman || lh && CricketFilter.LEFTHANDERS === filter.batsman || this.get(CricketField.BATSMAN) === filter.batsman;
			var spin = this.get(CricketField.BOWLER_SPEED) === CricketBowlerSpeed.SPIN;
			var bo = Utils.isNullish(filter.bowler) || CricketFilter.ALL === filter.bowler || CricketFilter.ALLBOWLERS === filter.bowler || spin && CricketFilter.SPINBOWLERS === filter.bowler || !spin && CricketFilter.SEAMBOWLERS === filter.bowler || this.get(CricketField.BOWLER) === filter.bowler;
			return ba && bo
		}
		return false
	}
};
PULSE.UdsTrajRecord.prototype.get = function(field) {
	switch (field) {
		case CricketField.ID:
			return this.bp.description();
		case CricketField.INNINGS:
			return this.bp.innings;
		case CricketField.OVER:
			return this.bp.over;
		case CricketField.BALL:
			return this.bp.ball;
		case CricketField.COUNTING_BALL:
			return this.countingBall;
		case CricketField.IS_COUNTING:
			var et = this.fields[9];
			return et.length === 0 || "Lb" === et || "B" === et;
		case CricketField.BATSMAN:
			return this.playerLookup[this.fields[1]].fullName;
		case CricketField.NF_BATSMAN:
			return this.playerLookup[this.fields[2]].fullName;
		case CricketField.BOWLER:
			return this.playerLookup[this.fields[3]].fullName;
		case CricketField.BOWL_SPEED:
			return Number(this.fields[4]);
		case CricketField.DISMISSED:
			return this.playerLookup[this.fields[5]] ? this.playerLookup[this.fields[5]].fullName : "";
		case CricketField.IS_WICKET:
			return this.fields[5] !== "-1";
		case CricketField.MOD:
			return this.fields[6];
		case CricketField.RUNS:
			if (this.fields[7].length > 0) return this.fields[7];
			else return 0;
		case CricketField.CREDIT:
			return this.fields[8];
		case CricketField.EXTRA_TYPE:
			return this.fields[9];
		case CricketField.TRAJECTORY:
			if (this.traj === null) this.traj = PULSE.UdsTrajRecord.parseTrajectory(this.fields[10]);
			return this.traj
	}
};
PULSE.UdsTrajRecord.prototype.hasTrajData = function() {
	return !Utils.isNullish(this.fields[10])
};
PULSE.UdsTrajRecord.prototype.generateSummary = function(lowercase) {
	var summary = "";
	if (this.get(CricketField.IS_WICKET)) summary += lowercase ? "wicket " : "Wicket ";
	var runs = +this.get(CricketField.RUNS);
	if (runs > 0) {
		summary += runs + " run";
		if (runs > 1) summary += "s";
		var et = this.get(CricketField.EXTRA_TYPE);
		if (et.length > 0) summary += " (" + (lowercase ? et.toLowerCase() : et) + ")"
	}
	return summary
};
PULSE.UdsTrajRecord.prototype.generateDescription = function() {
	var description = "\x3cb\x3e";
	description += +this.get(CricketField.OVER) - 1;
	description += ".";
	description += this.get(CricketField.COUNTING_BALL);
	description += "\x3c/b\x3e ";
	description += this.get(CricketField.BOWLER);
	description += " to ";
	description += this.get(CricketField.BATSMAN);
	var speed = this.get(CricketField.BOWL_SPEED);
	if (!isNaN(speed) && speed >= 13 && speed <= 54) {
		description += ", ";
		if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) speed = PULSE.SpeedModeController.mpsToKmh(speed);
		description += speed.toFixed(1);
		description += " " + PULSE.SpeedModeController.unit
	}
	var credit = +this.get(CricketField.CREDIT);
	description += ", ";
	if (this.get(CricketField.IS_WICKET)) description += "wicket";
	else if (credit === 0) description += "dot ball";
	else {
		description += credit;
		description += " run";
		if (credit > 1) description += "s"
	}
	var ps = this.get(CricketField.PITCH_SEGMENT);
	if (!Utils.isNullish(ps) && !this.get(CricketField.IS_WICKET) && credit > 0) {
		description += ", hit ";
		description += CricketSegmentLookup[ps]
	}
	description += ".";
	return description
};
PULSE.UdsTrajRecord.parseTrajectory = function(encoded) {
	var decoded = Base64Decoder.decode(encoded);
	if (decoded.length < 72) {
		PULSE.Tracer.warn("Decoded traj length was " + decoded.length);
		return undefined
	}
	var traj = new CricketBallTrajectory;
	try {
		traj.bp = PULSE.UdsTrajRecord.readMulti(decoded, 0, 2);
		traj.bt = PULSE.UdsTrajRecord.readMulti(decoded, 8, 1).x;
		traj.a = PULSE.UdsTrajRecord.readMulti(decoded, 12, 3);
		traj.ebv = PULSE.UdsTrajRecord.readMulti(decoded, 24, 3);
		traj.obv = PULSE.UdsTrajRecord.readMulti(decoded, 36, 3);
		traj.oba = PULSE.UdsTrajRecord.readMulti(decoded, 48, 3);
		traj.bh = PULSE.UdsTrajRecord.readMulti(decoded, 60, 1).x;
		traj.trackApproved = true;
		var start = traj.getTimeAtX(18.5) + traj.bt;
		var end = traj.getTimeAtX(0) + traj.bt;
		traj.period = {
			start: start,
			end: end
		}
	} catch (exception) {
		PULSE.Tracer.error(exception);
		traj.trackApproved = false
	}
	return traj
};
PULSE.UdsTrajRecord.readMulti = function(data, offset, n) {
	var ret = {};
	if (n > 0) ret.x = PULSE.UdsTrajRecord.decodeFloat(data.substring(offset, offset + 4));
	if (n > 1) ret.y = PULSE.UdsTrajRecord.decodeFloat(data.substring(offset + 4, offset + 8));
	if (n > 2) ret.z = PULSE.UdsTrajRecord.decodeFloat(data.substring(offset + 8, offset + 12));
	return ret
};
PULSE.UdsTrajRecord.decodeFloat = function(data) {
	var sign = (data.charCodeAt(0) & 128) >> 7;
	var exponent = ((data.charCodeAt(0) & 127) << 1) + (data.charCodeAt(1) >> 7);
	var significand = 0;
	var bit = 23;
	var component = 1;
	var b;
	var mask;
	while (bit >= 0) {
		if (bit === 23) {
			b = data.charCodeAt(1) & 127 | 128;
			mask = 128
		} else if (bit === 15) {
			b = data.charCodeAt(2);
			mask = 128
		} else if (bit === 7) {
			b = data.charCodeAt(3);
			mask = 128
		}
		if ((mask & b) === mask) significand += component;
		component /= 2;
		mask = mask >> 1;
		bit--
	}
	return Math.pow(-1, sign) * Math.pow(2, exponent - 127) * significand
};
if (!PULSE) var PULSE = {};
PULSE.UdsStatsRecord = function(rawBp, rawData, playerLookup) {
	this.fields = rawData.split(",");
	this.bp = new PULSE.BallProgress(rawBp);
	this.traj = null;
	this.playerLookup = playerLookup
};
PULSE.UdsStatsRecord.prototype.satisfiesFilter = function(filter) {
	if (filter === undefined) return true;
	else {
		var inn = Utils.isNullish(filter.innings) || CricketFilter.ALL === filter.innings || this.get(CricketField.INNINGS) == filter.innings.toString();
		var over = Utils.isNullish(filter.over) || CricketFilter.ALL === filter.over || this.get(CricketField.OVER) == filter.over;
		var ball = Utils.isNullish(filter.ball) || CricketFilter.ALL === filter.ball || CricketFilter.ALLBALLS === filter.ball || this.get(CricketField.BALL) == filter.ball;
		if (inn && over && ball) {
			var lh = this.get(CricketField.HANDEDNESS) === CricketHandedness.LEFT;
			var ba = Utils.isNullish(filter.batsman) || CricketFilter.ALL === filter.batsman || CricketFilter.ALLBATSMEN === filter.batsman || !lh && CricketFilter.RIGHTHANDERS === filter.batsman || lh && CricketFilter.LEFTHANDERS === filter.batsman || this.get(CricketField.BATSMAN) === filter.batsman;
			var spin = this.get(CricketField.BOWLER_SPEED) === CricketBowlerSpeed.SPIN;
			var bo = Utils.isNullish(filter.bowler) || CricketFilter.ALL === filter.bowler || CricketFilter.ALLBOWLERS === filter.bowler || spin && CricketFilter.SPINBOWLERS === filter.bowler || !spin && CricketFilter.SEAMBOWLERS === filter.bowler || this.get(CricketField.BOWLER) === filter.bowler;
			return ba && bo
		}
		return false
	}
};
PULSE.UdsStatsRecord.prototype.get = function(field) {
	switch (field) {
		case CricketField.ID:
			return this.bp.description();
		case CricketField.INNINGS:
			return this.bp.innings;
		case CricketField.OVER:
			return this.bp.over;
		case CricketField.BALL:
			return this.bp.ball;
		case CricketField.COUNTING_BALL:
			return this.countingBall;
		case CricketField.IS_COUNTING:
			var et = this.fields[10];
			return et.length === 0 || "Lb" === et || "B" === et;
		case CricketField.BATSMAN:
			return this.playerLookup[this.fields[1]].fullName;
		case CricketField.NF_BATSMAN:
			return this.playerLookup[this.fields[2]].fullName;
		case CricketField.BOWLER:
			return this.playerLookup[this.fields[3]].fullName;
		case CricketField.BOWL_SPEED:
			return Number(this.fields[4]);
		case CricketField.DISMISSED:
			return this.playerLookup[this.fields[5]] ? this.playerLookup[this.fields[5]].fullName : "";
		case CricketField.IS_WICKET:
			return this.fields[5] !== "-1";
		case CricketField.MOD:
			return this.fields[6];
		case CricketField.RUNS:
			if (this.fields[7].length > 0) return this.fields[7];
			else return 0;
		case CricketField.CREDIT:
			return this.fields[8];
		case CricketField.DEBIT:
			return this.fields[9];
		case CricketField.EXTRA_TYPE:
			return this.fields[10];
		case CricketField.HAS_HANDEDNESS:
			return this.fields[11].length > 0;
		case CricketField.HANDEDNESS:
			return this.fields[11] === "y" ? CricketHandedness.RIGHT : CricketHandedness.LEFT;
		case CricketField.PITCHED:
			if (this.fields[12].length === 0) return undefined;
			return {
				x: this.fields[12],
				y: this.fields[13],
				z: 0
			};
		case CricketField.STUMPS:
			if (this.fields[14].length === 0) return undefined;
			return {
				x: 0,
				y: this.fields[14],
				z: this.fields[15]
			};
		case CricketField.WW:
			if (Utils.isNullish(this.fields[16]) || Utils.isNullish(this.fields[17])) return undefined;
			else return PULSE.UdsStatsRecord.covertWWToCoaching(this.fields[16], this.fields[17]);
		case CricketField.WIN_LIKELIHOODS:
			if (Utils.isNullish(this.fields[18])) return undefined;
			else return [+this.fields[18], +this.fields[19], +this.fields[20]]
	}
};
PULSE.UdsStatsRecord.prototype.hasTrajData = function() {
	return false
};
PULSE.UdsStatsRecord.prototype.generateSummary = function(lowercase) {
	var summary = "";
	if (this.get(CricketField.IS_WICKET)) summary += lowercase ? "wicket " : "Wicket ";
	var runs = +this.get(CricketField.RUNS);
	if (runs > 0) {
		summary += runs + " run";
		if (runs > 1) summary += "s";
		var et = this.get(CricketField.EXTRA_TYPE);
		if (et.length > 0) summary += " (" + (lowercase ? et.toLowerCase() : et) + ")"
	}
	return summary
};
PULSE.UdsStatsRecord.prototype.generateDescription = function() {
	var description = "\x3cb\x3e";
	description += +this.get(CricketField.OVER) - 1;
	description += ".";
	description += this.get(CricketField.COUNTING_BALL);
	description += "\x3c/b\x3e ";
	description += this.get(CricketField.BOWLER);
	description += " to ";
	description += this.get(CricketField.BATSMAN);
	var speed = this.get(CricketField.BOWL_SPEED);
	if (!isNaN(speed) && speed >= 13 && speed <= 54) {
		description += ", ";
		if (PULSE.SpeedModeController.mode === PULSE.SpeedModeController.MODE_KMH) speed = PULSE.SpeedModeController.mpsToKmh(speed);
		description += speed.toFixed(1);
		description += " " + PULSE.SpeedModeController.unit
	}
	var credit = +this.get(CricketField.CREDIT);
	description += ", ";
	if (this.get(CricketField.IS_WICKET)) description += "wicket";
	else if (credit === 0) description += "dot ball";
	else {
		description += credit;
		description += " run";
		if (credit > 1) description += "s"
	}
	var ps = this.get(CricketField.PITCH_SEGMENT);
	if (!Utils.isNullish(ps) && !this.get(CricketField.IS_WICKET) && credit > 0) {
		description += ", hit ";
		description += CricketSegmentLookup[ps]
	}
	description += ".";
	return description
};
PULSE.UdsStatsRecord.parseTrajectory = function(encoded) {
	var decoded = Base64Decoder.decode(encoded);
	if (decoded.length < 72) {
		PULSE.Tracer.warn("Decoded traj length was " + decoded.length);
		return undefined
	}
	var traj = new CricketBallTrajectory;
	try {
		traj.bp = PULSE.UdsStatsRecord.readMulti(decoded, 0, 2);
		traj.bt = PULSE.UdsStatsRecord.readMulti(decoded, 8, 1).x;
		traj.a = PULSE.UdsStatsRecord.readMulti(decoded, 12, 3);
		traj.ebv = PULSE.UdsStatsRecord.readMulti(decoded, 24, 3);
		traj.obv = PULSE.UdsStatsRecord.readMulti(decoded, 36, 3);
		traj.oba = PULSE.UdsStatsRecord.readMulti(decoded, 48, 3);
		traj.bh = PULSE.UdsStatsRecord.readMulti(decoded, 60, 1).x;
		traj.trackApproved = true;
		var start = traj.getTimeAtX(18.5) + traj.bt;
		var end = traj.getTimeAtX(0) + traj.bt;
		traj.period = {
			start: start,
			end: end
		}
	} catch (exception) {
		PULSE.Tracer.error(exception);
		traj.trackApproved = false
	}
	return traj
};
PULSE.UdsStatsRecord.readMulti = function(data, offset, n) {
	var ret = {};
	if (n > 0) ret.x = PULSE.UdsStatsRecord.decodeFloat(data.substring(offset, offset + 4));
	if (n > 1) ret.y = PULSE.UdsStatsRecord.decodeFloat(data.substring(offset + 4, offset + 8));
	if (n > 2) ret.z = PULSE.UdsStatsRecord.decodeFloat(data.substring(offset + 8, offset + 12));
	return ret
};
PULSE.UdsStatsRecord.decodeFloat = function(data) {
	var sign = (data.charCodeAt(0) & 128) >> 7;
	var exponent = ((data.charCodeAt(0) & 127) << 1) + (data.charCodeAt(1) >> 7);
	var significand = 0;
	var bit = 23;
	var component = 1;
	var b;
	var mask;
	while (bit >= 0) {
		if (bit === 23) {
			b = data.charCodeAt(1) & 127 | 128;
			mask = 128
		} else if (bit === 15) {
			b = data.charCodeAt(2);
			mask = 128
		} else if (bit === 7) {
			b = data.charCodeAt(3);
			mask = 128
		}
		if ((mask & b) === mask) significand += component;
		component /= 2;
		mask = mask >> 1;
		bit--
	}
	return Math.pow(-1, sign) * Math.pow(2, exponent - 127) * significand
};
PULSE.UdsStatsRecord.covertWWToCoaching = function(wwX, wwY) {
	var scaleX = 4.05;
	var scaleY = 3.45;
	var offsetX = -130.33;
	var offsetY = -163.64;
	return {
		x: wwY * scaleX + offsetX,
		y: wwX * scaleY + offsetY
	}
};

function Participant(team) {
	if (team) {
		this.fullName = team.fullName;
		this.shortName = team.shortName;
		this.abbreviation = team.abbreviation;
		this.primaryColor = "#" + team.primaryColor;
		this.secondaryColor = "#" + team.secondaryColor
	}
}
if (!PULSE) var PULSE = {};
PULSE.BallProgress = function(rawBp) {
	var fields = rawBp.split(".");
	this.innings = fields[0];
	this.over = fields[1];
	if (fields.length > 2) this.ball = fields[2]
};
PULSE.BallProgress.matches = function(raw) {
	return !Utils.isNullish(raw) && raw.match(/\d+\.\d+\.\d+/) !== null
};
PULSE.BallProgress.prototype.description = function() {
	return this.innings + "." + this.over + "." + this.ball
};
PULSE.BallProgress.prototype.compareTo = function(rawBp) {
	var other = new PULSE.BallProgress(rawBp);
	var compare = +this.innings - +other.innings;
	if (compare === 0) {
		compare = +this.over - +other.over;
		if (compare === 0) compare = +this.ball - +other.ball
	}
	return compare
};

function CricketBallTrajectory() {}
CricketBallTrajectory.prototype.getPositionAtTime = function(t) {
	var time = t - this.bt;
	if (time > 0) return {
		x: this.getX(this.bp.x, this.obv.x, this.oba.x, time),
		y: this.getYorZ(this.bp.y, this.obv.y, this.oba.y, time),
		z: this.getYorZ(this.bh, this.obv.z, this.oba.z, time)
	};
	else return {
		x: this.getX(this.bp.x, this.ebv.x, this.a.x, time),
		y: this.getYorZ(this.bp.y, this.ebv.y, this.a.y, time),
		z: this.getYorZ(this.bh, this.ebv.z, this.a.z, time)
	}
};
CricketBallTrajectory.prototype.getTimeAtX = function(x) {
	if (this.bp.x > x) return Math.log((x - this.bp.x) * (this.oba.x / this.obv.x) + 1) / this.oba.x;
	else return Math.log((x - this.bp.x) * (this.a.x / this.ebv.x) + 1) / this.a.x
};
CricketBallTrajectory.prototype.getX = function(x, vx, ax, t) {
	return x - vx * ((1 - Math.exp(ax * t)) / ax)
};
CricketBallTrajectory.prototype.getYorZ = function(pos, velocity, accel, t) {
	return pos + velocity * t + accel * t * t / 2
};

function NonLinearAxis(title, min, max, start, end, fixed, numLabels, spec, labels) {
	this.title = title;
	this.min = min;
	this.max = max;
	this.start = start;
	this.end = end;
	this.fixed = fixed;
	this.numLabels = numLabels;
	this.spec = spec;
	this.labels = labels;
	this.overdraw = 0;
	this.shift = 0;
	this.titleShift = 0
}
NonLinearAxis.prototype.project = function(value) {
	var clamped = value;
	if (clamped < this.min) clamped = this.min;
	if (clamped > this.max) clamped = this.max;
	var proportion;
	for (var i = 1, j = this.spec.length; i < j; i++) {
		var limit = this.spec[i][0];
		var fraction = this.spec[i][1];
		if (clamped <= limit) {
			proportion = this.spec[i - 1][1];
			var dx = this.spec[i][0] - this.spec[i - 1][0];
			var xx = clamped - this.spec[i - 1][0];
			var dy = this.spec[i][1] - this.spec[i - 1][1];
			proportion += xx / dx * dy;
			break
		}
	}
	return this.start + proportion * (this.end - this.start)
};
NonLinearAxis.prototype.drawTo = Axis.prototype.drawTo;
if (!PULSE) var PULSE = {};
PULSE.TextField = function(config) {
	this.lines = [];
	this.config = config;
	this.additional = {};
	this.additional.height = 0;
	this.additional.width = 0
};
PULSE.TextField.prototype.addLine = function(line) {
	this.lines.push(line)
};
PULSE.TextField.prototype.setLines = function(lines) {
	this.lines = lines
};
PULSE.TextField.prototype.fallsWithin = function(xy) {
	return xy.x >= this.bounds.x && xy.x <= this.bounds.x + this.bounds.width && xy.y >= this.bounds.y && xy.y <= this.bounds.y + this.bounds.height
};
PULSE.TextField.prototype.render = function(ctx) {
	ctx.save();
	ctx.font = this.config.font;
	var height = this.config.margin.top;
	var width = this.config.margin.left;
	var maxWidth = 0;
	var sheight = 0;
	for (var i = 0, j = this.lines.length; i < j; i++) {
		var line = this.lines[i];
		var ss = Utils.stringSize(ctx, line);
		height += ss.height + this.config.spacing;
		sheight = ss.height;
		if (ss.width > maxWidth) maxWidth = ss.width
	}
	height += this.config.margin.bottom - this.config.spacing + this.additional.height;
	width += maxWidth + this.config.margin.right + this.additional.width;
	var origin = Utils.adjustForAnchor(this.config.position.x, this.config.position.y, {
		width: width,
		height: height
	}, this.config.position.anchor);
	ctx.beginPath();
	ctx.fillStyle = this.config.background;
	ctx.rect(origin.x, origin.y, width, height);
	ctx.fill();
	var x = origin.x + this.config.margin.left;
	var y = origin.y + this.config.margin.top + sheight / 2;
	ctx.fillStyle = "white";
	for (var i = 0, j = this.lines.length; i < j; i++) {
		this.drawString(ctx, this.lines[i], x, y);
		y += sheight + this.config.spacing
	}
	if (this.config.border) {
		ctx.lineWidth = this.config.border.width;
		ctx.strokeStyle = this.config.border.color;
		ctx.beginPath();
		ctx.rect(origin.x, origin.y, width, height);
		ctx.stroke();
		if (this.config.border.indicator > 0) {
			var points = [];
			switch (this.config.position.anchor) {
				case "nw":
					points = [{
						x: origin.x,
						y: origin.y + this.config.border.indicator
					}, {
						x: origin.x,
						y: origin.y
					}, {
						x: origin.x + this.config.border.indicator,
						y: origin.y
					}];
					break;
				case "ne":
					points = [{
						x: origin.x + width - this.config.border.indicator,
						y: origin.y
					}, {
						x: origin.x + width,
						y: origin.y
					}, {
						x: origin.x + width,
						y: origin.y + this.config.border.indicator
					}];
					break;
				case "se":
					points = [{
						x: origin.x + width - this.config.border.indicator,
						y: origin.y + height
					}, {
						x: origin.x + width,
						y: origin.y + height
					}, {
						x: origin.x + width,
						y: origin.y + height - this.config.border.indicator
					}];
					break;
				case "sw":
					points = [{
						x: origin.x,
						y: origin.y + height - this.config.border.indicator
					}, {
						x: origin.x,
						y: origin.y + height
					}, {
						x: origin.x + this.config.border.indicator,
						y: origin.y + height
					}];
					break
			}
			ctx.fillStyle = this.config.border.color;
			Utils.polygon(ctx, points);
			ctx.fill()
		}
	}
	ctx.restore();
	this.bounds = {
		x: origin.x,
		y: origin.y,
		width: width,
		height: height
	}
};
PULSE.TextField.prototype.setHighlight = function(hl, ctx) {
	ctx.save();
	ctx.lineWidth = hl ? this.config.hlborder.width : this.config.border.width;
	ctx.strokeStyle = hl ? this.config.hlborder.color : this.config.border.color;
	ctx.beginPath();
	ctx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	ctx.stroke();
	ctx.restore()
};
PULSE.TextField.prototype.drawString = function(ctx, string, x, y) {
	var standardColor = ctx.fillStyle;
	var xx = x;
	var scan = 0;
	var more = true;
	while (more) {
		var fragment = string.substring(scan);
		var tagStart = string.indexOf("\x3cc:", scan);
		if (tagStart !== -1) {
			var tagClose = string.indexOf("\x3e", tagStart);
			var tagEnd = string.indexOf("\x3c/c\x3e", tagStart);
			var color = string.substring(tagStart + 3, tagClose);
			fragment = string.substring(tagClose + 1, tagEnd);
			var preFragment = string.substring(scan, tagStart);
			ctx.fillStyle = standardColor;
			ctx.beginPath();
			Utils.anchoredFillText(ctx, preFragment, xx, y, "w");
			xx += Utils.stringSize(ctx, preFragment).width;
			ctx.fillStyle = color;
			scan = tagEnd + 4
		} else {
			ctx.fillStyle = standardColor;
			more = false
		}
		ctx.beginPath();
		Utils.anchoredFillText(ctx, fragment, xx, y, "w");
		xx += Utils.stringSize(ctx, fragment).width
	}
	ctx.fillStyle = standardColor
};
var Base64Decoder = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d",
	decode: function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = enc1 << 2 | enc2 >> 4;
			chr2 = (enc2 & 15) << 4 | enc3 >> 2;
			chr3 = (enc3 & 3) << 6 | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 !== 64) output = output + String.fromCharCode(chr2);
			if (enc4 !== 64) output = output + String.fromCharCode(chr3)
		}
		return output
	}
};
if (!PULSE) var PULSE = {};
PULSE.DataMonitor = function(interval, db, callback) {
	PULSE.Tracer.info("DataMonitor created");
	this.interval = interval;
	this.db = db;
	this.callback = callback;
	this.timerId = null;
	this.downloading = true
};
PULSE.DataMonitor.prototype.start = function() {
	PULSE.Tracer.info("DataMonitor started");
	if (this.timerId !== null) this.stop();
	var that = this;
	that.onTimer();
	this.timerId = setInterval(function() {
		that.onTimer()
	}, this.interval)
};
PULSE.DataMonitor.prototype.onTimer = function() {
	if (this.downloading) {
		PULSE.Tracer.info("DataMonitor timer fired");
		var that = this;
		this.db.checkForUpdate(function() {
			that.db.loadData(that.callback)
		})
	}
};
PULSE.DataMonitor.prototype.stop = function() {
	PULSE.Tracer.info("DataMonitor stopped");
	clearInterval(this.timerId);
	this.timerId = null
};
if (!PULSE) var PULSE = {};
PULSE.Font = function(family, size, weight) {
	this["font-family"] = family;
	this["font-size"] = size;
	this["font-weight"] = weight
};
PULSE.Font.toString = function() {
	var s = "";
	if (this["font-weight"]) s += this["font-weight"];
	if (this["font-size"]) s += " " + this["font-size"] + "px";
	s += this["font-family"];
	return s
};

function Graph(background, mask, renderer) {
	this.bgLoaded = false;
	this.maskLoaded = false;
	this.renderer = renderer;
	var that = this;
	this.bg = new Image;
	this.bg.onload = function() {
		that.bgLoaded = true
	};
	if (background) this.bg.src = PULSE.config.IMAGE_URL_PREFIX + background;
	this.mask = new Image;
	this.mask.onload = function() {
		that.maskLoaded = true
	};
	if (mask) this.mask.src = PULSE.config.IMAGE_URL_PREFIX + mask
}
Graph.prototype.render = function(data, ctx) {
	this.renderer.render(data, ctx)
};
if (!PULSE) var PULSE = {};
PULSE.HtmlSelect = function(id, callback, click) {
	this.element = document.getElementById(id);
	if (this.element === null) {
		PULSE.Tracer.error("Could not find an HtmlSelect element with the ID " + id);
		return
	}
	this.parent = this.element.parentNode;
	this.selected = undefined;
	var that = this;
	$(this.element).change(function() {
		that.selected = that.element.options[that.element.selectedIndex];
		PULSE.Tracer.info("HtmlSelect callback of " + that.element.id + "\x3d" + that.selected.value);
		callback(that.element.id, that.selected.value)
	});
	if (click) $(this.element).click(click);
	this.setData([])
};
PULSE.HtmlSelect.prototype.setClassname = function(classname) {
	this.parent.setAttribute("class", classname)
};
PULSE.HtmlSelect.prototype.setSelectedLabel = function(label) {
	for (var i = 0, limit = this.element.options.length; i < limit; i++) {
		var item = this.element.options[i];
		if (item.text === label) {
			this.element.selectedIndex = i;
			this.selected = item;
			break
		}
	}
};
PULSE.HtmlSelect.prototype.setSelectedValue = function(value) {
	for (var i = 0, limit = this.element.options.length; i < limit; i++) {
		var item = this.element.options[i];
		if (item.value === value) {
			this.element.selectedIndex = i;
			this.selected = item;
			break
		}
	}
};
PULSE.HtmlSelect.prototype.setData = function(data, showLast) {
	this.data = data;
	var selectedLabel = undefined;
	if (this.selected) {
		selectedLabel = this.selected.text;
		if (!selectedLabel) selectedLabel = this.selected.value
	}
	while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
	var hit = false;
	for (var i = 0, limit = data.length; i < limit; i++) {
		var item = data[i];
		var label = item.label;
		var value = item.value;
		if (value === undefined) {
			value = label;
			item.value = value
		}
		var option = PULSE.NewUI.createElement("option");
		option.innerText = label;
		option.text = label;
		option.value = value;
		this.element.appendChild(option);
		if (label == selectedLabel) {
			this.element.selectedIndex = i;
			this.selected = option;
			hit = true
		}
	}
	var newSelection = false;
	if (!hit) {
		newSelection = true;
		if (data.length > 0) {
			this.element.selectedIndex = showLast ? data.length - 1 : 0;
			this.selected = this.element.options[this.element.selectedIndex]
		}
	}
	PULSE.Tracer.info("setData resulted in newSelection\x3d" + newSelection);
	return newSelection
};
if (!PULSE) var PULSE = {};
PULSE.Levenshtein = {};
PULSE.Levenshtein.MAX_LENGTH = 30;
PULSE.Levenshtein.bestMatch = function(candidates, input) {
	var best;
	var bestScore = PULSE.Levenshtein.MAX_LENGTH + 1;
	var normInput = PULSE.Levenshtein.normalise(input);
	for (var i = 0, j = candidates.length; i < j; i++) {
		var candidate = candidates[i];
		var normCandidate = PULSE.Levenshtein.normalise(candidate);
		var score = PULSE.Levenshtein.score(normInput, normCandidate);
		if (score === 0) return candidate;
		else if (score < bestScore) {
			bestScore = score;
			best = candidate
		}
	}
	return best
};
PULSE.Levenshtein.normalise = function(input) {
	if (input) {
		var ret = input.replace(/[^a-zA-Z]/g, "");
		ret = ret.toLowerCase();
		if (ret.length > PULSE.Levenshtein.MAX_LENGTH) ret = ret.substr(0, PULSE.Levenshtein.MAX_LENGTH);
		return ret
	}
};
PULSE.Levenshtein.score = function(s1, s2) {
	var i, j, dist = [];
	var s1len = s1.length,
		s2len = s2.length;
	for (i = 0; i <= s1len; i++) {
		dist[i] = [];
		dist[i][0] = i
	}
	for (j = 0; j <= s2len; j++) dist[0][j] = j;
	for (j = 1; j <= s2len; j++)
		for (i = 1; i <= s1len; i++)
			if (s2.charAt(j - 1) === s1.charAt(i - 1)) dist[i][j] = dist[i - 1][j - 1];
			else dist[i][j] = Math.min(Math.min(dist[i - 1][j] + 1, dist[i][j - 1] + 1), dist[i - 1][j - 1] + 1);
	return dist[s1len][s2len]
};

function OldProjection(xyz, rpy, ar, fl, center) {
	this.xyz = xyz;
	this.rpy = rpy;
	this.ar = ar;
	this.fl = fl;
	this.center = center;
	this.LUT = [
		[0, 1, 2],
		[1, 0, 2],
		[2, 0, 1]
	]
}
OldProjection.prototype.distanceSquared = function(world) {
	var dx = world.x - this.xyz.x;
	var dy = world.y - this.xyz.y;
	var dz = world.z - this.xyz.z;
	var dsquared = dx * dx + dy * dy + dz * dz;
	return dsquared
};
OldProjection.prototype.project = function(world) {
	if (this.rot === undefined) this.rot = this.makeRotation();
	var newWorld = [world.x - this.xyz.x, world.y - this.xyz.y, world.z - this.xyz.z];
	var cam = this.matrixVectorMultiply(this.rot, newWorld);
	if (cam[2] < 1E-9) cam[2] = -1E-9;
	var x = this.center.x + cam[0] / cam[2] * this.fl;
	var y = this.center.y + cam[1] / cam[2] * this.fl * this.ar;
	return {
		x: x,
		y: y,
		dsquared: this.distanceSquared(world)
	}
};
OldProjection.prototype.makeRotation = function() {
	var mRoll = this.axisRotation(2, this.rpy.r);
	var mPitch = this.axisRotation(0, this.rpy.p);
	var mYaw = this.axisRotation(2, this.rpy.y);
	var m = this.matrixMatrixMultiply(mRoll, mPitch);
	m = this.matrixMatrixMultiply(m, mYaw);
	return m
};
OldProjection.prototype.axisRotation = function(axis, angle) {
	var i0 = this.LUT[axis][0];
	var i1 = this.LUT[axis][1];
	var i2 = this.LUT[axis][2];
	var rot = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	rot[i0][i0] = 1;
	rot[i1][i1] = Math.cos(angle);
	rot[i2][i2] = Math.cos(angle);
	rot[i1][i2] = Math.sin(angle);
	rot[i2][i1] = -rot[i1][i2];
	return rot
};
OldProjection.prototype.matrixMatrixMultiply = function(a, b) {
	return [
		[a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0], a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]],
		[a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1], a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]],
		[a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0], a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1], a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]]
	]
};
OldProjection.prototype.matrixVectorMultiply = function(a, b) {
	return [a[0][0] * b[0] + a[0][1] * b[1] + a[0][2] * b[2], a[1][0] * b[0] + a[1][1] * b[1] + a[1][2] * b[2], a[2][0] * b[0] + a[2][1] * b[1] + a[2][2] * b[2]]
};
if (!PULSE) var PULSE = {};
PULSE.RaphaelAxis = function(title, min, max, start, end, fixed, numLabels, labels, overdraw, shift, titleShift, colour) {
	this.title = title;
	this.min = min;
	this.max = max;
	this.configuredMax = max;
	this.start = start;
	this.end = end;
	this.configuredEnd = end;
	this.fixed = fixed;
	this.numLabels = numLabels;
	this.labels = labels;
	this.overdraw = overdraw === undefined ? 0 : overdraw;
	this.shift = shift === undefined ? 0 : shift;
	this.titleShift = titleShift === undefined ? 0 : titleShift;
	this.colour = colour || "#fff"
};
PULSE.RaphaelAxis.prototype.project = function(value) {
	var clamped = value;
	if (clamped < this.min) clamped = this.min;
	if (clamped > this.max) clamped = this.max;
	return this.shift + this.start + (clamped - this.min) / (this.max - this.min) * (this.end - this.start)
};
PULSE.RaphaelAxis.prototype.drawTo = function(r, isX) {
	var attrs = this.font;
	attrs.fill = this.colour;
	var path = "M";
	if (isX) {
		path += this.start + " " + this.fixed;
		path += "L" + (this.end + this.overdraw) + " " + this.fixed
	} else {
		path += this.fixed + " " + this.start;
		path += "L" + this.fixed + " " + (this.end + this.overdraw)
	}
	r.path(path).attr({
		stroke: this.colour,
		fill: "none",
		"stroke-width": 2,
		"stroke-linecap": "square"
	});
	var spacing = Math.round((this.max - this.min) / this.numLabels);
	var newSpacing = 10 * Math.round(spacing / 10);
	if (newSpacing > 0) spacing = newSpacing;
	for (var val = this.min; val <= this.max; val += spacing) {
		var pos = this.project(val);
		var label = val;
		if (this.labels !== undefined && this.labels[val] !== undefined) label = this.labels[val];
		if (isX) r.text(pos, PULSE.Browser.y(this.fixed + 9), label).attr(attrs);
		else r.text(this.fixed - 6, PULSE.Browser.y(pos), label).attr(attrs).attr({
			"text-anchor": "end"
		})
	}
	var pos = this.project((this.min + this.max) / 2);
	if (isX) r.text(pos, PULSE.Browser.y(this.fixed + 25 + this.titleShift), this.title).attr(attrs);
	else {
		var x = this.fixed - 37 - this.titleShift;
		var y = PULSE.Browser.y(pos);
		r.text(x, y, this.title).rotate(-90).attr(attrs)
	}
};
if (!PULSE) var PULSE = {};
PULSE.RaphaelFlexikey = function(config) {
	this.entries = [];
	this.config = config
};
PULSE.RaphaelFlexikey.prototype.addEntry = function(label, color) {
	this.entries.push({
		label: label,
		color: color
	})
};
PULSE.RaphaelFlexikey.prototype.render = function(r) {
	var set = r.set();
	var height = this.config.margin.top;
	var width = this.config.margin.left;
	var maxWidth = 0;
	var sheight = 0;
	var bg = r.rect().attr({
		fill: this.config.background.color,
		stroke: "none",
		opacity: this.config.background.opacity
	});
	set.push(bg);
	var attrs = this.config.font;
	attrs.fill = this.config.colour || "#fff";
	attrs.stroke = "none";
	attrs["text-anchor"] = "start";
	attrs.x = width + this.config.swatch.size + this.config.swatch.spacing;
	var y = this.config.margin.top + this.config.spacing * 1.5;
	for (var i = 0, j = this.entries.length; i < j; i++) {
		var entry = this.entries[i];
		attrs.y = PULSE.Browser.y(y);
		var label = r.text(0, 0, entry.label).attr(attrs);
		set.push(label);
		var ss = label.getBBox();
		height += ss.height + this.config.spacing;
		sheight = ss.height;
		if (ss.width > maxWidth) maxWidth = ss.width;
		var swatch = r.circle(this.config.margin.left + this.config.swatch.size / 2, y, this.config.swatch.size / 2).attr({
			fill: entry.color,
			stroke: "none"
		});
		set.push(swatch);
		y += ss.height + this.config.spacing
	}
	height += this.config.margin.bottom - this.config.spacing;
	width += this.config.swatch.size + this.config.swatch.spacing + maxWidth + this.config.margin.right;
	bg.attr({
		width: width,
		height: height
	});
	var origin = Utils.adjustForAnchor(this.config.position.x, this.config.position.y, {
		width: width,
		height: height
	}, this.config.position.anchor);
	set.translate(origin.x, origin.y)
};
if (!PULSE) var PULSE = {};
PULSE.RaphaelNonLinearAxis = function(title, min, max, start, end, fixed, numLabels, spec, labels, colour) {
	this.title = title;
	this.min = min;
	this.max = max;
	this.start = start;
	this.end = end;
	this.fixed = fixed;
	this.numLabels = numLabels;
	this.spec = spec;
	this.labels = labels;
	this.colour = colour;
	this.overdraw = 0;
	this.shift = 0;
	this.titleShift = 0
};
PULSE.RaphaelNonLinearAxis.prototype.project = function(value) {
	var clamped = value;
	if (clamped < this.min) clamped = this.min;
	if (clamped > this.max) clamped = this.max;
	var proportion;
	for (var i = 1, j = this.spec.length; i < j; i++) {
		var limit = this.spec[i][0];
		var fraction = this.spec[i][1];
		if (clamped <= limit) {
			proportion = this.spec[i - 1][1];
			var dx = this.spec[i][0] - this.spec[i - 1][0];
			var xx = clamped - this.spec[i - 1][0];
			var dy = this.spec[i][1] - this.spec[i - 1][1];
			proportion += xx / dx * dy;
			break
		}
	}
	return this.start + proportion * (this.end - this.start)
};
PULSE.RaphaelNonLinearAxis.prototype.drawTo = PULSE.RaphaelAxis.prototype.drawTo;
if (!PULSE) var PULSE = {};
PULSE.RaphaelTextField = function(config) {
	this.lines = [];
	this.config = config;
	this.additional = {};
	this.additional.height = 0;
	this.additional.width = 0
};
PULSE.RaphaelTextField.prototype.addLine = function(line) {
	this.lines.push(line)
};
PULSE.RaphaelTextField.prototype.setLines = function(lines) {
	this.lines = lines
};
PULSE.RaphaelTextField.prototype.fallsWithin = function(xy) {
	return xy.x >= this.bounds.x && xy.x <= this.bounds.x + this.bounds.width && xy.y >= this.bounds.y && xy.y <= this.bounds.y + this.bounds.height
};
PULSE.RaphaelTextField.prototype.render = function(r, set) {
	var height = this.config.margin.top;
	var width = this.config.margin.left;
	var texts = [];
	var bg = r.rect();
	set.push(bg);
	var maxWidth = 0;
	var sheight = 0;
	var y = this.config.margin.top + this.config.spacing * 2;
	for (var i = 0, j = this.lines.length; i < j; i++) {
		var lineWidth = 0;
		var components = PULSE.RaphaelTextField.getTextComponents(this.lines[i]);
		for (var c = 0, climit = components.length; c < climit; c++) {
			var attrs = this.config.font;
			attrs["text-anchor"] = "start";
			attrs.stroke = "none";
			attrs.fill = components[c].color ? components[c].color : "#fff";
			attrs.x = this.config.margin.left + lineWidth;
			attrs.y = PULSE.Browser.y(y);
			var text = r.text(0, 0, components[c].text).attr(attrs);
			texts.push(text);
			set.push(text);
			var bb = text.getBBox();
			sheight = bb.height;
			lineWidth += bb.width;
			if (components[c].text.charAt(components[c].text.length - 1) === " " && PULSE.Browser && PULSE.Browser.addSpacer) lineWidth += bb.width / components[c].text.length * 0.75
		}
		if (lineWidth > maxWidth) {
			maxWidth = lineWidth;
			bg.attr({
				width: maxWidth
			})
		}
		height += (bb ? bb.height : 0) + this.config.spacing;
		y += sheight + this.config.spacing
	}
	height += this.config.margin.bottom - this.config.spacing + this.additional.height;
	width += maxWidth + this.config.margin.right + this.additional.width;
	bg.attr({
		x: 0,
		y: 0,
		width: width,
		height: height,
		fill: this.config.background.color,
		opacity: this.config.background.opacity
	});
	if (this.config.border) {
		set.push(r.rect(0, 0, width, height).attr({
			"stroke-width": this.config.border.width,
			stroke: this.config.border.color,
			opacity: this.config.border.opacity
		}));
		if (this.config.border.indicator > 0) {
			var points = [];
			switch (this.config.position.anchor) {
				case "nw":
					points = [{
						x: 0,
						y: this.config.border.indicator
					}, {
						x: 0,
						y: 0
					}, {
						x: this.config.border.indicator,
						y: 0
					}];
					break;
				case "ne":
					points = [{
						x: 0 + width - this.config.border.indicator,
						y: 0
					}, {
						x: 0 + width,
						y: 0
					}, {
						x: 0 + width,
						y: this.config.border.indicator
					}];
					break;
				case "se":
					points = [{
						x: 0 + width - this.config.border.indicator,
						y: height
					}, {
						x: 0 + width,
						y: height
					}, {
						x: 0 + width,
						y: height - this.config.border.indicator
					}];
					break;
				case "sw":
					points = [{
						x: 0,
						y: height - this.config.border.indicator
					}, {
						x: 0,
						y: height
					}, {
						x: 0 + this.config.border.indicator,
						y: height
					}];
					break
			}
			var path = "";
			for (var p = 0, plimit = points.length; p < plimit; p++) {
				var point = points[p];
				if (p === 0) path += "M";
				else path += "L";
				path += point.x;
				path += " ";
				path += point.y
			}
			set.push(r.path(path + "z").attr({
				fill: this.config.border.color,
				opacity: this.config.border.opacity,
				stroke: "none"
			}))
		}
	}
	var origin = Utils.adjustForAnchor(this.config.position.x, this.config.position.y, {
		width: width,
		height: height
	}, this.config.position.anchor);
	set.translate(origin.x, origin.y);
	this.bounds = {
		x: origin.x,
		y: origin.y,
		width: width,
		height: height
	}
};
PULSE.RaphaelTextField.prototype.setHighlight = function(hl, ctx) {
	ctx.save();
	ctx.lineWidth = hl ? this.config.hlborder.width : this.config.border.width;
	ctx.strokeStyle = hl ? this.config.hlborder.color : this.config.border.color;
	ctx.beginPath();
	ctx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	ctx.stroke();
	ctx.restore()
};
PULSE.RaphaelTextField.getTextComponents = function(string) {
	var components = [];
	var scan = 0;
	var more = true;
	while (more) {
		var fragment = string.substring(scan);
		var color = undefined;
		var tagStart = string.indexOf("\x3cc:", scan);
		if (tagStart !== -1) {
			var tagClose = string.indexOf("\x3e", tagStart);
			var tagEnd = string.indexOf("\x3c/c\x3e", tagStart);
			var color = string.substring(tagStart + 3, tagClose);
			fragment = string.substring(tagClose + 1, tagEnd);
			var preFragment = string.substring(scan, tagStart);
			if (preFragment.length > 0) components.push({
				text: preFragment
			});
			scan = tagEnd + 4
		} else more = false; if (fragment.length > 0) components.push({
			text: fragment,
			color: color
		})
	}
	return components
};
if (!PULSE) var PULSE = {};
PULSE.Tracer = {};
PULSE.Tracer.TRACING_ELEMENT_ID = "PulseTracer";
PULSE.Tracer.init = function(acceptedLevels) {
	PULSE.Tracer.acceptedLevel = {};
	for (var i = 0, j = acceptedLevels.length; i < j; i++) PULSE.Tracer.acceptedLevel[acceptedLevels[i]] = true
};
PULSE.Tracer.debug = function(message) {
	PULSE.Tracer.addTrace("debug", message)
};
PULSE.Tracer.info = function(message) {
	PULSE.Tracer.addTrace("info", message)
};
PULSE.Tracer.warn = function(message) {
	PULSE.Tracer.addTrace("warn", message)
};
PULSE.Tracer.error = function(message) {
	PULSE.Tracer.addTrace("error", message)
};
PULSE.Tracer.addTrace = function(level, message) {
	var format = function(value, size, pad) {
		if (size === undefined) size = 2;
		if (pad === undefined) pad = "0";
		var s = String(value);
		while (s.length < Math.abs(size))
			if (size > 0) s = pad + s;
			else s = s + pad;
		return s
	};
	if (PULSE.Tracer.acceptedLevel !== undefined && PULSE.Tracer.acceptedLevel[level]) {
		var date = new Date;
		var ts = date.getFullYear() + "-" + format(date.getMonth() + 1) + "-" + format(date.getDate()) + " " + format(date.getHours()) + ":" + format(date.getMinutes()) + ":" + format(date.getSeconds()) + "." + format(date.getMilliseconds(), 3);
		var msg = ts + " [" + format(level, -5, " ") + "] " + message;
		if (window.console)
			if ("info" === level) console.info(msg);
			else if ("warn" === level) console.warn(msg);
		else if ("error" === level) console.error(msg);
		else console.log(msg)
	}
};
PULSE.Tracer.clear = function() {};
var Utils = {
	intermediateColor: function(from, to, fraction) {
		var color = to;
		if ("#" === from.charAt(0) && "#" === to.charAt(0) && 4 === from.length && 4 === to.length) {
			var froms = {
				r: parseInt(from.charAt(1), 16),
				g: parseInt(from.charAt(2), 16),
				b: parseInt(from.charAt(3), 16)
			};
			var tos = {
				r: parseInt(to.charAt(1), 16),
				g: parseInt(to.charAt(2), 16),
				b: parseInt(to.charAt(3), 16)
			};
			var rr = froms.r + fraction * (tos.r - froms.r);
			var gg = froms.g + fraction * (tos.g - froms.g);
			var bb = froms.b + fraction * (tos.b - froms.b);
			color = "#" + Math.round(rr).toString(16) + Math.round(gg).toString(16) + Math.round(bb).toString(16)
		}
		return color
	},
	createElement: function(tag, attributes) {
		var element = document.createElement(tag);
		if (attributes !== undefined)
			for (var attribute in attributes) element.setAttribute(attribute, attributes[attribute]);
		return element
	},
	toString: function(object, singleLine) {
		if (object !== undefined && object !== null) {
			if (typeof object.length === "number" && !object.propertyIsEnumerable("length") && typeof object.splice === "function") {
				var message = "[ ";
				for (var i = 0, j = object.length; i < j; i++) {
					message += Utils.toString(object[i], singleLine) + ",";
					if (!singleLine) message += "\n"
				}
				message += " ]";
				return message
			}
			var message = "";
			var t = typeof object;
			if ("string" === t) {
				message += '"';
				message += object;
				message += '"'
			} else if ("number" === t || "boolean" === t) message += object;
			else {
				message += "{";
				for (var property in object)
					if ("function" !== typeof object[property]) {
						message += property + ":" + Utils.toString(object[property], singleLine) + ",";
						if (!singleLine) message += "\n"
					}
				message += "}"
			}
			return message
		}
	},
	toReallyFixed: function(value, fixation) {
		var text = value.toFixed(fixation);
		if (text.indexOf(".") === -1) text += ".0";
		return text
	},
	dump: function(object) {
		var message = typeof object + "\n";
		if ("string" === typeof object) message += object;
		else
			for (var property in object)
				if ("function" !== typeof object[property]) message += property + ": '" + object[property] + "'\n";
		alert(message)
	},
	dumpFunctions: function(object) {
		var message = "Object functions:\n";
		for (var property in object)
			if ("function" === typeof object[property]) message += property + "\n";
		alert(message)
	},
	cloneArray: function(input) {
		var array = [];
		for (var i = 0, j = input.length; i < j; i++) array.push(input[i]);
		return array
	},
	cloneObject: function(object) {
		var newObject = {};
		for (var property in object)
			if (object.hasOwnProperty(property))
				if ("object" === typeof object[property]) newObject[property] = this.cloneObject(object[property]);
				else newObject[property] = object[property];
		return newObject
	},
	trim: function(text) {
		return (text || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "")
	},
	circle: function(context, x, y, radius) {
		context.arc(x, y, radius, 0, Math.PI * 2, false)
	},
	oval: function(ctx, x, y, radius, xscale, yscale) {
		ctx.save();
		ctx.scale(xscale, yscale);
		Utils.circle(ctx, x / xscale, y / yscale, radius);
		ctx.restore()
	},
	polygon: function(ctx, points) {
		ctx.beginPath();
		for (var i = 0, j = points.length; i < j; i++)
			if (i === 0) ctx.moveTo(points[i].x, points[i].y);
			else ctx.lineTo(points[i].x, points[i].y);
		ctx.closePath()
	},
	anchoredFillText: function(ctx, text, x, y, anchor) {
		var weight = ctx.font.toString().indexOf("Bold") === -1 ? 100 : 180;
		var width = 90;
		var t = String(text);
		if (isiPad()) {
			var cc = t.charCodeAt(0);
			if (cc === 8805) t = "\x3e" + t.substring(1);
			else if (cc === 8804) t = "\x3c" + t.substring(1)
		}
		var size = this.stringSize(ctx, t, weight, width);
		var xx = x - size.width / 2;
		var yy = y + size.height * 0.43;
		if ("e" === anchor || "ne" === anchor || "se" === anchor) xx = x - size.width;
		else if ("w" === anchor || "nw" === anchor || "sw" === anchor) xx = x;
		if ("n" === anchor || "nw" === anchor || "ne" === anchor) yy = y + size.height * 0.66;
		else if ("s" === anchor || "sw" === anchor || "se" === anchor) yy = y;
		if (!isiPad()) ctx.fillText(t, xx, yy);
		else {
			yy -= size.height - 3;
			ctx.save();
			ctx.strokeStyle = ctx.fillStyle;
			ctx.strokeText(t, xx, yy, 2 * this.extractFontSize(ctx.font) * 0.9, weight, width);
			ctx.restore()
		}
	},
	extractFontSize: function(specifier) {
		var fields = specifier.split(" ");
		for (var i = 0, j = fields.length; i < j; i++)
			if (fields[i].indexOf("px") !== -1) return parseInt(fields[i]);
		return 12
	},
	adjustForAnchor: function(x, y, size, anchor) {
		var xx = x - size.width / 2;
		var yy = y - size.height / 2;
		if ("e" === anchor || "ne" === anchor || "se" === anchor) xx = x - size.width;
		else if ("w" === anchor || "nw" === anchor || "sw" === anchor) xx = x;
		if ("n" === anchor || "nw" === anchor || "ne" === anchor) yy = y;
		else if ("s" === anchor || "sw" === anchor || "se" === anchor) yy = y - size.height;
		return {
			x: xx,
			y: yy
		}
	},
	stringSize: function(ctx, string, weight, width) {
		if (!isiPad()) {
			string = string.replace(/ /g, "\x26nbsp;");
			var element = document.getElementById(TextMeasurerDivId);
			element.innerHTML = string;
			element.style.font = ctx.font;
			return {
				height: element.offsetHeight,
				width: element.offsetWidth
			}
		} else {
			var fontsz = this.extractFontSize(ctx.font) * 0.9;
			return {
				height: get_textHeight(fontsz),
				width: get_textWidth(string, fontsz, width)
			}
		}
	},
	getStats: function(array) {
		var max = Number.MIN_VALUE;
		var min = Number.MAX_VALUE;
		var tot = 0;
		for (var i = 0, j = array.length; i < j; i++) {
			if (array[i] > max) max = array[i];
			if (array[i] < min) min = array[i];
			tot += array[i]
		}
		return {
			maximum: max,
			minimum: min,
			mean: tot / array.length
		}
	},
	getFiveNumberSummary: function(array) {
		var count = array.length;
		if (count > 0) {
			var sorted = Utils.cloneArray(array);
			sorted.sort(function(a, b) {
				return a - b
			});
			var min = sorted[0];
			var max = sorted[count - 1];
			var median = Utils.getMedian(sorted);
			var lower, upper;
			if (count % 2 === 0) {
				lower = sorted.slice(0, count / 2);
				upper = sorted.slice(count / 2)
			} else {
				lower = sorted.slice(0, Math.floor(count / 2));
				upper = sorted.slice(Math.ceil(count / 2))
			}
			var lq = Utils.getMedian(lower);
			var uq = Utils.getMedian(upper);
			return {
				min: min,
				lq: lq,
				median: median,
				uq: uq,
				max: max
			}
		}
	},
	getMedian: function(sortedArray) {
		var count = sortedArray.length;
		if (count % 2 === 0) return (sortedArray[count / 2 - 1] + sortedArray[count / 2]) / 2;
		else return sortedArray[Math.floor(count / 2)]
	},
	getXY: function(event) {
		if (event.offsetX) return {
			x: event.offsetX,
			y: event.offsetY
		};
		else if (event.layerX) return {
			x: event.layerX,
			y: event.layerY
		};
		else if (event.originalEvent && event.originalEvent.layerX) return {
			x: event.originalEvent.layerX,
			y: event.originalEvent.layerY
		}
	},
	isInArray: function(array, item) {
		if (array !== undefined)
			for (var i = 0, j = array.length; i < j; i++)
				if (array[i] === item) return true;
		return false
	},
	toggleExistence: function(array, item) {
		if (Utils.isInArray(array, item)) {
			var newArray = [];
			for (var i = 0, j = array.length; i < j; i++)
				if (array[i] != item) newArray.push(array[i]);
			return newArray
		} else return array.concat(item)
	},
	scaleLine: function(from, to, length) {
		var dx = to.x - from.x;
		var dy = to.y - from.y;
		var currentLength = Math.sqrt(dx * dx + dy * dy);
		var multiplier = length / currentLength;
		return {
			x: from.x + multiplier * dx,
			y: from.y + multiplier * dy
		}
	},
	scaleLineRel: function(from, to, threshold, scaler) {
		var dx = to.x - from.x;
		var dy = to.y - from.y;
		var currentLength = Math.sqrt(dx * dx + dy * dy);
		if (currentLength > threshold) {
			var multiplier = scaler * threshold / currentLength;
			return {
				x: from.x + multiplier * dx,
				y: from.y + multiplier * dy
			}
		} else return to
	},
	isNullish: function(string) {
		return string === undefined || string === null || string === "null" || string.length === 0
	},
	keyArray: function(object) {
		var array = [];
		for (var property in object)
			if (object.hasOwnProperty(property)) array.push(property);
		return array
	},
	valueArray: function(object) {
		var array = [];
		for (var property in object)
			if (object.hasOwnProperty(property)) array.push(object[property]);
		return array
	},
	range: function(list) {
		var min, max, total = 0,
			count = 0;
		if (list)
			for (var i = 0, limit = list.length; i < limit; i++) {
				var value = +list[i];
				if (!min || value < min) min = value;
				if (!max || value > max) max = value;
				count++;
				total += value
			}
		var mean;
		if (count > 0) mean = total / count;
		return {
			min: min,
			max: max,
			mean: mean
		}
	},
	tally: function(list) {
		var tally = {};
		if (list)
			for (var i = 0, limit = list.length; i < limit; i++) {
				var value = list[i];
				if (!tally[value]) tally[value] = 0;
				tally[value]++
			}
		return tally
	},
	sign: function(value) {
		return value < 0 ? -1 : 1
	},
	clearContent: function(div) {
		while (div.firstChild) div.removeChild(div.firstChild)
	},
	setContent: function(div, content) {
		this.clearContent(div);
		div.appendChild(content)
	},
	setChildren: function(children, parent) {
		this.clearContent(parent);
		for (var i = 0, limit = children.length; i < limit; i++) parent.appendChild(children[i])
	},
	stringSizeHTML: function(string) {
		string = string.replace(/ /g, "\x26nbsp;");
		var element = document.getElementById(TextMeasurerDivId);
		element.innerHTML = string;
		return {
			width: element.offsetWidth,
			height: element.offsetHeight
		}
	},
	rectangle: function(ctx, boundingPoints, projection) {
		var points = boundingPoints;
		ctx.beginPath();
		for (var i = 0, limit = points.length; i < limit; i++) {
			var point = projection.project(points[i]);
			if (i == 0) ctx.moveTo(point.x, point.y);
			else ctx.lineTo(point.x, point.y)
		}
		ctx.closePath()
	},
	toHTML: function(string) {
		if (string) string = string.replace(/ /g, "\x26nbsp;");
		else string = "";
		return string
	},
	isRightClick: function(event) {
		var rightClick;
		if (event.which) rightClick = event.which === 3;
		else if (event.button) rightClick = event.button === 2;
		return rightClick
	},
	isLeftClick: function(event) {
		var leftClick;
		if (event.which) leftClick = event.which === 1;
		else if (event.button) leftClick = event.button === 0 || event.button === 1;
		return leftClick
	},
	isMiddleClick: function(event) {
		var middleClick;
		if (event.which) middleClick = event.which === 2;
		else if (event.button) middleClick = event.button === 1 || event.button === 4;
		return middleClick
	},
	vectorLength3D: function(v) {
		return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
	},
	supportsHTML5Canvas: function() {
		return !!document.createElement("canvas").getContext
	},
	parseUrlParameters: function(url) {
		var params = {};
		var idx = url.indexOf("?");
		if (idx > -1) {
			var paramString = url.substr(idx + 1);
			var paramArray = paramString.split("\x26");
			for (var i = 0, ilimit = paramArray.length; i < ilimit; i++) {
				var param = paramArray[i];
				var eq = param.indexOf("\x3d");
				if (eq > -1) params[param.slice(0, eq)] = param.slice(eq + 1);
				else params[param] = null
			}
		}
		return params
	},
	isInZone: function(dp, zone, boundsObj) {
		if (zone) {
			var bounds = boundsObj;
			if (!bounds) bounds = this.getZoneBounds(zone);
			return dp.x >= bounds.minx && dp.x <= bounds.maxx && dp.y >= bounds.miny && dp.y <= bounds.maxy
		} else return false
	},
	getZoneBounds: function(zone) {
		var x0 = zone.pos.origin.x;
		var y0 = zone.pos.origin.y;
		var x1 = zone.pos.origin.x + zone.pos.delta.x * zone.size.height;
		var y1 = zone.pos.origin.y + zone.pos.delta.y * zone.size.width;
		var bounds = {};
		if (x0 < x1) {
			bounds.minx = x0;
			bounds.maxx = x1
		} else {
			bounds.minx = x1;
			bounds.maxx = x0
		} if (y0 < y1) {
			bounds.miny = y0;
			bounds.maxy = y1
		} else {
			bounds.miny = y1;
			bounds.maxy = y0
		}
		return bounds
	},
	renderZone: function(zone, ctx, projection, strokeFlag, lineColor, lineWidth, fillColor) {
		if (zone) {
			ctx.save();
			var bounds = this.getZoneBounds(zone);
			var points = [{
				x: bounds.minx,
				y: bounds.miny,
				z: 0
			}, {
				x: bounds.maxx,
				y: bounds.miny,
				z: 0
			}, {
				x: bounds.maxx,
				y: bounds.maxy,
				z: 0
			}, {
				x: bounds.minx,
				y: bounds.maxy,
				z: 0
			}];
			PULSE.Graphing.drawRealRectangle(points, projection, ctx, fillColor, lineColor, lineWidth, strokeFlag);
			ctx.restore()
		}
	},
	createLinesBetweenPoints: function(points) {
		var lines = [];
		if (points && points.length > 1)
			for (var i = 0, limit = points.length - 1; i < limit; i++) lines.push([points[i], points[i + 1]]);
		return lines
	},
	metricToImperial: function(metricVal) {
		var inches = Math.round(metricVal / 0.0254);
		var feet = inches / 12;
		inches = inches % 12;
		feet = parseInt(feet);
		inches = parseInt(inches);
		var imperial = "";
		if (feet > 0) imperial += feet + "'";
		imperial += inches + "''";
		return imperial
	},
	fontToString: function(font) {
		var string = "";
		var fontArray = [];
		fontArray.push(font["font-weight"] || "");
		fontArray.push(font["font-size"] ? font["font-size"] + "px" : "");
		fontArray.push(font["font-family"] || "");
		return fontArray.join(" ")
	},
	fontSizeToString: function(fontString) {
		var array = fontString.split(" ");
		for (var i = 0; i < array.length; i++) {
			var number = array[i];
			number = number.split("px").join("");
			number = +number;
			if (!isNaN(number)) return number
		}
	},
	pixelStringToNumber: function(string) {
		var numberString = string.replace("px", "");
		return +numberString
	},
	numberToPixelString: function(number) {
		return number + "px"
	},
	capitalise: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
};
var CricketField = {
	BATSMAN: 0,
	BOWLER: 1,
	INNINGS: 2,
	OVER: 3,
	BALL: 4,
	ID: 5,
	WW: 6,
	RUNS: 7,
	CREDIT: 8,
	DEBIT: 9,
	PITCHED: 10,
	IS_WICKET: 11,
	STUMPS: 12,
	TRAJECTORY: 13,
	BOWL_SPEED: 14,
	HAS_HANDEDNESS: 15,
	HANDEDNESS: 16,
	IS_COUNTING: 17,
	DISMISSED: 18,
	NF_BATSMAN: 19,
	WIN_LIKELIHOODS: 20,
	BOWLER_SPEED: 21,
	PITCH_SEGMENT: 22,
	COUNTING_BALL: 23,
	EXTRA_TYPE: 24
};
var CricketMatchType = {
	TEST: 0,
	ODI: 1,
	T20: 2
};
var CricketDeliveryType = {
	OVER: 0,
	ROUND: 1
};
var CricketShotStyle = {
	ATTACK: 0,
	DEFEND: 1,
	NOSHOT: 2
};
var CricketShotType = {
	PLAYED: 0,
	EDGED: 1,
	NOSHOT: 2,
	MISSED: 3
};
var CricketExtraType = {
	NONE: 0,
	WIDE: 1,
	BYE: 2,
	LEGBYE: 3,
	NOBALL: 4,
	NOBALLBYE: 5,
	NOBALLLEGBYE: 6
};
var CricketHandedness = {
	LEFT: 0,
	RIGHT: 1
};
var CricketBowlerSpeed = {
	SPIN: 0,
	SEAM: 1,
	BOTH: 2,
	MEDIUM: 3,
	NOBOWL: 4
};
var CricketFilter = {
	ALL: "All",
	LEFTHANDERS: "Left-handers",
	RIGHTHANDERS: "Right-handers",
	SPINBOWLERS: "Spin bowlers",
	SEAMBOWLERS: "Seam bowlers",
	WATCHLIVE: "Watch live",
	ALLINOVER: "All in over",
	ALLBOWLERS: "All Bowlers",
	ALLBALLS: "All Balls",
	ALLBATSMEN: "All Batsmen"
};
var CricketSegmentLookup = {
	"BO": "backward of square on the off side",
	"C": "through the covers",
	"S": "straight down the ground",
	"M": "through mid-wicket",
	"BL": "backward of square on the leg side"
};
var TextMeasurerDivId = "PULSE.textmeasurer";
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
PULSE.CLIENT.Set = function() {
	this.object = {}
};
PULSE.CLIENT.Set.Delimiter = ",";
PULSE.CLIENT.Set.prototype.add = function(value) {
	this.object[value] = true
};
PULSE.CLIENT.Set.prototype.remove = function(value) {
	delete this.object[value]
};
PULSE.CLIENT.Set.prototype.contains = function(value) {
	return this.object[value] !== undefined
};
PULSE.CLIENT.Set.prototype.toString = function() {
	var output = "";
	for (var property in this.object) output += property + PULSE.CLIENT.Set.Delimiter;
	if (output.length > 0) output = output.substr(0, output.length - 1);
	return output
};
PULSE.CLIENT.Set.fromString = function(string) {
	var set = new PULSE.CLIENT.Set;
	var fieldsArray = string.split(PULSE.CLIENT.Set.Delimiter);
	for (var i = 0; i < fieldsArray.length; i++) set.add(fieldsArray[i]);
	return set
};
PULSE.CLIENT.Set.prototype.noOfItems = function() {
	var counter = 0;
	for (var property in this.object) counter++;
	return counter
};
if (!PULSE) var PULSE = {};
if (!PULSE.CLIENT) PULSE.CLIENT = {};
if (!PULSE.CLIENT.CRICKET) PULSE.CLIENT.CRICKET = {};
if (!PULSE.CLIENT.CRICKET.Utils) PULSE.CLIENT.CRICKET.Utils = {};
PULSE.CLIENT.CRICKET.Utils.getRunsOverWickets = function(scoringSummary) {
	if (scoringSummary && scoringSummary.innings)
		if (!scoringSummary.innings[0].allOut) return scoringSummary.innings[0].runs + "/" + scoringSummary.innings[0].wkts;
		else return scoringSummary.innings[0].runs;
	return ""
};
PULSE.CLIENT.CRICKET.Utils.getInningsScore = function(runs, wickets, allOut, declared, flip, scoreDelimeter) {
	var score = "";
	if (wickets !== undefined || runs !== undefined)
		if (flip) score = (!allOut ? (wickets || 0) + (scoreDelimeter || "/") : "") + (runs || 0) + (declared ? "d" : "");
		else score = (runs || 0) + (!allOut ? (scoreDelimeter || "/") + (wickets || 0) : "") + (declared ? "d" : "");
	return score
};
PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings = function(innings, battingOrder, index) {
	var lastInnings;
	for (var i = 0; i < innings.length; i++) {
		var inning = innings[i],
			battingIdx = battingOrder[i];
		if (battingIdx === index) lastInnings = inning
	}
	return lastInnings
};
PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction = function(innings) {
	var oversFraction = "";
	if (innings && innings.ballsFaced) var completeOvers = innings.ballsFaced / 6,
		incompleteOver = innings.ballsFaced % 6,
		oversFraction = parseInt(completeOvers) + (incompleteOver !== 0 ? "." + incompleteOver : "");
	return oversFraction
};
PULSE.CLIENT.CRICKET.Utils.getPlayerNameHtml = function(name) {
	var space = name.indexOf(" ");
	if (space === -1) space = 0;
	var start = name.substr(0, space);
	var rest = name.substr(space);
	return start + "\x3cspan\x3e" + rest + "\x3c/span\x3e"
};
PULSE.CLIENT.CRICKET.Utils.formatTeamNameAbbr = function(teamname) {
	return teamname.split("\x26").join("\x26amp;")
};
PULSE.CLIENT.CRICKET.Utils.compareRuns = function(stats1, stats2) {
	var run1 = stats1 && stats1.stats && stats1.stats.r !== "-" ? +stats1.stats.r : -1;
	var run2 = stats2 && stats2.stats && stats2.stats.r !== "-" ? +stats2.stats.r : -1;
	var sr1 = stats1 && stats1.stats && stats1.stats.sr !== "-" ? +stats1.stats.sr : -1;
	var sr2 = stats2 && stats2.stats && stats2.stats.sr !== "-" ? +stats2.stats.sr : -1;
	var compareOutput;
	if (run1 < run2) compareOutput = 1;
	else if (run1 > run2) compareOutput = -1;
	else if (sr1 || sr2) compareOutput = 0;
	else if (sr1 < sr2) compareOutput = 1;
	else if (sr1 > sr2) compareOutput = -1;
	else compareOutput = 0;
	return compareOutput
};
PULSE.CLIENT.CRICKET.Utils.compareEconomy = function(stats1, stats2) {
	var e1 = stats1 && stats1.stats && typeof stats1.stats.e !== "undefined" && stats1.stats.e !== "-" ? +stats1.stats.e : -1;
	var e2 = stats2 && stats2.stats && typeof stats1.stats.e !== "undefined" && stats2.stats.e !== "-" ? +stats2.stats.e : -1;
	var compareOutput;
	if (e1 === -1 && e2 !== -1) compareOutput = 1;
	else if (e1 !== -1 && e2 === -1) compareOutput = -1;
	else if (e1 < e2) compareOutput = -1;
	else if (e1 > e2) compareOutput = 1;
	else compareOutput = 0;
	return compareOutput
};
PULSE.CLIENT.CRICKET.Utils.compareWickets = function(stats1, stats2) {
	var w1 = stats1 && stats1.stats && typeof stats1.stats.w !== "undefined" ? +stats1.stats.w : -1;
	var w2 = stats2 && stats2.stats && typeof stats1.stats.w !== "undefined" ? +stats2.stats.w : -1;
	var r1 = stats1 && stats1.stats && typeof stats1.stats.r !== "undefined" ? +stats1.stats.r : -1;
	var r2 = stats2 && stats2.stats && typeof stats1.stats.r !== "undefined" ? +stats2.stats.r : -1;
	var compareOutput = 0;
	if (w1 < w2) compareOutput = 1;
	else if (w1 > w2) compareOutput = -1;
	else if (w1 > 0 && w2 > 0)
		if (r1 < r2) compareOutput = -1;
		else if (r1 > r2) compareOutput = 1;
	else compareOutput = PULSE.CLIENT.CRICKET.Utils.compareEconomy(stats1, stats2);
	else compareOutput = PULSE.CLIENT.CRICKET.Utils.compareEconomy(stats1, stats2);
	return compareOutput
};
PULSE.CLIENT.CRICKET.Utils.mergeBattingStats = function(stats1, stats2) {
	var mergedStat = {
		playerId: -1,
		b: 0,
		r: 0,
		"4s": 0,
		"6s": 0
	};
	for (var m in mergedStat)
		if (m === "playerId") mergedStat[m] = stats1[m];
		else {
			mergedStat[m] += stats1[m] ? stats1[m] : 0;
			mergedStat[m] += stats2[m] ? stats2[m] : 0
		}
	return mergedStat
};
PULSE.CLIENT.CRICKET.Utils.mergeBowlingStats = function(stats1, stats2) {
	var mergedStat = {
		playerId: -1,
		w: 0,
		d: 0,
		nb: 0,
		r: 0,
		maid: 0,
		wd: 0
	};
	for (var m in mergedStat)
		if (m === "playerId") mergedStat[m] = stats1[m];
		else {
			mergedStat[m] += stats1[m] ? stats1[m] : 0;
			mergedStat[m] += stats2[m] ? stats2[m] : 0
		}
	return mergedStat
};
PULSE.CLIENT.CRICKET.Utils.fakeOversFractionToOversDecimal = function(string) {
	var over = 0;
	var BALLS_IN_OVER = 6;
	if (string != null && string.match("\\d+(\\.\\d)?")) {
		var index = string.indexOf(".");
		if (index == -1) overs = parseInt(string);
		else overs = parseInt(string.substring(0, index)) + parseFloat(string.substring(index + 1) / BALLS_IN_OVER)
	}
	return overs
};
PULSE.CLIENT.CRICKET.Utils.getBPString = function(bp) {
	return bp.innings + "." + bp.over + "." + bp.ball
};
PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers = function(balls) {
	if (balls > 0) return Math.floor(balls / 6) + "." + balls % 6;
	return ""
};
PULSE.CLIENT.CRICKET.Utils.getStandingsForValue = function(standing) {
	if (standing.totalRunsFor) {
		var overs = PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers(standing.totalBallsFor);
		return standing.totalRunsFor + "/" + overs
	} else return ""
};
PULSE.CLIENT.CRICKET.Utils.getStandingsAgainstValue = function(standing) {
	if (standing.totalRunsAgainst) {
		var overs = PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers(standing.totalBallsAgainst);
		return standing.totalRunsAgainst + "/" + overs
	} else return ""
};
if (!PULSE) var PULSE = {};
PULSE.SpeedModeController = {
	MPH_TO_KMH: 1.609,
	MPS_TO_KMH: 3.6,
	MODE_MPH: "mph",
	MODE_KMH: "kmh",
	MPH_UNIT: "mph",
	KMH_UNIT: "km/h",
	mode: "mph",
	unit: "mph",
	setMode: function(mode) {
		this.mode = mode;
		this.unit = mode === this.MODE_KMH ? this.KMH_UNIT : this.MPH_UNIT
	},
	mphToKmh: function(mph) {
		return mph * this.MPH_TO_KMH
	},
	mpsToKmh: function(mps) {
		return mps * this.MPS_TO_KMH
	}
};