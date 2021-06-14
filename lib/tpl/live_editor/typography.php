<form id="le-typography-dialog">
    <h1><?php _e('Page Typography Settings', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <div class="dialog-content typography">
            <p><?php _e('Customize the main page typography settings here. This will override any styles in the OptimizePress General Settings for this page.', 'optimizepress') ?></p>
            <?php
            $typography_elements = op_typography_elements();
            $fieldname = 'op[sections][typography]';
            $id = 'op_sections_typography_';
            if(isset($typography_elements['font_elements'])):
            ?>
            <ul>
            <?php
            foreach($typography_elements['font_elements'] as $element => $title):
                $help = '';
                if(is_array($title)){
                    $help = op_get_var($title,'help');
                    $title = op_get_var($title,'name');
                }
                $tmp_field = $fieldname.'['.$element.']';
                $tmp_id = $id.$element.'_';?>
                <li>
                    <label for="<?php echo $tmp_id ?>size" class="form-title"><?php echo $title; ?></label>
                     <?php echo (empty($help) ? '':'<p class="op-micro-copy">' . $help . '</p>') ?>
                    <div class="font-chooser cf">
                    <?php
                    $opt_array = array('default_typography','font_elements',$element);
            $page_opt_array = array('typography','font_elements',$element);
            $size = op_default_page_option($page_opt_array,'size');
            $font = op_default_page_option($page_opt_array,'font');
            $style = op_default_page_option($page_opt_array,'style');
            $color = op_default_page_option($page_opt_array,'color');
            $size = (!empty($size) ? op_default_page_option($page_opt_array,'size') : op_default_option($opt_array,'size'));
            $font = (!empty($font) ? op_default_page_option($page_opt_array,'font') : op_default_option($opt_array,'font'));
            $style = (!empty($style) ? op_default_page_option($page_opt_array,'style') : op_default_option($opt_array,'style'));
            $color = (!empty($color) ? op_default_page_option($page_opt_array,'color') : op_default_option($opt_array,'color'));
                    echo op_font_size_dropdown($tmp_field.'[size]',$size,$tmp_id.'size');
                    echo op_font_dropdown($tmp_field.'[font]',$font,$tmp_id.'font');
                    echo op_font_style_dropdown($tmp_field.'[style]',$style,$tmp_id.'style');
                    // echo "<div class='clear'></div>";
                    op_color_picker($tmp_field.'[color]',$color,$tmp_id.'color');
                    ?>
                        <a href="#reset" class="reset-link"><?php _e('Reset', 'optimizepress'); ?></a>
                    </div>

                </li>
            <?php endforeach ?>
            </ul>
            <?php
            endif;
            if(isset($typography_elements['color_elements'])): ?>
            <ul>
            <?php
                foreach($typography_elements['color_elements'] as $element => $title):
                    if ($element == 'feature_text_color' || $element == 'feature_link_color' || $element == 'feature_link_hover_color') continue;
                    $help = '';
                    $text_decoration = false;
                    if(is_array($title)){
                        $help = op_get_var($title,'help');
                        $text_decoration = op_get_var($title,'text_decoration',false);
                        $title = op_get_var($title,'name');
                    }
                    $tmp_field = $fieldname.'['.$element.']';
                    $tmp_id = $id.$element;?>
                <li>
                    <label for="<?php echo $tmp_id ?>size" class="form-title"><?php echo $title; ?></label>
                    <?php echo (empty($help) ? '':'<p class="op-micro-copy">' . $help . '</p>') ?>
                    <div class="font-chooser cf">
                    <?php
            $opt_array = array('default_typography','color_elements',$element);
            $page_opt_array = array('typography','color_elements',$element);
            $page_opts = op_default_page_option($page_opt_array);
            if (is_array($page_opts)){
                $color = $page_opts['color'];
                if (isset($page_opts['text_decoration'])) {
                    $decoration = $page_opts['text_decoration'];
                } else {
                    $decoration = '';
                }
            } else {
                $color = $page_opts;
                $decoration = '';
            }
            $color_test = str_replace('#', '', $color);
            if (empty($color_test)) $color = op_default_option($opt_array,'color');
            if(!empty($decoration)){
                $decoration = op_default_option($opt_array,'decoration');
                op_color_picker($tmp_field.'[color]',$color,$tmp_id.'_color');
                op_text_decoration_drop($tmp_field.'[text_decoration]',$decoration,$tmp_id.'_text_decoration');
            } else {
                op_color_picker($tmp_field,$color,$tmp_id);
            }
                    ?>
                        <a href="#reset" class="reset-link"><?php _e('Reset', 'optimizepress'); ?></a>
                    </div>

                </li>
                <?php endforeach ?>
            </ul>
            <?php endif ?>
        </div>
    </div>
    <div class="op-insert-button cf">
        <button type="submit" class="editor-button"><span><?php _e('Update', 'optimizepress') ?></span></button>
    </div>
</form>