var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-divider.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-divider.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: 'previews',
					addClass: 'op-disable-selected',
					events: {
						change: function(value){
							if(value != 5){
								OP_AB.trigger_insert();
								return false;
							}
						}
					}
				}
			},
			step_2: {
				label: {
					title: 'divider_top_text',
					showOn: {field:'step_1.style',value:5,type:'style-selector'},
					default_value: OP_AB.translate('Top')
				}
			}
		},
		insert_steps: {2:true}/*,
		default_slide: 2*/
	}
}(opjq));