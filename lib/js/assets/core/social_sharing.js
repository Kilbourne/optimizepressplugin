;var op_asset_settings = (function($){
    var fb_styles = ['horizontal','long','style-3','style-4','style-5','style-6','style-7','style-8','style-9','style-10','style-11','style-12','style-13','style-14','style-15','style-16','style-17','style-18','style-19','style-20', 'style-21'],
        tw_styles = ['horizontal','long','style-3','style-4','style-5','style-6','style-7','style-8','style-9','style-10','style-11','style-12','style-13','style-14','style-15','style-16','style-17','style-18','style-19','style-20'],
        g_styles = ['horizontal','long','style-3','style-4','style-5','style-6','style-7','style-8','style-9','style-10','style-11','style-12','style-13','style-14','style-15','style-16','style-17','style-18','style-19','style-20'],
        p_styles = ['horizontal','long','style-6'],
        su_styles = ['horizontal','long'],
        linkedin_styles = ['horizontal','long','style-6','style-7'],
        alignment_styles = ['style-3','style-4','style-5','style-6','style-7','style-8','style-9','style-10','style-11','style-12','style-13','style-14','style-15','style-16','style-17','style-18','style-19','style-20','style-21'],
        button_text_styles = ['style-20'],
        attrs = {
            help_vids: {
                step_1: {
                    url: 'http://op2-inapp.s3.amazonaws.com/elements-social-sharing.mp4',
                    width: '600',
                    height: '341'
                },
                step_2: {
                    url: 'http://op2-inapp.s3.amazonaws.com/elements-social-sharing.mp4',
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
                fb_header: {
                    title: 'facebook_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:fb_styles}
                },
                fb_like_url: {
                    title: 'facebook_like_url',
                    showOn: {field:'step_1.style',value:fb_styles}
                },
                fb_color: {
                    title: 'light_or_dark',
                    type: 'select',
                    values: {'dark':'dark','light':'light'},
                    default_value: 'light',
                    showOn: {field:'step_1.style',value:fb_styles}
                },
                fb_lang: {
                    title: 'language',
                    type: 'select',
                    showOn: {field:'step_1.style',value:fb_styles}
                },
                fb_text: {
                    title: 'text',
                    type: 'select',
                    values: {'recommend':'recommend','like':'like'},
                    default_value: 'like',
                    showOn: {field:'step_1.style',value:['horizontal','long','style-3','style-4','style-5','style-6','style-7','style-8','style-9','style-10','style-11','style-12','style-13','style-14','style-15','style-16','style-17','style-18','style-19']}
                },
                fb_button_text: {
                    title: 'button_text',
                    default_value: 'Share',
                    showOn: {field:'step_1.style',value:button_text_styles}
                },
                tw_header: {
                    title: 'twitter_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:tw_styles}
                },
                tw_text: {
                    title: 'default_tweet_text',
                    showOn: {field:'step_1.style',value:['horizontal','long','style-3','style-4','style-5','style-6','style-7']}
                },
                tw_lang: {
                    title: 'language',
                    type: 'select',
                    values: {'fil':'Filipino','it':'Italian','en':'English','hu':'Hungarian','zh-cn':'Simplified Chinese','ko':'Korean','th':'Thai','id':'Indonesian','fr':'French','fi':'Finnish','cs':'Czech','de':'German','da':'Danish','ar':'Arabic','es':'Spanish','nl':'Dutch','zh-tw':'Traditional Chinese','hi':'Hindi','tr':'Turkish','ru':'Russian','he':'Hebrew','pl':'Polish','eu':'Basque','pt':'Portuguese','ja':'Japanese','ca':'Catalan','uk':'Ukrainian','no':'Norwegian','fa':'Farsi','sv':'Swedish','ur':'Urdu','msa':'Malay','el':'Greek'},
                    default_value: 'en',
                    showOn: {field:'step_1.style',value:tw_styles}
                },
                tw_url: {
                    title: 'twitter_count_url',
                    showOn: {field:'step_1.style',value:tw_styles}
                },
                tw_name: {
                    title: 'twitter_name',
                    showOn: {field:'step_1.style',value:tw_styles}
                },
                tw_button_text: {
                    title: 'button_text',
                    default_value: 'Share',
                    showOn: {field:'step_1.style',value:button_text_styles}
                },
                g_header: {
                    title: 'google_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:g_styles}
                },
                g_url: {
                    title: 'google_url',
                    showOn: {field:'step_1.style',value:g_styles}
                },
                g_lang: {
                    title: 'language',
                    type: 'select',
                    values: {'af':'Afrikaans','am':'Amharic','ar':'Arabic','eu':'Basque','bn':'Bengali','bg':'Bulgarian','ca':'Catalan','zh-HK':'Chinese (Hong Kong)','zh-CN':'Chinese (Simplified)','zh-TW':'Chinese (Traditional)','hr':'Croatian','cs':'Czech','da':'Danish','nl':'Dutch','en-GB':'English (UK)','en-US':'English (US)','et':'Estonian','fil':'Filipino','fi':'Finnish','fr':'French','fr-CA':'French (Canadian)','gl':'Galician','de':'German','el':'Greek','gu':'Gujarati','iw':'Hebrew','hi':'Hindi','hu':'Hungarian','is':'Icelandic','id':'Indonesian','it':'Italian','ja':'Japanese','kn':'Kannada','ko':'Korean','lv':'Latvian','lt':'Lithuanian','ms':'Malay','ml':'Malayalam','mr':'Marathi','no':'Norwegian','fa':'Persian','pl':'Polish','pt-BR':'Portuguese (Brazil)','pt-PT':'Portuguese (Portugal)','ro':'Romanian','ru':'Russian','sr':'Serbian','sk':'Slovak','sl':'Slovenian','es':'Spanish','es-419':'Spanish (Latin America)','sw':'Swahili','sv':'Swedish','ta':'Tamil','te':'Telugu','th':'Thai','tr':'Turkish','uk':'Ukrainian','ur':'Urdu','vi':'Vietnamese','zu':'Zulu'},
                    default_value: 'en-GB',
                    showOn: {field:'step_1.style',value:g_styles}
                },
                g_button_text: {
                    title: 'button_text',
                    default_value: 'Share',
                    showOn: {field:'step_1.style',value:button_text_styles}
                },
                p_header: {
                    title: 'pinterest_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:p_styles}
                },
                p_url: {
                    title: 'pinterest_url',
                    showOn: {field:'step_1.style',value:p_styles}
                },
                p_image_url: {
                    title: 'pinterest_image_url',
                    showOn: {field:'step_1.style',value:p_styles}
                },
                p_description: {
                    title: 'pinterest_description',
                    type: 'textarea',
                    showOn: {field:'step_1.style',value:p_styles}
                },
                su_header: {
                    title: 'stumbleupon_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:su_styles}
                },
                su_url: {
                    title: 'stumbleupon_url',
                    showOn: {field:'step_1.style',value:su_styles}
                },
                linkedin_header: {
                    title: 'linkedin_settings',
                    type: 'h3',
                    showOn: {field:'step_1.style',value:linkedin_styles}
                },
                linkedin_url: {
                    title: 'linkedin_url',
                    showOn: {field:'step_1.style',value:linkedin_styles}
                },
                linkedin_lang: {
                    title: 'linkedin_language',
                    type: 'select',
                    values: {
                        'en_US':'english',
                        'fr_FR':'french',
                        'es_S':'spanish',
                        'ru_RU':'russian',
                        'de_DE':'german',
                        'it_IT':'italian',
                        'pt_BR':'portugese',
                        'ro_RO':'romanian',
                        'tr_TR':'turkish',
                        'ja_JP':'japanese',
                        'in_ID':'indonesian',
                        'ms_MY':'malay',
                        'ko_KR':'korean',
                        'sv_SE':'swedish',
                        'cs_CZ':'czech',
                        'nl_NL':'dutch',
                        'pl_PL':'polish',
                        'no_NO':'norwegian',
                        'da_DK':'danish'
                    },
                    showOn: {field:'step_1.style',value:linkedin_styles}
                },
                alignment: {
                    title: 'alignment',
                    type: 'select',
                    values: {'left': 'left', 'center': 'center', 'right': 'right'},
                    default_value: 'center',
                    showOn: {field:'step_1.style',value:alignment_styles}
                }
            }
        },
        insert_steps: {2:true},
        customInsert: function(attrs){
            var str = '[social_sharing';
            for(var i in attrs){
                if(attrs.hasOwnProperty(i) && attrs[i]){
                    if(i == 'p_description'){
                        attrs[i] = encodeURIComponent(OP_AB.unautop(attrs[i]));
                    }
                    str += ' '+i+'="'+attrs[i].replace(/"/ig,"'")+'"'
                }
            }
            str += '] ';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function(attrs){
            attrs = attrs.attrs || {};
            for(var i in attrs){
                if(attrs.hasOwnProperty(i)){
                    if(i == 'style'){
                        OP_AB.set_selector_value('op_assets_core_social_sharing_style_container',attrs[i]);
                    } else {
                        if(i == 'p_description'){
                            attrs[i] = op_decodeURIComponent(attrs[i]);
                        }
                        $('#op_assets_core_social_sharing_'+i).val(attrs[i]);

                        //Set the LinkedIn language select
                        if (i=='linkedin_lang'){
                            $('#op_assets_core_social_sharing_linkedin_lang').find('option').each(function(){
                                if ($(this).val()==attrs.linkedin_lang) $(this).attr('selected', 'selected');
                            });
                        }

                        //Set the alignment select
                        $('#op_assets_core_social_sharing_alignment').find('option').each(function(){
                            if ($(this).val()==attrs.alignment) $(this).attr('selected', 'selected');
                        });

                        //Set the button text fields
                        $('#op_assets_core_social_sharing_tw_button_text').val(attrs.tw_button_text);
                        $('#op_assets_core_social_sharing_g_button_text').val(attrs.g_button_text);
                    }
                }
            }
        }
    };
    attrs.attributes.step_2.fb_lang.default_value = op_fb_comments_asset['options']['lang'];
    attrs.attributes.step_2.fb_lang.values = op_fb_comments_asset.languages;
    return attrs;
}(opjq));