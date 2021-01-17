;(function($){
    var container;
    $(document).ready(function(){
        container = $('#op-post-page');
        $('#titlediv').after(container);
        $('#op-post-tabs > li a',container).click(function(e){
            e.preventDefault();
            var show = '', hide = '';
            switch($(this).get_hash()){
                case 'wordpress':
                    show = '#postdivrich,#normal-sortables,#advanced-sortables';
                    hide = '#op-settings-container,#op-pagebuilder-container';
                    break;
                case 'settings':
                    show = '#op-settings-container';
                    hide = '#postdivrich,#normal-sortables,#advanced-sortables,#op-pagebuilder-container';
                    break;
                case 'pagebuilder':
                    show = '#op-pagebuilder-container';
                    hide = '#postdivrich,#normal-sortables,#advanced-sortables,#op-settings-container';
                    break;
            }
            $(show).show();
            $(hide).hide();
            $('.selected','#op-post-tabs').removeClass('selected');
            $(this).parent().addClass('selected');
        });
        /*
         * If there are no meta boxes we'll automatically select OP tab (of course, onlf for pages that are built with OP page builder)
         */
        if ($('#op-post-tabs .tab-pagebuilder').length == 0) {
            $('#op-post-tabs > li a',container).filter(':first').trigger('click');
        } else {
            $('#op-post-tabs > li a',container).filter(':nth-child(1)').trigger('click');
        }



        /*$('.op-insert-asset').click(function(e){
            $('#op_asset_browser .asset-list a:first').trigger('click');
            $('#op_assets_settings_container,#op_assets_waiting,#op_assets_settings_container .settings-container').css('display','none');
            tb_show(OptimizePress.assets_dialog_title, '#TB_inline?inlineId=op_asset_browser_container');
            $(window).trigger('resize');
            e.preventDefault();
        });*/
    });

    $(window).load(function(){
        /*$('#post-preview').unbind('click').click(function(){
            tb_show('','about:blank?TB_iframe=1&width=940&height=500');
            if ( $('#auto_draft').val() == '1' && notSaved ) {
                autosaveDelayPreview = true;
                autosave();
                return false;
            }
            doPreview();
            return false;
        });*/
        /*
        var el = $('<input type="button" class="ed_button" />').attr({id:'qt_content_op_assets',value:OptimizePress.insert_asset});
        el.appendTo('#ed_toolbar').click(function(e){
                var vp = tinymce.DOM.getViewPort(),
                    H = vp.h - 114, W = ( 900 < vp.w ) ? 900 : vp.w;
                $('#op_asset_browser .asset-list a:first').trigger('click');
                $('#op_assets_settings_container,#op_assets_waiting,#op_assets_settings_container .settings-container').css('display','none');
                tb_show(OptimizePress.assets_dialog_title, '#TB_inline?inlineId=op_asset_browser_container');//&width='+W+'&height='+H);
                $(window).trigger('resize');
            e.preventDefault();
        });*/

        /**
         * On post pages, inserting membership order button (for example) doesn't work unless we set active textarea.
         */
        $('.op-insert-asset').click(function(e){
            if (tinyMCE && tinyMCE.activeEditor && !$(tinyMCE.activeEditor.id).is(':visible')) {
                tinyMCE.execCommand('mceFocus', false, $('.wp-editor-container:visible').eq(0).find('.wp-editor-area').attr('id'));
            }
        });

        $(window).resize(function(){
            var el = $('#TB_window:visible #op_asset_browser');
            if(el.length > 0){
                var vp = tinymce.DOM.getViewPort(),
                    H = vp.h-118, W = ( 900 < vp.w ) ? 900 : vp.w;
                $('#TB_window').css({marginLeft: '-' + parseInt((W / 2),10) + 'px', width: W + 'px', height: H+'px'});
                $('#TB_ajaxContent').height(H-45).width(W-30);
            }
            el = $('#TB_window:visible #TB_iframeContent.op-preview-iframe');
            if(el.length > 0){
                var H = 600, W = 1050;
                $('#TB_window').css({marginLeft: '-' + parseInt((W / 2),10) + 'px', width: W + 'px', height: H+'px'});
                $('#TB_iframeContent').height(H).width(W);
            }
        });
    });
    function doPreview() {
        $('input#wp-preview').val('dopreview');
        $('form#post').attr('target', $('#TB_iframeContent').addClass('op-preview-iframe').attr('name')).submit().attr('target', '');

        if ( $.browser.safari ) {
            $('form#post').attr('action', function(index, value) {
                return value + '?t=' + new Date().getTime();
            });
        }

        $('input#wp-preview').val('');
    };
}(opjq));