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

});;
/*!
 * iButton jQuery Plug-in
 *
 * Copyright 2011 Giva, Inc. (http://www.givainc.com/labs/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2011-07-26
 * Rev:  1.0.03
 */
!function(a){a.iButton={version:"1.0.03",setDefaults:function(b){a.extend(d,b)}},a.fn.iButton=function(b){var d="string"==typeof arguments[0]&&arguments[0],e=d&&Array.prototype.slice.call(arguments,1)||arguments,f=0==this.length?null:a.data(this[0],"iButton");if(f&&d&&this.length){if("object"==d.toLowerCase())return f;if(f[d]){var g;return this.each(function(b){var c=a.data(this,"iButton")[d].apply(f,e);if(0==b&&c){if(!c.jquery)return g=c,!1;g=a([]).add(c)}else c&&c.jquery&&(g=g.add(c))}),g||this}return this}return this.each(function(){new c(this,b)})};var b=0,c=function(c,g){var h=this,i=a(c),j=++b,k=!1,l={},m={dragging:!1,clicked:null},n={position:null,offset:null,time:null},g=a.extend({},d,g,a.metadata?i.metadata():{}),o=g.labelOn==e&&g.labelOff==f,p=":checkbox, :radio";if(!i.is(p))return i.find(p).iButton(g);if(!a.data(i[0],"iButton")){a.data(i[0],"iButton",h),"auto"==g.resizeHandle&&(g.resizeHandle=!o),"auto"==g.resizeContainer&&(g.resizeContainer=!o),this.toggle=function(a){var b=arguments.length>0?a:!i[0].checked;i.attr("checked",b).trigger("change")},this.disable=function(b){var c=arguments.length>0?b:!k;k=c,i.attr("disabled",c),q[c?"addClass":"removeClass"](g.classDisabled),a.isFunction(g.disable)&&g.disable.apply(h,[k,i,g])},this.repaint=function(){x()},this.destroy=function(){a([i[0],q[0]]).unbind(".iButton"),a(document).unbind(".iButton_"+j),q.after(i).remove(),a.data(i[0],"iButton",null),a.isFunction(g.destroy)&&g.destroy.apply(h,[i,g])},i.wrap('<div class="'+a.trim(g.classContainer+" "+g.className)+'" />').after('<div class="'+g.classHandle+'"><div class="'+g.classHandleRight+'"><div class="'+g.classHandleMiddle+'" /></div></div><div class="'+g.classLabelOff+'"><span><label>'+g.labelOff+'</label></span></div><div class="'+g.classLabelOn+'"><span><label>'+g.labelOn+'</label></span></div><div class="'+g.classPaddingLeft+'"></div><div class="'+g.classPaddingRight+'"></div>');var q=i.parent(),r=i.siblings("."+g.classHandle),s=i.siblings("."+g.classLabelOff),t=s.children("span"),u=i.siblings("."+g.classLabelOn),v=u.children("span");(g.resizeHandle||g.resizeContainer)&&(l.onspan=v.outerWidth(),l.offspan=t.outerWidth()),g.resizeHandle?(l.handle=Math.min(l.onspan,l.offspan),r.css("width",l.handle)):l.handle=r.width(),g.resizeContainer?(l.container=Math.max(l.onspan,l.offspan)+l.handle+20,q.css("width",l.container),s.css("width",l.container-5)):l.container=q.width();var w=l.container-l.handle-6,x=function(a){var b=i[0].checked,c=b?w:0,a=arguments.length>0?arguments[0]:!0;a&&g.enableFx?(r.stop().animate({left:c},g.duration,g.easing),u.stop().animate({width:c+4},g.duration,g.easing),v.stop().animate({marginLeft:c-w},g.duration,g.easing),t.stop().animate({marginRight:-c},g.duration,g.easing)):(r.css("left",c),u.css("width",c+4),v.css("marginLeft",c-w),t.css("marginRight",-c))};x(!1);var y=function(a){return a.pageX||(a.originalEvent.changedTouches?a.originalEvent.changedTouches[0].pageX:0)};q.bind("mousedown.iButton touchstart.iButton",function(b){return a(b.target).is(p)||k||!g.allowRadioUncheck&&i.is(":radio:checked")?void 0:(b.preventDefault(),m.clicked=r,n.position=y(b),n.offset=n.position-(parseInt(r.css("left"),10)||0),n.time=(new Date).getTime(),!1)}),g.enableDrag&&a(document).bind("mousemove.iButton_"+j+" touchmove.iButton_"+j,function(a){if(m.clicked==r){a.preventDefault();var b=y(a);b!=n.offset&&(m.dragging=!0,q.addClass(g.classHandleActive));var c=Math.min(1,Math.max(0,(b-n.offset)/w));return r.css("left",c*w),u.css("width",c*w+4),t.css("marginRight",-c*w),v.css("marginLeft",-(1-c)*w),!1}}),a(document).on("mouseup.iButton_"+j+" touchend.iButton_"+j,".ibutton-container",function(b){if(m.clicked!=r)return!1;b.preventDefault();var c=!0;if(!m.dragging||(new Date).getTime()-n.time<g.clickOffset){var d=i[0].checked;i.attr("checked",!d),a.isFunction(g.click)&&g.click.apply(h,[!d,i,g])}else{var e=y(b),f=(e-n.offset)/w,d=f>=.5;i[0].checked==d&&(c=!1),i.attr("checked",d)}return q.removeClass(g.classHandleActive),m.clicked=null,m.dragging=null,c?i.trigger("change"):x(),!1}),i.bind("change.iButton",function(){if(x(),i.is(":radio")){var b=i[0],c=a(b.form?b.form[b.name]:":radio[name="+b.name+"]");c.filter(":not(:checked)").iButton("repaint")}a.isFunction(g.change)&&g.change.apply(h,[i,g])}).bind("focus.iButton",function(){q.addClass(g.classFocus)}).bind("blur.iButton",function(){q.removeClass(g.classFocus)}),a.isFunction(g.click)&&i.bind("click.iButton",function(){g.click.apply(h,[i[0].checked,i,g])}),i.is(":disabled")&&this.disable(!0),a.isFunction(g.init)&&g.init.apply(h,[i,g])}},d={duration:200,easing:"swing",labelOn:"ON",labelOff:"OFF",resizeHandle:"auto",resizeContainer:"auto",enableDrag:!0,enableFx:!0,allowRadioUncheck:!1,clickOffset:120,className:"",classContainer:"ibutton-container",classDisabled:"ibutton-disabled",classFocus:"ibutton-focus",classLabelOn:"ibutton-label-on",classLabelOff:"ibutton-label-off",classHandle:"ibutton-handle",classHandleMiddle:"ibutton-handle-middle",classHandleRight:"ibutton-handle-right",classHandleActive:"ibutton-active-handle",classPaddingLeft:"ibutton-padding-left",classPaddingRight:"ibutton-padding-right",init:null,change:null,click:null,disable:null,destroy:null},e=d.labelOn,f=d.labelOff}(opjq);;
/**
 * http://github.com/valums/file-uploader
 *
 * Multiple file upload component with progress-bar, drag-and-drop.
 * © 2010 Andrew Valums ( andrew(at)valums.com )
 *
 * Licensed under GNU GPL 2 or later and GNU LGPL 2 or later, see license.txt.
 */

var qq=qq||{};qq.extend=function(a,b){for(var c in b)a[c]=b[c]};qq.indexOf=function(a,b,c){if(a.indexOf)return a.indexOf(b,c);c=c||0;var d=a.length;for(0>c&&(c+=d);c<d;c++)if(c in a&&a[c]===b)return c;return-1};qq.getUniqueId=function(){var a=0;return function(){return a++}}();qq.attach=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)};
qq.detach=function(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.attachEvent&&a.detachEvent("on"+b,c)};qq.preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};qq.insertBefore=function(a,b){b.parentNode.insertBefore(a,b)};qq.remove=function(a){a.parentNode.removeChild(a)};qq.contains=function(a,b){return a==b?!0:a.contains?a.contains(b):!!(b.compareDocumentPosition(a)&8)};
qq.toElement=function(){var a=document.createElement("div");return function(b){a.innerHTML=b;b=a.firstChild;a.removeChild(b);return b}}();qq.css=function(a,b){null!=b.opacity&&"string"!=typeof a.style.opacity&&"undefined"!=typeof a.filters&&(b.filter="alpha(opacity="+Math.round(100*b.opacity)+")");qq.extend(a.style,b)};qq.hasClass=function(a,b){return RegExp("(^| )"+b+"( |$)").test(a.className)};qq.addClass=function(a,b){qq.hasClass(a,b)||(a.className+=" "+b)};
qq.removeClass=function(a,b){a.className=a.className.replace(RegExp("(^| )"+b+"( |$)")," ").replace(/^\s+|\s+$/g,"")};qq.setText=function(a,b){a.innerText=b;a.textContent=b};qq.children=function(a){var b=[];for(a=a.firstChild;a;)1==a.nodeType&&b.push(a),a=a.nextSibling;return b};qq.getByClass=function(a,b){if(a.querySelectorAll)return a.querySelectorAll("."+b);for(var c=[],d=a.getElementsByTagName("*"),e=d.length,f=0;f<e;f++)qq.hasClass(d[f],b)&&c.push(d[f]);return c};
qq.obj2url=function(a,b,c){var d=[],e="&",f=function(a,c){var e=b?/\[\]$/.test(b)?b:b+"["+c+"]":c;"undefined"!=e&&"undefined"!=c&&d.push("object"===typeof a?qq.obj2url(a,e,!0):"[object Function]"===Object.prototype.toString.call(a)?encodeURIComponent(e)+"="+encodeURIComponent(a()):encodeURIComponent(e)+"="+encodeURIComponent(a))};if(!c&&b)e=/\?/.test(b)?/\?$/.test(b)?"":"&":"?",d.push(b),d.push(qq.obj2url(a));else if("[object Array]"===Object.prototype.toString.call(a)&&"undefined"!=typeof a){var g=
0;for(c=a.length;g<c;++g)f(a[g],g)}else if("undefined"!=typeof a&&null!==a&&"object"===typeof a)for(g in a)f(a[g],g);else d.push(encodeURIComponent(b)+"="+encodeURIComponent(a));return d.join(e).replace(/^&/,"").replace(/%20/g,"+")};qq=qq||{};
qq.FileUploaderBasic=function(a){this._options={debug:!1,action:"/server/upload",params:{},button:null,multiple:!0,maxConnections:3,allowedExtensions:[],sizeLimit:0,minSizeLimit:0,onSubmit:function(a,c){},onProgress:function(a,c,d,e){},onComplete:function(a,c,d){},onCancel:function(a,c){},messages:{typeError:"{file} has invalid extension. Only {extensions} are allowed.",sizeError:"{file} is too large, maximum file size is {sizeLimit}.",minSizeError:"{file} is too small, minimum file size is {minSizeLimit}.",
emptyError:"{file} is empty, please select files again without it.",onLeave:"The files are being uploaded, if you leave now the upload will be cancelled."},showMessage:function(a){alert(a)}};qq.extend(this._options,a);this._filesInProgress=0;this._handler=this._createUploadHandler();this._options.button&&(this._button=this._createUploadButton(this._options.button));this._preventLeaveInProgress()};
qq.FileUploaderBasic.prototype={setParams:function(a){this._options.params=a},getInProgress:function(){return this._filesInProgress},_createUploadButton:function(a){var b=this;return new qq.UploadButton({element:a,multiple:this._options.multiple&&qq.UploadHandlerXhr.isSupported(),onChange:function(a){b._onInputChange(a)}})},_createUploadHandler:function(){var a=this,b;b=qq.UploadHandlerXhr.isSupported()?"UploadHandlerXhr":"UploadHandlerForm";return new qq[b]({debug:this._options.debug,action:this._options.action,
maxConnections:this._options.maxConnections,onProgress:function(b,d,e,f){a._onProgress(b,d,e,f);a._options.onProgress(b,d,e,f)},onComplete:function(b,d,e){a._onComplete(b,d,e);a._options.onComplete(b,d,e)},onCancel:function(b,d){a._onCancel(b,d);a._options.onCancel(b,d)}})},_preventLeaveInProgress:function(){var a=this;qq.attach(window,"beforeunload",function(b){if(a._filesInProgress)return b=b||window.event,b.returnValue=a._options.messages.onLeave})},_onSubmit:function(a,b){this._filesInProgress++},
_onProgress:function(a,b,c,d){},_onComplete:function(a,b,c){this._filesInProgress--;c.error&&this._options.showMessage(c.error)},_onCancel:function(a,b){this._filesInProgress--},_onInputChange:function(a){this._handler instanceof qq.UploadHandlerXhr?this._uploadFileList(a.files):this._validateFile(a)&&this._uploadFile(a);this._button.reset()},_uploadFileList:function(a){for(var b=0;b<a.length;b++)if(!this._validateFile(a[b]))return;for(b=0;b<a.length;b++)this._uploadFile(a[b])},_uploadFile:function(a){a=
this._handler.add(a);var b=this._handler.getName(a);!1!==this._options.onSubmit(a,b)&&(this._onSubmit(a,b),this._handler.upload(a,this._options.params))},_validateFile:function(a){var b,c;a.value?b=a.value.replace(/.*(\/|\\)/,""):(b=null!=a.fileName?a.fileName:a.name,c=null!=a.fileSize?a.fileSize:a.size);if(this._isAllowedExtension(b)){if(0===c)return this._error("emptyError",b),!1;if(c&&this._options.sizeLimit&&c>this._options.sizeLimit)return this._error("sizeError",b),!1;if(c&&c<this._options.minSizeLimit)return this._error("minSizeError",
b),!1}else return this._error("typeError",b),!1;return!0},_error:function(a,b){var c=this._options.messages[a],d=this._formatFileName(b),c=c.replace("{file}",d),d=this._options.allowedExtensions.join(", "),c=c.replace("{extensions}",d),d=this._formatSize(this._options.sizeLimit),c=c.replace("{sizeLimit}",d),d=this._formatSize(this._options.minSizeLimit),c=c.replace("{minSizeLimit}",d);this._options.showMessage(c)},_formatFileName:function(a){33<a.length&&(a=a.slice(0,19)+"..."+a.slice(-13));return a},
_isAllowedExtension:function(a){a=-1!==a.indexOf(".")?a.replace(/.*[.]/,"").toLowerCase():"";var b=this._options.allowedExtensions;if(!b.length)return!0;for(var c=0;c<b.length;c++)if(b[c].toLowerCase()==a)return!0;return!1},_formatSize:function(a){var b=-1;do a/=1024,b++;while(99<a);return Math.max(a,0.1).toFixed(1)+"kB MB GB TB PB EB".split(" ")[b]}};
qq.FileUploader=function(a){qq.FileUploaderBasic.apply(this,arguments);qq.extend(this._options,{element:null,listElement:null,template:'<div class="qq-uploader"><div class="qq-upload-drop-area"><span>Drop files here to upload</span></div><div class="qq-upload-button">Upload a file</div><ul class="qq-upload-list"></ul></div>',fileTemplate:'<li><span class="qq-upload-file"></span><span class="qq-upload-spinner"></span><span class="qq-upload-size"></span><a class="qq-upload-cancel" href="#">Cancel</a><span class="qq-upload-failed-text">Failed</span></li>',
classes:{button:"qq-upload-button",drop:"qq-upload-drop-area",dropActive:"qq-upload-drop-area-active",list:"qq-upload-list",file:"qq-upload-file",spinner:"qq-upload-spinner",size:"qq-upload-size",cancel:"qq-upload-cancel",success:"qq-upload-success",fail:"qq-upload-fail"}});qq.extend(this._options,a);this._element=this._options.element;this._element.innerHTML=this._options.template;this._listElement=this._options.listElement||this._find(this._element,"list");this._classes=this._options.classes;this._button=
this._createUploadButton(this._find(this._element,"button"));this._bindCancelEvent();this._setupDragDrop()};qq.extend(qq.FileUploader.prototype,qq.FileUploaderBasic.prototype);
qq.extend(qq.FileUploader.prototype,{_find:function(a,b){var c=qq.getByClass(a,this._options.classes[b])[0];if(!c)throw Error("element not found "+b);return c},_setupDragDrop:function(){var a=this,b=this._find(this._element,"drop"),c=new qq.UploadDropZone({element:b,onEnter:function(c){qq.addClass(b,a._classes.dropActive);c.stopPropagation()},onLeave:function(a){a.stopPropagation()},onLeaveNotDescendants:function(c){qq.removeClass(b,a._classes.dropActive)},onDrop:function(c){b.style.display="none";
qq.removeClass(b,a._classes.dropActive);a._uploadFileList(c.dataTransfer.files)}});b.style.display="none";qq.attach(document,"dragenter",function(a){c._isValidFileDrag(a)&&(b.style.display="block")});qq.attach(document,"dragleave",function(a){c._isValidFileDrag(a)&&(a=document.elementFromPoint(a.clientX,a.clientY),a&&"HTML"!=a.nodeName||(b.style.display="none"))})},_onSubmit:function(a,b){qq.FileUploaderBasic.prototype._onSubmit.apply(this,arguments);this._addToList(a,b)},_onProgress:function(a,b,
c,d){qq.FileUploaderBasic.prototype._onProgress.apply(this,arguments);var e=this._getItemByFileId(a),e=this._find(e,"size");e.style.display="inline";var f;f=c!=d?Math.round(100*(c/d))+"% from "+this._formatSize(d):this._formatSize(d);qq.setText(e,f)},_onComplete:function(a,b,c){qq.FileUploaderBasic.prototype._onComplete.apply(this,arguments);var d=this._getItemByFileId(a);qq.remove(this._find(d,"cancel"));qq.remove(this._find(d,"spinner"));c.success?qq.addClass(d,this._classes.success):qq.addClass(d,
this._classes.fail)},_addToList:function(a,b){var c=qq.toElement(this._options.fileTemplate);c.qqFileId=a;var d=this._find(c,"file");qq.setText(d,this._formatFileName(b));this._find(c,"size").style.display="none";this._listElement.appendChild(c)},_getItemByFileId:function(a){for(var b=this._listElement.firstChild;b;){if(b.qqFileId==a)return b;b=b.nextSibling}},_bindCancelEvent:function(){var a=this;qq.attach(this._listElement,"click",function(b){b=b||window.event;var c=b.target||b.srcElement;qq.hasClass(c,
a._classes.cancel)&&(qq.preventDefault(b),b=c.parentNode,a._handler.cancel(b.qqFileId),qq.remove(b))})}});qq.UploadDropZone=function(a){this._options={element:null,onEnter:function(a){},onLeave:function(a){},onLeaveNotDescendants:function(a){},onDrop:function(a){}};qq.extend(this._options,a);this._element=this._options.element;this._disableDropOutside();this._attachEvents()};
qq.UploadDropZone.prototype={_disableDropOutside:function(a){qq.UploadDropZone.dropOutsideDisabled||(qq.attach(document,"dragover",function(a){a.dataTransfer&&(a.dataTransfer.dropEffect="none",a.preventDefault())}),qq.UploadDropZone.dropOutsideDisabled=!0)},_attachEvents:function(){var a=this;qq.attach(a._element,"dragover",function(b){if(a._isValidFileDrag(b)){var c=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"==c||"linkMove"==c?"move":"copy";b.stopPropagation();b.preventDefault()}});
qq.attach(a._element,"dragenter",function(b){if(a._isValidFileDrag(b))a._options.onEnter(b)});qq.attach(a._element,"dragleave",function(b){if(a._isValidFileDrag(b)){a._options.onLeave(b);var c=document.elementFromPoint(b.clientX,b.clientY);if(!qq.contains(this,c))a._options.onLeaveNotDescendants(b)}});qq.attach(a._element,"drop",function(b){a._isValidFileDrag(b)&&(b.preventDefault(),a._options.onDrop(b))})},_isValidFileDrag:function(a){a=a.dataTransfer;var b=-1<navigator.userAgent.indexOf("AppleWebKit");
return a&&"none"!=a.effectAllowed&&(a.files||!b&&a.types.contains&&a.types.contains("Files"))}};qq.UploadButton=function(a){this._options={element:null,multiple:!1,name:"file",onChange:function(a){},hoverClass:"qq-upload-button-hover",focusClass:"qq-upload-button-focus"};qq.extend(this._options,a);this._element=this._options.element;qq.css(this._element,{position:"relative",overflow:"hidden",direction:"ltr"});this._input=this._createInput()};
qq.UploadButton.prototype={getInput:function(){return this._input},reset:function(){this._input.parentNode&&qq.remove(this._input);qq.removeClass(this._element,this._options.focusClass);this._input=this._createInput()},_createInput:function(){var a=document.createElement("input");this._options.multiple&&a.setAttribute("multiple","multiple");a.setAttribute("type","file");a.setAttribute("name",this._options.name);qq.css(a,{position:"absolute",right:0,top:0,fontFamily:"Arial",fontSize:"118px",margin:0,
padding:0,cursor:"pointer",opacity:0});this._element.appendChild(a);var b=this;qq.attach(a,"change",function(){b._options.onChange(a)});qq.attach(a,"mouseover",function(){qq.addClass(b._element,b._options.hoverClass)});qq.attach(a,"mouseout",function(){qq.removeClass(b._element,b._options.hoverClass)});qq.attach(a,"focus",function(){qq.addClass(b._element,b._options.focusClass)});qq.attach(a,"blur",function(){qq.removeClass(b._element,b._options.focusClass)});window.attachEvent&&a.setAttribute("tabIndex",
"-1");return a}};qq.UploadHandlerAbstract=function(a){this._options={debug:!1,action:"/upload.php",maxConnections:999,onProgress:function(a,c,d,e){},onComplete:function(a,c,d){},onCancel:function(a,c){}};qq.extend(this._options,a);this._queue=[];this._params=[]};
qq.UploadHandlerAbstract.prototype={log:function(a){this._options.debug&&window.console&&console.log("[uploader] "+a)},add:function(a){},upload:function(a,b){var c=this._queue.push(a),d={};qq.extend(d,b);this._params[a]=d;c<=this._options.maxConnections&&this._upload(a,this._params[a])},cancel:function(a){this._cancel(a);this._dequeue(a)},cancelAll:function(){for(var a=0;a<this._queue.length;a++)this._cancel(this._queue[a]);this._queue=[]},getName:function(a){},getSize:function(a){},getQueue:function(){return this._queue},
_upload:function(a){},_cancel:function(a){},_dequeue:function(a){a=qq.indexOf(this._queue,a);this._queue.splice(a,1);var b=this._options.maxConnections;this._queue.length>=b&&a<b&&(a=this._queue[b-1],this._upload(a,this._params[a]))}};qq.UploadHandlerForm=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._inputs={}};qq.extend(qq.UploadHandlerForm.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerForm.prototype,{add:function(a){a.setAttribute("name","qqfile");var b="qq-upload-handler-iframe"+qq.getUniqueId();this._inputs[b]=a;a.parentNode&&qq.remove(a);return b},getName:function(a){return this._inputs[a].value.replace(/.*(\/|\\)/,"")},_cancel:function(a){this._options.onCancel(a,this.getName(a));delete this._inputs[a];if(a=document.getElementById(a))a.setAttribute("src","javascript:false;"),qq.remove(a)},_upload:function(a,b){var c=this._inputs[a];if(!c)throw Error("file with passed id was not added, or already uploaded or cancelled");
var d=this.getName(a),e=this._createIframe(a),f=this._createForm(e,b);f.appendChild(c);var g=this;this._attachLoadEvent(e,function(){g.log("iframe loaded");var b=g._getIframeContentJSON(e);g._options.onComplete(a,d,b);g._dequeue(a);delete g._inputs[a];setTimeout(function(){qq.remove(e)},1)});f.submit();qq.remove(f);return a},_attachLoadEvent:function(a,b){qq.attach(a,"load",function(){a.parentNode&&(a.contentDocument&&a.contentDocument.body&&"false"==a.contentDocument.body.innerHTML||b())})},_getIframeContentJSON:function(a){a=
a.contentDocument?a.contentDocument:a.contentWindow.document;var b;this.log("converting iframe's innerHTML to JSON");this.log("innerHTML = "+a.body.innerHTML);try{b=eval("("+a.body.innerHTML+")")}catch(c){b={}}return b},_createIframe:function(a){var b=qq.toElement('<iframe src="javascript:false;" name="'+a+'" />');b.setAttribute("id",a);b.style.display="none";document.body.appendChild(b);return b},_createForm:function(a,b){var c=qq.toElement('<form method="post" enctype="multipart/form-data"></form>'),
d=qq.obj2url(b,this._options.action);c.setAttribute("action",d);c.setAttribute("target",a.name);c.style.display="none";document.body.appendChild(c);return c}});qq.UploadHandlerXhr=function(a){qq.UploadHandlerAbstract.apply(this,arguments);this._files=[];this._xhrs=[];this._loaded=[]};qq.UploadHandlerXhr.isSupported=function(){var a=document.createElement("input");a.type="file";return"multiple"in a&&"undefined"!=typeof File&&"undefined"!=typeof(new XMLHttpRequest).upload};
qq.extend(qq.UploadHandlerXhr.prototype,qq.UploadHandlerAbstract.prototype);
qq.extend(qq.UploadHandlerXhr.prototype,{add:function(a){if(!(a instanceof File))throw Error("Passed obj in not a File (in qq.UploadHandlerXhr)");return this._files.push(a)-1},getName:function(a){a=this._files[a];return null!=a.fileName?a.fileName:a.name},getSize:function(a){a=this._files[a];return null!=a.fileSize?a.fileSize:a.size},getLoaded:function(a){return this._loaded[a]||0},_upload:function(a,b){var c=this._files[a],d=this.getName(a);this.getSize(a);this._loaded[a]=0;var e=this._xhrs[a]=new XMLHttpRequest,
f=this;e.upload.onprogress=function(b){b.lengthComputable&&(f._loaded[a]=b.loaded,f._options.onProgress(a,d,b.loaded,b.total))};e.onreadystatechange=function(){4==e.readyState&&f._onComplete(a,e)};b=b||{};b.qqfile=d;var g=qq.obj2url(b,this._options.action);e.open("POST",g,!0);e.setRequestHeader("X-Requested-With","XMLHttpRequest");e.setRequestHeader("X-File-Name",encodeURIComponent(d));e.setRequestHeader("Content-Type","application/octet-stream");e.send(c)},_onComplete:function(a,b){if(this._files[a]){var c=
this.getName(a),d=this.getSize(a);this._options.onProgress(a,c,d,d);if(200==b.status){this.log("xhr - server response received");this.log("responseText = "+b.responseText);var e;try{e=eval("("+b.responseText+")")}catch(f){e={}}this._options.onComplete(a,c,e)}else this._options.onComplete(a,c,{});this._files[a]=null;this._xhrs[a]=null;this._dequeue(a)}},_cancel:function(a){this._options.onCancel(a,this.getName(a));this._files[a]=null;this._xhrs[a]&&(this._xhrs[a].abort(),this._xhrs[a]=null)}});;
;(function($){

    var loaded = false;
    var farbtastic;
    var current_picker;
    var font_picker_html;
    var cur_upload = null;
    var disable_set_val = false;

    $(document).ready(function(){

        var $body = $('body');

        $body.on('change', '.op-type-switcher:visible', function(){
            $(this).closest('.op-type-switcher-container').find('.op-type:first').hide().siblings('.op-type').hide().end().end().find('.op-type-'+$(this).val()).show().find('.op-bsw-grey-panel-content:not(:visible)').show().end().find('.op-type-switcher:visible').trigger('change');
        }).trigger('change');

        $body.on('click', '.op-notify', function(e){
            var $target = $(e.target);
            var date;
            var expires;
            var days = 2; //number of days before cookie expires

            if (!$target.is('a')) {
                $(this).fadeThenSlideToggle();
                if ($target.hasClass('op-notify-close') && $(this).hasClass('js-remember-choice')) {
                    //Write the notification into the cookie, so it can stay permanently hidden.
                    date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                    document.cookie = $(this).attr('id') + "=" + 'notification_hidden' + expires + "; path=/";
                }
                e.preventDefault();
            }
        });

        $('.default-val-link').click(function(e){
            var hash = $(this).attr('href').split('#')[1];
            $('#'+hash).val($('#'+hash+'_default').val());
            e.preventDefault();
        });

        $(document).mousedown(function(e) {

            if (!$(e.target).hasClass('pick-color') && !$(e.target).next().hasClass('pick-color')) {
                $('#op-color-picker-1')
                    .hide()
                    .data('openedColorPicker', false);
            }

            $('#op-color-picker-1').css({
                top: 'auto',
                left: 'auto',
                display: 'none'
            });

            if ($(e.target).closest('.select-font').length == 0){
                $('.font-dropdown').hide();
            }

            if ($(e.target).closest('.op-asset-dropdown-list').length == 0){
                $('.op-asset-dropdown-list:not(.op-disable-selected .op-asset-dropdown-list)').hide();
            }
        });

        $('.img-radio-selector.menu-position :radio').change(function(){
            var $t = $(this), func = 'hide', $panel_content = $t.closest('.op-bsw-grey-panel-content');
            if(typeof op_menu_link_colors != 'undefined' && typeof op_menu_link_colors[$t.val()] != 'undefined'){
                func = 'show';
            }
            $panel_content.find('.layout-settings').hide();
            $panel_content.find('#layout-settings-' + $t.val()).show();
        });

        $('a.fancybox').fancybox({
            openEffect: 'elastic',
            openOpacity: false,
            beforeShow: function(){
                //This is necessary in order to hide the parent fancybox scrollbars and close button
                $('html').css({
                    overflow: 'hidden',
                    height: '100%'
                });
                $(window.parent.document).find('.fancybox-close').css({ display: 'none' });
            },
            afterClose: function(){
                //This is necessary in order to hide the parent fancybox scrollbars and close button
                $('html').css({
                    overflow: 'auto',
                    height: 'auto'
                });
                $(window.parent.document).find('.fancybox-close').css({ display: 'block' });
            }
        });

        init_footer_columns();
        init_hidden_panels();
        init_radio_selectors();
        init_color_schemes();
        init_tabs();
        init_multirow();
        init_blogenabler();
        init_layout_options();
        init_color_pickers();
        init_slider_pickers();
        init_font_pickers();
        init_upload_fields();
        init_selectors();
        init_help_vids();

        // if($('form.op-bsw-settings,div.op-bsw-wizard').length > 0){
            // $('textarea.wp-editor-area').each(function(){
                // For TinyMCE 3 value must be set before addControl, and for TinyMCE 4 after addEditor.
                // if (tinymce.majorVersion > 3) {
                //     tinymce.execCommand("mceAddEditor", true, $(this).attr('id'));
                //     $(this).val(op_wpautop($(this).val()));
                // } else {
                //     $(this).val(op_wpautop($(this).val()));
                //     tinymce.execCommand("mceAddControl", true, $(this).attr('id'));
                // }
            // });
        // }

        loaded = true;

        $('.op-js-item-layout-delete').click(function(){
            var $this = $(this);
            $.ajax({
                type: 'POST',
                url: OptimizePress.ajaxurl,
                data: {'action': OptimizePress.SN+'-content-layout-delete', 'layout': $this.attr('data-id'), 'nonce': $this.attr('data-nonce')},
                success: function(response){
                    if (typeof response.success === 'boolean' && response.success === true) {
                        $this.parent().remove();
                    } else {
                        alert('Error occured!');
                    }
                },
                dataType: 'json'
            });
            return false;
        });

        // Dirty fix. HTML first selection of the tinymce is messed up, this ensures that we always end up with VISUAL
        // if (typeof tinyMCE === 'object' && tinyMCE.majorVersion && tinyMCE.majorVersion > 3) {
        //     $(window).on('beforeunload', function () {
        //         $('.switch-tmce').trigger('click');
        //     });
        // }

        /**
         * Removes image loading indicators after images are loaded.
         * Blog Settings -> Modules -> Side Bar Optin -> Submit Button
         */
        function init_asset_loading_indicators($el) {

            if (!$el) {
                return false;
            }

            $el.find('.op-asset-dropdown-list-item:not(.op-asset-dropdown-list-item--loaded)')
                .find('img')
                    .one('load', function () {
                        $(this)
                            .parent().addClass('op-asset-img-loaded')
                            .parent().addClass('op-asset-dropdown-list-item--loaded');
                    }).each(function () {
                        if (this.complete) {
                            $(this).load();
                        }
                    });
        }
        init_asset_loading_indicators($('#op_sidebar_optin_submit_button'));
        init_asset_loading_indicators($('#op_home_feature_video_optin_submit_button_button_type_container'));
        init_asset_loading_indicators($('#op_home_feature_image_hover_optin_submit_button'));
        init_asset_loading_indicators($('#op_home_feature_video_optin_submit_button'));

        /**
         * Removes image loading indicators after images are loaded.
         * Blog Settings -> Modules -> Side Bar Optin -> Submit Button
         */
        init_asset_loading_indicators($('#op_sidebar_optin_submit_button'));
        init_asset_loading_indicators($('#op_home_feature_video_optin_submit_button_button_type_container'));
        init_asset_loading_indicators($('#op_home_feature_image_hover_optin_submit_button'));

        function init_asset_loading_indicators($el) {

            if (!$el) {
                return false;
            }

            $el.find('.op-asset-dropdown-list-item:not(.op-asset-dropdown-list-item--loaded)')
                .find('img')
                    .one('load', function () {
                        $(this)
                            .parent().addClass('op-asset-img-loaded')
                            .parent().addClass('op-asset-dropdown-list-item--loaded');
                    }).each(function () {
                        if (this.complete) {
                            $(this).load();
                        }
                    });
        }

    });

    function init_help_vids() {

        $('a.op-help-vid').each(function () {

            var $this = $(this);
            var width = parseInt($this.attr('data-width'), 10);
            var height = parseInt($this.attr('data-height'), 10);

            $this.on('click', function (e) {

                e.preventDefault();

                if ($('#op-video-help').length < 1) {
                    $('body').append('<div id="op-video-help"></div>');
                }

                $('#op-video-help').html('<video src="' + $this.attr('href') + '" width="' + width + '" height="' + height + '" controls></video>');

                $.fancybox.open({
                    padding: 0,
                    autoSize: false,
                    keys: false,
                    openEffect: 'none',
                    closeEffect: 'fade',
                    openSpeed: 0,
                    closeSpeed: 200,
                    openOpacity: true,
                    closeOpacity: true,
                    scrollOutside: false,
                    width: width,
                    height: height,
                    href: '#op-video-help',
                    beforeClose: function () {
                        OptimizePress.fancyboxBeforeCloseAnimation(this);
                        $('#op-video-help').find('video')[0].pause();
                    },
                    beforeShow: function() {
                        OptimizePress.fancyboxBeforeShowAnimation(this);
                        $('#op-video-help').find('video')[0].play();
                    },
                });

            });
        });
    };

    function init_footer_columns(){
        var full_width = 900, margin = 10;
        if(typeof op_footer_prefs != 'undefined'){
            full_width = op_footer_prefs.full_width || full_width;
            margin = op_footer_prefs.column_margin || margin;
        }
        $('.img-radio-selector.footer-columns :radio').change(function(){
            var $this = $(this);
            var v = $this.val();
            var cont = $this.closest('.op-bsw-grey-panel-content').find('.column-container');

            if($this.is(':checked')){
                if(v > 1){
                    var width = Math.floor((full_width-((v-1)*margin)));
                    var val = Math.floor(width/v);
                    cont.show();
                    cont = cont.find('.column-editor').find('div').hide().end();
                    v++;
                    for(var i=1;i<v;i++){
                        var el = cont.find('div.width-'+i).show().find(':input'),
                            ev = el.val();
                        if(ev == '' || loaded){
                            el.val(val);
                        }
                    }
                } else {
                    cont.css('display','none');
                }
            }
        });
    };

    function generate_font_pickers(selectors) {
        var $selectors = $(selectors);
        var html = '<ul><li><a href="#">Theme Default</a></li></ul>';
        var img;
        var font;

        if ($selectors.length == 0) {
            return false;
        }


        $selectors.filter(':first').find('optgroup').each(function(){
            html += '<p>'+$(this).attr('label')+'</p><ul>';
            $(this).find('option').each(function(){
                font = $(this).val();
                img = font.replace(/\s+/g, '-').toLowerCase();
                // html += '<li><a href="#"><img src="'+OptimizePress.imgurl+'fonts/'+img+'" alt="'+font+'" /></a></li>';
                html += '<li><a href="#"><span class="op-font op-font-' + img + '" data-font="'+font+'" alt="'+font+'" ></span></a></li>';
            });
            html += '</ul>';
        });
        html = '<div class="select-font"><a href="#" class="selected-font">Theme Default</a><div class="font-dropdown">'+html+'</div></div>';

        $selectors.change(function(){
            var $t = $(this);
            var v = $t.val();
            var el = $t.siblings('.select-font');

            if(v == ''){
                el = el.find('li a:first');
            } else {
                el = el.find('li a .op-font[alt="'+v+'"]');
            }
            el.trigger('click');
        });

        $selectors.each(function () {
            $(this).hide().after(html)
                .siblings('.select-font').find('li .op-font[alt="' + $(this).val() + '"]').parent().trigger('click');
        });

    }
    OptimizePress.generate_font_pickers = generate_font_pickers;

    function init_font_pickers(){
        var $body = $('body');

        $body.on('click', '.selected-font', function(e){
            $(this).closest('.select-font').find('.font-dropdown').toggle();
            e.preventDefault();
        });

        $body.on('click', '.select-font li a', function(e){
            var $t = $(this);
            var img = $t.find('.op-font');
            var val = '';

            if (img.length > 0) {
                val = img.attr('data-font');
            }

            $t.closest('.select-font').find('.font-dropdown').hide()
                .end().siblings('.font-selector').val(val)
                .end().find('.selected-font').html($t.html());

            e.preventDefault();
        });

        $body.on('click', 'a[href$="#reset"]', function(e){

            /**
             * .focus().blur() is a fix for weird behaviour that happens when
             * one color input is focused and reset next to
             * another one is clicked
             */
            $(this).parent().find(':input').focus().blur().val('').trigger('change')
                .end().find('.op-asset-dropdown-list a:first').trigger('click');

            if ($(this).prev().find('.pick-color').length > 0) {
                $('#op-color-picker-1').data('openedColorPicker', false);
            }

            e.preventDefault();

        });

        generate_font_pickers('.font-selector');
    };

    function init_selectors(){
        $('select.style-selector').next().find('a.selected-item').click(function(e){
            $(this).next().toggle();
            e.preventDefault();
        }).next().find('li a').click(function(e){
            var $t = $(this);
            e.preventDefault();
            disable_set_val = true;
            var el = $(this).closest('.op-asset-dropdown').find('li.selected').removeClass('selected').end().find('a.selected-item').html($t.html()).next().hide().end().end().prev().val($t.find('img').attr('alt'));
            $t.parent().addClass('selected');
            if(loaded){
                el.trigger('change');
            }
            disable_set_val = false;
        }).end().end().end().end().change(function(){
            if(disable_set_val === false){
                $(this).next().find('li img[alt="'+$(this).val()+'"]').trigger('click');
            }
        }).trigger('change');
    };

    /**
     * Initializes jQuery UI slider elements
     * @return {void}
     */
    function init_slider_pickers() {
        $('.slider-item').each(function(i, el) {
            var owner = $(el).closest('.submit-button-container').attr('id');
            $(el).slider({
                disabled: ($(el).attr('data-disabled') == 'true' ? true : false),
                min: parseInt($(el).attr('data-min')),
                max: parseInt($(el).attr('data-max')),
                value: parseInt($(el).attr('data-value')),
                stop: function (event, ui) {
                    var id;
                    if (typeof ui.handle != 'undefined') {
                        id = $(ui.handle).parent().attr('id');
                    } else {
                        id = ui.id;
                    }
                    $.event.trigger({type: 'update_button_preview', value: ui.value, id: id, owner: owner, element_type: 'slider', element: ui});
                },
                slide: function (event, ui) {

                    var id;
                    var $output;
                    var dataUnit = '';

                    if (typeof ui.handle != 'undefined') {
                        id = $(ui.handle).parent().attr('id');
                    } else {
                        id = ui.id;
                    }

                    if (owner) {
                        $output = $('#' + owner + ' #output_' + id);
                    } else {
                        $output = $('#output_' + id);
                    }

                    dataUnit = $output.attr('data-unit') || '';

                    if ($output.length > 0) {
                        $output.html('' + ui.value + dataUnit);
                    }

                    if (owner) {
                        $('#' + owner + ' #input_' + id).val(ui.value);
                    } else {
                        $('#input_' + id).val(ui.value);
                    }

                }
            });
        });
    }

    function init_color_pickers() {
        var $body = $('body');

        if($('#op-color-picker-1').length == 0){
            $body.append('<div id="op-color-picker-1" />');
        }
        var el = $('#op-color-picker-1');
        var $t2;

        farbtastic = $.farbtastic('#op-color-picker-1', pick_color);

        $body.on('focus', '.color-picker-container input', function(){
            $t2 = $(this);
            // $(this).data('cp_link').trigger('click');
            $(this).next().trigger('click');
        });

        $body.on('blur', '.color-picker-container input', function(){
            el.hide();
            $('#op-color-picker-1').data('openedColorPicker', false);
        });

        $body.on('change', '.color-picker-container input', function(){
            var $this = $(this);
            var c = get_color($this.val());

            if (!$this) {
                $this = $t2;
            }

            $this.data('cp_link').css('background-color',(c == '#' ? 'transparent' : c));
            c = (c === '#') ? '' : c;
            if (current_picker && current_picker[1] && $(current_picker[1]).is(':visible')) {
                pick_color(c);
            }

            if (el.is(':visible') && c != '#') {
                farbtastic.setColor(c);
            }
        });

        $('.color-picker-container input').each(function(){
            var atag = $(this).siblings('a.pick-color');
            atag.data('input',$(this));
            $(this).data('cp_link',atag).data('cp_link').css('background-color',get_color($(this).val()));
        });

        $body.on('click', 'a.pick-color', function(e){

            current_picker = [$(this), $(this).data('input')];
            if (!el.data('openedColorPicker') || current_picker[1].attr('name') !== el.data('openedColorPicker')) {
                pick_color(current_picker[1].val());
                el.position({
                    of: current_picker[0],
                    my: "left top",
                    at: "center center"
                }).show();
                el.data('openedColorPicker', current_picker[1].attr('name'));
            } else {
                el.data('openedColorPicker', false);
            }
            e.preventDefault();
        });
    };

    function init_hidden_color_pickers(selector) {
        $(selector).find('.color-picker-container :input').each(function(){
            var atag = $(this).siblings('a.pick-color');
            atag.data('input',$(this));
            $(this).data('cp_link',atag).data('cp_link').css('background-color',get_color($(this).val()));
        });
    }
    OptimizePress.init_hidden_color_pickers = init_hidden_color_pickers;

    function pick_color(color){
        farbtastic.setColor(color);
        current_picker[1].val(color);
        current_picker[0].css('background-color',color);
        $.event.trigger({type: 'update_button_preview', id: current_picker[1].attr('id'), owner: current_picker[1].closest('.submit-button-container').attr('id'), value: color});
    };

    function get_color(val){
        return '#'+val.replace(/[^a-fA-F0-9]/, '');
    };

    function init_color_schemes(){
        if(typeof op_color_schemes !== 'undefined'){
            $('.section-color_scheme .color-schemes .img-radio-item input[type="radio"]').change(function(){
                var scheme = op_color_schemes[$(this).val()].colors || {};
                $.each(scheme,function(key,val){
                    var el = $('#op_sections_color_scheme_field_'+key);
                    if((el.val() != '' && loaded) || el.val() == ''){
                        el.val(val).trigger('change');
                    }
                });
                //$('.section-color_scheme .color-options :input').trigger('change');
            }).filter(':checked').trigger('change');
        }
    };

    function init_layout_options(){
        var container = $('.column-layout .column-container'),
            editor = $('.column-layout .column-editor');
        $('.column-layout :radio').change(function(){
            var layout = {}, v = $(this).val();
            if(typeof op_column_widths.widths[v] !== 'undefined'){
                container.show();
                layout = op_column_widths.widths[v];
                editor.find('div').hide();
                var last_el = null, el, func = 'prepend', el2, input;
                $.each(layout,function(i,v){
                    el = editor.find('div.width-'+i);
                    if(el.length == 0){
                        if(last_el !== null){
                            el2.after(width_field(i,v.title));
                        } else {
                            editor.prepend(width_field(i,v.title));
                        }
                    }
                    last_el = i;
                    el = editor.find('div.width-'+i);
                    el2 = el;
                    el.show();
                    input = el.find(':input');
                    if(input.val() == '' || loaded){
                        input.val(v.width);
                    }
                });
            } else {
                container.hide();
            }
        }).filter(':checked').trigger('change');
    };

    function width_field(classname,title){
        var fieldid = 'op_sections_column_layout_widths_'+classname;
        return '<p class="width-'+classname+'">'+
                '<label for="'+fieldid+'">'+title+'</label>'+
                '<input type="text" name="op[sections][column_layout][widths]['+classname+']" id="'+fieldid+'" />'+
            '</p>';
    };

    function init_blogenabler(){
        $('.op-bsw-blog-enabler').iButton({
            change: function(elem){
                var waiting = elem.closest('p').find('.op-bsw-waiting');
                waiting.fadeIn('fast');
                $.post(
                    OptimizePress.ajaxurl,
                    {
                        'action': OptimizePress.SN+'-enable-blog',
                        'enabled':(elem.is(':checked') ? 'Y' : 'N'),
                        '_wpnonce':$('#_wpnonce').val()
                    },
                    function(resp){
                        waiting.fadeOut('fast');
                        if(typeof resp.error !== 'undefined'){
                            alert(resp.errror);
                        }
                    },
                    'json'
                );
            }
        });
    };

    function init_multirow(){
        $('body').on('click', '.op-multirow .file-preview a[href$="#remove"]', function(e){
            var $t = $(this), parent = $t.parent(), el = parent.find('.op-removefile');
            if(el.length == 0){
                el = $t.closest('.op-type').find('.op-removefile');
            }
            el.val('Y');
            parent.hide();
            e.preventDefault();
        });
        $('body').on('click', '.op-multirow .add-new-row', function(e){
            var container = $(this).closest('.op-multirow'),
                ul = container.find('.op-multirow-list'),
                lis = ul.find('> li'),
                maxli = container.find('.op-max-entries'),
                add_row = false;
            if(maxli.length > 0 && lis.length < maxli.val()){
                add_row = true;
            }
            if(maxli.length == 0){
                add_row = true;
            }
            if(add_row){
                lis.filter(':first').clone().find('.op-multirow-remove').remove().end().find(':input').val('').end().appendTo(ul).find('.op-type-switcher').trigger('change');
                ul.find('> li:last .file-preview a[href$="#remove"]').trigger('click');
            }
            e.preventDefault();
        });
        $('body').on('click', '.op-multirow .op-multirow-controls a', function(e){
            var hash = $(this).attr('href').split('#')[1],
                lis = $(this).closest('.op-multirow-list').find('> li'),
                li = $(this).closest('.op-multirow-list > li'),
                idx = lis.index(li);
            switch(hash){
                case 'move-up':
                    if(idx > 0){
                        move_item(li,'prev');
                    }
                    break;
                case 'move-down':
                    if(idx < lis.length-1){
                        move_item(li,'next');
                    }
                    break;
                case 'remove':
                    if(lis.length > 1){
                        li.remove();
                    } else {
                        li.find(':input').val('').trigger('change').end().find('.op-multirow-remove').remove();
                    }
                    break;
            }
            e.preventDefault();
        });
    };

    function init_tabs(){
        $('ul.op-bsw-grey-panel-tabs').op_tabs();
    };

    function init_radio_selectors(){
        $('body').on('change', '.img-radio-selector input[type="radio"]', function () {
            if ($(this).val() === 'alongside') {
                $('.op-header-layout-alongside').show();
                $('.op-header-layout-below').hide();
            } else if ($(this).val() === 'below') {
                $('.op-header-layout-alongside').hide();
                $('.op-header-layout-below').show();
            }
            $(this).closest('.img-radio-selector').parent().find('.img-radio-selected').removeClass('img-radio-selected');
            $(this).closest('.img-radio-item').addClass('img-radio-selected');
        });
        $('body').on('click', '.img-radio-label', function () {
            $(this).closest('.img-radio-item').find(':radio').attr('checked',true).trigger('change');
        });
        $('.img-radio-selector.menu-position .img-radio-selected .img-radio-label').trigger('click');
    };

    function init_hidden_ibuttons(selector) {
        var selector = selector || '#not-existent-div';
        $(selector).iButton({
            change: function(elem){
                var parent = elem.closest('.op-bsw-grey-panel'),
                    panel = parent.find('.op-bsw-grey-panel-content:first'),
                    link_el = parent.find('.show-hide-panel a:first'),
                    visible = panel.is(':visible'),
                    value = elem.is(':checked');
                !visible && value === true && link_el.trigger('click');
                visible && value === false && link_el.trigger('click');
            }
        });
    }

    // Expose this to global OP object
    OptimizePress.init_hidden_ibuttons = init_hidden_ibuttons;

    function init_hidden_panels(){
        init_hidden_ibuttons('.panel-controlx:not(.op-bsw-blog-enabler):not(.op-disable-ibutton-load)');

        $('body').on('click', '.op-bsw-grey-panel-header h3 a', function(e){
            e.preventDefault();
            $(this).closest('div').find('.show-hide-panel a').trigger('click');
        });

        $('body').on('click', '.show-hide-panel a', function(e){
            e.preventDefault();
            var $t = $(this),
                func1 = 'addClass',
                func2 = 'show',
                parent = $t.closest('.op-bsw-grey-panel'),
                panel = parent.find('.op-bsw-grey-panel-content:first');
            if(panel.is(':visible')){
                func1 = 'removeClass';
                func2 = 'hide';
            }
            $t[func1]('op-bsw-visible');
            panel[func2]();
            if(func2 == 'show'){
                parent.find('.op-type-switcher').trigger('change');
            }
            parent.find('.op-bsw-grey-panel-hide')[func2]();
        });
        $('.op-bsw-grey-panel.has-error .show-hide-panel a').trigger('click');
    };

    OptimizePress.init_hidden_panels = init_hidden_panels;

    function move_item(li,type){
        var clone = li.clone(true);
        clone.find(':input').each(function(idx){
            $(this).val(li.find(':input:eq('+idx+')').val());
        });
        li[type]()[(type=='next' ? 'after':'before')](clone);
        li.remove();
    };

    $.fn.fadeThenSlideToggle = function(speed, easing, callback){
        if(this.is(':hidden')){
            return this.slideDown(speed, easing).fadeTo(speed, 1, easing, callback);
        } else {
            return this.fadeTo(speed, 0, easing).slideUp(speed, easing, callback);
        }
    };

    /*
     * Return difference between arr items and object index names
     * example: arr=['First Name','Last Name'];  object={First name:'test',Field1:'test',Field2:'test'}
     * will return: object={Field1:'test',Field2:'test'}
     *
     * @param arr array
     * @param obj object
     * @return object
     */
    OptimizePress.arrayObjectDifference = function(arr,obj){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]            in obj) delete obj[arr[i]];
            if (decodeURI(arr[i]) in obj) delete obj[decodeURI(arr[i])];
        }
        return obj;
    };

    function init_upload_fields(){
        $('body').on('click', '.op-file-uploader a.button', function(e){
            e.preventDefault();
            cur_upload = [$(this).next()];
            var par = cur_upload[0].parent();
            cur_upload.push(par.find('.file-preview'));
            cur_upload.push(par.find('.op-uploader-path'));
        });
        $('body').on('click', '.op-file-uploader a.remove-file', function(e){
            e.preventDefault();
            $(this).closest('.content').html('').parent().prev().val('');
            if($.isFunction($.fancybox.update)){
                $.fancybox.update();
            }
        });
    };

    window.op_attach_file = function(){
        if(cur_upload !== null){
            tb_remove();
            var content = cur_upload[1].find('.content').html(''),
                waiting = cur_upload[1].find('.op-show-waiting').fadeIn('fast'),
                args = {
                    action: OptimizePress.SN+'-file-attachment',
                    attach_type: arguments[0]
                };
            if(arguments[0] == 'url'){
                args.media_url = arguments[1];
            } else {
                args.media_item = arguments[1];
                args.media_size = arguments[2];
            }

            $.post(OptimizePress.ajaxurl,args,function(resp){
                waiting.fadeOut('fast',function(){
                    if(cur_upload[2].length > 0){
                        cur_upload[2].val(resp.file);
                    }
                    cur_upload[0].val(resp.url).trigger('change');
                    var tmp_c = $(resp.html),
                        tmp_i = tmp_c.find('img');
                    if(tmp_i.length > 0){
                        tmp_i.load(function(){
                            $(window).trigger('resize');
                        });
                    }
                    content.html(tmp_c).fadeIn('fast');
                });
            },'json');
        }
    };
    window.op_wpautop = function(pee) {
        // pee = unautop(pee);
        var blocklist = 'table|thead|tfoot|tbody|tr|td|th|caption|col|colgroup|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|p|h[1-6]|fieldset|legend|hr|noscript|menu|samp|header|footer|article|section|hgroup|nav|aside|details|summary';

        if (!pee) {
            return '';
        }

        pee = pee.replace(/(\r\n|\n)([\&nbsp\;|\s])(\r\n|\n)/g,'<p>&nbsp;</p>');

        if ( pee.indexOf('<object') != -1 ) {
            pee = pee.replace(/<object[\s\S]+?<\/object>/g, function(a){
                return a.replace(/[\r\n]+/g, '');
            });
        }

        pee = pee.replace(/<[^<>]+>/g, function(a){
            return a.replace(/[\r\n]+/g, ' ');
        });

        // Protect pre|script tags
        if ( pee.indexOf('<pre') != -1 || pee.indexOf('<script') != -1 ) {
            pee = pee.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
                return a.replace(/(\r\n|\n)/g, '<wp_temp_br>');
            });
        }

        pee = pee + '\n\n';
        pee = pee.replace(/<br \/>\s*<br \/>/gi, '\n\n');
        pee = pee.replace(new RegExp('(<(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), '\n$1');
        pee = pee.replace(new RegExp('(</(?:'+blocklist+')>)', 'gi'), '$1\n\n');
        pee = pee.replace(/<hr( [^>]*)?>/gi, '<hr$1>\n\n'); // hr is self closing block element
        pee = pee.replace(/\r\n|\r/g, '\n');
        pee = pee.replace(/\n\s*\n+/g, '\n\n');
        pee = pee.replace(/([\s\S]+?)\n\n/g, '<p>$1</p>\n');
        pee = pee.replace(/<p>\s*?<\/p>/gi, '');
        pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
        pee = pee.replace(/<p>(<li.+?)<\/p>/gi, '$1');
        pee = pee.replace(/<p>\s*<blockquote([^>]*)>/gi, '<blockquote$1><p>');
        pee = pee.replace(/<\/blockquote>\s*<\/p>/gi, '</p></blockquote>');
        pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')(?: [^>]*)?>)', 'gi'), "$1");
        pee = pee.replace(new RegExp('(</?(?:'+blocklist+')(?: [^>]*)?>)\\s*</p>', 'gi'), "$1");
        pee = pee.replace(/\s*\n/gi, '<br />\n');
        pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*<br />', 'gi'), "$1");
        pee = pee.replace(/<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)/gi, '$1');
        pee = pee.replace(/(?:<p>|<br ?\/?>)*\s*\[caption([^\[]+)\[\/caption\]\s*(?:<\/p>|<br ?\/?>)*/gi, '[caption$1[/caption]');

        pee = pee.replace(/(<(?:div|th|td|form|fieldset|dd)[^>]*>)(.*?)<\/p>/g, function(a, b, c) {
            if ( c.match(/<p( [^>]*)?>/) )
                return a;

            return b + '<p>' + c + '</p>';
        });

        // put back the line breaks in pre|script
        pee = pee.replace(/<wp_temp_br>/g, '\n');
        return pee;
    };

    window.op_unautop = function(content){
        var blocklist1, blocklist2;

        // Protect pre|script tags
        if ( content.indexOf('<pre') != -1 || content.indexOf('<script') != -1 ) {
            content = content.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
                a = a.replace(/<br ?\/?>(\r\n|\n)?/g, '<wp_temp>');
                return a.replace(/<\/?p( [^>]*)?>(\r\n|\n)?/g, '<wp_temp>');
            });
        }
        content = content.replace(/<p>\s*<\/p>/g,'<op_temp>');
        /*
         * Newlines were wrongly parsed and they were duplicated. Here we are preserving this situation (check #newline-fix-2)
         */
        content = content.replace(/<p>\s*<br ?\/?>/g,'<op_temp>');
        // Pretty it up for the source editor
        blocklist1 = 'blockquote|ul|ol|li|table|thead|tbody|tfoot|tr|th|td|div|h[1-6]|p|fieldset';
        content = content.replace(new RegExp('\\s*</('+blocklist1+')>\\s*', 'g'), '</$1>\n');
        content = content.replace(new RegExp('\\s*<((?:'+blocklist1+')(?: [^>]*)?)>', 'g'), '\n<$1>');

        // Mark </p> if it has any attributes.
        content = content.replace(/(<p [^>]+>.*?)<\/p>/g, '$1</p#>');

        // Sepatate <div> containing <p>
        content = content.replace(/<div( [^>]*)?>\s*<p>/gi, '<div$1>\n\n');

        // Remove <p> and <br />
        content = content.replace(/\s*<p>/gi, '');
        content = content.replace(/\s*<\/p>\s*/gi, '\n\n');
        content = content.replace(/\n[\s\u00a0]+\n/g, '\n\n');
        content = content.replace(/\s*<br ?\/?>\s*/gi, '\n');

        // Fix some block element newline issues
        content = content.replace(/\s*<div/g, '\n<div');
        content = content.replace(/<\/div>\s*/g, '</div>\n');
        content = content.replace(/\s*\[caption([^\[]+)\[\/caption\]\s*/gi, '\n\n[caption$1[/caption]\n\n');
        content = content.replace(/caption\]\n\n+\[caption/g, 'caption]\n\n[caption');


        blocklist2 = 'blockquote|ul|ol|li|table|thead|tbody|tfoot|tr|th|td|h[1-6]|pre|fieldset';
        content = content.replace(new RegExp('\\s*<((?:'+blocklist2+')(?: [^>]*)?)\\s*>', 'g'), '\n<$1>');
        content = content.replace(new RegExp('\\s*</('+blocklist2+')>\\s*', 'g'), '</$1>\n');
        content = content.replace(/<li([^>]*)>/g, '\t<li$1>');

        if ( content.indexOf('<hr') != -1 ) {
            content = content.replace(/\s*<hr( [^>]*)?>\s*/g, '\n\n<hr$1>\n\n');
        }

        if ( content.indexOf('<object') != -1 ) {
            content = content.replace(/<object[\s\S]+?<\/object>/g, function(a){
                return a.replace(/[\r\n]+/g, '');
            });
        }

        // Unmark special paragraph closing tags
        content = content.replace(/<\/p#>/g, '</p>\n');
        content = content.replace(/\s*(<p [^>]+>[\s\S]*?<\/p>)/g, '\n$1');

        // Trim whitespace
        content = content.replace(/^\s+/, '');
        content = content.replace(/[\s\u00a0]+$/, '');

        // put back the line breaks in pre|script
        content = content.replace(/<wp_temp>/g, '\n');
        /*
         * #newline-fix-2, we are making simple substitution
         */
        content = content.replace(/<op_temp>/g,'<p>&nbsp;</p>');

        return content;
    };


    // TODO: Please refactor this.
    // TODO: Please, for the love of god, refactor it.
    $.fn.op_tabs = function(){
        return this.each(function(){
            var selected_class = 'op-bsw-grey-panel-tabs-selected';
            var tabs = $(this).find('li').find('a').off().click(function(e){
                    var hash = $(this).attr('href').split('#')[1];
                    $(this).parent().parent().find('.'+selected_class).removeClass(selected_class).end().end().addClass(selected_class).closest('.op-bsw-grey-panel-content').find('> .op-bsw-grey-panel-tab-content-container').find('> .op-bsw-grey-panel-tab-content:visible').hide().end().find('> .tab-'+hash).show().find('.op-type-switcher').trigger('change');
                    e.preventDefault();
                }).end(),
                first = (tabs.filter('.has-error').length > 0) ? tabs.filter('.has-error:first') : tabs.filter(':first');
            first.find('a:first').trigger('click');
        });
    };

    /**
     * Converts HEX color value to RGB array/object
     * @param  {string} hex
     * @return {array}
     */
    window.hexToRgb = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    /**
     * Generates CSS color string depending on opacity (HEX or RGBA)
     * @param  {string} color
     * @param  {int} opacity
     * @return {string}
     */
    window.generateCssColor = function(color, opacity) {
        if (opacity != 100) {
            color = hexToRgb(color);
            if (color) {
                return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + parseFloat(opacity/100) + ')';
            } else {
                return color;
            }
        } else {
            return color;
        }
    };

    /**
     * Transitioning from OP v2.2.1 to 2.2.2 we added encoding and decoding
     * to most of the elements to enable shortcodes in element fields.
     * Due to this transition, we can't be sure that all strings are properly encoded
     * (elements created in older version, but edited in newer would return
     * malformend URI error upon edit), so this ensures the error doesn't happen.
     * A couple version from 2.2.2 when we can be pretty-much sure users
     * updated their elements we can remove try-catch
     * Also, this ensures that string is always passed into to decodeURIComponent.
     *
     * @param  {string} str
     * @return {string} decoded string or empty string
     */
    window.op_decodeURIComponent = function(str) {
        var decodedStr;

        try {
            decodedStr = decodeURIComponent(str || '');
        } catch(e) {
            decodedStr = str || '';
        }

        return decodedStr;

    }


    /**
     * Base64 / binary data / UTF-8 strings utilities
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
     */

    /* Array of bytes to base64 string decoding */
    window.b64ToUint6 = function (nChr) {

      return nChr > 64 && nChr < 91 ?
          nChr - 65
        : nChr > 96 && nChr < 123 ?
          nChr - 71
        : nChr > 47 && nChr < 58 ?
          nChr + 4
        : nChr === 43 ?
          62
        : nChr === 47 ?
          63
        :
          0;

    }
    window.base64DecToArr = function (sBase64, nBlocksSize) {

        var sBase64 = sBase64 || '';

        var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
            nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
            taBytes = new Uint8Array(nOutLen);

        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;

            }
        }

        return taBytes;
    }


    /* Base64 string to array encoding */
    window.uint6ToB64 = function (nUint6) {

        return nUint6 < 26 ?
            nUint6 + 65 : nUint6 < 52 ?
            nUint6 + 71 : nUint6 < 62 ?
            nUint6 - 4 : nUint6 === 62 ?
            43 : nUint6 === 63 ?
            47 :
            65;

    }
    window.base64EncArr = function (aBytes) {

        var nMod3 = 2,
            sB64Enc = "";

        for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
            nMod3 = nIdx % 3;
            // Zvonko commented this out, it was breaking the resulting endoded string with new lines
            /*if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                sB64Enc += "\r\n";
            }*/
            nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
            if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
                nUint24 = 0;
            }
        }

        return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

    }

    /* UTF-8 array to DOMString and vice versa */
    window.UTF8ArrToStr = function (aBytes) {

        var sView = "";

        for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
            nPart = aBytes[nIdx];
            sView += String.fromCharCode(
                nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
                /* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
                (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
                (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
                (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
                (nPart - 192 << 6) + aBytes[++nIdx] - 128 : /* nPart < 127 ? */ /* one byte */
                nPart
            );
        }

        return sView;

    }
    window.strToUTF8Arr = function (sDOMStr) {

        var aBytes, nChr, nStrLen = sDOMStr.length,
            nArrLen = 0;

        /* mapping... */

        for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
            nChr = sDOMStr.charCodeAt(nMapIdx);
            nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
        }

        aBytes = new Uint8Array(nArrLen);

        /* transcription... */

        for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
            nChr = sDOMStr.charCodeAt(nChrIdx);
            if (nChr < 128) {
                /* one byte */
                aBytes[nIdx++] = nChr;
            } else if (nChr < 0x800) {
                /* two bytes */
                aBytes[nIdx++] = 192 + (nChr >>> 6);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x10000) {
                /* three bytes */
                aBytes[nIdx++] = 224 + (nChr >>> 12);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x200000) {
                /* four bytes */
                aBytes[nIdx++] = 240 + (nChr >>> 18);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x4000000) {
                /* five bytes */
                aBytes[nIdx++] = 248 + (nChr >>> 24);
                aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else /* if (nChr <= 0x7fffffff) */ {
                /* six bytes */
                aBytes[nIdx++] = 252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824);
                aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            }
        }

        return aBytes;

    }

    /**
     * Helper method for base64 encoding with utf16 support
     */
    window.op_base64encode = function (str) {
        return base64EncArr(strToUTF8Arr(str || ''));
    }

    /**
     * Helper method for base64 decoding with utf16 support
     */
    window.op_base64decode = function (str) {
        return UTF8ArrToStr(base64DecToArr(str));
    }

    /**
     * init OptimizePress localStorage handling stuff
     */
    ;(function () {

        var opVersion = localStorage.getItem('OptimizePressVersion');
        var previousVersion;
        var item;
        var isLocalStorageEnabled = OptimizePress.script_debug === '' ? false : true;

        // Yes, this really is string "1" and "0"
        if (OptimizePress.localStorageEnabled === '1') {
            isLocalStorageEnabled = true;
        } else if (OptimizePress.localStorageEnabled === '0') {
            isLocalStorageEnabled = false;
        }

        // Test if localstorage is supported in browser
        try {
            localStorage.setItem('op_test', 'op_test');
            localStorage.removeItem('op_test');
        } catch(e) {
            // localStorage is not supported by the browser, so we don't want to use it
            isLocalStorageEnabled = false;
        }

        OptimizePress.localStorage = {};
        // console.log('isLocalStorageEnabled', isLocalStorageEnabled);

        /**
         * If the OP version has changed we clear entire localstorage
         * to ensure user has the latest version of the files.
         */
        if (opVersion !== OptimizePress.version) {
            previousVersion = localStorage.getItem('OptimizePressVersion');
            if (previousVersion) {
                for (item in localStorage) {
                    if (localStorage.hasOwnProperty(item) && item.indexOf('op_') === 0) {
                        localStorage.removeItem(item);
                    }
                }
            }
            localStorage.setItem('OptimizePressVersion', OptimizePress.version);
        }

        /**
         * Expose a helper method that clears all localStorage entries (not only OP entries)
         */
        OptimizePress.localStorage.clearAll = function () {
            for (item in localStorage) {
                if (localStorage.hasOwnProperty(item) && item.indexOf('op_') === 0) {
                    localStorage.removeItem(item);
                }
            }
        }

        /**
         * Writes into the browser's localStorage, but ads op_ prefix to the key and op_version sufix
         * (for tracking op updates and clearing localstorage upon version change; it adds OPPP version as a suffix if it is active).
         * @param {string} key
         * @param {string} value
         */
        OptimizePress.localStorage.setItem = function (key, value) {
            if (!isLocalStorageEnabled) {
                return null;
            }

            var cacheKey = 'op_' + key + '_' + OptimizePress.version;
            if (typeof OptimizePress.oppp !== 'undefined' && typeof OptimizePress.oppp.version !== 'undefined') {
                cacheKey += '-oppp_' + OptimizePress.oppp.version;
            }

            localStorage.setItem(cacheKey, value);
            return true;
        }

        /**
         * Returns the value of the key (key is retrieved with op prefix and op_version suffix; it adds OPPP version as a suffix if it is active).
         * @return {string}
         */
        OptimizePress.localStorage.getItem = function (key) {
            if (!isLocalStorageEnabled) {
                return null;
            }

            var cacheKey = 'op_' + key + '_' + OptimizePress.version;
            if (typeof OptimizePress.oppp !== 'undefined' && typeof OptimizePress.oppp.version !== 'undefined') {
                cacheKey += '-oppp_' + OptimizePress.oppp.version;
            }

            return localStorage.getItem(cacheKey);
        }
    }());

    // OptimizePress AJAX admin calls
    ;(function () {

        OptimizePress.ajax = {};

        /**
         * Clears elements SL cache.
         * @return {Deferred}
         */
        OptimizePress.ajax.clearElementsCache = function() {
            return $.ajax({
                url: OptimizePress.ajaxurl + '?action=' + OptimizePress.SN + '-clear-elements-cache',
                type: 'GET'
            });
        };

    }());

}(opjq));
;
;

var op_cur_html;
var cur = [];

(function ($) {

    var fancy_defaults = {};
    var win = $(window);
    var parent_win = window.dialogArguments || opener || parent || top;
    var scroll_top;
    var epicbox;
    var child_element = false;
    var cur_child;
    var refresh_item = null;
    var sort_default = {
        revert: 'invalid',
        scrollSensitivity: '50',
        tolerance: 'pointer'
    };
    var editor_switch = false;
    var wysiwygs_checked = false;
    var cat_options = [];
    var subcat_options = [];
    var $body;
    var $html = $('html');
    var defaultEpicboxTitle = '';

    // We want this code to be executed only in Live Editor.
    if (!$html.hasClass('op-live-editor')) {
        return false;
    }

    // OptimizePress is a global optimizepress object
    OptimizePress.disable_alert = false;

    /**
     * We register any custom elements needed in live editor
     * Custom elements will work even withouth registering them,
     * they'll just utilize HTMLUnknownElement interface instead of HTMLElement interface
     */
    if (typeof document.registerElement !== 'undefined') {
        document.registerElement('op-row-before');
        document.registerElement('op-row-after');
    }

    $(document).ready(function () {
        $body = $('body');
        bind_content_sliders();
        $('#changeMembershipType').click(function (event) {
            $('#pageTypeChange').attr('disabled', false).attr('name', 'op[type]').css('border-color', '#66AFE9').css('box-shadow', '0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(102, 175, 233, 0.6)');
        });
        $('#pageTypeChange').change(function (event) {
            $('#le-membership-dialog .editor-button').trigger('click');
        });
        // header and navigation link
        $('#op_header_disable_link').change(function (event) {
            if ($(this).is(':checked')) {
                $('#op_header_link').hide();
            } else {
                $('#op_header_link').show();
            }
        }).trigger('change');
        $('#op_category_id').find('option').each(function () {
            var selected_val;
            if ($(this).attr('selected')) {
                selected_val = $(this).val();
            } else {
                selected_val = '';
            }
            cat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
        });
        $('#op_subcategory_id').find('option').each(function () {
            var selected_val;
            if ($(this).attr('selected')) {
                selected_val = $(this).val();
            } else {
                selected_val = '';
            }
            subcat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
        });
        if (typeof switchEditors != 'undefined') {
            editor_switch = true;
        }

        /** AUTOSAVE **/
        var autosaveTriggered = false;
        function autosave() {
            autosaveTriggered = true;
            OptimizePress.disable_alert = true;
            window.op_dont_show_loading = true;
            save_content();
        }
        if (!autosaveTriggered && OptimizePress.op_autosave_enabled === 'Y') {
            setInterval(autosave, OptimizePress.op_autosave_interval * 1000);
        }

        $('#op_product_id').change(function (event, a) {
            show_member_fields($('#op_category_id'), $(this).val(), 'category', a);
        }).trigger('change', ["first"]);
        $('#op_category_id').change(function (event, a) {
            show_member_fields($('#op_subcategory_id'), $(this).val(), 'subcategory', a);
        }).trigger('change', ["second"]);
        function show_member_fields(el, id, what, clean) {
            el.empty();
            if (what == 'category') {
                el.append(
                    $('<option>').text('').val('')
                );
                $.each(cat_options, function (i) {
                    var option = cat_options[i];
                    if (option.parent === 'parent-' + id) {
                        if (option.selected != '') {
                            el.append(
                                $('<option>').text(option.text).val(option.value).attr('selected', true)
                            );
                        } else {
                            el.append(
                                $('<option>').text(option.text).val(option.value)
                            );
                        }
                    }
                });
            } else {
                el.append(
                    $('<option>').text('').val('')
                );
                $.each(subcat_options, function (i) {
                    var option = subcat_options[i];
                    if (option.parent === 'parent-' + id) {
                        if (option.selected != '') {
                            el.append(
                                $('<option>').text(option.text).val(option.value).attr('selected', true)
                            );
                        } else {
                            el.append(
                                $('<option>').text(option.text).val(option.value)
                            );
                        }
                    }
                });
            }
            if (typeof clean === 'undefined') {
                el.val('');
            }
            if (el.selector == '#op_category_id') {
                $('#op_category_id').trigger('change');
            }
            if (el.selector == '#op_category_id1') {
                $('#op_category_id1').trigger('change', clean);
            }
        }

        /*function show_member_fields(el, id, clean) {
         el.find("option").show();
         el.find("option:not(.parent-" + id + ",.default-val)").hide();
         if (typeof clean === 'undefined') {
         el.val('');
         }
         if (el.selector == '#op_category_id') {
         $('#op_category_id').trigger('change', clean);
         }
         };*/

        var preset_options = $('#preset-option-preset,#preset-option-content_layout');
        $('#preset-option :radio').change(function () {
            preset_options.hide();
            if ($(this).is(':checked') && (v = $(this).val()) && v != 'blank') {
                $('#preset-option-' + v).show();
            }
        }).filter(':checked').trigger('change');

        epicbox = [$('#epicbox-overlay'), $('#epicbox')];
        epicbox.push($('.epicbox-content', epicbox[1]));
        epicbox.push($('.epicbox-scroll', epicbox[2]));

        win.bind('beforeunload', function (e) {
            // Object.is() is used to ensure that dialog doesn't appear twice in Firefox
            // when you're on wp pages and have live editor opened in fancybox
            if (OptimizePress.disable_alert === false && Object.is(window.parent, window)) {
                var message = 'If you leave page, all unsaved changes will be lost.';
                if (typeof e == 'undefined') {
                    e = window.event;
                }
                if (e) {
                    e.returnValue = message;
                }
                return message;
            }
        }).resize(function () {
            scroll_top = $('.fancybox-inner').scrollTop();
            resize_epicbox();
        });

        fancy_defaults = {
            padding: 0,
            autoSize: true,
            wrapCSS: 'fancybox-no-scroll',
            helpers: {
                overlay: {
                    closeClick: false
                }
            },
            keys: false,
            opLocked: true,
            openEffect: 'none',
            closeEffect: 'fade',
            openSpeed: 0,
            closeSpeed: 200,
            openOpacity: true,
            closeOpacity: true,
            scrollOutside: false,

            // beforeClose: close_wysiwygs,
            beforeClose: function () {
                OptimizePress.fancyboxBeforeCloseAnimation(this);
                // if(editor_switch && typeof this.content != 'string'){
                //     this.content.find('.wp-editor-area').each(function(){
                //         var id = $(this).attr('id');
                //         if(id != 'opassetswysiwyg'){
                //             $('#'+id+'-tmce').trigger('click');
                //             //var content = OP_AB.wysiwyg_content(id);
                //             tinyMCE.execCommand('mceFocus', false, id);
                //             if (tinyMCE.majorVersion > 3) {
                //                 tinyMCE.execCommand('mceRemoveEditor', false, id);
                //             } else {
                //                 tinyMCE.execCommand('mceRemoveControl', false, id);
                //             }
                //             //$(this).val(content);
                //         }
                //     });
                // }
            },

            afterClose: function () {
                scroll_top = null;
                refresh_item = null;

                /**
                 * We unbind events related to revisions
                 * (they're binded in afterShow, if revisions tab is opened)
                 */
                if (OptimizePress._pageRevisionsActive) {
                    OptimizePress._pageRevisionsActive = false;
                    $('#op-current-iframe').attr('src', '');
                    $('#op-revisions-iframe').attr('src', '');
                    $(document).off('pageRevisionsFancyboxOpen');
                    $(window).off('resize', OptimizePress._repositionRevisionsPopup);
                }

                //This is necessary in order to hide the parent fancybox scrollbars and close button
                // $('html').css({
                //     overflow: 'auto',
                //     height: 'auto'
                // });

                /**
                 * Parent fancybox close button was hidden
                 * (because we don't want two close buttons to be visible when fancybox is opened)
                 */
                $(window.parent.document).find('.fancybox-close').css({display: 'block'});
            },

            beforeShow: function () {

                // This is necessary in order to hide the parent fancybox scrollbars and close button
                // $('html').css({
                //     overflow: 'hidden',
                //     height: '100%'
                // });

                OptimizePress.fancyboxBeforeShowAnimation(this);


                /**
                 * Parent fancybox close button was hidden
                 * (because we don't want two close buttons to be visible when fancybox is opened)
                 */
                $(window.parent.document).find('.fancybox-close').css({display: 'none'});
            },

            afterShow: function () {

                var $fancyBoxOpened;
                var $fancyBoxIframe;

                // if(editor_switch && typeof this.content != 'string'){
                //     this.content.find('.wp-editor-area').each(function(){
                //         var id = $(this).attr('id');

                //         // For TinyMCE 3 value must be set before addControl, and for TinyMCE 4 after addEditor.
                //         if (tinyMCE.majorVersion > 3) {
                //             tinyMCE.execCommand("mceAddEditor", true, id);
                //             $(this).val(OP_AB.autop($(this).val()));
                //         } else {
                //             $(this).val(OP_AB.autop($(this).val()));
                //             tinyMCE.execCommand("mceAddControl", true, id);

                //         }
                //     });
                // }

                $('select.op-type-switcher').trigger('change');
                $fancyBoxOpened = $('.fancybox-opened').eq(-1);
                $fancyBoxIframe = $fancyBoxOpened.find('iframe');

                if ($fancyBoxIframe.length > 0) {
                    $fancyBoxIframe.focus();
                } else {
                    $fancyBoxOpened
                        .find('.fancybox-inner')
                        .addClass('op_no_outline')
                        .attr('tabindex', 0)
                        .focus();
                }

                // We do this to resize revisions dialog iframes properly
                if (OptimizePress._pageRevisionsActive) {
                    $(document).trigger('pageRevisionsFancyboxOpen');
                }

                //Fancybox loading is now hidden, so we can show default OP loading overlay if needed.
                window.op_dont_show_loading = false;

            },
            onCancel: function () {
                cur = [];
            },
            onUpdate: function () {
                if (scroll_top != null) {
                    $('.fancybox-inner').scrollTop(scroll_top);
                }
            }
        };

        OptimizePress.fancy_defaults = fancy_defaults;

        /**
         * Row Update Click
         */
        $body.on('click', '#op-le-row-options-update', function (e) {
            e.preventDefault();
            var dataStyles = {};
            dataStyles.elementId = cur[0].attr('id');
            if ($('input[name="op_full_width_row"]:checked').length > 0) {
                cur[0].addClass('section');
            } else {
                cur[0].removeClass('section');
            }

            /*
             * Row CSS class
             */
            if (cur[0].attr('data-style') && '' !== cur[0].attr('data-style')) {
                var oldDataStyles = JSON.parse(atob(cur[0].attr('data-style')));
                /*
                 * We need to get rid of old class entry
                 */
                if (typeof oldDataStyles.cssClass !== 'undefined') {
                    cur[0].removeClass(oldDataStyles.cssClass);
                }
            }
            if ($('#op_row_css_class').val() !== '') {
                cur[0].addClass($('#op_row_css_class').val());
                dataStyles.cssClass = $('#op_row_css_class').val();
            }

            /**
             * Background Image, Position, Overlay and Paralax
             */
            if ($('#op_row_bg_options').val() && $('#op_row_background').val()) {
                var position = $('#op_row_bg_options').val();
                var image = "url(" + $('#op_row_background').val() + ")";
                var imageColor = $('#op_row_options_backgroundImageColor').val();
                var imageColorOpacity = $('#input_op_section_row_options_backgroundImageOpacity').val();
                var backgroundParalax = $('#op_paralax_background_image').is(':checked');

                dataStyles.backgroundImage = image;
                dataStyles.backgroundPosition = position;
                dataStyles.backgroundImageColor = imageColor;
                dataStyles.backgroundImageColorOpacity = imageColorOpacity;
                dataStyles.backgroundParalax = backgroundParalax;

                var child = cur[0].children('.op-row-image-color-overlay');

                if(imageColorOpacity != 0)
                    child.css({'opacity': '0.' + imageColorOpacity});
                else
                    child.css({'opacity': ''});

                if(imageColor != '' && imageColor != undefined)
                    child.css({'background': imageColor});
                else
                    child.css({'background': ''});

                switch (position) {
                    case 'center':
                        cur[0].css({'background-image': image,
                            'background-repeat': 'no-repeat',
                                    'background-position': 'center'});
                        break;
                    case 'cover':
                        cur[0].css({'background-image': image,'background-size': 'cover',
                                    'background-repeat': 'no-repeat'});
                        break;
                    case 'tile_horizontal':
                        cur[0].css({'background-image': image, 'background-repeat': 'repeat-x'});
                        break;
                    case 'tile':
                        cur[0].css({'background-repeat': 'repeat', 'background-image': image});
                        break;
                }

                if (backgroundParalax === true){
                    var thereIsAlreadyAnotherRowWithParallax = false;
                    if ($('.row').is("[data-stellar-background-ratio]")) {
                        thereIsAlreadyAnotherRowWithParallax = true;
                    }

                    cur[0].attr('data-stellar-background-ratio', '0.3');
                    if (thereIsAlreadyAnotherRowWithParallax === true) {
                        $.stellar("refresh");
                    } else {
                        $.stellar({horizontalScrolling:false});
                    }

                }

            } else {
                cur[0].css({'background-image': 'none', 'background-repeat': 'no-repeat'});
            }

            function htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }

            /**
             * Row Code before and after
             */
            var html = '';
            var before = '';
            var after = '';
            var markup = '';
            var beforeVal = '';
            var afterVal = '';
            var beforeAndAfter = '';

            if ($('#op_row_before').val()) {
                beforeVal = $('#op_row_before').val();
            }
            if ($('#op_row_after').val()) {
                afterVal = $('#op_row_after').val();
            }

            if (beforeVal !== '' && afterVal !== '') {
                beforeAndAfter = beforeVal + '---OP-BEFORE-AFTER---' + afterVal;
                beforeAndAfter = HTMLtoXML(beforeAndAfter);
                beforeAndAfter = beforeAndAfter.split(/---OP-BEFORE-AFTER---/);
                beforeVal = beforeAndAfter[0];
                afterVal = beforeAndAfter[1];
            } else {
                beforeVal = beforeVal ? HTMLtoXML(beforeVal) : beforeVal;
                afterVal = afterVal ? HTMLtoXML(afterVal) : afterVal;
            }

            before = '<op-row-before class="op-row-code-before">' + htmlEntities(beforeVal) + '</op-row-before>';
            after = '<op-row-after class="op-row-code-after">' + htmlEntities(afterVal) + '</op-row-after>';

            cur[0].prev('.op-row-code-before').remove();
            cur[0].next('.op-row-code-after').remove();
            cur[0].before(before);
            cur[0].after(after);

            if (beforeVal) {
                dataStyles.codeBefore = beforeVal;
            }
            if (afterVal) {
                dataStyles.codeAfter = afterVal;
            }

            /**
             * Background Color (Start and End)
             */
            if ($('#op_section_row_options_bgcolor_start').val()) {
                dataStyles.backgroundColorStart = $('#op_section_row_options_bgcolor_start').val();
                if ($('#op_section_row_options_bgcolor_end').val()) {
                    // gradient
                    var start_color = $('#op_section_row_options_bgcolor_start').val();
                    var end_color = $('#op_section_row_options_bgcolor_end').val();
                    dataStyles.backgroundColorEnd = $('#op_section_row_options_bgcolor_end').val();
                    cur[0]
                        .css('background', start_color)
                        .css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + start_color + '), color-stop(100%, ' + end_color + '))')
                        .css('background', '-webkit-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                        .css('background', '-moz-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                        .css('background', '-ms-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                        .css('background', '-o-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                        .css('background', 'linear-gradient(to bottom, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                        .css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=' + start_color + ', endColorstr=' + end_color + ', GradientType=0 )');
                } else {
                    cur[0].css('background-color', $('#op_section_row_options_bgcolor_start').val());
                }
            } else {
                cur[0].css('background-color', '');
            }

            /**
             * Padding Top
             */
            if ($('#op_row_top_padding').val()) {
                cur[0].css('padding-top', $('#op_row_top_padding').val() + 'px');
                dataStyles.paddingTop = $('#op_row_top_padding').val();
            } else {
                cur[0].css('padding-top', '');
            }

            /**
             * Padding bottom
             */
            if ($('#op_row_bottom_padding').val()) {
                cur[0].css('padding-bottom', $('#op_row_bottom_padding').val() + 'px');
                dataStyles.paddingBottom = $('#op_row_bottom_padding').val();
            } else {
                cur[0].css('padding-bottom', '');
            }

            // // border width
            // if ($('#op_row_border_width').val()) {
            //     cur[0].css('border-top-width', $('#op_row_border_width').val() + 'px');
            //     cur[0].css('border-bottom-width', $('#op_row_border_width').val() + 'px');
            //     dataStyles.borderWidth = $('#op_row_border_width').val();
            // }

            // if ($('#op_section_row_options_borderColor').val()) {
            //     cur[0].css('border-top-color', $('#op_section_row_options_borderColor').val());
            //     cur[0].css('border-bottom-color', $('#op_section_row_options_borderColor').val());
            //     cur[0].css('border-style', 'solid');
            //     dataStyles.borderColor = $('#op_section_row_options_borderColor').val();
            // }

            /**
             * Border Top Width
             */
            if ($('#op_row_border_top_width').val()) {
                cur[0].css('border-top-width', $('#op_row_border_top_width').val() + 'px');
                dataStyles.borderTopWidth = $('#op_row_border_top_width').val();
            } else {
                cur[0].css('border-top-width', '0px');
                dataStyles.borderTopWidth = '';
            }

            /**
             * Border Top Color
             */
            if ($('#op_section_row_options_borderTopColor').val()) {
                cur[0].css('border-top-color', $('#op_section_row_options_borderTopColor').val());
                cur[0].css('border-top-style', 'solid');
                dataStyles.borderTopColor = $('#op_section_row_options_borderTopColor').val();
            } else {
                cur[0].css('border-top-color', '');
                dataStyles.borderTopColor = '';
            }

            /**
             * Border Bottom Width
             */
            if ($('#op_row_border_bottom_width').val()) {
                cur[0].css('border-bottom-width', $('#op_row_border_bottom_width').val() + 'px');
                dataStyles.borderBottomWidth = $('#op_row_border_bottom_width').val();
            } else {
                cur[0].css('border-bottom-width', '0px');
                dataStyles.borderBottomWidth = '';
            }

            /**
             * Border Bottom Color
             */
            if ($('#op_section_row_options_borderBottomColor').val()) {
                cur[0].css('border-bottom-color', $('#op_section_row_options_borderBottomColor').val());
                cur[0].css('border-bottom-style', 'solid');
                dataStyles.borderBottomColor = $('#op_section_row_options_borderBottomColor').val();
            } else {
                cur[0].css('border-bottom-color', '');
                dataStyles.borderBottomColor = '';
            }

            /**
             * Section Separator
             */
            if ($('#op_row_section_separator_option').val()) {
                var elementId = cur[0].attr('id');
                var elementNumber = elementId.split('_');
                var sectionSeparatorStyle = document.getElementById('section-separator-style-' + elementNumber[3]);
                if (sectionSeparatorStyle) {
                    sectionSeparatorStyle.remove();
                }

                dataStyles.sectionSeparatorType = $('#op_row_section_separator_option').val();
                var styleString = generate_section_separator_style(elementId, dataStyles);
                dataStyles.sectionSeparatorStyle = styleString;
                var styleHtmlObject = $(styleString);
                styleHtmlObject.insertBefore('#' + elementId);
            }

            /**
             * Animate Row
             */
            if ($('.op_row_advanced_options_extras').length > 0) {
                $.each($('.op_row_advanced_options_extras'), function (index, field) {
                    var $field = $(field);
                    dataStyles.extras = dataStyles.extras || {};
                        dataStyles.extras[$field.attr('data-name')] = $field.val();
                        dataStyles.extras[$field.attr('data-name')] = $field.val();
                });
            }
   
            /**
             * Row Scroll Fixed Position
             */
            if ($('#op_scroll_fixed_position').val()) {
                var scrollFixedPosition = $('#op_scroll_fixed_position');
                dataStyles.rowScrollFixedPosition = scrollFixedPosition.val();
            }

            /**
             * Row Scroll Fixed Position
             */
            var scrollFixedMobile = $('#op_scroll_fixed_mobile').is(':checked');
            dataStyles.rowScrollFixedMobile = scrollFixedMobile;

            /**
             * Changing Background Colour
             */
             if ($('#op_section_row_background_changing_color_start').val() && 
                 $('#op_section_row_background_changing_color_end').val() &&
                 $('#op_section_row_background_changing_color_speed').val()) {

                var backgroundChangingColorStart = $('#op_section_row_background_changing_color_start');
                cur[0].css('background-color', backgroundChangingColorStart.val());

                dataStyles.backgroundChangingColorStart = backgroundChangingColorStart.val();
                dataStyles.backgroundChangingColorEnd = $('#op_section_row_background_changing_color_end').val();
                dataStyles.backgroundChangingColorSpeed = $('#op_section_row_background_changing_color_speed').val();
             }

            /*
             * Row addons (Video Background)
             */
            dataStyles.addon = {};
            $.each($('[id^="op_row_addon_"]'), function (i, item) {
                var $item = $(item);
                var id = $item.attr('id').replace('op_row_addon_', '');
                if ($item.is(':checkbox')) {
                    if ($item.prop('checked')) {
                        dataStyles.addon[id] = true;
                    }
                } else if ($item.hasClass('slider-item')) {
                    dataStyles.addon[id] = $item.find('input').val();
                } else {
                    dataStyles.addon[id] = $item.val();
                }
            });

            var base = btoa(JSON.stringify(dataStyles));
            cur[0].attr('data-style', base);

            // Hook event for addons
            $(window).trigger('op_row_addon_update', cur[0]);

            $.fancybox.close();
        });


        $('.editable-area').each(function () {
            var el = $(this),
                id = el.attr('id');
            init_editable_area(el, id.substr(0, id.length - 5));
            custom_item_ids(el);
        });

        init_child_elements();

        /**
         * Add class "selected" to chosen layout
         */
        $body.on('click', '#op-le-row-select li a', function (e) {
            $('#op-le-row-select li.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            e.preventDefault();
        });

        /**
         * Insert into page Click (Inserting layout)
         */
        $body.on('click', '#op-le-row-select-insert', function (e) {
            e.preventDefault();
            if ($('#op-le-row-select li.selected').length > 0){
                add_new_row($('#op-le-row-select li.selected').find('a:first'));
                if (checkIsThereAnySectionSeparatorDefined()){
                    recreate_section_separator_style();
                }
            } else {
                alert("Please choose layout");
            }
        });

        /**
         * Insert layout if user double click on it
         */
        $body.on('dblclick', '#op-le-row-select li a', function (e) {
            e.preventDefault();
            add_new_row($(this));
            if (checkIsThereAnySectionSeparatorDefined()) {
                recreate_section_separator_style();
            }
        });

        // split columns
        $body.on('click', '#op-le-split-column li a', function (e) {
            $('#op-le-split-column li.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            e.preventDefault();
        });

        $body.on('click', '#op-le-split-column-insert', function (e) {
            e.preventDefault();
            split_column($('#op-le-split-column li.selected').find('a:first'));
        });

        $body.on('dblclick', '#op-le-split-column li a', function (e) {
            e.preventDefault();
            split_column($(this));
        });

        // end split columns
        $body.on('click', 'a.feature-settings', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $t = $(this);
            cur = [$t.closest('.op-feature-area'), 'replaceWith'];
            $.fancybox.open($.extend({}, fancy_defaults, {
                type: 'inline',
                href: $t.attr('href')
            }));
        });

        $body.on('click', '#op-le-settings-toolbar div.links a', openPopupDialog);

        function openPopupDialog(e) {

            var hash = $(this).attr('href').split('#')[1];
            var $currentElement = $('#' + hash);
            var openFancybox = function (hash) {
                $.fancybox($.extend({}, fancy_defaults, {
                    minWidth: $currentElement.width(),
                    href: '#' + hash
                }));
            };

            e.preventDefault();

            /**
             * Revisions are handled separately
             */
            if (hash && hash === 'op-revisions-dialog') {

                OptimizePress._initPageRevisions(fancy_defaults);

            } else {

                // Item has already been injected so there's no need for the request
                if ($('#' + hash).length > 0) {
                    openFancybox(hash);
                    return false;
                }

                op_show_loading();

                $.post(OptimizePress.ajaxurl,
                    {
                        action: OptimizePress.SN + '-live-editor-get-menu-item',
                        _wpnonce: $('#_wpnonce').val(),
                        page_id: $('#page_id').val(),
                        hash: hash
                    },
                    function (resp) {

                        $('#op-le-menu-items').append(resp);

                        switch (hash) {

                            // Colour Scheme Settings
                            case 'le-colours-dialog':
                                OptimizePress.init_hidden_ibuttons('#le-colours-dialog .panel-controlx:not(.op-bsw-blog-enabler):not(.op-disable-ibutton-load)');
                                OptimizePress.init_hidden_color_pickers('#le-colours-dialog');
                                break;

                            // Typography
                            case 'le-typography-dialog':
                                OptimizePress.init_hidden_color_pickers('#le-typography-dialog');
                                OptimizePress.generate_font_pickers('#le-typography-dialog .font-selector');
                                break;

                            // Page Settings
                            case 'le-settings-dialog':
                                OptimizePress.init_hidden_ibuttons('#le-settings-dialog .panel-controlx:not(.op-bsw-blog-enabler):not(.op-disable-ibutton-load)');
                                $('ul.op-bsw-grey-panel-tabs').op_tabs();
                                break;

                            // Init Content Templates
                            case 'le-layouts-dialog':
                                $('ul.op-bsw-grey-panel-tabs').op_tabs();
                                break;

                            // Membership Settings
                            // At the moment, this is loaded on page load
                            // case 'le-membership-dialog':
                            // break;

                            // Layout Settings
                            case 'le-headers-dialog':
                                // Init iButton checkboxes for this menu item's children
                                OptimizePress.init_hidden_ibuttons('#le-headers-dialog .panel-controlx:not(.op-bsw-blog-enabler):not(.op-disable-ibutton-load)');
                                bind_content_sliders('#le-headers-dialog .op-content-slider-button');
                                OptimizePress.init_hidden_color_pickers('#le-headers-dialog');
                                break;
                        }

                        openFancybox(hash);
                        op_hide_loading();

                    }
                );

                return false;

                // $.fancybox($.extend({}, fancy_defaults, {
                //     minWidth: $currentElement.width(),
                //     // href: '#'+ hash
                // }));

            }

        }

        $body.on('submit', 'form.op-feature-area', function (e) {
            var form_html;

            e.preventDefault();

            $(this).find('.wp-editor-area').each(function () {
                var id = $(this).attr('id'),
                    content = OP_AB.wysiwyg_content(id);
                $(this).val(content);
            });

            /**
             * Taking care of excessive form html elements (<textarea> & <style>)
             */
            form_html = $(this).find('#op_feature_area_settings_optin_formhtml').val();
            form_html = form_html.replace(/<textarea((.|[\r|\n])*)?<\/\s?textarea>/gi, '');
            form_html = form_html.replace(/<textarea(.*?)>/gi, '');
            form_html = form_html.replace(/<style((.|[\r|\n])*)?<\/\s?style>/gi, '');
            form_html = form_html.replace(/<style(.*?)>/gi, '');
            $(this).find('#op_feature_area_settings_optin_formhtml').val(form_html);

            $.post(OptimizePress.ajaxurl, $(this).serialize(),
                function (resp) {
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    } else {
                        cur[0][cur[1]](resp.output);
                        OP_Feature_Area[resp.option] = resp.js_options;
                        $.fancybox.close();
                    }
                },
                'json'
            );
        });

        $body.on('click', '#op-le-close-editor', function (e) {
            e.preventDefault();
            OptimizePress.disable_alert = true;
            parent_win.OptimizePress.disable_alert = true;
            parent_win.opjq.fancybox.close();
        });

        $body.on('click', '#op-le-save-1', function (e) {
            e.preventDefault();
            save_content();
        });

        $body.on('click', '#op-le-save-2', function (e) {
            e.preventDefault();
            OptimizePress.disable_alert = true;
            parent_win.OptimizePress.disable_alert = true;
            save_content(parent_win.opjq.fancybox.close);
        });

        $body.on('submit', '#le-settings-dialog', function (e) {
            e.preventDefault();
            $.fancybox.close();
            save_content();
        });

        // Callback after typography settings have been submitted/saved.
        function typography_saved() {
            window.location.reload();
        }

        $body.on('submit', '#le-typography-dialog', function (e) {
            e.preventDefault();
            $.fancybox.close();
            OptimizePress.disable_alert = true;
            window.op_dont_hide_loading = true;
            op_show_loading();
            save_content(typography_saved);
        });

        $body.on('click', '.op-feature-area:not(:has(.editable-area))', function (e) {
            $(this).find('a.feature-settings').trigger('click');

            /*
             * Preventing onbeforeunload event
             */
            if (typeof $(this).attr('data-unload') != 'undefined' && $(this).attr('data-unload') == '0') {
                e.preventDefault();
            }
        });

        $body.on('click', '.fancybox-inner a', function (e) {
            scroll_top = $('.fancybox-inner').scrollTop();
            $.fancybox.update();
        });
        init_content_layouts();
        init_presets_dialogs();
        if (op_launch_funnel_enabled === true && typeof parent_win.op_launch_suite_update_selects == 'function') {
            parent_win.op_launch_suite_update_selects($('#page_id').val());
        }

        //$('a[href$="#le-settings-dialog"]').trigger('click');

        //Show delayed fade elements
        $("[data-fade]").each(function () {
            var style = $(this).attr('style');
            style = style || '';
            style = style.replace(/display:\s?none;?/gi, '');
            $(this).attr('style', style);
        });

        // show paste button only if we have something in storage
        togglePasteButtons();

        //LiveEditor Footer Toolbar
        $body.on('click', '.toggle-container', function () {
            $('.op-row-links, .add-new-row-content, .add-element-container, .add-new-element').stop().slideToggle();
            $('.op-popup').toggleClass('op-popup-clean');
            var $el = $('#toggle-visibility');
            if ($el.css('opacity') == 0.25) {
                $el.css('opacity', 1);
            } else {
                $el.css('opacity', 0.25);
            }
        });

    });

    // If Live Editor is opened in fullscreen (and not in fancybox),
    // we want to handle some stuff differently (for example, we want to hide save & close button)
    if (window.top.location.href === window.location.href) {
        OptimizePress.op_live_editor_fullscreen = "1";
        $('html').addClass('op-live-editor-fullscreen');
    }

    function togglePasteButtons() {
        if (!localStorage.getItem('op_row')) {
            $('.paste-row').hide();
        } else {
            $('.paste-row').show();
        }
    }

    function bind_content_sliders(selector) {
        // Get all the content slider buttons
        var $btn = selector ? $(selector) : $('.op-content-slider-button');
        var $cur_btn;

        // Loop through all buttons
        $btn.each(function () {
            $cur_btn = $(this);
            var $target = $('#' + $(this).data('target')); //Get the target of the current button (the content slider)

            // Unbind any existing click events so we dont duplicate them
            $(this).unbind('click').click(function (e) {
                $target.css({top: 0});
                e.preventDefault();
            });

            // Initialize the close button
            $target.find('.hide-the-panda').unbind('click').click(function (e) {
                $target.css({top: '-100%'});
                e.preventDefault();
            });

            $target.on('click', 'ul.op-image-slider-content li a', function (e) {
                var $input = $cur_btn.next('input.op-gallery-value');
                var $preview = $input.next('.file-preview').find('.content');
                var src = $(this).attr('src');
                var html = '<a class="preview-image" target="_blank" href="' + src + '"><img alt="uploaded-image" src="' + src + '"></a><a class="remove-file button" href="#remove">Remove Image</a>';
                $input.val(src);
                $input.parent().next('.op-file-uploader').find('.file-preview .content').empty().html(html).find('.remove-file').click(function () {
                    $(this).parent().empty().parent('.file-preview').prev('.op-uploader-value').val('');
                });
                $('#op_page_thumbnail').val(src);
                $target.css({top: '-100%'});

                // This ensures that fancybox is properly centered.
                // reposition has to happen when the animation is completed.
                setTimeout(function () {
                    $.fancybox.reposition();
                }, 301);

                e.preventDefault();
            });
        });
    }

    // Expose the function to the global object - not needed at the moment after all
    // OptimizePress.bind_content_sliders = bind_content_sliders;

    function init_content_layouts() {
        $body.on('click', '#le-layouts-dialog ul.op-bsw-grey-panel-tabs a', function (e) {
            var buttons = $('#le-layouts-dialog .op-insert-button');
            e.preventDefault();
            if ($(this).get_hash() == 'predefined') {
                buttons.show();
            } else {
                buttons.hide();
            }
        });
        $body.on('click', '#le-layouts-dialog .op-insert-button button', function (e) {
            return confirm(OP_AB.translate('page_overwritten_continue'));
        })

        $body.on('click', '#export_layout_category_create_new', function (e) {
            e.preventDefault();
            $('#export_layout_category_select_container:visible').fadeOut('fast', function () {
                $('#export_layout_category_new_container').fadeIn('fast');
            });
        });
        $body.on('click', '#export_layout_category_select', function (e) {
            e.preventDefault();
            $('#export_layout_category_new_container:visible').fadeOut('fast', function () {
                $('#export_layout_category_select_container').fadeIn('fast');
            });
        });
        $body.on('click', '#export_layout_category_new_submit', function (e) {
            e.preventDefault();
            var waiting = $(this).next().find('img').fadeIn('fast'), name = $(this).prev().val(),
                data = {
                    action: OptimizePress.SN + '-live-editor-create-category',
                    _wpnonce: $('#op_le_wpnonce').val(),
                    category_name: name
                };
            $.post(OptimizePress.ajaxurl, data, function (resp) {
                waiting.fadeOut('fast');
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                } else {
                    $('#export_layout_category').html(resp.html);
                    $('#export_layout_category_select').trigger('click');
                }
            }, 'json');
        });
        // membership
        $body.on('submit', '#le-membership-dialog', function (e) {
            e.preventDefault();
            $.fancybox.close();
            $.fancybox.showLoading();
            var data = {
                action: OptimizePress.SN + '-live-editor-membership',
                _wpnonce: $('#op_le_wpnonce').val(),
                page_id: $('#page_id').val()
            };
            $.extend(data, serialize($(this)));
            save_content();
            $.post(OptimizePress.ajaxurl, data,
                function (resp) {
                    $.fancybox.hideLoading();
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    }
                    if (typeof resp.done != 'undefined') {
                        OptimizePress.disable_alert = true;
                        window.location.reload();
                    }
                },
                'json'
            );
        });
        // end membership

        // headers
        $body.on('submit', '#le-headers-dialog', function (e) {
            e.preventDefault();
            var selected = $(this).find(':radio:checked').val();
            $.fancybox.close();
            //$.fancybox.showLoading();
            var data = {
                action: OptimizePress.SN + '-live-editor-headers',
                _wpnonce: $('#op_le_wpnonce').val(),
                page_id: $('#page_id').val()
            };
            $.extend(data, serialize($(this)));
            save_content();
            $.post(OptimizePress.ajaxurl, data,
                function (resp) {
                    $.fancybox.hideLoading();
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    }
                    if (typeof resp.done != 'undefined') {
                        OptimizePress.disable_alert = true;
                        window.location.reload();
                    }
                },
                'json'
            );
        });
        // end headers
        // colours
        $body.on('submit', '#le-colours-dialog', function (e) {
            e.preventDefault();
            var selected = $(this).find(':radio:checked').val();
            $.fancybox.close();
            //$.fancybox.showLoading();
            var data = {
                action: OptimizePress.SN + '-live-editor-colours',
                _wpnonce: $('#op_le_wpnonce').val(),
                page_id: $('#page_id').val()
            };
            $.extend(data, serialize($(this)));
            save_content();
            $.post(OptimizePress.ajaxurl, data,
                function (resp) {
                    $.fancybox.hideLoading();
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    }
                    if (typeof resp.done != 'undefined') {
                        OptimizePress.disable_alert = true;
                        window.location.reload();
                    }
                },
                'json'
            );
        });
        // end colours

        $body.on('submit', '#le-layouts-dialog', function (e) {
            e.preventDefault();
            var selected = $(this).find(':radio:checked').val();
            $.fancybox.close();
            $.fancybox.showLoading();
            var opts = {
                action: OptimizePress.SN + '-live-editor-get-layout',
                _wpnonce: $('#op_le_wpnonce').val(),
                layout: selected,
                page_id: $('#page_id').val(),
                keep_options: []
            };
            $('#content_layout_keep_options :checkbox:checked').each(function () {
                opts.keep_options.push($(this).val());
            });
            $.post(OptimizePress.ajaxurl, opts,
                function (resp) {
                    $.fancybox.hideLoading();
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    }
                    if (typeof resp.done != 'undefined') {
                        OptimizePress.disable_alert = true;
                        window.location.reload();
                    }
                },
                'json'
            );
        });

        $body.on('click', '#op_export_content a.delete-file', function (e) {
            e.preventDefault();
            var waiting = $(this).parent().prev().fadeIn('fast'),
                data = {
                    action: OptimizePress.SN + '-live-editor-deleted-exported-layout',
                    _wpnonce: $('#op_le_wpnonce').val(),
                    filename: $('#zip_filename').val()
                };
            $.post(OptimizePress.ajaxurl, data, function (resp) {
                waiting.fadeOut('fast');
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                }
                $('#op_export_content').html('');
            }, 'json');
        });

        $body.on('click', '#export_layout_submit', function (e) {
            e.preventDefault();
            $('#op_export_content').html('');
            var waiting = $(this).next().fadeIn('fast'),
                data = {
                    action: OptimizePress.SN + '-live-editor-export-layout',
                    status: $('#op-live-editor-status').val(),
                    _wpnonce: $('#op_le_wpnonce').val(),
                    layout_name: $('#export_layout_name').val(),
                    layout_description: $('#export_layout_description').val(),
                    layout_category: $('#export_layout_category').val(),
                    image: $('#export_layout_image_path').val(),
                    page_id: $('#page_id').val(),
                    preview_url: $('#export_layout_preview_url').val() || '',
                    op: {},
                    layouts: {}
                };

            $('div.editable-area').each(function () {
                var l = $(this).data('layout');
                data.layouts[l] = get_layout_array($(this));
            });
            if (typeof OP_Feature_Area != 'undefined') {
                data.feature_area = OP_Feature_Area;
            }
            var dialogs = ['typography', 'settings'];
            for (var i = 0, dl = dialogs.length; i < dl; i++) {
                $.extend(data.op, serialize($('#le-' + dialogs[i] + '-dialog')).op || {});
            }

            $.post(OptimizePress.ajaxurl, data,
                function (resp) {
                    waiting.fadeOut('fast');
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    }
                    if (typeof resp.output != 'undefined') {
                        $('#op_export_content').html(resp.output);
                    }
                },
                'json'
            );
        });

        /**
         * We don't want to show alert warning the user that the changes
         * may not be saved if he only tries to download a file
         */
        $body.on('click', '.op-download-file', function (e) {
            OptimizePress.disable_alert = true;
            setTimeout(function () {
                OptimizePress.disable_alert = false;
            }, 100);
        });

        $('#op_header_layout_nav_bar_alongside_enabled').change(function () {
            $('#advanced_colors_nav_bar_alongside').toggle($(this).is(':checked'));
        }).trigger('change');

        $('#op_footer_area_enabled').change(function () {
            $('#advanced_colors_footer').toggle($(this).is(':checked'));
        }).trigger('change');

        /**
         * The $('#op_footer_area_enabled').trigger() - line above - triggers iButton change in common.js::init_hidden_panels() and therefore opens footer area upon page load, which is not a desired behaviour.
         * This is the fix that hides the area afterwards, but doesn't change the behaviour attached to initial change event.
         */
        $('#op_footer_area_enabled').parentsUntil('.section-footer_area', '.op-bsw-grey-panel-header').next().hide();

        $('#op_header_layout_nav_bar_below_enabled').change(function () {
            $('#advanced_colors_nav_bar_below').toggle($(this).is(':checked'));
        }).trigger('change');

        $('#op_header_layout_nav_bar_above_enabled').change(function () {
            $('#advanced_colors_nav_bar_above').toggle($(this).is(':checked'));
        }).trigger('change');
    }

    function init_presets_dialogs() {
        $body.on('click', '#op-save-preset', function (e) {
            e.preventDefault();
            $.fancybox.open($.extend({}, fancy_defaults, {
                type: 'inline',
                href: '#le-presets-dialog'
            }));
        });
        $('#le-presets-dialog').submit(function (e) {
            e.preventDefault();
            var data = {
                action: OptimizePress.SN + '-live-editor-save-preset',
                status: $('#op-live-editor-status').val(),
                _wpnonce: $('#op_le_wpnonce').val(),
                page_id: $('#page_id').val(),
                op: {},
                preset: serialize($('#le-presets-dialog')),
                layouts: {}
            };
            $('div.editable-area').each(function () {
                var l = $(this).data('layout');
                data.layouts[l] = get_layout_array($(this));
            });
            if (typeof OP_Feature_Area != 'undefined') {
                data.feature_area = OP_Feature_Area;
            }
            var dialogs = ['typography', 'settings'];
            for (var i = 0, dl = dialogs.length; i < dl; i++) {
                $.extend(data.op, serialize($('#le-' + dialogs[i] + '-dialog')).op || {});
            }
            $.post(OptimizePress.ajaxurl, data,
                function (resp) {
                    if (typeof resp.error != 'undefined') {
                        alert(resp.error);
                    } else {
                        if (typeof resp.preset_dropdown != 'undefined') {
                            $('#preset_save').html(resp.preset_dropdown);
                            $('#preset_type').val('overwrite').trigger('change');
                        }
                        alert(OP_AB.translate('saved'));
                        $.fancybox.close();
                    }
                },
                'json'
            );
        });
    }

    /**
     * Function for all #le_body_row elements rewrite elementID property written in data-style attributer as base64.
     * That property is necessary  for genereting unique id for <script> or <style> element of backend side.
     */
    function rewriteRowIdPropertyInsideDataStyle() {
        var allRows = $('.row[id^="le_body_row_"]');
        for (var i = 0; i < allRows.length; i++) {
            var dataStyle = $(allRows[i]).attr('data-style');
            if (dataStyle && dataStyle !== 'undefined') {
                var obj = JSON.parse(atob(dataStyle));
                obj.elementId = $(allRows[i]).attr('id');
                var base = btoa(JSON.stringify(obj));
                $(allRows[i]).attr('data-style', base);
            }
        }
    }

    /**
     * Remove all old internal CSS for element with defined section separator and then
     * recreates new one.
     */
    function recreate_section_separator_style() {
        var allRows = $('.row[id^="le_body_row_"]');
        var allSectionSeparatorStyles = $('style[id^="section-separator-style-"]');

        for (var i = 0; i < allSectionSeparatorStyles.length; i++) {
            allSectionSeparatorStyles[i].remove();
        }

        for (var i = 0; i < allRows.length; i++) {
            var dataStyleBase64 = allRows[i].getAttribute('data-style');

            if (dataStyleBase64) {
                var dataStyle = JSON.parse(atob(dataStyleBase64));
                var numberOfOrginalElement = allRows[i].id.split('_')[3];

                if (typeof dataStyle.sectionSeparatorType !== "undefined" || dataStyle.sectionSeparatorType !== 'none') {
                    var elementId = allRows[i].getAttribute('id');

                    var styleString = generate_section_separator_style(elementId, dataStyle);
                    var styleHtmlObject = $(styleString);
                    styleHtmlObject.insertBefore('#' + elementId);
                    dataStyle.sectionSeparatorStyle = styleString;

                    var base = btoa(JSON.stringify(dataStyle));
                    allRows[i].setAttribute('data-style', base);
                }
            }
        }
    }


    /**
     * Generate internal stylesheet for unique element with .row class.
     *
     * @param elementId
     * @param dataStyles
     * @returns {string}
     */
    function generate_section_separator_style(elementId, dataStyles) {

        var style = '';
        var type = dataStyles.sectionSeparatorType;

        var color = 'rgba(0,0,0,0)';
        var start_color = dataStyles.backgroundColorStart;
        var end_color = dataStyles.backgroundColorEnd;

        var elementzIndex = 10;
        var elementNumber = elementId.split('_');

        var nextElementNumber = parseInt(elementNumber[3]) + 1;
        var nextElementId = "le_body_row_" + nextElementNumber;

        var paddingBottom = 0;
        var paddingTop = dataStyles.paddingTop;
        var bottom = 0;

        if (typeof dataStyles.paddingBottom !== "undefined") {
            paddingBottom = dataStyles.paddingBottom;
            bottom += parseInt(paddingBottom);
        }

        if($('#' + elementId).hasClass('section') === true && typeof dataStyles.paddingBottom === "undefined"){
            bottom += parseInt(40);
        }


        if (typeof start_color !== "undefined" && typeof end_color === "undefined") {
            color = start_color;
        } else if (typeof start_color !== "undefined" && typeof end_color !== "undefined") {
            color = end_color;
        }

        switch (type) {
            case 'wide_triangle':
                bottom += 30;
                style += '<style id="section-separator-style-' + elementNumber[3] + '">' +
                    '#' + elementId + '::after{' +
                        'width:0px; ' +
                        'height:0px; ' +
                        'border-left: 500px solid transparent; ' +
                        'border-right: 500px solid transparent; ' +
                        'border-top: 30px solid ' + color + '; ' +
                        'display: block; ' +
                        'position: relative; ' +
                        'content: ""; ' +
                        'bottom: -' + bottom + 'px; ' +
                        'margin: 0 auto; ' +
                        'visibility: inherit; ' +
                    '}' +

                    '@media only screen and (max-width: 960px) {' +
                        '#' + elementId + '::after{' +
                            'border-left: 400px solid transparent; ' +
                            'border-right: 400px solid transparent; ' +
                        '}' +
                    '}' +

                    '@media only screen and (max-width: 767px) {' +
                        '#' + elementId + '::after{' +
                            'border-left: 250px solid transparent; ' +
                            'border-right: 250px solid transparent; ' +
                        '}' +
                    '}' +

                    '@media only screen and (max-width: 767px) {' +
                        '#' + elementId + '::after{' +
                            'border-left: 150px solid transparent; ' +
                            'border-right: 150px solid transparent; ' +
                        '}' +
                    '}' +

                    '#' + nextElementId + ' .fixed-width {' +
                        'margin-top: 30px;' +
                    '}';;
                break;

            case 'thin_triangle':
                bottom += 20;
                style += '<style id="section-separator-style-' + elementNumber[3] + '">' +
                    '#' + elementId + '::after{' +
                        'width:0px; ' +
                        'height:0px;' +
                        'border-left: 20px solid transparent; ' +
                        'border-right: 20px solid transparent; ' +
                        'border-top: 20px solid ' + color + '; ' +
                        'display: block; ' +
                        'position: relative; ' +
                        'content: ""; ' +
                        'bottom: -' + bottom + 'px; ' +
                        'left: 50%; ' +
                        'transform: translateX(-50%); ' +
                        'visibility: inherit; ' +
                    '}' +

                    '#' + nextElementId + ' .fixed-width {' +
                        'margin-top: 20px;' +
                    '}';
                break;

            default:
                break;
        }

        if (type == 'wide_triangle' || type == 'thin_triangle') {
            style += '#' + elementId + '{' +
                    'margin-bottom: 0px !important;' +
                '} ' +

                '#' + nextElementId + '{' +
                    'border-top: none !important;' +
                    'margin-top: 0px !important;' +
                '} ' +

                '</style>';
        }


        var rowIndex = generate_rows_decreasing_zindex();
        $('head').append(rowIndex);

        return style;
    }

    /**
     * Function is conclude that section separator exists by looking for any <script id="section-separator-style"> in html
     */
    function checkIsThereAnySectionSeparatorDefined(){
        return $('style').is('[id*="section-separator-style"]');
    }

    /**
     * Function is conclude that paralax exists if there is any element with class that start with bg-parallax
     */
    function checkIsThereAnyParallaxDefined(){
        return $('.row').is('[class*="bg-parallax"]');
    }

    /**
     * Because section separator is relative we need to generate for all .row decreasing zindex,
     * so section separator can be visible
     * @returns {string}
     */
    function generate_rows_decreasing_zindex() {
        if ($('#op-decreasing-row-zindex').length) {
            $('#op-decreasing-row-zindex').remove();
        }

        var allRows = $('.row[id^="le_body_row_"]');
        var decreasingRowIndexStyle = '<style id="op-decreasing-row-zindex">'

        for (var i = 0; i < allRows.length; i++) {
            decreasingRowIndexStyle += '#le_body_row_' + (i + 1) + '{' +
                'z-index: ' + (parseInt(50) - parseInt((i + 1))) + ' !important;' +
                '}'
        }

        decreasingRowIndexStyle += '</style>';

        return decreasingRowIndexStyle;
    }

    /**
     * 0 = #epicbox-overlay
     * 1 = #epicbox
     * 2 = .epicbox-content
     * 3 = .epicbox-scroll
     * 4 = .epicbox-actual-content
     */
    function resize_epicbox() {
        // epicbox[3].css("height",epicbox[3].innerHeight() + "px");
        if (epicbox && epicbox[1] && epicbox[2] && epicbox[3]) {
            epicbox[1].height(epicbox[3].outerHeight());
            epicbox[2].height(epicbox[1].height());
            epicbox[1].css("margin-top", "-" + epicbox[1].innerHeight() / 2 + "px");
        }
    }

    function init_child_elements() {

        $body.on('click', '.element-container a.add-new-element', function (e) {
            var $t = $(this);
            var w = parseInt($t.closest('.cols').width(), 10) + 40;
            var isPopup = false;
            var re_html;
            var re_text;
            var cur_child_val;
            var $parent;
            var $contentLiveeditorTitle = $('.op-content-liveeditor-title');

            e.preventDefault();

            // Popup content is in .html (as it sould be), not in .val, that's why ot's handled differently
            if ($t.parent().hasClass('op-popup') || $t.parent().parent().hasClass('op-popup')) {
                isPopup = true;
            }

            // Popup/OverlayOptimizer epicbox must be sized differently, regardless of current column width.
            if ($t.parent().parent().hasClass('op-popup')) {

                // 700 is the default popup width
                w = parseInt($t.parent().parent().data('width'), 10) || 700;

                // To account for padding/margin of the epicbox
                w = w + 40;

                // To make sure the epicbox never goes out of window
                w = w >= $(window).width() ? $(window).width() - 40 : w;

            }

            resize_epicbox();
            epicbox[3].html('');
            epicbox[2].css('background', 'url(images/wpspin_light.gif) no-repeat center center');
            // epicbox[0].add(epicbox[1]).fadeIn();
            epicbox[0].add(epicbox[1]);
            epicbox[1].width(w).css('margin-left', -(w / 2) + 'px');
            if (w < 400) {
                epicbox[1].addClass('epicbox-narrow');
            }
            cur_child = $t.closest('.element').find('textarea.op-le-child-shortcode');
            op_cur_html = epicbox[3];

            op_show_loading();

            cur_child_val = cur_child.val();
            if (isPopup && cur_child_val) {

                // We're escaping textareas in [custom_html] to ensure it doesn't accidentily close the textarea where the value is stored.
                re_html = /(\[custom_html\])([\s\S]*?)(\[\/custom_html\])/gi;
                re_text = /(<)(textarea)([\s\S]*?)(>)([\s\S]*?)(<)(\/textarea)(>)/gi;

                cur_child_val = cur_child_val.replace(re_html, function (all, tagopen, custom_html, tagclose) {
                    var custom_html_fix = custom_html.replace(re_text, function (a, b, c, d, e, f, g, h, i) {
                        return '&lt;' + c + d + '&gt;' + f + '&lt;' + h + '&gt;';
                    });

                    return ''
                        + tagopen
                        + custom_html_fix
                        + tagclose;
                });
            }

            $.post(OptimizePress.ajaxurl,
                {
                    action: OptimizePress.SN + '-live-editor-parse',
                    _wpnonce: $('#op_le_wpnonce').val(),
                    shortcode: cur_child_val,
                    depth: 1,
                    page_id: $('#page_id').val()
                },
                function (resp) {
                    if (typeof resp.output != 'undefined') {
                        if (typeof resp.font != 'undefined' && resp.font !== '' && resp.font[0] === 'google') {
                            WebFont.load({google: {families: [resp.font[1] + resp.font[2].properties]}});
                        }

                        //.epicbox-content
                        epicbox[2]
                            .css('background', 'none')
                            .addClass('op_no_outline')
                            .attr('tabindex', 0)
                            .focus();

                        //.epicbox-scroll
                        epicbox[3].html(resp.output + resp.js);

                        //.epicbox-actual-content
                        epicbox[4] = $('.epicbox-actual-content', epicbox[3]);

                        // Show the overlay and content
                        $html.addClass('epicbox-lock');
                        op_hide_loading(true);
                        epicbox[0].css({display: 'block'});
                        OptimizePress.epicboxBeforeShowAnimation(false, epicbox[1]);

                        resize_epicbox();
                        init_child_sortables();
                        init_child_previews();
                    }

                    // Set The Epicbox Title to be more user-friendly
                    $parent = $t.parent();
                    if (defaultEpicboxTitle === '') {
                        defaultEpicboxTitle = $('.op-content-liveeditor-title').text();
                    }
                    $('.op-content-liveeditor-title').text($parent.data('epicbox-title') || defaultEpicboxTitle);

                    $(document).trigger('op.afterLiveEditorParse');
                },
                'json'
            );
        });

        epicbox[3].on('click', '.op-element-links a.element-delete', function (e) {
            e.preventDefault();
            confirm('Are you sure you wish to remove this element?') && $(this).closest('.row').remove() && resize_epicbox();
        });

        epicbox[3].on('click', 'a.add-new-element', function (e) {
            e.preventDefault();
            OptimizePress.currentEditElement = false;
            $('#op_asset_browser_container').addClass('hide-elements-with-child-elements');
            child_element = true;
            var prev = $(this).prev();
            cur = [$(this), 'before'];
            refresh_item = null;
            OP_AB.open_dialog();

            /**
             * We want to refresh the visible items list at this step.
             * Otherwise, for example, if you enter feature box and then try to add an element to it,
             * you can end up with an empty list and no message to indicate that no elements matching the search.
             */
            $('#op_assets_filter').val('').trigger('keyup');
        });

        epicbox[3].on('click', '.op-element-links a.element-settings', function (e) {
            e.preventDefault();
            var el = $(this).closest('.row');
            cur = [el, 'replaceWith'];
            child_element = true;
            edit_element(el, false);
        });

        epicbox[3].on('dblclick', '.element-container', function () {
            $(this).find('.op-element-links > .element-settings').trigger('click');
            return false;
        });

        epicbox[1].on('click', '.close', function (e) {
            e.preventDefault();
            child_element = false;
            $('#op_asset_browser_container').removeClass('hide-elements-with-child-elements');
            // epicbox[0].add(epicbox[1]).fadeOut();
            epicbox[0].add(epicbox[1]);
            OptimizePress.epicboxBeforeCloseAnimation(epicbox[0], epicbox[1]);
        });

        $('#op_child_elements_form').submit(function (e) {

            e.preventDefault();

            // If this is a popup, handle it differently.
            var popupContent = '';
            var popupButton = '';
            var popupElement = false;
            var popupElements = '';
            var out = '';
            var $popupContentTextarea = '';

            if ($(this).find('.op_popup_element_present').length > 0) {
                popupElement = true;
            }

            out = '[op_liveeditor_elements] ';
            if (popupElement) {
                out = '[op_popup_elements]';
                popupElements = '[op_popup_elements]';
            }

            $(this).find('textarea.op-le-child-shortcode').each(function () {

                var thisPopupElement = $(this).val().indexOf('[op_popup_button]') === 0 ? true : false;
                var entireShortcode = '';
                // var thisPopupElement = $(this).val().indexOf('[op_popup_elements]') === 0 ? true : false;

                if (!thisPopupElement) {

                    if (!popupElement) {

                        out += '[op_liveeditor_element data-style="' + ($(this).parent().parent().attr('data-style') || '') + '"]';
                        out += $(this).val();
                        out += '[/op_liveeditor_element] ';

                    } else {

                        if ($(this).val().indexOf('[op_popup_elements]') < 0) {
                            popupContent += '[op_popup_content_element data-style="' + ($(this).parent().parent().attr('data-style') || '') + '"]';
                            popupContent += $(this).val();
                            popupContent += '[/op_popup_content_element]';
                        } else {
                            $popupContentTextarea = $(this);
                        }

                    }

                } else {

                    popupButton += $(this).val();

                }

            });

            if (!popupElement) {
                out += '[/op_liveeditor_elements] ';
            }

            if (popupElement) {

                popupElements += popupContent;
                popupElements += '[/op_popup_elements]';
                $popupContentTextarea.val(popupElements);

                out += '[op_popup_button]';
                popupButton = popupButton.split(/\[op_popup_button\](.*)\[\/op_popup_button\]/gi);
                popupButton = popupButton[1];

                out += popupButton;
                out += '[/op_popup_button]';
                out += '[op_popup_content]';
                out += popupContent;
                out += '[/op_popup_content]';
                out += '[/op_popup_elements]';

                cur_child.closest('.element-container').find('.op-le-child-shortcode').val(popupElements);
                entireShortcode = cur_child.closest('.element-container').find('.op-le-shortcode').val();
                entireShortcode = entireShortcode.replace(/\[op_popup_content[ d|\]][\s\S]*\[\/op_popup_content\]/gi, '[op_popup_content]' + popupContent + '[/op_popup_content]');
                cur_child.closest('.element-container').find('.op-le-shortcode').val(entireShortcode).text(entireShortcode);

            } else {

                cur_child.val(out);
                refresh_element(cur_child);

            }

            child_element = false;
            $('.close', epicbox[1]).trigger('click');

        });
    }

    // function close_wysiwygs(){
    //     OptimizePress.fancyboxBeforeCloseAnimation(this);
    //     if(editor_switch && typeof this.content != 'string'){
    //         this.content.find('.wp-editor-area').each(function(){
    //             var id = $(this).attr('id');
    //             if(id != 'opassetswysiwyg'){
    //                 $('#'+id+'-tmce').trigger('click');
    //                 //var content = OP_AB.wysiwyg_content(id);
    //                 tinyMCE.execCommand('mceFocus', false, id);
    //                 if (tinyMCE.majorVersion > 3) {
    //                     tinyMCE.execCommand('mceRemoveEditor', false, id);
    //                 } else {
    //                     tinyMCE.execCommand('mceRemoveControl', false, id);
    //                 }
    //                 //$(this).val(content);
    //             }
    //         });
    //     }
    // };

    function init_child_sortables(ref) {
        var ref = ref || false;
        if (ref) {
            epicbox[4].sortable('refresh').disableSelection();
        } else {
            epicbox[4].sortable($.extend({}, sort_default, {
                handle: '.op-element-links .element-move',
                items: 'div.row',
                update: null
            })).disableSelection();
        }
    }

    // If needed, initialize previews for elements that have live previews instead of static images.
    // This is called upon epicbox open
    function init_child_previews() {
        OptimizePress.initCountdownElements();
    }

    function get_full_shortcode(c) {
        var textarea = c.find('textarea.op-le-shortcode'),
            sc = textarea.text();
        if (!sc) {
            sc = textarea.val();
        }
        if (!sc) {
            sc = '';
        }
        var reg = new RegExp('#OP_CHILD_ELEMENTS#');
        c.find('textarea.op-le-child-shortcode').each(function () {
            sc = sc.replace(reg, $(this).val());
        });

        return sc;
    }

    function refresh_element(text) {
        text.text('');
        var c = text.closest('.element-container'),
            sc = get_full_shortcode(c),
            el = c.find('.element:first'),
            waiting = c.find('.op-waiting'),
            elDataStyle;
        op_cur_html = c;
        el.fadeOut('fast').html('');
        waiting.fadeIn('fast').end().find('.op-show-waiting').fadeIn('fast');
        $.post(OptimizePress.ajaxurl,
            {
                action: OptimizePress.SN + '-live-editor-parse',
                _wpnonce: $('#op_le_wpnonce').val(),
                shortcode: sc,
                depth: 0,
                page_id: $('#page_id').val()
            },
            function (resp) {
                if (typeof el != 'undefined' && typeof resp.output != 'undefined') {
                    if (typeof resp.font != 'undefined' && resp.font !== '' && resp.font[0] === 'google') {
                        WebFont.load({google: {families: [resp.font[1] + resp.font[2].properties]}});
                    }

                    if (op_cur_html.attr('data-style')) {
                        elDataStyle = JSON.parse(atob(op_cur_html.attr('data-style')));
                    } else {
                        elDataStyle = {};
                    }
                    elDataStyle.codeBefore = elDataStyle.codeBefore || '';
                    elDataStyle.codeAfter = elDataStyle.codeAfter || '';
                    el.html(elDataStyle.codeBefore + resp.output + resp.js + elDataStyle.codeAfter);

                    var area = c.closest('.editable-area');
                    refresh_sortables(area);
                    if (typeof resp.shortcode != 'undefined') {
                        text.val(resp.shortcode);
                    }
                    waiting.fadeOut('fast', function () {
                        el.fadeIn('fast');
                    });
                    custom_item_ids(area);
                    init_child_previews();
                }
                $(document).trigger('op.afterLiveEditorParse');
            },
            'json'
        );
    }

    function custom_item_ids(container) {
        container.each(function (idx) {
            var $t = $(this),
                id = $t.attr('id'),
                pref = 'le_' + (id == 'footer_area' ? 'footer' : (id == 'content_area' ? 'body' : id )) + '_row_',
                rcounter = 1;
            $(this).find('> .row').each(function () {
                var ccounter = 1;
                $(this).attr('id', pref + rcounter).find('> .cols').each(function () {
                    var ecounter = 1;
                    $(this).attr('id', pref + rcounter + '_col_' + ccounter).find('> .element-container:not(.sort-disabled)').each(function () {
                        $(this).attr('id', pref + rcounter + '_col_' + ccounter + '_el_' + ecounter);
                        ecounter++;
                    });
                    ccounter++;
                });
                rcounter++;
            });
        });
    }

    /**
     * NEW FUNCTION
     */
    function get_layout_array(el) {
        var data = [],
            nr = 0;
        if (el.length > 0) {
            data = [];
        }
        el.find('> .row').each(function () {
            var therow = $(this),
                row = {
                    row_class: therow.attr('class'),
                    row_style: therow.attr('style'),
                    row_data_style: therow.attr('data-style'),
                    children: []
                };
            therow.find('> > .cols:not(.sort-diabled)').each(function () {
                var thecol = $(this),
                    col = {
                        col_class: thecol.attr('class'),
                        type: 'column',
                        children: []
                    },
                    rchild = {
                        type: '',
                        object: {}
                    },
                    schild = {
                        type: '',
                        object: {}
                    };

                thecol.find('> div:not(.sort-disabled, .add-element-container)').each(function () {
                    var cchild = {
                        type: '',
                        object: {}
                    };
                    if ($(this).hasClass('element-container')) {
                        cchild.type = 'element';
                        cchild.object = get_full_shortcode($(this));
                        cchild.element_class = $(this).attr('class');
                        if (!$(this).hasClass('cf')) {
                            $(this).addClass('cf');
                        }
                        cchild.element_data_style = $(this).attr('data-style');
                        col.children.push(cchild);
                    } else if ($(this).hasClass('subcol')) {
                        var thesubcol = $(this),
                            subcol = {
                                subcol_class: $(this).attr('class'),
                                type: 'subcolumn',
                                children: []
                            };
                        thesubcol.find('> div:not(.sort-disabled, .add-element-container)').each(function () {
                            var thesubcolel = $(this),
                                gchild = {
                                    type: '',
                                    object: {}
                                };
                            gchild.type = 'element';
                            gchild.object = get_full_shortcode(thesubcolel);
                            gchild.element_class = $(this).attr('class');
                            gchild.element_data_style = $(this).attr('data-style');
                            subcol.children.push(gchild);
                        });
                        col.children.push(subcol);
                    }
                });
                rchild.type = 'column';
                rchild.object = col;
                row.children.push(rchild);
            });
            data.push(row);
        });

        return data;
    }

    function save_content(callback) {
        var data = {
            action: OptimizePress.SN + '-live-editor-save',
            status: $('#op-live-editor-status').val(),
            _wpnonce: $('#op_le_wpnonce').val(),
            page_id: $('#page_id').val(),
            op: {},
            layouts: {}
        };

        op_show_loading();

        $('div.editable-area').each(function () {
            var l = $(this).data('layout');
            data.layouts[l] = get_layout_array($(this));
        });
        if (typeof OP_Feature_Area != 'undefined') {
            data.feature_area = OP_Feature_Area;
        }
        var dialogs = ['typography', 'settings'];
        for (var i = 0, dl = dialogs.length; i < dl; i++) {
            $.extend(data.op, serialize($('#le-' + dialogs[i] + '-dialog')).op || {});
        }
        $.post(OptimizePress.ajaxurl, data,
            function (resp) {
                op_hide_loading();
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                    window.op_dont_hide_loading = false;
                    op_hide_loading();
                } else if ($.isFunction(callback)) {
                    if (!OptimizePress.disable_alert) {
                        alert(OP_AB.translate('saved'));
                    }
                    callback();
                } else {
                    if (!OptimizePress.disable_alert) {
                        alert(OP_AB.translate('saved'));
                    }
                    OptimizePress.disable_alert = false;
                    window.op_dont_hide_loading = false;
                    op_hide_loading();
                }
                window.op_dont_show_loading = false;
            },
            'json'
        );
    }

    function init_editable_area(container, prefix) {
        prefix = prefix || '';
        prefix = prefix == '' ? '' : prefix + '-';
        if (container.data('one_col') == 'N') {
            container.append('<div id="' + prefix + 'add-new-row" class="cf"><div class="' + prefix + 'add-new-row-link"><div class="add-new-row-content"><a href="#op-le-row-select" class="add-new-button"><span>' + translate('add_new_row') + '</span></a></div></div></div>');
            var el = $('#' + prefix + 'add-new-row');
            el.fancybox($.extend({}, fancy_defaults, {
                type: 'inline',
                href: '#op-le-row-select',
                beforeLoad: function () {
                    cur = [$('#' + prefix + 'add-new-row'), 'before'];
                }
            }));
            container.on('click', '.add-new-row', function (e) {
                e.preventDefault();
                cur = [$(this).closest('.row'), 'before'];
                $.fancybox.open($.extend({}, fancy_defaults, {
                    type: 'inline',
                    href: '#op-le-row-select'
                }));
            });
            // $body.on('mouseenter', '.cols', function(){
            //     $(this).find('.split-column').fadeIn(100);
            // });
            // $body.on('mouseleave', '.cols', function(){
            //     $(this).find('.split-column').fadeOut(100);
            // });
            $body.on('click', '.split-column', function (e) {
                e.preventDefault();
                var column_type = $(this).attr("href");
                column_type = column_type.substring(1);
                $('#op-le-split-column ul li').each(function (e) {
                    $(this).hide();
                });
                switch (column_type) {
                    case 'one-half':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        break;
                    case 'two-thirds':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        $('#op-le-split-column ul li a.one-third-first').parent().show();
                        $('#op-le-split-column ul li a.one-third-second').parent().show();
                        $('#op-le-split-column ul li a.one-thirds').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-first').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-second').parent().show();
                        break;
                    case 'two-fourths':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        break;
                    case 'three-fourths':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        $('#op-le-split-column ul li a.one-third-first').parent().show();
                        $('#op-le-split-column ul li a.one-third-second').parent().show();
                        $('#op-le-split-column ul li a.one-thirds').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-first').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-second').parent().show();
                        $('#op-le-split-column ul li a.one-fourths').parent().show();
                        break;
                    case 'three-fifths':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        $('#op-le-split-column ul li a.one-third-first').parent().show();
                        $('#op-le-split-column ul li a.one-third-second').parent().show();
                        $('#op-le-split-column ul li a.one-thirds').parent().show();
                        break;
                    case 'four-fifths':
                        $('#op-le-split-column ul li a.split-half').parent().show();
                        $('#op-le-split-column ul li a.one-third-first').parent().show();
                        $('#op-le-split-column ul li a.one-third-second').parent().show();
                        $('#op-le-split-column ul li a.one-thirds').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-first').parent().show();
                        $('#op-le-split-column ul li a.one-fourth-second').parent().show();
                        $('#op-le-split-column ul li a.one-fourths').parent().show();
                        break;
                }
                cur = [$(this).closest('.column'), 'append'];
                $.fancybox.open($.extend({}, fancy_defaults, {
                    type: 'inline',
                    href: '#op-le-split-column'
                }));
            });

            $body.on('click', '.banner', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.op-icn-le_layouts > a').trigger('click');
            });

            /**
             * Row Edit Click
             */
            $body.on('click', '.edit-row', function (e) {
                
                //when in Live Editor > Page Layout > Extra Large Footer option
                //is active we have 2 .editable-area and because of that
                //some of event listeners are triggered twice
                //current solution is to use e.stopImmediatePropagation() on Edit Row Option;
                e.stopImmediatePropagation();

                cur = [$(this).closest('.row'), 'before'];
                if (cur[0].hasClass('section')) {
                    $('input[name="op_full_width_row"]').prop('checked', true);
                } else {
                    $('input[name="op_full_width_row"]').prop('checked', false);
                }
                cur_style = cur[0].attr('style');
                cur_data_style = cur[0].attr('data-style');

                // clearing old data
                $('#op_section_row_options_bgcolor_start').val('').trigger('change');
                $('#op_section_row_options_bgcolor_end').val('').trigger('change');
                $('#op_row_top_padding').val('');
                $('#op_row_before').val('');
                $('#op_row_after').val('');
                $('#op_row_css_class').val('');
                $('#op_row_bottom_padding').val('');
                $('#op_row_border_width').val('');
                $('#op_row_border_top_width').val('');
                $('#op_row_border_bottom_width').val('');
                $('#op_section_row_options_borderColor').val('').trigger('change');
                $('#op_section_row_options_borderTopColor').val('').trigger('change');
                $('#op_section_row_options_borderBottomColor').val('').trigger('change');
                $('#op_row_options_backgroundImageColor').val('').trigger('change');
                $('#op_paralax_background_image').prop('checked', false);
                $('#op_scroll_fixed_mobile').prop('checked', false);
                $('#op_section_row_background_changing_color_start').val('').trigger('change');
                $('#op_section_row_background_changing_color_end').val('').trigger('change');
                $('#op_section_row_background_changing_color_speed').val('');

                // Reset extra fields
                $('.op_row_advanced_options_extras:checkbox').prop('checked', false);
                $('.op_row_advanced_options_extras:not(:checkbox)').val('');

                if (cur_data_style) {

                    /*
                     * Row addons
                     */
                    $.each($('[id^="op_row_addon_"]'), function (i, item) {
                        if ($(item).is(':checkbox')) {
                            $(item).prop('checked', false);
                        } else if ($(item).hasClass('op-uploader-value')) {
                            OP_AB.set_uploader_value($(item).prop('id'), '');
                        } else if ($(item).prop('type') == 'number') {
                            $(item).val($(item).val());
                        } else if ($(item).hasClass('slider-item')) {
                            $(item).find('input').val(0);
                            $(item).slider('value', 0);
                            $(item).prev().find('span')
                                .text('0' + $(item).prev().find('span').data('unit'))
                                .attr('id', 'output_' + $(item).attr('id'));
                        } else {
                            $(item).val('');
                        }
                    });

                    OP_AB.set_uploader_value('op_row_background', '');
                    $(".op_row_bg_options option").each(function () {
                        $(this).attr("selected", false);
                    });

                    $(".op-section-separator-type option").each(function () {
                        $(this).attr("selected", false);
                    });

                    $(".op_scroll_fixed_position option").each(function () {
                        $(this).attr("selected", false);
                    });

                    var obj = JSON.parse(atob(cur_data_style));

                    for (var key in obj) {
                        switch (key) {
                            case 'cssClass':
                                $('#op_row_css_class').val(obj[key]);
                                break;
                            case 'codeBefore':
                                $('#op_row_before').val(obj[key]);
                                break;
                            case 'codeAfter':
                                $('#op_row_after').val(obj[key]);
                                break;
                            case 'paddingTop':
                                $('#op_row_top_padding').val(obj[key]);
                                break;
                            case 'paddingBottom':
                                $('#op_row_bottom_padding').val(obj[key]);
                                break;
                            case 'backgroundImage':
                                var imgUrl = obj[key].slice(4, -1);
                                OP_AB.set_uploader_value('op_row_background', imgUrl);
                                break;
                            case 'backgroundPosition':
                                $('.op_row_bg_options option[value="' + obj[key] + '"]').attr('selected', 'selected');
                                break;
                            case 'borderWidth':
                                // We are splitting this option into two fields (border top & border bottom),
                                // so this ensures we don't lose any previously defined styles
                                // $('#op_row_border_width').val(obj[key]);
                                $('#op_row_border_top_width').val(obj[key]);
                                $('#op_row_border_bottom_width').val(obj[key]);
                                break;
                            case 'borderColor':
                                // $('#op_section_row_options_borderColor').val(obj[key]).trigger('change');
                                $('#op_section_row_options_borderTopColor').val(obj[key]).trigger('change');
                                $('#op_section_row_options_borderBottomColor').val(obj[key]).trigger('change');
                                break;
                            case 'borderTopWidth':
                                $('#op_row_border_top_width').val(obj[key]);
                                break;
                            case 'borderTopColor':
                                $('#op_section_row_options_borderTopColor').val(obj[key]).trigger('change');
                                break;
                            case 'borderBottomWidth':
                                $('#op_row_border_bottom_width').val(obj[key]);
                                break;
                            case 'borderBottomColor':
                                $('#op_section_row_options_borderBottomColor').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundColorStart':
                                $('#op_section_row_options_bgcolor_start').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundColorEnd':
                                $('#op_section_row_options_bgcolor_end').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundImageColor':
                                $('#op_row_options_backgroundImageColor').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundImageColorOpacity':
                                $('#input_op_section_row_options_backgroundImageOpacity').val(obj[key]).trigger('change');//.slider('value', obj[key]);
                                $('#output_op_section_row_options_backgroundImageOpacity').text(obj[key] + '%');
                                $('#op_section_row_options_backgroundImageOpacity').slider('value', obj[key]);
                                break;
                            case 'rowScrollFixedPosition':
                                $('#op_scroll_fixed_position option[value="' + obj[key] + '"]').attr('selected', 'selected');
                                break;
                            case 'rowScrollFixedMobile':
                                $field = $('#op_scroll_fixed_mobile');
                                if (obj[key] === true) {
                                    $field.prop('checked', true);
                                } else {
                                    $field.val(obj[key]);
                                }
                                break;
                            case 'sectionSeparatorType':
                                $('#op_row_section_separator_option option[value="' + obj[key] + '"]').attr('selected', 'selected');
                                break;
                            case 'backgroundChangingColorStart':
                                $('#op_section_row_background_changing_color_start').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundChangingColorEnd':
                                $('#op_section_row_background_changing_color_end').val(obj[key]).trigger('change');
                                break;
                            case 'backgroundChangingColorSpeed':
                                $('#op_section_row_background_changing_color_speed').val(obj[key]);
                                break;
                            case 'extras':
                                for (var name in obj[key]) {
                                    var $field = $('.op_row_advanced_options_extras[data-name="' + name + '"]');
                                    if ($field.length > 0) {
                                            $field.val(obj[key][name]);
                                    }
                                }
                                break;
                            case 'backgroundParalax':
                                $field = $('#op_paralax_background_image');
                                if (obj[key] === true) {
                                    $field.prop('checked', true);
                                } else {
                                    $field.val(obj[key]);
                                }
                                break;
                            case 'addon':
                                $.each(obj[key], function (i, item) {
                                    var $element = $('#op_row_addon_' + i);
                                    if ($element.is(':checkbox')) {
                                        $element.prop('checked', item);
                                    } else if ($element.hasClass('op-uploader-value')) {
                                        OP_AB.set_uploader_value($element.prop('id'), item);
                                    } else if ($element.hasClass('slider-item')) {
                                        $element.slider('value', item);
                                        $element.find('input').val(item);
                                        $element.prev().find('span').text(item + $element.prev().find('span').data('unit'));
                                    } else {
                                        $element.val(item).trigger('change');
                                    }
                                });
                                break;
                        }
                    }
                } else {

                    /*
                     * Row addons
                     */
                    $.each($('[id^="op_row_addon_"]'), function (i, item) {
                        if ($(item).is(':checkbox')) {
                            $(item).prop('checked', false);
                        } else if ($(item).hasClass('op-uploader-value')) {
                            OP_AB.set_uploader_value($(item).prop('id'), '');
                        } else if ($(item).prop('type') == 'number') {
                            $(item).val($(item).val());
                        } else if ($(item).hasClass('slider-item')) {
                            $(item).find('input').val(0);
                            $(item).slider('value', 0);
                            $(item).prev().find('span')
                                .text('0' + $(item).prev().find('span').data('unit'))
                                .attr('id', 'output_' + $(item).attr('id'));
                        } else {
                            $(item).val('');
                        }
                    });

                    OP_AB.set_uploader_value('op_row_background', '');
                    $(".op_row_bg_options option").each(function () {
                        $(this).attr("selected", false);
                    });

                    $(".op-section-separator-type option").each(function () {
                        $(this).attr("selected", false);
                    });
                }

                $.fancybox.open($.extend({}, fancy_defaults, {
                    type: 'inline',
                    href: '#op-le-row-options'
                }));
            });

            /**
             * Show or hide row paste buttons on focus
             */
            $(window).on('focus', function () {
                togglePasteButtons();
            });

            /**
             * Paste Row Click
             */
            container.on('click', '.paste-row', function (e) {
                e.preventDefault();
                var rowToPaste = localStorage.getItem('op_row') || '';
                $(this).closest('.row').before(rowToPaste);
                custom_item_ids(container);
                refresh_sortables(container);

                if (checkIsThereAnySectionSeparatorDefined()){
                    recreate_section_separator_style();
                }

                if(checkIsThereAnyParallaxDefined()){
                    $.stellar("refresh");
                }

                rewriteRowIdPropertyInsideDataStyle();

                $('.paste-row').show();
                //localStorage.removeItem('op_row');
            });

            /**
             * Copy row Click
             */
            container.on('click', '.copy-row', function (e) {
                e.preventDefault();
                var el = $(this).closest('.row');
                var cloned = el.clone().attr('id', '');
                var i = 0;
                var j = 0;
                el.find('textarea.op-le-shortcode').each(function () {
                    var current = $(cloned.find('textarea.op-le-shortcode'));
                    var replace = $(this).val();
                    $(current[i]).val(replace);
                    $(current[i]).text(replace);
                    i++;
                });
                el.find('textarea.op-le-child-shortcode').each(function () {
                    var current = $(cloned.find('textarea.op-le-child-shortcode'));
                    var replace = $(this).val();
                    $(current[j]).val(replace);
                    $(current[j]).text(replace);
                    j++;
                });
                cloned.find('.element-container, .column').each(function () {
                    $(this).attr('id', '');
                });

                // let's save the row in local storage!
                try {
                    localStorage.setItem('op_row', cloned[0].outerHTML);
                    $('.paste-row').show();
                    alert('Row succesfully copied');
                } catch (ex) {
                    alert('Session Storage not supported or you tried to copy row that is too big');
                }
            });

            /**
             * Clone Row Click
             */
            container.on('click', '.clone-row', function (e) {
                var el = $(this).closest('.row');
                var cloned = el.clone().attr('id', '');
                var i = 0;
                var j = 0;
                el.find('textarea.op-le-shortcode').each(function () {
                    var current = $(cloned.find('textarea.op-le-shortcode'));
                    var replace = $(this).val();
                    $(current[i]).val(replace);
                    i++;
                });
                el.find('textarea.op-le-child-shortcode').each(function () {
                    var current = $(cloned.find('textarea.op-le-child-shortcode'));
                    var replace = $(this).val();
                    $(current[j]).val(replace);
                    j++;
                });
                cloned.find('.element-container, .column').each(function () {
                    $(this).attr('id', '');
                });
                el.after(cloned);

                custom_item_ids(container);
                refresh_sortables(container);

                if (checkIsThereAnySectionSeparatorDefined()){
                    recreate_section_separator_style();
                }

                if(checkIsThereAnyParallaxDefined()){
                    $.stellar("refresh");
                }

                rewriteRowIdPropertyInsideDataStyle();
            });

            /**
             * Delete Row Click
             */
            container.on('click', 'a.delete-row', function (e) {
                e.preventDefault();
                if (confirm('Are you sure you wish to remove this row and all its elements?')) {
                    var cur = $(this).closest('.row');
                    var elementId = cur.attr('id').split('_');
                    cur.prev('.op-row-code-before').remove();
                    cur.next('.op-row-code-after').remove();
                    $('#section-separator-style-' + elementId[3]).remove();
                    cur.remove();

                    custom_item_ids(container);
                    refresh_sortables(container);

                    if (checkIsThereAnySectionSeparatorDefined()){
                        recreate_section_separator_style();
                    }

                    if(checkIsThereAnyParallaxDefined()){
                        $.stellar("refresh");
                    }

                    rewriteRowIdPropertyInsideDataStyle();
                }
            });
        }
        custom_item_ids(container);
        refresh_sortables(container);

        container.on('click', 'a.move-row,a.element-move', function (e) {
            e.preventDefault();
        });
        container.on('click', '.cols > .add-element-container > a.add-new-element', function (e) {
            OptimizePress.currentEditElement = false;
            e.preventDefault();
            child_element = false;
            cur = [$(this).parent().prev(), 'before'];
            refresh_item = null;
            OP_AB.open_dialog();

            /**
             * We want to refresh the visible items list at this step.
             * Otherwise, for example, if you enter feature box and then try to add an element to it,
             * you can end up with an empty list and no message to indicate that no elements matching the search.
             */
            $('#op_assets_filter').trigger('keydown');
        });
        container.on('click', '.op-element-links a.element-delete', function (e) {
            e.preventDefault();
            confirm('Are you sure you wish to remove this element?') && $(this).closest('.element-container').remove();

            if(checkIsThereAnyParallaxDefined()){
                $.stellar("refresh");
            }
        });
        container.on('click', '.op-element-links a.element-settings', function (e) {
            e.preventDefault();
            var el = $(this).closest('.element-container');
            var child = el.find('> .element a.add-new-element');
            if (child.length) {
                child.trigger('click');
            } else {
                cur = [el, 'replaceWith'];
                refresh_item = el.find('textarea.op-le-shortcode');
                edit_element(refresh_item.closest('.element-container'));
            }
        });

        // Opens edit element dialog on double click
        container.on('dblclick', '.element-container', function () {
            if (!$(this).hasClass('row')) {
                $(this).find('.op-element-links > .element-settings').trigger('click');
                return false;
            }
        });

        /**
         * Advanced Element Options Click
         */
        $body.off('click', '.op-element-links a.element-advanced');
        $body.on('click', '.op-element-links a.element-advanced', function (e) {
            e.preventDefault();
            cur = [$(this).closest('.element-container')];
            if (cur[0].hasClass('hide-mobile')) {
                $('input[name="op_hide_phones"]').prop('checked', true);
            } else {
                $('input[name="op_hide_phones"]').prop('checked', false);
            }
            if (cur[0].hasClass('hide-tablet')) {
                $('input[name="op_hide_tablets"]').prop('checked', true);
            } else {
                $('input[name="op_hide_tablets"]').prop('checked', false);
            }
            cur_data_style = cur[0].attr('data-style');

            // clearing old data
            $('#op_advanced_fadein').val('');
            $('#op_advanced_code_before').val('');
            $('#op_advanced_code_after').val('');
            $('#op_advanced_class').val('');
            // Reset extra fields
            $('.op_element_advanced_options_extras:checkbox').prop('checked', false);
            $('.op_element_advanced_options_extras:not(:checkbox)').val('');

            /**
             * Due to oldish bug it is possible that cur_data_style is set to string undefined
             */
            if (cur_data_style && cur_data_style !== 'undefined') {
                var obj = JSON.parse(atob(cur_data_style));
                for (var key in obj) {
                    switch (key) {
                        case 'codeBefore':
                            $('#op_advanced_code_before').val(obj[key]);
                            break;
                        case 'codeAfter':
                            $('#op_advanced_code_after').val(obj[key]);
                            break;
                        case 'fadeIn':
                            $('#op_advanced_fadein').val(obj[key]);
                            break;
                        case 'advancedClass':
                            $('#op_advanced_class').val(obj[key]);
                            break;
                        case 'extras':
                            for (var name in obj[key]) {
                                var $field = $('.op_element_advanced_options_extras[data-name="' + name + '"]');
                                if ($field.length > 0) {
                                    if ($field.is(':checkbox') && obj[key][name] == '1') {
                                        $field.prop('checked', true);
                                    } else {
                                        $field.val(obj[key][name]);
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            $.fancybox.open($.extend({}, fancy_defaults, {
                type: 'inline',
                href: $(this).attr('href')
            }));
        });

        /**
         *  Element Option Update Button Click
         */
        $body.off('click', '#op-le-advanced-update');
        $body.on('click', '#op-le-advanced-update', function (e) {
            var dataStyles = {};
            var html = '';
            var before = '';
            var after = '';
            var markup = '';
            var beforeAndAfter = '';
            var childHideClasses = '';
            var childHideMobile = cur[0].hasClass('hide-mobile');
            var childHideTablet = cur[0].hasClass('hide-tablet');

            e.preventDefault();

            if (cur[0].hasClass('row')) {
                cur[0].removeClass().addClass('row element-container cf');
            } else {
                cur[0].removeClass().addClass('element-container cf');
            }

            if ($('#op_advanced_class').val()) {
                cur[0].addClass($('#op_advanced_class').val());
                dataStyles.advancedClass = $('#op_advanced_class').val();
            }

            if ($('input[name="op_hide_phones"]:checked').length > 0) {
                cur[0].addClass('hide-mobile');
                dataStyles.hideMobile = 1;
            } else {
                cur[0].removeClass('hide-mobile');
            }
            if ($('input[name="op_hide_tablets"]:checked').length > 0) {
                cur[0].addClass('hide-tablet');
                dataStyles.hideTablet = 1;
            } else {
                cur[0].removeClass('hide-tablet');
            }
            if ($('#op_advanced_fadein').val()) {
                dataStyles.fadeIn = $('#op_advanced_fadein').val();
            }

            if ($('#op_advanced_code_before').val()) {
                before = $('#op_advanced_code_before').val();
            }
            if ($('#op_advanced_code_after').val()) {
                after = $('#op_advanced_code_after').val();
            }

            // Saving extra fields (added through external plugins)
            if ($('.op_element_advanced_options_extras').length > 0) {
                $.each($('.op_element_advanced_options_extras'), function (index, field) {
                    var $field = $(field);
                    dataStyles.extras = dataStyles.extras || {};
                    if ($field.is(':checkbox')) {
                        if ($field.is(':checked')) {
                            dataStyles.extras[$field.attr('data-name')] = 1;
                        }
                    } else {
                        dataStyles.extras[$field.attr('data-name')] = $field.val();
                    }
                });
            }

            // Validate before & after code
            if (before !== '' && after !== '') {
                beforeAndAfter = before + '---OP-BEFORE-AFTER---' + after;
                beforeAndAfter = HTMLtoXML(beforeAndAfter);
                beforeAndAfter = beforeAndAfter.split(/---OP-BEFORE-AFTER---/);
                before = beforeAndAfter[0];
                after = beforeAndAfter[1];
            } else {
                before = before ? HTMLtoXML(before) : before;
                after = after ? HTMLtoXML(after) : after;
            }
            $('#op_advanced_code_before').val(before);
            $('#op_advanced_code_after').val(after);

            cur[0].find(".element, .op-hidden, .op-element-links, .op-waiting").each(function (i, item) {

                var g = $(item);
                var child_data_styles = '';
                var op_le_class;
                var elementContent;
                var value;

                if (g.hasClass('element')) {

                    // We create a temporary element, append the element content to it and grab the html
                    elementContent = $('<div>').append($(g[0].innerHTML).clone()).html();
                    elementContent = before + elementContent + after;

                    // Before, we just did this, but it doesn't work if g[0].innerHTML consists
                    // of more than one element (like in Calendar element)
                    // elementContent = before + $(g[0].innerHTML)[0].outerHTML + after;

                    if (g.find('> .op-popup').length > 0) {
                        markup += '<div class="element">' + elementContent + '';
                    } else {
                        markup += '<div class="element">' + elementContent + '</div>';
                    }

                } else {
                    if (g.hasClass('op-hidden') && !g.hasClass('op-waiting')) {

                        op_le_class = (!g.find(' > textarea').hasClass('op-le-child-shortcode')) ? 'op-le-shortcode' : 'op-le-child-shortcode';

                        value = g.find('> textarea').val();
                        markup += '<div class="op-hidden">';
                        markup += '<textarea name="shortcode[]" class="' + op_le_class + '">';
                        markup += value;
                        markup += '</textarea>';
                        markup += '</div>';

                        if (g.prev().hasClass('op-popup')) {
                            markup += '</div>';
                        }
                    } else {
                        markup += g[0].outerHTML;
                    }
                }
            });

            cur[0].html(markup);

            if ($('#op_advanced_code_before').val()) {
                dataStyles.codeBefore = $('#op_advanced_code_before').val();
            }
            if ($('#op_advanced_code_after').val()) {
                dataStyles.codeAfter = $('#op_advanced_code_after').val();
            }
            var base = btoa(JSON.stringify(dataStyles));
            cur[0].attr('data-style', base);
            $.fancybox.close();
        });

        container.on('click', '.op-element-links a.element-parent-settings', function (e) {
            e.preventDefault();
            var el = $(this).closest('.element-container');
            cur = [el, 'replaceWith'];
            refresh_item = el.find('textarea.op-le-shortcode');
            edit_element(refresh_item.closest('.element-container'));
        });

        // clone element click
        $body.off('click', '.op-element-links a.element-clone');
        $body.on('click', '.op-element-links a.element-clone', function (e) {
            e.preventDefault();
            var el = $(this).closest('.element-container');
            var value = el.find('textarea.op-le-shortcode').val();
            var childValue = el.find('textarea.op-le-child-shortcode').val();
            var cloned = el.clone(true, true).attr('id', '');
            cloned.find('textarea.op-le-shortcode').val(value);
            cloned.find('textarea.op-le-child-shortcode').val(childValue);
            el.after(cloned);
        });
    }

    OptimizePress.currentEditElement = false;
    function edit_element(el, get_full) {
        get_full = get_full === false ? false : true;
        var sc = get_full ? get_full_shortcode(el) : el.find('textarea.op-le-child-shortcode').val();

        // Older child elements (created by default in OP < 2.1.5) are not wrapped into element container div,
        // and therefore are not generated with proper shortcode. This is the fix for this issue.
        if (!get_full && el.find('.element > p').length > 0) {
            sc = '[text_block]' + sc + '[/text_block]';
        }

        OP_AB.open_dialog(0);
        $.post(OptimizePress.ajaxurl,
            {
                action: OptimizePress.SN + '-live-editor-params',
                _wpnonce: $('#op_le_wpnonce').val(),
                shortcode: sc
            },
            function (resp) {
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                } else {
                    if ($('.fancybox-wrap').length > 0) {
                        OP_AB.edit_element(resp);
                        OptimizePress.currentEditElement = resp.attrs.style;
                    }
                }
            },
            'json'
        );
    }

    function serialize(el) {
        if (!el.length) {
            return false;
        }
        var data = {},
            lookup = data;
        el.find(':input[type!="checkbox"][type!="radio"][type!="submit"], input:checked').each(function () {
            var name = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(','),
                cap = name.length - 1,
                i = 0;
            if (name[0]) {
                for (; i < cap; i++)
                    lookup = lookup[name[i]] = lookup[name[i]] || (name[i + 1] == '' ? [] : {});
            }
            if (typeof lookup.length != 'undefined')
                lookup.push($(this).val());
            else
                lookup[name[cap]] = $(this).val();
            lookup = data;
        });
        return data;
    }

    /**
     * Column split
     */
    function split_column(selected) {
        if (cur.length === 0) {
            alert('Could not find the current position, please try clicking the Split Column link again.');
            return;
        }

        var h = selected.attr('href').split('#')[1],
            row_class = '',
            cols = [];
        isTextOnButton = [];
        if (selected.length > 0) {
            switch (h) {
                case 'split-half':
                    cols = ['split-half', 'split-half'];
                    isTextOnButton = [true, true];
                    break;
                case 'one-third-second':
                    cols = ['split-two-thirds', 'split-one-third'];
                    isTextOnButton = [true, false];
                    break;
                case 'one-third-first':
                    cols = ['split-one-third', 'split-two-thirds'];
                    isTextOnButton = [false, true];
                    break;
                case 'one-thirds':
                    cols = ['split-one-third', 'split-one-third', 'split-one-third'];
                    isTextOnButton = [false, false, false];
                    break;
                case 'one-fourth-second':
                    cols = ['split-three-fourths', 'split-one-fourth'];
                    isTextOnButton = [true, false];
                    break;
                case 'one-fourth-first':
                    cols = ['split-one-fourth', 'split-three-fourths'];
                    isTextOnButton = [false, true];
                    break;
                case 'one-fourths':
                    cols = ['split-one-fourth', 'split-one-fourth', 'split-one-fourth', 'split-one-fourth'];
                    isTextOnButton = [false, false, false, false];
                    break;
            }
            var html = '';
            for (var i = 0, cl = cols.length; i < cl; i++) {
                var btnClass = '';
                if (isTextOnButton[i]) {
                    btnText = '<span>Add Element</span>';
                } else {
                    btnText = '';
                }
                html += '<div class="' + cols[i] + ' column cols subcol">';
                html += '<div class="element-container sort-disabled"></div>';
                html += '<div class="add-element-container"><a href="#add_element" class="add-new-element">' + btnText + '</a></div>';
                html += '</div>';
            }
            btnText = '<span>Add element</span>';
            html += '</div></div><div class="clearcol"></div>';
            html += '<div class="element-container sort-disabled"></div>';
            html += '<div class="add-element-container"><a href="#add_element" class="add-new-element">' + btnText + '</a></div>';
            html = $(html);

            cur[0][cur[1]](html);
            // cur[0].find('.add-element-container > a.add-new-element').click(function(e){
            cur[0].on('click', '.add-element-container > a.add-new-element', function (e) {
                e.preventDefault();
                OptimizePress.currentEditElement = false;
                child_element = false;
                cur = [$(this).parent().prev(), 'before'];
                refresh_item = null;
                OP_AB.open_dialog();
            });
            var area = cur[0].closest('.editable-area');
            refresh_sortables(area);
            custom_item_ids(area);
            $.fancybox.close();
        } else {
            alert('Please select split column type');
        }
    }

    function add_new_row(selected) {
        if (cur.length === 0) {
            alert('Could not find the current position, please try clicking the Add new row link again.');
            return;
        }
        var h = selected.attr('href').split('#')[1],
            row_class = '',
            cols = [];
        isTextOnButton = [];
        if (selected.length > 0) {
            switch (h) {
                case 'one-col':
                    row_class = 'one-column';
                    cols = ['one-column'];
                    isTextOnButton = [true];
                    break;
                case 'two-col':
                    row_class = 'two-columns';
                    cols = ['one-half', 'one-half'];
                    isTextOnButton = [true, true];
                    break;
                case 'three-col':
                    row_class = 'three-columns';
                    cols = ['one-third', 'one-third', 'one-third'];
                    isTextOnButton = [true, true, true];
                    break;
                case 'four-col':
                    row_class = 'four-columns';
                    cols = ['one-fourth', 'one-fourth', 'one-fourth', 'one-fourth'];
                    isTextOnButton = [false, false, false, false];
                    break;
                case 'five-col':
                    row_class = 'five-columns';
                    cols = ['one-fifth', 'one-fifth', 'one-fifth', 'one-fifth', 'one-fifth'];
                    isTextOnButton = [false, false, false, false, false];
                    break;
                default:
                    switch (h) {
                        case '1':
                            row_class = 'three-columns';
                            cols = ['two-thirds', 'one-third'];
                            isTextOnButton = [true, true];
                            break;
                        case '2':
                            row_class = 'three-columns';
                            cols = ['one-third', 'two-thirds'];
                            isTextOnButton = [true, true];
                            break;
                        case '3':
                            row_class = 'four-columns';
                            cols = ['two-fourths', 'one-fourth', 'one-fourth'];
                            isTextOnButton = [true, false, false];
                            break;
                        case '4':
                            row_class = 'four-columns';
                            cols = ['one-fourth', 'one-fourth', 'two-fourths'];
                            isTextOnButton = [false, false, true];
                            break;
                        case '5':
                            row_class = 'four-columns';
                            cols = ['three-fourths', 'one-fourth'];
                            isTextOnButton = [true, false];
                            break;
                        case '6':
                            row_class = 'four-columns';
                            cols = ['one-fourth', 'three-fourths'];
                            isTextOnButton = [false, true];
                            break;
                        case '7':
                            row_class = 'five-columns';
                            cols = ['two-fifths', 'one-fifth', 'one-fifth', 'one-fifth'];
                            isTextOnButton = [true, false, false, false];
                            break;
                        case '8':
                            row_class = 'five-columns';
                            cols = ['one-fifth', 'one-fifth', 'one-fifth', 'two-fifths'];
                            isTextOnButton = [false, false, false, true];
                            break;
                        case '9':
                            row_class = 'five-columns';
                            cols = ['three-fifths', 'one-fifth', 'one-fifth'];
                            isTextOnButton = [true, false, false];
                            break;
                        case '10':
                            row_class = 'five-columns';
                            cols = ['one-fifth', 'one-fifth', 'three-fifths'];
                            isTextOnButton = [false, false, true];
                            break;
                        case '11':
                            row_class = 'five-columns';
                            cols = ['four-fifths', 'one-fifth'];
                            isTextOnButton = [true, false];
                            break;
                        case '12':
                            row_class = 'five-columns';
                            cols = ['one-fifth', 'four-fifths'];
                            isTextOnButton = [false, true];
                            break;
                        case '13':
                            row_class = 'four-columns';
                            cols = ['one-fourth', 'two-fourths', 'one-fourth'];
                            isTextOnButton = [false, true, false];
                            break;
                        case '14':
                            row_class = 'five-columns';
                            cols = ['two-fifths', 'three-fifths'];
                            isTextOnButton = [true, true];
                            break;
                        case '15':
                            row_class = 'five-columns';
                            cols = ['three-fifths', 'two-fifths'];
                            isTextOnButton = [true, true];
                            break;
                        case '16':
                            row_class = 'five-columns';
                            cols = ['one-fifth', 'two-fifths', 'two-fifths'];
                            isTextOnButton = [false, true, true];
                            break;
                        case '17':
                            row_class = 'five-columns';
                            cols = ['two-fifths', 'two-fifths', 'one-fifth'];
                            isTextOnButton = [true, true, false];
                            break;
                        case '18':
                            row_class = 'five-columns';
                            cols = ['one-fifth', 'three-fifths', 'one-fifth'];
                            isTextOnButton = [false, true, false];
                            break;
                    }
                    break;
            }
            var html = '';
            if (h.indexOf('feature_') === 0) { // feature areas
                $.fancybox.showLoading();
                var data1 = {
                    action: OptimizePress.SN + '-live-editor-get-predefined-template',
                    template: h,
                    page_id: $('#page_id').val()
                };
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: OptimizePress.ajaxurl,
                    data: data1
                }).done(function (data) {
                    if (data.output != 'error') {
                        html += data.output;
                        html = $(html);
                        html.find('.cols > .add-element-container > a.add-new-element').click(function (e) {
                            e.preventDefault();
                            OptimizePress.currentEditElement = false;
                            child_element = false;
                            cur = [$(this).parent().prev(), 'before'];
                            refresh_item = null;
                            OP_AB.open_dialog();
                        });
                        cur[0][cur[1]](html);
                        var area = cur[0].closest('.editable-area');
                        refresh_sortables(area);
                        custom_item_ids(area);
                        $.fancybox.hideLoading();
                        $.fancybox.close();
                    }
                });
            } else {
                // normal row insert
                html += '<div class="row ' + row_class + ' cf">';
                html += '<div class="fixed-width">';
                html += '<div class="op-row-links">';
                html += '<div class="op-row-links-content">';
                html += '<a id="copy_row" href="#copy-row" class="copy-row"></a>';
                html += '<a id="row_options" href="#options" class="edit-row"></a>';
                html += '<a id="row_options" href="#clone-row" class="clone-row"></a>';
                html += '<a href="#add-new-row" class="add-new-row"><span>' + translate('add_new_row') + '</span></a>';
                html += '<a href="#move" class="move-row"></a>';
                html += '<a href="#paste-row" class="paste-row"></a>';
                html += '<a href="#delete-row" class="delete-row"></a>';
                html += '</div>'
                html += '</div>';
                var splitColumn;
                for (var i = 0, cl = cols.length; i < cl; i++) {
                    var btnClass = '';
                    if (isTextOnButton[i]) btnText = '<span>Add Element</span>'; else btnText = '';
                    var narrowClass = '';
                    switch (cols[i]) {
                        case 'one-third':
                        case 'one-fourth':
                        case 'one-fifth':
                        case 'two-fifths':
                            narrowClass = ' narrow';
                            break;
                        default:
                            narrowClass = '';
                            break;
                    }
                    switch (cols[i]) {
                        case 'one-half':
                        case 'two-thirds':
                        case 'two-fourths':
                        case 'three-fourths':
                        case 'three-fifths':
                        case 'four-fifths':
                            splitColumn = '<a href="#' + cols[i] + '" class="split-column"></a>';
                            break;
                        default:
                            splitColumn = '';
                            break;
                    }
                    html += '<div class="' + cols[i] + ' column cols' + narrowClass + '">';
                    html += '<div class="element-container sort-disabled"></div>';
                    html += '<div class="add-element-container">';
                    html += splitColumn;
                    html += '<a href="#add_element" class="add-new-element">' + btnText + '</a>';
                    html += '   </div>';
                    html += '</div>';
                }

                html += '</div></div>';
                html = $(html);
                html.find('.cols > .add-element-container > a.add-new-element').click(function (e) {
                    e.preventDefault();
                    OptimizePress.currentEditElement = false;
                    child_element = false;
                    cur = [$(this).parent().prev(), 'before'];
                    refresh_item = null;
                    OP_AB.open_dialog();
                });
                cur[0][cur[1]](html);
                var area = cur[0].closest('.editable-area');
                refresh_sortables(area);
                custom_item_ids(area);
                if (!localStorage.getItem('op_row')) {
                    $('.paste-row').hide();
                }
                $.fancybox.close();
            }
        } else {
            alert('Please select a column type');
        }
    };

    function refresh_sortables(area) {
        area.sortable($.extend({}, sort_default, {
            handle: '.op-row-links .move-row',
            items: '> div.row',
            update: function () {
                custom_item_ids(area);
                if (checkIsThereAnySectionSeparatorDefined()){
                    recreate_section_separator_style();
                }
                rewriteRowIdPropertyInsideDataStyle();
            }
        })).disableSelection();
        area.find('div.row:not(.element-container)').sortable($.extend({}, sort_default, {
            handle: '.op-element-links .element-move',
            items: 'div.element-container:not(.row)',
            connectWith: '.row',
            update: function () {
                custom_item_ids(area);
                if (checkIsThereAnySectionSeparatorDefined()){
                    recreate_section_separator_style();
                }
                rewriteRowIdPropertyInsideDataStyle();
            }
        }));
    };

    function init_uploader() {
        var nonce = $('#op_le_wpnonce').val(),
            processing = $('#li-content-layout-processing'),
            queue = $('#le-content-layout-file-list'),
            row,
            login = $('#le-content-layout-login'),
            resp_func = function (resp) {
                if (typeof resp.show_login != 'undefined') {
                    if (login.length == 0) {
                        processing.after('<div id="le-content-layout-login" />');
                    }
                    $('#le-content-layout-login').append(resp.login_html).find('form').submit(function (e) {
                        row.slideDown('fast').fadeIn('fast');
                        e.preventDefault();
                        $.post($(this).attr('action'), $(this).serialize(), resp_func, 'json');
                        $('#le-content-layout-login').remove();
                    });
                }
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                } else if (typeof resp.content_layout != 'undefined') {
                    $('#le-layouts-dialog div.tab-predefined').html(resp.content_layout);
                    $('#le-layouts-dialog ul.op-bsw-grey-panel-tabs a[href$="#predefined"]').trigger('click');
                }
                row.fadeOut('fast').slideUp('fast');
            },
            uploader = new qq.FileUploader({
                element: document.getElementById('le-content-layout-upload'),
                listElement: queue.get(0),
                action: OptimizePress.ajaxurl,
                params: {
                    action: OptimizePress.SN + '-live-editor-upload-layout',
                    _wpnonce: nonce
                },
                allowedExtensions: ['zip'],
                onComplete: function (id, fileName, resp) {
                    queue.find('li:eq(' + id + ')').fadeOut('fast').slideUp('fast');
                    row = $('<li />').html('Processing ' + fileName + ' <img src="images/wpspin_light.gif" alt="" />');
                    processing.append(row);
                    $.post(OptimizePress.ajaxurl, {
                        action: OptimizePress.SN + '-live-editor-process-layout',
                        _wpnonce: nonce,
                        attachment_id: resp.fileid
                    }, resp_func, 'json');
                }
            });
    };
    window.op_live_editor = true;
    window.op_le_column_width = function () {
        return $(cur[0]).closest('.cols').width();
    };
    window.op_refresh_content_layouts = function () {
        $.post(OptimizePress.ajaxurl, {
                action: OptimizePress.SN + '-live-editor-load-layouts',
                _wpnonce: $('#op_le_wpnonce').val()
            },
            function (resp) {
                if (typeof resp.error != 'undefined') {
                    alert(resp.error);
                } else if (typeof resp.content_layout != 'undefined') {
                    $('#le-layouts-dialog div.tab-predefined').html(resp.content_layout);
                    $('#le-layouts-dialog ul.op-bsw-grey-panel-tabs a[href$="#predefined"]').trigger('click');
                }
            },
            'json');
    };
    window.op_le_insert_content = function (str) {
        element = str.substr(1, str.indexOf(' ') - 1);
        if (cur.length == 0) {
            alert('Could not find the current position, please try clicking the Add new row link again.');
            return;
        }
        var sc = str;
        if (refresh_item !== null && child_element === false) {
            refresh_item.val(sc);
            refresh_element(refresh_item);
            if (element === 'content_toggle' || element === 'order_box' || element === 'delayed_content'
                || element === 'feature_box' || element === 'feature_box_creator' || element === 'terms_conditions'
                || element === 'op_popup') {
                var textarea_val = refresh_item.val();
                // textarea_val = textarea_val.replace(/\[op_liveeditor_elements\].*\[\/op_liveeditor_elements\]/gi, '#OP_CHILD_ELEMENTS#');
                textarea_val = textarea_val.replace(/\[op_liveeditor_elements\][\s\S]*\[\/op_liveeditor_elements\]/gi, '#OP_CHILD_ELEMENTS#');
                refresh_item.val(textarea_val);
            }
            return $.fancybox.close();
        }

        var html = '';
        var classname = '';
        var hideChildClassname = '';

        if (child_element) {
            hideChildClassname = cur[0].hasClass('hide-tablet') ? ' hide-tablet' : '';
            hideChildClassname += cur[0].hasClass('hide-mobile') ? ' hide-mobile' : '';
            html = $('<div class="row element-container cf ' + hideChildClassname + '" data-style="' + (cur[0].attr('data-style') || '') + '" />');
            classname = 'op-le-child-shortcode';
        } else {
            html = $('<div class="element-container cf" />');
            classname = 'op-le-shortcode';
        }

        var area = cur[0].closest('.editable-area');
        cur[0][cur[1]](html);

        if (element === 'content_toggle' || element === 'order_box' || element === 'delayed_content'
            || element === 'feature_box' || element === 'feature_box_creator' || element === 'terms_conditions' || element === 'op_popup') {
            html.append('<div class="op-element-links"><a class="element-parent-settings" href="#parent-settings">' + translate('edit_parent_element') + '</a><a href="#settings" class="element-settings">' + translate('edit_element') + '</a><a class="element-clone" href="#clone-element">' + translate('clone_element') + '</a><a href="#op-le-advanced" class="element-advanced">' + translate('edit_element') + '</a><a href="#move" class="element-move">' + translate('move') + '</a><a href="#delete" class="element-delete">' + translate('delete') + '</a></div><div class="op-waiting"><img src="images/wpspin_light.gif" alt="" class="op-bsw-waiting op-show-waiting" /></div><div class="element cf"></div><div class="op-hidden"><textarea name="shortcode[]" class="' + classname + '"></textarea></div>');
        } else {
            html.append('<div class="op-element-links"><a href="#settings" class="element-settings">' + translate('edit_element') + '</a><a class="element-clone" href="#clone-element">' + translate('clone_element') + '</a><a href="#op-le-advanced" class="element-advanced">' + translate('edit_element') + '</a><a href="#move" class="element-move">' + translate('move') + '</a><a href="#delete" class="element-delete">' + translate('delete') + '</a></div><div class="op-waiting"><img src="images/wpspin_light.gif" alt="" class="op-bsw-waiting op-show-waiting" /></div><div class="element cf"></div><div class="op-hidden"><textarea name="shortcode[]" class="' + classname + '"></textarea></div>');
        }


        //[op_popup_element]

        var sc_textarea = html.find('textarea').val(sc);
        $.fancybox.close();
        op_cur_html = html;
        html.find('.op-waiting').fadeIn('fast').end().find('.op-waiting .op-show-waiting').fadeIn('fast');
        $.post(OptimizePress.ajaxurl,
            {
                action: OptimizePress.SN + '-live-editor-parse',
                _wpnonce: $('#op_le_wpnonce').val(),
                shortcode: sc,
                depth: (child_element ? 1 : 0),
                page_id: $('#page_id').val()
            },
            function (resp) {
                if (resp.check !== null) {
                    var valid = true;
                    for (var i in resp.check) {
                        if ($(i).length > 0) {
                            if (resp.check[i] != '') {
                                html.fadeOut('fast', function () {
                                    $(this).remove();
                                });
                                alert(resp.check[i]);
                                return;
                            }
                        }
                    };
                    if (valid === true) {
                        if (typeof resp.font != 'undefined' && resp.font !== '' && resp.font[0] === 'google') {
                            WebFont.load({google: {families: [resp.font[1] + resp.font[2].properties]}});
                        }

                        //Yes, second check is to test if data-style is not string undefined.
                        elDataStyle = html.attr('data-style') && html.attr('data-style') !== 'undefined' ? JSON.parse(atob(html.attr('data-style'))) : {};
                        elDataStyle.codeBefore = elDataStyle.codeBefore || '';
                        elDataStyle.codeAfter = elDataStyle.codeAfter || '';
                        elDataStyle.advancedClass = elDataStyle.advancedClass || '';

                        var el = html.addClass(elDataStyle.advancedClass)
                            .find('.element').html(elDataStyle.codeBefore + resp.output + resp.js + elDataStyle.codeAfter);

                        child_element ? init_child_sortables(true) : refresh_sortables(area);
                    }
                } else {
                    if (typeof resp.font != 'undefined' && resp.font !== '' && resp.font[0] === 'google') {
                        WebFont.load({google: {families: [resp.font[1] + resp.font[2].properties]}});
                    }

                    //Yes, second check is to test if data-style is not string undefined.
                    elDataStyle = html.attr('data-style') && html.attr('data-style') !== 'undefined' ? JSON.parse(atob(html.attr('data-style'))) : {};
                    elDataStyle.codeBefore = elDataStyle.codeBefore || '';
                    elDataStyle.codeAfter = elDataStyle.codeAfter || '';
                    elDataStyle.advancedClass = elDataStyle.advancedClass || '';

                    var el = html.addClass(elDataStyle.advancedClass)
                        .find('.element').html(elDataStyle.codeBefore + resp.output + resp.js + elDataStyle.codeAfter);

                    child_element ? init_child_sortables(true) : refresh_sortables(area);

                }

                if (typeof el != 'undefined') {
                    if (typeof resp.shortcode != 'undefined') {
                        sc_textarea.val(resp.shortcode);
                    }
                    html.find('.op-waiting').fadeOut('fast', function () {
                        el.fadeIn('fast', function () {
                            resize_epicbox();
                        });
                    });
                    custom_item_ids(cur[0].closest('.editable-area'));
                }
                $(document).trigger('op.afterLiveEditorParse');
            },
            'json'
        );
    };

    if (window.op_dont_show_loading) {
        window.op_hide_loading();
    } else {
        window.op_dont_show_loading = false;
    }

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
    }

    function translate(str) {
        return OP_AB.translate(str);
    };

    function open_fullscreen_live_editor() {
        op_show_loading();
        window.top.location.href = window.location;
    }

    /**
     * Autohiding and showing of toolbars
     */
    $(document).ready(function () {
        var $ = opjq;

        var $sidebar = $('#op-le-settings-toolbar');
        var $sidebarToggleBtn = $('#op-le-toggle-sidebar-btn');
        var showPanelsHtml;

        $html.addClass('op-le-settings-toolbar--shown');

        var toggleSidebar = function () {
            $html.toggleClass('op-le-settings-toolbar--hidden op-le-settings-toolbar--shown');
            //$showLiveEditorPanels.addClass('showLiveEditorPanels--hidden');
            // setTimeout(function () {
            //  $('html').removeClass('op-toolbars--hidden');
            // }, 200);
            return false;
        }

        var hideEditorPanels = function () {
            $html.addClass('op-toolbars--hidden');
            setTimeout(function () {
                $showLiveEditorPanels.removeClass('showLiveEditorPanels--hidden');
            }, 200);
            return false;
        }

        $sidebarToggleBtn.parent().on('click', toggleSidebar);

        // This is a fix for Firefox behaviour, in which form data is remembered upon refresh.
        $('.op_child_shortcode_form').each(function () {
            this.reset();
        });

        // Sometimes we want to open the liveeditor in full window. This is a handy shortcut.
        if (window.top.location.href !== window.location.href) {
            $('#op-liveeditor-logo').on('click', function (e) {
                if (e.shiftKey) {
                    OptimizePress.disable_alert = true;
                    window.op_dont_hide_loading = true;
                    save_content(open_fullscreen_live_editor);
                    // window.top.location.href = window.location;
                }
                e.preventDefault();
            });
        }

        $(window).on('keydown', function (e) {
            // Save on CTRL+S or CMD+S
            if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
                OptimizePress.disable_alert = true;
                save_content();
                return false;
            }

            // Open the public link of the current Live Editor page on CTRL+O or CMD+O
            if ((e.which == '79') && (e.ctrlKey || e.metaKey)) {
                window.open($('#op-view-public-link').attr('href'), '_blank');
                return false;
            }
        });

        /**
         * Enable comments for the current page
         * Button for it appears if Facebook Comments element is added,
         * but comments for current page are disabled.
         */
        $('body').on('click', '.op-enable-post-comments', function () {
            op_show_loading();
            $.post(OptimizePress.ajaxurl, {
                action: OptimizePress.SN + '-enable-post-comments',
                _wpnonce: $('#op_le_wpnonce').val(),
                page_id: $('#page_id').val()
            }, function (resp) {
                op_hide_loading();
                if (resp !== 0) {
                    $('.op-enable-post-comments-container').remove();
                    alert("Comments for this page are now enabled.");
                } else {
                    alert("Sorry, it seems that we can't change the page status. Please refresh the page and try again, and if it still not working, please contact our customer support.");
                }
            });
            return false;
        });

    });

    $(window).on('load', function () {
        op_hide_loading();
    });

}(opjq));

;
"use strict";opjq.base64=(function($){var _PADCHAR="=",_ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_VERSION="1.0";function _getbyte64(s,i){var idx=_ALPHA.indexOf(s.charAt(i));if(idx===-1){throw"Cannot decode base64"}return idx}function _decode(s){var pads=0,i,b10,imax=s.length,x=[];s=String(s);if(imax===0){return s}if(imax%4!==0){throw"Cannot decode base64"}if(s.charAt(imax-1)===_PADCHAR){pads=1;if(s.charAt(imax-2)===_PADCHAR){pads=2}imax-=4}for(i=0;i<imax;i+=4){b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6)|_getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")}function _getbyte(s,i){var x=s.charCodeAt(i);if(x>255){throw"INVALID_CHARACTER_ERR: DOM Exception 5"}return x}function _encode(s){if(arguments.length!==1){throw"SyntaxError: exactly one argument required"}s=String(s);var i,b10,x=[],imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8)|_getbyte(s,i+2);x.push(_ALPHA.charAt(b10>>18));x.push(_ALPHA.charAt((b10>>12)&63));x.push(_ALPHA.charAt((b10>>6)&63));x.push(_ALPHA.charAt(b10&63))}switch(s.length-imax){case 1:b10=_getbyte(s,i)<<16;x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_PADCHAR+_PADCHAR);break;case 2:b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8);x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_ALPHA.charAt((b10>>6)&63)+_PADCHAR);break}return x.join("")}return{decode:_decode,encode:_encode,VERSION:_VERSION}}(opjq));;
;(function($){
    var container,
        slides = [],
        slide_content = [],
        slide_widths = [],
        slides_ul,
        waiting,
        op_stored_configs = {core:{},addon:{},theme:{}},
        op_stored_steps = {core:{},addon:{},theme:{}},
        help_vids = {defaults:[],core:{},addon:{},theme:{}},
        wysiwyg_removed = false,
        disable_slide = false,
        disable_insert = false,
        wysiwygs_checked = false,
        use_wysiwyg = false,
        editor_switch = false,
        wp_post = false,
        current_config = {},
        current_picker,
        farbtastic,
        picker,
        folders = {},
        show_ons = {},
        stored_selectors = {},
        stored_elements = {},
        current_loading = '',
        current_asset = [],
        trigger_events = {},
        selector_classes = {},
        panda_box, panda_content, cur_selector,
        cat_options = [],
        subcat_options = [],
        isFancyboxClosing = false;

    $(document).ready(function(){
        var asset_list;
        var asset_list_parent;
        var no_asset_elem;
        var i = 0;
        var onKeyUp;
        var keyupTimeout;
        var shown;
        var $body = $('body');

        // if(typeof switchEditors != 'undefined'){
        //     editor_switch = true;
        // }
        // use_wysiwyg = (typeof tinyMCE !== 'undefined' && typeof tinyMCEPreInit.mceInit.opassetswysiwyg !== 'undefined');
        // use_wysiwyg = (typeof tinyMCE != 'undefined');
        use_wysiwyg = (typeof tinyMCE != 'undefined');

        wp_post = (typeof pagenow != 'undefined');
        container = $('#op_asset_browser_container');
        slides_ul = $('#op_asset_browser_slider');
        waiting = $('#op_assets_waiting');

        for (i = 0; i < 5; i++ ) {
            slides.push($('#op_asset_browser_slide'+i));
            slide_content.push(slides[i].find('.op_asset_content'));
        }

        asset_list = slide_content[1].find('div.asset-list');
        asset_list_parent = asset_list.parent();
        no_asset_elem = $('#op_asset_browser_no_assets');

        onKeyUp = function(e, $that) {
            var $that = $that;
            var searchString = $.trim($that.val());
            var items = asset_list.find('li');
            var $spanTitles;

            if(!searchString || searchString === ''){
                asset_list.show();
                //items.filter(':not(:visible)').fadeIn('fast');
                items.filter(':not(:visible)').show();
                no_asset_elem.hide();
            } else {
                searchString = searchString.toLowerCase();
                shown = false;
                $spanTitles = items.find('span.title');
                $spanTitles.each(function () {
                    var $this = $(this);
                    var itemText = $this.text().toLowerCase();
                    var searchArray;
                    var searchArrayLength;
                    var show = (itemText.indexOf(searchString) > -1);
                    var add_class = 'hidden';
                    var remove_class = 'visible';
                    var func = 'hide';
                    var i;

                    if (show) {
                        shown = true;
                        add_class = 'visible';
                        remove_class = 'hidden';
                        func = 'fadeIn';
                        func = 'show';
                    }

                    $this.closest('li')
                        .filter((show ? ':not(:visible)' : ':visible'))
                        .addClass(add_class)
                        .removeClass(remove_class)
                        .stop()
                        [func](); //func is show or hide
                });

                // If initial search string doesn't return result try extended search
                // (allow any word to match, not only exact phrase)
                if (!shown) {
                    $spanTitles.each(function () {
                        var $this = $(this);
                        var itemText = $this.text().toLowerCase();
                        var searchArray;
                        var searchArrayLength;
                        var show = true;
                        var i;

                        searchArray = searchString.split(' ');
                        searchArrayLength = searchArray.length;
                        for (i = 0; i < searchArrayLength; i += 1) {
                            if (itemText.indexOf(searchArray[i]) < 0) {
                                show = false;
                                break;
                            }
                        }

                        if (show) {
                            shown = true;
                            $this.closest('li')
                                .addClass('visible')
                                .removeClass('hidden')
                                .stop()
                                .show();
                        }
                    });
                }

                if (shown) {
                    asset_list.show();
                    no_asset_elem.hide();
                    if (asset_list.find('a:visible').length <= 0) {
                        asset_list.hide();
                        no_asset_elem.show();
                    }
                } else {
                    asset_list.hide();
                    no_asset_elem.show();
                }

            }

        }

        $('#op_assets_filter')
            .keydown(function () {
                clearTimeout(keyupTimeout);
            })
            .keyup(function (e) {
                var $that = $(this);
                keyupTimeout = setTimeout(function () {
                    onKeyUp(e, $that);
                }, 60);
            })
            .change(function () {
                $(this).trigger('keyup');
            });

        $('.op-insert-asset').click(function (e) {
            OptimizePress.previousWpActiveEditor = wpActiveEditor;
            e.preventDefault();

            if (tinymce && tinymce.opActiveEditor) {
                tinymce.opActiveEditor.editElement = false;
            }

            open_asset_dialog();
        });

        init_color_pickers();
        //init_font_fields();

        $('.asset-list a',slides[1]).click(function (e) {
            $('#op_asset_browser_slide1').find('.op-last-selected-asset-list-item').removeClass('op-last-selected-asset-list-item');
            $(this).addClass('op-last-selected-asset-list-item');
            container.removeClass('edit-mode');
            e.preventDefault();
            var $t = $(this),
                h = $(this).get_hash();
            current_loading = h;
            h = h.split('/');
            if(h.length == 2){
                container.find('.op_asset_browser_slide .settings-container').css('display','none');
                if(typeof op_assets[h[0]] != 'undefined' && typeof op_assets[h[0]][h[1]] != 'undefined'){
                    load_config(h);
                    set_titles($t);
                    show_slide(2);
                }
            }
        });

        // Keyboard navigation through add element / edit element
        // TODO: refactor this mess
        $(window).on('keydown', function(event) {

            var $activeElement = $(document.activeElement);
            var $activeParent = $activeElement.parent();
            var currentActiveSlide = get_active_slide();
            var $slide2 = $('#op_asset_browser_slide2');
            var keyEvent;
            var pageKeyIterator = 5;
            var pageKeyCounter = 0;

            switch (event.which) {
                // s key
                case 83:
                // "/" key
                case 111:
                case 55:
                    if ($activeElement.is('#op_assets_filter') || get_active_slide() !== 1) {
                        return;
                    }
                    event.preventDefault();
                    $('#op_assets_filter').focus();
                    break;

                // tab
                case 900:
                    if (currentActiveSlide === 3 || currentActiveSlide === 4
                        // checks for elements that don't have style chooser
                        || (currentActiveSlide === 2 && $slide2.find('.op-settings-core-custom_html').is(':visible'))
                        || (currentActiveSlide === 2 && $slide2.find('.op-settings-core-img_alert').is(':visible'))
                        || (currentActiveSlide === 2 && $slide2.find('.op-settings-core-javascript').is(':visible'))
                        || (currentActiveSlide === 2 && $slide2.find('.op-settings-core-vertical_spacing').is(':visible'))
                    ) {

                        if ($activeElement.hasClass('op-bsw-green-button')
                            && !$activeElement.next().is('a')
                            && !event.shiftKey
                        ) {
                            event.preventDefault();
                        }

                        if (event.shiftKey && $activeElement.is('.op_asset_content.op_no_outline')) {
                            event.preventDefault();
                        }

                    } else {

                        if (currentActiveSlide === 1 || currentActiveSlide === 2) {
                            keyEvent = $.Event("keydown");
                            if (event.shiftKey) {
                                keyEvent.which = 38; // up arrow
                            } else {
                                keyEvent.which = 40; // down arrow
                            }
                            $(window).trigger(keyEvent);
                        }
                        event.preventDefault();

                    }
                    break;

                // esc key
                case 27:
                    if (currentActiveSlide > 1) {
                        $('.fancybox-opened').eq(-1).find('.op_asset_browser_slide_active .op_asset_content')
                            .focus();
                    }
                    break;

                // page up
                case 33:
                    if (currentActiveSlide === 1 || currentActiveSlide === 2) {
                        keyEvent = $.Event("keydown");
                        keyEvent.which = 38; // up arrow
                        for (pageKeyCounter = 0; pageKeyCounter < pageKeyIterator; pageKeyCounter += 1) {
                            $(window).trigger(keyEvent);
                        }
                        event.preventDefault();
                    }
                    break;

                // page down
                case 34:
                    if (currentActiveSlide === 1 || currentActiveSlide === 2) {
                        keyEvent = $.Event("keydown");
                        keyEvent.which = 40; // down arrow
                        for (pageKeyCounter = 0; pageKeyCounter < pageKeyIterator; pageKeyCounter += 1) {
                            $(window).trigger(keyEvent);
                        }
                        event.preventDefault();
                    }
                    break;

                // down arrow
                case 40:

                    // Select element slide
                    if (currentActiveSlide === 1) {
                        event.preventDefault();

                        if ($activeParent.is('.op-asset-list-item') &&
                            $activeParent.nextAll('.op-asset-list-item:visible').length > 0
                        ) {

                            // Mark next <a> item as selected
                            $activeElement.removeClass('op-last-selected-asset-list-item selected')
                                .parent().nextAll('.op-asset-list-item:visible').eq(0).find('a')
                                    .addClass('op-last-selected-asset-list-item').focus();

                        } else if ($activeParent.is('.op-asset-list-item')
                                    && $activeElement.closest('.asset-list').next().is('.asset-list')
                                    && $activeElement.closest('.asset-list').next().find('.op-asset-list-item:visible').length > 0
                        ) {

                            // If there are more items in list from OP PlusPack, select the first one.
                            $activeElement.removeClass('op-last-selected-asset-list-item selected')
                                .closest('.asset-list').next().find('.op-asset-list-item:visible').eq(0)
                                    .find('a').addClass('op-last-selected-asset-list-item').focus();

                        } else if ($activeElement.is('#op_assets_filter')) {

                            // If search is active, select the first available item
                            $('.asset-list .op-asset-list-item:visible').eq(0).find('a').focus();

                        } else {

                            // If all fails, go back to last active element.
                            focusLastSelectedItem();

                        }
                    }

                    // Select style slide
                    if (currentActiveSlide === 2) {

                        if (!$activeElement.is('textarea') && !$activeElement.is('input')) {
                            event.preventDefault();
                        }

                        if ($activeParent.is('.op-asset-dropdown-list-item:visible')
                            && $activeParent.next('.op-asset-dropdown-list-item:visible').length > 0
                        ) {

                            $activeElement.removeClass('op-last-selected-asset-dropdown-list-item selected')
                                .parent().next('.op-asset-dropdown-list-item').find('a')
                                    .addClass('op-last-selected-asset-dropdown-list-item').focus();

                        } else if ($activeElement.is('#op_assets_filter')) {

                            $('.op-asset-dropdown-list-item:visible').eq(0).find('a').focus();

                        } else {

                            focusLastSelectedItem();

                        }
                    }
                    break;

                // up arrow
                case 38:

                    // Select element
                    if (currentActiveSlide === 1) {
                        event.preventDefault();

                        if ($activeElement.is('#op_assets_filter')) {

                            return;

                        } else if ($activeParent.is('.op-asset-list-item')
                                    && $activeParent.prevAll('.op-asset-list-item:visible').length > 0
                        ) {

                            $activeElement.removeClass('op-last-selected-asset-list-item')
                                .parent().prevAll('.op-asset-list-item:visible').eq(0).find('a')
                                    .addClass('op-last-selected-asset-list-item').focus();

                        } else if ($activeParent.is('.op-asset-list-item')
                                    && $activeElement.closest('.asset-list').prev().is('.asset-list')
                                    && $activeElement.closest('.asset-list').prev().find('.op-asset-list-item:visible').length > 0
                        ) {

                            $activeElement.removeClass('op-last-selected-asset-list-item selected')
                                .closest('.asset-list').prev().find('.op-asset-list-item:visible').last().find('a')
                                    .addClass('op-last-selected-asset-list-item').focus();

                        } else if ($activeParent.is('.op-asset-list-item')) {

                            $('#op_assets_filter').focus();

                        } else {

                            focusLastSelectedItem();

                        }
                    }

                    if (currentActiveSlide === 2) {

                        if (!$activeElement.is('textarea') && !$activeElement.is('input')) {
                            event.preventDefault();
                        }

                        if ($activeParent.is('.op-asset-dropdown-list-item:visible')
                            && $activeParent.prev('.op-asset-dropdown-list-item:visible').length > 0
                        ) {

                            $activeElement.removeClass('op-last-selected-asset-dropdown-list-item')
                                .parent().prev('.op-asset-dropdown-list-item').find('a')
                                    .addClass('op-last-selected-asset-dropdown-list-item').focus();

                        } else if ($activeElement.is('#op_assets_filter')) {

                            $('.op-asset-dropdown-list-item:visible').eq(0).find('a').focus();

                        } else {

                            focusLastSelectedItem();

                        }
                    }
                    break;

                // right arrow
                case 39:
                    if ($activeParent.is('.op-asset-list-item') || $activeParent.is('.op-asset-dropdown-list-item')) {
                        $activeElement.trigger('click');
                    } else if ((currentActiveSlide === 2) && !$activeElement.is('.insert-media, a, input, textarea, select, .op-bsw-green-button')) {
                        $slide2.find('.op-asset-dropdown-list-item .selected').trigger('click');
                    }
                    break;

                // left arrow
                case 37:
                    if (currentActiveSlide > 1) {
                        if ($activeParent.hasClass('op-asset-dropdown-list-item') || !$activeElement.is('.insert-media, a, input, textarea, select, .op-bsw-green-button')) {
                            show_slide((currentActiveSlide - 1), true);
                        }
                    }
                    break;
            }
        });

        container.on('click', 'a.op-slide-link', function(e){
            e.preventDefault();
            show_slide($(this).get_hash());

            //Hack to fix bug with initial rendering of membership order button settings.
            if ($(e.target).parent().parent().hasClass('op-settings-core-membership_order_button')) {
                $('#op_assets_core_membership_order_button_gateway').trigger('change');
            }
        });

        panda_box = container.find('.sneezing-panda').hide();
        panda_content = panda_box.find('.content');
        slides[3].add(slides[4]).on('click','.op-asset-dropdown .selected-item',function(e){
            e.preventDefault();
            cur_selector = $(this);
            var dropdown = cur_selector.closest('.op-asset-dropdown');
            for(var i in selector_classes){
                panda_content.removeClass(i);
                if(dropdown.hasClass(i)){
                    panda_content.addClass(i);
                }
            }
            panda_content.html(cur_selector.next().html());
            // panda_box.show().animate({bottom:0},300);
            open_pandabox();
        });

        panda_box.on('click', '.hide-the-panda', function (e) {
            e.preventDefault();
            close_pandabox();
        });

        panda_content.on('click','li a',function(e){
            var $el = $(this);
            var $elStyle = $el.find('.op-font').length > 0 ? $el.find('.op-font') : $el.find('img');

            e.preventDefault();

            if (cur_selector.parent().attr('id') != 'op_assets_core_button_button_preview_container'
                && cur_selector.parent().attr('id') != 'op_assets_core_optin_box_tabs_submit_button_button_preview_container'
                && cur_selector.parent().attr('id') != 'op_assets_core_optin_modal_tabs_submit_button_button_preview_container'
                && cur_selector.parent().attr('id') != 'op_assets_core_membership_order_button_button_preview_container'
                && cur_selector.parent().attr('id') != 'op_assets_core_op_popup_button_preview_container') {
                cur_selector.html($el.html()).parent().find('li img[alt="'+$el.find('img').attr('alt')+'"]').parent().trigger('click');
            }

            $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({
                type: 'update_button_preview',
                id: cur_selector.parent().attr('id'),
                value: $elStyle.attr('alt'),
                font_type: $elStyle.attr('data-type'),
                font_family: $elStyle.attr('data-family'),
                group: current_asset[0],
                tag: current_asset[1]
            });

            close_pandabox();
        });

        $(document).mousedown( function(e) {
            picker.hide().css({'top':'auto','left':'auto'});
            if($(e.target).closest('.sneezing-panda').length == 0){
                close_pandabox();
            }
        }).trigger('mousedown');

        slides[2].on('click','.op-disable-selected a',function(e){
            e.preventDefault();
            $(this).closest('.op-asset-dropdown-list').find('a.selected').removeClass('selected')
                .end().end().addClass('selected');
            show_slide(3);

            /**
             * At this moment, current style is changed/selected and we don't need to figure it out,
             * but only if this is not triggered (via edit element)
             */
            if (e.originalEvent) {
                OptimizePress.currentEditElement = false;
            }
        });

        $body.on('click', '.wp-editor-wrap', function () {
            wpActiveEditor = $(this).find('textarea').attr('id');
        });

         $body.on('mousedown', '.op-insert-buttons', function () {
            wpActiveEditor = OptimizePress.previousWpActiveEditor;
            OptimizePress.previousWpActiveEditor = undefined;
        });

        container
            .on('click', '.op-multirow-tabs li a', function (e) {
                var $t = $(this);
                var $ul = $t.closest('ul');
                var container = $ul.parent();
                var idx = $ul.find('li').index($t.parent());

                $ul.find('li').removeClass('selected').filter(':eq(' + idx + ')').addClass('selected');
                container.find('> .op-multirow').hide().filter(':eq(' + idx + ')').show();

                //Find all feature titles and show them. This event hides them for some reason.
                $('.field-feature_title').parent().show();

                e.preventDefault();
            })
            .on('click', 'a[href$="#reset-font"]', function (e) {
                var $typography = $(this).prev();
                var $font = $typography.find('.font-view');

                $typography.find(':input').val('').trigger('change');
                $font.find('.selected-item').html($font.find('li:first a').html());

                e.preventDefault();
            });

        for (i = 1; i < 5; i++) {
            help_vids.defaults.push($('#op_asset_browser_slide'+i+' .help-vid-link').html());
        }

        init_help_videos();

    }); // end document.ready()


    function open_pandabox() {
        panda_box.show();
        setTimeout(function () {
            panda_box.css({ transform: 'translate3d(0,-475px,0)' });
        }, 1);
    }


    function close_pandabox() {
        if (panda_box.is(':visible')) {
            panda_box.css({ transform: 'translate3d(0,0,0)' });
            setTimeout(function () {
                panda_box.hide();
                if (panda_content.hasClass('help-video')) {
                    panda_content.html('');
                }
            }, 200);
        }
    }

    function set_titles($t) {
        var title;
        var link_title = $t.find('span.content span.title').text();
        var i;

        for (i = 2; i < 5; i++) {
            title = translate('slide_' + i + '_title').replace(/%element_name%/, link_title);
            slide_content[i].find('div.asset-title:first span.title-text').text(title);
        }
    }

    function resize_content_areas(){
        var height = $('.fancybox-inner').height();

        $.each(slide_content, function () {
            this.height(height);
        });
    }

    function handle_load_config_response(resp, settingsAsset, callback) {
        for (var type in resp) {
            for (var field in resp[type]) {
                var html = resp[type][field];
                if (type == 'image' || type == 'style') {
                    var el = $('#'+field+'_container'),
                        id = el.closest('.op_asset_browser_slide').attr('id');
                    el.find('.op-asset-dropdown-list').append(html);
                    if (id == 'op_asset_browser_slide3' || id == 'op_asset_browser_slide4') {
                        set_selector_value(field+'_container')
                    }
                } else if (type == 'checkbox') {
                    $('.field-id-'+field+' .checkbox-container').append(html);
                }
                stored_selectors[field] = html;
            }
        }
        //resize_content_areas();
        show_settings(settingsAsset[0], settingsAsset[1]);
        callback(op_stored_steps[settingsAsset[0]][settingsAsset[1]], op_stored_configs[settingsAsset[0]][settingsAsset[1]]);
        //show_container(settingsAsset[0], settingsAsset[1]);


        /**
         * Remove image loading indicators after images are loaded.
         * This is needed because some element preview images are transparent and very small,
         * so loading indicator is visible through the element.
         */
        $('#op_asset_browser_container')
            .find('.op-asset-dropdown-list-item:not(.op-asset-dropdown-list-item--loaded)')
                .find('img')
                    .one('load', function () {
                        $(this)
                            .parent().addClass('op-asset-img-loaded')
                            .parent().addClass('op-asset-dropdown-list-item--loaded');
                }).each(function () {
                    if (this.complete) {
                        $(this).load();
                    }
                });
    }


    /**
     * Loads the element config. It first checks localstorage and if element
     * is found, it loads it from there, if config is not found it requests it from server.
     * @param  {object}   settingsAsset
     * @param  {Function} callback
     */
    function load_element_config(settingsAsset, callback) {

        var currentItem = OptimizePress.localStorage.getItem(settingsAsset[1]);

        setup_settings_panel(settingsAsset[0], settingsAsset[1], op_asset_settings);

        if ($.object_length(folders) > 0) {

            if (currentItem) {
                handle_load_config_response(JSON.parse(currentItem), settingsAsset, callback);
            } else {
                $.post(OptimizePress.ajaxurl,
                    {
                        'action': OptimizePress.SN+'-assets-folder-list',
                        'folders': folders
                    },
                    function (resp) {
                        OptimizePress.localStorage.setItem(settingsAsset[1], JSON.stringify(resp));
                        handle_load_config_response(resp, settingsAsset, callback);
                    },
                    'json'
                );
            }
            folders = {};

        } else {
            show_settings(settingsAsset[0], settingsAsset[1]);
            callback(op_stored_steps[settingsAsset[0]][settingsAsset[1]], op_stored_configs[settingsAsset[0]][settingsAsset[1]]);
        }

    }

    /**
     * Loads the element op_asset_settings. It first checks localstorage and if element
     * is found, it loads it from there, if config is not found it requests it from server.
     * @param  {object}   settingsAsset
     * @param  {Function} callback
     */
    function load_config(settingsAsset, callback){
        var url;
        var currentConfigItem;

        callback = callback || function(){};

        if (op_assets[settingsAsset[0]][settingsAsset[1]].settings == 'Y') {

            if (typeof op_stored_configs[settingsAsset[0]] == 'undefined') {
                op_stored_configs[settingsAsset[0]] = {};
                op_stored_steps[settingsAsset[0]] = {};
            }

            if (typeof op_stored_configs[settingsAsset[0]][settingsAsset[1]] === 'undefined') {

                url = OptimizePress[settingsAsset[0]+'_assets_url'];

                // Needed for elements that are shipping as separate plugins
                if (op_assets[settingsAsset[0]][settingsAsset[1]].base_path !== null) {
                    url = op_assets[settingsAsset[0]][settingsAsset[1]].base_path;
                } else if (settingsAsset[0] != 'core') {
                    url += settingsAsset[1]+'/';
                }

                currentConfigItem = OptimizePress.localStorage.getItem(settingsAsset[1] + '_config');

                if (currentConfigItem) {
                    // Eval needs to be executed on global object.
                    eval.call(window, currentConfigItem);
                    load_element_config(settingsAsset, callback);
                } else {
                    $.getScript(
                        url + settingsAsset[1] + OptimizePress.script_debug + '.js',
                        function(resp) {
                            OptimizePress.localStorage.setItem(settingsAsset[1] + '_config', resp);
                            load_element_config(settingsAsset, callback);
                        }
                    );
                }

            } else {

                if (typeof op_stored_steps[settingsAsset[0]][settingsAsset[1]] !== 'undefined') {
                    $.each(op_stored_steps[settingsAsset[0]][settingsAsset[1]], function () {
                        this.find('.wp-editor-area').each(function () {
                            var id = $(this).attr('id');
                            var content = op_wpautop($(this).val());
                            var $wysiwyg = $(this).closest('.field-wysiwyg');
                            var ed;

                            // We want to remove parent html structure
                            // to ensure we don't keep adding new
                            // levels of tinymce nesting when
                            // calling add_wysiwyg...
                            $(this).closest('.wp-editor-wrap').remove();
                            add_wysiwyg.apply($wysiwyg, [id, content]);
                            // add_wysiwyg.apply($(this), [id, content]);
                            ed = tinyMCE.get(id);
                            ed.setContent(content);
                        });
                    });
                }

                show_settings(settingsAsset[0], settingsAsset[1]);
                callback(op_stored_steps[settingsAsset[0]][settingsAsset[1]], op_stored_configs[settingsAsset[0]][settingsAsset[1]]);

            }

        } else {
            if (disable_insert) {
                disable_slide = false;
                disable_insert = false;
                show_slide(1);
            } else {
                insert_content('['+settingsAsset[1]+']');
                $.fancybox.close();
            }
        }
    }

    function add_insert_buttons(form,option,cur_step){
        var str = '<div class="op-insert-buttons cf">';
        if (typeof option != 'boolean') {
            /*if(typeof option.actions != 'undefined'){
                for (var i in option.actions) {
                    str += '<a href="#' + i + '" class="op-slide-action" id="' + option.actions[i].id + '">'+translate(option.actions[i].label)+'</a>';
                }
            }*/

            if (typeof option.prev != 'undefined') {
                str += '<a href="#'+(cur_step+1)+'" class="op-slide-link">'+translate(option.prev)+'</a>';
            }
            if (typeof option.next != 'undefined') {
                str += '<a href="#'+(cur_step+2)+'" class="op-slide-link">'+translate(option.next)+'</a>';
            }
            if (typeof option.insert === 'undefined' || typeof option.insert !== 'boolean' || option.insert !== false) {
                str += '<a href="#" class="op-bsw-green-button">'+translate('Insert')+'</a>';
            }
        } else if (option === true) {
            str += '<a href="#" class="op-bsw-green-button">'+translate('Insert')+'</a>';
        }
        str += '</div><div class="clear"></div>';
        form.append(str);
    };

    function show_container(group, tag){
        if (group+'/'+tag == current_loading) {
            waiting.fadeOut('fast', function () {
                container.fadeIn('fast');
            });
        }
    }

    function show_slide(slide, animate){
        var margin = 0;
        var $fancyBoxOpened;
        var i = 0;
        var animateTimeout;

        if (disable_slide) {
            return;
        }

        animate = animate === false ? false : true;

        for (i = 0; i < slide; i++ ) {
            margin += slides[i].outerWidth(true);
        }

        $fancyBoxOpened = $('.fancybox-opened').eq(-1);
        $fancyBoxOpened.find('.op_asset_browser_slide_active').removeClass('op_asset_browser_slide_active');

        if (animate) {
            slides_ul.addClass('op-slide-transition');
            slides_ul.css({ 'transform': 'translate3d(' + (-margin) + 'px,0,0)' });
            animateTimeout = 401;
        } else {
            animateTimeout = 0;
            slides_ul.removeClass('op-slide-transition').css({ 'transform': 'translate3d(' + (-margin) + 'px,0,0)' });

            // Bugfix for Chrome 63:
            //
            // It seems that repaint isn't triggered in Chrome 63 after the
            // scale-in/fade-in animation of the fancybox finisehes, which
            // causes the steps div to be inproperly positioned.
            //
            // The only thing that triggers the repaint (that I found),
            // is overflow property, so we force it to visible here,
            // and immediately remove it after (but it has to be
            // wrapped in SetTimeout in order to work,
            // since  browser's optimizations just
            // ignore the change otherwise).
            //
            // Setting a class with overflow property doesn't work,
            // so we're changing it directly in style attribute
            slides_ul.parent().get(0).style.overflow = 'visible';
            setTimeout(function () {
                slides_ul.parent().get(0).style.overflow = '';
            });
        }

        // Slide transition is 400ms long, that's why we delay focus()
        setTimeout(function () {
            $fancyBoxOpened.find('.op_asset_browser_slide')
                .eq(slide)
                .addClass('op_asset_browser_slide_active')
                .find('.op_asset_content')
                    .addClass('op_no_outline')
                    .attr('tabindex', 0)
                    .focus();

            if (get_active_slide() === 1) {
                setTimeout(function () {
                    focusLastSelectedItem();
                }, 100);
            }

            /**
             * We want to focus the style that is being edited
             * when you click back from element settings
             */
            if (get_active_slide() === 2 && OptimizePress.currentEditElement) {
                scrollIntoViewStyle($fancyBoxOpened, slide);
            }


        }, animateTimeout);

        /**
         * This is a fix for Safari bug which causes touchpad and mouse wheel to become unresponsive.
         * Changing the scroll position significantly seems to reset/enables it.
         * That's why this weirdness is here.
         */
        if ($.browser && $.browser.safari) {
            var currentWindowPosition = $(window).scrollTop();
            $(window).scrollTop(currentWindowPosition === 0 ? 1000 : 0);
            setTimeout(function () {
                $(window).scrollTop(currentWindowPosition);
            }, 1);
        }

    }

    // Expose show_slide to a global object, so we can use it directly in element config
    window.OptimizePress.LiveEditor = window.OptimizePress.LiveEditor || {};
    window.OptimizePress.LiveEditor.show_slide = show_slide;

    /**
     * Scrolls into view currently edited style of the element
     * (this is triggered when you click back on the element options)
     */
    function scrollIntoViewStyle($fancyBoxOpened, slide) {

        var $browserSlide2 = $('#op_asset_browser_slide2');
        var $activeElementStyles = $browserSlide2.find('.settings-container:visible');
        var $currentAssetContent = $browserSlide2.find('.op_asset_content');
        var $currentEditElement = $activeElementStyles.find('img[alt="' + OptimizePress.currentEditElement + '"]').parent();
        var currentSyleScrollIntervalId;

        if (!$currentEditElement || $currentEditElement.length === 0) {
            return false;
        }

        $currentEditElement.addClass('selected').focus();

        if (typeof $currentEditElement[0].scrollIntoView !== 'function') {
            return false;
        }

        // We want to focus the correct item as items are being loaded
        if ($activeElementStyles.find('.op-asset-dropdown-list-item:not(.op-asset-dropdown-list-item--loaded)').length > 0) {
            currentSyleScrollIntervalId = setInterval(function () {
                $currentEditElement[0].scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });

                // When all elements are loaded, clear the interval
                if ($activeElementStyles.find('.op-asset-dropdown-list-item:not(.op-asset-dropdown-list-item--loaded)').length === 0) {
                    clearInterval(currentSyleScrollIntervalId);
                }
            }, 400);
        }
    }

    /**
     * Selects the last active list item in add element dialog for keyboard navigation
     */
    function focusLastSelectedItem() {

        var $lastSelectedListItem;
        var currentActiveSlide = get_active_slide();

        if (currentActiveSlide === 1) {
            $lastSelectedListItem = $('#op_asset_browser_slide1').find('.op-last-selected-asset-list-item');
            if ($lastSelectedListItem.length > 0) {
                $lastSelectedListItem.focus();
            } else {
                $('#op_assets_filter').focus();
            }
        }

        if (currentActiveSlide === 2) {
            $lastSelectedListItem = $('#op_asset_browser_slide2').find('.op-last-selected-asset-dropdown-list-item:visible');
            $('#op_asset_browser_slide2').find('.op-last-selected-asset-dropdown-list-item:hidden').removeClass('op-last-selected-asset-dropdown-list-item');
            if ($lastSelectedListItem.length > 0) {
                $lastSelectedListItem.removeClass('selected').focus();
            } else {
                $('.op-asset-dropdown-list-item:visible').eq(0).find('a').focus();
            }
        }

    }


    /**
     * Function returns the active slide number
     * @return number or false if no slide is active
     */
    function get_active_slide() {
        var currentSlide;
        $('#op_asset_browser_slider').find('> li').each(function (index) {
            if ($(this).hasClass('op_asset_browser_slide_active')) {
                currentSlide = index;
            }
        });
        return currentSlide;
    }

    function show_settings(group,tag){
        set_help_videos(group,tag);
        current_asset = [group,tag];
        reset_form(group,tag);
        container.find('.op_asset_browser_slide .op-settings-'+group+'-'+tag).css('display','block');
    };

    function setup_settings_panel(group,tag,settings){

        op_stored_steps[group][tag] = [];
        op_stored_configs[group][tag] = settings;
        help_vids[group][tag] = [];

        var classname = 'op-settings-'+group+'-'+tag,
            idprefix = 'op_assets_'+group+'_'+tag+'_',
            insert_steps = settings.insert_steps || {},
            vids = settings.help_vids || {};

        if(slides[2].find('> .'+classname).length == 0){
            trigger_events = {};
            for(var i=1;i<4;i++){
                var tmp_vid = '';
                if(typeof vids['step_'+i] != 'undefined'){
                    tmp_vid = generate_video_link(vids['step_'+i]);
                }
                help_vids[group][tag].push(tmp_vid);
                if(typeof settings.attributes['step_'+i] != 'undefined'){
                    var step = $('<div class="'+classname+' settings-container"><div class="op-asset-actual-content" />');
                    op_stored_steps[group][tag].push(step);
                    slide_content[i+1].append(step);
                    var cont = step.find('.op-asset-actual-content');
                    for(var j in settings.attributes['step_'+i]){
                        generate_field.apply(cont,[idprefix,j,settings.attributes['step_'+i][j],group,tag]);
                    };
                    init_color_picker(step);
                    if(typeof insert_steps[i] != 'undefined'){
                        add_insert_buttons(step,insert_steps[i],i);
                    }
                } else {
                    break;
                }
            };
            if(typeof settings.onGenerateComplete != 'undefined'){
                settings.onGenerateComplete(op_stored_steps[group][tag]);
            }
            $.each(trigger_events,function(i,v){
                var el = $(i);
                $.each(v,function(i2,v2){
                    if (typeof v2 === 'string') {
                        el.trigger(v2);
                    }
                });
            });

            container.find('.'+classname).on('click', '.op-insert-buttons .op-bsw-green-button', function(e){
                e.preventDefault();

                // Insert tag if form is successfully validated, if not form show errors
                if (validate_form(container)) {
                    insert_tag(group,tag);
                } else {
                    show_form_validation_errors(container);
                }
            });

            init_show_ons();
        }
    };

    /**
     * Validates the form and adds 'op-required-input-error' class to the
     * input fields that are required but not inserted
     * @param  {jQuery object} form container (not necessarily a form element)
     * @return {boolean}       returns true or false
     */
    function validate_form($form) {

        var $this;
        var allowInsert = true;
        var currentClass;

        /**
         * If there's no required input fields on the page,
         * or if all required fields are filled up, we can insert the tag,
         * otherwise we just focus the invalid input field and scroll the fancybox to its position
         */
        if ($form.find('.op-required-input').length > 0) {

            /**
             * This temp class is added to all tabs,
             * because we rely on visible input fields for validation
             */
            $form.find('.op-multirow-tabs').nextAll('.op-multirow').addClass('op-temp-show');

            // We need to go through all required input fields and check if they're good to go
            $form.find('.op-required-input').each(function (e) {

                var selector;
                var isWysiwyg;
                var isFileUploader;

                $this = $(this);

                isWysiwyg = $this.hasClass('field-wysiwyg') ? true : false;
                isMedia = $this.hasClass('field-media') ? true: false;

                if (isWysiwyg) {
                    selector = '.op-wysiwyg:visible .wp-editor-area';
                } else if (isMedia) {
                    selector = '.op-file-uploader:visible .op-uploader-value';
                } else {
                    selector = 'input:visible, select:visible, textarea:visible';
                }

                $this.find(selector).each(function () {

                    var tinymceId = isWysiwyg ? $this.find('.op-wysiwyg:visible .wp-editor-area').attr('id') : '';
                    var currentInputValue = isWysiwyg ? tinyMCE.get(tinymceId).getContent() : $(this).val();

                    if (!currentInputValue) {
                        allowInsert = false;
                        $this.addClass('op-required-input-error');

                        // tinyMCE and media fields are handled differently
                        if (isWysiwyg) {
                            if (tinyMCE.majorVersion > 3) {
                                tinyMCE.get(tinymceId).on('change', function(e) {
                                    if (e.level.content) {
                                        $('#' + e.target.id).parentsUntil('.field-wysiwyg').parent().removeClass('op-required-input-error');
                                    } else {
                                        $('#' + e.target.id).parentsUntil('.field-wysiwyg').parent().addClass('op-required-input-error');
                                    }
                                });
                            } else {
                                tinyMCE.get(tinymceId).onChange.add(function(ed, l) {
                                    if (l.content) {
                                        $('#' + ed.id).parentsUntil('.field-wysiwyg').parent().removeClass('op-required-input-error');
                                    } else {
                                        $('#' + ed.id).parentsUntil('.field-wysiwyg').parent().addClass('op-required-input-error');
                                    }
                                });
                            }
                        } else {
                            $(this)
                                .off('change blur')
                                .on('change blur', function (e) {
                                    var $parentEl = $(this).parentsUntil('.op-required-input').parent();
                                    if ($parentEl.length < 1) {
                                        $parentEl = $(this).parent();
                                    }

                                    if ($(this).val()) {
                                        $parentEl.removeClass('op-required-input-error');
                                    } else {
                                        $parentEl.addClass('op-required-input-error');
                                    }
                                });
                        }
                    } else {
                        $this.removeClass('op-required-input-error');
                    }
                });
            });

            $form.find('.op-multirow-tabs').nextAll('.op-multirow').removeClass('op-temp-show');
        }

        if (allowInsert) {
            $form.find('.op-required-input-error').find('input, select, textarea').off('blur');
        }

        return allowInsert;
    }

    /**
     * Shows form validation errors and focuses first error field
     * @param  {jQuery object} form container (not necessarily a form element)
     * @return {void}
     */
    function show_form_validation_errors($form) {

        var $inputErrorField;
        var $inputErrorFieldContainer;
        var currentIndex;

        alert('Please enter all required fields.');

        // We want to focus and scroll into the view the first invalid input field
        $inputErrorField = $form.find('.op-required-input-error').eq(0);

        // If first invalid field is on inactive tab, set the tab as active
        if (!$inputErrorField.is(':visible')) {

            // Get the input container (it can be direct parent or further down the tree)
            $inputErrorFieldContainer = $inputErrorField.parent('.op-multirow');
            if ($inputErrorFieldContainer.length === 0) {
                $inputErrorFieldContainer = $inputErrorField.parentsUntil('.op-multirow').parent();
            }

            if ($inputErrorFieldContainer) {

                // Tab index coencides with the link index, so we use this to correctly open the desired tab
                currentIndex = $inputErrorFieldContainer.parent().find('.op-multirow').index($inputErrorFieldContainer);

                $form
                    .parentsUntil('.multirow-container')
                    .parent()
                    .find('.op-multirow-tabs li:eq(' + currentIndex + ') a')
                        .trigger('click');
            }
        }

        // If active slide isn't the one with element options, open it
        if (get_active_slide() !== 3) {
            show_slide(3, false);
        }

        // Scroll the fancybox to the correct position
        $('.op_asset_browser_slide_active > .op_asset_content').scrollTop($inputErrorField[0].offsetTop);

        // Focus the erroneous input field
        $inputErrorField.find('input:visible, textarea:visible, select:visible').focus();

    }

    function reset_form(group,tag){
        var reset_opts = false;
        if(!disable_slide && !disable_insert){
            disable_slide = true;
            disable_insert = true;
            reset_opts = true;
        }
        if(typeof op_stored_configs[group][tag].attributes != 'undefined'){
            var idprefix = 'op_assets_'+group+'_'+tag+'_',
                classprefix = '.field-id-op_assets_'+group+'_'+tag+'_';
            for(var i in op_stored_configs[group][tag].attributes){
                for(var j in op_stored_configs[group][tag].attributes[i]){
                    var v = op_stored_configs[group][tag].attributes[i][j];
                    reset_field(idprefix+j,classprefix+j,v);
                }
            };
        }
        if(reset_opts){
            disable_slide = false;
            disable_insert = false;
        }
    };

    function reset_field(idprefix,classprefix,field){
        var type = field.type || '';
        if(type == 'tabs'){
            for(var i in field.tabs){
                for(var j in field.tabs[i].fields){
                    reset_field(idprefix+'_'+i+'_'+j,classprefix+'_'+i+'_'+j,field.tabs[i].fields[j]);
                };
            };
        } else if (type == 'column') {
            idprefix = idprefix.replace('_left_column','').replace('_right_column','');
            classprefix = classprefix.replace('_left_column','').replace('_right_column','');
            for (var i in field.elements) {
                reset_field(idprefix + '_' + i, classprefix + '_' + i, field.elements[i]);
            }
        } else if (type == 'container') {
            for (var i in field.attributes) {
                reset_field(idprefix + '_' + i, classprefix + '_' + i, field.attributes[i]);
            }
            $(classprefix + ' .panel-controlx').attr('checked', field.default_value).trigger('change');
        } else if (type == 'slider') {
            $slider = $('#' + idprefix);
            $slider.slider({value: get_default_val(field)});
            $slider.slider('option', 'slide').call($slider, {}, {value: get_default_val(field), id: idprefix});
            $slider.slider('option', 'stop').call($slider, {}, {value: get_default_val(field), id: idprefix});
        } else if (type == 'text_properties') {
            $('#' + idprefix + '_text').val(field.text_default).trigger('keydown');
            $('#' + idprefix + '_size').val(field.size_default).trigger('change');
            $('#' + idprefix + '_color').val(field.color_default).trigger('keydown');
            $('#' + idprefix + '_container a.selected-item').html($('#' + idprefix + '_container.op-asset-dropdown-list li:first a').html());
            $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({type: 'update_button_preview', id: idprefix, value: 'Default', font_type: 'default', tag: current_asset[1]});
            $(classprefix + ' .op-font-style-bold').attr('checked', field.bold_default).trigger('change');
            $(classprefix + ' .op-font-style-italic').attr('checked', field.italic_default).trigger('change');
            $(classprefix + ' .op-font-style-underline').attr('checked', field.underline_default).trigger('change');
        } else if(type == 'media'){
            set_uploader_value(idprefix,'');
        } else if(type == 'multirow'){
            var multirow = container.find(classprefix+'-multirow-container .op-multirow');
            multirow_length_class(multirow);
            multirow.remove();
        } else if(type == 'style-selector' || type == 'image-selector'){
            set_selector_value(idprefix+'_container',get_default_val(field));
        } else if(type == 'wysiwyg'){
            set_wysiwyg_content(idprefix,get_default_val(field));
        } else if(type == 'font'){
            container.find(classprefix+' > a.reset').trigger('click');
        } else if(type == 'checkbox'){
            var els = $('.field-id-'+idprefix+' :checkbox').attr('checked',false).trigger('change'),
                val = get_default_val(field);
            if(typeof val == 'object'){
                $.each(val,function(i,v){
                    els.filter('[value="'+v+'"]').attr('checked',true).trigger('change');
                });
            } else if (val === true) {
                els.attr('checked', true).trigger('change');
            }
        } else if(type == 'radio'){
            $('.field-id-'+idprefix+' :radio[value="'+get_default_val(field)+'"]').attr('checked',true);
        } else {
            var el = $('#'+idprefix).val(get_default_val(field)).trigger('change'),
                val = el.val();
            if(typeof field.multirow != 'undefined'){
                for(var k=0;k<val;k++){
                    for(var idx in field.multirow.attributes){
                        reset_field(idprefix+'_'+k+'_'+idx,classprefix+'_'+k+'_'+idx,field.multirow.attributes[idx]);
                        //var vm = field.multirow.attributes[idx];
                        //$('#'+idprefix+'_'+k+'_'+idx).val(get_default_val(vm)).trigger('change');
                    };
                }
            }
        }
    };

    function attach_panel_control(name, id, value) {
        /*
         * Creates markup for iButton
         */
        var panel_control = this.append('<div class="panel-control"><input type="checkbox" name="op[' + name + '][enabled]" id="' + id + '" value="' + value + '" class="panel-controlx"></div>');

        /*
         * Initiates iButton and 'change' event
         */
        panel_control.find('.panel-controlx').iButton({
            change: function(elem){
                var parent = elem.closest('.op-bsw-grey-panel'),
                    panel = parent.find('.op-bsw-grey-panel-content:first'),
                    link_el = parent.find('.show-hide-panel a:first'),
                    visible = panel.is(':visible'),
                    value = elem.is(':checked');
                if (!visible && value === true) {
                    panel.show();
                    link_el.addClass('op-bsw-visible');
                } else if (visible && value === false) {
                    panel.hide();
                    link_el.removeClass('op-bsw-visible');
                }
            }
        });
    }

    /**
     * Adds multirow length to multirow_container/buttonrow class
     * @param  {Object} multirow HTML element
     * @return {Void}
     */
    function multirow_length_class(multirow) {
        var container = $(multirow).parent();
        var buttonrow = container.next();

        setTimeout(function() {
            var sel = String($(multirow).attr('class'))
                .replace(/(^\s+|\s+$)/g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s/g, '.');
            if (sel)
                sel = '.' + sel;
            var num = container.children(sel).length;

            var match = String(container.attr('class'))
                .match(/(^|\s)multirow-container-length-([0-9]+)(?=(\s|$))/g);
            if (match) {
                $.each(match, function(k,v) {
                    container.removeClass(v);
                });
            }
            container.addClass('multirow-container-length-' + num);

            var match = String(buttonrow.attr('class'))
                .match(/(^|\s)field-multirow-length-([0-9]+)(?=(\s|$))/g);
            if (match) {
                $.each(match, function(k,v) {
                    buttonrow.removeClass(v);
                });
            }
            buttonrow.addClass('field-multirow-length-' + num);
        });
    }

    function generate_field(idprefix, id, field, group, tag, classextra) {
        if (typeof field.skip != 'undefined' && field.skip == true) {
            return;
        }

        var type = field.type || 'input';
        var help = field.help || '';
        var title = field.title || '';
        var classextra = classextra || '';
        var add_class = (field.type ==  'button_preview' ? '' : field.addClass || '');
        var readonly = field.readonly === true ? ' readonly ' : '';
        var required = field.required ? 'op-required-input' : '';
        var tmp_id = idprefix+id;
        var removeCf = field.removeCf || false;
        var str = $('<div class="field-row field-'+type+' field-id-'+tmp_id+' '+classextra+' '+add_class + ' ' + required + ' field-'+id+(removeCf?'':' cf')+'" />');
        var $t = this;
        var prefix = field.prefix || '';
        var suffix = field.suffix || '';
        var multirow_container;
        var placeholder = field.placeholder || '';

        prefix = prefix == '' ? '' : translate(prefix)+' ';
        suffix = suffix == '' ? '' : ' '+translate(suffix);

        if(type == 'microcopy'){
            $t.append('<p class="micro-copy'+(add_class==''?'':' '+add_class)+'">'+translate(field.text)+'</p>');
            return;
        } else if(type == 'tabs'){
            var div = $t.append('<div class="field-id-'+tmp_id+'-multirow-container multirow-container field-type-tabs cf" />').find('.field-id-'+tmp_id+'-multirow-container'),
                tmp_id2 = tmp_id,
                ul = div.append('<ul class="op-multirow-tabs cf" />').find('.op-multirow-tabs'),
                multi;
            for(var i in field.tabs){
                ul.append('<li><a href="#'+i+'">'+translate(field.tabs[i].title)+'</a></li>');
                multi = div.append('<div class="op-multirow op-multirow-'+i+'" />').find('.op-multirow-'+i);
                for(var j in field.tabs[i].fields){
                    generate_field.apply(multi,[tmp_id2+'_'+i+'_',j,field.tabs[i].fields[j],group,tag]);
                    $('#'+tmp_id2+'_'+i+'_'+j).val(get_default_val(field.tabs[i].fields[j]));
                }
            }
            ul.find('a:first').trigger('click');
            return;
        }
        str.appendTo(this);
        if($.inArray(type,['h1','h2','h3','h4','h5','h6','p']) > -1){
            str.append('<'+type+'>'+translate(title)+'</'+type+'>');
        } else if(type == 'multirow'){
            str.before('<div class="field-id-'+tmp_id+'-multirow-container multirow-container multirow-container-length-0 cf" />');
            multirow_container = $t.find('.field-id-'+tmp_id+'-multirow-container').append(title==''?'':'<label for="'+tmp_id+'">'+translate(field.title)+'</label>');
            str.addClass('field-multirow-length-0');
            str.append('<a href="#" class="new-row">'+translate('add_new')+' '+translate(field.link_suffix || '')+'</a>');
            multirow_container.data('op_current_increment',0);
        } else if (type === 'column') {
            /*
             * Generating child elements
             */
            for (key in field.elements) {
                generate_field.apply(str, [prefix, idprefix + key, field.elements[key], group, tag]);
            }
        } else if (type === 'container') {
            /*
             * Appending container markup
             */
            var container = str.append('<div class="op-bsw-grey-panel section-' + tmp_id + '"><div class="op-bsw-grey-panel-header cf"><h3><a href="#">' + translate(field.title) + '</a></h3></div><div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_' + tmp_id + '"></div></div>');

            /*
             * Attaching click event
             */
            container.on('click', '.op-bsw-grey-panel-header h3 a', function(e) {
                e.preventDefault();
                var $t = $(this),
                    func1 = 'addClass',
                    func2 = 'show',
                    parent = $t.closest('.op-bsw-grey-panel'),
                    panel = parent.find('.op-bsw-grey-panel-content:first');
                if(panel.is(':visible')){
                    func1 = 'removeClass';
                    func2 = 'hide';
                }
                $t[func1]('op-bsw-visible');
                panel[func2]();
            });

            /*
             * Displaying panel control if needed
             */
            if (typeof field.showPanelControl != 'undefined' && true === field.showPanelControl) {
                attach_panel_control.apply(container.find('.op-bsw-grey-panel-header'), [tmp_id, 'panel_control_' + tmp_id, 'Y']);
            }

            /*
             * Generating child elements
             */
            var $container_content = container.find('#op_container_content_' + tmp_id);
            for (key in field.attributes) {
                generate_field.apply($container_content, [prefix, tmp_id + '_' + key, field.attributes[key], group, tag]);
            }
            /*
             * Input type text will be getting its own events as it needs to respond to keypresses, pastes and stuff like that
             */
            container.find('input[type!="text"],select').change(function(e) {
                var element_id, element_value;
                /*
                 * For checkbox element we need to modify its value based on checked status
                 */
                if ($(this).attr('type') === 'checkbox') {
                    element_id = $(this).attr('name');
                    if ($(this).is(':checked')) {
                        element_value = 1;
                    } else {
                        element_value = 0;
                    }
                } else {
                    element_id = $(this).attr('id');
                    element_value = $(this).val();
                }
                $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({type: 'update_button_preview', value: element_value, id: element_id, element_type: this.tagName.toLowerCase(), tag: current_asset[1]});
            });
            /*
             * Own events just for input type text (keypress, paste)
             */
            container.find('input[type="text"]').on('propertychange keydown input paste', function(e) {
                $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({type: 'update_button_preview', value: $(this).val(), id: $(this).attr('id'), element_type: this.tagName.toLowerCase(), tag: current_asset[1]});
            });
        } else {
            str.append(title==''?'':'<label for="'+tmp_id+'">'+translate(field.title)+'</label>');
            if (typeof field.helpPosition != 'undefined' && field.helpPosition == 'top' && help != '') {
                // str.append('<p class="micro-copy"><img src="'+OptimizePress.imgurl+'70_888.png" alt="Help" /> '+translate(help)+'</p>');
                str.append('<p class="micro-copy">'+translate(help)+'</p>');
            }
            switch(type){
                case 'custom_html':
                    str.append(field.html);
                    break;
                case 'button_preview':
                    str.append('<div class="preview_border preview-wrapper"><div class="preview-outer"><div class="preview-inner preview_border op-asset-dropdown" id="' + tmp_id + '_container"><a href="#" tabindex="-1" class="selected-item css-button style-1 pbox_' + field.addClass + '" id="op_button_preview">'
                        + '<span class="text">' + (typeof field.text != 'undefined' ? field.text : 'Placeholder text') + '</span>'
                        + '<span' + (typeof field.showSubtext != 'undefined' && field.showSubtext === false ? ' style="display:none !important;"' : '') + ' class="subtext">' + (typeof field.subtext != 'undefined' ? field.subtext : 'Placeholder subtext') + '</span>'
                        + '<div' + (typeof field.showGradient != 'undefined' && field.showGradient === false ? ' style="display:none !important;"' : '') + '  class="gradient"></div>'
                        + '<div' + (typeof field.showShine != 'undefined' && field.showShine === false ? ' style="display:none !important;"' : '') + '  class="shine"></div>'
                        + '<div class="hover"></div>'
                        + '<div class="active"></div>'
                        + '</a>'
                        + _preset_selector_html(tmp_id, '', field.selectorClass || '')
                        + '</div></div></div>');
                    if(typeof field.folder != 'undefined'){
                        add_folder('image',{fieldid:tmp_id,group:group,tag:tag,folder:field.folder},field);
                    }
                    //$('#op_button_preview').parent().append(_preset_selector_html(tmp_id,'',field.selectorClass || ''));
                    break;
                case 'media':
                    str.append($('#op_dummy_media_container').html().replace(/op_dummy_media/g,tmp_id));
                    if(typeof field.callback != 'undefined'){
                        $('#'+tmp_id).change(field.callback);
                    }
                    break;
                case 'wysiwyg':
                    add_wysiwyg.apply(str,[tmp_id]);
                    break;
                case 'slider':
                    var output = '';
                    if (typeof field.showOutputElement != 'undefined' && field.showOutputElement === true) {
                        output = '<div class="slider-output"><span id="output_' + tmp_id + '" data-unit="' + field.unit + '">'
                        + (typeof field.default_value != 'undefined' ? field.default_value : 0)
                        + field.unit + '</span></div>'
                    }
                    slider = str.append(
                        prefix
                        + output
                        + '<div class="slider-item" id="' + tmp_id + '" data-min="' + (typeof field.min != 'undefined' ? field.min : 0) + '" data-max="' + (typeof field.max != 'undefined' ? field.max : 0) + '" data-value="' + (typeof field.default_value != 'undefined' ? field.default_value : 0) + '" />'
                        + suffix
                    );
                    slider.find('.slider-item').slider({
                        min: (typeof field.min != 'undefined' ? field.min : 0),
                        max: (typeof field.max != 'undefined' ? field.max : 0),
                        value: (typeof field.default_value != 'undefined' ? field.default_value : 0),
                        stop: function (event, ui) {
                            var id;
                            if (typeof ui.handle != 'undefined') {
                                id = $(ui.handle).parent().attr('id');
                            } else {
                                id = ui.id;
                            }
                            $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({type: 'update_button_preview', value: ui.value, id: id, element_type: 'slider', tag: current_asset[1]});
                        },
                        slide: function (event, ui) {
                            var id;
                            if (typeof ui.handle != 'undefined') {
                                id = $(ui.handle).parent().attr('id');
                            } else {
                                id = ui.id;
                            }
                            var $output = $('#output_' + id);
                            if ($output.length > 0) {
                                $output.html(ui.value + $output.attr('data-unit'));
                            }
                        }
                    });
                    break;
                case 'color':
                    str.append('<div class="color-picker-container cf">'+
                            prefix+'<input type="text" value="' + (typeof field.default_value != undefined ? field.default_value : '') + '" id="'+tmp_id+'" name="'+tmp_id+'" />'+suffix+'<a href="#" class="op-pick-color hide-if-no-js"></a>'+
                            '</div>');
                    break;
                case 'checkbox':
                    var func = field.func || 'prepend';
                    str[func]('<div class="checkbox-container">'+input_values(tmp_id,field,type,group,tag)+'</div>');
                    if(typeof field.appendTo != 'undefined'){
                        str.on('change', ':checkbox', function(){
                            var f = $('.field-id-'+idprefix+field.appendTo+' :input'),
                                cc = f.val(),
                                val = $(this).val();

                            if (typeof cc === 'undefined') {
                                cc = '';
                            }

                            if($(this).is(':checked')){
                                cc += '|'+val;
                            } else {
                                cc = cc.replace(new RegExp(val,'g'),'');
                            }

                            cc = cc.replace(new RegExp('^[|]+', 'g'), '');
                            f.val(cc);
                        });
                    }
                    break;
                case 'radio':
                    str.append('<div class="checkbox-container">'+input_values(tmp_id,field,type,group,tag)+'</div>');
                    break;
                case 'image-selector':
                    if(typeof field.folder != 'undefined'){
                        add_folder('image',{fieldid:tmp_id,group:group,tag:tag,folder:field.folder},field);
                    }
                    str.append(_style_selector_html(tmp_id,'',field.selectorClass || ''));
                    break;
                case 'text_properties':
                    str.append(add_text_properties(tmp_id,field)).find('.selected-item').html(str.find('li a:first').html());
                    break;
                case 'font':
                    str.append(add_font_settings(tmp_id,field)).find('.selected-item').html(str.find('li a:first').html()); //.find('.op-asset-dropdown-list li a:first').trigger('click');
                    break;
                case 'style-selector':
                    if(typeof field.folder != 'undefined'){
                        add_folder('style',{fieldid:tmp_id,group:group,tag:tag,folder:field.folder},field);
                    }
                    str.append(_style_selector_html(tmp_id,'',field.selectorClass || ''));
                    break;
                case 'select':
                    str.append(prefix+'<select name="'+tmp_id+'" id="'+tmp_id+'">'+input_values(tmp_id,field,type,group,tag)+'</select>'+suffix);
                    break;
                case 'membership_select':
                    str.append(prefix+'<select name="'+tmp_id+'" id="'+tmp_id+'">'+input_values(tmp_id,field,type,group,tag)+'</select>'+suffix);
                    break;
                case 'textarea':
                    str.append(prefix+'<textarea cols="30" rows="10" name="'+tmp_id+'" id="'+tmp_id+'"' + readonly + '></textarea>'+suffix);
                    break;
                case 'hidden':
                    str.append(prefix+'<input type="hidden" name="'+tmp_id+'" id="'+tmp_id+'" value="' + (typeof field.default_value != undefined ? field.default_value : '') + '" />'+suffix);
                    break;
                case 'paragraph':
                    str.append(prefix+'<p name="'+tmp_id+'" id="'+tmp_id+'">' + (typeof field.text != undefined ? field.text : '') + '</p>'+suffix);
                    break;
                case 'posts_multiselect':
                    var html = '';
                    $.ajax({
                        url: OptimizePress.ajaxurl,
                        data: {
                            'action': OptimizePress.SN + '-assets-posts-list'
                        },
                        success: function (data) {
                            OptimizePress.postList = JSON.parse(data);
                            html += '<select multiple="multiple" id="my-select" name="my-select[]">';
                            for(i=0; i<OptimizePress.postList.length; i++){
                                html += '<option value="' + OptimizePress.postList[i].ID + '" data-meta="' + OptimizePress.postList[i].ID + ' ' + OptimizePress.postList[i].post_title +  ' ' + OptimizePress.postList[i].categories + '">' + OptimizePress.postList[i].post_title + '</option>';
                            }
                            html += '</select>';
                            html += '<script>' +
                                        'opjq("#my-select").multiSelect({' +
                                            'keepOrder:true,' +
                                            'selectableHeader: "<input type=\'text\' class=\'search-input\' autocomplete=\'off\' placeholder=\'Search posts\'>",' +
                                            'selectionHeader: "<input type=\'text\' class=\'search-input\' autocomplete=\'off\' placeholder=\'Search posts\'>",' +
                                            'afterInit: function(ms){' +
                                                'var that = this,'+
                                                '$selectableSearch = that.$selectableUl.prev(),'+
                                                '$selectionSearch = that.$selectionUl.prev(),'+
                                                'selectableSearchString = "#" + that.$container.attr("id") + " .ms-elem-selectable:not(.ms-selected)";' +
                                                'selectionSearchString  = "#" + that.$container.attr("id") + " .ms-elem-selection.ms-selected";' +
                                                'that.qs1 = $selectableSearch.quicksearch(selectableSearchString, {' +
                                                    'testQuery: function (query, txt, _row) {' +
                                                        'txt = opjq(_row).attr("data-meta");' +
                                                        'txt = txt.toLowerCase();' +
                                                        'for (var i = 0; i < query.length; i += 1) {' +
                                                            'if (txt.indexOf(query[i]) === -1) {'+
                                                                'return false;'+
                                                            '}' +
                                                        '}'+
                                                        'return true;'+
                                                    '}'+
                                                '})' +
                                                    '.on("keydown", function(e){' +
                                                        'if (e.which === 40){' +
                                                            'that.$selectableUl.focus();'+
                                                            'return false;'+
                                                        '}'+
                                                    '});'+
                                                'that.qs2 = $selectionSearch.quicksearch(selectionSearchString, {' +
                                                    'testQuery: function (query, txt, _row) {' +
                                                        'txt = opjq(_row).attr("data-meta");' +
                                                        'txt = txt.toLowerCase();' +
                                                        'for (var i = 0; i < query.length; i += 1) {' +
                                                            'if (txt.indexOf(query[i]) === -1) {'+
                                                                'return false;'+
                                                            '}' +
                                                        '}'+
                                                        'return true;'+
                                                    '}'+
                                                '})' +
                                                        '.on("keydown", function(e){' +
                                                        'if (e.which === 40){' +
                                                            'that.$selectableUl.focus();'+
                                                            'return false;'+
                                                        '}'+
                                                '});'+
                                            '},' +
                                            'afterSelect: function(){'+
                                                // 'var style = opjq(".selected").children().attr("alt"); ' +
                                                // 'var selected = opjq(".ms-selection .ms-selected").length; ' +
                                                // 'if(selected == "3"){ opjq(".ms-selectable ul li").addClass("disabled") }' +
                                                'this.qs1.cache();'+
                                                'this.qs2.cache();'+
                                            '},'+
                                            'afterDeselect: function(){'+
                                                // 'var selected = opjq(".ms-selection .ms-selected").length; ' +
                                                // 'if(selected <= "3"){ opjq(".ms-selectable ul li").removeClass("disabled") }' +
                                                'this.qs1.cache();'+
                                                'this.qs2.cache();'+
                                            '}'+
                                        '});' +
                                    '</script>'
                            str.append(prefix + html + suffix);
                        },
                        error: function (errorThrown) {
                            console.log(errorThrown);
                        }
                    });

                    break;
                default:
                    str.append(prefix+'<input type="text" name="'+tmp_id+'" id="'+tmp_id+'" placeholder="'+placeholder+'" />'+suffix);
                    break;
            }
        }
        if ((typeof field.helpPosition == 'undefined' || field.helpPosition != 'top') && help != '') {
            // str.append('<p class="micro-copy"><img src="'+OptimizePress.imgurl+'70_888.png" alt="Help" /> '+translate(help)+'</p>');
            str.append('<p class="micro-copy">'+translate(help)+'</p>');
        }
        if(typeof field.events != 'undefined'){
            if((type == 'image-selector' || type == 'style-selector') && typeof field.events.change != 'undefined'){
                str.on('click', 'li a', function(e){
                    e.preventDefault();
                    $(this).closest('ul').find('a.selected').removeClass('selected').end().end().addClass('selected');
                    var ret = field.events.change($(this).find('img').attr('alt'),op_stored_steps[group][tag]);
                    if(ret === false){
                        e.stopPropagation();
                    }
                });
            } else {
                var trigger = typeof field.trigger_events,
                    el = $('#'+tmp_id);
                for(var i in field.events){
                    el.bind(i,op_stored_steps[group][tag],field.events[i]);
                };
                if(trigger != 'undefined'){
                    if(trigger != 'object'){
                        trigger = [field.trigger_events];
                    } else {
                        trigger = field.trigger_events;
                    }
                    trigger_events['#'+tmp_id] = [];
                    for(var i in trigger){
                        trigger_events['#'+tmp_id].push(trigger[i]);
                    };
                }
            }
        }
        if(typeof field.showOn != 'undefined'){
            if(typeof field.showOn.value == 'object'){
                var tmp_showon = $.extend({},field.showOn);
                for(var i in field.showOn.value){
                    tmp_showon.value = field.showOn.value[i];
                    add_showon(group,tag,id,tmp_showon,idprefix);
                    if (type == 'multirow') {
                        add_showon(group,tag,id + '-multirow-container',tmp_showon,idprefix);
                    }
                }
            } else {
                add_showon(group,tag,id,field.showOn,idprefix);
                if (type == 'multirow') {
                    add_showon(group,tag,id + '-multirow-container',field.showOn,idprefix);
                }
            }
        }
        if(typeof field.showFields != 'undefined'){
            var thefield = $t.find('.field-id-'+tmp_id);
                div = thefield.append('<div class="show-fields"/>').find('.show-fields'),
                tmp_id2 = tmp_id;
            for(var idx in field.showFields){
                generate_field.apply(div,[tmp_id2+'_',idx,field.showFields[idx],group,tag,'show-field-'+idx]);
            };
            div.find('.field-row').hide();
            if(type == 'image-selector' || type == 'style-selector'){
                $('body').on('click', '#'+tmp_id2+'_container .op-asset-dropdown-list a', function(e){
                    e.preventDefault();
                    var v = $(this).find('img').attr('alt');
                    div.find('.field-row').hide().filter('.show-field-'+v).show();
                });
            } else {
                $('#'+tmp_id2).change(function(){
                    div.find('.field-row').hide().filter('.show-field-'+$(this).val()).show();
                });
            }
        } else if(typeof field.multirow != 'undefined'){
            var div = multirow_container,
                tmp_id2 = tmp_id,
                show_ons_init = false;
            if(typeof div == 'undefined'){
                div = $t.append('<div class="field-id-'+tmp_id+'-multirow-container multirow-container cf" />').find('.field-id-'+tmp_id+'-multirow-container');
            }
            if(type == 'multirow'){
                var multi,
                    prefix = field.multirow.link_prefix || '',
                    suffix = field.multirow.link_suffix || '';
                    prefix = prefix == '' ? '' : translate(prefix)+' ';
                    suffix = suffix == '' ? '' : ' '+translate(suffix),
                    remove_row = '',
                    remove_row_str = '<a href="#" class="remove-row"><img src="'+OptimizePress.imgurl+'remove-row.png" alt="'+translate('remove_row')+'" /></a>';
                $('.field-id-'+tmp_id2+' a.new-row').click(function(e){
                    if ($(this).css('pointer-events') != 'none') {
                        var cur_i = div.data('op_current_increment'),
                            multi = div.append('<div class="op-multirow cf" />').find('.op-multirow:last');
                        cur_i = (cur_i != 0) ? cur_i : div.find('.op-multirow').length;
                        cur_i++;
                        div.data('op_current_increment',cur_i);
                        remove_row =  field.multirow.remove_row || 'before';
                        if(remove_row == 'before'){
                            multi.append(remove_row_str);
                        }
                        for(var idx in field.multirow.attributes){
                            var v = field.multirow.attributes[idx],
                                mtype = v.type || '';
                            generate_field.apply(multi,[tmp_id2+'_'+cur_i+'_',idx,v,group,tag]);
                            if(typeof stored_selectors[tmp_id2+'_'+idx] != 'undefined'){
                                // var el = $('#'+tmp_id2+'_'+cur_i+'_'+idx+'_container').removeClass('loading-asset-dropdown');
                                var el = $('#'+tmp_id2+'_'+cur_i+'_'+idx+'_container');
                                el.find('a.selected-item').html(el.find('.op-asset-dropdown-list').html(stored_selectors[tmp_id2+'_'+idx]).find('a:first').html());
                            }
                            if(typeof v.default_value != 'undefined'){
                                switch(mtype){
                                    case 'style-selector':
                                    case 'image-selector':
                                        set_selector_value(tmp_id2+'_'+cur_i+'_'+idx+'_container',get_default_val(v));
                                        break;
                                    case 'wysiwyg':
                                        set_wysiwyg_content(tmp_id2+'_'+cur_i+'_'+idx,get_default_val(v));
                                        break;
                                    case 'paragraph':
                                        $('#'+tmp_id2+'_'+cur_i+'_'+idx).html(get_default_val(v));
                                        break;
                                    default:
                                        $('#'+tmp_id2+'_'+cur_i+'_'+idx).val(get_default_val(v));
                                        break;
                                }
                            }
                        };
                        if(remove_row == 'after'){
                            multi.append(remove_row_str);
                        }

                        // Argument true means that we're
                        // initializing showns
                        // for multirows
                        init_show_ons(true);

                        multirow_length_class(multi);
                        if(typeof field.multirow.onAdd == 'function'){

                            //Initialize tinymce editor for added fields
                            // if (op_stored_steps[group][tag][1]) {
                            //  $(op_stored_steps[group][tag][1]).find('.wp-editor-area').each(function () {
                            //      tinyMCE.execCommand("mceAddControl", true, $(this).attr('id'));
                            //      tinyMCE.execCommand("mceAddEditor", true, $(this).attr('id'));
                            //  });
                            // }

                            field.multirow.onAdd.apply(multi,[op_stored_steps[group][tag]]);
                        }
                    }
                    e.preventDefault();
                });
                $('.field-id-'+tmp_id2+'-multirow-container').on('click', 'a.remove-row', function(e){
                    e.preventDefault();
                    if ($(this).css('pointer-events') != 'none') {
                        var $parent = $(this).parent();
                        var $closestMultirow;
                        if ($parent.hasClass('pricing-table-row') || $parent.hasClass('op-feature-title-row')) {
                            multirow_length_class($parent);
                            $parent.remove();
                        } else {
                            $closestMultirow = $(this).closest('.op-multirow');
                            $closestMultirow.parent().next().find('a.new-row').focus();
                            multirow_length_class($closestMultirow);
                            $closestMultirow.remove();
                        }
                    }
                });
                for(var idx in field.multirow.attributes){
                    if(typeof field.multirow.attributes[idx].folder != 'undefined'){
                        var mtype = field.multirow.attributes[idx].type || '',
                            folder = field.multirow.attributes[idx].folder;
                        if(mtype == 'style-selector'){
                            add_folder('style',{fieldid:tmp_id2+'_'+idx,group:group,tag:tag,folder:folder},field.multirow.attributes[idx]);
                        } else if(mtype == 'image-selector'){
                            add_folder('image',{fieldid:tmp_id2+'_'+idx,group:group,tag:tag,folder:folder},field.multirow.attributes[idx]);
                        }
                    }
                };
            } else {
                var ul = div.append('<ul class="op-multirow-tabs cf" />').find('.op-multirow-tabs');
                $('#'+tmp_id).change(function(){
                    var v = parseInt($(this).val()),
                        el = div.find('.op-multirow'),
                        vis = ul.find('li:visible').length;
                    if(el.length < v){
                        ul.find('li').show().addClass('visible');
                        var multi,
                            prefix = field.multirow.link_prefix || '',
                            suffix = field.multirow.link_suffix || '';
                            prefix = prefix == '' ? '' : translate(prefix)+' ';
                            suffix = suffix == '' ? '' : ' '+translate(suffix);
                        for(var i=el.length;i<v;i++){
                            multi = div.append('<div class="op-multirow op-multirow-'+i+' cf" />').find('.op-multirow:last');
                            ul.append('<li class="visible"><a href="#'+i+'">'+prefix+(i+1)+'</a></li>');
                            for(var idx in field.multirow.attributes){
                                var mfield = field.multirow.attributes[idx],
                                    mtype = mfield.type || 'input';
                                generate_field.apply(multi,[tmp_id2+'_'+i+'_',idx,mfield,group,tag]);
                                if(typeof mfield.default_value != 'undefined'){
                                    switch(mtype){
                                        case 'style-selector':
                                        case 'image-selector':
                                            set_selector_value(tmp_id2+'_'+i+'_'+idx+'_container',get_default_val(mfield));
                                            break;
                                        case 'wysiwyg':
                                            set_wysiwyg_content(tmp_id2+'_'+i+'_'+idx,get_default_val(mfield));
                                            break;
                                        case 'paragraph':
                                            $('#'+tmp_id2+'_'+i+'_'+idx).html(get_default_val(mfield));
                                            break;
                                        default:
                                            $('#'+tmp_id2+'_'+i+'_'+idx).val(get_default_val(mfield));
                                            break;
                                    }
                                }
                            };
                            if(!show_ons_init){
                                init_show_ons();
                                show_ons_init = true;
                            }
                            if(typeof field.multirow.onAdd == 'function'){
                                field.multirow.onAdd.apply(div,[op_stored_steps[group][tag]]);
                            }
                        }
                    } else {
                        ul.find('li')
                            .filter(':gt('+(v-1)+')')
                                .hide().removeClass('visible')
                            .end()
                            .filter(':lt('+v+')')
                                .show().addClass('visible');
                        el.hide();
                    }
                    el = ul.find('li.visible.selected a');
                    if(el.length == 0){
                        el = ul.find('li.visible:first a');
                    }
                    el.trigger('click');
                }).trigger('change');
            }
        }

    };

    function get_default_val(def){
        if(typeof def.default_value != 'undefined'){
            if($.isFunction(def.default_value)){
                return def.default_value();
            } else {
                return def.default_value;
            }
        }
        return '';
    };

    function fetch_values(group, tag) {
        var attributes = op_stored_configs[group][tag].attributes,
            attrs = {},

            /**
             * Previous line was missing a comma up until 2.1.8.1
             * In case something along  idprefix or ignore lines starts causing errors, other code could be relying on this error.
             */
            idprefix = 'op_assets_' + group + '_' + tag + '_',
            ignore = ['h1','h2','h3','h4','h5','h6','p'],
            styleCheckboxTextModifier = 'text';

        /*
         * If attributes are undefined we return empty object
         */
        if (typeof attributes == 'undefined') {
            return attrs;
        }
        for (var i in attributes) {
            /*
             * Iterating through the attributes
             */
            for(var j in attributes[i]){
                var type = attributes[i][j].type || '';
                if (type == 'column') {
                    /*
                     * Iterating through column elements
                     */
                    for (var k in attributes[i][j].elements) {
                        var type = attributes[i][j].elements[k].type || '';
                        if (type == 'container') {
                            var panel = attributes[i][j].elements[k].showPanelControl || false;
                            /*
                             * We need to see if panel has ON/OFF switch and if it is in ON position
                             */
                            if ((panel == true && $('#panel_control_' + idprefix + k).is(':checked')) || panel == false) {
                                /*
                                 * Iterating through container attributes
                                 */
                                for (var l in attributes[i][j].elements[k].attributes) {
                                    var type = attributes[i][j].elements[k].attributes[l].type || '';
                                    if (type == 'text_properties') {
                                        attrs[l + '_text'] = get_value(idprefix+k+'_'+l + '_text',{});
                                        attrs[l + '_size'] = get_value(idprefix+k+'_'+l + '_size',{});
                                        attrs[l + '_color'] = get_value(idprefix+k+'_'+l + '_color',{});

                                        styleCheckboxTextModifier = (k === 'subtext_box') ? 'subtext' : 'text';
                                        attrs[l + '_bold'] = $('.field-id-' + idprefix+k+'_'+l + ' input[name="op_font[style_checkbox_' + styleCheckboxTextModifier + '][bold]"]').is(':checked') ? 'Y' : '';
                                        attrs[l + '_italic'] = $('.field-id-' + idprefix+k+'_'+l + ' input[name="op_font[style_checkbox_' + styleCheckboxTextModifier + '][italic]"]').is(':checked') ? 'Y' : '';
                                        attrs[l + '_underline'] = $('.field-id-' + idprefix+k+'_'+l + ' input[name="op_font[style_checkbox_' + styleCheckboxTextModifier + '][underline]"]').is(':checked') ? 'Y' : '';

                                        var font = $('#' + idprefix+k+'_'+l + '_container a.selected-item .op-font');
                                        if (font.length > 0) {
                                            attrs[l + '_font'] = font.attr('data-font') + ';' + font.attr('data-type');
                                        } else {
                                            attrs[l + '_font'] = '';
                                        }
                                    } else if (type != 'microcopy' && type != 'custom_html' && $.inArray(type,ignore) < 0){
                                        attrs[l] = get_value(idprefix+k+'_'+l,attributes[i][j].elements[k].attributes[l]);
                                    }
                                }
                                attrs[k + '_panel'] = 'Y';
                            } else {
                                attrs[k + '_panel'] = 'N';
                            }
                        } else if (type != 'microcopy' && type != 'custom_html' && $.inArray(type,ignore) < 0){
                            attrs[k] = get_value(idprefix+j,attributes[i][j].elements[k]);
                        }
                    }
                } else if (type == 'container') {
                    /*
                     * Iterating through container attributes
                     */
                    for (var k in attributes[i][j].attributes) {
                        var type = attributes[i][j].attributes[k].type || '';
                        if (type != 'microcopy' && type != 'custom_html' && $.inArray(type,ignore) < 0){
                            attrs[k] = get_value(idprefix+j+'_'+k,attributes[i][j].attributes[k]);
                        }
                    }
                } else if (type != 'microcopy' && type != 'custom_html' && $.inArray(type,ignore) < 0){
                    attrs[j] = get_value(idprefix+j,attributes[i][j]);
                }
            }
        };
        return attrs;
    };

    function insert_tag(group,tag){
        var ignore = ['h1','h2','h3','h4','h5','h6','p'];

        if (disable_insert) return false;

        if(typeof op_stored_configs[group][tag] != 'undefined'){
            var idprefix = 'op_assets_'+group+'_'+tag+'_';
            if(typeof op_stored_configs[group][tag].customInsert == 'function'){
                var attrs = fetch_values(group, tag);
                wpActiveEditor = wpActiveEditor || 'content';
                op_stored_configs[group][tag].customInsert(attrs);
            } else {
                var attr_str = '', content = '', close_tag = false;
                if(typeof op_stored_configs[group][tag].attributes != 'undefined'){
                    for(var j in op_stored_configs[group][tag].attributes){
                        for(var i in op_stored_configs[group][tag].attributes[j]){
                            var type = op_stored_configs[group][tag].attributes[j][i].type || '';
                            if(type != 'microcopy' && type != 'custom_html' && $.inArray(type,ignore) < 0){
                                var v = op_stored_configs[group][tag].attributes[j][i],
                                    val = get_value(idprefix+i,v), add = true;
                                if(typeof val == 'object'){
                                    for(var idx in val){
                                        attr_str += (attr_str==''?'':' ')+i+'_'+idx+'="'+ encodeURIComponent(val[idx])+'"';
                                    }
                                } else {
                                    if(!(typeof v.exclude != 'undefined' && v.exclude === true)){
                                        if(typeof v.showOn != 'undefined'){
                                            add = false;
                                            var showon_field = v.showOn.field.split('.'),
                                                showon_val = get_value(idprefix+showon_field[1],op_stored_configs[group][tag].attributes[showon_field[0]][showon_field[1]]);
                                            if(typeof v.showOn.value == 'object'){
                                                for(var idx in v.showOn.value){
                                                    if(showon_val == v.showOn.value[idx]){
                                                        add = true;
                                                        break;
                                                    }
                                                }
                                            } else {
                                                if(showon_val == v.showOn.value){
                                                    add = true;
                                                }
                                            }
                                        }
                                        if(add){
                                            if(i == 'content'){
                                                close_tag = true;
                                                if(val == ''){
                                                    val = ' ';
                                                }
                                                content = val;
                                            } else {
                                                if(val != ''){
                                                if(typeof v.attr != 'undefined'){
                                                    i = v.attr;
                                                }
                                                attr_str += (attr_str==''?'':' ')+i+'="'+encodeURIComponent(val)+'"';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        }
                    };
                }
                var str = '['+tag+(attr_str==''?'':' ')+attr_str+']';
                if(close_tag){
                    // We're fixing invalid html content to ensure live editor doesn't break
                    content = HTMLtoXML(content);
                    str += content+'[/'+tag+']';
                }
                str += '';
                wpActiveEditor = wpActiveEditor || 'content';
                insert_content(str);
                $.fancybox.close();
            }
        }

        return true;
    };

    function get_value(id,field){
        var type = field.type || 'input';
        if(typeof field.multirow != 'undefined'){
            el = $('.field-id-'+id+'-multirow-container');
            if(type == 'multirow'){
                var multirow = [];
                el.find('.op-multirow, .op-feature-title-row').each(function(){
                    var $t = $(this), row = {};
                    for(var idx in field.multirow.attributes){
                        var mtype = field.multirow.attributes[idx].type || '',
                            mid;
                        if(mtype == 'style-selector' || mtype == 'image-selector'){
                            mid = $t.find('div[id$="_'+idx+'_container"]').attr('id');
                            mid = mid.substring(0,(mid.length-10));
                        } else {
                            mid = $t.find(':input[id$="_'+idx+'"]').attr('id');
                        }
                        row[idx] = get_value(mid,field.multirow.attributes[idx]);
                    };
                    multirow.push(row);
                });
            } else {
                var multirow = {
                    total: get_value(id,{type:field.type}),
                    rows: []
                };
                for(var i=0;i<multirow.total;i++){
                    var row = {};
                    for(var idx in field.multirow.attributes){
                        row[idx] = get_value(id+'_'+i+'_'+idx,field.multirow.attributes[idx]);
                    };
                    multirow.rows.push(row);
                };
            }
            return multirow;
        } else if(type == 'tabs'){
            var tabs = {};
            for(var i in field.tabs){
                tabs[i] = {};
                for(var j in field.tabs[i].fields){
                    tabs[i][j] = {};
                    if (field.tabs[i].fields[j].type == 'column') {
                        /*
                         * Iterating through column elements
                         */
                        for (var k in field.tabs[i].fields[j].elements) {
                            var type = field.tabs[i].fields[j].elements[k].type || '';
                            if (type == 'container') {
                                var panel = field.tabs[i].fields[j].elements[k].showPanelControl || false;
                                /*
                                 * We need to see if panel has ON/OFF switch and if it is in ON position
                                 */
                                if ((panel == true && $('#panel_control_' + id + '_' + i + '_' + k).is(':checked')) || panel == false) {
                                    /*
                                     * Iterating through container attributes
                                     */
                                    for (var l in field.tabs[i].fields[j].elements[k].attributes) {
                                        var type = field.tabs[i].fields[j].elements[k].attributes[l].type || '';
                                        if (type == 'text_properties') {
                                            tabs[i][j][l + '_text'] = get_value(id+'_'+i+'_'+k+'_'+l + '_text',{});
                                            tabs[i][j][l + '_size'] = get_value(id+'_'+i+'_'+k+'_'+l + '_size',{});
                                            tabs[i][j][l + '_color'] = get_value(id+'_'+i+'_'+k+'_'+l + '_color',{});
                                            tabs[i][j][l + '_bold'] = $('.field-id-' + id+'_'+i+'_'+k+'_'+l + ' input[name="op_font[style_checkbox_text][bold]"]').is(':checked') ? 'Y' : '';
                                            tabs[i][j][l + '_italic'] = $('.field-id-' + id+'_'+i+'_'+k+'_'+l + ' input[name="op_font[style_checkbox_text][italic]"]').is(':checked') ? 'Y' : '';
                                            tabs[i][j][l + '_underline'] = $('.field-id-' + id+'_'+i+'_'+k+'_'+l + ' input[name="op_font[style_checkbox_text][underline]"]').is(':checked') ? 'Y' : '';

                                            // alt changed to op font -> tested and working well
                                            var font = $('#' + id+'_'+i+'_'+k+'_'+l + '_container a.selected-item .op-font');
                                            if (font.length > 0) {
                                                tabs[i][j][l + '_font'] = font.attr('data-font') + ';' + font.attr('data-type');
                                            } else {
                                                tabs[i][j][l + '_font'] = '';
                                            }
                                        } else if (type != 'microcopy' && type != 'custom_html'){
                                            tabs[i][j][l] = get_value(id+'_'+i+'_'+k+'_'+l,field.tabs[i].fields[j].elements[k].attributes[l]);
                                        }
                                    }
                                    tabs[i][j][k + '_panel'] = 'Y';
                                } else {
                                    tabs[i][j][k + '_panel'] = 'N';
                                }
                            } else if (type != 'microcopy' && type != 'custom_html'){
                                tabs[i][j][k] = get_value(id+'_'+j,field.tabs[i].fields[j].elements[k]);
                            }
                        }
                    } else {
                        tabs[i][j] = get_value(id+'_'+i+'_'+j,field.tabs[i].fields[j]);
                    }
                }
            }
            return tabs;
        } else {
            var val;
            switch(type){
                case 'slider':
                    val = $('#' + id).slider('value');
                    break;
                case 'text_properties':
                    break;
                case 'font':
                    var cont = $('.field-id-'+id);
                    var font_elems = {
                        'size': [ 'select:first', 'val'],
                        'font': ['.op-asset-dropdown a:first .op-font', 'attr', 'data-font'],
                        'style': ['select[name$="[style]"]', 'val'],
                        'color': ['.color-picker-container :input', 'val'],
                        'spacing': ['select[name$="[spacing]"]', 'val'],
                        'shadow': ['select[name$="[shadow]"]', 'val']};
                    val = {};
                    if(typeof field.size_text != 'undefined'){
                        font_elems.size[0] = ':input[name$="[size]"]';
                    }
                    for(var i in font_elems){
                        var tmp = $(font_elems[i][0],cont), tmpval = '';
                        if(tmp.length > 0){
                            if(typeof font_elems[i][2] != 'undefined'){
                                tmpval = tmp[font_elems[i][1]](font_elems[i][2]);
                            } else {
                                tmpval = tmp[font_elems[i][1]]();
                            }
                        }
                        if(tmpval != ''){
                            val[i] = tmpval;
                        }
                    };
                    break;
                case 'image-selector':
                case 'style-selector':
                    val = get_selector_value(id+'_container');
                    break;
                case 'checkbox':
                    val = $('#'+id).is(':checked') ? 'Y' : '';
                    break;
                case 'radio':
                    val = $('.field-id-'+id+' :radio:checked').val();
                    break;
                case 'textarea':
                    var format = field.format || 'op_unautop';
                    val = $('#'+id).val();
                    if (format === 'custom') {
                        val = val;
                    } else {
                        val = (format == 'br' ? nl2br(val) : op_wpautop(val));
                    }
                    //val = val.replace(/\n\r?/g, '<br />');
                    break;
                case 'wysiwyg':
                    val = get_wysiwyg_content(id);
                    break;
                case 'paragraph':
                    val = $('#'+id).html();
                    break;
                default:
                    val = $('#'+id).val();
                    break;
            }
            if(typeof field.showFields != 'undefined'){
                var show_fields = {
                    value: val,
                    fields: {}
                };
                for(var idx in field.showFields){
                    if(show_fields.value == idx){
                        show_fields.fields[idx] = get_value(id+'_'+idx,field.showFields[idx]);
                    }
                };
                return show_fields;
            } else {
                if (typeof val === 'string') {
                    val = HTMLtoXML(val);
                }
                return val;
            }
        }
    };

    // We want to insert the media into correct wp-editor, so we set it as active here
    // $('body').on('click', '.insert-media', function() {
    //     wpActiveEditor = $(this).data('editor');
    // });

    function add_wysiwyg(id, content){

        var wysiwyg_html;
        var wysiwyg_options;
        var qtags_options;
        var qtagsInstance;
        var currentEditor;

        if (use_wysiwyg) {

            // $('#op_dummy_wysiwyg') contains wysiwyg generated by wordpress;
            // we're storing it here so we can inject wysiwyg wherever we want via JavaScript
            if  (typeof OptimizePress.op_dummy_wysiwyg === 'undefined') {
                OptimizePress.op_dummy_wysiwyg = $('#op_dummy_wysiwyg').html();
            }

            // Replace dummy editor's id's with the actual ones
            wysiwyg_html = OptimizePress.op_dummy_wysiwyg.replace(/opassetswysiwyg/g, id);
            // wysiwyg_html = wysiwyg_html.replace(/html-active/g, 'tmce-active');
            // wysiwyg_html = wysiwyg_html.replace(/tmce-active/g, '');


            // When calling add_wysiwyg we need to make
            // sure to remove existent wp-editor-wrap,
            // to avoid tinymce nesting which
            // in turn causes a memory leak
            // (up to VER_2.5.10.2)
            this.append(wysiwyg_html);

            wysiwyg_options = $.extend(
                {},
                tinyMCEPreInit.mceInit.opassetswysiwyg,
                {
                    editor_selector: "cls-" + id,
                    selector : '#' + id,
                    wpautop: false,
                    height: 120,
                    init_instance_callback : function(editor) {
                        // console.log("Editor: " + editor.id + " is now initialized.", editor);
                        QTags._buttonsInit();
                        $('#wp-' + editor.id + '-wrap').removeClass('html-active').addClass('tmce-active');
                    },
                    setup: function (editor) {
                        // To ensure that fullscreen is properly sized
                        editor.on('FullscreenStateChanged', function (e) {
                            var wWidth;
                            var wHeight;
                            var $editorContainer;

                            try {
                                if (editor.plugins.fullscreen.isFullscreen()) {
                                    $editorContainer = $(editor.container);
                                    wWidth  = window.innerWidth;
                                    wHeight = window.innerHeight - $editorContainer.find('.mce-toolbar-grp').outerHeight() - $editorContainer.find('.mce-statusbar').outerHeight();
                                    editor.theme.resizeTo(null, wHeight);
                                }
                            } catch(e) {
                                console.error("Error in fullscreen plugin of TinyMCE", e);
                            }
                        });
                    }
                }
            );

            qtags_options = $.extend(
                tinyMCEPreInit.qtInit.opassetswysiwyg, { id: id }
            );

            try {
                quicktags(qtags_options);
            } catch(e) {
                console.error('Error initializing QTags.', e);
            }

            // qtagsInstance = QTags.getInstance(id);
            // if (typeof qtagsInstance === 'undefined') {
                // quicktags(qtags_options);
            // }

            // qtagsInstance = QTags.getInstance(id);
            // if (typeof qtagsInstance === 'undefined') {
            //     QTags._buttonsInit();
            // }

            if (typeof tinyMCE !== 'undefined') {
                tinyMCE.init(wysiwyg_options);
            }

        } else {

            this.append('<textarea cols="30" rows="10" id="'+id+'" name="'+id+'" />');
            qtagsInstance = QTags.getInstance(id);

            if (typeof qtagsInstance === 'undefined') {
                quicktags(id);
            }

            if (typeof qtagsInstance === 'undefined') {
                QTags._buttonsInit();
            }

        }
    };

    function add_font_settings(id, field) {
        var font_elems = {
            'size': '',
            'font': '.font-dropdown',
            'style': '',
            'spacing': '',
            'shadow': ''
        };
        var el;
        var str = '';
        var disable = field.disable || {};
        var i;

        for (i in font_elems) {
            if (typeof stored_elements[i] !== 'undefined') {
                continue;
            }
            el = $('#op_font'+i);
            if (font_elems[i] != '') {
                el = el.find(font_elems[i]);
            }
            stored_elements[i] = el.html();
        }

        if (typeof disable.size === 'undefined') {
            str += (typeof field.size_text != 'undefined' ? '<input type="text" name="' + id + '[size]" id="' + id + '_size" />px' : '<select name="' + id + '[size]" id="' + id + '_size">' + stored_elements['size'] + '</select>');
        }

        if (typeof disable.font === 'undefined') {
            str += _style_selector_html(id,stored_elements['font'], 'font-view');
        }

        if (typeof disable.style === 'undefined') {
            str += '<select name="'+id+'[style]" id="'+id+'_style">'+stored_elements['style']+'</select>';
        }

        if (typeof disable.color === 'undefined') {
            str += '<div class="color-picker-container cf">' +
            '<input type="text" value="" id="' + id + '_color" name="' + id + '[color]" /><a href="#" class="op-pick-color hide-if-no-js"></a>' +
            '</div>';
        }

        if (typeof disable.spacing === 'undefined') {
            str += '<select name="' + id + '[spacing]" id="' + id + '_spacing">' + stored_elements['spacing'] + '</select>';
        }

        if (typeof disable.shadow === 'undefined') {
            str += '<select name="' + id + '[shadow]" id="' + id + '_shadow">' + stored_elements['shadow'] + '</select>';
        }

        if (str != '') {
            str = '<div class="op-typeography font-chooser cf">' + str + '</div><a href="#reset-font" class="reset">' + translate('reset') + '</a>';
            return str;
        }

        return '';

    };

    function add_text_properties(id, field) {

        var elements = {
            'size': '',
            'font': '.font-dropdown',
            'style_checkbox_text': '',
            'style_checkbox_subtext': ''
        };
        var el;
        var str = '';

        if (id === 'op_assets_core_button_text_box_text_properties_1' ||
            id === 'op_assets_core_membership_order_button_text_box_text_properties_1' ||
            id === 'op_assets_core_membership_order_button_text_box_text_properties_1' ||
            id === 'op_assets_core_op_popup_text_box_text_properties_1' ||
            id === 'op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1' ||
            id === 'op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1') {
            var style_name = 'style_checkbox_text';
        } else {
            var style_name = 'style_checkbox_subtext';
        }

        for (var i in elements) {
            if (typeof stored_elements[i] != 'undefined') {
                continue;
            }
            el = $('#op_font'+i);
            if (elements[i] != '') {
                el = el.find(elements[i]);
            }
            stored_elements[i] = el.html();
        }

        /*
         * Text subelement
         */
        str += '<input type="text" name="'+id+'[text]" id="'+id+'_text" value="' + (typeof field.text_default != 'undefined' ? field.text_default : '') + '" />';

        /*
         * Size subelement
         */
        str += (typeof field.size_text != 'undefined' ? '<input type="text" name="'+id+'[size]" id="'+id+'_size" />px':'<select name="'+id+'[size]" id="'+id+'_size">'+stored_elements['size']+'</select>');

        /*
         * Font family subelement
         */
        str += _style_selector_html(id,stored_elements['font'],'font-view');

        /*
         * Color picker subelement
         */
        str += '<div class="color-picker-container cf"><input type="text" value="" id="'+id+'_color" name="'+id+'[color]" /><a href="#" class="op-pick-color hide-if-no-js"></a></div>';

        /*
         * Style subelement
         */
        str += '<div class="style-checkbox-selector cf">' + stored_elements[style_name] + '</div>';

        return str;
    }

    function value_fields(type,id,value,label,selected,single){
        var str = '';
        single = single || false;
        label = label || '';
        selected = selected || false;
        switch(type){
            case 'checkbox':
                str = '<input type="checkbox" name="'+id+(single?'" id="'+id+'"':'[]"')+' value="'+value+'"'+(selected?' checked="checked"':'')+' />';
                if(label != ''){
                    str = '<label>'+str+' '+label+'</label>';
                }
                break;
            case 'radio':
                str = '<input type="radio" name="'+id+'[]" value="'+value+'"'+(selected?' checked="checked"':'')+' />';
                if(label != ''){
                    str = '<label>'+str+' '+label+'</label>';
                }
                break;
            case 'select':
                str = '<option value="'+value+'"'+(selected?' selected="selected"':'')+'>'+label+'</option>';
                break;
            case 'membership_select':
                // value="789-658"
                if (value != '') {
                    var temp = value.split('-');
                    value = temp[1];
                    classStr = temp[0];
                } else {
                    classStr = '';
                    value = '';
                }
                str = '<option class="parent-' + classStr + '" value="'+value+'"'+(selected?' selected="selected"':'')+'>'+label+'</option>';
                break;
        }
        return str;
    };
    function input_values(id,field,type,group,tag){
        var str = '',
            def_val = get_default_val(field);
        if(typeof field.folder != 'undefined'){
            add_folder(type,{fieldid:id,group:group,tag:tag,folder:field.folder},field);
        } else if(typeof field.valueRange != 'undefined'){
            var end = (field.valueRange.finish+1),
                prefix = field.valueRange.text_prefix || '',
                suffix = field.valueRange.text_suffix || '';
            prefix = prefix == '' ? '' : translate(prefix)+' ';
            suffix = suffix == '' ? '' : ' '+translate(suffix);
            for(var i=field.valueRange.start;i<end;i++){
                str += value_fields(type,id,i,prefix+i+suffix,(def_val==i));
            }
        } else if(typeof field.values != 'undefined') {
            for(var value in field.values){
                str += value_fields(type,id,value,translate(field.values[value]),(def_val==value));
            };
        } else {
            str += value_fields(type,id,'Y','',(def_val=='Y'),true);
        }
        return str;
    };

    // Field attributes are written into the .data() of an element,
    // so we're counting how many multirows there are, to ensure
    // there's no overlap or overriding of properties
    var multirow_nr = 0;

    function init_show_ons(multirow) {

        // Setting default argument value
        multirow = typeof multirow  === 'undefined' ? false : multirow;

        for(var i in show_ons){
            var cont = container.find('.'+i),
                changes = [];
            for(var field in show_ons[i]){
                var fieldinfo = show_ons[i][field];
                if(fieldinfo.type == 'image-selector' || fieldinfo.type == 'style-selector' || fieldinfo.type == 'button_preview'){

                    // Multirows are hanndled differently. Data is
                    // written into show_on_values_multirow_X
                    if (!multirow) {
                        $('#'+field+'_container').data({'show_on_values':fieldinfo.values});
                        $('#'+field+'_container').on('click', '.op-asset-dropdown-list a', function(e){
                            e.preventDefault();
                            show_hide_fields.apply(cont,[$(this).find('img').attr('alt'),$(this).closest('.op-asset-dropdown').data('show_on_values')]);
                        });
                    } else {
                        var tempObj = {};
                        tempObj['show_on_values_multirow_' + multirow_nr] = fieldinfo.values;
                        $('#'+field+'_container').data(tempObj);

                        // We need a closure here to ensure that we
                        // get correct multirow number when click
                        // even is actually executed
                        (function(nr) {
                            $('#'+field+'_container').on('click', '.op-asset-dropdown-list a', function(e){
                                e.preventDefault();
                                show_hide_fields.apply(cont,[$(this).find('img').attr('alt'),$(this).closest('.op-asset-dropdown').data('show_on_values_multirow_' + nr)]);
                            });
                        })(multirow_nr);
                        multirow_nr += 1;
                    }
                } else {
                    changes.push('#'+field);
                    cont.find('#'+field).data({
                        'show_on_values': fieldinfo.values
                    }).change(function(){
                        show_hide_fields.apply(cont,[$(this).val(),$(this).data('show_on_values')]);
                    }).trigger('change');
                }
            };
        };

        show_ons = {};
    };

    function show_hide_fields(val,values){
        var $t = this,
            show = '',
            hidden = {},
            allValues = [],
            tempValues,
            tempDisplayTypes,
            value,
            valuesToShow,
            displayTypesToShow,
            i = 0;

        for (value in values) {
            tempValues = [];
            tempDisplayTypes = [];

            for (i = 0; i < values[value].length; i += 1) {
                tempValues.push(values[value][i].selector);
                tempDisplayTypes.push(values[value][i].displayType);
            }

            allValues.push(tempValues);

            //var fields = values[value].join(',');
            var fields = tempValues.join(',');

            if (value == val) {
                show = fields;
                valuesToShow = tempValues;
                displayTypesToShow = tempDisplayTypes;
            } else {
                if (typeof hidden[fields] == 'undefined') {
                    hidden[fields] = true;
                    $t.find(fields).css('display','none');
                }
            }
        }

        if (show != '') {
            $(show).css('display','block').find(':input').trigger('change');
            for (i = 0; i < valuesToShow.length; i += 1) {
                //$(tempValues[i]).css('display','block').find(':input').trigger('change');
                $(valuesToShow[i]).css('display',displayTypesToShow[i]).find(':input').trigger('change');
            }
        }

    }

    function add_showon(group,tag,id,showOn,idprefix){
        var key = 'op-settings-'+group+'-'+tag,
            field = showOn.field.split('.'),
            fieldid = field[field.length-1];
        fieldid = (typeof showOn.idprefix != 'undefined') ? showOn.idprefix+fieldid : idprefix+fieldid;
        if(typeof show_ons[key] == 'undefined'){
            show_ons[key] = {};
        }
        if(typeof show_ons[key][fieldid] == 'undefined'){
            show_ons[key][fieldid] = {
                values:{}
            };
            var el = op_stored_configs[group][tag].attributes;

            for(var i=0,il=field.length;i<il;i++){
                el = el[field[i]];
            };
            show_ons[key][fieldid].type = (typeof showOn.type != 'undefined' ? showOn.type : el.type || 'input');
        }
        if(typeof show_ons[key][fieldid].values[showOn.value] == 'undefined'){
            show_ons[key][fieldid].values[showOn.value] = [];
        }

        show_ons[key][fieldid].values[showOn.value].push({
            selector: '.field-id-'+idprefix+id,
            displayType: showOn['displayType'] || 'block'
        });
    };

    function add_folder(type,folder,field){
        if(typeof field.asset != 'undefined'){
            folder.group = field.asset[0];
            folder.tag = field.asset[1];
        }
        if(typeof field.ignore_vals != 'undefined'){
            folder.ignore_vals = field.ignore_vals;
        }
        if(typeof folders[type] == 'undefined'){
            folders[type] = [];
        }
        folders[type].push(folder);
    };

    function _preset_selector_html(id,html,addclass){
        var html = html || '';
        return '<div class="op-asset-dropdown-list">' + html + '</div>';
    };

    function _style_selector_html(id,html,addclass){
        var html = html || '';
        if(addclass != ''){
            selector_classes[addclass] = true;
        }
        return '<div class="op-asset-dropdown'+(html==''?' loading-asset-dropdown':'')+' '+addclass+'" id="'+id+'_container"><a class="selected-item" href="#"></a><div class="op-asset-dropdown-list">'+html+'</div></div>';
    };

    var color_pickers_initialized = false;
    function init_color_pickers(){
        if($('#op-color-picker').length == 0){
            $('body').append('<div id="op-color-picker" />');
        }
        picker = $('#op-color-picker');
        farbtastic = $.farbtastic('#op-color-picker',pick_color);
        container.on('focus', '.color-picker-container :input', function(){
            $cp_link = (typeof($(this).data('cp_link'))=='undefined' ? $(this).siblings('a.op-pick-color') : $(this).data('cp_link'));
            $(this).data('cp_link', $cp_link);
            $cp_link.trigger('click');
        }).on('blur', '.color-picker-container :input', function(){
            var $t = $(this),
                c = get_color($t.val());
            c = (c === '#') ? '' : c;
            if (current_picker && current_picker[1]) {
                pick_color(c);
            }
            picker.hide();
        }).on('change', '.color-picker-container :input', function(){
            var $t = $(this),
                c = get_color($t.val());
            $cp_link = (typeof($t.data('cp_link'))=='undefined' ? $(this).siblings('a.op-pick-color') : $t.data('cp_link'));
            $(this).data('cp_link', $cp_link);
            $cp_link.css('background-color',(c == '#' ? 'transparent' : c));
            if(picker.is(':visible') && c != '#'){
                farbtastic.setColor(c);
            }
        });
        container.on('click', 'a.op-pick-color', function(e){
            $input = (typeof($(this).data('input'))=='undefined' ? $(this).prev('input') : $(this).data('input'));
            $(this).data('input', $input);
            current_picker = [$(this),$input];
            pick_color(current_picker[1].val());
            picker.position({
                of: current_picker[0],
                my: "left top",
                at: "left bottom"
            }).show();
            e.preventDefault();
        });
    };
    function insert_content(str){
        var brStr = '';

        if (typeof op_le_insert_content !== 'undefined') {

            op_le_insert_content(str);

        } else {

            if (tinymce && tinymce.opActiveEditor) {
                tinymce.opActiveEditor.editElement = false;

                if (typeof tinymce.opActiveEditor.activeElement !== 'undefined') {
                    tinymce.opActiveEditor.selection.moveToBookmark(tinymce.opActiveEditor.activeElement);
                    delete tinymce.opActiveEditor.activeElement;
                }

                // If element is jsut edited, we don't want to add any newlines
                if (tinymce.opActiveEditor.editElement !== true) {
                    brStr = '<br />';
                } else {
                    brStr = '';
                }
            }

            send_to_editor(str + brStr);
        }
    };

    function set_settings(settings,steps,config){
        if(typeof config.customSettings == 'function'){
            config.customSettings(settings,steps);
        } else {
            var idprefix = 'op_assets_'+settings.asset[0]+'_'+settings.asset[1]+'_',
                attrs = settings.attrs || {};
            for(var i=1;i<4;i++){
                if(typeof config.attributes['step_'+i] != 'undefined'){
                    for(var j in config.attributes['step_'+i]){
                        var field = config.attributes['step_'+i][j],
                            type = field.type || 'input',
                            val = attrs[j] || '';

                        // javascript element's content should not be decoded here (since it's not encoded to begin with)
                        if (settings.tag !== 'javascript') {
                            val = op_decodeURIComponent(val);
                        }

                        switch(type){
                            case 'multirow':
                                val = settings[j] || '';
                                if(typeof val == 'object'){
                                    var add_link = steps[i-1].find('.field-id-'+idprefix+j+' a.new-row'),
                                        element_container = steps[i-1].find('.field-id-'+idprefix+j+'-multirow-container'),
                                        cur_element;
                                    for(var k=0,kl = val.length;k<kl;k++){
                                        add_link.trigger('click');
                                        cur_element = element_container.find('> .op-multirow:last');
                                        $.each(field.multirow.attributes,function(idx,v){
                                            var tmp_val = val[k].attrs[idx] || '';
                                            if((v.type || 'input') == 'textarea'){
                                                tmp_val = op_unautop(tmp_val);
                                            }

                                            tmp_val = op_decodeURIComponent(tmp_val);

                                            cur_element.find(':input[name$="'+idx+'"]').val(tmp_val);
                                        });
                                    }
                                }
                                break;
                            case 'style-selector':
                            case 'image-selector':
                                set_selector_value(idprefix+j+'_container',val);
                                //var  el = steps[i-1].find('.op-asset-dropdown-list img'+(val==''?':first':'[alt="'+val+'"]')).parent().trigger('click');
                                break;
                            case 'checkbox':
                                $('#'+idprefix+j).attr('checked',(val=='Y')).trigger('change');
                                break;
                            case 'radio':
                                $('.field-id-'+idprefix+j+' :radio[value="'+val+'"]').attr('checked',true).trigger('change');
                                break;
                            case 'font':
                                set_font_settings(j,attrs,idprefix+j)
                                break;
                            case 'wysiwyg':
                                set_wysiwyg_content(idprefix+j,val);
                                break;
                            case 'textarea':
                                var format = field.format || 'op_unautop';
                                if (format === 'custom') {
                                    $('#'+idprefix+j).val((val));
                                } else {
                                    $('#'+idprefix+j).val((format == 'br' ? br2nl((val)) : op_unautop((val))));
                                }
                                break;
                            case 'media':
                                set_uploader_value(idprefix+j,(val));
                                break;
                            case 'paragraph':
                                if (typeof val == 'string' && val != '') {
                                    $('#'+idprefix+j).html((val)).trigger('change');
                                }
                                break;
                            default:
                                $('#'+idprefix+j).val((val)).trigger('change');
                                break;
                        };
                    };
                }
            };
        }
    };

    function edit_element(settings){

        var settingsAsset = settings.asset;

        container.addClass('edit-mode');
        disable_slide = true;
        disable_insert = true;

        if(typeof op_assets[settingsAsset[0]] != 'undefined' && typeof op_assets[settingsAsset[0]][settingsAsset[1]] != 'undefined'){
            set_titles(slides[1].find('a[href$="#'+settingsAsset[0]+'/'+settingsAsset[1]+'"]'));
            container.find('.op_asset_browser_slide .settings-container').css('display','none');
            load_config(settingsAsset, function(steps, config){
                set_settings(settings,steps,config);
                disable_insert = false;
                disable_slide = false;
                if(typeof config.default_slide != 'undefined'){
                    if($.isFunction(config.default_slide)){
                        show_slide(config.default_slide(steps));
                    } else {
                        show_slide(config.default_slide);
                    }
                } else if(typeof steps[1] != 'undefined'){
                    show_slide(3, false);
                } else {
                    show_slide(2, false);
                }
            });
        }
    }

    function init_color_picker(form){
        $('.color-picker-container :input',form).each(function(){
            var atag = $(this).siblings('a.op-pick-color');
            atag.data('input',$(this));
            $(this).data('cp_link',atag).data('cp_link').css('background-color',get_color($(this).val()));
        });
    }

    function pick_color(color){
        farbtastic.setColor(color);
        current_picker[1].val(color);
        current_picker[0].css('background-color',color);
        $('#op_asset_browser_slide3 .op-settings-' + current_asset[0] + '-' + current_asset[1]).trigger({type: 'update_button_preview', id: current_picker[1].attr('id'), value: color, tag: current_asset[1]});
    }

    function get_color(val){
        return '#'+val.replace(/[^a-fA-F0-9]/, '');
    }


    function translate(s){
        if (!s || typeof s !== 'string') {
            return '';
        }
        return op_assets_lang[s] || s.replace(/{\#([^}]+)\}/g, function(a, b) {
            return op_assets_lang[b] || '{#' + b + '}';
        });
    }

    function get_wysiwyg_content(id){
        var content = '';
        if(use_wysiwyg){
            var ed = tinyMCE.get(id);
            if((ed && ed.isHidden()) || !ed){
                content = op_wpautop($('#'+id).val());
            } else {
                content = ed.getContent();
            }
        } else {
            content = $('#'+id).val();
        }
        if(wp_post){
            content = op_wpautop(content);
        } else {
            content = op_unautop(content);
        }
        return content;
    }

    function set_wysiwyg_content(id,content){

        var ed;

        content = content || '';

        if (use_wysiwyg) {
            ed = tinyMCE.get(id);
            if (ed) {
                // If editor is initialized, we set
                // the content, but in case it is
                // not yet initialized, we set
                // event to monitor when it
                // will be initiailzed and
                // set the content then
                if (ed.initialized) {
                    ed.setContent(op_wpautop(content), { no_events: true });
                } else {
                    if (tinyMCE.majorVersion < 4) {
                        ed.onInit.add(function(){
                            ed.setContent(op_wpautop(content), { no_events: true });
                        });
                    } else {
                        ed.on('init', function(e) {
                            ed.setContent(op_wpautop(content), { no_events: true });
                        });
                    }
                }
            }
        }

        if (!use_wysiwyg || !ed) {
            $('#' + id).val(op_unautop(content));
        }

    }

    $.fn.get_hash = function(){
        return $.get_hash(this.attr('href'));
    }

    $.get_hash = function(el){
        el = el.split('#');
        return el[1];
    }

    $.object_length = function(obj){
        var c = 0;
        for(var i in obj){
            c++;
        };
        return c;
    }

    function set_selector_value(id, value) {
        /*
         * We don't want preview element to be prefilled with first item...
         */
        if (id == 'op_assets_core_button_button_preview_container' ||
            id == 'op_assets_core_membership_order_button_button_preview_container' ||
            id == 'op_assets_core_optin_box_tabs_submit_button_button_preview_container' ||
            id == 'op_assets_core_optin_modal_tabs_submit_button_button_preview_container' ||
            id == 'op_assets_core_op_popup_button_preview_container') {
            return;
        }
        value = typeof value !== 'undefined' ? value : '';

        var $el = $('#' + id);
        var op_disable_selected = $el.parent().hasClass('op-disable-selected');
        var show = $el.data('show_on_values');
        var temp_html;
        var selector = 'img';
        var dataAttr = 'alt';
        var childSelector;

        if (id.indexOf('_font_container') > -1) {
            selector = '.op-font';
            dataAttr = 'data-font';
        }

        childSelector = selector + '[' + dataAttr + '="' + value + '"]';

        if (value == '') {
            if (op_disable_selected) {
                $el.find('.selected').removeClass('selected');
                value = null;
            } else {
                temp_html = $('#' + id + ' .op-asset-dropdown-list a:first').html();
                value = $('#' + id + ' a.selected-item').html(temp_html).find(selector).attr(dataAttr);
            }
        } else {
            if (op_disable_selected) {
                $el.find('.selected').removeClass('selected').end().find(childSelector).parent().trigger('click');
            } else {
                temp_html = $el.find(childSelector).parent().html();
                $el.find('a.selected-item').html(temp_html);
            }
        }

        if (typeof show !=+ 'undefined' && value !== null) {
            show_hide_fields.apply($el.closest('.op_asset_browser_slide'), [value, show]);
        }
    }

    function get_selector_value(id) {
        var el = $('#' + id);
        if (el.closest('.field-row').hasClass('op-disable-selected')) {
            el = el.find('.selected img');
        } else {
            el = el.find('.selected-item img');
        }
        return el.attr('alt');
    }

    /*
    * Function: set_color_value
    * Description: Sets the input elements for a color selector
    * Parameters:
    *   id: ID of the color element (the HTML element is the textbox containing the color code)
    *   value: Value to be inserted into element
    */
    function set_color_value(id, value){
        //Set textbox and then the background color of the preview next to it
        $('#' + id).val(value).next('a.op-pick-color').css({ backgroundColor: value });
    };

    function set_font_settings(fieldname,values,fieldid){
        var chks = ['size','font','style','color','spacing','shadow'];
        $.each(chks,function(i,v){
            var varname = fieldname+'_'+v,
                val = values[varname] || '';

            // Decode font settings if possible
            val = op_decodeURIComponent(val);

            if(v == 'font'){
                set_selector_value(fieldid+'_container',val);
            } else {
                $('#'+fieldid+'_'+v).val(val).trigger('change');
            }
        });
    };

    /*
    * Function: set_select_value
    * Description: Sets the value for a select element
    * Parameters:
    *   id: ID of the select element
    *   value: value to be selected by default
    */
    function set_select_value(id, value){
        //If we are not passed a jQuery object, create one from the passed ID string
        if (typeof(id)=='string') id = $('#' + id);

        //Loop through all the option elements inside the select and set selected if the value desired is found
        id.find('option').each(function(){
            if ($(this).val()==value) $(this).attr('selected', 'selected');
        });
    };

    function set_uploader_value(id,value,callback){
        callback = callback === false ? false : true;
        var el = $('#'+id),
            content = el.next().find('.content');
        if(typeof value == 'undefined' || value == ''){
            content.html('');
            el.val('');
            if(callback){
                el.trigger('change');
            }
            return;
        }
        var ext = value.match(/\.([^.]+)$/);
        el.val(value);
        if(callback){
            el.trigger('change');
        }
        ext = ext === null ? false : ext[1];
        if($.inArray(ext,['jpg','jpeg','gif','png']) > -1){
            content.html('<a href="'+value+'" target="_blank" class="preview-image"><img src="'+value+'" alt="uploaded-image" /></a><a href="#remove" class="remove-file">'+translate('remove_image')+'</a>');
        } else {
            content.html('<a href="'+value+'" target="_blank" class="preview-image">'+translate('view_file')+'</a><a href="#remove" class="remove-file">'+translate('remove_file')+'</a>');
        }
    };

    function get_column_width(default_val){
        default_val = default_val || '';
        if(typeof op_le_column_width != 'undefined'){
            return op_le_column_width();
        }
        return default_val;
    };

    function disable_asset_wysiwygs() {
        if(!use_wysiwyg || wysiwygs_checked === true){
            return;
        }

        this.content.find('.wp-editor-area').each(function(i){
            var id = $(this).attr('id');
            var ed = tinyMCE.get(id);

            if (ed) {
                ed.remove();
            }
        });
    };


    // OptimizePress.fancyboxBeforeCloseAnimation = function (that) {
    //     var $fancyboxOverlay = $('.fancybox-overlay');
    //     var $fancyboxParent = $(that.content).parentsUntil('.fancybox-wrap').parent();

    //     $fancyboxOverlay.addClass('op-transform-fast');
    //     $fancyboxParent.addClass('op-transform-fast');

    //     setTimeout(function (){
    //         $fancyboxParent.css({ transform: 'translate3d(0,0,0) scale(0)' });
    //         $fancyboxOverlay.addClass('op-opacity-zero');
    //     }, 100);
    // }

    // OptimizePress.fancyboxBeforeShowAnimation = function (that) {
    //     var $fancyboxOverlay = $('.fancybox-overlay');
    //     var $fancyboxParent = $(that.content).parentsUntil('.fancybox-wrap').parent();

    //     $fancyboxOverlay.removeClass('op-transform-1 op-transform-1-end').addClass('op-transform-1-start');
    //     $fancyboxParent.removeClass('op-transform op-transform-end').addClass('op-transform-start');

    //     setTimeout(function (){
    //         $fancyboxOverlay.addClass('op-transform-1 op-transform-1-end');
    //         $fancyboxParent.addClass('op-transform op-transform-end');
    //     }, 100);
    // }


    OptimizePress.epicboxBeforeCloseAnimation = function ($epicboxOverlay, $epicboxContent) {
        if ($epicboxOverlay) {
            $epicboxOverlay.addClass('op-transform-fast');
        }
        $epicboxContent.addClass('op-transform-fast');

        setTimeout(function (){
            $epicboxContent.addClass('op-transform-scale0');
            if ($epicboxOverlay) {
                $epicboxOverlay.addClass('op-opacity-zero');
            }
            setTimeout(function () {
                $epicboxContent.removeClass('op-transform-scale0 op-transform-start op-transform op-transform-end op-transform-fast').css({ display: 'none' });
                $epicboxOverlay.removeClass('op-opacity-zero').css({ display: 'none' });
                $('html').removeClass('epicbox-lock epicbox-margin');
            }, 200);
        }, 100);
    }


    OptimizePress.epicboxBeforeShowAnimation = function ($epicboxOverlay, $epicboxContent) {
        if ($epicboxOverlay) {
            $epicboxOverlay.css({ display: 'block' }).removeClass('op-transform-1 op-transform-1-end').addClass('op-transform-1-start');
        }

        $epicboxContent.css({ display: 'block' }).removeClass('op-hidden op-transform op-transform-end').addClass('op-transform-start');

        setTimeout(function (){
            if ($epicboxOverlay) {
                $epicboxOverlay.addClass('op-transform-1 op-transform-1-end');
            }

            $epicboxContent.addClass('op-transform op-transform-end');
        }, 100);

        setTimeout(function () {
            $epicboxContent.removeClass('op-transform');
        }, 300);
    }

    function open_asset_dialog(slide){

        var $assetBrowserSlider = $('#op_asset_browser_slider');

        slide = slide === 0 ? 0 : 1;

        $.fancybox.open({
            type: 'inline',
            scrolling: 'no',
            autoSize: false,
            fitToView: false,

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
                },
            },
            opLocked: true,
            keys: false,
            margin: 0,
            padding: 0,
            width: 760,
            height: 500,
            minHeight: 500,
            maxHeight: 500,
            href: '#op_asset_browser_container',

            beforeClose: function () {
                // $.fancybox.close() is called multiple times sometimes, which breaks the closing animation,
                // that the closing animaiton is not in progress before continuing
                if (isFancyboxClosing) {
                    return false;
                }
                OptimizePress.fancyboxBeforeCloseAnimation(this);
                isFancyboxClosing = true;
                disable_asset_wysiwygs.apply(this);
            },

            // beforeLoad: function () {
                // $('#op_asset_browser_container').css({ position: 'fixed', top: 0, height: '100%', bottom: 0 });
                // $fancyBoxOpened = $(this.content).addClass('transformMe').css({ opacity: 0 });
                // $fancyBoxOpened.css('opacity', 0);
            // },

            beforeShow: function(){
                resize_content_areas();
                show_slide(slide,false);
                OptimizePress.fancyboxBeforeShowAnimation(this);
                // This is a fix for rendering bug that appears in Chrome when you click edit element (a video element for example)
                $assetBrowserSlider.css({ display: 'none' });

                $(window.parent.document).find('.fancybox-close').css({ display: 'none' });
            },

            afterShow: function () {

                // This is a fix for rendering bug that appears in Chrome when you click edit element (a video element for example)
                $assetBrowserSlider.css({ display: 'block' });

                //Get the last opened fancybox (in case there's more of them)
                $fancyBoxOpened = $('.fancybox-opened').eq(-1);
                $fancyBoxIframe = $fancyBoxOpened.find('iframe');
                if ($fancyBoxIframe.length > 0) {
                    $fancyBoxIframe.focus();
                } else {
                    $assetBrowserContainer = $fancyBoxOpened.find('#op_asset_browser_container');
                    if ($assetBrowserContainer.length > 0) {
                        $fancyBoxOpened.find('.op_asset_browser_slide').eq(slide)
                            .addClass('op_asset_browser_slide_active')
                            .find('.op_asset_content')
                                .addClass('op_no_outline')
                                .attr('tabindex', 0)
                                .focus();
                        focusLastSelectedItem();
                    } else {
                        $fancyBoxOpened.find('.fancybox-inner')
                            .addClass('op_no_outline')
                            .attr('tabindex', 0)
                            .focus();
                    }
                }
            },

            afterClose: function(){

                isFancyboxClosing = false;
                // disable_asset_wysiwygs.apply(this);

                wysiwygs_checked = false;
                show_slide(1);
                //container.find('.multirow-container:not(.field-type-tabs)').find('.op-multirow-tabs li').remove().end().find('.op-multirow').remove();

                var multirow = container.find('.multirow-container:not(.field-type-tabs)').find('.op-multirow-tabs li').remove().end().find('.op-multirow')
                multirow_length_class(multirow);
                multirow.remove();

                // Since fancybox is closed, no slide or element list item is active anymore
                $('#op_asset_browser_slider .op_asset_browser_slide_active').removeClass('op_asset_browser_slide_active');
                $('#op_asset_browser_slider').find('.op-last-selected-asset-list-item').removeClass('op-last-selected-asset-list-item');

                // Select first tab if applicable. Last selected tab was opened on edit otherwise and its fields appended to the fields of the first tab.
                $('#op_asset_browser_container .op-multirow-tabs li a').first().trigger('click');

                // This is necessary in order to hide the parent fancybox scrollbars and close button
                // $('html').css({
                //     overflow: 'auto',
                //     height: 'auto'
                // });
                $(window.parent.document).find('.fancybox-close').css({ display: 'block' });

                if (typeof tinymce !== "undefined" && typeof tinymce.opActiveEditor !== "undefined" && typeof tinymce.opActiveEditor.activeElement !== 'undefined') {
                    delete tinymce.opActiveEditor.activeElement;
                }
            }
        });
    };

    function nl2br(str){
        str = str.replace(/(\r\n|\n)/g,'<br />');
        return str;
    };
    function br2nl(str){
        str = str.replace(/<br\s*\/?>/g,"\n",str);
        return str;
    };


    function set_help_videos(group,tag){
        var vids = help_vids[group][tag],
            tmp,
            el;
        for(i=0;i<3;i++){
            tmp = vids[i];
            el = slide_content[i+2].find('.help-vid-link');
            if(tmp != ''){
                el.html(tmp);
            } else {
                el.html(help_vids.defaults[i]);
            }
        };
    };

    function generate_video_link(vid){
        return '<a href="'+ vid.url + '" tabindex="-1" class="help-me" title="' + translate('help_video') + '" data-width="' + vid.width + '" data-height="' + vid.height + '"><span>?</span></a>';
    };

    function init_help_videos() {
        selector_classes['help-video'] = true;
        container.on('click', 'a.help-me', function(e){
            var $this = $(this);
            var width = parseInt($this.attr('data-width'), 10);
            var height = parseInt($this.attr('data-height'), 10);
            var content = '';

            e.preventDefault();

            for(var i in selector_classes){
                panda_content.removeClass(i);
            }

            panda_content.addClass('help-video');
            content += '<div style="width:' + width + 'px; height:' + height + 'px; margin:0 auto;">';
                content += '<video autoplay controls width="' + width + '" height="' + height + '" src="' + $this.attr('href') + '"></video>';
            content += '</div>';
            panda_content.html(content);

            open_pandabox();
        });
    };

    /*
     * Replaces some characters to HTML entities
     */
    function encode_html(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.OP_AB = {
        autop: op_wpautop,
        br2nl: br2nl,
        column_width: get_column_width,
        edit_element: edit_element,
        reset_form: reset_form,
        insert_content: insert_content,
        get_selector_value: get_selector_value,
        nl2br: nl2br,
        open_dialog: open_asset_dialog,
        resize_content_areas: resize_content_areas,
        set_font_settings: set_font_settings,
        set_selector_value: set_selector_value,
        set_color_value: set_color_value,
        set_wysiwyg_content: set_wysiwyg_content,
        set_uploader_value: set_uploader_value,
        show_slide: show_slide,
        get_active_slide: get_active_slide,
        encode_html: encode_html,
        trigger_insert: function(){
            insert_tag(current_asset[0],current_asset[1]);
        },
        translate: translate,
        unautop: op_unautop,
        wysiwyg_content: get_wysiwyg_content
    };

    $.expr[':'].icontains = function(obj,index,meta,stack){
        return (obj.textContent || obj.innerText || $(obj).text() || '').toLowerCase.indexOf(meta[3].toLowerCase()) >= 0;
    };

    $(document).on('update_button_preview', '.op-settings-core-op_popup', function(e) {
        op_custom_popup.update(e);
        return false;
    });

    $(document).on('update_button_preview', '.op-settings-core-button', function(e) {
        op_custom_button.update(e);
        return false;
    });
    $(document).on('update_button_preview', '.op-settings-core-membership_order_button', function(e) {
        op_custom_membership_button.update(e);
        return false;
    });
    $(document).on('update_button_preview', '.op-settings-core-optin_box', function(e) {
        op_custom_optin_button.update(e);
        return false;
    });
    $(document).on('update_button_preview', '.op-settings-core-optin_modal', function(e) {
        op_custom_optin_button.update(e);
        return false;
    });
}(opjq));
;
/*!
 * HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */

(function(){

    // Regular Expressions for parsing tags and attributes
    var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
        endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
        attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

    // Empty Elements - HTML 4.01
    var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

    // Block Elements - HTML 4.01
    var block = makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

    // Inline Elements - HTML 4.01
    var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

    // Attributes that have their values filled in disabled="disabled"
    var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

    // Special Elements (can contain anything)
    var special = makeMap("script,style");

    var HTMLParser = this.HTMLParser = function( html, handler ) {
        var index, chars, match, stack = [], last = html;
        stack.last = function(){
            return this[ this.length - 1 ];
        };

        while ( html ) {
            chars = true;

            // Make sure we're not in a script or style element
            if ( !stack.last() || !special[ stack.last() ] ) {

                // Comment
                if ( html.indexOf("<!--") == 0 ) {
                    index = html.indexOf("-->");

                    if ( index >= 0 ) {
                        if ( handler.comment )
                            handler.comment( html.substring( 4, index ) );
                        html = html.substring( index + 3 );
                        chars = false;
                    }

                // php tags
                } else if ( html.indexOf("<?php") == 0 ) {
                    index = html.indexOf("?>");

                    if ( index >= 0 ) {
                        if ( handler.php )
                            handler.php( html.substring( 5, index ) );
                        html = html.substring( index + 2 );
                        chars = false;
                    }

                // end tag
                } else if ( html.indexOf("</") == 0 ) {
                    match = html.match( endTag );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( endTag, parseEndTag );
                        chars = false;
                    }

                // not a start tag, because < is stands alone
                } else if ( html.search(/<($|\s)/i) > -1) {

                    handler.chars( html );
                    html = '';

                // start tag
                } else if ( html.indexOf("<") == 0) {
                    match = html.match( startTag );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( startTag, parseStartTag );
                        chars = false;
                    }
                }

                if ( chars ) {
                    index = html.indexOf("<");

                    var text = index < 0 ? html : html.substring( 0, index );
                    html = index < 0 ? "" : html.substring( index );

                    if ( handler.chars )
                        handler.chars( text );
                }

            } else {

                // regex updated to include newlines (otherwise validation breaks if user inputs script that has more than one line)
                html = html.replace(new RegExp("([.|\\w|\\W]*)<\/" + stack.last() + "[^>]*>", 'im'), function(all, text){
                    text = text.replace(/<!--(.*?)-->/g, "$1")
                        .replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

                    if ( handler.chars )
                        handler.chars( text );

                    return "";
                });

                parseEndTag( "", stack.last() );
            }

            if ( html == last ) {
                alert("Sorry, it seems that you've entered malformed HTML.\n\nPlease verify that the code you entered is valid and try again.\n\nEnsure you are only using HTML form code and do not use javascript as it is not supported in this field.");
                throw "Parse Error: " + html;
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();

        function parseStartTag( tag, tagName, rest, unary ) {
            tagName = tagName.toLowerCase();

            if ( block[ tagName ] ) {
                while ( stack.last() && inline[ stack.last() ] ) {
                    parseEndTag( "", stack.last() );
                }
            }

            if ( closeSelf[ tagName ] && stack.last() == tagName ) {
                parseEndTag( "", tagName );
            }

            unary = empty[ tagName ] || !!unary;

            if ( !unary )
                stack.push( tagName );

            if ( handler.start ) {
                var attrs = [];

                rest.replace(attr, function(match, name) {
                    var value = arguments[2] ? arguments[2] :
                        arguments[3] ? arguments[3] :
                        arguments[4] ? arguments[4] :
                        fillAttrs[name] ? name : "";

                    attrs.push({
                        name: name,
                        value: value,
                        escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                    });
                });

                if ( handler.start )
                    handler.start( tagName, attrs, unary );
            }
        }

        function parseEndTag( tag, tagName ) {
            // If no tag name is provided, clean shop
            if ( !tagName )
                var pos = 0;

            // Find the closest opened tag of the same type
            else
                for ( var pos = stack.length - 1; pos >= 0; pos-- )
                    if ( stack[ pos ] == tagName )
                        break;

            if ( pos >= 0 ) {
                // Close all the open elements, up the stack
                for ( var i = stack.length - 1; i >= pos; i-- )
                    if ( handler.end )
                        handler.end( stack[ i ] );

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }
    };

    this.HTMLtoXML = function( html ) {
        var results = "";

        HTMLParser(html, {
            start: function( tag, attrs, unary ) {
                results += "<" + tag;

                for ( var i = 0; i < attrs.length; i++ )
                    results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';

                results += (unary ? "/" : "") + ">";
            },
            end: function( tag ) {
                results += "</" + tag + ">";
            },
            chars: function( text ) {
                results += text;
            },
            comment: function( text ) {
                results += "<!--" + text + "-->";
            },
            php: function( text ) {
                results += "<?php" + text + "?>";
            }
        });

        return results;
    };

    this.HTMLtoDOM = function( html, doc ) {
        // There can be only one of these elements
        var one = makeMap("html,head,body,title");

        // Enforce a structure for the document
        var structure = {
            link: "head",
            base: "head"
        };

        if ( !doc ) {
            if ( typeof DOMDocument != "undefined" )
                doc = new DOMDocument();
            else if ( typeof document != "undefined" && document.implementation && document.implementation.createDocument )
                doc = document.implementation.createDocument("", "", null);
            else if ( typeof ActiveX != "undefined" )
                doc = new ActiveXObject("Msxml.DOMDocument");

        } else
            doc = doc.ownerDocument ||
                doc.getOwnerDocument && doc.getOwnerDocument() ||
                doc;

        var elems = [],
            documentElement = doc.documentElement ||
                doc.getDocumentElement && doc.getDocumentElement();

        // If we're dealing with an empty document then we
        // need to pre-populate it with the HTML document structure
        if ( !documentElement && doc.createElement ) (function(){
            var html = doc.createElement("html");
            var head = doc.createElement("head");
            head.appendChild( doc.createElement("title") );
            html.appendChild( head );
            html.appendChild( doc.createElement("body") );
            doc.appendChild( html );
        })();

        // Find all the unique elements
        if ( doc.getElementsByTagName )
            for ( var i in one )
                one[ i ] = doc.getElementsByTagName( i )[0];

        // If we're working with a document, inject contents into
        // the body element
        var curParentNode = one.body;

        HTMLParser( html, {
            start: function( tagName, attrs, unary ) {
                // If it's a pre-built element, then we can ignore
                // its construction
                if ( one[ tagName ] ) {
                    curParentNode = one[ tagName ];
                    if ( !unary ) {
                        elems.push( curParentNode );
                    }
                    return;
                }

                var elem = doc.createElement( tagName );

                for ( var attr in attrs )
                    elem.setAttribute( attrs[ attr ].name, attrs[ attr ].value );

                if ( structure[ tagName ] && typeof one[ structure[ tagName ] ] != "boolean" )
                    one[ structure[ tagName ] ].appendChild( elem );

                else if ( curParentNode && curParentNode.appendChild )
                    curParentNode.appendChild( elem );

                if ( !unary ) {
                    elems.push( elem );
                    curParentNode = elem;
                }
            },
            end: function( tag ) {
                elems.length -= 1;

                // Init the new parentNode
                curParentNode = elems[ elems.length - 1 ];
            },
            chars: function( text ) {
                curParentNode.appendChild( doc.createTextNode( text ) );
            },
            comment: function( text ) {
                // create comment node
            }
        });

        return doc;
    };

    function makeMap(str){
        var obj = {}, items = str.split(",");
        for ( var i = 0; i < items.length; i++ )
            obj[ items[i] ] = true;
        return obj;
    }
})();;
/*----------------------------------------------------------------------------------------------

jQuery addon:
Prettify/uglify input[type="file"] elements.

------------------------------------------------------------------------------------------------

@author       fffilo
@link         -
@github       -
@version      1.0.0
@license      -

----------------------------------------------------------------------------------------------*/

;(function($) {

	// load only once
	if ( !! $.fn.inputFileUglify && !! $.fn.inputFileUglify) {
		return;
	}

	/**
	 * Default values
	 * @type {Object}
	 */
	var _default = {
		labelLink     : true,
		textButton    : 'Browse...',
		textNoFiles   : 'No files selected.',
		textMoreFiles : '{count} files selected.'
	}

	/**
	 * Class name
	 * @type {String}
	 */
	var _class = 'jquery-input-file-prettify';

	/**
	 * Constructor
	 * @param  {Object} options (see _default object)
	 * @return {Void}
	 */
	var _pretty = function(options) {
		if ($(this).data(_class)) {
			return;
		}
		if ( ! $(this).is('input[type="file"]')) {
			return;
		}

		var data = {};
		data.options = $.extend({}, _default, options);

		$(this)
			.data(_class, data);

		_wrap.call(this, options);
	}

	/**
	 * Destructor
	 * @return {Void}
	 */
	var _ugly = function() {
		var data = $(this).data(_class);
		if ( ! data) {
			return;
		}

		$(data.button).removeData(_class).unbind().remove();
		$(data.label).removeData(_class).unbind().remove();
		$(data.span).removeData(_class).remove();
		$(this).removeData(_class).unwrap();
	}

	/**
	 * Wrap element and create button/label
	 * @return {Void}
	 */
	var _wrap = function() {
		var data = $(this).data(_class);

		$(this)
			.wrap('<div />');
		data.wrapper = $(this).parent()
			.attr('class', _class)
			.data(_class, this);
		data.button = $('<a />')
			.attr('href', '#')
			.html(data.options.textButton)
			.on('click', _click)
			.on('mouseenter', _mouseenter)
			.on('mouseleave', _mouseleave)
			.data(_class, this)
			.appendTo(data.wrapper);
		data.span = $('<span />')
			.css('left', data.button.outerWidth(true) + 'px')
			.data(_class, this)
			.appendTo(data.wrapper);
		data.label = $('<label />')
			.html(data.options.textNoFiles)
			.data(_class, this)
			.appendTo(data.span);

		if (data.options.labelLink) {
			$(data.wrapper)
				.addClass(_class + '-label-link');
			$(data.label)
				.on('mouseenter', _mouseenter)
				.on('mouseleave', _mouseleave)
				.on('click', function(event) {
					_click.call(this);
				});
		}

		$(this)
			.data(_class, data)
			.on('change', _change)
			.trigger('change');
	}

	/**
	 * Button click event
	 * @param  {Object}  event
	 * @return {Boolean}
	 */
	var _click = function(event) {
		$($(this).data(_class))
			.trigger('click');

		return false;
	}

	/**
	 * Input object change event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _change = function(event) {
		var data = $(this).data(_class);
		var count = $(this).get(0).files.length;
		var html = data.options.textNoFiles;
		if (count == 1) html = $(this).val().split('\\').pop();
		if (count  > 1) html = data.options.textMoreFiles.replace(/{count}/g, count);

		$(data.label).html(html);

		$(data.wrapper)
			.removeClass(_class + '-no-files')
			.addClass(count == 0 ? _class + '-no-files' : _class + '-temp')
			.removeClass(_class + '-temp')
	}

	/**
	 * Mouseenter event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _mouseenter = function(event) {
		$($(this).data(_class)).data(_class).wrapper
			.removeClass(_class + '-hover')
			.addClass(_class + '-hover');
	}

	/**
	 * Mouseleave event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _mouseleave = function(event) {
		$($(this).data(_class)).data(_class).wrapper
			.removeClass(_class + '-hover');
	}

	/**
	 * jQery input-file-prettify addon
	 * @param  {Object} options (see _default object)
	 * @return {Object}         jQuery collection
	 */
	$.fn.inputFilePrettify = function(options) {
		return $.each(this, function() {
			_pretty.call(this, options);
		});
	}

	/**
	 * jQery input-file-prettify addon remove
	 * @return {Object} jQuery collection
	 */
	$.fn.inputFileUglify = function() {
		return $.each(this, function() {
			_ugly.call(this);
		});
	}

}(opjq));
;
/*----------------------------------------------------------------------------------------------

jQuery optimizepress form plugin:
    - prettify input[type="file"] elements
    - disable submit if input[type="file"] is empty

------------------------------------------------------------------------------------------------

@author       fffilo
@link         -
@github       -
@version      1.0.0
@license      -

----------------------------------------------------------------------------------------------*/

;(function($) {

    // load only once
    if ( !! $.fn.opForm) {
        return;
    }

    /**
     * Default values
     * @type {Object}
     */
    var _default = {};

    /**
     * Class name
     * @type {String}
     */
    var _class = 'op-form';

    /**
     * Constructor
     * @param  {Object} options (see _default object)
     * @return {Void}
     */
    var _init = function(options) {
        if ( ! $(this).is('form')) {
            return;
        }

        var data     = {};
        data.options = $.extend({}, _default, options);
        data.submit  = $(this).find('input[type="submit"],button[type="submit"]');
        data.file    = $(this).find('input[type="file"]');

        $(this)
            //.removeClass(_class)
            //.addClass(_class)
            .unbind('submit.' + _class)
            .on('submit.' + _class, _submit)
            .data(_class, data);

        $(data.file)
            .inputFilePrettify()
            .on('change', _change)
            .trigger('change');
    }

    /**
     * On input file change event
     * @param  {Object} event
     * @return {Void}
     */
    var _change = function(event) {
        var data  = $(this).closest('form').data(_class);

        if (data && data.submit) {
            $(data.submit)
                .removeAttr('disabled');
            if ($(this).get(0).files.length == 0) {
                $(data.submit)
                    .attr('disabled', 'disabled');
            }
        }
    }

    /**
     * On form submit event
     * @param  {Object} event
     * @return {Void}
     */
    var _submit = function(event) {
        var data  = $(this).data(_class);

        if (data && data.file) {
            if ($(data.file).get(0).files.length == 0) {
                return false;
            }
        }
    }

    /**
     * jQery opForm addon
     * @return {Object} jQuery collection
     */
    $.fn.opForm = function(options) {
        return $.each(this, function() {
            _init.call(this, options);
        });
    }

}(opjq));
;
(function ($) {

    var submit_form = false;
    var xhr;
    var valid_slug = false;
    var page_template_id;
    var $form;
    var $pageNameInput;
    var $pageSlugInput;
    var $submitButton;
    var openLiveEditorInNewPage = false;
    var redirectPageBuilderStep = '2';

    if (!OptimizePress.op_create_new_page) {
        return false;
    }

    $(document).ready(function () {

        var $body = $('body');

        $pageNameInput = $('#op_page_name');
        $pageSlugInput = $('#op_page_slug');
        $submitButton = $('#op-create-page-btn');
        $form = $('#op_asset_browser_container');

        /**
         * Scroll the page to the section that is beign clicked
         */
        $body.on('click', '.op-info-box-list-icons .op-icon', function (e) {
            var $el = $($(this).attr('href'));

            if ($el.length > 0) {
                $('html, body').animate({
                    scrollTop: $el.offset().top
                }, 'normal');
            }
            return false;
        });

        /**
         * Calls preview content template modal dialog
         */
        // $('.op-template-section-template-description').off();
        $body.on('click', '.op-template-section-template-img-btn-alt', function() {
            var $this = $(this);

            previewContentTemplate($this.data('template-id'), $this.data('preview-url'), $this.data('is-image'));

            return false;
        });

        /**
         * Forces op_page_preset_option to create new page from preset selection on iframe window
         */
        $body.on('click', '.op-create-from-preset', function() {
            var $form = $(this).parent();
            var selectedPreset = $form.find("select.op-presets").val();
            window.parent.createPageFromPreset();

            var $parentWindow = $(window.parent.document);
            
            $parentWindow.find("#op_page_preset_option").val("preset");
            if ($parentWindow.find(".op_page_preset_val").length > 0){
                $parentWindow.find(".op_page_preset_val").val(selectedPreset);
            } else{
                $parentWindow.find("#op_page_preset_option").after('<input class="op_page_preset_val" type="hidden" name="op[page][preset]" value="' + selectedPreset + '">');
            }
        });

        $body.on('click', '.op-template-section-template-img-btn', useContentTemplate);
        $body.on('click', '.check-availability', function (e) {
            submit_form = false;
            checkUrl(e);
        });
        $pageNameInput.keyup(updateUrlSlug).change(updateUrlSlug);

        // We open liveeditor in window, not in iframe if shift was pressed during form submit
        $submitButton.on('click', function (e) {
             openLiveEditorInNewPage = (e.shiftKey) ? true : false;
        });

        /**
         * Back to top button behaviour
         */
        var $backToTop = $('#op-js-back-to-top');
        var $window = $(window);
        var currentScroll = 0;
        var newScroll = 0;
        var hideBackToTopTimeout;
        var scrollingToTop = false;

        $window.on('scroll', function (e) {
            if (scrollingToTop) {
                return false;
            }
            clearTimeout(hideBackToTopTimeout);
            newScroll = $window.scrollTop();
            if (newScroll > 750 && currentScroll > newScroll) {
                $backToTop.addClass('op-back-to-top--shown op-back-to-top--pointer-events');
            } else {
                hideBackToTopTimeout = setTimeout(function () {
                    $backToTop.removeClass('op-back-to-top--shown');
                    setTimeout(function () {
                        $backToTop.removeClass('op-back-to-top--pointer-events');
                    }, 400);
                }, 600);
            }
            currentScroll = $window.scrollTop();
        });

        $body.on('click', '#op-js-back-to-top', function () {
            scrollingToTop = true;
            $('html, body').animate({ scrollTop: 0 }, 'normal', function () {
                scrollingToTop = false;
            });
            $backToTop.removeClass('op-back-to-top--shown');
            return false;
        });

        /**
         * This was taken from page builder.
         * Basically, clicking the create page button calls
         * checkUrl function, which in turn submits the form via JS
         * (if validation passes).
         * If check availability is clicked, global variable submit_form is set to false
         * and form is not submitted after checkUrl.
         */
        $form.submit(function (e) {

            // var $submitButton = $('#op-create-page-btn').addClass('op-loading');
            $submitButton.addClass('op-loading');

            if ($.trim($pageNameInput.val()) == '') {

                alert(OptimizePress.create_new_page.name_message);
                $pageNameInput.addClass('error').focus();
                $submitButton.removeClass('op-loading');
                e.preventDefault();

            } else if (!valid_slug) {

                $pageNameInput.removeClass('error');
                submit_form = true;
                checkUrl(e);
                e.preventDefault();

            } else {

                $pageNameInput.removeClass('error');

                $.ajax({
                  type: "POST",
                  url: $form.attr('action'),
                  data: $form.serialize(),
                  success: function (resp) {
                    if (openLiveEditorInNewPage) {
                        window.location = OptimizePress.OP_PAGE_BUILDER_URL + '&step=' + redirectPageBuilderStep + '&page_id=' + resp;
                        $.fancybox.close();
                        // $.fancybox.showLoading();
                        op_show_loading();
                    } else {
                        $.fancybox.close();

                        // we need to wait for fancybox to be properly closed, before we can open it again
                        setTimeout(function () {
                            $.fancybox.open(
                                $.extend(
                                    {},
                                    OptimizePress.fancybox_defaults,
                                    {
                                        type: 'iframe',
                                        href: OptimizePress.OP_PAGE_BUILDER_URL + '&step=' + redirectPageBuilderStep + '&page_id=' + resp
                                    }
                                )
                            );
                        }, 500);
                    }
                    $submitButton.removeClass('op-loading');
                  }
                });

                e.preventDefault();
            }

        });


        /**
         * New to OptimizePress? Click here to watch our Getting Started video
         */
        $('#js-op-info-box-getting-started-link').on('click', function () {
            $(this).parent().next().toggleClass('op-video-container--opened');
            return false;
        });

    });

    /**
     * Generates url slug based on page name
     */
    function updateUrlSlug(){
        var title = $(this).val();
        var slug = '';

        slug = title.replace(/\s/g,'-').replace(/[^a-zA-Z0-9\-]/g,'').replace(RegExp('-{2,}', 'g'),'-');
        $pageSlugInput.val(slug.toLowerCase());
    }

    /**
     * Clears input fields in create page modal dialog and hides all messages
     */
    function clearInputFields() {
        $pageNameInput.removeClass('error').val('');
        $pageSlugInput.removeClass('error').val('');
        $('.op-msg').hide();
    }

    /**
     * This was taken from page builder.
     * Basically, clicking the create page button calls
     * checkUrl function, which in turn submits the form via JS
     * (if validation passes).
     * If check availability is clicked, global variable submit_form is set to false
     * and form is not submitted after checkUrl.
     */
    function checkUrl(e) {

        // var $submitButton = $('#op-create-page-btn');
        var $successMsg = $('.op-msg-success');
        var $errorMsg = $('.op-msg-error');
        var $ajaxChecker = $('#op_ajax_checker');
        var $ajaxCheckerImg = $ajaxChecker.find('img');
        var $check = $ajaxChecker.find('.op-check-availability');
        var $cancel = $ajaxChecker.find('.op-check-availability-cancel');

        // Don't check with the server if there's nothing to check
        if ($.trim($pageSlugInput.val()) === '' ) {
            return false;
        }

        e.preventDefault();

        $submitButton.addClass('op-loading');
        $check.fadeOut('fast',function(){
            $errorMsg.add($successMsg).hide();
            $ajaxCheckerImg.add($cancel).fadeIn('fast');
        });

        xhr = $.ajax(OptimizePress.ajaxurl,{
            data: {
                action: OptimizePress.SN + '-page-builder-slug',
                slug: $pageSlugInput.val(),
                post_id: 0
            },
            type: 'post',
            dataType: 'json',
            success: function (resp) {
                $cancel.add($ajaxCheckerImg).fadeOut('fast', function(){
                    $check.fadeIn('fast');
                });
                if(resp.valid === true){
                    $pageSlugInput.removeClass('error');
                    valid_slug = true;
                    if(submit_form){
                        window.parent.OptimizePress.reload_page = true;
                        $form.submit();
                    } else {
                        $submitButton.removeClass('op-loading');
                    }
                    $errorMsg.hide();
                    $successMsg.show();
                } else {
                    $pageSlugInput.addClass('error');
                    $submitButton.removeClass('op-loading');
                    if(submit_form){
                        alert(OptimizePress.create_new_page.slug_message);
                        $pageSlugInput.focus();
                    }
                    valid_slug = false;
                    submit_form = false;
                    $successMsg.hide();
                    $errorMsg.show();
                }
            }
        });
    }

    /**
     * Call to useContentTemplate() over child iframe window
     */
    window.createPageFromPreset = function(){
        useContentTemplate();
    };

    /**
     * Opens create page dialog in fancybox
     */
    function useContentTemplate(e) {
        var contentTemplateId = $(this).data('template-id');
        var $pagePresetOption = $('#op_page_preset_option');
        var inputStr = '';

        page_template_id = contentTemplateId;

        if (contentTemplateId !== 0) {
            $pagePresetOption.val('content_layout');

            // These input fields should not be present here, since some of the preset templates are generated with wrong theme otherwise.
            $('#op_theme_type, #op_theme_id').remove();

        } else {

            // Only blank page needs following input fields
            inputStr = '<input type="hidden" name="theme_type" id="op_theme_type" value="marketing" />';
            inputStr += '<input type="hidden" name="theme_id" id="op_theme_id" value="' + $(this).data('themeId') + '" />';
            $form.append(inputStr);

            $pagePresetOption.val('blank');

        }

        redirectPageBuilderStep = '5';

        clearInputFields();
        $('#content_layout_id').val(contentTemplateId);

        $.fancybox(
            { href: '#op-content-preview-container' },
            $.extend(
                {},
                OptimizePress.fancybox_defaults,
                {
                    // autoSize: false,
                    // type : isImage ? 'image' : 'iframe'
                    type: 'inline',
                    beforeClose: function () {
                        OptimizePress.fancyboxBeforeCloseAnimation(this);
                    }
                }
            )
        );
        setTimeout(function () {
            $('#op_page_name').focus();
        }, 300);
    }

    /**
     * Generates a preview page based on templateId, then calls openContentTemplatePreview
     */
    function previewContentTemplate(templateId, previewUrl, isImage) {

        op_show_loading();

        // If preview url is available we show that page
        if (previewUrl && previewUrl !== '') {
            openContentTemplatePreview(previewUrl, isImage);
            return false;
        }

        $.post(
            OptimizePress.ajaxurl,
            {
                action: OptimizePress.SN + '-preview-content-layout',
                template: templateId
            },
            function (resp) {
                // openContentTemplatePreview('/?preview=true&op-no-admin-bar=true&page_id=' + resp);
                openContentTemplatePreview(resp);
            }
        );
    }

    /**
     * Opens the generated preview page in fancybox
     */
    function openContentTemplatePreview(url, isImage) {
        OptimizePress.disable_alert = true;

        $.fancybox(
            { href: url },
            $.extend(
                {},
                OptimizePress.fancybox_defaults,
                {
                    autoSize: false,
                    type : isImage ? 'image' : 'iframe'
                }
            )
        );

        if (isImage) {
            op_hide_loading();
        }
    }

    /**
     * Injects content templates into #op_template_sections_container
     * This happens after new plugin is uploaded
     */
    window.op_refresh_content_layouts = function () {
       $.post(OptimizePress.ajaxurl,{
            action: OptimizePress.SN+'-create-new-page-content-layouts',
            _wpnonce: $('#op_le_wpnonce').val()
        },
        function(resp){
            $('#op_template_sections_container').html(resp);
        });
    };

}(opjq));;
/*!
 * jQuery Browser Plugin 0.1.0
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 05-07-2015
 */
/*global window: false */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], function ($) {
            return factory($);
        });
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        // Node-like environment
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function(jQuery) {
    "use strict";

    function uaMatch( ua ) {
        // If an UA is not provided, default to the current browser UA.
        if ( ua === undefined ) {
            ua = window.navigator.userAgent;
        }
        ua = ua.toLowerCase();

        var match = /(edge)\/([\w.]+)/.exec( ua ) ||
            /(opr)[\/]([\w.]+)/.exec( ua ) ||
            /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(iemobile)[\/]([\w.]+)/.exec( ua ) ||
            /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        var platform_match = /(ipad)/.exec( ua ) ||
            /(ipod)/.exec( ua ) ||
            /(windows phone)/.exec( ua ) ||
            /(iphone)/.exec( ua ) ||
            /(kindle)/.exec( ua ) ||
            /(silk)/.exec( ua ) ||
            /(android)/.exec( ua ) ||
            /(win)/.exec( ua ) ||
            /(mac)/.exec( ua ) ||
            /(linux)/.exec( ua ) ||
            /(cros)/.exec( ua ) ||
            /(playbook)/.exec( ua ) ||
            /(bb)/.exec( ua ) ||
            /(blackberry)/.exec( ua ) ||
            [];

        var browser = {},
            matched = {
                browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
                version: match[ 2 ] || match[ 4 ] || "0",
                versionNumber: match[ 4 ] || match[ 2 ] || "0",
                platform: platform_match[ 0 ] || ""
            };

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
            browser.versionNumber = parseInt(matched.versionNumber, 10);
        }

        if ( matched.platform ) {
            browser[ matched.platform ] = true;
        }

        // These are all considered mobile platforms, meaning they run a mobile browser
        if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
            browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
            browser.mobile = true;
        }

        // These are all considered desktop platforms, meaning they run a desktop browser
        if ( browser.cros || browser.mac || browser.linux || browser.win ) {
            browser.desktop = true;
        }

        // Chrome, Opera 15+ and Safari are webkit based browsers
        if ( browser.chrome || browser.opr || browser.safari ) {
            browser.webkit = true;
        }

        // IE11 has a new token so we will assign it msie to avoid breaking changes
        if ( browser.rv || browser.iemobile) {
            var ie = "msie";

            matched.browser = ie;
            browser[ie] = true;
        }

        // Edge is officially known as Microsoft Edge, so rewrite the key to match
        if ( browser.edge ) {
            delete browser.edge;
            var msedge = "msedge";

            matched.browser = msedge;
            browser[msedge] = true;
        }

        // Blackberry browsers are marked as Safari on BlackBerry
        if ( browser.safari && browser.blackberry ) {
            var blackberry = "blackberry";

            matched.browser = blackberry;
            browser[blackberry] = true;
        }

        // Playbook browsers are marked as Safari on Playbook
        if ( browser.safari && browser.playbook ) {
            var playbook = "playbook";

            matched.browser = playbook;
            browser[playbook] = true;
        }

        // BB10 is a newer OS version of BlackBerry
        if ( browser.bb ) {
            var bb = "blackberry";

            matched.browser = bb;
            browser[bb] = true;
        }

        // Opera 15+ are identified as opr
        if ( browser.opr ) {
            var opera = "opera";

            matched.browser = opera;
            browser[opera] = true;
        }

        // Stock Android browsers are marked as Safari on Android.
        if ( browser.safari && browser.android ) {
            var android = "android";

            matched.browser = android;
            browser[android] = true;
        }

        // Kindle browsers are marked as Safari on Kindle
        if ( browser.safari && browser.kindle ) {
            var kindle = "kindle";

            matched.browser = kindle;
            browser[kindle] = true;
        }

        // Kindle Silk browsers are marked as Safari on Kindle
        if ( browser.safari && browser.silk ) {
            var silk = "silk";

            matched.browser = silk;
            browser[silk] = true;
        }

        // Assign the name and platform variable
        browser.name = matched.browser;
        browser.platform = matched.platform;
        return browser;
    }

    // Run the matching process, also assign the function to the returned object
    // for manual, jQuery-free use if desired
    window.jQBrowser = uaMatch( window.navigator.userAgent );
    window.jQBrowser.uaMatch = uaMatch;

    // Only assign to jQuery.browser if jQuery is loaded
    if ( jQuery ) {
        jQuery.browser = window.jQBrowser;
    }

    return window.jQBrowser;
}));