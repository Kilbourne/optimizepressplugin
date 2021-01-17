;(function($){
    var valid_slug = false, submit_form = false;
    var membershipElements = ['productName', 'templates', 'layoutSelector', 'pageType', 'category', 'subcategory', 'content'];
    var cat_options = [];
    var subcat_options = [];
    var methods = {
        'step_1': function(){
            var $submit_button = $('.form-actions-content .op-pb-button');

            $('body').on('change', '#content_layout_container input[type="radio"]', function(){
                $(this).closest('#content_layout_container').find('.img-radio-selected').removeClass('img-radio-selected').end().end().closest('.img-radio-item').addClass('img-radio-selected');
            }).filter(':checked').trigger('change');

            $('body').on('click', '.img-radio-label', function(){
                $(this).closest('.img-radio-item').find(':radio').attr('checked',true).trigger('change');
            });

            var form = this,
                c = $('#op_ajax_checker'),
                w = c.find('img'),
                check = c.find('a[href$="#check"]'),
                cancel = c.find('a[href$="#cancel"]'),
                xhr,
                err = c.find('span.error'),
                success = c.find('span.success');

            form.submit(function(e){
                $submit_button.addClass('op-loading');
                if($.trim($('#op_page_name').val()) == ''){
                    alert(OP_PageBuilder.name_message);
                    $('#op_page_name').addClass('error').focus();
                    $submit_button.removeClass('op-loading');
                    e.preventDefault();
                } else if(!valid_slug){
                    submit_form = true;
                    check.trigger('click');
                    e.preventDefault();
                }
            });

            $('#op_page_name').keyup(url_slug).change(url_slug);

            check.click(function(e){
                e.preventDefault();
                $submit_button.addClass('op-loading');
                check.fadeOut('fast',function(){
                    err.add(success).hide();
                    w.add(cancel).fadeIn('fast');
                    xhr = $.ajax(OptimizePress.ajaxurl,{
                        'data': {
                            'action': OptimizePress.SN+'-page-builder-slug',
                            'slug': $('#op_page_slug').val(),
                            'post_id': OP_PageBuilder.post_id,
                        },
                        'type': 'post',
                        'dataType': 'json',
                        'success': function(resp){
                            cancel.add(w).fadeOut('fast',function(){
                                check.fadeIn('fast');
                            });
                            if(resp.valid === true){
                                $('#op_page_slug').removeClass('error');
                                valid_slug = true;
                                if(submit_form){
                                    window.parent.OptimizePress.reload_page = true;
                                    form.trigger('submit');
                                } else {
                                    $submit_button.removeClass('op-loading');
                                }
                                err.hide();
                                success.show();
                            } else {
                                var el = $('#op_page_slug').addClass('error');
                                $submit_button.removeClass('op-loading');
                                if(submit_form){
                                    alert(OP_PageBuilder.slug_message);
                                    el.focus();
                                }
                                valid_slug = false;
                                submit_form = false;
                                success.hide();
                                err.show();
                            }
                        }
                    });
                });
            });
            cancel.click(function(e){
                e.preventDefault();
                xhr.abort();
                success.add(err).hide();
                cancel.add(w).fadeOut('fast',function(){
                    check.fadeIn('fast');
                });
            });
            var preset_options = $('#preset-option-preset,#preset-option-content_layout');
            $('#preset-option :radio').change(function(){
                preset_options.hide();
                if($(this).is(':checked') && (v = $(this).val()) && v != 'blank'){
                    $('#preset-option-'+v).show();
                }
            }).filter(':checked').trigger('change');

            var hide = [$('#content_layout_container'),$('#upload_new_layout_container')];
            $('#upload_new_layout').click(function(e){
                e.preventDefault();
                hide[0].fadeOut('fast');
                hide[1].fadeIn('fast');
            });

            $('#view_layouts').click(function(e){
                e.preventDefault();
                hide[1].fadeOut('fast');
                hide[0].fadeIn('fast');
            });

            bind_content_sliders();
        },
        'step_2': function(){
            var $submit_button = $('.form-actions-content .op-pb-button');
            $submit_button.on('click', function () {
                $submit_button.addClass('op-loading');
            });
        },
        'step_3': function(){
            var form = this;
            var $submit_button = $('.form-actions-content .op-pb-button');
            form.submit(function(e){
                $submit_button.addClass('op-loading');
                /*if ($('#op_productName').length > 0) {
                    if($.trim($('#op_productName').val()) == ''){
                        alert(OP_PageBuilder.product_message);
                        $('#op_productName').addClass('error').focus();
                        e.preventDefault();
                    }
                }*/
            });
            $('a.add-new','#op_product_field,#op_category_field,#op_subcategory_field').click(function(e){
                e.preventDefault();
                var $t = $(this),
                    par = $t.parent(),
                    el = par.siblings('.add-new'),
                    input = el.find(':input').val('');
                $t.prev().val('');
                par.hide();
                el.show();
                input.focus();
            });
            $('a.use-current','#op_product_field,#op_category_field,#op_subcategory_field').click(function(e){
                e.preventDefault();
                var $t = $(this),
                    par = $t.parent(),
                    el = par.siblings('.select'),
                    input = el.find('select').val('');
                $t.prev().val('');
                par.hide();
                el.show();
                input.focus();
            });
            //$('.hide1 option:not(.default-val)').hide();
            $('#op_category_id').find('option').each(function() {
                cat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class')});
            });
            $('#op_subcategory_id').find('option').each(function() {
                subcat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class')});
            });
            $('#op_product_id').change(function(){
                if ($(this).val() != '') {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: OptimizePress.ajaxurl,
                        data: { productId: $(this).val(), action: OptimizePress.SN+'-live-editor-load-product' }
                    }).done(function(data) {
                        //$('#opCategoryName, #opSubCategoryName, #opContentName').val(data.post_title);
                        if (data.meta.dir != undefined) {
                            $('#opThemeDir').val(data.meta.dir);
                        }
                    });
                }
                show_member_fields($('#op_category_id'), $(this).val(), 'category');
                show_member_fields($('#op_category_id1'), $(this).val(), 'category');
            });
            $('#op_category_id').change(function(){
                show_member_fields($('#op_subcategory_id'), $(this).val(), 'subcategory');
            });
            $('#op_category_id1').change(function(){
                show_member_fields($('#op_subcategory_id'), $(this).val(), 'subcategory');
            });
            $('#opNewProduct').click(function(e) {
                e.preventDefault();
                showElements(['productName', 'templates', 'layoutSelector'])
            });
            $('#opNewModule').click(function(e) {
                e.preventDefault();
                showElements(['pageType']);
            });
            $('#pageTypeChange').change(function() {
                showElements([$(this).val(), 'pageType']);
            });
            function showElements(elements) {
                for (var i = 0; i < membershipElements.length; i++) {
                    $('#' + membershipElements[i]).hide();
                }
                for (var i = 0; i < elements.length; i++) {
                    if ($.inArray(elements[i], membershipElements) !== -1) {
                        $('#' + elements[i]).fadeIn();
                    }
                }
            }
            var container = $('#op_landing_options');
            if(container.length > 0){
                $(':radio','div.theme-select').change(function(){
                    if($(this).is(':checked')){
                        var v = $(this).val(),
                            el = $('#op_landing_themes_'+v);
                        container.find('.theme-style-selection').hide();
                        if(el.length > 0){
                            container.show();
                            el.show();
                        } else {
                            container.hide();
                        }
                    }
                }).filter(':checked').trigger('change');
            }

            if(typeof OP_PageBuilder.membership_types != 'undefined'){
                $(':radio','div.theme-select').change(function(){
                    if($(this).is(':checked')){
                        var v = $(this).val(),
                            type = 'content',
                            show = '',
                            hide = '';
                        if(typeof OP_PageBuilder.membership_types[v] != 'undefined'){
                            type = OP_PageBuilder.membership_types[v];
                        }
                        switch(type){
                            case 'content':
                                show = '#op_membership_options,#op_product_field,#op_category_field,#op_subcategory_field';
                                break;
                            case 'product':
                                hide = '#op_membership_options';
                                break;
                            case 'category':
                                show = '#op_membership_options,#op_product_field';
                                hide = '#op_category_field,#op_subcategory_field';
                                break;
                            case 'subcategory':
                                show = '#op_membership_options,#op_product_field,#op_category_field',
                                hide = '#op_subcategory_field';
                                break;
                        }
                        if(show != ''){
                            $(show).show();
                        }
                        if(hide != ''){
                            $(hide).hide();
                        }
                    }
                }).filter(':checked').trigger('change');
            }
        },
        'step_4': function(){
            var h = document.location.hash.split('#')[1];
            if(h != ''){
                $('.op-bsw-grey-panel-tabs:first a[href$="#'+h+'"]').trigger('click');
            }
            //$('.op-bsw-grey-panel-tabs:first a').click(positionFooter);
            this.submit(function(e){
                $('.form-actions-content .op-pb-button').addClass('op-loading');
                //!confirm(OptimizePress.pb_save_alert) && e.preventDefault();
            });

            $('.menu-position :radio','#op_page_layout_header').change(function(){
                var $t = $(this), func = 'hide';
                if($t.is(':checked') && $t.val() == 'alongside'){
                    func = 'show';
                }
                $('#op_page_layout_header_nav_bar_alongside')[func]();
            }).filter(':checked').trigger('change');

            $('#op_header_layout_nav_bar_alongside_enabled').change(function(){
                $('#advanced_colors_nav_bar_alongside').toggle($(this).is(':checked'));
            }).trigger('change');

            $('#op_footer_area_enabled').change(function(){
                $('#advanced_colors_footer').toggle($(this).is(':checked'));
            }).trigger('change');

            $('#op_header_layout_nav_bar_below_enabled').change(function(){
                $('#advanced_colors_nav_bar_below').toggle($(this).is(':checked'));
            }).trigger('change');

            $('#op_header_layout_nav_bar_above_enabled').change(function(){
                $('#advanced_colors_nav_bar_above').toggle($(this).is(':checked'));
            }).trigger('change');

            $('#op_content_layout_layouts_option_blank').change(function(){
                var $t = $(this);
                if($t.is(':checked')){
                    $('#op_page_content_layout_layouts .content_layout .img-radio-selected').removeClass('img-radio-selected');
                }
            }).trigger('change');
            var $sidebar   = $('.op-pb-wizard .module-page_builder > .op-bsw-grey-panel-sidebar'),
                $window    = $(window),
                offset     = $sidebar.offset(),
                topPadding = 15;

            $window.scroll(function() {
                var top = $window.scrollTop();
                if (top > offset.top) {
                    $sidebar.stop().animate({
                        marginTop: top - offset.top + topPadding
                    });
                } else {
                    $sidebar.stop().animate({
                        marginTop: 0
                    });
                }
            });

            $('#op_page_color_schemes_template :radio').change(function(){
                var $t = $(this);
                if($t.is(':checked')){
                    if(typeof OP_Color_Schemes[$t.val()] != 'undefined'){
                        var opt = OP_Color_Schemes[$t.val()];
                        for(var i in opt){
                            var pref = '#op_color_scheme_advanced_'+i+'_';
                            for(var j in opt[i]){
                                if(typeof opt[i][j] == 'string'){
                                    $(pref+j).val(opt[i][j]).trigger('change');
                                } else {
                                    for(var k in opt[i][j]){
                                        $(pref+j+'_'+k).val(opt[i][j][k]).trigger('change');
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    if (!OptimizePress.op_page_builder) {
        return false;
    }

    $(document).ready(function(){
        for(var i=1;i<5;i++){
            var el = $('.form-step-'+i);
            if(el.length > 0 && typeof methods['step_'+i] != 'undefined'){
                methods['step_'+i].apply(el,[]);
                break;
            }
        }
    });
    function bind_content_sliders(){
        //Get all the content slider buttons
        var $btn = $('.op-content-slider-button'), $cur_btn;

        //Loop through all buttons
        $btn.each(function(){
            $cur_btn = $(this);
            var $target = $('#' + $(this).data('target')); //Get the target of the current button (the content slider)

            //Unbind any existing click events so we dont duplicate them
            $(this).unbind('click').click(function(e){
                // var scrollY = window.pageYOffset;
                // $target.show().animate({top:scrollY},400);
                $target.css({ top: '0' });
                e.preventDefault();
            });

            //Initialize the close button
            $target.find('.hide-the-panda').unbind('click').click(function(e){
                // var scrollY = window.pageYOffset;

                // $target.animate({top:-(scrollY)},400, function(){
                //     $(this).hide();
                // });
                $target.css({ top: '-100%' });
                e.preventDefault();
            });

            $target.on('click','ul.op-image-slider-content li a',function(e){
                var $input = $cur_btn.next('input.op-gallery-value');
                var $preview = $input.next('.file-preview').find('.content');
                // var src = $(this).find('img').attr('src');
                var src = $(this).attr('src'); // Get ahold of the image src

                var html = '<a class="preview-image" target="_blank" href="' + src + '"><img alt="uploaded-image" src="' + src + '"></a><a class="remove-file button" href="#remove">Remove Image</a>';
                $input.val(src);
                $input.parent().next('.op-file-uploader').find('.file-preview .content').empty().html(html).find('.remove-file').click(function(){
                    $(this).parent().empty().parent('.file-preview').prev('.op-uploader-value').val('');
                });
                /*$preview.empty().html(html).find('.remove-file').click(function(){
                    $preview.empty().parent('.file-preview').prev('.op-gallery-value').val('');
                });*/
                // $target.animate({top:-475},400, function(){
                //     $(this).hide();
                // });
                $target.css({ top: '-100%' });

                e.preventDefault();
            });
        });
    }
    function url_slug(){
        var title = $(this).val(),
            slug = '';
        slug = title.replace(/\s/g,'-').replace(/[^a-zA-Z0-9\-]/g,'').replace(RegExp('-{2,}', 'g'),'-');
        $('#op_page_slug').val(slug.toLowerCase());
    };
    function show_member_fields(el, id, what) {
        el.empty();
        if (what == 'category') {
            el.append(
                $('<option>').text('').val('')
            );
            $.each(cat_options, function(i) {
                var option = cat_options[i];
                if(option.parent === 'parent-' + id) {
                    el.append(
                        $('<option>').text(option.text).val(option.value)
                    );
                }
            });
        } else {
            el.append(
                $('<option>').text('').val('')
            );
            $.each(subcat_options, function(i) {
                var option = subcat_options[i];
                if(option.parent === 'parent-' + id) {
                    el.append(
                        $('<option>').text(option.text).val(option.value)
                    );
                }
            });
        }
        el.val('');
        if (el.selector == '#op_category_id') {
            $('#op_category_id').trigger('change');
        }
        if (el.selector == '#op_category_id1') {
            $('#op_category_id1').trigger('change');
        }
    };

    window.op_refresh_content_layouts = function(){
        $.post(OptimizePress.ajaxurl,{
            action: OptimizePress.SN+'-live-editor-load-layouts',
            _wpnonce: $('#_wpnonce').val(),
            pagebuilder: 'Y'
        },
        function(resp){
            if(typeof resp.error != 'undefined'){
                alert(resp.error);
            } else if(typeof resp.content_layout != 'undefined'){
                $('#content_layout_container_list').html(resp.content_layout);
                $('#view_layouts').trigger('click');
            }
        },
        'json');
    };
}(opjq));
