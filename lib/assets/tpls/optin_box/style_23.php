<?php include 'style.inc.php'; ?>

<div id="<?php echo $id; ?>" class="optin-box optin-box-23"<?php echo $style_str; ?>>
	<?php
		$headline = op_get_var($content,'headline','','<h2'.$h2_style.'>%1$s</h2>');
		echo !empty($headline) ? $headline : '';

		echo $form_open.$hidden_str;
		if (isset($order)) {
			foreach ($order as $field) {
				if ($field === 'email_field') {
					op_get_var_e($fields,'email_field');
				} else if ($field === 'name_field') {
					op_get_var_e($fields,'name_field');
				} else if (isset($extra_fields[$field])) {
					op_get_var_e($extra_fields, $field);
				}
			}
		} else {
			op_get_var_e($fields,'name_field');
			op_get_var_e($fields,'email_field');
			echo implode('',$extra_fields);
		}
		echo $submit_button;
		do_action('op_after_optin_submit_button');
	?>
	</form>
</div>
