<form action="<?php menu_page_url(OP_SN) ?>-theme-settings" method="post" enctype="multipart/form-data" class="op-bsw-settings">

    <?php echo $this->load_tpl('header', array('title' => __('Theme Settings', 'optimizepress'))); ?>

    <div class="op-bsw-main-content">

        <?php
        if($notification !== false)
            op_notify($notification);
        if($error !== false)
            op_show_error($error);
        ?>

        <p><?php printf(__('Use these options to customize styling and functionality of your blog.  Ensure you also create and assign menus to your blog Menus within the %1$sWordpress Menus admin panel%2$s if you want to use navigation menus on your blog.', 'optimizepress'),'<a href="nav-menus.php">','</a>') ?></p>

    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed">
    <?php echo $content ?>
    </div>

           <fieldset class="form-actions cf">

            <div class="op-bsw-blog-status">
            <p><span><?php _e('Your blog is currently turned:', 'optimizepress') ?></span><input type="checkbox" class="panel-controlx op-bsw-blog-enabler" name="op_enable_site" value="Y"<?php echo op_get_option('blog_enabled') == 'Y' ? ' checked="checked"' : '' ?> /><!--<img class="op-bsw-waiting" src="images/wpspin_light.gif" alt="" />--></p>
        </div>


                <div class="form-actions-content">
                            <input type="hidden" name="<?php echo OP_SN ?>_theme_settings" value="save" />
                        <?php wp_nonce_field( 'op_theme_settings', '_wpnonce', false ) ?>
                        <input type="submit" class="op-pb-button green" value="<?php _e('Save Settings', 'optimizepress') ?>" />
                    </div>

            </fieldset>

</form>
<?php echo $this->load_tpl('footer');