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

