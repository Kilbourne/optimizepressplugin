;var op_asset_settings = (function($){
    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-terms-conditions.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-terms-conditions.mp4',
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
                accept_text: {
                    title: 'accept_text',
                    default_value: OP_AB.translate('accept_text_default')
                },
                terms: {
                    type: 'wysiwyg',
                    title: 'terms_text'
                },
                content: {
                    type: 'textarea',
                    title: 'content',
                    addClass: 'op-hidden'
                }
            }
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str;

            attrs.accept_text = encodeURIComponent(attrs.accept_text);
            attrs.terms = encodeURIComponent(attrs.terms);

            str = '[terms_conditions style="'+attrs.style+'" accept_text="'+ attrs.accept_text.replace(/"/ig,"'")+'"] [terms]'+attrs.terms+'[/terms] '+attrs.content+' [/terms_conditions]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs,steps){
            var terms = '';
            if(typeof attrs.terms != 'undefined'){
                var t = attrs.terms;
                if(t.length > 0){
                    t = t[0].attrs;
                    terms = op_decodeURIComponent(t.content);
                }
            }
            OP_AB.set_selector_value('op_assets_core_terms_conditions_style_container',attrs.attrs.style);
            OP_AB.set_wysiwyg_content('op_assets_core_terms_conditions_terms',terms);
            $('#op_assets_core_terms_conditions_accept_text').val(op_decodeURIComponent(attrs.attrs.accept_text));
            $('#op_assets_core_terms_conditions_content').val(op_decodeURIComponent(attrs.content));
        }
    };
}(opjq));