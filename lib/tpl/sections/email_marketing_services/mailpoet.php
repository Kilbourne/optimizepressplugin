<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if (op_assets_provider_enabled('mailpoet') === false): ?>
    <p class="op-micro-copy"><?php _e('MailPoet is disabled. Install and activate MailPoet Newsletters plugin.', 'optimizepress'); ?></p>
    <?php else: ?>
    <p class="op-micro-copy"><?php _e('MailPoet is enabled.', 'optimizepress'); ?></p>
    <?php endif; ?>
</div>