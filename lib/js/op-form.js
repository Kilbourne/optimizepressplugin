/*----------------------------------------------------------------------------------------------

jQuery optimizepress form plugin:
    - prettify input[type="file"] elements
    - disable submit if input[type="file"] is empty

------------------------------------------------------------------------------------------------

@author       fffilo
@link         -
@github       -
@version      1.0.0
@license      -

----------------------------------------------------------------------------------------------*/

;(function($) {

    // load only once
    if ( !! $.fn.opForm) {
        return;
    }

    /**
     * Default values
     * @type {Object}
     */
    var _default = {};

    /**
     * Class name
     * @type {String}
     */
    var _class = 'op-form';

    /**
     * Constructor
     * @param  {Object} options (see _default object)
     * @return {Void}
     */
    var _init = function(options) {
        if ( ! $(this).is('form')) {
            return;
        }

        var data     = {};
        data.options = $.extend({}, _default, options);
        data.submit  = $(this).find('input[type="submit"],button[type="submit"]');
        data.file    = $(this).find('input[type="file"]');

        $(this)
            //.removeClass(_class)
            //.addClass(_class)
            .unbind('submit.' + _class)
            .on('submit.' + _class, _submit)
            .data(_class, data);

        $(data.file)
            .inputFilePrettify()
            .on('change', _change)
            .trigger('change');
    }

    /**
     * On input file change event
     * @param  {Object} event
     * @return {Void}
     */
    var _change = function(event) {
        var data  = $(this).closest('form').data(_class);

        if (data && data.submit) {
            $(data.submit)
                .removeAttr('disabled');
            if ($(this).get(0).files.length == 0) {
                $(data.submit)
                    .attr('disabled', 'disabled');
            }
        }
    }

    /**
     * On form submit event
     * @param  {Object} event
     * @return {Void}
     */
    var _submit = function(event) {
        var data  = $(this).data(_class);

        if (data && data.file) {
            if ($(data.file).get(0).files.length == 0) {
                return false;
            }
        }
    }

    /**
     * jQery opForm addon
     * @return {Object} jQuery collection
     */
    $.fn.opForm = function(options) {
        return $.each(this, function() {
            _init.call(this, options);
        });
    }

}(opjq));
