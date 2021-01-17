var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-course-description-box.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-course-description-box.mp4',
                width: '600',
                height: '341'
            },
            step_3: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-course-description-box.mp4',
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
                course_description_step_2: {
                    type: 'microcopy',
                    text: 'course_description_step_2'
                },
                icon: {
                    title: 'icon',
                    type: 'image-selector',
                    folder: 'icons',
                    selectorClass: 'icon-view-64',
                    asset: ['core', 'feature_block']
                },
                image: {
                    title: 'image',
                    type: 'media'
                },
                title: {
                    title: 'course_description_title'
                },
                content: {
                    title: 'course_description_content',
                    type: 'wysiwyg'
                }
            },
            step_3: {
                microcopy: {
                    text: 'course_description_advanced1',
                    type: 'microcopy'
                },
                microcopy2: {
                    text: 'advanced_warning_2',
                    type: 'microcopy',
                    addClass: 'warning'
                },
                font: {
                    title: 'course_description_title_styling',
                    type: 'font'
                },
                content_font: {
                    title: 'course_description_content_styling',
                    type: 'font'
                }
            }
        },
        insert_steps: {2:{next:'advanced_options'},3:true},
        customInsert: function(attrs){
            var str = '';
            var style = (attrs.style || 1);
            var icon = (attrs.icon || '');
            var image = (attrs.image || '');
            var title = (encodeURIComponent(attrs.title) || '');
            var content = op_base64encode(OP_AB.autop(attrs.content || ''));
            var font_str = '';

            // Loop through each of the font elements and create the font string from it
            $.each(['font','content_font'],function(i,v){
                $.each(attrs[v],function(i2,v2){
                    if(v2 != ''){
                        font_str += ' '+v+'_'+i2+'="'+v2.replace(/"/ig,"'")+'"';
                    }
                });
            });

            // Generate the shortcode
            str = '[course_description style="' + style + '" icon="' + icon + '" icon_folder="' + op_asset_settings.attributes.step_2.icon.asset[1] + '" image="' + image + '" title="' + title + '" content="' + content + '"' + font_str+']'+str+'[/course_description]';

            //Insert content into page and close the asset browser
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            attrs = attrs.attrs;
            var style = (attrs.style || 1),
                icon = (attrs.icon || ''),
                image = (attrs.image || ''),
                title = op_decodeURIComponent(attrs.title),
                content = (attrs.content || '');

            //Set the style selector
            OP_AB.set_selector_value('op_assets_core_course_description_style_container', style);

            //Set the icon selector
            OP_AB.set_selector_value('op_assets_core_course_description_icon_container',icon);

            //Set the image selector
            OP_AB.set_uploader_value('op_assets_core_course_description_image', image);

            //Set the title
            $('#op_assets_core_course_description_title').val(title);

            //Set the WYSIWYG content
            OP_AB.set_wysiwyg_content('op_assets_core_course_description_content', op_base64decode(content));

            //Set the advanced options
            OP_AB.set_font_settings('font', attrs, 'op_assets_core_course_description_font');
            OP_AB.set_font_settings('content_font', attrs, 'op_assets_core_course_description_content_font');

        }
    };
}(opjq));
