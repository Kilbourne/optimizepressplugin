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

}(opjq));