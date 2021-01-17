var op_asset_settings = (function ($) {
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-audioPlayer.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-audioPlayer.mp4',
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
				url: {
					title: 'URL (.mp3)',
					type: 'text'
				},
				auto_play: {
					title: 'auto_play',
					type: 'checkbox'
				},
				url1: {
					title: 'URL (.ogg) - not required but recommended to ensure compatibility with most browsers',
					type: 'text'
				},
				url2: {
					title: 'URL (.wav) - not required but recommended to ensure compatibility with most browsers',
					type: 'text'
				}
			}
		},
		insert_steps: {2:true}
	}
}(opjq));