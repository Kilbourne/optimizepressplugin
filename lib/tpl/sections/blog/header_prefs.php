<?php
    $header_prefs = op_default_option('header_prefs');
    $color_scheme = op_default_option('color_scheme_fields');
?>
<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
    <p class="op-micro-copy"><?php printf(__('Choose the layout for your Blog header from the options below.  Remember to create and assign menus to your blog Menus within the %1$sWordpress Menus admin panel%2$s', 'optimizepress'),'<a href="nav-menus.php">','</a>') ?></p>
    <?php
    if($layouts = op_theme_config('header_prefs','menu-positions')):
        $cur_layout = op_get_current_item($layouts,op_default_option('header_prefs','menu-position'));
        $previews = array();
        $link_color = false;
        $js = array();
        foreach($layouts as $name => $layout){
            $field_id = 'op_sections_header_prefs_menu-position_'.$name;
            $selected = ($cur_layout == $name);
            $li_class = $input_attr = '';
            $tmp_color = (isset($layout['link_color']) && $layout['link_color'] === true);
            if($selected){
                $link_color = $tmp_color;
                $li_class = ' img-radio-selected';
                $input_attr = ' checked="checked"';
            }
            if($name == 'alongside' && ((!$logo = op_get_option('blog_header','logo')) && ($bannerimg = op_get_option('blog_header','bgimg')))){
                continue;
            }
            if($tmp_color){
                $js[$name] = true;
            }
            $preview = $layout['preview'];
            $preview['li_class'] = $li_class;
            $preview['input'] = '<input type="radio" name="op[sections][header_prefs][menu_position]" id="'.$field_id.'" value="'.$name.'"'.$input_attr.' />';
            $preview['preview_content'] = __($layout['title'], 'optimizepress');
            $previews[] = $preview;
        }
        echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews, 'classextra'=>'menu-position op-thumbnails op-thumbnails--fullwidth '));
    endif; ?>


    <div class="op-bsw-grey-panel section-top">
        <div class="op-bsw-grey-panel-header cf">
            <h3><a href="#"><?php _e('Blog Primary Navigation', 'optimizepress'); ?></a></h3>
            <div class="op-bsw-panel-controls cf">
                <div class="panel-control"></div>
                <div class="show-hide-panel"><a href="#"></a></div>
            </div>
        </div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <div id="layout-settings-alongside" class="link-color-container cf layout-settings"<?php echo ($name=='alongside' ? '':' style="display:none"')?>>
                <label for="op_sections_header_prefs_alongside_nav_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
                <p class="micro-copy">If you would like to change the font for this navigation menu, you may change these settings below.</p>
                <?php
                $font_family = (!empty($header_prefs['alongside_nav_font_family']) ? $header_prefs['alongside_nav_font_family'] : op_default_option('header_prefs', 'alongside_nav_font_family'));
                $font_weight = (!empty($header_prefs['alongside_nav_font_weight']) ? $header_prefs['alongside_nav_font_weight'] : op_default_option('header_prefs', 'alongside_nav_font_weight'));
                $font_size = (!empty($header_prefs['alongside_nav_font_size']) ? $header_prefs['alongside_nav_font_size'] : op_default_option('header_prefs', 'alongside_nav_font_size'));
                $font_shadow = (!empty($header_prefs['alongside_nav_font_shadow']) ? $header_prefs['alongside_nav_font_shadow'] : op_default_option('header_prefs', 'alongside_nav_font_shadow'));
                echo _op_fonts('font_dropdown', 'op[sections][header_prefs][alongside_nav_font_family]', $font_family, 'op_sections_header_prefs_alongside_nav_font_family', '');
                echo _op_fonts('font_size_dropdown', 'op[sections][header_prefs][alongside_nav_font_size]', $font_size, 'op_sections_header_prefs_alongside_nav_font_size', 'class="op-layout-settings-select"');
                echo _op_fonts('font_style_dropdown', 'op[sections][header_prefs][alongside_nav_font_weight]', $font_weight, 'op_sections_header_prefs_alongside_nav_font_weight', 'class="op-layout-settings-select op-layout-settings-select-style"');
                echo _op_fonts('font_shadow_dropdown', 'op[sections][header_prefs][alongside_nav_font_shadow]', $font_shadow, 'op_sections_header_prefs_alongside_nav_font_shadow', 'class="op-layout-settings-select op-layout-settings-select-shadow"');
                ?>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_nav_link" class="form-title"><?php _e('Navigation Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the colour for the main text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_nav_link]',op_default_option('header_prefs','alongside_nav_link'),'op_sections_header_prefs_alongside_nav_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_nav_hover_link" class="form-title"><?php _e('Navigation Hover Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_nav_hover_link]',op_default_option('header_prefs','alongside_nav_hover_link'),'op_sections_header_prefs_alongside_nav_hover_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_nav_bg_hover" class="form-title"><?php _e('Navigation Background Hover', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the hover background colour for your main navigation bar (this will be used for the background hover state)', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_nav_bg_hover]',op_default_option('header_prefs','alongside_nav_bg_hover'),'op_sections_header_prefs_alongside_nav_bg_hover'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_dd_link" class="form-title"><?php _e('Dropdown Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_dd_link]',op_default_option('header_prefs','alongside_dd_link'),'op_sections_header_prefs_alongside_dd_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_dd_hover_link" class="form-title"><?php _e('Dropdown Hover Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_dd_hover_link]',op_default_option('header_prefs','alongside_dd_hover_link'),'op_sections_header_prefs_alongside_dd_hover_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_dd_bg" class="form-title"><?php _e('Dropdown Background', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the  colour for your dropdown menu background.', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_dd_bg]',op_default_option('header_prefs','alongside_dd_bg'),'op_sections_header_prefs_alongside_dd_bg'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_alongside_dd_bg_hover" class="form-title"><?php _e('Dropdown Background Hover', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][alongside_dd_bg_hover]',op_default_option('header_prefs','alongside_dd_bg_hover'),'op_sections_header_prefs_alongside_dd_bg_hover'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
            </div>
            <div id="layout-settings-below"<?php echo ($name=='below' ? '':' style="display:none"')?> class="link-color-container cf layout-settings">
                <label for="op_sections_header_prefs_below_nav_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
                <p class="micro-copy">If you would like to change the font for this navigation menu, you may change these settings below.</p>
                <?php
                $font_family = (!empty($header_prefs['below_nav_font_family']) ? $header_prefs['below_nav_font_family'] : op_default_option('header_prefs', 'below_nav_font_family'));
                $font_weight = (!empty($header_prefs['below_nav_font_weight']) ? $header_prefs['below_nav_font_weight'] : op_default_option('header_prefs', 'below_nav_font_weight'));
                $font_size = (!empty($header_prefs['below_nav_font_size']) ? $header_prefs['below_nav_font_size'] : op_default_option('header_prefs', 'below_nav_font_size'));
                $font_shadow = (!empty($header_prefs['below_nav_font_shadow']) ? $header_prefs['below_nav_font_shadow'] : op_default_option('header_prefs', 'below_nav_font_shadow'));
                echo _op_fonts('font_dropdown', 'op[sections][header_prefs][below_nav_font_family]', $font_family, 'op_sections_header_prefs_below_nav_font_family', '');
                echo _op_fonts('font_size_dropdown', 'op[sections][header_prefs][below_nav_font_size]', $font_size, 'op_sections_header_prefs_below_nav_font_size', '');
                echo _op_fonts('font_style_dropdown', 'op[sections][header_prefs][below_nav_font_weight]', $font_weight, 'op_sections_header_prefs_below_nav_font_weight', '');
                echo _op_fonts('font_shadow_dropdown', 'op[sections][header_prefs][below_nav_font_shadow]', $font_shadow, 'op_sections_header_prefs_below_nav_font_shadow', '');
                ?>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_nav_link" class="form-title"><?php _e('Navigation Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the colour for the main text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_nav_link]',op_default_option('header_prefs','below_nav_link'),'op_sections_header_prefs_below_nav_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_nav_hover_link" class="form-title"><?php _e('Navigation Hover Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_nav_hover_link]',op_default_option('header_prefs','below_nav_hover_link'),'op_sections_header_prefs_below_nav_hover_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_bg_start" class="form-title"><?php _e('Background (Gradient Start Colour)', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the start (top) colour for the gradient on your navigation bar. For a solid colour leave the end colour blank', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_bg_start]',op_default_option('header_prefs','below_bg_start'),'op_sections_header_prefs_below_bg_start'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_bg_end" class="form-title"><?php _e('Background (Gradient End Colour)', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the end (bottom) colour for the gradient on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_bg_end]',op_default_option('header_prefs','below_bg_end'),'op_sections_header_prefs_below_bg_end'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_bg_hover_start" class="form-title"><?php _e('Background Hover (Gradient Start Colour)', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the hover start (top) colour for the gradient on your main navigation bar. For a solid colour leave the end colour blank', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_bg_hover_start]',op_default_option('header_prefs','below_bg_hover_start'),'op_sections_header_prefs_below_bg_hover_start'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_bg_hover_end" class="form-title"><?php _e('Background Hover (Gradient End Colour)', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the hover end (bottom) colour for the gradient on your main navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_bg_hover_end]',op_default_option('header_prefs','below_bg_hover_end'),'op_sections_header_prefs_below_bg_hover_end'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_dd_link" class="form-title"><?php _e('Dropdown Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_dd_link]',op_default_option('header_prefs','below_dd_link'),'op_sections_header_prefs_below_dd_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_dd_hover_link" class="form-title"><?php _e('Dropdown Hover Link Text', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_dd_hover_link]',op_default_option('header_prefs','below_dd_hover_link'),'op_sections_header_prefs_below_dd_hover_link'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_dd_bg" class="form-title"><?php _e('Dropdown Background', 'optimizepress') ?></label>
                    <p class="op-micro-copy"><?php _e('Choose the  colour for your dropdown menu background.', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_dd_bg]',op_default_option('header_prefs','below_dd_bg'),'op_sections_header_prefs_below_dd_bg'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
                <br style="clear: left;" />
                <div class="color-chooser">
                    <label for="op_sections_header_prefs_below_dd_bg_hover" class="form-title"><?php _e('Dropdown Background Hover', 'optimizepress') ?></label>
                    <p class="micro-copy"><?php _e('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'); ?></p>
                    <?php op_color_picker('op[sections][header_prefs][below_dd_bg_hover]',op_default_option('header_prefs','below_dd_bg_hover'),'op_sections_header_prefs_below_dd_bg_hover'); ?>
                    <a href="#reset" class="reset-link">Reset</a>
                </div>
            </div>
        </div>
    </div>
    <div class="op-bsw-grey-panel section-bottom">
        <div class="op-bsw-grey-panel-header cf">
            <h3><a href="#"><?php _e('Blog Top Navigation', 'optimizepress'); ?></a></h3>
            <div class="op-bsw-panel-controls cf">
                <div class="panel-control"></div>
                <div class="show-hide-panel"><a href="#"></a></div>
            </div>
        </div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <label for="op_sections_color_scheme_fields_top_nav_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
            <p class="micro-copy">If you would like to change the font for this navigation menu, you may change these settings below.</p>
            <?php
            $font_family = (!empty($color_scheme['top_nav_font']['font_family']) ? $color_scheme['top_nav_font']['font_family'] : op_default_option('color_scheme_fields', 'top_nav_font', 'font_family'));
            $font_weight = (!empty($color_scheme['top_nav_font']['font_weight']) ? $color_scheme['top_nav_font']['font_weight'] : op_default_option('color_scheme_fields', 'top_nav_font', 'font_weight'));
            $font_size = (!empty($color_scheme['top_nav_font']['font_size']) ? $color_scheme['top_nav_font']['font_size'] : op_default_option('color_scheme_fields', 'top_nav_font', 'font_size'));
            $font_shadow = (!empty($color_scheme['top_nav_font']['font_shadow']) ? $color_scheme['top_nav_font']['font_shadow'] : op_default_option('color_scheme_fields', 'top_nav_font', 'font_shadow'));
            echo _op_fonts('font_dropdown', 'op[sections][color_scheme_fields][top_nav_font][font_family]', $font_family, 'op_sections_color_scheme_fields_top_nav_font_font_family', '');
            echo _op_fonts('font_size_dropdown', 'op[sections][color_scheme_fields][top_nav_font][font_size]', $font_size, 'op_sections_color_scheme_fields_top_nav_font_font_size', 'class="op-layout-settings-select"');
            echo _op_fonts('font_style_dropdown', 'op[sections][color_scheme_fields][top_nav_font][font_weight]', $font_weight, 'op_sections_color_scheme_fields_top_nav_font_font_weight', 'class="op-layout-settings-select op-layout-settings-select-style"');
            echo _op_fonts('font_shadow_dropdown', 'op[sections][color_scheme_fields][top_nav_font][font_shadow]', $font_shadow, 'op_sections_color_scheme_fields_top_nav_font_font_shadow', 'class="op-layout-settings-select op-layout-settings-select-shadow"');
            ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_fields_top_nav_color" class="form-title"><?php _e('Top Navigation Background Color', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Select or enter a colour for the top navigation bar background colour', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_color]',op_default_option('color_scheme_fields','top_nav_color'),'op_sections_color_scheme_fields_top_nav_color'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_fields_link_color" class="form-title"><?php _e('Top Navigation Link Color', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Select or enter a colour for the text link in the top navigation bar', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][link_color]',op_default_option('color_scheme_fields','link_color'),'op_sections_color_scheme_fields_link_color'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_field_top_nav_hover_link" class="form-title"><?php _e('Navigation Hover Link Text', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_hover_link]',op_default_option('color_scheme_fields','top_nav_hover_link'),'op_sections_color_scheme_fields_top_nav_hover_link'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_fields_top_nav_dd_link" class="form-title"><?php _e('Dropdown Link Text', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_dd_link]',op_default_option('color_scheme_fields','top_nav_dd_link'),'op_sections_color_scheme_fields_top_nav_dd_link'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_fields_top_nav_dd_hover_link" class="form-title"><?php _e('Dropdown Hover Link Text', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_dd_hover_link]',op_default_option('color_scheme_fields','top_nav_dd_hover_link'),'op_sections_color_scheme_fields_top_nav_dd_hover_link'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_fields_top_nav_dd" class="form-title"><?php _e('Dropdown Background', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Choose the colour for your dropdown menu background.', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_dd]',op_default_option('color_scheme_fields','top_nav_dd'),'op_sections_color_scheme_fields_top_nav_dd'); ?>
            <br style="clear: left;" />
            <label for="op_sections_color_scheme_field_top_nav_dd_hover" class="form-title"><?php _e('Dropdown Background Hover', 'optimizepress') ?></label>
            <p class="micro-copy"><?php _e('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'); ?></p>
            <?php op_color_picker('op[sections][color_scheme_fields][top_nav_dd_hover]',op_default_option('color_scheme_fields','top_nav_dd_hover'),'op_sections_color_scheme_fields_top_nav_dd_hover'); ?>
        </div>
    </div>
</div>
<?php
if(count($js) > 0){
    echo '
<script type="text/javascript">
var op_menu_link_colors = '.json_encode($js).';
</script>';
}
?>