<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <h4 class="form-title"><?php _e('Reset Content Templates', 'optimizepress') ?></h4>
    <p class="op-micro-copy"><?php _e('Here you can remove all preinstalled content templates and reinstall it again. Use this only if you experience problems!', 'optimizepress') ?></p>
    <input type ="checkbox" name="op[sections][content_templates_reset]" id="op_content_templates_reset" /> <?php echo __('Yes, Reset Content Templates', 'optimizepress');?>
    <div class="clear"></div>
    <h4><?php _e('Content Templates List', 'optimizepress'); ?></h4>
    <p class="op-micro-copy"><?php _e('List of all content templates, both predefined and custom, with ability to delete them.', 'optimizepress'); ?></p>
    <?php 
    	$ajaxNonce = wp_create_nonce('op_content_layout_delete');
    	$le = new OptimizePress_LiveEditor();
    	$data = $le->get_content_layouts();
    	if (count($data) > 0) : foreach ($data as $category => $layouts) : 
    ?>
	<div class="op-content-layout-category">
		<h4><?php echo $category; ?></h4>
		<?php foreach ($layouts as $layout) : list($description, $image) = explode('|', $layout->description); ?>
		<div class="img-radio-item" style="width:196px;">
	        <div class="thumb img-radio-label" style="width:196px;height:196px">
	        	<img src="<?php echo $image; ?>" alt="thumb" width="166" height="166" />
	        	<div class="thumb-overlay" style="width:196px;height:196px"></div>
	        </div>
	        <div class="preview-option cf">
	        	<?php echo $layout->name; ?>
	        	<div class="clear"></div>
	        </div>
	        <a href="#content-layout-<?php echo $layout->id; ?>" onclick="return confirm('<?php _e('Are you sure you want to delete this layout?', 'optimizepress'); ?>');" class="op-js-item-layout-delete" data-id="<?php echo $layout->id; ?>" data-nonce="<?php echo $ajaxNonce; ?>"><?php _e('Delete', 'optimizepress'); ?></a>
	    </div>
	    <?php endforeach; ?>
	    <div class="clear"></div>
	</div>
    <?php
    	endforeach; endif;
    ?>
</div>