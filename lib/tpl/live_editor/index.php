<?php global $post ?><div id="op-le-editor-separator" class="cf"></div>
<div id="op-le-menu-items" class="op-hidden"><?php
    // echo $content_layouts_dialog; +
    echo $presets_dialog;
    echo op_tpl('live_editor/row_select');
    echo op_tpl('live_editor/row_options');
    echo op_tpl('live_editor/advanced_element');
    echo op_tpl('live_editor/split_column');
    echo op_tpl('live_editor/membership');
    // echo op_tpl('live_editor/typography'); +
    // echo op_tpl('live_editor/settings');
    // echo op_tpl('live_editor/help'); +
    // echo op_tpl('live_editor/elements');
    // echo op_tpl('live_editor/colours'); +
    // echo op_tpl('live_editor/headers');
    // echo $GLOBALS['op_feature_area_dialogs'];
?></div>
<?php echo op_tpl('live_editor/epicbox'); ?>
<!-- LiveEditor Header Toolbar-->
<div id="op-le-settings-toolbar" class="op-le-settings-toolbar--sidebar">
    <div id="op-le-settings-toolbar-container" class="op-le-settings-toolbar-container">
        <div class="container">
            <img src="<?php echo OP_IMG ?>logo-liveeditor.png" alt="LiveEditor" id="op-liveeditor-logo" class="op-logo animated flipInY" />
            <h2 class="op-le-settings-toolbar--title"><?php echo $post->post_title; ?></h2>


            <div class="links"><ul>
                <li class="op-icn op-icn-le_layouts"><a href="#le-headers-dialog"><?php _e('Layout Settings', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_color"><a href="#le-colours-dialog"><?php _e('Colour Scheme Settings', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_typography"><a href="#le-typography-dialog"><?php _e('Typography Settings', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_settings"><a href="#le-settings-dialog"><?php _e('Page Settings', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_membership"><a href="#le-membership-dialog"><?php _e('Membership Settings', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_content"><a href="#le-layouts-dialog"><?php _e('Content Templates', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_revisions"><a href="#op-revisions-dialog"><?php _e('Page Revisions', 'optimizepress') ?></a></li>
                <li class="op-icn op-icn-le_help"><a href="#le-help-dialog"><?php _e('Help', 'optimizepress') ?></a></li>
            </ul></div>

        </div>
        <div id="op-le-toolbar-sidebar" class="op-le-toolbar--sidebar">
            <select name="op[live_editor][status]" id="op-live-editor-status">
                <option value="draft"<?php echo $post->post_status == 'draft' ? ' selected="selected"':'' ?>><?php _e('Draft', 'optimizepress') ?></option>
                <option value="publish"<?php echo $post->post_status == 'publish' ? ' selected="selected"':'' ?>><?php _e('Publish', 'optimizepress') ?></option>
            </select>
            <div class="toggle-container" id="toggle-visibility" ><?php _e('Show/Hide Controls', 'optimizepress'); ?></div>
            <div class="link-container">
                <?php
                if ('publish' == $post->post_status) {
                    $previewLink = esc_url(get_permalink($post->ID));
                } else {
                    $previewLink = set_url_scheme(get_permalink($post->ID));
                    $previewLink = esc_url(apply_filters('preview_post_link', add_query_arg('preview', 'true', $previewLink), $post));
                }
                ?>
                <a class="op-pb-button gray" id="op-view-public-link" href="<?php echo $previewLink; ?>" target="_blank"><?php _e('View Public Link', 'optimizepress'); ?></a>
            </div>
            <?php wp_nonce_field( 'op_liveeditor', 'op_le_wpnonce', false ) ?>
            <div class="save-options">
                <input type="hidden" name="page_id" id="page_id" value="<?php echo OP_PAGEBUILDER_ID ?>" />
                <button type="button" id="op-save-preset" class="op-pb-button gray"><?php _e('Save As Preset', 'optimizepress') ?></button>
                <button type="submit" id="op-le-save-2" class="op-pb-button gray"><?php _e('Save &amp; Close', 'optimizepress') ?></button>
                <button type="submit" id="op-le-save-1" class="op-pb-button green"><?php _e('Save &amp; Continue', 'optimizepress') ?></button>
            </div>
        </div>
    </div>
    <div class="op-le-toggle-sidebar" id="op-le-toggle-sidebar">
        <a class="op-le-toggle-sidebar-btn" id="op-le-toggle-sidebar-btn"><?php _e('Toogle sidebar', 'optimizepress'); ?></a>
    </div>
</div>
