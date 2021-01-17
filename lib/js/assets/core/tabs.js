var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-tabs.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-tabs.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-tabs.mp4',
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
                tabs: {
                    title: 'tabs_count',
                    type: 'select',
                    valueRange: {start:2,finish:10,text_suffix:'tabs'},
                    default_value: '',
                    multirow: {
                        link_prefix: 'tab',
                        attributes: {
                            title: {
                                title: 'title',
                                type: 'input',
                                default_value: 'Tab Title',
                                events: {
                                    change: function(){
                                        var multi = $(this).closest('.op-multirow'),
                                            cont = multi.parent(),
                                            idx = cont.find('.op-multirow').index(multi);
                                        cont.find('.op-multirow-tabs li a:eq('+idx+')').text($(this).val());
                                    },
                                    keyup: function(){
                                        $(this).trigger('change');
                                    }
                                },
                                trigger_events: 'change'
                            },
                            content: {
                                title: 'content',
                                type: 'wysiwyg',
                                default_value: 'Tab Content'
                            }
                        },
                        onAdd: function(){
                            $(this).find('.op-multirow:last :input[type="text"]').trigger('change');
                        }
                    }
                }
            },
            step_3: {
                microcopy: {
                    text: 'tabs_advanced1',
                    type: 'microcopy'
                },
                microcopy2: {
                    text: 'advanced_warning_2',
                    type: 'microcopy',
                    addClass: 'warning'
                },
                font: {
                    title: 'tabs_font_settings',
                    type: 'font'
                }
            }
        },
        insert_steps: {2:{next:'advanced_options'},3:true},
        customInsert: function(attrs){
            var str = '',
                font_str = '',
                total = attrs.tabs.total;
            $.each(attrs.font,function(i,v){
                if(v != ''){
                    font_str += ' font_'+i+'="'+v.replace(/"/ig,"'")+'"';
                }
            });
            for(var i=0;i<total;i++){
                var title = '', content = '';
                if(typeof attrs.tabs.rows[i] != 'undefined'){
                    title = encodeURIComponent(attrs.tabs.rows[i].title);
                    content = encodeURIComponent(attrs.tabs.rows[i].content);
                }
                str += '[tab title="'+title.replace( /"/ig,"'")+'"'+font_str+']'+content+'[/tab] ';
            };
            str = '[tabs style="'+(attrs.style || 1)+'" ' + font_str + ']'+str+'[/tabs]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var tab = attrs.tab || [],
                container = steps[1].find('.field-id-op_assets_core_tabs_tabs-multirow-container');
            OP_AB.set_selector_value('op_assets_core_tabs_style_container',attrs.attrs.style || 1);
            OP_AB.set_font_settings('font',attrs.attrs,'op_assets_core_tabs_font');
            $('#op_assets_core_tabs_tabs').val(tab.length || 2).trigger('change');
            container = container.find('> div');
            $.each(tab,function(i,v){
                v.attrs.title = op_decodeURIComponent(v.attrs.title);
                v.attrs.content = op_decodeURIComponent(v.attrs.content);

                var tmp = container.filter(':eq('+i+')'),
                    id = tmp.find('input[name$="_title"]').val(v.attrs.title).trigger('change').end()
                    .find('textarea').val(OP_AB.unautop(v.attrs.content)).trigger('change').attr('id');
                OP_AB.set_wysiwyg_content(id,v.attrs.content);
            });
        }
    };
}(opjq));