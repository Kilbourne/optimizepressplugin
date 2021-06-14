var op_asset_settings = (function($){
	var disable_focus = false;
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-bullet-block.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-bullet-block.mp4',
				width: '600',
				height: '341'
			},
			step_3: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-bullet-block.mp4',
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
				small_icon: {
					title: 'small_icon',
					type: 'image-selector',
					folder: '16x16',
					showOn: {field:'step_1.style',value:'size-16',type:'style-selector'},
					selectorClass: 'icon-view-16',
					events: { change: function(value, steps) {
						// removing custom icon image
						$('.field-id-op_assets_core_bullet_block_upload_icon .remove-file').trigger('click');
						}
					}
				},
				large_icon: {
					title: 'large_icon',
					type: 'image-selector',
					folder: '32x32',
					showOn: {field:'step_1.style',value:'large',type:'style-selector'},
					selectorClass: 'icon-view-32',
					events: { change: function(value, steps) {
						// removing custom icon image
						$('.field-id-op_assets_core_bullet_block_upload_icon .remove-file').trigger('click');
						}
					}
				},
				upload_icon: {
					title: 'bullet_upload_icon',
					type: 'media',
					callback: function(){
						var v = $(this).val();
						if (v != ''){
							var img = new Image();
							img.src = v;
						}
					}
				},
				items: {
					title: 'list_items',
					type: 'multirow',
					multirow: {
						remove_row: 'after',
						attributes: {
							content: {
								title: 'text',
								events: {
									keypress: function(e){
										var k = e.keyCode || e.which;
										if(k == 13){
											$(this).closest('.multirow-container').next().find('a').trigger('click');
										}
									}
								}
							}
						},
						onAdd: function(steps){
							if(!disable_focus){
								$(this).find('input').focus();
							}
						}
					}
				}
			},
			step_3: {
				microcopy: {
					text: 'bullet_block_advanced1',
					type: 'microcopy'
				},
				microcopy2: {
					text: 'advanced_warning_2',
					type: 'microcopy',
					addClass: 'warning'
				},
				font: {
					title: 'bullet_font_settings',
					type: 'font'
				},
				width: {
					title: 'width',
					type: 'input',
					default_value: ''
				},
				microcopy_align: {
					text: 'width_needed_for_alignment_to_work',
					type: 'microcopy'
				},
				alignment: {
					title: 'alignment',
					type: 'select',
					values: {'left': 'left', 'center': 'center', 'right': 'right'},
					default_value: 'center'
				}
			}
		},
		insert_steps: {2:{next:'advanced_options'},3:true},
		customInsert: function(attrs){
			var str = '', content = '';
			$.each(attrs.items,function(i,v){
				v = v.content || '';
				content += '<li>'+v+'</li>';
			});
			$.each(attrs.font,function(i,v){
				if(v != ''){
					str += ' font_'+i+'="'+v.replace(/"/ig,"'")+'"';
				}
			});
			str = '[bullet_block '+(attrs.upload_icon.length>0?'upload_icon="'+attrs.upload_icon+'"':'')+(attrs.style=='large'?' large_icon="'+attrs.large_icon+'"':' style="'+attrs.style+'" small_icon="'+attrs.small_icon+'"')+ ' width="' + attrs.width + '" alignment="' + attrs.alignment + '"' +str+']<ul>'+content+'</ul>[/bullet_block]';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			var style = attrs.style || 'large',
				content = attrs.content || '',
				img,
				lis = [],
				lilength = 0,
				add_link = steps[1].find('.field-id-op_assets_core_bullet_block_items a.new-row'),
				li_inputs = steps[1].find('.field-id-op_assets_core_bullet_block_items-multirow-container');
			OP_AB.set_selector_value('op_assets_core_bullet_block_style_container',style);
			OP_AB.set_uploader_value('op_assets_core_bullet_block_upload_icon', attrs.upload_icon);
			if(style == 'size-16'){
				style = 'small';
				img = attrs[style+'_icon'] || ''
			} else {
				img = attrs.large_icon || '';
			}
			OP_AB.set_selector_value('op_assets_core_bullet_block_'+style+'_icon_container',img);
			OP_AB.set_font_settings('font',attrs,'op_assets_core_bullet_block_font');
			$('<div />').append(content).find('ul:first > li').each(function(){
				lis.push($(this).html());
			});
			lilength = lis.length;
			disable_focus = true;
			for(var i=0;i<lilength;i++){
				add_link.trigger('click');
				li_inputs.find(':input:last').val(lis[i]);
			};
			disable_focus = false;

			$('#op_assets_core_bullet_block_width').val(OP_AB.unautop(attrs.width || ''));
			$('#op_assets_core_bullet_block_alignment').find('option').each(function(){
				if ($(this).val()==attrs.alignment) $(this).attr('selected', 'selected');
			});
		}
	};
}(opjq));
