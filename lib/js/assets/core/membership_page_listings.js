var cat_options = [], subcat_options = [];
var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-page-listings.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-page-listing.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-membership-page-listing.mp4',
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
				show_children: {
					title: 'page_listings_show_children',
					type: 'checkbox',
					events: {
						change: function(value) {
							if (value.currentTarget.checked) {
								$('.field-comments, .field-product, .field-category, .field-subcategory, .field-title, .field-drip_content, .field-columns').hide();
							} else {
								$('.field-comments, .field-product, .field-category, .field-subcategory, .field-title, .field-drip_content, .field-columns').show();
							}
						}
					}
				},
				order: {
					title: 'page_listings_sort_order',
					type: 'select',
					values: {'': 'Alphabetically', 'post_title|desc':'Alphabetically reversed', 'post_date|asc':'Published date', 'post_date|desc':'Published date reversed', 'menu_order|asc':'WordPress order'}
				},
				columns: {
					title: 'membership_page_listings_columns',
					type: 'select',
					values: {'1':'1', '2':'2', '3':'3', '4':'4'}
				},
				product: {
					title: 'membership_sidebar_product',
					type: 'membership_select',
					values: opMembershipProducts,
					events: {
						change: function(value){
							value = $(value.currentTarget).val();
							if (cat_options.length == 0) {
								$('#op_assets_core_membership_page_listings_category').find('option').each(function() {
									var selected_val;
									if ($(this).attr('selected')) {
										selected_val = $(this).val();
									} else {
										selected_val = '';
									}
									cat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
								});
								$('#op_assets_core_membership_page_listings_subcategory').find('option').each(function() {
									var selected_val;
									if ($(this).attr('selected')) {
										selected_val = $(this).val();
									} else {
										selected_val = '';
									}
									subcat_options.push({value: $(this).val(), text: $(this).text(), parent: $(this).attr('class'), selected: selected_val});
								});
							}
							show_member_fields($('#op_assets_core_membership_page_listings_category'), value, 'category', '1', cat_options, subcat_options);
						}
					}
				},
				category: {
					title: 'membership_sidebar_category',
					type: 'membership_select',
					values: opMembershipCategories,
					//showOn: {field:'step_2.product',value:showOnProducts},
					events: {
						change: function(value) {
							value = $(value.currentTarget).val();
							show_member_fields($('#op_assets_core_membership_page_listings_subcategory'), value, 'subcategory', '1', cat_options, subcat_options);
						}
					}
				},
				subcategory: {
					title: 'membership_sidebar_subcategory',
					type: 'membership_select',
					values: opMembershipSubCategories,
					//showOn: {field:'step_2.category',value:showOnCategories},
				},
				comments: {
					title: 'show_comments',
					type: 'checkbox'
				},
				drip_content: {
					title: 'show_drip_content',
					type: 'checkbox',
					showOn: {field:'step_2.opm',value:'1'}
				},
				hide_description: {
					title: 'hide_description',
					type: 'checkbox'
				},
				opm: {
					type: 'hidden',
					default_value: OPMActivated,
					events: {
						change: function(e) {
							e.currentTarget.value = OPMActivated;
						}
					}
				}
			},
			step_3: {
				font: {
					title: 'page_listings_title_styling',
					type: 'font'
				},
				content_font: {
					title: 'page_listings_content_styling',
					type: 'font'
				},
				resize_thumb_height: {
					title: 'page_listings_resize_thumb_height',
					type: 'checkbox'
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
		if (el.selector == '#op_assets_core_membership_page_listings_category') {
			$('#op_assets_core_membership_page_listings_category').trigger('change');
		}
	};
}(opjq));
