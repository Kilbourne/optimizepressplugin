var op_asset_settings = (function($){
    var tmp_obj, hdn_elems = {}, input_elems = {}, disable_focus = false,
        no_name_styles = ['1','4','5','6','9','10'],
        no_content_styles = ['7','9','10'],
        text_button_styles = ['11','13','14','15','16','17','18','19','20'],
        no_extra_styles = ['1', '4', '5', '6', '9', '10', '12', '15', '19', '20'],
        cp_styles = ['18'],
        no_paragraph_styles = ['24'],
        lists = {},
        form_id,
        providerTags = {'missing_integration_type': OP_AB.translate('select_integration_type_first')},
        providersUsingInputFieldsInsteadOfTags = ['aweber', 'email', 'custom'],
        providersUsingCustomFieldsInsteadOfTags = ['mailchimp', 'campaignmonitor', 'emma', 'icontact', 'infusionsoft', 'mailpoet'],
        providersUsingCustomFieldsForNotes = ['campaignmonitor', 'egoi', 'emma', 'icontact', 'infusionsoft', 'mailpoet', 'getresponsev3'],
        providersWithoutGdprSupport = ['email', 'custom'];

    /**
     * Return promise with lists from given providers.
     * @param  {string} provider
     * @return {Array}
     */
    var getProviderLists = function(provider) {
        if (typeof lists[provider] == 'undefined') {
            return $.ajax({
                type: "POST",
                url: OptimizePress.ajaxurl,
                data: {
                    'action': OptimizePress.SN+'-email-provider-items',
                    'provider': provider
                },
                dataType: 'json'
            }).then(function(response) {
                return response.lists;
            });
        }

        return $.Deferred().resolve(lists[provider]);
    }

    /**
     * Fill GDPR dropdowns with custom fields (in case that provider does not support tags).
     * @param  {string} provider
     * @param  {string} fields
     * @return {void}
     */
    var fillGdprDropdownsWithCustomFields = function(provider, fields) {
        var dropdownSelector = [];

        if (providersUsingCustomFieldsInsteadOfTags.indexOf(provider) >= 0) {
            dropdownSelector.push('.op-gdpr-provider-tags-dropdown select');
        }

        if (providersUsingCustomFieldsForNotes.indexOf(provider) >= 0) {
            dropdownSelector.push('.op-gdpr-provider-notes-dropdown select');
        }

        if (dropdownSelector.length > 0) {
            var $tags = $(dropdownSelector.join(', '));

            providerTags = jQuery.extend({}, fields, {'-': OP_AB.translate('no_tag')});

            $tags.each(function(index) {
                var $element = $(this);

                var options = [];
                $.each(providerTags, function (key, name) {
                    options.push($('<option/>', {value: key, text: name}));
                });

                $element.empty().append(options);

                /*
                 * Selecting previously selected value (if editing)
                 */
                if (typeof $element.attr('data-default') != 'undefined') {
                    $element.val($element.attr('data-default'));
                }
            });
        }
    }

    // Removing empty level
    var WithoutEmptyOPMLevels = $.extend({}, OPMLevels);
    delete WithoutEmptyOPMLevels[''];

    // Removing empty package
    var WithoutEmptyOPMPackages = $.extend({}, OPMPackages);
    delete WithoutEmptyOPMPackages[''];

    tmp_obj = $('<div />');
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-optin-form.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-optin-form.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-optin-form.mp4',
                width: '600',
                height: '341'
            }
        },
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: 'previews',
                    addClass: 'op-disable-selected',
                    events: {
                        change: function(value){
                            var el = $('#op_assets_core_optin_box_tabs_submit_button_button_content');
                            var val1 = 'Submit';
                            var val2 = 'Get Instant Access!';
                            var cur = el.val();
                            var els = 'div.field-id-op_assets_core_optin_box_tabs_form_html_disable_name, div.field-id-op_assets_core_optin_box_tabs_form_html_name, div.field-input field-id-op_assets_core_optin_box_tabs_content_name_default';
                            var els2 = 'div.field-id-op_assets_core_optin_box_tabs_content_headline, div.field-id-op_assets_core_optin_box_tabs_content_paragraph';
                            var els3 = 'div.field-id-op_assets_core_optin_box_tabs_content_paragraph';
                            var $selected_style = $('#op_asset_browser_slide2').find('.selected:visible');
                            var style = parseInt($selected_style.find('img').attr('alt'));
                            var $top_color = $('#op_asset_browser_slide3 .field-top_color');

                            $(els).css('display',(($.inArray(value,no_name_styles) < 0)?'block':'none'));
                            $(els2).css('display',(($.inArray(value,no_content_styles) < 0)?'block':'none'));
                            $(els3).css('display',(($.inArray(value,no_paragraph_styles) < 0)?'block':'none'));
                            if(el.val() == ''){
                                el.val(value == 1 ? 'Submit' : 'Get Instant Access!');
                            } else {
                                el.val(value == 1 ? (cur==val2?'Submit':cur) : (cur==val1?'Get Instant Access!':cur));
                            }

                            if (style==18) $top_color.show(); else $top_color.hide().find('input').val('').next('a').css({ backgroundColor: 'none' });

                            /*
                             * Disabling button styles/types depending on style selected here
                             */
                            var $buttonTypeItems = $('#op_assets_core_optin_box_tabs_submit_button_button_type_container .op-asset-dropdown-list li');

                            if (style === 1) {
                                $buttonTypeItems.show().slice(1).hide();
                                /*
                                 * We need to select first item in case that user went back through the flow
                                 */
                                var $firstItem = $('#op_assets_core_optin_box_tabs_submit_button_button_type_container .op-asset-dropdown-list li:first a');
                                $firstItem.trigger('click');
                                /*
                                 * We also need to manually move selected item HTML markup
                                 */
                                var $selectedItem = $('#op_assets_core_optin_box_tabs_submit_button_button_type_container .selected-item');
                                $selectedItem.html($firstItem.html());
                            } else {
                                $buttonTypeItems.show();
                            }

                            /*
                             * Adding optin style information to hidden element that will be used in generating option style based class name (for limiting width/height of a button)
                             */
                            var optinStyle = 'optin_box_style_' + style;
                            $('#op_assets_core_optin_box_tabs_submit_button_location').val(optinStyle);
                            $('#op_assets_core_optin_box_tabs_submit_button_button_preview_container #op_button_preview').addClass(optinStyle);

                            /*
                             * Hidding extra field functionality for styles that doesn't support it
                             */
                            if ($('#op_assets_core_optin_box_tabs_form_html_integration_type').val() == 'email') {
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields-multirow-container').show();
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container').hide();
                            } else {
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container').show();
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields-multirow-container').hide();
                            }
                            if ($.inArray(style.toString(), no_extra_styles) >= 0) {
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields .new-row, .field-id-op_assets_core_optin_box_tabs_form_html_extra_fields .new-row, .field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields-multirow-container .op-multirow, .field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container .op-multirow').hide();
                            } else {
                                $('.field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields .new-row, .field-id-op_assets_core_optin_box_tabs_form_html_extra_fields .new-row, .field-id-op_assets_core_optin_box_tabs_form_html_email_data_fields-multirow-container .op-multirow, .field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container .op-multirow').show();
                            }
                        }
                    }
                }
            },
            step_2: {
                tabs: {
                    type: 'tabs',
                    tabs: {
                        form_html: {
                            title: 'form_html',
                            fields: {
                                integration_type: {
                                    title: 'integration_type',
                                    type: 'select',
                                    default_value: 'custom',
                                    values: function () {
                                        var options = [];

                                        options['email'] = 'Email data';
                                        options['custom'] = 'Custom form';

                                        var count = 0,
                                            i;

                                        for (i in window.OptimizePress.ems_providers) {
                                            if (window.OptimizePress.ems_providers.hasOwnProperty(i)) count++;
                                        }

                                        if (count) {
                                            $.each(window.OptimizePress.ems_providers, function (key, value) {
                                                options[key] = value;
                                            });
                                        }

                                        return options;
                                    }(),
                                    events: {
                                        change: function(e) {
                                            var $name = $('#op_assets_core_optin_box_tabs_form_html_name');
                                            var $form = $('#op_asset_browser_slide3 .op-multirow-form_html');

                                            // It seems that adding items to select (or one of the other fields) sets the visual focus to this element, which in turn focuses the element on screen (in this case showing step 3).
                                            // But actual focus remains on the element that should be focused instead. Se if we blur it and reapply the focus on it, it will again be shown on the screen.
                                            // This happens only in Chrome (v.44 as of now). It can probalbly be removed if chrome changes this behaviour.
                                            var $assetContent = $('.op_asset_browser_slide_active .op_asset_content');
                                            $assetContent.blur();
                                            $assetContent.focus();

                                            /**
                                             * For some reason after this the repaint layout of the browser is not always triggered
                                             * and elements are left improperly rendered. Following trickery is a fix for this issue.
                                             * Second part of this fix is at the end of the function wrapped in setTimeout.
                                             */
                                            $form.parent().height($form.parent().height());
                                            $form.css({ display: 'none' });

                                            //Show the name field and contract name order field back to css styled values.
                                            $name.show();
                                            $name.prev().show();
                                            //$name.parent().next().removeAttr('style');
                                            $name.parent().parent().removeClass('op-multirow-form_html-email');

                                            var integrationType = e.currentTarget.value;
                                            switch (integrationType) {
                                                case 'email':
                                                    //Hide the name field and expand name order field.
                                                    $name.hide();
                                                    $name.prev().hide();
                                                    //$name.parent().next().css({width: '100%' });
                                                    $name.parent().parent().addClass('op-multirow-form_html-email');
                                                    break;
                                                case 'custom':
                                                case 'oneshoppingcart':
                                                    break;
                                                case 'aweber':
                                                case 'infusionsoft':
                                                case 'icontact':
                                                case 'mailchimp':
                                                case 'mailpoet':
                                                case 'emma':
                                                case 'egoi':
                                                case 'maropost':
                                                case 'getresponse':
                                                case 'getresponsev3':
                                                case 'campaignmonitor':
                                                case 'constantcontact':
                                                case 'convertkit':
                                                case 'officeautopilot':
                                                case 'activecampaign':
                                                case 'ontraport':
                                                case 'sendlane':
                                                    /*
                                                     * Showing loading graphics
                                                     */
                                                    var $select = $('#op_assets_core_optin_box_tabs_form_html_list');
                                                    $select.empty().after('<img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="loading" style="position:relative;display:block;top:4px">');

                                                    getProviderLists(integrationType).then(function(data) {
                                                        lists[integrationType] = data;
                                                        var options = [];
                                                        $.each(lists[integrationType], function (id, list) {
                                                            options.push($('<option/>', {value: id, text: list.name}));
                                                        });
                                                        options.sort(function(a,b) {return a.text().toLowerCase() > b.text().toLowerCase() ? 1 : -1;});
                                                        $select.empty().append(options);
                                                        /*
                                                         * Removing loading graphics
                                                         */
                                                        $select.next().remove();

                                                        /*
                                                         * Selecting previously selected value (if editing)
                                                         */
                                                        if (typeof $select.attr('data-default') != 'undefined') {
                                                            $select.val($select.attr('data-default'));
                                                        }

                                                        $select.trigger('change');

                                                        if($('#op_assets_core_optin_box_tabs_form_html_double_optin').is(':checked') == true) {
                                                            $('.field-welcome_email').hide();
                                                        }
                                                    });
                                                    break;
                                                case 'arpreach':
                                                    $.post(OptimizePress.ajaxurl,
                                                        {
                                                            'action': OptimizePress.SN+'-email-provider-item-fields',
                                                            'provider': integrationType,
                                                            'list': 'arpreach'
                                                        },
                                                        function(response) {
                                                            lists[integrationType] = {'arpreach': null};
                                                            lists[integrationType]['arpreach'] = response;
                                                            fill_provider_fields('arpreach', integrationType);
                                                        },
                                                        'json'
                                                    );
                                                    break;
                                            }

                                            if (providersWithoutGdprSupport.indexOf(integrationType) >= 0) {
                                                $('#op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').val('disabled').trigger('change');
                                                $('.field-id-op_assets_core_optin_box_tabs_gdpr_consent_training, .field-id-op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').hide();
                                                $('.field-id-op_assets_core_optin_box_tabs_gdpr_consent_not_supported').show();


                                            } else {
                                                $('.field-id-op_assets_core_optin_box_tabs_gdpr_consent_training, .field-id-op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').show();
                                                $('.field-id-op_assets_core_optin_box_tabs_gdpr_consent_not_supported').hide();
                                            }

                                            // Force reload of provider tags used for GDPR consent
                                            $('#op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').trigger('change');

                                            /**
                                             * For some reason after this the repaint layout of the browser is not always triggered
                                             * and elements are left improperly rendered. Following trickery is a fix for this issue.
                                             * First part of this fix is at the start of the function: $form.css({ display: 'none' });
                                             */
                                            setTimeout(function () {
                                                $form.css({ display: 'block' });
                                                $form.parent().height('auto');
                                            }, 0);
                                        }
                                    }
                                },
                                /*
                                 * MailChimp
                                 */
                                list: {
                                    title: 'provider_list',
                                    type: 'select',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'mailpoet', 'emma', 'egoi', 'aweber', 'infusionsoft', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'convertkit', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost','sendlane']},
                                    events: {
                                        change: function(e) {
                                            /*
                                             * If element isn't visible we won't do our magic
                                             */
                                            // if (false === $(e.currentTarget).is(':visible')) {
                                            //     return;
                                            // }
                                            // If list isn't selected don't bother trying to fill its fields
                                            if (e.currentTarget.value.length === 0) {
                                                return;
                                            }

                                            var provider = $('#op_assets_core_optin_box_tabs_form_html_integration_type').val();

                                            input_elems = {};
                                            if (typeof lists[provider][e.currentTarget.value] != 'undefined') {
                                                if (typeof lists[provider][e.currentTarget.value].fields == 'undefined') {
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: OptimizePress.ajaxurl,
                                                        data: {
                                                            'action': OptimizePress.SN+'-email-provider-item-fields',
                                                            'provider': provider,
                                                            'list': e.currentTarget.value
                                                        },
                                                        success: function(response) {
                                                            lists[provider][e.currentTarget.value].fields = response.fields;
                                                            lists[provider][e.currentTarget.value].action = response.action;
                                                            lists[provider][e.currentTarget.value].hidden = response.hidden;

                                                            fill_provider_fields(e.currentTarget.value, provider);
                                                        },
                                                        dataType: 'json'
                                                    });
                                                } else {
                                                    fill_provider_fields(e.currentTarget.value, provider);
                                                }
                                            }
                                        }
                                    }
                                },
                                loading_time: {
                                    type: 'paragraph',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'mailpoet', 'emma', 'egoi', 'aweber', 'infusionsoft', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'convertkit', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost','sendlane']},
                                    text: OP_AB.translate('ems_loading_time'),
                                    addClass: 'field_note'
                                },
                                autoresponder_name: {
                                    title: 'autoresponder_name',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['arpreach']}
                                },
                                double_optin: {
                                    title: 'double_optin',
                                    type: 'checkbox',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp','egoi']},
                                    default_value: true
                                },
                                welcome_email: {
                                    title: 'welcome_email',
                                    type: 'checkbox',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['']},
                                    default_value: false
                                },
                                signup_form_id: {
                                    title: 'signup_form_id',
                                    type: 'input',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['emma', 'activecampaign']},
                                    default_value: ''
                                },
                                activecampaign_desc: {
                                    type: 'paragraph',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['activecampaign']},
                                    text: OP_AB.translate('activecampaign_desc'),
                                    addClass: 'field_note'
                                },
                                thank_you_page: {
                                    title: 'thank_you_page_url',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'mailpoet', 'emma', 'egoi', 'arpreach', 'aweber', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'convertkit', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost', 'sendlane']}
                                },
                                already_subscribed_url: {
                                    title: 'already_subscribed_url',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'mailpoet', 'emma', 'egoi', 'arpreach', 'aweber', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact',/*'maropost',*/ /*'officeautopilot', 'ontraport', */'activecampaign']},
                                    default_value: ''
                                },
                                action_page: {
                                    type: 'hidden',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['infusionsoft']}
                                },
                                /*
                                 * Email & custom
                                 */
                                email_address: {
                                    title: 'email_address',
                                    required: true,
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email']}
                                },
                                redirect_url: {
                                    title: 'redirect_url',
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email']}
                                },
                                html: {
                                    title: 'form_html',
                                    type: 'textarea',
                                    required: true,
                                    events: {
                                        change: change_html,
                                        keyup: function(){
                                            $(this).trigger('change');
                                        }
                                    },
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom','oneshoppingcart']}
                                },
                                disable_name: {
                                    title: 'disable_name',
                                    type: 'checkbox',
                                    events: {
                                        change: function(){
                                            func = 'block';

                                            //If this is checked, name is disabled
                                            if($(this).is(':checked')){
                                                func = 'none';
                                            }

                                            $('.field-id-op_assets_core_optin_box_tabs_content_name_default').css('display',func);
                                            if($('#op_assets_core_optin_box_tabs_form_html_email_data').is(':checked')){
                                                func = 'none';
                                            }
                                            $('.field-id-op_assets_core_optin_box_tabs_form_html_name').css('display',func);
                                            $('.field-id-op_assets_core_optin_box_tabs_form_html_name_order').css('display',func);
                                            $('.field-id-op_assets_core_optin_box_tabs_form_html_name_required').css('display',func);
                                        }
                                    },
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email', 'custom', 'oneshoppingcart', 'mailchimp', 'mailpoet', 'emma', 'egoi', 'arpreach', 'aweber', 'infusionsoft', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'convertkit', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost','sendlane']}
                                },
                                name: {
                                    title: 'name',
                                    type: 'select',
                                    required: true,
                                    values: {},
                                    showOn: {field:'step_1.style',value:['2','3','7','8','11','12','13','14'],idprefix:'op_assets_core_optin_box_',type:'style-selector'}
                                },
                                name_order: {
                                    title: 'name_order',
                                    addClass: 'op-order-select',
                                    showOn: {field:'step_1.style',value:['2','3','7','8','11','12','13','14'],idprefix:'op_assets_core_optin_box_',type:'style-selector'}
                                },
                                name_required: {
                                    title: 'name_required',
                                    addClass: 'op-order-select op-required-field',
                                    type: 'checkbox',
                                    default_value: true,
                                    showOn: {field:'step_1.style',value:['2','3','7','8','11','12','13','14'],idprefix:'op_assets_core_optin_box_',type:'style-selector'}
                                },
                                email: {
                                    title: 'email',
                                    type: 'select',
                                    required: true,
                                    values: {'left': 'Left', 'center': 'Center', 'right': 'Right'},
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom', 'oneshoppingcart']}
                                },
                                email_order: {
                                    title: 'email_order',
                                    addClass: 'op-order-select'
                                },
                                email_2: {
                                    title: '',
                                    type: 'custom_html',
                                    addClass: 'form_html_field form_html_info_field cf',
                                    html: OP_AB.translate('email_ems_auto_required'),
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email', 'arpreach', 'aweber', 'infusionsoft', 'icontact', 'mailchimp', 'mailpoet', 'emma', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'convertkit', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost']}
                                },
                                method: {
                                    title: 'method',
                                    type: 'select',
                                    required: true,
                                    values: {'post':'POST','get':'GET'},
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom', 'oneshoppingcart']}
                                },
                                action: {
                                    title: 'form_url',
                                    required: true,
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom', 'oneshoppingcart']}
                                },
                                email_data_fields: {
                                    title: 'extra_fields',
                                    type: 'multirow',
                                    multirow: {
                                        attributes: {
                                            title: {
                                                title: 'text'
                                            },
                                            order: {
                                                title: 'order'
                                            },
                                            required: {
                                                title: 'required',
                                                type: 'checkbox',
                                                default_value: false,
                                                addClass: 'op-required-field'
                                            }
                                        },
                                        remove_row: 'after',
                                        onAdd: function(steps){
                                            if(!disable_focus){
                                                this.find(':input').focus();
                                            }
                                        }
                                    },
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email']}
                                },
                                extra_fields: {
                                    title: 'extra_fields',
                                    type: 'multirow',
                                    multirow: {
                                        attributes: {
                                            field_name: {
                                                title: 'field_name',
                                                type: 'select',
                                                values: {
                                                    'op_add_new_field': 'add_new_field',
                                                    '': '-----------------'
                                                },
                                                removeCf: true,
                                                events: {
                                                    change: function(){
                                                        var v = $(this).val(),
                                                            func = 'hide',
                                                            focusel = false,
                                                            el = $(this).parent().next();
                                                        if(v == 'op_add_new_field' || v == ''){
                                                            func = 'show';
                                                            focusel = true;
                                                        }
                                                        el[func]();
                                                        if(focusel && !disable_focus){
                                                            el.find(':input').focus();
                                                        }
                                                    }
                                                }
                                            },
                                            title: {
                                                addClass: 'op-hidden',
                                                removeCf: true
                                            },
                                            text: {
                                                title: 'text',
                                                removeCf: true,
                                                addClass: 'form_html_field_with_order'
                                            },
                                            order: {
                                                title: 'order',
                                                removeCf: true,
                                                addClass: 'form_html_field_order'
                                            },
                                            required: {
                                                title: 'required',
                                                type: 'checkbox',
                                                default_value: false,
                                                addClass: 'form_html_field_order op-required-field'
                                            },
                                            hidden: {
                                                title: 'hidden',
                                                type: 'checkbox',
                                                default_value: false,
                                                addClass: 'form_html_field_order op-required-field',
                                                events: {
                                                    change: function() {
                                                        var container = $(this).closest('.op-multirow').find('.field-text label');
                                                        if ($(this).is(':checked')) {
                                                            container.html(OP_AB.translate('Value'));
                                                        } else {
                                                            container.html(OP_AB.translate('Text'));
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        onAdd: function(steps){
                                            this.find('select, input[type="checkbox"]').trigger('change');
                                            multirow_dropdown(steps);
                                        }
                                    },
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom', 'oneshoppingcart', 'mailchimp', 'mailpoet', 'emma', 'egoi', 'arpreach', 'aweber', 'infusionsoft', 'icontact', 'getresponse', 'getresponsev3', 'campaignmonitor', 'constantcontact', 'officeautopilot', 'ontraport', 'activecampaign', 'maropost','sendlane']}
                                },
                                no_extras: {
                                    type: 'paragraph',
                                    showOn: {field:'step_1.style', value:no_extra_styles, idprefix:'op_assets_core_optin_box_', type:'style-selector'},
                                    text: OP_AB.translate('no_extra_fields_for_selected_style'),
                                    addClass: 'field_note'
                                },
                                gotowebinar : {
                                    title: 'gotowebinar',
                                    type: 'select',
                                    values: {'Y':OP_AB.translate('Integrate with GoToWebinar'), 'N':OP_AB.translate("Don't integrate")},
                                    default_value: 'N',
                                    skip: opGoToWebinarEnabled,
                                    events: {
                                        change: function(e) {
                                            var $select = $('.field-id-op_assets_core_optin_box_tabs_form_html_gotowebinar_list select');
                                            if (e.currentTarget.value == 'Y') {
                                                $select.empty().after('<img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="loading" style="position:relative;display:block;top:4px">');
                                                $.ajax({
                                                    type: 'POST',
                                                    url: OptimizePress.ajaxurl,
                                                    data: {'action': OptimizePress.SN+'-email-provider-details', 'provider': 'gotowebinar'},
                                                    success: function(response){
                                                        var options = [];
                                                        $.each(response.lists, function (key, value) {
                                                            options.push($('<option/>', {value: key, text: value.name}));
                                                        });
                                                        $select.append(options);
                                                        $select.next().remove();

                                                        /*
                                                         * Selecting previously selected value (if editing)
                                                         */
                                                        if (typeof $select.attr('data-default') != 'undefined') {
                                                            $select.val($select.attr('data-default'));
                                                        }
                                                    },
                                                    dataType: 'json'
                                                });
                                            }
                                        }
                                    }
                                },
                                gotowebinar_list: {
                                    title: 'gotowebinar_list',
                                    type: 'select',
                                    skip: opGoToWebinarEnabled,
                                    showOn: {field:'step_2.tabs.tabs.form_html.fields.gotowebinar',value:'Y'}
                                }
                            }
                        },
                        content: {
                            title: 'content',
                            fields: {
                                headline: {
                                    title: 'header',
                                    default_value: 'Here\'s The Headline For The Box'
                                },
                                paragraph: {
                                    title: 'content',
                                    type: 'wysiwyg',
                                    default_value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel nunc non lacus venenatis commodo.'
                                },
                                privacy: {
                                    title: 'privacy_notice',
                                    default_value: 'We value your privacy and would never spam you'
                                },
                                name_default: {
                                    title: 'name_default',
                                    default_value: 'Enter your first name'
                                    /*,
                                    showOn: {field:'step_1.style',value:['2','3','7','8'],idprefix:'op_assets_core_optin_box_',type:'style-selector'}*/
                                },
                                email_default: {
                                    title: 'email_default',
                                    default_value: 'Enter your email address'
                                },
                                top_color: {
                                    title: 'top_color',
                                    type: 'color'
                                }
                            }
                        },
                        submit_button: {
                            title: 'submit_button',
                            fields: {
                                button_type: {
                                    type: 'style-selector',
                                    folder: 'forms',
                                    asset: ['core','button']
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
                                    showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_box_tabs_submit_button_', value:'7'}
                                },
                                button_content: {
                                    title: 'text',
                                    showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_box_tabs_submit_button_', value:'0'}
                                },
                                button_preview: {
                                    title: '',
                                    type: 'button_preview',
                                    folder: 'presets',
                                    selectorClass: 'icon-view-128',
                                    showSubtext: false,
                                    showShine: false,
                                    showGradient: false,
                                    addClass: 'optin_box',
                                    showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_box_tabs_submit_button_', value:'1'}
                                },
                                location: {
                                    type: 'hidden'
                                },
                                left_column: {
                                    type: 'column',
                                    addClass: 'left_column',
                                    showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_box_tabs_submit_button_', value:'1'},
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
                                    showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_box_tabs_submit_button_', value:'1'},
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
                                text_below_button: {
                                    title: 'text_below_button',
                                      type: 'checkbox',
                                    default_value: true,
                                    showOn: {field: 'step_1.style', value: text_button_styles, idprefix:'op_assets_core_optin_box_', type:'style-selector'}
                                }
                            }
                        },
                        gdpr_consent: {
                            title: 'gdpr_consent',
                            fields: {
                                training: {
                                    type: 'paragraph',
                                    text: 'You can configure the GDPR privacy checkboxes for your opt-in form below. Please watch our training on how to integrate your provider on our <a href="http://www.optimizelink.com/gdpr-training" target="_blank">training hub here</a>.',
                                    addClass: 'op-membership-login-description'
                                },
                                not_supported: {
                                    text: 'Your selected integration does not currently have GDPR options available. Please see <a href="http://www.optimizelink.com/gdpr-unsupported" target="_blank">this article</a> for more information.',
                                    type: 'microcopy',
                                    addClass: 'warning field-id-op_assets_core_optin_box_tabs_gdpr_consent_not_supported'
                                },
                                gdpr_consent: {
                                    title: OP_AB.translate('enable_gdpr_checkboxes'),
                                    type: 'select',
                                    default_value: 'disabled',
                                    values: {
                                        'disabled': OP_AB.translate('do_not_show_the_fields'),
                                        'eu_only': OP_AB.translate('show_to_eu_only'),
                                        'all_visitors': OP_AB.translate('show_to_all_visitors')
                                    },
                                    addClass: 'op-dialog-element-dropdown-fullwidth',
                                    events: {
                                        change: function(e) {
                                            var integrationType = $('#op_assets_core_optin_box_tabs_form_html_integration_type').val();

                                            // If GDPR is disabled or if we already fetched provider tags earlier
                                            if (e.currentTarget.value === 'disabled') {
                                                setTimeout(function() {
                                                    $('.op-gdpr-provider-tags-dropdown, .field-consent_1_label, .field-consent_2_label, .op-gdpr-provider-tags-input').hide();
                                                });

                                                return;
                                            }

                                            // Controling visibility of notes field for providers that is using it
                                            if (providersUsingCustomFieldsForNotes.indexOf(integrationType) >= 0) {
                                                if (e.currentTarget.value === 'disabled') {
                                                    setTimeout(function() {
                                                        $('.op-gdpr-provider-notes-dropdown').hide();
                                                    });
                                                } else {
                                                    setTimeout(function() {
                                                        $('.op-gdpr-provider-notes-dropdown').show();
                                                    });
                                                }
                                            } else {
                                                setTimeout(function() {
                                                    $('.op-gdpr-provider-notes-dropdown').hide();
                                                });
                                            }

                                            if (providersWithoutGdprSupport.indexOf(integrationType) >= 0) {
                                                // Not sure what to do here...
                                                return;
                                            } else if (providersUsingInputFieldsInsteadOfTags.indexOf(integrationType) >= 0) {
                                                setTimeout(function() {
                                                    $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined, .field-consent_1_tag_not_shown, .field-consent_2_tag_accepted, .field-consent_2_tag_declined, .field-consent_2_tag_not_shown').hide();

                                                    if ($('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_enabled').val() === 'yes') {
                                                        if (e.currentTarget.value === 'all_visitors') {
                                                            $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text, .field-consent_1_label').show();
                                                            $('.field-consent_1_tag_not_shown_text').hide();
                                                        } else {
                                                            $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text, .field-consent_1_tag_not_shown_text, .field-consent_1_label').show();
                                                        }
                                                    }
                                                    if ($('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_enabled').val() === 'yes') {
                                                        if (e.currentTarget.value === 'all_visitors') {
                                                            $('.field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text, .field-consent_2_label').show();
                                                            $('.field-consent_2_tag_not_shown_text').hide();
                                                        } else {
                                                            $('.field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text, .field-consent_2_tag_not_shown_text, .field-consent_2_label').show();
                                                        }
                                                    }
                                                });

                                                return;
                                            } else {
                                                setTimeout(function() {
                                                    $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text, .field-consent_1_tag_not_shown_text, .field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text, .field-consent_2_tag_not_shown_text').hide();

                                                    if ($('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_enabled').val() === 'yes') {
                                                        if (integrationType === 'infusionsoft') {
                                                            $('.field-consent_1_tag_accepted, .field-consent_1_label').show();
                                                            $('.field-consent_1_tag_declined, .field-consent_1_tag_not_shown').hide();
                                                        } else if (e.currentTarget.value === 'all_visitors') {
                                                            $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined, .field-consent_1_label').show();
                                                            $('.field-consent_1_tag_not_shown').hide();
                                                        } else {
                                                            $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined, .field-consent_1_tag_not_shown, .field-consent_1_label').show();
                                                        }
                                                    }
                                                    if ($('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_enabled').val() === 'yes') {
                                                        if (integrationType === 'infusionsoft') {
                                                            $('.field-consent_2_tag_accepted, .field-consent_2_label').show();
                                                            $('.field-consent_2_tag_declined, .field-consent_2_tag_not_shown').hide();
                                                        } else if (e.currentTarget.value === 'all_visitors') {
                                                            $('.field-consent_2_tag_accepted, .field-consent_2_tag_declined, .field-consent_2_label').show();
                                                            $('.field-consent_2_tag_not_shown').hide();
                                                        } else {
                                                            $('.field-consent_2_tag_accepted, .field-consent_2_tag_declined, .field-consent_2_tag_not_shown, .field-consent_2_label').show();
                                                        }
                                                    }
                                                });
                                            }

                                            // Providers with custom fields
                                            if (providersUsingCustomFieldsInsteadOfTags.indexOf(integrationType) >= 0) {
                                                return;
                                            }

                                            /*
                                             * Showing loading graphics
                                             */
                                            var $tags = $('.op-gdpr-provider-tags-dropdown select');
                                            $('.op-multirow-gdpr_consent .op-bsw-waiting').remove();
                                            $tags.after('<img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="loading" style="position:relative;display:block;top:4px">');

                                            $.post(OptimizePress.ajaxurl, {
                                                'action': OptimizePress.SN+'-email-provider-tags',
                                                'provider': integrationType
                                            }, function(response) {
                                                providerTags = jQuery.extend(response.tags, {'-': OP_AB.translate('no_tag')});

                                                $tags.each(function(index) {
                                                    var $element = $(this);

                                                    var options = [];
                                                    $.each(providerTags, function (key, name) {
                                                        options.push($('<option/>', {value: key, text: name}));
                                                    });

                                                    $element.empty().append(options);
                                                    $element.next().remove();

                                                    /*
                                                     * Selecting previously selected value (if editing)
                                                     */
                                                    if (typeof $element.attr('data-default') != 'undefined') {
                                                        $element.val($element.attr('data-default'));
                                                    }
                                                });
                                            }, 'json');
                                        }
                                    }
                                },
                                consent_1_enabled: {
                                    title: OP_AB.translate('enable_consent_1_checbox'),
                                    type: 'select',
                                    default_value: 'no',
                                    values: {
                                        'no': OP_AB.translate('no'),
                                        'yes': OP_AB.translate('yes')
                                    },
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.gdpr_consent', value:['eu_only', 'all_visitors']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth',
                                    events: {
                                        change: function(e) {
                                            if (e.currentTarget.value === 'no') {
                                                return;
                                            }

                                            var integrationType = $('#op_assets_core_optin_box_tabs_form_html_integration_type').val();
                                            var gdprEnabled =  $('#op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').val();

                                            if (providersUsingInputFieldsInsteadOfTags.indexOf(integrationType) >= 0) {
                                                setTimeout(function() {
                                                    $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined, .field-consent_1_tag_not_shown').hide();

                                                    if (gdprEnabled === 'all_visitors') {
                                                        $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text').show();
                                                        $('.field-consent_1_tag_not_shown_text').hide();
                                                    } else {
                                                        $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text, .field-consent_1_tag_not_shown_text').show();
                                                    }
                                                });
                                            } else {
                                                setTimeout(function() {
                                                    if (integrationType === 'infusionsoft') {
                                                        $('.field-consent_1_tag_accepted').show();
                                                        $('.field-consent_1_tag_declined, .field-consent_1_tag_not_shown').hide();
                                                    } else if (gdprEnabled === 'all_visitors') {
                                                        $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined').show();
                                                        $('.field-consent_1_tag_not_shown').hide();
                                                    } else {
                                                        $('.field-consent_1_tag_accepted, .field-consent_1_tag_declined, .field-consent_1_tag_not_shown').show();
                                                    }

                                                    $('.field-consent_1_tag_accepted_text, .field-consent_1_tag_declined_text, .field-consent_1_tag_not_shown_text').hide();
                                                });
                                            }
                                        }
                                    }
                                },
                                consent_1_label: {
                                    title: OP_AB.translate('consent_1_label_message'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_privacy_notice'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                },
                                consent_1_tag_accepted: {
                                    title: OP_AB.translate('consent_1_accept_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_1_tag_accepted_text: {
                                    title: OP_AB.translate('consent_1_accept_tag'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_1_tag_declined: {
                                    title: OP_AB.translate('consent_1_decline_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_1_tag_declined_text: {
                                    title: 'consent_1_decline_tag',
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_1_tag_not_shown: {
                                    title: OP_AB.translate('consent_1_not_shown_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_1_tag_not_shown_text: {
                                    title: OP_AB.translate('consent_1_not_shown_tag'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_1_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_2_enabled: {
                                    title: OP_AB.translate('enable_consent_2_checbox'),
                                    type: 'select',
                                    default_value: 'no',
                                    values: {
                                        'no': OP_AB.translate('no'),
                                        'yes': OP_AB.translate('yes')
                                    },
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.gdpr_consent', value:['eu_only', 'all_visitors']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth',
                                    events: {
                                        change: function(e) {
                                            if (e.currentTarget.value === 'no') {
                                                return;
                                            }

                                            var integrationType = $('#op_assets_core_optin_box_tabs_form_html_integration_type').val();
                                            var gdprEnabled =  $('#op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').val();

                                            if (providersUsingInputFieldsInsteadOfTags.indexOf(integrationType) >= 0) {
                                                setTimeout(function() {
                                                    $('.field-consent_2_tag_accepted, .field-consent_2_tag_declined, .field-consent_2_tag_not_shown').hide();

                                                    if (gdprEnabled === 'all_visitors') {
                                                        $('.field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text').show();
                                                        $('.field-consent_2_tag_not_shown_text').hide();
                                                    } else {
                                                        $('.field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text, .field-consent_2_tag_not_shown_text').show();
                                                    }
                                                });
                                            } else {
                                                setTimeout(function() {
                                                    if (integrationType === 'infusionsoft') {
                                                        $('.field-consent_2_tag_accepted').show();
                                                        $('.field-consent_2_tag_declined, .field-consent_2_tag_not_shown').hide();
                                                    } else if (gdprEnabled === 'all_visitors') {
                                                        $('.field-consent_2_tag_accepted, .field-consent_2_tag_declined').show();
                                                        $('.field-consent_2_tag_not_shown').hide();
                                                    } else {
                                                        $('.field-consent_2_tag_accepted, .field-consent_2_tag_declined, .field-consent_2_tag_not_shown').show();
                                                    }

                                                    $('.field-consent_2_tag_accepted_text, .field-consent_2_tag_declined_text, .field-consent_2_tag_not_shown_text').hide();
                                                });
                                            }
                                        }
                                    }
                                },
                                consent_2_label: {
                                    title: OP_AB.translate('consent_2_label_message'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_privacy_notice'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                },
                                consent_2_tag_accepted: {
                                    title: OP_AB.translate('consent_2_accept_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_2_tag_accepted_text: {
                                    title: OP_AB.translate('consent_2_accept_tag'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_2_tag_declined: {
                                    title: OP_AB.translate('consent_2_decline_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_2_tag_declined_text: {
                                    title: OP_AB.translate('consent_2_decline_tag'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_2_tag_not_shown: {
                                    title: OP_AB.translate('consent_2_not_shown_tag'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-tags-dropdown'
                                },
                                consent_2_tag_not_shown_text: {
                                    title: OP_AB.translate('consent_2_not_shown_tag'),
                                    type: 'input',
                                    placeholder: OP_AB.translate('enter_tag_name'),
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.consent_2_enabled', value:['yes']},
                                    addClass: 'op-gdpr-provider-tags-input'
                                },
                                consent_notes_field: {
                                    title: OP_AB.translate('consent_notes_custom_field'),
                                    type: 'select',
                                    default_value: 'missing_integration_type',
                                    values: providerTags,
                                    showOn: {field:'step_2.tabs.tabs.gdpr_consent.fields.gdpr_consent', value:['eu_only', 'all_visitors']},
                                    addClass: 'op-dialog-element-dropdown-fullwidth op-gdpr-provider-notes-dropdown'
                                }
                            }
                        }
                    }
                }
            },
            step_3: {
                opm_microcopy_1: {
                    text: 'opm_integration_copy_1',
                    type: 'microcopy',
                    skip: !OPMActivated
                },
                opm_microcopy_2: {
                    text: 'opm_integration_copy_2',
                    type: 'microcopy',
                    skip: !OPMActivated
                },
                opm_integration : {
                    title: 'opm_integration',
                    type: 'select',
                    values: {'Y':OP_AB.translate('Integrate with OptimizeMember'), 'N':OP_AB.translate("Don't integrate")},
                    default_value: 'N',
                    skip: !OPMActivated
                },
                opm_level: {
                    title: 'membership_level',
                    type: 'select',
                    values: WithoutEmptyOPMLevels,
                    skip: !OPMActivated,
                    showOn: {field:'step_3.opm_integration', value:'Y'}
                },
                opm_packages: {
                    title: 'packages',
                    type: 'checkbox',
                    values: WithoutEmptyOPMPackages,
                    skip: !OPMActivated,
                    showOn: {field:'step_3.opm_integration', value:'Y'},
                    func: 'append'
                },
                microcopy: {
                    text: 'optin_box_advanced1',
                    type: 'microcopy'
                },
                microcopy2: {
                    text: 'advanced_warning_2',
                    type: 'microcopy',
                    addClass: 'warning'
                },
                width: {
                    title: 'width'
                },
                margin_top: {
                    title: 'margin_top'
                },
                margin_right: {
                    title: 'margin_right'
                },
                margin_bottom: {
                    title: 'margin_bottom'
                },
                margin_left: {
                    title: 'margin_left'
                },
                alignment: {
                    title: 'alignment',
                    type: 'select',
                    values: {'left': 'left', 'center': 'center', 'right': 'right'},
                    default_value: 'center'
                }
            }
        },
        insert_steps: {2:{next:'advanced_options'},3:true},
        customInsert: function(attrs){
            var nattrs = {
                style: attrs.style,
                width: attrs.width,
                margin_top: attrs.margin_top,
                margin_right: attrs.margin_right,
                margin_bottom: attrs.margin_bottom,
                margin_left: attrs.margin_left,
                alignment: attrs.alignment,
                opm_integration: attrs.opm_integration,
                opm_level: attrs.opm_level
            };
            attrs = attrs.tabs;

            var useGdprDropdowns = true;
            if (providersUsingInputFieldsInsteadOfTags.indexOf(attrs.form_html.integration_type) >= 0) {
                useGdprDropdowns = false;
            }

            $.extend(nattrs,{
                action: encodeURI(attrs.form_html.action),
                disable_name: attrs.form_html.disable_name,
                method: attrs.form_html.method,
                //submit: attrs.content.submit,
                email_field: encodeURI(attrs.form_html.email),
                email_default: attrs.content.email_default,
                email_order: attrs.form_html.email_order || 0,
                top_color: attrs.content.top_color,
                integration_type: attrs.form_html.integration_type,
                double_optin: attrs.form_html.double_optin,
                welcome_email: attrs.form_html.welcome_email,
                signup_form_id: attrs.form_html.signup_form_id,

                gdpr_consent: attrs.gdpr_consent.gdpr_consent,
                consent_1_enabled: attrs.gdpr_consent.consent_1_enabled,
                consent_1_tag_accepted: useGdprDropdowns ? attrs.gdpr_consent.consent_1_tag_accepted : attrs.gdpr_consent.consent_1_tag_accepted_text,
                consent_1_tag_declined: useGdprDropdowns ? attrs.gdpr_consent.consent_1_tag_declined : attrs.gdpr_consent.consent_1_tag_declined_text,
                consent_1_tag_not_shown: useGdprDropdowns ? attrs.gdpr_consent.consent_1_tag_not_shown : attrs.gdpr_consent.consent_1_tag_not_shown_text,
                consent_2_enabled: attrs.gdpr_consent.consent_2_enabled,
                consent_2_tag_accepted: useGdprDropdowns ? attrs.gdpr_consent.consent_2_tag_accepted : attrs.gdpr_consent.consent_2_tag_accepted_text,
                consent_2_tag_declined: useGdprDropdowns ? attrs.gdpr_consent.consent_2_tag_declined : attrs.gdpr_consent.consent_2_tag_declined_text,
                consent_2_tag_not_shown: useGdprDropdowns ? attrs.gdpr_consent.consent_2_tag_not_shown : attrs.gdpr_consent.consent_2_tag_not_shown_text,
                consent_notes_field: attrs.gdpr_consent.consent_notes_field,
            });

            if (attrs.form_html.gotowebinar == 'Y') {
                nattrs = $.extend(nattrs, {gotowebinar:attrs.form_html.gotowebinar_list});
            }
            var elems = ['headline', 'paragraph', 'privacy'],
                str = '',
                packages = [],
                field_str = '',
                used_fields = [nattrs.email_field];

            switch (attrs.form_html.integration_type) {
                case 'email':
                    delete nattrs.action;
                    delete nattrs.method;
                    delete nattrs.email_field;
                    nattrs = $.extend(nattrs,{
                        integration_type: attrs.form_html.integration_type,
                        email_address: attrs.form_html.email_address,
                        redirect_url: attrs.form_html.redirect_url,
                        name_default: attrs.content.name_default,
                        name_order: attrs.form_html.name_order || 0,
                        name_required: attrs.form_html.name_required || 'N'
                    });
                    /*
                     * Custom fields
                     */
                    var counter = 1;
                    $.each(attrs.form_html.email_data_fields,function(i,v){
                        if(v.title != ''){
                            nattrs['extra_field_'+counter] = v.title;
                            nattrs['extra_field_'+counter + '_order'] = v.order || 0;
                            nattrs['extra_field_'+counter + '_required'] = v.required || 'N';
                            counter++;
                        }
                    });
                    break;
                case 'custom':
                case 'oneshoppingcart':
                    /*
                     * Taking care of styles that have no "name" field
                     */
                    if(($.inArray(nattrs.style,no_name_styles) < 0) && nattrs.disable_name == ''){
                        nattrs['name_field'] = encodeURI(attrs.form_html.name);
                        nattrs['name_order'] = attrs.form_html.name_order || 0;
                        nattrs['name_required'] = attrs.form_html.name_required || 'N';
                        used_fields.push(nattrs.name_field);
                    }
                    nattrs['name_default'] = attrs.content.name_default;

                    // Setting form ID param if present
                    if (typeof form_id !== 'undefined') {
                        nattrs['form_id'] = form_id;
                    }

                    /*
                     * Custom fields
                     */
                    var parsed_fields   = op_parse_extra_fields(attrs.form_html.extra_fields);
                    nattrs              = $.extend(nattrs, parsed_fields.fields);
                    used_fields         = $.merge(used_fields, parsed_fields.used);
                    hdn_elems           = OptimizePress.arrayObjectDifference(used_fields, hdn_elems);

                    /*
                     * Taking care of hidden input fields
                     */
                    if($.object_length(hdn_elems) > 0){
                        var hdn_str = '';
                        for(var i in hdn_elems){
                            if($.inArray(i,used_fields) === -1){
                                hdn_str += '<input type="hidden" name="'+i+'" value="'+hdn_elems[i]+'" />';
                            }
                        }
                        if(hdn_str != ''){
                            field_str += '[optin_box_hidden]'+hdn_str+'[/optin_box_hidden]';
                        }
                    }

                    /**
                     * Taking care of excessive form html elements (<textarea> & <style>)
                     */
                    attrs.form_html.html = attrs.form_html.html.replace(/<textarea((.|[\r|\n])*)?<\/\s?textarea>/gi, '');
                    attrs.form_html.html = attrs.form_html.html.replace(/<textarea(.*?)>/gi, '');
                    attrs.form_html.html = attrs.form_html.html.replace(/<style((.|[\r|\n])*)?<\/\s?style>/gi, '');
                    attrs.form_html.html = attrs.form_html.html.replace(/<style(.*?)>/gi, '');

                    field_str += '[optin_box_code]<div style="display:none">'+attrs.form_html.html+'</div>[/optin_box_code]';

                    break;
                case 'infusionsoft':
                    nattrs = $.extend(nattrs, {
                        thank_you_page: attrs.form_html.thank_you_page,
                        list: attrs.form_html.list,
                        email_field: 'inf_field_Email',
                        name_field: attrs.form_html.name,
                        name_default: attrs.content.name_default,
                        name_order: attrs.form_html.name_order || 0,
                        name_required: attrs.form_html.name_required || 'N',
                        action_page: attrs.form_html.action_page
                    });

                    /*
                     * Custom fields
                     */
                    var parsed_fields   = op_parse_extra_fields(attrs.form_html.extra_fields);
                    nattrs              = $.extend(nattrs, parsed_fields.fields);
                    used_fields         = $.merge(used_fields, parsed_fields.used);

                    /*
                     * Taking care of hidden input fields
                     */
                    if($.object_length(hdn_elems) > 0){
                        var hdn_str = '';
                        for(var i in hdn_elems){
                            if($.inArray(i,used_fields) === -1){
                                hdn_str += '<input type="hidden" name="'+i+'" value="'+hdn_elems[i]+'" />';
                            }
                        }
                        if(hdn_str != ''){
                            field_str += '[optin_box_hidden]'+hdn_str+'[/optin_box_hidden]';
                        }
                    }
                    break;
                case 'icontact':
                case 'mailchimp':
                case 'mailpoet':
                case 'campaignmonitor':
                case 'constantcontact':
                case 'convertkit':
                case 'officeautopilot':
                case 'ontraport':
                case 'emma':
                case 'egoi':
                case 'maropost':
                case 'activecampaign':
                case 'sendlane':
                    nattrs = $.extend(nattrs, {
                        thank_you_page: attrs.form_html.thank_you_page,
                        already_subscribed_url: attrs.form_html.already_subscribed_url,
                        list: attrs.form_html.list,
                        email_field: 'email',
                        name_field: attrs.form_html.name,
                        name_default: attrs.content.name_default,
                        name_order: attrs.form_html.name_order || 0,
                        name_required: attrs.form_html.name_required || 'N',
                        signup_form_id: attrs.form_html.signup_form_id || ''
                    });

                    /*
                     * Custom fields
                     */
                    var parsed_fields   = op_parse_extra_fields(attrs.form_html.extra_fields);
                    nattrs              = $.extend(nattrs, parsed_fields.fields);
                    used_fields         = $.merge(used_fields, parsed_fields.used);

                    break;
                case 'aweber':
                case 'getresponse':
                case 'getresponsev3':
                    nattrs = $.extend(nattrs, {
                        thank_you_page: attrs.form_html.thank_you_page,
                        already_subscribed_url: attrs.form_html.already_subscribed_url,
                        list: attrs.form_html.list,
                        email_field: 'email',
                        name_field: 'name',
                        name_default: attrs.content.name_default,
                        name_order: attrs.form_html.name_order || 0,
                        name_required: attrs.form_html.name_required || 'N'
                    });

                    /*
                     * Custom fields
                     */
                    var parsed_fields   = op_parse_extra_fields(attrs.form_html.extra_fields);
                    nattrs              = $.extend(nattrs, parsed_fields.fields);
                    used_fields         = $.merge(used_fields, parsed_fields.used);

                    break;
                case 'arpreach':
                    nattrs = $.extend(nattrs, {
                        thank_you_page: attrs.form_html.thank_you_page,
                        already_subscribed_url: attrs.form_html.already_subscribed_url,
                        list: attrs.form_html.autoresponder_name,
                        email_field: 'email',
                        name_field: attrs.form_html.name,
                        name_default: attrs.content.name_default,
                        name_order: attrs.form_html.name_order || 0,
                        name_required: attrs.form_html.name_required || 'N'
                    });

                    /*
                     * Custom fields
                     */
                    var parsed_fields   = op_parse_extra_fields(attrs.form_html.extra_fields);
                    nattrs              = $.extend(nattrs, parsed_fields.fields);
                    used_fields         = $.merge(used_fields, parsed_fields.used);
                    break;
            }

            $.each(nattrs,function(i,v){
                if(v && v !== null && v != ''){
                    str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
                }
            });

            /*
             * Fetching packages
             */
            $('[name="op_assets_core_optin_box_opm_packages[]"]:checked').each(function (i, item) {
                packages.push($(item).val());
            });
            str += ' opm_packages="' + packages.join(',') + '"';

            str = '[optin_box'+str+']'+field_str;

            // Content elements
            $.each(elems,function(i,v){
                if(v && v !== null){
                    var val = (v=='paragraph' ? (op_base64encode(attrs.content[v])) : (attrs.content[v] || ''));
                    str += '[optin_box_field name="'+v+'"]'+val+'[/optin_box_field]';
                }
            });

            // Consent elements
            $.each(['consent_1_label', 'consent_2_label'], function (i, v) {
                if(v && v !== null){
                    var val = op_base64encode(attrs.gdpr_consent[v]);
                    str += '[optin_box_field name="'+v+'"]'+val+'[/optin_box_field]';
                }
            });

            //Add the color option to the string
            str += '[optin_box_field name="top_color"]' + $('#op_assets_core_optin_box_tabs_content_top_color').find('option:selected').val() + '[/optin_box_field]';

            str += button_str(attrs.submit_button);
            str += '[/optin_box]';
            OP_AB.insert_content(str);

            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var val = attrs.optin_box_code || [{attrs:{content:''}}],
                boxprefix = 'op_assets_core_optin_box_',
                idprefix = boxprefix+'tabs_',
                top_color = ((attrs.attrs.top_color=='undefined') ? '' : attrs.attrs.top_color);
            if (typeof val[0].attrs.content != 'undefined' &&  val[0].attrs.content.length > 0) {
                /*
                 * When editing element in post page custom pasted form was not visible
                 * because $(val[0].attrs.content).html() return empty string
                 */
                if (OptimizePress.op_live_editor === "1") {
                    $('#'+idprefix+'form_html_html').val(OP_AB.unautop($(val[0].attrs.content).html())).trigger('change');
                } else {
                    $('#'+idprefix+'form_html_html').val(OP_AB.unautop(val[0].attrs.content)).trigger('change');
                }
            }
            val = attrs.optin_box_field || [];
            $.each(val,function(i,v){
                var content = v.attrs.content;
                if(v.attrs.name == 'paragraph'){
                    //if (typeof(content)!=undefined) content = OP_AB.unautop(content);
                    if (typeof content != 'undefined') {
                        try {
                            OP_AB.set_wysiwyg_content(idprefix+'content_paragraph', op_base64decode(content));
                        } catch(e) {
                            if (e === 'Cannot decode base64') {
                                OP_AB.set_wysiwyg_content(idprefix+'content_paragraph', content);
                            }
                        }
                    } else {
                        OP_AB.set_wysiwyg_content(idprefix+'content_paragraph', '');
                    }
                } else if (v.attrs.name === 'consent_1_label') {
                    if (typeof content != 'undefined') {
                        $('#' + idprefix + 'gdpr_consent_consent_1_label').val(op_base64decode(content));
                    }
                } else if (v.attrs.name === 'consent_2_label') {
                    if (typeof content != 'undefined') {
                        $('#' + idprefix + 'gdpr_consent_consent_2_label').val(op_base64decode(content));
                    }
                } else {
                    $('#'+idprefix+'content_'+v.attrs.name).val(content);
                }
            });

            /*
             * Dealing with hidden fields
             */
            if (typeof attrs.optin_box_hidden !== 'undefined' && attrs.optin_box_hidden instanceof Array && attrs.optin_box_hidden.length > 0) {
                $(attrs.optin_box_hidden[0].attrs.content).each(function(i, item) {
                    var $item = $(item);
                    hdn_elems[$item.attr('name')] = $item.val();
                });
            }

            var button = attrs.optin_box_button || [{attrs:{}}];
            set_button_settings(button[0]);

            attrs = attrs.attrs || {};
            var vals = {},
                counter = 1;

            disable_focus = true;

            switch (attrs.integration_type) {
                case 'email':
                    var add_link = steps[1].find('.field-id-'+idprefix+'form_html_email_data_fields a.new-row'),
                        container = steps[1].find('.field-id-'+idprefix+'form_html_email_data_fields-multirow-container'),
                        cur;
                    while(true){
                        if(typeof attrs['extra_field_'+counter] != 'undefined'){
                            add_link.trigger('click');
                            container.find('.op-multirow:last input[name$="_title"]').val(attrs['extra_field_' + counter]);
                            container.find('.op-multirow:last input[name$="_order"]').val(attrs['extra_field_' + counter + '_order']);
                            container.find('.op-multirow:last input[name$="_required"]').attr('checked', ((attrs['extra_field_' + counter + '_required'] || 'N') == 'Y'));
                            container.find('.op-multirow:last input[name$="_hidden"]').attr('checked', ((attrs['extra_field_' + counter + '_hidden'] || 'N') == 'Y'));
                            counter++;
                        } else {
                            break;
                        }
                    }
                    vals = {'email_order': ['email_order', 0], 'name_order': ['name_order', 0], 'integration_type': ['integration_type', 'custom'], 'gotowebinar_list': ['gotowebinar', ''], 'email_address':['email_address',''], 'redirect_url':['redirect_url','']};
                    break;
                case 'custom':
                case 'oneshoppingcart':
                    var add_link = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields a.new-row'),
                        container = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields-multirow-container'),
                        cur,
                        el,
                        name, title;
                    while(true){
                        if(typeof attrs['extra_field_'+counter+'_name'] != 'undefined' && attrs['extra_field_'+counter+'_title'] != 'undefined'){
                            name = decodeURI(attrs['extra_field_'+counter+'_name']);
                            order = attrs['extra_field_'+counter+'_order'] || 0;
                            required = attrs['extra_field_'+counter+'_required'] || 'N';
                            hidden = attrs['extra_field_'+counter+'_hidden'] || 'N';

                            // If hidden we need to decode value for potential shortcode usage
                            if (hidden === 'Y') {
                                title = decodeURI(attrs['extra_field_'+counter+'_title']);
                            } else {
                                title = attrs['extra_field_'+counter+'_title'];
                            }

                            add_link.trigger('click');
                            cur = container.find('.op-multirow:last');
                            el = cur.find('select');
                            if(el.find('option[value="'+name+'"]').length == 0){
                                el.val('op_add_new_field').trigger('change');
                                cur.find('input[name$="_title"]').val(name);
                            } else {
                                el.val(name);
                            }
                            cur.find('input[name$="_text"]').val(title);
                            cur.find('input[name$="_order"]').val(order);
                            cur.find('input[name$="_required"]').attr('checked', required == 'Y');
                            cur.find('input[name$="_hidden"]').attr('checked', hidden == 'Y');
                            counter++;
                        } else {
                            break;
                        }
                    }
                    // Setting form ID param if present
                    if (typeof attrs['form_id'] !== 'undefined') {
                        form_id = attrs['form_id'];
                    }
                    vals = {'email_order': ['email_order', 0], 'name_order': ['name_order', 0], 'integration_type': ['integration_type', 'custom'], 'gotowebinar_list': ['gotowebinar', ''], 'name':['name_field',''], 'email':['email_field',''], 'method':['method','post'], 'action':['action','']};
                    break;
                case 'icontact':
                case 'aweber':
                case 'mailchimp':
                case 'mailpoet':
                case 'infusionsoft':
                case 'getresponse':
                case 'getresponsev3':
                case 'campaignmonitor':
                case 'constantcontact':
                case 'convertkit':
                case 'officeautopilot':
                case 'ontraport':
                case 'activecampaign':
                case 'emma':
                case 'egoi':
                case 'maropost':
                case 'sendlane':
                    var add_link = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields a.new-row'),
                        container = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields-multirow-container'),
                        cur,
                        el,
                        name, title;
                    while(true){
                        if(typeof attrs['extra_field_'+counter+'_name'] != 'undefined' && attrs['extra_field_'+counter+'_title'] != 'undefined'){
                            name = attrs['extra_field_'+counter+'_name'];
                            order = attrs['extra_field_'+counter+'_order'] || 0;
                            required = attrs['extra_field_'+counter+'_required'] || 'N';
                            hidden = attrs['extra_field_'+counter+'_hidden'] || 'N';

                            // If hidden we need to decode value for potential shortcode usage
                            if (hidden === 'Y') {
                                title = decodeURI(attrs['extra_field_'+counter+'_title']);
                            } else {
                                title = attrs['extra_field_'+counter+'_title'];
                            }

                            add_link.trigger('click');
                            cur = container.find('.op-multirow:last');
                            el = cur.find('select');
                            if(el.find('option[value="'+name+'"]').length == 0){
                                el.val('op_add_new_field').trigger('change');
                                cur.find('input[name$="_title"]').val(name);
                            } else {
                                el.val(name);
                            }
                            cur.find('input[name$="_text"]').val(title);
                            cur.find('input[name$="_order"]').val(order);
                            cur.find('input[name$="_required"]').attr('checked', required == 'Y');
                            cur.find('input[name$="_hidden"]').attr('checked', hidden == 'Y');
                            counter++;
                        } else {
                            break;
                        }
                    }
                    vals = {'email_order': ['email_order', 0], 'name_order': ['name_order', 0], 'integration_type': ['integration_type', 'custom'], 'name':['name_field', ''], 'list': ['list', ''], 'gotowebinar_list': ['gotowebinar', ''], 'thank_you_page': ['thank_you_page', ''], 'already_subscribed_url': ['already_subscribed_url', ''], 'signup_form_id': ['signup_form_id', '']};
                    break;
                case 'arpreach':
                    var add_link = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields a.new-row'),
                        container = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields-multirow-container'),
                        cur,
                        el,
                        name, title;
                    while(true){
                        if(typeof attrs['extra_field_'+counter+'_name'] != 'undefined' && attrs['extra_field_'+counter+'_title'] != 'undefined'){
                            name = attrs['extra_field_'+counter+'_name'];
                            order = attrs['extra_field_'+counter+'_order'] || 0;
                            required = attrs['extra_field_'+counter+'_required'] || 'N';
                            hidden = attrs['extra_field_'+counter+'_hidden'] || 'N';

                            // If hidden we need to decode value for potential shortcode usage
                            if (hidden === 'Y') {
                                title = decodeURI(attrs['extra_field_'+counter+'_title']);
                            } else {
                                title = attrs['extra_field_'+counter+'_title'];
                            }

                            add_link.trigger('click');
                            cur = container.find('.op-multirow:last');
                            el = cur.find('select');
                            if(el.find('option[value="'+name+'"]').length == 0){
                                el.val('op_add_new_field').trigger('change');
                                cur.find('input[name$="_title"]').val(name);
                            } else {
                                el.val(name);
                            }
                            cur.find('input[name$="_text"]').val(title);
                            cur.find('input[name$="_order"]').val(order);
                            cur.find('input[name$="_required"]').attr('checked', required == 'Y');
                            cur.find('input[name$="_hidden"]').attr('checked', hidden == 'Y');
                            counter++;
                        } else {
                            break;
                        }
                    }
                    vals = {'email_order': ['email_order', 0], 'name_order': ['name_order', 0], 'integration_type': ['integration_type', 'custom'], 'name':['name_field', ''], 'autoresponder_name': ['list', ''], 'gotowebinar_list': ['gotowebinar', ''], 'thank_you_page': ['thank_you_page', ''], 'already_subscribed_url': ['already_subscribed_url', '']};
                    break;
            }

            $.each(vals,function(i,v){
                if (i == 'list' || i == 'gotowebinar_list') {
                    $('#'+idprefix+'form_html_'+i).attr('data-default', decodeURI(attrs[v[0]]) || decodeURI(v[1]));
                } else if (i == 'name' || i == 'email') {
                    $('#'+idprefix+'form_html_'+i).val(attrs[v[0]] || v[1]).attr('data-default', decodeURI(attrs[v[0]]) || decodeURI(v[1]));
                } else {
                    $('#'+idprefix+'form_html_'+i).val(attrs[v[0]] || v[1]);
                }
            });

            OP_AB.set_selector_value(boxprefix+'style_container',attrs.style || '');
            $('#'+idprefix+'form_html_disable_name').attr('checked',((attrs.disable_name || 'N') == 'Y'));
            $('#'+idprefix+'form_html_integration_type').trigger('change');
            $('#'+idprefix+'form_html_action').val((typeof attrs.action != 'undefined' ? decodeURI(attrs.action) : ''));
            $('#'+idprefix+'form_html_action_page').val((typeof attrs.action_page != 'undefined' ? decodeURI(attrs.action_page) : ''));
            $('#'+idprefix+'form_html_double_optin').attr('checked',((attrs.double_optin || 'N') == 'Y'));
            $('#'+idprefix+'form_html_welcome_email').attr('checked',((attrs.welcome_email || 'N') == 'Y'));
            $('#'+idprefix+'form_html_signup_form_id').val(attrs.signup_form_id || '');
            $('#'+idprefix+'form_html_name_required').attr('checked',((attrs.name_required || 'N') == 'Y'));
            $('#'+idprefix+'form_html_gotowebinar').val((typeof attrs.gotowebinar != 'undefined' ? 'Y' : 'N')).trigger('change');
            $('#'+idprefix+'content_submit').val(attrs.submit || '');
            $('#'+idprefix+'content_name_default').val(attrs.name_default || '');
            $('#'+idprefix+'content_email_default').val(attrs.email_default || '');
            $('#'+idprefix+'content_top_color').val(top_color).next('a').css({ backgroundColor: top_color });

            if(attrs.double_optin == 'Y')
              $('.field-welcome_email').hide();

            if (typeof $('#'+idprefix+'form_html_name').attr('data-default') != 'undefined') {
                $('#'+idprefix+'form_html_name').val($('#'+idprefix+'form_html_name').attr('data-default'));
            }
            if (typeof $('#'+idprefix+'form_html_email').attr('data-default') != 'undefined') {
                $('#'+idprefix+'form_html_email').val($('#'+idprefix+'form_html_email').attr('data-default'));
            }

            disable_focus = false;

            // GDPR consent
            $('#op_assets_core_optin_box_tabs_gdpr_consent_gdpr_consent').val(typeof attrs.gdpr_consent != 'undefined' ? attrs.gdpr_consent : 'disabled').trigger('change');
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_enabled').val(typeof attrs.consent_1_enabled != 'undefined' ? attrs.consent_1_enabled : 'no').trigger('change');
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_accepted').val(attrs.consent_1_tag_accepted).attr('data-default', attrs.consent_1_tag_accepted);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_accepted_text').val(attrs.consent_1_tag_accepted);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_declined').val(attrs.consent_1_tag_declined).attr('data-default', attrs.consent_1_tag_declined);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_declined_text').val(attrs.consent_1_tag_declined);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_not_shown').val(attrs.consent_1_tag_not_shown).attr('data-default', attrs.consent_1_tag_not_shown);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_1_tag_not_shown_text').val(attrs.consent_1_tag_not_shown);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_enabled').val(typeof attrs.consent_2_enabled != 'undefined' ? attrs.consent_2_enabled : 'no').trigger('change');
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_accepted').val(attrs.consent_2_tag_accepted).attr('data-default', attrs.consent_2_tag_accepted);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_accepted_text').val(attrs.consent_2_tag_accepted);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_declined').val(attrs.consent_2_tag_declined).attr('data-default', attrs.consent_2_tag_declined);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_declined_text').val(attrs.consent_2_tag_declined);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_not_shown').val(attrs.consent_2_tag_not_shown).attr('data-default', attrs.consent_2_tag_not_shown);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_2_tag_not_shown_text').val(attrs.consent_2_tag_not_shown);
            $('#op_assets_core_optin_box_tabs_gdpr_consent_consent_notes_field').val(attrs.consent_notes_field).attr('data-default', attrs.consent_notes_field);

            //Update advanced options
            $('#op_assets_core_optin_box_width').val(attrs.width);
            $('#op_assets_core_optin_box_margin_top').val(attrs.margin_top);
            $('#op_assets_core_optin_box_margin_right').val(attrs.margin_right);
            $('#op_assets_core_optin_box_margin_bottom').val(attrs.margin_bottom);
            $('#op_assets_core_optin_box_margin_left').val(attrs.margin_left);
            $('#op_assets_core_optin_box_alignment').val(attrs.alignment);
            $('#op_assets_core_optin_box_opm_integration').val((typeof attrs.opm_integration != 'undefined' ? attrs.opm_integration : 'N')).trigger('change');
            $('#op_assets_core_optin_box_opm_level').val((typeof attrs.opm_level != 'undefined' ? attrs.opm_level : 'N'));

            // Packages
            $('[name="op_assets_core_optin_box_opm_packages[]"]').each(function (i, item) {
                if (typeof attrs.opm_packages != 'undefined' && $.inArray($(item).val(), attrs.opm_packages.split(',')) > -1) {
                    $(item).attr('checked', true);
                }
            });
        }
    };
    function fill_provider_fields(list, provider) {
        input_elems = lists[provider][list].fields;

        op_fill_provider_custom_fields(input_elems);
        fillGdprDropdownsWithCustomFields(provider, input_elems);

        /*
         * Infusionsoft action page attribute
         */
        if (typeof lists[provider] != 'undefined'
        && typeof lists[provider][list] != 'undefined'
        && typeof lists[provider][list].action != 'undefined') {
            $('#op_assets_core_optin_box_tabs_form_html_action_page').val(lists[provider][list].action);
        }
        /*
         * Infusionsoft hidden form params
         */
        if (typeof lists[provider][list] != 'undefined'
        && typeof lists[provider][list].hidden != 'undefined') {
            hdn_elems = lists[provider][list].hidden;
        }
        var options = [];
        if (typeof input_elems != 'undefined') {
            $.each(input_elems, function(id, value) {
                options.push($('<option/>', {value: id, text: value}));
            });
        }
        // var $name = $('#op_assets_core_optin_box_tabs_form_html_name,#op_assets_core_optin_box_tabs_form_html_gotowebinar_first_name,#op_assets_core_optin_box_tabs_form_html_gotowebinar_last_name');
        var $name = $('#op_assets_core_optin_box_tabs_form_html_name');
        $name.empty().append(options);

        /*
         * Selecting previously selected value (if editing)
         * or selecting default for name field
         */
        if (typeof $name.attr('data-default') != 'undefined') {
            $name.val($name.attr('data-default'));
        } else {
            var nameValue = null;
            switch(provider) {
                case 'activecampaign':
                case 'arpreach':
                case 'constantcontact':
                case 'egoi':
                case 'emma':
                case 'maropost':
                    nameValue = 'first_name';
                    break;
                case 'campaignmonitor':
                    nameValue = 'Name';
                    break;
                case 'aweber':
                case 'convertkit':
                case 'getresponse':
                case 'getresponsev3':
                case 'icontact':
                    nameValue = 'name';
                    break;
                case 'officeautopilot':
                case 'ontraport':
                    nameValue = 'First-Name';
                    break;
                case 'infusionsoft':
                    nameValue = 'inf_field_FirstName';
                    break;
                case 'mailchimp':
                    nameValue = 'FNAME';
                    break;
                case 'mailpoet':
                    nameValue = 'firstname';
                    break;
                case 'sendlane':
                    nameValue = 'sender_name';
                    break;
            }

            if (nameValue) {
                $name.val(nameValue);
            }
        }
    };
    function change_html(e){
        try {
            tmp_obj.html($(this).val().replace(/<!--.*-->/g, "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'').replace(/<script.*/gi, ''));
        } catch(error) {}
        hdn_elems = {};
        input_elems = {};
        var $t = $(this).closest('.op-multirow'),
            form = tmp_obj.find('form[action]'),
            email_select = $('#op_assets_core_optin_box_tabs_form_html_email'),
            name_select = $('#op_assets_core_optin_box_tabs_form_html_name'),
            // gotowebinar_first_name_select = $('#op_assets_core_optin_box_tabs_form_html_gotowebinar_first_name'),
            // gotowebinar_last_name_select = $('#op_assets_core_optin_box_tabs_form_html_gotowebinar_last_name'),
            action = $('#op_assets_core_optin_box_tabs_form_html_action'),
            method = $('#op_assets_core_optin_box_tabs_form_html_method'),
            selects = $('#op_assets_core_optin_box_tabs_form_html_name,#op_assets_core_optin_box_tabs_form_html_email');
            // selects = $('#op_assets_core_optin_box_tabs_form_html_name,#op_assets_core_optin_box_tabs_form_html_email,#op_assets_core_optin_box_tabs_form_html_gotowebinar_first_name,#op_assets_core_optin_box_tabs_form_html_gotowebinar_last_name');
        method.val('');
        action.val('');
        selects.find('option').remove();

        if(form.length > 0){
            action.val(form.attr('action'));
            method.val((form.attr('method') || 'post').toLowerCase());
            form_id = form.attr('id');
            $(':input[name]:not(:button,:submit)',form).each(function(){
                var name = $(this).attr('name'),
                    name_selected = name == $t.find('.name_box_selected').val() ? ' selected="selected"' : '',
                    email_selected = name == $t.find('.email_box_selected').val() ? ' selected="selected"' : '';
                name_select.append('<option value="'+name+'"'+name_selected+'>'+name+'</option>');
                // gotowebinar_first_name_select.append('<option value="'+name+'">'+name+'</option>');
                // gotowebinar_last_name_select.append('<option value="'+name+'">'+name+'</option>');
                email_select.append('<option value="'+name+'"'+email_selected+'>'+name+'</option>');
                input_elems[name] = name;
            });
            if(typeof input_elems.name != 'undefined'){
                name_select.val('name');
            }
            if(typeof input_elems.email != 'undefined'){
                email_select.val('email');
            }
            $(':input',tmp_obj).each(function(){
                var name = $(this).attr('name');
                if(typeof name != 'undefined'){
                    hdn_elems[name] = $(this).val();
                }
            });
            // change_select($('#op_assets_core_optin_box_tabs_form_html_name'),'name');
            multirow_dropdown(e.data);
            // , .field-id-op_assets_core_optin_box_tabs_form_html_gotowebinar_first_name select, .field-id-op_assets_core_optin_box_tabs_form_html_gotowebinar_last_name select
        }
    };
    function multirow_dropdown(steps){
        var new_values = '<option value="op_add_new_field">'+OP_AB.translate('add_new_field')+'</option><option value="">-----------------</option>';
        $.each(input_elems,function(i,v){
            new_values += '<option value="'+i+'">'+v+'</option>';
        });
        steps[1].find('.field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container select').each(function(i){
            var current = $(this).find(':selected').attr('value');
            $(this).html(new_values).val(current).trigger('change');
        });
    };
    function change_select(elem,field){
        //var elem2 = $('#op_assets_core_optin_box_tabs_form_html_'+(field == 'name' ? 'email' : 'name')),
        var elem2 = $('#op_assets_core_optin_box_tabs_form_html_' + field),
            val1 = elem.val(),
            val2 = elem2.val();
        if(val1 == val2){
            elem2.find('option[value!="'+val1+'"]:eq(0)').attr('selected',true);
        }
    };
    function merge_obj(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    };

    function button_str(attrs){
        var str = '', fields = {}, append = {}, has_content = false, content = '';
        switch(attrs.button_type){
            case '1':
                optin_style = attrs.location;
                button_below = attrs.text_below_button;
                attrs = merge_obj(attrs.left_column, attrs.right_column);
                content = attrs.text_properties_1_text || '';
                attrs.button_type = 1;
                attrs.location = optin_style;
                attrs.button_below = button_below;
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
                        'location': 'location',
                        'button_below': 'button_below'
                    };
                break;
            case '7':
                fields = {'text': 'button_content', 'image': 'image', 'location': 'location', 'button_below': 'text_below_button'};
                break;
            default:
                fields =  {'button_below': 'text_below_button'};
                attrs.button_type = 0;
                content = attrs.button_content || '';
                break;
        }
        $.each(fields,function(i,v){
            if (attrs[v] === 0) {
                var val = 0;
            } else {
                var val = attrs[v] || '';
            }
            val += '';
            if(val !== ''){
                str += ' '+i+'="'+val.replace(/"/ig,"'")+'"';
            }
        });
        $.each(append,function(i,v){
            if(v != ''){
                str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
            }
        });
        str = '[optin_box_button type="'+attrs.button_type+'"'+str+']'+content+'[/optin_box_button] ';
        return str;
    };
    function set_button_settings(attrs){
        attrs = attrs.attrs || {};
        var style = attrs.type,
            idprefix = 'op_assets_core_optin_box_tabs_submit_button_';
        OP_AB.set_selector_value(idprefix+'button_type_container',style);
        switch(style){
            case '0':
                $('#'+idprefix+'button_content').val(attrs.content || '');
                if (typeof attrs.button_below === 'undefined') {
                    $('#'+idprefix+'text_below_button').attr('checked', false);
                } else {
                    $('#'+idprefix+'text_below_button').attr('checked',((attrs.button_below || 'N') == 'Y'));
                }
                break;
            case '1':
                var preset = $.extend(true, {}, op_optin_button_presets.presets['default'].attributes);
                for (i in attrs) {
                    if (typeof preset[i] != 'undefined') {
                        preset[i].value = attrs[i];
                    }
                }
                op_optin_button_presets.change(preset);
                break;
            case '7':
                OP_AB.set_uploader_value(idprefix+'image', attrs.image);
                break;
        };
    };
}(opjq));

var op_optin_button_presets = (function($){
    return {
        presets: {
            'default': {
                attributes: {
                    text: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_text',
                        type: 'text'
                    },
                    text_size: {
                        value: 36,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_size',
                        type: 'dropdown'
                    },
                    text_font: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_container',
                        type: 'font'
                    },
                    text_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_color',
                        type: 'color'
                    },
                    text_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    text_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    text_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    text_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_box_letter_spacing_1',
                        type: 'slider'
                    },
                    subtext_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_optin_box_tabs_submit_button_subtext_box',
                        type: 'checkbox'
                    },
                    subtext: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_text',
                        type: 'text'
                    },
                    subtext_size: {
                        value: 14,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_size',
                        type: 'dropdown'
                    },
                    subtext_font: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_container',
                        type: 'font'
                    },
                    subtext_color: {
                        value: '#ffffff',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_color',
                        type: 'color'
                    },
                    subtext_bold: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-bold',
                        type: 'checkbox'
                    },
                    subtext_italic: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-italic',
                        type: 'checkbox'
                    },
                    subtext_underline: {
                        value: false,
                        selector: '.field-id-op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-underline',
                        type: 'checkbox'
                    },
                    subtext_letter_spacing: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_subtext_box_letter_spacing_2',
                        type: 'slider'
                    },
                    text_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_optin_box_tabs_submit_button_text_shadow',
                        type: 'checkbox'
                    },
                    text_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_shadow_vertical_axis_1',
                        type: 'slider'
                    },
                    text_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_shadow_horizontal_axis_1',
                        type: 'slider'
                    },
                    text_shadow_color: {
                        value: '#ffff00',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_shadow_shadow_color_1',
                        type: 'color'
                    },
                    text_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_text_shadow_blur_radius_1',
                        type: 'slider'
                    },
                    styling_width: {
                        value: 60,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_width_1',
                        type: 'slider'
                    },
                    styling_height: {
                        value: 30,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_height_1',
                        type: 'slider'
                    },
                    styling_border_size: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_border_size_1',
                        type: 'slider'
                    },
                    styling_border_radius: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_border_radius_1',
                        type: 'slider'
                    },
                    styling_border_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_border_color_1',
                        type: 'color'
                    },
                    styling_border_opacity: {
                        value: 100,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_border_opacity_1',
                        type: 'slider'
                    },
                    styling_gradient: {
                        value: false,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_gradient_1',
                        type: 'checkbox'
                    },
                    styling_shine: {
                        value: false,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_shine_1',
                        type: 'checkbox'
                    },
                    styling_gradient_start_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_gradient_start_color_1',
                        type: 'color'
                    },
                    styling_gradient_end_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_styling_gradient_end_color_2',
                        type: 'color'
                    },
                    drop_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_optin_box_tabs_submit_button_drop_shadow',
                        type: 'checkbox'
                    },
                    drop_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_vertical_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_horizontal_axis_2',
                        type: 'slider'
                    },
                    drop_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_border_radius_2',
                        type: 'slider'
                    },
                    drop_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_spread_radius_1',
                        type: 'slider'
                    },
                    drop_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_shadow_color_2',
                        type: 'color'
                    },
                    drop_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_drop_shadow_opacity_1',
                        type: 'slider'
                    },
                    inset_shadow_panel: {
                        value: false,
                        selector: '#panel_control_op_assets_core_optin_box_tabs_submit_button_inset_shadow',
                        type: 'checkbox'
                    },
                    inset_shadow_vertical: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_vertical_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_horizontal: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_horizontal_axis_3',
                        type: 'slider'
                    },
                    inset_shadow_blur: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_border_radius_3',
                        type: 'slider'
                    },
                    inset_shadow_spread: {
                        value: 0,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_spread_radius_2',
                        type: 'slider'
                    },
                    inset_shadow_color: {
                        value: '',
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_shadow_color_3',
                        type: 'color'
                    },
                    inset_shadow_opacity: {
                        value: 100,
                        selector: '#op_assets_core_optin_box_tabs_submit_button_inset_shadow_opacity_2',
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
                        var $item = $(defaults[i].selector + ' .op-font[data-font="' + value[0] + '"]');
                        /*
                         * If item is not found we display default one (font-family:inherit)
                         */
                        if ($item.length == 0) {
                            $container.html($(defaults[i].selector + ' .op-asset-dropdown-list li:first a').html());
                        } else {
                            $container.html($item.parent().html());
                        }
                        $('#op_asset_browser_slide3 .op-settings-core-optin_box').trigger({type: 'update_button_preview', tag: 'optin_box', id: defaults[i].selector.substr(1), value: $item.attr('alt'), font_type: $item.attr('data-type'), font_family: $item.attr('data-family')});
                        break;
                    case 'slider':
                        var $slider = $(defaults[i].selector);
                        if ($slider.length > 0) {
                            $slider.slider({value:attributes[i].value});
                            $slider.slider('option', 'slide').call($slider, {}, {value: attributes[i].value, id: defaults[i].selector.substr(1)});
                            $slider.slider('option', 'stop').call($slider, {}, {value: attributes[i].value, id: defaults[i].selector.substr(1)});
                        }
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

var op_custom_optin_button = (function($){
    return {
        update: function(e) {
            var id = e.id, value = e.value;
            switch (id) {
                /*
                 * Preset
                 */
                case 'op_assets_core_optin_box_tabs_submit_button_button_preview_container':
                    op_optin_button_presets.switch(value);
                    break;
                /*
                 * Text box
                 */
                case 'op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_text':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').html(value);
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_container':
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
                case 'op_assets_core_optin_box_tabs_submit_button_text_box_text_properties_1_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .text').css('color', value);
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_text_box_letter_spacing_1':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Subtext box
                 */
                case 'op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_text':
                    var element = $('#op_button_preview.pbox_' + e.tag + ' .subtext');
                    element.html(value);
                    if (value == '') {
                        element.hide();
                    } else {
                        element.show();
                    }
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_size':
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-size', value + 'px');
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_container':
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
                case 'op_assets_core_optin_box_tabs_submit_button_subtext_box_text_properties_2_color':
                    if (value === '') {
                        value = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('color', value);
                    break;
                case 'op[op_assets_core_optin_box_tabs_submit_button_subtext_box][enabled]':
                    if (value == 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').hide();
                    }
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_subtext_box_letter_spacing_2':
                    if (value != 0) {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', value + 'px');
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', 'normal');
                    }
                    break;
                /*
                 * Text shadow
                 */
                case 'op_assets_core_optin_box_tabs_submit_button_text_shadow_vertical_axis_1':
                case 'op_assets_core_optin_box_tabs_submit_button_text_shadow_horizontal_axis_1':
                case 'op_assets_core_optin_box_tabs_submit_button_text_shadow_blur_radius_1':
                case 'op_assets_core_optin_box_tabs_submit_button_text_shadow_shadow_color_1':
                case 'op[op_assets_core_optin_box_tabs_submit_button_text_shadow][enabled]':
                    if ($('input[name="op[op_assets_core_optin_box_tabs_submit_button_text_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis = $('#op_assets_core_optin_box_tabs_submit_button_text_shadow_vertical_axis_1').slider('value');
                        var horizontal_axis = $('#op_assets_core_optin_box_tabs_submit_button_text_shadow_horizontal_axis_1').slider('value');
                        var blur_radius = $('#op_assets_core_optin_box_tabs_submit_button_text_shadow_blur_radius_1').slider('value');
                        var shadow_color = $('#op_assets_core_optin_box_tabs_submit_button_text_shadow_shadow_color_1').val();
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
                case 'op_assets_core_optin_box_tabs_submit_button_styling_width_1':
                    var max = $('#op_assets_core_optin_box_tabs_submit_button_styling_width_1').slider('option', 'max');
                    if (max == value) {
                        $('#op_button_preview.pbox_' + e.tag).css('width', '100%');
                        $('#output_op_assets_core_optin_box_tabs_submit_button_styling_width_1').html('100%');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_optin_box_tabs_submit_button_styling_height_1').slider('value') + 'px 0');
                        return false;
                    } else {
                        $('#op_button_preview.pbox_' + e.tag).css('width', 'auto');
                        $('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_optin_box_tabs_submit_button_styling_height_1').slider('value') + 'px ' + value + 'px');
                    }
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_height_1':
                    $('#op_button_preview.pbox_' + e.tag).css('padding', value + 'px ' + $('#op_assets_core_optin_box_tabs_submit_button_styling_width_1').slider('value') + 'px');
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_border_color_1':
                case 'op_assets_core_optin_box_tabs_submit_button_styling_border_opacity_1':
                    var border_opacity = $('#op_assets_core_optin_box_tabs_submit_button_styling_border_opacity_1').slider('value');
                    var border_color = $('#op_assets_core_optin_box_tabs_submit_button_styling_border_color_1').val();
                    if (border_color === '') {
                        border_color = '#ffffff';
                    }
                    $('#op_button_preview.pbox_' + e.tag).css('border-color', generateCssColor(border_color, border_opacity));
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_border_size_1':
                    $('#op_button_preview.pbox_' + e.tag).css('border-width', value + 'px');
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_border_radius_1':
                    $('#op_button_preview.pbox_' + e.tag + ', #op_button_preview.pbox_' + e.tag + ' .gradient, #op_button_preview.pbox_' + e.tag + ' .active, #op_button_preview.pbox_' + e.tag + ' .hover, #op_button_preview.pbox_' + e.tag + ' .shine').css('border-radius', value + 'px');
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_shine_1':
                    if (value === 1) {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag + ' .shine').hide();
                    }
                    break;
                case 'op_assets_core_optin_box_tabs_submit_button_styling_gradient_start_color_1':
                case 'op_assets_core_optin_box_tabs_submit_button_styling_gradient_end_color_2':
                case 'op_assets_core_optin_box_tabs_submit_button_styling_gradient_1':
                case 'op_assets_core_optin_box_tabs_submit_button_styling_gradient_1':
                    var start_color = $('#op_assets_core_optin_box_tabs_submit_button_styling_gradient_start_color_1').val();
                    var end_color = $('#op_assets_core_optin_box_tabs_submit_button_styling_gradient_end_color_2').val();
                    var gradient_status = $('#op_assets_core_optin_box_tabs_submit_button_styling_gradient_1').is(':checked');
                    if (gradient_status == true && start_color != end_color) {
                        $('#op_button_preview.pbox_' + e.tag).css('background', start_color);
                        $('#op_button_preview.pbox_' + e.tag + ' .gradient').show();
                    } else {
                        $('#op_button_preview.pbox_' + e.tag)
                            .css('background', start_color)
                            .css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + start_color + '), color-stop(100%, ' + end_color + '))')
                            .css('background', '-webkit-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                            .css('background', '-moz-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                            .css('background', '-ms-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                            .css('background', '-o-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                            .css('background', 'linear-gradient(to bottom, ' + start_color + ' 0%, ' + end_color + ' 100%)')
                            .css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=' + start_color + ', endColorstr=' + end_color + ', GradientType=0 )');

                        $('#op_button_preview.pbox_' + e.tag + ' .gradient').hide();
                    }
                    break;
                /*
                 * Drop and inner shadow
                 */
                // Drop
                case 'op[op_assets_core_optin_box_tabs_submit_button_drop_shadow][enabled]':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_vertical_axis_2':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_horizontal_axis_2':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_border_radius_2':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_spread_radius_1':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_opacity_1':
                case 'op_assets_core_optin_box_tabs_submit_button_drop_shadow_shadow_color_2':
                // Inner/inset
                case 'op[op_assets_core_optin_box_tabs_submit_button_inset_shadow][enabled]':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_vertical_axis_3':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_horizontal_axis_3':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_border_radius_3':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_spread_radius_2':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_opacity_2':
                case 'op_assets_core_optin_box_tabs_submit_button_inset_shadow_shadow_color_3':

                    var styles = [];

                    if ($('input[name="op[op_assets_core_optin_box_tabs_submit_button_drop_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_vertical_axis_2').slider('value');
                        var horizontal_axis_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_horizontal_axis_2').slider('value');
                        var border_radius_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_border_radius_2').slider('value');
                        var spread_radius_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_spread_radius_1').slider('value');
                        var shadow_color_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_shadow_color_2').val();
                        var opacity_1 = $('#op_assets_core_optin_box_tabs_submit_button_drop_shadow_opacity_1').slider('value');
                        if (shadow_color_1 === '') {
                            shadow_color_1 = '#ffffff';
                        }
                        color_1 = generateCssColor(shadow_color_1, opacity_1);
                        styles.push(horizontal_axis_1 + 'px ' + vertical_axis_1 + 'px ' + border_radius_1 + 'px ' + spread_radius_1 + 'px ' + color_1);
                    }

                    if ($('input[name="op[op_assets_core_optin_box_tabs_submit_button_inset_shadow][enabled]"]').is(':checked')) {
                        var vertical_axis_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_vertical_axis_3').slider('value');
                        var horizontal_axis_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_horizontal_axis_3').slider('value');
                        var border_radius_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_border_radius_3').slider('value');
                        var spread_radius_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_spread_radius_2').slider('value');
                        var shadow_color_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_shadow_color_3').val();
                        var opacity_2 = $('#op_assets_core_optin_box_tabs_submit_button_inset_shadow_opacity_2').slider('value');
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

(function ($) {
    window.op_fill_provider_custom_fields = (function (input_elems) {
        $('.field-id-op_assets_core_optin_box_tabs_form_html_extra_fields-multirow-container .op-multirow .field-select').each(function () {
            var options = [];
            var customSelect = $(this).find('select');
            var customSelectVal = $(this).next('.field-input').find('input').val();

            options.push($("<option/>", {value: 'op_add_new_field', text: 'Add New Field'}));
            options.push($("<option/>", {value: '', text: '-----------------'}));

            if (typeof input_elems != 'undefined') {
                $.each(input_elems, function (id, list) {
                    options.push($("<option/>", {value: id, text: list}));
                });
            }

            customSelect.empty().append(options);
            customSelect.val(customSelectVal);
            if (customSelect.find('option:selected').length == 0) {
                customSelect.val('op_add_new_field');
            }
            customSelect.change();
        });
    });

    window.op_parse_extra_fields = (function (extra_fields) {
        var counter = 1,
            fields = {},
            used = [];
        $.each(extra_fields,function(i,v) {
            var name = '';

            if (v.field_name != '' && v.field_name != 'op_add_new_field') {
                name = v.field_name;
            } else if (v.title != '') {
                name = v.title;
            }

            if (name != '') {
                fields['extra_field_'+counter+'_name'] = encodeURI(name);
                fields['extra_field_'+counter+'_order'] = v.order || 0;
                fields['extra_field_'+counter + '_required'] = v.required || 'N';
                fields['extra_field_'+counter + '_hidden'] = v.hidden || 'N';

                // If hidden then we need to encode value to enable use of shortcodes
                if (typeof v.hidden != 'undefined' && v.hidden === 'Y') {
                    fields['extra_field_'+counter+'_title'] = encodeURI(v.text);
                } else {
                    fields['extra_field_'+counter+'_title'] = v.text;
                }

                used.push(name);
                counter++;
            }
        });

        return {'fields': fields, 'used': used};
    });
}(opjq));
