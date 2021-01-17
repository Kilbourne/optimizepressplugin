;opjq(document).ready(function($){
	/*
	 * Button type listener and trigger
	 */
	$('.submit-button-container select.style-selector[id$="_button_type"]').change(function(e){
		$(this).siblings('.button-option-style').hide().filter('.button-option-style-'+$(this).val()).show().find('select').trigger('change');
		/*
		 * We need to trigger preview updating
		 */
		var parentId = $(this).closest('.submit-button-container').attr('id');
		if ($(this).val() == 1) {
			op_submit_button_presets.trigger(op_submit_button_presets.load('default'), '#' + parentId);
			$('#' + parentId + ' #op_assets_submit_button_text_box_text_properties_1_text').removeAttr('disabled');
		} else {
			$('#' + parentId + ' #op_assets_submit_button_text_box_text_properties_1_text').attr('disabled', 'disabled');
		}
	}).trigger('change');

	/*
	 * Preset selector listener and trigger
	 */
	$('select.preset-selector').parent().find('a.selected-item').click(function(e){
		$(this).next().toggle();
		e.preventDefault();
	}).next().find('li a').click(function(e){
		var $t = $(this);
		e.preventDefault();
		var el = $(this).closest('.op-asset-dropdown').find('li.selected').removeClass('selected').end().find('a.selected-item').next().hide().end().end().prev().val($t.find('img').attr('alt'));
		var owner = $t.closest('.submit-button-container').attr('id');
		$.event.trigger({
			type: 'update_button_preview',
			id: $t.parent().attr('id'),
			owner: owner,
			value: 'button_' + $t.find('img').attr('alt') + '.png'
		});
		op_submit_button_presets.switch('button_' + $t.find('img').attr('alt') + '.png', '#' + owner);
		$t.parent().addClass('selected');
	}).end().end().end().end().change(function(){
		$(this).next().find('li img[alt="'+$(this).val()+'"]').trigger('click');
	});

	/*
	 * Attributes listener and trigger
	 */
	$('.button-option-style-1 input[type="checkbox"], .button-option-style-1 select').change(function(e) {
		var element_id, element_value;
		if ($(this).attr('type') === 'checkbox') {
			if ($(this).is(':checked')) {
				element_value = 1;
			} else {
				element_value = 0;
			}
		} else {
			element_value = $(this).val();
		}
		element_id = $(this).attr('id');
		$.event.trigger({type: 'update_button_preview', value: element_value, id: element_id, owner: $(this).closest('.submit-button-container').attr('id'), element_type: this.tagName.toLowerCase(), element: $(this)});
	});

	/*
	 * Textual attributes trigger and listener
	 */
	$('.button-option-style-1 input[type="text"]').on('propertychange keydown input paste', function(e) {
		$.event.trigger({type: 'update_button_preview', value: $(this).val(), id: $(this).attr('id'), owner: $(this).closest('.submit-button-container').attr('id'), element_type: this.tagName.toLowerCase(), element: $(this)});
	});

	/*
	 * Font picker trigger
	 */
	$('.font-dropdown li a').click(function(e){
		var $img = $(this).find('.op-font');
		var parent = $(this).closest('.select-font');
		$.event.trigger({type: 'update_button_preview', id: parent.attr('id'), owner: parent.closest('.submit-button-container').attr('id'), value: $img.attr('data-font'), font_type: $img.attr('data-type'), font_family: $img.attr('data-family')});
	});
	/*
	 * Listening for trigger that updates live button preview
	 */
	$(document).on('update_button_preview', function(e) {
		if (typeof op_custom_submit_button != 'undefined') {
			op_custom_submit_button.update(e);
		}
	});
});

