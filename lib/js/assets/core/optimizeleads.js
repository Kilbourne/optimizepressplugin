var op_asset_settings = (function ($) {

    /**
     * We retrieve all OptimizeLeads boxes for the entered api key
     */
    $.ajax({
        type: 'POST',
        url: OptimizePress.ajaxurl,
        data: { 'action': OptimizePress.SN + '-get-optimizeleads-boxes' },
        dataType: 'json',
        success: function(response) {
            var boxes;
            var i = 0;
            var html = '';
            var assetListIntervalId;

            // flag to indicate if at least one box can embedded
            var boxToPublish = false;

            if (typeof response !== 'object') {
                $('.optimizeleads-no-api-key').removeClass('optimizeleads-no-api-key--hidden');
                $('.op-optimizeleads-styles').hide();
                return false;
            }

            if (response.error == 'no_box_uid') {
                console.error('No box uid sent. [OPLJS: 26]');
                // alert('Sorry, something went terribly wrong. Please reload the page and try again.');
                return false;
            }

            if (response.error == 'no_api_key') {
                $('.optimizeleads-no-api-key').removeClass('optimizeleads-no-api-key--hidden');
                $('.op-optimizeleads-styles').hide();
                return false;
            }

            if (response.error === true && response.code === 401) {
                $('.optimizeleads-invalid-api-key').removeClass('optimizeleads-invalid-api-key--hidden');
                $('.op-optimizeleads-styles').hide();
                return false;
            }


            if (!response.boxes) {
                $('.optimizeleads-no-boxes').removeClass('optimizeleads-no-boxes--hidden');
                $('.op-optimizeleads-styles').hide();
                return false;
            }

            boxes = response.boxes;

            for (i = 0; i < boxes.length; i += 1) {

                // boxes[i].is_connected_to_list && -> NOT ALL ACTIVE BOXES ARE CONNECTED TO LIST
                if (boxes[i].embed_code && boxes[i].can_be_published) {

                    boxToPublish = true;
                    thumb_stretch = boxes[i].theme.thumb_stretch ? ' preview-stretch' : '';

                    html += '<li class="op-asset-dropdown-list-item optimizeleads-boxes-list-item optimizeleads-boxes-list-item--loaded">'
                        html += '<a href="#" data-uid="' + boxes[i].uid + '" data-id="' + boxes[i].id + '">';
                            html += '<h3>' + boxes[i].title  +'</h3>';
                            html += '<img src="' + OptimizePress.OP_LEADS_THEMES_URL + boxes[i].theme.thumb_path + '" alt="' + boxes[i].title + '" class="preview-position-' + (boxes[i].theme.thumb_position || 'center') + thumb_stretch + '" />';
                        html += '</a>';
                    html +='</li>';

                }

            }

            // There are boxes returned by api, but none are integrated or ready to publish
            if (!boxToPublish) {
                $('.optimizeleads-no-boxes').removeClass('optimizeleads-no-boxes--hidden');
                $('.op-optimizeleads-styles').hide();
                return false;
            }

            // Asset list is retrieved from the server and inserted into html,
            // so we will try to insert this multiple times to ensure
            // we override it with the original code
            assetListIntervalId = setInterval(function () {
                var $ul = $('.op-optimizeleads-styles .op-asset-dropdown-list ul');

                if ($ul.length > 0) {
                    clearInterval(assetListIntervalId);
                    $('.op-optimizeleads-styles .loading-asset-dropdown').removeClass('loading-asset-dropdown');
                    $ul.append(html);
                }
            }, 200);

        },
    });

    /**
     * When user selects a box, we retrieve embed_code for the selected box
     */
    $('body').on('click', '.optimizeleads-boxes-list-item a', function (e) {
        var box_uid = $(this).attr('data-uid');

        $('.optimizeleads-embed-code')
            .addClass('optimizeleads-embed-code--hidden')
            .find('textarea')
            .val('');

        $('.optimizeleads-embed-code-loading').removeClass('optimizeleads-embed-code-loading--hidden');

        $.ajax({
            type: 'POST',
            url: OptimizePress.ajaxurl,
            data: {
                'action': OptimizePress.SN + '-get-optimizeleads-box',
                'uid': box_uid
            },
            dataType: 'json',
            success: function(response) {
                $('.optimizeleads-embed-code')
                    .removeClass('optimizeleads-embed-code--hidden')
                    .find('textarea')
                    .val(response.box.embed_code);

                $('.optimizeleads-box-title')
                    .find('input')
                    .val(response.box.title);

                $('.optimizeleads-embed-code-loading').addClass('optimizeleads-embed-code-loading--hidden');
            },
        });

        OptimizePress.LiveEditor.show_slide(3);
    });

    return {
        // help_vids: {
        //     step_1: {
        //         url: 'http://op2-inapp.s3.amazonaws.com/elements-custom-html.mp4',
        //         width: '600',
        //         height: '341'
        //     }
        // },
        attributes: {
            step_1: {
                optimizeleads_no_api_key: {
                    addClass: 'optimizeleads-no-api-key optimizeleads-no-api-key--hidden',
                    type: 'microcopy',
                    text: 'optimizeleads_no_api_key'
                },
                optimizeleads_invalid_api_key: {
                    addClass: 'optimizeleads-invalid-api-key optimizeleads-invalid-api-key--hidden',
                    type: 'microcopy',
                    text: 'optimizeleads_invalid_api_key'
                },
                optimizeleads_no_boxes: {
                    addClass: 'optimizeleads-no-boxes optimizeleads-no-boxes--hidden',
                    type: 'microcopy',
                    text: 'optimizeleads_no_boxes'
                },
                style: {
                    type: 'style-selector',
                    folder: false,
                    addClass: 'op-disable-selected op-optimizeleads-styles',
                }
            },
            step_2: {
                optimizeleads_embed_code_description: {
                    type: 'microcopy',
                    text: 'optimizeleads_embed_code_description'
                },
                optimizeleads_embed_code_loading: {
                    type: 'paragraph',
                    text: OP_AB.translate('optimizeleads_embed_code_loading'),
                    addClass: 'optimizeleads-embed-code-loading',
                },
                // optimizeleads_embed_code: {
                content: {
                    addClass: 'optimizeleads-embed-code optimizeleads-embed-code--hidden',
                    title: 'optimizeleads_embed_code',
                    type: 'textarea',
                    format: 'custom',
                    readonly: true,
                    required: true,
                },
                optimizeleads_box_title: {
                    addClass: 'optimizeleads-box-title',
                    type: 'hidden',
                }
            },
            step_3: {
                optimizeleads_embed_code_description: {
                    type: 'microcopy',
                    text: "You don't have any boxes created in OptimizeLeads. Please log in and create a box, and it will appear here."
                },
            }
        },
        insert_steps: { 2: true },

        // If we're editing the element,
        // we just want to show the embed code
        // and hide the embed code loading indicator
        customSettings: function(attrs, steps) {

            var data = attrs.attrs;

            $('.optimizeleads-embed-code')
                    .removeClass('optimizeleads-embed-code--hidden')
                    .find('textarea')
                    .val(op_decodeURIComponent(data.content || ''));

            $('.optimizeleads-box-title')
                    .find('input')
                    .val(op_decodeURIComponent(data.optimizeleads_box_title || ''));

            $('.optimizeleads-embed-code-loading')
                .addClass('optimizeleads-embed-code-loading--hidden');

        }

    }

}(opjq));