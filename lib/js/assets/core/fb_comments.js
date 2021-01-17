var op_asset_settings = (function($){
    var fb_opts = {
            help_vids: {
                step_1: {
                    url: 'http://op2-inapp.s3.amazonaws.com/elements-facebook-comments.mp4',
                    width: '600',
                    height: '341'
                },
                step_2: {
                    url: 'http://op2-inapp.s3.amazonaws.com/elements-facebook-comments.mp4',
                    width: '600',
                    height: '341'
                }
            },
        attributes: {
            step_1: {
                style: {
                    type: 'style-selector',
                    folder: '',
                    addClass: 'op-disable-selected',
                    default_value: 'light'
                }
            },
            step_2: {
                title: {
                    title: 'title'
                },
                hide_like: {
                    title: 'facebook_hide_like',
                    type: 'checkbox',
                    help: 'facebook_hide_like_help'
                },
                lang: {
                    title: 'language',
                    type: 'select',
                    help: 'facebook_language_help'
                },
                posts_number: {
                    title: 'facebook_posts_number',
                    help: 'facebook_posts_number_help'
                },
                src_url: {
                    title: 'facebook_src_url',
                    help: 'facebook_src_url_help'
                },
                width: {
                    title: 'width',
                    default_value: function(){
                        return OP_AB.column_width('550');
                    }
                },
                order: {
                    title: 'facebook_posts_order',
                    help: 'facebook_posts_order_help',
                    type: 'select',
                    values: {
                        'social': 'Social Relevance',
                        'reverse_time': 'Newest',
                        'time': 'Oldest'
                    },
                    default_value: 'social'
                }
            }
        },
        insert_steps: { 2: true }
    };
    if(op_fb_comments_asset.dark_site == 'Y'){
        fb_opts.attributes.step_1.style.default_value = 'dark';
    }
    var chks = ['title','lang','hide_like','posts_number','src_url'];
    $.each(chks,function(i,v){
        fb_opts.attributes.step_2[v].default_value = op_fb_comments_asset['options'][v];
    });
    fb_opts.attributes.step_2.lang.values = op_fb_comments_asset.languages
    return fb_opts;
}(opjq));