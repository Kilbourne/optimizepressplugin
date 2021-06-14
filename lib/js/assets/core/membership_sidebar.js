var cat_options = [], subcat_options = [];
var op_asset_settings = (function($){
	return {
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'previews',
					addClass: 'op-disable-selected'
				}
			},
			step_2: {
				show_children: {
					title: 'membership_sidebar_show_children',
					type: 'checkbox',
					events: {
						change: function(value) {
							if (value.currentTarget.checked) {
								$('.field-show, .field-product, .field-category, .field-subcategory, field-title').hide();
								$('.field-same_level').show();
							} else {
								$('.field-show, .field-product, .field-category, .field-subcategory, field-title').show();
								$('.field-same_level').hide();
							}
						}
					}
				},
				same_level: {
					title: 'membership_sidebar_same_level',
					type: 'checkbox'
				},
				order: {
					title: 'page_listings_sort_order',
					type: 'select',
					values: {'': 'Alphabetically', 'post_title|desc':'Alphabetically reversed', 'post_date|asc':'Published date', 'post_date|desc':'Published date reversed','menu_order|asc':'WordPress order'}
				},
				title: {
					title: 'title',
					showOn: {field:'step_1.style',value:['4', '6', '7', '8', '9', '10']}
				},
				product: {
					title: 'membership_sidebar_product',
					type: 'membership_select',
					values: opMembershipProducts,
					events: {
						change: function(value){
							value = $(value.currentTarget).val();
							if (cat_options.length == 0) {
								$('#op_assets_core_membership_sidebar_category').find('option').each(function() {
									var selected_val;
									if ($(this).attr('selected')) {
										selected_val = $(this).val();
									} else {
										selected_val = '';
									}
									cat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
								});
								$('#op_assets_core_membership_sidebar_subcategory').find('option').each(function() {
									var selected_val;
									if ($(this).attr('selected')) {
										selected_val = $(this).val();
									} else {
										selected_val = '';
									}
									subcat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
								});
							}
							show_member_fields($('#op_assets_core_membership_sidebar_category'), value, 'category', '1', cat_options, subcat_options);
							$('#op_assets_core_membership_sidebar_show_children').trigger('change');
						}
					}
				},
				category: {
					title: 'membership_sidebar_category',
					type: 'membership_select',
					values: opMembershipCategories,
					showOn: {field:'step_2.product',value:showOnProducts},
					events: {
						change: function(value) {
							value = $(value.currentTarget).val();
							show_member_fields($('#op_assets_core_membership_sidebar_subcategory'), value, 'subcategory', '1', cat_options, subcat_options);
							$('#op_assets_core_membership_sidebar_show_children').trigger('change');
						}
					}
				},
				show: {
					title: 'Show',
					type: 'radio',
					values: {'subcategories':'subcategories','content':'content'},
					default_value: 'subcategories',
					showOn: {field:'step_2.product',value:showOnProducts}
				},
				subcategory: {
					title: 'membership_sidebar_subcategory',
					type: 'membership_select',
					values: opMembershipSubCategories,
					showOn: {field:'step_2.category',value:showOnCategories},
					events: {
						change: function(value) {
							valueStr = $(value.currentTarget).val();
							if (valueStr !== '') {
								$('.field-id-op_assets_core_membership_sidebar_show').hide();
							} else {
								if ($('#op_assets_core_membership_sidebar_category').val() != '') {
									$('.field-id-op_assets_core_membership_sidebar_show').show();
								}
							}
							$('#op_assets_core_membership_sidebar_show_children').trigger('change');
						}
					}
				}
			},
			step_3: {
				font: {
					title: 'membership_sidebar_title_styling',
					type: 'font'
				},
				content_font: {
					title: 'membership_sidebar_content_styling',
					type: 'font'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true}
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
		if (el.selector == '#op_assets_core_membership_sidebar_category') {
			$('#op_assets_core_membership_sidebar_category').trigger('change');
		}
	};
}(opjq));