<?php echo $this->load_tpl('header', array('title' => __('Support', 'optimizepress'))); ?>
<form action="<?php menu_page_url(OP_SN . '-support'); ?>" method="post" enctype="multipart/form-data" class="op-bsw-settings op-support-screen">
    <div class="op-bsw-main-content cf">

    <?php

        if ($notification !== null) {
            op_notify($notification);
        }

        if ($error !== null) {
            op_show_error($error);
        }
    ?>
        <div class="op-support-column-1">
            <p><?php _e('If you need help using OptimizePress, use the tools and information on this page to assist you.', 'optimizepress'); ?></p>
            <p><?php _e('The <i>System Status</i> section below can be used to help provide our support team with additional information about your OptimizePress installation.', 'optimizepress'); ?></p>
            <p><?php _e('The Disable Styles &amp; Scripts section can be used to help solve conflicts with plugins &amp; themes running on your site.', 'optimizepress'); ?></p>
        </div>
        <div class="op-support-column-2">
            <h3><?php _e('Useful Support Links', 'optimizepress'); ?></h3>
            <p><?php printf(__('<a href="%s" target="_blank" style="text-decoration:none;"><strong>» Getting Started Guides</strong></a> - The quickest way to get started using OptimizePress with our training guides', 'optimizepress'), 'http://optimizelink.com/getting-started'); ?></p>
            <p><?php printf(__('<a href="%s" target="_blank" style="text-decoration:none;"><strong>» OptimizePress Knowledgebase</strong></a> - Search our knowledgebase of answers and submit a ticket to our support team', 'optimizepress'), 'http://optimizelink.com/kb'); ?></p>
            <p><?php printf(__('<a href="%s" target="_blank" style="text-decoration:none;"><strong>» Troubleshooting Guide</strong></a> - Follow our troubleshooting guide to help fix problems you are experiencing', 'optimizepress'), 'http://optimizelink.com/troubleshooting'); ?></p>
        </div>

    </div> <!-- end .op-bsw-main-content -->

    <div class="op-bsw-grey-panel-fixed">
        <?php echo $content ?>
    </div>

    <fieldset class="form-actions cf">
        <div class="op-bsw-blog-status"></div>
        <div class="form-actions-content">
            <input type="hidden" name="<?php echo OP_SN ?>_support" value="save" />
            <?php wp_nonce_field( 'op_support', '_wpnonce', false ) ?>
            <button class="op-pb-button green op-support-to-clipboard"><?php _e('Copy to Clipboard', 'optimizepress'); ?></button>
            <input type="submit" class="op-pb-button green op-disable-styles-scripts-button" style="display: none;" value="<?php _e('Save Settings', 'optimizepress') ?>" />
        </div>
    </fieldset>

</form>
<?php echo $this->load_tpl('footer') ?>