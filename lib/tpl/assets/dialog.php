<div id="op_asset_browser_container" style="display:none">
    <div class="sneezing-panda">
        <a href="#" class="hide-the-panda"><span><?php _e('Hide', 'optimizepress') ?></span></a>
        <div class="content"></div>
    </div>
    <ul id="op_asset_browser_slider">
        <li id="op_asset_browser_slide0" class="op_asset_browser_slide">&nbsp;</li>
        <li id="op_asset_browser_slide1" class="op_asset_browser_slide">
            <div class="op_asset_content">
                <?php
                $asset_groups     = op_assets();
                $add_group_header = false;
                if (count($asset_groups) > 1) {
                    $add_group_header = true;
                }

                if($asset_groups['addon']){
                    $plusPackElementsLink = '<a class="op-asset-scroller" href="#plus-pack-elements">Jump to PlusPack Elements</a>';
                }

                echo '<div class="asset-title cf">
                        <a href="#" class="op-slide-link" style="opacity:0; pointer-events:none; cursor:default;"></a>
                        <span class="title-text">' . __('Insert an Element','optimizepress') . '</span>
                     </div>
                     <div class="asset-second asset-filter">
                        <input type="text" placeholder="' . __('Search for an Element', 'optimizepress') . '" id="op_assets_filter" autofocus="autofocus" />
                        ' . $plusPackElementsLink . '
                     </div>
                     <div class="op-hidden" id="op_asset_browser_no_assets">
                        <p>' . __('There are no assets matching your search, please try again.', 'optimizepress') . '</p>
                     </div>';



                foreach ($asset_groups as $group => $assets) {
                    if (count($assets) > 0) {
                        echo '<div class="asset-list">
                                <ul class="cf">';

                        if ($add_group_header) {
                            $header = '';
                            $idForScroll = '';
                            switch ($group) {
                                case 'core':
                                    $header = __('Core Elements', 'optimizepress');
                                    break;
                                case 'addon':
                                    $header      = __('PlusPack Elements', 'optimizepress');
                                    $idForScroll = ' id="plus-pack-elements"';
                                    break;
                                case 'theme':
                                    $header = __('Theme Elements', 'optimizepress');
                                    break;
                            }
                            echo '<li' . $idForScroll . '><h2>' . $header . '</h2></li>';
                        }
                        uasort($assets, 'op_sort_asset_array');
                        foreach ($assets as $tag => $info) {
                            $img                 = '';
                            $classname           = ' class="asset-list-item no-image"';
                            $sprite_class        = '';
                            $sprite_regex_result = '';
                            if (isset($info['image']) && ! empty($info['image'])) {
                                preg_match('/(\w+)\.\w+$/i', $info['image'], $sprite_regex_result);
                                $sprite_class = $sprite_regex_result[1];
                                if ($group === 'core') {
                                    $img = '<div class="op-asset-thumb op-asset-thumb-' . $sprite_class . '" alt="' . op_attr($info['title']) . '"></div>';
                                } else {
                                    $img = '<img src="' . $info['image'] . '" alt="' . op_attr($info['title']) . '" />';
                                }
                                $classname = ' class="op-asset-list-item"';
                            }
                            echo '
                    <li' . $classname . '>
                        <a href="#' . $group . '/' . $tag . '" class="asset-' . $group . '-' . $tag . ' group-' . $group . '">' . $img . '<span class="content"><span class="title">' . $info['title'] . '</span>' . (isset($info['description']) && ! empty($info['description']) ? '<span class="description">' . $info['description'] . '</span>' : '') . '</span></a>
                    </li>';
                            $asset_groups[$group][$tag] = array('settings'  => op_get_var($info, 'settings', 'N'),
                                                                'base_path' => op_get_var($info, 'base_path', null)
                            );
                        }
                        echo '
                </ul>
            </div>';
                    }
                }
                ?>
            </div>
        </li>
        <li id="op_asset_browser_slide2" class="op_asset_browser_slide">
            <div class="op_asset_content">
                <div class="asset-title cf"><a href="#1" tabindex="-1" class="op-slide-link tooltip animated pulse"
                                               title="<?php esc_attr_e('Choose a Different Element',
                                                   'optimizepress'); ?>"></a><span
                        class="title-text"><?php _e('Choose the Element Style', 'optimizepress') ?></span>
                    <div class="help-vid-link tooltip animated pulse"
                         title="Help"><?php op_asset_help_vid('step_2') ?></div>
                </div>
                <!--<div class="asset-second"><a href="#1" class="op-slide-link"><?php _e('&larr; Back to Choose an Element',
                    'optimizepress') ?></a></div>-->
            </div>
        </li>
        <li id="op_asset_browser_slide3" class="op_asset_browser_slide">
            <div class="op_asset_content">
                <div class="asset-title cf"><a href="#2" tabindex="-1" class="op-slide-link tooltip animated pulse"
                                               title="<?php esc_attr_e('Choose a Different Element Style',
                                                   'optimizepress'); ?>"></a><span class="title-text"><?php _e('Step 3',
                            'optimizepress') ?></span>
                    <div class="help-vid-link tooltip animated pulse"
                         title="Help"><?php op_asset_help_vid('step_3') ?></div>
                </div>
            </div>
        </li>
        <li id="op_asset_browser_slide4" class="op_asset_browser_slide">
            <div class="op_asset_content">
                <div class="asset-title cf"><a href="#3" tabindex="-1" class="op-slide-link tooltip animated pulse"
                                               title="<?php esc_attr_e('Choose a Different Element Setting',
                                                   'optimizepress'); ?>"></a><span class="title-text"><?php _e('Step 4',
                            'optimizepress') ?></span>
                    <div class="help-vid-link tooltip animated pulse"
                         title="Help"><?php op_asset_help_vid('step_4') ?></div>
                </div>
            </div>
        </li>
    </ul>
    <div id="op_assets_default_elements" style="display:none">
        <?php
        $tmp_id = 'op_font';
        echo op_font_size_dropdown($tmp_id . '[size]', '', $tmp_id . 'size');
        echo op_font_visual_dropdown($tmp_id . 'font');
        echo op_font_style_dropdown($tmp_id . '[style]', '', $tmp_id . 'style');
        echo op_font_style_checkbox($tmp_id . '[style_checkbox_text]', '', $tmp_id . 'style_checkbox_text');
        echo op_font_style_checkbox($tmp_id . '[style_checkbox_subtext]', '', $tmp_id . 'style_checkbox_subtext');
        echo op_font_spacing_dropdown($tmp_id . '[spacing]', '', $tmp_id . 'spacing');
        echo op_font_shadow_dropdown($tmp_id . '[shadow]', '', $tmp_id . 'shadow');
        ?>
    </div>
</div>

<?php // op_tiny_mce('','opassetswysiwyg2'); ?>
<div class="op-hidden">
    <script type="op-template" id="op_dummy_wysiwyg">
        <?php
        $GLOBALS['op_disable_asset_link'] = true;
        op_tiny_mce('', 'opassetswysiwyg');
        $GLOBALS['op_disable_asset_link'] = false;
        ?>
    </script>
    <div id="op_dummy_media_container"><?php op_upload_field('op_dummy_media') ?></div>
</div>

<script type="text/javascript">
    if (!("autofocus" in document.createElement("input"))) {
        document.getElementById("op_assets_filter").focus();
    }
</script>
<script type="text/javascript" src="<?php echo is_ssl() ? 'https' : 'http'; ?>://www.google.com/jsapi"></script>
<script type="text/javascript">
    google.load('webfont', '1');
    var op_assets = <?php echo json_encode($asset_groups) ?>,
        op_assets_lang = <?php echo json_encode(op_assets_lang()) ?>;
    <?php do_action('op_asset_footer_js') ?>
</script>
