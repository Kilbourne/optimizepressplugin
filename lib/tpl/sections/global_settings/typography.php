<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar typography">
	<p><?php _e('Choose your page typography settings below. Please remember some fonts won\'t look right at smaller sizes, you can always click "Reset" to restore the page defaults at any time', 'optimizepress') ?></p>
    <?php
	$typography_elements = op_typography_elements();
	$typography_elements['color_elements'] = array_merge($typography_elements['color_elements'], array(
		'footer_link_color' => array(
			'name' => __('Footer Link Text Colour', 'optimizepress'),
			'help' => __('Choose the hyperlink text colour for your page footer area', 'optimizepress'),
			'text_decoration' => true,
		),
		'footer_link_hover_color' => array(
			'name' => __('Footer Link Hover Text Colour', 'optimizepress'),
			'help' => __('Choose the hyperlink hover text colour for your page footer area', 'optimizepress'),
			'text_decoration' => true,
		),
		'feature_text_color' => array(
			'name' => __('Feature Area Text Colour', 'optimizepress'),
			'help' => __('Choose the text colour for the feature area content', 'optimizepress'),
		),
		'feature_link_color' => array(
			'name' => __('Feature Area Link Colour', 'optimizepress'),
			'help' => __('Choose the hyperlink colour for the feature area content', 'optimizepress'),
			'text_decoration' => true,
		),
		'feature_link_hover_color' => array(
			'name' => __('Feature Area Link Hover Colour', 'optimizepress'),
			'help' => __('Choose the hyperlink hover colour for the feature area content', 'optimizepress'),
			'text_decoration' => true,
		)
	));
	$fieldname = 'op[sections][default_typography]';
	$id = 'op_sections_default_typography_';
	if(isset($typography_elements['font_elements'])):
	?>
	<ul>
	<?php
	foreach($typography_elements['font_elements'] as $element => $title):
		$help = '';
		if(is_array($title)){
			$help = op_get_var($title,'help');
			$title = op_get_var($title,'name');
		}
		$tmp_field = $fieldname.'['.$element.']';
		$tmp_id = $id.$element.'_';?>
		<li>
			<label for="<?php echo $tmp_id ?>size" class="form-title"><?php echo $title; ?></label>
			 <?php echo (empty($help) ? '':'<p class="op-micro-copy">' . $help . '</p>') ?>
			<div class="font-chooser cf">
			<?php
			$opt_array = array('default_typography','font_elements',$element);
			$opts = op_get_option($opt_array);
			echo op_font_size_dropdown($tmp_field.'[size]',op_default_option($opt_array,'size'),$tmp_id.'size');
			echo op_font_dropdown($tmp_field.'[font]',op_default_option($opt_array,'font'),$tmp_id.'font');
			echo op_font_style_dropdown($tmp_field.'[style]',op_default_option($opt_array,'style'),$tmp_id.'style');
			// echo "<div class='clear'></div>";
			op_color_picker($tmp_field.'[color]',op_default_option($opt_array, 'color'),$tmp_id.'color');
			op_text_decoration_drop($tmp_field.'[text_decoration]',op_default_option($opt_array,'text_decoration'),$tmp_id.'_text_decoration');
			?>
				<a href="#reset" class="reset-link"><?php _e('Reset', 'optimizepress'); ?></a>
			</div>

		</li>
	<?php endforeach ?>
    </ul>
    <?php
	endif;
	if(isset($typography_elements['color_elements'])): ?>
	<ul>
	<?php
		foreach($typography_elements['color_elements'] as $element => $title):
			$help = '';
			if(is_array($title)){
				$help = op_get_var($title,'help');
				$title = op_get_var($title,'name');
			}
			$tmp_field = $fieldname.'['.$element.']';
			$tmp_id = $id.$element;?>
		<li>
			<label for="<?php echo $tmp_id ?>size" class="form-title"><?php echo $title; ?></label>
			<?php echo (empty($help) ? '':'<p class="op-micro-copy">' . $help . '</p>') ?>
			<div class="font-chooser cf">
			<?php
			$opt_array = array('default_typography','color_elements',$element);
			op_color_picker($tmp_field.'[color]',op_default_option($opt_array,'color'),$tmp_id);
			?>
				<a href="#reset" class="reset-link"><?php _e('Reset', 'optimizepress'); ?></a>
			</div>

		</li>
		<?php endforeach ?>
    </ul>
    <?php endif ?>
</div>