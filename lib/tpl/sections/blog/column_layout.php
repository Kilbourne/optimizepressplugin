<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar column-layout">
	<?php 
	if($layouts = op_theme_config('layouts')):
		$cur_layout = op_get_current_item($layouts['layouts'],op_default_option('column_layout','option'));
		$previews = $js = $widths = $fields = array();
		foreach($layouts['layouts'] as $name => $layout){
			$field_id = 'op_sections_column_layout_'.$name;
			$selected = ($cur_layout == $name);
			$li_class = $input_attr = '';
			if($selected){
				$li_class = ' img-radio-selected';
				$input_attr = ' checked="checked"';
				$fields = op_get_var($layout,'widths',array());
			}
			$preview = $layout['preview'];
			$preview['li_class'] = $li_class;
			$preview['input'] = '<input type="radio" name="op[sections][column_layout][option]" id="'.$field_id.'" value="'.$name.'"'.$input_attr.' />';
			$previews[] = $preview;
			if(isset($layout['widths'])){
				$widths[$name] = $layout['widths'];
			}
		}
		$js['width'] = $layouts['width'];
		$js['widths'] = $widths;
		echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews));
	?>
    <div class="column-container">
    	<h3><?php _e('Choose the width of your columns', 'optimizepress')?></h3>
        <div class="column-editor">
        <?php 
		$fieldid = 'op_sections_column_layout_widths_';
		$fieldname = 'op[sections][column_layout][widths]';
		$default_arr = array('default_config','column_layout','widths');
		foreach($fields as $name => $field): ?>
			<div class="width-<?php echo $name ?>">
				<label for="<?php echo $fieldid.$name ?>" class="form-title"><?php _e($field['title'], 'optimizepress') ?></label>
				<p class="op-micro-copy"><?php printf(__('Enter the width of your sidebar. Enter a value between %1$s and %2$s or click Default to restore default setting', 'optimizepress'),op_get_var($field,'min',230),op_get_var($field,'max',400)); ?></p>
		    	<input type="text" name="<?php echo $fieldname.'['.$name.']' ?>" id="<?php echo $fieldid.$name ?>" value="<?php echo op_default_attr('column_layout','widths',$name) ?>" />
		    	
                <?php op_default_link($fieldid.$name,op_theme_config($default_arr,$name)); ?>
                
				<?php if($error = $this->error('op_sections_column_layout_withs_'.$name)): ?>
                <span class="error"><?php echo $error ?></span>
                <?php endif ?>
			</div>
		<?php endforeach ?>        
        </div>
    </div>
    <script type="text/javascript">
	var op_column_widths = <?php echo json_encode($js) ?>;
	</script>
    <?php endif; ?>
</div>