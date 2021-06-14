<?php
if (!empty($color)){
	?>
	<style>
		#<?php echo $id; ?>.step-graphic-style-<?php echo $style; ?> li {
			background-color: rgba(<?php echo $rgb[0]; ?>, <?php echo $rgb[1]; ?>, <?php echo $rgb[2]; ?>, 1); ?>;
		}
		#<?php echo $id; ?>.step-graphic-style-<?php echo $style; ?> li:nth-child(2n) {
			background-color: rgba(<?php echo $rgb[0]; ?>, <?php echo $rgb[1]; ?>, <?php echo $rgb[2]; ?>, 0.75); ?>;
		}
	</style>
	<?php
}
?>

<ul id="<?php echo $id; ?>" class="step-graphic-style-<?php echo $style; ?>">
	<?php
	foreach($steps as $step){
		?>
		<li>
			<?php echo (!empty($step['text']) ? '<span class="step-graphic-style-1-number-container"><span class="step-graphic-style-1-number">'.$step['text'].'</span></span>' : ''); ?>
			<div>
				<p class="heading"><?php echo strip_tags($step['headline']); ?></p>
				<p><?php echo strip_tags($step['information'],'<br>'); ?></p>
			</div>
		</li>
		<?php
	}
	?>
</ul>