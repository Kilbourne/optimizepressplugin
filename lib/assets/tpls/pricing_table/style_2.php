<div class="pricing-table-style<?php echo $style; ?>">
	<div class="op-pricing-table pricing-table-<?php echo count($tabs); ?>col">
	<?php
		foreach($tabs as $tab){
			?>
			<div class="pt-border<?php echo ($tab['most_popular']=='Y' ? ' popular' : ''); ?>">
				<div class="price-table-col">
					<div class="price-table">
						<div class="name"><?php echo $tab['title']; ?></div>
						<div class="price"><span class="unit"><?php echo $tab['pricing_unit']; ?></span><?php echo $tab['price']; ?><?php echo (!empty($tab['pricing_variable']) ? '<span class="variable">'.$tab['pricing_variable'].'</span>' : ''); ?></div>
						<ul class="features"><?php echo $tab['items']; ?></ul>
						<a href="<?php echo $tab['order_button_url']; ?>" class="css-button"><?php echo $tab['order_button_text']; ?></a>
						<div class="description"><?php echo wpautop($tab['package_description']); ?></div>
					</div>
				</div>
			</div>
			<?php
		}
		@include('js.php');
	?>
	</div>
</div>