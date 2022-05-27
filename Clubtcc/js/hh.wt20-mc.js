var HH = HH || {};

HH.WT20MatchCenter = (function ( $ ) {

    var WT20MatchCenter = {

        init : function () {

            this.MainMenu();
            this.DropDownMenu("#teams-dropdown", "#teams-dropdownList");
            this.DropDownMenu("#about-dropdown", "#about-dropdownList");
            this.UnbindHover('#teams-dropdown');
            this.UnbindHover('#about-dropdown');

        },

        MainMenu : function ()
        {
            $(".mc-mobileMenuBtn .btncontainer").on("click", function () {
                event.stopPropagation();
                event.preventDefault();
                $(this).parent().toggleClass('open');
                $(".mc-menu").toggleClass('open');

                if ($(".mc-menu").hasClass('open')) {
                    $(".mc-menu").show();
                    $('body').css({'overflow': 'hidden'})
                } else {
                    $(".mc-menu").hide();
                    $('body').css({'overflow': 'visible'})
                }
            });
        },


        DropDownMenu : function(selector, dropDown)
        {
            var that = this,
                $teams = $(selector), //link in menu
                $subMenu = $(dropDown); //submenu

            that.lastClicked = null;
            $teams.append($subMenu);
            $("body").on("click", function (ev) {

                that.lastClicked = ev.target;
                if ($subMenu.is(":visible")) {
                    $teams.find("a").addClass("dropDown");

                    if (!$(that.lastClicked).closest($teams).length) {
                        $subMenu.fadeOut();
                        $teams.removeClass("active");
                        $teams.find("a").removeClass("dropDown");
                    }
                }

            });

            $teams.on("click", function () {

                var $this = $(this);
                if ($this.hasClass("selected")) {
                    return;
                }
                $subMenu.fadeIn();
            });
        },



        UnbindHover : function(selector)
        {
            //var selector = "#teams-dropdown";
            var selector = selector;
            $(selector).unbind('mouseenter mouseleave');
            $(selector).on("click", function (e) {
                if ($(this).hasClass('hh-active')) {
                    $(this).removeClass('hh-active open');
                    $(this).find('nav').css('display', 'none');
                }
                else {
                    $(this).addClass('hh-active open');
                    $(this).find('nav').css('display', 'block');
                }

            });
        }
};

    return WT20MatchCenter;

})( jQuery );

$(document).ready(function () {

    HH.WT20MatchCenter.init();

});

