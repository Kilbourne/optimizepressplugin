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
                testimonials: {
                    type: 'multirow',
                    multirow: {
                        attributes: {
                            image: {
                                title: 'image',
                                showOn: {field:'step_1.style',value:['1','2','3','4','5','6','7','15','16'],type:'style-selector',idprefix:'op_assets_core_testimonials_'},
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
                            name: {
                                title: 'name'
                            },
                            company: {
                                title: 'company'
                            },
                            href: {
                                title: 'link_url'
                            },
                            content: {
                                title: 'testimonial',
                                type: 'wysiwyg'
                            }
                        },
                        onAdd: function(){
                            $('#op_assets_core_testimonials_style_container').find('.op-asset-dropdown-list a.selected').trigger('click');
                        }
                    }
                }
            },
            step_3: {
                microcopy: {
                    text: 'bullet_block_advanced1',
                    type: 'microcopy'
                },
                microcopy2: {
                    text: 'advanced_warning_2',
                    type: 'microcopy',
                    addClass: 'warning'
                },
                font: {
                    title: 'testimonials_font_settings',
                    type: 'font'
                },
                margin_top: {
                    title: 'margin_top'
                },
                margin_bottom: {
                    title: 'margin_bottom'
                }
            }
        },
        insert_steps: {2:{next:'advanced_options'},3:true},
        customInsert: function(attrs){
            var str = '',
                font_str = '',
                hasImage = ($.inArray(attrs.style || '',['1','2','3','4','5','6','7','15','16']) > -1),
                nattrs = ['name','company','href'],
                nl = 3;

            //If this style has an image, make note in the attributes array
            if(hasImage){
                nattrs.push('image');
                nl = 4;
            }

            //Loop through the testimonials added
            for(var i in attrs.testimonials){
                if (!attrs.testimonials.hasOwnProperty(i)) {
                    continue;
                }
                //Get testimonial attributes and content
                var v = attrs.testimonials[i],
                    c = encodeURIComponent(v.content || '');

                //Init the testimonial child element string
                str += '[testimonial';

                //Loop throgh the attributes and add to the child element string
                for(var j=0;j<nl;j++){
                    var val = encodeURIComponent(v[nattrs[j]] || '');
                    str += ' '+nattrs[j]+'="'+val.replace(/"/ig,"'")+'"';
                }

                //Finally we close the child element string
                str += ']'+OP_AB.autop(c)+'[/testimonial]';
            }
            //Loop through the font settings and add each item to the font string
            $.each(attrs.font,function(i,v){
                if(v != '') font_str += ' font_'+i+'="'+v.replace(/"/ig,"'")+'"';
            });

            //Build the shortcode
            str = '[testimonials style="'+attrs.style+'"' + font_str + ' margin_top="' + attrs.margin_top + '" margin_bottom="' + attrs.margin_bottom + '"]'+str+'[/testimonials]';

            //Add content to the page and close the settings box
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var testimonial = attrs.testimonial || [], //Get the testimonial
                style = attrs.attrs.style || 1, //Get the style
                add_link = steps[1].find('.field-id-op_assets_core_testimonials_testimonials a.new-row'), //Get the link for adding a new row
                container = steps[1].find('.field-id-op_assets_core_testimonials_testimonials-multirow-container'), //Get the multi container from step 2
                cur, //Current testimonial object
                hasImage = ($.inArray(style,['1','2','3','4','5','6','7', '15', '16']) > -1), //Check if this style has an image
                fields = ['name','company','href','content'], //Fields to distribute values to
                tmp;

            //If this tyle has an image, add the image field to the fields array
            if (hasImage) fields.push('image');

            //Set the style selector
            OP_AB.set_selector_value('op_assets_core_testimonials_style_container',style);

            //Loop through the testimonials
            for (var i=0,il=testimonial.length;i<il;i++){
                //Trigger the add link click so we don't duplicate code
                add_link.trigger('click');

                //Temporarily hold the current testimonial
                tmp = testimonial[i];

                //Get the current testimonial
                cur = container.find('.op-multirow:last');

                //Loop through each field
                $.each(fields,function(t,v){

                    var val = op_decodeURIComponent(tmp.attrs[v]);
                    var field = 'input';

                    //If this is the content, set the wysiwyg. Otherwise, find the field and set the proper value
                    if(v == 'content'){
                        val = OP_AB.unautop(val);
                        OP_AB.set_wysiwyg_content(cur.find('textarea').attr('id'),val);
                    } else if (v == 'image'){
                        var elId = (cur.find('input[type="hidden"]').attr('id'));

                        OP_AB.set_uploader_value(elId, op_decodeURIComponent(tmp.attrs.image));
                    } else {
                        cur.find('input[name$="_'+v+'"]').val(val);
                    }
                });
            }

            //Set the font settings
            OP_AB.set_font_settings('font',attrs.attrs,'op_assets_core_testimonials_font');

            //Set the margins
            $('#op_assets_core_testimonials_margin_top').val(OP_AB.unautop(attrs.attrs.margin_top || ''));
            $('#op_assets_core_testimonials_margin_bottom').val(OP_AB.unautop(attrs.attrs.margin_bottom || ''));
        }
    };
}(opjq));
