<div id="<?php echo $id; ?>" class="course-description course-description-1">
    <img src="<?php echo $img; ?>"<?php echo (!empty($width) ? ' width="'.$width.'"' : '').(!empty($height) ? ' height="'.$height.'"' : ''); ?>>
    <div><p<?php echo $font; ?>><?php echo $title; ?></p></div>
    <?php echo $content_font_style; ?>
    <div class="course-description-content"<?php echo $content_font; ?>><?php echo $content; ?></div>
</div>