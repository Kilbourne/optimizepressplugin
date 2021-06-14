<div class="submit-button-container" id="<?php echo rtrim($id, '_'); ?>">
	<?php
    $button = $submit_button_object->get_option($section_name);
    $buttonType =  op_get_var($button, 'type');
    echo _op_assets(
        'style_selector',
        array('group' => 'core', 'tag' => 'button', 'folder' => 'forms', 'fieldid' => $id . 'button_type'),
        $fieldname . '[type]',
        $buttonType
    );
    ?>
    <div class="button-option-style button-option-style-0">
        <label><?php _e('Text', 'optimizepress'); ?></label>
        <input type="text" name="<?php echo $fieldname ?>[content]" value="<?php op_attr(op_get_var($button, 'content'), true); ?>" />
    </div>
    <div class="button-option-style button-option-style-1">
        <input type="hidden" name="<?php echo $fieldname; ?>[location]" value="<?php echo rtrim($id, '_'); ?>" />
        <div class="field-id-op_assets_core_button_button_preview">
            <div class="preview_border preview-wrapper">
                <div class="preview-outer">
                    <div class="preview-inner preview_border op-asset-dropdown">
                        <a href="#" class="selected-item css-button style-1" id="op_button_submit_preview">
                            <span class="text">Get Started Now</span>
                            <div class="gradient"></div>
                            <div class="shine"></div>
                            <div class="hover"></div>
                            <div class="active"></div>
                        </a>
                        <?php
                            echo _op_assets(
                                'preset_selector',
                                array('group' => 'core', 'tag' => 'button', 'folder' => 'presets', 'fieldid' => $id . 'preset'),
                                $fieldname . '[preset]',
                                op_get_var($button, 'preset')
                            );
                        ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="op-bsw-grey-panel section-<?php echo $id; ?>-text">
            <div class="op-bsw-grey-panel-header cf">
                <h3><a href="#"><?php _e('Text', 'optimizepress'); ?></a></h3>
                <div class="op-bsw-panel-controls cf">
                    <div class="show-hide-panel"><a href="#"></a></div>
                </div>
            </div>
            <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_<?php echo $id; ?>_text">
                <input type="text" name="<?php echo $fieldname ?>[content]"<?php if ($buttonType != 1) echo ' disabled="disabled"'; ?> id="op_assets_submit_button_text_box_text_properties_1_text" value="<?php op_attr(op_get_var($button,'content', 'Get Started Now'),true) ?>" />
                <?php
                    echo op_font_size_dropdown($fieldname . '[text_size]', op_get_var($button,'text_size', 32), 'op_assets_submit_button_text_box_text_properties_1_size');
                    echo op_font_visual_dropdown_with_input('op_assets_submit_button_text_box_text_properties_1_container', $fieldname . '[text_font]', op_get_var($button, 'text_font'));
                    echo op_color_picker($fieldname . '[text_color]', op_get_var($button,'text_color', '#000000'), 'op_assets_submit_button_text_box_text_properties_1_color', false, true);
                ?>
                <div class="style-checkbox-selector cf field-id-op_assets_submit_button_text_box_text_properties_1">
                    <input name="<?php echo $fieldname; ?>[text_bold]" value="1" type="checkbox"<?php checked('1', op_get_var($button, 'text_bold', '1')); ?> class="op-font-style-checkbox op-font-style-bold" id="op_assets_submit_button_text_box_text_bold_1">
                    <label class="op-font-style-checkbox-bold"><?php _e('Bold', 'optimizepress'); ?></label>
                    <input name="<?php echo $fieldname; ?>[text_italic]" value="1" type="checkbox"<?php checked('1', op_get_var($button, 'text_italic', '0')); ?> class="op-font-style-checkbox op-font-style-italic" id="op_assets_submit_button_text_box_text_italic_1">
                    <label class="op-font-style-checkbox-italic"><?php _e('Italic', 'optimizepress'); ?></label>
                    <input name="<?php echo $fieldname; ?>[text_underline]" value="1" type="checkbox"<?php checked('1', op_get_var($button, 'text_underline', '0')); ?> class="op-font-style-checkbox op-font-style-underline" id="op_assets_submit_button_text_box_text_underline_1">
                    <label class="op-font-style-checkbox-underline"><?php _e('Underline', 'optimizepress'); ?></label>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_text_box_letter_spacing_1">
                    <label><?php _e('Letter Spacing', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[text_letter_spacing]', op_get_var($button, 'text_letter_spacing', 0), 'op_assets_submit_button_text_box_letter_spacing_1', -10, 10);
                    ?>
                </div>
            </div>
        </div>
        <div class="op-bsw-grey-panel section-<?php echo $id; ?>-text-shadow">
            <div class="op-bsw-grey-panel-header cf">
                <h3><a href="#"><?php _e('Text Shadow', 'optimizepress'); ?></a></h3>
                <div class="op-bsw-panel-controls cf">
                    <div class="show-hide-panel"><a href="#"></a></div>
                    <?php _op_on_off_switch_html($fieldname . '[text_shadow_panel]', 'panel_control_op_assets_submit_button_text_shadow', 'Y', '', 'Y' == op_get_var($button, 'text_shadow_panel', 'Y')); ?>
                </div>
            </div>
            <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_<?php echo $id; ?>_text_shadow">
                <div class="field-slider field-id-op_assets_submit_button_text_shadow_vertical_axis_1">
                    <label><?php _e('Vertical Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[text_shadow_vertical]', op_get_var($button, 'text_shadow_vertical', 1), 'op_assets_submit_button_text_shadow_vertical_axis_1', -50, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_text_shadow_horizontal_axis_1">
                    <label><?php _e('Horizontal Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[text_shadow_horizontal]', op_get_var($button, 'text_shadow_horizontal', 0), 'op_assets_submit_button_text_shadow_horizontal_axis_1', -50, 50);
                    ?>
                </div>
                <div class="field-colorpicker field-id-op_assets_submit_button_text_shadow_shadow_color_1">
                    <label><?php _e('Shadow Color', 'optimizepress'); ?></label>
                    <?php echo op_color_picker($fieldname . '[text_shadow_color]', op_get_var($button, 'text_shadow_color', '#ffff00'), 'op_assets_submit_button_text_shadow_shadow_color_1', false, true); ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_text_shadow_blur_radius_1">
                    <label><?php _e('Blur Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[text_shadow_blur]', op_get_var($button, 'text_shadow_blur', 0), 'op_assets_submit_button_text_shadow_blur_radius_1', 0, 50, 'px');
                    ?>
                </div>
            </div>
        </div>
        <div class="op-bsw-grey-panel section-<?php echo $id; ?>-styling">
            <div class="op-bsw-grey-panel-header cf">
                <h3><a href="#"><?php _e('Styling', 'optimizepress'); ?></a></h3>
                <div class="op-bsw-panel-controls cf">
                    <div class="show-hide-panel"><a href="#"></a></div>
                </div>
            </div>
            <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_<?php echo $id; ?>_styling">
                <div class="field-slider field-id-op_assets_submit_button_styling_border_size_1">
                    <label><?php _e('Border Size', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[styling_border_size]', op_get_var($button, 'styling_border_size', 1), 'op_assets_submit_button_styling_border_size_1', 0, 25);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_styling_border_radius_1">
                    <label><?php _e('Border Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[styling_border_radius]', op_get_var($button, 'styling_border_radius', 6), 'op_assets_submit_button_styling_border_radius_1', 0, 100);
                    ?>
                </div>
                <div class="field-colorpicker field-id-op_assets_submit_button_styling_border_color_1">
                    <label><?php _e('Border Color', 'optimizepress'); ?></label>
                    <?php echo op_color_picker($fieldname . '[styling_border_color]', op_get_var($button, 'styling_border_color', '#000000'), 'op_assets_submit_button_styling_border_color_1', false, true); ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_styling_border_opacity_1">
                    <label><?php _e('Border Opacity', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[styling_border_opacity]', op_get_var($button, 'styling_border_opacity', 100), 'op_assets_submit_button_styling_border_opacity_1', 0, 100, '%');
                    ?>
                </div>
                <div class="background-style">
                    <span class="background-style-label"><?php _e('Background', 'optimizepress'); ?></span>
                    <div class="checkbox-container">
                        <input type="checkbox" name="<?php echo $fieldname ?>[styling_gradient]" id="op_assets_submit_button_styling_gradient_1" class="op_styling_property" class="" value="Y" <?php checked(op_get_var($button, 'styling_gradient', 'N'), 'Y'); ?>>
                        <label><?php _e('Gradient', 'optimizepress'); ?></label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" name="<?php echo $fieldname ?>[styling_shine]" id="op_assets_submit_button_styling_shine_1" class="op_styling_property" value="Y" <?php checked(op_get_var($button, 'styling_shine', 'Y'), 'Y'); ?>>
                        <label><?php _e('Shine', 'optimizepress'); ?></label>
                    </div>
                </div>
                <?php
                    echo op_color_picker($fieldname . '[styling_gradient_start_color]', op_get_var($button, 'styling_gradient_start_color', '#ffff00'), 'op_assets_submit_button_styling_gradient_start_color_1', false, true);
                    echo op_color_picker($fieldname . '[styling_gradient_end_color]', op_get_var($button, 'styling_gradient_end_color', '#ffa035'), 'op_assets_submit_button_styling_gradient_end_color_2', false, true);
                ?>
            </div>
        </div>
        <div class="op-bsw-grey-panel section-<?php echo $id; ?>-drop-shadow">
            <div class="op-bsw-grey-panel-header cf">
                <h3><a href="#"><?php _e('Drop Shadow', 'optimizepress'); ?></a></h3>
                <div class="op-bsw-panel-controls cf">
                    <div class="show-hide-panel"><a href="#"></a></div>
                    <?php _op_on_off_switch_html($fieldname . '[drop_shadow_panel]', 'panel_control_op_assets_submit_button_drop_shadow', 'Y', '', 'Y' == op_get_var($button, 'drop_shadow_panel')); ?>
                </div>
            </div>
            <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_<?php echo $id; ?>_drop_shadow">
                <div class="field-slider field-id-op_assets_submit_button_drop_shadow_vertical_axis_2">
                    <label><?php _e('Vertical Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[drop_shadow_vertical]', op_get_var($button, 'drop_shadow_vertical', 1), 'op_assets_submit_button_drop_shadow_vertical_axis_2', -50, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_drop_shadow_horizontal_axis_2">
                    <label><?php _e('Horizontal Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[drop_shadow_horizontal]', op_get_var($button, 'drop_shadow_horizontal', 0), 'op_assets_submit_button_drop_shadow_horizontal_axis_2', -50, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_drop_shadow_border_radius_2">
                    <label><?php _e('Blur Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[drop_shadow_blur]', op_get_var($button, 'drop_shadow_blur', 1), 'op_assets_submit_button_drop_shadow_border_radius_2', 0, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_drop_shadow_spread_radius_1">
                    <label><?php _e('Spread Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[drop_shadow_spread]', op_get_var($button, 'drop_shadow_spread', 0), 'op_assets_submit_button_drop_shadow_spread_radius_1', 0, 50);
                    ?>
                </div>
                <div class="field-colorpicker field-id-op_assets_submit_button_drop_shadow_shadow_color_2">
                    <label><?php _e('Shadow Color', 'optimizepress'); ?></label>
                    <?php echo op_color_picker($fieldname . '[drop_shadow_color]', op_get_var($button, 'drop_shadow_color', '#000000'), 'op_assets_submit_button_drop_shadow_shadow_color_2', false, true); ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_drop_shadow_opacity_1">
                    <label><?php _e('Shadow Opacity', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[drop_shadow_opacity]', op_get_var($button, 'drop_shadow_opacity', 50), 'op_assets_submit_button_drop_shadow_opacity_1', 0, 100, '%');
                    ?>
                </div>
            </div>
        </div>
        <div class="op-bsw-grey-panel section-<?php echo $id; ?>-inset-shadow">
            <div class="op-bsw-grey-panel-header cf">
                <h3><a href="#"><?php _e('Inner Shadow', 'optimizepress'); ?></a></h3>
                <div class="op-bsw-panel-controls cf">
                    <div class="show-hide-panel"><a href="#"></a></div>
                    <?php _op_on_off_switch_html($fieldname . '[inset_shadow_panel]', 'panel_control_op_assets_submit_button_inset_shadow', 'Y', '', 'Y' == op_get_var($button, 'inset_shadow_panel')); ?>
                </div>
            </div>
            <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_container_content_<?php echo $id; ?>_inset_shadow">
                <div class="field-slider field-id-op_assets_submit_button_inset_shadow_vertical_axis_3">
                    <label><?php _e('Vertical Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[inset_shadow_vertical]', op_get_var($button, 'inset_shadow_vertical', 0), 'op_assets_submit_button_inset_shadow_vertical_axis_3', -50, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_inset_shadow_horizontal_axis_3">
                    <label><?php _e('Horizontal Axis', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[inset_shadow_horizontal]', op_get_var($button, 'inset_shadow_horizontal', 0), 'op_assets_submit_button_inset_shadow_horizontal_axis_3', -50, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_inset_shadow_border_radius_3">
                    <label><?php _e('Blur Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[inset_shadow_blur]', op_get_var($button, 'inset_shadow_blur', 0), 'op_assets_submit_button_inset_shadow_border_radius_3', 0, 50);
                    ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_inset_shadow_spread_radius_2">
                    <label><?php _e('Spread Radius', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[inset_shadow_spread]', op_get_var($button, 'inset_shadow_spread', 1), 'op_assets_submit_button_inset_shadow_spread_radius_2', 0, 50);
                    ?>
                </div>
                <div class="field-colorpicker field-id-op_assets_submit_button_inset_shadow_shadow_color_3">
                    <label><?php _e('Shadow Color', 'optimizepress'); ?></label>
                    <?php echo op_color_picker($fieldname . '[inset_shadow_color]', op_get_var($button, 'inset_shadow_color', '#ffff00'), 'op_assets_submit_button_inset_shadow_shadow_color_3', false, true); ?>
                </div>
                <div class="field-slider field-id-op_assets_submit_button_inset_shadow_opacity_2">
                    <label><?php _e('Shadow Opacity', 'optimizepress'); ?></label>
                    <?php
                        echo op_slider_picker($fieldname . '[inset_shadow_opacity]', op_get_var($button, 'inset_shadow_opacity', 50), 'op_assets_submit_button_inset_shadow_opacity_2', 0, 100, '%');
                    ?>
                </div>
            </div>
        </div>
    </div>
    <div class="button-option-style button-option-style-7">
        <label class?"form-title"><?php _e('Button Image', 'optimizepress'); ?></label>
        <?php op_upload_field($fieldname . '[image]', op_get_var($button, 'image')); ?>
    </div>
</div>
<?php if (1 == op_get_var($button, 'type')) : ?>
<script type="text/javascript">
;(function($){
    /*
    * This is a fix for missing ready.promise() on jQuery 1.7.2
    */
    $.Deferred(function(defer) {
        $(defer.resolve);
        $.ready.promise = defer.promise;
    });

    $(document).ready(function(){
        /*
         * 'promise' is needed here as this needs to trigger as the last of the 'ready' functions
         */
        $.ready.promise().done(function() {
            if (typeof(op_submit_button_presets)!='undefined') op_submit_button_presets.trigger(op_submit_button_presets.load('default'), '#<?php echo rtrim($id, "_"); ?>');
        });
    });
}(opjq));
</script>
<?php endif; ?>