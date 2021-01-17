opjq(document).ready(function($){

    var el = $('.op_live_editor .op-pagebuilder, .op_page_builder .op-pagebuilder,#toplevel_page_optimizepress a[href$="page=optimizepress-page-builder"],#op-pagebuilder-container a.op-pagebuilder, form.op-bsw-settings a.op-pagebuilder');

    var $body = $('body');

    var defaults = {
        width: '98%',
        height: '98%',
        padding: 0,
        closeClick: false,
        type: 'iframe',

        helpers: {
            overlay: {
                closeClick: false,
                showEarly: false,
                css: { opacity: 0 },
                speedOut: 200,
            }
        },
        openEffect: 'none',
        closeEffect: 'fade',
        openSpeed: 0,
        closeSpeed: 200,
        openOpacity: false,
        closeOpacity: true,
        scrollOutside: false,

        beforeLoad: function() {
            op_show_loading();
        },

        beforeShow: function() {
           // $(window.parent.document).find('.fancybox-close').css({ display: 'none' });
            OptimizePress.fancyboxBeforeShowAnimation(this);
        },

        afterShow: function () {

            // Hide loading after the popup is opened (300ms animation) -> Not really needed since animation starts immediately
            // setTimeout(function () {
            op_hide_loading();
            // }, 300);
            // $('.fancybox-opened').find('iframe').focus();

            // We do this to resize revisions dialog iframes properly
            if (OptimizePress._pageRevisionsActive) {
                $(document).trigger('pageRevisionsFancyboxOpen');
            }
        },

        beforeClose: function(){
            var returnValue = false;

            if (!OptimizePress.disable_alert && !OptimizePress._pageRevisionsActive) {
                returnValue = confirm(OptimizePress.pb_unload_alert);
                if (returnValue) {
                    OptimizePress.fancyboxBeforeCloseAnimation(this);
                }
                return returnValue;
            }

            OptimizePress.fancyboxBeforeCloseAnimation(this);
            OptimizePress.disable_alert = false;
        },

        afterClose: function(){

            if (OptimizePress._pageRevisionsActive) {
                OptimizePress._pageRevisionsActive = false;
                $('#op-current-iframe').attr('src', '');
                $('#op-revisions-iframe').attr('src', '');
                $(document).off('pageRevisionsFancyboxOpen');
                $(window).off('resize', OptimizePress._repositionRevisionsPopup);
            }

            // This is necessary in order to hide the parent fancybox scrollbars and close button
            // $('html').css({
            //     overflow: 'auto'
            // });

            $(window.parent.document).find('.fancybox-close').css({ display: 'block' });

            /*
             * If user is on the pages list screen, it will refresh his page (so he'll be able to view his newly created page)
             */
            if (window.location.pathname.indexOf('wp-admin/edit.php') >= 0 && window.location.search.indexOf('post_type=page') >= 0
            && typeof OptimizePress.reload_page !== 'undefined' && OptimizePress.reload_page === true) {
                setTimeout(function () {
                    window.location = window.location.href;
                }, 0);
            }
        }
    };

    el.fancybox(defaults);

    if (typeof window.OptimizePress === 'object') {
        // These defaults are also used elswhere, that's why we make them available globally
        window.OptimizePress.fancybox_defaults = defaults;
    }

    $('body.widgets-php').find('#available-widgets #widget-list .widget .widget-description').each(function(){
        $(this).html($(this).text());
    });


    OptimizePress.fancyboxBeforeCloseAnimation = function (that) {
        var $fancyboxOverlay = $('.fancybox-overlay');
        var $fancyboxParent = $(that.content || that.inner[0]).parentsUntil('.fancybox-wrap').parent();

        $fancyboxOverlay.addClass('op-transform-fast');
        $fancyboxParent.addClass('op-transform-fast');

        setTimeout(function (){
            $fancyboxParent.css({ transform: 'translate3d(0,0,0) scale(0)' });
            $fancyboxOverlay.addClass('op-opacity-zero');
        }, 100);
    }

    OptimizePress.fancyboxBeforeShowAnimation = function (that) {
        var $fancyboxOverlay = $('.fancybox-overlay');
        var $fancyboxParent = $(that.content || that.inner[0]).parentsUntil('.fancybox-wrap').parent();

        $fancyboxOverlay.removeClass('op-transform-1 op-transform-1-end').addClass('op-transform-1-start');
        $fancyboxParent.removeClass('op-transform op-transform-end').addClass('op-transform-start');

        setTimeout(function (){
            $fancyboxOverlay.addClass('op-transform-1 op-transform-1-end');
            $fancyboxParent.addClass('op-transform op-transform-end');
        }, 100);
    }




    /*
     * This is a fix for missing ready.promise() on jQuery 1.7.2
     */
    $.Deferred(function(defer) {
        $(defer.resolve);
        $.ready.promise = defer.promise;
    });

    /**
     * Tabbed module
     * Related to /lib/tpl/generic/tabbed_module.php
     * It needs to be triggered after all event listeners in document are already set, that's why it's in $.ready.promise()
     */
    $.ready.promise().done(function() {
        if (window.location.hash) {
            var hash = window.location.hash.split('--');
            $tab = $('.op-bsw-grey-panel-tabs a[href="' + hash[0] + '"]');//$('.tab-' + window.location.hash);
            if ($tab.length > 0) {
                $tab.trigger('click');
                if (hash.length == 2) {
                    $provider = $('.tab-' + hash[0].substring(1) + ' .section-' + hash[1] + ' .op-bsw-grey-panel-header h3 a');
                    $provider.trigger('click');
                }
            }
        }
    });

    // A helper flag which indicates if revisios are (being) opened.
    OptimizePress._pageRevisionsActive = false;

    /**
     * Resizes the revisions iframes to make them max. available size on current screen.
     * It is also used in live_editor.js
     */
    OptimizePress._repositionRevisionsPopup = function () {

        var $fancyBox = $('.fancybox-outer');
        var fancyboxHeight = $fancyBox.height();
        var $revisionsDialog = $fancyBox.find('#op-revisions-dialog');
        var revisionsDialogH1Height = $revisionsDialog.find('> h1').outerHeight();
        var $dialogContent = $revisionsDialog.find('.dialog-content');
        var dialogContentPadding = parseInt($dialogContent.css('paddingTop'), 10) + parseInt($dialogContent.css('paddingBottom'), 10);
        var $revisionsList = $revisionsDialog.find('.op-revisions-list');
        var thHeight = $dialogContent.find('.op-diff-th').outerHeight() + 3;   // 3 is to account for top and bottom border of th and bottom border from container

        revisionsListHeight = $revisionsList.outerHeight() + parseInt($revisionsList.css('marginBottom'), 10);
        $revisionsDialog.find('.op-diff').height(fancyboxHeight - revisionsDialogH1Height - dialogContentPadding - revisionsListHeight);
        $revisionsDialog.find('.op-revisions-iframe').height(fancyboxHeight - revisionsDialogH1Height - dialogContentPadding - revisionsListHeight - thHeight);

    }

    /**
     * Loads latest revisions from the database,
     * then initializes page revisions
     * @param {object} fancy_defaults [fancybox default options for initialization]
     */
    OptimizePress._initPageRevisions = function (fancy_defaults, targetEl) {

        var data = {
            action: OptimizePress.SN+'-op_ajax_get_page_revisions',
            page_id: $('#page_id').val() || targetEl.getAttribute('data-post_id')
        };

        OptimizePress._pageRevisionsActive = true;

        if (typeof op_show_loading !== 'undefined') {
            op_show_loading();
        }

        // We want latest revisions, that's why we remove any existing revisions.
        $('#op-revisions-dialog').remove();

        $.post(OptimizePress.ajaxurl, data, function(resp){

            var $currentIframe;

            $body.append(resp);
            OptimizePress._renderPageRevisions(fancy_defaults);

            $currentIframe = $('#op-current-iframe');
            $currentIframe.attr('src', $currentIframe.attr('data-src'));

            op_hide_loading();

        });

    }

    /**
     * Opens fancybox, loads iframes and binds scroll events to them.
     * @param {object} fancy_defaults [fancybox default options for initialization]
     */
    OptimizePress._renderPageRevisions = function (fancy_defaults) {

        // pageRevisionsFancyboxOpen is custom event triggered after fancybox is shown
        $(document).on('pageRevisionsFancyboxOpen', OptimizePress._repositionRevisionsPopup);

        $(document).on('pageRevisionsFancyboxOpen', function () {

            // We set load event on every iframe
            $('.op-revisions-iframe').each(function () {

                $(this).on('load', function (e) {

                    // Current iframe repositions the scroll of the another iframe (there are only two on the page)
                    var otherIframe = this.getAttribute('id') === 'op-revisions-iframe' ? 'op-current-iframe' : 'op-revisions-iframe';

                    // When user scrolls one iframe, other should be scrolled as well.
                    $(e.target.contentWindow).on('scroll', function () {
                        $(document.getElementById(otherIframe).contentWindow).scrollTop($(this).scrollTop());
                    });

                });

            });

        });

        // If user resizes the window, we need to resize revisions iframes
        $(window).on('resize', OptimizePress._repositionRevisionsPopup);

        $.fancybox($.extend({}, fancy_defaults, {
            // minWidth: $('#op-revisions-dialog').width(),
            type: 'inline',
            wrapCSS: 'fancybox-revisions',
            href: '#op-revisions-dialog',
            // autoSize: false,
            // width: '98%',
            // height: '98%',
            // openEffect: 'elastic',
            // openOpacity: false
        }));

        // We never want to ask user to confirm when working with revisions
        OptimizePress.disable_alert = false;

    }

    // revisions button click
    $body.on('click', '#op-revisions-button', function(e){
        e.preventDefault();
        OptimizePress._initPageRevisions(defaults, e.target);
    });

    $body.on('click', '.op-revision-preview', function(e){
        e.preventDefault();
        var previewLink = $(this).attr('href');
        $('#op-revisions-iframe').attr('src', previewLink);
    });

    //$('#op-current-iframe').remove();
    $body.on('change', '.op-revisions-radio', function(e){

        e.preventDefault();
        var previewLink = $(this).val();

        // Set current revisions list item as selected (and unselect previosly selected one)
        $('#op-revisions-dialog').find('.op-revisions-list-item').removeClass('op-revisions-list-item--selected');
        $(this).parent().parent().addClass('op-revisions-list-item--selected')

        $('#op-revisions-iframe').attr('src', previewLink);
        $('#op-open-revision-new-tab').css({ display: 'inline' }).attr('href', previewLink);
    });

    $body.on('click', '.op-revision-restore', function(e){

        var data = {
            action: OptimizePress.SN+'-restore-page-revision',
            postID: $(this).data('postid'),
            revisionID: $(this).data('revisionid')
        };

        e.preventDefault();

        OptimizePress.disable_alert = true;

        $.post(OptimizePress.ajaxurl, data,
            function(resp){
                if(typeof resp.error != 'undefined'){
                    alert(resp.error);
                } else {
                    $.fancybox.close();
                    if (typeof op_show_loading !== 'undefined') {
                        op_show_loading();
                    }
                    window.location.reload(true);
                }
            },
            'json'
        );
    });

    // Disable Styles & Scripts toggle all CSS/JS checkboxes
    $body.on('click', '.op-disable-all-css, .op-disable-all-js', function(e) {
        var type = $(this).attr('data-type');
        var $checkboxes = $(this).closest('table.op-disable-compat').find('input[data-type=' + type + ']');

        if ($(this).attr('checked') === 'checked') {
            $(this).attr('checked', false);
            $checkboxes.attr('checked', false);
        } else {
            $(this).attr('checked', true);
            $checkboxes.attr('checked', true);
        }

        return false;
    });

    /**
     * OptimizeLeads
     */
    (function () {
        // section-optimizeleads_sitewide
        var $opleads = $('.op-opleads-sitewide-section');
        var opLeadsBoxesLoaded = false;
        var $boxSelect = $('#optimizeleads_sitewide_uid');
        var $apiKey = $('#optimizeleads_api_key');

        // Don't try to find boxes if there's no OPLeads api key or if OPLeads api key is invalid
        if (!$apiKey.val() || $apiKey.hasClass('optimizeleads-api-key-error')) {
            return false;
        }

        // Don't try to find boxes if there's no OPLeads section or if there's no boxes select
        if ($opleads.length < 1 || $boxSelect.length < 1) {
            return false;
        }

        $opleads.prev().find('.show-hide-panel a').on('click', function () {
            if ($opleads.is(':hidden') && !opLeadsBoxesLoaded) {
                /**
                 * We retrieve all OptimizeLeads boxes that are active and not of type click
                 */
                $.ajax({
                    type: 'POST',
                    url: OptimizePress.ajaxurl,
                    data: { 'action': OptimizePress.SN + '-get-optimizeleads-auto-boxes' },
                    dataType: 'json',
                    success: function(response) {
                        var html = '';
                        var checked = '';
                        var i = 0;

                        opLeadsBoxesLoaded = true;

                        for (i = 0; i < response.length; i += 1) {
                            checked = response[i]['uid'] === $boxSelect.attr('data-current-value') ? ' selected="selected" ' : '';
                            html += '<option value="' + response[i]['uid'] + '"' + checked + '>' + response[i]['title'] + '</option>';
                        }

                        $boxSelect.append(html);
                        $('#optimizeleads-sitewide-options').removeClass('hidden');
                        $('#optimizeleads-sitewide-loader').addClass('hidden');
                    }
                });
            }
        });
    }());

    /**
     * Yoast SEO filling their content for analysis
     */
    (function($) {

        var OPYoastPlugin = function () {
            YoastSEO.app.registerPlugin('OPYoastPlugin', {status: 'loading'});

            this.getData();
        };

        OPYoastPlugin.prototype.getData = function () {

            var _self = this;

            _self.custom_content = '';

            // if there is no WP editor only
            if ($('#wp-content-editor-container').length === 0) {
                var temp_permalink = $('#sample-permalink');
                if (temp_permalink.length > 0) {
                    var permalink = '';
                    if (temp_permalink.is('span')) {
                        permalink = temp_permalink.find('a').attr('href');
                    } else {
                        permalink = temp_permalink.attr('href');
                    }
                    if (permalink.length > 0) {
                        $.ajax({
                            url: permalink,
                            dataType: 'html',
                            success: function (response) {
                                var parsed = $('<html />').html(response);
                                _self.custom_content = $(parsed).find('#content_area').html();
                            }
                        });
                    }
                }

                setTimeout(function () {
                    YoastSEO.app.pluginReady('OPYoastPlugin');
                    YoastSEO.app.registerModification('content', $.proxy(_self.getCustomContent, _self), 'OPYoastPlugin', 5);
                    YoastSEO.app.pluginReloaded('OPYoastPlugin');
                }, 500);

            }

        };

        OPYoastPlugin.prototype.getCustomContent = function (content) {
            return this.custom_content + content;
        };

        $(window).on('YoastSEO:ready', function () {
            new OPYoastPlugin();
        });
    })(opjq);

});