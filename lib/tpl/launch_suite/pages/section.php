	<div class="op-bsw-grey-panel section-<?php echo $page_type ?>">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php echo $title ?></a></h3>
			<?php $help_vid = op_help_vid(array('launch_suite','pages',$page_type),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
			</div>
		</div>
        <?php echo $content; ?>
    </div>