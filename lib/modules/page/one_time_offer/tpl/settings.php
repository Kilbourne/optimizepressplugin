<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<p class="op-micro-copy"><?php _e('Use this option to build scarcity on your sales pages by expiring the page after a set time from the users first visit. This would be combined with an on-page element timer which could be added in the LiveEditor', 'optimizepress') ?></p>

	<label for="<?php echo $fieldid ?>time_days" class="form-title"><?php _e('Expire After', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Select the delay after the users first visit to expire the page.', 'optimizepress') ?></p>
    <?php
	$times = array(
		'days' => array('name'=>__('Days', 'optimizepress'), 'length' => 365),
		'hours' => array('name'=>__('Hours', 'optimizepress'), 'length' => 24),
		'minutes' => array('name'=>__('Minutes', 'optimizepress'), 'length' => 59),
		'seconds' => array('name'=>__('Seconds', 'optimizepress'), 'length' => 59),
	);
	foreach($times as $name => $time){
		echo '<select name="'.$fieldname.'[time]['.$name.']" id="'.$fieldid.'time_'.$name.'"><option value="">'.$time['name'].'</option>';
		$length = $time['length']+1;
		$cur = op_page_option($section_name,'time',$name);
		if($cur === false){
			$cur = '';
		}
		$add_0 = ($name != 'days');
		for($i=0;$i<$length;$i++){
			echo '<option value="'.$i.'"'.($cur != '' && $cur == $i ? ' selected="selected"' : '').'>'.($add_0 && $i < 10 ? '0':'').$i.'</option>';
		}
		echo '</select>';
	}
	?>

	<label for="<?php echo $fieldid ?>url" class="form-title"><?php _e('Redirect To After Page Expired', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Enter the URL that your users browser should be redirected to after the page has expired', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[url]" id="<?php echo $fieldid ?>url" value="<?php op_page_attr_e($section_name,'url') ?>" />
</div>