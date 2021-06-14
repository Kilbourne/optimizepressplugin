<?php foreach($content_fields as $name => $field): ?>
<p>
	<label for="<?php echo $id ?>content_<?php echo $name ?>"><?php echo $field['name'] ?></label>
    <?php
	switch($field['type']){
		case 'textarea':
			echo '<textarea name="'.$fieldname.'[content]['.$name.']" id="'.$id.'content_'.$name.'">'.op_default_attr($section_name,'content',$name).'</textarea>';
			break;
		default:
			echo '<input type="text" name="'.$fieldname.'[content]['.$name.']" id="'.$id.'content_'.$name.'" value="'.op_default_attr($section_name,'content',$name).'" />';
			break;
	}
	?>
</p>
<?php endforeach ?>