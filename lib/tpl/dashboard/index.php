<form action="<?php menu_page_url(OP_SN.'-dashboard') ?>" method="post" enctype="multipart/form-data" class="op-bsw-settings">

    <?php echo $this->load_tpl('header', array('title' => __('Dashboard', 'optimizepress'))); ?>

    <div class="op-bsw-main-content">

        <?php
        if($notification !== false)
            op_notify($notification);
        if($error !== false)
            op_show_error($error);

        $browser = op_get_current_browser();

        if (($browser['name'] === 'msie') ||
            (($browser['name'] === 'chrome') && $browser['version'] < 20) ||
            (($browser['name'] === 'safari') && $browser['version'] < 6) ||
            (($browser['name'] === 'opera') && $browser['version'] < 15) ||
            (($browser['name'] === 'firefox') && $browser['version'] < 17)
        ) {
            $browser_info = $browser['full_name'] . ' ' . $browser['version'];
            $firefox_link = '<a href="http://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox</a>';
            $chrome_link = '<a href="https://www.google.com/intl/en/chrome/browser/" target="_blank">Chrome</a>';
            $browser_warning = sprintf(__('We have detected that you are using %1s. For optimal performance when using OptimizePress, we recommend using the latest versions of %2s or %3s.', 'optimizepress'), $browser_info, $firefox_link, $chrome_link);

            op_show_warning($browser_warning, true, 'js-remember-choice', 'obsolete-browser');
        }

        ?>

        <p><?php printf(__('Use these options to customize styling and functionality of your pages. Ensure you also create and assign menus to your blog Menus within the %1$sWordpress Menus admin panel%2$s if you want to use navigation menus on your pages.', 'optimizepress'),'<a href="nav-menus.php">','</a>') ?></p>

    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed">
    <?php echo $content ?>
    </div>

    <fieldset class="form-actions cf">

        <div class="op-bsw-blog-status"></div>


        <div class="form-actions-content">
            <input type="hidden" name="<?php echo OP_SN ?>_dashboard" value="save" />
            <?php wp_nonce_field( 'op_dashboard', '_wpnonce', false ) ?>
            <input type="submit" class="op-pb-button green" value="<?php _e('Save Settings', 'optimizepress') ?>" />
        </div>

    </fieldset>

</form>

<?php echo $this->load_tpl('footer');