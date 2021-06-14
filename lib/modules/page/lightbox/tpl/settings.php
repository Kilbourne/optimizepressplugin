<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<label for="<?php echo $fieldid ?>show_on" class="form-title"><?php _e('When to Show Lightbox', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Choose when to show the Lightbox Popup on your page', 'optimizepress') ?></p>
    <select name="<?php echo $fieldname ?>[show_on]" id="<?php echo $fieldid ?>show_on">
    <?php
	$val = op_page_attr($section_name,'show_on');
	$opts = array('load'=>__('Show on load', 'optimizepress'), 'exit'=>__('Show on exit', 'optimizepress'));
	foreach($opts as $name => $title){
		echo '<option value="'.$name.'"'.($val == $name ? ' selected="selected"' : '').'>'.$title.'</option>';
	}
	?>
    </select>
    
    <div class="op-type-switcher-container">
        <label for="<?php echo $fieldid ?>type" class="form-title"><?php _e('Lightbox Pop Content', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Use the options below to customize the content of your Lightbox Popup
', 'optimizepress') ?></p>
        <select name="<?php echo $fieldname ?>[type]" id="<?php echo $fieldid ?>type" class="op-type-switcher">
        <?php
        $val = op_page_attr($section_name,'type');
        $opts = array('optin'=>__('Opt-in Form', 'optimizepress'), 'html'=>__('HTML Content', 'optimizepress'));
        foreach($opts as $name => $title){
            echo '<option value="'.$name.'"'.($val == $name ? ' selected="selected"' : '').'>'.$title.'</option>';
        }
        ?>
        </select><br />
        <div class="op-type op-type-optin"><?php
        op_mod('signup_form')->display_settings(array($section_name,'optin_form'),array('disable'=>'color_scheme|on_off_switch'));
		?></div>
        <div class="op-type op-type-html"><br /><?php
        op_mod('content_fields')->display_settings(array($section_name,'html_content'),array(
							'fields' => array(
								'content' => array(
									'name' => __('HTML Content', 'optimizepress'),
									'type' => 'textarea',
									'help' => __('Enter HTML content to show in your lightbox.', 'optimizepress'),
								)
							)));
		?></div>
    </div>
    <br />
    <div id="popdom-promote-box">
    	<p><?php printf(__('For more advanced Popup designs, split testing and many more features, we recommend Popup Domination. <a href="%s" target="_blank">Click here</a>', 'optimizepress'),'http://gurucb.popdom.hop.clickbank.net/') ?></p>
    </div>
    
</div>