var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-button.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-button.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-button.mp4',
                width: '600',
                height: '341'
            }
        },
        attributes: {
            step_1: {
                type: {
                    type: 'style-selector',
                    folder: '../button/previews',
                    addClass: 'op-disable-selected',
                    // ignore_vals: ['blank']
                    events: {
                        change: function (value) {
                            if (value === 'blank') {
                                $('.field-id-op_assets_core_op_popup_popup_button').hide();
                                OP_AB.show_slide(4, true);
                                return false;
                            } else {
                                $('.field-id-op_assets_core_op_popup_popup_button').show();
                            }
                        }
                    }
                }
            },
            step_2: {
                only_advanced: {
                    text: OP_AB.translate('only_advanced_fields_available_when_editing'),
                    type: 'paragraph',
                    showOn: {field:'step_1.type',value:['blank']}
                },
                button_preview: {
                    title: '',
                    type: 'button_preview',
                    folder: '../button/presets',
                    selectorClass: 'icon-view-128',
                    showOn: {field:'step_1.type',value:'1'},
                    showSubtext: false,
                    showShine: false,
                    showGradient: false,
                    addClass: 'button'
                },
                color_1: {
                    title: 'color',
                    type: 'select',
                    values: {'blue':'blue','green':'green','light-green':'light_green','orange':'orange','red':'red','silver':'silver','teal':'teal'},
                    showOn: {field:'step_1.type',value:'2'}
                },
                bg_color_2: {
                    title: 'bg_img',
                    type: 'select',
                    values: {'':'yellow','silver':'silver'},
                    showOn: {field:'step_1.type',value:'3'}
                },
                bg_color_5: {
                    title: 'bg_color',
                    type: 'select',
                    values: {'green':'green','orange':'orange'},
                    showOn: {field:'step_1.type',value:'6'}
                },
                bg_img_4: {
                    title: 'bg_img',
                    type: 'style-selector',
                    folder: '../button/bg_img_4/previews',
                    showOn: {field:'step_1.type',value:'5'}
                },
                bg_img_cart: {
                    title: 'bg_img',
                    type: 'image-selector',
                    folder: '../button/cart/previews',
                    showOn: {field:'step_1.type',value:'cart'}
                },
                border_3: {
                    title: 'border_style',
                    type: 'select',
                    values: {'':'normal','rounded':'rounded'},
                    showOn: {field:'step_1.type',value:'4'}
                },
                size_3: {
                    title: 'size',
                    type: 'select',
                    values: {'small':'small','medium':'medium','large':'large'},
                    showOn: {field:'step_1.type',value:'4'}
                },
                color_3: {
                    title: 'color',
                    type: 'select',
                    values: {'black':'black','blue':'blue','brightgreen':'bright_green','darkblue':'dark_blue','darkgrey':'dark_grey','darkorange':'dark_orange','green':'green','lightblue':'light_blue','lightgreen':'light_green','lightorange':'light_orange','lightred':'light_red','lightviolet':'light_violet','orange':'orange','pink':'pink','red':'red','silver':'silver','teal':'teal','violet':'violet','yellow':'yellow'},
                    showOn: {field:'step_1.type',value:'4'}
                },
                content: {
                    title: 'text',
                    default_value: 'Button Text',
                    showOn: {field:'step_1.type',value:['0', '2', '4']}
                },
                text_2: {
                    title: 'text',
                    type: 'image-selector',
                    folder: '../button/button-text-blue',
                    showOn: {field:'step_1.type',value:'3'}
                },
                text_4: {
                    title: 'text',
                    type: 'select',
                    values: {'light':'light','dark':'dark'},
                    default_value: 'dark',
                    showOn: {field:'step_1.type',value:'5'},
                    showFields: {
                        light: {
                            title: 'text',
                            type: 'image-selector',
                            folder: '../button/button-4-text/light',
                            selectorClass: 'light-text'
                        },
                        dark: {
                            title: 'text',
                            type: 'image-selector',
                            folder: '../button/button-4-text/dark'
                        }
                    }
                },
                text_5: {
                    title: 'text',
                    type: 'image-selector',
                    folder: '../button/button5',
                    showOn: {field:'step_1.type',value:'6'},
                    selectorClass: 'light-text'
                },
                image: {
                    title: 'image',
                    type: 'media',
                    callback: function(){
                        var v = $(this).val();
                        if(v != ''){
                            var img = new Image();
                            /*$(img).load(function(){
                                $('#op_assets_core_img_alert_width').val(img.width);
                            });*/
                            img.src = v;
                        }
                    },
                    showOn: {field:'step_1.type',value:['7']}
                },
                left_column: {
                    type: 'column',
                    addClass: 'left_column',
                    showOn: {field: 'step_1.type', value: '1'},
                    elements: {
                        text_box: {
                            title: 'text',
                            type: 'container',
                            attributes: {
                                text_properties_1: {
                                    type: 'text_properties',
                                    text_default: 'Get Started Now',
                                    size_default: 32,
                                    color_default: '#000000',
                                    bold_default: true,
                                    italic_default: false,
                                    underline_default: false
                                },
                                letter_spacing_1: {
                                    title: 'letter_spacing',
                                    type: 'slider',
                                    min: -10,
                                    max: 10,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                }
                            }
                        },
                        subtext_box: {
                            title: 'subtext',
                            type: 'container',
                            showPanelControl: true,
                            default_value: false,
                            attributes: {
                                text_properties_2: {
                                    type: 'text_properties',
                                    text_default: '',
                                    size_default: 15,
                                    color_default: '#ffffff',
                                    bold_default: false,
                                    italic_default: false,
                                    underline_default: false
                                },
                                letter_spacing_2: {
                                    title: 'letter_spacing',
                                    type: 'slider',
                                    min: -10,
                                    max: 10,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                }
                            }
                        },
                        text_shadow: {
                            title: 'text_shadow',
                            type: 'container',
                            showPanelControl: true,
                            default_value: true,
                            attributes: {
                                vertical_axis_1: {
                                    title: 'vertical_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 1,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                horizontal_axis_1: {
                                    title: 'horizontal_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                shadow_color_1: {
                                    title: 'shadow_color',
                                    type: 'color',
                                    default_value: '#ffff00'
                                },
                                blur_radius_1: {
                                    title: 'blur_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                }
                            }
                        }
                    }
                },
                right_column: {
                    type: 'column',
                    addClass: 'right_column',
                    showOn: {field: 'step_1.type', value: '1'},
                    elements: {
                        styling: {
                            title: 'styling',
                            type: 'container',
                            attributes: {
                                height_1: {
                                    title: 'height',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 30,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                width_1: {
                                    title: 'width',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 40,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                border_size_1: {
                                    title: 'border_size',
                                    type: 'slider',
                                    min: 0,
                                    max: 25,
                                    default_value: 1,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                border_radius_1: {
                                    title: 'border_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 6,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                border_color_1: {
                                    title: 'border_color',
                                    type: 'color',
                                    default_value: '#000000'
                                },
                                border_opacity_1: {
                                    title: 'border_opacity',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 100,
                                    showOutputElement: true,
                                    unit: '%'
                                },
                                background_label_1: {
                                    type: 'custom_html',
                                    html: 'Background',
                                    addClass: 'background-label-row'
                                },
                                gradient_1: {
                                    title: 'gradient',
                                    type: 'checkbox',
                                    default_value: false
                                },
                                shine_1: {
                                    title: 'shine',
                                    type: 'checkbox',
                                    default_value: true
                                },
                                gradient_start_color_1: {
                                    type: 'color',
                                    default_value: '#ffff00'
                                },
                                gradient_end_color_2: {
                                    type: 'color',
                                    default_value: '#ffa035'
                                }
                            }
                        },
                        drop_shadow: {
                            title: 'drop_shadow',
                            type: 'container',
                            showPanelControl: true,
                            default_value: true,
                            attributes: {
                                vertical_axis_2: {
                                    title: 'vertical_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 1,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                horizontal_axis_2: {
                                    title: 'horizontal_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                border_radius_2: {
                                    title: 'blur_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 50,
                                    default_value: 1,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                spread_radius_1: {
                                    title: 'spread_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                shadow_color_2: {
                                    title: 'shadow_color',
                                    type: 'color',
                                    default_value: '#000000'
                                },
                                opacity_1: {
                                    title: 'opacity',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 50,
                                    showOutputElement: true,
                                    unit: '%'
                                }
                            }
                        },
                        inset_shadow: {
                            title: 'inner_shadow',
                            type: 'container',
                            showPanelControl: true,
                            default_value: true,
                            attributes: {
                                vertical_axis_3: {
                                    title: 'vertical_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                horizontal_axis_3: {
                                    title: 'horizontal_axis',
                                    type: 'slider',
                                    min: -50,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                border_radius_3: {
                                    title: 'blur_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 50,
                                    default_value: 0,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                spread_radius_2: {
                                    title: 'spread_radius',
                                    type: 'slider',
                                    min: 0,
                                    max: 50,
                                    default_value: 1,
                                    showOutputElement: true,
                                    unit: 'px'
                                },
                                shadow_color_3: {
                                    title: 'shadow_color',
                                    type: 'color',
                                    default_value: '#ffff00'
                                },
                                opacity_2: {
                                    title: 'opacity',
                                    type: 'slider',
                                    min: 0,
                                    max: 100,
                                    default_value: 50,
                                    showOutputElement: true,
                                    unit: '%'
                                }
                            }
                        }
                    }
                }
                // // href: {
                //  title: 'link_url'
                // },
                // new_window: {
                //  title: 'new_window',
                //  type: 'checkbox'
                // }
            },
            step_3: {
                popup_container: {
                    title: 'popup_container',
                    type: 'container',
                    addClass: 'op-popup-advanced-options-popup-container',
                    default_value: true,
                    attributes: {
                        popup_width: {
                            title: 'popup_width',
                            addClass: 'op-popup-container-width',
                            default_value: 700
                        },
                        open_effect: {
                            title: 'open_effect',
                            type: 'radio',
                            addClass: 'op-popup-container-item',
                            values: {
                                'zoomIn': 'zoomIn',
                                'fade': 'fade',
                                'none': 'none'
                            },
                            default_value: 'fade'
                        },
                        close_effect: {
                            title: 'close_effect',
                            type: 'radio',
                            addClass: 'op-popup-container-item',
                            values: {
                                'zoomOut': 'zoomOut',
                                'fade': 'fade',
                                'none': 'none'
                            },
                            default_value: 'fade'
                        },
                        // open_method: {
                        //  title: 'open_method',
                        //  type: 'radio',
                        //  values: {
                        //      'zoomIn': 'zoomIn',
                        //      'changeIn': 'changeIn'
                        //  },
                        //  default_value: 'zoomIn'
                        // },
                        // close_method: {
                        //  title: 'close_method',
                        //  type: 'radio',
                        //  values: {
                        //      'zoomOut': 'zoomOut',
                        //      'changeOut': 'changeOut'
                        //  },
                        //  default_value: 'zoomOut'
                        // },
                        open_speed: {
                            title: 'open_speed',
                            type: 'radio',
                            addClass: 'op-popup-container-item',
                            values: {
                                'slow': 'slow',
                                'normal': 'normal',
                                'fast': 'fast',
                            },
                            default_value: 'normal'
                        },
                        close_speed: {
                            title: 'close_speed',
                            type: 'radio',
                            addClass: 'op-popup-container-item',
                            values: {
                                'slow': 'slow',
                                'normal': 'normal',
                                'fast': 'fast',
                            },
                            default_value: 'normal'
                        },
                        popup_padding_top: {
                            title: 'top_padding',
                            default_value: 20,
                            addClass: 'pixel-width-field op-popup-container-padding'
                        },
                        popup_padding_bottom: {
                            title: 'bottom_padding',
                            default_value: 20,
                            addClass: 'pixel-width-field op-popup-container-padding'
                        },
                        popup_padding_left: {
                            title: 'left_padding',
                            default_value: 30,
                            addClass: 'pixel-width-field op-popup-container-padding'
                        },
                        popup_padding_right: {
                            title: 'right_padding',
                            default_value: 30,
                            addClass: 'pixel-width-field op-popup-container-padding'
                        },
                        popup_border_color: {
                            title: 'border_color',
                            type: 'color',
                            default_value: '#ffffff',
                            addClass: 'op-popup-container-border-color',
                        },
                        popup_border_size: {
                            title: 'border_size',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            default_value: 15,
                            showOutputElement: true,
                            unit: 'px',
                            addClass: 'op-popup-container-border-size',
                        },
                        popup_id: {
                            type: 'hidden',
                            default_value: 'op_popup_id_' + new Date().getTime()
                        },
                    }
                },
                popup_button: {
                    title: 'popup_button',
                    type: 'container',
                    addClass: 'op-popup-advanced-options-popup-button',
                    attributes: {
                        button_cc: {
                            type: 'hidden'
                        },
                        button_cc_icons: {
                            title: 'credit_card_icons',
                            type: 'checkbox',
                            folder: '../button/cc_icons',
                            exclude: true,
                            appendTo: 'op_assets_core_op_popup_popup_button_button_cc',
                            func: 'append'
                        },
                        button_align: {
                            title: 'alignment',
                            type: 'radio',
                            values: {
                                'left': 'left',
                                'center': 'center',
                                'right': 'right'
                            },
                            default_value: 'center'
                        }
                    }
                },
                op_pop: {
                    title: 'overlay_pop',
                    type: 'container',
                    addClass: 'op-popup-advanced-options-overlay-pop',
                    attributes: {
                        pop_info: {
                            type: 'paragraph',
                            text: OP_AB.translate('overlay_pop_info'),
                        },
                        pop_exit_intent: {
                         title: 'overlay_pop_exit_intent',
                         addClass: 'op-popup-container-item-full',
                         type: 'checkbox',
                        },
                        pop_trigger_time: {
                            title: 'overlay_pop_trigger_time',
                            addClass: 'op-popup-container-item-full',
                            default_value: 0
                        },
                        pop_trigger_dontshow: {
                            title: 'overlay_pop_trigger_dontshow',
                            addClass: 'op-popup-container-item-full',
                            default_value: 0
                        },
                        pop_dont_show_on_mobile: {
                            addClass: 'op-popup-container-item-full op-popup-container-item-gap',
                            title: 'overlay_pop_dont_show_on_mobile',
                            type: 'checkbox'
                        },
                        pop_dont_show_on_tablet: {
                            addClass: 'op-popup-container-item-full',
                            title: 'overlay_pop_dont_show_on_tablet',
                            type: 'checkbox'
                        }
                    }
                }
            }
        },
        insert_steps: {
            2:{
                next:'advanced_options',
                /*actions: {
                    save: {
                        label: 'save_preset',
                        id: 'op_action_save_preset'
                    },
                    remove: {
                        label: 'delete_preset',
                        id: 'op_action_delete_preset'
                    }
                }*/
            },
            3:true
        },
        customInsert: function(attrs){

            var str = '',
                str_content = '',
                fields = {},
                append = {},
                append_content = {},
                has_content = false;

            switch(attrs.type){
                case '0':
                    attrs.type = 0;
                    has_content = true;
                    attrs.button_text = true;
                    break;
                case '3':
                    fields = {'bg':'bg_color_2','text':'text_2'};
                    break;
                case '4':
                    has_content = true;
                    fields = {'border':'border_3','size':'size_3','color':'color_3'};
                    break;
                case '5':
                    fields = {'bg':'bg_img_4'};
                    append['text_color'] = attrs.text_4.value;
                    append['text'] = attrs.text_4.fields[attrs.text_4.value];
                    break;
                case '6':
                    fields = {'bg':'bg_color_5','text':'text_5'};
                    break;
                case '7':
                    fields = {'text': 'button_content', 'image': 'image', 'location': 'location', 'button_below': 'text_below_button'};
                    break;
                case 'cart':
                    fields = {'bg':'bg_img_cart'};
                    break;
                case 'blank':
                    fields = {};
                    break;
                case '1':
                    fields = {
                        'text':'text_properties_1_text',
                        'text_size':'text_properties_1_size',
                        'text_color':'text_properties_1_color',
                        'text_font':'text_properties_1_font',
                        'text_bold':'text_properties_1_bold',
                        'text_italic':'text_properties_1_italic',
                        'text_underline':'text_properties_1_underline',
                        'text_letter_spacing':'letter_spacing_1',
                        'subtext_panel':'subtext_box_panel',
                        'subtext':'text_properties_2_text',
                        'subtext_size':'text_properties_2_size',
                        'subtext_color':'text_properties_2_color',
                        'subtext_font':'text_properties_2_font',
                        'subtext_bold':'text_properties_2_bold',
                        'subtext_italic':'text_properties_2_italic',
                        'subtext_underline':'text_properties_2_underline',
                        'subtext_letter_spacing':'letter_spacing_2',
                        'text_shadow_panel':'text_shadow_panel',
                        'text_shadow_vertical':'vertical_axis_1',
                        'text_shadow_horizontal':'horizontal_axis_1',
                        'text_shadow_color':'shadow_color_1',
                        'text_shadow_blur':'blur_radius_1',
                        'styling_width':'width_1',
                        'styling_height':'height_1',
                        'styling_border_color':'border_color_1',
                        'styling_border_size':'border_size_1',
                        'styling_border_radius':'border_radius_1',
                        'styling_border_opacity':'border_opacity_1',
                        'styling_gradient':'gradient_1',
                        'styling_shine':'shine_1',
                        'styling_gradient_start_color':'gradient_start_color_1',
                        'styling_gradient_end_color':'gradient_end_color_2',
                        'drop_shadow_panel':'drop_shadow_panel',
                        'drop_shadow_vertical':'vertical_axis_2',
                        'drop_shadow_horizontal':'horizontal_axis_2',
                        'drop_shadow_blur':'border_radius_2',
                        'drop_shadow_spread':'spread_radius_1',
                        'drop_shadow_color':'shadow_color_2',
                        'drop_shadow_opacity': 'opacity_1',
                        'inset_shadow_panel':'inset_shadow_panel',
                        'inset_shadow_vertical':'vertical_axis_3',
                        'inset_shadow_horizontal':'horizontal_axis_3',
                        'inset_shadow_blur':'border_radius_3',
                        'inset_shadow_spread':'spread_radius_2',
                        'inset_shadow_color':'shadow_color_3',
                        'inset_shadow_opacity': 'opacity_2'
                    };
                    break;
                default:
                    attrs.type = 2;
                    has_content = true;
                    fields = {'color':'color_1'};
                    break;
            }

            append['align'] = attrs.button_align;

            if (attrs.href) {
                append['href'] = encodeURI(attrs.href);
            }

            if (attrs.new_window) {
                append['new_window'] = attrs.new_window;
            }

            if (attrs.button_text) {
                append['button_text'] = encodeURIComponent(attrs.content);
            }

            $.each(fields,function(i,v){
                var val;
                if (attrs[v] === 0) {
                    val = 0;
                } else {
                    if (v === 'text_properties_1_text' || v === 'text_properties_2_text') {
                        val = encodeURIComponent(attrs[v] || '');
                    } else {
                        val = attrs[v] || '';
                    }
                }
                if(val !== ''){
                    str += ' '+i+'="'+val.toString().replace(/"/ig,"'")+'"';
                }
            });

            if(attrs.button_cc && attrs.button_cc != ''){
                append['cc'] = attrs.button_cc;
            }

            $.each(append,function(i,v){
                if(v != ''){
                    str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
                }
            });

            append_content['popup_width'] = attrs.popup_width.toString() || '0';
            append_content['popup_open_effect'] = attrs.open_effect.toString();
            append_content['popup_close_effect'] = attrs.close_effect.toString();
            // append_content['popup_open_method'] = attrs.open_method.toString();
            // append_content['popup_close_method'] = attrs.close_method.toString();
            append_content['popup_open_speed'] = attrs.open_speed.toString();
            append_content['popup_close_speed'] = attrs.close_speed.toString();
            append_content['popup_border_color'] = attrs.popup_border_color.toString();
            append_content['popup_border_size'] = attrs.popup_border_size.toString();

            append_content['popup_padding_top'] = attrs.popup_padding_top.toString() || '0';
            append_content['popup_padding_bottom'] = attrs.popup_padding_bottom.toString() || '0';
            append_content['popup_padding_left'] = attrs.popup_padding_left.toString() || '0';
            append_content['popup_padding_right'] = attrs.popup_padding_right.toString() || '0';

            append_content['pop_trigger_dontshow'] = attrs.pop_trigger_dontshow.toString() || '0';
            append_content['pop_trigger_time'] = attrs.pop_trigger_time.toString() || '0';
            append_content['pop_exit_intent'] = attrs.pop_exit_intent.toString() || 'N';
            append_content['pop_dont_show_on_tablet'] = attrs.pop_dont_show_on_tablet.toString() || 'N';
            append_content['pop_dont_show_on_mobile'] = attrs.pop_dont_show_on_mobile.toString() || 'N';

            append_content['popup_id'] = attrs.popup_id || 'op_popup_id_' + new Date().getTime();

            $.each(append_content, function(i,v) {
                if (v != '') {
                    str_content += ' ' + i + '="' + v.replace(/"/ig, "'") + '"';
                }
            });

            var currentPopupContent =  (this.currentPopupElements !== '') ?  this.currentPopupElements : '[op_popup_content][/op_popup_content]';

            str = '[op_popup ' + str_content + '][op_popup_button][button_'+attrs.type+str+(has_content?']'+attrs.content+'[/button_'+attrs.type+'] ':'/]') + '[/op_popup_button]' + currentPopupContent + '[/op_popup]';
            this.currentPopupElements = '';

            OP_AB.insert_content(str);
            $.fancybox.close();

        },

        currentPopupElements: '',

        customSettings: function(attrs,steps){

            var $settingsCorePopup = $('.op-settings-core-op_popup');
            var attrs_fancybox = {};

            this.currentPopupElements = attrs.attrs.popup_content;
            $settingsCorePopup.addClass('op-settings-core-op_popup--loading');

            attrs_fancybox.popup_width = attrs.attrs.popup_width || '0';

            attrs_fancybox.popup_open_effect = attrs.attrs.popup_open_effect || 'fade';
            attrs_fancybox.popup_close_effect = attrs.attrs.popup_close_effect || 'fade';
            // attrs_fancybox.popup_open_method = attrs.attrs.popup_open_method;
            // attrs_fancybox.popup_close_method = attrs.attrs.popup_close_method;
            attrs_fancybox.popup_open_speed = attrs.attrs.popup_open_speed || 'normal';
            attrs_fancybox.popup_close_speed = attrs.attrs.popup_close_speed || 'normal';
            attrs_fancybox.popup_border_color = attrs.attrs.popup_border_color || '#ffffff';
            attrs_fancybox.popup_border_size = attrs.attrs.popup_border_size || '0';

            attrs_fancybox.popup_padding_top = attrs.attrs.popup_padding_top || '0';
            attrs_fancybox.popup_padding_bottom = attrs.attrs.popup_padding_bottom || '0';
            attrs_fancybox.popup_padding_left = attrs.attrs.popup_padding_left || '0';
            attrs_fancybox.popup_padding_right = attrs.attrs.popup_padding_right || '0';

            attrs_fancybox.pop_trigger_dontshow = attrs.attrs.pop_trigger_dontshow || '0';
            attrs_fancybox.pop_trigger_time = attrs.attrs.pop_trigger_time || '0';
            attrs_fancybox.pop_exit_intent = attrs.attrs.pop_exit_intent || 'N';
            attrs_fancybox.pop_dont_show_on_tablet = attrs.attrs.pop_dont_show_on_tablet || 'N';
            attrs_fancybox.pop_dont_show_on_mobile = attrs.attrs.pop_dont_show_on_mobile || 'N';

            attrs_fancybox.popup_id = attrs.attrs.popup_id || '';

            $.post(OptimizePress.ajaxurl, {
                action: OptimizePress.SN+'-live-editor-params',
                _wpnonce: $('#op_le_wpnonce').val(),
                shortcode: attrs.attrs.content
            }, function (resp) {
                if(typeof resp.error != 'undefined'){
                    alert(resp.error);
                } else {
                    resp.asset[1] = 'op_popup';
                    callCustomSettings(resp, steps);
                    $settingsCorePopup.removeClass('op-settings-core-op_popup--loading');
                }
            }, 'json');

            function callCustomSettings(attrs, steps) {

                var style = attrs.tag.substr(7),
                    idprefix = 'op_assets_core_op_popup_',
                    advancedOptionsContainerPrefix = 'popup_container_',
                    advancedOptionsButtonPrefix = 'popup_button_',
                    advancedOptionsPopPrefix = 'op_pop_',
                    pop_exit_intent_value = false,
                    pop_dont_show_on_tablet_value = false,
                    pop_dont_show_on_mobile_value = false;

                OP_AB.set_selector_value(idprefix+'type_container',style);

                attrs = attrs.attrs;

                if (typeof attrs.href !== 'undefined') {
                    $('#op_assets_core_op_popup_href').val(decodeURI(attrs.href));
                }

                switch(style){
                    case 'cart':
                        OP_AB.set_selector_value(idprefix+'bg_img_cart_container',attrs.bg);
                        break;
                    case '0':
                        $('#'+idprefix+'content').val(attrs.content || '');
                        break;
                    case '2':
                        $('#'+idprefix+'color_1').val(attrs.color || '');
                        $('#'+idprefix+'content').val(attrs.content || '');
                        break;
                    case '3':
                        OP_AB.set_selector_value(idprefix+'text_2_container',attrs.text);
                        $('#'+idprefix+'bg_color_2').val(attrs.bg || '');
                        break;
                    case '4':
                        $('#'+idprefix+'content').val(attrs.content || '');
                        $('#'+idprefix+'color_3').val(attrs.color || '');
                        $('#'+idprefix+'size_3').val(attrs.size || '');
                        $('#'+idprefix+'border_3').val(attrs.border || '');
                        break;
                    case '5':
                        var text_color = attrs.text_color || 'dark';
                        OP_AB.set_selector_value(idprefix+'bg_img_4_container',attrs.bg);
                        $('#'+idprefix+'text_4').val(text_color).trigger('change');
                        OP_AB.set_selector_value(idprefix+'text_4_'+text_color+'_container',attrs.text || '');
                        break;
                    case '6':
                        $('#'+idprefix+'bg_color_5').val(attrs.bg || '');
                        OP_AB.set_selector_value(idprefix+'text_5_container',attrs.text || '');
                    case '7':
                        OP_AB.set_uploader_value(idprefix+'image', attrs.image);
                        break;
                    case '1':
                        var preset = $.extend(true, {}, op_popup_button_presets.presets['default'].attributes);
                        for (i in attrs) {
                            if (typeof preset[i] != 'undefined') {
                                preset[i].value = op_decodeURIComponent(attrs[i]);
                            }
                        }
                        preset.text.value = op_decodeURIComponent(preset.text.value);
                        preset.subtext.value = op_decodeURIComponent(preset.subtext.value);
                        op_popup_button_presets.change(preset);
                        break;
                };
                $('#'+idprefix+'new_window').attr('checked',((attrs.new_window || 'N') == 'Y'));

                // in container...
                steps[2].find('.field-id-'+idprefix+advancedOptionsButtonPrefix+'button_align :radio[value="'+(attrs.align || 'center')+'"]').attr('checked',true);

                if(typeof attrs.cc !== 'undefined'){
                    var cc = attrs.cc.split('|'),
                        ccont = steps[2].find('.field-op_assets_core_op_popup_popup_button_button_cc_icons');
                    $.each(cc,function(i,v){
                        ccont.find(':checkbox[value="'+v+'"]').attr('checked',true);
                    });
                    ccont.html(ccont.html());
                    $.each(cc,function(i,v){
                        ccont.find(':checkbox[value="'+v+'"]').trigger('change');
                    });
                }

                // fancybox options
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_width').find('input').val(attrs_fancybox.popup_width);

                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'open_effect').find('input[value=' + attrs_fancybox.popup_open_effect + ']').attr('checked',true);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'close_effect').find('input[value=' + attrs_fancybox.popup_close_effect + ']').attr('checked',true);
                // $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'open_method').find('input[value=' + attrs_fancybox.popup_open_method + ']').attr('checked',true);
                // $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'close_method').find('input[value=' + attrs_fancybox.popup_close_method + ']').attr('checked',true);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'open_speed').find('input[value=' + attrs_fancybox.popup_open_speed + ']').attr('checked',true);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'close_speed').find('input[value=' + attrs_fancybox.popup_close_speed + ']').attr('checked',true);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_border_color').find('input').val(attrs_fancybox.popup_border_color).trigger('change');
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_border_size').find('.slider-item').slider('value', attrs_fancybox.popup_border_size);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_border_size').find('.slider-output span').text(attrs_fancybox.popup_border_size + 'px');

                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_padding_top').find('input').val(attrs_fancybox.popup_padding_top);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_padding_bottom').find('input').val(attrs_fancybox.popup_padding_bottom);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_padding_left').find('input').val(attrs_fancybox.popup_padding_left);
                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_padding_right').find('input').val(attrs_fancybox.popup_padding_right);

                $('.field-id-'+idprefix+advancedOptionsPopPrefix+'pop_trigger_dontshow').find('input').val(attrs_fancybox.pop_trigger_dontshow);
                $('.field-id-'+idprefix+advancedOptionsPopPrefix+'pop_trigger_time').find('input').val(attrs_fancybox.pop_trigger_time);

                pop_exit_intent_value = attrs_fancybox.pop_exit_intent === 'Y' ? true : false;
                pop_dont_show_on_tablet_value = attrs_fancybox.pop_dont_show_on_tablet === 'Y' ? true : false;
                pop_dont_show_on_mobile_value = attrs_fancybox.pop_dont_show_on_mobile === 'Y' ? true : false;

                $('.field-id-'+idprefix+advancedOptionsPopPrefix+'pop_exit_intent').find('input').attr('checked', pop_exit_intent_value);
                $('.field-id-'+idprefix+advancedOptionsPopPrefix+'pop_dont_show_on_tablet').find('input').attr('checked', pop_dont_show_on_tablet_value);
                $('.field-id-'+idprefix+advancedOptionsPopPrefix+'pop_dont_show_on_mobile').find('input').attr('checked', pop_dont_show_on_mobile_value);

                $('.field-id-'+idprefix+advancedOptionsContainerPrefix+'popup_id').find('input').val(attrs_fancybox.popup_id);
            }
        }
    };
})(opjq);

var op_popup_button_presets = (function($){
    return {
        presets: {
            'default': {
                attributes: {
                    text: {
                        value: '',
                        selector: '#op_assets_core_op_popup_text_box_text_properties_1_text',
                        type: 'text'
                    },
                    text_size: {
                        value: 36,
                        selector: '#op_assets_core_op_popup_text_box_text_properties_1_size',
                        type: 'dropdown'
                    },
                    text_font: {
                        value: '',
                        selector: '#op_assets_core_op_popup_text_box_text_properties_1_container',
                        type: 'font'
                    },
                    text_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_text_box_text_properties_1_color',
                        type: 'color'
                    },
                    text_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_text_box_text_properties_1 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    text_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_text_box_text_properties_1 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    text_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_text_box_text_properties_1 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    text_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_text_box_letter_spacing_1',
                        type: 'slider'
                    },
                    subtext_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_op_popup_subtext_box',
                        type: 'checkbox'
                    },
                    subtext: {
                        value: '',
                        selector: '#op_assets_core_op_popup_subtext_box_text_properties_2_text',
                        type: 'text'
                    },
                    subtext_size: {
                        value: 14,
                        selector: '#op_assets_core_op_popup_subtext_box_text_properties_2_size',
                        type: 'dropdown'
                    },
                    subtext_font: {
                        value: '',
                        selector: '#op_assets_core_op_popup_subtext_box_text_properties_2_container',
                        type: 'font'
                    },
                    subtext_color: {
                        value: '#ffffff',
                        selector: '#op_assets_core_op_popup_subtext_box_text_properties_2_color',
                        type: 'color'
                    },
                    subtext_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_subtext_box_text_properties_2 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    subtext_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_subtext_box_text_properties_2 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    subtext_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_op_popup_subtext_box_text_properties_2 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    subtext_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_subtext_box_letter_spacing_2',
                        type: 'slider'
                    },
                    text_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_op_popup_text_shadow',
                        type: 'checkbox'
                    },
                    text_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_text_shadow_vertical_axis_1',
                        type: 'slider'
                    },
                    text_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_text_shadow_horizontal_axis_1',
                        type: 'slider'
                    },
                    text_shadow_color: {
                        value: '#ffff00',
                        selector: '#op_assets_core_op_popup_text_shadow_shadow_color_1',
                        type: 'color'
                    },
                    text_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_text_shadow_blur_radius_1',
                        type: 'slider'
                    },
                    styling_width: {
                        value: 60,
                        selector: '#op_assets_core_op_popup_styling_width_1',
                        type: 'slider'
                    },
                    styling_height: {
                        value: 30,
                        selector: '#op_assets_core_op_popup_styling_height_1',
                        type: 'slider'
                    },
                    styling_border_size: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_styling_border_size_1',
                        type: 'slider'
                    },
                    styling_border_radius: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_styling_border_radius_1',
                        type: 'slider'
                    },
                    styling_border_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_styling_border_color_1',
                        type: 'color'
                    },
                    styling_border_opacity: {
                        value: 100,
                        selector: '#op_assets_core_op_popup_styling_border_opacity_1',
                        type: 'slider'
                    },
                    styling_gradient: {
                        value: false,
                        selector: '#op_assets_core_op_popup_styling_gradient_1',
                        type: 'checkbox'
                    },
                    styling_shine: {
                        value: false,
                        selector: '#op_assets_core_op_popup_styling_shine_1',
                        type: 'checkbox'
                    },
                    styling_gradient_start_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_styling_gradient_start_color_1',
                        type: 'color'
                    },
                    styling_gradient_end_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_styling_gradient_end_color_2',
                        type: 'color'
                    },
                    drop_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_op_popup_drop_shadow',
                        type: 'checkbox'
                    },
                    drop_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_drop_shadow_vertical_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_drop_shadow_horizontal_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_drop_shadow_border_radius_2',
                        type: 'slider'
                    },
                    drop_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_drop_shadow_spread_radius_1',
                        type: 'slider'
                    },
                    drop_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_drop_shadow_shadow_color_2',
                        type: 'color'
                    },
                    drop_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_op_popup_drop_shadow_opacity_1',
                        type: 'slider'
                    },
                    inset_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_op_popup_inset_shadow',
                        type: 'checkbox'
                    },
                    inset_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_inset_shadow_vertical_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_inset_shadow_horizontal_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_inset_shadow_border_radius_3',
                        type: 'slider'
                    },
                    inset_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_op_popup_inset_shadow_spread_radius_2',
                        type: 'slider'
                    },
                    inset_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_op_popup_inset_shadow_shadow_color_3',
                        type: 'color'
                    },
                    inset_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_op_popup_inset_shadow_opacity_2',
                        type: 'slider'
                    }
                }
            },
            'button_0.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 32,
                    },
                    text_color: {
                        value: '#000000'
                    },
                    text_font: {
                        value: 'Montserrat;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#ffff00'
                    },
                    styling_width: {
                        value: 40
                    },
                    styling_height: {
                        value: 30
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_shine: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#ffff00'
                    },
                    styling_gradient_end_color: {
                        value: '#ffa035'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffff00'
                    },
                    inset_shadow_opacity: {
                        value: 50
                    }
                }
            },
            'button_1.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 28,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Lato;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: -1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 40
                    },
                    styling_height: {
                        value: 20
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#0080ff'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 25
                    }
                }
            },
            'button_2.png': {
                attributes: {
                    text: {
                        value: "Get Started Now",
                    },
                    text_size: {
                        value: 24,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Gill Sans;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: -1
                    },
                    text_shadow_color: {
                        value: '#080808'
                    },
                    styling_width: {
                        value: 40
                    },
                    styling_height: {
                        value: 20
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 3
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#d90000'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffff00'
                    },
                    inset_shadow_opacity: {
                        value: 25
                    }
                }
            },
            'button_3.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 28,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Montserrat;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'Y',
                    },
                    subtext: {
                        value: '30 day free trial. Sign up in 60 seconds.',
                    },
                    subtext_size: {
                        value: 14,
                    },
                    subtext_color: {
                        value: '#bbff99'
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#080808'
                    },
                    styling_width: {
                        value: 63
                    },
                    styling_height: {
                        value: 38
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 50
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#40bf00'
                    },
                    styling_gradient_end_color: {
                        value: '#006600'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_vertical: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 75
                    }
                }
            },
            'button_4.png': {
                attributes: {
                    text: {
                        value: 'Sign Up',
                    },
                    text_size: {
                        value: 18,
                    },
                    text_color: {
                        value: '#000000'
                    },
                    text_font: {
                        value: 'Helvetica;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#ffffff'
                    },
                    styling_width: {
                        value: 30
                    },
                    styling_height: {
                        value: 15
                    },
                    styling_border_color: {
                        value: '#999999'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 50
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_shine: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#ffffff'
                    },
                    styling_gradient_end_color: {
                        value: '#e5e5e5'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 25
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 50
                    }
                }
            },
            'button_5.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 24,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Helvetica;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 40
                    },
                    styling_height: {
                        value: 20
                    },
                    styling_border_color: {
                        value: '#bd3f00'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 10
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#ff5500'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 5
                    },
                    drop_shadow_color: {
                        value: '#bd3f00'
                    },
                    drop_shadow_opacity: {
                        value: 100
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 25
                    }
                }
            },
            'button_6.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 36,
                    },
                    text_color: {
                        value: '#00457c'
                    },
                    text_font: {
                        value: 'Gill Sans;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    text_italic: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'Y',
                    },
                    subtext: {
                        value: '100% Money Back Guarantee',
                    },
                    subtext_size: {
                        value: 14,
                    },
                    subtext_color: {
                        value: '#0079c1'
                    },
                    subtext_font: {
                        value: 'Gill Sans;default',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#ffffff'
                    },
                    styling_width: {
                        value: 50
                    },
                    styling_height: {
                        value: 35
                    },
                    styling_border_color: {
                        value: '#ffbf00'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#fff9d9'
                    },
                    styling_gradient_end_color: {
                        value: '#ffeabf'
                    },
                    drop_shadow_panel: {
                        value: 'N'
                    },
                    inset_shadow_panel: {
                        value: 'N'
                    },
                }
            },
            'button_7.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 36,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Gill Sans;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 50
                    },
                    styling_height: {
                        value: 30
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_shine: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#808080'
                    },
                    styling_gradient_end_color: {
                        value: '#000000'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 25
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 25
                    }
                }
            },
            'button_8.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 36,
                    },
                    text_color: {
                        value: '#002080'
                    },
                    text_font: {
                        value: 'Gill Sans;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#ffffff'
                    },
                    styling_width: {
                        value: 50
                    },
                    styling_height: {
                        value: 30
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_shine: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#ecf0ff'
                    },
                    styling_gradient_end_color: {
                        value: '#8daaff'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffffff'
                    },
                    inset_shadow_opacity: {
                        value: 50
                    }
                }
            },
            'button_9.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 36,
                    },
                    text_color: {
                        value: '#002080'
                    },
                    text_font: {
                        value: 'Montserrat;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#efefbd'
                    },
                    styling_width: {
                        value: 63
                    },
                    styling_height: {
                        value: 23
                    },
                    styling_border_color: {
                        value: '#002080'
                    },
                    styling_border_size: {
                        value: 5
                    },
                    styling_border_radius: {
                        value: 50
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient: {
                        value: 'Y'
                    },
                    styling_shine: {
                        value: 'Y'
                    },
                    styling_gradient_start_color: {
                        value: '#fbff1f'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_spread: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffff00'
                    },
                    inset_shadow_opacity: {
                        value: 50
                    }
                }
            },
            'button_10.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 20,
                    },
                    text_color: {
                        value: '#504210'
                    },
                    text_font: {
                        value: 'Helvetica;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#ffff9e'
                    },
                    styling_width: {
                        value: 35
                    },
                    styling_height: {
                        value: 20
                    },
                    styling_border_color: {
                        value: '#d69300'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#ffcf0a'
                    },
                    styling_gradient_end_color: {
                        value: '#ffda22'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 10
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_vertical: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#ffe590'
                    },
                    inset_shadow_opacity: {
                        value: 100
                    }
                }
            },
            'button_11.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 32,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Helvetica;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'N'
                    },
                    styling_width: {
                        value: 80
                    },
                    styling_height: {
                        value: 40
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#53a540'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'N'
                    },
                    inset_shadow_panel: {
                        value: 'N'
                    }
                }
            },
            'button_12.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 36,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Cabin;google',
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 60
                    },
                    styling_height: {
                        value: 40
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_radius: {
                        value: 4
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#479ccf'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'N'
                    },
                    inset_shadow_panel: {
                        value: 'N'
                    }
                }
            },
            'button_13.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 24,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Ubuntu;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'N'
                    },
                    styling_width: {
                        value: 60
                    },
                    styling_height: {
                        value: 25
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#F47734'
                    },
                    styling_gradient_end_color: {
                        value: ''
                    },
                    drop_shadow_panel: {
                        value: 'N'
                    },
                    inset_shadow_panel: {
                        value: 'N'
                    }
                }
            },
            'button_14.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 24,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Lato;google',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    text_letter_spacing: {
                        value: -1
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 50
                    },
                    styling_height: {
                        value: 20
                    },
                    styling_border_color: {
                        value: '#666666'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 8
                    },
                    styling_border_opacity: {
                        value: 99
                    },
                    styling_gradient_start_color: {
                        value: '#86c833'
                    },
                    styling_gradient_end_color: {
                        value: '#3f8e30'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 50
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_vertical: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#c2ee80'
                    },
                    inset_shadow_opacity: {
                        value: 100
                    }
                }
            },
            'button_15.png': {
                attributes: {
                    text: {
                        value: 'Get Started Now',
                    },
                    text_size: {
                        value: 28,
                    },
                    text_color: {
                        value: '#ffffff'
                    },
                    text_font: {
                        value: 'Helvetica;default',
                    },
                    text_bold: {
                        value: 'Y'
                    },
                    subtext_panel: {
                        value: 'N',
                    },
                    text_shadow_panel: {
                        value: 'Y'
                    },
                    text_shadow_vertical: {
                        value: 1
                    },
                    text_shadow_color: {
                        value: '#000000'
                    },
                    styling_width: {
                        value: 50
                    },
                    styling_height: {
                        value: 25
                    },
                    styling_border_color: {
                        value: '#000000'
                    },
                    styling_border_size: {
                        value: 1
                    },
                    styling_border_radius: {
                        value: 6
                    },
                    styling_border_opacity: {
                        value: 100
                    },
                    styling_gradient_start_color: {
                        value: '#48bef2'
                    },
                    styling_gradient_end_color: {
                        value: '#04479e'
                    },
                    drop_shadow_panel: {
                        value: 'Y'
                    },
                    drop_shadow_vertical: {
                        value: 1
                    },
                    drop_shadow_blur: {
                        value: 1
                    },
                    drop_shadow_color: {
                        value: '#000000'
                    },
                    drop_shadow_opacity: {
                        value: 25
                    },
                    inset_shadow_panel: {
                        value: 'Y'
                    },
                    inset_shadow_vertical: {
                        value: 1
                    },
                    inset_shadow_color: {
                        value: '#61dcff'
                    },
                    inset_shadow_opacity: {
                        value: 100
                    }
                }
            }
        },
        reset: function() {
            this.change(this.load('default'));
        },
        load: function(preset) {
            return this.presets[preset].attributes;
        },
        switch: function(preset) {
            this.reset();
            this.change(this.load(preset));
        },
        change: function(attributes) {
            var defaults = this.load('default');
            for (var i in attributes) {
                switch (defaults[i].type) {
                    case 'checkbox':
                        var checked = false;
                        if (typeof attributes[i].value != 'undefined' && (attributes[i].value == true || attributes[i].value == 'Y')) {
                            checked = true;
                        }
                        $(defaults[i].selector).attr('checked', checked).trigger('change');
                        break;
                    case 'font':
                        var $container = $(defaults[i].selector + ' a.selected-item');
                        value = attributes[i].value.split(';');
                        var $item = $(defaults[i].selector + ' .op-font[alt="' + value[0] + '"]');
                        /*
                         * If item is not found we display default one (font-family:inherit)
                         */
                        if ($item.length == 0) {
                            $container.html($(defaults[i].selector + ' .op-asset-dropdown-list li:first a').html());
                        } else {
                            $container.html($item.parent().html());
                        }

                        $('#op_asset_browser_slide3 .op-settings-core-op_popup').trigger({type: 'update_button_preview', tag: 'button', id: defaults[i].selector.substr(1), value: $item.attr('alt'), font_type: $item.attr('data-type'), font_family: $item.attr('data-family')});
                        break;
                    case 'slider':
                        var $slider = $(defaults[i].selector);
                        $slider.slider({value:attributes[i].value});
                        $slider.slider('option', 'slide').call($slider, {}, {value: attributes[i].value, id: defaults[i].selector.substr(1)});
                        $slider.slider('option', 'stop').call($slider, {}, {value: attributes[i].value, id: defaults[i].selector.substr(1)});
                        break;
                    case 'color':
                        // no break
                    case 'text':
                        // no break
                    case 'dropdown':
                        // no break
                    default:
                        $(defaults[i].selector).val(attributes[i].value).trigger('keydown').trigger('change');
                        break;
                }
            }
        }
    }
})(opjq);

