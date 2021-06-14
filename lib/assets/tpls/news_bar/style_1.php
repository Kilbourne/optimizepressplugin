<style>
	#<?php echo $id; ?>.news-bar-style-1 strong{ background-color: <?php echo $color; ?>; }
	#<?php echo $id; ?>.news-bar-style-1 strong:after{ border-left: 1em solid <?php echo $color; ?>; }
	@media only screen and (max-width: 767px) {
		#<?php echo $id; ?>.news-bar-style-1 strong:after {
			border-top: 0.5em solid <?php echo $color; ?>;
			border-left: 1em solid transparent;
		}
		.narrow #<?php echo $id; ?>.news-bar-style-1 strong:after { border-top: 0.5em solid <?php echo $color; ?>; border-left: 1em solid transparent; }
	}
	
</style>
<div id="<?php echo $id; ?>" class="news-bar-style-1">
	<p><strong><?php echo urldecode($feature_text); ?></strong><span><?php echo urldecode($main_text); ?></p>
</div>