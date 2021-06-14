<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <p class="op-micro-copy">
        <?php _e('Sign-up for <b><a href="https://www.google.com/recaptcha/" target="_blank">Google ReCaptcha v3</a></b> and enter site key & secret in order to apply it to all opt-in forms.', 'optimizepress'); ?>
    </p>
    <?php if($error = $this->error('op_sections_google_recaptcha')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <label for="op_sections_google_recaptcha" class="form-title"><?php _e('Google ReCaptcha v3 Site Key', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][google_recaptcha][google_recaptcha_site_key]', op_get_option('google_recaptcha_site_key')) ?>
    <div class="clear"></div>
    
    <label for="op_sections_site_footer_disclaimer" class="form-title"><?php _e('Google ReCaptcha v3 Secret Key', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][google_recaptcha][google_recaptcha_secret_key]', op_get_option('google_recaptcha_secret_key')) ?>
</div>