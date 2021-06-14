<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_custom_css')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>

    <label for="op_sections_custom_css" class="form-title"><?php _e('Custom CSS', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Custom CSS will assist styling every page.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][custom_css]',stripslashes(op_default_option('custom_css'))) ?>
    <div class="clear"></div>
</div>