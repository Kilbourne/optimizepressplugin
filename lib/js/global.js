/*
 *
 *  Note: The only code that should go in this file is code that can and should be
 *  executed globally. This means not only the user facing pages but the admin as well
 *
 */

(function($){
    //Init obejcts
    var Assets = {},
        Sharrre = {};

    //Init Assets object
    Assets.init = {}; //Used to hold all assets init functions

    //Init Sharrre constants
    Sharrre.urlCurl = OptimizePress.paths.js + 'jquery/sharrre.inc.php';
    Sharrre.services = [
        'twitter',
        'facebook',
        'googlePlus',
        'linkedin'
    ];
    Sharrre.options = {
        enableHover: false,
        enableTracking: true,
        urlCurl: Sharrre.urlCurl,
        buttons: {
            twitter: {},
            facebook: {},
            googlePlus: {}
        }
    };

    //Init document ready
    $(document).ready(function(){
        //Init general
        init_sharrre();
        init_selectnav();
        init_dropkick();
        init_tooltipster();
        init_reveal();
        addTextAttributes();
        generate_row_decreasing_index_and_append_to_head();
        init_parallax();

        //Init assets
        if ('function' === typeof Assets.init.countdown){
            Assets.init.countdown();
        }
        if ('function' === typeof Assets.init.countdown_cookie){
            Assets.init.countdown_cookie();
        }
    });

    function addTextAttributes() {
        $('input').each(function(){
            if (!$(this).attr('type')) {
                $(this).attr('type', 'text');
            }
        });
    }

    /**
     * Generate internal CSS for decreasing .row z-index.
     * This is necessary to display section separators
     */
    function generate_row_decreasing_index_and_append_to_head() {
        var allSectionSeparatorStyles = $('style[id^="section-separator-style-"]');

        if(allSectionSeparatorStyles.length > 0) {
            var allRows = $('.row[id^="le_body_row_"]');
            var decreasingRowIndexStyle = '<style id="op-decreasing-row-zindex">'

            for (var i = 0; i < allRows.length; i++) {
                decreasingRowIndexStyle += '#le_body_row_' + (i + 1) + '{' +
                    'z-index: ' + (parseInt(50) - parseInt((i + 1))) + ';' +
                    '}'
            }

            decreasingRowIndexStyle += '</style>';
            $('head').append(decreasingRowIndexStyle);
        }
    }

    /**
     * Function will call .stellar() against window if there is any row with class bg-parallax
     * TODO: after new iOS release check if blurry background images still exists
     */
    function init_parallax(){
        $(window).on("load", function(){
            if ($('.row').is('[class*="bg-parallax"]') && !isMobile.any()) {
                $.stellar({horizontalScrolling:false});
            }
            //iOS has an issue preventing background-position: fixed
            //from being used with background-size: cover
            //so we disable one statement to avoid
            //blurry images on iPhones etc.
            if (isMobile.iOS()) {
                var rows = $('.row[class*="bg-parallax"]');
                for (var i=0; i<rows.length; i++) {
                    $(rows[i]).css({backgroundAttachment: ""});
                }
            }
        });
        $(window).on("resize", function () {
            if ($('.row').is('[class*="bg-parallax"]') && !isMobile.any()) {
                $.stellar("refresh");
            }
        });
    }

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


    //Init the Sharrre widget functionality
    function init_sharrre(){
        $.each(Sharrre.services, function(index, val){
            var localOptions = Sharrre.options;

            //Set the click functionality
            localOptions.click = function(api, options){
                api.simulateClick();
                api.openPopup(val);
            }

            //Init share widgets
            $('.social-sharing .' + val).each(function(){
                //Get the language for this element
                var lang = (typeof($(this).data('lang'))=='undefined' ? 'en_US' : $(this).data('lang'));
                var via = (typeof($(this).data('via'))=='undefined' ? '' : $(this).data('via'));
                var title = (typeof($(this).data('title'))=='undefined' ? '' : $(this).data('title'));
                var url = (typeof($(this).data('url'))=='undefined' ? '' : $(this).data('url'));
                var likes = (typeof($(this).data('likes'))=='undefined' ? '' : $(this).data('likes'));

                //Enable/disable counter
                localOptions.enableCounter = $(this).parent().data('counter');

                //Set social variables
                switch(val){
                    case 'twitter':
                        localOptions.share = { twitter: true };
                        localOptions.buttons.twitter.lang = lang;
                        localOptions.buttons.twitter.via = via;
                        localOptions.buttons.twitter.title = title;
                        localOptions.buttons.twitter.url = url;
                        localOptions.buttons.twitter.likes = likes;
                        break;
                    case 'facebook':
                        localOptions.share = { facebook: true };
                        localOptions.buttons.facebook.lang = lang;
                        localOptions.buttons.facebook.likes = likes;
                        break;
                    case 'googlePlus':
                        localOptions.share = { googlePlus: true };
                        localOptions.buttons.googlePlus.lang = lang;
                        break;
                }

                //Apply sharrre to element
                $(this).sharrre(localOptions);
            });
        });
    }

    $(window).on('op_init_sharrre', init_sharrre);

    function init_selectnav(){
        if (typeof selectnav !== 'undefined') {
            selectnav('navigation-above', {indent: '<span>-</span>'});
            selectnav('navigation-below', {indent: '<span>-</span>'});
            selectnav('navigation-alongside', {indent: '<span>-</span>'});
        }
    }

    //Init the dropkick JS functionality
    function init_dropkick(){
        var navSelector = '.navigation .dk';
        var otherSelector = ($('body').hasClass('blog') ? '.main-content .dk' : '.content .dk');

        dropkickListener = function () {
            if (parseInt($(this).width(), 10) < 960) {
                $(navSelector).each(function () {
                    if (!$(this).data('dropkickInitialized')) {
                        $(this).dropkick({
                            mobile: true,
                            change: function () {
                                if (this.value) {
                                    window.location = this.value;
                                }
                            }
                        });
                        $(this).data('dropkickInitialized', 'true')
                    }

                    var item = $(this).siblings('ul').find('li:first-child a');
                    var color = item.css('color');
                    $(this).prev('.dk_container').find('.dk_label').css({ color: color });
                });
            }
        }

        //Init the nav dropkick functionality and trigger it
        $(window).on('resize', dropkickListener).trigger('resize');

        //Init the other content dropkick dropdowns
        $(otherSelector).each(function(){
            if (!$(this).data('dropkickInitialized')) {
                $(this).dropkick({
                    mobile: true,
                    change: function () {
                        if (value) {
                            window.location = value;
                        }
                    }
                });
                $(this).data('dropkickInitialized', 'true')
            }
        });

        $('li.op-pagebuilder a').fancybox({
            width: '98%',
            height: '98%',
            padding: 0,
            scrolling: 'no',
            closeClick: false,
            type: 'iframe',
            openEffect: 'none',
            closeEffect: 'fade',
            openSpeed: 0,
            closeSpeed: 200,
            openOpacity: true,
            closeOpacity: true,
            scrollOutside: false,
            helpers: {
                overlay: {
                    closeClick: false,
                    showEarly: false,
                    css: { opacity: 0 },
                    speedOut: 200,
                    locked: false
                }
            },
            beforeLoad: function () {
                op_show_loading();
            },
            beforeShow: function() {
                OptimizePress.fancyboxBeforeShowAnimation(this);
            },
            afterShow: function () {
                op_hide_loading();
                $('.fancybox-opened').find('iframe').focus();
            },
            beforeClose: function(){
                var returnValue = false;

                if (!OptimizePress.disable_alert) {
                    returnValue = confirm(OptimizePress.pb_unload_alert);
                    if (returnValue) {
                        OptimizePress.fancyboxBeforeCloseAnimation(this);
                    }
                    return returnValue;
                }

                OptimizePress.fancyboxBeforeCloseAnimation(this);
                OptimizePress.disable_alert = false;
            }
        });
    }

    function init_tooltipster(){
        $('.tooltip').tooltipster({animation: 'grow'});
    }

    function init_reveal(){
        $('.optin-modal-container').each(function(){
            $(this).on('click', '.optin-modal-link', function(e) {
                e.preventDefault();
                $(this).next('.optin-modal').reveal();
            });
            $(this).on('click', ' .optin-modal .css-button', function(e){
                e.preventDefault();
                $(this).parent('form').submit();
            });
        });
    }

    //Countdown Asset
    Assets.init.countdown = function(){

        // We want to initialize countdown timers
        // on blog posts in WYSIWYG too
        // (but we don't want them
        // to be counting, so we
        // just pause them)
        var $tinymceIframes = $('.mce-tinymce iframe');
        var $tinymceIframeTimers;
        if ($tinymceIframes.length > 0) {
            $iframeTimers = $tinymceIframes.contents().find('div.countdown-timer');
            $iframeTimers.each(eachCountdownTimer);
            $iframeTimers.countdown('pause');
        }

        // Initialize countdown timers
        // on the current page.
        $('div.countdown-timer').each(eachCountdownTimer);

        function eachCountdownTimer() {

            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                isSince = (typeof(obj.data('end'))!='undefined' ? false : true),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = [
                    obj.data('years_text')   === undefined ? 'Years'   : obj.data('years_text'),
                    obj.data('months_text')  === undefined ? 'Months'  : obj.data('months_text'),
                    obj.data('weeks_text')   === undefined ? 'Weeks'   : obj.data('weeks_text'),
                    obj.data('days_text')    === undefined ? 'Days'    : obj.data('days_text'),
                    obj.data('hours_text')   === undefined ? 'Hours'   : obj.data('hours_text'),
                    obj.data('minutes_text') === undefined ? 'Minutes' : obj.data('minutes_text'),
                    obj.data('seconds_text') === undefined ? 'Seconds' : obj.data('seconds_text')
                ],
                labels1 = [
                    obj.data('years_text_singular')   === undefined ? 'Year'   : obj.data('years_text_singular'),
                    obj.data('months_text_singular')  === undefined ? 'Month'  : obj.data('months_text_singular'),
                    obj.data('weeks_text_singular')   === undefined ? 'Week'   : obj.data('weeks_text_singular'),
                    obj.data('days_text_singular')    === undefined ? 'Day'    : obj.data('days_text_singular'),
                    obj.data('hours_text_singular')   === undefined ? 'Hour'   : obj.data('hours_text_singular'),
                    obj.data('minutes_text_singular') === undefined ? 'Minute' : obj.data('minutes_text_singular'),
                    obj.data('seconds_text_singular') === undefined ? 'Second' : obj.data('seconds_text_singular')
                ],
                format = obj.data('format') || 'yodhms',
                width = 0,
                widthOffset = 9;

            for (var i = 0; i < labels.length; i++) {
                if (labels[i].replace(/\s+/g, '') == '') {
                    labels[i] = '&nbsp;';
                }
            }

            for (var i = 0; i < labels1.length; i++) {
                if (labels1[i].replace(/\s+/g, '') == '') {
                    labels1[i] = '&nbsp;';
                }
            }

            var initCountdown = function () {
                // Get redirect url and trim it (do not allow ' ')
                var redirect_url = $(obj).attr('data-redirect_url');
                redirect_url = redirect_url ? $.trim(redirect_url) : redirect_url;

                // Change location?
                var expire = ! window.OptimizePress.wp_admin_page && !! redirect_url;

                //Init countdown
                obj.countdown({
                    until: newDateObj,
                    format: 'yodhms',
                    labels: labels,
                    labels1: labels1,
                    format: format,
                    'timezone': data[data.length-1],
                    expiryUrl: expire ? redirect_url : '',
                    alwaysExpire: expire
                });

                //Get countdown sections and add each width to width variable
                obj.find('span.countdown_section').each(function(){
                    width += $(this).width() + widthOffset;
                });

                //Set width to main obj
                //obj.width(width + 'px');
                obj.width('100%');
            }

            // Download the script if it isn't loaded
            // and initiate countdown, and if script
            // is already loaded we just initialize
            // the elements again
            if (typeof $.countdown === 'undefined') {
                $.getScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, initCountdown);
            } else {
                initCountdown();
            }
        }
    }

    // Expose this script for when it's needed
    OptimizePress.initCountdownElements = Assets.init.countdown;

    //Countdown Cookie Asset
    Assets.init.countdown_cookie = function(){
        //Find each timer instance
        $('div.countdown-cookie-timer').each(function(){
            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                labels1 = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
                width = 0,
                widthOffset = 9;

            //Download the script if it isn't loaded and initiate countdown
            $.getScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, function(){
                    //Init countdown
                    obj.countdown({
                        until: newDateObj,
                        format: 'yodhms',
                        labels: labels,
                        labels1: labels1
                    });

                    //Get countdown sections and add each width to width variable
                    obj.find('span.countdown_section, span.countdown_row').each(function(){
                        width += $(this).width() + widthOffset;
                    });

                    //Set width to main obj
                    obj.width(width + 'px');
            });
        });
    }


    // Easy cookie manipulation
    OptimizePress.cookie = {};

    OptimizePress.cookie.create = function (name, value, days) {
        var date;
        var expires;

        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    };

    OptimizePress.cookie.read = function (name) {
        var nameEQ = name + "=";
        var cookiesArray = document.cookie.split(';');
        var cookiesArrayLength = cookiesArray.length;
        var i = 0;
        var cookie;

        for (i = 0; i < cookiesArrayLength; i += 1) {
            cookie = cookiesArray[i];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    };

    OptimizePress.cookie.erase = function (name) {
        OptimizePress.cookie.create(name, "", -1);
    };

})(opjq);
