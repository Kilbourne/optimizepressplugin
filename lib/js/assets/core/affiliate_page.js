var op_asset_settings = (function($){
	var img_styles = [1],
		embed_styles = [2];

	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-affiliateSnippets.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-affiliateSnippets.mp4',
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
							img.src = v;
						}
					},
					showOn: {field: 'step_1.style', value: img_styles}
				},
				description: {
					title: 'description',
					showOn: {field: 'step_1.style', value: img_styles}
				},
				affiliate_link: {
					title: 'affiliate_link',
					showOn: {field: 'step_1.style', value: img_styles}
				},
				embed_code: {
					title: 'embed',
					type: 'textarea',
					showOn: {field: 'step_1.style', value: embed_styles}

				}
			}
		},
		insert_steps: {2:true},
		customInsert: function(attrs){
			var str = '',
				style = (attrs.style || 1),
				image = (attrs.image || ''),
				description = (encodeURIComponent(attrs.description) || ''),
				affiliate_link = (encodeURIComponent(attrs.affiliate_link) || ''),
				embed_code = $.base64.encode(attrs.embed_code || '');

			str = (style==1 ?
			       '[affiliate_page style="' + style + '" image="' + image + '" description="' + description + '" affiliate_link="' + affiliate_link + '"][/affiliate_page]' :
			       '[affiliate_page style="' + style + '" embed_code="' + embed_code + '"][/affiliate_page]');

			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			var style = (attrs.style || 1),
				image = (attrs.image || ''),
				description = op_decodeURIComponent(attrs.description),
				affiliate_link = op_decodeURIComponent(attrs.affiliate_link),
				embed_code = $.base64.decode(attrs.embed_code || '');

			//Set the style
			OP_AB.set_selector_value('op_assets_core_affiliate_page_style_container', style);

			//Check if this style is for a generated embed code or one that the user enters
			if (style==1){
				//Set the image
				OP_AB.set_uploader_value('op_assets_core_affiliate_page_image', attrs.image);

				//Set the description
				$('#op_assets_core_affiliate_page_description').val(description);

				//Set the affiliate link
				$('#op_assets_core_affiliate_page_affiliate_link').val(affiliate_link);
			} else {
				//Set the embed code
				$('#op_assets_core_affiliate_page_embed_code').val(embed_code);
			}
		}
	};
}(opjq));