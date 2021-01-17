var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-custom-html.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				custom_html_description: {
					type: 'microcopy',
					text: 'custom_html_description'
				},
				content: {
					title: 'content',
					type: 'textarea',
					format: 'custom'
				}
			}
		},
		insert_steps: {1:true}
	}
}(opjq));