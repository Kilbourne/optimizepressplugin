var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-order-box.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-order-box.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-order-box.mp4',
                width: '600',
                height: '341'
            }
        },
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: 'previews',
                    addClass: 'op-disable-selected'
                }
            },
            step_2: {
                title_1: {
                    title: 'title',
                    type: 'image-selector',
                    folder: 'titles_1',
                    showOn: {
                        field: 'step_1.style',
                        value: '1'
                    },
                    attr: 'title',
                    events: {
                        change: function(value) {
                            switch (value) {
                                case 'secure-order.png':
                                case 'secure-order-cond.png':
                                    $('#op_assets_core_order_box_title_1_alt').val('Secure Order Form');
                                    break;
                                case 'risk-free.png':
                                case 'risk-free-cond.png':
                                    $('#op_assets_core_order_box_title_1_alt').val('Risk Free Acceptance Form');
                                    break;
                            }
                        }
                    },
                },
                title_1_alt: {
                    // type: 'hidden',
                    showOn: {
                        field: 'step_1.style',
                        value: '1'
                    },
                    default_value: 'Risk Free Acceptance Form'
                },
                header_1: {
                    title: 'header',
                    type: 'image-selector',
                    folder: 'headers_1',
                    showOn: {
                        field: 'step_1.style',
                        value: '1'
                    },
                    attr: 'header',
                    events: {
                        change: function (value) {
                            switch (value) {
                                case 'yes-access-1.png':
                                case 'yes-access-2.png':
                                    $('#op_assets_core_order_box_header_1_alt').val("YES! I Want Instant Access Now! I understand that I'll receive instant access to:");
                                    break;
                            }
                        }
                    }
                },
                header_1_alt: {
                    // type: 'hidden',
                    showOn: {
                        field: 'step_1.style',
                        value: '1'
                    },
                    default_value: "YES! I Want Instant Access Now! I understand that I'll receive instant access to:"
                },
                title_2: {
                    title: 'title',
                    type: 'image-selector',
                    folder: 'titles_2',
                    showOn: {field:'step_1.style',value:'2'},
                    attr: 'title',
                    events: {
                        change: function (value) {
                            switch (value) {
                                case 'risk-free-black.jpg':
                                    $('#op_assets_core_order_box_title_2_alt').val('Risk Free Acceptance Form: Your Order is 100% Safe & Secure');
                                    break;
                                case 'safe-secure.jpg':
                                    $('#op_assets_core_order_box_title_2_alt').val('Secure Order Form: Your Order is 100% Safe & Secure');
                                    break;
                            }
                        }
                    }
                },
                title_2_alt: {
                    // type: 'hidden',
                    showOn: {
                        field: 'step_1.style',
                        value: '2'
                    },
                    default_value: 'Risk Free Acceptance Form: Your Order is 100% Safe & Secure'
                },
                title_3: {
                    title: 'title',
                    showOn: {field:'step_1.style',value:'3'},
                    attr: 'title'
                },
                content: {
                    title: 'content',
                    type: 'wysiwyg',
                    addClass: 'op-hidden-in-edit'
                }
            },
            step_3: {
                microcopy: {
                    text: 'order_box_advanced1',
                    type: 'microcopy'
                },
                microcopy2: {
                    text: 'advanced_warning_2',
                    type: 'microcopy',
                    addClass: 'warning'
                },
                font: {
                    title: 'order_box_font_settings',
                    type: 'font'
                },
                width: {
                    title: 'width',
                    type: 'input',
                    default_value: ''
                },
                microcopy_align: {
                    text: 'width_needed_for_alignment_to_work',
                    type: 'microcopy'
                },
                alignment: {
                    title: 'alignment',
                    type: 'select',
                    values: {'left': 'left', 'center': 'center', 'right': 'right'},
                    default_value: 'center'
                }
            }
        },
        insert_steps: {
            2: { next: 'advanced_options' },
            3: true
        },
        customSettings: function(attrs,steps) {
            var style;

            attrs = attrs.attrs || {};
            style = attrs.style || '1';

            OP_AB.set_font_settings('font', attrs, 'op_assets_core_order_box_font');
            OP_AB.set_selector_value('op_assets_core_order_box_style_container', style);

            if (style == 1) {
                OP_AB.set_selector_value('op_assets_core_order_box_title_1_container', attrs.title || '');
                OP_AB.set_selector_value('op_assets_core_order_box_header_1_container', attrs.header || '');
                $('#op_assets_core_order_box_title_1_alt').val(op_decodeURIComponent(attrs.title_1_alt || ''));
                $('#op_assets_core_order_box_header_1_alt').val(op_decodeURIComponent(attrs.header_1_alt || ''));
            } else if (style == 2) {
                OP_AB.set_selector_value('op_assets_core_order_box_title_2_container', attrs.title || '');
                $('#op_assets_core_order_box_title_2_alt').val(op_decodeURIComponent(attrs.title_2_alt || ''));
            } else if (style == 3) {
                $('#op_assets_core_order_box_title_3').val(attrs.title || '');
            }

            tinyMCE.activeEditor.setContent(attrs.content);
            $('#op_assets_core_order_box_width').val(OP_AB.unautop(attrs.width || ''));
            $('#op_assets_core_order_box_alignment').find('option').each(function () {
                if ($(this).val() == attrs.alignment) {
                    $(this).attr('selected', 'selected');
                }
            });
        }
    };
}(opjq));