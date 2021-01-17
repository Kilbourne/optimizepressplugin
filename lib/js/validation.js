opjq(document).ready(function ($) {

    var $forms = $('form.op-optin-validation');
    var $currentSubmitForm;
    OptimizePress._validationDeferreds = OptimizePress._validationDeferreds || [];

    /**
     * Validates the form
     * (in most cases not useful, since form is already validated by browser)
     */
    function submitValidation(deferred) {
        var emailExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        /*
         * Validation
         */
        $forms.submit(function() {
            $currentSubmitForm = $(this);
            var returnValue = true;
            $.each($(this).find('input[required="required"]'), function(i, field) {
                if ($(field).attr('name').indexOf('email') > -1 && false === emailExp.test($(field).val())) {
                    alert(OPValidation.labels.email);
                    returnValue = false;
                } else if ($(field).val().length == 0) {
                    alert(OPValidation.labels.text);
                    returnValue = false;
                }
            });
            deferred.resolve(returnValue);
            return false;
        });
    }

    OptimizePress._validationDeferreds.push(submitValidation);

    /*
     * Record optin stat for InfusionSoft
     */
     function submitOptinStat(deferred) {
        $forms.submit(function() {
            var provider = $(this).find('input[name=provider]').val();

            if (typeof provider === 'undefined' || provider === 'infusionsoft') {
                op_show_loading();
                $.ajax({
                    url:    OPValidation.ajaxUrl,
                    type:   'POST',
                    data:   {
                        nonce:      OPValidation.nonce,
                        action:     'optimizepress_record_optin',
                        provider:   provider,

                    },
                    success: function(result) {
                        deferred.resolve(result);
                    }
                });
            } else {
                deferred.resolve(true);
            }
            return false;
        });
     }

     OptimizePress._validationDeferreds.push(submitOptinStat);

     /*
      * GDPR stuff - removing hidden fields if checked
      */
    function clearHiddenFields(deferred) {
        $forms.submit(function() {
            var provider = $(this).find('input[name=provider]').val();

            if (typeof provider !== 'undefined' && provider === 'infusionsoft') {
                $(this).find('.op-form-privacy-gdpr-consent-checkbox:checked').prev().remove();
            }

            deferred.resolve(true);
        });
    }

    OptimizePress._validationDeferreds.push(clearHiddenFields);

    /*
     * OPM integration submission
     */
    function submitOpm(deferred) {
        $forms.submit(function() {
            var provider    = $(this).find('input[name=provider]').val(),
                level       = $(this).find('input[name=opm_level]').val(),
                packages    = $(this).find('input[name=opm_packages]').val();

            if ((typeof provider === 'undefined' || provider === 'infusionsoft') && (typeof level !== 'undefined' || typeof packages !== 'undefined')) {
                op_show_loading();
                $.ajax({
                    type:   'POST',
                    url:    OPValidation.ajaxUrl,
                    data:   $(this).serialize() + '&action=optimizepress_add_to_opm&nonce=' + OPValidation.nonce,
                    success: function(result) {
                        deferred.resolve(result);
                    }
                });
            } else {
                deferred.resolve(true);
            }
            return false;
        });
    }

    OptimizePress._validationDeferreds.push(submitOpm);


    /*
     * GTW submission
     */
    function submitGtw(deferred) {
        $forms.submit(function() {
            var provider    = $(this).find('input[name=provider]').val(),
                gtw         = $(this).find('input[name=gotowebinar]').val(),
                email       = $(this).find('input[type=email]').val();

            if ((typeof provider === 'undefined' || provider === 'infusionsoft') && typeof gtw !== 'undefined') {
                /*
                 * We need to switch FORM action param, we couldn't set original URL because of legacy installations
                 */
                $(this).attr('action', $(this).find('input[name=redirect_url]').val());

                op_show_loading();
                $.ajax({
                    type:   'POST',
                    url:    OPValidation.ajaxUrl,
                    data:   $(this).serialize() + '&action=optimizepress_process_gtw&email=' + email + '&webinar=' + gtw + '&nonce=' + OPValidation.nonce,
                    success: function(result) {
                        deferred.resolve(result);
                    }
                });
            } else {
                deferred.resolve(true);
            }
            return false;
        });
    }

    OptimizePress._validationDeferreds.push(submitGtw);


    /**
     * We will submit the form after all deferreds are resolved
     * (to avoid sync ajax requests as it was the case up until now)
     */
    function setValidation() {
        var deferred = [];
        var i = 0;
        var validationDeferreds = OptimizePress._validationDeferreds;
        var validationDeferredsLength = validationDeferreds.length;

        for (i = 0; i < validationDeferredsLength; i += 1) {
            deferred[i] = $.Deferred();

            // If deferred is not properly set up, we will resolve it immediately
            if (typeof validationDeferreds[i] === 'function') {
                validationDeferreds[i](deferred[i]);
            } else {
                deferred[i].resolve(true);
            }
        }

        /**
         * If any deferred resolves as false, the form will not be submitted
         */
        $.when.apply($, deferred).done(function () {
            var returnValue = true;
            var j = 0;

            for (j = 0; j < arguments.length; j += 1) {
                if (arguments[j] === false) {
                    returnValue = false;
                } else if (typeof arguments[j] === 'function') {
                    /**
                     * In case action has to be triggered upon resolving,
                     * it can be done by returning the function by resolve
                     */
                    if (arguments[j]() === false) {
                        returnValue = false;
                    }
                }
            }

            $forms.off();

            // If this isn't wrapped in setTimeout, .submit happens
            // before the events are actually unbind in $forms.off()
            setTimeout(function () {

               if (returnValue) {

                    if (!$currentSubmitForm) {
                        $currentSubmitForm = $forms;
                    }

                    // If form contains an input field with name "submit", then .submit() won't work in JavaScript
                    if (typeof $currentSubmitForm[0].submit !== 'function') {
                        $currentSubmitForm.find(':submit').trigger('click');
                    } else {
                        $currentSubmitForm.submit();
                    }

                } else {
                    setValidation();
                    op_hide_loading();
                }

            }, 1);

        });

    }

    setValidation();

});