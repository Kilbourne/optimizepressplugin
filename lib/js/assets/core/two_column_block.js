var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-2colText.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-2colText.mp4',
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
				content1: {
					title: 'column_text',
					type: 'wysiwyg'
				},
				content2: {
					title: 'column_text',
					type: 'wysiwyg'
				}
			}
		},
		customInsert: function(attrs){
			var str = '[two_column_block style="'+attrs.style+'"] [content1]'+(attrs.content1 || '')+'[/content1] [content2]'+(attrs.content2 || '')+'[/content2] [/two_column_block]';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			OP_AB.set_selector_value('op_assets_core_two_column_block_style_container',attrs.style);
			var chks = ['content1','content2'], content = '';
			for(var i=0;i<2;i++){
				content = '';
				if(attrs[chks[i]].length > 0){
					content = attrs[chks[i]][0].attrs.content;
				}
				OP_AB.set_wysiwyg_content('op_assets_core_two_column_block_'+chks[i],content);
			};
		},
		insert_steps: {2:true}
	};
}(opjq));