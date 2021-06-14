<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_analytics_and_tracking')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>

    <label for="op_sections_analytics_and_tracking_google_analytics_tracking_code" class="form-title"><?php _e('Header Tracking & Analytics Codes', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter any tracking or analytics code which need to be placed in the page header before the &lt;/head&gt; tag.  Google Analytics code should be placed here (you can  also add other codes if you need to in the same box)', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][analytics_and_tracking][google_analytics_tracking_code]',stripslashes(op_default_option('analytics_and_tracking','google_analytics_tracking_code'))) ?>
    <div class="clear"></div>

    <label for="op_sections_analytics_and_tracking_in_body_tag_code" class="form-title"><?php _e('Tracking & Analytics Codes In Body', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter any tracking or analytics code which need to be placed after the &lt;body&gt; tag.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][analytics_and_tracking][in_body_tag_code]',stripslashes(op_default_option('analytics_and_tracking','in_body_tag_code'))) ?>
    <div class="clear"></div>

    <label for="op_sections_analytics_and_tracking_sitewide_tracking_code" class="form-title"><?php _e('Other Tracking Codes', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter any code here which needs to be placed at the footer of the page code before the &lt;/body&gt; tag', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][analytics_and_tracking][sitewide_tracking_code]',stripslashes(op_default_option('analytics_and_tracking','sitewide_tracking_code'))) ?>
</div>