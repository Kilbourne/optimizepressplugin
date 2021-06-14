<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_gmaps_api_key')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>

	<p class="op-micro-copy"><?php _e('To use Optimizepress Plus Pack Map element you need to generate Google Maps API key. You can create your API key following this ', 'optimizepress') ?><a href="https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend&keyType=CLIENT_SIDE&reusekey=true" target="_blank">link</a>.</p>
	<label for="op_sections_gmaps_api_key" class="form-title"><?php _e('Google Maps Api Key', 'optimizepress'); ?></label>
	<?php op_text_field('op[sections][gmaps_api_key]',op_default_option('gmaps_api_key')); ?>

    <div class="clear"></div>
</div>