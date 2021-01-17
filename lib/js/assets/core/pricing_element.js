var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-pricing-graphic.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-pricing-graphic.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: '',
					addClass: 'op-disable-selected',
					exclude: true
				}
			},
			step_2: {
				content: {
					title: 'text'
				},
				font: {
					title: 'font_settings',
					type: 'font'
				}
			}
		},
		insert_steps: {2:true}
	}
}(opjq));