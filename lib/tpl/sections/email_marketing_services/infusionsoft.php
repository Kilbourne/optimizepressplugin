<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">        
    <label for="op_sections_email_marketing_services_infusionsoft_account_id" class="form-title"><?php _e('Account ID/name', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('Enter your application or machine name e.g. ab123. Do not include http:// or any other URL', 'optimizepress'); ?></p>
    <?php op_text_field('op[sections][email_marketing_services][infusionsoft_account_id]', op_get_option('infusionsoft_account_id')); ?>
    <label for="op_sections_email_marketing_services_infusionsoft_api_key" class="form-title"><?php _e('API key', 'optimizepress'); ?></label>
    <?php op_text_field('op[sections][email_marketing_services][infusionsoft_api_key]', op_get_option('infusionsoft_api_key')); ?>
</div>