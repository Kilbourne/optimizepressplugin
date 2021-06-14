<?php
$style = '';
if($cur = $signup_form_object->get_option($section_name,'color_scheme')){
	$style .= ' style="background-image:url(\''.$color_schemes[$cur]['preview'].'\')"';
} else {
	$cur = '';
}
?>
<p>
	<select name="<?php echo $fieldname ?>[color_scheme]" id="<?php echo $id ?>color_scheme" class="color_scheme_selector">
    <?php foreach($color_schemes as $name => $scheme): ?>
    	<option value="<?php echo $name ?>"<?php echo $name == $cur ? ' selected="selected"':'' ?>><?php _e($scheme['title'], 'optimizepress') ?></option>
    <?php endforeach ?>
    </select>
</p>
<div class="preview"<?php echo $style ?>></div>
<input type="hidden" class="section_name" value="<?php echo $section_name ?>" />