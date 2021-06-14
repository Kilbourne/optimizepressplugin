<?php echo $this->load_tpl('header', array('title' => __('Install', 'optimizepress'),'hide_all'=>true)); ?>

<form action="<?php menu_page_url(OP_SN.'-dashboard') ?>" method="post" class="op-bsw-settings">

    <div class="op-bsw-main-content">

                <?php
            if($notification !== false)
                op_notify($notification);
            if($error !== false)
                op_show_error($error);
        ?>

        <p><?php _e('Welcome to OptimizePress. To get started please provide API key below so we can verify the legitimacy of this copy. You will only need to do this once.', 'optimizepress') ?></p>
        <p><?php _e('To find your API key, <a href="http://www.optimizelink.com/api-key" target="_blank">click here</a> go to the OptimizePress Hub login using your OptimizePress login details sent to you in your welcome email.  Once logged in, go to the Licensing page to find your API keys.', 'optimizepress') ?></p>


    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed" style="border-top: 1px solid #ccc;" >

        <div class="op-bsw-main-content">
            <p>
                <label for="op_install_order_number" style="font-weight:bold"><?php _e('API Key', 'optimizepress') ?></label>&nbsp;&nbsp;&nbsp;
                <input type="text" name="op[install][order_number]" id="op_install_order_number" value="<?php echo esc_attr(op_sl_get_key()); ?>" />
            </p>
        </div>
    </div>

    <fieldset class="form-actions cf">
        <div class="form-actions-content">
            <input type="hidden" name="<?php echo OP_SN ?>_install" value="save" />
            <?php wp_nonce_field( 'op_install', '_wpnonce', false ) ?>
            <input type="submit" class="op-pb-button green" value="<?php _e('Save settings', 'optimizepress') ?>" />
        </div>
    </fieldset>

</form>

<?php echo $this->load_tpl('footer') ?>
