var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-image-js-alert.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
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
				text: {
					title: 'alert_text',
				}
			}
		},
		insert_steps: {1:true}
	};
}(opjq));