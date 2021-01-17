var op_asset_settings = (function($){
    return {
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: 'previews',
                    addClass: 'op-disable-selected'
                }
            },
            step_2: {
                microcopy: {
                    text: 'countdown_cookie_timer_instructions',
                    type: 'microcopy'
                },
                length_of_time: {
                    title: 'length_of_time'
                },
                length_of_time_suffix: {
                    title: 'length_of_time_suffix',
                    type: 'select',
                    values: {'minutes': 'Minutes', 'hours': 'Hours', 'days': 'Days'}
                },
                redirect_url: {
                    title: 'redirect_url'
                }
            }
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '',
                style = (attrs.style || 1),
                length_of_time = (attrs.length_of_time || ''),
                length_of_time_suffix = (attrs.length_of_time_suffix || ''),
                redirect_url = (attrs.redirect_url || '');

            str = '[countdown_cookie_timer style="' + style + '" length_of_time="' + length_of_time + '" length_of_time_suffix="' + length_of_time_suffix + '" redirect_url="' + redirect_url + '"][/countdown_cookie_timer]';

            //Clear out any cookies that might exist for this page
            document.cookie = 'op_countdown_cookie_timer_end_date=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
            document.cookie = 'op_countdown_cookie_timer_redirect_url=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
            document.cookie = 'op_countdown_cookie_timer_length_of_time=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
            document.cookie = 'op_countdown_cookie_timer_length_of_time_suffix=; expires=Thu, 01-Jan-70 00:00:01 GMT;';

            OP_AB.insert_content(str);
            $.fancybox.close();

            //Init countdown
            setTimeout(function(){
                //Find each timer instance
                $('div.countdown-cookie-timer').each(function(){
                    //Extract date and time
                    var obj = $(this),
                        data = obj.data('end').split(' '),
                        date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                        time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                        newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                        labels = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                        labels1 = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
                        width = 0,
                        widthOffset = 9;

                    //Download the script if it isn't loaded and initiate countdown
                    $.getScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, function(){
                        //Init countdown
                        obj.countdown({
                            until: newDateObj,
                            format: 'yodhms',
                            labels: labels,
                            labels1: labels1
                        });

                        //Get countdown sections and add each width to width variable
                        obj.find('span.countdown_section, span.countdown_row').each(function(){
                            width += $(this).width() + widthOffset;
                        });

                        //Set width to main obj
                        obj.width(width + 'px');
                    });
                });
            }, 1000);
        },
        customSettings: function(attrs,steps){
            attrs = attrs.attrs;
            var style = (attrs.style || 1),
                length_of_time = (attrs.length_of_time || ''),
                length_of_time_suffix = (attrs.length_of_time_suffix || ''),
                redirect_url = (attrs.redirect_url || '');

            //Set the style
            OP_AB.set_selector_value('op_assets_core_countdown_cookie_timer_style_container', style);

            //Set the date
            $('#op_assets_core_countdown_cookie_timer_length_of_time').val(length_of_time);

            //Set date select
            $('#op_assets_core_countdown_cookie_timer_length_of_time_suffix').find('option').each(function(){
                if ($(this).val()==length_of_time_suffix) $(this).attr('selected', 'selected');
            });

            //Set the redirect URL
            $('#op_assets_core_countdown_cookie_timer_redirect_url').val(redirect_url);
        }
    };
}(opjq));