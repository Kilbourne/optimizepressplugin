var op_asset_settings = (function($){
    var cat_options = [], subcat_options = [];
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-live-search.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-live-search.mp4',
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
                all_pages: {
                    title: 'live_search_all_pages',
                    type: 'checkbox',
                    events: {
                        change: function(value) {
                            if (value.currentTarget.checked) {
                                $('.field-show, .field-product, .field-category, .field-subcategory').hide();
                            } else {
                                $('.field-show, .field-product, .field-category, .field-subcategory').show();
                            }
                        }
                    }
                },
                placeholder: {
                    title: 'live_search_placeholder'
                },
                product: {
                    title: 'live_search_product',
                    type: 'membership_select',
                    values: opMembershipProducts,
                    events: {
                        change: function(value){
                            value = $(value.currentTarget).val();
                            if (cat_options.length == 0) {
                                $('#op_assets_core_live_search_category').find('option').each(function() {
                                    var selected_val;
                                    if ($(this).attr('selected')) {
                                        selected_val = $(this).val();
                                    } else {
                                        selected_val = '';
                                    }
                                    cat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
                                });
                                $('#op_assets_core_live_search_subcategory').find('option').each(function() {
                                    var selected_val;
                                    if ($(this).attr('selected')) {
                                        selected_val = $(this).val();
                                    } else {
                                        selected_val = '';
                                    }
                                    subcat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
                                });
                            }
                            show_member_fields($('#op_assets_core_live_search_category'), value, 'category', '1', cat_options, subcat_options);
                            $('#op_assets_core_live_search_show_children').trigger('change');
                        }
                    }
                },
                category: {
                    title: 'live_search_category',
                    type: 'membership_select',
                    values: opMembershipCategories,
                    showOn: {field:'step_2.product',value:showOnProducts},
                    events: {
                        change: function(value) {
                            value = $(value.currentTarget).val();
                            show_member_fields($('#op_assets_core_live_search_subcategory'), value, 'subcategory', '1', cat_options, subcat_options);
                            $('#op_assets_core_live_search_show_children').trigger('change');
                        }
                    }
                },
                subcategory: {
                    title: 'live_search_subcategory',
                    type: 'membership_select',
                    values: opMembershipSubCategories,
                    showOn: {field:'step_2.category',value:showOnCategories},
                    events: {
                        change: function(value) {
                            valueStr = $(value.currentTarget).val();
                            if (valueStr !== '') {
                                $('.field-id-op_assets_core_live_search_show').hide();
                            } else {
                                if ($('#op_assets_core_live_search_category').val() != '') {
                                    $('.field-id-op_assets_core_live_search_show').show();
                                }
                            }
                            $('#op_assets_core_live_search_show_children').trigger('change');
                        }
                    }
                }
            }
        },
        insert_steps: {2:true}
    };

    function show_member_fields(el, id, what, clean, cat_options, subcat_options) {
        el.empty();
        if (what == 'category') {
            el.append(
                $('<option>').text('').val('')
            );

            $.each(cat_options, function(i) {
                var option = cat_options[i];
                if(option.parent === 'parent-' + id) {
                    if (option.selected != '') {
                        el.append(
                                $('<option>').text(option.text).val(option.value).attr('selected', true)
                            );
                    } else {
                        el.append(
                            $('<option>').text(option.text).val(option.value)
                        );
                    }
                }
            });
        } else {
            el.append(
                $('<option>').text('').val('')
            );
            $.each(subcat_options, function(i) {
                var option = subcat_options[i];
                if(option.parent === 'parent-' + id) {
                    if (option.selected != '') {
                        el.append(
                                $('<option>').text(option.text).val(option.value).attr('selected', true)
                            );
                    } else {
                        el.append(
                            $('<option>').text(option.text).val(option.value)
                        );
                    }
                }
            });
        }
        if (typeof clean === 'undefined') {
            el.val('');
        }
        if (el.selector == '#op_assets_core_live_search_category') {
            $('#op_assets_core_live_search_category').trigger('change');
        }
    }
}(opjq));