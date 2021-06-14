<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar op-opleads-dashboard-section cf">
    <label for="optimizeleads_api_key" class="form-title"><?php _e('Enter OptimizeLeads API Key', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Login to the OptimizeLeads, open <a href="https://my.optimizeleads.com/api-keys" target="blank">API Keys</a> screen from the submenu on Integrations page, create new API key, and paste it here.', 'optimizepress') ?></p>
    <?php
        $errorClass = '';
        $api_key_error = op_default_attr('optimizeleads_api_key_error');

        if ($error = $this->error('op_sections_optimizeleads')) {
            echo '<span class="error">' . $error . '</span>';
            $errorClass = 'optimizeleads-api-key-error';
        } elseif (!empty($api_key_error)) {
            echo '<span class="error">' . op_default_attr('optimizeleads_api_key_error') . '</span>';
            $errorClass = 'optimizeleads-api-key-error';
        }
    ?>
    <input type="text" name="op[sections][optimizeleads_api_key]" id="optimizeleads_api_key" class="<?php echo $errorClass; ?>" value="<?php echo op_default_attr('optimizeleads_api_key'); ?>" />
    <div class="clear"></div>
</div>