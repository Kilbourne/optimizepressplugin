<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
    <label class="form-title" for="op_sections_promotion_settings_affiliate_url"><?php _e('Affiliate URL'); ?></label>
    <p class="op-micro-copy"><?php _e('Enter your OptimizePress affiliate URL here. This will link to the "Powered by OptimizePress " message in the footer. To promote OptimizePress join at <a target="_blank" href="http://www.optimizepress.com/affiliates">http://www.optimizepress.com/affiliates</a>. Leave blank to remove "Powered by..." message.', 'optimizepress') ?>
    <?php op_text_field('op[sections][promotion_settings][affiliate_url]', op_default_option('promotion_settings', 'affiliate_url')) ?>
</div>