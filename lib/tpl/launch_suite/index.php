<?php echo $this->load_tpl('header', array('title' => __('Launch Suite', 'optimizepress'))); ?>
<form action="<?php menu_page_url(OP_SN.'-launch-suite') ?>&amp;funnel_id=<?php echo $funnel_id ?>" method="post" enctype="multipart/form-data" class="op-bsw-settings op-launch-settings">

    <input type="hidden" name="funnel_id" id="funnel_id" value="<?php echo $funnel_id ?>" />

    <div class="op-bsw-main-content">

        <?php
        if($notification !== false)
            op_notify($notification);
        if($error !== false)
            op_show_error($error);
        ?>

        <?php
        $class1 = ' class="op-hidden"';
        $class2 = '';
        if($funnel_count > 0){
            $class2 = $class1;
            $class1 = '';
        }
        ?>

        <?php if($funnel_count > 0): ?>
            <p><?php printf(__('Use these options to customize styling and functionality of your blog.  Ensure you also create and assign menus to your blog Menus within the %1$sWordpress Menus admin panel%2$s if you want to use navigation menus on your blog.', 'optimizepress'),'<a href="nav-menus.php">','</a>') ?></p>
        <?php endif ?>

        <div id="launch_funnel_select"<?php echo $class1 ?>>
            <div class="funnel-dropdown">
                <strong><?php _e('Select the funnel to manage:', 'optimizepress'); ?></strong>
                <?php echo $funnel_select; ?>
                <span><a href="#" id="funnel_switch_create_new"><?php _e('Create New', 'optimizepress'); ?></a></span>
                <span><a class="button" href="#" id="funnel_delete"><?php _e('Delete This Funnel', 'optimizepress'); ?></a></span>
            </div>
        </div>
        <div id="launch_funnel_new"<?php echo $class2 ?>>
            <input type="text" name="op[funnel_name]" id="new_funnel" value="" />
            <?php wp_nonce_field( 'op_launch_suite', '_wpnonce', false ) ?>
            <input type="button" class="button" value="<?php _e('Go', 'optimizepress') ?>" id="add_new_funnel" />
            <div class="op-waiting"><img class="op-bsw-waiting op-show-waiting" alt="" src="images/wpspin_light.gif" /></div>
            <span class="create-link"><?php printf(__('%1$sSelect a current one%2$s', 'optimizepress'),'<a href="#" id="funnel_switch_select">','</a>'); ?></span>
        </div>

    </div> <!-- end .op-bsw-main-content -->

    <?php if($funnel_found === true): ?>

    <div class="op-bsw-grey-panel-fixed">
        <?php echo $content ?>
    </div>

    <fieldset class="form-actions cf">
        <div class="form-actions-content">
            <input type="hidden" name="<?php echo OP_SN ?>_launch_suite" value="save" />
            <?php wp_nonce_field( 'op_launch_suite', '_wpnonce', false ) ?>
            <input type="submit" class="op-pb-button green" value="<?php _e('Save settings', 'optimizepress') ?>" />
        </div>
    </fieldset>

    <?php endif; ?>

</form>

<div id="launch_suite_new_item" class="op-hidden"><?php echo $hidden ?></div>

<?php echo $this->load_tpl('footer');