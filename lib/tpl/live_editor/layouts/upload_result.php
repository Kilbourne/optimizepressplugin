<?php echo op_tpl('admin_header'); ?>
<?php
    foreach ($content as $value) {
        $class = $value['success'] == $value['html'] ? 'Success' : 'Error';
?>

<div class="op-notify <?php echo strtolower($class); ?>">
	<img alt="<?php echo $class; ?>" src="<?php echo OP_IMG; ?>notify-<?php echo strtolower($class); ?>.png">
	<span>
		<strong><?php echo htmlspecialchars($value['package']); ?></strong>
		<?php echo $value['html']; ?>
	</span>
	<div class="op-notify-close"></div>
</div>
<?php
    }
?>
<script>
	opjq('body').on('click','.op-notify',function(e){
		if(!opjq(e.target).is('a')){
			opjq(this).fadeTo(undefined, 0, undefined).slideUp(undefined, undefined, function(){
				opjq(e.target).closest('.op-notify').remove();
				if(opjq('.op-notify').length==0) window.location.href=window.location.href;
			});
			e.preventDefault();
		}
	});
</script>
<?php echo op_tpl('admin_footer') ?>
