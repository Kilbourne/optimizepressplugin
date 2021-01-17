;(function($){
    var page_container, current_select = null;
    $(document).ready(function(){
        page_container = $('#launch_suite_pages');
        $('body').on('change', '#funnel_select', function(){
            if(parseInt($('#funnel_id').val()) > 0){
                if($(this).val() != $('#funnel_id').val()){
                    document.location.href = OptimizePress.launch_suite_url.replace(/&amp;/g, '&')+$(this).val();
                }
            }
        }).trigger('change');

        page_container.sortable({
            items:'> div.section-stage',
            handle:'div.show-hide-panel',
            axis: 'y',
            update: refresh_titles
        });

        page_container.find('.panel-controlx').iButton().end().on('change','select.value_page',function(e){
            var url = OptimizePress.launch_page_urls[$(this).val()] || '';
            var title = $(this).find('option:selected').text();
            var $value_page = $(this).parent().siblings('.tab-navigation_text').find('.active-link-text');
            if ($.trim($value_page.val())=='') $value_page.val(title);
            if ($.trim($value_page.val())=='(Select Page...)') $value_page.val('');
            $(this).parent().find('input.value_page_url').val(url).end().find('input.value_page_access_url').val(add_key(url));
        }).on('click','div.tab-delete_stage button',function(){
            $(this).closest('.section-stage').remove();
            refresh_titles();
        });

        // open cart on, removes hide cart and sets it to false
        $('input[name="op[funnel_pages][sales][page_setup][open_sales_cart]"]').change(function(e){
            if($(this).is(':checked')){
                $('input[name="op[funnel_pages][sales][page_setup][hide_cart]"]').removeAttr('checked').trigger('change');
                $('#hide_cart').hide();
            } else {
                $('#hide_cart').show();
            }
        }).trigger('change');

        $('#launch_suite_sales select.value_page').change(function(){
            var url = OptimizePress.launch_page_urls[$(this).val()] || '';
            $(this).parent().find('input.value_page_url').val(url).end().find('input.value_page_access_url').val(add_key(url));
        }).trigger('change');

        $('#op_launch_settings_gateway_key_key').change(function(){
            page_container.find('select.value_page').trigger('change');
        });

        $('#op_gateway_key_enabled').change(function(){
            page_container.find('select.value_page').trigger('change');
            var cl1 = '.gateway_off', cl2 = '.gateway_on';
            if($(this).is(':checked')){
                cl1 = '.gateway_on';
                cl2 = '.gateway_off';
            }
            page_container.add('#launch_suite_sales').find(cl1).css('display','block').end().find(cl2).css('display','none');
        }).trigger('change');

        var selected_class = 'op-bsw-grey-panel-tabs-selected';
        $('body').on('click', '#launch_suite_add_section', function (e) {
            e.preventDefault();
            var tmpl = $('#launch_suite_new_item').html(),
                elcount = page_container.find('div.section-stage').length+1;
            tmpl = tmpl.replace(/9999/g,elcount).replace(/# TITLE #/ig,OptimizePress.launch_section_title.replace(/%1\$s/,elcount));
            page_container.append(tmpl).find('div.section-stage:last').find('ul.op-bsw-grey-panel-tabs').op_tabs().end().find('.panel-controlx').iButton().end().find('select.value_page').trigger('change');
            $('#op_gateway_key_enabled').trigger('change');
            add_page_link();
            bind_content_sliders();
        });

        add_page_link();
        init_funnel_switch();
        bind_content_sliders();
    });

    function add_page_link(){
        $('body').on('click', '#launch_suite_pages .add-new-page, #launch_suite_sales .add-new-page', function (e) {
            e.preventDefault();
            current_select = $(this).prev();
            $('#toplevel_page_optimizepress a[href$="page=optimizepress-page-builder"]').trigger('click');
        });
    };

    function init_funnel_switch(){
        $('body').on('click', '#funnel_delete', function (e) {

            var funnel_id = $('#funnel_select').val();

            if (!confirm('Are you sure you want to delete this funnel?')) {
                return false;
            }

            $.post(
                OptimizePress.ajaxurl,
                {
                    action:     OptimizePress.SN + '-launch-suite-delete',
                    _wpnonce:   $('#_wpnonce').val(),
                    funnel_id:  funnel_id
                },
                function(response) {
                    document.location.replace(document.location.href.replace('&funnel_id=' + funnel_id, ''));
                }
            );
            return false;
        });

        $('body').on('click', '#funnel_switch_create_new', function (e) {
            e.preventDefault();
            $('#launch_funnel_select:visible').fadeOut('fast',function () {
                $('#launch_funnel_new').fadeIn('fast');
            });
        });

        $('body').on('click', '#funnel_switch_select', function (e) {
            e.preventDefault();
            $('#launch_funnel_new:visible').fadeOut('fast',function () {
                $('#launch_funnel_select').fadeIn('fast');
            });
        });

        $('body').on('click', '#add_new_funnel', function (e) {
            e.preventDefault();
            var waiting = $(this).next().find('img').fadeIn('fast'), name = $('#new_funnel').val(),
                data = {
                    action: OptimizePress.SN+'-launch-suite-create',
                    _wpnonce: $('#_wpnonce').val(),
                    funnel_name: name
                };
            $.post(OptimizePress.ajaxurl,data,function(resp){
                waiting.fadeOut('fast');
                if(typeof resp.error != 'undefined'){
                    alert(resp.error);
                } else {
                    $('#funnel_select').html(resp.html).trigger('change');
                    document.location.reload();
                }
            },'json');
        });
    };
    function refresh_titles(){
        var counter = 1;
        page_container.find('> div.section-stage > div.op-bsw-grey-panel-header > h3 > a').each(function(){
            $(this).text(OptimizePress.launch_section_title.replace(/%1\$s/,counter));
            counter++;
        });
    };
    function add_key(url){
        if(url == ''){
            return '';
        }
        if($('#op_gateway_key_enabled').is(':checked')){
            return add_param(url,'gw',$('#op_launch_settings_gateway_key_key').val());
        }
        return url;
    };
    function add_param(url,name,value){
        return url + (url.indexOf('?') != -1 ? '&' : '?') + name+'='+encodeURIComponent(value);
    };
    window.op_launch_suite_update_selects = function(page_id){
        var data = {
            action: OptimizePress.SN+'-launch-suite-refresh_dropdown',
            _wpnonce: $('#_wpnonce').val(),
            funnel_id: $('#funnel_id').val()
        };
        $.post(OptimizePress.ajaxurl,data,function(resp){
            if(typeof resp.error != 'undefined'){
                alert(resp.error);
            } else {
                $('.landing_page,.value_page,#launch_suite_sales select,#launch_suite_new_item select').each(function(){
                    var curv = $(this).val();
                    $(this).html(resp.html).val(curv);
                });
                if(current_select !== null){
                    current_select.val(page_id);
                }
            }
        },'json');
    };
    function bind_content_sliders(){
        var $btns = $('.op-content-slider-button'); //Get all the content slider buttons

        //Loop through each one
        $btns.each(function(index, value){
            var $target = $(this).parent().prev('.op-content-slider'); //Get the target of the current button (the content slider)
            var $cur_btn = $(this); //Used later on in the script for callbacks

            //Initialize the show action on click of the show gallery button
            $(this).unbind('click').click(function(e){
                // var scrollY = window.pageYOffset; //Get the current position of the viewport
                // $target.show().animate({top:scrollY},400); //Scroll the box to the viewport
                $target.css({ top: 0 });
                e.preventDefault();
            });

            //Initialize the close button
            $target.find('.hide-the-panda').unbind('click').click(function(e){
                // var scrollY = window.pageYOffset; //Get the current position of the viewport

                //Scroll the box to the viewport
                // $target.animate({top:-(scrollY)},400, function(){
                //     $(this).hide(); //Hide the box after it is out of sight
                // });
                $target.css({ top: '-100%' });

                e.preventDefault();
            });

            //Init the click handlers for the images inside the content box
            $target.delegate('ul.op-image-slider-content li a','click',function(e){
                var $input = $cur_btn.next('input.op-gallery-value'); //Grab ahold of the hidden input for the gallery
                var $preview = $input.next('.file-preview').find('.content'); //Get ahold of the preview area
                // var src = $(this).find('img').attr('src'); //Get ahold of the image src
                var src = $(this).attr('src'); //Get ahold of the image src

                //Create the html for the preview area
                var html = '<a class="preview-image" target="_blank" href="' + src + '"><img alt="uploaded-image" src="' + src + '"></a><a class="remove-file button" href="#remove">Remove Image</a>';

                //Put the image source into the hidden input for form submission
                $input.val(src);

                //Navigate through the DOM to the uploader preview image and value and set accordingly
                $input.parent().next('.op-file-uploader').find('.file-preview .content').empty().html(html).find('.remove-file').click(function(){
                    $(this).parent().empty().parent('.file-preview').prev('.op-uploader-value').val('');
                }).parent().parent('.file-preview').prev('.op-uploader-value').val(src);

                //Animate the box off of the screen and hide it
                // $target.animate({top:-700},400, function(){
                //     $(this).hide();
                // });
                $target.css({ top: '-100%' });

                e.preventDefault();
            });
        });
    }
}(opjq));