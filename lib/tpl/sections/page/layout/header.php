<?php
    //Prepare defaults
    $header_layout = op_page_option('header_layout');
    $header_logo_setup = op_default_option('header_logo_setup');
    if (!empty($header_layout['logo'])) $header_logo_setup['logo'] = $header_layout['logo'];
    if (!empty($header_layout['bgimg'])) $header_logo_setup['bgimg'] = $header_layout['bgimg'];
    if (!empty($header_layout['repeatbgimg'])) $header_logo_setup['repeatbgimg'] = $header_layout['repeatbgimg'];
    if (!empty($header_layout['bgcolor'])) $header_logo_setup['bgcolor'] = $header_layout['bgcolor'];
    if (!empty($header_layout['logoh1'])) $header_logo_setup['logoh1'] = $header_layout['logoh1'];
?>

<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_layout_header">
    <label class="form-title"><?php _e('Header Style', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php printf(__('Use these options to customize styling of your page header.  Ensure you also create and assign menus to your blog Menus within the %1$sWordpress Menus admin panel%2$s if you want to use navigation menus on your blog.', 'optimizepress'),'<a href="nav-menus.php">','</a>') ?></p>
	<?php
	if($layouts = op_page_config('header_layout','menu-positions')):
		$cur_layout = op_get_current_item($layouts,op_default_page_option('header_layout','menu-position'));
		$previews = array();
		$alongside_nav = false;
		foreach($layouts as $name => $layout){
			$field_id = 'op_sections_layout_header_menu-position_'.$name;
			$selected = ($cur_layout == $name);
			$li_class = $input_attr = '';
			if($selected){
				$alongside_nav = ($name == 'alongside');
				$li_class = ' img-radio-selected';
				$input_attr = ' checked="checked"';
			}
			$preview = $layout['preview'];
			$preview['li_class'] = $li_class;
			$preview['input'] = '<input type="radio" name="op[header_layout][menu_position]" id="'.$field_id.'" value="'.$name.'"'.$input_attr.' />';
			$preview['preview_content'] = __($layout['title'], 'optimizepress');
			$previews[] = $preview;
		}
		echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews, 'classextra'=>'menu-position op-thumbnails op-thumbnails--fullwidth '));
    endif; ?>
    <?php if($error = $this->error('op_sections_header')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    <div class="op-header-layout-alongside"<?php if ($cur_layout !== 'alongside') : echo ' style="display:none"'; endif; ?>>
	    <label for="op_header_layout_logo" class="form-title"><?php _e('Upload a logo (optional)', 'optimizepress') ?></label>
	    <p class="op-micro-copy"><?php _e('Upload a logo image to show on your page. We recommend you size your logo to '.OP_HEADER_LOGO_WIDTH.'px by '.OP_HEADER_LOGO_HEIGHT.'px', 'optimizepress') ?></p>
	    <?php 
	    	$headerLogoUrl = '';
	    	if (isset($header_logo_setup['logo']) && !empty($header_logo_setup['logo'])) {
	    		if (strpos($header_logo_setup['logo'], 'http://') === 0 || strpos($header_logo_setup['logo'], 'https://') === 0) {
	    			$headerLogoUrl = $header_logo_setup['logo'];
	    		} else {
	    			$headerLogoUrl = $theme_url . 'styles/' . $header_logo_setup['logo'];
	    		}
	    	}
	    	op_upload_field('op[header_layout][logo]', $headerLogoUrl); 
	    ?>
	    <div class="clear"></div>
	</div>

    <div class="op-header-layout-below"<?php if ($cur_layout !== 'below') : echo ' style="display:none"'; endif; ?>>
	    <label for="op_header_layout_bgimg" class="form-title"><?php _e('Upload a Banner Image', 'optimizepress') ?></label>
	    <p class="op-micro-copy"><?php printf(__('Upload a header image up to %spx in width with any graphics on it', 'optimizepress'),op_page_config('header_width')) ?></p>
	    <?php op_upload_field('op[header_layout][bgimg]',$header_logo_setup['bgimg']) ?>
	</div>

    <label for="op_header_layout_repeatbgimg" class="form-title"><?php _e('Upload Repeating Header Background Image', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('This would normally be a gradient.  Upload a repeating header background image which will be tiled horizontally on your header.  We recommend you use a gradient of your choice which is 1px by 250px or the same height as the banner image above if you have uploaded one', 'optimizepress') ?></p>
    <?php op_upload_field('op[header_layout][repeatbgimg]',(isset($header_logo_setup['repeatbgimg'])) ? $header_logo_setup['repeatbgimg'] : '') ?>
    <label><strong><?php _e('or choose a header background colour', 'optimizepress'); ?></strong></label>
	<?php op_color_picker('op[header_layout][bgcolor]',(isset($header_logo_setup['bgcolor'])) ? $header_logo_setup['bgcolor'] : '','op_header_bgcolor');	?><div class="clear"></div>
	
	<div class="op-header-disable-link">
	    <label for="op_header_disable_link" class="form-title"><?php _e('Remove link on header/logo', 'optimizepress') ?></label>
	    <p class="op-micro-copy"><?php _e('If this is checked, no link will be added to your page header/logo', 'optimizepress'); ?></p>
	    <input type="checkbox" name="op[header_layout][disable_link]" id="op_header_disable_link" <?php echo (isset($header_layout['disable_link']) && $header_layout['disable_link'] == 'on') ? 'checked="checked"' : ''; ?> /> <label for="op_header_disable_link" class="disable_header_link"><?php _e('Remove link on header/logo', 'optimizepress') ?></label>
	</div>

    <div class="op-header-disable-link">
        <label for="op_logoh1" class="form-title"><?php _e('Wrap logo or banner image with H1 tag', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Usefull for SEO when you don\'t define H1 tag on your page', 'optimizepress'); ?></p>
        <input type="checkbox" name="op[header_layout][logoh1]" id="op_header_disable_link" <?php echo (isset($header_layout['logoh1']) && $header_layout['logoh1'] == 'on') ? 'checked="checked"' : ''; ?> /> <label for="op_header_logoh1" class="disable_header_link"><?php _e('Wrap logo or banner image with H1 tag', 'optimizepress') ?></label>
    </div>
	
	<div class="op-header-link" id="op_header_link">
	    <label for="op_header_link" class="form-title"><?php _e('Edit header/logo link', 'optimizepress') ?></label>
	    <p class="op-micro-copy"><?php _e('Here you can edit the header/logo link', 'optimizepress'); ?></p>
	    <input type="text" name="op[header_layout][header_link]" value="<?php echo (!empty($header_layout['header_link'])) ? $header_layout['header_link'] : home_url('/'); ?>" />
	</div>
	<br />

	<div class="op-bsw-grey-panel section-nav_bar_above">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Navigation Bar Above Header', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','header_layout','nav_bar_above'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch('header_layout','nav_bar_above');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <label for="op_header_above_nav" class="form-title"><?php _e('Select Menu for Navigation Bar', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Select a menu to assign to this navigation bar. You can create new menus by going to Appearance > Menus in the Wordpress control panel', 'optimizepress') ?></p>
            <select id="op_header_above_nav" name="op[header_layout][nav_bar_above][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
            <?php
			$cur = op_page_option('header_layout','nav_bar_above','nav');
			foreach($nav_menus as $nav){
				echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
			}
			?>
            </select>


            <label for="op_header_layout_nav_bar_above_logo" class="form-title"><?php _e('Upload Small Navigation Bar Logo (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you want to show a small logo in your navigation bar, upload it here. Ensure the logo is in transparent PNG format and no larger than 100x40px', 'optimizepress') ?></p>
		    <?php op_upload_field('op[header_layout][nav_bar_above][logo]',op_default_page_option('header_layout','nav_bar_above','logo')) ?>

	    <label for="op_header_layout_nav_bar_above_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you would like to change the font for this navigation menu, you may change these settings below.', 'optimizepress') ?></p>
			<?php
			$font_family = (isset($header_layout['nav_bar_above']['font_family']) ? $header_layout['nav_bar_above']['font_family'] : op_default_option($header_layout['nav_bar_above'], 'font_family'));
			$font_weight = (isset($header_layout['nav_bar_above']['font_weight']) ? $header_layout['nav_bar_above']['font_weight'] : op_default_option($header_layout['nav_bar_above'], 'font_weight'));
			$font_size = (isset($header_layout['nav_bar_above']['font_size']) ? $header_layout['nav_bar_above']['font_size'] : op_default_option($header_layout['nav_bar_above'], 'font_size'));
			$font_shadow = (isset($header_layout['nav_bar_above']['font_shadow']) ? $header_layout['nav_bar_above']['font_shadow'] : op_default_option($header_layout['nav_bar_above'], 'font_shadow'));
			op_font_selector('op[header_layout][nav_bar_above]', array('family' => $font_family, 'style' => $font_weight, 'size' => $font_size, 'shadow' => $font_shadow), '<div class="op-micro-copy-font-selector">', '</div>', false);
			?>
			<div class="clear"></div><br/>
        </div>
    </div>

	<div class="op-bsw-grey-panel section-nav_bar_below">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Navigation Bar Below Header', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','header_layout','nav_bar_above'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch('header_layout','nav_bar_below');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <label for="op_header_below_nav" class="form-title"><?php _e('Select Menu for Navigation Bar', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Select a menu to assign to this navigation bar. You can create new menus by going to Appearance > Menus in the Wordpress control panel', 'optimizepress') ?></p>
            <select id="op_header_below_nav" name="op[header_layout][nav_bar_below][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
            <?php
			$cur = op_page_option('header_layout','nav_bar_below','nav');
			foreach($nav_menus as $nav){
				echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
			}
			?>
            </select>



            <label for="op_header_layout_nav_bar_below_logo" class="form-title"><?php _e('Upload Small Navigation Bar Logo (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you want to show a small logo in your navigation bar, upload it here. Ensure the logo is in transparent PNG format and no larger than 100x40px', 'optimizepress') ?></p>
		    <?php op_upload_field('op[header_layout][nav_bar_below][logo]',op_default_page_option('header_layout','nav_bar_below','logo')) ?>

	    <label for="op_header_layout_nav_bar_below_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you would like to change the font for this navigation menu, you may change these settings below.', 'optimizepress') ?></p>
			<?php
			$font_family = (isset($header_layout['nav_bar_below']['font_family']) ? $header_layout['nav_bar_below']['font_family'] : op_default_option($header_layout['nav_bar_below'], 'font_family'));
			$font_weight = (isset($header_layout['nav_bar_below']['font_weight']) ? $header_layout['nav_bar_below']['font_weight'] : op_default_option($header_layout['nav_bar_below'], 'font_weight'));
			$font_size = (isset($header_layout['nav_bar_below']['font_size']) ? $header_layout['nav_bar_below']['font_size'] : op_default_option($header_layout['nav_bar_below'], 'font_size'));
			$font_shadow = (isset($header_layout['nav_bar_below']['font_shadow']) ? $header_layout['nav_bar_below']['font_shadow'] : op_default_option($header_layout['nav_bar_below'], 'font_shadow'));
			op_font_selector('op[header_layout][nav_bar_below]', array('family' => $font_family, 'style' => $font_weight, 'size' => $font_size, 'shadow' => $font_shadow), '<div class="op-micro-copy-font-selector">', '</div>', false);
			?>
			<div class="clear"></div><br/>
        </div>
    </div>

	<div class="op-bsw-grey-panel section-nav_bar_alongside" id="op_page_layout_header_nav_bar_alongside">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php _e('Navigation Bar Alongside Logo', 'optimizepress') ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','header_layout','nav_bar_above'),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
                <?php
                $enabled = op_page_on_off_switch('header_layout','nav_bar_alongside');
				echo $help_vid;
				?>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
            <label for="op_header_alongside_nav" class="form-title"><?php _e('Select Menu for Navigation Bar', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('Select a menu to assign to this navigation bar. You can create new menus by going to Appearance > Menus in the Wordpress control panel', 'optimizepress') ?></p>
            <select id="op_header_alongside_nav" name="op[header_layout][nav_bar_alongside][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
            <?php
			$cur = op_page_option('header_layout','nav_bar_alongside','nav');
			foreach($nav_menus as $nav){
				echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
			}
			?>
            </select>

	    <label for="op_header_layout_nav_bar_alongside_font" class="form-title"><?php _e('Select Navigation Bar Font (optional)', 'optimizepress') ?></label>
            <p class="op-micro-copy"><?php _e('If you would like to change the font for this navigation menu, you may change these settings below.', 'optimizepress') ?></p>
			<div class="op-micro-copy-font-selector">
				<?php
				$font_family = (isset($header_layout['nav_bar_alongside']['font_family']) ? $header_layout['nav_bar_alongside']['font_family'] : op_default_option($header_layout['nav_bar_alongside'], 'font_family'));
				$font_weight = (isset($header_layout['nav_bar_alongside']['font_weight']) ? $header_layout['nav_bar_alongside']['font_weight'] : op_default_option($header_layout['nav_bar_alongside'], 'font_weight'));
				$font_size = (isset($header_layout['nav_bar_alongside']['font_size']) ? $header_layout['nav_bar_alongside']['font_size'] : op_default_option($header_layout['nav_bar_alongside'], 'font_size'));
				$font_shadow = (isset($header_layout['nav_bar_alongside']['font_shadow']) ? $header_layout['nav_bar_alongside']['font_shadow'] : op_default_option($header_layout['nav_bar_alongside'], 'font_shadow'));
				op_font_selector('op[header_layout][nav_bar_alongside]', array('family' => $font_family, 'style' => $font_weight, 'size' => $font_size, 'shadow' => $font_shadow), '<div class="op-micro-copy-font-selector">', '</div>', false);
				?>
			</div>
			<div class="clear"></div><br/>
        </div>
    </div>

</div>