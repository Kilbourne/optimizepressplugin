<?php $conf = op_get_var($config,'page_setup') ?>
<div class="op-bsw-grey-panel op-bsw-grey-panel-no-content">
	<div class="op-bsw-grey-panel-header cf">
		<h3><?php _e('Open Sales Cart', 'optimizepress') ?></h3>
		<div class="op-bsw-panel-controls cf">
            <?php
            _op_on_off_switch_html('op[funnel_pages]'.$field_name.'[page_setup][open_sales_cart]'.$field_ext, 'op_funnel_pages_page_setup_open_sales_cart_'.$index, op_get_var($conf,'open_sales_cart','N'));
			?>
		</div>
	</div>
</div>
<div class="op-bsw-grey-panel op-bsw-grey-panel-no-content" id="hide_cart">
	<div class="op-bsw-grey-panel-header cf">
	<h3><?php _e('Hide Cart Link', 'optimizepress') ?></h3>
		<div class="op-bsw-panel-controls cf">
            <?php
            _op_on_off_switch_html('op[funnel_pages]'.$field_name.'[page_setup][hide_cart]'.$field_ext, 'op_funnel_pages_page_setup_hide_cart_'.$index, op_get_var($conf,'hide_cart','N'));
			?>
		</div>
	</div>
</div>
<label class="form-title"><?php _e('Sales Page / Offer Page', 'optimizepress') ?></label>
<p class="op-micro-copy"><?php _e('This page contains your launch content, video or training to add value as part of the launch process', 'optimizepress') ?></p>
<select name="op[funnel_pages]<?php echo $field_name ?>[page_setup][sales_page]<?php echo $field_ext ?>" class="value_page">
<?php echo $sales_select ?>
</select>
<?php //echo $add_page_link ?>

<label class="form-title"><?php _e('Page URL', 'optimizepress') ?></label>
<p class="op-micro-copy"><?php _e('If the cart is open this will display the cart page, otherwise will show the most recent funnel stage', 'optimizepress') ?></p>
<input type="text" name="op[funnel_pages]<?php echo $field_name ?>[page_setup][page_url]<?php echo $field_ext ?>" class="value_page_url" />
<div class="gateway_on">
    <label class="form-title"><?php _e('Early Bird Access URL', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Use this link to give your visitors access to your sales page even if the sales cart is set to closed.', 'optimizepress') ?></p>
    <input type="text" name="op[funnel_pages]<?php echo $field_name ?>[page_setup][page_access_url]<?php echo $field_ext ?>" class="value_page_access_url" />
</div>