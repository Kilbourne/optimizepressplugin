;var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-images.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-images.mp4',
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
						if (v != ''){
							var img = new Image();
							$(img).load(function(){
								$('#op_assets_core_images_width').val(img.width);
							});
							img.src = v;
						}
					}
				},
				large_image: {
					title: 'large_image',
					type: 'media'
				},
				custom_width: {
					title: 'asset_images_custom_width',
					type: 'checkbox',
					default_value: false,
					events: {
						change: function(e){
							$isChecked = $(this).is(':checked');//($('#op_assets_core_images_first_load').val()!='true' ? $(this).is(':checked') : !$(this).is(':checked'));

							if ($isChecked){
								$('#op_assets_core_images_width').parent().hide();
								$('#op_assets_core_images_custom_width_val').parent().show();
							} else {
								$('#op_assets_core_images_width').parent().show();
								$('#op_assets_core_images_custom_width_val').parent().hide();
							}
						}
					}
				},
				width: {
					title: 'width'
				},
				custom_width_val: {
					title: 'width'
				},
				caption: {
					title: 'caption'
				},
				link_url: {
					title: 'link_url'
				},
				new_window: {
					title: 'new_window',
					type: 'checkbox'
				},
				align: {
					title: 'alignment',
					type: 'radio',
					values: {'left':'left','center':'center','right':'right'},
					default_value: 'center'
				},
				top_margin: {
					title: 'top_margin',
					suffix: '',
					addClass: 'pixel-width-field',
					default_value: 0
				},
				bottom_margin: {
					title: 'bottom_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				left_margin: {
					title: 'left_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				right_margin: {
					title: 'right_margin',
					suffix: '',
					addClass: 'pixel-width-field'
				},
				alt_text: {
					title: 'alt_text'
				},
				full_width: {
					title: 'full_width',
					type: 'checkbox',
					default_value: true
				},
				first_load: {
					type: 'hidden',
					value: 'true'
				}
			}
		},
		insert_steps: {2:true},
		customSettings: function(attrs,steps){
			attrs = attrs.attrs;
			//console.log(attrs);
			var isCustomWidth = (typeof(attrs.custom_width)=='undefined' ? false : true),
				isFullWidth = (typeof(attrs.full_width)=='undefined' ? false : true),
				align = attrs.align || 'center';

			//Set the style
			OP_AB.set_selector_value('op_assets_core_images_style_container', attrs.style);

			//Set the image uploader values
			OP_AB.set_uploader_value('op_assets_core_images_image', op_decodeURIComponent(attrs.image));
			OP_AB.set_uploader_value('op_assets_core_images_large_image', op_decodeURIComponent(attrs.large_image));

			//Set custom width checkbox
			$('#op_assets_core_images_custom_width').prop('checked', isCustomWidth);

			//Set the image width
			$('#op_assets_core_images_width').val(attrs.width);

			//Set the custom image width
			$('#op_assets_core_images_custom_width_val').val(attrs.custom_width_val);

			//Show/hide correct textboxes
			if (isCustomWidth){
				$('#op_assets_core_images_width').parent().hide();
				$('#op_assets_core_images_custom_width_val').parent().show();
			} else {
				$('#op_assets_core_images_width').parent().show();
				$('#op_assets_core_images_custom_width_val').parent().hide();
			}

			//Set the caption
			$('#op_assets_core_images_caption').val(op_decodeURIComponent(attrs.caption));

			//Set the link URL
			$('#op_assets_core_images_link_url').val(op_decodeURIComponent(attrs.link_url));

			// Set new window checkbox
			//console.log(attrs.new_window);
			$('#op_assets_core_images_new_window').attr('checked', attrs.new_window == 'Y' ? true : false);

			//Set the margins
			$('#op_assets_core_images_top_margin').val(attrs.top_margin);
			$('#op_assets_core_images_bottom_margin').val(attrs.bottom_margin);
			$('#op_assets_core_images_left_margin').val(attrs.left_margin);
			$('#op_assets_core_images_right_margin').val(attrs.right_margin);

			//Set the alt text
			$('#op_assets_core_images_alt_text').val(op_decodeURIComponent(attrs.alt_text));

			//Set align option
			$('input[name="op_assets_core_images_align[]"]').each(function(){
				if ($(this).val()==align) $(this).prop('checked', true);
				//console.log($(this).val());
				//console.log(align);
			});

			//Set full width
			$('#op_assets_core_images_full_width').prop('checked', isFullWidth);
		}
	};
}(opjq));