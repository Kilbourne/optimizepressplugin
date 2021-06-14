opjq(document).ready(function($){

    // We don't want to trigger a popup if any other popup is already opened.
    var popupOpen = false;

    $('.op-popup-button').each(function () {

        var $this = $(this);
        var $popup = $this.parent();
        var $popupContent = $this.next();
        var userWidth = $popup.data('width') || '0';

        var openEffect;
        var userOpenEffect = $popup.data('open-effect') || 'fade';
        var openMethod;
        var userOpenMethod = $popup.data('open-method') || 'zoomIn';
        var openSpeed = $popup.data('open-speed') || 400;

        var closeEffect;
        var userCloseEffect = $popup.data('close-effect') || 'fade';
        var closeSpeed = $popup.data('close-speed') || 400;

        var borderColor = $popup.data('border-color') || '#fff';
        var borderSize = $popup.data('border-size');
        var autoSize;
        var width;
        var paddingTop = $popup.data('padding-top');
        var paddingBottom = $popup.data('padding-bottom');
        var paddingLeft = $popup.data('padding-left');
        var paddingRight = $popup.data('padding-right');
        var padding;
        var popupId = $popup.data('popup-id');

        // Overlay pop options
        var exitIntent = $popup.data('exit-intent');
        var triggerTime = $popup.data('trigger-time');
        var triggerDontshow = $popup.data('trigger-dontshow');
        var triggerTimeTimeout;
        var dontShowOnTablet = $popup.data('dont-show-on-tablet');
        var dontShowOnMobile = $popup.data('dont-show-on-mobile');

        // Number of seconds that has to pass until popup is shown again
        // (unless triggerDontShow) is set
        var dontShowPopupTime = 10;

        // Overall overlay, which should be set to 0, unless the effect is none
        var overlayOpacity = 0;

        // Number of pixels from top of the page where popup is triggered.
        // When user moves the moust fast, pixels are skipped, that's why this is necessery.
        var exitIntentSensitivity = 20;

        var exitIntentTriggered = false;
        var exitIntentTriggeredTimeout;
        var clientYprev;

        // Opens the popup
        var openPopup = function (e) {

            // Obviously, if popup is already opened we can quit here
            if (popupOpen) {
                return false;
            }

            // It's not always opened through a click event
            if (e) {
                e.preventDefault();
            }

            // Global var that tracks if any of popups is already opened.
            popupOpen = true;

            // Set exit intent temp timeout
            // (because we don't want to open a popup automatically immediately after it has been closed)
            setExitIntentTriggeredTimeout();

            // Set cookie for opening if applicable
            setDontshow();

            // We don't want to trigger popup on time automatically if it has already been shown/opened
            clearTimeout(triggerTimeTimeout);

            if (typeof borderSize !== 'number') {
                borderSize = 15;
            }

            if (parseInt(userWidth, 10) === 0) {
                autoSize = true;
                width = 'auto';
                minWidth = 20;
            } else {
                autoSize = false;
                width = userWidth;
                minWidth = userWidth;
            }

            switch (openSpeed) {
                case 'normal':
                    openSpeed = 400;
                    break;
                case 'fast':
                    openSpeed = 200;
                    break;
                case 'slow':
                    openSpeed = 600;
                    break;
            }

            switch (userOpenEffect) {
                case 'fade':
                    openEffect = 'fade';
                    break;
                case 'elastic':
                case 'zoomIn':
                    openEffect = 'zoomIn';
                    break;
                case 'none':
                    openEffect = 'none';
                    openSpeed = 0;
                    overlayOpacity = 1;
                    break;
            }

            switch (closeSpeed) {
                case 'normal':
                    closeSpeed = 400;
                    break;
                case 'fast':
                    closeSpeed = 200;
                    break;
                case 'slow':
                    closeSpeed = 600;
                    break;
            }

            switch (userCloseEffect) {
                case 'fade':
                    closeEffect = 'fade';
                    break;
                case 'zoomOut':
                    closeEffect = 'elastic';
                    break;
                case 'none':
                    closeEffect = 'none';
                    closeSpeed = 0;
                    break;
            }


            $popupContent
                .css({ padding: paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px' })
                .addClass('op-popup-content-visible');


            $.fancybox({
                content: $popupContent,

                autoSize: autoSize,
                minHeight: 20,
                width: width,
                minWidth: minWidth,
                padding: borderSize,
                autoHeight: true,
                height: 'auto',
                openEasing: 'swing',

                // We're using custom animations, that's why this is set to none
                openEffect: 'none',
                openMethod: 'zoomIn',
                closeEffect: 'fade',
                closeMethod: 'zoomOut',

                // openSpeed: $popup.data('open-speed') || 400,
                // closeSpeed: $popup.data('close-speed') || 400,
                openSpeed: openSpeed,
                closeSpeed: closeSpeed,

                openOpacity : true,
                wrapCSS: 'op-popup-fancybox',

                helpers: {
                    overlay: {
                        css: { opacity: overlayOpacity },
                    }
                },

                beforeShow: function () {
                    if (openEffect !== 'none') {
                        fancyboxBeforeShowZoomAnimation(this, openEffect, openSpeed);
                    }
                    $popupContent.parent().parent().parent().css('background-color', borderColor);

                    if (autoSize) {
                        $popupContent.parent().parent().parent().addClass('op-popup-fancybox-autosize');
                    }
                },

                afterShow: function () {
                    // JS plugins can hook up to this event like so: $(window).on('op-popup-opened', func);
                    $(window).trigger('op-popup-opened');

                    // Delayed fade-in is handled here for pupup children
                    $popupContent.find("[data-fade]").each(function(){
                        var $el = $(this);
                        var style;
                        $el.css({ display: 'none' });
                        setTimeout(function () {
                            style = $el.attr('style');
                            style = style || '';
                            style = style.replace(/display:\s?none;?/gi, '');
                            $(window).trigger('resize');
                            $el.attr('style', style);
                            $el.css({ opacity: 0 });
                            $el.animate({ opacity: 1 });
                            $el.removeAttr('data-fade');
                        }, parseInt($el.attr('data-fade'), 10) * 1000);
                    });
                },

                // When window is resized, or popup opened, make sure that width of the popup/fancybox is proper.
                onUpdate: function () {

                    // 15 is the margin-lock on the html element of the fancybox
                    var windowWidth = $('.fancybox-overlay').width() - 15;
                    var $fancyboxSkin = $popupContent.parentsUntil('.fancybox-skin').parent();
                    var $fancyboxWrap = $popupContent.parentsUntil('.fancybox-wrap').parent();
                    var fancyboxPositionLeft = parseInt($fancyboxWrap.css('left'), 10);

                    // 30 is a minimal margin that we want on fancybox
                    if (windowWidth - 30 < width + borderSize + borderSize) {
                        $fancyboxWrap.css({
                            width: windowWidth - borderSize - borderSize,
                            left: 15
                        });

                        $fancyboxSkin.css({
                            width: (windowWidth - 30 - borderSize - borderSize) ,
                            left: 0
                        });
                    } else {
                        $fancyboxWrap.css({
                            width: width + borderSize + borderSize,
                            left: (windowWidth - width) / 2
                        });
                        $fancyboxSkin.css({
                            width: width - borderSize - borderSize,
                            left: 0
                        });
                    }
                },

                beforeClose: function () {
                    if (closeEffect !== 'none') {
                        fancyboxBeforeCloseZoomAnimation(this, closeEffect, closeSpeed);
                    }
                },

                afterClose: function () {
                    $popupContent.removeClass('op-popup-content-visible');
                    $(window).trigger('op-popup-closed', $popupContent[0]);
                    $this.after($popupContent);
                    popupOpen = false;
                }

            });

        }

        $this.on('click', openPopup);

        // retruns true or false based on dontShowOnTablet & dontShowOnMobile options according to current screen size
        var showOnThisScreen = function () {
            var docWidth = false;

            if (dontShowOnTablet === 'Y') {
                docWidth = window.innerWidth;
                if (docWidth <= 959 && docWidth >= 768) {
                    return false;
                }
            }

            if (dontShowOnMobile === 'Y') {
                docWidth = docWidth || window.innerWidth;
                if (docWidth <= 767) {
                    return false;
                }
            }

            return true;
        }

        // When a popup is opened we most likely don't want to show it again (automatically) for at least dontShowPopupTime seconds
        var setExitIntentTriggeredTimeout = function () {
            exitIntentTriggered = true;
            exitIntentTriggeredTimeout = setTimeout(function () {
                exitIntentTriggered = false;
            }, dontShowPopupTime * 1000);
        }

        // Trigger the popup after x number of seconds (if set).
        triggerTime = triggerTime ? parseInt(triggerTime) : 0;
        if (triggerTime > 0) {
            triggerTimeTimeout = setTimeout(function() {
                if (!exitIntentTriggered && !isDontShowSet() && showOnThisScreen()) {
                    openPopup();
                }
            }, triggerTime * 1000);
        }

        // If exitIntent is set, handle it. duh.
        if (exitIntent === 'Y') {
            exitIntentTriggered = false;
            exitIntentTriggeredTimeout;
            clientYprev = -1;

            $(document).on('mouseleave', function (e) {
                // Only open popup if
                // - popup is not already opened
                // - popup is not recently closed
                // - dontshow cookie is not set
                // - mouse doesn't enter the top of the page top-down (not exit intent)
                // - popup should be shown on this screen size (dont-show-on-tablet & dont-show-on-mobile options)
                if (e.clientY < exitIntentSensitivity && !isDontShowSet() && showOnThisScreen() && !exitIntentTriggered) {
                    openPopup();
                }
            });
        }

        triggerDontshow = triggerDontshow ? parseInt(triggerDontshow) : 0;
        // Sets cookie with dontShow value, so that popup isn't opened for next dontShow days
        var setDontshow = function () {
            if (triggerDontshow > 0) {
                OptimizePress.cookie.create(popupId, 'dontshow', triggerDontshow);
            }
        }

        // returns true if cookie is set and popup shouldn't be automatically opened
        var isDontShowSet = function () {
            if (triggerDontshow > 0) {
                return !!OptimizePress.cookie.read(popupId);
            } else {
                // erase cookie if it was previously set as customer wants to show popup always
                if (!!OptimizePress.cookie.read(popupId)) {
                    OptimizePress.cookie.erase(popupId);
                }
            }

            return false;
        }

    });

    /**
     * Animates the fancybox opening based on user's settings
     */
    var fancyboxBeforeShowZoomAnimation = function (that, openEffect, openSpeed) {
        var $fancyboxOverlay = $('.fancybox-overlay');
        var $fancyboxParent = $(that.content).parentsUntil('.fancybox-wrap').parent();
        var transformClass = 'op-transform-normal';
        var effectClass = 'op-transform-1';

        switch (openSpeed) {
            case 400:
                transformClass = 'op-transform-normal';
                break;
            case 200:
                transformClass = 'op-transform-fast';
                break;
            case 600:
                transformClass = 'op-transform-slow';
                break;
        }

        if (openEffect === 'fade') {
            effectClass = 'op-transform-1';
        } else {
            effectClass = 'op-transform';
        }

        $fancyboxOverlay.removeClass('op-transform-1 op-transform-1-end').addClass('op-transform-1-start');
        $fancyboxParent.removeClass(transformClass + ' ' + effectClass + '-end').addClass(effectClass + '-start');

        setTimeout(function (){
            $fancyboxOverlay.addClass('op-transform-1 op-transform-1-end');
            $fancyboxParent.addClass(transformClass + ' ' + effectClass +  '-end');
        }, 100);
    }

    /**
     * Animates the fancybox closing based on user's settings
     */
    var fancyboxBeforeCloseZoomAnimation = function (that, closeEffect, closeSpeed) {
        var $fancyboxOverlay = $('.fancybox-overlay');
        var $fancyboxParent = $(that.content).parentsUntil('.fancybox-wrap').parent();
        var transformClass = 'op-transform-normal';
        var effectClass = 'op-transform-1';

        switch (closeSpeed) {
            case 400:
                transformClass = 'op-transform-normal';
                break;
            case 200:
                transformClass = 'op-transform-fast';
                break;
            case 600:
                transformClass = 'op-transform-slow';
                break;
        }

        if (closeEffect === 'fade') {
            effectClass = 'op-transform-1';
        } else {
            effectClass = 'op-transform';
        }

        $fancyboxOverlay.addClass('op-transform-1');
        $fancyboxParent.addClass(transformClass + ' ' + effectClass +  '-end ' + effectClass + '-start');

        setTimeout(function (){
            $fancyboxOverlay.addClass('op-opacity-zero');
            $fancyboxParent.addClass(transformClass).removeClass(effectClass + '-end')
        }, 100);
    }

});