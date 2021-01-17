var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-order-steps.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-order-steps.mp4',
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
				step1_text: {
					title: 'order_step1_text',
					default_value: 'Start'
				},
				step1_href: {
					title: 'order_step1_href'
				},
				step2_text: {
					title: 'order_step2_text',
					default_value: 'Delivery'
				},
				step2_href: {
					title: 'order_step2_href'
				},
				step3_text: {
					title: 'order_step3_text',
					default_value: 'Finish'
				},
				selected: {
					title: 'order_selected_step',
					type: 'select',
					valueRange: {start:1,finish:3,text_prefix:'step'}
				}
			}
		},
		insert_steps: {2:true}
	}
}(opjq));