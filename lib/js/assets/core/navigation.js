var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-navigation.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-navigation.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-navigation.mp4',
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
				microcopy: {
					text: 'navigation_help',
					type: 'microcopy'
				},
				nav_id: {
					title: 'navigation_menu',
					type: 'select',
					values: op_nav_lists
				},
				title: {
					title: 'title',
					showOn: {field:'step_1.style',value:['4', '6', '7', '8', '9', '10']}
				},
				left_margin: {
					title: 'left_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				right_margin: {
					title: 'right_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				}
			},
			step_3: {
				microcopy: {
					text: 'navigation_advanced1',
					type: 'microcopy'
				},
				microcopy2: {
					text: 'advanced_warning_2',
					type: 'microcopy',
					addClass: 'warning'
				},
				font: {
					title: 'navigation_font_settings',
					type: 'font'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			var style = attrs.style,
				title = attrs.title,
				nav_id = attrs.nav_id,
				left_margin = attrs.left_margin,
				right_margin = attrs.right_margin;

			//Set the style
			OP_AB.set_selector_value('op_assets_core_navigation_style_container',style);

			//Set the title
			$('#op_assets_core_navigation_title').val(title);

			//Set select element for navigation ID
			$('#op_assets_core_navigation_nav_id').find('option').each(function(){
				if ($(this).val()==nav_id) $(this).attr('selected', 'selected');
			});

			//Set the margins
			$('#op_assets_core_navigation_left_margin').val(left_margin);
			$('#op_assets_core_navigation_right_margin').val(right_margin);

			//Set the font settings
			OP_AB.set_font_settings('font',attrs,'op_assets_core_navigation_font');
		}
	};
}(opjq));