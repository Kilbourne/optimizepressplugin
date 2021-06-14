<?php $conf = op_get_var($config,'page_thumbnails') ?><label class="form-title"><?php _e('Page Thumbnail', 'optimizepress') ?></label>
<p class="op-micro-copy"><?php _e('Select the landing page for this stage of your launch funnel. The user will be redirected here', 'optimizepress') ?></p>
<?php
    op_thumb_gallery('op[funnel_pages]'.$field_name.'[page_thumbnails][active_thumbnail_preset]', op_get_var($conf,'active_thumbnail_preset'), 'page_thumbs');
    op_upload_field('op[funnel_pages]'.$field_name.'[page_thumbnails][active_thumbnail]'.$field_ext,op_get_var($conf,'active_thumbnail'));
?>

<label class="form-title"><?php _e('Coming Soon Thumbnail', 'optimizepress') ?></label>
<p class="op-micro-copy"><?php _e('This page contains your launch content, video or training to add value as part of the launch process', 'optimizepress') ?></p>
<?php
    op_thumb_gallery('op[funnel_pages]'.$field_name.'[page_thumbnails][inactive_thumbnail_preset]', op_get_var($conf,'inactive_thumbnail_preset'), 'page_thumbs');
    op_upload_field('op[funnel_pages]'.$field_name.'[page_thumbnails][inactive_thumbnail]'.$field_ext,op_get_var($conf,'inactive_thumbnail'));
?>