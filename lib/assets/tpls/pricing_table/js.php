<script type="text/javascript">
(function ($) {
	function resizeWindow() {
		if ($(window).width() >= 767) {
			$(".container").each(function () {
				var e = 0;
				var $pricingTable = $(this).find('.op-pricing-table');
				var t = $(this).find(".price-table .features");
				if ($pricingTable.width() >= 767) {
					t.css({
						height: "auto"
					});
					t.each(function () {
						var t = $(this).height();
						if (t > e) e = t
					});
					t.height(e);
				}
			})
		}
	}
	$(document).ready(function () {
		$(window).on('resize', resizeWindow);
		$(window).on('load', resizeWindow);
		$(window).on('content-toggle', function () {
			setTimeout(function () {
				resizeWindow();
			}, 1);
		});

		var width = $('.element-container .border.style-<?php echo $style?>').parent().width();
		$('.element-container .border.style-<?php echo $style?>').parent().css({ textAlign: 'center' });
	})
}(opjq));
</script>