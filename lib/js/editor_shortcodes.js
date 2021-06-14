opjq(document).ready(function($) {

    // Following elements are not rendered
    // correctly in WYSIWYG, so we just
    // display the shortcode instead
    var renderAsShortcode = [
        'feature_box',
        'feature_box_creator',
    ];

    var shortcode = _.extend({}, {
        initialize: function() {
            var self = this;

            wp.ajax.post('do_shortcode', {
                post_id: $('#post_ID').val(),
                shortcode: self.text,
                nonce: OptimizePress.leNonce
            }).done(function(response) {
                self.content = response;
            }).always(function() {
                self.render(null, true);
                initializeComponents();
            });
        },
        edit: function(shortcodeString) {

            // We need to bookmark a currently
            // selected element so we can
            // replace it upon change
            // tinymce.activeEditor.currentActiveElement = tinymce.activeEditor.selection.getBookmark();
            tinymce.opActiveEditor = tinymce.activeEditor;
            tinymce.opActiveEditor.activeElement = tinymce.opActiveEditor.selection.getBookmark();
            tinymce.opActiveEditor.editElement = true;

            OP_AB.open_dialog(0);

            $.ajax({
                type: "POST",
                url: OptimizePress.ajaxurl,
                data: {
                    action: OptimizePress.SN + '-live-editor-params',
                    _wpnonce: OptimizePress.leNonce,
                    shortcode: shortcodeString
                },
                dataType: 'json'
            }).done(function(response) {
                if ($('.fancybox-wrap').length > 0) {
                    OP_AB.edit_element(response);
                    OptimizePress.currentEditElement = response.attrs.style;
                }
            }).fail(function(error) {
                console.error(error);
            });
        }
    });

    $.each(OptimizePress.shortcodes, function(index, item) {
        if ($.inArray(item, renderAsShortcode) < 0) {
            wp.mce.views.register(
                item,
                _.extend({}, shortcode)
            );
        }
    });

    /**
     * Some components in WYSIWYG need to be initialized.
     * (countdown timer)
     */
    function initializeComponents() {
        window.top.OptimizePress.initCountdownElements();
    }
});
