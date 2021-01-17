var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-feature-box.mp4',
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
				only_advanced: {
					text: OP_AB.translate('only_advanced_fields_available_when_editing'),
					type: 'paragraph',
					showOn: {field:'step_1.style',value:['1','2','3','4','5','6','7','8','9','10','11','12','14','15','20','21','22','23','24','25','26','27','28','29','30']}
				},
				title: {
					title: 'title',
					showOn: {field:'step_1.style',value:['13','16','17','18','19','31','32','33']}
				},
				content: {
					title: 'content',
					type: 'wysiwyg',
					addClass: 'op-hidden-in-edit'
				}
			},
			step_3: {
				microcopy: {
					text: 'feature_box_advanced1',
					type: 'microcopy'
				},
				microcopy2: {
					text: 'advanced_warning_2',
					type: 'microcopy',
					addClass: 'warning'
				},
				font: {
					title: 'feature_box_title_styling',
					type: 'font',
					showOn: {field:'step_1.style',value:['13','16','17','18','19','31','32','33']}
				},
				content_font: {
					title: 'feature_box_content_styling',
					type: 'font'
				},
				width: {
					title: 'width',
					suffix: '',
					default_value: function(){
						return OP_AB.column_width();
					}
				},
				top_margin: {
					title: 'top_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_margin: {
					title: 'bottom_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				top_padding: {
					title: 'top_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_padding: {
					title: 'bottom_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				left_padding: {
					title: 'left_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				right_padding: {
					title: 'right_padding',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				alignment: {
					title: 'alignment',
					type: 'select',
					values: {'left': 'left', 'center': 'center', 'right': 'right'},
					default_value: 'center'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true}
	}
}(opjq));