window.op_custom_popup = (function($){
    return {
        update: function(e) {

            var id = e.id,
                value = e.value;

            e.tag = 'button';

            switch (id) {
                /*
                 * Preset
                 */
                case 'op_assets_core_op_popup_button_preview_container':
                    op_popup_button_presets.switch(value);
                    break;
                /*
                 * Text box
                 */
                case 'op_assets_core_op_popup_text_box_text_properties_1_text':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').html(value);
                    break;
                case 'op_assets_core_op_popup_text_box_text_properties_1_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_op_popup_text_box_text_properties_1_container':
                    if (typeof value == 'undefined') {
                        value = 'inherit';
                    } else if(e.font_type == 'google') {
                        WebFont.load({google:{families:[value]}});
                    } else {
                        value = e.font_family;
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-family', value);
                    break;
                case 'op_font[style_checkbox_text][bold]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-weight', 'normal');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-weight', 'bold');
                    }
                    break;
                case 'op_font[style_checkbox_text][italic]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-style', 'normal');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-style', 'italic');
                    }
                    break;
                case 'op_font[style_checkbox_text][underline]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('text-decoration', 'none');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('text-decoration', 'underline');
                    }
                    break;
                case 'op_assets_core_op_popup_text_box_text_properties_1_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('color', value);
                    break;
                case 'op_assets_core_op_popup_text_box_letter_spacing_1':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Subtext box
                 */
                case 'op_assets_core_op_popup_subtext_box_text_properties_2_text':
                    var element = $('#op_button_preview.pbox_' + e.tag + ' .subtext');
                    element.html(value);
                    if (value == '') {
                        element.hide();
                    } else {
                        element.show();
                    }
                    break;
                case 'op_assets_core_op_popup_subtext_box_text_properties_2_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_op_popup_subtext_box_text_properties_2_container':
                    if (typeof value == 'undefined') {
                        value = 'inherit';
                    } else if(e.font_type == 'google') {
                        WebFont.load({google:{families:[value]}});
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-family', value);
                    break;
                case 'op_font[style_checkbox_subtext][bold]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-weight', 'normal');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-weight', 'bold');
                    }
                    break;
                case 'op_font[style_checkbox_subtext][italic]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-style', 'normal');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-style', 'italic');
                    }
                    break;
                case 'op_font[style_checkbox_subtext][underline]':
                    if (value === 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('text-decoration', 'none');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('text-decoration', 'underline');
                    }
                    break;
                case 'op_assets_core_op_popup_subtext_box_text_properties_2_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('color', value);
                    break;
                case 'op[op_assets_core_op_popup_subtext_box][enabled]':
                    if (value == 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').hide();
                    }
                    break;
                case 'op_assets_core_op_popup_subtext_box_letter_spacing_2':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Text shadow
                 */
                case 'op_assets_core_op_popup_text_shadow_vertical_axis_1':
                case 'op_assets_core_op_popup_text_shadow_horizontal_axis_1':
                case 'op_assets_core_op_popup_text_shadow_blur_radius_1':
                case 'op_assets_core_op_popup_text_shadow_shadow_color_1':
                case 'op[op_assets_core_op_popup_text_shadow][enabled]':
                    if ($('input[name="op[op_assets_core_op_popup_text_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis = $('#op_assets_core_op_popup_text_shadow_vertical_axis_1').slider('value');
                        var horizontal_axis = $('#op_assets_core_op_popup_text_shadow_horizontal_axis_1').slider('value');
                        var blur_radius = $('#op_assets_core_op_popup_text_shadow_blur_radius_1').slider('value');
                        var shadow_color = $('#op_assets_core_op_popup_text_shadow_shadow_color_1').val();
                        if (shadow_color === '') {
                            shadow_color = '#ffffff';
                        }
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext, #op_button_preview.pbox_' + e.tag + ' .text').css('text-shadow', shadow_color + ' ' + horizontal_axis + 'px ' + vertical_axis + 'px ' +blur_radius + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext, #op_button_preview.pbox_' + e.tag + ' .text').css('text-shadow', 'none');
                    }
                    break;
                /*
                 * Styling
                 */
                case 'op_assets_core_op_popup_styling_width_1':
                    var max = $('#op_assets_core_op_popup_styling_width_1').slider('option', 'max');
                    if (max == value) {
                        $('#op_button_preview.pbox_' + e.tag).css('width', '100%');
                        $('#output_op_assets_core_op_popup_styling_width_1').html('100%');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_op_popup_styling_height_1').slider('value') + 'px 0');
                        return false;
                    } else {
                        $('#op_button_preview.pbox_' + e.tag).css('width', 'auto');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_op_popup_styling_height_1').slider('value') + 'px ' + value + 'px');
                    }
                    break;
                case 'op_assets_core_op_popup_styling_height_1':
                    $('#op_button_preview.pbox_' + e.tag).css('padding', value + 'px ' + $('#op_assets_core_op_popup_styling_width_1').slider('value') + 'px');
                    break;
                case 'op_assets_core_op_popup_styling_border_color_1':
                case 'op_assets_core_op_popup_styling_border_opacity_1':
                    var border_opacity = $('#op_assets_core_op_popup_styling_border_opacity_1').slider('value');
                    var border_color = $('#op_assets_core_op_popup_styling_border_color_1').val();
                    if (border_color === '') {
                        border_color = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag).css('border-color', generateCssColor(border_color, border_opacity));
                    break;
                case 'op_assets_core_op_popup_styling_border_size_1':
                    $('#op_button_preview.pbox_' + e.tag).css('border-width', value + 'px');
                    break;
                case 'op_assets_core_op_popup_styling_border_radius_1':
                    $('#op_button_preview.pbox_' + e.tag + ', #op_button_preview.pbox_' + e.tag + ' .gradient, #op_button_preview.pbox_' + e.tag + ' .active, #op_button_preview.pbox_' + e.tag + ' .hover, #op_button_preview.pbox_' + e.tag + ' .shine').css('border-radius', value + 'px');
                    break;
                case 'op_assets_core_op_popup_styling_shine_1':
                    if (value === 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').hide();
                    }
                    break;
                case 'op_assets_core_op_popup_styling_gradient_start_color_1':
                case 'op_assets_core_op_popup_styling_gradient_end_color_2':
                case 'op_assets_core_op_popup_styling_gradient_1':
                    var start_color = $('#op_assets_core_op_popup_styling_gradient_start_color_1').val();
                    var end_color = $('#op_assets_core_op_popup_styling_gradient_end_color_2').val();
                    var gradient_status = $('#op_assets_core_op_popup_styling_gradient_1').is(':checked');

                    if (gradient_status == true && start_color != end_color) {
                        $('#op_button_preview.pbox_' + e.tag).css('background', start_color);
                        $('#op_button_preview.pbox_' + e.tag + ' .gradient').show();
                    } else {
                        if (end_color) {
                            $('#op_button_preview.pbox_' + e.tag)
                                .css('background', start_color)
                                .css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + start_color + '), color-stop(100%, ' + end_color + '))')
                                .css('background', '-webkit-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                                .css('background', '-moz-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                                .css('background', '-ms-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                                .css('background', '-o-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                                .css('background', 'linear-gradient(to bottom, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                                .css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=' + start_color + ', endColorstr=' + end_color + ', GradientType=0 )');
                        } else {
                            $('#op_button_preview.pbox_' + e.tag).css('background', start_color);
                        }

                        $('#op_button_preview.pbox_' + e.tag + ' .gradient').hide();
                    }
                    break;
                /*
                 * Drop and inner shadow
                 */
                // Drop
                case 'op[op_assets_core_op_popup_drop_shadow][enabled]':
                case 'op_assets_core_op_popup_drop_shadow_vertical_axis_2':
                case 'op_assets_core_op_popup_drop_shadow_horizontal_axis_2':
                case 'op_assets_core_op_popup_drop_shadow_border_radius_2':
                case 'op_assets_core_op_popup_drop_shadow_spread_radius_1':
                case 'op_assets_core_op_popup_drop_shadow_opacity_1':
                case 'op_assets_core_op_popup_drop_shadow_shadow_color_2':
                // Inner/inset
                case 'op[op_assets_core_op_popup_inset_shadow][enabled]':
                case 'op_assets_core_op_popup_inset_shadow_vertical_axis_3':
                case 'op_assets_core_op_popup_inset_shadow_horizontal_axis_3':
                case 'op_assets_core_op_popup_inset_shadow_border_radius_3':
                case 'op_assets_core_op_popup_inset_shadow_spread_radius_2':
                case 'op_assets_core_op_popup_inset_shadow_opacity_2':
                case 'op_assets_core_op_popup_inset_shadow_shadow_color_3':

                    var styles = [];

                    if ($('input[name="op[op_assets_core_op_popup_drop_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_1 = $('#op_assets_core_op_popup_drop_shadow_vertical_axis_2').slider('value');
                        var horizontal_axis_1 = $('#op_assets_core_op_popup_drop_shadow_horizontal_axis_2').slider('value');
                        var border_radius_1 = $('#op_assets_core_op_popup_drop_shadow_border_radius_2').slider('value');
                        var spread_radius_1 = $('#op_assets_core_op_popup_drop_shadow_spread_radius_1').slider('value');
                        var shadow_color_1 = $('#op_assets_core_op_popup_drop_shadow_shadow_color_2').val();
                        var opacity_1 = $('#op_assets_core_op_popup_drop_shadow_opacity_1').slider('value');
                        if (shadow_color_1 === '') {
                            shadow_color_1 = '#ffffff';
                        }
                        color_1 = generateCssColor(shadow_color_1, opacity_1);
                        styles.push(horizontal_axis_1 + 'px ' + vertical_axis_1 + 'px ' + border_radius_1 + 'px ' + spread_radius_1 + 'px ' + color_1);
                    }

                    if ($('input[name="op[op_assets_core_op_popup_inset_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_2 = $('#op_assets_core_op_popup_inset_shadow_vertical_axis_3').slider('value');
                        var horizontal_axis_2 = $('#op_assets_core_op_popup_inset_shadow_horizontal_axis_3').slider('value');
                        var border_radius_2 = $('#op_assets_core_op_popup_inset_shadow_border_radius_3').slider('value');
                        var spread_radius_2 = $('#op_assets_core_op_popup_inset_shadow_spread_radius_2').slider('value');
                        var shadow_color_2 = $('#op_assets_core_op_popup_inset_shadow_shadow_color_3').val();
                        var opacity_2 = $('#op_assets_core_op_popup_inset_shadow_opacity_2').slider('value');
                        if (shadow_color_2 === '') {
                            shadow_color_2 = '#ffffff';
                        }
                        color_2 = generateCssColor(shadow_color_2, opacity_2);
                        styles.push('inset ' + horizontal_axis_2 + 'px ' + vertical_axis_2 + 'px ' + border_radius_2 + 'px ' + spread_radius_2 + 'px ' + color_2);
                    }
                    if (styles.length > 0) {
                        $('#op_button_preview.pbox_' + e.tag).css('box-shadow', styles.join(','));
                    } else {
                        $('#op_button_preview.pbox_' + e.tag).css('box-shadow', 'none');
                    }

                    break;
            }
        }
    };
}(opjq));
