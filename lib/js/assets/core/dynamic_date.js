var op_asset_settings = (function($){
	return {
		help_vids: {
			step_1: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-dynamic-date.mp4',
				width: '600',
				height: '341'
			},
			step_2: {
				url: 'http://op2-inapp.s3.amazonaws.com/elements-dynamic-date.mp4',
				width: '600',
				height: '341'
			}
		},
		attributes: {
			step_1: {
				style: {
					type: 'style-selector',
					folder: '',
					addClass: 'op-disable-selected',
                    events: {
                        'change': function(value) {
                            if (value === '1') {
                                $('#op_assets_core_dynamic_date_date_format').val('jS F Y');
                            } else {
                                $('#op_assets_core_dynamic_date_date_format').val('F d\\, Y');
                            }
                        }
                    }
				}
			},
			step_2: {
				date_format: {
					title: 'date_format',
					type: 'text'
					/*default_value: date_style('1')*/
				},
				before: {
					title: 'before',
					type: 'text'
				},
				after: {
					title: 'after',
					type: 'text'
				},
				microcopy: {
					text: 'date_format_microcopy',
					type: 'microcopy'
				},
				links: {
					type: 'custom_html',
					html: generate_table
				}
			}
		},
		customInsert: function(attrs){
			var str = '[dynamic_date date_format="'+attrs.date_format.replace(/\\/g,'\\\\')+'" before="'+encodeURIComponent(attrs.before)+'" after="'+encodeURIComponent(attrs.after)+'"]';
			OP_AB.insert_content(str);
			$.fancybox.close();
		},
		onGenerateComplete: function(steps){
			var input = $('#op_assets_core_dynamic_date_date_format');
			steps[1].find('table a').click(function(e){
				e.preventDefault();
				input.val(input.val()+$(this).text()+' ');
			});
		},
		insert_steps: {2:true}
	};
	function generate_table(){
		var cols = [
			['Day',false],
			['d','Day of the month, 2 digits with leading zeros','01 to 31'],
			['D','A textual representation of a day, three letters','Mon through Sun'],
			['j','Day of the month without leading zeros','1 to 31'],
			['l','A full textual representation of the day of the week','Sunday through Saturday'],
			['S','English ordinal suffix for the day of the month, 2 characters','st, nd, rd or th. Works well with j'],
			['Month',false],
			['F','A full textual representation of a month, such as January or March','January through December'],
			['m','Numeric representation of a month, with leading zeros','01 through 12'],
			['M','A short textual representation of a month, three letters','Jan through Dec'],
			['n','Numeric representation of a month, without leading zeros','1 through 12'],
			['Year',false],
			['Y','A full numeric representation of a year, 4 digits','Examples: 1999 or 2003'],
			['y','A two digit representation of a year','Examples: 99 or 03'],
			['Time',false],
			['a','Lowercase Ante meridiem and Post meridiem','am or pm'],
			['A','Uppercase Ante meridiem and Post meridiem','AM or PM'],
			['g','12-hour format of an hour without leading zeros','1 through 12'],
			['G','24-hour format of an hour without leading zeros','0 through 23'],
			['h','12-hour format of an hour with leading zeros','01 through 12'],
			['H','24-hour format of an hour with leading zeros','00 through 23'],
			['i','Minutes with leading zeros','00 to 59'],
			['s','Seconds, with leading zeros','00 through 59']
		];
		var str = '<table><thead><tr><th>'+OP_AB.translate('Format')+'</th><th>'+OP_AB.translate('Description')+'</th><th>'+OP_AB.translate('Example Returned Values')+'</th></tr></thead><tbody>';
		for(var i=0,il=cols.length;i<il;i++){
			str += '<tr>';
			if(typeof cols[i][1] == 'boolean' && cols[i][1] === false){
				str += '<td colspan="3"><strong>'+cols[i][0]+'</strong></td></tr>';
			} else {
				str += '<td><strong><a href="#'+cols[i][0]+'">'+cols[i][0]+'</a></strong></td><td>'+cols[i][1]+'</td><td>'+cols[i][2]+'</td></tr>';
			}
		}

		str += '</tbody></table>';
		return str;
	}
}(opjq));