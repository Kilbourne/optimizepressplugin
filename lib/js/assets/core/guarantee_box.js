var op_asset_settings = (function($){
	var hasContent = ['10','11','12','13'];
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-guarantee-box.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-guarantee-box.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-guarantee-box.mp4',
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
							if($.inArray(value,hasContent) < 0){
								OP_AB.trigger_insert();
								return false;
							}
						}
					}
				}
			},
			step_2: {
				title: {
					title: 'title',
					showOn: {field:'step_1.style',value:hasContent}
				},
				content: {
					title: 'content',
					type: 'wysiwyg',
					showOn: {field:'step_1.style',value:hasContent}
				}
			},
			step_3: {
				microcopy: {
					text: 'guarantee_box_advanced1',
					type: 'microcopy'
				},
				microcopy2: {
					text: 'advanced_warning_2',
					type: 'microcopy',
					addClass: 'warning'
				},
				font: {
					title: 'guarantee_box_title_styling',
					type: 'font',
					showOn: {field:'step_1.style',value:hasContent}
				},
				content_font: {
					title: 'guarantee_box_content_styling',
					type: 'font',
					showOn: {field:'step_1.style',value:hasContent}
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true},
		customInsert: function(attrs){
			var style = attrs.style || '', attrs_str = '', str = '';
			style = parseInt(style);
			if(style >= 10 && style <= 13){
				$.each(['font','content_font'],function(i,v){
					$.each(attrs[v],function(i2,v2){
						if(v2 != ''){
							attrs_str += ' '+v+'_'+i2+'="'+v2.replace(/"/ig,"'")+'"';
						}
					});
				});
				var title = attrs.title || '',
					content = attrs.content || '';
				str = '[guarantee_content style="'+style+'" title="'+title.replace(/"/ig,"'")+'"'+attrs_str+']'+content+'[/guarantee_content]';
			} else {
				str = '[guarantee_box style="'+style+'"]';
			}
			str += '';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		default_slide: function(steps){
			if($.inArray(OP_AB.get_selector_value('op_assets_core_guarantee_box_style_container'),hasContent) > -1){
				return 3;
			} else {
				return 2;
			}
		}
	};
}(opjq));