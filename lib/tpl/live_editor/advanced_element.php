<div id="op-le-advanced">
    <h1><?php _e('Advanced element options', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">
        <?php do_action('op_advanced_element_options_before'); ?>

        <label><?php _e('Code before element', 'optimizepress');?></label>
        <p class="op-micro-copy"><?php _e('Enter shortcode or similar which will be rendered before the element', 'optimizepress');?></p>
        <textarea name="op_advanced_code_before" id="op_advanced_code_before"></textarea>

        <label><?php _e('Code after element', 'optimizepress');?></label>
        <p class="op-micro-copy"><?php _e('Enter shortcode or similar which will be rendered after the element', 'optimizepress');?></p>
        <textarea name="op_advanced_code_after" id="op_advanced_code_after"></textarea>

        <label><?php _e('Hide element for mobile phones?', 'optimizepress');?></label>
        <input type="checkbox" name="op_hide_phones" />

        <label><?php _e('Hide element for tablets?', 'optimizepress');?></label>
        <input type="checkbox" name="op_hide_tablets" />

        <label><?php _e('Element class', 'optimizepress');?></label>
        <input type="text" name="op_advanced_class" id="op_advanced_class" />

        <label><?php  _e('Delayed fade-in', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e("Enter number of seconds after which the element will fade in", "optimizepress") ?></p>
        <input type="text" name="op_advanced_fadein" id="op_advanced_fadein" />

        <?php do_action('op_advanced_element_options_after'); ?>
    </div>
    <div class="op-insert-button cf">
        <button type="button" id="op-le-advanced-update" class="editor-button"><?php _e('Update', 'optimizepress') ?></button>
    </div>
</div>