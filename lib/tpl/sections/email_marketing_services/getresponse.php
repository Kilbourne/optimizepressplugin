<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">        
    <label for="op_sections_email_marketing_services_getresponse_api_key" class="form-title"><?php _e('GetResponse API key', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('Copy GetResponse API key here.', 'optimizepress'); ?></p>
    <?php op_text_field('op[sections][email_marketing_services][getresponse_api_key]', op_get_option('getresponse_api_key')); ?>
    <label for="op_sections_email_marketing_services_getresponse_api_url" class="form-title"><?php _e('GetResponse API calls URL', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('If needed copy GetResponse custom API calls URL here.', 'optimizepress'); ?></p>
    <?php 
    	$apiUrl = op_get_option('getresponse_api_url');
    	if (empty($apiUrl)) {
    		$apiUrl = 'http://api2.getresponse.com';
    	}
		op_text_field('op[sections][email_marketing_services][getresponse_api_url]', $apiUrl); 
	?>
</div>