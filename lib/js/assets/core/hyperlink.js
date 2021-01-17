var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-hyperlink.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-hyperlink.mp4',
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
				href: {
					title: 'link_url'
				},
				new_window: {
					title: 'new_window',
					type: 'checkbox'
				},
				content: {
					title: 'text',
					type: 'input',
					default_value: 'Your Link Text'
				},
				font: {
					title: 'font_settings',
					type: 'font'
				},
				align: {
					title: 'alignment',
					type: 'radio',
					values: {'left':'left','center':'center','right':'right'},
					default_value: 'center'
				}
			}
		},
		insert_steps: {2:true}
	}
}(opjq));