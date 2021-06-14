;var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: '',
                width: '600',
                height: '341'
            },
            step_2: {
                url: '',
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
                display_type: {
                    title: 'Display',
                    type: 'select',
                    values: {'icon': 'Icon', 'upload': 'Upload Icon', 'text': 'Text'},
                    default: 'icon',
                    required: true
                },
                icon: {
                    title: 'icon',
                    type: 'image-selector',
                    folder: 'icons',    
                    selectorClass: 'icon-view-80',
                    asset: ['core', 'video_player_fullscreen'],
                    showOn: {
                        field:'step_2.display_type',
                        value:'icon'
                    }
                },
                upload_icon: {
                    title: 'file',
                    type: 'media',
                    showOn: {
                        field:'step_2.display_type',
                        value:'upload'
                    }
                },
                text: {
                    title: 'text',
                    type: 'text',
                    showOn: {
                        field:'step_2.display_type',
                        value:'text'
                    }
                },
                type: {
                    title: 'type',
                    type: 'select',
                    values: {'url': 'URL', 'youtube': 'YouTube'},
                    required: true
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
                auto_buffer: {
                    title: 'Auto Buffering',
                    type: 'checkbox',
                    showOn: {field:'step_2.type',value:'url'},
                    help: 'auto_buffer_help'
                },
                align: {
                    title: 'alignment',
                    type: 'radio',
                    values: {'left':'left','center':'center','right':'right'},
                    default_value: 'center'
                }
            },
        },
        insert_steps: {2:true},
        customInsert: function(attrs) {
            var str = '',
                style = attrs.style,
                icon = attrs.icon,
                type = attrs.type || embed,
                content = '',
                tag_attrs = ' type="' + type + '"',
                url_fields = ['auto_buffer'],
                append = {
                    'align': attrs.align,
                    'text': attrs.text,
                    'upload_icon': attrs.upload_icon,
                    'display_type': attrs.display_type
                };


            if (type == 'url') {
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
            }

            $.each(append,function(i,v){
                if (v != '') {
                    tag_attrs += ' '+i+'="'+v.replace( /"/ig,"'")+'"';
                }
            }); 

            str = '[video_player_fullscreen' + tag_attrs + ' icon="' + icon + '"]' + content + '[/video_player_fullscreen]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps) {
            attrs = attrs.attrs;
            var type = attrs.type || 'url',
                style = attrs.style || '1',
                display_type = attrs.display_type || 'icon';

            if (type == 'url') {
                attrs.content ? $('#op_assets_core_video_player_fullscreen_url').val(op_base64decode(attrs.content) || '') : '';
                attrs.url1 ? $('#op_assets_core_video_player_fullscreen_url1').val(op_base64decode(attrs.url1) || '') : '';
                attrs.url2 ? $('#op_assets_core_video_player_fullscreen_url2').val(op_base64decode(attrs.url2) || '') : '';
            } else if (type == 'youtube') {
                attrs.content ? $('#op_assets_core_video_player_fullscreen_youtube_url').val(op_base64decode(attrs.content) || '') : '';
            } else {
                attrs.content ? $('#op_assets_core_video_player_fullscreen_content').val(op_base64decode($(attrs.content).attr('alt')) || '') : '';
            }

            //set choosen style
            OP_AB.set_selector_value('op_assets_core_video_player_fullscreen_style_container', style);

            //Set choosen icon
            var icon = $('#op_assets_core_video_player_fullscreen_icon_container');
            OP_AB.set_selector_value(icon.attr('id'),(attrs.icon || ''));
           
            //Set uploaded icon
            OP_AB.set_uploader_value('op_assets_core_video_player_fullscreen_upload_icon', attrs.upload_icon);

            steps[1].find(':radio[value="'+(attrs.align || 'center')+'"]').attr('checked',true);
            delete attrs.type;
            delete attrs.content;
            delete attrs.url1;
            delete attrs.url2;

            steps[1].find('select').val(type).trigger('change');

            $.each(attrs,function(i,v){
                if (i == 'auto_buffer') {
                    $('#op_assets_core_video_player_fullscreen_' + i).attr('checked',(v=='Y')).trigger('change');
                } else {
                    $('#op_assets_core_video_player_fullscreen_' + i).val(v).trigger('change');
                }
            });
        }
    };
}(opjq));