var op_submit_button_presets = (function($){
	return {
		presets: {
			'default': {
				attributes: {
					text: {
						value: '',
						selector: '#op_assets_submit_button_text_box_text_properties_1_text',
						type: 'text'
					},
					text_size: {
						value: 36,
						selector: '#op_assets_submit_button_text_box_text_properties_1_size',
						type: 'dropdown'
					},
					text_font: {
						value: '',
						selector: '#op_assets_submit_button_text_box_text_properties_1_container',
						type: 'font'
					},
					text_color: {
						value: '',
						selector: '#op_assets_submit_button_text_box_text_properties_1_color',
						type: 'color'
					},
					text_bold: {
						value: false,
						selector: '.field-id-op_assets_submit_button_text_box_text_properties_1 .op-font-style-bold',
						type: 'checkbox'
					},
					text_italic: {
						value: false,
						selector: '.field-id-op_assets_submit_button_text_box_text_properties_1 .op-font-style-italic',
						type: 'checkbox'
					},
					text_underline: {
						value: false,
						selector: '.field-id-op_assets_submit_button_text_box_text_properties_1 .op-font-style-underline',
						type: 'checkbox'
					},
					text_letter_spacing: {
						value: 0,
						selector: '#op_assets_submit_button_text_box_letter_spacing_1',
						type: 'slider'
					},
					subtext_panel: {
						value: false,
						selector: '#panel_control_op_assets_submit_button_subtext_box',
						type: 'checkbox'
					},
					subtext: {
						value: '',
						selector: '#op_assets_submit_button_subtext_box_text_properties_2_text',
						type: 'text'
					},
					subtext_size: {
						value: 14,
						selector: '#op_assets_submit_button_subtext_box_text_properties_2_size',
						type: 'dropdown'
					},
					subtext_font: {
						value: '',
						selector: '#op_assets_submit_button_subtext_box_text_properties_2_container',
						type: 'font'
					},
					subtext_color: {
						value: '#ffffff',
						selector: '#op_assets_submit_button_subtext_box_text_properties_2_color',
						type: 'color'
					},
					subtext_bold: {
						value: false,
						selector: '.field-id-op_assets_submit_button_subtext_box_text_properties_2 .op-font-style-bold',
						type: 'checkbox'
					},
					subtext_italic: {
						value: false,
						selector: '.field-id-op_assets_submit_button_subtext_box_text_properties_2 .op-font-style-italic',
						type: 'checkbox'
					},
					subtext_underline: {
						value: false,
						selector: '.field-id-op_assets_submit_button_subtext_box_text_properties_2 .op-font-style-underline',
						type: 'checkbox'
					},
					subtext_letter_spacing: {
						value: 0,
						selector: '#op_assets_submit_button_subtext_box_letter_spacing_2',
						type: 'slider'
					},
					text_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_submit_button_text_shadow',
						type: 'checkbox'
					},
					text_shadow_vertical: {
						value: 0,
						selector: '#op_assets_submit_button_text_shadow_vertical_axis_1',
						type: 'slider'
					},
					text_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_submit_button_text_shadow_horizontal_axis_1',
						type: 'slider'
					},
					text_shadow_color: {
						value: '#ffff00',
						selector: '#op_assets_submit_button_text_shadow_shadow_color_1',
						type: 'color'
					},
					text_shadow_blur: {
						value: 0,
						selector: '#op_assets_submit_button_text_shadow_blur_radius_1',
						type: 'slider'
					},
					styling_width: {
						value: 60,
						selector: '#op_assets_submit_button_styling_width_1',
						type: 'slider'
					},
					styling_height: {
						value: 30,
						selector: '#op_assets_submit_button_styling_height_1',
						type: 'slider'
					},
					styling_border_size: {
						value: 0,
						selector: '#op_assets_submit_button_styling_border_size_1',
						type: 'slider'
					},
					styling_border_radius: {
						value: 0,
						selector: '#op_assets_submit_button_styling_border_radius_1',
						type: 'slider'
					},
					styling_border_color: {
						value: '',
						selector: '#op_assets_submit_button_styling_border_color_1',
						type: 'color'
					},
					styling_border_opacity: {
						value: 100,
						selector: '#op_assets_submit_button_styling_border_opacity_1',
						type: 'slider'
					},
					styling_gradient: {
						value: false,
						selector: '#op_assets_submit_button_styling_gradient_1',
						type: 'checkbox'
					},
					styling_shine: {
						value: false,
						selector: '#op_assets_submit_button_styling_shine_1',
						type: 'checkbox'
					},
					styling_gradient_start_color: {
						value: '',
						selector: '#op_assets_submit_button_styling_gradient_start_color_1',
						type: 'color'
					},
					styling_gradient_end_color: {
						value: '',
						selector: '#op_assets_submit_button_styling_gradient_end_color_2',
						type: 'color'
					},
					drop_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_submit_button_drop_shadow',
						type: 'checkbox'
					},
					drop_shadow_vertical: {
						value: 0,
						selector: '#op_assets_submit_button_drop_shadow_vertical_axis_2',
						type: 'slider'
					},
					drop_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_submit_button_drop_shadow_horizontal_axis_2',
						type: 'slider'
					},
					drop_shadow_blur: {
						value: 0,
						selector: '#op_assets_submit_button_drop_shadow_border_radius_2',
						type: 'slider'
					},
					drop_shadow_spread: {
						value: 0,
						selector: '#op_assets_submit_button_drop_shadow_spread_radius_1',
						type: 'slider'
					},
					drop_shadow_color: {
						value: '',
						selector: '#op_assets_submit_button_drop_shadow_shadow_color_2',
						type: 'color'
					},
					drop_shadow_opacity: {
						value: 100,
						selector: '#op_assets_submit_button_drop_shadow_opacity_1',
						type: 'slider'
					},
					inset_shadow_panel: {
						value: false,
						selector: '#panel_control_op_assets_submit_button_inset_shadow',
						type: 'checkbox'
					},
					inset_shadow_vertical: {
						value: 0,
						selector: '#op_assets_submit_button_inset_shadow_vertical_axis_3',
						type: 'slider'
					},
					inset_shadow_horizontal: {
						value: 0,
						selector: '#op_assets_submit_button_inset_shadow_horizontal_axis_3',
						type: 'slider'
					},
					inset_shadow_blur: {
						value: 0,
						selector: '#op_assets_submit_button_inset_shadow_border_radius_3',
						type: 'slider'
					},
					inset_shadow_spread: {
						value: 0,
						selector: '#op_assets_submit_button_inset_shadow_spread_radius_2',
						type: 'slider'
					},
					inset_shadow_color: {
						value: '',
						selector: '#op_assets_submit_button_inset_shadow_shadow_color_3',
						type: 'color'
					},
					inset_shadow_opacity: {
						value: 100,
						selector: '#op_assets_submit_button_inset_shadow_opacity_2',
						type: 'slider'
					}
				}
			},
			'button_0.png': {
				attributes: {
					text: {
						value: 'ADD TO CART!',
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
						value: '#ffff00'
					},
					styling_width: {
						value: 60
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
						value: 'Get Instant Access',
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
						value: "DON'T WAIT!",
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
						value: 'See Plans and Pricing',
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
						value: 'Get Instant Access!',
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
						value: 'Purchase Now!',
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
						value: 'Download!',
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
						value: 'Signup Today!',
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
						value: 'Checkout',
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
						value: 'Get it Now',
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
						value: 'START A FREE TRIAL TODAY',
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
						value: 'Download',
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
						value: 'Sign up for private beta',
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
						value: 'SHOP NOW',
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
						value: 'CSS Button',
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
		reset: function(owner) {
			this.change(this.load('default'), owner);
		},
		load: function(preset) {
			return this.presets[preset].attributes;
		},
		switch: function(preset, owner) {
			this.reset(owner);
			this.change(this.load(preset), owner);
		},
		change: function(attributes, owner) {
			var defaults = this.load('default');
			for (var i in attributes) {
				switch (defaults[i].type) {
					case 'checkbox':
						var checked = false;
						if (typeof attributes[i].value != 'undefined' && (attributes[i].value == true || attributes[i].value == 'Y')) {
							checked = true;
						}
						$(owner + ' ' + defaults[i].selector).attr('checked', checked).trigger('change');
						break;
					case 'font':
						var $container = $(owner + ' ' + defaults[i].selector + ' a.selected-font');
						value = attributes[i].value.split(';');
						var $item = $(owner + ' ' + defaults[i].selector + ' .op-font[alt="' + value[0] + '"]');
						/*
						 * If item is not found we display default one (font-family:inherit)
						 */
						if ($item.length == 0) {
							$container.html($(owner + ' ' + defaults[i].selector + ' .font-dropdown li:first a').html());
						} else {
							$container.html($item.parent().html());
						}
						$.event.trigger({type: 'update_button_preview', id: defaults[i].selector.substr(1), owner: owner.substr(1), value: $item.attr('alt'), font_type: $item.attr('data-type'), font_family: $item.attr('data-family')});
						break;
					case 'slider':
						var $slider = $(owner + ' ' + defaults[i].selector);
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
						$(owner + ' ' + defaults[i].selector).val(attributes[i].value).trigger('keydown').trigger('change');
						break;
				}
			}
		},
		trigger: function (attributes, owner) {
			for (var i in attributes) {
				switch (attributes[i].type) {
					case 'checkbox':
						$(owner + ' ' + attributes[i].selector).trigger('change');
						break;
					case 'font':
						var $item = $(owner + ' ' + attributes[i].selector + ' a.selected-font img');
						if ($item.length > 0) {
							$.event.trigger({type: 'update_button_preview', id: attributes[i].selector.substr(1), owner: owner.substr(1), value: $item.attr('alt'), font_type: $item.attr('data-type'), font_family: $item.attr('data-family')});
						}
						break;
					case 'slider':
						var $slider = $(owner + ' ' + attributes[i].selector);
						if ($slider.length > 0) {
							value = $slider.slider('option', 'value');
							$slider.slider('option', 'slide').call($slider, {}, {value: value, id: attributes[i].selector.substr(1)});
							$slider.slider('option', 'stop').call($slider, {}, {value: value, id: attributes[i].selector.substr(1)});
						}
						break;
					case 'color':
						// no break
					case 'text':
						// no break
					case 'dropdown':
						// no break
					default:
						$(owner + ' ' + attributes[i].selector).trigger('keydown').trigger('change');
						break;
				}
			}
		}
	}
}(opjq));

