var op_asset_settings = (function($){
    // Free subscriber level is messing up content drip so we are removing it.
    // Some elements need all OPM levels so we are making custom copy here.
    var WithoutFreeOPMLevels = $.extend({}, OPMLevels);
    delete WithoutFreeOPMLevels[0];

    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-order-button.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-order-button.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-order-button.mp4',
                width: '600',
                height: '341'
            }
        },
        attributes: {
            step_2: {
                no_options: {
                    type: 'p',
                    title: 'no_options_for_this_slide',
                    showOn: {field:'step_1.style',value:'0'}
                },
                button_preview: {
                    title: '',
                    type: 'button_preview',
                    folder: 'presets',
                    selectorClass: 'icon-view-128',
                    showOn: {field:'step_1.style',value:'1'},
                    showSubtext: false,
                    showShine: false,
                    showGradient: false,
                    addClass: 'membership_order_button'
                },
                color_1: {
                    title: 'color',
                    type: 'select',
                    values: {'blue':'blue','green':'green','light-green':'light_green','orange':'orange','red':'red','silver':'silver','teal':'teal'},
                    showOn: {field:'step_1.style',value:'2'}
                },
                bg_color_2: {
                    title: 'bg_img',
                    type: 'select',
                    values: {'':'yellow','silver':'silver'},
                    showOn: {field:'step_1.style',value:'3'}
                },
                bg_color_5: {
                    title: 'bg_color',
                    type: 'select',
                    values: {'green':'green','orange':'orange'},
                    showOn: {field:'step_1.style',value:'6'}
                },
                bg_img_4: {
                    title: 'bg_img',
                    type: 'style-selector',
                    folder: 'bg_img_4/previews',
                    showOn: {field:'step_1.style',value:'5'}
                },
                bg_img_cart: {
                    title: 'bg_img',
                    type: 'image-selector',
                    folder: 'cart/previews',
                    showOn: {field:'step_1.style',value:'cart'}
                },
                border_3: {
                    title: 'border_style',
                    type: 'select',
                    values: {'':'normal','rounded':'rounded'},
                    showOn: {field:'step_1.style',value:'4'}
                },
                size_3: {
                    title: 'size',
                    type: 'select',
                    values: {'small':'small','medium':'medium','large':'large'},
                    showOn: {field:'step_1.style',value:'4'}
                },
                color_3: {
                    title: 'color',
                    type: 'select',
                    values: {'black':'black','blue':'blue','brightgreen':'bright_green','darkblue':'dark_blue','darkgrey':'dark_grey','darkorange':'dark_orange','green':'green','lightblue':'light_blue','lightgreen':'light_green','lightorange':'light_orange','lightred':'light_red','lightviolet':'light_violet','orange':'orange','pink':'pink','red':'red','silver':'silver','teal':'teal','violet':'violet','yellow':'yellow'},
                    showOn: {field:'step_1.style',value:'4'}
                },
                content: {
                    title: 'text',
                    default_value: 'Button Text',
                    showOn: {field:'step_1.style',value:['2','4']}
                },
                text_2: {
                    title: 'text',
                    type: 'image-selector',
                    folder: 'button-text-blue',
                    showOn: {field:'step_1.style',value:'3'}
                },
                text_4: {
                    title: 'text',
                    type: 'select',
                    values: {'light':'light','dark':'dark'},
                    default_value: 'dark',
                    showOn: {field:'step_1.style',value:'5'},
                    showFields: {
                        light: {
                            title: 'text',
                            type: 'image-selector',
                            folder: 'button-4-text/light',
                            selectorClass: 'light-text'
                        },
                        dark: {
                            title: 'text',
                            type: 'image-selector',
                            folder: 'button-4-text/dark'
                        }
                    }
                },
                text_5: {
                    title: 'text',
                    type: 'image-selector',
                    folder: 'button5',
                    showOn: {field:'step_1.style',value:'6'},
                    selectorClass: 'light-text'
                },
                left_column: {
                    type: 'column',
                    addClass: 'left_column',
                    showOn: {field: 'step_1.style', value: '1'},
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
                    showOn: {field: 'step_1.style', value: '1'},
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
                },
                align: {
                    title: 'alignment',
                    type: 'radio',
                    values: {'left':'left','center':'center','right':'right'},
                    default_value: 'center',
                    showOn: {field: 'step_1.style', value: ['1','2','3','4','5','6','cart']}
                }
            },
            step_3: {
                gateway: {
                    title: 'payment_gateway',
                    type: 'select',
                    values: OPMPaymentGateways
                },
                level: {
                    title: 'membership_level',
                    type: 'select',
                    values: WithoutFreeOPMLevels
                },
                click_product_type: {
                    title: 'click_product_type',
                    type: 'select',
                    values: {'standard':'Standard', 'recurring':'Recurring'},
                    default_value: 'recurring',
                    showOn: {field:'step_3.gateway', value: 'clickbank', displayType: 'inline-block'},
                    events: {
                        change: function(value) {
                            if (value.target.selectedIndex == '1') {
                                $('.field-id-op_assets_core_membership_order_button_click_trial_period').show();
                                $('.field-id-op_assets_core_membership_order_button_click_rebill').show();
                                $('.field-id-op_assets_core_membership_order_button_one_time_clickbank').hide();
                            } else {
                                $('.field-id-op_assets_core_membership_order_button_click_trial_period').hide();
                                $('.field-id-op_assets_core_membership_order_button_click_rebill').hide();
                                $('.field-id-op_assets_core_membership_order_button_one_time_clickbank').show();
                            }
                            return false;
                        }
                    }
                },
                click_product_item: {
                    title: 'click_product_item',
                    required: true,
                    showOn: {field:'step_3.gateway', value: 'clickbank'}
                },
                click_trial_period: {
                    title: 'click_trial_period',
                    type: 'select',
                    values: {'0-D':'No trial','3-D':'3 days','4-D':'4 days','5-D':'5 days','6-D':'6 days','7-D':'7 days',
                            '8-D':'8 days','9-D':'9 days','10-D':'10 days','11-D':'11 days',
                            '12-D':'12 days','13-D':'13 days','14-D':'14 days','15-D':'15 days',
                            '16-D':'16 days','17-D':'17 days','18-D':'18 days','19-D':'19 days',
                            '20-D':'20 days','21-D':'21 days','22-D':'22 days','23-D':'23 days',
                            '24-D':'24 days','25-D':'25 days','26-D':'26 days','27-D':'27 days','28-D':'28 days','29-D':'29 days','30-D':'30 days','31-D':'31 days'},
                    showOn: {field:'step_3.gateway', value: 'clickbank', displayType: 'inline-block'}
                },
                click_rebill: {
                    title: 'click_rebill',
                    type: 'select',
                    values: {'2-W':'Bi-weekly', '1-M':'Monthly', '3-M':'Quarterly', '1-Y':'Yearly'},
                    default_value: '1-M',
                    showOn: {field:'step_3.gateway', value: 'clickbank', displayType: 'inline-block'}
                },
                click_skin: {
                    title: 'click_skin',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'}
                },
                click_skin_note: {
                    type: 'paragraph',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'},
                    text: OP_AB.translate('click_skin_note'),
                    addClass: 'field_note'
                },
                click_fid: {
                    title: 'click_fid',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'}
                },
                click_fid_note: {
                    type: 'paragraph',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'},
                    text: OP_AB.translate('click_fid_note'),
                    addClass: 'field_note'
                },
                click_fid_recuring: {
                    title: 'click_fid_recuring',
                    type: 'checkbox',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'}
                },
                click_ur: {
                    title: 'click_ur',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'}
                },
                click_ur_note: {
                    type: 'paragraph',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'},
                    text: OP_AB.translate('click_ur_note'),
                    addClass: 'field_note'
                },
                click_f: {
                    title: 'click_f',
                    default_value: 'auto',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'}
                },
                click_f_note: {
                    type: 'paragraph',
                    showOn: {field: 'step_3.gateway', value: 'clickbank'},
                    text: OP_AB.translate('click_f_note'),
                    addClass: 'field_note'
                },
                one_time_clickbank: {
                    title: 'one_time_clickbank',
                    type: 'select',
                    values: {
                         '1-D':'One Time ( for 1 day access )', '2-D':'One Time ( for 2 day access )', '3-D':'One Time ( for 3 day access )',
                         '4-D':'One Time ( for 4 day access )', '5-D':'One Time ( for 5 day access )', '6-D':'One Time ( for 6 day access )',
                         '1-W':'One Time ( for 1 week access )', '2-W':'One Time ( for 2 week access )', '3-W':'One Time ( for 3 week access )',
                         '1-M':'One Time ( for 1 month access )', '2-M':'One Time ( for 2 month access )', '3-M':'One Time ( for 3 month access )',
                         '4-W':'One Time ( for 4 month access )', '5-M':'One Time ( for 5 month access )', '6-M':'One Time ( for 6 month access )',
                         '1-Y':'One Time ( for 1 year access )', '2-Y':'One Time ( for 2 year access )', '3-Y':'One Time ( for 3 year access )',
                         '4-Y':'One Time ( for 4 year access )', '5-Y':'One Time ( for 5 year access )',
                         '1-L':'One Time ( for lifetime access )',
                            },
                    default_value: '1-M',
                    showOn: {field:'step_3.gateway', value: 'clickbank', displayType: 'inline-block'}
                },
                first: {
                    title: 'first',
                    showOn: {field:'step_3.gateway', value: ['authnet', 'google', 'paypal'], displayType: 'inline-block'},
                },
                days: {
                    title: 'select',
                    type: 'select',
                    values: {'D':'Days', 'W':'Weeks', 'M':'Months', 'Y':'Years'},
                    showOn: {field:'step_3.gateway', value: ['authnet', 'google', 'paypal'], displayType: 'inline-block'}
                },
                at: {
                    title: 'at',
                    showOn: {field:'step_3.gateway', value: ['authnet', 'google', 'paypal'], displayType: 'inline-block'}
                },
                want_to_charge: {
                    title: 'want_to_charge',
                    default_value: '0.01',
                    showOn: {field:'step_3.gateway',value:['alipay', 'authnet', 'google', 'paypal', 'stripe'], displayType: 'inline-block'},
                },
                one_time_auth: {
                    title: 'one_time_auth',
                    type: 'select',
                    values: {'1-W-1':'Weekly ( recurring charge, for ongoing access )', '2-W-1':'Bi-Weekly ( recurring charge, for ongoing access )',
                             '1-M-1':'Monthly ( recurring charge, for ongoing access )', '2-M-1':'Bi-Monthly ( recurring charge, for ongoing access )', '3-M-1':'Quarterly ( recurring charge, for ongoing access )',
                             '1-Y-1':'Yearly ( recurring charge, for ongoing access )', '0':'',
                             '1-W-0':'One Time ( for 1 week access, non-recurring )', '2-W-0':'One Time ( for 2 week access, non-recurring )', '3-W-0':'One Time ( for 3 week access, non-recurring )',
                             '1-M-0':'One Time ( for 1 month access, non-recurring )', '2-M-0':'One Time ( for 2 month access, non-recurring )', '3-M-0':'One Time ( for 3 month access, non-recurring )',
                             '4-M-0':'One Time ( for 4 month access, non-recurring )', '5-M-0':'One Time ( for 5 month access, non-recurring )', '6-M-0':'One Time ( for 6 month access, non-recurring )',
                             '1-Y-0':'One Time ( for 1 year access, non-recurring )', '00':'',
                             '1-D-BN':'One Time ( for 1 day access, non-recurring, no trial )', '2-D-BN':'One Time ( for 2 day access, non-recurring, no trial )', '3-D-BN':'One Time ( for 3 day access, non-recurring, no trial )',
                             '4-D-BN':'One Time ( for 4 day access, non-recurring, no trial )', '5-D-BN':'One Time ( for 5 day access, non-recurring, no trial )', '6-D-BN':'One Time ( for 6 day access, non-recurring, no trial )',
                             '1-W-BN':'One Time ( for 1 week access, non-recurring, no trial )', '2-W-BN':'One Time ( for 2 week access, non-recurring, no trial )', '3-W-BN':'One Time ( for 3 week access, non-recurring, no trial )',
                             '1-M-BN':'One Time ( for 1 month access, non-recurring, no trial )', '2-M-BN':'One Time ( for 2 month access, non-recurring, no trial )', '3-M-BN':'One Time ( for 3 month access, non-recurring, no trial )',
                             '4-W-BN':'One Time ( for 4 month access, non-recurring, no trial )', '5-M-BN':'One Time ( for 5 month access, non-recurring, no trial )', '6-M-BN':'One Time ( for 6 month access, non-recurring, no trial )',
                             '1-Y-BN':'One Time ( for 1 year access, non-recurring, no trial )', '2-Y-BN':'One Time ( for 2 year access, non-recurring, no trial )', '3-Y-BN':'One Time ( for 3 year access, non-recurring, no trial )',
                             '4-Y-BN':'One Time ( for 4 year access, non-recurring, no trial )', '5-Y-BN':'One Time ( for 5 year access, non-recurring, no trial )', '6-Y-BN':'One Time ( for 6 year access, non-recurring, no trial )',
                             '1-L-BN':'One Time ( for lifetime access, non-recurring, no trial )',
                             },
                    default_value: '1-M-1',
                    showOn: {field:'step_3.gateway',value:['authnet', 'google', 'paypal', 'stripe'], displayType: 'inline-block'},
                    events: {
                        change: function(value) {
                            if (value.target.selectedIndex > '17') {
                                $('.field-id-op_assets_core_membership_order_button_first').hide();
                                $('.field-id-op_assets_core_membership_order_button_days').hide();
                                $('.field-id-op_assets_core_membership_order_button_at').hide();
                            } else {
                                $('.field-id-op_assets_core_membership_order_button_first').show();
                                $('.field-id-op_assets_core_membership_order_button_days').show();
                                $('.field-id-op_assets_core_membership_order_button_at').show();
                            }
                            return false;
                        }
                    }
                },
                currency_new: {
                    title: 'currency',
                    type: 'select',
                    values: {"ADF": "ADF", "ADP": "ADP", "AED": "AED", "AFA": "AFA", "AFN": "AFN", "ALL": "ALL", "AMD": "AMD",
                             "ANG": "ANG", "AOA": "AOA", "AON": "AON", "ARS": "ARS", "ATS": "ATS", "AUD": "AUD", "AWG": "AWG",
                             "AZN": "AZN", "BAM": "BAM", "BBD": "BBD", "BDT": "BDT", "BEF": "BEF", "BGN": "BGN", "BHD": "BHD",
                             "BIF": "BIF", "BMD": "BMD", "BND": "BND", "BOB": "BOB", "BRL": "BRL", "BSD": "BSD", "BTN": "BTN",
                             "BWP": "BWP", "BYR": "BYR", "BZD": "BZD", "CAD": "CAD", "CDF": "CDF", "CFP": "CFP", "CHF": "CHF",
                             "CLP": "CLP", "CNY": "CNY", "COP": "COP", "CRC": "CRC", "CSK": "CSK", "CUC": "CUC", "CUP": "CUP",
                             "CVE": "CVE", "CYP": "CYP", "CZK": "CZK", "DEM": "DEM", "DJF": "DJF", "DKK": "DKK", "DOP": "DOP",
                             "DZD": "DZD", "ECS": "ECS", "EEK": "EEK", "EGP": "EGP", "ESP": "ESP", "ETB": "ETB", "EUR": "EUR",
                             "FIM": "FIM", "FJD": "FJD", "FKP": "FKP", "FRF": "FRF", "GBP": "GBP", "GEL": "GEL", "GHC": "GHC",
                             "GHS": "GHS", "GIP": "GIP", "GMD": "GMD", "GNF": "GNF", "GRD": "GRD", "GTQ": "GTQ", "GYD": "GYD",
                             "HKD": "HKD", "HNL": "HNL", "HRK": "HRK", "HTG": "HTG", "HUF": "HUF", "IDR": "IDR", "IEP": "IEP",
                             "ILS": "ILS", "INR": "INR", "IQD": "IQD", "IRR": "IRR", "ISK": "ISK", "ITL": "ITL", "JMD": "JMD",
                             "JOD": "JOD", "JPY": "JPY", "KES": "KES", "KGS": "KGS", "KHR": "KHR", "KMF": "KMF", "KPW": "KPW",
                             "KRW": "KRW", "KWD": "KWD", "KYD": "KYD", "KZT": "KZT", "LAK": "LAK", "LBP": "LBP", "LKR": "LKR",
                             "LRD": "LRD", "LSL": "LSL", "LTL": "LTL", "LUF": "LUF", "LVL": "LVL", "LYD": "LYD", "MAD": "MAD",
                             "MDL": "MDL", "MGF": "MGF", "MKD": "MKD", "MMK": "MMK", "MNT": "MNT", "MOP": "MOP", "MRO": "MRO",
                             "MTL": "MTL", "MUR": "MUR", "MVR": "MVR", "MWK": "MWK", "MXN": "MXN", "MYR": "MYR", "MZM": "MZM",
                             "MZN": "MZN", "NAD": "NAD", "NGN": "NGN", "NIO": "NIO", "NLG": "NLG", "NOK": "NOK", "NPR": "NPR",
                             "NZD": "NZD", "OMR": "OMR", "PAB": "PAB", "PEN": "PEN", "PGK": "PGK", "PHP": "PHP", "PKR": "PKR",
                             "PLN": "PLN", "PTE": "PTE", "PYG": "PYG", "QAR": "QAR", "ROL": "ROL", "RON": "RON", "RSD": "RSD",
                             "RUB": "RUB", "SAR": "SAR", "SBD": "SBD", "SCR": "SCR", "SDD": "SDD", "SDG": "SDG", "SDP": "SDP",
                             "SEK": "SEK", "SGD": "SGD", "SHP": "SHP", "SIT": "SIT", "SKK": "SKK", "SLL": "SLL", "SOS": "SOS",
                             "SRD": "SRD", "SRG": "SRG", "STD": "STD", "SVC": "SVC", "SYP": "SYP", "SZL": "SZL", "THB": "THB",
                             "TMM": "TMM", "TND": "TND", "TOP": "TOP", "TRL": "TRL", "TRY": "TRY", "TTD": "TTD", "TWD": "TWD",
                             "TZS": "TZS", "UAH": "UAH", "UGS": "UGS", "USD": "USD", "UYU": "UYU", "UZS": "UZS", "VEF": "VEF",
                             "VND": "VND", "VUV": "VUV", "WST": "WST", "XAF": "XAF", "XCD": "XCD", "XOF": "XOF", "XPF": "XPF",
                             "YER": "YER", "YUN": "YUN", "ZAR": "ZAR", "ZMK": "ZMK", "ZWD": "ZWD"},
                    default_value: 'USD',
                    showOn: {field:'step_3.gateway', value: ['google', 'paypal', 'stripe']}
                },
                success_url: {
                    title: 'success_url',
                    showOn: {field: 'step3.gateway', value: ['paypal', 'stripe'], displayType: 'inline-block'}
                },
                first_cc: {
                    title: 'first',
                    showOn: {field:'step_3.gateway', value: 'ccbill', displayType: 'inline-block'}
                },
                days_cc: {
                    title: 'select',
                    type: 'select',
                    values: {'D':'Days'},
                    showOn: {field:'step_3.gateway', value: 'ccbill', displayType: 'inline-block'}
                },
                at_cc: {
                    title: 'at',
                    showOn: {field:'step_3.gateway', value: 'ccbill', displayType: 'inline-block'}
                },

                page_style: {
                    title: 'page_style',
                    default_value: 'paypal',
                    showOn: {field:'step_3.gateway',value:'paypal', displayType: 'inline-block'},
                },
                want_to_charge_cc: {
                    title: 'want_to_charge',
                    default_value: '0.01',
                    showOn: {field:'step_3.gateway',value:'ccbill', displayType: 'inline-block'},
                },
                one_time_cc: {
                    title: 'one_time_auth',
                    type: 'select',
                    values: {
                             '1-M-1':'Monthly ( recurring charge, for ongoing access )', '2-M-1':'Bi-Monthly ( recurring charge, for ongoing access )', '3-M-1':'Quarterly ( recurring charge, for ongoing access )',
                             '':'',

                             '2-D-0':'One Time ( for 2 day access, non-recurring, no trial )', '3-D-0':'One Time ( for 3 day access, non-recurring, no trial )',
                             '4-D-0':'One Time ( for 4 day access, non-recurring, no trial )', '5-D-0':'One Time ( for 5 day access, non-recurring, no trial )', '6-D-0':'One Time ( for 6 day access, non-recurring, no trial )',
                             '1-W-0':'One Time ( for 1 week access, non-recurring, no trial )', '2-W-0':'One Time ( for 2 week access, non-recurring, no trial )', '3-W-0':'One Time ( for 3 week access, non-recurring, no trial )',
                             '1-M-0':'One Time ( for 1 month access, non-recurring, no trial )', '2-M-0':'One Time ( for 2 month access, non-recurring, no trial )', '3-M-0':'One Time ( for 3 month access, non-recurring, no trial )',
                             '4-W-0':'One Time ( for 4 month access, non-recurring, no trial )', '5-M-0':'One Time ( for 5 month access, non-recurring, no trial )', '6-M-0':'One Time ( for 6 month access, non-recurring, no trial )',
                             '1-Y-0':'One Time ( for 1 year access, non-recurring, no trial )',
                             },
                    default_value: '1-M-1',
                    showOn: {field:'step_3.gateway',value:'ccbill', displayType: 'inline-block'},
                    events: {
                        change: function(value) {
                            if (value.target.selectedIndex > '3') {
                                $('.field-id-op_assets_core_membership_order_button_first').hide();
                                $('.field-id-op_assets_core_membership_order_button_days').hide();
                                $('.field-id-op_assets_core_membership_order_button_at').hide();
                                $('.field-id-op_assets_core_membership_order_button_first_cc').hide();
                                $('.field-id-op_assets_core_membership_order_button_days_cc').hide();
                                $('.field-id-op_assets_core_membership_order_button_at_cc').hide();
                            } else {
                                $('.field-id-op_assets_core_membership_order_button_first').hide();
                                $('.field-id-op_assets_core_membership_order_button_days').hide();
                                $('.field-id-op_assets_core_membership_order_button_at').hide();
                                $('.field-id-op_assets_core_membership_order_button_first_cc').show();
                                $('.field-id-op_assets_core_membership_order_button_days_cc').show();
                                $('.field-id-op_assets_core_membership_order_button_at_cc').show();
                            }
                            return false;
                        }
                    }
                },
                currency_cc: {
                    title: 'currency',
                    type: 'select',
                    values: {'AUD':'AUD', 'CAD':'CAD','EUR':'EUR','GBP':'GBP','JPY':'JPY','USD':'USD'},
                    default_value: 'USD',
                    showOn: {field:'step_3.gateway',value:'ccbill', displayType: 'inline-block'}
                },
                one_time: {
                    title: 'one_time',
                    type: 'select',
                    values: {'1-D':'One time (for 1 day access)', '2-D':'One time (for 2 day access)', '3-D':'One time (for 3 day access)',
                             '4-D':'One time (for 4 day access)', '5-D':'One time (for 5 day access)', '6-D':'One time (for 6 day access)',
                             '1-W':'One time (for 1 week access)', '2-W':'One time (for 2 week access)', '3-W':'One time (for 3 week access)',
                             '1-M':'One time (for 1 month access)', '2-M':'One time (for 2 month access)', '3-M':'One time (for 6 month access)',
                             '4-M':'One time (for 4 month access)', '5-M':'One time (for 5 month access)', '6-M':'One time (for 6 month access)',
                             '1-Y':'One time (for 1 year access)', '2-Y':'One time (for 2 year access)', '3-Y':'One time (for 3 year access)',
                             '4-Y':'One time (for 4 year access)', '5-Y':'One time (for 5 year access)', '6-Y':'One time (for 6 year access)',
                             '1-L':'One time (for lifetime access)'
                             },
                    default_value: '1-M',
                    showOn: {field:'step_3.gateway', value:'alipay', displayType: 'inline-block'}
                },
                description: {
                    title: 'description',
                    default_value: 'Description'
                },
                packages: {
                    title: 'packages',
                    type: 'checkbox',
                    values: OPMPackages,
                }
            },
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: 'previews',
                    addClass: 'op-disable-selected'
                }
            }
        },
        insert_steps: {
            2:{next: 'next_step', insert: false},
            3:true,
        },
        customInsert: function (attrs) {
            var str = '',
                gateway = attrs.gateway,
                buttonStr = '',
                packages = [],
                nonButtonFields = [
                    'gateway', 'level', 'click_product_type', 'click_product_item', 'click_trial_period', 'click_rebill', 'one_time_clickbank', 'first', 'days', 'at', 'want_to_charge', 'one_time_auth',
                    'first_cc', 'days_cc', 'at_cc', 'page_style', 'want_to_charge_cc', 'one_time_cc', 'currency_cc', 'one_time', 'description', 'packages', 'currency_new', 'success_url',
                    'click_skin','click_fid', 'click_fid_recuring', 'click_ur', 'click_f'
                ];

            if (!gateway) {
                alert('Please select Payment Gateway!');
                return false;
            }

            if (!attrs['level']) {
                alert('Please select Membership Level!');
                return false;
            }

            $.each(nonButtonFields,function(i,key){
                var value = attrs[key] || '';
                if (typeof value != 'undefined' && value != '') {
                    str += ' '+key+'="'+value.toString().replace(/"/ig,"'")+'"';
                }
                delete attrs[key];
            });

            /*
             * Fetching packages
             */
            $('[name="op_assets_core_membership_order_button_packages[]"]:checked').each(function (i, item) {
                packages.push($(item).val());
            });
            str += ' ccaps="' + packages.join(',') + '"';

            /*
             * Custom button
             */
            if (attrs.style != '0') {
                /*
                 * Button element type
                 */
                switch (gateway) {
                    case 'authnet':
                    case 'paypal':
                    case 'stripe':
                        attrs.element_type = 'button';
                        break;
                    case 'alipay':
                    case 'ccbill':
                    case 'clickbank':
                    case 'google':
                    default:
                        attrs.element_type = 'a';
                        attrs.href = '%%url%%';
                        break;
                }
                buttonStr = customInsertButton(attrs);
            }

            str = '[membership_order_button'+str+']'+buttonStr+'[/membership_order_button]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function (attrs, steps) {
            var idPrefix = 'op_assets_core_membership_order_button_';
            /*
             * Button values
             */
            var buttonAttrs;
            if (typeof attrs.button_1 != 'undefined') {
                buttonAttrs = attrs.button_1[0].attrs;
                buttonAttrs.style = '1';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_2 != 'undefined') {
                buttonAttrs = attrs.button_2[0].attrs;
                buttonAttrs.style = '2';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_3 != 'undefined') {
                buttonAttrs = attrs.button_3[0].attrs;
                buttonAttrs.style = '3';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_4 != 'undefined') {
                buttonAttrs = attrs.button_4[0].attrs;
                buttonAttrs.style = '4';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_5 != 'undefined') {
                buttonAttrs = attrs.button_5[0].attrs;
                buttonAttrs.style = '5';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_6 != 'undefined') {
                buttonAttrs = attrs.button_6[0].attrs;
                buttonAttrs.style = '6';
                customSettingsButton(buttonAttrs);
            } else if (typeof attrs.button_7 != 'undefined') {
                buttonAttrs = attrs.button_7[0].attrs;
                buttonAttrs.style = '7';
                customSettingsButton(buttonAttrs);
            } else {
                OP_AB.set_selector_value(idPrefix + 'style_container', '0');
            }

            /*
             * Other (step 4.) values
             */
            attrs = attrs.attrs;
            $('#' + idPrefix + 'gateway').val(attrs.gateway).trigger('change');
            $('#' + idPrefix + 'level').val(attrs.level).trigger('change');
            $('#' + idPrefix + 'click_product_type').val(attrs.click_product_type).trigger('change');
            $('#' + idPrefix + 'click_trial_period').val(attrs.click_trial_period).trigger('change');
            $('#' + idPrefix + 'click_rebill').val(attrs.click_rebill).trigger('change');
            $('#' + idPrefix + 'one_time_clickbank').val(attrs.one_time_clickbank).trigger('change');
            $('#' + idPrefix + 'days').val(attrs.days).trigger('change');
            $('#' + idPrefix + 'one_time_auth').val(attrs.one_time_auth).trigger('change');
            $('#' + idPrefix + 'days_cc').val(attrs.days_cc).trigger('change');
            $('#' + idPrefix + 'one_time_cc').val(attrs.one_time_cc).trigger('change');
            $('#' + idPrefix + 'currency_cc').val(attrs.currency_cc).trigger('change');
            $('#' + idPrefix + 'one_time').val(attrs.one_time).trigger('change');
            $('#' + idPrefix + 'click_product_item').val(attrs.click_product_item);
            $('#' + idPrefix + 'click_skin').val(attrs.click_skin);
            $('#' + idPrefix + 'click_fid').val(attrs.click_fid);
            $('#' + idPrefix + 'click_ur').val(attrs.click_ur);
            $('#' + idPrefix + 'click_f').val(attrs.click_f);
            $('#' + idPrefix + 'first').val(attrs.first);
            $('#' + idPrefix + 'at').val(attrs.at);
            $('#' + idPrefix + 'want_to_charge').val(attrs.want_to_charge);
            $('#' + idPrefix + 'first_cc').val(attrs.first_cc);
            $('#' + idPrefix + 'at_cc').val(attrs.at_cc);
            $('#' + idPrefix + 'page_style').val(attrs.page_style);
            $('#' + idPrefix + 'want_to_charge_cc').val(attrs.want_to_charge_cc);
            $('#' + idPrefix + 'description').val(attrs.description);
            $('#' + idPrefix + 'currency_new').val(attrs.currency_new);
            $('#' + idPrefix + 'success_url').val(attrs.success_url);
            // checkboxes
            $('[name="op_assets_core_membership_order_button_packages[]"]').each(function (i, item) {
                if ($.inArray($(item).val(), attrs.ccaps.split(',')) > -1) {
                    $(item).attr('checked', true);
                }
            });
            if ( attrs.click_fid_recuring == 'Y' )
                $('#op_assets_core_membership_order_button_click_fid_recuring').attr('checked', true);
        }
    };
    function customSettingsButton(attrs) {
        var style = attrs.style,
            idprefix = 'op_assets_core_membership_order_button_';
        OP_AB.set_selector_value(idprefix+'style_container',style);
        switch(style){
            case 'cart':
                OP_AB.set_selector_value(idprefix+'bg_img_cart_container',attrs.bg);
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
                break;
            case '1':
                var preset = $.extend(true, {}, op_membership_button_presets.presets['default'].attributes);
                for (i in attrs) {
                    if (typeof preset[i] != 'undefined') {
                        preset[i].value = attrs[i];
                    }
                }
                op_membership_button_presets.change(preset);
                break;
        };
        $('input[name="' + idprefix + 'align[]"][value="'+(attrs.align || 'center')+'"]').attr('checked',true);
    }
    function customInsertButton(attrs) {
        var str = '', fields = {}, append = {}, has_content = false;
        switch(attrs.style){
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
            case 'cart':
                fields = {'bg':'bg_img_cart'};
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
                    'inset_shadow_opacity': 'opacity_2',
                };
                break;
            default:
                attrs.style = 2;
                has_content = true;
                fields = {'color':'color_1'};
                break;
        }
        /*
         * Common fields
         */
        fields.href         = 'href';
        fields.element_type = 'element_type';
        fields.align        = 'align';

        $.each(fields,function(i,v){
            if (attrs[v] === 0) {
                var val = 0;
            } else {
                var val = attrs[v] || '';
            }
            if(typeof val != 'undefined' && val !== ''){
                str += ' '+i+'="'+val.toString().replace(/"/ig,"'")+'"';
            }
        });

        if(attrs.cc && attrs.cc != ''){
            append['cc'] = attrs.cc;
        }

        $.each(append,function(i,v){
            if(v != ''){
                str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
            }
        });

        str = '[button_'+attrs.style+str+(has_content?']'+attrs.content+'[/button_'+attrs.style+'] ':'/]');
        return str;
    };
}(opjq));

