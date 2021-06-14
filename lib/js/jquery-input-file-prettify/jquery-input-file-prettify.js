/*----------------------------------------------------------------------------------------------

jQuery addon:
Prettify/uglify input[type="file"] elements.

------------------------------------------------------------------------------------------------

@author       fffilo
@link         -
@github       -
@version      1.0.0
@license      -

----------------------------------------------------------------------------------------------*/

;(function($) {

	// load only once
	if ( !! $.fn.inputFileUglify && !! $.fn.inputFileUglify) {
		return;
	}

	/**
	 * Default values
	 * @type {Object}
	 */
	var _default = {
		labelLink     : true,
		textButton    : 'Browse...',
		textNoFiles   : 'No files selected.',
		textMoreFiles : '{count} files selected.'
	}

	/**
	 * Class name
	 * @type {String}
	 */
	var _class = 'jquery-input-file-prettify';

	/**
	 * Constructor
	 * @param  {Object} options (see _default object)
	 * @return {Void}
	 */
	var _pretty = function(options) {
		if ($(this).data(_class)) {
			return;
		}
		if ( ! $(this).is('input[type="file"]')) {
			return;
		}

		var data = {};
		data.options = $.extend({}, _default, options);

		$(this)
			.data(_class, data);

		_wrap.call(this, options);
	}

	/**
	 * Destructor
	 * @return {Void}
	 */
	var _ugly = function() {
		var data = $(this).data(_class);
		if ( ! data) {
			return;
		}

		$(data.button).removeData(_class).unbind().remove();
		$(data.label).removeData(_class).unbind().remove();
		$(data.span).removeData(_class).remove();
		$(this).removeData(_class).unwrap();
	}

	/**
	 * Wrap element and create button/label
	 * @return {Void}
	 */
	var _wrap = function() {
		var data = $(this).data(_class);

		$(this)
			.wrap('<div />');
		data.wrapper = $(this).parent()
			.attr('class', _class)
			.data(_class, this);
		data.button = $('<a />')
			.attr('href', '#')
			.html(data.options.textButton)
			.on('click', _click)
			.on('mouseenter', _mouseenter)
			.on('mouseleave', _mouseleave)
			.data(_class, this)
			.appendTo(data.wrapper);
		data.span = $('<span />')
			.css('left', data.button.outerWidth(true) + 'px')
			.data(_class, this)
			.appendTo(data.wrapper);
		data.label = $('<label />')
			.html(data.options.textNoFiles)
			.data(_class, this)
			.appendTo(data.span);

		if (data.options.labelLink) {
			$(data.wrapper)
				.addClass(_class + '-label-link');
			$(data.label)
				.on('mouseenter', _mouseenter)
				.on('mouseleave', _mouseleave)
				.on('click', function(event) {
					_click.call(this);
				});
		}

		$(this)
			.data(_class, data)
			.on('change', _change)
			.trigger('change');
	}

	/**
	 * Button click event
	 * @param  {Object}  event
	 * @return {Boolean}
	 */
	var _click = function(event) {
		$($(this).data(_class))
			.trigger('click');

		return false;
	}

	/**
	 * Input object change event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _change = function(event) {
		var data = $(this).data(_class);
		var count = $(this).get(0).files.length;
		var html = data.options.textNoFiles;
		if (count == 1) html = $(this).val().split('\\').pop();
		if (count  > 1) html = data.options.textMoreFiles.replace(/{count}/g, count);

		$(data.label).html(html);

		$(data.wrapper)
			.removeClass(_class + '-no-files')
			.addClass(count == 0 ? _class + '-no-files' : _class + '-temp')
			.removeClass(_class + '-temp')
	}

	/**
	 * Mouseenter event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _mouseenter = function(event) {
		$($(this).data(_class)).data(_class).wrapper
			.removeClass(_class + '-hover')
			.addClass(_class + '-hover');
	}

	/**
	 * Mouseleave event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _mouseleave = function(event) {
		$($(this).data(_class)).data(_class).wrapper
			.removeClass(_class + '-hover');
	}

	/**
	 * jQery input-file-prettify addon
	 * @param  {Object} options (see _default object)
	 * @return {Object}         jQuery collection
	 */
	$.fn.inputFilePrettify = function(options) {
		return $.each(this, function() {
			_pretty.call(this, options);
		});
	}

	/**
	 * jQery input-file-prettify addon remove
	 * @return {Object} jQuery collection
	 */
	$.fn.inputFileUglify = function() {
		return $.each(this, function() {
			_ugly.call(this);
		});
	}

}(opjq));
