<div class="op-bsw-grey-panel op-bsw-grey-panel-no-content">
	<div class="op-bsw-grey-panel-header cf">
		<h3><?php _e('Publish This Stage', 'optimizepress') ?></h3>
		<div class="op-bsw-panel-controls cf">
            <?php
            _op_on_off_switch_html('op[funnel_pages]'.$field_name.'[publish_stage][publish]'.$field_ext, 'op_funnel_pages_publish_stage_publish_'.$index, op_get_var(op_get_var($config,'publish_stage',array()),'publish','N'),'op-disable-ibutton-load');
			?>
		</div>
	</div>
</div>
<p class="op-micro-copy"><?php _e('When this page is set to published the links in the funnel navigation will be live. When page is not published the inactive/coming soon thumbnail and link will be used.', 'optimizepress') ?>
<p class="op-micro-copy"><?php _e('In Perpetual/Evergreen mode you need to set a page to be published in order for it to appear in your funnel (the status will depend on the links you use to your pages)', 'optimizepress') ?>