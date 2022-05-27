if (!PULSE) {
	var PULSE = {};
}
if (!PULSE.CLIENT) {
	PULSE.CLIENT = {};
}
PULSE.CLIENT.SUPERSIZED = function(a, b) {
	this.container = a;
	this.mode = b;
	this.$overlayContainer = $(a + ".photo-overlay");
	if (this.$overlayContainer) {
		if (this.$overlayContainer.length < 1) {
			this.$overlayContainer = $(a + " .photo-overlay-relative");
		}
	}
	this.$supersizedContainer = this.$overlayContainer.find("#supersized");
	this.$thumbList = this.$overlayContainer.find("#thumb-list");
	this.$closeButton = this.$overlayContainer.find("#close-button");
	this.$fullscreenButton = this.$overlayContainer.find("#fullscreen-button");
	this.$trayButton = this.$overlayContainer.find("#tray-button");
	this.$backButton = this.$overlayContainer.find("#prevslide");
	this.$nextButton = this.$overlayContainer.find("#nextslide");
	this.$actionUrl;
	this.addlistener();
};
PULSE.CLIENT.SUPERSIZED.prototype.openModal = function(b, a, c) {
	$("body").css("overflow", "hidden");
	$("body").css("position", "fixed");
	$("#photomodal").css("overflow", "hidden");
	var d = [];
	this.$actionUrl = c;
	this.updateSocialLinks();
	if ($(".supersizedModal img").length) {
		$(".supersizedModal").each(function(f) {
			var e = {
				image: $(this).data("url"),
				title: "<p>" + $(this).data("photo-caption") + "</p>",
				thumb: $(this).data("thumb"),
				url: "",
				social: $(this).data("superscroll-social")
			};
			d.push(e);
		});
	} else {
		$.ajax({
			url: HH.Params.baseUrl + "/" + HH.Params.websiteUrl + "/photos/getGalleryData",
			async: false,
			data: {
				galleryId: b
			},
			type: "GET",
			success: function(f) {
				var e = JSON.parse(f);
				$.each(e, function(h, i) {
					var g = {
						image: i.url,
						title: "<p>" + i.headline + "</p>",
						thumb: i.url,
						url: "",
					};
					d.push(g);
				});
			}
		});
	}
	this.data = d;
	this.$overlayContainer.show();
	this.initialize(a);
};
PULSE.CLIENT.SUPERSIZED.prototype.addlistener = function() {
	var a = this;
	this.$closeButton.bind("click", function() {
		$("body").css("overflow", "scroll");
		$("body").css("position", "relative");
		a.exitFullscreen();
		a.closeOverlay();
	});
	if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
		this.$fullscreenButton.bind("click", function() {
			a.toggleFullscreen();
		});
	} else {
		this.$fullscreenButton.hide();
	}
	$(".socialBox ").bind("hover", function() {
		var c = $(".activeslide img").attr("src");
		var e = c.split("/");
		var d = e[e.length - 1];
		imageId = d.replace(".jpg", "");
		$urlParts = a.$actionUrl.split("/");
		var b = $.inArray("photos", $urlParts) + 3;
		$urlParts[b] = imageId;
		a.$actionUrl = $urlParts.join("/");
		a.updateSocialLinks();
	});
	this.$backButton.bind("click", function() {
		var c = $(".activeslide img").attr("src");
		var e = c.split("/");
		var d = e[e.length - 1];
		imageId = d.replace(".jpg", "");
		$urlParts = a.$actionUrl.split("/");
		var b = $.inArray("photos", $urlParts) + 3;
		$urlParts[b] = imageId;
		a.$actionUrl = $urlParts.join("/");
		a.updateSocialLinks();
	});
};
PULSE.CLIENT.SUPERSIZED.prototype.updateSocialLinks = function() {
	$("#fb_link_superscroll").attr("data-url", this.$actionUrl);
	$("#tw_link_superscroll").attr("data-url", this.$actionUrl);
	$("#gp_link_superscroll").attr("data-url", this.$actionUrl);
	$("#mail_link_superscroll").attr("href", "mailto:?body=" + this.$actionUrl);
};
PULSE.CLIENT.SUPERSIZED.prototype.closeOverlay = function() {
	this.$overlayContainer.hide();
	this.$overlayContainer.find("#thumb-tray").empty().append('<div id="thumb-back"></div><div id="thumb-forward"></div>');
	this.$supersizedContainer.empty();
	this.$trayButton.css("left", "10px");
	this.$backButton.css("left", "10px");
	this.$trayButton.off();
};
PULSE.CLIENT.SUPERSIZED.prototype.exitFullscreen = function() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else {
		if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else {
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else {
				if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		}
	}
};
PULSE.CLIENT.SUPERSIZED.prototype.toggleFullscreen = function() {
	var b = this.container.slice(1);
	var a = document.getElementById(b);
	if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
		if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
			this.exitFullscreen();
		} else {
			if (a.requestFullscreen) {
				a.requestFullscreen();
			} else {
				if (a.webkitRequestFullscreen) {
					a.webkitRequestFullscreen();
				} else {
					if (a.mozRequestFullScreen) {
						a.mozRequestFullScreen();
					} else {
						if (a.msRequestFullscreen) {
							a.msRequestFullscreen();
						}
					}
				}
			}
		}
	}
};
PULSE.CLIENT.SUPERSIZED.prototype.initialize = function(c) {
	var b = this;
	var a = c ? c : 0;
	jQuery(function(d) {
		d.supersized({
			slideshow: 1,
			autoplay: 0,
			start_slide: a,
			stop_loop: 0,
			random: 0,
			slide_interval: 3000,
			transition: 6,
			transition_speed: 1000,
			new_window: 1,
			pause_hover: 0,
			keyboard_nav: 1,
			performance: 1,
			image_protect: 1,
			min_width: 0,
			min_height: 0,
			vertical_center: 1,
			horizontal_center: 1,
			fit_always: 1,
			fit_portrait: 1,
			fit_landscape: 1,
			slide_links: "blank",
			thumb_links: 1,
			thumbnail_navigation: 0,
			slides: b.data,
			progress_bar: 1,
			mouse_scrub: 0,
			container: b.container,
			mode: b.mode
		});
	});
};