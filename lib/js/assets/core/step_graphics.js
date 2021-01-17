var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-step-graphics.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-step-graphics.mp4',
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
                color: {
                    title: 'color',
                    type: 'color'
                },
                steps: {
                    title: 'steps',
                    type: 'multirow',
                    multirow: {
                        remove_row: 'after',
                        attributes: {
                            text: {
                                title: 'text',
                                type: 'input'
                            },
                            headline: {
                                title: 'headline',
                                type: 'input'
                            },
                            information: {
                                title: 'information',
                                type: 'textarea'
                            }
                        },
                        onAdd: function(steps){
                            var curStep = steps[1].find('.op-multirow').length; //Calculate new step number

                            //Insert new step number into the new step text field. This is basically a default for the step text field
                            $(this).find('.field-text input').val(curStep);
                        }
                    }
                }
            }
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '', style = (attrs.style || 1);

            //Loop through the steps and generate the child shortcodes
            $.each(attrs.steps, function(index, val){
                var stepHeadline = encodeURIComponent(OP_AB.encode_html(val.headline) || '');
                var stepText = encodeURIComponent(OP_AB.encode_html(val.text) || '');
                str += '[step style="' + style + '" text="' + stepText + '" headline="' + stepHeadline + '"]' + encodeURIComponent(val.information) + '[/step]';
            });

            //Generate the parent shortcode
            str = '[step_graphics style="' + style + '" color="' + attrs.color + '"]'+str+'[/step_graphics]';

            //Insert the shortcode into the page (processed by default.php)
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var html = '',
                style = attrs.attrs.style || 1,
                color = attrs.attrs.color,
                step = attrs.step, //This contains all the steps the user created in the asset browser
                $container = steps[1].find('.field-id-op_assets_core_step_graphics_steps-multirow-container'), //Primary multirow container
                $cp = $container.prev(); //Color picker container

            //Set the style
            OP_AB.set_selector_value('op_assets_core_step_graphics_style_container',(style || ''));

            //Set the color for the steps
            $cp.find('#op_assets_core_step_graphics_color').val(color);
            $cp.find('.op-pick-color').css({ backgroundColor: color });

            //Iterate between the columns and set the proper settings
            $.each(step,function(i,v){
                v = v.attrs;

                v.text = op_decodeURIComponent(v.text);
                v.headline = op_decodeURIComponent(v.headline);
                v.content = op_decodeURIComponent(v.content);

                //Generate HTML for steps
                html += '<div class="op-multirow cf"><div class="field-row field-input field-id-op_assets_core_step_graphics_steps_' + i + '_text field-text cf"><label for="op_assets_core_step_graphics_steps_' + i + '_text">Text</label><input type="text" id="op_assets_core_step_graphics_steps_' + i + '_text" name="op_assets_core_step_graphics_steps_' + i + '_text" value="' + v.text + '"></div><div class="field-row field-input field-id-op_assets_core_step_graphics_steps_' + i + '_headline field-headline cf"><label for="op_assets_core_step_graphics_steps_' + i + '_headline">Headline</label><input type="text" id="op_assets_core_step_graphics_steps_' + i + '_headline" name="op_assets_core_step_graphics_steps_' + i + '_headline" value="' + v.headline + '"></div><div class="field-row field-textarea field-id-op_assets_core_step_graphics_steps_' + i + '_information field-information cf"><label for="op_assets_core_step_graphics_steps_' + i + '_information">Information</label><textarea id="op_assets_core_step_graphics_steps_' + i + '_information" name="op_assets_core_step_graphics_steps_' + i + '_information" rows="10" cols="30">' + $.trim($(v.content).text()) + '</textarea></div><a class="remove-row" href="#"><img alt="Remove Row" src="' + OptimizePress.imgurl + 'remove-row.png"></a></div>';
            });

            //Add steps to multirow div
            $container.append(html);
        }
    };
}(opjq));