var op_membership_button_presets = (function($){
    return {
        presets: {
            'default': {
                attributes: {
                    text: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_text_box_text_properties_1_text',
                        type: 'text'
                    },
                    text_size: {
                        value: 36,
                        selector: '#op_assets_core_membership_order_button_text_box_text_properties_1_size',
                        type: 'dropdown'
                    },
                    text_font: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_text_box_text_properties_1_container',
                        type: 'font'
                    },
                    text_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_text_box_text_properties_1_color',
                        type: 'color'
                    },
                    text_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_text_box_text_properties_1 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    text_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_text_box_text_properties_1 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    text_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_text_box_text_properties_1 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    text_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_text_box_letter_spacing_1',
                        type: 'slider'
                    },
                    subtext_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_membership_order_button_subtext_box',
                        type: 'checkbox'
                    },
                    subtext: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_subtext_box_text_properties_2_text',
                        type: 'text'
                    },
                    subtext_size: {
                        value: 14,
                        selector: '#op_assets_core_membership_order_button_subtext_box_text_properties_2_size',
                        type: 'dropdown'
                    },
                    subtext_font: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_subtext_box_text_properties_2_container',
                        type: 'font'
                    },
                    subtext_color: {
                        value: '#ffffff',
                        selector: '#op_assets_core_membership_order_button_subtext_box_text_properties_2_color',
                        type: 'color'
                    },
                    subtext_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_subtext_box_text_properties_2 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    subtext_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_subtext_box_text_properties_2 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    subtext_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_membership_order_button_subtext_box_text_properties_2 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    subtext_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_subtext_box_letter_spacing_2',
                        type: 'slider'
                    },
                    text_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_membership_order_button_text_shadow',
                        type: 'checkbox'
                    },
                    text_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_text_shadow_vertical_axis_1',
                        type: 'slider'
                    },
                    text_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_text_shadow_horizontal_axis_1',
                        type: 'slider'
                    },
                    text_shadow_color: {
                        value: '#ffff00',
                        selector: '#op_assets_core_membership_order_button_text_shadow_shadow_color_1',
                        type: 'color'
                    },
                    text_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_text_shadow_blur_radius_1',
                        type: 'slider'
                    },
                    styling_width: {
                        value: 60,
                        selector: '#op_assets_core_membership_order_button_styling_width_1',
                        type: 'slider'
                    },
                    styling_height: {
                        value: 30,
                        selector: '#op_assets_core_membership_order_button_styling_height_1',
                        type: 'slider'
                    },
                    styling_border_size: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_styling_border_size_1',
                        type: 'slider'
                    },
                    styling_border_radius: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_styling_border_radius_1',
                        type: 'slider'
                    },
                    styling_border_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_styling_border_color_1',
                        type: 'color'
                    },
                    styling_border_opacity: {
                        value: 100,
                        selector: '#op_assets_core_membership_order_button_styling_border_opacity_1',
                        type: 'slider'
                    },
                    styling_gradient: {
                        value: false,
                        selector: '#op_assets_core_membership_order_button_styling_gradient_1',
                        type: 'checkbox'
                    },
                    styling_shine: {
                        value: false,
                        selector: '#op_assets_core_membership_order_button_styling_shine_1',
                        type: 'checkbox'
                    },
                    styling_gradient_start_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_styling_gradient_start_color_1',
                        type: 'color'
                    },
                    styling_gradient_end_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_styling_gradient_end_color_2',
                        type: 'color'
                    },
                    drop_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_membership_order_button_drop_shadow',
                        type: 'checkbox'
                    },
                    drop_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_drop_shadow_vertical_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_drop_shadow_horizontal_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_drop_shadow_border_radius_2',
                        type: 'slider'
                    },
                    drop_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_drop_shadow_spread_radius_1',
                        type: 'slider'
                    },
                    drop_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_drop_shadow_shadow_color_2',
                        type: 'color'
                    },
                    drop_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_membership_order_button_drop_shadow_opacity_1',
                        type: 'slider'
                    },
                    inset_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_membership_order_button_inset_shadow',
                        type: 'checkbox'
                    },
                    inset_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_inset_shadow_vertical_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_inset_shadow_horizontal_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_inset_shadow_border_radius_3',
                        type: 'slider'
                    },
                    inset_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_membership_order_button_inset_shadow_spread_radius_2',
                        type: 'slider'
                    },
                    inset_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_membership_order_button_inset_shadow_shadow_color_3',
                        type: 'color'
                    },
                    inset_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_membership_order_button_inset_shadow_opacity_2',
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
                        $('#op_asset_browser_slide3 .op-settings-core-membership_order_button').trigger({
                            type: 'update_button_preview',
                            tag: 'membership_order_button',
                            id: defaults[i].selector.substr(1),
                            value: $item.attr('alt'),
                            font_type: $item.attr('data-type'),
                            font_family: $item.attr('data-family')});
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
}(opjq));

