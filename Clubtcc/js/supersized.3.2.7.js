(function(a) {
	a(document).ready(function() {
		container_id = ".photo-overlay-relative";
		a(container_id).append('<div id="supersized-loader"></div><ul id="supersized"></ul>')
	});
	a.supersized = function(b) {
		var c = b.container + " #supersized",
			d = this;
		a.supersized.vars.thumb_tray = b.container + " " + a.supersized.vars.thumb_tray;
		a.supersized.vars.thumb_list = b.container + " " + a.supersized.vars.thumb_list;
		a.supersized.vars.slide_list = b.container + " " + a.supersized.vars.slide_list;
		d.$el = a(c);
		if (d.$el.length == 0) {
			return
		}
		d.el = c;
		vars = a.supersized.vars;
		d.$el.data("supersized", d);
		api = d.$el.data("supersized");
		d.init = function() {
			a.supersized.vars = a.extend(a.supersized.vars, a.supersized.themeVars);
			a.supersized.vars.thumb_tray = b.container + " " + a.supersized.vars.thumb_tray;
			a.supersized.vars.thumb_list = b.container + " " + a.supersized.vars.thumb_list;
			a.supersized.vars.slide_list = b.container + " " + a.supersized.vars.slide_list;
			a.supersized.vars.play_button = b.container + " " + a.supersized.vars.play_button;
			a.supersized.vars.next_slide = b.container + " " + a.supersized.vars.next_slide;
			a.supersized.vars.prev_slide = b.container + " " + a.supersized.vars.prev_slide;
			a.supersized.vars.next_thumb = b.container + " " + a.supersized.vars.next_thumb;
			a.supersized.vars.prev_thumb = b.container + " " + a.supersized.vars.prev_thumb;
			a.supersized.vars.slide_caption = b.container + " " + a.supersized.vars.slide_caption;
			a.supersized.vars.slide_current = b.container + " " + a.supersized.vars.slide_current;
			a.supersized.vars.slide_total = b.container + " " + a.supersized.vars.slide_total;
			a.supersized.vars.thumb_forward = b.container + " " + a.supersized.vars.thumb_forward;
			a.supersized.vars.thumb_back = b.container + " " + a.supersized.vars.thumb_back;
			a.supersized.vars.tray_arrow = b.container + " " + a.supersized.vars.tray_arrow;
			a.supersized.vars.tray_button = b.container + " " + a.supersized.vars.tray_button;
			a.supersized.vars.progress_bar = b.container + " " + a.supersized.vars.progress_bar;
			a.supersized.vars.options = a.extend({}, a.supersized.defaultOptions, a.supersized.themeOptions, b);
			d.options = a.supersized.vars.options;
			d._build()
		};
		d._build = function() {
			var h = 0,
				e = "",
				k = "",
				i, f = "",
				j;
			if (d.options.mode == "video") {
				d.$el.addClass("supersized-video-content")
			}
			while (h <= d.options.slides.length - 1) {
				switch (d.options.slide_links) {
					case "num":
						i = h;
						break;
					case "name":
						i = d.options.slides[h].title;
						break;
					case "blank":
						i = "";
						break
				}
				e = e + '<li class="slide-' + h + '"></li>';
				if (h == d.options.start_slide - 1) {
					if (d.options.slide_links) {
						k = k + '<li class="slide-link-' + h + ' current-slide"><a>' + i + "</a></li>"
					}
					if (d.options.thumb_links) {
						d.options.slides[h].thumb ? j = d.options.slides[h].thumb : j = d.options.slides[h].image;
						f = f + '<li class="thumb' + h + ' current-thumb"><img src="' + j + '"/><div class="green_overlay"></div></li>'
					}
				} else {
					if (d.options.slide_links) {
						k = k + '<li class="slide-link-' + h + '" ><a>' + i + "</a></li>"
					}
					if (d.options.thumb_links) {
						d.options.slides[h].thumb ? j = d.options.slides[h].thumb : j = d.options.slides[h].image;
						f = f + '<li class="thumb' + h + '"><img src="' + j + '"/><div class="green_overlay"></div></li>'
					}
				}
				h++
			}
			if (d.options.slide_links) {
				a(vars.slide_list).html(k)
			}
			if (d.options.thumb_links && vars.thumb_tray.length) {
				var g = vars.thumb_list.replace(b.container + " #", "");
				a(vars.thumb_tray).append('<ul id="' + g + '">' + f + "</ul>")
			}
			a(d.el).append(e);
			if (d.options.thumbnail_navigation) {
				vars.current_slide - 1 < 0 ? prevThumb = d.options.slides.length - 1 : prevThumb = vars.current_slide - 1;
				a(vars.prev_thumb).show().html(a("<img/>").attr("src", d.options.slides[prevThumb].image));
				vars.current_slide == d.options.slides.length - 1 ? nextThumb = 0 : nextThumb = vars.current_slide + 1;
				a(vars.next_thumb).show().html(a("<img/>").attr("src", d.options.slides[nextThumb].image))
			}
			d._start()
		};
		d._start = function() {
			if (d.options.start_slide) {
				vars.current_slide = d.options.start_slide - 1
			} else {
				vars.current_slide = Math.floor(Math.random() * d.options.slides.length)
			}
			var s = d.options.new_window ? ' target="_blank"' : "";
			if (d.options.performance == 3) {
				d.$el.addClass("speed")
			} else {
				if ((d.options.performance == 1) || (d.options.performance == 2)) {
					d.$el.addClass("quality")
				}
			} if (d.options.random) {
				arr = d.options.slides;
				for (var m, q, o = arr.length; o; m = parseInt(Math.random() * o), q = arr[--o], arr[o] = arr[m], arr[m] = q) {}
				d.options.slides = arr
			}
			if (d.options.slides.length > 1) {
				if (d.options.slides.length > 2) {
					vars.current_slide - 1 < 0 ? loadPrev = d.options.slides.length - 1 : loadPrev = vars.current_slide - 1;
					if (d.options.mode == "video") {
						var l = a('<source src="' + d.options.slides[loadPrev].video + '" type="video/mp4">');
						var r = d.el + " li:eq(" + loadPrev + ")";
						l.appendTo(r).wrap('<video width="100%" height="100%" controls></video>').parent().parent().addClass("image-loading prevslide")
					} else {
						var h = (d.options.slides[loadPrev].url) ? "href='" + d.options.slides[loadPrev].url + "'" : "";
						var u = a('<img src="' + d.options.slides[loadPrev].image + '"/>');
						var r = d.el + " li:eq(" + loadPrev + ")";
						u.appendTo(r).wrap("<a " + h + s + "></a>").parent().parent().addClass("image-loading prevslide");
						u.load(function() {
							a(this).data("origWidth", a(this).width()).data("origHeight", a(this).height());
							d.resizeNow()
						})
					}
				}
			} else {
				d.options.slideshow = 0
			} if (d.options.mode == "video") {
				var e = a('<source src="' + api.getField("video") + '" type="video/mp4">');
				var g = d.el + " li:eq(" + vars.current_slide + ")";
				e.appendTo(g).wrap('<video width="100%" height="100%" controls></video>').parent().parent().addClass("image-loading activeslide");
				var k = a(g).find("video").get(0);
				k.load();
				k.addEventListener("loadeddata", function() {
					console.log("Loaded the video's data!");
					d.launch();
					if (typeof theme != "undefined" && typeof theme._init == "function") {
						theme._init()
					}
				}, false)
			} else {
				h = (api.getField("url")) ? "href='" + api.getField("url") + "'" : "";
				var n = a('<img src="' + api.getField("image") + '"/>');
				var g = d.el + " li:eq(" + vars.current_slide + ")";
				n.appendTo(g).wrap("<a " + h + s + "></a>").parent().parent().addClass("image-loading activeslide");
				n.load(function() {
					d._origDim(a(this));
					d.resizeNow();
					d.launch();
					if (typeof theme != "undefined" && typeof theme._init == "function") {
						theme._init()
					}
				})
			} if (d.options.slides.length > 1) {
				vars.current_slide == d.options.slides.length - 1 ? loadNext = 0 : loadNext = vars.current_slide + 1;
				if (d.options.mode == "video") {
					var p = a('<source src="' + d.options.slides[loadNext].video + '">');
					var t = d.el + " li:eq(" + loadNext + ")";
					p.appendTo(t).wrap('<video width="100%" height="100%" controls></video>').parent().parent().addClass("image-loading")
				} else {
					h = (d.options.slides[loadNext].url) ? "href='" + d.options.slides[loadNext].url + "'" : "";
					var f = a('<img src="' + d.options.slides[loadNext].image + '"/>');
					var t = d.el + " li:eq(" + loadNext + ")";
					f.appendTo(t).wrap("<a " + h + s + "></a>").parent().parent().addClass("image-loading");
					f.load(function() {
						a(this).data("origWidth", a(this).width()).data("origHeight", a(this).height());
						d.resizeNow()
					})
				}
			}
			d.$el.css("visibility", "hidden");
			a(".load-item").hide()
		};
		d.launch = function() {
			d.$el.css("visibility", "visible");
			a("#supersized-loader").remove();
			if (typeof theme != "undefined" && typeof theme.beforeAnimation == "function") {
				theme.beforeAnimation("next")
			}
			a(".load-item").show();
			if (d.options.keyboard_nav) {
				a(document.documentElement).keyup(function(e) {
					if (vars.in_animation) {
						return false
					}
					if (a(document.activeElement).is("input, textarea")) {
						return false
					}
					if ((e.keyCode == 37) || (e.keyCode == 40)) {
						clearInterval(vars.slideshow_interval);
						d.prevSlide()
					} else {
						if ((e.keyCode == 39) || (e.keyCode == 38)) {
							clearInterval(vars.slideshow_interval);
							d.nextSlide()
						} else {
							if (e.keyCode == 32 && !vars.hover_pause) {
								clearInterval(vars.slideshow_interval);
								d.playToggle()
							}
						}
					}
				})
			}
			if (d.options.slideshow && d.options.pause_hover) {
				a(d.el).hover(function() {
					if (vars.in_animation) {
						return false
					}
					vars.hover_pause = true;
					if (!vars.is_paused) {
						vars.hover_pause = "resume";
						d.playToggle()
					}
				}, function() {
					if (vars.hover_pause == "resume") {
						d.playToggle();
						vars.hover_pause = false
					}
				})
			}
			if (d.options.slide_links) {
				a(vars.slide_list + "> li").click(function() {
					index = a(vars.slide_list + "> li").index(this);
					targetSlide = index + 1;
					d.goTo(targetSlide);
					return false
				})
			}
			if (d.options.thumb_links) {
				a(vars.thumb_list + "> li").click(function() {
					index = a(vars.thumb_list + "> li").index(this);
					targetSlide = index + 1;
					api.goTo(targetSlide);
					return false
				})
			}
			if (d.options.slideshow && d.options.slides.length > 1) {
				if (d.options.autoplay && d.options.slides.length > 1) {
					vars.slideshow_interval = setInterval(d.nextSlide, d.options.slide_interval)
				} else {
					vars.is_paused = true
				}
				a(".load-item img").bind("contextmenu mousedown", function() {
					return false
				})
			}
			a(window).resize(function() {
				d.resizeNow()
			})
		};
		d.resizeNow = function() {
			return d.$el.each(function() {
				a("img", d.el).each(function() {
					thisSlide = a(this);
					var f = (thisSlide.data("origHeight") / thisSlide.data("origWidth")).toFixed(2);
					var e = d.$el.width(),
						h = d.$el.height(),
						i;
					if (d.options.fit_always) {
						if ((h / e) > f) {
							g()
						} else {
							j()
						}
					} else {
						if ((h <= d.options.min_height) && (e <= d.options.min_width)) {
							if ((h / e) > f) {
								d.options.fit_landscape && f < 1 ? g(true) : j(true)
							} else {
								d.options.fit_portrait && f >= 1 ? j(true) : g(true)
							}
						} else {
							if (e <= d.options.min_width) {
								if ((h / e) > f) {
									d.options.fit_landscape && f < 1 ? g(true) : j()
								} else {
									d.options.fit_portrait && f >= 1 ? j() : g(true)
								}
							} else {
								if (h <= d.options.min_height) {
									if ((h / e) > f) {
										d.options.fit_landscape && f < 1 ? g() : j(true)
									} else {
										d.options.fit_portrait && f >= 1 ? j(true) : g()
									}
								} else {
									if ((h / e) > f) {
										d.options.fit_landscape && f < 1 ? g() : j()
									} else {
										d.options.fit_portrait && f >= 1 ? j() : g()
									}
								}
							}
						}
					}

					function g(k) {
						if (k) {
							if (thisSlide.width() < e || thisSlide.width() < d.options.min_width) {
								if (thisSlide.width() * f >= d.options.min_height) {
									thisSlide.width(d.options.min_width);
									thisSlide.height(thisSlide.width() * f)
								} else {
									j()
								}
							}
						} else {
							if (d.options.min_height >= h && !d.options.fit_landscape) {
								if (e * f >= d.options.min_height || (e * f >= d.options.min_height && f <= 1)) {
									thisSlide.width(e);
									thisSlide.height(e * f)
								} else {
									if (f > 1) {
										thisSlide.height(d.options.min_height);
										thisSlide.width(thisSlide.height() / f)
									} else {
										if (thisSlide.width() < e) {
											thisSlide.width(e);
											thisSlide.height(thisSlide.width() * f)
										}
									}
								}
							} else {
								thisSlide.width(e);
								thisSlide.height(e * f)
							}
						}
					}

					function j(k) {
						if (k) {
							if (thisSlide.height() < h) {
								if (thisSlide.height() / f >= d.options.min_width) {
									thisSlide.height(d.options.min_height);
									thisSlide.width(thisSlide.height() / f)
								} else {
									g(true)
								}
							}
						} else {
							if (d.options.min_width >= e) {
								if (h / f >= d.options.min_width || f > 1) {
									thisSlide.height(h);
									thisSlide.width(h / f)
								} else {
									if (f <= 1) {
										thisSlide.width(d.options.min_width);
										thisSlide.height(thisSlide.width() * f)
									}
								}
							} else {
								thisSlide.height(h);
								thisSlide.width(h / f)
							}
						}
					}
					if (thisSlide.parents("li").hasClass("image-loading")) {
						a(".image-loading").removeClass("image-loading")
					}
					if (d.options.horizontal_center) {
						a(this).css("left", (e - a(this).width()) / 2)
					}
					if (d.options.vertical_center) {
						a(this).css("top", (h - a(this).height()) / 2)
					}
				});
				if (d.options.image_protect) {
					a("img", d.el).bind("contextmenu mousedown", function() {
						return false
					})
				}
				return false
			})
		};
		d.nextSlide = function() {
			if (vars.in_animation || !api.options.slideshow) {
				return false
			} else {
				vars.in_animation = true
			}
			clearInterval(vars.slideshow_interval);
			var h = d.options.slides,
				e = d.$el.find(".activeslide");
			a(".prevslide").removeClass("prevslide");
			e.removeClass("activeslide").addClass("prevslide");
			vars.current_slide + 1 == d.options.slides.length ? vars.current_slide = 0 : vars.current_slide++;
			var g = a(d.el + " li:eq(" + vars.current_slide + ")"),
				i = d.$el.find(".prevslide");
			if (d.options.performance == 1) {
				d.$el.removeClass("quality").addClass("speed")
			}
			loadSlide = false;
			vars.current_slide == d.options.slides.length - 1 ? loadSlide = 0 : loadSlide = vars.current_slide + 1;
			var k = d.el + " li:eq(" + loadSlide + ")";
			if (!a(k).html()) {
				var j = d.options.new_window ? ' target="_blank"' : "";
				imageLink = (d.options.slides[loadSlide].url) ? "href='" + d.options.slides[loadSlide].url + "'" : "";
				var f = a('<img src="' + d.options.slides[loadSlide].image + '"/>');
				f.appendTo(k).wrap("<a " + imageLink + j + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
				f.load(function() {
					d._origDim(a(this));
					d.resizeNow()
				})
			}
			if (d.options.thumbnail_navigation == 1) {
				vars.current_slide - 1 < 0 ? prevThumb = d.options.slides.length - 1 : prevThumb = vars.current_slide - 1;
				a(vars.prev_thumb).html(a("<img/>").attr("src", d.options.slides[prevThumb].image));
				nextThumb = loadSlide;
				a(vars.next_thumb).html(a("<img/>").attr("src", d.options.slides[nextThumb].image))
			}
			if (typeof theme != "undefined" && typeof theme.beforeAnimation == "function") {
				theme.beforeAnimation("next")
			}
			if (d.options.slide_links) {
				a(".current-slide").removeClass("current-slide");
				a(vars.slide_list + "> li").eq(vars.current_slide).addClass("current-slide")
			}
			g.css("visibility", "hidden").addClass("activeslide");
			switch (d.options.transition) {
				case 0:
				case "none":
					g.css("visibility", "visible");
					vars.in_animation = false;
					d.afterAnimation();
					break;
				case 1:
				case "fade":
					g.css({
						opacity: 0,
						visibility: "visible"
					}).animate({
						opacity: 1,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 2:
				case "slideTop":
					g.css({
						top: -d.$el.height(),
						visibility: "visible"
					}).animate({
						top: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 3:
				case "slideRight":
					g.css({
						left: d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 4:
				case "slideBottom":
					g.css({
						top: d.$el.height(),
						visibility: "visible"
					}).animate({
						top: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 5:
				case "slideLeft":
					g.css({
						left: -d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 6:
				case "carouselRight":
					g.css({
						left: d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					e.animate({
						left: -d.$el.width(),
						avoidTransforms: false
					}, d.options.transition_speed);
					break;
				case 7:
				case "carouselLeft":
					g.css({
						left: -d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					e.animate({
						left: d.$el.width(),
						avoidTransforms: false
					}, d.options.transition_speed);
					break
			}
			return false
		};
		d.prevSlide = function() {
			if (vars.in_animation || !api.options.slideshow) {
				return false
			} else {
				vars.in_animation = true
			}
			clearInterval(vars.slideshow_interval);
			var e = d.options.slides,
				h = d.$el.find(".activeslide");
			a(".prevslide").removeClass("prevslide");
			h.removeClass("activeslide").addClass("prevslide");
			vars.current_slide == 0 ? vars.current_slide = d.options.slides.length - 1 : vars.current_slide--;
			var k = a(d.el + " li:eq(" + vars.current_slide + ")"),
				i = d.$el.find(".prevslide");
			if (d.options.performance == 1) {
				d.$el.removeClass("quality").addClass("speed")
			}
			loadSlide = vars.current_slide;
			var m = d.el + " li:eq(" + loadSlide + ")";
			if (!a(m).html()) {
				var l = d.options.new_window ? ' target="_blank"' : "";
				imageLink = (d.options.slides[loadSlide].url) ? "href='" + d.options.slides[loadSlide].url + "'" : "";
				var j = a('<img src="' + d.options.slides[loadSlide].image + '"/>');
				var g = d.options.slides[loadSlide].social ? "&quot;" + d.options.slides[loadSlide].social + "&quot;" : "";
				var f = a('<div class="supersized-social"><a onclick="PULSE.CLIENT.TwitterController.publishEvent(' + g + ');" class="ss-social-tw"></a><a onclick="PULSE.CLIENT.FacebookController.publishEvent(' + g + ');" class="ss-social-fb"></a><a onclick="PULSE.CLIENT.GooglePlusController.publishEvent(' + g + ');" class="ss-social-gp"></a></div>');
				f.appendTo(m);
				j.appendTo(m).wrap("<a " + imageLink + l + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
				j.load(function() {
					d._origDim(a(this));
					d.resizeNow()
				})
			}
			if (d.options.thumbnail_navigation == 1) {
				loadSlide == 0 ? prevThumb = d.options.slides.length - 1 : prevThumb = loadSlide - 1;
				a(vars.prev_thumb).html(a("<img/>").attr("src", d.options.slides[prevThumb].image));
				vars.current_slide == d.options.slides.length - 1 ? nextThumb = 0 : nextThumb = vars.current_slide + 1;
				a(vars.next_thumb).html(a("<img/>").attr("src", d.options.slides[nextThumb].image))
			}
			if (typeof theme != "undefined" && typeof theme.beforeAnimation == "function") {
				theme.beforeAnimation("prev")
			}
			if (d.options.slide_links) {
				a(".current-slide").removeClass("current-slide");
				a(vars.slide_list + "> li").eq(vars.current_slide).addClass("current-slide")
			}
			k.css("visibility", "hidden").addClass("activeslide");
			switch (d.options.transition) {
				case 0:
				case "none":
					k.css("visibility", "visible");
					vars.in_animation = false;
					d.afterAnimation();
					break;
				case 1:
				case "fade":
					k.css({
						opacity: 0,
						visibility: "visible"
					}).animate({
						opacity: 1,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 2:
				case "slideTop":
					k.css({
						top: d.$el.height(),
						visibility: "visible"
					}).animate({
						top: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 3:
				case "slideRight":
					k.css({
						left: -d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 4:
				case "slideBottom":
					k.css({
						top: -d.$el.height(),
						visibility: "visible"
					}).animate({
						top: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 5:
				case "slideLeft":
					k.css({
						left: d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					break;
				case 6:
				case "carouselRight":
					k.css({
						left: -d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					h.css({
						left: 0
					}).animate({
						left: d.$el.width(),
						avoidTransforms: false
					}, d.options.transition_speed);
					break;
				case 7:
				case "carouselLeft":
					k.css({
						left: d.$el.width(),
						visibility: "visible"
					}).animate({
						left: 0,
						avoidTransforms: false
					}, d.options.transition_speed, function() {
						d.afterAnimation()
					});
					h.css({
						left: 0
					}).animate({
						left: -d.$el.width(),
						avoidTransforms: false
					}, d.options.transition_speed);
					break
			}
			return false
		};
		d.playToggle = function() {
			if (vars.in_animation || !api.options.slideshow) {
				return false
			}
			if (vars.is_paused) {
				vars.is_paused = false;
				if (typeof theme != "undefined" && typeof theme.playToggle == "function") {
					theme.playToggle("play")
				}
				vars.slideshow_interval = setInterval(d.nextSlide, d.options.slide_interval)
			} else {
				vars.is_paused = true;
				if (typeof theme != "undefined" && typeof theme.playToggle == "function") {
					theme.playToggle("pause")
				}
				clearInterval(vars.slideshow_interval)
			}
			return false
		};
		d.goTo = function(f) {
			if (vars.in_animation || !api.options.slideshow) {
				return false
			}
			var e = d.options.slides.length;
			if (f < 0) {
				f = e
			} else {
				if (f > e) {
					f = 1
				}
			}
			f = e - f + 1;
			clearInterval(vars.slideshow_interval);
			if (typeof theme != "undefined" && typeof theme.goTo == "function") {
				theme.goTo()
			}
			if (vars.current_slide == e - f) {
				if (!(vars.is_paused)) {
					vars.slideshow_interval = setInterval(d.nextSlide, d.options.slide_interval)
				}
				return false
			}
			if (e - f > vars.current_slide) {
				vars.current_slide = e - f - 1;
				vars.update_images = "next";
				d._placeSlide(vars.update_images)
			} else {
				if (e - f < vars.current_slide) {
					vars.current_slide = e - f + 1;
					vars.update_images = "prev";
					d._placeSlide(vars.update_images)
				}
			} if (d.options.slide_links) {
				a(vars.slide_list + "> .current-slide").removeClass("current-slide");
				a(vars.slide_list + "> li").eq((e - f)).addClass("current-slide")
			}
			if (d.options.thumb_links) {
				a(vars.thumb_list + "> .current-thumb").removeClass("current-thumb");
				a(vars.thumb_list + "> li").eq((e - f)).addClass("current-thumb")
			}
		};
		d._placeSlide = function(e) {
			var h = d.options.new_window ? ' target="_blank"' : "";
			loadSlide = false;
			if (e == "next") {
				vars.current_slide == d.options.slides.length - 1 ? loadSlide = 0 : loadSlide = vars.current_slide + 1;
				var g = d.el + " li:eq(" + loadSlide + ")";
				if (!a(g).html()) {
					var h = d.options.new_window ? ' target="_blank"' : "";
					imageLink = (d.options.slides[loadSlide].url) ? "href='" + d.options.slides[loadSlide].url + "'" : "";
					var f = a('<img src="' + d.options.slides[loadSlide].image + '"/>');
					f.appendTo(g).wrap("<a " + imageLink + h + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
					f.load(function() {
						d._origDim(a(this));
						d.resizeNow()
					})
				}
				d.nextSlide()
			} else {
				if (e == "prev") {
					vars.current_slide - 1 < 0 ? loadSlide = d.options.slides.length - 1 : loadSlide = vars.current_slide - 1;
					var g = d.el + " li:eq(" + loadSlide + ")";
					if (!a(g).html()) {
						var h = d.options.new_window ? ' target="_blank"' : "";
						imageLink = (d.options.slides[loadSlide].url) ? "href='" + d.options.slides[loadSlide].url + "'" : "";
						var f = a('<img src="' + d.options.slides[loadSlide].image + '"/>');
						f.appendTo(g).wrap("<a " + imageLink + h + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
						f.load(function() {
							d._origDim(a(this));
							d.resizeNow()
						})
					}
					d.prevSlide()
				}
			}
		};
		d._origDim = function(e) {
			e.data("origWidth", e.width()).data("origHeight", e.height())
		};
		d.afterAnimation = function() {
			if (d.options.performance == 1) {
				d.$el.removeClass("speed").addClass("quality")
			}
			if (vars.update_images) {
				vars.current_slide - 1 < 0 ? setPrev = d.options.slides.length - 1 : setPrev = vars.current_slide - 1;
				vars.update_images = false;
				a(".prevslide").removeClass("prevslide");
				a(d.el + " li:eq(" + setPrev + ")").addClass("prevslide")
			}
			vars.in_animation = false;
			if (!vars.is_paused && d.options.slideshow) {
				vars.slideshow_interval = setInterval(d.nextSlide, d.options.slide_interval);
				if (d.options.stop_loop && vars.current_slide == d.options.slides.length - 1) {
					d.playToggle()
				}
			}
			if (typeof theme != "undefined" && typeof theme.afterAnimation == "function") {
				theme.afterAnimation()
			}
			return false
		};
		d.getField = function(e) {
			return d.options.slides[vars.current_slide][e]
		};
		d.init()
	};
	a.supersized.vars = {
		thumb_tray: "#thumb-tray",
		thumb_list: "#thumb-list",
		slide_list: "#slide-list",
		current_slide: 0,
		in_animation: false,
		is_paused: false,
		hover_pause: false,
		slideshow_interval: false,
		update_images: false,
		options: {}
	};
	a.supersized.defaultOptions = {
		slideshow: 1,
		autoplay: 1,
		start_slide: 1,
		stop_loop: 0,
		random: 0,
		slide_interval: 5000,
		transition: 1,
		transition_speed: 750,
		new_window: 1,
		pause_hover: 0,
		keyboard_nav: 1,
		performance: 1,
		image_protect: 1,
		fit_always: 0,
		fit_landscape: 0,
		fit_portrait: 1,
		min_width: 0,
		min_height: 0,
		horizontal_center: 1,
		vertical_center: 1,
		slide_links: 1,
		thumb_links: 1,
		thumbnail_navigation: 0
	};
	a.fn.supersized = function(b) {
		return this.each(function() {
			(new a.supersized(b))
		})
	}
})(jQuery);