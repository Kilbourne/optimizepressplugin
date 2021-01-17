var op_asset_settings = (function($) {

    var style_has_pricing_description = ['4', '5', '6', '7', '8'];
    var style_has_feature_description = ['4', '5', '6', '7', '8'];

    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-pricing-table.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-pricing-table.mp4',
                width: '600',
                height: '341',

            }
        },
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: '',
                    addClass: 'op-disable-selected',
                    events: {
                        change: function(value, steps) {
                            /**
                             * We are hiding most popular text input for styles 1 and 2
                             * to avoid customer confusion
                             */
                            var most_popular_checkboxes = steps[1].find("input[id$='_most_popular']");

                            if (value > '2') {
                                $.each(most_popular_checkboxes, function() {
                                    var input = $(this).parent().parent().next();
                                    if ($(this).is(':checked')) input.show();
                                    else input.hide();
                                });
                            } else {
                                 $.each(most_popular_checkboxes, function() {
                                    var input = $(this).parent().parent().next();
                                    input.hide();
                                });
                            }
                        }
                    }
                }
            },
            step_2: {
                children: {
                    type: 'multirow',
                    multirow: {
                        link_prefix: 'column',
                        attributes: {
                            type: {
                                type: 'hidden',
                                default_value: 'column'
                            },
                            title: {
                                title: 'title',
                                type: 'input',
                                default_value: 'Column Title',
                                events: {
                                    change: function() {
                                        var multi = $(this).closest('.op-multirow'),
                                            cont = multi.parent(),
                                            idx = cont.find('.op-multirow').index(multi);
                                        cont.find('.op-multirow-children li a:eq(' + idx + ')').text($(this).val());
                                    },
                                    keyup: function() {
                                        $(this).trigger('change');
                                    }
                                },
                                trigger_events: 'change'
                            },
                            price: {
                                title: 'price',
                                type: 'input',
                                default_value: '0.00'
                            },
                            pricing_unit: {
                                title: 'pricing_unit',
                                type: 'input',
                                default_value: '$'
                            },
                            pricing_variable: {
                                title: 'pricing_variable',
                                type: 'input',
                                default_value: ''
                            },
                            order_button_text: {
                                title: 'order_button_text',
                                type: 'input'
                            },
                            order_button_url: {
                                title: 'order_button_url',
                                type: 'input'
                            },
                            package_description: {
                                title: 'package_description',
                                type: 'wysiwyg'
                            },
                            most_popular: {
                                title: 'most_popular',
                                type: 'checkbox',
                                events: {
                                    change: function() {
                                        var style = $('#op_assets_core_pricing_table_style_container .op-asset-dropdown-list').find('.selected img').attr('alt');

                                        if (style == '1' || style == '2') {
                                            return;
                                        }

                                        var input = $(this).parent().parent().next();
                                        if ($(this).is(':checked')) input.show();
                                        else input.hide();
                                    }
                                }
                            },
                            most_popular_text: {
                                title: 'most_popular_text',
                                type: 'input'
                            },
                            items: {
                                title: 'package_features',
                                type: 'multirow',
                                multirow: {
                                    remove_row: 'after',
                                    attributes: {
                                        type: {
                                            type: 'hidden',
                                            default_value: 'feature'
                                        },
                                        feature_title: {
                                            title: 'feature_title',
                                            type: 'input'
                                        }
                                    }
                                }
                            },
                        },
                        onAdd: function(e) {
                            // Add event to click handler for button that will remove the op-multirow class
                            // This is necessary as the class breaks the column selector
                            $(this).find('.field-items .new-row').click(function() {
                                $(this).parent().prev().find('div').each(function() {
                                    if ($(this).hasClass('op-multirow')) $(this).removeClass('op-multirow').addClass('op-feature-title-row');
                                });
                            });

                            // Trigger the change event to update the column name in the column selector
                            $(this).find('.op-multirow:last :input[type="text"]').trigger('change');

                            // Hide the most popular text field and set checkbox to unchecked by default
                            $(this).find('.field-most_popular_text').hide().prev().find('.checkbox-container input').prop('checked', false);

                            // We need to manually trigger click on the selected style to show/hide fields for the current multirow
                            $('#op_assets_core_pricing_table_style_container').find('.op-asset-dropdown-list a.selected').trigger('click');
                        }
                    }
                }
            }
        },
        /*
        onGenerateComplete: function() {
            // bind on dialog click event:
            //      check if parent is pricing table
            //      check if trget is addnewrow or target is remove row
            //          do stuff

            // do not allow more than {mrowcount} columns
            var container = $('#op_asset_browser_slide3 .op-settings-core-pricing_table.settings-container')
            var addnewrow = $(container).find('.field-id-op_assets_core_pricing_table_children > .new-row');
            var mrowcount = 5;

            $(container)
                .unbind('click.opnewrow')
                .on('click.opnewrow', function(e) {
                    var elclick = false
                        || $(e.target).is(addnewrow)
                        || $(e.target).is('.remove-row') && $(e.target).parent().is('.op-multirow')
                        || $(e.target).is('img') && $(e.target).parent().is('.remove-row') && $(e.target).parent().parent().is('.op-multirow');

                    if (elclick) {
                        addnewrow.removeClass('disabled').addClass($(container).find('.field-id-op_assets_core_pricing_table_children-multirow-container > .op-multirow').length >= mrowcount ? 'disabled' : 'temp').removeClass('temp');
                        if ($(addnewrow).hasClass('disabled')) $(addnewrow).blur();
                    }
                });
        },
        */
        insert_steps: { 2: true },
        customInsert: function(attrs) {
            var result = '',
                total = attrs.children.length,
                style = (attrs.style || 1);

            // add feature to column (child to child)
            var children = [];
            for (var i = 0; i < attrs.children.length; i++) {
                if (attrs.children[i] === undefined) {
                    continue;
                } else if (attrs.children[i].type == 'column') {
                    children.push(attrs.children[i]);
                    children[children.length - 1].items = '';
                } else if (attrs.children[i].type == 'feature') {
                    children[children.length - 1].items += '<li>' + encodeURIComponent(attrs.children[i].title) + '</li>';
                }
            }

            // loop children
            for (var i = 0; i < children.length; i++) {
                if (children[i] === undefined) {
                    continue;
                }

                // child shortcode
                result += '' + '[op_pricing_table_child' + ' style="' + style + '"' + ' total="' + total + '"' + ' title="' + encodeURIComponent(children[i].title || '').replace(/"/ig, "'") + '"' + ' price="' + encodeURIComponent(children[i].price || '') + '"' + ' pricing_unit="' + encodeURIComponent(children[i].pricing_unit || '') + '"' + ' pricing_variable="' + encodeURIComponent(children[i].pricing_variable || '') + '"' + ' most_popular="' + encodeURIComponent(children[i].most_popular || '') + '"' + ' most_popular_text="' + encodeURIComponent(children[i].most_popular_text) + '"' + ' order_button_text="' + encodeURIComponent(children[i].order_button_text || '') + '"' + ' order_button_url="' + encodeURIComponent(children[i].order_button_url || '') + '"' + ' package_description="' + encodeURIComponent(children[i].package_description || '') + '"' + ' items="' + (children[i].items || '') + '"' + ']' + '[/op_pricing_table_child]';
            };

            // wrap shortcode
            result = '[op_pricing_table style="' + style + '"]' + result + '[/op_pricing_table]';

            // dialog
            OP_AB.insert_content(result);
            $.fancybox.close();

        },
        customSettings: function(attrs, steps) {
            var style = attrs.attrs.style,
                children = attrs.op_pricing_table_child || attrs.tab || [],
                container = steps[1].find('.field-id-op_assets_core_pricing_table_children-multirow-container');

            // set the style
            OP_AB.set_selector_value('op_assets_core_pricing_table_style_container', style || '');

            // iterate between the columns and set the proper settings
            for (var i = 0; i < children.length; i++) {
                // add new column
                steps[1].find('.field-id-op_assets_core_pricing_table_children a.new-row').trigger('click');

                var value = children[i].attrs;
                var parent = container.find('.op-multirow:last')
                var input = parent.find('input');

                // set input values
                input.filter('[id$="_title"]').val(op_decodeURIComponent(value.title || ''));
                input.filter('[id$="_price"]').val(op_decodeURIComponent(value.price || ''));
                input.filter('[id$="_pricing_unit"]').val(op_decodeURIComponent(value.pricing_unit || ''));
                input.filter('[id$="_pricing_variable"]').val(op_decodeURIComponent(value.pricing_variable || ''));
                input.filter('[id$="_order_button_text"]').val(op_decodeURIComponent(value.order_button_text || ''));
                input.filter('[id$="_order_button_url"]').val(op_decodeURIComponent(value.order_button_url || ''));

                // most popular
                if (value.most_popular == 'Y') {
                    input.filter('[id$="_most_popular"]').trigger('click');
                    input.filter('[id$="_most_popular_text"]').val(op_decodeURIComponent(value.most_popular_text || ''));
                }

                // set wysiwyg content
                (function(id, content) {
                    if (!id) {
                        return;
                    }
                    OP_AB.set_wysiwyg_content(id, op_wpautop(op_decodeURIComponent(content || '')));
                    // setTimeout(function() {
                    //     switchEditors.go(id, 'tmce');
                    //     var ed = tinyMCE.get(id);

                    //     if (ed) {
                    //         // this throws error on dialog close -> please fix it!
                    //         ed.setContent(op_wpautop(op_decodeURIComponent(content || '')),{ no_events: true });
                    //     }
                    // });
                }(parent.find('[id$="_package_description"]').attr('id'), value.package_description));

                // iterate through all the items in the features list and add defaults
                $('<ul>' + (op_decodeURIComponent(value.items) || '') + '</ul>').find('li').each(function() {
                    parent.find('a.new-row').trigger('click');
                    parent.find('input[id$="_feature_title"]:last').val($(this).text());
                });
            }
        }
    };
})(opjq);
