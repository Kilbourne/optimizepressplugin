<?php
if(isset($elements) && is_array($elements)):
	foreach($elements as $el => $info):
		if(isset($info['title']))
			echo '
	<label class="form-title">'.$info['title'].'</label>';
		if(isset($info['description']))
			echo '
	<p class="op-micro-copy">'.$info['description'].'</p>';
		if(isset($info['type'])){
			if($info['type'] == 'image'){
				echo op_upload_field($fieldname.'['.$el.']',op_default_page_option($opt_array,$el),true);
			} else if ($info['type']=='select'){
				?>
				<select name="<?php echo $fieldname.'['.$el.']'?>" id="<?php echo $fieldid.$el?>">
					<?php
					foreach($info['values'] as $key=>$value){
						?>
						<option value="<?php echo $key?>"<?php echo (op_default_page_option($opt_array,$el)==$key ? ' selected' : '')?>><?php echo $value?></option>
						<?php
					}
					?>
				</select>
				<?php
			}
		} else {
			echo '
	<div class="font-chooser cf">';
			if(isset($info['text_decoration'])){
				op_color_picker($fieldname.'['.$el.'][color]',op_default_page_option($opt_array,$el, 'color'),$fieldid.$el.'_color');
				op_text_decoration_drop($fieldname.'['.$el.'][text_decoration]',op_default_page_option($opt_array,$el,'text_decoration'),$fieldid.$el.'_text_decoration');
			} else {
				op_color_picker($fieldname.'['.$el.']',op_default_page_option($opt_array,$el),$fieldid.$el);
			}
			echo '
		<a href="#reset" class="reset-link">Reset</a>
	</div>';
		}
	endforeach;
endif;