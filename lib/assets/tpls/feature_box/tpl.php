<div class="<?php echo $style_class; ?> feature-box-align-<?php echo $alignment; ?>"<?php echo $block_style; ?>>
        <?php echo $title_html; ?>
        <div class="feature-box-content cf"<?php echo $content_style; ?>>
            <?php echo $content; ?>
        </div>
</div>

<div class="<?php echo $style_str; ?> feature-box-align-'.$alignment.'"'.$block_style.'>
        '.($has_title?'<h2 class="box-title"'.$title_str.'>'.$title.'</h2>':'').'
        <div class="feature-box-content cf"'.$content_style.'>'.$content.'</div>
</div>