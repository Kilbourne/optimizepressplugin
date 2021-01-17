;var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-video-Thumb-lightbox.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-video-Thumb-lightbox.mp4',
                width: '600',
                height: '341'
            }
        },
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: '',
                    addClass: 'op-disable-selected'
                }
            },
            step_2: {
                embed_microcopy: {
                    text: 'video_embed_microcopy',
                    type: 'microcopy'
                },
                placeholder: {
                    title: 'placeholder_image',
                    type: 'media',
                    callback: function(){
                        var v = $(this).val();
                        if(v != ''){
                            var img = new Image();
                            $(img).load(function(){
                                $('#op_assets_core_video_lightbox_placeholder_width').val(img.width);
                                $('#op_assets_core_video_lightbox_placeholder_height').val(img.height);
                            });
                            img.src = v;
                        }
                    }
                },
                placeholder_width: {
                    title: 'placeholder_width',
                    type: 'input'
                },
                placeholder_height: {
                    title: 'placeholder_height',
                    type: 'input'
                },
                type: {
                    title: 'video_type',
                    type: 'select',
                    values: {'embed': 'embed', 'url': 'URL'}
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
                width: {
                    title: 'width',
                    type: 'input',
                    default_value: 511
                },
                height: {
                    title: 'height',
                    type: 'input',
                    default_value: 288
                },
                align: {
                    title: 'alignment',
                    type: 'radio',
                    values: {'left':'left','center':'center','right':'right'},
                    default_value: 'center'
                }
            }
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '',
                type = attrs.type || embed,
                content = '',
                tag_attrs = ' type="'+type+'" style="' + attrs.style + '"',
                url_fields = ['hide_controls','auto_play','auto_buffer'],
                append = {'width':attrs.width,'height':attrs.height,'placeholder':attrs.placeholder,'placeholder_width':attrs.placeholder_width,'placeholder_height':attrs.placeholder_height,'align':attrs.align};
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
            } else {
                content = attrs.content || '';
                content = '<img src="'+OptimizePress.imgurl+'video_placeholder.png" alt="'+op_base64encode(content)+'" width="1" height="1" />';
            }
            $.each(append,function(i,v){
                if(v != ''){
                    tag_attrs += ' '+i+'="'+v.replace( /"/ig,"'")+'"';
                }
            });
            str = '[video_lightbox'+tag_attrs+']'+content+'[/video_lightbox]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            attrs = attrs.attrs;
            var style = attrs.style;
            OP_AB.set_selector_value('op_assets_core_video_lightbox_style_container',style);
            var type = attrs.type || 'url';
            if(type == 'url'){
                attrs.content ? $('#op_assets_core_video_lightbox_url').val(op_base64decode(attrs.content)) : '';
                attrs.url1 ? $('#op_assets_core_video_lightbox_url1').val(op_base64decode(attrs.url1) || '') : '';
                attrs.url2 ? $('#op_assets_core_video_lightbox_url2').val(op_base64decode(attrs.url2) || '') : '';
            } else {
                attrs.content ? $('#op_assets_core_video_lightbox_content').val(op_base64decode($(attrs.content).attr('alt')) || '') : '';
            }
            OP_AB.set_uploader_value('op_assets_core_video_lightbox_placeholder',attrs.placeholder,false);
            steps[1].find(':radio[value="'+(attrs.align || 'center')+'"]').attr('checked',true);
            delete attrs.placeholder;
            delete attrs.type;
            delete attrs.content;
            delete attrs.align;
            delete attrs.url1;
            delete attrs.url2;
            steps[1].find('select').val(type).trigger('change');
            $.each(attrs,function(i,v){
                if(i == 'hide_controls' || i == 'auto_play' || i == 'auto_buffer'){
                    $('#op_assets_core_video_lightbox_'+i).attr('checked',(v=='Y')).trigger('change');
                } else if (i == 'placeholder') {
                    OP_AB.set_uploader_value('op_assets_core_video_player_' + i, v);
                } else {
                    $('#op_assets_core_video_lightbox_'+i).val(v).trigger('change');
                }
            });
        }
    };
})(opjq);
