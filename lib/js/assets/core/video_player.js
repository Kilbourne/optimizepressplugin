;var op_asset_settings = (function($){
    var style_has_ipad_frame = ['2', '3'];
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-video-player.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-video-player.mp4',
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
                        change: function(style) {
                            disableHeightAndWidthInput(style);
                            if (style > '1') {
                                hideBorder();
                            }
                        }
                    }
                }
            },
            step_2: {
                embed_microcopy: {
                    text: 'video_embed_microcopy',
                    type: 'microcopy'
                },
                type: {
                    title: 'type',
                    type: 'select',
                    values: {'embed': 'embed', 'url': 'URL', 'youtube': 'YouTube'},
                    required: true
                },
                content: {
                    title: 'embed',
                    type: 'textarea',
                    format: 'custom',
                    showOn: {field:'step_2.type',value:'embed'}
                },
                url: {
                    title: 'URL (.mp4)',
                    type: 'text',
                    showOn: {field:'step_2.type',value:'url'}
                },
                url1: {
                    title: 'URL (.webm) - not required but recommended to ensure compatibility with most browsers',
                    type: 'text',
                    showOn: {field:'step_2.type',value:'url'}
                },
                url2: {
                    title: 'URL (.ogv) - not required but recommended to ensure compatibility with most browsers',
                    type: 'text',
                    showOn: {field:'step_2.type',value:'url'}
                },
                youtube_url: {
                    title: 'YouTube Video URL',
                    type: 'text',
                    showOn: {field:'step_2.type', value:'youtube'}
                },
                placeholder: {
                    title: 'placeholder',
                    type: 'media',
                    showOn: {field:'step_2.type',value:'url'}
                },
                hide_controls: {
                    title: 'hide_controls',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'url'}
                },
                auto_play: {
                    title: 'auto_play',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'url'}
                },
                auto_buffer: {
                    title: 'auto_buffer',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'url'},
                    help: 'auto_buffer_help'
                },
                dimensions: {
                    title: 'dimensions',
                    type: 'select',
                    default_value: '560x315',
                    values: {'custom': 'Custom', '300x169': '300x169', '460x259': '460x259', '560x315': '560x315', '640x360': '640x360', '853x480': '853x480'},
                    events: {
                        change: function(){
                            var dimensionsSel = $('#op_assets_core_video_player_dimensions');
                            dimensionsSel.change(function(){
                                //For some strange reason :selected isn't working first initially, selected attribute is not even showing if you try to access it with jQuery.
                                var dimOpt = $(this).find('option:selected').val();
                                if (!dimOpt) {
                                    $(this).find('option').each(function() {
                                        if (this.getAttribute('selected') === 'selected') {
                                            $(this).attr('selected', 'selected')[0].selected = true;
                                            dimOpt = $(this).val();
                                        }
                                        return;
                                    });
                                }

                                var wEl = $('#op_assets_core_video_player_width');
                                var hEl = $('#op_assets_core_video_player_height');
                                if (dimOpt=='custom') {
                                    $(this).parent('div').next().show().next().show();
                                } else {
                                    var dimensions = dimOpt.split('x');
                                    wEl.val(dimensions[0]);
                                    hEl.val(dimensions[1]);
                                    $(this).parent('div').next().hide().next().hide();
                                }
                            });
                        }
                    }
                },
                width: {
                    title: 'width',
                    type: 'input',
                    default_value: 560
                },
                height: {
                    title: 'height',
                    type: 'input',
                    default_value: 315
                },
                margin_top: {
                    title: 'margin_top',
                    type: 'input',
                    default_value: 0
                },
                margin_bottom: {
                    title: 'margin_bottom',
                    type: 'input',
                    default_value: 20
                },
                border_size: {
                    title: 'border_size'
                },
                border_color: {
                    title: 'border_color',
                    type: 'color'
                },
                youtube_auto_play: {
                    title: 'auto_play',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'youtube'}
                },
                youtube_hide_controls: {
                    title: 'hide_controls',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'youtube'}
                },
                /*youtube_remove_logo: {
                    title: 'remove_youtube_logo',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'youtube'}
                },*/
                youtube_show_title_bar: {
                    title: 'show_title_bar',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'youtube'}
                },
                /*youtube_force_hd: {
                    title: 'force_hd_mode',
                    type: 'select',
                    showOn: {field:'step_2.type',value:'youtube'},
                    values: {'none': 'None', 'hd720': '720p', 'hd1080': '1080p'}
                },*/
                align: {
                    title: 'alignment',
                    type: 'radio',
                    values: {'left':'left','center':'center','right':'right'},
                    default_value: 'center'
                },
                ipad_color: {
                    title: 'iPad Frame Colour',
                    type: 'select',
                    values: {
                        'black': 'Black',
                        'white': 'White'
                    },
                    default_value: 'black',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_ipad_frame
                    }
                }
            },
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '',
                style  = (attrs.style || 1),
                type = attrs.type || embed,
                content = '',
                tag_attrs = ' type="'+type+'"',
                url_fields = ['hide_controls','auto_play','auto_buffer','placeholder'],
                youtube_fields = ['youtube_hide_controls', 'youtube_auto_play', 'youtube_remove_logo', 'youtube_show_title_bar', 'youtube_force_hd'],
                append = {
                    'style':attrs.style,
                    'dimensions':attrs.dimensions,
                    'width':attrs.width,
                    'height':attrs.height,
                    'align':attrs.align,
                    'margin_top':attrs.margin_top,
                    'margin_bottom':attrs.margin_bottom,
                    'border_size':attrs.border_size,
                    'border_color':attrs.border_color,
                    'ipad_color': attrs.ipad_color
                };

            //disable border size and color
            //if user is swicth to style 2 or 3 from 1
            if (style == '2' || style == '3') {
                append.border_color = '';
                append.border_size = '';
            }

            var dimensionsSel = $('#op_assets_core_video_player_dimensions');
            if (dimensionsSel.find('option:selected').val!='custom'){
                dimensionsSel.parent('div').next('div').hide().next('div').hide();
            }
            if(type == 'url'){
                content = (op_base64encode(attrs.url) || '');
                $.each(url_fields,function(i,v){
                    var val = attrs[v] || '';
                    if(val != ''){
                        tag_attrs += ' '+v+'="'+val.replace( /"/ig,"'")+'"';
                    }
                });
                tag_attrs += ' url1="' + (op_base64encode(attrs.url1) || '') + '"';
                tag_attrs += ' url2="' + (op_base64encode(attrs.url2) || '') + '"';
            } else if (type == 'youtube') {
                content = (op_base64encode(attrs.youtube_url) || '');
                $.each(youtube_fields, function(i, v){
                    var val = attrs[v] || '';
                    if (val != '') {
                        tag_attrs += ' '+v+'="'+val.replace( /"/ig,"'")+'"';
                    }
                });
            } else {
                content = attrs.content || '';
                content = '<img src="'+OptimizePress.imgurl+'video_placeholder.png" alt="'+op_base64encode(content)+'" width="1" height="1" />';
            }


            $.each(append,function(i,v){
                if (v != '') {
                    tag_attrs += ' '+i+'="'+v.replace( /"/ig,"'")+'"';
                }
            });

            str = '[video_player' + tag_attrs + ']' + content + '[/video_player]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            attrs = attrs.attrs;
            var type = attrs.type || 'url',
                style = attrs.style || '1',
                ipad_color = attrs.ipad_color || 'black';

            //set ipad color to black if user switch
            //from style 1 to 2 or 3
            if (!attrs.ipad_color) {
                attrs.ipad_color = ipad_color;
            }

            if (type == 'url') {
                attrs.content ? $('#op_assets_core_video_player_url').val(op_base64decode(attrs.content) || '') : '';
                attrs.url1 ? $('#op_assets_core_video_player_url1').val(op_base64decode(attrs.url1) || '') : '';
                attrs.url2 ? $('#op_assets_core_video_player_url2').val(op_base64decode(attrs.url2) || '') : '';
            } else if (type == 'youtube') {
                attrs.content ? $('#op_assets_core_video_player_youtube_url').val(op_base64decode(attrs.content) || '') : '';
            } else {
                attrs.content ? $('#op_assets_core_video_player_content').val(op_base64decode($(attrs.content).attr('alt')) || '') : '';
            }

            steps[1].find(':radio[value="'+(attrs.align || 'center')+'"]').attr('checked',true);
            delete attrs.type;
            delete attrs.content;
            delete attrs.align;
            delete attrs.url1;
            delete attrs.url2;

            OP_AB.set_selector_value('op_assets_core_video_player_style_container', style);
            steps[1].find('select').val(type).trigger('change');

            $.each(attrs,function(i,v){
                if (i == 'hide_controls' || i == 'auto_play' || 
                    i == 'auto_buffer' || i == 'youtube_hide_controls' || 
                    i == 'youtube_auto_play' || i == 'youtube_remove_logo' || i == 'youtube_show_title_bar') {

                    $('#op_assets_core_video_player_'+i).attr('checked',(v=='Y')).trigger('change');
                } else if (i == 'placeholder') {
                    OP_AB.set_uploader_value('op_assets_core_video_player_' + i, v);
                } else {
                    $('#op_assets_core_video_player_'+i).val(v).trigger('change');
                }
            });


            disableHeightAndWidthInput(style);
        }
    };
}(opjq));

