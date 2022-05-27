		(function(a) {
			theme = {
				_init: function() {
					if (api.options.slide_links) {
						a(vars.slide_list).css("margin-left", -a(vars.slide_list).width() / 2);
					}
					if (api.options.autoplay) {
						if (api.options.progress_bar) {
							theme.progressBar();
						}
					} else {
						if (a(vars.play_button).attr("src")) {
							a(vars.play_button).attr("src", vars.image_path + "play.png");
						}
						if (api.options.progress_bar) {
							a(vars.progress_bar).stop().css({
								left: -a(window).width()
							});
						}
					}
					a(vars.thumb_tray).css({
						left: -a(vars.thumb_tray).width()
					});
					a(vars.tray_button).on("click", function() {
						var b = a(this);
						b.data("toggle", !b.data("toggle"));
						if (b.data("toggle")) {
							a(vars.thumb_tray).stop().animate({
								left: 0,
								avoidTransforms: true
							}, 300);
							a(vars.prev_slide).css("left", "130px");
							a(this).css("left", "130px");
							if (a(vars.tray_arrow).attr("src")) {
								a(vars.tray_arrow).attr("src", vars.image_path + "button-tray-down.png");
							}
						} else {
							a(vars.thumb_tray).stop().animate({
								left: -a(vars.thumb_tray).width(),
								avoidTransforms: true
							}, 300);
							a(vars.prev_slide).css("left", "10px");
							a(this).css("left", "10px");
							if (a(vars.tray_arrow).attr("src")) {
								a(vars.tray_arrow).attr("src", vars.image_path + "button-tray-up.png");
							}
						}
						return false;
					});
					a(vars.thumb_list).height(a("> li", vars.thumb_list).length * a("> li", vars.thumb_list).outerHeight(true));
					if (a(vars.slide_total).length) {
						a(vars.slide_total).html(api.options.slides.length);
					}
					if (api.options.thumb_links) {
						if (a(vars.thumb_list).innerHeight() <= a(vars.thumb_tray).height()) {
							a(vars.thumb_back + "," + vars.thumb_forward).fadeOut(0);
						}
						vars.thumb_interval = Math.floor(a(vars.thumb_tray).height() / a("> li", vars.thumb_list).outerHeight(true)) * a("> li", vars.thumb_list).outerHeight(true);
						vars.thumb_page = 0;
						a(vars.thumb_forward).on("click", function() {
							if (vars.thumb_page - vars.thumb_interval <= -a(vars.thumb_list).height()) {
								vars.thumb_page = 0;
								a(vars.thumb_list).stop().animate({
									top: vars.thumb_page
								}, {
									duration: 500,
									easing: "easeOutExpo"
								});
							} else {
								vars.thumb_page = vars.thumb_page - vars.thumb_interval;
								a(vars.thumb_list).stop().animate({
									top: vars.thumb_page
								}, {
									duration: 500,
									easing: "easeOutExpo"
								});
							}
						});
						a(vars.thumb_back).on("click", function() {
							if (vars.thumb_page + vars.thumb_interval > 0) {
								vars.thumb_page = Math.floor(a(vars.thumb_list).height() / vars.thumb_interval) * -vars.thumb_interval;
								if (a(vars.thumb_list).height() <= -vars.thumb_page) {
									vars.thumb_page = vars.thumb_page + vars.thumb_interval;
								}
								a(vars.thumb_list).stop().animate({
									top: vars.thumb_page
								}, {
									duration: 500,
									easing: "easeOutExpo"
								});
							} else {
								vars.thumb_page = vars.thumb_page + vars.thumb_interval;
								a(vars.thumb_list).stop().animate({
									top: vars.thumb_page
								}, {
									duration: 500,
									easing: "easeOutExpo"
								});
							}
						});
					}
					a(vars.next_slide).click(function() {
						api.nextSlide();
					});
					a(vars.prev_slide).click(function() {
						api.prevSlide();
					});
					if (jQuery.support.opacity) {
						a(vars.prev_slide + "," + vars.next_slide).mouseover(function() {
							a(this).stop().animate({
								opacity: 1
							}, 100);
						}).mouseout(function() {
							a(this).stop().animate({
								opacity: 0.6
							}, 100);
						});
					}
					if (api.options.thumbnail_navigation) {
						a(vars.next_thumb).click(function() {
							api.nextSlide();
						});
						a(vars.prev_thumb).click(function() {
							api.prevSlide();
						});
					}
					a(vars.play_button).click(function() {
						api.playToggle();
					});
					if (api.options.mouse_scrub) {
						a(vars.thumb_tray).mousemove(function(f) {
							var c = a(vars.thumb_tray).width(),
								g = a(vars.thumb_list).width();
							if (g > c) {
								var b = 1,
									d = f.pageX - b;
								if (d > 10 || d < -10) {
									b = f.pageX;
									newX = (c - g) * (f.pageX / c);
									d = parseInt(Math.abs(parseInt(a(vars.thumb_list).css("left")) - newX)).toFixed(0);
									a(vars.thumb_list).stop().animate({
										left: newX
									}, {
										duration: d * 3,
										easing: "easeOutExpo"
									});
								}
							}
						});
					}
					a(window).resize(function() {
						if (api.options.progress_bar && !vars.in_animation) {
							if (vars.slideshow_interval) {
								clearInterval(vars.slideshow_interval);
							}
							if (api.options.slides.length - 1 > 0) {
								clearInterval(vars.slideshow_interval);
							}
							a(vars.progress_bar).stop().css({
								left: -a(window).width()
							});
							if (!vars.progressDelay && api.options.slideshow) {
								vars.progressDelay = setTimeout(function() {
									if (!vars.is_paused) {
										theme.progressBar();
										vars.slideshow_interval = setInterval(api.nextSlide, api.options.slide_interval);
									}
									vars.progressDelay = false;
								}, 1000);
							}
						}
						if (api.options.thumb_links && vars.thumb_tray.length) {
							vars.thumb_page = 0;
							vars.thumb_interval = Math.floor(a(vars.thumb_tray).height() / a("> li", vars.thumb_list).outerHeight(true)) * a("> li", vars.thumb_list).outerHeight(true);
							if (a(vars.thumb_list).height() > a(vars.thumb_tray).height()) {
								a(vars.thumb_back + "," + vars.thumb_forward).fadeIn("fast");
								a(vars.thumb_list).stop().animate({
									top: 0
								}, 200);
							} else {
								a(vars.thumb_back + "," + vars.thumb_forward).fadeOut("fast");
							}
						}
					});
				},
				goTo: function() {
					if (api.options.progress_bar && !vars.is_paused) {
						a(vars.progress_bar).stop().css({
							left: -a(window).width()
						});
						theme.progressBar();
					}
				},
				playToggle: function(b) {
					if (b == "play") {
						if (a(vars.play_button).attr("src")) {
							a(vars.play_button).attr("src", vars.image_path + "pause.png");
						}
						if (api.options.progress_bar && !vars.is_paused) {
							theme.progressBar();
						}
					} else {
						if (b == "pause") {
							if (a(vars.play_button).attr("src")) {
								a(vars.play_button).attr("src", vars.image_path + "play.png");
							}
							if (api.options.progress_bar && vars.is_paused) {
								a(vars.progress_bar).stop().css({
									left: -a(window).width()
								});
							}
						}
					}
				},
				beforeAnimation: function(c) {
					if (api.options.progress_bar && !vars.is_paused) {
						a(vars.progress_bar).stop().css({
							left: -a(window).width()
						});
					}
					if (a(vars.slide_caption).length) {
						var b = api.getField("title");
						(api.getField("title")) ? a(vars.slide_caption).html(api.getField("title")): a(vars.slide_caption).html("");
					}
					if (vars.slide_current.length) {
						a(vars.slide_current).html(vars.current_slide + 1);
					}
					if (api.options.thumb_links) {
						a(".current-thumb").removeClass("current-thumb");
						a("li", vars.thumb_list).eq(vars.current_slide).addClass("current-thumb");
						if (a(vars.thumb_list).width() > a(vars.thumb_tray).width()) {
							if (c == "next") {
								if (vars.current_slide == '0') {
									vars.thumb_page = 0;
									a(vars.thumb_list).stop().animate({
										left: vars.thumb_page
									}, {
										duration: 500,
										easing: "easeOutExpo"
									});
								} else {
									if (a(".current-thumb").offset().left - a(vars.thumb_tray).offset().left >= vars.thumb_interval) {
										vars.thumb_page = vars.thumb_page - vars.thumb_interval;
										a(vars.thumb_list).stop().animate({
											left: vars.thumb_page
										}, {
											duration: 500,
											easing: "easeOutExpo"
										});
									}
								}
							} else {
								if (c == "prev") {
									if (vars.current_slide == api.options.slides.length - 1) {
										vars.thumb_page = Math.floor(a(vars.thumb_list).width() / vars.thumb_interval) * -vars.thumb_interval;
										if (a(vars.thumb_list).width() <= -vars.thumb_page) {
											vars.thumb_page = vars.thumb_page + vars.thumb_interval;
										}
										a(vars.thumb_list).stop().animate({
											left: vars.thumb_page
										}, {
											duration: 500,
											easing: "easeOutExpo"
										});
									} else {
										if (a(".current-thumb").offset().left - a(vars.thumb_tray).offset().left < 0) {
											if (vars.thumb_page + vars.thumb_interval > 0) {
												return false;
											}
											vars.thumb_page = vars.thumb_page + vars.thumb_interval;
											a(vars.thumb_list).stop().animate({
												left: vars.thumb_page
											}, {
												duration: 500,
												easing: "easeOutExpo"
											});
										}
									}
								}
							}
						}
					}
				},
				afterAnimation: function() {
					if (api.options.progress_bar && !vars.is_paused) {
						theme.progressBar();
					}
				},
				progressBar: function() {
					a(vars.progress_bar).stop().css({
						left: -a(window).width()
					}).animate({
						left: 0
					}, api.options.slide_interval);
				}
			};
			a.supersized.themeVars = {
				progress_delay: false,
				thumb_page: false,
				thumb_interval: false,
				image_path: "../i/1/elements/supersized_img",
				play_button: "#pauseplay",
				next_slide: "#nextslide",
				prev_slide: "#prevslide",
				next_thumb: "#nextthumb",
				prev_thumb: "#prevthumb",
				slide_caption: "#slidecaption",
				slide_current: ".slidenumber",
				slide_total: ".totalslides",
				slide_list: "#slide-list",
				thumb_tray: "#thumb-tray",
				thumb_list: "#thumb-list",
				thumb_forward: "#thumb-forward",
				thumb_back: "#thumb-back",
				tray_arrow: "#tray-arrow",
				tray_button: "#tray-button",
				progress_bar: "#progress-bar",
				fb_link: "#fb_link_superscroll",
				tw_link: "#tw_link_superscroll",
				gp_link: "#gp_link_superscroll",
				mail_link: "#mail_link_superscroll"
			};
			a.supersized.themeOptions = {
				progress_bar: 1,
				mouse_scrub: 0
			};
		})(jQuery);