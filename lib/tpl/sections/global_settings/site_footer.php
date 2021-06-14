<?php $footer_area = op_default_option('site_footer'); ?>

<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_site_footer')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <label for="op_sections_site_footer_copright" class="form-title"><?php _e('Copyright Information', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Copyright information will show on all pages in the footer, when the footer is activated.', 'optimizepress') ?></p>
    <?php op_text_field('op[sections][site_footer][copyright]',op_default_option('site_footer','copyright')) ?>
    <div class="clear"></div>
    
    <label for="op_sections_site_footer_disclaimer" class="form-title"><?php _e('Disclaimer', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Disclaimer will show on all pages in the footer, when the footer is activated.', 'optimizepress') ?></p>
    <?php op_text_area('op[sections][site_footer][disclaimer]',stripslashes(op_default_option('site_footer','disclaimer'))) ?>
    
    <label for="op_sections_site_footer_nav" class="form-title"><?php _e('Footer Navigation', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select a default source for the menu to be assigned to the footer links (next to the copyright message). Select none to show no menu', 'optimizepress') ?></p>
    <select id="op_sections_site_footer_nav" name="op[sections][site_footer][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
    <?php
    $cur = isset ($footer_area['nav']) ? $footer_area['nav'] : 0;
	foreach(wp_get_nav_menus() as $nav){
		echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
	}
	?>
    </select>
    
    <label for="op_sections_site_footer_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('If you would like to change the default font for this navigation menu, you may change these settings below. We recommend using a menu with no more than five items on it.', 'optimizepress') ?></p>
    <?php
    $font_family = (!empty($footer_area['font_family']) ? $footer_area['font_family'] : op_default_option($footer_area, 'font_family'));
    $font_weight = (!empty($footer_area['font_weight']) ? $footer_area['font_weight'] : op_default_option($footer_area, 'font_weight'));
    $font_size = (!empty($footer_area['font_size']) ? $footer_area['font_size'] : op_default_option($footer_area, 'font_size'));
    $font_shadow = (!empty($footer_area['font_shadow']) ? $footer_area['font_shadow'] : op_default_option($footer_area, 'font_shadow'));
    op_font_selector('op[sections][site_footer]', array('family' => $font_family, 'style' => $font_weight, 'size' => $font_size, 'shadow' => $font_shadow), '<div class="op-micro-copy-font-selector">', '</div>', false);
    ?>
</div>