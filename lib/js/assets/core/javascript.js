var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-js.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				javascript_description: {
					type: 'microcopy',
					text: 'javascript_description'
				},
				content: {
					title: 'javascript_content',
					type: 'textarea',
					format: 'custom'
				}
			},
		},
		insert_steps: {1:true}
	}
}(opjq));