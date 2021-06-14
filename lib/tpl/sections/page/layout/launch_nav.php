<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_layout_launch_nav">
    <label for="op_header_below_nav" class="form-title"><?php _e('Select Menu for Navigation Bar', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select a menu to assign to this navigation bar. You can create new menus by going to Appearance > Menus in the Wordpress control panel', 'optimizepress') ?></p>
    <select id="op_launch_nav_nav" name="op[launch_nav][nav]"><option value=""><?php _e('None', 'optimizepress') ?></option>
    <?php
		$cur = op_page_option('launch_nav','nav');
		foreach($nav_menus as $nav){
			echo '<option value="'.$nav->term_id.'"'.($cur == $nav->term_id ? ' selected="selected"':'').'>'.$nav->name.'</option>';
		}
	?>
    </select>
</div>