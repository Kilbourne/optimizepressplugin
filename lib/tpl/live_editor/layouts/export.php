<label for="export_layout_name" class="form-title"><?php _e('Name of template', 'optimizepress') ?></label>
<input type="text" name="export_layout_name" id="export_layout_name" />

<label for="export_layout_description" class="form-title"><?php _e('Description of template', 'optimizepress') ?></label>
<textarea cols="20" rows="10" id="export_layout_description" name="export_layout_description"></textarea>

<label for="export_layout_category" class="form-title"><?php _e('Category of template', 'optimizepress') ?></label>
<?php
    $class1 = ' class="op-hidden"';
    $class2 = '';
    if($content_layout_category_count > 0){
        $class2 = $class1;
        $class1 = '';
    }
?>
<div id="export_layout_category_select_container"<?php echo $class1 ?>>
    <?php
    echo $content_layout_category_select.'<span class="create-link"><br />'.sprintf(__('%1$sCreate New%2$s', 'optimizepress'),'<a href="#" id="export_layout_category_create_new">','</a>').'</span>';
    ?>
</div>

<?php if (defined('OP_CONTENT_TEMPLATE_PREVIEW_URL_INPUT')): ?>
    <label for="export_layout_preview_url" class="form-title"><?php _e('Preview URL of template', 'optimizepress') ?></label>
    <input type="text" name="export_layout_preview_url" id="export_layout_preview_url" />
<?php endif; ?>

<div id="export_layout_category_new_container"<?php echo $class2 ?>>
    <input type="text" name="export_layout_category_new" id="export_layout_category_new" value="" />
    <input type="button" class="button" value="<?php _e('Go', 'optimizepress') ?>" id="export_layout_category_new_submit" />
    <div class="op-waiting"><img class="op-bsw-waiting op-show-waiting op-hidden" alt="" src="images/wpspin_light.gif" /></div>
    <span class="create-link"><br /><?php printf(__('%1$sSelect a current one%2$s', 'optimizepress'),'<a href="#" id="export_layout_category_select">','</a>'); ?></span>
</div>

<label for="export_layout_image" class="form-title"><?php _e('Placeholder:', 'optimizepress') ?></label>
<?php op_upload_field('export_layout_image','',false,'file',true) ?>
<br />
<input type="button" name="export_layout_submit" id="export_layout_submit" value="<?php _e('Generate ZIP', 'optimizepress') ?>" />
<div class="op-waiting op-hidden"><img class="op-bsw-waiting op-show-waiting" alt="" src="images/wpspin_light.gif" /></div>
<div id="op_export_content" class="op-export-content"></div>