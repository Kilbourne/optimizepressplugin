var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-progress-bar.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-progress-bar.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: '',
					addClass: 'op-disable-selected'
				}
			},
			step_2: {
				color: {
					title: 'color',
					type: 'color',
					showOn: {field:'step_1.style',value:['1','3']}
				},
				percentage: {
					title: 'percentage',
					type: 'input',
					default_value: 50
				},
				text: {
					title: 'progress_text_shown',
					type: 'input',
					default_value: 'Complete'
				}
			}
		},
		insert_steps: {2:true},
		customInsert: function(attrs){
			var str = '',
				style = (attrs.style || 1),
				text = encodeURIComponent(attrs.text || ''),
				color = (attrs.color || ''),
				percentage = encodeURIComponent(attrs.percentage || '');

			//Generate the shortcode
			str = '[progress_bar style="' + style + '" color="' + attrs.color + '" percentage="' + percentage + '"]' + text + '[/progress_bar]';

			//Insert the shortcode into the page (processed by default.php)
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			var html = '',
				style = attrs.style || 1,
				text = op_decodeURIComponent(attrs.content),
				color = attrs.color
				percentage = op_decodeURIComponent(attrs.percentage);

			//Set the style
			OP_AB.set_selector_value('op_assets_core_progress_bar_style_container',(style || ''));

			//Set text fields
			steps[1].find('.field-color').find('input').val(color).next('a').css({ backgroundColor: color });
			steps[1].find('.field-text').find('input').val(text);
			steps[1].find('.field-percentage').find('input').val(percentage);
		}
	};
}(opjq));