window.op_custom_membership_button = (function($){
    return {
        update: function(e) {
            var id = e.id, value = e.value;
            switch (id) {
                /*
                 * Preset
                 */
                case 'op_assets_core_membership_order_button_button_preview_container':
                    op_membership_button_presets.switch(value);
                    break;
                /*
                 * Text box
                 */
                case 'op_assets_core_membership_order_button_text_box_text_properties_1_text':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').html(value);
                    break;
                case 'op_assets_core_membership_order_button_text_box_text_properties_1_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_membership_order_button_text_box_text_properties_1_container':
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
                case 'op_assets_core_membership_order_button_text_box_text_properties_1_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('color', value);
                    break;
                case 'op_assets_core_membership_order_button_text_box_letter_spacing_1':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Subtext box
                 */
                case 'op_assets_core_membership_order_button_subtext_box_text_properties_2_text':
                    var element = $('#op_button_preview.pbox_' + e.tag + ' .subtext');
                    element.html(value);
                    if (value == '') {
                        element.hide();
                    } else {
                        element.show();
                    }
                    break;
                case 'op_assets_core_membership_order_button_subtext_box_text_properties_2_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_membership_order_button_subtext_box_text_properties_2_container':
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
                case 'op_assets_core_membership_order_button_subtext_box_text_properties_2_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('color', value);
                    break;
                case 'op[op_assets_core_membership_order_button_subtext_box][enabled]':
                    if (value == 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').hide();
                    }
                    break;
                case 'op_assets_core_membership_order_button_subtext_box_letter_spacing_2':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Text shadow
                 */
                case 'op_assets_core_membership_order_button_text_shadow_vertical_axis_1':
                case 'op_assets_core_membership_order_button_text_shadow_horizontal_axis_1':
                case 'op_assets_core_membership_order_button_text_shadow_blur_radius_1':
                case 'op_assets_core_membership_order_button_text_shadow_shadow_color_1':
                case 'op[op_assets_core_membership_order_button_text_shadow][enabled]':
                    if ($('input[name="op[op_assets_core_membership_order_button_text_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis = $('#op_assets_core_membership_order_button_text_shadow_vertical_axis_1').slider('value');
                        var horizontal_axis = $('#op_assets_core_membership_order_button_text_shadow_horizontal_axis_1').slider('value');
                        var blur_radius = $('#op_assets_core_membership_order_button_text_shadow_blur_radius_1').slider('value');
                        var shadow_color = $('#op_assets_core_membership_order_button_text_shadow_shadow_color_1').val();
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
                case 'op_assets_core_membership_order_button_styling_width_1':
                    var max = $('#op_assets_core_membership_order_button_styling_width_1').slider('option', 'max');
                    if (max == value) {
                        $('#op_button_preview.pbox_' + e.tag).css('width', '100%');
                        $('#output_op_assets_core_membership_order_button_styling_width_1').html('100%');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_membership_order_button_styling_height_1').slider('value') + 'px 0');
                        return false;
                    } else {
                        $('#op_button_preview.pbox_' + e.tag).css('width', 'auto');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_membership_order_button_styling_height_1').slider('value') + 'px ' + value + 'px');
                    }
                    break;
                case 'op_assets_core_membership_order_button_styling_height_1':
                    $('#op_button_preview.pbox_' + e.tag).css('padding', value + 'px ' + $('#op_assets_core_membership_order_button_styling_width_1').slider('value') + 'px');
                    break;
                case 'op_assets_core_membership_order_button_styling_border_color_1':
                case 'op_assets_core_membership_order_button_styling_border_opacity_1':
                    var border_opacity = $('#op_assets_core_membership_order_button_styling_border_opacity_1').slider('value');
                    var border_color = $('#op_assets_core_membership_order_button_styling_border_color_1').val();
                    if (border_color === '') {
                        border_color = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag).css('border-color', generateCssColor(border_color, border_opacity));
                    break;
                case 'op_assets_core_membership_order_button_styling_border_size_1':
                    $('#op_button_preview.pbox_' + e.tag).css('border-width', value + 'px');
                    break;
                case 'op_assets_core_membership_order_button_styling_border_radius_1':
                    $('#op_button_preview.pbox_' + e.tag + ', #op_button_preview.pbox_' + e.tag + ' .gradient, #op_button_preview.pbox_' + e.tag + ' .active, #op_button_preview.pbox_' + e.tag + ' .hover, #op_button_preview.pbox_' + e.tag + ' .shine').css('border-radius', value + 'px');
                    break;
                case 'op_assets_core_membership_order_button_styling_shine_1':
                    if (value === 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').hide();
                    }
                    break;
                case 'op_assets_core_membership_order_button_styling_gradient_start_color_1':
                case 'op_assets_core_membership_order_button_styling_gradient_end_color_2':
                case 'op_assets_core_membership_order_button_styling_gradient_1':
                    var start_color = $('#op_assets_core_membership_order_button_styling_gradient_start_color_1').val();
                    var end_color = $('#op_assets_core_membership_order_button_styling_gradient_end_color_2').val();
                    var gradient_status = $('#op_assets_core_membership_order_button_styling_gradient_1').is(':checked');

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
                case 'op[op_assets_core_membership_order_button_drop_shadow][enabled]':
                case 'op_assets_core_membership_order_button_drop_shadow_vertical_axis_2':
                case 'op_assets_core_membership_order_button_drop_shadow_horizontal_axis_2':
                case 'op_assets_core_membership_order_button_drop_shadow_border_radius_2':
                case 'op_assets_core_membership_order_button_drop_shadow_spread_radius_1':
                case 'op_assets_core_membership_order_button_drop_shadow_opacity_1':
                case 'op_assets_core_membership_order_button_drop_shadow_shadow_color_2':
                // Inner/inset
                case 'op[op_assets_core_membership_order_button_inset_shadow][enabled]':
                case 'op_assets_core_membership_order_button_inset_shadow_vertical_axis_3':
                case 'op_assets_core_membership_order_button_inset_shadow_horizontal_axis_3':
                case 'op_assets_core_membership_order_button_inset_shadow_border_radius_3':
                case 'op_assets_core_membership_order_button_inset_shadow_spread_radius_2':
                case 'op_assets_core_membership_order_button_inset_shadow_opacity_2':
                case 'op_assets_core_membership_order_button_inset_shadow_shadow_color_3':

                    var styles = [];

                    if ($('input[name="op[op_assets_core_membership_order_button_drop_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_1 = $('#op_assets_core_membership_order_button_drop_shadow_vertical_axis_2').slider('value');
                        var horizontal_axis_1 = $('#op_assets_core_membership_order_button_drop_shadow_horizontal_axis_2').slider('value');
                        var border_radius_1 = $('#op_assets_core_membership_order_button_drop_shadow_border_radius_2').slider('value');
                        var spread_radius_1 = $('#op_assets_core_membership_order_button_drop_shadow_spread_radius_1').slider('value');
                        var shadow_color_1 = $('#op_assets_core_membership_order_button_drop_shadow_shadow_color_2').val();
                        var opacity_1 = $('#op_assets_core_membership_order_button_drop_shadow_opacity_1').slider('value');
                        if (shadow_color_1 === '') {
                            shadow_color_1 = '#ffffff';
                        }
                        color_1 = generateCssColor(shadow_color_1, opacity_1);
                        styles.push(horizontal_axis_1 + 'px ' + vertical_axis_1 + 'px ' + border_radius_1 + 'px ' + spread_radius_1 + 'px ' + color_1);
                    }

                    if ($('input[name="op[op_assets_core_membership_order_button_inset_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_2 = $('#op_assets_core_membership_order_button_inset_shadow_vertical_axis_3').slider('value');
                        var horizontal_axis_2 = $('#op_assets_core_membership_order_button_inset_shadow_horizontal_axis_3').slider('value');
                        var border_radius_2 = $('#op_assets_core_membership_order_button_inset_shadow_border_radius_3').slider('value');
                        var spread_radius_2 = $('#op_assets_core_membership_order_button_inset_shadow_spread_radius_2').slider('value');
                        var shadow_color_2 = $('#op_assets_core_membership_order_button_inset_shadow_shadow_color_3').val();
                        var opacity_2 = $('#op_assets_core_membership_order_button_inset_shadow_opacity_2').slider('value');
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
