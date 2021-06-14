(function() {

    /**
     * Render html template.
     *
     * @param  {Object} boxes
     * @return {String}
     */
    var _renderHtml = function(boxes) {
        var html = '';

        for (var i = 0; i < boxes.length; i++) {
            html += '<div class="opl-box" data-uid="' + boxes[i].uid + '">' +
                        '<div class="opl-box-image">' +
                            '<img class="' + boxes[i].type + '" src="' + OptimizePress.OP_LEADS_URL + 'build/themes/' + boxes[i].theme.thumb_path + '" alt="OptimizeLeads ' + boxes[i].theme.slug + ' box" />' +
                        '</div>' +
                        '<div class="opl-box-name"><p>' + boxes[i].title + '</p></div>' +
                    '</div>';
        }

        return html;
    }

    /**
     * Set box click event listeneres. Event set class "selected" on chosen box. 
     *
     * @return {Void}
     */
    var _set_click_listeners = function() {
        opjq('.opl-boxes').on('click', '.opl-box', function() {
            var boxes = opjq('.opl-box.selected');

            for (var i = 0; i < boxes.length; i++) {
                boxes.removeClass('selected');
            }

            opjq(this).addClass('selected');
        });
    }

    /**
     * Ajax request to get boxes. Boxes are returned either from WP transient or OptimizeLeads API.
     * Create logic for OptimizeLeads editor button.
     *
     * @return {Void}
     */
    var _getDataAndMakeOplButton = function() {

        // Set Opl tinymce modal width7height in percentage
        var bodyWidth = parseInt(opjq(window).width() * 0.55),
            bodyHeight = parseInt(opjq(window).height() * 0.6);

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            bodyWidth = parseInt(opjq(window).width() * 0.9),
            bodyHeight = parseInt(opjq(window).height() * 0.6);
        }

        // Make OptimizeLeads Button
        tinymce.PluginManager.add('custom_mce_button', function(editor, url) {
            editor.addButton('custom_mce_button', {
                text: 'OptimizeLeads',
                icon: 'optimizeleads-wysiwyg-button',
                onclick: function() {

                    // Open tinymce modal with optimizeleads boxes
                    editor.windowManager.open({
                        title: 'Insert OptimizeLeads Box',
                        classes: 'opl-boxes-container',
                        width: bodyWidth,
                        height: bodyHeight,
                        body: [{
                            type: 'container',
                            classes: 'opl-boxes-container-body',
                            name: 'opl-boxes-container',
                            html: '<div class="opl-boxes"><img class="opl-boxes-spinner" src="'+ OptimizePress.OP_URL +'lib/images/ajax-loader.gif" /></div>'
                        }],
                        onsubmit: function(e) {
                            var box_uid = opjq('.opl-box.selected').data('uid');

                            if (typeof box_uid === 'undefined') {
                                return;
                            }

                            editor.insertContent('[op-opleads uid="' + box_uid + '"]');
                        }
                    });

                    //Get data from optimizeleads and store to variable
                    opjq.ajax({
                        type: 'POST',
                        url: OptimizePress.ajaxurl,
                        data: { 'action': OptimizePress.SN + '-get-optimizeleads-boxes' },
                        dataType: 'json',
                        async: true,
                        success: function(data) {
                            if (data.code === 401 || typeof data.error !== "undefined") {
                                editor.windowManager.alert("Please, check your OptimizeLeads Api Key and provide a valid one.");
                                editor.windowManager.close();
                                return;
                            }

                            var html = _renderHtml(data.boxes);
                            opjq('.opl-boxes-spinner').hide();
                            opjq('.opl-boxes').append(html).hide().fadeIn('slow');
                        },
                    });

                    _set_click_listeners();
                }
            });
        });
    }

    // Start
    _getDataAndMakeOplButton();

})();