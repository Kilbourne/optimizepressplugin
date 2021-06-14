<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    
    <?php foreach ($compat as $key => $data) : ?>
    <div class="compat-check status-<?php echo $data['status']; ?> compat-<?php echo $key; ?>"><?php echo $data['message']; ?></div>
	<?php endforeach; ?>

    <div class="clear"></div>
</div>