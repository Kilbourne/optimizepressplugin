<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<p class="op-micro-copy"><?php _e('To use this page as part of a pre-launch/launch funnel, use these options. Setup the funnel this page belongs to below or use the override settings', 'optimizepress') ?></p>

	<label for="<?php echo $fieldid ?>funnel_id" class="form-title"><?php _e('Select a Launch Funnel') ?></label>
	<p class="op-micro-copy"><?php printf(__('Assign this page to a launch funnel using the drop-down below. Use the %1$sLaunch Suite%2$s to configure your main launch settings after setting the funnel name below:', 'optimizepress'),'<a href="'.menu_page_url(OP_SN.'-launch-suite',false).'" target="_blank">','</a>');
	$class1 = ' op-hidden';
	$class2 = '';
	if($funnel_count > 0){
		$class2 = $class1;
		$class1 = '';
	}
	?>
    <div id="launch_funnel_select" class="cf<?php echo $class1 ?>">
    	<?php echo $funnel_select.'<span class="create-link">'.sprintf(__('%1$sCreate New%2$s', 'optimizepress'),'<a href="#" id="funnel_switch_create_new">','</a>').'</span>'; ?>
    </div>
    <div id="launch_funnel_new" class="cf<?php echo $class2 ?>">
    	<input type="text" name="<?php echo $fieldname ?>[new_funnel]" id="<?php echo $fieldid ?>new_funnel" value="" />
        <input type="button" class="button" value="<?php _e('Go', 'optimizepress') ?>" id="add_new_funnel" />
        <div class="op-waiting"><img class="op-bsw-waiting op-show-waiting op-hidden" alt="" src="images/wpspin_light.gif" /></div>
    	<span class="create-link"><?php printf(__('or %1$sSelect a current one%2$s', 'optimizepress'),'<a href="#" id="funnel_switch_select">','</a>'); ?></span>
    </div><div class="clear"></div>
        
	<div class="op-bsw-grey-panel section-gateway_override">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Funnel Gateway Override', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','functionality','launch_funnel','gateway_override'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch($section_name,'gateway_override');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
        	<p class="op-micro-copy"><?php _e('Override the main launch funnel settings with these options. The launch gateway will redirect the user to a page of your choosing if they do not use the special access key for the page.', 'optimizepress') ?></p>
            
            <label for="<?php echo $fieldid ?>override_gateway_redirect" class="form-title"><?php _e('Redirect to URL', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Enter the URL that your users browser should be redirected to if they do not use the gateway code to access the page', 'optimizepress') ?></p>
		    <input type="text" name="<?php echo $fieldname ?>[gateway_override][redirect]" id="<?php echo $fieldid ?>gateway_override_redirect" value="<?php op_page_attr_e($section_name,'gateway_override','redirect') ?>" />
            
            <label for="<?php echo $fieldid ?>override_gateway_code" class="form-title"><?php _e('Gateway Access Code', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php printf(__('<strong>Important:</strong> In order for your user to access your page they must use a special gateway code. You can see the gateway code in the box below. Please ensure you have setup a gateway code for your site in the main %1$sLaunch settings%2$s', 'optimizepress'),'<a href="'.menu_page_url(OP_SN.'-launch-suite',false).'" target="_blank">','</a>') ?></p>
		    <input type="text" name="<?php echo $fieldname ?>[gateway_override][code]" id="<?php echo $fieldid ?>gateway_override_code" value="<?php op_page_attr_e($section_name,'gateway_override','code') ?>" />
        </div>
    </div>
</div>