<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" style="display:block;">

    <p class="op-micro-copy"><?php _e('If you are experiencing issues with your LiveEditor pages, sometimes Style Sheets (CSS) or Javascript (JS) files from installed plugins can cause problems.  Tick any relevant boxes below to disable any Javascript or CSS from installed plugins from rendering on LiveEditor pages. ', 'optimizepress'); ?></p>
    <p class="op-micro-copy"><?php _e('<strong>Please note:</strong> If you are using plugins to render elements or functionality to your LiveEditor pages it is not recommended that you disable CSS or JS as this may stop the plugin from functioning on those pages.  We also do not recommend disabling any OptimizePress or OptimizeMember plugins as these have been tested for compatibility.', 'optimizepress'); ?></p>
    <?php if (count($plugins) > 0) : ?>
    <h3><?php _e('Disable on front-end (Published Pages)', 'optimizepress'); ?></h3>
    <p class="op-micro-copy"><?php _e('Disable specific plugin JS or CSS codes from rendering on your live published pages.', 'optimizepress'); ?></p>
    <!-- <table width="100%" class="op-disable-compat"> -->
    <table class="op-support-table op-disable-compat">
        <tr>
            <th align="left"><?php _e('Plugin name', 'optimizepress'); ?></th>
            <th width="10%"><a href="#toggle-css" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="css" class="op-disable-all-css"><?php _e('CSS', 'optimizepress'); ?></a></th>
            <th width="10%"><a href="#toggle-js" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="js" class="op-disable-all-js"><?php _e('JS', 'optimizepress'); ?></a></th>
       </tr>
        <?php $hasActive = false; ?>
        <?php foreach ($plugins as $pluginId => $plugin) : if (!is_plugin_active($pluginId)) { continue; } ?>
        <?php $hasActive = true; ?>
        <?php if (false !== strpos(strtolower($plugin['Name']), 'optimizepress') || false !== strpos(strtolower($plugin['Name']), 'optimizemember')){ continue; } ?>
        <tr>
            <?php $pluginId = substr($pluginId, 0, strpos($pluginId, '/')); ?>
            <td><?php echo $plugin['Name']; ?></td>
            <td align="center">
                <input type="checkbox" name="op[sections][external_plugins][css][]" data-type="css" value="<?php echo esc_attr($pluginId); ?>" <?php checked(true, is_array(op_get_option('op_external_plugins_css')) && in_array($pluginId, op_get_option('op_external_plugins_css'))); ?> />
            </td>
            <td align="center">
                <input type="checkbox" name="op[sections][external_plugins][js][]" data-type="js" value="<?php echo esc_attr($pluginId); ?>" <?php checked(true, is_array(op_get_option('op_external_plugins_js')) && in_array($pluginId, op_get_option('op_external_plugins_js'))); ?> />
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
    <h3><?php _e('Disable for back-end (LiveEditor)', 'optimizepress'); ?></h3>
    <p class="op-micro-copy"><?php _e("Disable specific plugin JS or CSS from rendering inside the LiveEditor (if you're having problems with editing in the LiveEditor).", "optimizepress"); ?></p>
    <table width="100%" class="op-disable-compat">
        <tr>
            <th align="left"><?php _e('Plugin name', 'optimizepress'); ?></th>
            <th width="10%"><a href="#toggle-css" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" class="op-disable-all-css" data-type="css"><?php _e('CSS', 'optimizepress'); ?></a></th>
            <th width="10%"><a href="#toggle-js" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" class="op-disable-all-js" data-type="js"><?php _e('JS', 'optimizepress'); ?></a></th>
        </tr>
        <?php $hasActive = false; ?>
        <?php foreach ($plugins as $pluginId => $plugin) : if (!is_plugin_active($pluginId)) { continue; } ?>
        <?php $hasActive = true; ?>
        <?php if (false !== strpos(strtolower($plugin['Name']), 'optimizepress') || false !== strpos(strtolower($plugin['Name']), 'optimizemember')){ continue; } ?>
        <tr>
            <?php $pluginId = substr($pluginId, 0, strpos($pluginId, '/')); ?>
            <td><?php echo $plugin['Name']; ?></td>
            <td align="center">
                <input type="checkbox" name="op[sections][le_external_plugins][css][]" data-type="css" value="<?php echo esc_attr($pluginId); ?>" <?php checked(true, is_array(op_get_option('op_le_external_plugins_css')) && in_array($pluginId, op_get_option('op_le_external_plugins_css'))); ?> />
            </td>
            <td align="center">
                <input type="checkbox" name="op[sections][le_external_plugins][js][]" data-type="js" value="<?php echo esc_attr($pluginId); ?>" <?php checked(true, is_array(op_get_option('op_le_external_plugins_js')) && in_array($pluginId, op_get_option('op_le_external_plugins_js'))); ?> />
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
    <?php endif; ?>

    <?php if (false === $hasActive) : ?>
    <p><em><?php _e('No active plugins', 'optimizepress'); ?></em></p>
    <?php endif; ?>
</div>