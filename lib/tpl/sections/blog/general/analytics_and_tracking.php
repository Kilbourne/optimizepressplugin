<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_analytics_and_tracking')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <label for="op_sections_analytics_and_tracking" class="form-title"><?php _e('Google Analytics Tracking Code', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Tracking code given by Google Analytics goes here.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][analytics_and_tracking][google_analytics_tracking_code]',stripslashes(op_default_option('analytics_and_tracking','google_analytics_tracking_code'))) ?>
    <div class="clear"></div>
    
    <label for="op_sections_site_footer_disclaimer" class="form-title"><?php _e('Disclaimer', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Tracking code given by other analytics suites goes here.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][analytics_and_tracking][sitewide_tracking_code]',stripslashes(op_default_option('analytics_and_tracking','sitewide_tracking_code'))) ?>
</div>