/*
 *  Disable height and width input for style with iPad frame 
 *  because we have fix iPad frame png resolutions
 */
function disableHeightAndWidthInput(style) {
    if (style > '1') {
        var widthElem = opjq('#op_assets_core_video_player_width');
        var heightElem = opjq('#op_assets_core_video_player_height');

        widthElem.prop('disabled', true);
        heightElem.prop('disabled', true);

        var widthVal = widthElem.val();

        //If user switch from other styles to style 2 or 3 we need to 
        //reset custom set resolutions
        if (false === (widthVal == '853' || widthVal == '640' || widthVal == '560' || widthVal == '460' || widthVal == '300')) {
            opjq("#op_assets_core_video_player_dimensions").val('560x315').trigger('change');
        }
        opjq("#op_assets_core_video_player_dimensions option[value='custom']").prop('disabled', true);

    } else {
        opjq('#op_assets_core_video_player_width').prop('disabled', false);
        opjq('#op_assets_core_video_player_height').prop('disabled', false);
        opjq("#op_assets_core_video_player_dimensions option[value='custom']").prop('disabled', false); 
    }
}

/*
 * For styles  above 1 we forse to hide
 * border size and color input because in assets.css
 * that inputs have display: inline-block !important;
 */
function hideBorder(){
    opjq('.field-id-op_assets_core_video_player_border_size').attr('style','display:none !important');
    opjq('.field-id-op_assets_core_video_player_border_color').attr('style','display:none !important');
}
