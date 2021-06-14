<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_site_footer')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <label for="op_sections_site_footer_copright" class="form-title"><?php _e('Copyright Information', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Copyright information will show on all pages in the footer, when the footer is activated.', 'optimizepress') ?></p>
    <?php op_text_field('op[sections][site_footer][copyright]',op_default_option('site_footer','copyright')) ?>
    <div class="clear"></div>
    
    <label for="op_sections_site_footer_disclaimer" class="form-title"><?php _e('Disclaimer', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Disclaimer will show on all pages in the footer, when the footer is activated.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][site_footer][disclaimer]',stripslashes(op_default_option('site_footer','disclaimer'))) ?>
</div>