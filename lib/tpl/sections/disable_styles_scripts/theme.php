<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">

    <p class="op-micro-copy"><?php _e('If you are experiencing issues with your LiveEditor pages, sometimes Style Sheets (CSS) or Javascript (JS) files from your theme can cause problems.  Tick any relevant boxes below to disable any Javascript or CSS from installed plugins from rendering on LiveEditor pages.', 'optimizepress'); ?></p>
    <h3><?php _e('Disable on front-end (Published Pages)', 'optimizepress'); ?></h3>
    <p class="op-micro-copy"><?php _e('Disable theme JS or CSS codes from rendering on your live published pages.', 'optimizepress'); ?></p>
    <table width="100%" class="op-disable-compat">
        <tr>
            <th align="left"><?php _e('Theme name', 'optimizepress'); ?></th>
            <th width="10%"><a href="#toggle-css" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="css" class="op-disable-all-css"><?php _e('CSS', 'optimizepress'); ?></a></th>
            <th width="10%"><a href="#toggle-js" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="js" class="op-disable-all-js"><?php _e('JS', 'optimizepress'); ?></a></th>
        </tr>
        <tr>
            <td><?php echo $theme->name; ?></td>
            <td align="center">
                <?php op_checkbox_field('op[sections][external_theme_css]', 1, checked(1, op_get_option('op_external_theme_css'), false), 'data-type="css"'); ?>
            </td>
            <td align="center">
                <?php op_checkbox_field('op[sections][external_theme_js]', 1, checked(1, op_get_option('op_external_theme_js'), false), 'data-type="js"'); ?>
            </td>
        </tr>
    </table>
    <h3><?php _e('Disable for back-end (LiveEditor)', 'optimizepress'); ?></h3>
    <p class="op-micro-copy"><?php _e("Disable theme JS or CSS from rendering inside the LiveEditor (if you're having problems with editing in the LiveEditor).", "optimizepress"); ?></p>
    <table width="100%" class="op-disable-compat">
        <tr>
            <th align="left"><?php _e('Theme name', 'optimizepress'); ?></th>
            <th width="10%"><a href="#toggle-css" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="css" class="op-disable-all-css"><?php _e('CSS', 'optimizepress'); ?></a></th>
            <th width="10%"><a href="#toggle-js" title="<?php _e('Toggle all checkboxes', 'optimizepress'); ?>" data-type="js" class="op-disable-all-js"><?php _e('JS', 'optimizepress'); ?></a></th>
        </tr>
        <tr>
            <td><?php echo $theme->name; ?></td>
            <td align="center">
                <?php op_checkbox_field('op[sections][le_external_theme_css]', 1, checked(1, op_get_option('op_le_external_theme_css'), false), 'data-type="css"'); ?>
            </td>
            <td align="center">
                <?php op_checkbox_field('op[sections][le_external_theme_js]', 1, checked(1, op_get_option('op_le_external_theme_js'), false), 'data-type="js"'); ?>
            </td>
        </tr>
    </table>
</div>