var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-calendar-date-time.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-calendar-date-time.mp4',
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
				month: {
					title: 'month',
					default_value: 'June'
				},
				calendar_bar_color: {
					title: 'calendar_bar_color',
					type: 'color',
					default_value: '#ff0000',
					addClass: 'end-row'
				},
				day: {
					title: 'day',
					default_value: '25'
				},
				full_date: {
					title: 'full_date',
					addClass: 'end-row',
					default_value: 'Friday, 25th June'
				},
				time_1: {
					title: 'time_1'
				},
				timezone_1: {
					title: 'timezone_1',
					addClass: 'end-row'
				},
				time_2: {
					title: 'time_2'
				},
				timezone_2: {
					title: 'timezone_2',
					addClass: 'end-row'
				},
				time_3: {
					title: 'time_3'
				},
				timezone_3: {
					title: 'timezone_3',
					addClass: 'end-row'
				}
			}
		},
		insert_steps: {2:true}
	};
}(opjq));