var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-news-bar.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-news-bar.mp4',
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
					default_value: '#004a80'
				},
				feature_text: {
					title: 'feature_text',
					type: 'input'
				},
				main_text: {
					title: 'main_text',
					type: 'input'
				}
			}
		},
		insert_steps: {2:true},
		customInsert: function(attrs){
			var str = '', style = (attrs.style || 1);

			//Generate the parent shortcode
			str = '[news_bar style="' + style + '" color="' + attrs.color + '" feature_text="' + encodeURI(attrs.feature_text) + '" main_text="' + encodeURI(attrs.main_text) + '"][/news_bar]';

			//Insert the shortcode into the page (processed by default.php)
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			var html = '',
				style = attrs.attrs.style || 1,
				color = attrs.attrs.color,
				feature_text = decodeURI(attrs.attrs.feature_text)
				main_text = decodeURI(attrs.attrs.main_text);

			//Set the style
			OP_AB.set_selector_value('op_assets_core_news_bar_style_container',(style || ''));

			//Set text fields
			steps[1].find('.field-color').find('input').val(color).next('a').css({ backgroundColor: color });
			steps[1].find('.field-feature_text').find('input').val(feature_text)
			steps[1].find('.field-main_text').find('input').val(main_text)
		}
	};
}(opjq));
