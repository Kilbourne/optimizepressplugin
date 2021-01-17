var op_asset_settings = (function ($) {

    var style_has_title = ['10', '11', '12', '13', '14'],
        style_has_rows = ['10', '11', '12', '13', '14'],
        style_has_text_excerpt = ['10', '11', '12', '13', '14'],
        style_has_text_color = ['10', '11', '12', '13', '14'],
        style_has_author = ['12', '13'],
        style_has_main_title_font_settings = ['10', '11', '12', '13', '14'],
        style_has_post_title_font_settings = ['10', '11', '12', '13', '14'],
        style_has_post_description_font_settings = ['10', '11', '12', '13', '14'];


    return {
        help_vids: {
            step_1: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-recent-posts.mp4',
                width: '600',
                height: '341'
            },
            step_2: {
                url: 'http://op2-inapp.s3.amazonaws.com/elements-recent-posts.mp4',
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
                title: {
                    title: 'posts_title',
                    type: 'input',
                    default_value: 'Amazing Content',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_title,
                    }
                },
                rows: {
                    title: 'posts_rows',
                    type: 'select',
                    default_value: 'one',
                    values: {
                        'one': '1',
                        'two': '2',
                        'three': '3',
                        'four': '4',
                    },
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_rows,
                    }
                },
                text_excerpt: {
                    title: 'posts_text_excerpt',
                    type: 'checkbox',
                    default_value: true,
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_text_excerpt,
                    }
                },
                posts_mode: {
                    title: 'posts_mode',
                    type: 'select',
                    values: {'most_recent_posts': 'Most recent posts', 'selectable_posts': 'Selectable Posts'},
                    default_value: 'most_recent_posts',
                    events: {
                        change: function () {
                            var mostRecentPostsInput = $(this).parent().next();
                            var selectablePostsInput = $(this).parent().next().next();
                            if ($(this).val() === 'most_recent_posts') mostRecentPostsInput.show(); else mostRecentPostsInput.hide();
                            if ($(this).val() === 'selectable_posts') selectablePostsInput.show(); else selectablePostsInput.hide();
                        }
                    }
                },
                posts_num: {
                    title: 'posts_num',
                    type: 'select',
                    values: {
                        '1': '1',
                        '2': '2',
                        '3': '3',
                        '4': '4',
                        '5': '5',
                        '6': '6',
                        '7': '7',
                        '8': '8',
                        '9': '9',
                        '10': '10'
                    },
                    default_value: '5'
                },
                posts_multiselect: {
                    title: "posts_multiselect",
                    type: 'posts_multiselect'
                },
            },
            step_3: {
                main_title_font: {
                    title: 'posts_main_title_font_settings',
                    type: 'font',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_main_title_font_settings,
                    }
                },
                posts_title_font: {
                    title: 'post_title_font_settings',
                    type: 'font',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_post_title_font_settings,
                    }
                },
                posts_description_font: {
                    title: 'post_description_font_settings',
                    type: 'font',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_post_description_font_settings,
                    }
                },
                hide_author: {
                    title: 'posts_hide_author',
                    value: false,
                    type: 'checkbox',
                    showOn: {
                        field: 'step_1.style',
                        value: style_has_author
                    }
                },
            }
        },
        insert_steps: {
            2: {
                next: 'advanced_options'
            },
            3: true
        },
        customInsert: function (attrs) {
            var str = '',
                style = attrs.style,
                posts_num = '',
                posts_mode = attrs.posts_mode,
                selectable_posts = '',
                text_excerpt = attrs.text_excerpt,
                posts_rows = attrs.rows,
                text_color = attrs.text_color,
                hide_author = attrs.hide_author,
                main_title_str = '',
                posts_title_str = '',
                posts_description_str = '';

            if (posts_mode === "most_recent_posts") {
                posts_num = attrs.posts_num;
            }

            if (posts_mode === "selectable_posts") {
                var chosenPosts = $("#my-select option:selected");

                if (chosenPosts.length == 0) {
                    alert("Choose at least one post");
                    return;
                }

                for (i = 0; i < chosenPosts.length; i++) {
                    if (i == chosenPosts.length - 1) {
                        selectable_posts += chosenPosts[i].value;
                    } else {
                        selectable_posts += chosenPosts[i].value;
                        selectable_posts += ", ";
                    }
                }
            }

            $.each(attrs.main_title_font, function (i, v) {
                if (v != '') {
                    main_title_str += ' main_title_font_' + i + '="' + v.replace(/"/ig, "'") + '"';
                }
            });

            $.each(attrs.posts_title_font, function (i, v) {
                if (v != '') {
                    posts_title_str += ' posts_title_font_' + i + '="' + v.replace(/"/ig, "'") + '"';
                }
            });

            $.each(attrs.posts_description_font, function (i, v) {
                if (v != '') {
                    posts_description_str += ' posts_description_font_' + i + '="' + v.replace(/"/ig, "'") + '"';
                }
            });

            str = '[recent_posts style="' + style + '" rows="' + posts_rows + '" title = "' + attrs.title + '" text_excerpt="' + text_excerpt + '" mode="' + posts_mode + '" posts_num="' + posts_num + '" selectable_posts="' + selectable_posts + '" text_color="' + text_color + '" hide_author="' + hide_author + '" ' + main_title_str + ' ' + posts_title_str + ' ' + posts_description_str + '][/recent_posts]';
            OP_AB.insert_content(str);
            $.fancybox.close();
        },
        customSettings: function (attrs, steps) {
            attrs = attrs.attrs;
            var style = attrs.style || 1,
                posts_num = attrs.posts_num || 5,
                posts_mode = attrs.mode || "most_recent_posts",
                selectable_posts = attrs.selectable_posts,
                title = attrs.title,
                text_excerpt = false,
                posts_rows = attrs.rows,
                text_color = attrs.text_color,
                hide_author = false;


            $('#op_assets_core_recent_posts_posts_mode option:selected').removeAttr("selected");
            $('#op_assets_core_recent_posts_posts_rows option:selected').removeAttr("selected");
            $('#op_assets_core_recent_posts_rows').val(posts_rows).trigger('change');

            if (posts_mode == 'most_recent_posts') {
                $('#op_assets_core_recent_posts_posts_mode').val('most_recent_posts').trigger('change');
                $('#op_assets_core_recent_posts_posts_num').find('option').each(function () {
                    if ($(this).val() == attrs.posts_num) $(this).attr('selected', 'selected');
                });
            }

            if (posts_mode == 'selectable_posts') {
                $('#op_assets_core_recent_posts_posts_mode').val('selectable_posts').trigger('change');
                var posts_id = selectable_posts.split(", ");
                $.each(posts_id, function (counter, id) {
                    var selectedElementText = $("#my-select option[value=" + id + "]").text()
                    $(".ms-elem-selectable span:contains(" + selectedElementText + ")").trigger("click");
                });
            }

            //Set chosen style
            OP_AB.set_selector_value('op_assets_core_recent_posts_style_container', style);
            $('#op_assets_core_recent_posts_title').val(title);

            //Set Checkboxes
            if (attrs.text_excerpt === 'Y') text_excerpt = true;
            if (attrs.hide_author === 'Y') hide_author = true;
            $('#op_assets_core_recent_posts_text_excerpt').attr('checked', text_excerpt).trigger('change');
            $('#op_assets_core_recent_posts_hide_author').attr('checked', hide_author).trigger('change');

            //Fonts Settings
            OP_AB.set_font_settings('main_title_font', attrs, 'op_assets_core_recent_posts_main_title_font');
            OP_AB.set_font_settings('posts_title_font', attrs, 'op_assets_core_recent_posts_posts_title_font');
            OP_AB.set_font_settings('posts_description_font', attrs, 'op_assets_core_recent_posts_posts_description_font');
        }
    };
}(opjq));