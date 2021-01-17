var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-text-block.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-text-block.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-text-block.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'image-selector',
					folder: '',
					addClass: 'op-disable-selected'
				}
			},
			step_2: {
				content: {
					title: 'content',
					help: 'text_block_content',
					helpPosition: 'top',
					type: 'wysiwyg'
				}
			},
			step_3: {
				align: {
					title: 'alignment',
					type: 'radio',
					values: {'left':'left','center':'center','right':'right'},
					default_value: 'left'
				},
				font: {
					title: 'text_block_font_settings',
					type: 'font'
				},
				top_padding: {
					title: 'text_block_top_padding',
					help: 'text_block_padding_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_padding: {
					title: 'text_block_bottom_padding',
					help: 'text_block_padding_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				left_padding: {
					title: 'text_block_left_padding',
					help: 'text_block_padding_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				right_padding: {
					title: 'text_block_right_padding',
					help: 'text_block_padding_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				top_margin: {
					title: 'text_block_top_margin',
					help: 'text_block_top_margin_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				bottom_margin: {
					title: 'text_block_bottom_margin',
					help: 'text_block_bottom_margin_help',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				width: {
					title: 'text_block_width',
					suffix: '',
					/*default_value:  function(){
						return OP_AB.column_width();
					},*/
					addClass: 'pixel-width-field'
				},
				line_height: {
					title: 'line_height',
					suffix: '',
					addClass: 'pixel-width-field'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true}
	}
}(opjq));