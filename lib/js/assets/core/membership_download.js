var op_asset_settings = (function($){
    var cp_styles = [3, 4];

    // Free subscriber level is messing up content drip so we are removing it.
    // Some elements need all OPM levels so we are making custom copy here.
    var WithoutFreeOPMLevels = $.extend({}, OPMLevels);
    delete WithoutFreeOPMLevels[0];

    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-files-download.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-files-download.mp4',
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

                elements: {
                    type: 'multirow',
                    multirow: {
                        attributes: {
                            level: {
                                title: 'select_level',
                                type: 'select',
                                values: WithoutFreeOPMLevels
                            },
                            packages_label: {
                                html: '<label>Membership packages</label>',
                                type: 'custom_html'
                            },
                            packages: {
                                title: '',
                                type: 'checkbox',
                                values: OPMPackages
                            },
                            icon: {
                                title: 'icon',
                                type: 'image-selector',
                                folder: 'icons',
                                selectorClass: 'icon-view-64',
                                asset: ['core', 'file_download']
                            },
                            file: {
                                title: 'file',
                                type: 'media'
                            },
                            title: {
                                title: 'file_name'
                            },
                            new_window: {
                                title: 'new_window',
                                type: 'checkbox'
                            },
                            hide_alert: {
                                title: 'hide_alert',
                                type: 'checkbox'
                            },
                            content: {
                                title: 'file_description',
                                type: 'textarea',
                                format: 'br'
                            }
                        },
                        onAdd: function(steps){
                            var $selected_style = steps[0].find('.op-asset-dropdown-list .selected');

                            $selected_style.trigger('click');
                        }
                    }
                }
            }
            /*step_3: {
             font: {
             title: 'membership_download_title_styling',
             type: 'font'
             },
             content_font: {
             title: 'membership_download_content_styling',
             type: 'font'
             }
             }*/
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '',
            //style = (attrs.style!='image' ? 'icon' : attrs.style) || 'icon',
                style = '',
                field = style == 'image' ? 'image' : 'icon',
                attrs_str = '';

            $('.op-multirow').each(function (i, multirow) {
                var selectedPackages = [];
                $(multirow).find('.field-packages input[type="checkbox"]').each(function (i, item) {
                    if ($(item).is(':checked')){
                        selectedPackages.push($(item).val());
                    }
                });
                attrs.elements[i].packages = selectedPackages.join(',');
            });

            for(var i in attrs.elements){
                if (!attrs.elements.hasOwnProperty(i)) {
                    continue;
                }
                var v = attrs.elements[i],
                    q = encodeURIComponent(v.title || ''),
                    a = encodeURIComponent(v.content || ''),
                    file = v.file || '',
                    pack = v.packages || '',
                    level = v.level || '',
                    ic = v[field] || '',
                    bg = v.bg_color || '',
                    new_window = v.new_window || '',
                    hide_alert = v.hide_alert || '';
                str += '[download title="'+q.replace( /"/ig,"'")+'" '+field+'="'+ic+'" icon_folder="' + op_asset_settings.attributes.step_2.elements.multirow.attributes.icon.asset[1] + '" file="'+file+'" package="'+pack+'" level="'+level+'" new_window="' +  new_window + '" hide_alert="' +  hide_alert + '"]'+a+'[/download]';
            }
            /*$.each(['font','content_font'],function(i,v){
             $.each(attrs[v],function(i2,v2){
             if(v2 != ''){
             attrs_str += ' '+v+'_'+i2+'="'+v2.replace(/"/ig,"'")+'"';
             }
             });
             });*/
            str = '[membership_download style="'+attrs.style+'"]'+str+'[/membership_download]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var features = attrs.download || {},
                add_link = steps[1].find('.field-id-op_assets_core_membership_download_elements a.new-row'),
                feature_inputs = steps[1].find('.field-id-op_assets_core_membership_download_elements-multirow-container'),
                style = attrs.attrs.style;
            attrs = attrs.attrs;
            OP_AB.set_selector_value('op_assets_core_membership_download_style_container',(style || ''));
            OP_AB.set_font_settings('font',attrs,'op_assets_core_membership_download_font');
            OP_AB.set_font_settings('content_font',attrs,'op_assets_core_membership_download_content_font');
            $.each(features,function(i,v){
                add_link.trigger('click');
                var cur = feature_inputs.find('.op-multirow:last'),
                    attrs = v.attrs || {},
                //input = (cur.find('input:eq(0)').is(':hidden') ? cur.find('input:eq(0)').parents('.field-bg_color').next('.field-image').find('input') : cur.find('input:eq(0)')),
                    uploader = cur.find('.field-file input'),
                    selectLevel = cur.find('.field-level select'),
                    selectPackage = cur.find('select:eq(1)');
                $('#' + selectPackage.attr('id')).val(attrs.package || '');
                $('#' + selectLevel.attr('id')).val(attrs.level || '');
                OP_AB.set_selector_value(cur.find('.op-asset-dropdown').attr('id'),(attrs.icon || ''));
                OP_AB.set_uploader_value(uploader.attr('id'), attrs.file);
                cur.find('.field-title input').val(op_decodeURIComponent(attrs.title));
                cur.find('.field-content textarea').val(op_decodeURIComponent(attrs.content));
                cur.find('.field-new_window input[type="checkbox"]').attr('checked',((attrs.new_window || 'N') == 'Y'));
                cur.find('.field-hide_alert input[type="checkbox"]').attr('checked',((attrs.hide_alert || 'N') == 'Y'));
                cur.find('.field-packages input[type="checkbox"]').each(function (i, item) {
                    if ($.inArray($(item).val(), attrs.package.split(',')) > -1) {
                        $(item).attr('checked', true);
                    }
                });
            });
        }
    };
}(opjq));