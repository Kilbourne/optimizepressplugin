<?php
    $footer_area = op_page_option('footer_area');
    $footer_defaults = op_default_option('site_footer');
?>

<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_layout_footer_area">
    <label for="op_footer_area_nav" class="form-title"><?php _e('Footer Navigation', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select a source for the menu to be assigned to the footer links (next to the copyright message). Select none to show no menu', 'optimizepress') ?></p>
    <select id="op_footer_area_nav" name="op[footer_area][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
    <?php
	$cur = (!empty($footer_area['nav']) ? $footer_area['nav'] : $footer_defaults['nav']);
	foreach($nav_menus as $nav){
		echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
	}
	?>
    </select>
    
    <label for="op_footer_area_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you would like to change the font for this navigation menu, you may change these settings below. We recommend using a menu with no more than five items on it.', 'optimizepress') ?></p>
		<?php
		$font_family = (!empty($footer_area['font_family']) ? $footer_area['font_family'] : $footer_defaults['font_family']);
		$font_weight = (!empty($footer_area['font_weight']) ? $footer_area['font_weight'] : $footer_defaults['font_weight']);
		$font_size = (!empty($footer_area['font_size']) ? $footer_area['font_size'] : $footer_defaults['font_size']);
		$font_shadow = (!empty($footer_area['font_shadow']) ? $footer_area['font_shadow'] : $footer_defaults['font_shadow']);
		op_font_selector('op[footer_area]', array('family' => $font_family, 'style' => $font_weight, 'size' => $font_size, 'shadow' => $font_shadow), '<div class="op-micro-copy-font-selector">', '</div>', false);
		?>
		<div class="clear"></div><br/>
    
    <?php if(!(op_page_config('disable','layout','footer_area','large_footer') === true)): ?>
	<div class="op-bsw-grey-panel section-large_footer">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Extra Large Footer', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','footer_area','large_footer'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch('footer_area','large_footer');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
        	<label class="form-title"><?php _e('Extra Large Footer', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Activate this option if you want to have a larger footer area with space for you to add new elements using the LiveEditor', 'optimizepress') ?></p>
        </div>
    </div>
    <?php endif ?>
	<div class="op-bsw-grey-panel section-footer_disclaimer">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Footer Disclaimer', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','footer_area','footer_disclaimer'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch('footer_area','footer_disclaimer');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <label for="op_footer_area_disclaimer_message" class="form-title"><?php _e('Disclaimer Override', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you want to override the disclaimer message set in the OptimizePress general settings, enter a new disclaimer below. This disclaimer will be shown above the copyright message in your page footer.', 'optimizepress') ?></p>
            <textarea name="op[footer_area][footer_disclaimer][message]" id="op_footer_area_disclaimer_message"><?php echo stripslashes(op_default_page_option('footer_area','footer_disclaimer','message')) ?></textarea>
        </div>
    </div>

</div>