var op_custom_submit_button = (function($){
	return {
		update: function(e) {
			var id = e.id, value = e.value;
			switch (id) {
				/*
				 * Preset
				 */
				case 'op_assets_submit_button_button_preview_container':
					op_submit_button_presets.switch(value);
					break;
				/*
				 * Text box
				 */
				case 'op_assets_submit_button_text_box_text_properties_1_text':
					$('#' + e.owner + ' #op_button_submit_preview .text').html(value);
					break;
				case 'op_assets_submit_button_text_box_text_properties_1_size':
					$('#' + e.owner + ' #op_button_submit_preview .text').css('font-size', value + 'px');
					break;
				case 'op_assets_submit_button_text_box_text_properties_1_container':
					if (typeof value == 'undefined') {
						value = 'inherit';
					} else if(e.font_type == 'google') {
						WebFont.load({google:{families:[value]}});
					} else {
						value = e.font_family;
					}
					$('#' + e.owner + ' #' + id).next().val(e.value + ';' + e.font_type);
					$('#' + e.owner + ' #op_button_submit_preview .text').css('font-family', value);
					break;
				case 'op_assets_submit_button_text_box_text_bold_1':
					if (value === 0) {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('font-weight', 'normal');
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('font-weight', 'bold');
					}
					break;
				case 'op_assets_submit_button_text_box_text_italic_1':
					if (value === 0) {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('font-style', 'normal');
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('font-style', 'italic');
					}
					break;
				case 'op_assets_submit_button_text_box_text_underline_1':
					if (value === 0) {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('text-decoration', 'none');
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('text-decoration', 'underline');
					}
					break;
				case 'op_assets_submit_button_text_box_text_properties_1_color':
					if (value === '') {
						value = '#ffffff';
					}
					$('#' + e.owner + ' #op_button_submit_preview .text').css('color', value);
					break;
				case 'op_assets_submit_button_text_box_letter_spacing_1':
					if (value != 0) {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('letter-spacing', value + 'px');
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .text').css('letter-spacing', 'normal');
					}
					break;
				/*
				 * Text shadow
				 */
				case 'op_assets_submit_button_text_shadow_vertical_axis_1':
				case 'op_assets_submit_button_text_shadow_horizontal_axis_1':
				case 'op_assets_submit_button_text_shadow_blur_radius_1':
				case 'op_assets_submit_button_text_shadow_shadow_color_1':
				case 'panel_control_op_assets_submit_button_text_shadow_enabled':
					if ($('#' + e.owner + ' #panel_control_op_assets_submit_button_text_shadow_enabled').is(':checked')) {
						var vertical_axis = $('#' + e.owner + ' #op_assets_submit_button_text_shadow_vertical_axis_1').slider('value');
						var horizontal_axis = $('#' + e.owner + ' #op_assets_submit_button_text_shadow_horizontal_axis_1').slider('value');
						var blur_radius = $('#' + e.owner + ' #op_assets_submit_button_text_shadow_blur_radius_1').slider('value');
						var shadow_color = $('#' + e.owner + ' #op_assets_submit_button_text_shadow_shadow_color_1').val();
						if (shadow_color === '') {
							shadow_color = '#ffffff';
						}
						$('#' + e.owner + ' #op_button_submit_preview .subtext, ' + '#' + e.owner + ' #op_button_submit_preview .text').css('text-shadow', shadow_color + ' ' + horizontal_axis + 'px ' + vertical_axis + 'px ' +blur_radius + 'px');
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .subtext, ' + '#' + e.owner + ' #op_button_submit_preview .text').css('text-shadow', 'none');
					}
					break;
				/*
				 * Styling
				 */
				case 'op_assets_submit_button_styling_width_1':
					var max = $('#' + e.owner + ' #op_assets_submit_button_styling_width_1').slider('option', 'max');
					if (max == value) {
						$('#' + e.owner + ' #op_button_submit_preview').css('width', '100%');
						$('#' + e.owner + ' #output_op_assets_submit_button_styling_width_1').html('100%');
						$('#' + e.owner + ' #op_button_submit_preview').css('padding', $('#' + e.owner + ' #op_assets_submit_button_styling_height_1').slider('value') + 'px 0');
						return false;
					} else {
						$('#' + e.owner + ' #op_button_submit_preview').css('width', 'auto');
						$('#' + e.owner + ' #op_button_submit_preview').css('padding', $('#' + e.owner + ' #op_assets_submit_button_styling_height_1').slider('value') + 'px ' + value + 'px');
					}
					break;
				case 'op_assets_submit_button_styling_height_1':
					$('#' + e.owner + ' #op_button_submit_preview').css('padding', value + 'px ' + $('#' + e.owner + ' #op_assets_submit_button_styling_width_1').slider('value') + 'px');
					break;
				case 'op_assets_submit_button_styling_border_color_1':
				case 'op_assets_submit_button_styling_border_opacity_1':
					var border_opacity = $('#' + e.owner + ' #op_assets_submit_button_styling_border_opacity_1').slider('value');
					var border_color = $('#' + e.owner + ' #op_assets_submit_button_styling_border_color_1').val();
					if (border_color === '') {
						border_color = '#ffffff';
					}
					$('#' + e.owner + ' #op_button_submit_preview').css('border-color', generateCssColor(border_color, border_opacity));
					break;
				case 'op_assets_submit_button_styling_border_size_1':
					$('#' + e.owner + ' #op_button_submit_preview').css('border-width', value + 'px');
					break;
				case 'op_assets_submit_button_styling_border_radius_1':
					$('#' + e.owner + ' #op_button_submit_preview, #' + e.owner + ' #op_button_submit_preview .gradient, #' + e.owner + ' #op_button_submit_preview .active, #' + e.owner + ' #op_button_submit_preview .hover, #' + e.owner + ' #op_button_submit_preview .shine').css('border-radius', value + 'px');
					break;
				case 'op_assets_submit_button_styling_shine_1':
					if (value === 1) {
						$('#' + e.owner + ' #op_button_submit_preview .shine').show();
					} else {
						$('#' + e.owner + ' #op_button_submit_preview .shine').hide();
					}
					break;
				case 'op_assets_submit_button_styling_gradient_start_color_1':
				case 'op_assets_submit_button_styling_gradient_end_color_2':
				case 'op_assets_submit_button_styling_gradient_1':
					var start_color = $('#' + e.owner + ' #op_assets_submit_button_styling_gradient_start_color_1').val();
					var end_color = $('#' + e.owner + ' #op_assets_submit_button_styling_gradient_end_color_2').val();
					var gradient_status = $('#' + e.owner + ' #op_assets_submit_button_styling_gradient_1').is(':checked');
					if (gradient_status == true && start_color != end_color) {
						$('#' + e.owner + ' #op_button_submit_preview').css('background', start_color);
						$('#' + e.owner + ' #op_button_submit_preview .gradient').show();
					} else {
						$('#' + e.owner + ' #op_button_submit_preview')
							.css('background', start_color)
							.css('background', '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + start_color + '), color-stop(100%, ' + end_color + '))')
							.css('background', '-webkit-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
							.css('background', '-moz-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
							.css('background', '-ms-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
							.css('background', '-o-linear-gradient(top, ' + start_color + ' 0%, ' + end_color + ' 100%)')
							.css('background', 'linear-gradient(to bottom, ' + start_color + ' 0%, ' + end_color + ' 100%)')
							.css('filter', 'progid:DXImageTransform.Microsoft.gradient( startColorstr=' + start_color + ', endColorstr=' + end_color + ', GradientType=0 )');

						$('#' + e.owner + ' #op_button_submit_preview .gradient').hide();
					}
					break;
				/*
				 * Drop and inner shadow
				 */
				// Drop
				case 'panel_control_op_assets_submit_button_drop_shadow':
				case 'op_assets_submit_button_drop_shadow_vertical_axis_2':
				case 'op_assets_submit_button_drop_shadow_horizontal_axis_2':
				case 'op_assets_submit_button_drop_shadow_border_radius_2':
				case 'op_assets_submit_button_drop_shadow_spread_radius_1':
				case 'op_assets_submit_button_drop_shadow_opacity_1':
				case 'op_assets_submit_button_drop_shadow_shadow_color_2':
				// Inner/inset
				case 'panel_control_op_assets_submit_button_inset_shadow':
				case 'op_assets_submit_button_inset_shadow_vertical_axis_3':
				case 'op_assets_submit_button_inset_shadow_horizontal_axis_3':
				case 'op_assets_submit_button_inset_shadow_border_radius_3':
				case 'op_assets_submit_button_inset_shadow_spread_radius_2':
				case 'op_assets_submit_button_inset_shadow_opacity_2':
				case 'op_assets_submit_button_inset_shadow_shadow_color_3':

					var styles = [];
					if ($('#' + e.owner + ' #panel_control_op_assets_submit_button_drop_shadow_enabled').is(':checked')) {
						var vertical_axis_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_vertical_axis_2').slider('value');
						var horizontal_axis_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_horizontal_axis_2').slider('value');
						var border_radius_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_border_radius_2').slider('value');
						var spread_radius_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_spread_radius_1').slider('value');
						var shadow_color_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_shadow_color_2').val();
						var opacity_1 = $('#' + e.owner + ' #op_assets_submit_button_drop_shadow_opacity_1').slider('value');
						if (shadow_color_1 === '') {
							shadow_color_1 = '#ffffff';
						}
						color_1 = generateCssColor(shadow_color_1, opacity_1);
						styles.push(horizontal_axis_1 + 'px ' + vertical_axis_1 + 'px ' + border_radius_1 + 'px ' + spread_radius_1 + 'px ' + color_1);
					}

					if ($('#' + e.owner + ' #panel_control_op_assets_submit_button_inset_shadow_enabled').is(':checked')) {
						var vertical_axis_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_vertical_axis_3').slider('value');
						var horizontal_axis_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_horizontal_axis_3').slider('value');
						var border_radius_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_border_radius_3').slider('value');
						var spread_radius_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_spread_radius_2').slider('value');
						var shadow_color_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_shadow_color_3').val();
						var opacity_2 = $('#' + e.owner + ' #op_assets_submit_button_inset_shadow_opacity_2').slider('value');
						if (shadow_color_2 === '') {
							shadow_color_2 = '#ffffff';
						}
						color_2 = generateCssColor(shadow_color_2, opacity_2);
						styles.push('inset ' + horizontal_axis_2 + 'px ' + vertical_axis_2 + 'px ' + border_radius_2 + 'px ' + spread_radius_2 + 'px ' + color_2);
					}
					if (styles.length > 0) {
						$('#' + e.owner + ' #op_button_submit_preview').css('box-shadow', styles.join(','));
					} else {
						$('#' + e.owner + ' #op_button_submit_preview').css('box-shadow', 'none');
					}

					break;
			}
		}
	};
}(opjq));