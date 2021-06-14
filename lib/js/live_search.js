/**
 * only included if live search element is present on the page!
 */
(function ($) {
	/**
	 * Configurable stuff
	 */

	//Timeout before ajax request is sent
	var inputTimeout = 400;

	//Speed of the search results box opening and closing animation
	var animateSpeed = 200;

	//Message that will be shown to the user if no results are found
	var noResultsFoundString = 'Sorry, no posts were found.';

	//URL for the ajax request. Defined in element
	//var ajaxUrl = OptimizePress.ajaxurl;

	//Helper variables
	var tempTimeout;
	var requestedVal = '';
	var heightInitialized = false;
	var searchResultsInitialized = false;

	/**
	 * Inject results container into the body
	 * @param  {number} index: element index
	 */
	var positionResultsContainers = function () {

		$('.op-live-search-form').each(function (index) {

			var $form = $(this);
			var $resultsContainer;

			if (!searchResultsInitialized) {
				$form.find('.op-live-search-input').attr('data-results-id', ('op-live-search-results-' + index));
				$resultsContainer = $('<ul class="op-live-search-results" id="op-live-search-results-' + index + '"></ul>').appendTo('body');
				searchResultsInitialized = true;
			} else {
				$resultsContainer = $('#' + $form.find('.op-live-search-input').attr('data-results-id'));
			}

			$resultsContainer.css({
				top: ($form.offset().top + $form.outerHeight()) + 'px',
				left: ($form.offset().left) + 'px',
				width: $form.width() + 'px'
			});

			if (heightInitialized) {
				$resultsContainer.css({ height: 'auto' });
			}

		});
	}

	/**
	 * This is executed when results are retrieved.
	 * @param  {String} result: string retrieved from the server
	 * @param  {jQuery Object} $element: an element of the input field (needed if there's more than one livesearch element on the page)
	 */
	var ajaxSuccess = function (result, $element) {

		//UL that holds the results
		//var $resultsContainer = $element.next();
		var $form = $element.parentsUntil('.op-live-search-form').parent();
		var $resultsContainer = $('body').find('#' + $element.attr('data-results-id'));

		//Result minus whitespace
		var result = $.trim(result);

		//Helper variables
		var tempHeight;
		var currentHeight;

		//If no results are found, show a message.
		if (result === '') {
			result = '<li class="op-live-search-results-item op-live-search-results-item--empty">' + noResultsFoundString + '</li>';
		}

		$resultsContainer.html(result);

		//We animate the result field only upon first opening.
		if (!heightInitialized) {
			initializeResultsHeight($resultsContainer);
		} else {
			//We don't want to animate results after they've already been shown.
			$resultsContainer.css({ height: 'auto' });
		}
	}

	var initializeResultsHeight = function ($resultsContainer) {

		if (!heightInitialized) {

			positionResultsContainers();

			//Show the results
			$resultsContainer.addClass('op-live-search-results--shown');

			//Get the current results element height (should be zero at this point)
			currentHeight = $resultsContainer.height();

			//Get the height of the results element after we inject the actual results
			tempHeight = $resultsContainer.css({ height: 'auto' }).height();

			//Animate the results container
			$resultsContainer.css({ height: currentHeight });
			$resultsContainer.animate({ height: tempHeight }, animateSpeed);

			//Not to self that the container was actually initialized
			heightInitialized = true;
		}

	}

	/**
	 * This function is called everytime the key is pressed (after inputTimeout time has passed)
	 * @param {String} search: search string
	 * @param {jQuery Object} $element: an element of the input field (needed if there's more than one livesearch element on the page)
	 */
	var updateLiveSearch = function (search, $element) {

		//Cache the search and get rid of the whitespace
		var search = $.trim(search);

		//If search value hasn't changed, we don't want to fire an ajax request.
		if (!search || requestedVal === search) {
			return false;
		}

		//Store the last search query to prevent additional ajax requests if the search string doesn't change.
		requestedVal = search;

		// preparing data
		var data = {
			'action': 'optimizepress-live-search',
			'all_pages': $element.parent().find('.op_live_search_all_pages').val(),
			'product': $element.parent().find('.op_live_search_product').val(),
			'category': $element.parent().find('.op_live_search_category').val(),
			'subcategory': $element.parent().find('.op_live_search_subcategory').val(),
			'searchTerm': $element.val()
		};

		//An actual ajax request
		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: data,
			cache: false
		}).done(function (result) {
			ajaxSuccess(result, $element);
		});

	};

	var closeLiveSearchWidget = function () {
		$('.op-live-search-results').animate({ height: 0 }, animateSpeed).removeClass('op-live-search-results--shown');
		$('.op-live-search-results-item--focused').removeClass('op-live-search-results-item--focused');
		heightInitialized = false;
	};

	positionResultsContainers();

	$('.op-live-search-input').off();
	$('.op-live-search-input').each(function (index, element) {

		var $element = $(element);
		var $focusedItem;
		var $resultsContainer = $('#' + $element.attr('data-results-id'));

		$(this).on('blur', function (e) {
			setTimeout(function () {
				closeLiveSearchWidget();
			}, 100);
			positionResultsContainers();
		});

		$(this).on('keyup', function (e) {
			var $this = $(this);

			//We wait [inputTimeout] of time before triggering an request
			clearTimeout(tempTimeout);
			tempTimeout = setTimeout(function () {
				updateLiveSearch($this.val(), $this);
			}, inputTimeout);
		});

		$(this).on('keydown', function (e) {
			var $this = $(this);

			switch (e.keyCode) {

				//If down arrow was pressed
				case 40:
					initializeResultsHeight($resultsContainer);
					$focusedItem = $resultsContainer.find('.op-live-search-results-item--focused').removeClass('op-live-search-results-item--focused');
					$focusItem = $focusedItem.next();
					$focusItem = $focusItem.length > 0 ? $focusItem : $resultsContainer.find('.op-live-search-results-item').eq(0);
					$focusItem.addClass('op-live-search-results-item--focused');
					e.stopPropagation();
					e.preventDefault();
					break;

				//If up arrow was pressed
				case 38:
					initializeResultsHeight($resultsContainer);
					$focusedItem = $resultsContainer.find('.op-live-search-results-item--focused').removeClass('op-live-search-results-item--focused');
					$focusItem = $focusedItem.prev();
					$focusItem = $focusItem.length > 0 ? $focusItem : $resultsContainer.find('.op-live-search-results-item:last-child');
					$focusItem.addClass('op-live-search-results-item--focused');
					e.stopPropagation();
					e.preventDefault();
					break;

				//If escape key was pressed
				case 27:
					closeLiveSearchWidget();
					e.stopPropagation();
					e.preventDefault();
					break;

				//If enter key was pressed
				case 13:
					$focusedItem = $resultsContainer.find('.op-live-search-results-item--focused');

					if ($focusedItem.length && $focusedItem.find('a').length) {
						window.location = $focusedItem.find('a').attr('href');
					} else {
						$this.parent().parent().submit();
					}
					e.stopPropagation();
					e.preventDefault();
					break;

			}
		});

		$resultsContainer.on('hover', '.op-live-search-results-item', function () {
			$(this).parent().find('.op-live-search-results-item--focused').removeClass('op-live-search-results-item--focused');
			$(this).addClass('op-live-search-results-item--focused');
		});

	});

	//If user clicks outside of the active livesearch input
	$('body').on('click', function (e) {

		if (!$(e.target).hasClass('op-live-search-input') || !$('#' + $(e.target).attr('data-results-id')).hasClass('op-live-search-results--shown')) {
			closeLiveSearchWidget();
		}

		if (!$('#' + $(e.target).attr('data-results-id')).hasClass('op-live-search-results--shown') && $.trim($(e.target).val()) !== '') {
			initializeResultsHeight($('#' + $(e.target).attr('data-results-id')));
		}

	});

	$(window).on('resize', positionResultsContainers);

}(opjq));