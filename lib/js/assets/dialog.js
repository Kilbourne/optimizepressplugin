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
