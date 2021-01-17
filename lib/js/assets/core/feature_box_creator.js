var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box-creator.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box-creator.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box-creator.mp4',
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
				only_advanced: {
					text: OP_AB.translate('only_advanced_fields_available_when_editing'),
					type: 'paragraph'
				},
				content: {
					title: 'content',
					type: 'wysiwyg',
					addClass: 'op-hidden-in-edit'
				}
			},
			step_3: {
				microcopy: {
					text: 'feature_box_advanced1',
					type: 'microcopy'
				},
				microcopy2: {
					text: 'advanced_warning_2',
					type: 'microcopy',
					addClass: 'warning'
				},
				font: {
					title: 'feature_box_content_styling',
					type: 'font'
				},
				width: {
					title: 'width',
					suffix: '',
					default_value: function(){
						return OP_AB.column_width();
					}
				},
				top_margin: {
					title: 'top_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_margin: {
					title: 'bottom_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				top_padding: {
					title: 'top_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_padding: {
					title: 'bottom_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				left_padding: {
					title: 'left_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				right_padding: {
					title: 'right_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				alignment: {
					title: 'alignment',
					type: 'select',
					values: {'left': 'left', 'center': 'center', 'right': 'right'},
					default_value: 'center',
					addClass: 'pixel-width-field'
				},
				bg_color: {
					title: 'bg_color_start',
					type: 'color',
					addClass: 'pixel-width-field'
				},
				bg_color_end: {
					title: 'bg_color_end',
					type: 'color',
					addClass: 'pixel-width-field'
				},
				border_color: {
					title: 'border_color',
					type: 'color',
					addClass: 'pixel-width-field'
				},
				border_weight: {
					title: 'border_weight',
					addClass: 'pixel-width-field'
				},
				border_radius: {
					title: 'border_radius',
					addClass: 'pixel-width-field'
				},
				border_style: {
					title: 'border_style',
					type: 'select',
					values: {'': '---', 'solid': 'solid', 'dashed': 'dashed', 'dotted': 'dotted'},
					addClass: 'pixel-width-field'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true},
		customInsert: function(attrs){
			var str = '',
				style = (attrs.style || 1),
				content = (attrs.content || ''),
				font = (attrs.font || ''),
				width = (attrs.width || ''),
				top_margin = (attrs.top_margin || ''),
				bottom_margin = (attrs.bottom_margin || ''),
				top_padding = (attrs.top_padding || ''),
				right_padding = (attrs.right_padding || ''),
				bottom_padding = (attrs.bottom_padding || ''),
				left_padding = (attrs.left_padding || ''),
				alignment = (attrs.alignment || ''),
				bg_color = (attrs.bg_color || ''),
				bg_color_end = (attrs.bg_color_end || ''),
				border_color = (attrs.border_color || ''),
				border_weight = (attrs.border_weight || ''),
				border_radius = (attrs.border_radius || ''),
				border_style = (attrs.border_style || ''),
				font_str = '';

			//Get font elements to add to shortcode
			$.each(['font'], function(i, v){
				$.each(attrs[v], function(i2, v2){
					font_str += (v2!='' ? ' '+v+'_'+i2+'="'+v2.replace(/"/ig,"'")+'"' : '');
				});
			});

			//Generate shortcode
			str = '[feature_box_creator style="' + style + '" width="' + width + '" top_margin="' + top_margin + '" bottom_margin="' + bottom_margin + '" top_padding="' + top_padding + '" right_padding="' + right_padding + '" bottom_padding="' + bottom_padding + '" left_padding="' + left_padding + '" alignment="' + alignment + '" bg_color="' + bg_color + '" bg_color_end="' + bg_color_end + '" border_color="' + border_color + '" border_weight="' + border_weight + '" border_radius="' + border_radius + '" border_style="' + border_style + '" ' + font_str + ']' + content + '[/feature_box_creator]';

			wpActiveEditor = wpActiveEditor || 'content';

			//Add content to live editor
			OP_AB.insert_content(str);

			//Close asset browser
			$.fancybox.close();
		},
		customSettings: function(attrs, steps){
			var style = (attrs.attrs.style || ''),
				content = (attrs.attrs.content || ''),
				font = (attrs.attrs.font || ''),
				width = (attrs.attrs.width || ''),
				top_margin = (attrs.attrs.top_margin || ''),
				bottom_margin = (attrs.attrs.bottom_margin || ''),
				top_padding = (attrs.attrs.top_padding || ''),
				right_padding = (attrs.attrs.right_padding || ''),
				bottom_padding = (attrs.attrs.bottom_padding || ''),
				left_padding = (attrs.attrs.left_padding || ''),
				alignment = (attrs.attrs.alignment || ''),
				bg_color = (attrs.attrs.bg_color || ''),
				bg_color_end = (attrs.attrs.bg_color_end || ''),
				border_color = (attrs.attrs.border_color || ''),
				border_weight = (attrs.attrs.border_weight || ''),
				border_radius = (attrs.attrs.border_radius || ''),
				border_style = (attrs.attrs.border_style || '');

			//Set the style selector
			OP_AB.set_selector_value('op_assets_core_feature_box_creator_style_container', style);

			//Set the content field
			OP_AB.set_wysiwyg_content('op_assets_core_feature_box_creator_content', content);

			//Set the font settings
			OP_AB.set_font_settings('font', attrs.attrs, 'op_assets_core_feature_box_creator_font');

			//Set the width field
			$('#op_assets_core_feature_box_creator_width').val(width);

			//Set the margin fields
			$('#op_assets_core_feature_box_creator_top_margin').val(top_margin);
			$('#op_assets_core_feature_box_creator_bottom_margin').val(bottom_margin);

			//Set the padding fields
			$('#op_assets_core_feature_box_creator_top_padding').val(top_padding);
			$('#op_assets_core_feature_box_creator_right_padding').val(right_padding);
			$('#op_assets_core_feature_box_creator_bottom_padding').val(bottom_padding);
			$('#op_assets_core_feature_box_creator_left_padding').val(left_padding);

			//Set the alignment field
			$('#op_assets_core_feature_box_creator_alignment').val(alignment);

			//Set the background color fields
			OP_AB.set_color_value('op_assets_core_feature_box_creator_bg_color', bg_color);
			OP_AB.set_color_value('op_assets_core_feature_box_creator_bg_color_end', bg_color_end);

			//Set the border fields
			OP_AB.set_color_value('op_assets_core_feature_box_creator_border_color', border_color);
			$('#op_assets_core_feature_box_creator_border_weight').val(border_weight);
			$('#op_assets_core_feature_box_creator_border_radius').val(border_radius);
			$('#op_assets_core_feature_box_creator_border_style').val(border_style);
		}
	}
}(opjq));