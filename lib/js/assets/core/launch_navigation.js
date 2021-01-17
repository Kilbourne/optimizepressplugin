var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-launch-nav.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-launch-nav.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'styles',
					addClass: 'op-disable-selected'/*,
					events: {
						change: function(){
							OP_AB.trigger_insert();
							return false;
						}
					}*/
				}
			},
			step_2: {
				font: {
					title: 'font_settings',
					type: 'font'
				}
			}
		},
		insert_steps: {2:true},
		customInsert: function(attrs){
			var str = '', style = (attrs.style || 1), font = attrs.font;

			//Generate the parent shortcode
			str = '[launch_navigation style="' + style + '" font_size="' + font.size + '" font_family="' + font.font + '" font_style="' + font.style + '" font_color="' + font.color + '" font_spacing="' + font.spacing + '" font_shadow="' + font.shadow + '"][/launch_navigation]';

			//Insert the shortcode into the page (processed by live_editor.php)
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs){
			attrs = attrs.attrs; //Set the attributes to be the correct object
			attrs.font_font = attrs.font_family || ''; //Create the font object that was somehow missed by the system
			var style = (attrs.style || 1); //Get the style
			OP_AB.set_font_settings('font',attrs,'op_assets_core_launch_navigation_font'); //Set the font
			OP_AB.set_selector_value('op_assets_core_launch_navigation_style_container',style); //Set the style
		}
	}
}(opjq));