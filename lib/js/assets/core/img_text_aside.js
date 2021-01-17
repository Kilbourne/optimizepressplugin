var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-image-text-aside.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-image-text-aside.mp4',
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
				image: {
					title: 'image',
					type: 'media',
					callback: function(){
						var v = $(this).val();
						if(v != ''){
							var img = new Image();
							/*$(img).load(function(){
								$('#op_assets_core_img_alert_width').val(img.width);
							});*/
							img.src = v;
						}
					}
				},
				image_alignment: {
					title: 'image_alignment',
					type: 'select',
					values: {'left': 'left', 'right': 'right'},
					default_value: 'right'
				},
				headline: {
					title: 'headline'
				},
				text: {
					title: 'text',
					type: 'wysiwyg'
				},
				alignment: {
					title: 'text_alignment',
					type: 'select',
					values: {'left': 'left', 'center': 'center', 'right': 'right'},
					default_value: 'center'
				}
			}
		},
		insert_steps: {2:true},
		customInsert: function(attrs){
			var str = '',
				style = attrs.style,
				image = attrs.image,
				image_alignment = attrs.image_alignment,
				headline = encodeURIComponent(attrs.headline),
				text = attrs.text,
				alignment = attrs.alignment;

			str = '[img_text_aside style="' + style + '" image="' + image + '" image_alignment="' + image_alignment + '" headline="' + headline + '" alignment="' + alignment + '"]' + text + '[/img_text_aside]';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			var style = attrs.style || 1,
				image = attrs.image,
				image_alignment = attrs.image_alignment,
				headline = op_decodeURIComponent(attrs.headline),
				text = typeof attrs.content != 'undefined' ? attrs.content : op_decodeURIComponent(attrs.text),
				alignment = attrs.alignment,
				preview_html = '';

			//Set the style
			OP_AB.set_selector_value('op_assets_core_img_text_aside_style_container',style);

			//Generate image preview HTML
			preview_html = '<a class="preview-image" target="_blank" href="' + image + '"><img alt="uploaded-image" src="' + image + '"></a><a class="remove-file" href="#remove">Remove Image</a>';

			//Set the image in the hidden input and preview area
			$('.op-settings-core-img_text_aside .op-file-uploader .op-uploader-value').val(image).next('.file-preview').find('.content').html(preview_html);

			//Set image alignment option
			$('#op_assets_core_img_text_aside_image_alignment').find('option').each(function(){
				if ($(this).val()==attrs.image_alignment) $(this).attr('selected', 'selected');
			});

			//Set the headline
			$('#op_assets_core_img_text_aside_headline').val(headline);

			//Set WYSIWYG content
			OP_AB.set_wysiwyg_content(steps[1].find('textarea').attr('id'), text);

			//Set alignment option
			$('#op_assets_core_img_text_aside_alignment').find('option').each(function(){
				if ($(this).val()==attrs.alignment) $(this).attr('selected', 'selected');
			});
		}
	};
}(opjq));