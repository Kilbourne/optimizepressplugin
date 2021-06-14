<?php foreach($fields as $name => $field): 
	$id = 'op_'.$section_name.'_fields_'.$name; 
	$fieldname = 'op['.$section_name.'][fields]['.$name.']'; ?>
<label for="<?php echo $id ?>"><?php _e($field['name'], 'optimizepress') ?></label>
<?php if($field['type'] == 'textarea'): ?>
<textarea name="<?php echo $fieldname ?>" id="<?php echo $id ?>" cols="30" rows="10"><?php echo esc_textarea(op_default_option($section_name,'fields',$name)) ?></textarea>
<?php else: ?>
<input type="text" name="<?php echo $fieldname ?>" id="<?php echo $id ?>" value="<?php echo esc_attr(op_default_option($section_name,'fields',$name)) ?>" />
<?php endif; endforeach ?>