(function ($) {

		// Create an empty jQuery element set. We'll add filtered elements into it.
		// For some reason using directly filtered element causes errors in fancybox.
		var $collection = $();

		$('a').filter(function() {

			var href = $(this).attr('href');

			if (href && href !== '') {
				if (!!href.toLowerCase().match(/\.jpe?g|\.png|\.gif|\.bmp$/i)) {
					$collection = $collection.add($(this));
				}
				return false;
			}
			return false;
		});

		if ($collection.length > 0) {
			$collection.fancybox();
		}

}(opjq));