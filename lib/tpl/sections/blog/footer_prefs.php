<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<?php 
	if(isset($footer_prefs['columns'])):
		$cols = $footer_prefs['columns'];
		$path = OP_IMG;
		$previews = array();
		$max = $cols['max']+1;
		if(($sel = op_default_attr('footer_prefs','value')) && ($sel >= $cols['min'] && $sel <= $cols['max'])){
			$selected = $sel;
		} else {
			$selected = $cols['min'];
		}
		for($i=$cols['min'];$i<$max;$i++){
			$li_class = $input_attr = '';
			if($selected == $i){
				$li_class = ' img-radio-selected';
				$input_attr = ' checked="checked"';
			}
			$preview = array(
				'image' => $path.'cols'.$i.'.png',
				'li_class' => $li_class,
				'width' => 79,
				'height' => 79,
				'input' => '<input type="radio" name="op[sections][footer_prefs][value]" id="op_sections_footer_prefs_value_'.$i.'" value="'.$i.'"'.$input_attr.' />'
			);
			$previews[] = $preview;
		}
	?>
    <h3><?php _e('Select the number of columns in your footer', 'optimizepress') ?></h3>
	<p class="op-micro-copy"><?php printf(__('Choose 1-4 columns for your blog footer. Set the column widths below.  Add content to your footer by adding widgets to the "Sub Footer Section" panel on the %1$sWidgets%2$s page.  Only insert the same number of widgets as you have set columns to maintain the layout', 'optimizepress'),'<a href="widgets.php">','</a>') ?></p>
    <?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'footer-columns')); ?>
    <div class="column-container">
    	<h3><?php _e('Choose the width of your columns', 'optimizepress') ?></h3>
        <div class="column-editor">
        <?php 
		$fieldid = 'op_sections_footer_prefs_widths_';
		$fieldname = 'op[sections][footer_prefs][widths]';
		$default_arr = array('default_config','footer_prefs','widths');
		for($i=1;$i<$max;$i++): ?>
			<div class="width-<?php echo $i ?>">
				<label for="<?php echo $fieldid.$i ?>" class="form-title"><?php printf(__('Column %1$s', 'optimizepress'),$i) ?></label>
		    	<p class="op-micro-copy"><?php printf(__('Set the width for column %1$s of your blog footer.', 'optimizepress'),$i).($i==1?_e(' This will be the left-most column', 'optimizepress'):'') ?></p>
		    	<input type="text" name="<?php echo $fieldname.'['.$i.']' ?>" id="<?php echo $fieldid.$i ?>" value="<?php echo op_default_attr('footer_prefs','widths',$i) ?>" />
                <?php
				// op_default_link($fieldid.$i,op_theme_config($default_arr,$i)) 
				?>
                
                <?php if($error = $this->error('op_sections_footer_prefs_widths_'.$i)): ?>
                <span class="error"><?php echo $error ?></span>
                <?php endif ?>
			</div>
		<?php endfor ?>        
        </div>
    </div>
    <script type="text/javascript">
	var op_footer_prefs = <?php echo json_encode($footer_prefs) ?>;
	</script>
    <?php endif ?>
</div>
