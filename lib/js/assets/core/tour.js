var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-tour.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-tour.mp4',
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
				get_started_link: {
					title: 'tour_get_started_link'
				},
				get_started_text: {
					title: 'tour_get_started_text',
					default_value: 'Get Started Today'
				},
				headline: {
					title: 'tour_headline',
					showOn: {field:'step_1.style',value:['5','6']}
				},
				subheadline: {
					title: 'tour_subheadline',
					showOn: {field:'step_1.style',value:['5','6']}
				},
				tour_link: {
					title: 'tour_tour_link',
					showOn: {field:'step_1.style',value:['1','2','3','4']}
				},
				tour_text: {
					title: 'tour_tour_text',
					showOn: {field:'step_1.style',value:['1','2','3','4']},
					default_value: 'Take a Tour'
				}
			}
		},
		insert_steps: {2:true}
	}
}(opjq));