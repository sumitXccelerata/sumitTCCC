var HH = HH || {};
HH.Frontend = (function(j) {
	var s;
	var n;
	var C;
	var u;
	var e;
	var d;
	var r = function() {
		var K = ["/tcc-awards", "/hall-of-fame", "/360fanschoice2013"];
		var I = document.URL;
		for (var J in K) {
			if (I.indexOf(K[J]) !== -1) {
				return K[J]
			}
		}
		return ""
	};
	var o = {
		baseUrl: HH.Params.projectBaseUrl,
		pulseCssUrl: HH.Params.pulseCssUrl,
		pulseImgUrl: HH.Params.pulseImgUrl,
		init: function() {
			this.initMostViewedGalleriesTabs();
			this.initMostWatchedTabs();
			this.initTabbedNews();
			this.teamFilter();
			this.venueFilter();
			this.albumFilter();
			this.sortFilter();
			this.checkSession();
			this.setFilters();
			this.bindSearchClick();
			this.bindSearchIconClick();
			this.fixCss();
			this.bindSearchPlayerIconClick();
			this.initLiveStreamTabs();
			this.initNewsPager()
		},
		initLiveStreamTabs: function() {
			var K = j(".liveStreamHero");
			var I = 0;
			var J = function(M) {
				try {
					M.find(".player").html(M.find(".player").data("player-html"))
				} catch (L) {
					setTimeout(function() {
						if (++I <= 10) {
							J(M)
						} else {
							I = 0;
							return
						}
					}, 300)
				}
			};
			K.on("click", ".ls-nav-item", function() {
				var L = j(this),
					N = L.attr("id").replace("ls-nav-", ""),
					M = null;
				K.find(".ls-nav-item").removeClass("active");
				L.addClass("active");
				K.find(".ls-tab-container").find(".player").empty();
				K.find(".ls-tab-container").hide();
				M = K.find("#ls-container-" + N);
				J(M);
				M.show()
			})
		},
		bindSearchIconClick: function() {
			j("li.search i.icon-search").click(function() {
				if (j("span div.searchBar").is(":visible")) {
					j("span div.searchBar").hide();
					j("li.search").removeClass("active")
				} else {
					j("span div.searchBar").show();
					j("li.search").addClass("active")
				}
			});
			if (HH.Params.websiteId == 7) {
				j(".tcc-main-nav .searchBtn").click(function(I) {
					if (j(I.target).hasClass("searchBtn")) {
						j(".tcc-main-nav .searchBar").toggle();
						j(this).toggleClass("open");
						j(".tcc-main-nav .searchBar input").focus()
					}
				})
			} else {
				j(".tcc-main-nav .searchBtn").click(function() {
					if (j(".tcc-main-nav div.searchBar").is(":visible")) {
						j(".tcc-main-nav div.searchBar").hide();
						j(".tcc-main-nav .searchBtn i").removeClass("icon-remove").addClass("icon-search")
					} else {
						j(".tcc-main-nav div.searchBar").show();
						j(".tcc-main-nav .searchBtn i").removeClass("icon-search").addClass("icon-remove")
					}
				})
			}
		},
		bindSearchClick: function() {
			j("div.searchBar .searchBtn, form.main-search-form .icon-search, div.searchBar button.search").click(function() {
				if (j(this).hasClass("searchBtn") && j(this).is("#video-search")) {
					var J = HH.Params.baseUrl + "/" + HH.Params.websiteControllerName + "/videos/getVideosBySearch";
					var L = j(".video-sub ul li a.active").data("id");
					var M = 0;
					var I = j(".filterDropdownContent .filterSection ul li a.accept").data("id");
					var K = j("div.searchBar #video-search-input").val();
					j.ajax({
						type: "GET",
						url: J,
						data: {
							Start: M,
							time: Date.now,
							Team: I,
							Channel: L,
							Search: K
						},
						dataType: "HTML",
						success: function(N) {
							j("#all-videos").html(N);
							j(".page input").val(1);
							j(".maxPages").text(j("#video-list").data("count"));
							HH.CWCAllVideos.checkPager()
						},
						error: function() {}
					})
				} else {
					if (j(this).hasClass("searchBtn") && j(this).is("#wt20-video-search")) {
						var J = HH.Params.baseUrl + "/" + HH.Params.websiteControllerName + "/videos/getVideosBySearch";
						var L = j(".video-sub ul li a.active").data("id");
						var M = 0;
						var I = j(".filterDropdownContent .filterSection ul li a.accept").data("id");
						var K = j("div.searchBar #video-search-input").val();
						j.ajax({
							type: "GET",
							url: J,
							data: {
								Start: M,
								time: Date.now,
								Team: I,
								Channel: L,
								Search: K
							},
							dataType: "HTML",
							success: function(N) {
								j(".js-hide-on-search").hide();
								j("#all-videos").html(N);
								j(".page input").val(1);
								j(".maxPages").text(j("#video-list").data("count"));
								HH.WT20AllVideos.checkPager()
							},
							error: function() {}
						})
					} else {
						if (j(this).hasClass("searchBtn") && j(this).is("#photo-search")) {
							HH.CWCPhotoSection.loadAlbums(0, false)
						} else {
							if (j(this).hasClass("searchBtn") || j(this).hasClass("search")) {
								j("div.searchBar form.header-search-form").submit()
							} else {
								j("div.searchBar form.main-search-form").submit()
							}
						}
					}
				}
			})
		},
		clearPhotoList: function() {},
		setFilters: function() {
			if (typeof(u) == "undefined") {
				return
			}
			if (typeof(e) == "undefined") {
				return
			}
			if (typeof(d) == "undefined") {
				return
			}
			if (u == "viewed") {
				j(".tabs a.left").removeClass("selected");
				j(".tabs a.right").addClass("selected")
			}
			if (e != "null") {
				j("#videoTeamsFilter a.selection").html(e + "<img src='" + self.pulseImgUrl + "css-support/trans.png'/>")
			}
			if (d != "null") {
				var I = d.split("ipl");
				if (typeof(I[1]) == "undefined") {
					j("#videoSeasonsFilter a.selection").html("All Seasons<img src='" + self.pulseImgUrl + "css-support/trans.png'/>")
				} else {
					j("#videoSeasonsFilter a.selection").html("IPL " + I[1] + "<img src='" + self.pulseImgUrl + "css-support/trans.png'/>")
				}
			}
		},
		initMostViewedGalleriesTabs: function() {
			var I = this;
			j(".tabContainerGalleries div").first().show();
			j(".gTabs li").click(function() {
				var J = j(this);
				j(".tabContentGalleries").hide();
				j(".gTabs li").removeClass("selected");
				J.addClass("selected");
				tabId = J.find("a").attr("id");
				tabId = tabId.replace("gLink_", "");
				j("#" + tabId).show()
			})
		},
		initMostWatchedTabs: function() {
			var I = this;
			j(".tabContainerMW div").first().show();
			j(".mwTabs li").click(function() {
				var J = j(this);
				j(".tabContentMW").hide();
				j(".mwTabs li").removeClass("selected");
				J.addClass("selected");
				tabId = J.find("a").attr("id");
				tabId = tabId.replace("mwLink_", "");
				j("#" + tabId).show()
			})
		},
		initTabbedNews: function() {
			var I = this;
			j("section.articleList210 ul").first().show();
			j(".tabbedNews .secondaryNav ul li").click(function() {
				var J = j(this);
				j(".newsHeroArea .articleListBasic").hide();
				j(".tabbedNewsTabs li a").removeClass("active");
				J.find("a").addClass("active");
				tabId = J.find("a").attr("id");
				tabId = tabId.replace("tabbedNewsLink_", "");
				j("#" + tabId).show()
			})
		},
		hideFilterDDList: function() {
			j(".filterDDList").fadeOut()
		},
		showVenues: function() {
			o.hideFilterDDList();
			j("#venuesFilter").addClass("open");
			j("#venue-list").fadeToggle()
		},
		showTeams: function() {
			o.hideFilterDDList();
			j("#teamsFilter").addClass("open");
			j("#team-list").fadeToggle()
		},
		showSeasons: function() {
			o.hideFilterDDList();
			j("#seasonsFilter").addClass("open");
			j("#season-list").fadeToggle()
		},
		showCategories: function() {
			o.hideFilterDDList();
			j("#categoryFilter").addClass("open");
			j("#category-list").fadeToggle()
		},
		sortFilter: function() {},
		teamFilter: function() {
			var I = this;
			j("#photoBrowse #teamsFilter .team-filter").click(function() {
				var K = j(this),
					J = j("#photoBrowse #teamsFilter a.selection");
				J.html(K.text() + '<i class="icon-angle-down"></i>');
				j("#photoBrowse #teamsFilter").removeClass("active");
				j("#photoBrowse #team-list li.active").removeClass("active");
				K.parent().addClass("active");
				j("#photoBrowse #team-list").hide();
				I.updateListView()
			})
		},
		venueFilter: function() {
			var I = this;
			j("#photoBrowse #venuesFilter .venue-filter").click(function() {
				var K = j(this),
					J = j("#photoBrowse #venuesFilter a.selection");
				J.html(K.text() + '<i class="icon-angle-down"></i>');
				j("#photoBrowse #venuesFilter").removeClass("active");
				j("#photoBrowse #venue-list li.active").removeClass("active");
				K.parent().addClass("active");
				j("#photoBrowse #venue-list").hide();
				I.updateListView()
			})
		},
		updateListView: function() {
			var I = this;
			var J = j("#teamsFilter li.active").find("a").attr("id"),
				M = j("#venuesFilter li.active").find("a").attr("id"),
				L = j("#players").val();
			var K = {
				teamId: J,
				venueId: M,
				playerName: L
			};
			j.ajax({
				type: "GET",
				success: function() {
					j.fn.yiiListView.update("album-list", {
						data: K
					})
				},
				error: function(N, P, O) {}
			})
		},
		albumFilter: function() {
			var I = this;
			j(".album-nav").click(function() {
				term = j(this).parent().attr("id").split("_");
				j(".navColContent li.active").removeClass("active");
				j(this).parent().addClass("active");
				I.storeAlbumToSession(term)
			})
		},
		storeFilterToSession: function(J) {
			var I = this;
			j.ajax({
				type: "POST",
				url: I.baseUrl + "/photos/storeFilterToSession",
				data: {
					type: "teamId",
					id: J[1]
				},
				success: function(K) {
					j.fn.yiiListView.update("album-list", {
						url: document.location.toString()
					})
				},
				error: function(K, M, L) {}
			})
		},
		storeSeasonToSession: function(J) {
			var I = this;
			j.ajax({
				type: "POST",
				url: I.baseUrl + "/photos/storeFilterToSession",
				data: {
					type: "seasonId",
					id: J[1]
				},
				success: function(K) {
					j.fn.yiiListView.update("album-list", {
						url: document.location.toString()
					})
				},
				error: function(K, M, L) {}
			})
		},
		storeAlbumToSession: function(J) {
			var I = this;
			j.ajax({
				type: "POST",
				url: I.baseUrl + "/photos/storeFilterToSession",
				data: {
					type: "albumId",
					id: J[1]
				},
				success: function(K) {
					j.fn.yiiListView.update("album-list", {
						url: document.location.toString()
					})
				},
				error: function(K, M, L) {}
			})
		},
		storeVideoTagToSesion: function(J) {
			var I = this;
			j.ajax({
				type: "POST",
				url: I.baseUrl + "/videos/storeToSession",
				data: {
					type: J[0],
					id: J[1]
				},
				success: function(K) {
					j.fn.yiiListView.update("mediaList", {
						url: m.ajaxUrl
					})
				},
				error: function(K, M, L) {}
			})
		},
		checkSession: function() {
			j('[id$="albumNav"]').removeClass("active");
			j("#albumNav_" + s).addClass("active")
		},
		fixCss: function() {
			j("#term_" + n).parent().addClass("selected");
			j("#team-list").hide();
			j("#season_" + C).parent().addClass("selected");
			j("#season-list").hide();
			j(".pager ul.yiiPager a").live("click", function() {
				var L = j(this).parents(".list-view").eq(0).find(".items");
				var I = L.height();
				var K = L.width();
				var J = '<div style="height:' + I + "px; width:" + K + 'px;"></div>';
				L.html(J)
			})
		},
		filterByPlayerName: function(I) {
			this.storePlayerNameToSession(I.value)
		},
		storePlayerNameToSession: function(J) {
			var I = this;
			j.ajax({
				type: "POST",
				url: I.baseUrl + "/photos/storeFilterToSession",
				data: {
					type: "playerName",
					id: J
				},
				success: function(K) {
					j.fn.yiiListView.update("album-list", {
						url: document.location.toString()
					})
				},
				error: function(K, M, L) {}
			})
		},
		bindSearchPlayerIconClick: function() {
			var I = this;
			j(".inputContainer .glass").on("click", function() {
				var K = j(this).parent(),
					J = K.find("input").attr("value");
				I.storePlayerNameToSession(J)
			})
		},
		initNewsPager: function() {
			var J = this;
			var K = j(".row.listViewHolder");
			var I = K.data("listview-id");
			if (!I) {
				I = "news-list"
			}
			j("body").on("keydown", ".summary input, .paginationElements .page input", function(O) {
				if (O.which === 13) {
					if (typeof(j.fn.yiiListView) !== "undefined") {
						var N = j.fn.yiiListView.getUrl(I);
						var M = j(this).val();
						var L = K.data("query-parameter");
						var P = J.updateQueryStringParameter(N, L, M);
						j.fn.yiiListView.update(I, {
							data: P
						});
						j("html, body").animate({
							scrollTop: 0
						}, 1000);
						return false
					}
				}
			});
			j("body").on("click", ".pagePagination li , .paginationElements li", function() {
				j("html, body").animate({
					scrollTop: 0
				}, 500)
			})
		},
		updateQueryStringParameter: function(K, I, L) {
			var J = new RegExp("([?&])" + I + "=.*?(&|$)", "i");
			var M = K.indexOf("?") !== -1 ? "&" : "?";
			if (K.match(J)) {
				return K.replace(J, "$1" + I + "=" + L + "$2")
			} else {
				return K + M + I + "=" + L
			}
		},
	};
	var l = {
		init: function() {
			this.onItemClick()
		},
		initShareBox: function() {
			var J = j("#limelight_player_182518");
			if (J.length > 0) {
				var I = J.find("param[name='flashVars']").val().split("&")[1].replace("mediaId=", "");
				title = j(".videoMetaContent").find("h1").text(), url = m.createOldShareUrl(I);
				this.refreshFBButton(url);
				this.refreshTweeterButton(url);
				this.refreshGPluseButton(url)
			}
		},
		onItemClick: function() {
			var I = this;
			j("a.videoThumb").live("click", function() {
				var N = j(this),
					M = N.attr("data-mediaId"),
					O = N.attr("data-title"),
					L = N.attr("data-description"),
					K = "",
					J = m.createOldShareUrl(M);
				K += '<script src="http://assets.delvenetworks.com/player/embed.js"><\/script>';
				K += '<object type="application/x-shockwave-flash" id="limelight_player_182518" name="limelight_player_182518" class="LimelightEmbeddedPlayerFlash" width="768" height="432" data="http://assets.delvenetworks.com/player/loader.swf">';
				K += '<param name="movie" value="http://assets.delvenetworks.com/player/loader.swf"/>';
				K += '<param name="wmode" value="transparent"/>';
				K += '<param name="allowScriptAccess" value="always"/>';
				K += '<param name="allowFullScreen" value="true"/>';
				K += '<param name="flashVars" value="deepLink=true&amp;mediaId=' + M + '&amp;playerForm=65dd3d09c26a46b5b957b4c3fd7b623d&amp;autoplay=true"/>';
				K += '<script>LimelightPlayerUtil.initEmbed("limelight_player_182518");<\/script>';
				K += "</object>";
				j("#main-video-player").html("").html(K);
				j("div .videoMetaContent h1").html("").html(O);
				j("div .videoMetaContent p").html("").html(L);
				I.refreshFBButton(J);
				I.refreshTweeterButton(J);
				I.refreshGPluseButton(J);
				window.scroll(0, 0)
			})
		},
		refreshTweeterButton: function(J) {
			var K = j(".twitterShare"),
				L = "",
				I = HH.Params.hashTag;
			L += '<a id="t_btn" href="https://twitter.com/share" data-text="Currently watching" class="twitter-share-button" rel="canonical" data-url="' + J + '" data-hashtags="' + I + '" data-count="none">Tweet</a>';
			L += '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"><\/script>';
			K.html("").html(L)
		},
		refreshGPluseButton: function(K) {
			var J = j(".plusShare"),
				I = "";
			I += '<g:plusone size="medium" href="' + K + '"></g:plusone>';
			I += '<script type="text/javascript" src="https://apis.google.com/js/plusone.js"><\/script>';
			J.html("").html(I)
		},
		refreshFBButton: function(I) {
			var J = HH.Params.fbAppId;
			j(".fbShare").html('<iframe src="//www.facebook.com/plugins/like.php?href=' + I + "&amp;send=false&amp;layout=button_count&amp;width=75&amp;show_faces=false&amp;action=like&amp;colorscheme=dark&amp;font&amp;height=21&amp;appId=" + J + '" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>')
		}
	};
	var m = {
		indexTop: 0,
		indexBottom: 1,
		height: 400,
		ajaxUrl: o.baseUrl + "/videos",
		init: function() {
			this.onMenuItemClick();
			this.onVideoItemsClick();
			this.setHeroVideoThumbClick()
		},
		setHeroVideoThumbClick: function() {
			var I = this;
			j("body").on("click", ".show-in-modal", function(J) {
				J.preventDefault();
				var L = j(this),
					K = {};
				K.type = "brightcove";
				K.mediaId = L.data("media"), K.title = L.data("name"), K.description = L.data("description"), K.location = L.data("publish-date");
				K.date = L.data("publish-date");
				K.hashTag = L.data("hashtag");
				K.bUrl = L.data("burl");
				K.isHONVideo = L.data("is-hon-video");
				if (HH.VideoModal) {
					this.modal = HH.VideoModal.getInstance();
					this.modal.embedPlayer(K);
					this.modal.show()
				}
			})
		},
		onVideoItemsClick: function() {
			var I = this;
			j("#videoIndexFrame .show-in-modal,#videoSearchFrame .show-in-modal, .videoPageHero .show-in-modal, #video-list .show-in-modal, .videoHero .show-in-modal, .videoScroll .show-in-modal,ul#cwcvideohero.list li a").live("click", function() {
				if (window.history.pushState) {
					if (j(this).attr("data-href") != null) {
						window.history.pushState(null, null, j(this).attr("data-href"))
					} else {
						window.history.pushState(null, null, j(this).attr("href"))
					}
				}
			})
		},
		onMenuItemClick: function() {
			var I = this;
			j("[id^='ch-menu-item_']").click(function() {
				var J = j(this),
					L = J.attr("data-cid"),
					K = J.find("a").text().replace("Arrow", "");
				J.siblings().removeClass("active");
				J.addClass("active");
				I.storeChannelToSession(L);
				I.clearVideoList();
				I.refreshUrl("channel", L, K, 1)
			})
		},
		storeChannelToSession: function(I) {
			j.ajax({
				type: "post",
				url: self.baseUrl + "/videos/storeChannelToSession",
				data: {
					channelId: I
				},
				success: function(J) {
					j.fn.yiiListView.update("mediaList", {
						url: m.ajaxUrl
					})
				}
			})
		},
		clearVideoList: function() {
			var I = j("#mediaList");
			I.html("").css({
				height: 50,
				width: 20
			})
		},
		refreshUrl: function(J, M, L, K) {
			var I = this.createVideoUrl(J, M, L, K);
			var K = K || 1;
			if (window.history.pushState) {
				window.history.pushState(null, null, I)
			} else {}
		},
		createVideoUrl: function(J, M, L, K) {
			var I = "";
			var K = K || 1;
			if (J == "media" || J == "channel") {
				if (K == 1) {
					I = o.baseUrl + HH.Frontend.getEventParam() + "/videos/" + J + "/id/" + M + "/" + this.seoText(L)
				} else {
					I = o.baseUrl + "/" + HH.Params.websiteUrl + "/videos/" + J + "/id/" + M + "/" + this.seoText(L)
				}
			}
			return I
		},
		createOldShareUrl: function(I) {
			return o.baseUrl + "/videos/media/id/" + I
		},
		seoText: function(N) {
			var K = "0123456789abcdefghijklmnopqrstuvxywz- ",
				J = "",
				M = "";
			if (typeof N != "undefined") {
				for (var L = 0, I = N.length; L < I; L++) {
					M = N[L].toLowerCase();
					if (K.indexOf(M) != -1) {
						J += M
					}
				}
				return J.replace(/\ +/g, "-")
			}
		},
		bindVideoTabs: function() {
			var I = this;
			videoCount = j("#scrollContent-tab1").find("ul").attr("data-count");
			if (videoCount < 6) {
				j(".scrollNav.next").hide()
			}
			j("#scrollContent-tab1").show();
			j(".videoNav li").click(function() {
				var J = j(this);
				I.indexTop = 0;
				I.indexBottom = 1;
				tabId = J.find("a").attr("id");
				tabId = tabId.replace("link-", "");
				videoCount = j("#scrollContent-" + tabId).find("ul").attr("data-count");
				if (videoCount < 6) {
					j(".scrollNav.next").hide()
				} else {
					j(".scrollNav.next").show()
				} if (tabId == "tab1") {
					j("#scrollContent-tab2").hide()
				} else {
					j("#scrollContent-tab1").hide()
				}
				j(".widgetNav li").removeClass("active");
				J.addClass("active");
				j("#scrollContent-" + tabId).show()
			})
		},
		bindScrollNext: function() {
			var I = this;
			j(".videoScroll .next").click(function() {
				var K = j(this);
				var J = I.getActiveTab();
				I.indexTop++;
				var L = -(I.height * I.indexTop);
				j("#scrollContent-" + J).animate({
					top: L
				});
				j(".scrollNav.prev").show();
				var M = j("#scrollContent-" + J).position().top;
				if (M <= -1200) {
					j(".scrollNav.next").hide()
				} else {
					j(".scrollNav.next").show()
				} if (M == 0) {
					j(".scrollNav.prev").hide()
				} else {
					j(".scrollNav.prev").show()
				}
			})
		},
		bindScrollPrev: function() {
			var I = this;
			j(".videoScroll .prev").click(function() {
				var K = j(this);
				var J = I.getActiveTab();
				if (I.indexTop > 0) {
					I.indexTop--
				}
				var L = -(I.height * I.indexTop);
				j("#scrollContent-" + J).animate({
					top: L
				});
				var M = j("#scrollContent-" + J).position().top;
				if (M == 0) {
					j(".scrollNav.prev").hide()
				} else {
					j(".scrollNav.prev").show()
				} if (M <= -1200) {
					j(".scrollNav.next").hide()
				} else {
					j(".scrollNav.next").show()
				}
			})
		},
		getActiveTab: function() {
			var J = j(".widgetNav li.active");
			var I = J.find("a").attr("id");
			I = I.replace("link-", "");
			return I
		},
	};
	var y = function() {
		j("header.topNav nav.tcc-feature-nav div ul li.popup").on("click", function() {
			if (j(this).hasClass("hhopen")) {
				j(this).removeClass("hhopen");
				j(this).removeClass("active");
				j("header.topNav nav.tcc-feature-nav div ul li.popup .follow").fadeOut()
			} else {
				j(this).addClass("hhopen")
			}
		})
	};
	var b = {};
	b.init = function(I) {
		j("#subscribe-form input").removeClass("invalid");
		j.each(I, function(J, K) {
			j("#subscribe-form #" + J).addClass("invalid");
			j("#subscribe-form #" + J + "_em_").html(K);
			j("#subscribe-form #" + J + "_em_").show()
		})
	};
	var F = {};
	F.init = function(I) {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			j(I).unbind("mouseenter mouseleave");
			j(I).on("click", function(J) {
				if (j(this).hasClass("hh-active")) {
					j(this).removeClass("hh-active");
					j(this).find("nav").css("display", "none");
					if ((j(this).hasClass("wt20-16-nav-about")) || (j(this).hasClass("wt20-16-nav-venues")) || (j(this).hasClass("wt20-16-nav-teams"))) {} else {
						if (j(this).hasClass("selected")) {
							j(this).find("a.dropDown").first().css("background", "#003e64")
						} else {
							j(this).find("a.dropDown").first().css("background", "#005d97")
						}
					}
				} else {
					j(this).addClass("hh-active");
					j(this).find("nav").css("display", "block");
					if ((j(this).hasClass("wt20-16-nav-about")) || (j(this).hasClass("wt20-16-nav-venues")) || (j(this).hasClass("wt20-16-nav-teams"))) {} else {
						j(this).find("a.dropDown").first().css("background", "#005488")
					}
				}
			})
		}
	};
	var w = {};
	w.init = function(I, L) {
		var K = this,
			J = j(I),
			M = j(L);
		selectorQ = I.replace(/"/g, "");
		dropDownQ = L.replace(/"/g, "");
		K.lastClicked = null;
		J.append(M);
		j("body").on("click", function(N) {
			K.lastClicked = N.target;
			if (j(N.target).attr("id") == "menu-item-events") {
				j("li.events").addClass("active")
			} else {
				if (j(N.target).attr("id") == "menu-item-teams") {
					j("li.teams-nav").addClass("active")
				} else {
					if (j(N.target).attr("id") == "menu-item-fanzone") {
						j("li.fanzone-nav").addClass("active")
					} else {
						if (j(N.target).attr("id") == "menu-item-more") {
							j("li.more-nav").addClass("active")
						}
					}
				}
			} if (M.is(":visible")) {
				if (j(N.target).attr("id") != "wclc-menu-fixtures" && j(N.target).attr("id") != "wclc-menu-results") {
					J.find("a").addClass("dropDown")
				}
				if ((J.attr("id") == "follow-us")) {
					j("body").find(".tcc-feature-nav ul li.popup").addClass("active")
				}
				if (!j(K.lastClicked).closest(J).length) {
					M.fadeOut();
					J.removeClass("active");
					if (J.attr("id") != "wclc-menu-fixtures" && J.attr("id") != "wclc-menu-results") {
						J.find("a").removeClass("dropDown")
					}
					if ((J.attr("id") == "follow-us")) {
						j("body").find(".tcc-feature-nav ul li.popup").removeClass("active");
						j("body").find(".tcc-feature-nav ul li.popup").removeClass("hhopen")
					}
				}
			}
		});
		J.on("click", function() {
			var N = j(this);
			if ((N.attr("id") != "menu-item-venues") && N.hasClass("selected")) {
				return
			}
			if ((N.attr("id") == "follow-us")) {
				j("body").find(".tcc-feature-nav ul li.popup").addClass("active")
			}
			M.fadeIn()
		});
		j(I).mouseenter(function() {
			j(L).show();
			if (J.attr("id") != "wclc-menu-fixtures" && J.attr("id") != "wclc-menu-results") {
				J.find("a").addClass("dropDown")
			}
			if (J.attr("id") == "menu-item-event" || J.attr("id") == "menu-item-teams" || J.attr("id") == "menu-item-fanzone" || J.attr("id") == "menu-item-more") {
				J.addClass("active")
			}
			if ((J.attr("id") == "follow-us")) {
				j("body").find(".tcc-feature-nav ul li.popup").addClass("active")
			}
		});
		j(I).add(L).mouseleave(function() {
			j(L).hide();
			if (J.attr("id") != "wclc-menu-fixtures" && J.attr("id") != "wclc-menu-results") {
				J.find("a").removeClass("dropDown")
			}
			if ((J.attr("id") == "follow-us")) {
				j("body").find(".tcc-feature-nav ul li.popup").removeClass("active")
			}
			if (J.attr("id") == "menu-item-event") {
				j("li.events").removeClass("active")
			}
			if (J.attr("id") == "menu-item-teams") {
				if (!J.hasClass("selected")) {
					j("li.teams").removeClass("active")
				}
			}
			if (J.attr("id") == "menu-item-fanzone") {
				if (!J.hasClass("selected")) {
					j("li.fanzone").removeClass("active")
				}
			}
			if (J.attr("id") == "menu-item-more") {
				if (!J.hasClass("selected")) {
					j("li.more").removeClass("active")
				}
			}
		})
	};
	var D = {
		init: function() {
			this.bindEvents()
		},
		bindEvents: function() {
			j("body").on("hh:photolistupdate", function() {
				var J = j("#gallery-id").text();
				var I = new HH.PhotoGallery(J);
				j(".singleImage").on("click", function() {
					var K = j(this).attr("id").replace("gallery-pt_", "");
					I.open(K)
				})
			})
		}
	};
	var z = function() {
		j(".switchWebsiteViewType").on("click", function() {
			var J = j(this).data("to"),
				I = new Date();
			I.setTime(I.getTime() + 14 * 24 * 60 * 60 * 1000);
			j.cookie("website_view_type", J, {
				expires: I,
				path: "/"
			});
			if (window.location.reload) {
				window.location.reload()
			} else {
				document.location = "http://www.tcc-cricket.com/"
			}
		})
	};
	var v = {
		timerId: null,
		time: 3000,
		init: function() {
			v.setTimer(v.time)
		},
		showElement: function(K) {
			var J = v.getCurrentItem();
			var I = v.getNextItem();
			J.removeClass("selected");
			J.fadeOut();
			I.fadeIn();
			I.addClass("selected")
		},
		getCurrentItem: function() {
			return j(".tccPartnerHero li.selected")
		},
		getLastItem: function() {
			return j(".tccPartnerHero li:last")
		},
		getPreviousItem: function() {
			var I = v.getCurrentItem();
			I = I.prev("li");
			I.addClass("selected").siblings().removeClass("selected");
			if (I.length == 0) {
				var J = v.getLastItem();
				J.addClass("selected").siblings().removeClass("selected");
				I = J
			}
			return I
		},
		getNextItem: function() {
			var I = v.getCurrentItem();
			I = I.next("li");
			if (I.length == 0) {
				I = j(".tccPartnerHero li").eq(0)
			}
			return I
		},
		setTimer: function(I) {
			v.timerId = setTimeout(v.onTimer, I)
		},
		onTimer: function() {
			var I = v.getNextItem();
			var J = I.find(".sponsorAsset").attr("data-time");
			v.showElement(I);
			v.setTimer(J)
		}
	};
	var E = {
		timerId: null,
		time: 12000,
		init: function() {
			E.setTimer(E.time)
		},
		showElement: function(K) {
			var J = E.getCurrentItem();
			var I = E.getNextItem();
			J.removeClass("selected");
			J.fadeOut();
			I.fadeIn();
			I.addClass("selected")
		},
		getCurrentItem: function() {
			return j(".buz-trending li.selected")
		},
		getLastItem: function() {
			return j(".buz-trending li:last")
		},
		getPreviousItem: function() {
			var I = E.getCurrentItem();
			I = I.prev("li");
			I.addClass("selected").siblings().removeClass("selected");
			if (I.length == 0) {
				var J = E.getLastItem();
				J.addClass("selected").siblings().removeClass("selected");
				I = J
			}
			return I
		},
		getNextItem: function() {
			var I = E.getCurrentItem();
			I = I.next("li");
			if (I.length == 0) {
				I = j(".buz-trending li").eq(0)
			}
			return I
		},
		setTimer: function(I) {
			E.timerId = setTimeout(E.onTimer, I)
		},
		onTimer: function() {
			var I = E.getNextItem();
			var J = I.find(".buzzItem").attr("data-time");
			E.showElement(I);
			E.setTimer(J)
		}
	};
	var f = {
		isLoaded: false,
		init: function() {
			this.bindPageSectionClick()
		},
		bindPageSectionClick: function() {
			j("#faq-list li.active").removeClass("active");
			j("#faq-list li a.faqQuestion").click(function() {
				var I = j(this).attr("data-id");
				j("#faq-list li.active").removeClass("active");
				j("#faq-list i").removeClass("icon-minus").addClass("icon-plus");
				if (j("#section-content-" + I).is(":visible")) {
					j(this).parent().removeClass("active");
					j("#expandCollapse-" + I).addClass("footerExpand");
					j("#section-content-" + I).addClass("hide");
					j("#expandCollapse-" + I).removeClass("footerCollapse");
					j("#expandCollapse-" + I).addClass("icon-plus");
					j("#expandCollapse-" + I).removeClass("icon-minus")
				} else {
					j(this).parent().addClass("active");
					j("#expandCollapse-" + I).removeClass("footerExpand");
					j("#expandCollapse-" + I).addClass("footerCollapse");
					j("#expandCollapse-" + I).removeClass("icon-plus");
					j("#expandCollapse-" + I).addClass("icon-minus");
					j(".faqAnswer").addClass("hide");
					j("#section-content-" + I).removeClass("hide")
				}
				return false
			})
		}
	};
	var B = {
		init: function() {
			this.bindEvents()
		},
		bindEvents: function() {
			j("#multi-tab-wrapper-widget-main ul.nav-list li a").click(function(I) {
				var K = j(this).parent();
				K.siblings().removeClass("active");
				K.addClass("active");
				I.preventDefault();
				var J = j(this).attr("href");
				j("#multi-tab-wrapper-widget-main .tab-pane .panel").each(function() {
					if (j(this).hasClass("active")) {
						j(this).removeClass("active")
					}
					if (!j(this).hasClass("hidden")) {
						j(this).addClass("hidden")
					}
				});
				j(J).addClass("active");
				j(J).removeClass("hidden")
			})
		}
	};
	var p = {
		init: function() {
			var I = HH.Modal.getInstance();
			j(".icon-info-sign").on("click", function(J) {
				I.setContent(j(this).data("info")).open()
			})
		}
	};
	var c = {
		init: function() {
			this.promoWidgetCookieHandling();
			this.promotionCookieHandling();
			this.promotionU19CookieHandling()
		},
		promoWidgetCookieHandling: function() {
			var I = this;
			var J = j.cookie("promo_widget");
			if (J != undefined) {
				if (J == 1) {
					j(".homePromo.promoFirst").show();
					j(".homePromo.promoSecond").hide();
					I.setCookie("promo_widget", 2, 1)
				}
				if (J == 2) {
					j(".homePromo.promoSecond").show();
					j(".homePromo.promoSecond").first();
					I.setCookie("promo_widget", 1, 1)
				}
			} else {
				I.setCookie("promo_widget", 1, 1)
			}
		},
		promotionCookieHandling: function() {
			var J = this;
			var L = j.cookie("promotion");
			var I = new Array();
			if (L != undefined) {
				var K = o.baseUrl + "/site/getPromotionsIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".cwcSection.dark[data-id='" + L + "']").css({
							display: "none"
						});
						random = J.getRandomExcept(I, L);
						j(".cwcSection.dark[data-id='" + random + "']").css({
							display: "block"
						});
						J.setCookie("promotion", random, 1)
					},
					error: function() {}
				})
			} else {
				var K = o.baseUrl + "/" + HH.Params.websiteControllerName + "/site/getPromotionsIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".cwcSection.dark[data-id='" + I[0] + "']").css({
							display: "block"
						});
						J.setCookie("promotion", I[0], 1)
					},
					error: function() {}
				})
			}
		},
		promotionU19CookieHandling: function() {
			var J = this;
			var L = j.cookie("promotion_u19");
			var I = new Array();
			if (L != undefined) {
				var K = o.baseUrl + "/site/getPromotIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".promoThumb.hh-promoThumb[data-id='" + L + "']").css({
							display: "none"
						});
						random = J.getRandomExcept(I, L);
						j(".promoThumb.hh-promoThumb[data-id='" + random + "']").css({
							display: "block"
						});
						J.setCookie("promotion_u19", random, 1)
					},
					error: function() {}
				})
			} else {
				var K = o.baseUrl + "/" + HH.Params.websiteControllerName + "/site/getPromotionsIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".promoThumb.hh-promoThumb[data-id='" + L + "']").css({
							display: "none"
						});
						random = J.getRandomExcept(I, L);
						j(".promoThumb.hh-promoThumb[data-id='" + random + "']").css({
							display: "block"
						});
						J.setCookie("promotion_u19", random, 1)
					},
					error: function() {}
				})
			}
		},
		setCookie: function t(I, K, J) {
			j.cookie(I, K, {
				expires: J,
				path: "/"
			})
		},
		readCookie: function(I) {
			return j.cookie(I)
		},
		getRandomExcept: function A(I, J) {
			if (I.length == 1) {
				return J
			}
			random = I[Math.floor(Math.random() * I.length)];
			if (random == J) {
				return A(I, J)
			}
			return random
		}
	};
	var q = {};
	q.init = function(I, J) {
		$selector = j(I), $dropDown = j(J);
		$selector.on("click", function() {
			event.stopPropagation();
			event.preventDefault();
			var L = j(this),
				K = j(J);
			if (L.hasClass("open")) {
				j("body").css({
					overflow: "visible"
				});
				K.css("display", "none");
				L.removeClass("open");
				j("header.topNav").removeClass("open")
			} else {
				j("body").css({
					overflow: "hidden"
				});
				j(".tcc-main-nav").toggle();
				L.toggleClass("open");
				j("header.topNav").toggleClass("open")
			}
		})
	};
	var H = {};
	H.init = function(I, J) {
		$selector = j(I), $dropDown = j(J);
		$selector.on("click", function() {
			event.stopPropagation();
			event.preventDefault();
			j(this).toggleClass("open");
			j(J).toggleClass("open");
			if (j(J).hasClass("open")) {
				j("body").css({
					overflow: "hidden"
				})
			} else {
				j("body").css({
					overflow: "visible"
				})
			}
		})
	};
	var x = {};
	x.init = function() {
		j("#share-fb, #cwc-facebook-share,#fb_link_superscroll, #wt20q-1-facebook-share, #wt20q-2-facebook-share, #wt20q-3-facebook-share, #wt20-facebook-share").on("click touchstart", function() {
			var I = j(this).attr("data-url");
			var J = j(this).attr("data-text");
			FB.ui({
				method: "share",
				href: I,
			}, function(K) {})
		})
	};
	var G = {};
	G.init = function() {
		j("#cwc-twitter-share, #tw_link_superscroll, #wt20q-1-twitter-share, #wt20q-2-twitter-share, #wt20q-3-twitter-share, #wt20-twitter-share").on("click touchstart", function() {
			var J = j(this).attr("data-url");
			var K = j(this).attr("data-text");
			var I = "https://twitter.com/intent/tweet?url=" + J;
			if (typeof(K) != "undefined" && K != null) {
				var I = "https://twitter.com/intent/tweet?url=" + J + "&text=" + K
			}
			j(this).attr("href", I)
		})
	};
	var k = {};
	k.init = function() {
		j("#cwc-gplus-share,#gp_link_superscroll, #wt20q-1-gplus-share, #wt20q-2-gplus-share, #wt20q-3-gplus-share, #wt20-gplus-share").on("click touchstart", function() {
			var J = j(this).attr("data-url");
			var K = j(this).attr("data-text");
			var I = "https://plus.google.com/share?url=" + J;
			j(this).attr("href", I);
			window.open(this.href, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
			return false
		})
	};
	var h = {};
	h.init = function() {
		j(".futureStars .playerNavBtn").click(function() {
			j(".futureStars .playerDropdownContainer").toggleClass("active")
		});
		j(".futureStars .playerDropdownContainer .playerDropdown li a").click(function() {
			j(".futureStars .playerDropdownContainer").removeClass("active")
		});
		var I = j(".futureStars .playerDropdownContainer").offset().top;
		var J = function() {
			var K = j(window).scrollTop();
			if (K > I) {
				j(".futureStars .playerDropdownContainer").addClass("sticky")
			} else {
				j(".futureStars .playerDropdownContainer").removeClass("sticky")
			}
		};
		J();
		j(window).scroll(function() {
			J()
		});
		for (i = 1; i < 100; i++) {
			j("#futureStarFacebook_" + i).on("click touchstart", function() {
				var K = j(this).attr("data-url");
				var L = j(this).attr("data-text");
				FB.ui({
					method: "share",
					href: K,
				}, function(M) {})
			});
			j("#futureStarTwitter_" + i).on("click touchstart", function() {
				var L = j(this).attr("data-url");
				var M = j(this).attr("data-text");
				var K = "https://twitter.com/intent/tweet?url=" + L;
				if (typeof(M) != "undefined" && M != null) {
					var K = "https://twitter.com/intent/tweet?url=" + L + "&text=" + M
				}
				j(this).attr("href", K)
			});
			j("#futureStarGPlus_" + i).on("click touchstart", function() {
				var L = j(this).attr("data-url");
				var M = j(this).attr("data-text");
				var K = "https://plus.google.com/share?url=" + L;
				j(this).attr("href", K);
				window.open(this.href, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
				return false
			})
		}
	};
	var a = {};
	a.init = function() {
		for (i = 1; i < 100; i++) {
			j("#potdu19Facebook_" + i).on("click touchstart", function() {
				var I = j(this).attr("data-url");
				var J = j(this).attr("data-text");
				FB.ui({
					method: "share",
					href: I,
				}, function(K) {})
			});
			j("#potdu19Twitter_" + i).on("click touchstart", function() {
				var J = j(this).attr("data-url");
				var K = j(this).attr("data-text");
				var I = "https://twitter.com/intent/tweet?url=" + J;
				if (typeof(K) != "undefined" && K != null) {
					var I = "https://twitter.com/intent/tweet?url=" + J + "&text=" + K
				}
				j(this).attr("href", I)
			});
			j("#potdu19GPlus_" + i).on("click touchstart", function() {
				var J = j(this).attr("data-url");
				var K = j(this).attr("data-text");
				var I = "https://plus.google.com/share?url=" + J;
				j(this).attr("href", I);
				window.open(this.href, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
				return false
			})
		}
	};
	var g = {
		init: function() {
			this.promoWT20CookieHanding()
		},
		promoWT20CookieHanding: function() {
			var J = this;
			var L = j.cookie("promo_wt20");
			var I = new Array();
			if (L != undefined) {
				var K = o.baseUrl + "/site/getWT20PromoIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".promoThumb.hh-promoThumb[data-id='" + L + "']").css({
							display: "none"
						});
						random = J.getRandomExcept(I, L);
						j(".promoThumb.hh-promoThumb[data-id='" + random + "']").css({
							display: "block"
						});
						J.setCookie("promo_wt20", random, 1)
					},
					error: function() {}
				})
			} else {
				var K = o.baseUrl + "/" + HH.Params.websiteControllerName + "/site/getWT20PromoIds";
				j.ajax({
					type: "GET",
					url: K,
					success: function(M) {
						I = JSON.parse(M);
						j(".promoThumb.hh-promoThumb[data-id='" + L + "']").css({
							display: "none"
						});
						random = J.getRandomExcept(I, L);
						j(".promoThumb.hh-promoThumb[data-id='" + random + "']").css({
							display: "block"
						});
						J.setCookie("promo_wt20", random, 1)
					},
					error: function() {}
				})
			}
		},
		setCookie: function t(I, K, J) {
			j.cookie(I, K, {
				expires: J,
				path: "/"
			})
		},
		readCookie: function(I) {
			return j.cookie(I)
		},
		getRandomExcept: function A(I, J) {
			if (I.length == 1) {
				return J
			}
			random = I[Math.floor(Math.random() * I.length)];
			if (random == J) {
				return A(I, J)
			}
			return random
		}
	};
	return {
		CMAui: o,
		ViPlayer: l,
		DropDownMenu: w,
		Videos: m,
		Photos: D,
		viewTypeSwitch: z,
		closeDropDownFollow: y,
		RotatingSponsorWidget: v,
		BuzzTrendingWidget: E,
		Footer: f,
		MultiTabWrapperWidget: B,
		getEventParam: r,
		PlayerStatsModal: p,
		CookieManager: c,
		WT20CookieManager: g,
		MobileDropdown: q,
		MobileMenuDropdown: H,
		PostToFacebook: x,
		PostToTwitter: G,
		PostToGooglePlus: k,
		FutureStar: h,
		PlayoftheDayU19: a,
		UnbindHover: F,
		SignUpForm: b,
	}
})(jQuery);
$(document).ready(function() {
	var a = HH.Frontend;
	a.CMAui.init();
	a.ViPlayer.init();
	a.Videos.init();
	a.Photos.init();
	a.ViPlayer.initShareBox();
	a.DropDownMenu.init("li.events", ".eventsDropdown");
	a.DropDownMenu.init("li.rankings", ".rankingsDropdown");
	a.DropDownMenu.init("li.teams-nav", ".teamsDropdown");
	a.DropDownMenu.init("li.fanzone-nav-wt20", ".fanzoneDropdown");
	a.DropDownMenu.init("li.fixtures-nav-wt20", ".fixturesDropdown");
	a.DropDownMenu.init("li.stats-nav-wt20", ".statsDropdown");
	a.DropDownMenu.init("li.photos-nav", ".photosDropdown");
	a.DropDownMenu.init("li.teams-nav-wt20", ".teamMenu");
	a.DropDownMenu.init("li.qualification-nav-wt20", ".qualificationDropdown");
	a.DropDownMenu.init("li.qualification-nav-wt20", ".qualificationMenu");
	a.DropDownMenu.init("li.qualification-nav-u19cwc", ".qualificationDropdown");
	a.DropDownMenu.init("li.fanzone-nav", ".fanzoneDropdown");
	a.DropDownMenu.init("li.tickets-nav", ".ticketsDropdown");
	a.DropDownMenu.init("li.about-nav", ".aboutDropdown");
	a.DropDownMenu.init("li.about-nav-wt20", ".aboutDropdown");
	a.DropDownMenu.init("li.about-nav-u19cwc", ".aboutDropdown");
	a.DropDownMenu.init("li.records-nav-u19cwc", ".recordsDropdown");
	a.DropDownMenu.init("li.more-nav", ".topNav .moreDropdown");
	a.DropDownMenu.init("#follow-us", ".menu-item-follow");
	a.DropDownMenu.init("#teams-dropdown", "#teams-dropdownList");
	a.DropDownMenu.init("#more-dropdown", "#more-dropdownList");
	a.DropDownMenu.init("#ticket-dropdown", "#ticket-dropdownList");
	a.DropDownMenu.init("#fanzone-dropdown", "#fanzone-dropdownList");
	a.DropDownMenu.init("#statistics-dropdown", "#statistics-dropdownList");
	a.DropDownMenu.init("#about-dropdown", "#about-dropdownList");
	a.DropDownMenu.init("#venues-dropdown", "#venues-dropdownList");
	a.DropDownMenu.init("#teams-dropdown", "#teamMenu");
	a.viewTypeSwitch();
	a.closeDropDownFollow();
	a.MultiTabWrapperWidget.init();
	a.MobileDropdown.init(".cwc-mobileMenuBtn", "nav.tcc-main-nav");
	a.MobileDropdown.init(".u19-mobileMenuBtn", "nav.tcc-main-nav");
	a.MobileDropdown.init(".wt20q-mobileMenuBtn", "nav.tcc-main-nav");
	a.MobileDropdown.init(".wwt20q-mobileMenuBtn", "nav.tcc-main-nav");
	a.MobileMenuDropdown.init(".wt20-mobileMenuBtn", "header.topNav");
	a.PostToFacebook.init();
	a.PostToTwitter.init();
	a.PostToGooglePlus.init();
	a.UnbindHover.init("#fanzone-dropdown");
	a.UnbindHover.init("#ticket-dropdown");
	a.UnbindHover.init("#more-dropdown");
	a.UnbindHover.init("#teams-dropdown");
	a.UnbindHover.init("#statistics-dropdown");
	a.UnbindHover.init("#about-dropdown.wt20-16-nav-about");
	a.UnbindHover.init("#venues-dropdown.wt20-16-nav-venues");
	$("#backToTop").click(function() {
		$("body, html").animate({
			scrollTop: 0
		}, "slow");
		return false
	});
	$(".subNavTitle").click(function() {
		var b = $(this);
		$(".mastSubHeader").toggleClass("open");
		$(".subNavTitle i").toggleClass("icon-angle-down icon-angle-up");
		if ($(".mastSubHeader").hasClass("open")) {
			$("body").css({
				overflow: "visible"
			})
		} else {
			$("body").css({
				overflow: "hidden"
			})
		}
	})
});

