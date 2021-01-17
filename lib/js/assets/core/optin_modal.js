var op_asset_settings = (function($){
	var tmp_obj, hdn_elems = {}, input_elems = {}, disable_focus = false,
		no_name_styles = [0],
		no_content_styles = [0],
		text_button_styles = [0],
		cp_styles = [0],
		lists = {};
	tmp_obj = $('<div />');
	return {
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'previews',
					addClass: 'op-disable-selected',
					events: {
						change: function(value){
							var el = $('#op_assets_core_optin_modal_tabs_submit_button_button_content'),
								val1 = 'Submit', val2 = 'Get Instant Access!', cur = el.val(),
								els = 'div.field-id-op_assets_core_optin_modal_tabs_form_html_disable_name,\
div.field-id-op_assets_core_optin_modal_tabs_form_html_name,\
div.field-input field-id-op_assets_core_optin_modal_tabs_content_name_default',
								els2 = 'div.field-id-op_assets_core_optin_modal_tabs_content_headline,\
div.field-id-op_assets_core_optin_modal_tabs_content_paragraph',
								$selected_style = $('#op_asset_browser_slide2').find('.selected'),
								style = parseInt($selected_style.find('img').attr('alt')),
								$top_color = $('#op_asset_browser_slide3 .field-top_color');

							$(els).css('display',(($.inArray(value,no_name_styles) < 0)?'block':'none'));
							$(els2).css('display',(($.inArray(value,no_content_styles) < 0)?'block':'none'));
							if(el.val() == ''){
								el.val(value == 1 ? 'Submit' : 'Get Instant Access!');
							} else {
								el.val(value == 1 ? (cur==val2?'Submit':cur) : (cur==val1?'Get Instant Access!':cur));
							}

							if (style==18) $top_color.show(); else $top_color.hide().find('input').val('').next('a').css({ backgroundColor: 'none' });

							/*
							 * Disabling button styles/types depending on style selected here
							 */
							var $buttonTypeItems = $('#op_assets_core_optin_modal_tabs_submit_button_button_type_container .op-asset-dropdown-list li');
							if (style === 1) {
								$buttonTypeItems.slice(1).hide();
								/*
								 * We need to select first item in case that user went back through the flow
								 */
								var $firstItem = $('#op_assets_core_optin_modal_tabs_submit_button_button_type_container .op-asset-dropdown-list li:first a');
								$firstItem.trigger('click');
								/*
								 * We also need to manually move selected item HTML markup
								 */
								var $selectedItem = $('#op_assets_core_optin_modal_tabs_submit_button_button_type_container .selected-item');
								$selectedItem.html($firstItem.html());
							} else {
								$buttonTypeItems.show();
							}

							/*
							 * Adding optin style information to hidden element that will be used in generating option style based class name (for limiting width/height of a button)
							 */
							var optinStyle = 'optin_modal_style_' + style;
							$('#op_assets_core_optin_modal_tabs_submit_button_location').val(optinStyle);
							$('#op_assets_core_optin_modal_tabs_submit_button_button_preview_container #op_button_preview').addClass(optinStyle);
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
									defaultValue: 'custom',
									values: function () {
										var options = [];

										options['email'] = 'Email data';
										options['custom'] = 'Custom form';

										/*
										 * Fetching enabled email marketing service providers
										 */
										$.ajax({
											type: 'POST',
											url: OptimizePress.ajaxurl,
											data: {'action': OptimizePress.SN+'-email-provider-list'},
											success: function(response){
												$.each(response.providers, function (key, value) {
													options[key] = value;
												});
											},
											dataType: 'json',
											async: false
										});

										return options;
									}(),
									events: {
										change: function(e) {
											var $name = $('.field-id-op_assets_core_optin_modal_tabs_form_html_name');
											$name.show();
											$name.prev().show();
											var integrationType = e.currentTarget.value;
											switch (integrationType) {
												case 'email':
													$name.hide();
													$name.prev().hide();
													break;
												case 'custom':
													break;
												case 'aweber':
													$name.hide();
													$name.prev().hide();
												case 'infusionsoft':
												case 'icontact':
												case 'mailchimp':
												case 'getresponse':
													/*
													 * Showing loading graphics
													 */
													var $select = $('#op_assets_core_optin_modal_tabs_form_html_list');
													$select.empty().after('<img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="loading" style="position:relative;display:block;top:4px">');
													$.post(OptimizePress.ajaxurl,
														{
															'action': OptimizePress.SN+'-email-provider-details',
															'provider': integrationType
														},
														function(response){
															lists = response.lists;
															// switch (integrationType) {
															// 	case 'infusionsoft':
															// 	case 'aweber':
															// 	case 'icontact':
															// 	case 'mailchimp':
															// 	case 'getresponse':
																	var options = [];
																	$.each(response.lists, function (id, list) {
																		options.push($('<option/>', {value: id, text: list.name}));
																	});
																	$select.empty().append(options);
															// 		break;
															// }
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
														},
														'json'
													);
													break;
											}
										}
									}
								},
								/*
								 * MailChimp
								 */
								list: {
									title: 'provider_list',
									type: 'select',
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'aweber', 'infusionsoft', 'icontact', 'getresponse']},
									events: {
										change: function(e) {
											input_elems = {};
											if (typeof lists[e.currentTarget.value] != 'undefined') {
												input_elems = lists[e.currentTarget.value].fields;
											}
											/*
											 * Infusionsoft action page attribute
											 */
											if (typeof lists[e.currentTarget.value] != 'undefined'
											&& typeof lists[e.currentTarget.value].action != 'undefined') {
												$('#op_assets_core_optin_modal_tabs_form_html_action_page').val(lists[e.currentTarget.value].action);
											}
											/*
											 * Infusionsoft hidden form params
											 */
											if (typeof lists[e.currentTarget.value] != 'undefined'
											&& typeof lists[e.currentTarget.value].hidden != 'undefined') {
												hdn_elems = lists[e.currentTarget.value].hidden;
											}
											var options = [];
											$.each(input_elems, function(id, value) {
												options.push($('<option/>', {value: id, text: value}));
											});
											var $name = $('#op_assets_core_optin_modal_tabs_form_html_name');
											$name.empty().append(options);

											/*
											 * Selecting previously selected value (if editing)
											 */
											if (typeof $name.attr('data-default') != 'undefined') {
												$name.val($name.attr('data-default'));
											}
										}
									}
								},
								thank_you_page: {
									title: 'thank_you_page_url',
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['mailchimp', 'aweber', 'icontact', 'getresponse']}
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
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email']}
								},
								redirect_url: {
									title: 'redirect_url',
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email']}
								},
								html: {
									title: 'form_html',
									type: 'textarea',
									events: {
										change: change_html,
										keyup: function(){
											$(this).trigger('change');
										}
									},
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom']}
								},
								new_window: {
									title: 'new_window',
									type: 'checkbox',
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email', 'custom']}
								},
								disable_name: {
									title: 'disable_name',
									type: 'checkbox',
									events: {
										change: function(){
											func = 'block';
											if($(this).is(':checked')){
												func = 'none';
											}

											$('.field-id-op_assets_core_optin_modal_tabs_content_name_default').css('display',func);
											if($('#op_assets_core_optin_modal_tabs_form_html_email_data').is(':checked')){
												func = 'none';
											}
											$('.field-id-op_assets_core_optin_modal_tabs_form_html_name').css('display',func);
										}
									},
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['email', 'custom', 'mailchimp', 'aweber', 'infusionsoft', 'icontact', 'getresponse']}
								},
								name: {
									title: 'name',
									type: 'select',
									values: {},
									events: {
										change: function(){
											// change_select($(this),'name');
										}
									},
									showOn: {field:'step_1.style',value:['2','3','7','8','11','12','13','14'],idprefix:'op_assets_core_optin_modal_',type:'style-selector'}
								},
								email: {
									title: 'email',
									type: 'select',
									values: {'left': 'Left', 'center': 'Center', 'right': 'Right'},
									events: {
										change: function(){
											change_select($(this),'email');
										}
									},
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom']}
								},
								method: {
									title: 'method',
									type: 'select',
									values: {'post':'POST','get':'GET'},
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom']}
								},
								action: {
									title: 'form_url',
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom']}
								},
								email_data_fields: {
									title: 'extra_fields',
									type: 'multirow',
									multirow: {
										attributes: {
											title: {
												title: 'text'
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
												removeCf: true
											}
										},
										onAdd: function(steps){
											this.find('select').trigger('change');
											multirow_dropdown(steps);
										}
									},
									showOn: {field:'step_2.tabs.tabs.form_html.fields.integration_type',value:['custom', 'mailchimp', 'aweber', 'infusionsoft', 'icontact', 'getresponse']}
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
									showOn: {field:'step_1.style',value:['2','3','7','8'],idprefix:'op_assets_core_optin_modal_',type:'style-selector'}*/
								},
								email_default: {
									title: 'email_default',
									default_value: 'Enter your email address'
								},
								top_color: {
									title: 'top_color',
									type: 'color'
								},
								link_title: {
									title: 'link_title',
									default_value: 'Click here for popup'
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
									showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_modal_tabs_submit_button_', value:'7'}
								},
								button_content: {
									title: 'text',
									showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_modal_tabs_submit_button_', value:'0'}
								},
								button_preview: {
									title: '',
									type: 'button_preview',
									folder: 'presets',
									selectorClass: 'icon-view-128',
									showSubtext: false,
									showShine: false,
									showGradient: false,
									addClass: 'optin_modal',
									showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_modal_tabs_submit_button_', value:'1'}
								},
								location: {
									type: 'hidden'
								},
								left_column: {
									type: 'column',
									addClass: 'left_column',
									showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_modal_tabs_submit_button_', value:'1'},
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
									showOn: {field:'step_2.tabs.tabs.submit_button.fields.button_type', idprefix:'op_assets_core_optin_modal_tabs_submit_button_', value:'1'},
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
									showOn: {field: 'step_1.style', value: text_button_styles, idprefix:'op_assets_core_optin_modal_', type:'style-selector'}
								}
							}
						}
					}
				}
			},
			step_3: {
				microcopy: {
					text: 'optin_modal_advanced1',
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
				link_title: attrs.tabs.content.link_title,
				privacy: attrs.tabs.content.privacy,
				paragraph: attrs.tabs.content.paragraph,
				headline: attrs.tabs.content.headline
			};
			attrs = attrs.tabs;
			$.extend(nattrs,{
				action: attrs.form_html.action,
				new_window: attrs.form_html.new_window,
				disable_name: attrs.form_html.disable_name,
				method: attrs.form_html.method,
				//submit: attrs.content.submit,
				email_field: attrs.form_html.email,
				email_default: attrs.content.email_default,
				top_color: attrs.content.top_color,
				integration_type: attrs.form_html.integration_type
			});

			var elems = ['headline','paragraph','privacy'],
				str = '',
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
						name_default: attrs.content.name_default
					});
					/*
					 * Custom fields
					 */
					var counter = 1;
					$.each(attrs.form_html.email_data_fields,function(i,v){
						if(v.title != ''){
							nattrs['extra_field_'+counter] = v.title;
							counter++;
						}
					});
					break;
				case 'custom':
					/*
					 * Taking care of styles that have no "name" field
 					 */
					if(($.inArray(nattrs.style,no_name_styles) < 0) && nattrs.disable_name == ''){
						nattrs['name_field'] = attrs.form_html.name;
						used_fields.push(nattrs.name_field);
						nattrs['name_default'] = attrs.content.name_default;
					}

					/*
					 * Custom fields
					 */
					var counter = 1;
					$.each(attrs.form_html.extra_fields,function(i,v){
						var name = '';
						if(v.field_name != '' && v.field_name != 'op_add_new_field'){
							name = v.field_name;
						} else if(v.title != ''){
							name = v.title;
						}
						if(name != ''){
							nattrs['extra_field_'+counter+'_name'] = name;
							nattrs['extra_field_'+counter+'_title'] = v.text;
							used_fields.push(name);
							counter++;
						}
					});
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
							field_str += '[optin_modal_hidden]'+hdn_str+'[/optin_modal_hidden]';
						}
					}
					field_str += '[optin_modal_code]<div style="display:none">'+attrs.form_html.html+'</div>[/optin_modal_code]';

					break;
				case 'infusionsoft':
					nattrs = $.extend(nattrs, {
						thank_you_page: attrs.form_html.thank_you_page,
						list: attrs.form_html.list,
						email_field: 'inf_field_Email',
						name_field: attrs.form_html.name,
						name_default: attrs.content.name_default,
						action_page: attrs.form_html.action_page
					});
					/*
					 * Custom fields
					 */
					var counter = 1;
					$.each(attrs.form_html.extra_fields,function(i,v){
						var name = '';
						if(v.field_name != '' && v.field_name != 'op_add_new_field'){
							name = v.field_name;
						} else if(v.title != ''){
							name = v.title;
						}
						if(name != ''){
							nattrs['extra_field_'+counter+'_name'] = name;
							nattrs['extra_field_'+counter+'_title'] = v.text;
							used_fields.push(name);
							counter++;
						}
					});
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
							field_str += '[optin_modal_hidden]'+hdn_str+'[/optin_modal_hidden]';
						}
					}
					break;
				case 'icontact':
				case 'mailchimp':
					nattrs = $.extend(nattrs, {
						thank_you_page: attrs.form_html.thank_you_page,
						list: attrs.form_html.list,
						email_field: 'email',
						name_field: attrs.form_html.name,
						name_default: attrs.content.name_default
					});
					/*
					 * Custom fields
					 */
					var counter = 1;
					$.each(attrs.form_html.extra_fields,function(i,v){
						var name = '';
						if(v.field_name != '' && v.field_name != 'op_add_new_field'){
							name = v.field_name;
						} else if(v.title != ''){
							name = v.title;
						}
						if(name != ''){
							nattrs['extra_field_'+counter+'_name'] = name;
							nattrs['extra_field_'+counter+'_title'] = v.text;
							used_fields.push(name);
							counter++;
						}
					});
					break;
				case 'aweber':
				case 'getresponse':
					nattrs = $.extend(nattrs, {
						thank_you_page: attrs.form_html.thank_you_page,
						list: attrs.form_html.list,
						email_field: 'email',
						name_field: 'name',
						name_default: attrs.content.name_default
					});
					/*
					 * Custom fields
					 */
					var counter = 1;
					$.each(attrs.form_html.extra_fields,function(i,v){
						var name = '';
						if(v.field_name != '' && v.field_name != 'op_add_new_field'){
							name = v.field_name;
						} else if(v.title != ''){
							name = v.title;
						}
						if(name != ''){
							nattrs['extra_field_'+counter+'_name'] = name;
							nattrs['extra_field_'+counter+'_title'] = v.text;
							used_fields.push(name);
							counter++;
						}
					});
					break;
			}

			$.each(nattrs,function(i,v){
				if(v !== null && v != ''){
					str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
				}
			});
			str = '[optin_modal'+str+']'+field_str;

			$.each(elems,function(i,v){
				if(v !== null){
					var val = attrs.content[v] || '';
					str += '[optin_modal_field name="'+v+'"]'+val+'[/optin_modal_field]';
				}
			});

			//Add the color option to the string
			str += '[optin_modal_field name="top_color"]' + $('#op_assets_core_optin_modal_tabs_content_top_color').find('option:selected').val() + '[/optin_modal_field]';

			str += button_str(attrs.submit_button);
			str += '[/optin_modal]';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			var val = attrs.optin_modal_code || [{attrs:{content:''}}],
				boxprefix = 'op_assets_core_optin_modal_',
				idprefix = boxprefix+'tabs_',
				top_color = ((attrs.attrs.top_color=='undefined') ? '' : attrs.attrs.top_color),
				link_title = attrs.attrs.link_title
			$('#'+idprefix+'form_html_html').val($(val[0].attrs.content).html()).trigger('change');
			val = attrs.optin_modal_field || [];
			$.each(val,function(i,v){
				var content = v.attrs.content;
				if(v.attrs.name == 'paragraph'){
					//if (typeof(content)!=undefined) content = OP_AB.unautop(content);
					OP_AB.set_wysiwyg_content(idprefix+'content_paragraph',content || '');
				} else {
					$('#'+idprefix+'content_'+v.attrs.name).val(content);
				}
			});

			var button = attrs.optin_modal_button || [{attrs:{}}];
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
							container.find('.op-multirow:last input').val(attrs['extra_field_'+counter]);
							counter++;
						} else {
							break;
						}
					}
					vals = {'integration_type': ['integration_type', 'custom'], 'email_address':['email_address',''], 'redirect_url':['redirect_url','']};
					break;
				case 'custom':
					var add_link = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields a.new-row'),
						container = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields-multirow-container'),
						cur,
						el,
						name, title;
					while(true){
						if(typeof attrs['extra_field_'+counter+'_name'] != 'undefined' && attrs['extra_field_'+counter+'_title'] != 'undefined'){
							name = attrs['extra_field_'+counter+'_name'];
							title = attrs['extra_field_'+counter+'_title'];
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
							counter++;
						} else {
							break;
						}
					}

					var html_block_code_start = attrs.content.indexOf('[optin_modal_code]') + 18,
						html_block_code_end = attrs.content.indexOf('[/optin_modal_code]'),
						html_block = attrs.content.substring(html_block_code_start, html_block_code_end);

					vals = {'integration_type': ['integration_type', 'custom'], 'name':['name_field',attrs.name_field], 'email':['email_field',attrs.email_field], 'method':['method','post'], 'action':['action',attrs.action], 'new_window':['new_window', attrs.new_window], 'disable_name':['disable_name', attrs.disable_name], 'html':['html', html_block]};
					break;
				case 'icontact':
				case 'aweber':
				case 'mailchimp':
				case 'infusionsoft':
				case 'getresponse':
					var add_link = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields a.new-row'),
						container = steps[1].find('.field-id-'+idprefix+'form_html_extra_fields-multirow-container'),
						cur,
						el,
						name, title;
					while(true){
						if(typeof attrs['extra_field_'+counter+'_name'] != 'undefined' && attrs['extra_field_'+counter+'_title'] != 'undefined'){
							name = attrs['extra_field_'+counter+'_name'];
							title = attrs['extra_field_'+counter+'_title'];
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
							counter++;
						} else {
							break;
						}
					}
					vals = {'integration_type': ['integration_type', 'custom'], 'name':['name_field', ''], 'list': ['list', ''], 'thank_you_page': ['thank_you_page', '']};
					break;
			}

			$.each(vals,function(i,v){
				if (i == 'list' || i == 'name') {
					$('#'+idprefix+'form_html_'+i).attr('data-default', attrs[v[0]] || v[1]);
				} else {
					$('#'+idprefix+'form_html_'+i).val(attrs[v[0]] || v[1]);
				}
			});

			OP_AB.set_selector_value(boxprefix+'style_container',attrs.style || '');
			$('#'+idprefix+'form_html_new_window').prop('checked', (vals.new_window[1]=='Y' ? true : false));
			$('#'+idprefix+'form_html_disable_name').prop('checked', (vals.disable_name[1]=='Y' ? true : false));
			$('#'+idprefix+'form_html_integration_type').trigger('change');
			$('#op_assets_core_optin_modal_tabs_form_html_name').val(vals.name[1]);
			$('#op_assets_core_optin_modal_tabs_form_html_email').val(vals.email[1]);
			$('#op_assets_core_optin_modal_tabs_form_html_action').val(vals.action[1]);
			$('#'+idprefix+'content_submit').val(attrs.submit || '');
			$('#'+idprefix+'content_name_default').val(attrs.name_default || '');
			$('#'+idprefix+'content_email_default').val(attrs.email_default || '');
			$('#'+idprefix+'content_top_color').val(top_color).next('a').css({ backgroundColor: top_color });
			$('#'+idprefix+'content_link_title').val(link_title);

			disable_focus = false;

			//Update advanced options
			$('#op_assets_core_optin_modal_width').val(attrs.width);
			$('#op_assets_core_optin_modal_margin_top').val(attrs.margin_top);
			$('#op_assets_core_optin_modal_margin_right').val(attrs.margin_right);
			$('#op_assets_core_optin_modal_margin_bottom').val(attrs.margin_bottom);
			$('#op_assets_core_optin_modal_margin_left').val(attrs.margin_left);
			$('#op_assets_core_optin_modal_alignment').val(attrs.alignment);
		}
	};
	function change_html(e){
		tmp_obj.html($(this).val().replace(/<!--.*-->/g, "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,''));
		hdn_elems = {};
		input_elems = {};
		var $t = $(this).closest('.op-multirow'),
			form = tmp_obj.find('form[action]'),
			email_select = $('#op_assets_core_optin_modal_tabs_form_html_email'),
			name_select = $('#op_assets_core_optin_modal_tabs_form_html_name'),
			action = $('#op_assets_core_optin_modal_tabs_form_html_action'),
			method = $('#op_assets_core_optin_modal_tabs_form_html_method'),
			selects = $('#op_assets_core_optin_modal_tabs_form_html_name,#op_assets_core_optin_modal_tabs_form_html_email');
		method.val('');
		action.val('');
		selects.find('option').remove();
		if(form.length > 0){
			action.val(form.attr('action'));
			method.val((form.attr('method') || 'post').toLowerCase());
			$(':input[name]:not(:button,:submit)',form).each(function(){
				var name = $(this).attr('name'),
					name_selected = name == $t.find('.name_box_selected').val() ? ' selected="selected"' : '',
					email_selected = name == $t.find('.email_box_selected').val() ? ' selected="selected"' : '';
				name_select.append('<option value="'+name+'"'+name_selected+'>'+name+'</option>');
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
			// change_select($('#op_assets_core_optin_modal_tabs_form_html_name'),'name');
			multirow_dropdown(e.data);
		}
	};
	function multirow_dropdown(steps){
		var new_values = '<option value="op_add_new_field">'+OP_AB.translate('add_new_field')+'</option><option value="">-----------------</option>';
		$.each(input_elems,function(i,v){
			new_values += '<option value="'+i+'">'+v+'</option>';
		});
		steps[1].find('.field-id-op_assets_core_optin_modal_tabs_form_html_extra_fields-multirow-container select').each(function(i){
			var current = $(this).find(':selected').attr('value');
			$(this).html(new_values).val(current).trigger('change');
		});
	};
	function change_select(elem,field){
		//var elem2 = $('#op_assets_core_optin_modal_tabs_form_html_'+(field == 'name' ? 'email' : 'name')),
		var elem2 = $('#op_assets_core_optin_modal_tabs_form_html_' + field),
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
			var val = attrs[v] || '';
			val += '';
			if(val != ''){
				str += ' '+i+'="'+val.replace(/"/ig,"'")+'"';
			}
		});
		$.each(append,function(i,v){
			if(v != ''){
				str += ' '+i+'="'+v.replace(/"/ig,"'")+'"';
			}
		});
		str = '[optin_modal_button type="'+attrs.button_type+'"'+str+']'+content+'[/optin_modal_button] ';
		return str;
	};
	function set_button_settings(attrs){
		attrs = attrs.attrs || {};
		var style = attrs.type,
			idprefix = 'op_assets_core_optin_modal_tabs_submit_button_button_';
		OP_AB.set_selector_value(idprefix+'type_container',style);
		switch(style){
			case 'cart':
				OP_AB.set_selector_value(idprefix+'bg_img_cart_container',attrs.bg);
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
			case '2':
				OP_AB.set_selector_value(idprefix+'text_2_container',attrs.text);
				$('#'+idprefix+'bg_color_2').val(attrs.bg || '');
				break;
			case '3':
				$('#'+idprefix+'content').val(attrs.content || '');
				$('#'+idprefix+'color_3').val(attrs.color || '');
				$('#'+idprefix+'size_3').val(attrs.size || '');
				$('#'+idprefix+'border_3').val(attrs.border || '');
				break;
			case '4':
				var text_color = attrs.text_color || 'dark';
				OP_AB.set_selector_value(idprefix+'bg_img_4_container',attrs.bg);
				$('#'+idprefix+'text_4').val(text_color).trigger('change');
				OP_AB.set_selector_value(idprefix+'text_4_'+text_color+'_container',attrs.text || '');
				break;
			case '5':
				$('#'+idprefix+'bg_color_5').val(attrs.bg || '');
				OP_AB.set_selector_value(idprefix+'text_5_container',attrs.text || '');
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
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_text',
						type: 'text'
					},
					text_size: {
						value: 36,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_size',
						type: 'dropdown'
					},
					text_font: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_container',
						type: 'font'
					},
					text_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_color',
						type: 'color'
					},
					text_bold: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1 .op-font-style-bold',
						type: 'checkbox'
					},
					text_italic: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1 .op-font-style-italic',
						type: 'checkbox'
					},
					text_underline: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1 .op-font-style-underline',
						type: 'checkbox'
					},
					text_letter_spacing: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_box_letter_spacing_1',
						type: 'slider'
					},
					subtext_panel: {
						value: false,
						selector: '#panel_control_op_assets_core_optin_modal_tabs_submit_button_subtext_box',
						type: 'checkbox'
					},
					subtext: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_text',
						type: 'text'
					},
					subtext_size: {
						value: 14,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_size',
						type: 'dropdown'
					},
					subtext_font: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_container',
						type: 'font'
					},
					subtext_color: {
						value: '#ffffff',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_color',
						type: 'color'
					},
					subtext_bold: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-bold',
						type: 'checkbox'
					},
					subtext_italic: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-italic',
						type: 'checkbox'
					},
					subtext_underline: {
						value: false,
						selector: '.field-id-op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2 .op-font-style-underline',
						type: 'checkbox'
					},
					subtext_letter_spacing: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_subtext_box_letter_spacing_2',
						type: 'slider'
					},
					text_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_core_optin_modal_tabs_submit_button_text_shadow',
						type: 'checkbox'
					},
					text_shadow_vertical: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_shadow_vertical_axis_1',
						type: 'slider'
					},
					text_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_shadow_horizontal_axis_1',
						type: 'slider'
					},
					text_shadow_color: {
						value: '#ffff00',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_shadow_shadow_color_1',
						type: 'color'
					},
					text_shadow_blur: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_text_shadow_blur_radius_1',
						type: 'slider'
					},
					styling_width: {
						value: 60,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_width_1',
						type: 'slider'
					},
					styling_height: {
						value: 30,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_height_1',
						type: 'slider'
					},
					styling_border_size: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_border_size_1',
						type: 'slider'
					},
					styling_border_radius: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_border_radius_1',
						type: 'slider'
					},
					styling_border_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_border_color_1',
						type: 'color'
					},
					styling_border_opacity: {
						value: 100,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_border_opacity_1',
						type: 'slider'
					},
					styling_gradient: {
						value: false,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_1',
						type: 'checkbox'
					},
					styling_shine: {
						value: false,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_shine_1',
						type: 'checkbox'
					},
					styling_gradient_start_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_start_color_1',
						type: 'color'
					},
					styling_gradient_end_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_end_color_2',
						type: 'color'
					},
					drop_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_core_optin_modal_tabs_submit_button_drop_shadow',
						type: 'checkbox'
					},
					drop_shadow_vertical: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_vertical_axis_2',
						type: 'slider'
					},
					drop_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_horizontal_axis_2',
						type: 'slider'
					},
					drop_shadow_blur: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_border_radius_2',
						type: 'slider'
					},
					drop_shadow_spread: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_spread_radius_1',
						type: 'slider'
					},
					drop_shadow_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_shadow_color_2',
						type: 'color'
					},
					drop_shadow_opacity: {
						value: 100,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_opacity_1',
						type: 'slider'
					},
					inset_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_core_optin_modal_tabs_submit_button_inset_shadow',
						type: 'checkbox'
					},
					inset_shadow_vertical: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_vertical_axis_3',
						type: 'slider'
					},
					inset_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_horizontal_axis_3',
						type: 'slider'
					},
					inset_shadow_blur: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_border_radius_3',
						type: 'slider'
					},
					inset_shadow_spread: {
						value: 0,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_spread_radius_2',
						type: 'slider'
					},
					inset_shadow_color: {
						value: '',
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_shadow_color_3',
						type: 'color'
					},
					inset_shadow_opacity: {
						value: 100,
						selector: '#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_opacity_2',
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
						var $item = $(defaults[i].selector + ' img[alt="' + value[0] + '"]');
						/*
						 * If item is not found we display default one (font-family:inherit)
						 */
						if ($item.length == 0) {
							$container.html($(defaults[i].selector + ' .op-asset-dropdown-list li:first a').html());
						} else {
							$container.html($item.parent().html());
						}
						$('#op_asset_browser_slide3 .op-settings-core-optin_modal').trigger({type: 'update_button_preview', tag: 'optin_modal', id: defaults[i].selector.substr(1), value: $item.attr('alt'), font_type: $item.attr('data-type'), font_family: $item.attr('data-family')});
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
				case 'op_assets_core_optin_modal_tabs_submit_button_button_preview_container':
					op_optin_button_presets.switch(value);
					break;
				/*
				 * Text box
				 */
				case 'op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_text':
					var html =  ($('#op_button_preview.pbox_' + e.tag + ' .text').length==0 ? '<span class="text">' + value + '</span>' : value),
						selector = ($('#op_button_preview.pbox_' + e.tag + ' .text').length==0 ? '#op_button_preview.pbox_' + e.tag : '#op_button_preview.pbox_' + e.tag + ' .text');

					$(selector).html(html);
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_size':
					$('#op_button_preview.pbox_' + e.tag + ' .text').css('font-size', value + 'px');
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_container':
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
				case 'op_assets_core_optin_modal_tabs_submit_button_text_box_text_properties_1_color':
					if (value === '') {
						value = '#ffffff';
					}
					$('#op_button_preview.pbox_' + e.tag + ' .text').css('color', value);
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_text_box_letter_spacing_1':
					if (value != 0) {
						$('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', value + 'px');
					} else {
						$('#op_button_preview.pbox_' + e.tag + ' .text').css('letter-spacing', 'normal');
					}
					break;
				/*
				 * Subtext box
				 */
				case 'op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_text':
					var element = $('#op_button_preview.pbox_' + e.tag + ' .subtext');
					element.html(value);
					if (value == '') {
						element.hide();
					} else {
						element.show();
					}
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_size':
					$('#op_button_preview.pbox_' + e.tag + ' .subtext').css('font-size', value + 'px');
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_container':
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
				case 'op_assets_core_optin_modal_tabs_submit_button_subtext_box_text_properties_2_color':
					if (value === '') {
						value = '#ffffff';
					}
					$('#op_button_preview.pbox_' + e.tag + ' .subtext').css('color', value);
					break;
				case 'op[op_assets_core_optin_modal_tabs_submit_button_subtext_box][enabled]':
					if (value == 1) {
						$('#op_button_preview.pbox_' + e.tag + ' .subtext').show();
					} else {
						$('#op_button_preview.pbox_' + e.tag + ' .subtext').hide();
					}
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_subtext_box_letter_spacing_2':
					if (value != 0) {
						$('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', value + 'px');
					} else {
						$('#op_button_preview.pbox_' + e.tag + ' .subtext').css('letter-spacing', 'normal');
					}
					break;
				/*
				 * Text shadow
				 */
				case 'op_assets_core_optin_modal_tabs_submit_button_text_shadow_vertical_axis_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_text_shadow_horizontal_axis_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_text_shadow_blur_radius_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_text_shadow_shadow_color_1':
				case 'op[op_assets_core_optin_modal_tabs_submit_button_text_shadow][enabled]':
					if ($('input[name="op[op_assets_core_optin_modal_tabs_submit_button_text_shadow][enabled]"]').is(':checked')) {
						var vertical_axis = $('#op_assets_core_optin_modal_tabs_submit_button_text_shadow_vertical_axis_1').slider('value');
						var horizontal_axis = $('#op_assets_core_optin_modal_tabs_submit_button_text_shadow_horizontal_axis_1').slider('value');
						var blur_radius = $('#op_assets_core_optin_modal_tabs_submit_button_text_shadow_blur_radius_1').slider('value');
						var shadow_color = $('#op_assets_core_optin_modal_tabs_submit_button_text_shadow_shadow_color_1').val();
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
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_width_1':
					var max = $('#op_assets_core_optin_modal_tabs_submit_button_styling_width_1').slider('option', 'max');
					if (max == value) {
						$('#op_button_preview.pbox_' + e.tag).css('width', '100%');
						$('#output_op_assets_core_optin_modal_tabs_submit_button_styling_width_1').html('100%');
						$('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_optin_modal_tabs_submit_button_styling_height_1').slider('value') + 'px 0');
						return false;
					} else {
						$('#op_button_preview.pbox_' + e.tag).css('width', 'auto');
						$('#op_button_preview.pbox_' + e.tag).css('padding', $('#op_assets_core_optin_modal_tabs_submit_button_styling_height_1').slider('value') + 'px ' + value + 'px');
					}
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_height_1':
					$('#op_button_preview.pbox_' + e.tag).css('padding', value + 'px ' + $('#op_assets_core_optin_modal_tabs_submit_button_styling_width_1').slider('value') + 'px');
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_border_color_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_border_opacity_1':
					var border_opacity = $('#op_assets_core_optin_modal_tabs_submit_button_styling_border_opacity_1').slider('value');
					var border_color = $('#op_assets_core_optin_modal_tabs_submit_button_styling_border_color_1').val();
					if (border_color === '') {
						border_color = '#ffffff';
					}
					$('#op_button_preview.pbox_' + e.tag).css('border-color', generateCssColor(border_color, border_opacity));
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_border_size_1':
					$('#op_button_preview.pbox_' + e.tag).css('border-width', value + 'px');
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_border_radius_1':
					$('#op_button_preview.pbox_' + e.tag + ', #op_button_preview.pbox_' + e.tag + ' .gradient, #op_button_preview.pbox_' + e.tag + ' .active, #op_button_preview.pbox_' + e.tag + ' .hover, #op_button_preview.pbox_' + e.tag + ' .shine').css('border-radius', value + 'px');
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_shine_1':
					if (value === 1) {
						$('#op_button_preview.pbox_' + e.tag + ' .shine').show();
					} else {
						$('#op_button_preview.pbox_' + e.tag + ' .shine').hide();
					}
					break;
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_gradient_start_color_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_gradient_end_color_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_gradient_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_styling_gradient_1':
					var start_color = $('#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_start_color_1').val();
					var end_color = $('#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_end_color_2').val();
					var gradient_status = $('#op_assets_core_optin_modal_tabs_submit_button_styling_gradient_1').is(':checked');
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
				case 'op[op_assets_core_optin_modal_tabs_submit_button_drop_shadow][enabled]':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_vertical_axis_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_horizontal_axis_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_border_radius_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_spread_radius_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_opacity_1':
				case 'op_assets_core_optin_modal_tabs_submit_button_drop_shadow_shadow_color_2':
				// Inner/inset
				case 'op[op_assets_core_optin_modal_tabs_submit_button_inset_shadow][enabled]':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_vertical_axis_3':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_horizontal_axis_3':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_border_radius_3':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_spread_radius_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_opacity_2':
				case 'op_assets_core_optin_modal_tabs_submit_button_inset_shadow_shadow_color_3':

					var styles = [];

					if ($('input[name="op[op_assets_core_optin_modal_tabs_submit_button_drop_shadow][enabled]"]').is(':checked')) {
						var vertical_axis_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_vertical_axis_2').slider('value');
						var horizontal_axis_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_horizontal_axis_2').slider('value');
						var border_radius_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_border_radius_2').slider('value');
						var spread_radius_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_spread_radius_1').slider('value');
						var shadow_color_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_shadow_color_2').val();
						var opacity_1 = $('#op_assets_core_optin_modal_tabs_submit_button_drop_shadow_opacity_1').slider('value');
						if (shadow_color_1 === '') {
							shadow_color_1 = '#ffffff';
						}
						color_1 = generateCssColor(shadow_color_1, opacity_1);
						styles.push(horizontal_axis_1 + 'px ' + vertical_axis_1 + 'px ' + border_radius_1 + 'px ' + spread_radius_1 + 'px ' + color_1);
					}

					if ($('input[name="op[op_assets_core_optin_modal_tabs_submit_button_inset_shadow][enabled]"]').is(':checked')) {
						var vertical_axis_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_vertical_axis_3').slider('value');
						var horizontal_axis_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_horizontal_axis_3').slider('value');
						var border_radius_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_border_radius_3').slider('value');
						var spread_radius_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_spread_radius_2').slider('value');
						var shadow_color_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_shadow_color_3').val();
						var opacity_2 = $('#op_assets_core_optin_modal_tabs_submit_button_inset_shadow_opacity_2').slider('value');
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